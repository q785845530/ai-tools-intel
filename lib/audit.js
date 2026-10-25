// lib/audit.js —— 追加式审计链（Append-only hash-chained audit log）
//
// 设计目标：满足「全程记录，不能有删除和省略」的要求，并且做到【可验证】。
// 实现方式：每一行日志都包含上一行整行的 SHA-256。
//   → 删掉/改动任意一行，其后所有行的 prev 哈希全部对不上，立刻暴露。
//   → 仅追加可校验：node lib/audit.js verify
// 这是本系统唯一被允许写入日志的通道；其它模块不得直接 fs.appendFile。
'use strict';
const fs = require('node:fs');
const path = require('node:path');
const crypto = require('node:crypto');

const ROOT = path.resolve(__dirname, '..');
const LOG_DIR = path.join(ROOT, 'log');
const CHAIN_FILE = path.join(LOG_DIR, 'audit-chain.json');

const sha256 = (s) => crypto.createHash('sha256').update(s, 'utf8').digest('hex');

function ensureDir() {
  fs.mkdirSync(LOG_DIR, { recursive: true });
}

/** 当天日志文件：按天分片，永不覆写历史文件 */
function dayFile(d = new Date()) {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const dd = String(d.getDate()).padStart(2, '0');
  return path.join(LOG_DIR, `audit-${y}${m}${dd}.jsonl`);
}

function lastSeq() {
  try {
    const j = JSON.parse(fs.readFileSync(CHAIN_FILE, 'utf8'));
    return j;
  } catch {
    return { seq: 0, prev: 'GENESIS' };
  }
}

/**
 * 写一条审计记录。
 * @param {string} level  debug|info|warn|error
 * @param {string} actor  执行者：scheduler|intel|generate|publish|serve|human|system
 * @param {string} event  事件名（点分命名，如 publish.site.ok）
 * @param {object} data   结构化载荷（不得包含密钥明文）
 */
function log(level, actor, event, data = {}) {
  ensureDir();
  const chain = lastSeq();
  const rec = {
    seq: chain.seq + 1,
    ts: new Date().toISOString(),
    level,
    actor,
    event,
    data,
    prev: chain.prev,
  };
  // 哈希覆盖除自身 hash 外的全部字段 —— 任何字段被改都校验失败
  rec.hash = sha256(JSON.stringify({ ...rec, hash: undefined }));

  const file = dayFile();
  fs.appendFileSync(file, JSON.stringify(rec) + '\n');
  fs.writeFileSync(CHAIN_FILE, JSON.stringify({ seq: rec.seq, prev: rec.hash, file }));
  return rec;
}

/** 校验整条链。返回 {ok, checked, problems[]} —— 供看板与定时自检调用 */
function verify() {
  const files = fs.existsSync(LOG_DIR)
    ? fs.readdirSync(LOG_DIR).filter((f) => /^audit-\d{8}\.jsonl$/.test(f)).sort()
    : [];
  let prev = 'GENESIS';
  let seq = 0;
  const problems = [];
  let checked = 0;

  for (const f of files) {
    const lines = fs.readFileSync(path.join(LOG_DIR, f), 'utf8').split('\n').filter(Boolean);
    for (let i = 0; i < lines.length; i++) {
      let rec;
      try {
        rec = JSON.parse(lines[i]);
      } catch (e) {
        problems.push(`${f}#${i}: 非法 JSON 行`);
        continue;
      }
      checked++;
      const { hash, ...body } = rec;
      if (sha256(JSON.stringify(body)) !== hash) {
        problems.push(`${f}#${i} (seq=${rec.seq}): 内容被篡改（自身哈希不符）`);
      }
      if (rec.prev !== prev) {
        problems.push(`${f}#${i} (seq=${rec.seq}): 断链 —— 声称前驱 ${String(rec.prev).slice(0, 12)}…，实际 ${String(prev).slice(0, 12)}…（疑似删行或改行）`);
      }
      if (rec.seq !== seq + 1) {
        problems.push(`${f}#${i}: 序号跳变 ${seq} → ${rec.seq}（疑似省略）`);
      }
      prev = hash;
      seq = rec.seq;
    }
  }
  const head = lastSeq();
  if (head.seq !== seq) problems.push(`链头指针 seq=${head.seq} 与实际末行 seq=${seq} 不一致`);
  return { ok: problems.length === 0, checked, problems, head: { seq, hash: prev } };
}

/** 读取最近 N 条（供看板） */
function tail(n = 100) {
  const files = fs.existsSync(LOG_DIR)
    ? fs.readdirSync(LOG_DIR).filter((f) => /^audit-\d{8}\.jsonl$/.test(f)).sort()
    : [];
  const out = [];
  for (let fi = files.length - 1; fi >= 0 && out.length < n; fi--) {
    const lines = fs.readFileSync(path.join(LOG_DIR, files[fi]), 'utf8').split('\n').filter(Boolean);
    for (let i = lines.length - 1; i >= 0 && out.length < n; i--) {
      try { out.unshift(JSON.parse(lines[i])); } catch { /* 坏行留给 verify 报告，此处跳过 */ }
    }
  }
  return out;
}

module.exports = { log, verify, tail, LOG_DIR, dayFile };

// CLI: node lib/audit.js verify|tail [n]
if (require.main === module) {
  const cmd = process.argv[2] || 'verify';
  if (cmd === 'verify') {
    const r = verify();
    console.log(`审计链校验：${r.ok ? '✅ 完整' : '❌ 异常'}  共 ${r.checked} 条记录`);
    console.log(`链头：seq=${r.head.seq} hash=${r.head.hash.slice(0, 16)}…`);
    if (!r.ok) r.problems.slice(0, 50).forEach((p) => console.log('  ! ' + p));
    process.exit(r.ok ? 0 : 1);
  } else if (cmd === 'tail') {
    const n = parseInt(process.argv[3] || '30', 10);
    for (const r of tail(n)) {
      console.log(`#${r.seq} ${r.ts} [${r.level}] ${r.actor}/${r.event} ${JSON.stringify(r.data)}`);
    }
  }
}
