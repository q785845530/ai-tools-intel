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
'use strict';

const { execFileSync } = require('node:child_process');
const fs = require('node:fs');
const path = require('node:path');
const { resolveToken } = require('../lib/token-source');

const REPO = 'q785845530/ai-tools-intel';
const BRANCH = 'main';
const ROOT = path.resolve(__dirname, '..');

const dry = process.argv.includes('--dry');
const verifyOnly = process.argv.includes('--verify');
const token = resolveToken('github').value;
if (!token) { console.error('❌ 任务日记「关于」里没有 github 令牌'); process.exit(1); }

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
      process.stdout.write(`    重试 ${i + 1}/${tries}（${e.message.slice(0, 40)}）等待 ${wait}ms\r`);
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
      if (done % 40 === 0) process.stdout.write(`    已上传 ${done}/${jobs.length}  `);
    }
  }

  await Promise.all(Array.from({ length: CONCURRENCY }, worker));
  process.stdout.write(`\n`);

  const tree = await apiRetry('POST', `/repos/${REPO}/git/trees`, { tree: results.filter(Boolean) });
  return tree.sha;
}

async function pushCommit(sha, remoteParentSha) {
  const subject = git(['log', '-1', '--format=%s', sha]);
  console.log(`\n  ── ${sha.slice(0, 8)}  ${subject.slice(0, 50)}`);

  const treeSha = await buildFullTree(sha);
  console.log(`     remote tree ${treeSha.slice(0, 10)}  ← 本地 ${git(['rev-parse', `${sha}^{tree}`]).slice(0, 10)}`);

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
  console.log(`     remote commit ${commit.sha.slice(0, 8)}（本地 ${sha.slice(0, 8)}，SHA 不同属正常）`);
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
    if (!remote.has(p)) { missing++; if (missing <= 5) console.log(`  ✗ 远端缺 ${p}`); continue; }
    if (remote.get(p) === sha) ok++;
    else { diff++; if (diff <= 5) console.log(`  ✗ 内容不同 ${p}`); }
  }
  const extra = [...remote.keys()].filter((p) => !local.has(p));
  console.log(`  本地文件 ${local.size}，远端 ${remote.size}`);
  console.log(`  一致 ${ok}  内容不同 ${diff}  远端缺失 ${missing}  远端多余 ${extra.length}`);
  if (extra.length && extra.length <= 5) extra.forEach((p) => console.log(`  ⚠️ 远端多余 ${p}`));
  return diff === 0 && missing === 0;
}

(async () => {
  console.log('════ GitHub API 推送 ════');
  console.log(`  仓库 ${REPO}  分支 ${BRANCH}${dry ? '  （试运行）' : ''}`);

  const remoteHead = (await api('GET', `/repos/${REPO}/commits/${BRANCH}`)).sha;
  const localHead = git(['rev-parse', 'HEAD']);
  console.log(`  远端 HEAD ${remoteHead.slice(0, 8)}`);
  console.log(`  本地 HEAD ${localHead.slice(0, 8)}`);

  if (verifyOnly) {
    const good = await verify(remoteHead);
    process.exit(good ? 0 : 1);
  }

  if (remoteHead === localHead) {
    console.log('  提交 SHA 已一致');
    const good = await verify(remoteHead);
    process.exit(good ? 0 : 1);
  }

  // 快进检查：远端必须是本地祖先（或内容等价）
  let fastForward = false;
  try {
    execFileSync('git', ['merge-base', '--is-ancestor', remoteHead, localHead], { cwd: ROOT });
    fastForward = true;
  } catch { /* 不是祖先 */ }

  let list;
  if (fastForward) {
    list = git(['rev-list', '--reverse', `${remoteHead}..${localHead}`]).split('\n').filter(Boolean);
  } else {
    // 远端 HEAD 可能是我上一轮用 API 推的、SHA 与本地不同的等价提交。
    // 这种情况下按「内容是否一致」判断，而不是按 SHA。
    console.log('  远端不是本地祖先（可能是上一轮 API 推送产生的等价提交）');
    const same = await verify(remoteHead);
    if (same) { console.log('\n  ✅ 内容完全一致，无需再推'); process.exit(0); }
    console.log('  内容有差异，将按本地 HEAD 强制对齐远端分支');
    list = [localHead];
  }

  console.log(`  待推 ${list.length} 个提交`);

  if (dry) {
    for (const sha of list) {
      console.log(`\n  ── ${sha.slice(0, 8)}  ${git(['log', '-1', '--format=%s', sha]).slice(0, 50)}`);
      console.log(`     改动 ${git(['diff', '--name-only', `${git(['rev-parse', `${sha}^`])}..${sha}`]).split('\n').filter(Boolean).length} 个文件（将上传完整快照）`);
    }
    console.log('\n  试运行结束，未改动远端');
    return;
  }

  let parent = remoteHead;
  for (const sha of list) {
    parent = await pushCommit(sha, parent);
  }

  await apiRetry('PATCH', `/repos/${REPO}/git/refs/heads/${BRANCH}`, { sha: parent, force: !fastForward });

  const after = (await api('GET', `/repos/${REPO}/commits/${BRANCH}`)).sha;
  console.log(`\n  远端 HEAD 现在 ${after.slice(0, 8)}`);

  const good = await verify(after);
  console.log(good ? '\n  ✅ 推送完成，内容与本地完全一致' : '\n  ⚠️ 内容仍有差异，请检查上方明细');
  process.exit(good ? 0 : 1);
})().catch((e) => { console.error('\n❌ ' + e.message); process.exit(1); });
