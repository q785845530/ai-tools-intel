// lib/generator.js —— 内容生成器（模板引擎 v1：只基于真实字段撰写，绝不编造事实）
// 接入 LLM key 后同接口升级为 llm: 生成器，此处保留插拔位。
'use strict';
const crypto = require('node:crypto');
const { db } = require('./db');
const audit = require('./audit');

// 平台话术（确定性，可审计：每个说法都能对应到一个真实字段）
const SOURCE_NAME = { hn: 'Hacker News', github: 'GitHub', lobsters: 'Lobsters' };
const HYPE_TIER = (score) =>
  score >= 800 ? '热度极高' : score >= 300 ? '热度很高' : score >= 100 ? '热度较高' : '值得关注';

function pickTitle(item) {
  if (item.source === 'github') return `${item.title.replace(/^[^/]+\//, '')}：${(item.summary || '一个开源项目').slice(0, 60)}`;
  return item.title;
}

function buildBody(item) {
  const src = SOURCE_NAME[item.source] || item.source;
  const lines = [];
  lines.push(`> 来源：${src} · 原作者 ${item.author} · 热度 ${item.points > 0 ? item.points + ' 分' : '—'}`);
  lines.push('');
  const s = (item.summary || '').trim();
  if (s) {
    lines.push('## 它是什么');
    lines.push(s);
    lines.push('');
  } else {
    lines.push('## 它是什么');
    lines.push('该项目/话题暂无公开摘要，以下是社区讨论入口，值得直接点开看一手信息。');
    lines.push('');
  }
  lines.push('## 为什么值得关注');
  lines.push(`${src} 社区给出了 **${HYPE_TIER(item.points)}** 的信号${item.comments ? `，另有 ${item.comments} 条讨论` : ''}。${item.topics ? `标签：${item.topics}。` : ''}以下为原文，判断留给读者：`);
  lines.push('');
  lines.push(`**🔗 原文地址**：${item.url}`);
  lines.push('');
  lines.push('---');
  lines.push(`*本条由 ops-intel 自动化系统生成（template-v1），全部内容字段来自公开 API 的原始数据，未经人工编辑。生成时间：${new Date().toISOString()}*`);
  return lines.join('\n');
}

// 生成一篇「单条速递」。返回 article 行或 null
function generateItemArticle(item) {
  const now = new Date().toISOString();
  const slug = `${now.slice(0, 10).replace(/-/g, '')}-${crypto.randomBytes(3).toString('hex')}`;
  const title = pickTitle(item);
  const dek = item.summary ? item.summary.slice(0, 100) : `来自 ${SOURCE_NAME[item.source]} 的热门条目`;
  const body = buildBody(item);

  db.prepare(`INSERT INTO articles (slug, kind, title, dek, body_md, source_urls, source_ids, generator, score, status, created_at)
              VALUES (?,?,?,?,?,?,?,?,?, 'ready', ?)`)
    .run(slug, 'tool', title, dek, body, JSON.stringify([item.url]), JSON.stringify([item.id]), 'template-v1', item.points, now);

  const artId = db.prepare('SELECT last_insert_rowid() as id').get().id;
  db.prepare('UPDATE intel SET used = 1 WHERE id = ?').run(item.id);
  audit.log('info', 'generate', 'article.created', { articleId: artId, slug, kind: 'tool', sourceItem: item.id, source: item.source });
  return artId;
}

// 生成一篇「每日精选」：取过去 24h 内未消费、热度最高的 N 条打包
function generateDailyDigest(n = 5) {
  const since = new Date(Date.now() - 24 * 3600000).toISOString();
  const items = db.prepare(`SELECT * FROM intel WHERE used = 0 AND points > 0 AND fetched_at >= ? ORDER BY points DESC LIMIT ?`)
    .all(since, n);
  if (items.length < 3) return null; // 素材不足不硬凑

  const now = new Date().toISOString();
  const slug = `digest-${now.slice(0, 10).replace(/-/g, '')}`;
  const title = `AI 工具速递 | ${now.slice(0, 10)}：过去 24 小时最热的 ${items.length} 个动态`;
  const urls = items.map(i => i.url);

  let body = `> 本速递覆盖过去 24 小时，按社区热度排序。每条均可点原文核验。\n\n`;
  items.forEach((it, idx) => {
    body += `## ${idx + 1}. ${pickTitle(it)}\n`;
    body += `*${SOURCE_NAME[it.source]} · ${it.points} 分${it.comments ? ` · ${it.comments} 评论` : ''}*\n\n`;
    body += (it.summary ? it.summary + '\n\n' : '') + `[🔗 原文](${it.url})\n\n`;
  });
  body += `---\n*ops-intel 自动生成（template-v1），全部字段来自公开 API 原始数据。生成时间：${now}*\n`;

  // 当日精选幂等更新：同一天重跑不报错，内容随情报滚动刷新
  const existing = db.prepare('SELECT id FROM articles WHERE slug = ?').get(slug);
  if (existing) {
    db.prepare(`UPDATE articles SET title=?, dek=?, body_md=?, source_urls=?, source_ids=?, score=?, status='ready', created_at=? WHERE id=?`)
      .run(title, `过去 24 小时最热的 ${items.length} 个 AI 工具动态`, body,
           JSON.stringify(urls), JSON.stringify(items.map(i => i.id)), items[0].points, now, existing.id);
    items.forEach(i => db.prepare('UPDATE intel SET used = 1 WHERE id = ?').run(i.id));
    audit.log('info', 'generate', 'article.updated', { articleId: existing.id, slug, kind: 'digest', items: items.length });
    return existing.id;
  }

  db.prepare(`INSERT INTO articles (slug, kind, title, dek, body_md, source_urls, source_ids, generator, score, status, created_at)
              VALUES (?,?,?,?,?,?,?,?,?, 'ready', ?)`)
    .run(slug, 'digest', title, `过去 24 小时最热的 ${items.length} 个 AI 工具动态`, body,
         JSON.stringify(urls), JSON.stringify(items.map(i => i.id)), 'template-v1', items[0].points, now);
  const artId = db.prepare('SELECT last_insert_rowid() as id').get().id;
  items.forEach(i => db.prepare('UPDATE intel SET used = 1 WHERE id = ?').run(i.id));
  audit.log('info', 'generate', 'article.created', { articleId: artId, slug, kind: 'digest', items: items.length, sourceItems: items.map(i => i.id) });
  return artId;
}

// 每轮生成：1 篇每日精选（如素材够）+ 若干单条速递（补足当日产出）
function generateBatch() {
  const out = { digest: null, items: [] };
  const d = generateDailyDigest();
  if (d) out.digest = d;
  // 单条速递：未消费且热度>50 的前 3 条
  const cands = db.prepare('SELECT * FROM intel WHERE used = 0 AND points > 50 ORDER BY points DESC LIMIT 3').all();
  for (const c of cands) out.items.push(generateItemArticle(c));
  audit.log('info', 'generate', 'batch.done', { digest: out.digest, items: out.items.length });
  return out;
}

module.exports = { generateBatch, generateItemArticle, generateDailyDigest };

if (require.main === module) {
  console.log(JSON.stringify(generateBatch(), null, 2));
}
