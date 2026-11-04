// lib/zhihu.js —— 知乎数据开放平台客户端
// 协议（从官方 pi-zhihu-search 源码确认）：GET + Authorization: Bearer + X-Request-Timestamp
// 端点：/api/v1/content/{hot_list,zhihu_search,global_search}
// 注意：此 API 是【数据检索】能力，不含发文；发文需 Cookie 扫码登录（见 lib/zhihu-publish 规划）
'use strict';
const { cleanUrl } = require('./urlclean');
const audit = require('./audit');
const { getZhihuSecret } = require('./config');

const BASE = process.env.ZHIHU_OPENAPI_BASE_URL || 'https://developer.zhihu.com';

function secret() {
  try {
    return getZhihuSecret();
  } catch {
    return '';
  }
}

async function call(endpoint, params, attempt = 1) {
  const s = secret();
  if (!s) throw new Error('缺少知乎 Access Secret（config/tokens.json 或 ZHIHU_ACCESS_SECRET）');
  const qs = new URLSearchParams(params).toString();
  const url = `${BASE}/api/v1/content/${endpoint}?${qs}`;
  const res = await fetch(url, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${s}`,
      'X-Request-Timestamp': String(Math.floor(Date.now() / 1000)),
      'User-Agent': 'ops-intel/1.0 (zhihu-openapi)',
      Accept: 'application/json',
    },
    signal: AbortSignal.timeout(30000),
  });
  if (!res.ok) throw new Error(`HTTP ${res.status} @ ${endpoint}`);
  const j = await res.json();

  // 30001 = 频率超限：指数退避重试，最多 3 次。免费额度有限，这是常态而非故障。
  if (j.Code === 30001 && attempt <= 3) {
    const wait = attempt * 3000;
    audit.log('warn', 'intel', 'zhihu.ratelimit.backoff', { endpoint, attempt, waitMs: wait });
    await new Promise(r => setTimeout(r, wait));
    return call(endpoint, params, attempt + 1);
  }
  if (j.Code !== 0) throw new Error(`Code ${j.Code}: ${j.Message}`);
  return j.Data || {};
}

/** 知乎热榜（最多 30） */
async function hotList(limit = 30) {
  const d = await call('hot_list', { Limit: String(Math.min(30, limit)) });
  return (d.Items || []).map(it => ({
    title: it.Title || '',
    url: it.Url || '',
    summary: it.Summary || '',
    thumbnail: it.ThumbnailUrl || '',
  }));
}

/** 知乎站内搜索 */
async function search(query, count = 10) {
  const d = await call('zhihu_search', { Query: query, Count: String(count) });
  return (d.Items || []).map(it => ({
    title: it.Title || '',
    url: it.Url || '',
    summary: it.Summary || it.Content || '',
    author: it.AuthorName || it.Author || '',
    voteUp: it.VoteUpCount ?? null,
    comments: it.CommentCount ?? null,
  }));
}

/** 全网搜索 */
async function globalSearch(query, count = 10) {
  const d = await call('global_search', { Query: query, Count: String(count) });
  return (d.Items || []).map(it => ({
    title: it.Title || '',
    url: it.Url || '',
    summary: it.Summary || it.Content || '',
  }));
}

// ── 情报入库（与 intel.js 同表结构，source = 'zhihu'/'zhihu-search'） ──
function save(items, source) {
  const { db } = require('./db');
  const { isRelevant, inferTopics } = require('./relevance');
  const now = new Date().toISOString();
  const ins = db.prepare(`INSERT OR IGNORE INTO intel (source, ext_id, title, url, summary, author, points, comments, topics, published_at, fetched_at, relevance)
                          VALUES (?,?,?,?,?,?,?,?,?,?,?,?)`);
  let n = 0, skipped = 0;
  for (const it of items) {
    if (!it.title || !it.url) continue;
    // 相关性闸门：知乎热榜是通用热榜（实测混入《西游记》问答），必须挡在库外
    const rel = isRelevant({ title: it.title, summary: it.summary || '', source });
    if (!rel.ok) skipped++;   // 不丢弃：入库并标记 off，保留可审计痕迹
    // ext_id 取 url 尾部（zhihu 文章/回答 id）
    const extId = (it.url.match(/\/p\/(\d+)/)?.[1] || it.url.match(/\/answer\/(\d+)/)?.[1] || it.url.match(/\/question\/(\d+)/)?.[1] || it.url).slice(-48);
    // topics 按实际内容推断，不再硬编码（硬编码会让《西游记》也挂上「智能制造」）
    const topics = inferTopics({ title: it.title, summary: it.summary || '' }).join(',');
    const r = ins.run(source, extId, it.title, cleanUrl(it.url), (it.summary || '').slice(0, 800),
                      it.author || 'zhihu', it.voteUp || 0, it.comments || 0,
                      topics, null, now, rel.ok ? 'ok' : 'off');
    if (r.changes) n++;
  }
  if (skipped) audit.log('info', 'zhihu', 'relevance.filtered', { source, skipped, kept: n, rule: '制造业强相关 / AI+垂类检索' });
  return n;
}

/** 采集入口：热榜 + 多个制造业相关检索词 */
async function collectZhihu(queries = [
  '智能制造 AI 落地',
  '工业大模型 应用',
  'AI 质检 缺陷检测',
  '智能工厂 数字化转型',
  '工业机器人 具身智能',
]) {
  const out = { hot: 0, search: 0, errors: [] };

  try {
    const hot = await hotList(20);
    out.hot = save(hot.map(h => ({ ...h, author: 'zhihu-hot' })), 'zhihu-hot');
    audit.log('info', 'intel', 'collect.zhihu.hot.ok', { items: hot.length, saved: out.hot });
  } catch (e) {
    out.errors.push('hot:' + e.message);
    audit.log('error', 'intel', 'collect.zhihu.hot.fail', { error: e.message });
  }

  for (const q of queries) {
    try {
      const r = await search(q, 10);
      const n = save(r, 'zhihu-search');
      out.search += n;
      audit.log('info', 'intel', 'collect.zhihu.search.ok', { query: q, items: r.length, saved: n });
    } catch (e) {
      out.errors.push(`${q}:${e.message}`);
      audit.log('error', 'intel', 'collect.zhihu.search.fail', { query: q, error: e.message });
    }
    // 主动节流：免费额度有限，查询之间留间隔，避免触发 30001
    await new Promise(r => setTimeout(r, 1500));
  }

  audit.log('info', 'intel', 'collect.zhihu.done', { hot: out.hot, search: out.search, errors: out.errors.length });
  return out;
}

module.exports = { hotList, search, globalSearch, collectZhihu, save };

if (require.main === module) {
  (async () => {
    const r = await collectZhihu();
    console.log(JSON.stringify(r, null, 2));
  })().catch(e => { console.error(e.message); process.exit(1); });
}
