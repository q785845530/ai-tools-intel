// lib/publish.js —— 多平台发布适配器
// 职责：把 articles 转成各平台可直接使用的形态，落盘 + 记 publish_log。
// 原则：有官方 API 的走 API（wechat，需凭据）；无 API 的产出「可一键复制」的成品文件 + 待办队列。
'use strict';
const fs = require('node:fs');
const path = require('node:path');
const { db, ROOT } = require('./db');
const audit = require('./audit');

const PUB_DIR = path.join(ROOT, 'content', 'published');

// ── 平台格式化规则 ───────────────────────────────────────────────────────
const PLATFORMS = {
  // 公众号：标题≤64，需摘要，正文保留 markdown 供编辑器转换
  wechat: {
    name: '微信公众号',
    mode: 'api',            // 有官方 API（需 appid/secret）
    ext: 'md',
    format(a) {
      const title = a.title.slice(0, 64);
      const summary = (a.dek || '').slice(0, 120);
      return `# ${title}\n\n> 摘要：${summary}\n\n${a.body_md}\n`;
    },
  },
  // 知乎：问答体，开头抛问题，适合长文
  zhihu: {
    name: '知乎',
    mode: 'queue',          // 无开放 API，走半自动队列
    ext: 'md',
    format(a) {
      const hook = a.kind === 'daily'
        ? '最近制造业 AI 落地有什么值得关注的动态？'
        : '这个 AI + 制造的方向，到底值不值得投入？';
      return `【知乎发布稿】\n\n建议开头提问：${hook}\n\n${a.body_md}\n\n---\n（原文溯源见文末链接，观点仅代表信息聚合，不构成投资建议）\n`;
    },
  },
  // 小红书：标题≤20，正文短，带 emoji 与话题标签
  xhs: {
    name: '小红书',
    mode: 'queue',
    ext: 'txt',
    format(a) {
      const title = a.title.replace(/[|｜]/g, ' ').slice(0, 20);
      const body = a.body_md
        .replace(/^#+ /gm, '')
        .replace(/\*\*/g, '')
        .replace(/\[🔗 原文\]\([^)]+\)/g, '🔗 原文见评论区')
        .replace(/\n{3,}/g, '\n\n')
        .slice(0, 900);
      return `【小红书笔记】\n标题：${title}\n\n${body}\n\n#智能制造 #工业AI #数字化转型 #制造业 #AI落地\n`;
    },
  },
  toutiao: {
    name: '今日头条',
    mode: 'queue',
    ext: 'md',
    format(a) {
      return `【头条发布稿】\n标题：${a.title.slice(0, 30)}\n\n${a.body_md}\n`;
    },
  },
};

/** 为单篇文章生成全平台成品 */
function adaptArticle(articleId) {
  const a = db.prepare('SELECT * FROM articles WHERE id = ?').get(articleId);
  if (!a) throw new Error(`article ${articleId} not found`);
  const made = [];
  for (const [key, p] of Object.entries(PLATFORMS)) {
    const dir = path.join(PUB_DIR, key);
    fs.mkdirSync(dir, { recursive: true });
    const file = path.join(dir, `${a.slug}.${p.ext}`);
    fs.writeFileSync(file, p.format(a), 'utf8');
    const rel = path.relative(ROOT, file);
    db.prepare(`INSERT INTO publish_log (article_id, channel, status, detail, created_at) VALUES (?,?,?,?,?)`)
      .run(a.id, key, p.mode === 'api' ? 'pending_api' : 'pending_manual',
           JSON.stringify({ file: rel, platform: p.name }), new Date().toISOString());
    made.push({ channel: key, platform: p.name, mode: p.mode, file: rel });
  }
  audit.log('info', 'publish', 'adapt.done', { articleId: a.id, slug: a.slug, channels: made.map(m => m.channel) });
  return made;
}

/** 批量：所有 ready 文章生成全平台成品，并标记 published */
function adaptBatch(limit = 20) {
  // 只给 relevance=ok 的文章生成全平台成品。
  // 缺这个条件时，被下架（relevance=off）的稿子照样会产出微信/知乎/小红书/头条成品，
  // 等于「站点上删了，成品稿里还在」——实测下架后仍有 22 篇 off 文章躺在发布队列里。
  const arts = db.prepare("SELECT id FROM articles WHERE relevance = 'ok' AND status IN ('ready','published') ORDER BY created_at DESC LIMIT ?").all(limit);
  const all = [];
  for (const { id } of arts) {
    try { all.push({ id, channels: adaptArticle(id) }); }
    catch (e) { audit.log('error', 'publish', 'adapt.fail', { articleId: id, error: e.message }); }
  }
  db.prepare("UPDATE articles SET status = 'published', published_at = COALESCE(published_at, ?) WHERE status = 'ready' AND relevance = 'ok'")
    .run(new Date().toISOString());
  audit.log('info', 'publish', 'batch.done', { articles: all.length });
  return all;
}

/** 待人工发布的队列（哪些稿子还没发出去） */
function queue() {
  return db.prepare(`
    SELECT p.id, p.article_id, p.channel, p.status, p.detail, p.created_at, a.title
    FROM publish_log p JOIN articles a ON a.id = p.article_id
    WHERE p.status IN ('pending_manual','pending_api')
    ORDER BY p.created_at DESC LIMIT 100
  `).all().map(r => ({ ...r, detail: safeParse(r.detail) }));
}

function safeParse(s) { try { return JSON.parse(s); } catch { return { raw: s }; } }

module.exports = { adaptBatch, adaptArticle, queue, PLATFORMS, PUB_DIR };

if (require.main === module) {
  const cmd = process.argv[2] || 'adapt';
  if (cmd === 'adapt') console.log(JSON.stringify(adaptBatch(), null, 2));
  else if (cmd === 'queue') console.log(JSON.stringify(queue(), null, 2));
}