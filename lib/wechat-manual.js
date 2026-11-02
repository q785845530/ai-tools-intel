// lib/wechat-manual.js —— 微信「手动发布」通道（B 方案）
//
// 为什么不用官方 API：容器出口 IP 持续漂移（实测每次请求 IP 都不同），
// 微信 IP 白名单永远对不上，40164 无法自愈。所以改走人工：
//   机器只负责把稿子整理成「可以直接粘进公众号编辑器」的文件，
//   人负责点发布。没有 IP、没有认证、不会失败。
//
// 产出：
//   content/wechat-queue/pending/<slug>.md   待发（含标题建议/摘要/正文）
//   content/wechat-queue/pending/index.md    当前待发清单（按日排序）
//   content/wechat-queue/README.md           粘贴操作指引
//
// 发完之后由用户（或 `node lib/wechat-manual.js --done <id>`）标记完成，
// 文件移到 sent/，不删除 —— 保留可追溯痕迹。
'use strict';

const fs = require('node:fs');
const path = require('node:path');
const { db } = require('./db');
const audit = require('./audit');

const ROOT = path.resolve(__dirname, '..');
const QUEUE = path.join(ROOT, 'content', 'wechat-queue');
const PENDING = path.join(QUEUE, 'pending');
const SENT = path.join(QUEUE, 'sent');

function ensureDirs() {
  for (const d of [QUEUE, PENDING, SENT]) fs.mkdirSync(d, { recursive: true });
}

/** 摘要：取 dek，没有就从正文首段截 */
function makeDigest(row) {
  const dek = (row.dek || '').trim();
  if (dek) return dek.slice(0, 120);
  const firstPara = String(row.body_md || '')
    .split('\n')
    .map(s => s.trim())
    .find(s => s && !s.startsWith('#') && !s.startsWith('>') && !s.startsWith('!') && !s.startsWith('|'));
  return (firstPara || '').replace(/[#*`>\[\]]/g, '').slice(0, 120);
}

/** 生成一个可直接粘贴的 md 文件内容 */
function renderManual(row) {
  const srcCount = (() => {
    try { return JSON.parse(row.source_urls || '[]').length; } catch { return 0; }
  })();
  const lines = [
    `<!-- 微信公众号手动发布稿 | article #${row.id} | ${row.kind} -->`,
    `<!-- 用法：全选正文（从「正文」分隔线以下的全部内容）→ 粘贴进公众号编辑器 -->`,
    '',
    `# 【标题】${row.title}`,
    '',
    `## 【摘要 / 引导语】`,
    '',
    makeDigest(row),
    '',
    `## 【作者署名】`,
    '',
    `智能制造大时代`,
    '',
    `---`,
    `<sub>本文由公开资料整理，共引用 ${srcCount} 条来源，原文链接见文末。观点仅供参考，不构成投资或采购建议。</sub>`,
    '',
    '---',
    '',
    '## 【正文】（以下全部内容复制粘贴）',
    '',
    String(row.body_md || '').trim(),
    '',
    '---',
    '',
    '## 【参考来源】',
    '',
  ];

  let urls = [];
  try { urls = JSON.parse(row.source_urls || '[]'); } catch { /* 保持空 */ }
  if (urls.length === 0) {
    lines.push('（无）');
  } else {
    urls.slice(0, 20).forEach((u, i) => lines.push(`${i + 1}. ${u}`));
  }

  lines.push('', `<!-- 生成时间 ${new Date().toISOString()} -->`, '');
  return lines.join('\n');
}

/** 把一篇导出成待发文件；已存在则跳过（幂等） */
function exportOne(row, { force = false } = {}) {
  ensureDirs();
  const file = path.join(PENDING, `${row.slug}.md`);
  if (fs.existsSync(file) && !force) return { skipped: true, file };

  fs.writeFileSync(file, renderManual(row), 'utf8');
  db.prepare(
    `INSERT INTO publish_log (article_id, channel, status, detail, created_at)
     VALUES (?, 'wechat', 'pending_manual', ?, ?)`
  ).run(row.id, JSON.stringify({ file: path.relative(ROOT, file), mode: 'manual-export' }), new Date().toISOString());

  return { skipped: false, file };
}

/** 重建 index.md（按日期分组，方便一天清一次） */
function rebuildIndex() {
  ensureDirs();
  const files = fs.readdirSync(PENDING).filter(f => f.endsWith('.md') && f !== 'index.md').sort().reverse();
  const byDate = new Map();
  for (const f of files) {
    const m = /(\d{8})/.exec(f);
    const d = m ? `${m[1].slice(0, 4)}-${m[1].slice(4, 6)}-${m[1].slice(6, 8)}` : '未标注日期';
    if (!byDate.has(d)) byDate.set(d, []);
    byDate.get(d).push(f);
  }

  const lines = [
    '# 微信公众号待发清单',
    '',
    `共 **${files.length}** 篇待发。全选对应文件的正文段落，粘贴进公众号编辑器即可。`,
    '',
    '> 发完之后标记：`node lib/wechat-manual.js --done <文件名不含.md>`',
    '',
  ];
  for (const [d, list] of [...byDate.entries()].sort().reverse()) {
    lines.push(`## ${d}（${list.length} 篇）`, '');
    for (const f of list) {
      const slug = f.replace(/\.md$/, '');
      const title = (() => {
        try {
          const head = fs.readFileSync(path.join(PENDING, f), 'utf8').slice(0, 600);
          const m = /# 【标题】(.+)/.exec(head);
          return m ? m[1].trim() : slug;
        } catch { return slug; }
      })();
      lines.push(`- [ ] \`${slug}\` — ${title}`);
    }
    lines.push('');
  }

  fs.writeFileSync(path.join(PENDING, 'index.md'), lines.join('\n'), 'utf8');
  return files.length;
}

/** 主体：把队列里还没导出的 daily/deep 文章导出 */
function exportPending({ limit = 20, force = false } = {}) {
  ensureDirs();
  const rows = db.prepare(`
    SELECT a.* FROM articles a
     WHERE a.status IN ('ready','published') AND a.relevance = 'ok'
       AND a.kind IN ('daily','deep')
       AND NOT EXISTS (
         SELECT 1 FROM publish_log p
          WHERE p.article_id = a.id AND p.channel = 'wechat'
            AND p.status IN ('pending_manual','draft_created')
       )
     ORDER BY a.created_at DESC, a.id DESC
     LIMIT ?
  `).all(limit);

  let n = 0;
  const files = [];
  for (const row of rows) {
    const r = exportOne(row, { force });
    if (!r.skipped) { n++; files.push(path.relative(ROOT, r.file)); }
  }

  const total = rebuildIndex();

  if (n > 0) {
    audit.log('info', 'wechat', 'manual.exported', { exported: n, queueTotal: total, files });
  } else {
    audit.log('info', 'wechat', 'manual.noop', { reason: '无新的待导出文章', queueTotal: total });
  }
  return { exported: n, queueTotal: total, files };
}

/** 标记已发：文件移进 sent/，状态推进 */
function markDone(slug) {
  ensureDirs();
  const src = path.join(PENDING, `${slug}.md`);
  if (!fs.existsSync(src)) return { ok: false, reason: `找不到 ${slug}.md` };

  const dst = path.join(SENT, `${slug}.md`);
  fs.renameSync(src, dst);

  // 同步 publish_log：把 pending_manual 推进成 sent_manual（不删旧记录，追加一条）
  const row = db.prepare('SELECT id FROM articles WHERE slug = ?').get(slug);
  if (row) {
    db.prepare(
      `INSERT INTO publish_log (article_id, channel, status, detail, created_at)
       VALUES (?, 'wechat', 'sent_manual', ?, ?)`
    ).run(row.id, JSON.stringify({ file: path.relative(ROOT, dst) }), new Date().toISOString());
  }

  rebuildIndex();
  audit.log('info', 'wechat', 'manual.sent', { slug, movedTo: path.relative(ROOT, dst) });
  return { ok: true, movedTo: dst };
}

/** 写操作指引（首次运行时生成） */
function ensureReadme() {
  ensureDirs();
  const p = path.join(QUEUE, 'README.md');
  if (fs.existsSync(p)) return;
  fs.writeFileSync(p, `# 微信手动发布通道

## 为什么是手动

公众号 API 要求固定出口 IP（IP 白名单）。本机容器出口 IP 每次请求都在变，
40164 无法通过加白名单解决，所以改走人工：机器整理稿子，人点发布。

## 每天怎么发

1. 打开 \`content/wechat-queue/pending/index.md\`，看今天有哪些待发
2. 点开对应 \`.md\` 文件，从「【正文】」分隔线以下全选复制
3. 粘进公众号编辑器，标题填【标题】那一行，摘要填【摘要】那一行
4. 发完执行：\`node lib/wechat-manual.js --done <slug>\`

## 目录说明

- \`pending/\` —— 待发
- \`sent/\` —— 已发（保留，可追溯）
- \`README.md\` —— 本文件

## 为什么不删

已发的稿件移动到 \`sent/\` 而不是删除，是为了保留完整痕迹：
哪篇什么时候发过，随时能查。
`, 'utf8');
}

module.exports = { exportPending, exportOne, markDone, rebuildIndex, ensureReadme, renderManual, makeDigest, QUEUE, PENDING, SENT };

if (require.main === module) {
  const argv = process.argv.slice(2);
  ensureReadme();

  const doneIdx = argv.indexOf('--done');
  if (doneIdx !== -1) {
    const slug = argv[doneIdx + 1];
    if (!slug) { console.error('用法: node lib/wechat-manual.js --done <slug>'); process.exit(1); }
    const r = markDone(slug);
    console.log(r.ok ? `✅ 已标记发送：${slug} → sent/` : `❌ ${r.reason}`);
    process.exit(r.ok ? 0 : 1);
  }

  const r = exportPending({ force: argv.includes('--force') });
  console.log(`════ 微信手动发布队列 ════`);
  console.log(`  本次导出：${r.exported} 篇`);
  console.log(`  待发总数：${r.queueTotal} 篇`);
  console.log(`  清单文件：content/wechat-queue/pending/index.md`);
}
