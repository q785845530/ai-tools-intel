// run.js —— 运营平台主入口：采集 → 生成 → 启动服务
// 用法：node run.js          （单次采集+生成+启动HTTP服务）
//       node run.js --cron   （每小时自动采集，持续运行）
'use strict';
const { collectAll } = require('./lib/intel');
const { generateBatch } = require('./lib/generator');
const { adaptBatch } = require('./lib/publish');
const { generate: buildSite } = require('./lib/site');
const { start } = require('./lib/server');
const audit = require('./lib/audit');

async function pipeline() {
  audit.log('info', 'pipeline', 'start', {});
  const intel = await collectAll();
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
  audit.log('info', 'pipeline', 'done', { intel, content, publish, site });
  return { intel, content, publish, site };
}

async function main() {
  // 服务优先：HTTP 服务在任何采集/生成失败时也必须存活（无人值守原则）
  await start();

  // 首次完整流水线（失败只留痕，不退出）
  try { await pipeline(); } catch (e) {
    audit.log('error', 'pipeline', 'startup.fail', { error: e.message });
  }

  // 如果带 --cron，每小时再跑一次采集+生成
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
