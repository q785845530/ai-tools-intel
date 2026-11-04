// run.js —— 运营平台主入口：采集 → 生成 → 适配 → 建站 → 云端部署 → 微信待发队列
// 用法：node run.js          （单次跑完+启动HTTP服务）
//       node run.js --cron   （每小时自动跑，持续运行）
// 设计原则：
//   1. 服务优先 —— HTTP 服务在任何失败时必须存活（无人值守）
//   2. 每步失败只留痕不阻断下一步（云端/微信都是旁路，挂了不影响主链路）
//   3. 微信走【手动通道】：不再调 API 建草稿（容器出口 IP 漂移导致 40164 无解），
//      改为把稿子整理成可直接粘贴的 md 文件，由人点发布。
'use strict';
const { collectAll } = require('./lib/intel');
const { enrichSummaries } = require('./lib/enrich');
const { generateBatch } = require('./lib/generator');
const { adaptBatch } = require('./lib/publish');
const { generate: buildSite } = require('./lib/site');
const { start } = require('./lib/server');
const { deployCloud } = require('./lib/cloud');
const { exportPending: exportWechatQueue } = require('./lib/wechat-manual');
const cloudState = require('./lib/cloud-state');
const audit = require('./lib/audit');
const { db } = require('./lib/db');

async function pipeline() {
  audit.log('info', 'pipeline', 'start', {});
  const intel = await collectAll();
  // ── 摘要回填：必须排在内容生成之前 ──────────────────────────────
  // 实测 238 条 ok 记录里 237 条 summary 为空（media 只抓列表页标题、zhihu 上游不返回摘要），
  // 没有正文就没有「核心观点」可提取，深文只能复读标题。这里按原文详情页回填。
  // 限量 + 限速：单轮 30 条、站间 900ms，抓不到的源（知乎 403）记 unsupported 不反复重试。
  let enrich = null;
  try {
    enrich = await enrichSummaries(30);
    audit.log('info', 'pipeline', 'enrich.done', enrich);
  } catch (e) {
    // 回填失败不能拖垮主链路（情报站本身仍要更新）
    audit.log('error', 'pipeline', 'enrich.fail', { error: e.message });
  }

  let content = null;
  try {
    content = generateBatch();
  } catch (e) {
    // 内容生成失败不应阻断情报站更新 —— 但必须留痕
    audit.log('error', 'pipeline', 'generate.fail', { error: e.message });
  }
  let publish = null;
  try {
    publish = adaptBatch().length;
  } catch (e) {
    audit.log('error', 'pipeline', 'publish.fail', { error: e.message });
  }
  const site = buildSite();
  audit.log('info', 'pipeline', 'done', { intel, enrich, content, publish, site });

  // ── 旁路 0：导出跨轮状态到本地仓库（云端 Actions 为准的托管模式）
  // 与云端共用同一份 cloud/state.json；本地新采的情报也进状态文件，随 lib/push.js
  // 回传。任一端被回收，另一端都能从状态文件续上。见 docs/HOSTING-PLAN.md。
  try {
    const st = cloudState.export();
    audit.log('info', 'pipeline', 'cloud.state.ok', st);
  } catch (e) {
    audit.log('error', 'pipeline', 'cloud.state.fail', { error: e.message });
  }

  // ── 旁路 1：云端部署（冗余）
  // 2026-11-04 核实：GitHub schedule 现在能正常触发（近 24h 11 次全 success），
  // 旧结论「低活跃仓库会静默跳过」已不成立。dispatch 降级为可选冗余，不再声称主通道。
  try {
    await deployCloud();
  } catch (e) {
    audit.log('error', 'pipeline', 'cloud.fail', { error: e.message });
  }

  // ── 旁路 2：微信待发队列（B 方案，不再调 API）
  // 背景：容器出口 IP 每次请求都在变，微信 IP 白名单永远对不上，40164 无法自愈。
  // 2026-11-02 用户决策改手动通道：机器只整理稿子，人点发布。
  // 这一步是纯本地文件操作，不会失败、不需要网络、不需要凭据。
  try {
    const r = exportWechatQueue({ limit: 20 });
    audit.log('info', 'pipeline', 'wechat.queue.ok', { exported: r.exported, queueTotal: r.queueTotal });
  } catch (e) {
    audit.log('error', 'pipeline', 'wechat.queue.fail', { error: e.message });
  }

  return { intel, content, publish, site };
}

async function main() {
  // 服务优先：HTTP 服务在任何采集/生成失败时也必须存活（无人值守原则）
  await start();

  // 首次完整流水线（失败只留痕，不退出）
  try { await pipeline(); } catch (e) {
    audit.log('error', 'pipeline', 'startup.fail', { error: e.message });
  }

  // 如果带 --cron，每小时再跑一次完整流水线
  if (process.argv.includes('--cron')) {
    const INTERVAL_MS = 60 * 60 * 1000; // 1 hour
    setInterval(async () => {
      try {
        await pipeline();
      } catch (e) {
        audit.log('error', 'pipeline', 'cron.fail', { error: e.message });
      }
    }, INTERVAL_MS);
    audit.log('info', 'pipeline', 'cron.enabled', { intervalMs: INTERVAL_MS });
  }
}

main().catch(e => {
  audit.log('error', 'system', 'fatal', { error: e.message, stack: e.stack });
  console.error('FATAL:', e);
  process.exit(1);
});
