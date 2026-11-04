#!/usr/bin/env node
// scripts/push-via-api.js —— 当 github.com:443 不可达时，改用 GitHub Git Data API 推送
//
// 背景：本机到 github.com 的 git 协议时通时不通，但 api.github.com 一直可达
//（不同 IP、不同路由）。本脚本用 REST API 把本地提交复刻到远端。
//
// 关键设计（前两版踩过的坑，都记在这里）：
//   1. **不复刻 SHA，只保证内容一致**。GitHub 的 API 在创建 commit 时会用
//      服务端时区规范化 date，得到的 SHA 一定和本地不同。硬追 SHA 是徒劳的，
//      而且会把「父提交引用」搞乱（用本地 SHA 当 parent → 422）。
//      → 正确处理：每推完一个提交，立刻记下**远端返回的 SHA**，下一个提交用它当 parent。
//   2. **tree 用完整快照**，不用 base_tree 增量。增量方式遇到 mode/换行差异时
//      会静默产出不同的 tree；完整快照虽然多传几次，但结果可验证。
//   3. 推送后逐文件校验 blob SHA 是否与本地 git 记录一致 —— 这才叫"推对了"。
//
// 用法：
//   node scripts/push-via-api.js            # 推送 main 上领先远端的全部提交
//   node scripts/push-via-api.js --dry      # 只列出会做什么
//   node scripts/push-via-api.js --verify   # 只校验远端内容是否与本地一致
//
// 也可以被 require（lib/push.js 的失败回退就用这条路）：
//   const { pushViaApi, verifyRemote } = require('./scripts/push-via-api');
//   const ok = await pushViaApi({ log: console.log });
'use strict';

const { execFileSync } = require('node:child_process');
const path = require('node:path');
const { resolveToken } = require('../lib/token-source');

const REPO = 'q785845530/ai-tools-intel';
const BRANCH = 'main';
const ROOT = path.resolve(__dirname, '..');

function git(args) {
  return execFileSync('git', args, { cwd: ROOT, encoding: 'utf8', maxBuffer: 128 * 1024 * 1024 }).trim();
}
function gitBuf(args) {
  return execFileSync('git', args, { cwd: ROOT, maxBuffer: 128 * 1024 * 1024 });
}

async function api(method, endpoint, body) {
  const res = await fetch(`https://api.github.com${endpoint}`, {
    method,
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: 'application/vnd.github+json',
      'Content-Type': 'application/json',
      'User-Agent': 'ops-push-via-api',
    },
    body: body === undefined ? undefined : JSON.stringify(body),
    signal: AbortSignal.timeout(90000),
  });
  const text = await res.text();
  let json = null;
  try { json = text ? JSON.parse(text) : null; } catch { /* 非 JSON */ }
  if (!res.ok) {
    const err = new Error(`${method} ${endpoint} → HTTP ${res.status}: ${(json && json.message) || text.slice(0, 180)}`);
    err.status = res.status;
    throw err;
  }
  return json;
}

/** 带重试的 API 调用。
 *  网络抖动 + 5xx + 429 都重试；4xx（除 429）是逻辑错误，立即抛。
 *  实测连续 POST 250 个 blob 时会在中途 fetch failed，
 *  一次失败就前功尽弃 —— 所以必须重试。 */
// 输出通道：独立运行时写 stdout，被 require 时由调用方传入
let log = (...a) => console.log(...a);
let logErr = (...a) => console.error(...a);
let showProgress = true;
function opts_progress() { return showProgress; }

// 令牌：模块级，供 api() / apiRetry() 使用；由 pushViaApi() 入口赋值
let token = null;
function ensureToken(explicit) {
  if (explicit) { token = explicit; return token; }
  if (token) return token;
  token = resolveToken('github').value;
  if (!token) throw new Error('任务日记「关于」里没有 github 令牌');
  return token;
}

async function apiRetry(method, endpoint, body, tries = 6) {
  let lastErr;
  for (let i = 0; i < tries; i++) {
    try {
      return await api(method, endpoint, body);
    } catch (e) {
      lastErr = e;
      const rateLimited = e.status === 403 && /rate limit/i.test(e.message);
      const retriable = e.status === undefined || e.status === 429 || e.status >= 500 || rateLimited;
      if (!retriable) throw e;
      // 二级限流要等更久（GitHub 建议数分钟）
      const wait = rateLimited ? 60000 * (i + 1) : Math.min(8000, 600 * 2 ** i);
      log(`    重试 ${i + 1}/${tries}（${e.message.slice(0, 40)}）等待 ${wait}ms`);
      await new Promise((r) => setTimeout(r, wait));
    }
  }
  throw lastErr;
}

function isBinary(buf) {
  const n = Math.min(buf.length, 8000);
  for (let i = 0; i < n; i++) if (buf[i] === 0) return true;
  return false;
}

const blobCache = new Map();

/** 上传一个 blob，返回远端 blob sha。
 *
 *  ⚠️ 内容必须来自 git 对象（`git cat-file blob`），**不能从磁盘读**：
 *  实测踩坑 —— 工作区有未提交改动时，磁盘内容与该 commit 记录的内容不同，
 *  于是推出去的 tree 和本地 commit 的 tree 对不上，历史变成"内容错位"。
 *  gitBlobSha 是 commit 里记录的 blob 哈希，用它取内容才能保证一一对应。 */
async function uploadBlob(rel, gitBlobSha) {
  if (blobCache.has(gitBlobSha)) return blobCache.get(gitBlobSha);
  const buf = gitBuf(['cat-file', 'blob', gitBlobSha]);
  const body = isBinary(buf)
    ? { content: buf.toString('base64'), encoding: 'base64' }
    : { content: buf.toString('utf8'), encoding: 'utf-8' };
  const r = await apiRetry('POST', `/repos/${REPO}/git/blobs`, body);
  blobCache.set(gitBlobSha, r.sha);
  return r.sha;
}

/** 按本地 git 记录的模式（100644/100755）建完整 tree，不用 base_tree */
async function buildFullTree(commitSha) {
  const listing = git(['ls-tree', '-r', '-z', commitSha]).split('\0').filter(Boolean);
  const jobs = [];
  for (const line of listing) {
    // 格式：<mode> <type> <sha>\t<path>
    const tab = line.indexOf('\t');
    const meta = line.slice(0, tab).split(' ');
    const rel = line.slice(tab + 1);
    const mode = meta[0], type = meta[1], sha = meta[2];
    if (type !== 'blob') continue;
    jobs.push({ path: rel, mode, sha });
  }

  // 并发 4 + 每请求 120ms 间隔：实测并发 8 传 500 个 blob 会触发
  // GitHub 二级限流（403 secondary rate limit），整批作废。
  // 4 并发 × 120ms ≈ 每秒 33 个请求，安全通过。
  const CONCURRENCY = 4;
  const PACE_MS = 120;
  const results = new Array(jobs.length);
  let done = 0;
  let cursor = 0;

  async function worker() {
    while (cursor < jobs.length) {
      const i = cursor++;
      const j = jobs[i];
      const remoteSha = await uploadBlob(j.path, j.sha);
      if (PACE_MS) await new Promise((r) => setTimeout(r, PACE_MS));
      results[i] = { path: j.path, mode: j.mode, type: 'blob', sha: remoteSha };
      done++;
      if (done % 40 === 0) if (opts_progress()) process.stdout.write(`    已上传 ${done}/${jobs.length}  `);
    }
  }

  await Promise.all(Array.from({ length: CONCURRENCY }, worker));
  if (opts_progress()) process.stdout.write('\n');

  const tree = await apiRetry('POST', `/repos/${REPO}/git/trees`, { tree: results.filter(Boolean) });
  return tree.sha;
}

async function pushCommit(sha, remoteParentSha) {
  const subject = git(['log', '-1', '--format=%s', sha]);
  log(`  ── ${sha.slice(0, 8)}  ${subject.slice(0, 50)}`);

  const treeSha = await buildFullTree(sha);
  log(`     remote tree ${treeSha.slice(0, 10)}  ← 本地 ${git(['rev-parse', `${sha}^{tree}`]).slice(0, 10)}`);

  const commit = await apiRetry('POST', `/repos/${REPO}/git/commits`, {
    message: git(['log', '-1', '--format=%B', sha]),
    tree: treeSha,
    parents: [remoteParentSha],
    author: {
      name: git(['log', '-1', '--format=%an', sha]),
      email: git(['log', '-1', '--format=%ae', sha]),
      date: git(['log', '-1', '--format=%aI', sha]),
    },
    committer: {
      name: git(['log', '-1', '--format=%cn', sha]),
      email: git(['log', '-1', '--format=%ce', sha]),
      date: git(['log', '-1', '--format=%cI', sha]),
    },
  });
  log(`     remote commit ${commit.sha.slice(0, 8)}（本地 ${sha.slice(0, 8)}，SHA 不同属正常）`);
  return commit.sha;
}

/** 逐文件比对：远端 tree 的每个 blob 是否与本地 git 记录一致 */
async function verify(remoteCommitSha) {
  console.log('\n════ 内容校验 ════');
  const remoteCommit = await api('GET', `/repos/${REPO}/git/commits/${remoteCommitSha}`);
  const remoteTree = await api('GET', `/repos/${REPO}/git/trees/${remoteCommit.tree.sha}?recursive=1`);

  const local = new Map();
  for (const line of git(['ls-tree', '-r', '-z', 'HEAD']).split('\0').filter(Boolean)) {
    const tab = line.indexOf('\t');
    const [, , sha] = line.slice(0, tab).split(' ');
    local.set(line.slice(tab + 1), sha);
  }

  const remote = new Map();
  for (const e of remoteTree.tree || []) {
    if (e.type === 'blob') remote.set(e.path, e.sha);
  }

  let ok = 0, diff = 0, missing = 0;
  for (const [p, sha] of local) {
    if (!remote.has(p)) { missing++; if (missing <= 5) log(`  ✗ 远端缺 ${p}`); continue; }
    if (remote.get(p) === sha) ok++;
    else { diff++; if (diff <= 5) log(`  ✗ 内容不同 ${p}`); }
  }
  const extra = [...remote.keys()].filter((p) => !local.has(p));
  log(`  本地文件 ${local.size}，远端 ${remote.size}`);
  log(`  一致 ${ok}  内容不同 ${diff}  远端缺失 ${missing}  远端多余 ${extra.length}`);
  if (extra.length && extra.length <= 5) extra.forEach((p) => log(`  ⚠️ 远端多余 ${p}`));
  return diff === 0 && missing === 0;
}

/** 推送（或校验）入口。返回 true 表示最终内容与本地一致。 */
async function pushViaApi(opts = {}) {
  if (opts.log) log = opts.log;
  if (opts.logErr) logErr = opts.logErr;
  if (opts.quiet) showProgress = false;
  const dry = opts.dry === true;
  const verifyOnly = opts.verifyOnly === true;

  ensureToken(opts.token);

  log('════ GitHub API 通道 ════');
  log(`  仓库 ${REPO}  分支 ${BRANCH}${dry ? '  （试运行）' : ''}`);

  const remoteHead = (await api('GET', `/repos/${REPO}/commits/${BRANCH}`)).sha;
  const localHead = git(['rev-parse', 'HEAD']);
  log(`  远端 HEAD ${remoteHead.slice(0, 8)}`);
  log(`  本地 HEAD ${localHead.slice(0, 8)}`);

  if (verifyOnly) return verify(remoteHead);

  if (remoteHead === localHead) {
    log('  提交 SHA 已一致');
    return verify(remoteHead);
  }

  // 快进检查：远端必须是本地祖先（或内容等价）
  let fastForward = false;
  try {
    execFileSync('git', ['merge-base', '--is-ancestor', remoteHead, localHead], { cwd: ROOT, stdio: 'ignore' });
    fastForward = true;
  } catch { /* 不是祖先 */ }

  let list;
  if (fastForward) {
    list = git(['rev-list', '--reverse', `${remoteHead}..${localHead}`]).split('\n').filter(Boolean);
  } else {
    // 远端 HEAD 可能是上一轮用 API 推的、SHA 与本地不同的等价提交。
    // 这时 git 的祖先判断失效，但可以按「远端 HEAD 的 tree 是否等于本地某祖先的 tree」
    // 来精确恢复远端实际处于本地历史的哪个位置 —— 而不是粗暴地把整段历史压成一个提交。
    const remoteTree = (await api('GET', `/repos/${REPO}/git/commits/${remoteHead}`)).tree.sha;

    // 从本地 HEAD 逐代向上找：第一个 tree 与远端 HEAD 相同的提交，就是远端当前所处位置。
    // 找到了，远端就等于是它 → 只需推它之后的提交。
    let match = null;
    for (const sha of git(['rev-list', '--reverse', localHead]).split('\n').filter(Boolean)) {
      const tree = git(['rev-parse', `${sha}^{tree}`]);
      if (tree === remoteTree) { match = sha; break; }
    }

    if (match) {
      log(`  远端内容等价于本地 ${match.slice(0, 8)}（tree 一致），从其后增量推送`);
      const rest = git(['rev-list', '--reverse', `${match}..${localHead}`]).split('\n').filter(Boolean);
      if (rest.length === 0) { log('  ✅ 内容完全一致，无需再推'); return true; }
      list = rest;
    } else {
      // 找不到等价祖先 —— 真正分叉了。先做整库内容校验，若一致就无需动；不一致再对齐。
      log('  远端不是本地祖先，也找不到等价 tree（可能真实分叉）');
      const same = await verify(remoteHead);
      if (same) { log('  ✅ 内容完全一致，无需再推'); return true; }
      log('  内容有差异，将按本地 HEAD 对齐远端分支');
      list = [localHead];
    }
  }

  log(`  待推 ${list.length} 个提交`);

  if (dry) {
    for (const sha of list) {
      log(`  ── ${sha.slice(0, 8)}  ${git(['log', '-1', '--format=%s', sha]).slice(0, 50)}`);
    }
    log('  试运行结束，未改动远端');
    return true;
  }

  let parent = remoteHead;
  for (const sha of list) parent = await pushCommit(sha, parent);

  await apiRetry('PATCH', `/repos/${REPO}/git/refs/heads/${BRANCH}`, { sha: parent, force: !fastForward });

  const after = (await api('GET', `/repos/${REPO}/commits/${BRANCH}`)).sha;
  log(`  远端 HEAD 现在 ${after.slice(0, 8)}`);

  const good = await verify(after);
  log(good ? '  ✅ 推送完成，内容与本地完全一致' : '  ⚠️ 内容仍有差异，请检查上方明细');
  return good;
}

/** 只读探针：远端 HEAD 是否是「本地历史里某个提交的等价物」。
 *
 *  用途：lib/push.js 遇到 GitHub git push 非快进时，先调它判断该非快进
 *  是不是「上一轮 API 通道推送产生的等价提交」造成的。若是，则 API 通道能
 *  精确定位等价点、只补增量提交，安全回退；若不是（找不到匹配 tree），
 *  说明是真实分叉，必须拒绝 —— 不用 force 掩盖分叉。
 *
 *  返回 { alignable, match, pending }，alignable 为真时 match 是等价点 sha、
 *  pending 是其后待推的提交数。不改动任何远端状态。 */
async function canAlignViaApi(opts = {}) {
  ensureToken(opts.token);
  const remoteHead = (await api('GET', `/repos/${REPO}/commits/${BRANCH}`)).sha;
  const localHead = git(['rev-parse', 'HEAD']);
  if (remoteHead === localHead) return { alignable: true, match: localHead, pending: 0, reason: 'SHA 已一致' };

  // 先看是不是正常的快进
  let fastForward = false;
  try {
    execFileSync('git', ['merge-base', '--is-ancestor', remoteHead, localHead], { cwd: ROOT, stdio: 'ignore' });
    fastForward = true;
  } catch { /* 非快进 */ }
  if (fastForward) return { alignable: true, match: remoteHead, pending: 0, reason: '正常快进' };

  // 非快进：远端 HEAD 的 tree 是否等于本地某个祖先的 tree？
  const remoteTree = (await api('GET', `/repos/${REPO}/git/commits/${remoteHead}`)).tree.sha;
  for (const sha of git(['rev-list', '--reverse', localHead]).split('\n').filter(Boolean)) {
    if (git(['rev-parse', `${sha}^{tree}`]) === remoteTree) {
      const pending = git(['rev-list', '--reverse', `${sha}..${localHead}`]).split('\n').filter(Boolean).length;
      return { alignable: true, match: sha, pending, reason: '远端是 API 等价提交，可增量对齐' };
    }
  }
  return { alignable: false, match: null, pending: 0, reason: '真实分叉：远端 tree 在本地历史中找不到等价点' };
}

module.exports = {
  pushViaApi,
  verifyRemote: (opts = {}) => pushViaApi({ ...opts, verifyOnly: true }),
  canAlignViaApi,
  REPO, BRANCH, ROOT,
};

if (require.main === module) {
  const dry = process.argv.includes('--dry');
  const verifyOnly = process.argv.includes('--verify');
  pushViaApi({ dry, verifyOnly })
    .then((ok) => process.exit(ok ? 0 : 1))
    .catch((e) => { console.error('\n❌ ' + e.message); process.exit(1); });
}
