// lib/config.js —— 统一配置读取（令牌、凭据等）
// 所有敏感信息从 config/tokens.json 读取，不再分散在各处
'use strict';

const fs = require('fs');
const path = require('path');

const TOKENS_PATH = path.resolve(__dirname, '..', 'config', 'tokens.json');

let tokensCache = null;

/**
 * 读取令牌配置
 * @returns {Object} { github, wechat_appid, wechat_secret }
 */
function getTokens() {
  if (tokensCache) return tokensCache;
  
  try {
    const raw = fs.readFileSync(TOKENS_PATH, 'utf8');
    tokensCache = JSON.parse(raw);
    return tokensCache;
  } catch (err) {
    if (err.code === 'ENOENT') {
      throw new Error(`令牌配置文件不存在: ${TOKENS_PATH}\n请先创建 config/tokens.json 并填入 GitHub/微信凭据`);
    }
    throw new Error(`读取令牌配置失败: ${err.message}`);
  }
}

/**
 * 获取 GitHub 令牌
 * @returns {string} ghp_xxx
 */
function getGitHubToken() {
  const tokens = getTokens();
  if (!tokens.github) {
    throw new Error('config/tokens.json 中缺少 github 字段');
  }
  return tokens.github;
}

/**
 * 获取微信凭据
 * @returns {Object} { appid, secret }
 */
function getWechatCredentials() {
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
 * 清除缓存（用于测试或重新加载）
 */
function clearCache() {
  tokensCache = null;
}

module.exports = {
  getTokens,
  getGitHubToken,
  getWechatCredentials,
  clearCache,
  TOKENS_PATH
};
