#!/usr/bin/env node
// scripts/recheck-relevance.js —— 用当前相关性规则重扫存量 intel，只在规则升级后跑一次。
//
// 为什么需要它：isRelevant() 只在**采集入库时**执行一次，relevance 字段就定死了。
// 规则收紧后（本次：热榜源改走 HOT_STRICT 专指词闸门），存量行不会自动重判，
// 旧噪声仍以 relevance=\x27ok\x27 留在池子里，被站点和日报继续消费。
//
// 用法：
//   node scripts/recheck-relevance.js            # 只报告，不写库（默认）
//   node scripts/recheck-relevance.js --apply    # 实际写回 relevance
//   node scripts/recheck-relevance.js --apply --source=zhihu-hot   # 只重扫某个源
//
// 安全：只改 relevance 一个字段，不动标题/正文/used；每行变更都进审计链。
"use strict";
const { db } = require("../lib/db");
const { isRelevant } = require("../lib/relevance");
const audit = require("../lib/audit");

const apply = process.argv.includes("--apply");
const srcArg = process.argv.find((a) => a.startsWith("--source="));
const only = srcArg ? srcArg.slice("--source=".length) : null;

const rows = only
  ? db.prepare("SELECT id, source, title, summary, topics, relevance FROM intel WHERE source = ?").all(only)
  : db.prepare("SELECT id, source, title, summary, topics, relevance FROM intel").all();

const stats = {};
const changes = [];
for (const r of rows) {
  const v = isRelevant({ title: r.title, summary: r.summary || "", topics: r.topics || "", source: r.source });
  const next = v.ok ? "ok" : "off";
  const cur = r.relevance || "null";
  const k = `${r.source}:${cur}->${next}`;
  stats[k] = (stats[k] || 0) + 1;
  if (next !== cur) changes.push({ id: r.id, source: r.source, from: cur, to: next, why: v.why, hit: v.hit || "", title: String(r.title).slice(0, 60) });
}

console.log(`扫描 ${rows.length} 条${only ? "（源=" + only + "）" : ""}`);
for (const [k, n] of Object.entries(stats).sort()) console.log(`  ${k.padEnd(34)} ${n}`);
console.log(`\n需要变更：${changes.length} 条`);
for (const c of changes.slice(0, 40)) {
  console.log(`  #${String(c.id).padEnd(6)} ${c.source.padEnd(14)} ${c.from}->${c.to}  ${c.why.padEnd(14)} ${c.title}`);
}
if (changes.length > 40) console.log(`  …另外 ${changes.length - 40} 条`);

// ── 第二部分：文章表 ────────────────────────────────────────────────────
// intel 修好了不等于站点干净：articles 的 relevance 是**成稿当时**算的，
// 规则升级后旧文章仍然顶着 ok 出现在站点上（实测 4 篇热榜噪声稿因此漏网）。
// 用文章选中的第一条素材的 source 还原它的语义来源，再按当前规则重判。
const arts = db.prepare("SELECT id, kind, title, source_ids, relevance FROM articles").all();
const artChanges = [];
for (const a of arts) {
  const ids = JSON.parse(a.source_ids || "[]");
  const src = ids.length ? db.prepare("SELECT source FROM intel WHERE id = ?").get(ids[0])?.source : null;
  const v = isRelevant({ title: a.title, source: src || "" });
  const next = v.ok ? "ok" : "off";
  if (next !== (a.relevance || "null")) {
    artChanges.push({ id: a.id, from: a.relevance, to: next, why: v.why, src: src || "-", title: String(a.title).slice(0, 60) });
  }
}
console.log(`\n文章表：${arts.length} 篇，需变更 ${artChanges.length} 篇`);
for (const c of artChanges) console.log(`  article#${String(c.id).padEnd(4)} ${c.from}->${c.to}  ${c.why.padEnd(14)} ${c.src.padEnd(14)} ${c.title}`);

if (!apply) {
  console.log("\n（只报告模式。加 --apply 才写库）");
  process.exit(0);
}
const updArt = db.prepare("UPDATE articles SET relevance = ? WHERE id = ?");
db.exec("BEGIN");
try {
  for (const c of artChanges) updArt.run(c.to, c.id);
  db.exec("COMMIT");
} catch (e) { db.exec("ROLLBACK"); throw e; }
audit.log("info", "maintenance", "relevance.recheck_articles", {
  scanned: arts.length, changed: artChanges.length,
  dropped: artChanges.filter(c => c.to === "off").map(c => c.id),
});
console.log(`✅ 文章表已写回 ${artChanges.length} 篇`);
const upd = db.prepare("UPDATE intel SET relevance = ? WHERE id = ?");
db.exec("BEGIN");
try {
  for (const c of changes) upd.run(c.to, c.id);
  db.exec("COMMIT");
} catch (e) {
  db.exec("ROLLBACK");
  throw e;
}
audit.log("info", "maintenance", "relevance.rechecked", {
  scanned: rows.length, changed: changes.length,
  bySource: changes.reduce((m, c) => { m[c.source] = (m[c.source] || 0) + 1; return m; }, {}),
});
console.log(`\n✅ 已写回 ${changes.length} 条并记入审计链`);
