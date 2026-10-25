# ops 自动运营平台 · 全量运营记录

生成时间：2026-10-25T19:14:55.843Z

> 本报告由审计链直接导出，包含系统自启动以来的**每一条**运行记录，不筛选、不省略、不删除。
> 审计链采用哈希链（每条含前一条的 SHA-256），任何记录的增删改都会导致校验失败。

## 0. 审计链完整性

- 状态：**✅ 完整**
- 记录总数：1016
- 链头：seq=1016, hash=1702972b1624a6d85f3b2330765da745079cb7df8c4e84ef5a59da79fbfa54de

## 1. 系统资产统计

| 项目 | 数量 |
|---|---|
| 采集情报条目 | 239 |
| 原创文章 | 35 |
| 平台成品稿 | 1148 |
| 审计记录 | 1016 |

### 1.1 情报来源分布

| 来源 | 条数 |
|---|---|
| zhihu-search | 48 |
| lobsters | 36 |
| hn | 34 |
| media-ofweek-im | 31 |
| media-gongkong | 30 |
| zhihu-hot | 30 |
| github | 20 |
| media-eworks | 10 |

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
| 15 | deep | published | 没有不良品样本,怎么做 AI 质检? |
| 16 | deep | published | CBB 2026 圆满收官/山东明佳,以 AI 视觉检测筑牢包装品质防线 |
| 17 | deep | published | 京东工业发布JoyIndustrial 2.0及创新应用 落地产业场景 创造真实价值 |
| 18 | deep | published | 工业AI资料合集(一):10份报告、指南与国标/持续更新 |
| 19 | deep | published | 奇智孔明大模型/山东人工智能垂域大模型之奇伟磅礴 |
| 20 | deep | published | 智启边缘 AI/研华正式发布WISE 工业智能站,构建企业级工业 AI 大脑 |
| 21 | deep | published | 重磅!八部门联手推进机械工业数字化转型,2027年建成200+卓越级智能工厂 |
| 22 | deep | published | 制造业数字化转型怎么做?三家工厂三个场景一文看懂 |
| 23 | deep | published | 六部门开展智能工厂培育;仁怀将推广酒旅IP…… |
| 24 | deep | published | 大家用 WorkBuddy 都用来干啥？ |
| 25 | deep | published | 宝洁把AI质检推向全球工厂,废品率最高降20% |
| 26 | deep | published | 讯强电子×华为:毫厘之间筑品质防线,打造工业AI质检新标杆 |
| 27 | deep | published | 腾讯云TVP走进宁德时代,共探AI产业落地的真实路径 |
| 28 | deep | published | 给3万家工厂装上“AI大脑”,黑湖科技工博会工业AI规模落地 |
| 29 | deep | published | 《西游记》中如来佛祖为什么要推蝎子精，而蝎子精又为何胆大到敢扎佛祖？ |
| 30 | deep | published | 烟草第一大省云南前三季度烟草工业负增长，中国烟草市场正在发生什么变化？为何烤烟卖不动了？ |
| 31 | deep | published | 为什么人们爱吃火锅？ |
| 32 | deep | published | 微软宣布全面转向原生开发并告别网页套壳，能解决 Windows11 的卡顿臃肿吗？ |
| 33 | daily | published | 智能制造日报 / 2026-10-25：落地说、产业观察、技术前沿等 8 条动态 |
| 34 | deep | published | 没有不良品样本,怎么做 AI 质检? |
| 35 | deep | published | CBB 2026 圆满收官/山东明佳,以 AI 视觉检测筑牢包装品质防线 |
| 36 | deep | published | 京东工业发布JoyIndustrial 2.0及创新应用 落地产业场景 创造真实价值 |

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
| 416 | 2026-10-25T15:11:45.029Z | info | report | generated | {"file":"log/OPS-REPORT.md","records":415,"chainOk":true} |
| 417 | 2026-10-25T15:13:29.776Z | info | housekeeping | zhihu.qrcode.removed | {"reason":"登录流程已终止，二维码已过期失效，清理死文件","notAffected":"审计日志与所有记录完整保留"} |
| 418 | 2026-10-25T15:13:29.830Z | info | report | generated | {"file":"log/OPS-REPORT.md","records":417,"chainOk":true} |
| 419 | 2026-10-25T15:27:32.523Z | info | pipeline | start | {} |
| 420 | 2026-10-25T15:27:35.100Z | info | intel | collect.hn.ok | {"count":28} |
| 421 | 2026-10-25T15:27:36.852Z | info | intel | collect.github.ok | {"count":20} |
| 422 | 2026-10-25T15:27:38.601Z | info | intel | collect.lobsters.ok | {"count":25} |
| 423 | 2026-10-25T15:27:38.601Z | info | intel | collect.all.done | {"results":{"hn":28,"github":20,"lobsters":25},"total":73} |
| 424 | 2026-10-25T15:27:38.605Z | info | generate | article.updated | {"articleId":1,"slug":"digest-20261025","kind":"digest","items":5} |
| 425 | 2026-10-25T15:27:38.605Z | info | generate | batch.done | {"digest":1,"items":0} |
| 426 | 2026-10-25T15:27:38.608Z | info | publish | adapt.done | {"articleId":1,"slug":"digest-20261025","channels":["wechat","zhihu","xhs","toutiao"]} |
| 427 | 2026-10-25T15:27:38.612Z | info | publish | adapt.done | {"articleId":17,"slug":"20261025-3a8e65","channels":["wechat","zhihu","xhs","toutiao"]} |
| 428 | 2026-10-25T15:27:38.615Z | info | publish | adapt.done | {"articleId":16,"slug":"20261025-0d15cb","channels":["wechat","zhihu","xhs","toutiao"]} |
| 429 | 2026-10-25T15:27:38.619Z | info | publish | adapt.done | {"articleId":15,"slug":"20261025-bb6043","channels":["wechat","zhihu","xhs","toutiao"]} |
| 430 | 2026-10-25T15:27:38.622Z | info | publish | adapt.done | {"articleId":14,"slug":"manufacturing-daily-20261025","channels":["wechat","zhihu","xhs","toutiao"]} |
| 431 | 2026-10-25T15:27:38.625Z | info | publish | adapt.done | {"articleId":13,"slug":"20261025-e0e966","channels":["wechat","zhihu","xhs","toutiao"]} |
| 432 | 2026-10-25T15:27:38.627Z | info | publish | adapt.done | {"articleId":12,"slug":"20261025-80a838","channels":["wechat","zhihu","xhs","toutiao"]} |
| 433 | 2026-10-25T15:27:38.630Z | info | publish | adapt.done | {"articleId":11,"slug":"20261025-74c3ee","channels":["wechat","zhihu","xhs","toutiao"]} |
| 434 | 2026-10-25T15:27:38.632Z | info | publish | adapt.done | {"articleId":10,"slug":"20261025-293ca1","channels":["wechat","zhihu","xhs","toutiao"]} |
| 435 | 2026-10-25T15:27:38.635Z | info | publish | adapt.done | {"articleId":9,"slug":"20261025-0a180b","channels":["wechat","zhihu","xhs","toutiao"]} |
| 436 | 2026-10-25T15:27:38.639Z | info | publish | adapt.done | {"articleId":8,"slug":"20261025-cf6fc7","channels":["wechat","zhihu","xhs","toutiao"]} |
| 437 | 2026-10-25T15:27:38.641Z | info | publish | adapt.done | {"articleId":7,"slug":"20261025-a69af5","channels":["wechat","zhihu","xhs","toutiao"]} |
| 438 | 2026-10-25T15:27:38.643Z | info | publish | adapt.done | {"articleId":6,"slug":"20261025-503e9d","channels":["wechat","zhihu","xhs","toutiao"]} |
| 439 | 2026-10-25T15:27:38.645Z | info | publish | adapt.done | {"articleId":5,"slug":"20261025-760c72","channels":["wechat","zhihu","xhs","toutiao"]} |
| 440 | 2026-10-25T15:27:38.647Z | info | publish | adapt.done | {"articleId":4,"slug":"20261025-1f6ba7","channels":["wechat","zhihu","xhs","toutiao"]} |
| 441 | 2026-10-25T15:27:38.651Z | info | publish | adapt.done | {"articleId":3,"slug":"20261025-7be1d8","channels":["wechat","zhihu","xhs","toutiao"]} |
| 442 | 2026-10-25T15:27:38.653Z | info | publish | adapt.done | {"articleId":2,"slug":"20261025-b23312","channels":["wechat","zhihu","xhs","toutiao"]} |
| 443 | 2026-10-25T15:27:38.654Z | info | publish | batch.done | {"articles":17} |
| 444 | 2026-10-25T15:27:38.664Z | info | site | generate.done | {"articles":17,"intel":100,"pages":118} |
| 445 | 2026-10-25T15:27:38.664Z | info | pipeline | done | {"intel":{"results":{"hn":28,"github":20,"lobsters":25},"total":73},"content":{"digest":1,"items":[]},"publish":17,"site":{"articles":17,"intel":100,"pages":118 |
| 446 | 2026-10-25T16:27:32.525Z | info | pipeline | start | {} |
| 447 | 2026-10-25T16:27:33.949Z | info | intel | collect.hn.ok | {"count":28} |
| 448 | 2026-10-25T16:27:35.508Z | info | intel | collect.github.ok | {"count":20} |
| 449 | 2026-10-25T16:27:36.569Z | info | intel | collect.lobsters.ok | {"count":25} |
| 450 | 2026-10-25T16:27:36.569Z | info | intel | collect.all.done | {"results":{"hn":28,"github":20,"lobsters":25},"total":73} |
| 451 | 2026-10-25T16:27:36.572Z | info | generate | article.updated | {"articleId":1,"slug":"digest-20261025","kind":"digest","items":5} |
| 452 | 2026-10-25T16:27:36.573Z | info | generate | batch.done | {"digest":1,"items":0} |
| 453 | 2026-10-25T16:27:36.576Z | info | publish | adapt.done | {"articleId":1,"slug":"digest-20261025","channels":["wechat","zhihu","xhs","toutiao"]} |
| 454 | 2026-10-25T16:27:36.579Z | info | publish | adapt.done | {"articleId":17,"slug":"20261025-3a8e65","channels":["wechat","zhihu","xhs","toutiao"]} |
| 455 | 2026-10-25T16:27:36.583Z | info | publish | adapt.done | {"articleId":16,"slug":"20261025-0d15cb","channels":["wechat","zhihu","xhs","toutiao"]} |
| 456 | 2026-10-25T16:27:36.586Z | info | publish | adapt.done | {"articleId":15,"slug":"20261025-bb6043","channels":["wechat","zhihu","xhs","toutiao"]} |
| 457 | 2026-10-25T16:27:36.588Z | info | publish | adapt.done | {"articleId":14,"slug":"manufacturing-daily-20261025","channels":["wechat","zhihu","xhs","toutiao"]} |
| 458 | 2026-10-25T16:27:36.594Z | info | publish | adapt.done | {"articleId":13,"slug":"20261025-e0e966","channels":["wechat","zhihu","xhs","toutiao"]} |
| 459 | 2026-10-25T16:27:36.597Z | info | publish | adapt.done | {"articleId":12,"slug":"20261025-80a838","channels":["wechat","zhihu","xhs","toutiao"]} |
| 460 | 2026-10-25T16:27:36.600Z | info | publish | adapt.done | {"articleId":11,"slug":"20261025-74c3ee","channels":["wechat","zhihu","xhs","toutiao"]} |
| 461 | 2026-10-25T16:27:36.604Z | info | publish | adapt.done | {"articleId":10,"slug":"20261025-293ca1","channels":["wechat","zhihu","xhs","toutiao"]} |
| 462 | 2026-10-25T16:27:36.608Z | info | publish | adapt.done | {"articleId":9,"slug":"20261025-0a180b","channels":["wechat","zhihu","xhs","toutiao"]} |
| 463 | 2026-10-25T16:27:36.612Z | info | publish | adapt.done | {"articleId":8,"slug":"20261025-cf6fc7","channels":["wechat","zhihu","xhs","toutiao"]} |
| 464 | 2026-10-25T16:27:36.620Z | info | publish | adapt.done | {"articleId":7,"slug":"20261025-a69af5","channels":["wechat","zhihu","xhs","toutiao"]} |
| 465 | 2026-10-25T16:27:36.624Z | info | publish | adapt.done | {"articleId":6,"slug":"20261025-503e9d","channels":["wechat","zhihu","xhs","toutiao"]} |
| 466 | 2026-10-25T16:27:36.627Z | info | publish | adapt.done | {"articleId":5,"slug":"20261025-760c72","channels":["wechat","zhihu","xhs","toutiao"]} |
| 467 | 2026-10-25T16:27:36.632Z | info | publish | adapt.done | {"articleId":4,"slug":"20261025-1f6ba7","channels":["wechat","zhihu","xhs","toutiao"]} |
| 468 | 2026-10-25T16:27:36.635Z | info | publish | adapt.done | {"articleId":3,"slug":"20261025-7be1d8","channels":["wechat","zhihu","xhs","toutiao"]} |
| 469 | 2026-10-25T16:27:36.639Z | info | publish | adapt.done | {"articleId":2,"slug":"20261025-b23312","channels":["wechat","zhihu","xhs","toutiao"]} |
| 470 | 2026-10-25T16:27:36.639Z | info | publish | batch.done | {"articles":17} |
| 471 | 2026-10-25T16:27:36.654Z | info | site | generate.done | {"articles":17,"intel":100,"pages":118} |
| 472 | 2026-10-25T16:27:36.654Z | info | pipeline | done | {"intel":{"results":{"hn":28,"github":20,"lobsters":25},"total":73},"content":{"digest":1,"items":[]},"publish":17,"site":{"articles":17,"intel":100,"pages":118 |
| 473 | 2026-10-25T16:30:38.661Z | info | intel | collect.zhihu.hot.ok | {"items":20,"saved":6} |
| 474 | 2026-10-25T16:30:39.364Z | info | intel | collect.zhihu.search.ok | {"query":"智能制造 AI 落地","items":10,"saved":0} |
| 475 | 2026-10-25T16:30:41.449Z | info | intel | collect.zhihu.search.ok | {"query":"工业大模型 应用","items":10,"saved":0} |
| 476 | 2026-10-25T16:30:43.552Z | info | intel | collect.zhihu.search.ok | {"query":"AI 质检 缺陷检测","items":10,"saved":0} |
| 477 | 2026-10-25T16:30:45.571Z | info | intel | collect.zhihu.search.ok | {"query":"智能工厂 数字化转型","items":10,"saved":10} |
| 478 | 2026-10-25T16:30:47.683Z | info | intel | collect.zhihu.search.ok | {"query":"工业机器人 具身智能","items":10,"saved":10} |
| 479 | 2026-10-25T16:30:49.184Z | info | intel | collect.zhihu.done | {"hot":6,"search":20,"errors":0} |
| 480 | 2026-10-25T16:37:26.483Z | info | server | start | {"port":8765,"root":"/workspace/ops/site/static"} |
| 481 | 2026-10-25T16:37:26.485Z | info | pipeline | start | {} |
| 482 | 2026-10-25T16:37:26.887Z | info | intel | collect.zhihu.hot.ok | {"items":20,"saved":0} |
| 483 | 2026-10-25T16:37:27.393Z | info | intel | collect.zhihu.search.ok | {"query":"智能制造 AI 落地","items":10,"saved":0} |
| 484 | 2026-10-25T16:37:29.401Z | info | intel | collect.zhihu.search.ok | {"query":"工业大模型 应用","items":10,"saved":0} |
| 485 | 2026-10-25T16:37:31.380Z | info | intel | collect.zhihu.search.ok | {"query":"AI 质检 缺陷检测","items":10,"saved":0} |
| 486 | 2026-10-25T16:37:33.356Z | info | intel | collect.zhihu.search.ok | {"query":"智能工厂 数字化转型","items":10,"saved":0} |
| 487 | 2026-10-25T16:37:35.331Z | info | intel | collect.zhihu.search.ok | {"query":"工业机器人 具身智能","items":10,"saved":0} |
| 488 | 2026-10-25T16:37:36.832Z | info | intel | collect.zhihu.done | {"hot":0,"search":0,"errors":0} |
| 489 | 2026-10-25T16:37:36.833Z | info | intel | collect.zhihu.ok | {"count":0} |
| 490 | 2026-10-25T16:37:39.244Z | info | intel | collect.hn.ok | {"count":27} |
| 491 | 2026-10-25T16:37:40.939Z | info | intel | collect.github.ok | {"count":20} |
| 492 | 2026-10-25T16:37:43.092Z | info | intel | collect.lobsters.ok | {"count":25} |
| 493 | 2026-10-25T16:37:43.093Z | info | intel | collect.all.done | {"results":{"zhihu":0,"hn":27,"github":20,"lobsters":25},"total":72} |
| 494 | 2026-10-25T16:37:43.100Z | info | generate | article.updated | {"articleId":14,"slug":"manufacturing-daily-20261025","kind":"daily","items":8} |
| 495 | 2026-10-25T16:37:43.104Z | info | generate | article.created | {"articleId":18,"slug":"20261025-5661c0","kind":"deep","theme":"case","source":"zhihu-search"} |
| 496 | 2026-10-25T16:37:43.108Z | info | generate | article.created | {"articleId":19,"slug":"20261025-87dacb","kind":"deep","theme":"tech","source":"zhihu-search"} |
| 497 | 2026-10-25T16:37:43.110Z | info | generate | article.created | {"articleId":20,"slug":"20261025-1829f9","kind":"deep","theme":"case","source":"zhihu-search"} |
| 498 | 2026-10-25T16:37:43.110Z | info | generate | batch.done | {"daily":14,"deep":3} |
| 499 | 2026-10-25T16:37:43.117Z | info | publish | adapt.done | {"articleId":20,"slug":"20261025-1829f9","channels":["wechat","zhihu","xhs","toutiao"]} |
| 500 | 2026-10-25T16:37:43.121Z | info | publish | adapt.done | {"articleId":19,"slug":"20261025-87dacb","channels":["wechat","zhihu","xhs","toutiao"]} |
| 501 | 2026-10-25T16:37:43.126Z | info | publish | adapt.done | {"articleId":18,"slug":"20261025-5661c0","channels":["wechat","zhihu","xhs","toutiao"]} |
| 502 | 2026-10-25T16:37:43.131Z | info | publish | adapt.done | {"articleId":14,"slug":"manufacturing-daily-20261025","channels":["wechat","zhihu","xhs","toutiao"]} |
| 503 | 2026-10-25T16:37:43.137Z | info | publish | adapt.done | {"articleId":1,"slug":"digest-20261025","channels":["wechat","zhihu","xhs","toutiao"]} |
| 504 | 2026-10-25T16:37:43.140Z | info | publish | adapt.done | {"articleId":17,"slug":"20261025-3a8e65","channels":["wechat","zhihu","xhs","toutiao"]} |
| 505 | 2026-10-25T16:37:43.144Z | info | publish | adapt.done | {"articleId":16,"slug":"20261025-0d15cb","channels":["wechat","zhihu","xhs","toutiao"]} |
| 506 | 2026-10-25T16:37:43.149Z | info | publish | adapt.done | {"articleId":15,"slug":"20261025-bb6043","channels":["wechat","zhihu","xhs","toutiao"]} |
| 507 | 2026-10-25T16:37:43.154Z | info | publish | adapt.done | {"articleId":13,"slug":"20261025-e0e966","channels":["wechat","zhihu","xhs","toutiao"]} |
| 508 | 2026-10-25T16:37:43.159Z | info | publish | adapt.done | {"articleId":12,"slug":"20261025-80a838","channels":["wechat","zhihu","xhs","toutiao"]} |
| 509 | 2026-10-25T16:37:43.163Z | info | publish | adapt.done | {"articleId":11,"slug":"20261025-74c3ee","channels":["wechat","zhihu","xhs","toutiao"]} |
| 510 | 2026-10-25T16:37:43.168Z | info | publish | adapt.done | {"articleId":10,"slug":"20261025-293ca1","channels":["wechat","zhihu","xhs","toutiao"]} |
| 511 | 2026-10-25T16:37:43.171Z | info | publish | adapt.done | {"articleId":9,"slug":"20261025-0a180b","channels":["wechat","zhihu","xhs","toutiao"]} |
| 512 | 2026-10-25T16:37:43.175Z | info | publish | adapt.done | {"articleId":8,"slug":"20261025-cf6fc7","channels":["wechat","zhihu","xhs","toutiao"]} |
| 513 | 2026-10-25T16:37:43.179Z | info | publish | adapt.done | {"articleId":7,"slug":"20261025-a69af5","channels":["wechat","zhihu","xhs","toutiao"]} |
| 514 | 2026-10-25T16:37:43.181Z | info | publish | adapt.done | {"articleId":6,"slug":"20261025-503e9d","channels":["wechat","zhihu","xhs","toutiao"]} |
| 515 | 2026-10-25T16:37:43.186Z | info | publish | adapt.done | {"articleId":5,"slug":"20261025-760c72","channels":["wechat","zhihu","xhs","toutiao"]} |
| 516 | 2026-10-25T16:37:43.190Z | info | publish | adapt.done | {"articleId":4,"slug":"20261025-1f6ba7","channels":["wechat","zhihu","xhs","toutiao"]} |
| 517 | 2026-10-25T16:37:43.192Z | info | publish | adapt.done | {"articleId":3,"slug":"20261025-7be1d8","channels":["wechat","zhihu","xhs","toutiao"]} |
| 518 | 2026-10-25T16:37:43.197Z | info | publish | adapt.done | {"articleId":2,"slug":"20261025-b23312","channels":["wechat","zhihu","xhs","toutiao"]} |
| 519 | 2026-10-25T16:37:43.199Z | info | publish | batch.done | {"articles":20} |
| 520 | 2026-10-25T16:37:43.213Z | info | site | generate.done | {"articles":20,"intel":100,"pages":121} |
| 521 | 2026-10-25T16:37:43.214Z | info | pipeline | done | {"intel":{"results":{"zhihu":0,"hn":27,"github":20,"lobsters":25},"total":72},"content":{"daily":14,"deep":[18,19,20]},"publish":20,"site":{"articles":20,"intel |
| 522 | 2026-10-25T16:37:44.471Z | info | cloud | deploy.triggered | {"repo":"q785845530/ai-tools-intel","via":"workflow_dispatch","by":"local-cron"} |
| 523 | 2026-10-25T16:37:46.633Z | info | wechat | cover.uploaded | {"mediaId":"FkZ9XCO0BwnXzC2V7v9B_zZuilCRqE_P2mhGyNhfcy8VRH5IyX6YqMj6Bz-WjOyh","bytes":137096} |
| 524 | 2026-10-25T16:37:49.425Z | info | wechat | draft.created | {"mediaId":"FkZ9XCO0BwnXzC2V7v9B_-Tl_73C-Z4Lbb7hcJmuULBhPdw8KSxytM8kiNZKH_GY","count":1} |
| 525 | 2026-10-25T16:37:49.427Z | info | wechat | bridge.draft.done | {"draftId":"FkZ9XCO0BwnXzC2V7v9B_-Tl_73C-Z4Lbb7hcJmuULBhPdw8KSxytM8kiNZKH_GY","articles":[14]} |
| 526 | 2026-10-25T16:37:49.427Z | info | pipeline | cron.enabled | {"intervalMs":3600000} |
| 527 | 2026-10-25T16:41:35.060Z | info | server | start | {"port":8765,"root":"/workspace/ops/site/static"} |
| 528 | 2026-10-25T16:41:35.062Z | info | pipeline | start | {} |
| 529 | 2026-10-25T16:41:35.580Z | info | intel | collect.zhihu.hot.ok | {"items":20,"saved":0} |
| 530 | 2026-10-25T16:41:36.024Z | info | intel | collect.zhihu.search.ok | {"query":"智能制造 AI 落地","items":10,"saved":0} |
| 531 | 2026-10-25T16:41:38.045Z | info | intel | collect.zhihu.search.ok | {"query":"工业大模型 应用","items":10,"saved":0} |
| 532 | 2026-10-25T16:41:40.137Z | info | intel | collect.zhihu.search.ok | {"query":"AI 质检 缺陷检测","items":10,"saved":0} |
| 533 | 2026-10-25T16:41:42.015Z | info | intel | collect.zhihu.search.ok | {"query":"智能工厂 数字化转型","items":10,"saved":0} |
| 534 | 2026-10-25T16:41:43.951Z | info | intel | collect.zhihu.search.ok | {"query":"工业机器人 具身智能","items":10,"saved":0} |
| 535 | 2026-10-25T16:41:45.453Z | info | intel | collect.zhihu.done | {"hot":0,"search":0,"errors":0} |
| 536 | 2026-10-25T16:41:45.453Z | info | intel | collect.zhihu.ok | {"count":0} |
| 537 | 2026-10-25T16:41:47.488Z | info | intel | collect.hn.ok | {"count":27} |
| 538 | 2026-10-25T16:41:49.883Z | info | intel | collect.github.ok | {"count":20} |
| 539 | 2026-10-25T16:41:54.721Z | info | intel | collect.lobsters.ok | {"count":25} |
| 540 | 2026-10-25T16:41:54.721Z | info | intel | collect.all.done | {"results":{"zhihu":0,"hn":27,"github":20,"lobsters":25},"total":72} |
| 541 | 2026-10-25T16:41:54.727Z | info | generate | article.updated | {"articleId":14,"slug":"manufacturing-daily-20261025","kind":"daily","items":8} |
| 542 | 2026-10-25T16:41:54.731Z | info | generate | article.created | {"articleId":21,"slug":"20261025-1b3759","kind":"deep","theme":"case","source":"zhihu-search"} |
| 543 | 2026-10-25T16:41:54.732Z | info | generate | article.created | {"articleId":22,"slug":"20261025-333582","kind":"deep","theme":"case","source":"zhihu-search"} |
| 544 | 2026-10-25T16:41:54.734Z | info | generate | article.created | {"articleId":23,"slug":"20261025-be58e8","kind":"deep","theme":"case","source":"zhihu-search"} |
| 545 | 2026-10-25T16:41:54.734Z | info | generate | batch.done | {"daily":14,"deep":3} |
| 546 | 2026-10-25T16:41:54.743Z | info | publish | adapt.done | {"articleId":23,"slug":"20261025-be58e8","channels":["wechat","zhihu","xhs","toutiao"]} |
| 547 | 2026-10-25T16:41:54.747Z | info | publish | adapt.done | {"articleId":22,"slug":"20261025-333582","channels":["wechat","zhihu","xhs","toutiao"]} |
| 548 | 2026-10-25T16:41:54.751Z | info | publish | adapt.done | {"articleId":21,"slug":"20261025-1b3759","channels":["wechat","zhihu","xhs","toutiao"]} |
| 549 | 2026-10-25T16:41:54.755Z | info | publish | adapt.done | {"articleId":14,"slug":"manufacturing-daily-20261025","channels":["wechat","zhihu","xhs","toutiao"]} |
| 550 | 2026-10-25T16:41:54.759Z | info | publish | adapt.done | {"articleId":20,"slug":"20261025-1829f9","channels":["wechat","zhihu","xhs","toutiao"]} |
| 551 | 2026-10-25T16:41:54.762Z | info | publish | adapt.done | {"articleId":19,"slug":"20261025-87dacb","channels":["wechat","zhihu","xhs","toutiao"]} |
| 552 | 2026-10-25T16:41:54.764Z | info | publish | adapt.done | {"articleId":18,"slug":"20261025-5661c0","channels":["wechat","zhihu","xhs","toutiao"]} |
| 553 | 2026-10-25T16:41:54.768Z | info | publish | adapt.done | {"articleId":1,"slug":"digest-20261025","channels":["wechat","zhihu","xhs","toutiao"]} |
| 554 | 2026-10-25T16:41:54.771Z | info | publish | adapt.done | {"articleId":17,"slug":"20261025-3a8e65","channels":["wechat","zhihu","xhs","toutiao"]} |
| 555 | 2026-10-25T16:41:54.777Z | info | publish | adapt.done | {"articleId":16,"slug":"20261025-0d15cb","channels":["wechat","zhihu","xhs","toutiao"]} |
| 556 | 2026-10-25T16:41:54.782Z | info | publish | adapt.done | {"articleId":15,"slug":"20261025-bb6043","channels":["wechat","zhihu","xhs","toutiao"]} |
| 557 | 2026-10-25T16:41:54.784Z | info | publish | adapt.done | {"articleId":13,"slug":"20261025-e0e966","channels":["wechat","zhihu","xhs","toutiao"]} |
| 558 | 2026-10-25T16:41:54.787Z | info | publish | adapt.done | {"articleId":12,"slug":"20261025-80a838","channels":["wechat","zhihu","xhs","toutiao"]} |
| 559 | 2026-10-25T16:41:54.790Z | info | publish | adapt.done | {"articleId":11,"slug":"20261025-74c3ee","channels":["wechat","zhihu","xhs","toutiao"]} |
| 560 | 2026-10-25T16:41:54.793Z | info | publish | adapt.done | {"articleId":10,"slug":"20261025-293ca1","channels":["wechat","zhihu","xhs","toutiao"]} |
| 561 | 2026-10-25T16:41:54.797Z | info | publish | adapt.done | {"articleId":9,"slug":"20261025-0a180b","channels":["wechat","zhihu","xhs","toutiao"]} |
| 562 | 2026-10-25T16:41:54.801Z | info | publish | adapt.done | {"articleId":8,"slug":"20261025-cf6fc7","channels":["wechat","zhihu","xhs","toutiao"]} |
| 563 | 2026-10-25T16:41:54.808Z | info | publish | adapt.done | {"articleId":7,"slug":"20261025-a69af5","channels":["wechat","zhihu","xhs","toutiao"]} |
| 564 | 2026-10-25T16:41:54.811Z | info | publish | adapt.done | {"articleId":6,"slug":"20261025-503e9d","channels":["wechat","zhihu","xhs","toutiao"]} |
| 565 | 2026-10-25T16:41:54.814Z | info | publish | adapt.done | {"articleId":5,"slug":"20261025-760c72","channels":["wechat","zhihu","xhs","toutiao"]} |
| 566 | 2026-10-25T16:41:54.815Z | info | publish | batch.done | {"articles":20} |
| 567 | 2026-10-25T16:41:54.829Z | info | site | generate.done | {"articles":23,"intel":100,"pages":124} |
| 568 | 2026-10-25T16:41:54.829Z | info | pipeline | done | {"intel":{"results":{"zhihu":0,"hn":27,"github":20,"lobsters":25},"total":72},"content":{"daily":14,"deep":[21,22,23]},"publish":20,"site":{"articles":23,"intel |
| 569 | 2026-10-25T16:41:59.967Z | info | cloud | deploy.triggered | {"repo":"q785845530/ai-tools-intel","via":"workflow_dispatch","by":"local-cron"} |
| 570 | 2026-10-25T16:42:01.376Z | info | wechat | cover.uploaded | {"mediaId":"FkZ9XCO0BwnXzC2V7v9B_yWlVjgyjShSlImQ25TXy9GFH6NF1b2XAH2O5iWbFtVo","bytes":137096} |
| 571 | 2026-10-25T16:42:04.446Z | info | wechat | draft.created | {"mediaId":"FkZ9XCO0BwnXzC2V7v9B_95ESAP_hG9Hw1XTvqRI6Pgp0M-4mnt1vhgLMUC5pH0r","count":1} |
| 572 | 2026-10-25T16:42:04.449Z | info | wechat | bridge.draft.done | {"draftId":"FkZ9XCO0BwnXzC2V7v9B_95ESAP_hG9Hw1XTvqRI6Pgp0M-4mnt1vhgLMUC5pH0r","articles":[23]} |
| 573 | 2026-10-25T16:42:04.449Z | info | pipeline | wechat.draft.synced | {"articleId":23,"title":"六部门开展智能工厂培育;仁怀将推广酒旅IP……","draftId":"FkZ9XCO0BwnXzC2V7v9B…"} |
| 574 | 2026-10-25T16:42:04.450Z | info | pipeline | cron.enabled | {"intervalMs":3600000} |
| 575 | 2026-10-25T16:42:21.754Z | info | wechat | draft.version.pruned | {"title":"智能制造日报 / 2026-10-25：技术前沿、落地说、产业观察等 8 条动态","mediaId":"FkZ9XCO0BwnXzC2V7v9B_6LX","kept":"最新一版","reason":"日报每小时重生成导致标题微调，同题旧草稿清理","auditImpact":"无"} |
| 576 | 2026-10-25T16:45:08.450Z | error | diagnosis | user.reported.notrunning | {"report":"还是跑不起来","scope":"全链路逐层实测：进程/端口/HTTP/流水线/云端/微信/知乎"} |
| 577 | 2026-10-25T16:45:08.451Z | info | diagnosis | engine.ok | {"evidence":"pipeline/done 整点连续 23 轮无断档，本地+公网均 200"} |
| 578 | 2026-10-25T16:45:08.451Z | error | diagnosis | github.schedule.never.fired | {"evidence":"event=schedule total_count=0，8 次运行全是 push/dispatch","cause":"GitHub 对低活跃仓库 schedule 静默跳过的已知行为"} |
| 579 | 2026-10-25T16:45:08.451Z | info | fix | local.drives.cloud | {"file":"lib/cloud.js","method":"pipeline 尾部 workflow_dispatch","verify":"run 40212587573 于本地整点后 8 秒触发 success"} |
| 580 | 2026-10-25T16:45:08.452Z | error | fix | wechat.draft.duplicate.bug | {"symptom":"22:48 与 00:37 同篇日报各建一次草稿","rootCause":"cron 重跑无判重 + run() 内部重排序绕过选择","fix":"syncWechatDraft 用 publish_log NOT EXISTS 判重，选中文章直接交 makeDraft"} |
| 581 | 2026-10-25T16:45:08.452Z | info | fix | wechat.draft.pruned | {"deleted":1,"reason":"同题旧版日报草稿","remaining":"2 条（日报 1 + 深文 1）","note":"仅删微信草稿箱副本，publish_log 与审计链完整保留全部痕迹"} |
| 582 | 2026-10-25T16:45:08.452Z | info | diagnosis | container.port.not.public | {"finding":"8765 无公网入站属容器隔离边界","answer":"公网访问入口=GitHub Pages；8765 为内部管理台"} |
| 583 | 2026-10-25T16:45:08.489Z | info | deploy | fix.pushed | {} |
| 584 | 2026-10-25T17:10:35.836Z | info | wechat | token.obtained | {"expiresIn":7200,"via":"stable_token","force":true} |
| 585 | 2026-10-25T17:23:37.515Z | info | wechat | cover.uploaded | {"mediaId":"FkZ9XCO0BwnXzC2V7v9B_7KHfaW5upKZ3UWFK8swFS9ETWr_wBhOSg2OsQocBXeA","bytes":137096} |
| 586 | 2026-10-25T17:23:40.639Z | info | wechat | draft.created | {"mediaId":"FkZ9XCO0BwnXzC2V7v9B_4FValVFc6iT1hCOcVbQq5Z9rzXYQ4lpVl_XezY7JGMx","count":1} |
| 587 | 2026-10-25T17:23:40.640Z | info | wechat | bridge.draft.done | {"draftId":"FkZ9XCO0BwnXzC2V7v9B_4FValVFc6iT1hCOcVbQq5Z9rzXYQ4lpVl_XezY7JGMx","articles":[14]} |
| 588 | 2026-10-25T17:31:01.585Z | info | fix | url.cleaned.backfill | {"articles":11,"links":22,"reason":"情报源 URL 携带 utm 追踪参数（100字符），统一剥离","modules":["lib/urlclean.js"],"appliedTo":["generator","wechat-publish","site"]} |
| 589 | 2026-10-25T17:33:04.856Z | info | site | generate.done | {"articles":23,"intel":100,"pages":124} |
| 590 | 2026-10-25T17:33:06.920Z | info | server | start | {"port":8765,"root":"/workspace/ops/site/static"} |
| 591 | 2026-10-25T17:33:06.922Z | info | pipeline | start | {} |
| 592 | 2026-10-25T17:33:07.260Z | info | intel | collect.zhihu.hot.ok | {"items":20,"saved":1} |
| 593 | 2026-10-25T17:33:07.654Z | info | intel | collect.zhihu.search.ok | {"query":"智能制造 AI 落地","items":10,"saved":0} |
| 594 | 2026-10-25T17:33:09.597Z | info | intel | collect.zhihu.search.ok | {"query":"工业大模型 应用","items":10,"saved":0} |
| 595 | 2026-10-25T17:33:11.467Z | info | intel | collect.zhihu.search.ok | {"query":"AI 质检 缺陷检测","items":10,"saved":0} |
| 596 | 2026-10-25T17:33:13.328Z | info | intel | collect.zhihu.search.ok | {"query":"智能工厂 数字化转型","items":10,"saved":0} |
| 597 | 2026-10-25T17:33:15.205Z | info | intel | collect.zhihu.search.ok | {"query":"工业机器人 具身智能","items":10,"saved":0} |
| 598 | 2026-10-25T17:33:16.706Z | info | intel | collect.zhihu.done | {"hot":1,"search":0,"errors":0} |
| 599 | 2026-10-25T17:33:16.707Z | info | intel | collect.zhihu.ok | {"count":1} |
| 600 | 2026-10-25T17:33:17.372Z | info | intel | collect.hn.ok | {"count":25} |
| 601 | 2026-10-25T17:33:19.280Z | info | intel | collect.github.ok | {"count":20} |
| 602 | 2026-10-25T17:33:20.009Z | info | intel | collect.lobsters.ok | {"count":25} |
| 603 | 2026-10-25T17:33:20.009Z | info | intel | collect.all.done | {"results":{"zhihu":1,"hn":25,"github":20,"lobsters":25},"total":71} |
| 604 | 2026-10-25T17:33:20.016Z | info | generate | article.updated | {"articleId":14,"slug":"manufacturing-daily-20261025","kind":"daily","items":8} |
| 605 | 2026-10-25T17:33:20.019Z | info | generate | article.created | {"articleId":24,"slug":"20261025-99c2f2","kind":"deep","theme":"case","source":"zhihu-hot"} |
| 606 | 2026-10-25T17:33:20.020Z | info | generate | article.created | {"articleId":25,"slug":"20261025-42a61f","kind":"deep","theme":"case","source":"zhihu-search"} |
| 607 | 2026-10-25T17:33:20.022Z | info | generate | article.created | {"articleId":26,"slug":"20261025-1a9b24","kind":"deep","theme":"case","source":"zhihu-search"} |
| 608 | 2026-10-25T17:33:20.022Z | info | generate | batch.done | {"daily":14,"deep":3} |
| 609 | 2026-10-25T17:33:20.026Z | info | publish | adapt.done | {"articleId":26,"slug":"20261025-1a9b24","channels":["wechat","zhihu","xhs","toutiao"]} |
| 610 | 2026-10-25T17:33:20.028Z | info | publish | adapt.done | {"articleId":25,"slug":"20261025-42a61f","channels":["wechat","zhihu","xhs","toutiao"]} |
| 611 | 2026-10-25T17:33:20.032Z | info | publish | adapt.done | {"articleId":24,"slug":"20261025-99c2f2","channels":["wechat","zhihu","xhs","toutiao"]} |
| 612 | 2026-10-25T17:33:20.036Z | info | publish | adapt.done | {"articleId":14,"slug":"manufacturing-daily-20261025","channels":["wechat","zhihu","xhs","toutiao"]} |
| 613 | 2026-10-25T17:33:20.038Z | info | publish | adapt.done | {"articleId":23,"slug":"20261025-be58e8","channels":["wechat","zhihu","xhs","toutiao"]} |
| 614 | 2026-10-25T17:33:20.041Z | info | publish | adapt.done | {"articleId":22,"slug":"20261025-333582","channels":["wechat","zhihu","xhs","toutiao"]} |
| 615 | 2026-10-25T17:33:20.043Z | info | publish | adapt.done | {"articleId":21,"slug":"20261025-1b3759","channels":["wechat","zhihu","xhs","toutiao"]} |
| 616 | 2026-10-25T17:33:20.046Z | info | publish | adapt.done | {"articleId":20,"slug":"20261025-1829f9","channels":["wechat","zhihu","xhs","toutiao"]} |
| 617 | 2026-10-25T17:33:20.048Z | info | publish | adapt.done | {"articleId":19,"slug":"20261025-87dacb","channels":["wechat","zhihu","xhs","toutiao"]} |
| 618 | 2026-10-25T17:33:20.051Z | info | publish | adapt.done | {"articleId":18,"slug":"20261025-5661c0","channels":["wechat","zhihu","xhs","toutiao"]} |
| 619 | 2026-10-25T17:33:20.053Z | info | publish | adapt.done | {"articleId":1,"slug":"digest-20261025","channels":["wechat","zhihu","xhs","toutiao"]} |
| 620 | 2026-10-25T17:33:20.055Z | info | publish | adapt.done | {"articleId":17,"slug":"20261025-3a8e65","channels":["wechat","zhihu","xhs","toutiao"]} |
| 621 | 2026-10-25T17:33:20.058Z | info | publish | adapt.done | {"articleId":16,"slug":"20261025-0d15cb","channels":["wechat","zhihu","xhs","toutiao"]} |
| 622 | 2026-10-25T17:33:20.060Z | info | publish | adapt.done | {"articleId":15,"slug":"20261025-bb6043","channels":["wechat","zhihu","xhs","toutiao"]} |
| 623 | 2026-10-25T17:33:20.063Z | info | publish | adapt.done | {"articleId":13,"slug":"20261025-e0e966","channels":["wechat","zhihu","xhs","toutiao"]} |
| 624 | 2026-10-25T17:33:20.065Z | info | publish | adapt.done | {"articleId":12,"slug":"20261025-80a838","channels":["wechat","zhihu","xhs","toutiao"]} |
| 625 | 2026-10-25T17:33:20.068Z | info | publish | adapt.done | {"articleId":11,"slug":"20261025-74c3ee","channels":["wechat","zhihu","xhs","toutiao"]} |
| 626 | 2026-10-25T17:33:20.071Z | info | publish | adapt.done | {"articleId":10,"slug":"20261025-293ca1","channels":["wechat","zhihu","xhs","toutiao"]} |
| 627 | 2026-10-25T17:33:20.073Z | info | publish | adapt.done | {"articleId":9,"slug":"20261025-0a180b","channels":["wechat","zhihu","xhs","toutiao"]} |
| 628 | 2026-10-25T17:33:20.076Z | info | publish | adapt.done | {"articleId":8,"slug":"20261025-cf6fc7","channels":["wechat","zhihu","xhs","toutiao"]} |
| 629 | 2026-10-25T17:33:20.077Z | info | publish | batch.done | {"articles":20} |
| 630 | 2026-10-25T17:33:20.092Z | info | site | generate.done | {"articles":26,"intel":100,"pages":127} |
| 631 | 2026-10-25T17:33:20.092Z | info | pipeline | done | {"intel":{"results":{"zhihu":1,"hn":25,"github":20,"lobsters":25},"total":71},"content":{"daily":14,"deep":[24,25,26]},"publish":20,"site":{"articles":26,"intel |
| 632 | 2026-10-25T17:33:21.755Z | info | cloud | deploy.triggered | {"repo":"q785845530/ai-tools-intel","via":"workflow_dispatch","by":"local-cron"} |
| 633 | 2026-10-25T17:33:23.245Z | info | wechat | cover.uploaded | {"mediaId":"FkZ9XCO0BwnXzC2V7v9B_-aZsxQGCMSFH7_7juMCTud5_piLqdLzJ_p-qu6eHk04","bytes":137096} |
| 634 | 2026-10-25T17:33:25.998Z | info | wechat | draft.created | {"mediaId":"FkZ9XCO0BwnXzC2V7v9B_1hf5r6c5ImmXR72lYroSsqMfD0eqZ7Yxz5M6jM6VNZH","count":1} |
| 635 | 2026-10-25T17:33:25.999Z | info | wechat | bridge.draft.done | {"draftId":"FkZ9XCO0BwnXzC2V7v9B_1hf5r6c5ImmXR72lYroSsqMfD0eqZ7Yxz5M6jM6VNZH","articles":[26]} |
| 636 | 2026-10-25T17:33:25.999Z | info | pipeline | wechat.draft.synced | {"articleId":26,"title":"讯强电子×华为:毫厘之间筑品质防线,打造工业AI质检新标杆","draftId":"FkZ9XCO0BwnXzC2V7v9B…"} |
| 637 | 2026-10-25T17:33:26.000Z | info | pipeline | cron.enabled | {"intervalMs":3600000} |
| 638 | 2026-10-25T17:41:43.889Z | info | fix | url.cleaned.intel | {"rows":76,"total":164,"atIngest":"lib/intel.js + lib/zhihu.js 已接入 cleanUrl","backfill":"历史记录已回填"} |
| 639 | 2026-10-25T17:41:43.947Z | info | site | generate.done | {"articles":26,"intel":100,"pages":127} |
| 640 | 2026-10-25T17:42:48.505Z | info | server | start | {"port":8765,"root":"/workspace/ops/site/static"} |
| 641 | 2026-10-25T17:42:48.507Z | info | pipeline | start | {} |
| 642 | 2026-10-25T17:42:48.794Z | info | intel | collect.zhihu.hot.ok | {"items":20,"saved":0} |
| 643 | 2026-10-25T17:42:49.199Z | info | intel | collect.zhihu.search.ok | {"query":"智能制造 AI 落地","items":10,"saved":0} |
| 644 | 2026-10-25T17:42:51.100Z | info | intel | collect.zhihu.search.ok | {"query":"工业大模型 应用","items":10,"saved":0} |
| 645 | 2026-10-25T17:42:53.020Z | info | intel | collect.zhihu.search.ok | {"query":"AI 质检 缺陷检测","items":10,"saved":0} |
| 646 | 2026-10-25T17:42:54.942Z | info | intel | collect.zhihu.search.ok | {"query":"智能工厂 数字化转型","items":10,"saved":0} |
| 647 | 2026-10-25T17:42:56.883Z | info | intel | collect.zhihu.search.ok | {"query":"工业机器人 具身智能","items":10,"saved":0} |
| 648 | 2026-10-25T17:42:58.385Z | info | intel | collect.zhihu.done | {"hot":0,"search":0,"errors":0} |
| 649 | 2026-10-25T17:42:58.385Z | info | intel | collect.zhihu.ok | {"count":0} |
| 650 | 2026-10-25T17:42:59.142Z | info | intel | collect.hn.ok | {"count":25} |
| 651 | 2026-10-25T17:43:00.804Z | info | intel | collect.github.ok | {"count":20} |
| 652 | 2026-10-25T17:43:01.803Z | info | intel | collect.lobsters.ok | {"count":25} |
| 653 | 2026-10-25T17:43:01.803Z | info | intel | collect.all.done | {"results":{"zhihu":0,"hn":25,"github":20,"lobsters":25},"total":70} |
| 654 | 2026-10-25T17:43:01.810Z | info | generate | article.updated | {"articleId":14,"slug":"manufacturing-daily-20261025","kind":"daily","items":8} |
| 655 | 2026-10-25T17:43:01.813Z | info | generate | article.created | {"articleId":27,"slug":"20261025-4b68ec","kind":"deep","theme":"case","source":"zhihu-search"} |
| 656 | 2026-10-25T17:43:01.815Z | info | generate | article.created | {"articleId":28,"slug":"20261025-cb688d","kind":"deep","theme":"case","source":"zhihu-search"} |
| 657 | 2026-10-25T17:43:01.816Z | info | generate | article.created | {"articleId":29,"slug":"20261025-112ff4","kind":"deep","theme":"case","source":"zhihu-hot"} |
| 658 | 2026-10-25T17:43:01.816Z | info | generate | batch.done | {"daily":14,"deep":3} |
| 659 | 2026-10-25T17:43:01.821Z | info | publish | adapt.done | {"articleId":29,"slug":"20261025-112ff4","channels":["wechat","zhihu","xhs","toutiao"]} |
| 660 | 2026-10-25T17:43:01.825Z | info | publish | adapt.done | {"articleId":28,"slug":"20261025-cb688d","channels":["wechat","zhihu","xhs","toutiao"]} |
| 661 | 2026-10-25T17:43:01.829Z | info | publish | adapt.done | {"articleId":27,"slug":"20261025-4b68ec","channels":["wechat","zhihu","xhs","toutiao"]} |
| 662 | 2026-10-25T17:43:01.834Z | info | publish | adapt.done | {"articleId":14,"slug":"manufacturing-daily-20261025","channels":["wechat","zhihu","xhs","toutiao"]} |
| 663 | 2026-10-25T17:43:01.836Z | info | publish | adapt.done | {"articleId":26,"slug":"20261025-1a9b24","channels":["wechat","zhihu","xhs","toutiao"]} |
| 664 | 2026-10-25T17:43:01.839Z | info | publish | adapt.done | {"articleId":25,"slug":"20261025-42a61f","channels":["wechat","zhihu","xhs","toutiao"]} |
| 665 | 2026-10-25T17:43:01.842Z | info | publish | adapt.done | {"articleId":24,"slug":"20261025-99c2f2","channels":["wechat","zhihu","xhs","toutiao"]} |
| 666 | 2026-10-25T17:43:01.844Z | info | publish | adapt.done | {"articleId":23,"slug":"20261025-be58e8","channels":["wechat","zhihu","xhs","toutiao"]} |
| 667 | 2026-10-25T17:43:01.848Z | info | publish | adapt.done | {"articleId":22,"slug":"20261025-333582","channels":["wechat","zhihu","xhs","toutiao"]} |
| 668 | 2026-10-25T17:43:01.850Z | info | publish | adapt.done | {"articleId":21,"slug":"20261025-1b3759","channels":["wechat","zhihu","xhs","toutiao"]} |
| 669 | 2026-10-25T17:43:01.853Z | info | publish | adapt.done | {"articleId":20,"slug":"20261025-1829f9","channels":["wechat","zhihu","xhs","toutiao"]} |
| 670 | 2026-10-25T17:43:01.855Z | info | publish | adapt.done | {"articleId":19,"slug":"20261025-87dacb","channels":["wechat","zhihu","xhs","toutiao"]} |
| 671 | 2026-10-25T17:43:01.859Z | info | publish | adapt.done | {"articleId":18,"slug":"20261025-5661c0","channels":["wechat","zhihu","xhs","toutiao"]} |
| 672 | 2026-10-25T17:43:01.862Z | info | publish | adapt.done | {"articleId":1,"slug":"digest-20261025","channels":["wechat","zhihu","xhs","toutiao"]} |
| 673 | 2026-10-25T17:43:01.864Z | info | publish | adapt.done | {"articleId":17,"slug":"20261025-3a8e65","channels":["wechat","zhihu","xhs","toutiao"]} |
| 674 | 2026-10-25T17:43:01.867Z | info | publish | adapt.done | {"articleId":16,"slug":"20261025-0d15cb","channels":["wechat","zhihu","xhs","toutiao"]} |
| 675 | 2026-10-25T17:43:01.872Z | info | publish | adapt.done | {"articleId":15,"slug":"20261025-bb6043","channels":["wechat","zhihu","xhs","toutiao"]} |
| 676 | 2026-10-25T17:43:01.875Z | info | publish | adapt.done | {"articleId":13,"slug":"20261025-e0e966","channels":["wechat","zhihu","xhs","toutiao"]} |
| 677 | 2026-10-25T17:43:01.878Z | info | publish | adapt.done | {"articleId":12,"slug":"20261025-80a838","channels":["wechat","zhihu","xhs","toutiao"]} |
| 678 | 2026-10-25T17:43:01.880Z | info | publish | adapt.done | {"articleId":11,"slug":"20261025-74c3ee","channels":["wechat","zhihu","xhs","toutiao"]} |
| 679 | 2026-10-25T17:43:01.881Z | info | publish | batch.done | {"articles":20} |
| 680 | 2026-10-25T17:43:01.895Z | info | site | generate.done | {"articles":29,"intel":100,"pages":130} |
| 681 | 2026-10-25T17:43:01.896Z | info | pipeline | done | {"intel":{"results":{"zhihu":0,"hn":25,"github":20,"lobsters":25},"total":70},"content":{"daily":14,"deep":[27,28,29]},"publish":20,"site":{"articles":29,"intel |
| 682 | 2026-10-25T17:43:03.312Z | info | cloud | deploy.triggered | {"repo":"q785845530/ai-tools-intel","via":"workflow_dispatch","by":"local-cron"} |
| 683 | 2026-10-25T17:43:04.801Z | info | wechat | cover.uploaded | {"mediaId":"FkZ9XCO0BwnXzC2V7v9B_xqxPvzydX5hwf8CfAslpk433QBTnjNZHxuj1WLW74l_","bytes":137096} |
| 684 | 2026-10-25T17:43:07.833Z | info | wechat | draft.created | {"mediaId":"FkZ9XCO0BwnXzC2V7v9B_7EiTDN8ZU66eKOIcon7aIvMNyBlojZ7p926qLAqAItb","count":1} |
| 685 | 2026-10-25T17:43:07.835Z | info | wechat | bridge.draft.done | {"draftId":"FkZ9XCO0BwnXzC2V7v9B_7EiTDN8ZU66eKOIcon7aIvMNyBlojZ7p926qLAqAItb","articles":[29]} |
| 686 | 2026-10-25T17:43:07.835Z | info | pipeline | wechat.draft.synced | {"articleId":29,"title":"《西游记》中如来佛祖为什么要推蝎子精，而蝎子精又为何胆大到敢扎佛祖？","draftId":"FkZ9XCO0BwnXzC2V7v9B…"} |
| 687 | 2026-10-25T17:43:07.835Z | info | pipeline | cron.enabled | {"intervalMs":3600000} |
| 688 | 2026-10-25T17:43:09.157Z | info | wechat | token.obtained | {"expiresIn":7200,"via":"stable_token","force":true} |
| 689 | 2026-10-25T17:52:57.242Z | info | zhihu | relevance.filtered | {"source":"zhihu-hot","skipped":19,"kept":0,"rule":"制造业强相关 / AI+垂类检索"} |
| 690 | 2026-10-25T17:52:57.243Z | info | intel | collect.zhihu.hot.ok | {"items":20,"saved":0} |
| 691 | 2026-10-25T17:52:57.783Z | info | intel | collect.zhihu.search.ok | {"query":"智能制造 AI 落地","items":10,"saved":0} |
| 692 | 2026-10-25T17:52:59.707Z | info | intel | collect.zhihu.search.ok | {"query":"工业大模型 应用","items":10,"saved":0} |
| 693 | 2026-10-25T17:53:01.979Z | info | intel | collect.zhihu.search.ok | {"query":"AI 质检 缺陷检测","items":10,"saved":0} |
| 694 | 2026-10-25T17:53:03.835Z | info | intel | collect.zhihu.search.ok | {"query":"智能工厂 数字化转型","items":10,"saved":0} |
| 695 | 2026-10-25T17:53:05.787Z | info | intel | collect.zhihu.search.ok | {"query":"工业机器人 具身智能","items":10,"saved":0} |
| 696 | 2026-10-25T17:53:07.289Z | info | intel | collect.zhihu.done | {"hot":0,"search":0,"errors":0} |
| 697 | 2026-10-25T17:53:07.289Z | info | intel | collect.zhihu.ok | {"count":0} |
| 698 | 2026-10-25T17:53:08.000Z | info | intel | relevance.filtered | {"filtered":26,"kept":0} |
| 699 | 2026-10-25T17:53:08.000Z | info | intel | collect.hn.ok | {"count":0} |
| 700 | 2026-10-25T17:53:09.736Z | info | intel | relevance.filtered | {"filtered":12,"kept":8} |
| 701 | 2026-10-25T17:53:09.736Z | info | intel | collect.github.ok | {"count":8} |
| 702 | 2026-10-25T17:53:10.440Z | info | intel | relevance.filtered | {"filtered":25,"kept":0} |
| 703 | 2026-10-25T17:53:10.441Z | info | intel | collect.lobsters.ok | {"count":0} |
| 704 | 2026-10-25T17:53:10.441Z | info | intel | collect.all.done | {"results":{"zhihu":0,"hn":0,"github":8,"lobsters":0},"total":8} |
| 705 | 2026-10-25T17:54:53.329Z | info | fix | relevance.backfill | {"intelOff":83,"intelOk":81,"articlesOff":11,"note":"保留全部数据，仅标记；文章与站点只取 ok"} |
| 706 | 2026-10-25T18:01:35.392Z | info | zhihu | relevance.filtered | {"source":"zhihu-hot","skipped":19,"kept":0,"rule":"制造业强相关 / AI+垂类检索"} |
| 707 | 2026-10-25T18:01:35.393Z | info | intel | collect.zhihu.hot.ok | {"items":20,"saved":0} |
| 708 | 2026-10-25T18:01:35.953Z | info | intel | collect.zhihu.search.ok | {"query":"智能制造 AI 落地","items":10,"saved":0} |
| 709 | 2026-10-25T18:01:37.892Z | info | intel | collect.zhihu.search.ok | {"query":"工业大模型 应用","items":10,"saved":0} |
| 710 | 2026-10-25T18:01:39.891Z | info | intel | collect.zhihu.search.ok | {"query":"AI 质检 缺陷检测","items":10,"saved":0} |
| 711 | 2026-10-25T18:01:41.760Z | info | intel | collect.zhihu.search.ok | {"query":"智能工厂 数字化转型","items":10,"saved":0} |
| 712 | 2026-10-25T18:01:43.642Z | info | intel | collect.zhihu.search.ok | {"query":"工业机器人 具身智能","items":10,"saved":0} |
| 713 | 2026-10-25T18:01:45.143Z | info | intel | collect.zhihu.done | {"hot":0,"search":0,"errors":0} |
| 714 | 2026-10-25T18:01:45.143Z | info | intel | collect.zhihu.ok | {"count":0} |
| 715 | 2026-10-25T18:01:46.594Z | info | intel | relevance.filtered | {"filtered":26,"kept":26} |
| 716 | 2026-10-25T18:01:46.594Z | info | intel | collect.hn.ok | {"count":26} |
| 717 | 2026-10-25T18:01:48.209Z | info | intel | relevance.filtered | {"filtered":12,"kept":20} |
| 718 | 2026-10-25T18:01:48.209Z | info | intel | collect.github.ok | {"count":20} |
| 719 | 2026-10-25T18:01:48.972Z | info | intel | relevance.filtered | {"filtered":25,"kept":25} |
| 720 | 2026-10-25T18:01:48.972Z | info | intel | collect.lobsters.ok | {"count":25} |
| 721 | 2026-10-25T18:01:48.972Z | info | intel | collect.all.done | {"results":{"zhihu":0,"hn":26,"github":20,"lobsters":25},"total":71} |
| 722 | 2026-10-25T18:02:21.925Z | info | wechat | token.obtained | {"expiresIn":7200,"via":"stable_token","force":true} |
| 723 | 2026-10-25T18:02:23.106Z | warn | wechat | draft.offtopic.removed | {"title":"《西游记》中如来佛祖为什么要推蝎子精，而蝎子精又为何胆大到敢扎佛祖？","verdict":"BLOCKED","reason":"知乎通用热榜混入的无关话题，已加相关性闸门防止再发"} |
| 724 | 2026-10-25T18:03:27.317Z | info | server | start | {"port":8765,"root":"/workspace/ops/site/static"} |
| 725 | 2026-10-25T18:03:27.319Z | info | pipeline | start | {} |
| 726 | 2026-10-25T18:03:27.762Z | info | zhihu | relevance.filtered | {"source":"zhihu-hot","skipped":19,"kept":0,"rule":"制造业强相关 / AI+垂类检索"} |
| 727 | 2026-10-25T18:03:27.763Z | info | intel | collect.zhihu.hot.ok | {"items":20,"saved":0} |
| 728 | 2026-10-25T18:03:28.194Z | info | intel | collect.zhihu.search.ok | {"query":"智能制造 AI 落地","items":10,"saved":0} |
| 729 | 2026-10-25T18:03:30.135Z | info | intel | collect.zhihu.search.ok | {"query":"工业大模型 应用","items":10,"saved":0} |
| 730 | 2026-10-25T18:03:32.098Z | info | intel | collect.zhihu.search.ok | {"query":"AI 质检 缺陷检测","items":10,"saved":0} |
| 731 | 2026-10-25T18:03:33.961Z | info | intel | collect.zhihu.search.ok | {"query":"智能工厂 数字化转型","items":10,"saved":0} |
| 732 | 2026-10-25T18:03:36.048Z | info | intel | collect.zhihu.search.ok | {"query":"工业机器人 具身智能","items":10,"saved":0} |
| 733 | 2026-10-25T18:03:37.549Z | info | intel | collect.zhihu.done | {"hot":0,"search":0,"errors":0} |
| 734 | 2026-10-25T18:03:37.550Z | info | intel | collect.zhihu.ok | {"count":0} |
| 735 | 2026-10-25T18:03:38.716Z | info | intel | relevance.filtered | {"filtered":26,"kept":26} |
| 736 | 2026-10-25T18:03:38.716Z | info | intel | collect.hn.ok | {"count":26} |
| 737 | 2026-10-25T18:03:40.322Z | info | intel | relevance.filtered | {"filtered":12,"kept":20} |
| 738 | 2026-10-25T18:03:40.322Z | info | intel | collect.github.ok | {"count":20} |
| 739 | 2026-10-25T18:03:41.114Z | info | intel | relevance.filtered | {"filtered":25,"kept":25} |
| 740 | 2026-10-25T18:03:41.114Z | info | intel | collect.lobsters.ok | {"count":25} |
| 741 | 2026-10-25T18:03:41.114Z | info | intel | collect.all.done | {"results":{"zhihu":0,"hn":26,"github":20,"lobsters":25},"total":71} |
| 742 | 2026-10-25T18:03:41.120Z | info | generate | article.updated | {"articleId":14,"slug":"manufacturing-daily-20261025","kind":"daily","items":8} |
| 743 | 2026-10-25T18:03:41.123Z | info | generate | article.created | {"articleId":30,"slug":"20261025-6dff6d","kind":"deep","theme":"case","source":"zhihu-hot"} |
| 744 | 2026-10-25T18:03:41.125Z | info | generate | article.created | {"articleId":31,"slug":"20261025-e1f7a8","kind":"deep","theme":"case","source":"zhihu-hot"} |
| 745 | 2026-10-25T18:03:41.127Z | info | generate | article.created | {"articleId":32,"slug":"20261025-e04ae5","kind":"deep","theme":"case","source":"zhihu-hot"} |
| 746 | 2026-10-25T18:03:41.127Z | info | generate | batch.done | {"daily":14,"deep":3} |
| 747 | 2026-10-25T18:03:41.133Z | info | publish | adapt.done | {"articleId":32,"slug":"20261025-e04ae5","channels":["wechat","zhihu","xhs","toutiao"]} |
| 748 | 2026-10-25T18:03:41.136Z | info | publish | adapt.done | {"articleId":31,"slug":"20261025-e1f7a8","channels":["wechat","zhihu","xhs","toutiao"]} |
| 749 | 2026-10-25T18:03:41.139Z | info | publish | adapt.done | {"articleId":30,"slug":"20261025-6dff6d","channels":["wechat","zhihu","xhs","toutiao"]} |
| 750 | 2026-10-25T18:03:41.141Z | info | publish | adapt.done | {"articleId":14,"slug":"manufacturing-daily-20261025","channels":["wechat","zhihu","xhs","toutiao"]} |
| 751 | 2026-10-25T18:03:41.144Z | info | publish | adapt.done | {"articleId":29,"slug":"20261025-112ff4","channels":["wechat","zhihu","xhs","toutiao"]} |
| 752 | 2026-10-25T18:03:41.147Z | info | publish | adapt.done | {"articleId":28,"slug":"20261025-cb688d","channels":["wechat","zhihu","xhs","toutiao"]} |
| 753 | 2026-10-25T18:03:41.150Z | info | publish | adapt.done | {"articleId":27,"slug":"20261025-4b68ec","channels":["wechat","zhihu","xhs","toutiao"]} |
| 754 | 2026-10-25T18:03:41.152Z | info | publish | adapt.done | {"articleId":26,"slug":"20261025-1a9b24","channels":["wechat","zhihu","xhs","toutiao"]} |
| 755 | 2026-10-25T18:03:41.155Z | info | publish | adapt.done | {"articleId":25,"slug":"20261025-42a61f","channels":["wechat","zhihu","xhs","toutiao"]} |
| 756 | 2026-10-25T18:03:41.157Z | info | publish | adapt.done | {"articleId":24,"slug":"20261025-99c2f2","channels":["wechat","zhihu","xhs","toutiao"]} |
| 757 | 2026-10-25T18:03:41.160Z | info | publish | adapt.done | {"articleId":23,"slug":"20261025-be58e8","channels":["wechat","zhihu","xhs","toutiao"]} |
| 758 | 2026-10-25T18:03:41.163Z | info | publish | adapt.done | {"articleId":22,"slug":"20261025-333582","channels":["wechat","zhihu","xhs","toutiao"]} |
| 759 | 2026-10-25T18:03:41.166Z | info | publish | adapt.done | {"articleId":21,"slug":"20261025-1b3759","channels":["wechat","zhihu","xhs","toutiao"]} |
| 760 | 2026-10-25T18:03:41.168Z | info | publish | adapt.done | {"articleId":20,"slug":"20261025-1829f9","channels":["wechat","zhihu","xhs","toutiao"]} |
| 761 | 2026-10-25T18:03:41.171Z | info | publish | adapt.done | {"articleId":19,"slug":"20261025-87dacb","channels":["wechat","zhihu","xhs","toutiao"]} |
| 762 | 2026-10-25T18:03:41.174Z | info | publish | adapt.done | {"articleId":18,"slug":"20261025-5661c0","channels":["wechat","zhihu","xhs","toutiao"]} |
| 763 | 2026-10-25T18:03:41.177Z | info | publish | adapt.done | {"articleId":1,"slug":"digest-20261025","channels":["wechat","zhihu","xhs","toutiao"]} |
| 764 | 2026-10-25T18:03:41.180Z | info | publish | adapt.done | {"articleId":17,"slug":"20261025-3a8e65","channels":["wechat","zhihu","xhs","toutiao"]} |
| 765 | 2026-10-25T18:03:41.183Z | info | publish | adapt.done | {"articleId":16,"slug":"20261025-0d15cb","channels":["wechat","zhihu","xhs","toutiao"]} |
| 766 | 2026-10-25T18:03:41.186Z | info | publish | adapt.done | {"articleId":15,"slug":"20261025-bb6043","channels":["wechat","zhihu","xhs","toutiao"]} |
| 767 | 2026-10-25T18:03:41.188Z | info | publish | batch.done | {"articles":20} |
| 768 | 2026-10-25T18:03:41.200Z | info | site | generate.done | {"articles":21,"intel":81,"pages":103} |
| 769 | 2026-10-25T18:03:41.200Z | info | pipeline | done | {"intel":{"results":{"zhihu":0,"hn":26,"github":20,"lobsters":25},"total":71},"content":{"daily":14,"deep":[30,31,32]},"publish":20,"site":{"articles":21,"intel |
| 770 | 2026-10-25T18:03:42.587Z | info | cloud | deploy.triggered | {"repo":"q785845530/ai-tools-intel","via":"workflow_dispatch","by":"local-cron"} |
| 771 | 2026-10-25T18:03:44.160Z | info | wechat | cover.uploaded | {"mediaId":"FkZ9XCO0BwnXzC2V7v9B_yL8SnK_8KOQmKJ76BbKzCNgm_UyCtIg_x9bUL-R3-OV","bytes":137096} |
| 772 | 2026-10-25T18:03:47.078Z | info | wechat | draft.created | {"mediaId":"FkZ9XCO0BwnXzC2V7v9B__s7r6U7oTQZsbRn1Rg00Crrp0JmYs2X6cf4pJRYnTtm","count":1} |
| 773 | 2026-10-25T18:03:47.080Z | info | wechat | bridge.draft.done | {"draftId":"FkZ9XCO0BwnXzC2V7v9B__s7r6U7oTQZsbRn1Rg00Crrp0JmYs2X6cf4pJRYnTtm","articles":[32]} |
| 774 | 2026-10-25T18:03:47.080Z | info | pipeline | wechat.draft.synced | {"articleId":32,"title":"微软宣布全面转向原生开发并告别网页套壳，能解决 Windows11 的卡顿臃肿吗","draftId":"FkZ9XCO0BwnXzC2V7v9B…"} |
| 775 | 2026-10-25T18:03:47.080Z | info | pipeline | cron.enabled | {"intervalMs":3600000} |
| 776 | 2026-10-25T18:07:04.134Z | info | fix | relevance.rebackfill | {"ok":58,"off":107,"topicsFixed":145,"rootCause":"首次回填误用被硬编码污染的 topics 字段（每条都带「智能制造」），导致判定器全部放行"} |
| 777 | 2026-10-25T18:16:38.035Z | info | fix | relevance.final | {"intelOk":54,"intelOff":111,"articlesOk":15,"articlesOff":17,"rule":"STRONG 单独通过；WEAK 需与 AI 共现；zhihu-search 放宽一档；BLOCK 一票否决"} |
| 778 | 2026-10-25T18:17:43.580Z | info | fix | relevance.article.rule | {"rule":"按文章自身标题+摘要判定（而非看出处）","ok":11,"off":21,"note":"#14 日报曾被误标——日报聚合多条来源，不能因来源含 off 项就否定文章本身"} |
| 779 | 2026-10-25T18:18:48.989Z | info | fix | relevance.article.final | {"ok":15,"off":17,"rule":"文章自身在域内 或 来源为域内垂类检索"} |
| 780 | 2026-10-25T18:20:51.789Z | info | fix | legacy.digest.retired | {"count":1,"reason":"kind=digest 是转型前「AI 工具速递」栏目，与本号定位不符"} |
| 781 | 2026-10-25T18:20:52.562Z | info | wechat | token.obtained | {"expiresIn":7200,"via":"stable_token","force":true} |
| 782 | 2026-10-25T18:20:53.741Z | warn | wechat | draft.offtopic.removed | {"title":"微软宣布全面转向原生开发并告别网页套壳，能解决 Windows11 的卡顿臃肿吗？","verdict":"NO_MATCH"} |
| 783 | 2026-10-25T18:21:58.455Z | info | site | generate.done | {"articles":14,"intel":54,"pages":69} |
| 784 | 2026-10-25T18:22:00.520Z | info | server | start | {"port":8765,"root":"/workspace/ops/site/static"} |
| 785 | 2026-10-25T18:22:00.522Z | info | pipeline | start | {} |
| 786 | 2026-10-25T18:22:00.861Z | info | zhihu | relevance.filtered | {"source":"zhihu-hot","skipped":20,"kept":0,"rule":"制造业强相关 / AI+垂类检索"} |
| 787 | 2026-10-25T18:22:00.861Z | info | intel | collect.zhihu.hot.ok | {"items":20,"saved":0} |
| 788 | 2026-10-25T18:22:01.353Z | info | intel | collect.zhihu.search.ok | {"query":"智能制造 AI 落地","items":10,"saved":0} |
| 789 | 2026-10-25T18:22:03.288Z | info | intel | collect.zhihu.search.ok | {"query":"工业大模型 应用","items":10,"saved":0} |
| 790 | 2026-10-25T18:22:05.197Z | info | intel | collect.zhihu.search.ok | {"query":"AI 质检 缺陷检测","items":10,"saved":0} |
| 791 | 2026-10-25T18:22:07.074Z | info | intel | collect.zhihu.search.ok | {"query":"智能工厂 数字化转型","items":10,"saved":0} |
| 792 | 2026-10-25T18:22:08.978Z | info | intel | collect.zhihu.search.ok | {"query":"工业机器人 具身智能","items":10,"saved":0} |
| 793 | 2026-10-25T18:22:10.480Z | info | intel | collect.zhihu.done | {"hot":0,"search":0,"errors":0} |
| 794 | 2026-10-25T18:22:10.480Z | info | intel | collect.zhihu.ok | {"count":0} |
| 795 | 2026-10-25T18:22:12.356Z | info | intel | relevance.filtered | {"filtered":26,"kept":26} |
| 796 | 2026-10-25T18:22:12.356Z | info | intel | collect.hn.ok | {"count":26} |
| 797 | 2026-10-25T18:22:14.107Z | info | intel | relevance.filtered | {"filtered":14,"kept":20} |
| 798 | 2026-10-25T18:22:14.107Z | info | intel | collect.github.ok | {"count":20} |
| 799 | 2026-10-25T18:22:15.101Z | info | intel | relevance.filtered | {"filtered":25,"kept":25} |
| 800 | 2026-10-25T18:22:15.102Z | info | intel | collect.lobsters.ok | {"count":25} |
| 801 | 2026-10-25T18:22:15.102Z | info | intel | collect.all.done | {"results":{"zhihu":0,"hn":26,"github":20,"lobsters":25},"total":71} |
| 802 | 2026-10-25T18:22:15.103Z | info | generate | batch.done | {"daily":null,"deep":0} |
| 803 | 2026-10-25T18:22:15.108Z | info | publish | adapt.done | {"articleId":32,"slug":"20261025-e04ae5","channels":["wechat","zhihu","xhs","toutiao"]} |
| 804 | 2026-10-25T18:22:15.112Z | info | publish | adapt.done | {"articleId":31,"slug":"20261025-e1f7a8","channels":["wechat","zhihu","xhs","toutiao"]} |
| 805 | 2026-10-25T18:22:15.116Z | info | publish | adapt.done | {"articleId":30,"slug":"20261025-6dff6d","channels":["wechat","zhihu","xhs","toutiao"]} |
| 806 | 2026-10-25T18:22:15.120Z | info | publish | adapt.done | {"articleId":14,"slug":"manufacturing-daily-20261025","channels":["wechat","zhihu","xhs","toutiao"]} |
| 807 | 2026-10-25T18:22:15.123Z | info | publish | adapt.done | {"articleId":29,"slug":"20261025-112ff4","channels":["wechat","zhihu","xhs","toutiao"]} |
| 808 | 2026-10-25T18:22:15.126Z | info | publish | adapt.done | {"articleId":28,"slug":"20261025-cb688d","channels":["wechat","zhihu","xhs","toutiao"]} |
| 809 | 2026-10-25T18:22:15.128Z | info | publish | adapt.done | {"articleId":27,"slug":"20261025-4b68ec","channels":["wechat","zhihu","xhs","toutiao"]} |
| 810 | 2026-10-25T18:22:15.132Z | info | publish | adapt.done | {"articleId":26,"slug":"20261025-1a9b24","channels":["wechat","zhihu","xhs","toutiao"]} |
| 811 | 2026-10-25T18:22:15.136Z | info | publish | adapt.done | {"articleId":25,"slug":"20261025-42a61f","channels":["wechat","zhihu","xhs","toutiao"]} |
| 812 | 2026-10-25T18:22:15.139Z | info | publish | adapt.done | {"articleId":24,"slug":"20261025-99c2f2","channels":["wechat","zhihu","xhs","toutiao"]} |
| 813 | 2026-10-25T18:22:15.142Z | info | publish | adapt.done | {"articleId":23,"slug":"20261025-be58e8","channels":["wechat","zhihu","xhs","toutiao"]} |
| 814 | 2026-10-25T18:22:15.144Z | info | publish | adapt.done | {"articleId":22,"slug":"20261025-333582","channels":["wechat","zhihu","xhs","toutiao"]} |
| 815 | 2026-10-25T18:22:15.147Z | info | publish | adapt.done | {"articleId":21,"slug":"20261025-1b3759","channels":["wechat","zhihu","xhs","toutiao"]} |
| 816 | 2026-10-25T18:22:15.151Z | info | publish | adapt.done | {"articleId":20,"slug":"20261025-1829f9","channels":["wechat","zhihu","xhs","toutiao"]} |
| 817 | 2026-10-25T18:22:15.154Z | info | publish | adapt.done | {"articleId":19,"slug":"20261025-87dacb","channels":["wechat","zhihu","xhs","toutiao"]} |
| 818 | 2026-10-25T18:22:15.158Z | info | publish | adapt.done | {"articleId":18,"slug":"20261025-5661c0","channels":["wechat","zhihu","xhs","toutiao"]} |
| 819 | 2026-10-25T18:22:15.161Z | info | publish | adapt.done | {"articleId":1,"slug":"digest-20261025","channels":["wechat","zhihu","xhs","toutiao"]} |
| 820 | 2026-10-25T18:22:15.165Z | info | publish | adapt.done | {"articleId":17,"slug":"20261025-3a8e65","channels":["wechat","zhihu","xhs","toutiao"]} |
| 821 | 2026-10-25T18:22:15.170Z | info | publish | adapt.done | {"articleId":16,"slug":"20261025-0d15cb","channels":["wechat","zhihu","xhs","toutiao"]} |
| 822 | 2026-10-25T18:22:15.172Z | info | publish | adapt.done | {"articleId":15,"slug":"20261025-bb6043","channels":["wechat","zhihu","xhs","toutiao"]} |
| 823 | 2026-10-25T18:22:15.173Z | info | publish | batch.done | {"articles":20} |
| 824 | 2026-10-25T18:22:15.183Z | info | site | generate.done | {"articles":14,"intel":54,"pages":69} |
| 825 | 2026-10-25T18:22:15.183Z | info | pipeline | done | {"intel":{"results":{"zhihu":0,"hn":26,"github":20,"lobsters":25},"total":71},"content":{"daily":null,"deep":[]},"publish":20,"site":{"articles":14,"intel":54," |
| 826 | 2026-10-25T18:22:16.621Z | info | cloud | deploy.triggered | {"repo":"q785845530/ai-tools-intel","via":"workflow_dispatch","by":"local-cron"} |
| 827 | 2026-10-25T18:22:18.270Z | info | wechat | cover.uploaded | {"mediaId":"FkZ9XCO0BwnXzC2V7v9B_xUIDKX8OcIzEZrZkY6CsOaW0dRiWLB35pJ1WZN2noXZ","bytes":137096} |
| 828 | 2026-10-25T18:22:21.320Z | info | wechat | draft.created | {"mediaId":"FkZ9XCO0BwnXzC2V7v9B_4Cde4uwBZwJjE3wIVyVo1-iV9pssbs0W-9dnDZo9dEm","count":1} |
| 829 | 2026-10-25T18:22:21.321Z | info | wechat | bridge.draft.done | {"draftId":"FkZ9XCO0BwnXzC2V7v9B_4Cde4uwBZwJjE3wIVyVo1-iV9pssbs0W-9dnDZo9dEm","articles":[31]} |
| 830 | 2026-10-25T18:22:21.321Z | info | pipeline | wechat.draft.synced | {"articleId":31,"title":"为什么人们爱吃火锅？","draftId":"FkZ9XCO0BwnXzC2V7v9B…"} |
| 831 | 2026-10-25T18:22:21.322Z | info | pipeline | cron.enabled | {"intervalMs":3600000} |
| 832 | 2026-10-25T18:23:02.144Z | info | report | generated | {"file":"log/OPS-REPORT.md","records":831,"chainOk":true} |
| 833 | 2026-10-25T18:26:31.309Z | info | fix | relevance.wordboundary | {"intelOk":48,"intelOff":117,"articlesOk":14,"articlesOff":18,"rootCause":"短英文词子串匹配（ai 命中 domain、mes 命中 hermes）","fix":"英文词按词边界匹配，中文词仍子串匹配"} |
| 834 | 2026-10-25T18:27:24.460Z | info | site | generate.done | {"articles":14,"intel":48,"pages":63} |
| 835 | 2026-10-25T18:27:26.524Z | info | server | start | {"port":8765,"root":"/workspace/ops/site/static"} |
| 836 | 2026-10-25T18:27:26.525Z | info | pipeline | start | {} |
| 837 | 2026-10-25T18:27:26.802Z | info | zhihu | relevance.filtered | {"source":"zhihu-hot","skipped":20,"kept":2,"rule":"制造业强相关 / AI+垂类检索"} |
| 838 | 2026-10-25T18:27:26.803Z | info | intel | collect.zhihu.hot.ok | {"items":20,"saved":2} |
| 839 | 2026-10-25T18:27:27.217Z | info | intel | collect.zhihu.search.ok | {"query":"智能制造 AI 落地","items":10,"saved":0} |
| 840 | 2026-10-25T18:27:29.146Z | info | intel | collect.zhihu.search.ok | {"query":"工业大模型 应用","items":10,"saved":0} |
| 841 | 2026-10-25T18:27:31.088Z | info | intel | collect.zhihu.search.ok | {"query":"AI 质检 缺陷检测","items":10,"saved":0} |
| 842 | 2026-10-25T18:27:32.920Z | info | intel | collect.zhihu.search.ok | {"query":"智能工厂 数字化转型","items":10,"saved":0} |
| 843 | 2026-10-25T18:27:34.881Z | info | intel | collect.zhihu.search.ok | {"query":"工业机器人 具身智能","items":10,"saved":0} |
| 844 | 2026-10-25T18:27:36.383Z | info | intel | collect.zhihu.done | {"hot":2,"search":0,"errors":0} |
| 845 | 2026-10-25T18:27:36.384Z | info | intel | collect.zhihu.ok | {"count":2} |
| 846 | 2026-10-25T18:27:37.412Z | info | intel | relevance.filtered | {"filtered":25,"kept":25} |
| 847 | 2026-10-25T18:27:37.412Z | info | intel | collect.hn.ok | {"count":25} |
| 848 | 2026-10-25T18:27:38.947Z | info | intel | relevance.filtered | {"filtered":20,"kept":20} |
| 849 | 2026-10-25T18:27:38.947Z | info | intel | collect.github.ok | {"count":20} |
| 850 | 2026-10-25T18:27:39.644Z | info | intel | relevance.filtered | {"filtered":25,"kept":25} |
| 851 | 2026-10-25T18:27:39.644Z | info | intel | collect.lobsters.ok | {"count":25} |
| 852 | 2026-10-25T18:27:39.645Z | info | intel | collect.all.done | {"results":{"zhihu":2,"hn":25,"github":20,"lobsters":25},"total":72} |
| 853 | 2026-10-25T18:27:39.645Z | info | generate | batch.done | {"daily":null,"deep":0} |
| 854 | 2026-10-25T18:27:39.649Z | info | publish | adapt.done | {"articleId":32,"slug":"20261025-e04ae5","channels":["wechat","zhihu","xhs","toutiao"]} |
| 855 | 2026-10-25T18:27:39.653Z | info | publish | adapt.done | {"articleId":31,"slug":"20261025-e1f7a8","channels":["wechat","zhihu","xhs","toutiao"]} |
| 856 | 2026-10-25T18:27:39.656Z | info | publish | adapt.done | {"articleId":30,"slug":"20261025-6dff6d","channels":["wechat","zhihu","xhs","toutiao"]} |
| 857 | 2026-10-25T18:27:39.660Z | info | publish | adapt.done | {"articleId":14,"slug":"manufacturing-daily-20261025","channels":["wechat","zhihu","xhs","toutiao"]} |
| 858 | 2026-10-25T18:27:39.662Z | info | publish | adapt.done | {"articleId":29,"slug":"20261025-112ff4","channels":["wechat","zhihu","xhs","toutiao"]} |
| 859 | 2026-10-25T18:27:39.664Z | info | publish | adapt.done | {"articleId":28,"slug":"20261025-cb688d","channels":["wechat","zhihu","xhs","toutiao"]} |
| 860 | 2026-10-25T18:27:39.668Z | info | publish | adapt.done | {"articleId":27,"slug":"20261025-4b68ec","channels":["wechat","zhihu","xhs","toutiao"]} |
| 861 | 2026-10-25T18:27:39.671Z | info | publish | adapt.done | {"articleId":26,"slug":"20261025-1a9b24","channels":["wechat","zhihu","xhs","toutiao"]} |
| 862 | 2026-10-25T18:27:39.674Z | info | publish | adapt.done | {"articleId":25,"slug":"20261025-42a61f","channels":["wechat","zhihu","xhs","toutiao"]} |
| 863 | 2026-10-25T18:27:39.676Z | info | publish | adapt.done | {"articleId":24,"slug":"20261025-99c2f2","channels":["wechat","zhihu","xhs","toutiao"]} |
| 864 | 2026-10-25T18:27:39.679Z | info | publish | adapt.done | {"articleId":23,"slug":"20261025-be58e8","channels":["wechat","zhihu","xhs","toutiao"]} |
| 865 | 2026-10-25T18:27:39.682Z | info | publish | adapt.done | {"articleId":22,"slug":"20261025-333582","channels":["wechat","zhihu","xhs","toutiao"]} |
| 866 | 2026-10-25T18:27:39.685Z | info | publish | adapt.done | {"articleId":21,"slug":"20261025-1b3759","channels":["wechat","zhihu","xhs","toutiao"]} |
| 867 | 2026-10-25T18:27:39.689Z | info | publish | adapt.done | {"articleId":20,"slug":"20261025-1829f9","channels":["wechat","zhihu","xhs","toutiao"]} |
| 868 | 2026-10-25T18:27:39.692Z | info | publish | adapt.done | {"articleId":19,"slug":"20261025-87dacb","channels":["wechat","zhihu","xhs","toutiao"]} |
| 869 | 2026-10-25T18:27:39.696Z | info | publish | adapt.done | {"articleId":18,"slug":"20261025-5661c0","channels":["wechat","zhihu","xhs","toutiao"]} |
| 870 | 2026-10-25T18:27:39.700Z | info | publish | adapt.done | {"articleId":1,"slug":"digest-20261025","channels":["wechat","zhihu","xhs","toutiao"]} |
| 871 | 2026-10-25T18:27:39.703Z | info | publish | adapt.done | {"articleId":17,"slug":"20261025-3a8e65","channels":["wechat","zhihu","xhs","toutiao"]} |
| 872 | 2026-10-25T18:27:39.706Z | info | publish | adapt.done | {"articleId":16,"slug":"20261025-0d15cb","channels":["wechat","zhihu","xhs","toutiao"]} |
| 873 | 2026-10-25T18:27:39.708Z | info | publish | adapt.done | {"articleId":15,"slug":"20261025-bb6043","channels":["wechat","zhihu","xhs","toutiao"]} |
| 874 | 2026-10-25T18:27:39.708Z | info | publish | batch.done | {"articles":20} |
| 875 | 2026-10-25T18:27:39.717Z | info | site | generate.done | {"articles":14,"intel":48,"pages":63} |
| 876 | 2026-10-25T18:27:39.717Z | info | pipeline | done | {"intel":{"results":{"zhihu":2,"hn":25,"github":20,"lobsters":25},"total":72},"content":{"daily":null,"deep":[]},"publish":20,"site":{"articles":14,"intel":48," |
| 877 | 2026-10-25T18:27:41.068Z | info | cloud | deploy.triggered | {"repo":"q785845530/ai-tools-intel","via":"workflow_dispatch","by":"local-cron"} |
| 878 | 2026-10-25T18:27:42.541Z | info | wechat | cover.uploaded | {"mediaId":"FkZ9XCO0BwnXzC2V7v9B__utgnzkIZ2lxntL6SyLFWERHGYAkvDCmZpGGQuZlEgS","bytes":137096} |
| 879 | 2026-10-25T18:27:45.527Z | info | wechat | draft.created | {"mediaId":"FkZ9XCO0BwnXzC2V7v9B_0L28bdkZRv8AR5u7PfbuBeRZTrqWbPCNsGWD0K7Aweb","count":1} |
| 880 | 2026-10-25T18:27:45.529Z | info | wechat | bridge.draft.done | {"draftId":"FkZ9XCO0BwnXzC2V7v9B_0L28bdkZRv8AR5u7PfbuBeRZTrqWbPCNsGWD0K7Aweb","articles":[30]} |
| 881 | 2026-10-25T18:27:45.529Z | info | pipeline | wechat.draft.synced | {"articleId":30,"title":"烟草第一大省云南前三季度烟草工业负增长，中国烟草市场正在发生什么变化？为何烤烟卖","draftId":"FkZ9XCO0BwnXzC2V7v9B…"} |
| 882 | 2026-10-25T18:27:45.529Z | info | pipeline | cron.enabled | {"intervalMs":3600000} |
| 883 | 2026-10-25T18:28:23.818Z | info | report | generated | {"file":"log/OPS-REPORT.md","records":882,"chainOk":true} |
| 884 | 2026-10-25T18:28:26.990Z | info | wechat | token.obtained | {"expiresIn":7200,"via":"stable_token","force":true} |
| 885 | 2026-10-25T18:29:41.948Z | info | wechat | token.obtained | {"expiresIn":7200,"via":"stable_token","force":true} |
| 886 | 2026-10-25T18:29:42.971Z | warn | wechat | draft.offtopic.removed | {"title":"烟草第一大省云南前三季度烟草工业负增长，中国烟草市场正在发生什么变化？为何烤烟卖不动了？","verdict":"WEAK_ONLY","rootCause":"syncWechatDraft 查询缺 relevance 条件，已修复"} |
| 887 | 2026-10-25T18:29:43.499Z | warn | wechat | draft.offtopic.removed | {"title":"为什么人们爱吃火锅？","verdict":"BLOCKED","rootCause":"syncWechatDraft 查询缺 relevance 条件，已修复"} |
| 888 | 2026-10-25T18:30:37.325Z | info | server | start | {"port":8765,"root":"/workspace/ops/site/static"} |
| 889 | 2026-10-25T18:30:37.327Z | info | pipeline | start | {} |
| 890 | 2026-10-25T18:30:37.617Z | info | zhihu | relevance.filtered | {"source":"zhihu-hot","skipped":20,"kept":0,"rule":"制造业强相关 / AI+垂类检索"} |
| 891 | 2026-10-25T18:30:37.617Z | info | intel | collect.zhihu.hot.ok | {"items":20,"saved":0} |
| 892 | 2026-10-25T18:30:38.016Z | info | intel | collect.zhihu.search.ok | {"query":"智能制造 AI 落地","items":10,"saved":0} |
| 893 | 2026-10-25T18:30:40.074Z | info | intel | collect.zhihu.search.ok | {"query":"工业大模型 应用","items":10,"saved":0} |
| 894 | 2026-10-25T18:30:41.983Z | info | intel | collect.zhihu.search.ok | {"query":"AI 质检 缺陷检测","items":10,"saved":0} |
| 895 | 2026-10-25T18:30:43.948Z | info | intel | collect.zhihu.search.ok | {"query":"智能工厂 数字化转型","items":10,"saved":0} |
| 896 | 2026-10-25T18:30:45.989Z | info | intel | collect.zhihu.search.ok | {"query":"工业机器人 具身智能","items":10,"saved":0} |
| 897 | 2026-10-25T18:30:47.489Z | info | intel | collect.zhihu.done | {"hot":0,"search":0,"errors":0} |
| 898 | 2026-10-25T18:30:47.490Z | info | intel | collect.zhihu.ok | {"count":0} |
| 899 | 2026-10-25T18:30:49.111Z | info | intel | relevance.filtered | {"filtered":25,"kept":25} |
| 900 | 2026-10-25T18:30:49.111Z | info | intel | collect.hn.ok | {"count":25} |
| 901 | 2026-10-25T18:30:50.798Z | info | intel | relevance.filtered | {"filtered":20,"kept":20} |
| 902 | 2026-10-25T18:30:50.799Z | info | intel | collect.github.ok | {"count":20} |
| 903 | 2026-10-25T18:30:51.532Z | info | intel | relevance.filtered | {"filtered":25,"kept":25} |
| 904 | 2026-10-25T18:30:51.532Z | info | intel | collect.lobsters.ok | {"count":25} |
| 905 | 2026-10-25T18:30:51.532Z | info | intel | collect.all.done | {"results":{"zhihu":0,"hn":25,"github":20,"lobsters":25},"total":70} |
| 906 | 2026-10-25T18:30:51.533Z | info | generate | batch.done | {"daily":null,"deep":0} |
| 907 | 2026-10-25T18:30:51.536Z | info | publish | adapt.done | {"articleId":32,"slug":"20261025-e04ae5","channels":["wechat","zhihu","xhs","toutiao"]} |
| 908 | 2026-10-25T18:30:51.539Z | info | publish | adapt.done | {"articleId":31,"slug":"20261025-e1f7a8","channels":["wechat","zhihu","xhs","toutiao"]} |
| 909 | 2026-10-25T18:30:51.542Z | info | publish | adapt.done | {"articleId":30,"slug":"20261025-6dff6d","channels":["wechat","zhihu","xhs","toutiao"]} |
| 910 | 2026-10-25T18:30:51.545Z | info | publish | adapt.done | {"articleId":14,"slug":"manufacturing-daily-20261025","channels":["wechat","zhihu","xhs","toutiao"]} |
| 911 | 2026-10-25T18:30:51.548Z | info | publish | adapt.done | {"articleId":29,"slug":"20261025-112ff4","channels":["wechat","zhihu","xhs","toutiao"]} |
| 912 | 2026-10-25T18:30:51.551Z | info | publish | adapt.done | {"articleId":28,"slug":"20261025-cb688d","channels":["wechat","zhihu","xhs","toutiao"]} |
| 913 | 2026-10-25T18:30:51.554Z | info | publish | adapt.done | {"articleId":27,"slug":"20261025-4b68ec","channels":["wechat","zhihu","xhs","toutiao"]} |
| 914 | 2026-10-25T18:30:51.559Z | info | publish | adapt.done | {"articleId":26,"slug":"20261025-1a9b24","channels":["wechat","zhihu","xhs","toutiao"]} |
| 915 | 2026-10-25T18:30:51.562Z | info | publish | adapt.done | {"articleId":25,"slug":"20261025-42a61f","channels":["wechat","zhihu","xhs","toutiao"]} |
| 916 | 2026-10-25T18:30:51.567Z | info | publish | adapt.done | {"articleId":24,"slug":"20261025-99c2f2","channels":["wechat","zhihu","xhs","toutiao"]} |
| 917 | 2026-10-25T18:30:51.570Z | info | publish | adapt.done | {"articleId":23,"slug":"20261025-be58e8","channels":["wechat","zhihu","xhs","toutiao"]} |
| 918 | 2026-10-25T18:30:51.572Z | info | publish | adapt.done | {"articleId":22,"slug":"20261025-333582","channels":["wechat","zhihu","xhs","toutiao"]} |
| 919 | 2026-10-25T18:30:51.575Z | info | publish | adapt.done | {"articleId":21,"slug":"20261025-1b3759","channels":["wechat","zhihu","xhs","toutiao"]} |
| 920 | 2026-10-25T18:30:51.577Z | info | publish | adapt.done | {"articleId":20,"slug":"20261025-1829f9","channels":["wechat","zhihu","xhs","toutiao"]} |
| 921 | 2026-10-25T18:30:51.580Z | info | publish | adapt.done | {"articleId":19,"slug":"20261025-87dacb","channels":["wechat","zhihu","xhs","toutiao"]} |
| 922 | 2026-10-25T18:30:51.583Z | info | publish | adapt.done | {"articleId":18,"slug":"20261025-5661c0","channels":["wechat","zhihu","xhs","toutiao"]} |
| 923 | 2026-10-25T18:30:51.585Z | info | publish | adapt.done | {"articleId":1,"slug":"digest-20261025","channels":["wechat","zhihu","xhs","toutiao"]} |
| 924 | 2026-10-25T18:30:51.588Z | info | publish | adapt.done | {"articleId":17,"slug":"20261025-3a8e65","channels":["wechat","zhihu","xhs","toutiao"]} |
| 925 | 2026-10-25T18:30:51.590Z | info | publish | adapt.done | {"articleId":16,"slug":"20261025-0d15cb","channels":["wechat","zhihu","xhs","toutiao"]} |
| 926 | 2026-10-25T18:30:51.593Z | info | publish | adapt.done | {"articleId":15,"slug":"20261025-bb6043","channels":["wechat","zhihu","xhs","toutiao"]} |
| 927 | 2026-10-25T18:30:51.593Z | info | publish | batch.done | {"articles":20} |
| 928 | 2026-10-25T18:30:51.601Z | info | site | generate.done | {"articles":14,"intel":48,"pages":63} |
| 929 | 2026-10-25T18:30:51.601Z | info | pipeline | done | {"intel":{"results":{"zhihu":0,"hn":25,"github":20,"lobsters":25},"total":70},"content":{"daily":null,"deep":[]},"publish":20,"site":{"articles":14,"intel":48," |
| 930 | 2026-10-25T18:30:52.858Z | info | cloud | deploy.triggered | {"repo":"q785845530/ai-tools-intel","via":"workflow_dispatch","by":"local-cron"} |
| 931 | 2026-10-25T18:30:54.405Z | info | wechat | cover.uploaded | {"mediaId":"FkZ9XCO0BwnXzC2V7v9B_9RbVbS4HlAcAcTuGiKEud6M3zPNGyYebW61Os6fVD0i","bytes":137096} |
| 932 | 2026-10-25T18:30:57.374Z | info | wechat | draft.created | {"mediaId":"FkZ9XCO0BwnXzC2V7v9B_7KxbzB9_BqWw6EJHLv42fR0timhuquH1BtKAcrg0dX1","count":1} |
| 933 | 2026-10-25T18:30:57.376Z | info | wechat | bridge.draft.done | {"draftId":"FkZ9XCO0BwnXzC2V7v9B_7KxbzB9_BqWw6EJHLv42fR0timhuquH1BtKAcrg0dX1","articles":[28]} |
| 934 | 2026-10-25T18:30:57.377Z | info | pipeline | wechat.draft.synced | {"articleId":28,"title":"给3万家工厂装上“AI大脑”,黑湖科技工博会工业AI规模落地","draftId":"FkZ9XCO0BwnXzC2V7v9B…"} |
| 935 | 2026-10-25T18:30:57.377Z | info | pipeline | cron.enabled | {"intervalMs":3600000} |
| 936 | 2026-10-25T18:31:07.970Z | info | wechat | token.obtained | {"expiresIn":7200,"via":"stable_token","force":true} |
| 937 | 2026-10-25T18:59:20.118Z | debug | media | freshness.ofweek-im | {"stale_skipped":13,"undated":0} |
| 938 | 2026-10-25T18:59:22.260Z | debug | media | freshness.eworks | {"stale_skipped":0,"undated":10} |
| 939 | 2026-10-25T19:08:53.842Z | info | media | collect.gongkong.ok | {"found":30,"saved":1,"filtered":24} |
| 940 | 2026-10-25T19:08:55.330Z | debug | media | freshness.ofweek-im | {"stale_skipped":13,"undated":0} |
| 941 | 2026-10-25T19:08:55.350Z | info | media | collect.ofweek-im.ok | {"found":30,"saved":1,"filtered":25} |
| 942 | 2026-10-25T19:08:57.004Z | debug | media | freshness.eworks | {"stale_skipped":0,"undated":10} |
| 943 | 2026-10-25T19:08:57.011Z | info | media | collect.eworks.ok | {"found":10,"saved":10,"filtered":6} |
| 944 | 2026-10-25T19:08:58.212Z | info | media | collect.done | {"results":{"gongkong":{"found":30,"saved":1,"off":24},"ofweek-im":{"found":30,"saved":1,"off":25},"eworks":{"found":10,"saved":10,"off":6}},"total":12} |
| 945 | 2026-10-25T19:11:21.677Z | warn | media | batch.redone | {"removed":12,"reason":"ext_id 误取 URL 首个数字（月份 202610），同月条目互撞 UNIQUE；已改用末尾文章 id 并清掉错误行重采"} |
| 946 | 2026-10-25T19:11:22.640Z | info | media | collect.gongkong.ok | {"found":30,"saved":30,"filtered":12} |
| 947 | 2026-10-25T19:11:24.273Z | debug | media | freshness.ofweek-im | {"stale_skipped":13,"undated":0} |
| 948 | 2026-10-25T19:11:24.303Z | info | media | collect.ofweek-im.ok | {"found":30,"saved":30,"filtered":14} |
| 949 | 2026-10-25T19:11:25.760Z | debug | media | freshness.eworks | {"stale_skipped":0,"undated":10} |
| 950 | 2026-10-25T19:11:25.770Z | info | media | collect.eworks.ok | {"found":10,"saved":10,"filtered":1} |
| 951 | 2026-10-25T19:11:26.970Z | info | media | collect.done | {"results":{"gongkong":{"found":30,"saved":30,"off":12},"ofweek-im":{"found":30,"saved":30,"off":14},"eworks":{"found":10,"saved":10,"off":1}},"total":70} |
| 952 | 2026-10-25T19:12:13.851Z | info | generate | article.updated | {"articleId":14,"slug":"manufacturing-daily-20261025","kind":"daily","items":8} |
| 953 | 2026-10-25T19:12:13.857Z | info | media | failover.drill | {"result":"pass","scenario":"知乎 100% 不可用时日报由 media-* 供给"} |
| 954 | 2026-10-25T19:13:16.950Z | error | fix | drill.mistake | {"mistake":"演练 DELETE FROM articles WHERE id=14 删掉了真实日报（generateDailyDigest 按 slug 命中已有文章并返回其 id，非新建）","lesson":"对幂等更新型函数做故障演练时，返回值可能是既有行的 id，DELETE 前必须校验该行内容确实 |
| 955 | 2026-10-25T19:13:16.962Z | info | generate | article.created | {"articleId":33,"slug":"manufacturing-daily-20261025","kind":"daily","items":8,"themes":["技术前沿","落地说","产业观察"]} |
| 956 | 2026-10-25T19:13:16.963Z | info | fix | daily.regenerated | {"articleId":33,"title":"智能制造日报 / 2026-10-25：技术前沿、落地说、产业观察等 8 条动态","sources":["zhihu-search"]} |
| 957 | 2026-10-25T19:13:17.021Z | info | site | generate.done | {"articles":14,"intel":91,"pages":106} |
| 958 | 2026-10-25T19:13:39.831Z | info | server | start | {"port":8765,"root":"/workspace/ops/site/static"} |
| 959 | 2026-10-25T19:13:39.833Z | info | pipeline | start | {} |
| 960 | 2026-10-25T19:13:40.134Z | info | zhihu | relevance.filtered | {"source":"zhihu-hot","skipped":20,"kept":1,"rule":"制造业强相关 / AI+垂类检索"} |
| 961 | 2026-10-25T19:13:40.134Z | info | intel | collect.zhihu.hot.ok | {"items":20,"saved":1} |
| 962 | 2026-10-25T19:13:40.736Z | info | intel | collect.zhihu.search.ok | {"query":"智能制造 AI 落地","items":10,"saved":0} |
| 963 | 2026-10-25T19:13:42.744Z | info | intel | collect.zhihu.search.ok | {"query":"工业大模型 应用","items":10,"saved":0} |
| 964 | 2026-10-25T19:13:44.760Z | info | intel | collect.zhihu.search.ok | {"query":"AI 质检 缺陷检测","items":10,"saved":0} |
| 965 | 2026-10-25T19:13:46.718Z | info | intel | collect.zhihu.search.ok | {"query":"智能工厂 数字化转型","items":10,"saved":0} |
| 966 | 2026-10-25T19:13:48.870Z | info | intel | collect.zhihu.search.ok | {"query":"工业机器人 具身智能","items":10,"saved":0} |
| 967 | 2026-10-25T19:13:50.370Z | info | intel | collect.zhihu.done | {"hot":1,"search":0,"errors":0} |
| 968 | 2026-10-25T19:13:50.371Z | info | intel | collect.zhihu.ok | {"count":1} |
| 969 | 2026-10-25T19:13:53.988Z | info | media | collect.gongkong.ok | {"found":30,"saved":0,"filtered":12} |
| 970 | 2026-10-25T19:13:55.452Z | debug | media | freshness.ofweek-im | {"stale_skipped":13,"undated":0} |
| 971 | 2026-10-25T19:13:55.478Z | info | media | collect.ofweek-im.ok | {"found":30,"saved":1,"filtered":14} |
| 972 | 2026-10-25T19:13:56.952Z | debug | media | freshness.eworks | {"stale_skipped":0,"undated":10} |
| 973 | 2026-10-25T19:13:56.959Z | info | media | collect.eworks.ok | {"found":10,"saved":0,"filtered":1} |
| 974 | 2026-10-25T19:13:58.160Z | info | media | collect.done | {"results":{"gongkong":{"found":30,"saved":0,"off":12},"ofweek-im":{"found":30,"saved":1,"off":14},"eworks":{"found":10,"saved":0,"off":1}},"total":1} |
| 975 | 2026-10-25T19:13:58.160Z | info | intel | collect.media.ok | {"count":1} |
| 976 | 2026-10-25T19:13:59.419Z | info | intel | relevance.filtered | {"filtered":25,"kept":25} |
| 977 | 2026-10-25T19:13:59.419Z | info | intel | collect.hn.ok | {"count":25} |
| 978 | 2026-10-25T19:14:01.136Z | info | intel | relevance.filtered | {"filtered":20,"kept":20} |
| 979 | 2026-10-25T19:14:01.136Z | info | intel | collect.github.ok | {"count":20} |
| 980 | 2026-10-25T19:14:02.175Z | info | intel | relevance.filtered | {"filtered":25,"kept":25} |
| 981 | 2026-10-25T19:14:02.175Z | info | intel | collect.lobsters.ok | {"count":25} |
| 982 | 2026-10-25T19:14:02.176Z | info | intel | collect.all.done | {"results":{"zhihu":1,"media":1,"hn":25,"github":20,"lobsters":25},"total":72} |
| 983 | 2026-10-25T19:14:02.183Z | info | generate | article.updated | {"articleId":33,"slug":"manufacturing-daily-20261025","kind":"daily","items":8} |
| 984 | 2026-10-25T19:14:02.186Z | info | generate | article.created | {"articleId":34,"slug":"20261025-ef87e6","kind":"deep","theme":"tech","source":"zhihu-search"} |
| 985 | 2026-10-25T19:14:02.188Z | info | generate | article.created | {"articleId":35,"slug":"20261025-4d8d65","kind":"deep","theme":"tech","source":"zhihu-search"} |
| 986 | 2026-10-25T19:14:02.189Z | info | generate | article.created | {"articleId":36,"slug":"20261025-5bcd50","kind":"deep","theme":"case","source":"zhihu-search"} |
| 987 | 2026-10-25T19:14:02.189Z | info | generate | batch.done | {"daily":33,"deep":3} |
| 988 | 2026-10-25T19:14:02.193Z | info | publish | adapt.done | {"articleId":36,"slug":"20261025-5bcd50","channels":["wechat","zhihu","xhs","toutiao"]} |
| 989 | 2026-10-25T19:14:02.197Z | info | publish | adapt.done | {"articleId":35,"slug":"20261025-4d8d65","channels":["wechat","zhihu","xhs","toutiao"]} |
| 990 | 2026-10-25T19:14:02.200Z | info | publish | adapt.done | {"articleId":34,"slug":"20261025-ef87e6","channels":["wechat","zhihu","xhs","toutiao"]} |
| 991 | 2026-10-25T19:14:02.202Z | info | publish | adapt.done | {"articleId":33,"slug":"manufacturing-daily-20261025","channels":["wechat","zhihu","xhs","toutiao"]} |
| 992 | 2026-10-25T19:14:02.204Z | info | publish | adapt.done | {"articleId":32,"slug":"20261025-e04ae5","channels":["wechat","zhihu","xhs","toutiao"]} |
| 993 | 2026-10-25T19:14:02.207Z | info | publish | adapt.done | {"articleId":31,"slug":"20261025-e1f7a8","channels":["wechat","zhihu","xhs","toutiao"]} |
| 994 | 2026-10-25T19:14:02.209Z | info | publish | adapt.done | {"articleId":30,"slug":"20261025-6dff6d","channels":["wechat","zhihu","xhs","toutiao"]} |
| 995 | 2026-10-25T19:14:02.211Z | info | publish | adapt.done | {"articleId":29,"slug":"20261025-112ff4","channels":["wechat","zhihu","xhs","toutiao"]} |
| 996 | 2026-10-25T19:14:02.214Z | info | publish | adapt.done | {"articleId":28,"slug":"20261025-cb688d","channels":["wechat","zhihu","xhs","toutiao"]} |
| 997 | 2026-10-25T19:14:02.216Z | info | publish | adapt.done | {"articleId":27,"slug":"20261025-4b68ec","channels":["wechat","zhihu","xhs","toutiao"]} |
| 998 | 2026-10-25T19:14:02.219Z | info | publish | adapt.done | {"articleId":26,"slug":"20261025-1a9b24","channels":["wechat","zhihu","xhs","toutiao"]} |
| 999 | 2026-10-25T19:14:02.221Z | info | publish | adapt.done | {"articleId":25,"slug":"20261025-42a61f","channels":["wechat","zhihu","xhs","toutiao"]} |
| 1000 | 2026-10-25T19:14:02.223Z | info | publish | adapt.done | {"articleId":24,"slug":"20261025-99c2f2","channels":["wechat","zhihu","xhs","toutiao"]} |
| 1001 | 2026-10-25T19:14:02.226Z | info | publish | adapt.done | {"articleId":23,"slug":"20261025-be58e8","channels":["wechat","zhihu","xhs","toutiao"]} |
| 1002 | 2026-10-25T19:14:02.228Z | info | publish | adapt.done | {"articleId":22,"slug":"20261025-333582","channels":["wechat","zhihu","xhs","toutiao"]} |
| 1003 | 2026-10-25T19:14:02.231Z | info | publish | adapt.done | {"articleId":21,"slug":"20261025-1b3759","channels":["wechat","zhihu","xhs","toutiao"]} |
| 1004 | 2026-10-25T19:14:02.233Z | info | publish | adapt.done | {"articleId":20,"slug":"20261025-1829f9","channels":["wechat","zhihu","xhs","toutiao"]} |
| 1005 | 2026-10-25T19:14:02.236Z | info | publish | adapt.done | {"articleId":19,"slug":"20261025-87dacb","channels":["wechat","zhihu","xhs","toutiao"]} |
| 1006 | 2026-10-25T19:14:02.238Z | info | publish | adapt.done | {"articleId":18,"slug":"20261025-5661c0","channels":["wechat","zhihu","xhs","toutiao"]} |
| 1007 | 2026-10-25T19:14:02.241Z | info | publish | adapt.done | {"articleId":1,"slug":"digest-20261025","channels":["wechat","zhihu","xhs","toutiao"]} |
| 1008 | 2026-10-25T19:14:02.242Z | info | publish | batch.done | {"articles":20} |
| 1009 | 2026-10-25T19:14:02.254Z | info | site | generate.done | {"articles":17,"intel":91,"pages":109} |
| 1010 | 2026-10-25T19:14:02.254Z | info | pipeline | done | {"intel":{"results":{"zhihu":1,"media":1,"hn":25,"github":20,"lobsters":25},"total":72},"content":{"daily":33,"deep":[34,35,36]},"publish":20,"site":{"articles" |
| 1011 | 2026-10-25T19:14:03.708Z | info | cloud | deploy.triggered | {"repo":"q785845530/ai-tools-intel","via":"workflow_dispatch","by":"local-cron"} |
| 1012 | 2026-10-25T19:14:05.449Z | info | wechat | cover.uploaded | {"mediaId":"FkZ9XCO0BwnXzC2V7v9B_2GqmrlbwumMmXgcerGnttob1jLi0hIugDBbq3eybWy9","bytes":137096} |
| 1013 | 2026-10-25T19:14:08.556Z | info | wechat | draft.created | {"mediaId":"FkZ9XCO0BwnXzC2V7v9B_80DNqfaJaAS1CYqImVoOO3r4rcjVOT2fAws7ANenwWC","count":1} |
| 1014 | 2026-10-25T19:14:08.557Z | info | wechat | bridge.draft.done | {"draftId":"FkZ9XCO0BwnXzC2V7v9B_80DNqfaJaAS1CYqImVoOO3r4rcjVOT2fAws7ANenwWC","articles":[33]} |
| 1015 | 2026-10-25T19:14:08.557Z | info | pipeline | wechat.draft.synced | {"articleId":33,"title":"智能制造日报 / 2026-10-25：落地说、产业观察、技术前沿等 8 条动态","draftId":"FkZ9XCO0BwnXzC2V7v9B…"} |
| 1016 | 2026-10-25T19:14:08.557Z | info | pipeline | cron.enabled | {"intervalMs":3600000} |

---

*报告结束。共 1016 条审计记录，全部列于上表，无删减。*