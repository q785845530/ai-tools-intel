// lib/cloud-state.js —— 跨轮次状态持久化（云端 Actions 为准的托管模式）
//
// 背景见 docs/HOSTING-PLAN.md：data/ops.db 不入库，云端每次 checkout 都是空库。
// 本模块把「有效情报 + 有效文章」以纯文本 JSON 存在 cloud/state.json（入库），
// 云端启动 restore() 灌回空 .db，结束 export_() 写回仓库，从而跨轮累积。
//
// 设计要点：
//  - 零依赖，只用 node:fs / node:path 与现有 lib/db.js。
//  - 幂等：restore 用 INSERT OR IGNORE（UNIQUE(source,ext_id) / slug），连跑不增。
//  - 只增不删：export_ 与磁盘上已有状态做【并集】。即使本轮 .db 是空的（云端
//    异常），也绝不把上一轮的记录从状态文件里抹掉 —— 这是防止丢数据的关键。
//  - 只同步 relevance='ok' 的记录；off 记录仍是本地事实，保留在本地 .db 与
//    log/audit-*.jsonl（审计日志本就入库），不进状态文件，不删、不省略。
//
// CLI:
//   node lib/cloud-state.js restore   # 状态文件 → .db
//   node lib/cloud-state.js export    # .db（并集）→ 状态文件
//   node lib/cloud-state.js status    # 打印状态摘要
'use strict';

const fs = require('node:fs');
const path = require('node:path');
const { db, ROOT } = require('./db');

const STATE_DIR = path.join(ROOT, 'cloud');
const STATE_FILE = path.join(STATE_DIR, 'state.json');
const STATE_VERSION = 1;
// 状态文件只保留最近 N 条有效情报，避免无限增长撑大仓库。
// 被裁掉的记录仍在本地 .db 与审计日志里，不是删除事实，只是不再跨端同步。
const MAX_INTEL = Number(process.env.OPS_STATE_MAX_INTEL || 2000);

const INTEL_COLS = ['source', 'ext_id', 'title', 'url', 'summary', 'points',
  'published_at', 'fetched_at', 'relevance', 'used'];
const ARTICLE_COLS = ['slug', 'kind', 'title', 'dek', 'body_md', 'source_urls',
  'source_ids', 'generator', 'score', 'status', 'created_at', 'published_at', 'relevance'];

function readState() {
  try {
    const raw = fs.readFileSync(STATE_FILE, 'utf8');
    const st = JSON.parse(raw);
    if (!st || typeof st !== 'object') return emptyState();
    return {
      version: STATE_VERSION,
      updated_at: st.updated_at || null,
      intel: Array.isArray(st.intel) ? st.intel : [],
      articles: Array.isArray(st.articles) ? st.articles : [],
    };
  } catch (e) {
    if (e.code === 'ENOENT') return emptyState();
    // 状态文件损坏时不能静默当空 —— 会丢历史。保留原件、报错让人看见。
    throw new Error(`cloud/state.json 解析失败，已保留原件请人工检查: ${e.message}`);
  }
}

function emptyState() {
  return { version: STATE_VERSION, updated_at: null, intel: [], articles: [] };
}

/** 原子写：先写 .tmp 再 rename，避免中途失败留下半截 JSON */
function writeState(st) {
  fs.mkdirSync(STATE_DIR, { recursive: true });
  st.version = STATE_VERSION;
  st.updated_at = new Date().toISOString();
  const tmp = STATE_FILE + '.tmp';
  fs.writeFileSync(tmp, JSON.stringify(st, null, 2) + '\n', 'utf8');
  fs.renameSync(tmp, STATE_FILE);
}

/** 状态文件 → .db。幂等，可重复调用。 */
function restore() {
  const st = readState();
  if (!st.intel.length && !st.articles.length) {
    return { restoredIntel: 0, restoredArticles: 0, skipped: 'EMPTY_STATE' };
  }

  const insIntel = db.prepare(`
    INSERT OR IGNORE INTO intel
      (source, ext_id, title, url, summary, points, published_at, fetched_at, relevance, used)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`);
  const insArticle = db.prepare(`
    INSERT OR IGNORE INTO articles
      (slug, kind, title, dek, body_md, source_urls, source_ids, generator, score,
       status, created_at, published_at, relevance)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`);

  let ni = 0, na = 0;
  db.exec('BEGIN');
  try {
    for (const r of st.intel) {
      const v = INTEL_COLS.map((c) => r[c] ?? (c === 'points' || c === 'used' ? 0 : null));
      // 必填字段兜底，避免坏记录让整批回滚
      if (!v[0] || !v[1] || !v[2]) continue;
      const info = insIntel.run(...v);
      if (info.changes > 0) ni++;
    }
    for (const r of st.articles) {
      const v = ARTICLE_COLS.map((c) => r[c] ?? (c === 'score' ? 0 : null));
      if (!v[0] || !v[2] || !v[4]) continue; // slug/title/body_md 必填
      const info = insArticle.run(...v);
      if (info.changes > 0) na++;
    }
    db.exec('COMMIT');
  } catch (e) {
    db.exec('ROLLBACK');
    throw e;
  }
  return { restoredIntel: ni, restoredArticles: na, fromState: st.updated_at };
}

/** .db → 状态文件，与磁盘已有状态做并集（只增不删）。 */
function export_(opts = {}) {
  const prev = readState();
  const maxIntel = Number(opts.maxIntel || MAX_INTEL);

  const intelRows = db.prepare(`
    SELECT ${INTEL_COLS.join(', ')} FROM intel WHERE relevance = 'ok'
    ORDER BY fetched_at DESC, id DESC`).all();
  const artRows = db.prepare(`
    SELECT ${ARTICLE_COLS.join(', ')} FROM articles WHERE relevance = 'ok'
    ORDER BY created_at DESC, id DESC`).all();

  // 并集键：情报 (source,ext_id)，文章 slug
  const iMap = new Map();
  for (const r of prev.intel) if (r && r.source && r.ext_id) iMap.set(r.source + '\u0000' + r.ext_id, r);
  for (const r of intelRows) iMap.set(r.source + '\u0000' + r.ext_id, r);

  const aMap = new Map();
  for (const r of prev.articles) if (r && r.slug) aMap.set(r.slug, r);
  for (const r of artRows) aMap.set(r.slug, r);

  // 按时间倒序取前 maxIntel 条；文章全量保留（数量小）
  const mergedIntel = [...iMap.values()]
    .sort((a, b) => String(b.fetched_at || '').localeCompare(String(a.fetched_at || '')))
    .slice(0, maxIntel);
  const mergedArticles = [...aMap.values()]
    .sort((a, b) => String(b.created_at || '').localeCompare(String(a.created_at || '')));

  const st = {
    version: STATE_VERSION,
    intel: mergedIntel,
    articles: mergedArticles,
    stats: {
      intel: mergedIntel.length,
      articles: mergedArticles.length,
      prevIntel: prev.intel.length,
      prevArticles: prev.articles.length,
      dbIntelOk: intelRows.length,
      dbArticlesOk: artRows.length,
      trimmedIntel: Math.max(0, iMap.size - mergedIntel.length),
    },
  };
  writeState(st);
  return st.stats;
}

function status() {
  const st = readState();
  const dbIntel = db.prepare("SELECT COUNT(*) c FROM intel WHERE relevance='ok'").get().c;
  const dbArt = db.prepare("SELECT COUNT(*) c FROM articles WHERE relevance='ok'").get().c;
  return {
    stateFile: fs.existsSync(STATE_FILE) ? STATE_FILE : null,
    stateUpdatedAt: st.updated_at,
    stateIntel: st.intel.length,
    stateArticles: st.articles.length,
    stateBytes: fs.existsSync(STATE_FILE) ? fs.statSync(STATE_FILE).size : 0,
    dbIntelOk: dbIntel,
    dbArticlesOk: dbArt,
  };
}

module.exports = { restore, export: export_, status, readState, STATE_FILE, STATE_VERSION };

if (require.main === module) {
  const cmd = process.argv[2] || 'status';
  try {
    if (cmd === 'restore') console.log(JSON.stringify(restore()));
    else if (cmd === 'export') console.log(JSON.stringify(export_()));
    else if (cmd === 'status') console.log(JSON.stringify(status(), null, 2));
    else { console.error('用法: node lib/cloud-state.js restore|export|status'); process.exit(2); }
  } catch (e) {
    console.error('❌ ' + e.message);
    process.exit(1);
  }
}
