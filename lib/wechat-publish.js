// lib/wechat-publish.js —— 文章 → 微信草稿/发布 的桥接层
// 用法：
//   node lib/wechat-publish.js draft         仅建草稿（最安全，人工审核后在后台点发布）
//   node lib/wechat-publish.js publish [n]   建草稿并直接提交发布
//   node lib/wechat-publish.js status <id>   查发布结果
// 前置：IP 白名单。检测到 40164 时直接给出可执行结论，不伪造成功。
'use strict';
const fs = require('node:fs');
const path = require('node:path');
const { db, ROOT } = require('./db');
const { render } = require('./md');
const { cover } = require('./cover');
const wx = require('./wechat');
const audit = require('./audit');

const SITE_URL = process.env.OPS_SITE_URL || 'https://q785845530.github.io/ai-tools-intel/';
const COVER_DIR = path.join(ROOT, 'data', 'covers');

/** markdown → 微信可接受的内联样式 HTML
 *  关键：微信会剥离正文中的外部 <a> 超链接。为保证溯源可核验，
 *  把链接降级为「文字 + 明码 URL」的纯文本形式，读者可复制访问。 */
function toWechatHTML(md, title) {
  let inner = render(md);
  // <a href="URL" ...>text</a>  →  text（URL）
  inner = inner.replace(/<a [^>]*href="([^"]+)"[^>]*>([\s\S]*?)<\/a>/g,
    (_, url, text) => {
      const t = String(text).replace(/<[^>]+>/g, '').trim();
      const clean = url.replace(/&amp;/g, '&');
      // 太长的小尾巴（追踪参数）截断显示
      const short = clean.length > 96 ? clean.slice(0, 93) + '...' : clean;
      return `<span style="color:#576b95;word-break:break-all;">${t ? escapeHtml(t) + '　' : ''}${escapeHtml(short)}</span>`;
    });
  return `<div style="font-size:16px;line-height:1.75;color:#333;padding:0 4px;">
${inner}
<p style="margin-top:28px;padding-top:14px;border-top:1px solid #eee;font-size:13px;color:#999;line-height:1.7;">
本文由自动化系统基于公开数据聚合生成，重在提供行业信息面，不构成选型或投资建议。<br>
完整溯源与原文索引请见站点「阅读原文」入口。
</p>
</div>`;
}
function escapeHtml(s) {
  return String(s || '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

/** 确保封面文件存在（永久素材可复用，同一张封面只需上传一次） */
function ensureCover(variant = 'manufacturing') {
  fs.mkdirSync(COVER_DIR, { recursive: true });
  const f = path.join(COVER_DIR, `cover-${variant}.png`);
  if (!fs.existsSync(f)) fs.writeFileSync(f, cover({ variant }));
  return f;
}

/** 取待发布的文章（kind=daily 优先，其次 deep） */
function nextArticles(limit = 1) {
  const rows = db.prepare(`
    SELECT * FROM articles
    WHERE status IN ('ready','published') AND kind IN ('daily','deep')
    ORDER BY CASE kind WHEN 'daily' THEN 0 ELSE 1 END, created_at DESC, id DESC
    LIMIT ?
  `).all(limit);
  return rows;
}

async function makeDraft(articles) {
  const token = await wx.getToken();
  const coverFile = ensureCover('manufacturing');
  const thumbMediaId = await wx.uploadImage(token, coverFile);

  const payload = articles.map(a => ({
    title: a.title,
    content: toWechatHTML(a.body_md, a.title),
    digest: (a.dek || '').slice(0, 110),
    thumbMediaId,
    // 「阅读原文」指向公网站点，弥补微信正文剥离外链导致的溯源缺失
    sourceUrl: SITE_URL,
  }));
  const draftId = await wx.addDraft(token, payload);

  for (const a of articles) {
    db.prepare(`INSERT INTO publish_log (article_id, channel, status, detail, created_at) VALUES (?,?,?,?,?)`)
      .run(a.id, 'wechat', 'draft_created',
           JSON.stringify({ draftMediaId: draftId, title: a.title, cover: path.basename(coverFile) }),
           new Date().toISOString());
  }
  audit.log('info', 'wechat', 'bridge.draft.done', { draftId, articles: articles.map(a => a.id) });
  return { token, draftId };
}

async function run(mode = 'draft', limit = 1) {
  // 前置体检：白名单不通就别浪费调用
  const diag = await wx.diagnose();
  if (!diag.ok) {
    audit.log('error', 'wechat', 'publish.blocked', { step: diag.step, detail: diag.detail });
    return { ok: false, blocked: diag.step, detail: diag.detail, ip: diag.ip };
  }

  const arts = nextArticles(limit);
  if (!arts.length) return { ok: false, blocked: 'NO_ARTICLES', detail: '没有待发布的 daily/deep 文章' };

  const { token, draftId } = await makeDraft(arts);
  const out = { ok: true, draftId, articles: arts.map(a => ({ id: a.id, title: a.title })), published: null };

  if (mode === 'publish') {
    const publishId = await wx.publish(token, draftId);
    out.published = { publishId };
    for (const a of arts) {
      db.prepare(`INSERT INTO publish_log (article_id, channel, status, detail, created_at) VALUES (?,?,?,?,?)`)
        .run(a.id, 'wechat', 'submit_pending', JSON.stringify({ publishId, draftId }), new Date().toISOString());
    }
    // 轮询结果（最多 5 次，微信发布为异步）
    for (let i = 0; i < 5; i++) {
      await new Promise(r => setTimeout(r, 3000));
      try {
        const st = await wx.publishStatus(token, publishId);
        out.published.status = st.publish_status;
        audit.log('info', 'wechat', 'publish.status', { publishId, status: st.publish_status, msg: st.msg_data || null });
        if (String(st.publish_status) === '0') {
          out.published.ok = true;
          for (const a of arts) {
            db.prepare(`UPDATE articles SET status='published', published_at=? WHERE id=?`).run(new Date().toISOString(), a.id);
            db.prepare(`INSERT INTO publish_log (article_id, channel, status, detail, created_at) VALUES (?,?,?,?,?)`)
              .run(a.id, 'wechat', 'ok', JSON.stringify({ publishId }), new Date().toISOString());
          }
          break;
        }
        if (['2', '3', '4', '5'].includes(String(st.publish_status))) {
          out.published.ok = false;
          out.published.failReason = st.msg_data || st;
          audit.log('error', 'wechat', 'publish.failed', { publishId, status: st.publish_status, detail: st.msg_data || null });
          break;
        }
      } catch (e) {
        audit.log('warn', 'wechat', 'publish.poll.fail', { error: e.message });
      }
    }
  }
  return out;
}

module.exports = { run, makeDraft, ensureCover, toWechatHTML, nextArticles };

if (require.main === module) {
  const cmd = process.argv[2] || 'draft';
  const arg = process.argv[3];
  (async () => {
    if (cmd === 'status') {
      const token = await wx.getToken();
      const st = await wx.publishStatus(token, arg);
      console.log(JSON.stringify(st, null, 2));
      return;
    }
    const r = await run(cmd === 'publish' ? 'publish' : 'draft', parseInt(arg || '1', 10));
    console.log(JSON.stringify(r, null, 2));
    if (!r.ok) process.exitCode = 2;
  })().catch(e => { console.error('失败:', e.message); process.exit(1); });
}