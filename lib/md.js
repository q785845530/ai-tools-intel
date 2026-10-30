// lib/md.js —— 极简 Markdown 渲染（零依赖）
// 支持：h1-h3、**粗体**、*斜体*、[链接](url)、裸 URL 自动转链接、
//       无序/有序列表、> 引用、--- 分隔线、`代码`、段落
'use strict';

function esc(s) {
  return String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

// 允许的链接目标：绝对 http(s)、站内相对页（article-*.html / *.html）、锚点。
// 显式排除 javascript: data: 等危险协议（正文由本系统生成，仍按纵深防御处理）。
function safeHref(u) {
  const s = String(u || '').trim();
  if (/^https?:\/\//i.test(s)) return s;
  if (/^[a-z0-9._-]+\.html$/i.test(s)) return s;   // 站内相对页，如 article-100.html
  if (/^\.{0,2}\//.test(s)) return s;               // ./x 或 ../x
  if (/^#/.test(s)) return s;
  return null;
}

function inline(s) {
  let out = esc(s);

  // 1) markdown 链接：绝对或站内相对都支持（站内相关案例依赖此项）
  out = out.replace(/\[([^\]\n]+)\]\(([^)\s]+)\)/g, (m, text, href) => {
    const safe = safeHref(href.replace(/&amp;/g, '&'));
    if (!safe) return text;                       // 不安全就退化成纯文本
    return `<a href="${esc(safe)}" target="_blank" rel="noopener nofollow">${text}</a>`;
  });

  // 2) 裸 URL 自动转链接（写作模板里有「🔗 https://…」这类裸地址）
  out = out.replace(/(?<!["'=;>])(https?:\/\/[^\s<)\]]+)/g, (m, u) => {
    const label = u.replace(/&amp;/g, '&');
    return `<a href="${u}" target="_blank" rel="noopener nofollow">${label}</a>`;
  });

  // 3) 粗体 / 斜体 / 行内代码
  out = out.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
  out = out.replace(/\*([^*]+)\*/g, '<em>$1</em>');
  out = out.replace(/`([^`]+)`/g, '<code style="background:#334155;padding:2px 6px;border-radius:4px">$1</code>');

  return out;
}

/** md → html。输入先整体转义，只白名单化我们自己的语法。 */
function render(md) {
  const lines = String(md ?? '').split('\n');
  const out = [];
  let para = [];
  let list = null;        // 'ul' | 'ol'
  let listItems = [];

  const flushPara = () => {
    if (para.length) { out.push(`<p>${inline(para.join(' '))}</p>`); para = []; }
  };
  const flushList = () => {
    if (list) {
      const style = list === 'ul' ? 'margin:.4rem 0 .8rem 1.2rem' : 'margin:.4rem 0 .8rem 1.4rem';
      out.push(`<${list} style="${style}">${listItems.join('')}</${list}>`);
      list = null; listItems = [];
    }
  };
  const flushAll = () => { flushPara(); flushList(); };

  for (const raw of lines) {
    const l = raw.trimEnd();

    if (l.startsWith('---') && l.replace(/-/g, '') === '') { flushAll(); out.push('<hr>'); continue; }
    if (l.startsWith('### ')) { flushAll(); out.push(`<h3>${inline(l.slice(4))}</h3>`); continue; }
    if (l.startsWith('## ')) { flushAll(); out.push(`<h2 style="color:#38bdf8;margin-top:1.5rem">${inline(l.slice(3))}</h2>`); continue; }
    if (l.startsWith('# ')) { flushAll(); out.push(`<h1 style="color:#f1f5f9">${inline(l.slice(2))}</h1>`); continue; }
    if (l.startsWith('> ')) { flushAll(); out.push(`<blockquote style="border-left:3px solid #38bdf8;padding-left:1rem;color:#94a3b8;font-size:.9rem">${inline(l.slice(2))}</blockquote>`); continue; }

    // 无序列表：- xxx / * xxx
    const ul = l.match(/^\s*[-*]\s+(.+)$/);
    if (ul) {
      flushPara();
      if (list !== 'ul') { flushList(); list = 'ul'; }
      listItems.push(`<li style="margin:.25rem 0">${inline(ul[1])}</li>`);
      continue;
    }
    // 有序列表：1. xxx / 1) xxx
    const ol = l.match(/^\s*\d+[.)]\s+(.+)$/);
    if (ol) {
      flushPara();
      if (list !== 'ol') { flushList(); list = 'ol'; }
      listItems.push(`<li style="margin:.25rem 0">${inline(ol[1])}</li>`);
      continue;
    }

    if (l === '') { flushAll(); continue; }
    flushList();
    para.push(l);
  }
  flushAll();
  return out.join('\n');
}

module.exports = { render, safeHref, inline };
