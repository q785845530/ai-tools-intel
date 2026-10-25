// lib/md.js —— 极简 Markdown 渲染（零依赖）：支持 h1-h3、**粗体**、*斜体*、[链接](url)、> 引用、--- 分隔线、段落
'use strict';

function esc(s) {
  return String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

function inline(s) {
  let out = esc(s);
  out = out.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
  out = out.replace(/\*([^*]+)\*/g, '<em>$1</em>');
  out = out.replace(/\[([^\]]+)\]\((https?:[^)\s]+)\)/g, '<a href="$2" target="_blank" rel="noopener nofollow">$1</a>');
  out = out.replace(/`([^`]+)`/g, '<code style="background:#334155;padding:2px 6px;border-radius:4px">$1</code>');
  return out;
}

/** md → html。输入先整体转义，只白名单化我们自己的语法。 */
function render(md) {
  const lines = String(md ?? '').split('\n');
  const out = [];
  let para = [];
  const flush = () => { if (para.length) { out.push(`<p>${inline(para.join(' '))}</p>`); para = []; } };

  for (const raw of lines) {
    const l = raw.trimEnd();
    if (l.startsWith('---') && l.replace(/-/g, '') === '') { flush(); out.push('<hr>'); continue; }
    if (l.startsWith('### ')) { flush(); out.push(`<h3>${inline(l.slice(4))}</h3>`); continue; }
    if (l.startsWith('## ')) { flush(); out.push(`<h2 style="color:#38bdf8;margin-top:1.5rem">${inline(l.slice(3))}</h2>`); continue; }
    if (l.startsWith('# ')) { flush(); out.push(`<h1 style="color:#f1f5f9">${inline(l.slice(2))}</h1>`); continue; }
    if (l.startsWith('> ')) { flush(); out.push(`<blockquote style="border-left:3px solid #38bdf8;padding-left:1rem;color:#94a3b8;font-size:.9rem">${inline(l.slice(2))}</blockquote>`); continue; }
    if (l === '') { flush(); continue; }
    para.push(l);
  }
  flush();
  return out.join('\n');
}

module.exports = { render };
