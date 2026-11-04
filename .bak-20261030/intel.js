// lib/intel.js —— 情报采集器（HN Algolia + GitHub Trending + Lobsters RSS）
// 设计：每个源独立函数，失败不阻断其它源；结果统一写入 intel 表，ext_id 去重。
'use strict';
const { db } = require('./db');
const { cleanUrl } = require('./urlclean');
const { isRelevant } = require('./relevance');
const audit = require('./audit');

const UA = 'ops-intel/1.0 (https://github.com)';
const TIMEOUT_MS = 20000;

async function fetchJSON(url) {
  const res = await fetch(url, {
    headers: { 'User-Agent': UA, 'Accept': 'application/json' },
    signal: AbortSignal.timeout(TIMEOUT_MS),
  });
  if (!res.ok) throw new Error(`HTTP ${res.status} for ${url}`);
  return res.json();
}

async function fetchText(url) {
  const res = await fetch(url, {
    headers: { 'User-Agent': UA },
    signal: AbortSignal.timeout(TIMEOUT_MS),
  });
  if (!res.ok) throw new Error(`HTTP ${res.status} for ${url}`);
  return res.text();
}

// ─── 1. Hacker News (Algolia API) ────────────────────────────────────────
async function collectHN(query = 'AI', minPoints = 15, hoursBack = 48) {
  const since = Math.floor(Date.now() / 1000) - hoursBack * 3600;
  const url = `https://hn.algolia.com/api/v1/search_by_date?query=${encodeURIComponent(query)}&tags=story&numericFilters=created_at_i>${since},points>${minPoints}&hitsPerPage=30`;
  const data = await fetchJSON(url);
  const insert = db.prepare(`INSERT OR IGNORE INTO intel (source, ext_id, title, url, summary, author, points, comments, published_at, fetched_at, relevance) VALUES ('hn', ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`);
  let count = 0;
  let filtered = 0;
  const now = new Date().toISOString();
  for (const h of (data.hits || [])) {
    if (!h.objectID || !h.title) continue;
    // 相关性闸门：HN 大量通用软件/创业话题不属于「智能制造」定位。
    // 不丢弃该条 —— 入库并标记 off，保留可审计痕迹（用户要求全程留痕）。
    const relHn = isRelevant({ title: h.title, summary: h.story_text || '', source: 'hn' });
    if (!relHn.ok) filtered++;
    const storyUrl = h.url || `https://news.ycombinator.com/item?id=${h.objectID}`;
    insert.run(
      String(h.objectID),
      h.title,
      cleanUrl(storyUrl),
      h.story_text ? h.story_text.slice(0, 500) : null,
      h.author || 'unknown',
      h.points || 0,
      h.num_comments || 0,
      h.created_at || now,
      now,
    );
    count++;
  }
  if (filtered) audit.log('info', 'intel', 'relevance.filtered', { filtered, kept: count });
  return count;
}

// ─── 2. GitHub Trending (Search API, pushed last 7 days) ─────────────────
async function collectGitHub(query = 'ai agent', sort = 'stars', perPage = 20) {
  const since = new Date(Date.now() - 7 * 86400000).toISOString().slice(0, 10);
  const url = `https://api.github.com/search/repositories?q=${encodeURIComponent(query)}+pushed:>${since}&sort=${sort}&order=desc&per_page=${perPage}`;
  const data = await fetchJSON(url);
  const insert = db.prepare(`INSERT OR IGNORE INTO intel (source, ext_id, title, url, summary, author, points, topics, published_at, fetched_at, relevance) VALUES ('github', ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`);
  let count = 0;
  let filtered = 0;
  const now = new Date().toISOString();
  for (const r of (data.items || [])) {
    if (!r.id || !r.full_name) continue;
    // 相关性闸门：GitHub 热搜多为通用开发工具，需与制造业/工业有关才收
    const relGh = isRelevant({ title: r.full_name, summary: ((r.description || '') + ' ' + (Array.isArray(r.topics) ? r.topics.join(' ') : '')), source: 'github' });
    if (!relGh.ok) filtered++;
    const topics = Array.isArray(r.topics) ? r.topics.slice(0, 10).join(',') : '';
    insert.run(
      String(r.id),
      r.full_name,
      cleanUrl(r.html_url),
      r.description ? r.description.slice(0, 500) : null,
      r.owner?.login || 'unknown',
      r.stargazers_count || 0,
      topics,
      r.pushed_at || now,
      now,
    );
    count++;
  }
  if (filtered) audit.log('info', 'intel', 'relevance.filtered', { filtered, kept: count });
  return count;
}

// ─── 3. Lobsters RSS (简单正则解析，零依赖) ───────────────────────────────
async function collectLobsters() {
  const xml = await fetchText('https://lobste.rs/rss');
  const insert = db.prepare(`INSERT OR IGNORE INTO intel (source, ext_id, title, url, summary, author, points, comments, published_at, fetched_at, relevance) VALUES ('lobsters', ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`);
  let count = 0;
  let filtered = 0;
  const now = new Date().toISOString();
  // 极简 item 提取
  const items = xml.split('<item>').slice(1);
  for (const raw of items) {
    const end = raw.indexOf('</item>');
    const block = end > 0 ? raw.slice(0, end) : raw;
    const title = block.match(/<title>([\s\S]*?)<\/title>/)?.[1]?.trim() || '';
    const link = block.match(/<link>([\s\S]*?)<\/link>/)?.[1]?.trim() || '';
    const desc = block.match(/<description>([\s\S]*?)<\/description>/)?.[1]?.trim() || '';
    const guid = block.match(/<guid[^>]*>([\s\S]*?)<\/guid>/)?.[1]?.trim() || link;
    const pubDate = block.match(/<pubDate>([\s\S]*?)<\/pubDate>/)?.[1]?.trim() || now;
    if (!guid || !title) continue;
      // 相关性闸门
      const relLb = isRelevant({ title, summary: desc, source: 'lobsters' });
      if (!relLb.ok) filtered++;
    // lobsters guid 通常含 id
    const extId = guid.replace(/[^a-zA-Z0-9]/g, '').slice(0, 64) || String(count);
    insert.run(extId, title, cleanUrl(link), desc.slice(0, 500), 'lobsters', 0, 0, pubDate, now, relLb.ok ? 'ok' : 'off');
    count++;
  }
  if (filtered) audit.log('info', 'intel', 'relevance.filtered', { filtered, kept: count });
  return count;
}

// ─── 汇总入口 ────────────────────────────────────────────────────────────
async function collectAll() {
  const results = {};
  const sources = [
    // 知乎优先（中文、垂类精准，直接命中「智能制造+AI」定位）
    ['zhihu', async () => {
      const { collectZhihu } = require('./zhihu');
      const r = await collectZhihu();
      return r.hot + r.search;
    }],
    // 行业垂直媒体（第二支柱：工控网 / OFweek智能制造 / e-works）
    ['media', async () => {
      const { collectMedia } = require('./media');
      const r = await collectMedia();
      return r.total;
    }],
    ['hn', () => collectHN()],
    ['github', () => collectGitHub()],
    ['lobsters', () => collectLobsters()],
  ];
  for (const [name, fn] of sources) {
    try {
      results[name] = await fn();
      audit.log('info', 'intel', `collect.${name}.ok`, { count: results[name] });
    } catch (err) {
      results[name] = -1;
      audit.log('error', 'intel', `collect.${name}.fail`, { error: err.message });
    }
  }
  const total = Object.values(results).reduce((s, v) => s + Math.max(0, v), 0);
  audit.log('info', 'intel', 'collect.all.done', { results, total });
  return { results, total };
}

module.exports = { collectAll, collectHN, collectGitHub, collectLobsters };

// CLI: node lib/intel.js
if (require.main === module) {
  collectAll().then(r => {
    console.log(JSON.stringify(r, null, 2));
  }).catch(e => { console.error(e); process.exit(1); });
}
