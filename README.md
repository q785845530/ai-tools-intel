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

## 公网上线 ✅ 已完成

**站点地址：https://q785845530.github.io/ai-tools-intel/**

仓库：`q785845530/ai-tools-intel`（公开）· 工作流：`.github/workflows/pages.yml`

上线记录（2026-10-25 20:53）：

| 步骤 | 结果 |
|---|---|
| 密钥泄漏扫描（推送前门禁） | ✅ 5 项全清 |
| 创建公开仓库 | ✅ HTTP 201 |
| 推送代码 | ✅ 72 文件 / 2466 行 |
| 开启 Pages（源=GitHub Actions） | ✅ build_type=workflow |
| 首次工作流运行 | ✅ run 40195078728，success，24 秒 |
| 公网可达验证 | ✅ HTTP 200 / 17385 bytes |

运行方式：**每小时 `17 * * * *` 自动**采集 → 撰写 → 部署，无需人工干预。
云端为全新空库，独立跑通完整流水线，不依赖本地数据。

> 手动重新部署：仓库 Actions 页 → "Deploy ops-site to GitHub Pages" → Run workflow

## 审计

```bash
node lib/audit.js verify   # 校验哈希链完整性（有篡改会报）
node lib/audit.js tail 50  # 看最近记录
```

日志目录 `log/audit-YYYYMMDD.jsonl`，按天分片，只追加不覆写。

## 平台扩展（公众号/知乎/小红书等）

`publishers/` 目录为发布适配器预留。当前文章已带完整溯源，天然适配各平台。

## 平台接入状态（2026-10-25）

| 平台 | 接入方式 | 状态 | 待办 |
|---|---|---|---|
| 自建站 | GitHub Pages | ✅ 全自动 | 无 |
| 知乎（数据） | 官方开放平台 API | ✅ 已接入 | 无 |
| 微信公众号 | 官方 API（草稿+发布） | ⏸ 代码就绪 | **需加 IP 白名单** |
| 知乎（发文） | Cookie 扫码登录 | ⏸ 待授权 | 需扫码一次 |
| 小红书 / 头条 | 半自动队列 | ✅ 成品已生成 | 人工复制发布 |

### 微信公众号 —— 需要你做一步

代码链路已完整（`lib/wechat.js` + `lib/wechat-publish.js`），只差 IP 白名单：

1. 登录 [微信公众平台](https://mp.weixin.qq.com)
2. 设置与开发 → 基本配置 → **IP白名单** → 添加：`120.239.145.51`
3. 完成后执行自检：`node lib/wechat.js`（应显示 ✅ 就绪）
4. 建草稿：`node lib/wechat-publish.js draft`
5. 直接发布：`node lib/wechat-publish.js publish`

> 说明：本机到 `api.weixin.qq.com` 的出口 IP 实测稳定（连续 6 次一致）。
> 若你更换运行环境，需重新查 IP 并更新白名单。

### 知乎 —— 两套体系，且本环境被风控

- **Access Secret**（你给的）：用于**数据开放平台**，可读热榜/搜索/直答，**不能发文**。已作为垂直情报主源接入，实测正常。
- **发文**：知乎无公开发文 API。社区 `zhihu-cli` 走 **Cookie 扫码登录**。
  本环境实测结果（2026-10-25）：
  - 二维码可正常申请并渲染（`lib/zhihu-login.js`）
  - 但 `scan_info` 轮询被拒，最终确认原因是**环境被知乎人机验证风控标记**：
    首页 `302 → /account/unhuman`，问题页 `403`，`search_v3` `403`
  - ZSE 签名（`lib/zse.js`，移植自 zhihu-cli AGPL-3.0）实现正确，但风控在签名之前就拦截
- **结论**：**不绕过 `unhuman` 人机验证**（那是知乎明确的真人验证要求）。
  知乎保持**半自动队列**：成品稿在 `content/published/zhihu/`，人工复制发布。
  Cookie 相关代码保留（`lib/zhihu-login.js`），换到住宅网络环境后可直接复用。

> ⚠️ 环境自查：本环境的出口为数据中心 IP，对风控严格的平台（知乎）天然不友好。
> 若需在这些平台全自动，建议部署在有稳定住宅 IP 的机器上。

## 微信公众号 API 能力边界（实测）

| 接口 | 结果 |
|---|---|
| `stable_token` 取令牌 | ✅ 可用 |
| `material/add_material` 上传封面 | ✅ 可用 |
| `draft/add` 新建草稿 | ✅ 可用 |
| `draft/get` `draft/batchget` 读取 | ✅ 可用 |
| `draft/delete` 删除草稿 | ✅ 可用 |
| `menu` 自定义菜单 | ✅ 可用 |
| `freepublish/submit` 发布 | ❌ `48001 api unauthorized` |
| `message/mass/*` 群发 | ❌ `48001` |
| `tags/get` 用户标签 | ❌ `48001` |

**结论**：当前账号（未认证订阅号形态）**可自动建草稿，但不可 API 发布**。
所以工作流是 **自动生成 → 自动建草稿（含封面）→ 后台一键发布**。
如需 API 全自动发布，需完成公众号认证（认证后可解锁 `freepublish` 系列接口）。

> 实现提示：`getToken()` 使用官方 `stable_token` 接口。不要用 `/cgi-bin/token`——
> 它是单例，重复获取会使正在使用的 token 失效（实测踩过 40001）。

## 内容定位

公众号「**智能制造大时代**」→ 内容定位 **AI 在制造业的真实落地**。

生成器按五个行业栏目自动分类：
| 栏目 | 判定关键词（示例） |
|---|---|
| 政策风向 | 政策、规划、工信部、标准、试点 |
| 落地说 | 案例、上线、产线、车间、降本 |
| 技术前沿 | 大模型、视觉、质检、数字孪生、具身 |
| 展会动态 | 工博会、大会、论坛、发布、亮相 |
| 产业观察 | 趋势、转型、挑战、为什么、如何 |

情报源优先级：**知乎垂类搜索 > 知乎热榜 > HN / GitHub / Lobsters**（英文源降为辅助）。

## 数据

- SQLite：`data/ops.db`（intel 情报 / articles 文章 / publish_log 发布记录 / metrics 数据）
- 内容原始稿：`content/`（drafts 草稿 / published 已发）
- 封面图：`data/covers/`（零依赖 PNG 生成，900×383）
- 凭据：`config/credentials.json`（0600 权限，**已被 .gitignore 排除，绝不提交**）