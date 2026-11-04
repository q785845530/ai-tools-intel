// lib/archive.js —— 把超时未处理的稿件归档
//
// 归档 = 把 status 改成 'archived'，**不删任何行**。
// 全站查询都带 `status IN ('ready','published')`，所以归档后自然从站点/推送/草稿里消失，
// 但原文、溯源、审计记录一条不少，随时可查、可恢复。
//
// 用法：
//   node lib/archive.js --older-than 48        # 归档超 48 小时的（默认）
//   node lib/archive.js --older-than 48 --dry  # 只看会归档哪些，不动盘
//   node lib/archive.js --restore 12,15,16     # 恢复指定 id 为 published
'use strict';

const { db } = require('./db');
const audit = require('./audit');

function parseArgs(argv) {
  const out = { olderThan: 48, dry: false, restore: null };
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a === '--dry') out.dry = true;
    else if (a === '--older-than') out.olderThan = Number(argv[++i]);
    else if (a === '--restore') out.restore = String(argv[++i] || '').split(',').map(s => Number(s.trim())).filter(Boolean);
  }
  return out;
}

function archive({ olderThan = 48, dry = false } = {}) {
  const cutoff = new Date(Date.now() - olderThan * 3600 * 1000).toISOString();
  const rows = db.prepare(
    `SELECT id, slug, title, created_at, status, kind
       FROM articles
      WHERE created_at < ? AND status IN ('ready','published') AND relevance = 'ok'
      ORDER BY created_at ASC`
  ).all(cutoff);

  if (rows.length === 0) {
    audit.log('info', 'ops', 'archive.none', { olderThanHours: olderThan, cutoff });
    return { archived: 0, ids: [] };
  }

  // 先记账：把"要归档哪些"完整写进审计链，再动数据。
  // 顺序很重要 —— 先改后记的话，中途崩溃就会留下无据可查的改动。
  audit.log('info', 'ops', 'archive.begin', {
    olderThanHours: olderThan,
    cutoff,
    count: rows.length,
    dry,
    items: rows.map(r => ({ id: r.id, slug: r.slug, created: String(r.created_at).slice(0, 19), status: r.status })),
  });

  if (dry) {
    return { archived: 0, ids: rows.map(r => r.id), dry: true, rows };
  }

  const ids = rows.map(r => r.id);
  const upd = db.prepare(`UPDATE articles SET status = 'archived', archived_at = ? WHERE id = ?`);
  const now = new Date().toISOString();
  let n = 0;
  // node:sqlite 的 DatabaseSync 没有 better-sqlite3 的 .transaction()，
  // 用显式 BEGIN/COMMIT；出错必须 ROLLBACK，否则会留下半批归档。
  db.exec('BEGIN');
  try {
    for (const id of ids) n += upd.run(now, id).changes;
    db.exec('COMMIT');
  } catch (e) {
    db.exec('ROLLBACK');
    audit.log('error', 'ops', 'archive.rollback', { error: e.message, attempted: ids.length });
    throw e;
  }

  audit.log('info', 'ops', 'archive.done', { archived: n, olderThanHours: olderThan, ids });

  return { archived: n, ids, rows };
}

function restore(ids) {
  if (!ids || ids.length === 0) return { restored: 0 };
  const upd = db.prepare(`UPDATE articles SET status = 'published', archived_at = NULL WHERE id = ? AND status = 'archived'`);
  let n = 0;
  for (const id of ids) n += upd.run(id).changes;
  audit.log('info', 'ops', 'archive.restore', { requested: ids, restored: n });
  return { restored: n };
}

module.exports = { archive, restore };

if (require.main === module) {
  const args = parseArgs(process.argv.slice(2));

  if (args.restore) {
    const r = restore(args.restore);
    console.log(`恢复 ${r.restored} 篇（请求 ${args.restore.length} 个 id）`);
    process.exit(0);
  }

  const r = archive(args);

  if (r.dry) {
    console.log(`════ 试运行：将归档 ${r.rows.length} 篇（未改动）════`);
    r.rows.slice(0, 15).forEach(x =>
      console.log(`  #${x.id} ${String(x.created_at).slice(0, 10)} ${String(x.title).slice(0, 40)}`));
    if (r.rows.length > 15) console.log(`  …其余 ${r.rows.length - 15} 篇`);
    process.exit(0);
  }

  console.log(`════ 归档完成：${r.archived} 篇 ════`);
  console.log('  数据未删除，status 改为 archived；可用 --restore 恢复');
}
