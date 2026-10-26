// lib/config.js —— 统一配置读取（令牌、凭据等）
//
// 【全局约定】令牌优先从「任务日记 → 关于」的令牌库取（见 lib/token-source.js），
// config/tokens.json 只作为本地兜底（存放微信/知乎等任务日记里没有的凭据）。
// 不要在各模块里硬编码或另起一套读法。
'use strict';

const fs = require('fs');
const path = require('path');
const { resolveToken } = require('./token-source');

const TOKENS_PATH = path.resolve(__dirname, '..', 'config', 'tokens.json');

let tokensCache = null;

/**
 * 读取本地兜底配置（config/tokens.json）
 * 注意：这里只放任务日记令牌库覆盖不到的字段（微信 appid/secret、知乎 secret 等）。
 * @returns {Object} { github?, gitee?, wechat_appid, wechat_secret, zhihu_access_secret }
 */
function getTokens() {
  if (tokensCache) return tokensCache;

  try {
    const raw = fs.readFileSync(TOKENS_PATH, 'utf8');
    tokensCache = JSON.parse(raw);
    return tokensCache;
  } catch (err) {
    if (err.code === 'ENOENT') {
      throw new Error(`令牌配置文件不存在: ${TOKENS_PATH}\n请先创建 config/tokens.json 并填入微信/知乎等凭据`);
    }
    throw new Error(`读取令牌配置失败: ${err.message}`);
  }
}

/**
 * 获取 GitHub 令牌
 * 优先级：环境变量 → 任务日记令牌库 → config/tokens.json
 * @returns {string} ghp_xxx
 */
function getGitHubToken() {
  const r = resolveToken('github');
  if (!r.value) {
    throw new Error('未找到 GitHub 令牌：请在任务日记「关于」页签保存 GitHub 令牌，或设置 GH_TOKEN/GITHUB_TOKEN，或写入 config/tokens.json 的 github 字段');
  }
  return r.value;
}

/**
 * 获取 Gitee 令牌
 * 优先级：环境变量 → 任务日记令牌库 → config/tokens.json
 * @returns {string|null}
 */
function getGiteeToken() {
  return resolveToken('gitee').value;
}

/**
 * 获取微信凭据（任务日记令牌库不管微信，只从本地配置/环境变量取）
 * @returns {Object} { appid, secret }
 */
function getWechatCredentials() {
  if (process.env.WX_APPID && process.env.WX_APPSECRET) {
    return { appid: process.env.WX_APPID, secret: process.env.WX_APPSECRET };
  }
  const tokens = getTokens();
  if (!tokens.wechat_appid || !tokens.wechat_secret) {
    throw new Error('config/tokens.json 中缺少 wechat_appid 或 wechat_secret 字段');
  }
  return {
    appid: tokens.wechat_appid,
    secret: tokens.wechat_secret
  };
}

/**
 * 获取知乎 Access Secret
 * @returns {string}
 */
function getZhihuSecret() {
  if (process.env.ZHIHU_ACCESS_SECRET) return process.env.ZHIHU_ACCESS_SECRET.trim();
  const tokens = getTokens();
  return tokens.zhihu_access_secret || '';
}

/**
 * 清除缓存（用于测试或重新加载）
 */
function clearCache() {
  tokensCache = null;
  require('./token-source').clearCache();
}

module.exports = {
  getTokens,
  getGitHubToken,
  getGiteeToken,
  getWechatCredentials,
  getZhihuSecret,
  clearCache,
  TOKENS_PATH
};
