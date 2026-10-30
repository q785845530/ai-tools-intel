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

// ── 核心观点提取（确定性摘句，不生成不编造） ─────────────────────────────
// 设计约束：零依赖、无 LLM，所以「提取」只能是**从原文摘要里选句**，绝不能改写事实。
// 评分维度：导语位置 / 含数字（事实密度）/ 含业务动作动词 / 含量化词；过长句降权。
const ACTION_WORDS = /(发布|上线|投产|中标|签约|荣获|获评|推出|亮相|落地|开工|交付|获批|启动|达成|披露|完成|实现)/;
const QUANT_WORDS = /(同比|环比|增长|下降|提升|降低|占比|份额|营收|净利|产能|效率|成本|良率|废品率|规模|投资|订单)/;

function splitSentences(text) {
  return String(text || '')
    .replace(/\s+/g, ' ')
    .split(/(?<=[。！？；!?;])/)
    .map((x) => x.trim())
    .filter((x) => x.length >= 12);
}

/** 从摘要里选 1—3 句作为核心观点；选不出就退回标题，绝不编造 */
function extractKeyPoints(item, max = 3) {
  const text = String(item.summary || '').trim();
  if (!text) return [clean(item.title)];
  const sents = splitSentences(text);
  if (sents.length <= max) return sents;
  const scored = sents.map((sen, i) => {
    let sc = 0;
    if (i === 0) sc += 2;                    // 首句通常是导语
    if (/\d/.test(sen)) sc += 2;             // 含数字 = 事实密度高
    if (ACTION_WORDS.test(sen)) sc += 2;     // 业务动作
    if (QUANT_WORDS.test(sen)) sc += 1;      // 量化描述
    if (sen.length > 100) sc -= 1;           // 过长句可读性差
    return { sen, sc, i };
  });
  return scored
    .sort((a, b) => b.sc - a.sc || a.i - b.i)
    .slice(0, max)
    .sort((a, b) => a.i - b.i)
    .map((x) => x.sen);
}

// ── 实例分析素材：抓「数字 + 单位」及其左语境（只摘不改） ────────────────
const NUM_RE = /([\u4e00-\u9fa5A-Za-z]{0,12}?)(\d+(?:\.\d+)?)(\s*(?:%|％|亿元|万元|万套|万件|万台|万辆|万吨|个百分点|亿|万|套|台|件|辆|吨|倍|项|款|家|条|人))/g;
const DATE_NOISE = /^(\d{1,2}月\d{1,2}|\d{4}年?|\d{1,2}日)$/;

function extractFacts(text, max = 3) {
  const out = [];
  const seen = new Set();
  let m;
  NUM_RE.lastIndex = 0;
  while ((m = NUM_RE.exec(String(text || ''))) && out.length < max) {
    const ctx = (m[1] || '').slice(-12).trim();
    // 过滤日期/年份/编号类噪声，只留承载业务量的数字
    if (DATE_NOISE.test(ctx) || DATE_NOISE.test(ctx + m[2])) continue;
    const key = ctx + m[2] + m[3];
    if (seen.has(key)) continue;
    seen.add(key);
    out.push({ ctx: ctx || '（见原文）', num: m[2], unit: m[3].trim() });
  }
  return out;
}

// ── 站内相关案例：按标题 2-gram 重叠找同主题已发布文章（真实库内交叉引用） ──
function titleGrams(t) {
  const s = String(t || '').toLowerCase().replace(/[\s\p{P}\p{S}]+/gu, '');
  const g = new Set();
  for (let i = 0; i < s.length - 1; i++) g.add(s.slice(i, i + 2));
  return g;
}

function keyTitle(t) {
  return String(t || '').toLowerCase().replace(/[\s\p{P}\p{S}]+/gu, '').slice(0, 40);
}

function relatedCases(title, excludeId, limit = 3) {
  const rows = db.prepare(
    "SELECT id, title FROM articles WHERE relevance = 'ok' AND status IN ('ready','published') AND id != ? ORDER BY id DESC LIMIT 150"
  ).all(excludeId || -1);
  const cur = titleGrams(title);
  if (!cur.size) return [];

  // 同标题去重：历史遗留的同题转载会让「相关案例」列出两条一模一样的标题。
  // rows 已按 id DESC 排序，首次出现即最新一篇。
  const seen = new Set();
  const uniq = rows.filter((r) => {
    const k = keyTitle(r.title);
    if (!k || seen.has(k)) return false;
    seen.add(k);
    return true;
  });

  return uniq
    .map((r) => {
      let hit = 0;
      for (const g of titleGrams(r.title)) if (cur.has(g)) hit++;
      return { id: r.id, title: r.title, hit };
    })
    .filter((r) => r.hit >= 3)
    .sort((a, b) => b.hit - a.hit)
    .slice(0, limit);
}

// ── 单条深度稿：核心观点 → 内容概要 → 实例分析 → 相关案例 → 原文入口 ──────
function buildDeepBody(item, selfId) {
  const src = SOURCE_NAME[item.source] || item.source;
  const theme = classify(item);
  const url = cleanUrl(item.url);
  const title = clean(item.title);
  const L = [];
  L.push(`> 栏目：${theme.name} ｜ 来源：${src}${item.author ? ' · ' + item.author : ''} ｜ [打开原文](${url})`);
  L.push('');

  // 1. 核心观点：从原文摘要确定性摘句，不改写不编造
  L.push('## 核心观点');
  const points = extractKeyPoints(item);
  points.forEach((p, i) => L.push(`${i + 1}. ${p}`));
  L.push('');

  // 2. 内容概要：保留摘要原文，供读者完整了解上下文
  L.push('## 内容概要');
  L.push((item.summary || '').trim() || '该条目暂无公开摘要，建议直接点开原文获取一手信息。');
  L.push('');

  // 3. 实例分析：数字解读（只摘原文字段）+ 按栏目的落地方法
  L.push('## 实例分析');
  const facts = extractFacts(item.summary);
  if (facts.length) {
    L.push('**原文中的关键数字**');
    for (const f of facts) {
      L.push(`- 「${f.ctx}${f.num}${f.unit}」——出自${src}的报道口径。套用到自己场景前，建议回原文核对它的统计边界（时间窗、样本范围、口径定义）。`);
    }
    L.push('');
  }
  const PLAYBOOK = {
    policy: [
      '对照申报条件逐条自查：政策条目里「支持对象」「支持方式」「申报门槛」三段通常就是资格线，缺一项就不必投入准备成本。',
      '把资金/补贴条款换算成自己项目的投资回收期改善幅度，再决定值不值得走流程。',
    ],
    case: [
      '还原对方的决策链：谁立项、谁出钱、谁验收，判断这个案例和自己的组织结构是否可比。',
      '重点找「投入产出」字段：停机时间、改造周期、验收标准——这些通常比宣传结果更有参考价值。',
    ],
    tech: [
      '先界定适用边界：工况（温度/节拍/材质）、数据前提（有无历史样本）、部署条件（边缘算力/网络），任一项不满足就该先做小样验证。',
      '用自有数据做 POC，验收指标在开工前白纸黑字约定（检出率/误报率/节拍），避免「演示效果好、上线不稳定」。',
    ],
    expo: [
      '把发布信息转成采购清单线索：厂商集中发布的功能点，往往对应下一轮选型的必答项。',
      '对感兴趣型号记录公开参数与适配条件；展会热度不等于成熟度，要求厂商提供同工况案例。',
    ],
    trend: [
      '识别分歧点：趋势讨论的价值在于「谁不认同、为什么」，分歧处往往藏着风险或机会。',
      '把趋势转成自己的观察指标：设定 2—3 个可量化的跟踪信号（招标数量、人才岗位、专利数），按季度回看。',
    ],
  };
  L.push('**落到自己场景，可以这样做**');
  for (const tip of PLAYBOOK[theme.key] || PLAYBOOK.trend) L.push(`- ${tip}`);
  L.push('');

  // 4. 站内相关案例：库内同主题文章交叉引用（真实存在、可点）
  const rel = relatedCases(title, selfId);
  if (rel.length) {
    L.push('## 相关案例（站内）');
    for (const r of rel) L.push(`- [${clean(r.title)}](article-${r.id}.html)`);
    L.push('');
  }

  // 5. 为什么值得关注
  L.push('## 为什么制造业读者要关注');
  const ANGLE = {
    policy: '政策类信息往往决定未来 3—5 年的资金流向和改造优先级。对制造企业而言，早一步读懂导向，就早一步在项目立项和预算申报上占位。',
    case: '同行已经跑通的路径，是最低成本的参考。落地案例的价值不在于「别人做了什么」，而在于它暴露了哪些坑、哪些环节真的省下了钱。',
    tech: '技术是否成熟，不看 PPT 看产线上的稳定性。关注这类进展时，建议重点看它的适用边界：什么工况下有效，什么条件下会失效。',
    expo: '展会和大会是行业风向的集中释放点。厂商集中发布什么，往往预示着下一轮采购清单里会出现什么。',
    trend: '趋势类讨论反映的是行业共识的形成过程。看清分歧在哪里，比记住结论更有用。',
  };
  L.push(ANGLE[theme.key] || ANGLE.trend);
  L.push('');
  L.push(`本条在社区中的信号强度：**${heat(item.points)}**${item.points ? `（${item.points} 分` + (item.comments ? ` · ${item.comments} 条讨论` : '') + '）' : ''}。`);
  L.push('');

  // 6. 原文入口：markdown 链接（可点击）+ 裸 URL 兜底（md.js 会自动转链接）
  L.push('## 原文入口');
  L.push(`[打开原文：${title.slice(0, 40)}](${url})`);
  L.push('');
  L.push(`原始地址（可复制/可点击）：${url}`);
  L.push('');
  L.push('---');
  L.push(`*本条由 ops-intel 自动化系统基于公开数据生成：核心观点为原文摘要的机器摘句（未改写），实例分析为通用方法论，不构成投资/采购建议。生成时间：${new Date().toISOString()}*`);
  return L.join('\n');
}

function generateDeepDive(item) {
  const now = new Date().toISOString();
  const slug = `${now.slice(0, 10).replace(/-/g, '')}-${crypto.randomBytes(3).toString('hex')}`;
  const title = pickTitle(item);
  const theme = classify(item);
  const dek = `【${theme.name}】${(item.summary || '').slice(0, 80)}`;

  // 同一素材不重复成深文：媒体常见「同题不同 id」转载，会在站点上出现两篇几乎一样的稿子。
  // 但命中不等于什么都不做 —— 生成器结构升级后，存量文章仍是旧格式；
  // 这里刷新正文与溯源（与日报对同 slug 的 UPDATE 行为一致），既防重复又能升级存量。
  const dup = db.prepare('SELECT id FROM articles WHERE title = ? LIMIT 1').get(title);
  if (dup) {
    db.prepare(`UPDATE articles SET dek=?, body_md=?, source_urls=?, source_ids=?, score=?, relevance='ok',
                status='ready', created_at=? WHERE id=?`)
      .run(dek, buildDeepBody(item, dup.id), JSON.stringify([cleanUrl(item.url)]), JSON.stringify([item.id]),
           item.points, now, dup.id);
    db.prepare('UPDATE intel SET used = 1 WHERE id = ?').run(item.id);
    audit.log('info', 'generate', 'deep.refreshed', { articleId: dup.id, intelId: item.id, title: title.slice(0, 60) });
    return dup.id;
  }
  db.prepare(`INSERT INTO articles (slug, kind, title, dek, body_md, source_urls, source_ids, generator, score, status, created_at)
              VALUES (?,?,?,?,?,?,?,?,?, 'ready', ?)`)
    .run(slug, 'deep', title, dek, buildDeepBody(item, null), JSON.stringify([cleanUrl(item.url)]),
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
      // 核心观点：与深文同一套确定性摘句，日报不再整段贴摘要（否则一期 8 条过长）。
      const kps = extractKeyPoints(it, 2);
      for (const kp of kps) body += `- ${kp}\n`;
      body += `\n`;
      const facts = extractFacts(it.summary, 2);
      if (facts.length) {
        body += `*关键数字：${facts.map((f) => `「${f.ctx}${f.num}${f.unit}」`).join('、')}*\n\n`;
      }
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

module.exports = { generateBatch, generateDeepDive, generateDailyDigest, classify, THEMES, buildDeepBody, extractKeyPoints, extractFacts, relatedCases };

if (require.main === module) {
  console.log(JSON.stringify(generateBatch(), null, 2));
}