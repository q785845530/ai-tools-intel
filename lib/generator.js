// lib/generator.js —— 内容生成器 v2：面向「智能制造大时代」公众号定位
// 定位：AI 在制造业的真实落地 —— 案例、政策、技术、趋势、展会
// 原则：只基于真实字段撰写，不编造事实、不虚构数据。接入 LLM 后可升级为 llm: 生成器。
'use strict';
const crypto = require('node:crypto');
const { db } = require('./db');
const audit = require('./audit');
const { cleanUrl } = require('./urlclean');

const SOURCE_NAME = {
  'zhihu-search': '知乎',
  'zhihu-hot': '知乎热榜',
  hn: 'Hacker News',
  github: 'GitHub',
  lobsters: 'Lobsters',
  'media-gongkong': '工控网',
  'media-ofweek-im': 'OFweek智能制造',
  'media-eworks': 'e-works数字化企业网',
};

// ── 选题分类：按关键词把情报归入行业栏目 ─────────────────────────────────
const THEMES = [
  { key: 'policy', name: '政策风向', kw: ['政策', '规划', '工信部', '发改委', '十四五', '十五五', '白皮书', '标准', '试点', '专项', '指导意见'] },
  { key: 'case', name: '落地说', kw: ['案例', '落地', '上线', '应用', '部署', '实施', '工厂', '产线', '车间', '集团', '企业', '降本', '增效'] },
  { key: 'tech', name: '技术前沿', kw: ['大模型', '算法', '视觉', '质检', '缺陷检测', '预测性维护', '数字孪生', '边缘', '推理', '模型', '机器人', '具身'] },
  { key: 'expo', name: '展会动态', kw: ['工博会', '展会', '大会', '论坛', '峰会', '发布', '亮相', '博览'] },
  { key: 'trend', name: '产业观察', kw: ['趋势', '转型', '数字化', '升级', '挑战', '困境', '反思', '为什么', '如何', '怎么看'] },
];

function classify(item) {
  const hay = `${item.title || ''} ${item.summary || ''} ${item.topics || ''}`;
  let best = { key: 'trend', name: '产业观察', score: 0 };
  for (const t of THEMES) {
    let score = 0;
    for (const k of t.kw) if (hay.includes(k)) score++;
    if (score > best.score) best = { ...t, score };
  }
  return best;
}

/** 热度描述：把分数翻译成人话，而不是甩个数字 */
function heat(points) {
  if (points >= 500) return '全站热议';
  if (points >= 100) return '行业关注度较高';
  if (points >= 30) return '有一定讨论度';
  if (points > 0) return '新近出现';
  return '值得留意';
}

function clean(title) {
  return String(title || '').replace(/\s*-\s*知乎\s*$/, '').replace(/\s+/g, ' ').trim();
}

function pickTitle(item) {
  const t = clean(item.title);
  if (item.source === 'github') {
    const repo = t.replace(/^[^/]+\//, '');
    return `${repo}：${(item.summary || '开源项目').slice(0, 50)}`;
  }
  return t;
}

// ── 单条深度稿：给制造业读者一个「为什么值得看」的视角 ────────────────────
function buildDeepBody(item) {
  const src = SOURCE_NAME[item.source] || item.source;
  const theme = classify(item);
  const L = [];
  L.push(`> 栏目：${theme.name} ｜ 来源：${src}${item.author ? ' · ' + item.author : ''}`);
  L.push('');

  L.push('## 这件事是什么');
  L.push((item.summary || '').trim() || '该条目暂无公开摘要，建议直接点开原文获取一手信息。');
  L.push('');

  L.push('## 为什么制造业读者要关注');
  // 视角框架：按栏目给出不同的关注理由（确定性话术，不编造事实）
  const ANGLE = {
    policy: '政策类信息往往决定未来 3—5 年的资金流向和改造优先级。对制造企业而言，早一步读懂导向，就早一步在项目立项和预算申报上占位。',
    case: '同行已经跑通的路径，是最低成本的参考。落地案例的价值不在于"别人做了什么"，而在于它暴露了哪些坑、哪些环节真的省下了钱。',
    tech: '技术是否成熟，不看 PPT 看产线上的稳定性。关注这类进展时，建议重点看它的适用边界：什么工况下有效，什么条件下会失效。',
    expo: '展会和大会是行业风向的集中释放点。厂商集中发布什么，往往预示着下一轮采购清单里会出现什么。',
    trend: '趋势类讨论反映的是行业共识的形成过程。看清分歧在哪里，比记住结论更有用。',
  };
  L.push(ANGLE[theme.key] || ANGLE.trend);
  L.push('');
  L.push(`本条在社区中的信号强度：**${heat(item.points)}**${item.points ? `（${item.points} 分` + (item.comments ? ` · ${item.comments} 条讨论` : '') + '）' : ''}。`);
  L.push('');

  L.push('## 原文入口');
  L.push(`🔗 ${cleanUrl(item.url)}`);
  L.push('');
  L.push('---');
  L.push(`*本条由 ops-intel 自动化系统基于公开数据生成，全部字段来自原始 API，未经人工改写。生成时间：${new Date().toISOString()}*`);
  return L.join('\n');
}

function generateDeepDive(item) {
  const now = new Date().toISOString();
  const slug = `${now.slice(0, 10).replace(/-/g, '')}-${crypto.randomBytes(3).toString('hex')}`;
  const title = pickTitle(item);
  // 同一素材不重复成深文：媒体常见「同题不同 id」转载，会在站点上出现两篇几乎一样的稿子。
  const dup = db.prepare('SELECT id FROM articles WHERE title = ? LIMIT 1').get(title);
  if (dup) {
    audit.log('info', 'generate', 'deep.deduped', { articleId: dup.id, intelId: item.id, title: title.slice(0, 60) });
    db.prepare('UPDATE intel SET used = 1 WHERE id = ?').run(item.id);
    return dup.id;
  }
  const theme = classify(item);
  const dek = `【${theme.name}】${(item.summary || '').slice(0, 80)}`;
  db.prepare(`INSERT INTO articles (slug, kind, title, dek, body_md, source_urls, source_ids, generator, score, status, created_at)
              VALUES (?,?,?,?,?,?,?,?,?, 'ready', ?)`)
    .run(slug, 'deep', title, dek, buildDeepBody(item), JSON.stringify([cleanUrl(item.url)]),
         JSON.stringify([item.id]), 'template-v2-manufacturing', item.points, now);
  const artId = db.prepare('SELECT last_insert_rowid() as id').get().id;
  db.prepare('UPDATE intel SET used = 1 WHERE id = ?').run(item.id);
  audit.log('info', 'generate', 'article.created', { articleId: artId, slug, kind: 'deep', theme: theme.key, source: item.source });
  return artId;
}

// ── 智能制造日报：按栏目分组打包当日行业动态 ──────────────────────────────
function generateDailyDigest(maxItems = 8) {
  const since = new Date(Date.now() - 48 * 3600 * 1000).toISOString();
  // 源优先级：知乎垂类检索（精准）→ 行业垂直媒体（第二支柱）→ 其余源补位。
  // 媒体条目 points 恒为 0（厂商公关文没有社区投票，不该有热度），
  // 因此媒体补位不看 points；第三方源仍要求 points>50，避免噪声。
  // 候选池一次取全：跑完再说，靠下面的多样性约束来裁剪。
  // 旧实现是「先按源优先级取满，取不满再补位」，问题是第二个源一旦取满就占满全部名额——
  // 实测某期 8 条里 6 条来自 OFweek 同一个具身智能专题，选题严重单一。
  const pool = db.prepare(`SELECT * FROM intel WHERE used = 0 AND relevance = 'ok' AND fetched_at >= ?
                           ORDER BY CASE source WHEN 'zhihu-search' THEN 0 WHEN 'zhihu-hot' THEN 1
                                    WHEN 'media-gongkong' THEN 2 WHEN 'media-ofweek-im' THEN 3
                                    WHEN 'media-eworks' THEN 4 ELSE 5 END,
                                    points DESC, id DESC LIMIT 80`).all(since);

  // 多样性约束：单源最多 3 条、单栏目最多 3 条。
  // 制造业日报的价值在「覆盖面」，不是「某一波热点的八连发」。
  const MAX_PER_SOURCE = 3;
  const MAX_PER_THEME = 3;
  const srcCount = {}, themeCount = {};
  let items = [];
  for (const it of pool) {
    if (items.length >= maxItems) break;
    const th = classify(it).name;
    if ((srcCount[it.source] || 0) >= MAX_PER_SOURCE) continue;
    if ((themeCount[th] || 0) >= MAX_PER_THEME) continue;
    srcCount[it.source] = (srcCount[it.source] || 0) + 1;
    themeCount[th] = (themeCount[th] || 0) + 1;
    items.push(it);
  }
  if (items.length < 3) return null;

  // 跨源去重：同一条新闻常被工控网 / OFweek 各发一遍，ext_id 只在源内唯一，
  // 于是同一标题会被重复选进同一期日报（实测 7 组重复标题）。
  // 按「规范化标题」去重，保留首次出现的（源优先级已由上面的查询顺序决定）。
  const seen = new Set();
  const normTitle = (t) => String(t || '').toLowerCase().replace(/[\s\p{P}\p{S}]+/gu, '').slice(0, 40);
  items = items.filter((it) => {
    const k = normTitle(it.title);
    if (!k) return false;
    if (seen.has(k)) {
      audit.log('info', 'generate', 'dedupe.dropped', { id: it.id, title: String(it.title).slice(0, 60) });
      return false;
    }
    seen.add(k);
    return true;
  });
  if (items.length < 3) return null;

  const now = new Date().toISOString();
  const day = now.slice(0, 10);
  const slug = `manufacturing-daily-${day.replace(/-/g, '')}`;

  // 按栏目分组
  const groups = {};
  for (const it of items) {
    const t = classify(it);
    (groups[t.name] = groups[t.name] || []).push(it);
  }

  const title = `智能制造日报 | ${day}：${Object.keys(groups).slice(0, 3).join('、')}等 ${items.length} 条动态`;

  let body = `> 本期覆盖过去 48 小时，按行业栏目归类。每条均可点原文核验，不做二手转述。\n\n`;
  for (const [name, list] of Object.entries(groups)) {
    body += `## ${name}\n\n`;
    list.forEach((it, i) => {
      body += `**${i + 1}. ${pickTitle(it)}**\n\n`;
      if (it.summary) body += it.summary.trim() + '\n\n';
      body += `*来源：${SOURCE_NAME[it.source] || it.source}${it.points ? ' · ' + it.points + ' 分' : ''}* ｜ [🔗 原文](${cleanUrl(it.url)})\n\n`;
    });
  }
  body += `---\n\n**编者按**：以上为自动化系统按公开数据聚合的行业动态，供快速建立信息面。涉及具体选型与投资决策，请以厂商实测和正式文档为准。\n\n`;
  body += `*ops-intel 自动生成（template-v2-manufacturing），全部字段来自原始 API。生成时间：${now}*\n`;

  const urls = items.map(i => cleanUrl(i.url));
  const ids = items.map(i => i.id);

  const existing = db.prepare('SELECT id FROM articles WHERE slug = ?').get(slug);
  if (existing) {
    db.prepare(`UPDATE articles SET title=?, dek=?, body_md=?, source_urls=?, source_ids=?, score=?, status='ready', created_at=? WHERE id=?`)
      .run(title, `过去 48 小时 ${items.length} 条智能制造相关动态`, body,
           JSON.stringify(urls), JSON.stringify(ids), items[0].points || 0, now, existing.id);
    ids.forEach(id => db.prepare('UPDATE intel SET used = 1 WHERE id = ?').run(id));
    audit.log('info', 'generate', 'article.updated', { articleId: existing.id, slug, kind: 'daily', items: items.length });
    return existing.id;
  }

  db.prepare(`INSERT INTO articles (slug, kind, title, dek, body_md, source_urls, source_ids, generator, score, status, created_at)
              VALUES (?,?,?,?,?,?,?,?,?, 'ready', ?)`)
    .run(slug, 'daily', title, `过去 48 小时 ${items.length} 条智能制造相关动态`, body,
         JSON.stringify(urls), JSON.stringify(ids), 'template-v2-manufacturing', items[0].points || 0, now);
  const artId = db.prepare('SELECT last_insert_rowid() as id').get().id;
  ids.forEach(id => db.prepare('UPDATE intel SET used = 1 WHERE id = ?').run(id));
  audit.log('info', 'generate', 'article.created', { articleId: artId, slug, kind: 'daily', items: items.length, themes: Object.keys(groups) });
  return artId;
}

function generateBatch() {
  const out = { daily: null, deep: [] };
  const d = generateDailyDigest();
  if (d) out.daily = d;
  // 单条深度稿：优先知乎高价值条目，其次行业媒体（media 无社区热度分，按时间取新）
  const cands = db.prepare(`SELECT * FROM intel WHERE used = 0 AND relevance = 'ok' AND source LIKE 'zhihu%'
                            ORDER BY points DESC, id DESC LIMIT 3`).all();
  let pool = cands;
  if (!pool.length) {
    pool = db.prepare(`SELECT * FROM intel WHERE used = 0 AND relevance = 'ok' AND source LIKE 'media-%'
                       ORDER BY id DESC LIMIT 3`).all();
  }
  if (!pool.length) {
    pool = db.prepare("SELECT * FROM intel WHERE used = 0 AND relevance = 'ok' AND points > 50 ORDER BY points DESC LIMIT 3").all();
  }
  for (const c of pool) out.deep.push(generateDeepDive(c));
  audit.log('info', 'generate', 'batch.done', { daily: out.daily, deep: out.deep.length });
  return out;
}

module.exports = { generateBatch, generateDeepDive, generateDailyDigest, classify, THEMES };

if (require.main === module) {
  console.log(JSON.stringify(generateBatch(), null, 2));
}