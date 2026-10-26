// lib/push.js —— 双远端推送（GitHub + Gitee）
//
// 【全局约定】推送用的令牌一律走 lib/token-source.js：
//   环境变量 → 任务日记「关于」令牌库 → config/tokens.json。
// 不要在命令里硬编码令牌，也不要用 git remote URL 里残留的旧令牌。
//
// 用法：
//   node lib/push.js              # 推 main 到 GitHub + Gitee
//   node lib/push.js --dry        # 只打印将要做什么，不实际推送
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
  },
  {
    name: 'gitee',
    slot: 'gitee',
    user: 'wasen',
    host: 'gitee.com',
    repo: 'wasen/ai-tools-intel',
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

function main() {
  const dry = process.argv.includes('--dry');
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

    try {
      // 用 URL 直接推，避免把令牌写进 .git/config
      // 不用 --force：宁可推送失败让人看见，也不要静默覆盖远端历史
      const out = git(['push', url, `${branch}:${branch}`], {
        stdio: ['ignore', 'pipe', 'pipe'],
        timeout: 120000,
      });
      console.log(`    ✅ 推送成功`);
      results.push({ remote: r.name, ok: true });
      if (out.trim()) console.log('    ' + out.trim().split('\n').slice(-2).join('\n    '));
    } catch (e) {
      const msg = String(e.stderr || e.message || '').split('\n').filter(Boolean).slice(-3).join(' | ');
      console.log(`    ❌ 推送失败: ${msg}`);
      results.push({ remote: r.name, ok: false, reason: msg });
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
  return okCount === REMOTES.length ? 0 : 1;
}

module.exports = { main, REMOTES };

if (require.main === module) {
  process.exit(main());
}
