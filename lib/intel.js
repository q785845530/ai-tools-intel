// lib/intel.js —— 情报采集器（HN Algolia + GitHub Trending + Lobsters RSS）
// 设计：每个源独立函数，失败不阻断其它源；结果统一写入 intel 表，ext_id 去重。
'use strict';
const { db } = require('./db');
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
  const insert = db.prepare(`INSERT OR IGNORE INTO intel (source, ext_id, title, url, summary, author, points, comments, published_at, fetched_at) VALUES ('hn', ?, ?, ?, ?, ?, ?, ?, ?, ?)`);
  let count = 0;
  const now = new Date().toISOString();
  for (const h of (data.hits || [])) {
    if (!h.objectID || !h.title) continue;
    const storyUrl = h.url || `https://news.ycombinator.com/item?id=${h.objectID}`;
    insert.run(
      String(h.objectID),
      h.title,
      storyUrl,
      h.story_text ? h.story_text.slice(0, 500) : null,
      h.author || 'unknown',
      h.points || 0,
      h.num_comments || 0,
      h.created_at || now,
      now,
    );
    count++;
  }
  return count;
}

// ─── 2. GitHub Trending (Search API, pushed last 7 days) ─────────────────
async function collectGitHub(query = 'ai agent', sort = 'stars', perPage = 20) {
  const since = new Date(Date.now() - 7 * 86400000).toISOString().slice(0, 10);
  const url = `https://api.github.com/search/repositories?q=${encodeURIComponent(query)}+pushed:>${since}&sort=${sort}&order=desc&per_page=${perPage}`;
  const data = await fetchJSON(url);
  const insert = db.prepare(`INSERT OR IGNORE INTO intel (source, ext_id, title, url, summary, author, points, topics, published_at, fetched_at) VALUES ('github', ?, ?, ?, ?, ?, ?, ?, ?, ?)`);
  let count = 0;
  const now = new Date().toISOString();
  for (const r of (data.items || [])) {
    if (!r.id || !r.full_name) continue;
    const topics = Array.isArray(r.topics) ? r.topics.slice(0, 10).join(',') : '';
    insert.run(
      String(r.id),
      r.full_name,
      r.html_url,
      r.description ? r.description.slice(0, 500) : null,
      r.owner?.login || 'unknown',
      r.stargazers_count || 0,
      topics,
      r.pushed_at || now,
      now,
    );
    count++;
  }
  return count;
}

// ─── 3. Lobsters RSS (简单正则解析，零依赖) ───────────────────────────────
async function collectLobsters() {
  const xml = await fetchText('https://lobste.rs/rss');
  const insert = db.prepare(`INSERT OR IGNORE INTO intel (source, ext_id, title, url, summary, author, points, comments, published_at, fetched_at) VALUES ('lobsters', ?, ?, ?, ?, ?, ?, ?, ?, ?)`);
  let count = 0;
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
    // lobsters guid 通常含 id
    const extId = guid.replace(/[^a-zA-Z0-9]/g, '').slice(0, 64) || String(count);
    insert.run(extId, title, link, desc.slice(0, 500), 'lobsters', 0, 0, pubDate, now);
    count++;
  }
  return count;
}

// ─── 汇总入口 ────────────────────────────────────────────────────────────
async function collectAll() {
  const results = {};
  const sources = [
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
