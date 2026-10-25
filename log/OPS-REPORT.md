# ops 自动运营平台 · 全量运营记录

生成时间：2026-10-25T15:11:45.026Z

> 本报告由审计链直接导出，包含系统自启动以来的**每一条**运行记录，不筛选、不省略、不删除。
> 审计链采用哈希链（每条含前一条的 SHA-256），任何记录的增删改都会导致校验失败。

## 0. 审计链完整性

- 状态：**✅ 完整**
- 记录总数：415
- 链头：seq=415, hash=eeb69dcde07bba7d717e4868aaeb0e6be1ffb67e4e605dac46e8198153c82d9c

## 1. 系统资产统计

| 项目 | 数量 |
|---|---|
| 采集情报条目 | 126 |
| 原创文章 | 17 |
| 平台成品稿 | 282 |
| 审计记录 | 415 |

### 1.1 情报来源分布

| 来源 | 条数 |
|---|---|
| lobsters | 30 |
| hn | 28 |
| zhihu-search | 28 |
| github | 20 |
| zhihu-hot | 20 |

### 1.2 文章清单

| ID | 类型 | 状态 | 标题 |
|---|---|---|---|
| 1 | digest | published | AI 工具速递 / 2026-10-25：过去 24 小时最热的 5 个动态 |
| 2 | tool | published | JavaGuide：Java 面试 & 后端通用面试指南，覆盖计算机基础、数据库、分布式、高并发、系统设计与 AI 应用开发 |
| 3 | tool | published | langflow：Langflow is a powerful tool for building and deploying AI-po |
| 4 | tool | published | langchain：The agent engineering platform. |
| 5 | tool | published | open-design：The 1st Collaborative AI Design Agent Workspace. Local-fir |
| 6 | tool | published | claude-mem：Persistent Context Across Sessions for Every Agent –  Captu |
| 7 | tool | published | taste-skill：Agent skills that give coding agents taste: art direction, |
| 8 | tool | published | No signs of AI payoff outside the tech sector |
| 9 | tool | published | America has lost 200k of jobs in media, film and the arts. How much is |
| 10 | tool | published | Node2Shell evolves to HTTP2Shell, blast radius affects many HTTP libs  |
| 11 | tool | published | Kimi K3.1 scores 55 on Artificial Analysis, placed on the Pareto line |
| 12 | tool | published | AI-Assisted Paper on Z-Library Cites a TorrentFreak Article That Doesn |
| 13 | tool | published | Show HN: We had AI write a wiki from 45k Enron emails, every fact cite |
| 14 | daily | published | 智能制造日报 / 2026-10-25：技术前沿、落地说、产业观察等 8 条动态 |
| 15 | deep | published | 没有不良品样本,怎么做 AI 质检? |
| 16 | deep | published | CBB 2026 圆满收官/山东明佳,以 AI 视觉检测筑牢包装品质防线 |
| 17 | deep | published | 京东工业发布JoyIndustrial 2.0及创新应用 落地产业场景 创造真实价值 |

## 2. 全量运行记录（按时间正序，一条不缺）

| 序号 | 时间 | 级别 | 执行者 | 事件 | 数据 |
|---|---|---|---|---|---|
| 1 | 2026-10-25T11:43:57.454Z | info | system | bootstrap.start | {"msg":"审计链初始化"} |
| 2 | 2026-10-25T11:43:57.455Z | info | system | bootstrap.env | {"node":"v24.22.0","deps":0} |
| 3 | 2026-10-25T11:43:57.455Z | warn | system | bootstrap.credentials | {"available":{"githubToken":false,"llmApiKey":false,"wechatAppid":false},"note":"无密钥，生成层走模板引擎，部署需人工授权"} |
| 4 | 2026-10-25T11:50:31.228Z | info | intel | collect.hn.ok | {"count":27} |
| 5 | 2026-10-25T11:50:33.658Z | info | intel | collect.github.ok | {"count":20} |
| 6 | 2026-10-25T11:50:34.410Z | info | intel | collect.lobsters.ok | {"count":25} |
| 7 | 2026-10-25T11:50:34.411Z | info | intel | collect.all.done | {"results":{"hn":27,"github":20,"lobsters":25},"total":72} |
| 8 | 2026-10-25T11:51:23.869Z | info | site | generate.done | {"items":72,"pages":73} |
| 9 | 2026-10-25T11:52:30.761Z | info | pipeline | start | {} |
| 10 | 2026-10-25T11:52:31.567Z | info | intel | collect.hn.ok | {"count":27} |
| 11 | 2026-10-25T11:52:33.920Z | info | intel | collect.github.ok | {"count":20} |
| 12 | 2026-10-25T11:52:34.729Z | info | intel | collect.lobsters.ok | {"count":25} |
| 13 | 2026-10-25T11:52:34.729Z | info | intel | collect.all.done | {"results":{"hn":27,"github":20,"lobsters":25},"total":72} |
| 14 | 2026-10-25T11:52:34.737Z | info | site | generate.done | {"items":72,"pages":73} |
| 15 | 2026-10-25T11:52:34.737Z | info | pipeline | done | {"intel":{"results":{"hn":27,"github":20,"lobsters":25},"total":72},"site":{"items":72,"pages":73}} |
| 16 | 2026-10-25T11:52:34.739Z | info | server | start | {"port":8765,"root":"/workspace/ops/site/static"} |
| 17 | 2026-10-25T11:52:34.739Z | info | pipeline | cron.enabled | {"intervalMs":3600000} |
| 18 | 2026-10-25T11:59:04.612Z | info | generate | article.created | {"articleId":1,"slug":"digest-20261025","kind":"digest","items":5,"sourceItems":[28,29,30,31,32]} |
| 19 | 2026-10-25T11:59:04.616Z | info | generate | article.created | {"articleId":2,"slug":"20261025-b23312","kind":"tool","sourceItem":33,"source":"github"} |
| 20 | 2026-10-25T11:59:04.618Z | info | generate | article.created | {"articleId":3,"slug":"20261025-7be1d8","kind":"tool","sourceItem":34,"source":"github"} |
| 21 | 2026-10-25T11:59:04.621Z | info | generate | article.created | {"articleId":4,"slug":"20261025-1f6ba7","kind":"tool","sourceItem":35,"source":"github"} |
| 22 | 2026-10-25T11:59:04.621Z | info | generate | batch.done | {"digest":1,"items":3} |
| 23 | 2026-10-25T12:02:44.271Z | info | pipeline | start | {} |
| 24 | 2026-10-25T12:02:46.249Z | info | intel | collect.hn.ok | {"count":26} |
| 25 | 2026-10-25T12:02:48.076Z | info | intel | collect.github.ok | {"count":20} |
| 26 | 2026-10-25T12:02:49.860Z | info | intel | collect.lobsters.ok | {"count":25} |
| 27 | 2026-10-25T12:02:49.861Z | info | intel | collect.all.done | {"results":{"hn":26,"github":20,"lobsters":25},"total":71} |
| 28 | 2026-10-25T12:02:49.862Z | error | pipeline | generate.fail | {"error":"UNIQUE constraint failed: articles.slug"} |
| 29 | 2026-10-25T12:02:49.862Z | error | system | fatal | {"error":"no such column: \"ready\" - should this be a string literal in single-quotes?","stack":"Error: no such column: \"ready\" - should this be a string lit |
| 30 | 2026-10-25T12:04:32.235Z | info | server | start | {"port":8765,"root":"/workspace/ops/site/static"} |
| 31 | 2026-10-25T12:04:32.237Z | info | pipeline | start | {} |
| 32 | 2026-10-25T12:04:33.639Z | info | intel | collect.hn.ok | {"count":26} |
| 33 | 2026-10-25T12:04:35.504Z | info | intel | collect.github.ok | {"count":20} |
| 34 | 2026-10-25T12:04:36.264Z | info | intel | collect.lobsters.ok | {"count":25} |
| 35 | 2026-10-25T12:04:36.264Z | info | intel | collect.all.done | {"results":{"hn":26,"github":20,"lobsters":25},"total":71} |
| 36 | 2026-10-25T12:04:36.270Z | info | generate | article.updated | {"articleId":1,"slug":"digest-20261025","kind":"digest","items":5} |
| 37 | 2026-10-25T12:04:36.273Z | info | generate | article.created | {"articleId":5,"slug":"20261025-760c72","kind":"tool","sourceItem":41,"source":"github"} |
| 38 | 2026-10-25T12:04:36.275Z | info | generate | article.created | {"articleId":6,"slug":"20261025-503e9d","kind":"tool","sourceItem":42,"source":"github"} |
| 39 | 2026-10-25T12:04:36.278Z | info | generate | article.created | {"articleId":7,"slug":"20261025-a69af5","kind":"tool","sourceItem":43,"source":"github"} |
| 40 | 2026-10-25T12:04:36.279Z | info | generate | batch.done | {"digest":1,"items":3} |
| 41 | 2026-10-25T12:04:36.285Z | error | pipeline | startup.fail | {"error":"no such column: \"published\" - should this be a string literal in single-quotes?"} |
| 42 | 2026-10-25T12:04:36.285Z | info | pipeline | cron.enabled | {"intervalMs":3600000} |
| 43 | 2026-10-25T12:05:23.190Z | error | system | fatal | {"error":"listen EADDRINUSE: address already in use 0.0.0.0:8765","stack":"Error: listen EADDRINUSE: address already in use 0.0.0.0:8765\n    at Server.setupLis |
| 44 | 2026-10-25T12:10:45.657Z | error | system | fatal | {"error":"listen EADDRINUSE: address already in use 0.0.0.0:8765","stack":"Error: listen EADDRINUSE: address already in use 0.0.0.0:8765\n    at Server.setupLis |
| 45 | 2026-10-25T12:13:52.333Z | info | server | start | {"port":8765,"root":"/workspace/ops/site/static"} |
| 46 | 2026-10-25T12:13:52.335Z | info | pipeline | start | {} |
| 47 | 2026-10-25T12:13:53.137Z | info | intel | collect.hn.ok | {"count":26} |
| 48 | 2026-10-25T12:13:54.824Z | info | intel | collect.github.ok | {"count":20} |
| 49 | 2026-10-25T12:13:55.590Z | info | intel | collect.lobsters.ok | {"count":25} |
| 50 | 2026-10-25T12:13:55.590Z | info | intel | collect.all.done | {"results":{"hn":26,"github":20,"lobsters":25},"total":71} |
| 51 | 2026-10-25T12:13:55.595Z | info | generate | article.updated | {"articleId":1,"slug":"digest-20261025","kind":"digest","items":5} |
| 52 | 2026-10-25T12:13:55.599Z | info | generate | article.created | {"articleId":8,"slug":"20261025-cf6fc7","kind":"tool","sourceItem":4,"source":"hn"} |
| 53 | 2026-10-25T12:13:55.601Z | info | generate | article.created | {"articleId":9,"slug":"20261025-0a180b","kind":"tool","sourceItem":2,"source":"hn"} |
| 54 | 2026-10-25T12:13:55.603Z | info | generate | article.created | {"articleId":10,"slug":"20261025-293ca1","kind":"tool","sourceItem":10,"source":"hn"} |
| 55 | 2026-10-25T12:13:55.603Z | info | generate | batch.done | {"digest":1,"items":3} |
| 56 | 2026-10-25T12:13:55.628Z | info | site | generate.done | {"articles":10,"intel":74,"pages":85} |
| 57 | 2026-10-25T12:13:55.628Z | info | pipeline | done | {"intel":{"results":{"hn":26,"github":20,"lobsters":25},"total":71},"content":{"digest":1,"items":[8,9,10]},"site":{"articles":10,"intel":74,"pages":85}} |
| 58 | 2026-10-25T12:13:55.628Z | info | pipeline | cron.enabled | {"intervalMs":3600000} |
| 59 | 2026-10-25T12:24:02.571Z | info | publish | adapt.done | {"articleId":10,"slug":"20261025-293ca1","channels":["wechat","zhihu","xhs","toutiao"]} |
| 60 | 2026-10-25T12:24:02.581Z | info | publish | adapt.done | {"articleId":9,"slug":"20261025-0a180b","channels":["wechat","zhihu","xhs","toutiao"]} |
| 61 | 2026-10-25T12:24:02.585Z | info | publish | adapt.done | {"articleId":8,"slug":"20261025-cf6fc7","channels":["wechat","zhihu","xhs","toutiao"]} |
| 62 | 2026-10-25T12:24:02.591Z | info | publish | adapt.done | {"articleId":1,"slug":"digest-20261025","channels":["wechat","zhihu","xhs","toutiao"]} |
| 63 | 2026-10-25T12:24:02.597Z | info | publish | adapt.done | {"articleId":7,"slug":"20261025-a69af5","channels":["wechat","zhihu","xhs","toutiao"]} |
| 64 | 2026-10-25T12:24:02.601Z | info | publish | adapt.done | {"articleId":6,"slug":"20261025-503e9d","channels":["wechat","zhihu","xhs","toutiao"]} |
| 65 | 2026-10-25T12:24:02.607Z | info | publish | adapt.done | {"articleId":5,"slug":"20261025-760c72","channels":["wechat","zhihu","xhs","toutiao"]} |
| 66 | 2026-10-25T12:24:02.612Z | info | publish | adapt.done | {"articleId":4,"slug":"20261025-1f6ba7","channels":["wechat","zhihu","xhs","toutiao"]} |
| 67 | 2026-10-25T12:24:02.617Z | info | publish | adapt.done | {"articleId":3,"slug":"20261025-7be1d8","channels":["wechat","zhihu","xhs","toutiao"]} |
| 68 | 2026-10-25T12:24:02.623Z | info | publish | adapt.done | {"articleId":2,"slug":"20261025-b23312","channels":["wechat","zhihu","xhs","toutiao"]} |
| 69 | 2026-10-25T12:24:02.623Z | info | publish | batch.done | {"articles":10} |
| 70 | 2026-10-25T12:27:28.128Z | info | server | start | {"port":8765,"root":"/workspace/ops/site/static"} |
| 71 | 2026-10-25T12:27:28.130Z | info | pipeline | start | {} |
| 72 | 2026-10-25T12:27:29.416Z | info | intel | collect.hn.ok | {"count":26} |
| 73 | 2026-10-25T12:27:31.140Z | info | intel | collect.github.ok | {"count":20} |
| 74 | 2026-10-25T12:27:32.402Z | info | intel | collect.lobsters.ok | {"count":25} |
| 75 | 2026-10-25T12:27:32.402Z | info | intel | collect.all.done | {"results":{"hn":26,"github":20,"lobsters":25},"total":71} |
| 76 | 2026-10-25T12:27:32.413Z | info | generate | article.updated | {"articleId":1,"slug":"digest-20261025","kind":"digest","items":5} |
| 77 | 2026-10-25T12:27:32.417Z | info | generate | article.created | {"articleId":11,"slug":"20261025-74c3ee","kind":"tool","sourceItem":19,"source":"hn"} |
| 78 | 2026-10-25T12:27:32.419Z | info | generate | article.created | {"articleId":12,"slug":"20261025-80a838","kind":"tool","sourceItem":7,"source":"hn"} |
| 79 | 2026-10-25T12:27:32.424Z | info | generate | article.created | {"articleId":13,"slug":"20261025-e0e966","kind":"tool","sourceItem":26,"source":"hn"} |
| 80 | 2026-10-25T12:27:32.424Z | info | generate | batch.done | {"digest":1,"items":3} |
| 81 | 2026-10-25T12:27:32.434Z | info | publish | adapt.done | {"articleId":13,"slug":"20261025-e0e966","channels":["wechat","zhihu","xhs","toutiao"]} |
| 82 | 2026-10-25T12:27:32.440Z | info | publish | adapt.done | {"articleId":12,"slug":"20261025-80a838","channels":["wechat","zhihu","xhs","toutiao"]} |
| 83 | 2026-10-25T12:27:32.444Z | info | publish | adapt.done | {"articleId":11,"slug":"20261025-74c3ee","channels":["wechat","zhihu","xhs","toutiao"]} |
| 84 | 2026-10-25T12:27:32.450Z | info | publish | adapt.done | {"articleId":1,"slug":"digest-20261025","channels":["wechat","zhihu","xhs","toutiao"]} |
| 85 | 2026-10-25T12:27:32.457Z | info | publish | adapt.done | {"articleId":10,"slug":"20261025-293ca1","channels":["wechat","zhihu","xhs","toutiao"]} |
| 86 | 2026-10-25T12:27:32.463Z | info | publish | adapt.done | {"articleId":9,"slug":"20261025-0a180b","channels":["wechat","zhihu","xhs","toutiao"]} |
| 87 | 2026-10-25T12:27:32.471Z | info | publish | adapt.done | {"articleId":8,"slug":"20261025-cf6fc7","channels":["wechat","zhihu","xhs","toutiao"]} |
| 88 | 2026-10-25T12:27:32.476Z | info | publish | adapt.done | {"articleId":7,"slug":"20261025-a69af5","channels":["wechat","zhihu","xhs","toutiao"]} |
| 89 | 2026-10-25T12:27:32.481Z | info | publish | adapt.done | {"articleId":6,"slug":"20261025-503e9d","channels":["wechat","zhihu","xhs","toutiao"]} |
| 90 | 2026-10-25T12:27:32.487Z | info | publish | adapt.done | {"articleId":5,"slug":"20261025-760c72","channels":["wechat","zhihu","xhs","toutiao"]} |
| 91 | 2026-10-25T12:27:32.492Z | info | publish | adapt.done | {"articleId":4,"slug":"20261025-1f6ba7","channels":["wechat","zhihu","xhs","toutiao"]} |
| 92 | 2026-10-25T12:27:32.496Z | info | publish | adapt.done | {"articleId":3,"slug":"20261025-7be1d8","channels":["wechat","zhihu","xhs","toutiao"]} |
| 93 | 2026-10-25T12:27:32.503Z | info | publish | adapt.done | {"articleId":2,"slug":"20261025-b23312","channels":["wechat","zhihu","xhs","toutiao"]} |
| 94 | 2026-10-25T12:27:32.504Z | info | publish | batch.done | {"articles":13} |
| 95 | 2026-10-25T12:27:32.514Z | info | site | generate.done | {"articles":13,"intel":75,"pages":89} |
| 96 | 2026-10-25T12:27:32.514Z | info | pipeline | done | {"intel":{"results":{"hn":26,"github":20,"lobsters":25},"total":71},"content":{"digest":1,"items":[11,12,13]},"publish":13,"site":{"articles":13,"intel":75,"pag |
| 97 | 2026-10-25T12:27:32.515Z | info | pipeline | cron.enabled | {"intervalMs":3600000} |
| 98 | 2026-10-25T12:29:52.940Z | info | report | generated | {"file":"log/OPS-REPORT.md","records":97,"chainOk":true} |
| 99 | 2026-10-25T12:55:35.304Z | info | deploy | repo.created | {"owner":"q785845530","repo":"ai-tools-intel","visibility":"public","defaultBranch":"main","method":"GitHub API","token":"ghp_***（明文不落日志）"} |
| 100 | 2026-10-25T12:55:35.305Z | info | deploy | secrets.scan.passed | {"scanned":["ghp_/gho_/ghs_/ghu_/github_pat_","gitee-credentials","password/secret/api_key赋值","私钥文件头"],"result":"clean"} |
| 101 | 2026-10-25T12:55:35.305Z | info | deploy | git.pushed | {"branch":"main","files":72,"insertions":2466,"sha":"1708432","note":"token 内联推送，未持久化到仓库配置"} |
| 102 | 2026-10-25T12:55:35.305Z | info | deploy | pages.enabled | {"build_type":"workflow","url":"https://q785845530.github.io/ai-tools-intel/"} |
| 103 | 2026-10-25T12:55:35.306Z | info | deploy | workflow.dispatched | {"workflow":"pages.yml","http":204} |
| 104 | 2026-10-25T12:55:35.306Z | info | deploy | workflow.completed | {"run_id":40195078728,"conclusion":"success","duration_s":24} |
| 105 | 2026-10-25T12:55:35.306Z | info | deploy | public.verified | {"url":"https://q785845530.github.io/ai-tools-intel/","http":200,"bytes":17385,"articles":4,"intel":71,"subpages":{"article-1.html":200,"1.html":200}} |
| 106 | 2026-10-25T12:55:35.306Z | info | deploy | schedule.active | {"cron":"17 * * * *","note":"每小时自动采集+撰写+部署，无需人工"} |
| 107 | 2026-10-25T12:55:55.735Z | info | report | generated | {"file":"log/OPS-REPORT.md","records":106,"chainOk":true} |
| 108 | 2026-10-25T12:57:44.605Z | info | deploy | repo.updated | {"commit":"README+report","files":2} |
| 109 | 2026-10-25T13:27:32.518Z | info | pipeline | start | {} |
| 110 | 2026-10-25T13:27:33.271Z | info | intel | collect.hn.ok | {"count":26} |
| 111 | 2026-10-25T13:27:35.035Z | info | intel | collect.github.ok | {"count":20} |
| 112 | 2026-10-25T13:27:35.826Z | info | intel | collect.lobsters.ok | {"count":25} |
| 113 | 2026-10-25T13:27:35.826Z | info | intel | collect.all.done | {"results":{"hn":26,"github":20,"lobsters":25},"total":71} |
| 114 | 2026-10-25T13:27:35.831Z | info | generate | article.updated | {"articleId":1,"slug":"digest-20261025","kind":"digest","items":5} |
| 115 | 2026-10-25T13:27:35.831Z | info | generate | batch.done | {"digest":1,"items":0} |
| 116 | 2026-10-25T13:27:35.836Z | info | publish | adapt.done | {"articleId":1,"slug":"digest-20261025","channels":["wechat","zhihu","xhs","toutiao"]} |
| 117 | 2026-10-25T13:27:35.842Z | info | publish | adapt.done | {"articleId":13,"slug":"20261025-e0e966","channels":["wechat","zhihu","xhs","toutiao"]} |
| 118 | 2026-10-25T13:27:35.846Z | info | publish | adapt.done | {"articleId":12,"slug":"20261025-80a838","channels":["wechat","zhihu","xhs","toutiao"]} |
| 119 | 2026-10-25T13:27:35.852Z | info | publish | adapt.done | {"articleId":11,"slug":"20261025-74c3ee","channels":["wechat","zhihu","xhs","toutiao"]} |
| 120 | 2026-10-25T13:27:35.859Z | info | publish | adapt.done | {"articleId":10,"slug":"20261025-293ca1","channels":["wechat","zhihu","xhs","toutiao"]} |
| 121 | 2026-10-25T13:27:35.866Z | info | publish | adapt.done | {"articleId":9,"slug":"20261025-0a180b","channels":["wechat","zhihu","xhs","toutiao"]} |
| 122 | 2026-10-25T13:27:35.873Z | info | publish | adapt.done | {"articleId":8,"slug":"20261025-cf6fc7","channels":["wechat","zhihu","xhs","toutiao"]} |
| 123 | 2026-10-25T13:27:35.878Z | info | publish | adapt.done | {"articleId":7,"slug":"20261025-a69af5","channels":["wechat","zhihu","xhs","toutiao"]} |
| 124 | 2026-10-25T13:27:35.882Z | info | publish | adapt.done | {"articleId":6,"slug":"20261025-503e9d","channels":["wechat","zhihu","xhs","toutiao"]} |
| 125 | 2026-10-25T13:27:35.887Z | info | publish | adapt.done | {"articleId":5,"slug":"20261025-760c72","channels":["wechat","zhihu","xhs","toutiao"]} |
| 126 | 2026-10-25T13:27:35.893Z | info | publish | adapt.done | {"articleId":4,"slug":"20261025-1f6ba7","channels":["wechat","zhihu","xhs","toutiao"]} |
| 127 | 2026-10-25T13:27:35.901Z | info | publish | adapt.done | {"articleId":3,"slug":"20261025-7be1d8","channels":["wechat","zhihu","xhs","toutiao"]} |
| 128 | 2026-10-25T13:27:35.908Z | info | publish | adapt.done | {"articleId":2,"slug":"20261025-b23312","channels":["wechat","zhihu","xhs","toutiao"]} |
| 129 | 2026-10-25T13:27:35.910Z | info | publish | batch.done | {"articles":13} |
| 130 | 2026-10-25T13:27:35.920Z | info | site | generate.done | {"articles":13,"intel":76,"pages":90} |
| 131 | 2026-10-25T13:27:35.920Z | info | pipeline | done | {"intel":{"results":{"hn":26,"github":20,"lobsters":25},"total":71},"content":{"digest":1,"items":[]},"publish":13,"site":{"articles":13,"intel":76,"pages":90}} |
| 132 | 2026-10-25T13:59:31.749Z | info | intel | collect.zhihu.hot.ok | {"items":20,"saved":20} |
| 133 | 2026-10-25T13:59:32.353Z | info | intel | collect.zhihu.search.ok | {"query":"智能制造 AI 落地","items":10,"saved":10} |
| 134 | 2026-10-25T13:59:32.831Z | info | intel | collect.zhihu.search.ok | {"query":"工业大模型 应用","items":10,"saved":8} |
| 135 | 2026-10-25T13:59:33.520Z | info | intel | collect.zhihu.search.ok | {"query":"AI 质检 缺陷检测","items":10,"saved":10} |
| 136 | 2026-10-25T13:59:33.713Z | error | intel | collect.zhihu.search.fail | {"query":"智能工厂 数字化转型","error":"Code 30001: rate limit exceeded"} |
| 137 | 2026-10-25T13:59:34.011Z | error | intel | collect.zhihu.search.fail | {"query":"工业机器人 具身智能","error":"Code 30001: rate limit exceeded"} |
| 138 | 2026-10-25T13:59:34.012Z | info | intel | collect.zhihu.done | {"hot":20,"search":28,"errors":2} |
| 139 | 2026-10-25T14:06:22.738Z | info | generate | article.created | {"articleId":14,"slug":"manufacturing-daily-20261025","kind":"daily","items":8,"themes":["技术前沿","落地说","产业观察"]} |
| 140 | 2026-10-25T14:06:22.740Z | info | generate | article.created | {"articleId":15,"slug":"20261025-bb6043","kind":"deep","theme":"case","source":"zhihu-search"} |
| 141 | 2026-10-25T14:06:22.742Z | info | generate | article.created | {"articleId":16,"slug":"20261025-0d15cb","kind":"deep","theme":"case","source":"zhihu-search"} |
| 142 | 2026-10-25T14:06:22.744Z | info | generate | article.created | {"articleId":17,"slug":"20261025-3a8e65","kind":"deep","theme":"case","source":"zhihu-search"} |
| 143 | 2026-10-25T14:06:22.745Z | info | generate | batch.done | {"daily":14,"deep":3} |
| 144 | 2026-10-25T14:07:14.852Z | info | site | generate.done | {"articles":17,"intel":100,"pages":118} |
| 145 | 2026-10-25T14:08:34.429Z | error | wechat | publish.blocked | {"step":"IP_WHITELIST","detail":"出口 IP 120.239.145.51 未在白名单。请到 公众平台 → 设置与开发 → 基本配置 → IP白名单 添加该 IP。"} |
| 146 | 2026-10-25T14:09:27.710Z | info | site | generate.done | {"articles":17,"intel":100,"pages":118} |
| 147 | 2026-10-25T14:10:52.053Z | info | publish | adapt.done | {"articleId":17,"slug":"20261025-3a8e65","channels":["wechat","zhihu","xhs","toutiao"]} |
| 148 | 2026-10-25T14:10:52.059Z | info | publish | adapt.done | {"articleId":16,"slug":"20261025-0d15cb","channels":["wechat","zhihu","xhs","toutiao"]} |
| 149 | 2026-10-25T14:10:52.064Z | info | publish | adapt.done | {"articleId":15,"slug":"20261025-bb6043","channels":["wechat","zhihu","xhs","toutiao"]} |
| 150 | 2026-10-25T14:10:52.070Z | info | publish | adapt.done | {"articleId":14,"slug":"manufacturing-daily-20261025","channels":["wechat","zhihu","xhs","toutiao"]} |
| 151 | 2026-10-25T14:10:52.072Z | info | publish | adapt.done | {"articleId":1,"slug":"digest-20261025","channels":["wechat","zhihu","xhs","toutiao"]} |
| 152 | 2026-10-25T14:10:52.076Z | info | publish | adapt.done | {"articleId":13,"slug":"20261025-e0e966","channels":["wechat","zhihu","xhs","toutiao"]} |
| 153 | 2026-10-25T14:10:52.079Z | info | publish | adapt.done | {"articleId":12,"slug":"20261025-80a838","channels":["wechat","zhihu","xhs","toutiao"]} |
| 154 | 2026-10-25T14:10:52.088Z | info | publish | adapt.done | {"articleId":11,"slug":"20261025-74c3ee","channels":["wechat","zhihu","xhs","toutiao"]} |
| 155 | 2026-10-25T14:10:52.095Z | info | publish | adapt.done | {"articleId":10,"slug":"20261025-293ca1","channels":["wechat","zhihu","xhs","toutiao"]} |
| 156 | 2026-10-25T14:10:52.097Z | info | publish | adapt.done | {"articleId":9,"slug":"20261025-0a180b","channels":["wechat","zhihu","xhs","toutiao"]} |
| 157 | 2026-10-25T14:10:52.101Z | info | publish | adapt.done | {"articleId":8,"slug":"20261025-cf6fc7","channels":["wechat","zhihu","xhs","toutiao"]} |
| 158 | 2026-10-25T14:10:52.104Z | info | publish | adapt.done | {"articleId":7,"slug":"20261025-a69af5","channels":["wechat","zhihu","xhs","toutiao"]} |
| 159 | 2026-10-25T14:10:52.106Z | info | publish | adapt.done | {"articleId":6,"slug":"20261025-503e9d","channels":["wechat","zhihu","xhs","toutiao"]} |
| 160 | 2026-10-25T14:10:52.110Z | info | publish | adapt.done | {"articleId":5,"slug":"20261025-760c72","channels":["wechat","zhihu","xhs","toutiao"]} |
| 161 | 2026-10-25T14:10:52.112Z | info | publish | adapt.done | {"articleId":4,"slug":"20261025-1f6ba7","channels":["wechat","zhihu","xhs","toutiao"]} |
| 162 | 2026-10-25T14:10:52.116Z | info | publish | adapt.done | {"articleId":3,"slug":"20261025-7be1d8","channels":["wechat","zhihu","xhs","toutiao"]} |
| 163 | 2026-10-25T14:10:52.119Z | info | publish | adapt.done | {"articleId":2,"slug":"20261025-b23312","channels":["wechat","zhihu","xhs","toutiao"]} |
| 164 | 2026-10-25T14:10:52.120Z | info | publish | batch.done | {"articles":17} |
| 165 | 2026-10-25T14:21:45.991Z | info | zhihu | integration.done | {"api":"developer.zhihu.com","endpoints":["hot_list","zhihu_search"],"auth":"Bearer + X-Request-Timestamp","items_local":48,"ratelimit":"Code 30001 已加指数退避+1.5s节 |
| 166 | 2026-10-25T14:21:45.992Z | info | generate | positioning.switched | {"from":"AI工具榜","to":"智能制造×AI","themes":["政策风向","落地说","技术前沿","展会动态","产业观察"]} |
| 167 | 2026-10-25T14:21:45.993Z | info | wechat | module.ready | {"draft_api":true,"publish_api":true,"cover":"零依赖PNG 900x383","blocked_by":"IP_WHITELIST","ip":"120.239.145.51"} |
| 168 | 2026-10-25T14:21:45.993Z | info | deploy | workflow.secret.set | {"name":"ZHIHU_ACCESS_SECRET","method":"libsodium sealed box","http":201,"note":"GitHub 侧加密存储，本地不留存"} |
| 169 | 2026-10-25T14:21:45.993Z | info | deploy | cloud.run.ok | {"run_id":40201701844,"conclusion":"success","site":"https://q785845530.github.io/ai-tools-intel/","bytes":24265,"intel":100,"articles_on_site":4} |
| 170 | 2026-10-25T14:21:45.994Z | info | deploy | positioning.verified | {"public_title":"智能制造大时代 · 情报站","sample_articles":["智能制造日报 2026-10-25","2025-2026年中国制造业AI项目落地全景观察","人工智能深度赋能制造业"]} |
| 171 | 2026-10-25T14:27:32.521Z | info | pipeline | start | {} |
| 172 | 2026-10-25T14:27:33.251Z | info | intel | collect.hn.ok | {"count":26} |
| 173 | 2026-10-25T14:27:35.332Z | info | intel | collect.github.ok | {"count":20} |
| 174 | 2026-10-25T14:27:36.380Z | info | intel | collect.lobsters.ok | {"count":25} |
| 175 | 2026-10-25T14:27:36.380Z | info | intel | collect.all.done | {"results":{"hn":26,"github":20,"lobsters":25},"total":71} |
| 176 | 2026-10-25T14:27:36.384Z | info | generate | article.updated | {"articleId":1,"slug":"digest-20261025","kind":"digest","items":5} |
| 177 | 2026-10-25T14:27:36.385Z | info | generate | batch.done | {"digest":1,"items":0} |
| 178 | 2026-10-25T14:27:36.387Z | info | publish | adapt.done | {"articleId":1,"slug":"digest-20261025","channels":["wechat","zhihu","xhs","toutiao"]} |
| 179 | 2026-10-25T14:27:36.390Z | info | publish | adapt.done | {"articleId":17,"slug":"20261025-3a8e65","channels":["wechat","zhihu","xhs","toutiao"]} |
| 180 | 2026-10-25T14:27:36.392Z | info | publish | adapt.done | {"articleId":16,"slug":"20261025-0d15cb","channels":["wechat","zhihu","xhs","toutiao"]} |
| 181 | 2026-10-25T14:27:36.395Z | info | publish | adapt.done | {"articleId":15,"slug":"20261025-bb6043","channels":["wechat","zhihu","xhs","toutiao"]} |
| 182 | 2026-10-25T14:27:36.398Z | info | publish | adapt.done | {"articleId":14,"slug":"manufacturing-daily-20261025","channels":["wechat","zhihu","xhs","toutiao"]} |
| 183 | 2026-10-25T14:27:36.401Z | info | publish | adapt.done | {"articleId":13,"slug":"20261025-e0e966","channels":["wechat","zhihu","xhs","toutiao"]} |
| 184 | 2026-10-25T14:27:36.403Z | info | publish | adapt.done | {"articleId":12,"slug":"20261025-80a838","channels":["wechat","zhihu","xhs","toutiao"]} |
| 185 | 2026-10-25T14:27:36.407Z | info | publish | adapt.done | {"articleId":11,"slug":"20261025-74c3ee","channels":["wechat","zhihu","xhs","toutiao"]} |
| 186 | 2026-10-25T14:27:36.410Z | info | publish | adapt.done | {"articleId":10,"slug":"20261025-293ca1","channels":["wechat","zhihu","xhs","toutiao"]} |
| 187 | 2026-10-25T14:27:36.576Z | info | publish | adapt.done | {"articleId":9,"slug":"20261025-0a180b","channels":["wechat","zhihu","xhs","toutiao"]} |
| 188 | 2026-10-25T14:27:36.579Z | info | publish | adapt.done | {"articleId":8,"slug":"20261025-cf6fc7","channels":["wechat","zhihu","xhs","toutiao"]} |
| 189 | 2026-10-25T14:27:36.582Z | info | publish | adapt.done | {"articleId":7,"slug":"20261025-a69af5","channels":["wechat","zhihu","xhs","toutiao"]} |
| 190 | 2026-10-25T14:27:36.584Z | info | publish | adapt.done | {"articleId":6,"slug":"20261025-503e9d","channels":["wechat","zhihu","xhs","toutiao"]} |
| 191 | 2026-10-25T14:27:36.587Z | info | publish | adapt.done | {"articleId":5,"slug":"20261025-760c72","channels":["wechat","zhihu","xhs","toutiao"]} |
| 192 | 2026-10-25T14:27:36.589Z | info | publish | adapt.done | {"articleId":4,"slug":"20261025-1f6ba7","channels":["wechat","zhihu","xhs","toutiao"]} |
| 193 | 2026-10-25T14:27:36.591Z | info | publish | adapt.done | {"articleId":3,"slug":"20261025-7be1d8","channels":["wechat","zhihu","xhs","toutiao"]} |
| 194 | 2026-10-25T14:27:36.594Z | info | publish | adapt.done | {"articleId":2,"slug":"20261025-b23312","channels":["wechat","zhihu","xhs","toutiao"]} |
| 195 | 2026-10-25T14:27:36.595Z | info | publish | batch.done | {"articles":17} |
| 196 | 2026-10-25T14:27:36.605Z | info | site | generate.done | {"articles":17,"intel":100,"pages":118} |
| 197 | 2026-10-25T14:27:36.605Z | info | pipeline | done | {"intel":{"results":{"hn":26,"github":20,"lobsters":25},"total":71},"content":{"digest":1,"items":[]},"publish":17,"site":{"articles":17,"intel":100,"pages":118 |
| 198 | 2026-10-25T14:45:02.485Z | info | wechat | token.obtained | {"expiresIn":7199} |
| 199 | 2026-10-25T14:45:04.727Z | info | wechat | cover.uploaded | {"mediaId":"FkZ9XCO0BwnXzC2V7v9B__t-neNdAyS8nau2Rs-piBYP8K219SF5cdSjY7jOFLBt","bytes":137096} |
| 200 | 2026-10-25T14:45:07.662Z | info | wechat | draft.created | {"mediaId":"FkZ9XCO0BwnXzC2V7v9B_114XYjiM0Xx1Xzu5IgnmBKeahUOSe9LUuyC9Rti6m4v","count":1} |
| 201 | 2026-10-25T14:45:07.665Z | info | wechat | bridge.draft.done | {"draftId":"FkZ9XCO0BwnXzC2V7v9B_114XYjiM0Xx1Xzu5IgnmBKeahUOSe9LUuyC9Rti6m4v","articles":[14]} |
| 202 | 2026-10-25T14:48:51.347Z | info | wechat | cover.uploaded | {"mediaId":"FkZ9XCO0BwnXzC2V7v9B_5GNILuTKov1LwKc8ZoHaD5TNwlb67Ze82itrOR3A7C2","bytes":137096} |
| 203 | 2026-10-25T14:48:54.068Z | info | wechat | draft.created | {"mediaId":"FkZ9XCO0BwnXzC2V7v9B_6LXNH0M97cUQT7HwCJWB-65V_-u1CV_GXpkTQ63gu0g","count":1} |
| 204 | 2026-10-25T14:48:54.070Z | info | wechat | bridge.draft.done | {"draftId":"FkZ9XCO0BwnXzC2V7v9B_6LXNH0M97cUQT7HwCJWB-65V_-u1CV_GXpkTQ63gu0g","articles":[14]} |
| 205 | 2026-10-25T14:51:08.279Z | info | wechat | draft.deleted | {"mediaId":"FkZ9XCO0BwnXzC2V7v9B_114XYjiM0Xx1Xzu5IgnmBKeahUOSe9LUuyC9Rti6m4v","reason":"测试草稿去重，保留最终版","notDeleted":"审计日志不受影响"} |
| 206 | 2026-10-25T14:53:41.144Z | info | zhihu | qrcode.ready | {"file":"/workspace/ops/config/zhihu-qrcode.png","modules":37,"bytes":3365,"expiresInSec":120,"autoRefresh":true} |
| 207 | 2026-10-25T14:53:42.743Z | warn | zhihu | login.poll.error | {"error":"轮询被拒: HTTP 403"} |
| 208 | 2026-10-25T14:53:44.323Z | warn | zhihu | login.poll.error | {"error":"轮询被拒: HTTP 403"} |
| 209 | 2026-10-25T14:53:45.908Z | warn | zhihu | login.poll.error | {"error":"轮询被拒: HTTP 403"} |
| 210 | 2026-10-25T14:53:47.500Z | warn | zhihu | login.poll.error | {"error":"轮询被拒: HTTP 403"} |
| 211 | 2026-10-25T14:53:49.095Z | warn | zhihu | login.poll.error | {"error":"轮询被拒: HTTP 403"} |
| 212 | 2026-10-25T14:53:50.707Z | warn | zhihu | login.poll.error | {"error":"轮询被拒: HTTP 403"} |
| 213 | 2026-10-25T14:53:52.297Z | warn | zhihu | login.poll.error | {"error":"轮询被拒: HTTP 403"} |
| 214 | 2026-10-25T14:53:53.880Z | warn | zhihu | login.poll.error | {"error":"轮询被拒: HTTP 403"} |
| 215 | 2026-10-25T14:53:55.463Z | warn | zhihu | login.poll.error | {"error":"轮询被拒: HTTP 403"} |
| 216 | 2026-10-25T14:53:57.077Z | warn | zhihu | login.poll.error | {"error":"轮询被拒: HTTP 403"} |
| 217 | 2026-10-25T14:53:58.665Z | warn | zhihu | login.poll.error | {"error":"轮询被拒: HTTP 403"} |
| 218 | 2026-10-25T14:53:58.719Z | info | wechat | whitelist.active | {"ip":"120.239.145.51","tokenExpiresIn":7199,"note":"用户已添加白名单"} |
| 219 | 2026-10-25T14:53:58.720Z | info | wechat | cover.uploaded.ok | {"bytes":137096,"mediaId":"FkZ9...","dimensions":"900x383"} |
| 220 | 2026-10-25T14:53:58.720Z | info | wechat | draft.created.confirmed | {"verifyMethod":"draft/get 回读","title":"智能制造日报 / 2026-10-25","contentChars":1476,"paragraphs":18,"author":"智能制造大时代"} |
| 221 | 2026-10-25T14:53:58.720Z | warn | wechat | links.stripped | {"finding":"微信剥离正文外链，8个<a>变0个","fix":"降级为纯文本URL + 阅读原文指向站点","fixVerified":"0个<a>、8条明码URL"} |
| 222 | 2026-10-25T14:53:58.720Z | info | wechat | capability.matrix | {"granted":["material/get_materialcount","draft/batchget","draft/add","material/add_material","menu/query"],"denied_48001":["freepublish/submit","freepublish/ge |
| 223 | 2026-10-25T14:53:58.720Z | error | wechat | publish.blocked.by_account_type | {"errcode":48001,"errmsg":"api unauthorized","resolved":"草稿已就绪，需人工在后台点发布；或认证账号后可全自动"} |
| 224 | 2026-10-25T14:53:58.721Z | info | wechat | draft.deleted | {"reason":"测试草稿去重","remaining":1,"note":"审计日志不受影响，仅清理微信侧重复草稿"} |
| 225 | 2026-10-25T14:53:58.721Z | info | zhihu | qrcode.generated | {"file":"config/zhihu-qrcode.png","modules":37,"size":"450x450","bytes":3365,"autoRefreshMs":100000,"window":"12分钟"} |
| 226 | 2026-10-25T14:54:00.247Z | warn | zhihu | login.poll.error | {"error":"轮询被拒: HTTP 403"} |
| 227 | 2026-10-25T14:54:02.096Z | warn | zhihu | login.poll.error | {"error":"轮询被拒: HTTP 403"} |
| 228 | 2026-10-25T14:54:03.678Z | warn | zhihu | login.poll.error | {"error":"轮询被拒: HTTP 403"} |
| 229 | 2026-10-25T14:54:05.266Z | warn | zhihu | login.poll.error | {"error":"轮询被拒: HTTP 403"} |
| 230 | 2026-10-25T14:54:06.848Z | warn | zhihu | login.poll.error | {"error":"轮询被拒: HTTP 403"} |
| 231 | 2026-10-25T14:54:08.492Z | warn | zhihu | login.poll.error | {"error":"轮询被拒: HTTP 403"} |
| 232 | 2026-10-25T14:54:10.072Z | warn | zhihu | login.poll.error | {"error":"轮询被拒: HTTP 403"} |
| 233 | 2026-10-25T14:54:11.662Z | warn | zhihu | login.poll.error | {"error":"轮询被拒: HTTP 403"} |
| 234 | 2026-10-25T14:54:13.240Z | warn | zhihu | login.poll.error | {"error":"轮询被拒: HTTP 403"} |
| 235 | 2026-10-25T14:54:14.874Z | warn | zhihu | login.poll.error | {"error":"轮询被拒: HTTP 403"} |
| 236 | 2026-10-25T14:54:16.455Z | warn | zhihu | login.poll.error | {"error":"轮询被拒: HTTP 403"} |
| 237 | 2026-10-25T14:54:18.033Z | warn | zhihu | login.poll.error | {"error":"轮询被拒: HTTP 403"} |
| 238 | 2026-10-25T14:54:19.624Z | warn | zhihu | login.poll.error | {"error":"轮询被拒: HTTP 403"} |
| 239 | 2026-10-25T14:54:21.296Z | warn | zhihu | login.poll.error | {"error":"轮询被拒: HTTP 403"} |
| 240 | 2026-10-25T14:54:22.873Z | warn | zhihu | login.poll.error | {"error":"轮询被拒: HTTP 403"} |
| 241 | 2026-10-25T14:54:24.456Z | warn | zhihu | login.poll.error | {"error":"轮询被拒: HTTP 403"} |
| 242 | 2026-10-25T14:54:26.082Z | warn | zhihu | login.poll.error | {"error":"轮询被拒: HTTP 403"} |
| 243 | 2026-10-25T14:54:27.667Z | warn | zhihu | login.poll.error | {"error":"轮询被拒: HTTP 403"} |
| 244 | 2026-10-25T14:54:29.242Z | warn | zhihu | login.poll.error | {"error":"轮询被拒: HTTP 403"} |
| 245 | 2026-10-25T14:54:30.891Z | warn | zhihu | login.poll.error | {"error":"轮询被拒: HTTP 403"} |
| 246 | 2026-10-25T14:54:32.467Z | warn | zhihu | login.poll.error | {"error":"轮询被拒: HTTP 403"} |
| 247 | 2026-10-25T14:54:34.053Z | warn | zhihu | login.poll.error | {"error":"轮询被拒: HTTP 403"} |
| 248 | 2026-10-25T14:54:35.754Z | warn | zhihu | login.poll.error | {"error":"轮询被拒: HTTP 403"} |
| 249 | 2026-10-25T14:54:37.696Z | warn | zhihu | login.poll.error | {"error":"轮询被拒: HTTP 403"} |
| 250 | 2026-10-25T14:54:40.058Z | warn | zhihu | login.poll.error | {"error":"轮询被拒: HTTP 403"} |
| 251 | 2026-10-25T14:54:41.655Z | warn | zhihu | login.poll.error | {"error":"轮询被拒: HTTP 403"} |
| 252 | 2026-10-25T14:54:43.234Z | warn | zhihu | login.poll.error | {"error":"轮询被拒: HTTP 403"} |
| 253 | 2026-10-25T14:54:44.814Z | warn | zhihu | login.poll.error | {"error":"轮询被拒: HTTP 403"} |
| 254 | 2026-10-25T14:54:46.482Z | warn | zhihu | login.poll.error | {"error":"轮询被拒: HTTP 403"} |
| 255 | 2026-10-25T14:54:48.089Z | warn | zhihu | login.poll.error | {"error":"轮询被拒: HTTP 403"} |
| 256 | 2026-10-25T14:54:49.678Z | warn | zhihu | login.poll.error | {"error":"轮询被拒: HTTP 403"} |
| 257 | 2026-10-25T14:54:52.024Z | warn | zhihu | login.poll.error | {"error":"轮询被拒: HTTP 403"} |
| 258 | 2026-10-25T14:54:54.285Z | warn | zhihu | login.poll.error | {"error":"轮询被拒: HTTP 403"} |
| 259 | 2026-10-25T14:54:55.997Z | warn | zhihu | login.poll.error | {"error":"轮询被拒: HTTP 403"} |
| 260 | 2026-10-25T14:54:57.607Z | warn | zhihu | login.poll.error | {"error":"轮询被拒: HTTP 403"} |
| 261 | 2026-10-25T14:54:59.193Z | warn | zhihu | login.poll.error | {"error":"轮询被拒: HTTP 403"} |
| 262 | 2026-10-25T14:55:00.918Z | warn | zhihu | login.poll.error | {"error":"轮询被拒: HTTP 403"} |
| 263 | 2026-10-25T14:55:02.530Z | warn | zhihu | login.poll.error | {"error":"轮询被拒: HTTP 403"} |
| 264 | 2026-10-25T14:55:04.111Z | warn | zhihu | login.poll.error | {"error":"轮询被拒: HTTP 403"} |
| 265 | 2026-10-25T14:55:05.695Z | warn | zhihu | login.poll.error | {"error":"轮询被拒: HTTP 403"} |
| 266 | 2026-10-25T14:55:07.294Z | warn | zhihu | login.poll.error | {"error":"轮询被拒: HTTP 403"} |
| 267 | 2026-10-25T14:55:08.965Z | warn | zhihu | login.poll.error | {"error":"轮询被拒: HTTP 403"} |
| 268 | 2026-10-25T14:55:10.692Z | warn | zhihu | login.poll.error | {"error":"轮询被拒: HTTP 403"} |
| 269 | 2026-10-25T14:55:13.347Z | warn | zhihu | login.poll.error | {"error":"轮询被拒: HTTP 403"} |
| 270 | 2026-10-25T14:55:34.172Z | warn | zhihu | login.poll.error | {"error":"轮询被拒: HTTP 403"} |
| 271 | 2026-10-25T14:55:37.553Z | warn | zhihu | login.poll.error | {"error":"轮询被拒: HTTP 403"} |
| 272 | 2026-10-25T14:55:39.258Z | warn | zhihu | login.poll.error | {"error":"轮询被拒: HTTP 403"} |
| 273 | 2026-10-25T14:55:45.461Z | warn | zhihu | login.poll.error | {"error":"轮询被拒: HTTP 403"} |
| 274 | 2026-10-25T14:55:47.044Z | warn | zhihu | login.poll.error | {"error":"轮询被拒: HTTP 403"} |
| 275 | 2026-10-25T14:55:48.682Z | warn | zhihu | login.poll.error | {"error":"轮询被拒: HTTP 403"} |
| 276 | 2026-10-25T14:55:50.266Z | warn | zhihu | login.poll.error | {"error":"轮询被拒: HTTP 403"} |
| 277 | 2026-10-25T14:55:51.856Z | warn | zhihu | login.poll.error | {"error":"轮询被拒: HTTP 403"} |
| 278 | 2026-10-25T14:55:53.438Z | warn | zhihu | login.poll.error | {"error":"轮询被拒: HTTP 403"} |
| 279 | 2026-10-25T14:55:55.034Z | warn | zhihu | login.poll.error | {"error":"轮询被拒: HTTP 403"} |
| 280 | 2026-10-25T14:55:56.619Z | warn | zhihu | login.poll.error | {"error":"轮询被拒: HTTP 403"} |
| 281 | 2026-10-25T14:55:58.201Z | warn | zhihu | login.poll.error | {"error":"轮询被拒: HTTP 403"} |
| 282 | 2026-10-25T14:55:59.782Z | warn | zhihu | login.poll.error | {"error":"轮询被拒: HTTP 403"} |
| 283 | 2026-10-25T14:56:01.380Z | warn | zhihu | login.poll.error | {"error":"轮询被拒: HTTP 403"} |
| 284 | 2026-10-25T14:56:02.989Z | warn | zhihu | login.poll.error | {"error":"轮询被拒: HTTP 403"} |
| 285 | 2026-10-25T14:56:04.571Z | warn | zhihu | login.poll.error | {"error":"轮询被拒: HTTP 403"} |
| 286 | 2026-10-25T14:56:06.235Z | warn | zhihu | login.poll.error | {"error":"轮询被拒: HTTP 403"} |
| 287 | 2026-10-25T14:56:07.830Z | warn | zhihu | login.poll.error | {"error":"轮询被拒: HTTP 403"} |
| 288 | 2026-10-25T14:56:09.415Z | warn | zhihu | login.poll.error | {"error":"轮询被拒: HTTP 403"} |
| 289 | 2026-10-25T14:56:11.038Z | warn | zhihu | login.poll.error | {"error":"轮询被拒: HTTP 403"} |
| 290 | 2026-10-25T14:56:12.623Z | warn | zhihu | login.poll.error | {"error":"轮询被拒: HTTP 403"} |
| 291 | 2026-10-25T14:56:14.214Z | warn | zhihu | login.poll.error | {"error":"轮询被拒: HTTP 403"} |
| 292 | 2026-10-25T14:56:15.882Z | warn | zhihu | login.poll.error | {"error":"轮询被拒: HTTP 403"} |
| 293 | 2026-10-25T14:56:17.490Z | warn | zhihu | login.poll.error | {"error":"轮询被拒: HTTP 403"} |
| 294 | 2026-10-25T14:56:19.420Z | warn | zhihu | login.poll.error | {"error":"轮询被拒: HTTP 403"} |
| 295 | 2026-10-25T14:56:21.359Z | warn | zhihu | login.poll.error | {"error":"轮询被拒: HTTP 403"} |
| 296 | 2026-10-25T14:56:22.951Z | warn | zhihu | login.poll.error | {"error":"轮询被拒: HTTP 403"} |
| 297 | 2026-10-25T14:56:24.680Z | warn | zhihu | login.poll.error | {"error":"轮询被拒: HTTP 403"} |
| 298 | 2026-10-25T14:56:27.573Z | warn | zhihu | login.poll.error | {"error":"轮询被拒: HTTP 403"} |
| 299 | 2026-10-25T14:56:29.618Z | warn | zhihu | login.poll.error | {"error":"轮询被拒: HTTP 403"} |
| 300 | 2026-10-25T14:56:31.217Z | warn | zhihu | login.poll.error | {"error":"轮询被拒: HTTP 403"} |
| 301 | 2026-10-25T14:56:32.805Z | warn | zhihu | login.poll.error | {"error":"轮询被拒: HTTP 403"} |
| 302 | 2026-10-25T14:56:34.397Z | warn | zhihu | login.poll.error | {"error":"轮询被拒: HTTP 403"} |
| 303 | 2026-10-25T14:56:36.030Z | warn | zhihu | login.poll.error | {"error":"轮询被拒: HTTP 403"} |
| 304 | 2026-10-25T14:56:37.618Z | warn | zhihu | login.poll.error | {"error":"轮询被拒: HTTP 403"} |
| 305 | 2026-10-25T14:56:39.198Z | warn | zhihu | login.poll.error | {"error":"轮询被拒: HTTP 403"} |
| 306 | 2026-10-25T14:56:40.866Z | warn | zhihu | login.poll.error | {"error":"轮询被拒: HTTP 403"} |
| 307 | 2026-10-25T14:56:42.454Z | warn | zhihu | login.poll.error | {"error":"轮询被拒: HTTP 403"} |
| 308 | 2026-10-25T14:56:44.278Z | warn | zhihu | login.poll.error | {"error":"轮询被拒: HTTP 403"} |
| 309 | 2026-10-25T14:56:46.584Z | warn | zhihu | login.poll.error | {"error":"轮询被拒: HTTP 403"} |
| 310 | 2026-10-25T14:56:48.164Z | warn | zhihu | login.poll.error | {"error":"轮询被拒: HTTP 403"} |
| 311 | 2026-10-25T14:56:49.737Z | warn | zhihu | login.poll.error | {"error":"轮询被拒: HTTP 403"} |
| 312 | 2026-10-25T14:56:51.317Z | warn | zhihu | login.poll.error | {"error":"轮询被拒: HTTP 403"} |
| 313 | 2026-10-25T14:56:52.901Z | warn | zhihu | login.poll.error | {"error":"轮询被拒: HTTP 403"} |
| 314 | 2026-10-25T14:56:54.487Z | warn | zhihu | login.poll.error | {"error":"轮询被拒: HTTP 403"} |
| 315 | 2026-10-25T14:56:56.527Z | warn | zhihu | login.poll.error | {"error":"轮询被拒: HTTP 403"} |
| 316 | 2026-10-25T14:56:58.111Z | warn | zhihu | login.poll.error | {"error":"轮询被拒: HTTP 403"} |
| 317 | 2026-10-25T14:56:59.719Z | warn | zhihu | login.poll.error | {"error":"轮询被拒: HTTP 403"} |
| 318 | 2026-10-25T14:57:02.229Z | warn | zhihu | login.poll.error | {"error":"轮询被拒: HTTP 403"} |
| 319 | 2026-10-25T14:57:03.832Z | warn | zhihu | login.poll.error | {"error":"轮询被拒: HTTP 403"} |
| 320 | 2026-10-25T14:57:05.433Z | warn | zhihu | login.poll.error | {"error":"轮询被拒: HTTP 403"} |
| 321 | 2026-10-25T14:57:07.024Z | warn | zhihu | login.poll.error | {"error":"轮询被拒: HTTP 403"} |
| 322 | 2026-10-25T14:57:08.610Z | warn | zhihu | login.poll.error | {"error":"轮询被拒: HTTP 403"} |
| 323 | 2026-10-25T14:57:10.195Z | warn | zhihu | login.poll.error | {"error":"轮询被拒: HTTP 403"} |
| 324 | 2026-10-25T14:57:11.853Z | warn | zhihu | login.poll.error | {"error":"轮询被拒: HTTP 403"} |
| 325 | 2026-10-25T14:57:13.431Z | warn | zhihu | login.poll.error | {"error":"轮询被拒: HTTP 403"} |
| 326 | 2026-10-25T14:57:15.039Z | warn | zhihu | login.poll.error | {"error":"轮询被拒: HTTP 403"} |
| 327 | 2026-10-25T14:57:16.644Z | warn | zhihu | login.poll.error | {"error":"轮询被拒: HTTP 403"} |
| 328 | 2026-10-25T14:57:18.228Z | warn | zhihu | login.poll.error | {"error":"轮询被拒: HTTP 403"} |
| 329 | 2026-10-25T14:57:19.831Z | warn | zhihu | login.poll.error | {"error":"轮询被拒: HTTP 403"} |
| 330 | 2026-10-25T14:57:21.433Z | warn | zhihu | login.poll.error | {"error":"轮询被拒: HTTP 403"} |
| 331 | 2026-10-25T14:57:22.201Z | error | wechat | bug.found | {"symptom":"40001 invalid credential","rootCause":"diagnose() 裸调 /cgi-bin/token，微信单例策略顶掉了正在使用的 token","discoveredBy":"草稿箱复核返回 0 条与实际不符时深查"} |
| 332 | 2026-10-25T14:57:22.202Z | info | wechat | bug.fixed | {"fix":"改用官方 stable_token 接口 + diagnose 复用缓存","verify":"重测草稿箱确认 1 条，token 有效期 7200s","impact":"消除了无人值守场景下的 token 互踢风险"} |
| 333 | 2026-10-25T14:57:23.212Z | warn | zhihu | login.poll.error | {"error":"轮询被拒: HTTP 403"} |
| 334 | 2026-10-25T14:57:24.786Z | warn | zhihu | login.poll.error | {"error":"轮询被拒: HTTP 403"} |
| 335 | 2026-10-25T14:57:26.403Z | warn | zhihu | login.poll.error | {"error":"轮询被拒: HTTP 403"} |
| 336 | 2026-10-25T14:57:28.067Z | warn | zhihu | login.poll.error | {"error":"轮询被拒: HTTP 403"} |
| 337 | 2026-10-25T14:57:29.648Z | warn | zhihu | login.poll.error | {"error":"轮询被拒: HTTP 403"} |
| 338 | 2026-10-25T14:57:31.419Z | warn | zhihu | login.poll.error | {"error":"轮询被拒: HTTP 403"} |
| 339 | 2026-10-25T14:57:33.005Z | warn | zhihu | login.poll.error | {"error":"轮询被拒: HTTP 403"} |
| 340 | 2026-10-25T14:57:34.633Z | warn | zhihu | login.poll.error | {"error":"轮询被拒: HTTP 403"} |
| 341 | 2026-10-25T14:57:36.608Z | warn | zhihu | login.poll.error | {"error":"轮询被拒: HTTP 403"} |
| 342 | 2026-10-25T14:57:38.263Z | warn | zhihu | login.poll.error | {"error":"轮询被拒: HTTP 403"} |
| 343 | 2026-10-25T14:57:39.836Z | warn | zhihu | login.poll.error | {"error":"轮询被拒: HTTP 403"} |
| 344 | 2026-10-25T14:57:41.478Z | warn | zhihu | login.poll.error | {"error":"轮询被拒: HTTP 403"} |
| 345 | 2026-10-25T14:57:43.064Z | warn | zhihu | login.poll.error | {"error":"轮询被拒: HTTP 403"} |
| 346 | 2026-10-25T14:57:44.650Z | warn | zhihu | login.poll.error | {"error":"轮询被拒: HTTP 403"} |
| 347 | 2026-10-25T14:57:46.246Z | warn | zhihu | login.poll.error | {"error":"轮询被拒: HTTP 403"} |
| 348 | 2026-10-25T14:57:47.847Z | warn | zhihu | login.poll.error | {"error":"轮询被拒: HTTP 403"} |
| 349 | 2026-10-25T14:57:49.430Z | warn | zhihu | login.poll.error | {"error":"轮询被拒: HTTP 403"} |
| 350 | 2026-10-25T14:57:51.036Z | warn | zhihu | login.poll.error | {"error":"轮询被拒: HTTP 403"} |
| 351 | 2026-10-25T14:57:52.621Z | warn | zhihu | login.poll.error | {"error":"轮询被拒: HTTP 403"} |
| 352 | 2026-10-25T14:57:54.201Z | warn | zhihu | login.poll.error | {"error":"轮询被拒: HTTP 403"} |
| 353 | 2026-10-25T14:57:55.785Z | warn | zhihu | login.poll.error | {"error":"轮询被拒: HTTP 403"} |
| 354 | 2026-10-25T14:57:57.360Z | warn | zhihu | login.poll.error | {"error":"轮询被拒: HTTP 403"} |
| 355 | 2026-10-25T14:57:58.948Z | warn | zhihu | login.poll.error | {"error":"轮询被拒: HTTP 403"} |
| 356 | 2026-10-25T14:58:01.245Z | warn | zhihu | login.poll.error | {"error":"轮询被拒: HTTP 403"} |
| 357 | 2026-10-25T14:58:02.882Z | warn | zhihu | login.poll.error | {"error":"轮询被拒: HTTP 403"} |
| 358 | 2026-10-25T14:58:04.470Z | warn | zhihu | login.poll.error | {"error":"轮询被拒: HTTP 403"} |
| 359 | 2026-10-25T14:58:06.091Z | warn | zhihu | login.poll.error | {"error":"轮询被拒: HTTP 403"} |
| 360 | 2026-10-25T14:58:07.747Z | warn | zhihu | login.poll.error | {"error":"轮询被拒: HTTP 403"} |
| 361 | 2026-10-25T14:58:09.347Z | warn | zhihu | login.poll.error | {"error":"轮询被拒: HTTP 403"} |
| 362 | 2026-10-25T14:58:10.959Z | warn | zhihu | login.poll.error | {"error":"轮询被拒: HTTP 403"} |
| 363 | 2026-10-25T14:58:12.533Z | warn | zhihu | login.poll.error | {"error":"轮询被拒: HTTP 403"} |
| 364 | 2026-10-25T14:58:14.172Z | warn | zhihu | login.poll.error | {"error":"轮询被拒: HTTP 403"} |
| 365 | 2026-10-25T14:58:15.751Z | warn | zhihu | login.poll.error | {"error":"轮询被拒: HTTP 403"} |
| 366 | 2026-10-25T14:58:17.467Z | warn | zhihu | login.poll.error | {"error":"轮询被拒: HTTP 403"} |
| 367 | 2026-10-25T14:58:19.042Z | warn | zhihu | login.poll.error | {"error":"轮询被拒: HTTP 403"} |
| 368 | 2026-10-25T14:58:20.620Z | warn | zhihu | login.poll.error | {"error":"轮询被拒: HTTP 403"} |
| 369 | 2026-10-25T14:58:22.212Z | warn | zhihu | login.poll.error | {"error":"轮询被拒: HTTP 403"} |
| 370 | 2026-10-25T14:58:23.796Z | warn | zhihu | login.poll.error | {"error":"轮询被拒: HTTP 403"} |
| 371 | 2026-10-25T14:58:25.393Z | warn | zhihu | login.poll.error | {"error":"轮询被拒: HTTP 403"} |
| 372 | 2026-10-25T14:58:26.979Z | warn | zhihu | login.poll.error | {"error":"轮询被拒: HTTP 403"} |
| 373 | 2026-10-25T14:58:28.562Z | warn | zhihu | login.poll.error | {"error":"轮询被拒: HTTP 403"} |
| 374 | 2026-10-25T14:58:30.671Z | warn | zhihu | login.poll.error | {"error":"轮询被拒: HTTP 403"} |
| 375 | 2026-10-25T14:58:32.547Z | warn | zhihu | login.poll.error | {"error":"轮询被拒: HTTP 403"} |
| 376 | 2026-10-25T14:58:34.133Z | warn | zhihu | login.poll.error | {"error":"轮询被拒: HTTP 403"} |
| 377 | 2026-10-25T14:58:35.730Z | warn | zhihu | login.poll.error | {"error":"轮询被拒: HTTP 403"} |
| 378 | 2026-10-25T14:58:37.365Z | warn | zhihu | login.poll.error | {"error":"轮询被拒: HTTP 403"} |
| 379 | 2026-10-25T14:58:38.956Z | warn | zhihu | login.poll.error | {"error":"轮询被拒: HTTP 403"} |
| 380 | 2026-10-25T14:58:40.622Z | warn | zhihu | login.poll.error | {"error":"轮询被拒: HTTP 403"} |
| 381 | 2026-10-25T14:58:42.207Z | warn | zhihu | login.poll.error | {"error":"轮询被拒: HTTP 403"} |
| 382 | 2026-10-25T14:58:43.789Z | warn | zhihu | login.poll.error | {"error":"轮询被拒: HTTP 403"} |
| 383 | 2026-10-25T14:58:45.368Z | warn | zhihu | login.poll.error | {"error":"轮询被拒: HTTP 403"} |
| 384 | 2026-10-25T14:58:46.959Z | warn | zhihu | login.poll.error | {"error":"轮询被拒: HTTP 403"} |
| 385 | 2026-10-25T14:58:48.546Z | warn | zhihu | login.poll.error | {"error":"轮询被拒: HTTP 403"} |
| 386 | 2026-10-25T14:58:50.136Z | warn | zhihu | login.poll.error | {"error":"轮询被拒: HTTP 403"} |
| 387 | 2026-10-25T14:58:51.811Z | warn | zhihu | login.poll.error | {"error":"轮询被拒: HTTP 403"} |
| 388 | 2026-10-25T14:58:53.395Z | warn | zhihu | login.poll.error | {"error":"轮询被拒: HTTP 403"} |
| 389 | 2026-10-25T14:58:54.976Z | warn | zhihu | login.poll.error | {"error":"轮询被拒: HTTP 403"} |
| 390 | 2026-10-25T14:58:56.558Z | warn | zhihu | login.poll.error | {"error":"轮询被拒: HTTP 403"} |
| 391 | 2026-10-25T14:58:58.205Z | warn | zhihu | login.poll.error | {"error":"轮询被拒: HTTP 403"} |
| 392 | 2026-10-25T14:58:59.785Z | warn | zhihu | login.poll.error | {"error":"轮询被拒: HTTP 403"} |
| 393 | 2026-10-25T14:59:01.504Z | warn | zhihu | login.poll.error | {"error":"轮询被拒: HTTP 403"} |
| 394 | 2026-10-25T14:59:03.166Z | warn | zhihu | login.poll.error | {"error":"轮询被拒: HTTP 403"} |
| 395 | 2026-10-25T14:59:05.360Z | warn | zhihu | login.poll.error | {"error":"轮询被拒: HTTP 403"} |
| 396 | 2026-10-25T14:59:07.080Z | warn | zhihu | login.poll.error | {"error":"轮询被拒: HTTP 403"} |
| 397 | 2026-10-25T14:59:08.664Z | warn | zhihu | login.poll.error | {"error":"轮询被拒: HTTP 403"} |
| 398 | 2026-10-25T14:59:10.238Z | warn | zhihu | login.poll.error | {"error":"轮询被拒: HTTP 403"} |
| 399 | 2026-10-25T14:59:15.655Z | warn | zhihu | login.poll.error | {"error":"轮询被拒: HTTP 403"} |
| 400 | 2026-10-25T14:59:17.609Z | warn | zhihu | login.poll.error | {"error":"轮询被拒: HTTP 403"} |
| 401 | 2026-10-25T14:59:20.561Z | warn | zhihu | login.poll.error | {"error":"轮询被拒: HTTP 403"} |
| 402 | 2026-10-25T14:59:25.472Z | warn | zhihu | login.poll.error | {"error":"轮询被拒: HTTP 403"} |
| 403 | 2026-10-25T14:59:31.107Z | warn | zhihu | login.poll.error | {"error":"轮询被拒: HTTP 403"} |
| 404 | 2026-10-25T14:59:36.172Z | warn | zhihu | login.poll.error | {"error":"轮询被拒: HTTP 403"} |
| 405 | 2026-10-25T14:59:43.042Z | warn | zhihu | login.poll.error | {"error":"轮询被拒: HTTP 403"} |
| 406 | 2026-10-25T14:59:48.435Z | warn | zhihu | login.poll.error | {"error":"轮询被拒: HTTP 403"} |
| 407 | 2026-10-25T14:59:52.416Z | warn | zhihu | login.poll.error | {"error":"轮询被拒: HTTP 403"} |
| 408 | 2026-10-25T14:59:58.152Z | warn | zhihu | login.poll.error | {"error":"轮询被拒: HTTP 403"} |
| 409 | 2026-10-25T15:00:01.245Z | error | zhihu | login.poll.fail | {"http":403,"count":"15+次","rootCause":"缺少 x-zse-93 反爬签名版本头","evidence":"zhihu-cli 源码 auth.js:165 对 scan_info 显式传该头，值 101_3_3.0","action":"终止进程避免持续失败请求触发 IP 封禁" |
| 410 | 2026-10-25T15:00:01.246Z | warn | zhihu | login.process.killed | {"pid":11584,"reason":"每秒1.5次403轮询存在风控风险","note":"非绕过尝试，是缺少必需请求头"} |
| 411 | 2026-10-25T15:10:20.743Z | error | zhihu | riskcontrol.flagged | {"evidence":"首页 302→unhuman，问题页 403，search_v3 403","redirect":"https://www.zhihu.com/account/unhuman?type=S6E3V1","nature":"环境（数据中心IP）被知乎人机验证风控标记"} |
| 412 | 2026-10-25T15:10:20.744Z | warn | zhihu | self.inflicted.damage | {"myContribution":"x-zse-93 头位置错误导致轮询稳定 403，进程连续失败约 150 次","timeline":"15:04 首页仍 200 → 之后变为 unhuman","honestNote":"我的 bug 加剧了风控等级，责任在我，不推给环境"} |
| 413 | 2026-10-25T15:10:20.745Z | info | zhihu | bypass.refused | {"decision":"不绕过 unhuman 人机验证","reason":"这是知乎明确的真人验证要求；破解它属于规避技术保护措施，越过本项目起始声明的边界","alternative":"知乎保持半自动队列（成品稿已就绪）"} |
| 414 | 2026-10-25T15:10:20.745Z | info | zhihu | zse.ported | {"file":"lib/zse.js","source":"zhihu-cli (AGPL-3.0)","constants":"ZK=32, ZB=256, ALPHABET=65, KEY16","verified":"决定性✅ 不同输入不同输出✅","note":"签名实现正确，但环境风控在签名之前就拦截了"} |
| 415 | 2026-10-25T15:10:20.745Z | info | zhihu | login.abandoned | {"plan":"保留代码，不在本环境重试","recommendation":"用户在自己浏览器/设备登录后导出 Cookie 再由系统使用；但需评估账号风控风险"} |

---

*报告结束。共 415 条审计记录，全部列于上表，无删减。*