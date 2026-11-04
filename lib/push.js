// lib/push.js —— 双远端推送（GitHub + Gitee），GitHub 走 git 协议失败时自动切换到 API
//
// 【全局约定】推送用的令牌一律走 lib/token-source.js：
//   环境变量 → 任务日记「关于」令牌库 → config/tokens.json。
// 不要在命令里硬编码令牌，也不要用 git remote URL 里残留的旧令牌。
//
// 为什么要两条通道：
//   本机到 github.com:443 时通时不通（实测连续多次 133s 超时），
//   但 api.github.com 一直可达 —— 两者是不同 IP、不同路由。
//   git 协议挂了不该等于"推不上去"，所以失败后自动改走 Git Data API。
//
// 回退判定的两类触发（2026-11-04 修订）：
//   ① 网络层故障（ETIMEDOUT / Failed to connect…）→ 直接回退；
//   ② 非快进 → 先用只读探针 canAlignViaApi() 区分：
//        远端 HEAD 是本仓库上一轮 API 推的「等价提交」→ 可安全增量对齐，回退；
//        远端 tree 在本地历史里找不到等价点 → 真实分叉，拒绝回退（不 force 掩盖）。
//      之前只认 ①，导致每次 API 推完的下一次 git push 必然非快进却不会自动兜底，
//      仍需手动补推 —— 这条已修。
//
// 用法：
//   node lib/push.js              # 推 main 到 GitHub + Gitee（GitHub 失败自动回退 API）
//   node lib/push.js --dry        # 只打印将要做什么，不实际推送
//   node lib/push.js --no-fallback  # 禁用 API 回退，只看 git 协议结果
'use strict';

const { execFileSync } = require('node:child_process');
const path = require('node:path');
const { resolveToken } = require('./token-source');

const OPS_ROOT = path.resolve(__dirname, '..');

const REMOTES = [
  {
    name: 'origin',
    slot: 'github',
    user: 'q785845530',
    host: 'github.com',
    repo: 'q785845530/ai-tools-intel',
    // 这条远端有 API 备用通道
    apiFallback: true,
  },
  {
    name: 'gitee',
    slot: 'gitee',
    user: 'wasen',
    host: 'gitee.com',
    repo: 'wasen/ai-tools-intel',
    apiFallback: false,
  },
];

function git(args, opts = {}) {
  return execFileSync('git', args, { cwd: OPS_ROOT, encoding: 'utf8', ...opts });
}

/** 把令牌塞进 remote URL（只在该次命令的 URL 上用，不长期落盘明文） */
function authedUrl(r, token) {
  return `https://${r.user}:${encodeURIComponent(token)}@${r.host}/${r.repo}.git`;
}

function currentBranch() {
  try {
    return git(['rev-parse', '--abbrev-ref', 'HEAD']).trim();
  } catch {
    return 'main';
  }
}

/** 判断失败是否属于「网络层」——只有这类才值得回退到 API。
 *  认证失败（401/403）、真实分叉等，回退也解决不了，必须如实报错。 */
function isNetworkFailure(msg) {
  return /ETIMEDOUT|Failed to connect|unable to access|Connection (timed out|refused|reset)|Could not connect|Could not resolve|network is unreachable/i.test(String(msg));
}

/** 判断失败是否是「非快进」。这类失败有两种成因：
 *    a) 上一轮 API 通道推的等价提交导致远端 HEAD 的 SHA 与本地不同步 → API 可安全对齐
 *    b) 别人真的往远端推了东西 / 本地历史被改写 → 真实分叉，必须拒绝
 *  用 canAlignViaApi 探针区分两者，不能一概回退也不能一概拒绝。 */
function isNonFastForward(msg) {
  return /non-fast-forward|fetch first|一个仓库已向该引用进行了推送|rejected|Updates were rejected|先与远程变更合并/i.test(String(msg));
}

async function main() {
  const dry = process.argv.includes('--dry');
  const noFallback = process.argv.includes('--no-fallback');
  const branch = currentBranch();
  const results = [];

  console.log(`════ 双远端推送（分支 ${branch}）════`);

  for (const r of REMOTES) {
    const { value: token, source } = resolveToken(r.slot);
    if (!token) {
      console.log(`  ⚠️  ${r.name}（${r.slot}）无令牌，跳过。请在任务日记「关于」保存 ${r.slot} 令牌`);
      results.push({ remote: r.name, ok: false, reason: 'NO_TOKEN' });
      continue;
    }
    const url = authedUrl(r, token);
    console.log(`  → ${r.name}（令牌来源 ${source}，${token.slice(0, 4)}…${token.slice(-4)}）`);

    if (dry) {
      results.push({ remote: r.name, ok: true, dry: true });
      continue;
    }

    let failMsg = null;
    try {
      // 用 URL 直接推，避免把令牌写进 .git/config
      // 不用 --force：宁可推送失败让人看见，也不要静默覆盖远端历史
      const out = git(['push', url, `${branch}:${branch}`], {
        stdio: ['ignore', 'pipe', 'pipe'],
        timeout: 120000,
      });
      console.log(`    ✅ 推送成功（git 协议）`);
      results.push({ remote: r.name, ok: true, via: 'git' });
      if (out.trim()) console.log('    ' + out.trim().split('\n').slice(-2).join('\n    '));
    } catch (e) {
      failMsg = String(e.stderr || e.message || '').split('\n').filter(Boolean).slice(-3).join(' | ');
      console.log(`    ❌ git 协议失败: ${failMsg.slice(0, 120)}`);
    }

    // 决定要不要走 API 通道。两种情况：
    //   ① 网络层故障 → 直接回退（git 协议根本连不上，API 是备用路由）
    //   ② 非快进 → 先用只读探针确认「远端是不是 API 等价提交」，是才回退；
    //      真分叉一律拒绝，绝不用 force 掩盖别人的提交。
    let shouldFallback = false;
    let fallbackWhy = '';
    if (failMsg && r.apiFallback && !noFallback) {
      if (isNetworkFailure(failMsg)) {
        shouldFallback = true;
        fallbackWhy = '网络层故障';
      } else if (isNonFastForward(failMsg)) {
        try {
          const { canAlignViaApi } = require('../scripts/push-via-api');
          const probe = await canAlignViaApi({ token });
          if (probe.alignable) {
            shouldFallback = true;
            fallbackWhy = `非快进但${probe.reason}（待补 ${probe.pending} 个提交）`;
          } else {
            console.log(`    ⛔ 非快进且${probe.reason} —— 拒绝回退，避免覆盖远端`);
            results.push({ remote: r.name, ok: false, reason: 'NON_FAST_FORWARD_REAL_DIVERGENCE: ' + probe.reason });
            continue;
          }
        } catch (eP) {
          console.log(`    ⚠️ 对齐探针失败，保守起见不回退: ${eP.message.slice(0, 100)}`);
        }
      }
    }

    if (shouldFallback) {
      console.log(`    ↻ 判定为「${fallbackWhy}」，切换到 GitHub API 通道…`);
      try {
        const { pushViaApi } = require('../scripts/push-via-api');
        const ok = await pushViaApi({
          token,
          log: (...a) => console.log('      ' + a.join(' ')),
          quiet: true,
        });
        if (ok) {
          console.log(`    ✅ 推送成功（API 通道，内容与本地一致）`);
          results.push({ remote: r.name, ok: true, via: 'api' });
        } else {
          console.log(`    ⚠️ API 通道跑完但内容仍有差异`);
          results.push({ remote: r.name, ok: false, reason: 'API_CONTENT_MISMATCH', via: 'api' });
        }
      } catch (e2) {
        console.log(`    ❌ API 通道也失败: ${e2.message.slice(0, 140)}`);
        results.push({ remote: r.name, ok: false, reason: `git+api 均失败: ${failMsg.slice(0, 80)} / ${e2.message.slice(0, 80)}` });
      }
    } else if (failMsg) {
      // 认证失败等，或该远端没有 API 通道，或显式禁用回退
      const why = !r.apiFallback ? '（该远端无 API 通道）'
        : noFallback ? '（--no-fallback）'
        : '（认证/权限类失败，回退无意义）';
      console.log(`    未回退 ${why}`);
      results.push({ remote: r.name, ok: false, reason: failMsg });
    }
  }

  // 顺手把 remote URL 里的明文令牌清掉（改成无令牌 URL），保持 .git/config 干净
  if (!dry) {
    for (const r of REMOTES) {
      try {
        git(['remote', 'set-url', r.name, `https://${r.host}/${r.repo}.git`]);
      } catch { /* remote 不存在就忽略 */ }
    }
  }

  const okCount = results.filter((x) => x.ok).length;
  console.log(`\n  结论：${okCount}/${REMOTES.length} 个远端成功`);
  for (const x of results) {
    if (x.ok) console.log(`    ✅ ${x.remote}${x.via ? '（' + x.via + '）' : ''}`);
    else console.log(`    ❌ ${x.remote}: ${String(x.reason).slice(0, 100)}`);
  }
  return okCount === REMOTES.length ? 0 : 1;
}

module.exports = { main, REMOTES, isNetworkFailure, isNonFastForward };

if (require.main === module) {
  main().then((code) => process.exit(code)).catch((e) => {
    console.error('❌ ' + e.message);
    process.exit(1);
  });
}

// push.js：GitHub git 协议失败时自动回退到 API 通道（已验证）

// 最终验证：lib/push.js 自动回退链路 ✅

// 自动回退覆盖「API等价提交导致的非快进」场景（2026-11-04 验证）
