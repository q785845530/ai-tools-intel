// run.js —— 运营平台主入口：采集 → 生成 → 适配 → 建站 → 云端部署 → 微信草稿
// 用法：node run.js          （单次跑完+启动HTTP服务）
//       node run.js --cron   （每小时自动跑，持续运行）
// 设计原则：
//   1. 服务优先 —— HTTP 服务在任何失败时必须存活（无人值守）
//   2. 每步失败只留痕不阻断下一步（云端/微信都是旁路，挂了不影响主链路）
//   3. 微信草稿每篇只建一次（publish_log 判重），绝不刷屏草稿箱
'use strict';
const { collectAll } = require('./lib/intel');
const { generateBatch } = require('./lib/generator');
const { adaptBatch } = require('./lib/publish');
const { generate: buildSite } = require('./lib/site');
const { start } = require('./lib/server');
const { deployCloud } = require('./lib/cloud');
const audit = require('./lib/audit');
const { db } = require('./lib/db');

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

  // ── 旁路 1：云端部署（GitHub cron 对低活跃仓库会静默跳过，本地 dispatch 才是主通道）
  try {
    await deployCloud();
  } catch (e) {
    audit.log('error', 'pipeline', 'cloud.fail', { error: e.message });
  }

  // ── 旁路 2：微信草稿（只给「最新的日报/深文」建一次草稿，判重后跳过）
  try {
    await syncWechatDraft();
  } catch (e) {
    audit.log('error', 'pipeline', 'wechat.fail', { error: e.message });
  }

  return { intel, content, publish, site };
}

/** 把最新一篇未同步的 daily/deep 文章同步为微信草稿。
 *  注意：必须把选中的这篇直接交给 makeDraft —— 若改调 run()，
 *  run() 内部会按自己的排序重新选文章，判重就形同虚设（实测踩过：整点重复给同一篇建草稿）。 */
async function syncWechatDraft() {
  const { makeDraft } = require('./lib/wechat-publish');
  const row = db.prepare(`
    SELECT a.* FROM articles a
    WHERE a.status IN ('ready','published') AND a.kind IN ('daily','deep')
      AND NOT EXISTS (
        SELECT 1 FROM publish_log p
        WHERE p.article_id = a.id AND p.channel = 'wechat' AND p.status = 'draft_created'
      )
    ORDER BY CASE a.kind WHEN 'daily' THEN 0 ELSE 1 END, a.created_at DESC, a.id DESC
    LIMIT 1
  `).get();
  if (!row) return; // 没有未同步的，静默跳过
  const { draftId } = await makeDraft([row]);
  audit.log('info', 'pipeline', 'wechat.draft.synced', { articleId: row.id, title: row.title.slice(0, 40), draftId: draftId.slice(0, 20) + '…' });
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
