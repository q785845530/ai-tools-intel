// lib/cloud.js —— 本地驱动云端部署（冗余通道）
// 2026-11-04 更正：旧注释写「GitHub 对低活跃仓库的 schedule 会静默跳过」，
// 当时实测 4 个整点窗口 0 触发；但当前实测近 24h schedule 触发 11 次且全 success，
// 该结论已不成立。workflow 的 cron 现在才是主通道，本模块的 workflow_dispatch
// 降级为「本地跑完顺手触发一次」的可选冗余，不再声称是唯一可靠触发。
// 云端状态持久化见 docs/HOSTING-PLAN.md 与 lib/cloud-state.js。
// 安全：PAT 走 lib/token-source.js（任务日记「关于」令牌库），不落日志/代码/回显。
'use strict';
const audit = require('./audit');
const { getGitHubToken } = require('./config');

const REPO = 'q785845530/ai-tools-intel';

function readToken() {
  try {
    return getGitHubToken();
  } catch { return null; }
}

/** 触发云端 pages 构建；返回 {ok, ...}，任何失败都不抛出（云端只是镜像，不能拖垮本地） */
async function deployCloud() {
  const token = readToken();
  if (!token) {
    audit.log('warn', 'cloud', 'deploy.skipped', { reason: '未找到 GitHub token，跳过云端部署' });
    return { ok: false, skipped: 'NO_TOKEN' };
  }
  try {
    const res = await fetch(`https://api.github.com/repos/${REPO}/actions/workflows/pages.yml/dispatches`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}`, Accept: 'application/vnd.github+json' },
      body: JSON.stringify({ ref: 'main' }),
      signal: AbortSignal.timeout(20000),
    });
    if (res.status === 204) {
      audit.log('info', 'cloud', 'deploy.triggered', { repo: REPO, via: 'workflow_dispatch', by: 'local-cron' });
      return { ok: true };
    }
    const body = (await res.text()).slice(0, 150);
    audit.log('warn', 'cloud', 'deploy.fail', { http: res.status, body });
    return { ok: false, http: res.status };
  } catch (e) {
    audit.log('warn', 'cloud', 'deploy.error', { error: e.message });
    return { ok: false, error: e.message };
  }
}

module.exports = { deployCloud };

if (require.main === module) {
  deployCloud().then(r => { console.log(JSON.stringify(r)); process.exit(r.ok ? 0 : 1); });
}
