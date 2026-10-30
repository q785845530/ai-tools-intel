// lib/relevance.js —— 内容相关性判定（账号定位：智能制造 × AI 落地）
// 背景：知乎热榜是通用热榜，会混入「西游记」「明星八卦」这类大众话题；
// HN/GitHub 也大量是通用软件话题。没有过滤就会把无关内容发到制造业账号上——
// 实测已发生一次：一篇《西游记》问答被当成「智能制造日报」的素材生成了深文。
// 判定策略：制造业强相关词命中即通过；仅命中 AI 词的需要附加工业语境。
'use strict';

// 强相关词：**单独命中即通过**（专指智能制造/工业技术，不会误伤）
const STRONG = [
  '智能制造', '智能工厂', '灯塔工厂', '黑灯工厂', '无人工厂', '柔性制造', '精益生产',
  '工业互联网', '工业软件', '工业大模型', '工业视觉', '工业机器人', '工业ai', '工业智能',
  '工业自动化', '工业质检', '工业ai质检', '数字孪生', '数字化转型', '两化融合',
  '数控', '机床', '模具', '注塑', '冲压', '焊接', '装配线', '涂装', '铸造', '锻造',
  '质检', '视觉检测', '缺陷检测', '良率', '品控', '质量管控', '产测', '预测性维护',
  '排产', '计划排程', '设备联网', '设备健康', '产线', '车间', '生产线', '产能',
  'mes', 'plc', 'scada', 'wms', 'dcs', 'cnc', 'agv', 'amr', 'iiot', 'plm',
  '晶圆', '封测', 'pcb', 'smt', '电子制造', '半导体制造', '晶圆厂',
  'smart factory', 'smart manufacturing', 'industry 4.0', 'industrial internet', 'industrial automation', 'factory automation',
  'manufacturing', 'production line', 'predictive maintenance', 'digital twin',
];

// 弱相关词：行业/领域泛词，**必须与 AI/技术词共现**才算相关
// （否则「烟草工业负增长」「斯里兰卡断电」这类会被误收）
const WEAK = [
  '制造', '工业', '工厂', '产能', '装备', '机械', '精密', '五金', '重工',
  '汽车', '整车', '零部件', '电池', '光伏', '风电', '储能', '半导体', '芯片',
  '钢铁', '化工', '石化', '水泥', '玻璃', '造纸', '纺织', '服装', '医药', '食品',
  '能源', '电力', '矿业', '冶金', '建材', '包装', '印刷', '家电', '家具', '农业',
  '供应链', '仓储', '物流', '库存', '检测', '自动化', '机器人', '传感器', '运维',
  'industrial', 'factory', 'assembly', 'machining', 'supply chain', 'warehouse',
  'semiconductor', 'photovoltaic', 'battery', 'robot',
];

// AI/技术词（与弱词共现时才起作用）
const AI_TECH = [
  '人工智能', '大模型', '机器学习', '深度学习', '神经网络', '算法', '智能体', 'agent',
  'llm', 'gpt', 'transformer', '推理', '微调', 'rag', '多模态', '机器视觉', '语音识别',
  '计算机视觉', '具身智能', 'embodied', 'ai', '算力', 'gpu', '边缘计算', 'aiot', '智能',
];

// 明确的无关话题（一票否决，优先于其它规则）
const BLOCK = [
  '西游记', '红楼梦', '三国演义', '水浒', '封神', '如来', '佛祖', '孙悟空', '唐僧',
  '火锅', '美食', '恋爱', '恋综', '相亲', '彩礼', '婆媳', '娱乐',
  '明星', '综艺', '电视剧', '电影', '八卦', '恋情', '粉丝', '偶像', '选秀',
  '小说', '言情', '武侠', '修仙', '穿越', 'history', 'celebrity', 'movie', 'drama',
  'football', 'soccer', 'basketball', 'nba', 'olympic', 'music', 'album', 'singer',
];

// 热榜专用「专指词」：只收智能制造/工业 AI 的专有名词。
// 为什么单独一张表：STRONG 里含 '车间''产能''质检''良率' 这类泛词，
// 在「计件单价」「速冻肉丸」「iPhone 裂屏」等民生新闻里同样会出现。
// 垂类检索（zhihu-search）有检索词兜底，容忍它；通用热榜（zhihu-hot）没有兜底，必须用专指词。
// 实测：271 条热榜记录中命中本表的为 0 —— 说明热榜对本账号定位基本无效，收紧后自然停用该源。
const HOT_STRICT = [
  '智能制造', '智能工厂', '灯塔工厂', '黑灯工厂', '无人工厂', '柔性制造',
  '工业互联网', '工业软件', '工业大模型', '工业视觉', '工业机器人', '工业ai',
  '工业智能', '工业自动化', '工业质检', '工业控制', '数字孪生', '两化融合',
  '数控', '机床', '模具', '注塑', '焊接', '装配线', '视觉检测', '缺陷检测',
  '预测性维护', '设备联网', '产线', '生产线', 'mes', 'plc', 'scada', 'cnc',
  'agv', 'smt', '晶圆', '封测', '半导体制造', 'plm', 'wms', 'iiot',
  '具身智能', '工业质检', '智能产线', '能源管理',
];

function norm(s) { return String(s == null ? '' : s).toLowerCase(); }

/** 关键词匹配
 *  中文词：子串匹配即可（中文无词边界概念）
 *  英文/数字词：**必须按词边界匹配**。
 *  教训：早期用子串匹配，导致 'ai' 命中「dom-ai-n」、'mes' 命中「her-mes-agent」、
 *  'plc' 命中任意含这三个字母的词 —— 大量通用 AI 仓库因此混进制造业内容池。 */
function hasKeyword(text, kw) {
  const k = norm(kw);
  if (!k) return false;
  const isAscii = /^[a-z0-9][a-z0-9 .\-_+]*$/.test(k);
  if (!isAscii) return text.includes(k);
  // 转义正则元字符，两侧要求非字母数字边界
  const esc = k.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  return new RegExp(`(?<![a-z0-9])${esc}(?![a-z0-9])`, 'i').test(text);
}

function findKeyword(text, list) {
  return list.find(k => hasKeyword(text, k));
}

/** 判定一条内容是否属于本账号定位（智能制造 × AI 落地） */
function isRelevant({ title = '', summary = '', topics = '', source = '' } = {}) {
  // 注意：zhihu 类来源的 topics 曾是被硬编码污染的字段，调用方不应传入；
  // 只有 github 的 topics（真实仓库标签）才可信。
  const text = norm(title) + ' ' + norm(summary) + ' ' + norm(topics);

  const hitBlock = findKeyword(text, BLOCK);
  if (hitBlock) return { ok: false, why: 'BLOCKED', hit: hitBlock };

  // 通用热榜（zhihu-hot）先过专指词闸门：命不中 HOT_STRICT 一律 off。
  // 不能沿用 STRONG —— 实测「车间/产能/质检」会把计件工资、速冻肉丸、iPhone 裂屏放进来。
  if (source === 'zhihu-hot') {
    const hitStrict = findKeyword(text, HOT_STRICT);
    if (hitStrict) return { ok: true, why: 'HOT_STRICT', hit: hitStrict };
    return { ok: false, why: 'HOT_NO_STRICT' };
  }

  const hitStrong = findKeyword(text, STRONG);
  if (hitStrong) return { ok: true, why: 'STRONG', hit: hitStrong };

  const hitWeak = findKeyword(text, WEAK);
  const hitAi = findKeyword(text, AI_TECH);
  if (hitWeak && hitAi) return { ok: true, why: 'WEAK+AI', hit: hitWeak + '+' + hitAi };

  // 垂类检索（zhihu-search）：结果由我方制造业检索词产生，检索词本身即是域界保证。
  // 例：「京东工业发布 JoyIndustrial…」只含泛词「工业」，但显然在域内；
  // 而「火锅」这类 NO_MATCH 仍会被拒。热榜 / HN / GitHub 不享受此放宽。
  // media-*（行业垂直媒体）同理：站点本身即制造业媒体，域界由来源保证，
  // 「7500万！科捷智能中标波兰项目」只命中弱词「智能」类语境也应放行。
  if (source === 'zhihu-search' || String(source).startsWith('media')) {
    if (hitWeak) return { ok: true, why: 'DOMAIN_WEAK', hit: hitWeak };
    if (hitAi) return { ok: true, why: 'DOMAIN_AI', hit: hitAi };
  }

  if (hitWeak) return { ok: false, why: 'WEAK_ONLY', hit: hitWeak };
  if (hitAi) return { ok: false, why: 'AI_ONLY', hit: hitAi };
  return { ok: false, why: 'NO_MATCH' };
}

/** 按实际内容推断主题标签（不再硬编码 —— 硬编码会让「西游记」也挂上「智能制造」） */
const TOPIC_RULES = [
  ['政策风向', ['政策', '规划', '指导意见', '工信部', '发改委', '六部门', '八部门', '标准', '试点', '示范', '补贴', '专项']],
  ['落地说', ['案例', '落地', '上线', '投产', '应用', '实践', '车间', '产线', '降本', '增效', '标杆', '工厂']],
  ['技术前沿', ['大模型', '算法', '视觉', '检测', '数字孪生', '具身', '机器人', '边缘', '传感', '推理', '多模态']],
  ['展会动态', ['大会', '论坛', '峰会', '博览会', '工博会', '展览', '发布', '亮相', '开幕', '收官']],
  ['产业观察', ['趋势', '为什么', '如何', '挑战', '转型', '分析', '观察', '复盘', '报告', '研究']],
];

function inferTopics({ title = '', summary = '' } = {}) {
  const text = norm(title) + ' ' + norm(summary);
  const out = [];
  for (const [name, kws] of TOPIC_RULES) {
    if (kws.some(k => text.includes(norm(k)))) out.push(name);
  }
  return out.length ? out.slice(0, 3) : ['产业观察'];
}

module.exports = { isRelevant, inferTopics, hasKeyword, findKeyword, STRONG, WEAK, AI_TECH, BLOCK, HOT_STRICT };