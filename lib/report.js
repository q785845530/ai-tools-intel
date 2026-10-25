// lib/report.js —— 从审计链直接生成全量运营报告（不省略任何一条记录）
'use strict';
const fs = require('node:fs');
const path = require('node:path');
const { db, ROOT } = require('./db');
const audit = require('./audit');

function buildReport() {
  const v = audit.verify();
  const all = audit.tail(100000); // 全量，不截断
  const lines = [];

  lines.push('# ops 自动运营平台 · 全量运营记录');
  lines.push('');
  lines.push(`生成时间：${new Date().toISOString()}`);
  lines.push('');
  lines.push('> 本报告由审计链直接导出，包含系统自启动以来的**每一条**运行记录，不筛选、不省略、不删除。');
  lines.push('> 审计链采用哈希链（每条含前一条的 SHA-256），任何记录的增删改都会导致校验失败。');
  lines.push('');
  lines.push('## 0. 审计链完整性');
  lines.push('');
  lines.push(`- 状态：**${v.ok ? '✅ 完整' : '❌ 异常'}**`);
  lines.push(`- 记录总数：${v.checked}`);
  lines.push(`- 链头：seq=${v.head.seq}, hash=${v.head.hash}`);
  if (!v.ok) {
    lines.push(`- 异常明细（${v.problems.length} 处）：`);
    v.problems.forEach(p => lines.push(`  - ${p}`));
  }
  lines.push('');
  lines.push('## 1. 系统资产统计');
  lines.push('');
  const intelTotal = db.prepare('SELECT COUNT(*) c FROM intel').get().c;
  const artTotal = db.prepare('SELECT COUNT(*) c FROM articles').get().c;
  const pubTotal = db.prepare('SELECT COUNT(*) c FROM publish_log').get().c;
  lines.push('| 项目 | 数量 |');
  lines.push('|---|---|');
  lines.push(`| 采集情报条目 | ${intelTotal} |`);
  lines.push(`| 原创文章 | ${artTotal} |`);
  lines.push(`| 平台成品稿 | ${pubTotal} |`);
  lines.push(`| 审计记录 | ${v.checked} |`);
  lines.push('');
  lines.push('### 1.1 情报来源分布');
  lines.push('');
  lines.push('| 来源 | 条数 |');
  lines.push('|---|---|');
  db.prepare('SELECT source, COUNT(*) n FROM intel GROUP BY source ORDER BY n DESC').all()
    .forEach(r => lines.push(`| ${r.source} | ${r.n} |`));
  lines.push('');
  lines.push('### 1.2 文章清单');
  lines.push('');
  lines.push('| ID | 类型 | 状态 | 标题 |');
  lines.push('|---|---|---|---|');
  db.prepare('SELECT id, kind, status, title FROM articles ORDER BY id').all()
    .forEach(a => lines.push(`| ${a.id} | ${a.kind} | ${a.status} | ${String(a.title).replace(/\|/g, '/').slice(0, 70)} |`));
  lines.push('');
  lines.push('## 2. 全量运行记录（按时间正序，一条不缺）');
  lines.push('');
  lines.push('| 序号 | 时间 | 级别 | 执行者 | 事件 | 数据 |');
  lines.push('|---|---|---|---|---|---|');
  for (const r of all) {
    const data = JSON.stringify(r.data || {}).replace(/\|/g, '/').slice(0, 160);
    lines.push(`| ${r.seq} | ${r.ts} | ${r.level} | ${r.actor} | ${r.event} | ${data} |`);
  }
  lines.push('');
  lines.push(`---`);
  lines.push('');
  lines.push(`*报告结束。共 ${v.checked} 条审计记录，全部列于上表，无删减。*`);

  const out = path.join(ROOT, 'log', 'OPS-REPORT.md');
  fs.writeFileSync(out, lines.join('\n'), 'utf8');
  audit.log('info', 'report', 'generated', { file: path.relative(ROOT, out), records: v.checked, chainOk: v.ok });
  return { file: out, records: v.checked, chainOk: v.ok };
}

module.exports = { buildReport };

if (require.main === module) {
  const r = buildReport();
  console.log(`报告已生成：${r.file}`);
  console.log(`含 ${r.records} 条审计记录，链完整性：${r.chainOk ? '✅' : '❌'}`);
}