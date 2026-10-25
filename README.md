# ops 自动运营平台 · 部署与使用说明

## 当前系统已跑通（本地，零依赖）

```
run.js                主入口：采集→撰写→生成→起 HTTP 服务→每小时 cron
lib/intel.js          情报采集：Hacker News + GitHub Search + Lobsters（三源已冒烟通过）
lib/generator.js      内容撰写：模板引擎 v1（1篇每日精选 + 3条单条速递），全部字段溯源
lib/site.js           双层静态站：原创速递 + 情报流，含溯源块
lib/server.js         零依赖 HTTP 服务（端口 8765）
lib/audit.js          哈希链审计日志（可验证不可篡改，node lib/audit.js verify）
lib/db.js             SQLite WAL 数据基座（intel/articles/publish_log/metrics）
lib/md.js             极简 Markdown 渲染
```

## 启动

```bash
cd ops
node run.js            # 单次采集+生成+启动服务
node run.js --cron     # 启动 + 每小时自动采集撰写（7×24）
# 端口默认 8765，可 OPS_PORT=8080 node run.js --cron
```

当前正在运行：`node run.js --cron`（服务在 http://127.0.0.1:8765）

## 公网上线（GitHub Pages）—— 只差一步

部署工作流已写好：`deploy/.github/workflows/pages.yml`
流程：每小时（cron '17 * * * *'）在 GitHub Actions 里拉最新情报 → 生成静态站 → 发布到 `https://<你的用户名>.github.io/ops/`

你需要做的（一次性，5 分钟）：
1. 建一个公开仓库，例如 `ops`
2. 把 `ops` 目录内容推上去（git push 到 main 分支）
3. 仓库 Settings → Pages → Source 选 **GitHub Actions**

> ⚠️ 为什么必须是你来推：公网上线需要你的 GitHub 身份与 Pages 授权。
> 我不会冒充你的身份推送任何内容 —— 这是账号合规的铁律。
> 推上去之后，每小时自动更新，无需你再操作。

## 审计

```bash
node lib/audit.js verify   # 校验哈希链完整性（有篡改会报）
node lib/audit.js tail 50  # 看最近记录
```

日志目录 `log/audit-YYYYMMDD.jsonl`，按天分片，只追加不覆写。

## 平台扩展（公众号/知乎/小红书等）

`publishers/` 目录为发布适配器预留。当前文章已带完整溯源，天然适配各平台：
- 有官方 API 的（公众号）→ 全自动定时发布
- 无 API 的（知乎/小红书）→ 半自动队列（生成→排队→一键复制粘贴）
接入需对应平台凭据，与本站部署同理，凭据由你本人提供，系统不代注册。

## 数据

- SQLite：`data/ops.db`（intel 情报 / articles 文章 / publish_log 发布记录 / metrics 数据）
- 内容原始稿：`content/`（drafts 草稿 / published 已发）