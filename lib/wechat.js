// lib/wechat.js —— 微信公众号发布模块（官方 API）
// 链路：access_token → 上传封面（永久素材）→ 新建草稿 → 提交发布 → 查询结果
// 前置条件：公众平台 → 设置与开发 → 基本配置 → IP白名单 必须包含本机出口 IP
'use strict';
const fs = require('node:fs');
const path = require('node:path');
const audit = require('./audit');

const API = 'https://api.weixin.qq.com';
const CRED_FILE = path.resolve(__dirname, '..', 'config', 'credentials.json');
const TOKEN_CACHE = path.resolve(__dirname, '..', 'data', 'wx-token.json');

function creds() {
  if (process.env.WX_APPID && process.env.WX_APPSECRET) {
    return { appid: process.env.WX_APPID, appsecret: process.env.WX_APPSECRET };
  }
  const j = JSON.parse(fs.readFileSync(CRED_FILE, 'utf8'));
  return { appid: j.wechat.appid, appsecret: j.wechat.appsecret };
}

/** 微信错误码解释（把 errcode 翻译成可执行结论，而不是丢个数字给用户） */
const ERR_HINT = {
  40164: '调用方 IP 不在白名单 → 公众平台 → 设置与开发 → 基本配置 → IP白名单 添加本机出口 IP',
  40001: 'access_token 无效或过期 → 自动重取即可',
  40013: 'AppID 无效',
  40125: 'AppSecret 无效 → 请核对 公众平台 → 基本配置 → AppSecret',
  45009: '接口调用频率超限 → 降低发布频率',
  40007: 'media_id 无效或已过期',
  48001: 'api 功能未授权 → 该账号类型不支持此接口（发布接口需认证）',
  45001: '接口调用超时',
  40008: '素材类型不合法',
  41001: '缺少 access_token 参数',
};

function wxCtx(data) {
  const e = data && data.errcode;
  return e ? `${e}: ${data.errmsg}${ERR_HINT[e] ? ' —— ' + ERR_HINT[e] : ''}` : null;
}

/** 取 access_token
 *  使用官方 stable_token 接口（而非 /cgi-bin/token）：
 *   1. 不会被其它调用顶掉（普通 /token 接口是单例，重复获取会使旧 token 失效）
 *   2. 支持 force_refresh 显式刷新
 *  这对无人值守的 7×24 运行是必需的。 */
async function getToken(force = false) {
  try {
    if (!force) {
      const c = JSON.parse(fs.readFileSync(TOKEN_CACHE, 'utf8'));
      if (c.token && Date.now() - c.at < 7000 * 1000) return c.token;
    }
  } catch { /* 无缓存，正常走网络 */ }

  const { appid, appsecret } = creds();
  const res = await fetch(`${API}/cgi-bin/stable_token`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ grant_type: 'client_credential', appid, secret: appsecret, force_refresh: !!force }),
    signal: AbortSignal.timeout(20000),
  });
  const j = await res.json();
  if (wxCtx(j)) throw new Error('取 token 失败 → ' + wxCtx(j));
  fs.mkdirSync(path.dirname(TOKEN_CACHE), { recursive: true });
  fs.writeFileSync(TOKEN_CACHE, JSON.stringify({ token: j.access_token, at: Date.now(), via: 'stable_token' }), { mode: 0o600 });
  audit.log('info', 'wechat', 'token.obtained', { expiresIn: j.expires_in, via: 'stable_token', force });
  return j.access_token;
}

/** 上传图片为永久素材，返回 media_id（草稿封面必需） */
async function uploadImage(token, filePath) {
  const buf = fs.readFileSync(filePath);
  const boundary = '----opsintel' + Math.random().toString(16).slice(2);
  const head = Buffer.from(
    `--${boundary}\r\nContent-Disposition: form-data; name="media"; filename="${path.basename(filePath)}"\r\n` +
    `Content-Type: image/png\r\n\r\n`, 'utf8');
  const tail = Buffer.from(`\r\n--${boundary}--\r\n`, 'utf8');
  const body = Buffer.concat([head, buf, tail]);

  const res = await fetch(`${API}/cgi-bin/material/add_material?access_token=${token}&type=image`, {
    method: 'POST',
    headers: { 'Content-Type': `multipart/form-data; boundary=${boundary}`, 'Content-Length': String(body.length) },
    body,
    signal: AbortSignal.timeout(60000),
  });
  const j = await res.json();
  if (wxCtx(j)) throw new Error('上传封面失败 → ' + wxCtx(j));
  audit.log('info', 'wechat', 'cover.uploaded', { mediaId: j.media_id, bytes: buf.length });
  return j.media_id;
}

/** 新建草稿。articles 为数组，每项 {title, content(html), thumbMediaId, digest} */
async function addDraft(token, articles) {
  const res = await fetch(`${API}/cgi-bin/draft/add?access_token=${token}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ articles: articles.map(a => ({
      title: a.title.slice(0, 64),
      author: a.author || '智能制造大时代',
      digest: (a.digest || '').slice(0, 120),
      content: a.content,
      content_source_url: a.sourceUrl || '',
      thumb_media_id: a.thumbMediaId,
      need_open_comment: 1,
      only_fans_can_comment: 0,
    })) }, 'utf8'),
    signal: AbortSignal.timeout(30000),
  });
  const j = await res.json();
  if (wxCtx(j)) throw new Error('新建草稿失败 → ' + wxCtx(j));
  audit.log('info', 'wechat', 'draft.created', { mediaId: j.media_id, count: articles.length });
  return j.media_id;
}

/** 提交发布（freepublish）。注意：该接口需账号具备发布能力 */
async function publish(token, draftMediaId) {
  const res = await fetch(`${API}/cgi-bin/freepublish/submit?access_token=${token}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ media_id: draftMediaId }),
    signal: AbortSignal.timeout(30000),
  });
  const j = await res.json();
  if (wxCtx(j)) throw new Error('提交发布失败 → ' + wxCtx(j));
  audit.log('info', 'wechat', 'publish.submitted', { publishId: j.publish_id, draftMediaId });
  return j.publish_id;
}

/** 查询发布状态。status: 0成功 1发布中 2原创失败 3常规失败 ... */
async function publishStatus(token, publishId) {
  const url = `${API}/cgi-bin/freepublish/get?access_token=${token}`;
  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ publish_id: publishId }),
    signal: AbortSignal.timeout(20000),
  });
  const j = await res.json();
  if (wxCtx(j)) throw new Error('查询发布状态失败 → ' + wxCtx(j));
  return j;
}

/** 联通性自检：把当前状态一次性说清楚，不抛异常
 *  注意：这里必须复用 getToken 的缓存路径，不能裸调 token 接口 —— 
 *  否则会把正在使用的 token 顶掉（微信单例策略），导致后续调用 40001。 */
async function diagnose() {
  const out = { ok: false, step: '', detail: '', ip: null };
  try {
    const { appid, appsecret } = creds();
    out.appid = appid;
    // 走 stable_token 探测（force_refresh=false，不影响已有 token）
    const res = await fetch(`${API}/cgi-bin/stable_token`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ grant_type: 'client_credential', appid, secret: appsecret, force_refresh: false }),
      signal: AbortSignal.timeout(20000),
    });
    const j = await res.json();
    out.http = res.status;
    if (j.errcode === 40164) {
      const ip = (j.errmsg.match(/(\d+\.\d+\.\d+\.\d+)/) || [])[1];
      out.ip = ip;
      out.step = 'IP_WHITELIST';
      out.detail = `出口 IP ${ip} 未在白名单。请到 公众平台 → 设置与开发 → 基本配置 → IP白名单 添加该 IP。`;
      return out;
    }
    if (j.errcode === 40125 || j.errcode === 40013) {
      out.step = 'BAD_CREDENTIAL';
      out.detail = wxCtx(j);
      return out;
    }
    if (j.errcode) { out.step = 'OTHER_ERROR'; out.detail = wxCtx(j); return out; }
    // 写入缓存，后续调用直接复用
    fs.mkdirSync(path.dirname(TOKEN_CACHE), { recursive: true });
    fs.writeFileSync(TOKEN_CACHE, JSON.stringify({ token: j.access_token, at: Date.now(), via: 'stable_token' }), { mode: 0o600 });
    out.ok = true;
    out.step = 'READY';
    out.detail = `stable_token 获取成功，有效期 ${j.expires_in} 秒，素材与草稿接口可用。`;
    return out;
  } catch (e) {
    out.step = 'NETWORK';
    out.detail = e.message;
    return out;
  }
}

module.exports = { getToken, uploadImage, addDraft, publish, publishStatus, diagnose, ERR_HINT };

if (require.main === module) {
  diagnose().then(r => {
    console.log('════ 微信 API 联通性诊断 ════');
    console.log(`  结论: ${r.ok ? '✅ 就绪' : '❌ ' + r.step}`);
    console.log(`  说明: ${r.detail}`);
    if (r.appid) console.log(`  AppID: ${r.appid}`);
    if (r.ip) console.log(`  本机出口 IP: ${r.ip}`);
    console.log(`  时间: ${new Date().toISOString()}`);
  });
}