// lib/media.js —— 行业垂直媒体采集（第二支柱）
// 背景：实测各情报源对本垂类的有效率 —— 知乎垂类检索 48/48，
// 而 HN 0/34、Lobsters 1/35、知乎通用热榜 0/27。英文源对本号零产出，
// 内容供给实质单点依赖知乎。本模块引入中文行业媒体作为第二支柱：
//   工控网 gongkong.com（自动化及智能制造）
//   OFweek  ofweek.com/auto（智能制造频道）
//   e-works net.cn（数字化企业网）
// 实现说明：这些站点不提供原生 RSS（实测），但其列表页是服务端渲染 HTML，
// 用正则提取文章链接即可 —— 与本项目零依赖原则一致，不引入 cheerio。
// 编码注意：OFweek/工控网为 GBK，用 TextDecoder('gbk')（Node 完整 ICU 原生支持）。
'use strict';
const audit = require('./audit');
const { db } = require('./db');
const { cleanUrl } = require('./urlclean');
const { isRelevant } = require('./relevance');

const UA = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36';

const SOURCES = [
  {
    key: 'gongkong',
    name: '工控网',
    url: 'https://www.gongkong.com/news/',
    base: 'https://www.gongkong.com',
    // /news/202610/454137.html —— 同一条链接在页面中出现多次（图+标题+摘要），提取后按 href 去重
    pattern: /href="(\/news\/\d{6}\/\d+\.html)"/g,
    linkFrom: m => m[1],
    // 标题取 title="..."；无 title 的用链接周边文本（统一由 extractTitles 兜底）
  },
  {
    key: 'ofweek-im',
    name: 'OFweek智能制造',
    // 实测 /auto/ 频道页首屏混有大量 2024 旧推荐位；/im/（智能制造频道）
    // 92 条 2026 链接，才是近期主流区
    url: 'https://www.ofweek.com/im/',
    base: 'https://www.ofweek.com',
    pattern: /href="(https:\/\/www\.ofweek\.com\/im\/20\d\d-\d\d\/ART-[\w-]+\.html)"/g,
    linkFrom: m => m[1],
  },
  {
    key: 'eworks',
    name: 'e-works数字化企业网',
    url: 'https://www.e-works.net.cn/',
    base: 'https://www.e-works.net.cn',
    pattern: /href="(https:\/\/articles\.e-works\.net\.cn\/[a-z]+\/article\d+\.htm)"/g,
    linkFrom: m => m[1],
  },
];

async function fetchDecode(url) {
  const res = await fetch(url, { headers: { 'user-agent': UA, accept: 'text/html,*/*' }, signal: AbortSignal.timeout(20000), redirect: 'follow' });
  const buf = Buffer.from(await res.arrayBuffer());
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  const head = buf.slice(0, 2500).toString('latin1');
  const cs = (head.match(/charset=["']?([\w-]+)/i) || [])[1] || 'utf-8';
  try {
    // GB2312/GBK 页面在完整 ICU 下由 TextDecoder 正确解码
    return new TextDecoder(/gb/i.test(cs) ? 'gbk' : 'utf-8').decode(buf);
  } catch {
    return buf.toString('utf8');
  }
}

function decodeEntities(s) {
  return String(s || '')
    .replace(/&nbsp;/g, ' ').replace(/&amp;/g, '&').replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>').replace(/&quot;/g, '"').replace(/&#(\d+);/g, (_, n) => String.fromCharCode(n))
    .replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim();
}

/** 从 HTML 中提取 href→title 映射（title= 属性优先，其次标签间文本） */
function extractTitles(html, href) {
  const esc = href.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  // 找到该 href 附近的锚标签（页面里同链接出现多次时取信息最全的一次）
  const re = new RegExp(`<a[^>]*href="${esc}"[^>]*(?:title="([^"]{4,80})")?[^>]*>([^<]{4,80})</a>`, 'gi');
  let best = null;
  let m;
  while ((m = re.exec(html))) {
    const t = decodeEntities(m[1] || m[2] || '');
    if (t && (!best || t.length > best.length)) best = t;
  }
  return best || null;
}

/** 这三个站的 URL 内嵌发布年月（/news/202610/、/im/2026-09/），
 *  据此过滤时效 —— 列表页底部常有几个月前的"猜你喜欢"推荐位，
 *  不按日期过滤会把旧文当新情报。返回 URL 距今月数，无法判定返回 -1。 */
function urlAgeMonths(url) {
  const m = String(url).match(/20\d\d[-/]?\d\d/);
  if (!m) return -1;
  const s = m[0].replace(/[^0-9]/g, '');
  const y = +s.slice(0, 4), mo = +s.slice(4, 6);
  if (!y || !mo || mo > 12) return -1;
  const now = new Date();
  return (now.getFullYear() - y) * 12 + (now.getMonth() + 1 - mo);
}

async function collectSource(src) {
  const html = await fetchDecode(src.url);
  const seen = new Set();
  const items = [];
  let stale = 0, noDate = 0;
  let m;
  src.pattern.lastIndex = 0;
  while ((m = src.pattern.exec(html)) && items.length < 30) {
    const href = src.linkFrom(m);
    if (seen.has(href)) continue;
    seen.add(href);
    // 时效闸门：URL 能判定日期且超过 3 个月的，判为推荐位旧文，跳过
    const age = urlAgeMonths(href);
    if (age > 3) { stale++; continue; }
    if (age < 0) noDate++;
    const url = href.startsWith('http') ? href : src.base + href;
    const title = extractTitles(html, href);
    if (!title) continue; // 没有可靠标题就放弃，绝不编造
    items.push({ url: cleanUrl(url), title });
  }
  if (stale || noDate) audit.log('debug', 'media', `freshness.${src.key}`, { stale_skipped: stale, undated: noDate });
  return items;
}

/** 入库：source = media-<key>；相关性由统一闸门判定 */
function saveMedia(items, key) {
  const now = new Date().toISOString();
  const ins = db.prepare(`INSERT OR IGNORE INTO intel (source, ext_id, title, url, summary, author, points, comments, topics, published_at, fetched_at, relevance)
                          VALUES (?,?,?,?,?,?,?,?,?,?,?,?)`);
  let saved = 0, skipped = 0;
  for (const it of items) {
    // 相关性判定：传入 media-<key> 与入库 source 一致，
    // 判定器对 media-* 按「来源即域界」放宽一档（站点本身就是制造业媒体）
    const rel = isRelevant({ title: it.title, summary: '', source: `media-${key}` });
    if (!rel.ok) skipped++;
    // ext_id 取 URL 末尾数字（文章 id）；不能用首个数字 ——
    // 实测踩坑：工控网 URL /news/202610/454137.html 首个数字是月份 202610，
    // 同月 30 条互撞 UNIQUE，只剩 1 条入库。
    const nums = String(it.url).match(/\d{4,}/g) || [];
    const extId = (nums[nums.length - 1] || it.url.slice(-40)).slice(0, 48);
    const r = ins.run(`media-${key}`, extId, it.title, it.url, '', SOURCES.find(s => s.key === key)?.name || key,
                      0, 0, '', null, now, rel.ok ? 'ok' : 'off');
    if (r.changes) saved++;
  }
  return { saved, skipped };
}

async function collectMedia() {
  const results = {};
  let total = 0;
  for (const src of SOURCES) {
    try {
      const items = await collectSource(src);
      const { saved, skipped } = saveMedia(items, src.key);
      results[src.key] = { found: items.length, saved, off: skipped };
      total += saved;
      audit.log('info', 'media', `collect.${src.key}.ok`, { found: items.length, saved, filtered: skipped });
    } catch (e) {
      results[src.key] = { error: e.message };
      audit.log('warn', 'media', `collect.${src.key}.fail`, { url: src.url, error: e.message });
    }
    await new Promise(r => setTimeout(r, 1200)); // 站点间节流，做个体面的抓取者
  }
  audit.log('info', 'media', 'collect.done', { results, total });
  return { results, total };
}

module.exports = { collectMedia, collectSource, SOURCES };

if (require.main === module) {
  collectMedia().then(r => { console.log(JSON.stringify(r, null, 2)); process.exit(0); })
    .catch(e => { console.error('失败:', e.message); process.exit(1); });
}
