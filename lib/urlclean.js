// lib/urlclean.js —— 统一 URL 清洗
// 情报源的 URL 常带一长串追踪参数（知乎导出的 source_url 有 62 字符噪声，
// 把 URL 从 48 撑到 100+），既难看又容易在其他环节被误截断。
// 这里统一剥掉，所有渠道（站点/微信/头条/小红书）共用同一份清洗规则。
'use strict';

// 无意义追踪参数名（精确名或前缀）
const JUNK_EXACT = new Set([
  'spm', 'scm', 'from', 'source', 'ref', 'referrer', 'sr', 'vd_source',
  'wfr', 'entry', 'target', 'tab', 'pos', 'idx', 'share', 'share_token',
  'share_source', 'share_medium', 'ivk_share', 'is_share', 'share_uid',
  'app_id', 'channel', 'clicktime', 'enter_from', 'group_id', 'traceid',
]);
const JUNK_PREFIX = /^(utm_|share_|_from|hmsr|hmpl|hmcu|hmkw|hmci)/i;

function cleanUrl(raw) {
  let u = String(raw == null ? '' : raw).replace(/&amp;/g, '&').trim();
  if (!u) return u;
  try {
    const p = new URL(u);
    for (const k of [...p.searchParams.keys()]) {
      if (JUNK_EXACT.has(k.toLowerCase()) || JUNK_PREFIX.test(k)) p.searchParams.delete(k);
    }
    p.hash = '';
    u = p.toString();
    // 清空 query 后去掉孤零零的 ? ；并还原被 URL 规范化的常见转义
    u = u.replace(/\?$/, '');
    return u;
  } catch {
    // 非标准 URL（相对路径/异常字符串）→ 原样返回，绝不截断
    return u;
  }
}

module.exports = { cleanUrl, JUNK_EXACT, JUNK_PREFIX };