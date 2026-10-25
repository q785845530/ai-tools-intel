// lib/zhihu-login.js —— 知乎扫码登录（Cookie 获取）
// 知乎无公开发文 API；社区方案走 Cookie 扫码登录。本模块实现：
//   申请二维码 → 渲染 PNG → 轮询扫码状态 → 成功后保存 Cookie
// 二维码有效期约 2 分钟，故本模块自动刷新，保持文件中的二维码始终有效。
'use strict';
const fs = require('node:fs');
const path = require('node:path');
const audit = require('./audit');

const BASE = 'https://www.zhihu.com';
const UA = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36';
// 知乎反爬签名版本头。值取自 zhihu-cli 源码 scripts/lib/config.js（zse93: '101_3_3.0'），
// 该头对 scan_info 轮询是必需的，缺失会稳定返回 403。
const ZSE93 = '101_3_3.0';
const CONF_DIR = path.resolve(__dirname, '..', 'config');
const QR_PNG = path.join(CONF_DIR, 'zhihu-qrcode.png');
const COOKIE_FILE = path.join(CONF_DIR, 'zhihu-cookies.json');
const REQUIRED = ['z_c0', '_xsrf', 'd_c0'];

const jar = {};

function cookieHeader() {
  return Object.entries(jar).map(([k, v]) => `${k}=${v}`).join('; ');
}

/** 吸收 Set-Cookie */
function absorb(res) {
  const raw = typeof res.headers.getSetCookie === 'function' ? res.headers.getSetCookie() : [res.headers.get('set-cookie')];
  for (const v of (raw || []).filter(Boolean)) {
    const segs = String(v).split(',');
    for (const seg of segs) {
      const pair = seg.split(';')[0];
      const i = pair.indexOf('=');
      if (i <= 0) continue;
      const k = pair.slice(0, i).trim(), val = pair.slice(i + 1).trim();
      if (val) jar[k] = val; else delete jar[k];
    }
  }
}

async function req(url, opts = {}) {
  const headers = {
    'user-agent': UA,
    accept: opts.accept || 'application/json, text/plain, */*',
    referer: opts.referer || `${BASE}/signin`,
    origin: BASE,
    'x-requested-with': 'fetch',
    ...(opts.headers || {}),
  };
  // 注意：x-zse-93 只在 scan_info 轮询时发送（与 zhihu-cli 行为一致）。
  // 若把它加到 /signin、/udid、二维码申请等建会话请求上，反而会被拒（实测 403）。
  const ch = cookieHeader();
  if (ch) headers.cookie = ch;
  if (jar._xsrf) headers['x-xsrftoken'] = jar._xsrf;
  let body;
  if (opts.body !== undefined) {
    body = JSON.stringify(opts.body);
    headers['content-type'] = 'application/json';
  }
  const res = await fetch(url, { method: opts.method || 'GET', headers, body, redirect: 'manual', signal: AbortSignal.timeout(opts.timeout || 20000) });
  absorb(res);
  return res;
}

/** 生成二维码 PNG（复用零依赖 PNG 编码器） */
function renderQR(text, outPath) {
  const qrcode = require('/tmp/qr/node_modules/qrcode-generator');
  const q = qrcode(0, 'M');
  q.addData(text);
  q.make();
  const count = q.getModuleCount();
  const scale = 10, pad = 4 * scale;
  const size = count * scale + pad * 2;
  const { encodePNG } = require('./cover');
  const png = encodePNG(size, size, (x, y) => {
    const mx = Math.floor((x - pad) / scale), my = Math.floor((y - pad) / scale);
    const dark = mx >= 0 && my >= 0 && mx < count && my < count && q.isDark(my, mx);
    return dark ? [0, 0, 0] : [255, 255, 255];
  });
  fs.mkdirSync(path.dirname(outPath), { recursive: true });
  fs.writeFileSync(outPath, png, { mode: 0o600 });
  return { size, modules: count, bytes: png.length };
}

/** 申请一次二维码 */
async function requestQR() {
  await req(`${BASE}/signin`).catch(() => null);
  await req(`${BASE}/udid`, { method: 'POST', body: {} }).catch(() => null);
  await req(`${BASE}/api/v3/oauth/captcha/v2?type=captcha_sign_in`, { accept: '*/*' }).catch(() => null);
  const res = await req(`${BASE}/api/v3/account/api/login/qrcode`, { method: 'POST', body: {} });
  if (!res.ok) throw new Error(`申请二维码失败: HTTP ${res.status}`);
  const j = await res.json();
  const token = j.token ?? j.qrcode_token;
  if (!token || !j.link) throw new Error('二维码接口未返回 token/link');
  return { token, link: j.link };
}

/** 轮询扫码状态；返回 {authenticated, account} 或 null（超时/需刷新） */
async function pollOnce(token) {
  const url = `${BASE}/api/v3/account/api/login/qrcode/${encodeURIComponent(token)}/scan_info`;
  const res = await req(url, {
    accept: '*/*', referer: `${BASE}/signin?next=%2F`,
    headers: {
      'sec-fetch-dest': 'empty', 'sec-fetch-mode': 'cors', 'sec-fetch-site': 'same-origin',
      'x-zse-93': ZSE93,
      'x-zse-96': require('./zse').signRequest(url, jar.d_c0 || '', null, ZSE93),
    },
  });
  if (res.status === 401 || res.status === 403) throw new Error(`轮询被拒: HTTP ${res.status}`);
  const info = await res.json().catch(() => ({}));
  if (info.z_c0) jar.z_c0 = String(info.z_c0);
  if (typeof (info.cookie || info.cookies) === 'string') {
    for (const seg of String(info.cookie || info.cookies).split(';')) {
      const i = seg.indexOf('=');
      if (i > 0) jar[seg.slice(0, i).trim()] = seg.slice(i + 1).trim();
    }
  }
  if (jar.z_c0) return { scanned: true, done: true };
  if (Number(info.status) === 1) return { scanned: true, done: false };
  return { scanned: false, done: false };
}

/** 完整流程：先测已有 Cookie 是否还有效，无效则出二维码并等待扫码 */
async function checkExisting() {
  try {
    const j = JSON.parse(fs.readFileSync(COOKIE_FILE, 'utf8'));
    Object.assign(jar, j.cookies || {});
    const res = await req(`${BASE}/api/v4/me`);
    if (res.ok) {
      const me = await res.json();
      return { valid: true, account: { id: me.id, name: me.name, token: me.url_token } };
    }
  } catch { /* 无 Cookie 或已失效 */ }
  return { valid: false };
}

async function startLogin({ maxMinutes = 12, refreshEveryMs = 100000 } = {}) {
  const existing = await checkExisting();
  if (existing.valid) {
    audit.log('info', 'zhihu', 'login.skip', { reason: '已有有效登录态', account: existing.account.name });
    return existing;
  }

  const deadline = Date.now() + maxMinutes * 60 * 1000;
  let qr = await requestQR();
  let info = renderQR(qr.link, QR_PNG);
  audit.log('info', 'zhihu', 'qrcode.ready', { file: QR_PNG, modules: info.modules, bytes: info.bytes, expiresInSec: 120, autoRefresh: true });
  console.log(`二维码已生成: ${QR_PNG}（${info.modules}x${info.modules} 模块，${info.bytes} 字节）`);
  console.log('二维码每 100 秒自动刷新，请用知乎 App 扫码。');

  let lastRefresh = Date.now();
  let consecFail = 0;
  while (Date.now() < deadline) {
    await new Promise(r => setTimeout(r, 1500));
    let st;
    try {
      st = await pollOnce(qr.token);
      consecFail = 0;
    } catch (e) {
      consecFail++;
      // 连续失败时降频退避，避免持续失败请求触发风控（不做绕过，只降低压力）
      const backoff = Math.min(15000, 1500 * consecFail);
      audit.log('warn', 'zhihu', 'login.poll.error', { error: e.message, consecFail, backoffMs: backoff });
      if (consecFail >= 3) {
        // 连续 3 次失败：换一张新码，并等待退避时间
        try {
          qr = await requestQR();
          renderQR(qr.link, QR_PNG);
          lastRefresh = Date.now();
          audit.log('info', 'zhihu', 'qrcode.reissued', { reason: '连续轮询失败', consecFail });
          console.log('轮询异常，已换发新二维码');
        } catch (e2) {
          audit.log('warn', 'zhihu', 'qrcode.reissue.fail', { error: e2.message });
        }
        consecFail = 0;
      }
      await new Promise(r => setTimeout(r, backoff));
      continue;
    }
    if (st.scanned && !st.done) console.log('已扫码，请在手机上点击确认…');
    if (st.done) {
      // 校验登录态并补齐 Cookie
      await req(`${BASE}/`).catch(() => null);
      const meRes = await req(`${BASE}/api/v4/me`);
      const missing = REQUIRED.filter(n => !jar[n]);
      if (missing.length) {
        audit.log('warn', 'zhihu', 'login.cookie.incomplete', { missing });
        console.log('扫码完成但缺少必要 Cookie:', missing.join(', '), '—— 将刷新二维码重试');
        qr = await requestQR(); renderQR(qr.link, QR_PNG); lastRefresh = Date.now();
        continue;
      }
      const me = meRes.ok ? await meRes.json() : {};
      fs.mkdirSync(CONF_DIR, { recursive: true });
      fs.writeFileSync(COOKIE_FILE, JSON.stringify({ cookies: jar, at: new Date().toISOString(), account: { id: me.id, name: me.name, urlToken: me.url_token } }, null, 2), { mode: 0o600 });
      audit.log('info', 'zhihu', 'login.success', { account: me.name, id: me.id, cookieNames: Object.keys(jar), file: COOKIE_FILE });
      console.log('✅ 登录成功:', me.name, '| Cookie 已加密权限保存(0600)');
      try { fs.unlinkSync(QR_PNG); } catch { /* 二维码已无用，删除 */ }
      return { valid: true, account: { id: me.id, name: me.name } };
    }
    if (Date.now() - lastRefresh > refreshEveryMs) {
      try {
        qr = await requestQR();
        info = renderQR(qr.link, QR_PNG);
        lastRefresh = Date.now();
        audit.log('info', 'zhihu', 'qrcode.refreshed', { bytes: info.bytes });
        console.log('二维码已刷新（旧码过期）');
      } catch (e) {
        audit.log('warn', 'zhihu', 'qrcode.refresh.fail', { error: e.message });
      }
    }
  }
  audit.log('warn', 'zhihu', 'login.timeout', { minutes: maxMinutes });
  return { valid: false, reason: 'TIMEOUT' };
}

module.exports = { startLogin, checkExisting, renderQR, requestQR, pollOnce, QR_PNG, COOKIE_FILE, jar, ZSE93 };

if (require.main === module) {
  startLogin({ maxMinutes: parseInt(process.argv[2] || '12', 10) })
    .then(r => { console.log(JSON.stringify({ valid: r.valid, account: r.account || null, reason: r.reason || null })); process.exit(r.valid ? 0 : 2); })
    .catch(e => { console.error('失败:', e.message); process.exit(1); });
}