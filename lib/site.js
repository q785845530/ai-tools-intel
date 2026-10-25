// lib/site.js —— 静态站点生成器（双层：原创内容 articles + 情报流 intel）
'use strict';
const fs = require('node:fs');
const path = require('node:path');
const { db, ROOT } = require('./db');
const { render } = require('./md');
const audit = require('./audit');

const OUT = path.join(ROOT, 'site', 'static');

function esc(s) {
  return String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

const CSS = `
*{box-sizing:border-box;margin:0;padding:0}
body{font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,sans-serif;background:#0f172a;color:#e2e8f0;line-height:1.7}
.container{max-width:900px;margin:0 auto;padding:2rem 1rem}
header{text-align:center;padding:2rem 0;border-bottom:1px solid #1e293b;margin-bottom:2rem}
header h1{font-size:1.8rem;color:#38bdf8}
header p{color:#94a3b8;font-size:.9rem;margin-top:.5rem}
section h2.sec{font-size:1.2rem;color:#cbd5e1;margin:1.5rem 0 1rem;padding-bottom:.5rem;border-bottom:1px solid #1e293b}
.card{background:#1e293b;border-radius:8px;padding:1.2rem;margin-bottom:1rem}
.card:hover{border-left:3px solid #38bdf8}
.card h3{font-size:1.05rem;margin-bottom:.4rem}
.card h3 a{color:#e2e8f0;text-decoration:none}
.card h3 a:hover{color:#38bdf8}
.meta{font-size:.8rem;color:#64748b;display:flex;gap:1rem;flex-wrap:wrap}
.badge{background:#334155;padding:2px 8px;border-radius:4px;font-size:.75rem;color:#94a3b8}
.badge.digest{background:#1e3a5f;color:#38bdf8}
.article-body{background:#1e293b;border-radius:8px;padding:2rem;margin-top:1rem;word-wrap:break-word}
.article-body a{color:#38bdf8}
.article-body hr{border:none;border-top:1px solid #334155;margin:1.5rem 0}
.back{color:#38bdf8;text-decoration:none;font-size:.9rem}
footer{text-align:center;padding:2rem 0;color:#475569;font-size:.8rem;border-top:1px solid #1e293b;margin-top:3rem}
`;

function layout(title, body) {
  return `<!DOCTYPE html>
<html lang="zh-CN">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>${esc(title)} - AI 工具情报站</title>
<style>${CSS}</style>
</head>
<body>
<div class="container">
<header>
<h1>🤖 AI 工具情报站</h1>
<p>自动采集 · 自动撰写 · 全程审计留痕</p>
</header>
${body}
<footer>
<p>Powered by ops-intel · Generated ${new Date().toISOString()}</p>
<p>本页面由自动化系统生成，内容来源于公开 API，仅供学习参考。</p>
</footer>
</div>
</body>
</html>`;
}

function buildIndex(articles, items) {
  let html = '';
  if (articles.length) {
    html += `<section><h2 class="sec">✍️ 原创速递（${articles.length}）</h2>\n`;
    for (const a of articles) {
      const day = (a.created_at || '').slice(0, 10);
      const kindBadge = a.kind === 'digest' ? '<span class="badge digest">每日精选</span>' : '<span class="badge">单条速递</span>';
      html += `<div class="card"><h3><a href="./article-${a.id}.html">${esc(a.title)}</a></h3>
<div class="meta">${kindBadge}<span>${esc(a.dek || '').slice(0, 80)}</span><span>${day}</span></div></div>\n`;
    }
    html += `</section>\n`;
  }
  html += `<section><h2 class="sec">📡 情报流（${items.length}）</h2>\n`;
  for (const it of items) {
    const pts = it.points ? `⭐ ${it.points}` : '';
    const cmts = it.comments ? `💬 ${it.comments}` : '';
    html += `<div class="card"><h3><a href="./${it.id}.html">${esc(it.title)}</a></h3>
<div class="meta"><span class="badge">${esc(it.source)}</span>${pts ? `<span>${pts}</span>` : ''}${cmts ? `<span>${cmts}</span>` : ''}<span>${esc((it.published_at || '').slice(0, 10))}</span></div></div>\n`;
  }
  html += `</section>`;
  return html;
}

function buildIntelDetail(it) {
  const body = `<a class="back" href="./index.html">← 返回列表</a>
<div class="article-body">
<h1 style="font-size:1.4rem;margin-bottom:1rem;color:#f1f5f9">${esc(it.title)}</h1>
<div class="meta" style="margin-bottom:1.5rem">
<span class="badge">${esc(it.source)}</span>
<span>作者: ${esc(it.author)}</span>
<span>发布: ${esc(it.published_at || '')}</span>
${it.points ? `<span>⭐ ${it.points}</span>` : ''}
</div>
<p>${esc(it.summary || '暂无摘要')}</p>
<p style="margin-top:1.5rem"><a href="${esc(it.url)}" target="_blank" rel="noopener">🔗 查看原文 →</a></p>
</div>`;
  return layout(it.title, body);
}

function buildArticleDetail(a, sources) {
  const srcLinks = sources.map(s =>
    `<a href="${esc(s.url)}" target="_blank" rel="noopener nofollow">${esc(s.title || s.url)}</a>`
  ).join('<br>');
  const body = `<a class="back" href="./index.html">← 返回列表</a>
<div class="article-body">
${render(a.body_md)}
<div style="margin-top:2rem;padding:1rem;background:#0f172a;border-radius:8px;border-left:3px solid #38bdf8">
<strong style="color:#38bdf8">📎 溯源（全部原始出处，可逐条核验）</strong>
<p style="margin-top:.5rem;font-size:.85rem;color:#94a3b8">${srcLinks}</p>
</div>
</div>`;
  return layout(a.title, body);
}

function generate() {
  fs.mkdirSync(OUT, { recursive: true });

  const articles = db.prepare("SELECT * FROM articles WHERE status IN ('ready','published') ORDER BY created_at DESC, id DESC LIMIT 50").all();
  const items = db.prepare(`SELECT * FROM intel ORDER BY points DESC, fetched_at DESC LIMIT 100`).all();

  // 首页
  fs.writeFileSync(path.join(OUT, 'index.html'), layout('首页', buildIndex(articles, items)), 'utf8');

  // 情报详情页
  for (const it of items) {
    fs.writeFileSync(path.join(OUT, `${it.id}.html`), buildIntelDetail(it), 'utf8');
  }

  // 文章详情页（含溯源）
  for (const a of articles) {
    const ids = JSON.parse(a.source_ids || '[]');
    const sources = ids.map(id => {
      const r = db.prepare('SELECT title, url FROM intel WHERE id = ?').get(id);
      return r || { title: `intel#${id}`, url: '#' };
    });
    fs.writeFileSync(path.join(OUT, `article-${a.id}.html`), buildArticleDetail(a, sources), 'utf8');
    // 标记 published + 回填 html_path
    db.prepare("UPDATE articles SET status = 'published', html_path = ?, published_at = COALESCE(published_at, ?) WHERE id = ? AND status = 'ready'")
      .run(`article-${a.id}.html`, new Date().toISOString(), a.id);
  }

  audit.log('info', 'site', 'generate.done', { articles: articles.length, intel: items.length, pages: 1 + articles.length + items.length });
  return { articles: articles.length, intel: items.length, pages: 1 + articles.length + items.length };
}

module.exports = { generate, OUT };

if (require.main === module) {
  console.log(JSON.stringify(generate(), null, 2));
}
