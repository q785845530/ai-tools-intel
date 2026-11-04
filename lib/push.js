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
 *  认证失败（401/403）、非快进（non-fast-forward）等，回退也解决不了，
 *  必须如实报错让人看见，不能拿 API 通道把问题盖住。 */
function isNetworkFailure(msg) {
  return /ETIMEDOUT|Failed to connect|unable to access|Connection (timed out|refused|reset)|Could not connect|Could not resolve|network is unreachable/i.test(String(msg));
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

    if (failMsg && r.apiFallback && !noFallback && isNetworkFailure(failMsg)) {
      console.log(`    ↻ 判定为网络层故障，切换到 GitHub API 通道…`);
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
      // 非网络故障，或该远端没有 API 通道，或显式禁用回退
      const why = !r.apiFallback ? '（该远端无 API 通道）'
        : noFallback ? '（--no-fallback）'
        : '（非网络故障，回退无意义）';
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

module.exports = { main, REMOTES, isNetworkFailure };

if (require.main === module) {
  main().then((code) => process.exit(code)).catch((e) => {
    console.error('❌ ' + e.message);
    process.exit(1);
  });
}

// push.js：GitHub git 协议失败时自动回退到 API 通道（已验证）

// 最终验证：lib/push.js 自动回退链路 ✅
