# ops 进程托管改造方案：以云端 GitHub Actions 为准

> 落盘日期：2026-11-04
> 目标：内容生产不再依赖容器内本地长驻进程；本地进程被容器周期性回收时，
> 数据积累与公网站点更新都不受影响。

## 一、问题（已核实，非推测）

| 事实 | 证据 |
|---|---|
| 数据在 `data/ops.db`，`data/` 在 `.gitignore` 里 → **.db 不入库** | `git ls-files \| grep '\.db$'` 为 0；`db.js` 用 `path.join(DATA,'ops.db')` |
| 云端 workflow 自己跑 `intel.js → generator.js → publish.js adapt → site.js` 再部署 Pages | `.github/workflows/pages.yml` |
| 云端每次 `actions/checkout` 都是**空库重来**：采一轮 → 生成 → 部署 → 数据丢弃 | 仓库里没有 .db，也没有任何状态文件 |
| 本地 `node run.js --cron` + `scripts/watchdog.sh` 会被容器一起回收 | 11-02 停约 11h、11-04 又死；watchdog 同批被清 |
| **GitHub `schedule` 现在能正常跑** | 实测近 24h：push 10 / workflow_dispatch 19 / **schedule 11 且全 success** |

### 需要更正的旧结论

README 与 `lib/cloud.js` 头部都写着「GitHub 对低活跃仓库的 schedule 定时任务会
静默跳过（实测 4 个整点窗口 0 触发）」。**这与当前事实不符**：schedule 已恢复正
常触发。旧结论是当时写下 `cloud.js`（本地整点主动 `workflow_dispatch`）的理由，
本次改造保留 `cloud.js` 作为可选冗余，但不再把它描述成「唯一可靠触发」。

### 核心缺陷

云端空库重来 → 每轮之间没有任何状态传递：
1. 去重失效：`intel` 表的 `UNIQUE(source, ext_id)` 只在单次 run 内有效，下一轮
   同样的 URL 会被当新情报重新采集；
2. 历史丢失：有效情报与已生成文章不跨轮累积，`site.js` 只能展示本轮采到的东西；
3. 本地死了就丢：本地 .db 不入库，容器回收后历史无法从仓库恢复。

## 二、方案选型（三选一，论证后定）

| 方案 | 做法 | 优点 | 否决理由 |
|---|---|---|---|
| **b. Actions cache/artifact 存 .db** | 用 `actions/cache` 或 artifact 持久化 `data/ops.db` | 改动最小，不改业务代码 | cache 有 7 天过期、并发写入竞争（concurrency group 下 cancel-in-progress 会丢写入）；二进制 .db 无法进 git 做审计/diff，违背「全程可审计、不删记录」的约束；artifact 需跨 run 引用，逻辑脆 |
| **c. 承认云端无状态** | 每轮独立快照，历史全交给本地 | 零改动 | 等于没解决问题：本地进程一死，历史就丢，正是本次要消灭的风险 |
| **a. 轻量文本状态入库并回传（选定）** | `cloud/state.json` 存「有效情报 + 有效文章」的最小记录；云端启动灌回空 .db，结束导出写回 | 纯文本、可 diff、可进 git 审计；随 `lib/push.js` 走；不改 `intel/generator/site` 一行逻辑；本地也能用它恢复 | 状态文件会随情报量增长（需定期裁剪，见 §四） |

**选 a**。决定性理由：去重键 `(source, ext_id)` 是从 URL/内容派生的稳定文本标识
（`intel.js` 全部用 `INSERT OR IGNORE ... ext_id`），天然适合文本化；而且 generator
依赖情报正文（不只是去重键），状态文件必须能还原成 .db —— a 满足，b 是黑盒，
c 不满足。

## 三、落地设计

### 状态文件 `cloud/state.json`（入库）

```jsonc
{
  "version": 1,
  "updated_at": "ISO8601",
  "intel":   [ /* 有效情报：source, ext_id, title, url, summary, points,
                  published_at, fetched_at, relevance, used */ ],
  "articles":[ /* 有效文章：slug, kind, title, dek, body_md, source_urls,
                  source_ids, generator, score, status, created_at,
                  published_at, relevance */ ],
  "audit_tail": [ /* 最近 N 条审计摘要，仅用于可追溯，不参与还原 */ ]
}
```

- 体积实测：378 条有效情报 ≈ 182 KB，单条 ≈ 492 bytes；每轮增量几十条，可控。
- **只存 `relevance='ok'` 的记录**。`off` 记录仍是本地事实，但按约定不删除、
  不省略：它们留在本地 .db 与 `log/audit-*.jsonl`（审计日志本就入库），不进状态文件。

### 新模块 `lib/cloud-state.js`（零依赖）

- `restore()`：读 `cloud/state.json` → 用 `INSERT OR IGNORE` 把 intel/articles
  灌进当前 .db。本地有 .db 时是增量合并，云端空库时是完整还原。幂等，可重跑。
- `export_()`：从 .db 导出有效情报 + 有效文章 → 原子写回 `cloud/state.json`。
  **只增不删**：与现有状态文件做并集，绝不因为本轮 .db 里少了某条就把它从状态
  文件里抹掉（防止空库覆盖历史）。
- CLI：`node lib/cloud-state.js restore` / `export` / `status`。

### workflow 调整

```
checkout
  → node lib/cloud-state.js restore        # 新增：还原跨轮状态
  → node lib/intel.js                      # 采增量（去重键已在库里）
  → node lib/generator.js || true
  → node lib/publish.js adapt || true
  → node lib/cloud-state.js export         # 新增：导出新状态
  → git add cloud/state.json && commit && git push（仅在有变化时）
  → node lib/site.js                       # 用完整库生成站点
  → upload/deploy Pages
```

- 状态回写用 workflow 自带的 `GITHUB_TOKEN` + `contents: write` 权限；
  不使用 `lib/push.js`（那是本地双远端推送，云端只需要推 GitHub 一个）。
- 回写 commit 会以 `push` 再次触发 workflow → 用 `paths-ignore: cloud/state.json`
  或在 commit message 加标记跳过，避免自触发循环。
- `concurrency: cancel-in-progress: true` 保留，但状态回写放在 deploy 之前，
  即使被取消，已采情报也不会进状态文件 —— 下一轮重采即可，不会写坏状态。

### 本地侧

- `run.js` 每轮流水线末尾调用 `cloud-state export`，让本地新采的情报也进状态文件，
  再走 `lib/push.js` 回传。这样**本地与云端共享同一份状态**，任何一方死了另一方都能续上。
- `cloud.js` 的 `workflow_dispatch` 降级为「可选冗余」，注释更正。

## 四、约束与遗留风险

- **不删审计**：`log/audit-*.jsonl` 全部保留、全部入库；状态文件的 `audit_tail`
  只是摘要，不替代审计链。`node lib/audit.js verify` 必须始终通过。
- **不 force**：状态回写与 `lib/push.js` 都不用 `--force`。
- **状态文件增长**：情报无限累积会撑大仓库。缓解：状态文件只保留 `relevance='ok'`
  且按 `fetched_at` 保留最近 N 条（默认 2000，可配）；被裁掉的记录仍在本地 .db 与
  审计日志里，不是删除事实，只是不再跨端同步。
- **并发写冲突**：本地 push 与云端回写可能同时改 `cloud/state.json`。用 `export_()`
  的「并集合并」语义 + 云端回写前先 `git pull --rebase` 降低冲突；真冲突时
  保留双方记录（并集），不丢数据。
- **secret**：`ZHIHU_ACCESS_SECRET` 仍由 GitHub Secrets 提供，不进代码、不进状态文件。
- **微信手动通道**：不受本次改造影响，仍是 `content/wechat-queue/` 本地产物。

## 五、验收口径

1. `docs/HOSTING-PLAN.md` 存在且写明选型理由；
2. `node lib/audit.js verify` 完整；
3. `node lib/cloud-state.js status` 能读出状态；restore/export 幂等（连跑两次条数不增）；
4. 本地 `node lib/push.js` 推送成功（GitHub 走 API 回退亦可）；
5. 云端最近一次 run `conclusion=success` 且 `Collect intel` 步骤成功；
6. Pages 站点 https://q785845530.github.io/ai-tools-intel/ 可访问；
7. README 旧结论更正、本地进程定位改为「内部管理台 / 可选」；
8. 中文改造报告交付用户。
