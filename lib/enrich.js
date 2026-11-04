// lib/enrich.js —— 摘要回填：把「只有标题」的情报补齐为「标题 + 真实摘要」
//
// 为什么需要：实测 238 条 relevance=ok 的记录里 237 条 summary 为空 ——
//   1) media.js 只从列表页抓标题，从不进详情页，入库时 summary 硬编码传 ''
//   2) zhihu.js 依赖上游搜索接口返回 Summary，垂类结果该字段为空
// 没有正文就没有「核心观点」可提取，深文只剩标题复读。
//
// 做法：抓原文详情页的 meta/og 描述（实测工控网 og、OFweek meta 均可取），
// 取不到再退回正文首段；知乎详情页返回 403（需登录），记为 unsupported 不再反复重试。
//
// 纪律：限速 + 单轮限量 + 只填空不覆盖 + 全程留痕，任何失败都不阻断主流水线。
'use strict';
const { db } = require('./db');
const audit = require('./audit');

const UA = 'Mozilla/5.0 (compatible; ops-intel/1.0; +https://github.com/q785845530/ai-tools-intel)';
const TIMEOUT_MS = 15000;
const DELAY_MS = 900;              // 站间礼貌间隔
const MAX_PER_RUN = 25;            // 单轮上限：不拖慢主流水线
const MAX_LEN = 800;               // 与 zhihu.js 入库长度保持一致

// 负缓存表：记录「抓过但拿不到正文」的情报，避免它们反复占用单轮配额。
// 必须在模块加载时建好 —— enrichSummaries 的候选查询里有针对它的子查询，
// 若建表滞后于查询会直接抛 "no such table"。
db.exec(`CREATE TABLE IF NOT EXISTS enrich_skip (
  intel_id INTEGER PRIMARY KEY,
  reason   TEXT,
  tries    INTEGER DEFAULT 1,
  last_at  TEXT
)`);
const markSkip = db.prepare(`INSERT INTO enrich_skip (intel_id, reason, tries, last_at) VALUES (?, ?, 1, ?)
  ON CONFLICT(intel_id) DO UPDATE SET tries = tries + 1, last_at = excluded.last_at, reason = excluded.reason`);

// 已知抓不到正文的源：不要再浪费配额和站点耐心
// 明细：
//   zhihu.com          —— 详情页 403（需登录）
//   articles.e-works.net.cn —— 详情页为 JS 反爬壳，返回混淆字节而非正文（实测 5 轮 0 产出）
const UNSUPPORTED = [/zhihu\.com/i, /articles\.e-works\.net\.cn/i];

function decodeEntities(s) {
  return String(s || '')
    .replace(/&quot;/g, '"').replace(/&apos;/g, "'")
    .replace(/&lt;/g, '<').replace(/&gt;/g, '>')
    .replace(/&nbsp;/g, ' ').replace(/&amp;/g, '&')
    .replace(/&#(\d+);/g, (_, d) => String.fromCodePoint(Number(d)))
    .replace(/&#x([0-9a-f]+);/gi, (_, h) => String.fromCodePoint(parseInt(h, 16)))
    .replace(/\s+/g, ' ').trim();
}

/** 从 HTML 提取最像「摘要」的一段文本；提不到返回 null（绝不编造） */
function extractSummary(html) {
  const cands = [];

  // 1) og:description（两种属性顺序都要认）
  const ogA = html.match(/<meta[^>]+property=["']og:description["'][^>]+content=["']([^"']{20,})["']/i);
  const ogB = html.match(/<meta[^>]+content=["']([^"']{20,})["'][^>]+property=["']og:description["']/i);
  if (ogA) cands.push(ogA[1]);
  if (ogB) cands.push(ogB[1]);

  // 2) name="description" / name="Description"
  const mdA = html.match(/<meta[^>]+name=["'][Dd]escription["'][^>]+content=["']([^"']{20,})["']/i);
  const mdB = html.match(/<meta[^>]+content=["']([^"']{20,})["'][^>]+name=["'][Dd]escription["']/i);
  if (mdA) cands.push(mdA[1]);
  if (mdB) cands.push(mdB[1]);

  for (const c of cands) {
    const t = decodeEntities(c);
    if (t.length >= 30) return t.slice(0, MAX_LEN);
  }

  // 3) 退回正文：抓最长的一段 <p>（列表页/导航段的 <p> 通常很短，会被长度门槛滤掉）
  const ps = [...html.matchAll(/<p[^>]*>([\s\S]{40,600}?)<\/p>/gi)]
    .map((m) => decodeEntities(m[1].replace(/<[^>]+>/g, ' ')))
    .filter((t) => t.length >= 60 && !/^(登录|注册|首页|更多|广告|版权|关于我们)/.test(t));
  if (ps.length) {
    // 取最长的一段，通常就是导语
    return ps.sort((a, b) => b.length - a.length)[0].slice(0, MAX_LEN);
  }

  return null;
}

async function fetchPage(url) {
  const res = await fetch(url, {
    headers: { 'User-Agent': UA, 'Accept-Language': 'zh-CN,zh;q=0.9,en;q=0.8' },
    signal: AbortSignal.timeout(TIMEOUT_MS),
    redirect: 'follow',
  });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  const buf = Buffer.from(await res.arrayBuffer());
  let html = buf.toString('utf8');
  // 中文站点大量使用 GBK/GB18030（实测工控网历史页）
  if (/charset=["']?(gbk|gb2312|gb18030)/i.test(html.slice(0, 3000))) {
    html = new TextDecoder('gb18030').decode(buf);
  }
  return html;
}

/** 单轮回填：返回 {scanned, filled, unsupported, failed} */
async function enrichSummaries(limit = MAX_PER_RUN) {
  // 排除已知不可抓取的源（知乎详情页 403）：它们若留在候选里会永远排在队首，
  // 每轮白占 LIMIT 配额 —— 实测第 5 轮扫 30 条、填 0，全是知乎。
  // 这里把预算让给真正能取到正文的源；unsupported 仍会在下方统计中如实计数。
  const rows = db.prepare(`
    SELECT id, source, url, title FROM intel
    WHERE relevance = 'ok' AND (summary IS NULL OR length(trim(summary)) = 0)
      AND url IS NOT NULL AND url != ''
      AND url NOT LIKE '%zhihu.com%'
      AND url NOT LIKE '%articles.e-works.net.cn%'
      AND id NOT IN (SELECT intel_id FROM enrich_skip)
    ORDER BY id DESC LIMIT ?
  `).all(limit);

  const unsupportedLeft = db.prepare("SELECT COUNT(*) c FROM intel WHERE relevance='ok' AND (summary IS NULL OR length(trim(summary))=0) AND url LIKE '%zhihu.com%'").get().c;
  const fillableLeft = db.prepare("SELECT COUNT(*) c FROM intel WHERE relevance='ok' AND (summary IS NULL OR length(trim(summary))=0) AND url NOT LIKE '%zhihu.com%'").get().c;
  const out = { scanned: rows.length, filled: 0, unsupported: 0, failed: 0, unsupportedLeft, fillableLeft };
  if (!rows.length) return out;

  const upd = db.prepare('UPDATE intel SET summary = ? WHERE id = ?');

  for (const r of rows) {
    if (UNSUPPORTED.some((re) => re.test(r.url))) {
      out.unsupported++;
      continue;
    }
    try {
      const html = await fetchPage(r.url);
      const s = extractSummary(html);
      if (s) {
        upd.run(s, r.id);
        out.filled++;
      } else {
        out.failed++;
        markSkip.run(r.id, 'NO_SUMMARY_IN_PAGE', new Date().toISOString());
        audit.log('debug', 'enrich', 'summary.not_found', { id: r.id, source: r.source, url: r.url.slice(0, 120) });
      }
    } catch (e) {
      out.failed++;
      markSkip.run(r.id, 'FETCH_' + String(e.message).slice(0, 60), new Date().toISOString());
      // 只记摘要，避免把整页错误刷进审计链
      audit.log('debug', 'enrich', 'summary.fail', { id: r.id, source: r.source, error: e.message.slice(0, 120) });
    }
    await new Promise((res) => setTimeout(res, DELAY_MS));
  }

  audit.log('info', 'enrich', 'summaries.done', out);
  return out;
}

module.exports = { enrichSummaries, extractSummary, decodeEntities };
