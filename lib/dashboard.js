// lib/dashboard.js —— 运营看板（服务端动态渲染，实时反映 DB + 审计链状态）
'use strict';
const { db } = require('./db');
const audit = require('./audit');
const { queue } = require('./publish');

function esc(s) {
  return String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

function html() {
  const v = audit.verify();
  const intelTotal = db.prepare('SELECT COUNT(*) c FROM intel').get().c;
  const intelUnused = db.prepare('SELECT COUNT(*) c FROM intel WHERE used = 0').get().c;
  const artTotal = db.prepare('SELECT COUNT(*) c FROM articles').get().c;
  const artPub = db.prepare("SELECT COUNT(*) c FROM articles WHERE status='published'").get().c;
  const q = queue();
  const recent = audit.tail(25).reverse();

  const byChannel = db.prepare('SELECT channel, status, COUNT(*) n FROM publish_log GROUP BY channel, status').all();

  const stat = (label, val, sub = '') =>
    `<div class="stat"><div class="val">${val}</div><div class="lbl">${label}</div>${sub ? `<div class="sub">${sub}</div>` : ''}</div>`;

  const rows = q.slice(0, 30).map(r =>
    `<tr><td>${esc(r.channel)}</td><td><a href="/article-${r.article_id}.html" target="_blank">${esc(String(r.title).slice(0, 46))}</a></td>
     <td><span class="st ${r.status === 'pending_api' ? 'api' : 'man'}">${esc(r.status)}</span></td>
     <td class="file">${esc(r.detail.file || '')}</td>
     <td class="t">${esc((r.created_at || '').slice(5, 16))}</td></tr>`).join('');

  const logRows = recent.map(r =>
    `<tr><td class="t">${esc((r.ts || '').slice(5, 19))}</td><td><span class="lv lv-${r.level}">${esc(r.level)}</span></td>
     <td>${esc(r.actor)}</td><td>${esc(r.event)}</td><td class="file">${esc(JSON.stringify(r.data || {}).slice(0, 110))}</td></tr>`).join('');

  const chRows = byChannel.map(r => `<tr><td>${esc(r.channel)}</td><td>${esc(r.status)}</td><td>${r.n}</td></tr>`).join('');

  return `<!DOCTYPE html>
<html lang="zh-CN"><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<meta http-equiv="refresh" content="60">
<title>运营看板 - ops 自动运营平台</title>
<style>
*{box-sizing:border-box;margin:0;padding:0}
body{font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,sans-serif;background:#0b1120;color:#e2e8f0;padding:1.5rem;line-height:1.6}
h1{font-size:1.4rem;color:#38bdf8;margin-bottom:.3rem}
.subt{color:#64748b;font-size:.85rem;margin-bottom:1.5rem}
.stats{display:grid;grid-template-columns:repeat(auto-fit,minmax(140px,1fr));gap:.8rem;margin-bottom:1.5rem}
.stat{background:#1e293b;border-radius:8px;padding:1rem;text-align:center;border-top:2px solid #38bdf8}
.val{font-size:1.6rem;font-weight:700;color:#f1f5f9}
.lbl{font-size:.78rem;color:#94a3b8}
.sub{font-size:.7rem;color:#64748b;margin-top:.2rem}
.panel{background:#111c2e;border-radius:8px;padding:1rem;margin-bottom:1.5rem;overflow-x:auto}
.panel h2{font-size:1rem;color:#cbd5e1;margin-bottom:.8rem;border-bottom:1px solid #1e293b;padding-bottom:.4rem}
table{width:100%;border-collapse:collapse;font-size:.8rem}
th{text-align:left;color:#64748b;font-weight:500;padding:.3rem .5rem;border-bottom:1px solid #1e293b}
td{padding:.3rem .5rem;border-bottom:1px solid #16233a;vertical-align:top}
a{color:#38bdf8;text-decoration:none}a:hover{text-decoration:underline}
.st{padding:1px 6px;border-radius:3px;font-size:.7rem}
.st.man{background:#78350f;color:#fcd34d}.st.api{background:#1e3a5f;color:#7dd3fc}
.file{color:#64748b;font-size:.72rem;font-family:ui-monospace,monospace}
.t{color:#64748b;font-family:ui-monospace,monospace;white-space:nowrap}
.lv{padding:1px 5px;border-radius:3px;font-size:.7rem}
.lv-info{background:#14532d;color:#86efac}.lv-warn{background:#78350f;color:#fcd34d}.lv-error{background:#7f1d1d;color:#fca5a5}
.chain{padding:.6rem 1rem;border-radius:6px;margin-bottom:1.5rem;font-size:.85rem}
.chain.ok{background:#052e16;border-left:3px solid #22c55e;color:#86efac}
.chain.bad{background:#450a0a;border-left:3px solid #ef4444;color:#fca5a5}
</style></head><body>
<h1>⚙️ ops 自动运营平台 · 运营看板</h1>
<div class="subt">生成时间 ${new Date().toISOString()} · 每 60 秒自动刷新 · <a href="/">← 回到站点</a></div>

<div class="chain ${v.ok ? 'ok' : 'bad'}">
${v.ok ? '✅' : '❌'} 审计链完整性：${v.ok ? '完整' : `异常（${v.problems.length} 处）`} · 共 ${v.checked} 条记录 · 链头 seq=${v.head.seq}
${v.ok ? '' : '<br>' + v.problems.slice(0, 5).map(esc).join('<br>')}
</div>

<div class="stats">
${stat('情报总量', intelTotal, `未消费 ${intelUnused}`)}
${stat('原创文章', artTotal, `已发布 ${artPub}`)}
${stat('待发队列', q.length, '多平台')}
${stat('审计记录', v.checked, `seq=${v.head.seq}`)}
</div>

<div class="panel"><h2>📤 待发布队列（人工平台一键复制 / API 平台待授权）</h2>
<table><tr><th>渠道</th><th>文章</th><th>状态</th><th>成品文件</th><th>生成时间</th></tr>${rows || '<tr><td colspan=5>队列为空</td></tr>'}</table></div>

<div class="panel"><h2>📊 各渠道发布统计</h2>
<table><tr><th>渠道</th><th>状态</th><th>数量</th></tr>${chRows}</table></div>

<div class="panel"><h2>🧾 审计日志（最近 25 条，哈希链逐条可验）</h2>
<table><tr><th>时间</th><th>级别</th><th>执行者</th><th>事件</th><th>数据</th></tr>${logRows}</table></div>

</body></html>`;
}

module.exports = { html };