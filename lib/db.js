// lib/db.js —— 数据基座（Node 24 内置 node:sqlite，零依赖）
'use strict';
const { DatabaseSync } = require('node:sqlite');
const path = require('node:path');
const fs = require('node:fs');

const ROOT = path.resolve(__dirname, '..');
const DATA = path.join(ROOT, 'data');
fs.mkdirSync(DATA, { recursive: true });

const db = new DatabaseSync(path.join(DATA, 'ops.db'));
db.exec('PRAGMA journal_mode = WAL;');
db.exec('PRAGMA busy_timeout = 5000;');

db.exec(`
CREATE TABLE IF NOT EXISTS intel (
  id          INTEGER PRIMARY KEY AUTOINCREMENT,
  source      TEXT NOT NULL,          -- hn | github | rss ...
  ext_id      TEXT NOT NULL,          -- 源内唯一 id，用于去重
  title       TEXT NOT NULL,
  url         TEXT NOT NULL,
  summary     TEXT,
  author      TEXT,
  points      INTEGER DEFAULT 0,
  comments    INTEGER DEFAULT 0,
  lang        TEXT,
  topics      TEXT,                   -- 逗号分隔标签
  published_at TEXT,
  fetched_at  TEXT NOT NULL,
  used        INTEGER DEFAULT 0,      -- 是否已被某篇内容消费
  relevance   TEXT DEFAULT 'ok',      -- 相关性闸门：ok 可发布，off 仅存档可审计
  UNIQUE(source, ext_id)
);

CREATE TABLE IF NOT EXISTS articles (
  id          INTEGER PRIMARY KEY AUTOINCREMENT,
  slug        TEXT NOT NULL UNIQUE,
  kind        TEXT NOT NULL,          -- tool|news|weekly|hot
  title       TEXT NOT NULL,
  dek         TEXT,
  body_md     TEXT NOT NULL,
  source_urls TEXT NOT NULL,          -- JSON 数组：全部情报溯源，缺一不可
  source_ids  TEXT NOT NULL,          -- JSON 数组：intel.id
  generator   TEXT NOT NULL,          -- template-v1 | llm:<model>
  score       REAL DEFAULT 0,         -- 选题热度分，排序用
  status      TEXT NOT NULL DEFAULT 'draft',  -- draft|ready|published|failed
  html_path   TEXT,
  created_at  TEXT NOT NULL,
  published_at TEXT,
  relevance   TEXT DEFAULT 'ok'       -- 同上；站点与生成器只消费 ok
);

CREATE TABLE IF NOT EXISTS publish_log (
  id          INTEGER PRIMARY KEY AUTOINCREMENT,
  article_id  INTEGER NOT NULL,
  channel     TEXT NOT NULL,          -- site|github-pages|wechat|zhihu|xhs|toutiao
  status      TEXT NOT NULL,          -- ok|pending_manual|failed
  detail      TEXT,
  target_url  TEXT,
  created_at  TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS metrics (
  id          INTEGER PRIMARY KEY AUTOINCREMENT,
  day         TEXT NOT NULL,
  channel     TEXT NOT NULL,
  views       INTEGER DEFAULT 0,
  UNIQUE(day, channel)
);

CREATE INDEX IF NOT EXISTS idx_intel_score ON intel(points DESC);
CREATE INDEX IF NOT EXISTS idx_intel_unused ON intel(used, points DESC);
CREATE INDEX IF NOT EXISTS idx_art_status ON articles(status, created_at DESC);
`);

/** 老库补齐 relevance 列：本库早期由手动 ALTER 产生，CREATE TABLE 的更新只对全新库生效，
 *  已存在的库必须靠这里自迁移，否则任何环境下「no such column: relevance」。
 *  （GitHub Actions 全新库因缺列整轮失败过一次，见 README 事故复盘） */
function ensureRelevanceColumn(table) {
  const cols = db.prepare('PRAGMA table_info(' + table + ')').all().map(c => c.name);
  if (!cols.includes('relevance')) db.exec('ALTER TABLE ' + table + " ADD COLUMN relevance TEXT DEFAULT 'ok'");
}
ensureRelevanceColumn('intel');
ensureRelevanceColumn('articles');

module.exports = { db, DATA, ROOT };
