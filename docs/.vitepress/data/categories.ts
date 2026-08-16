/**
 * 全站栏目定义。导航、页脚、面包屑、相关栏目、栏目页与检查脚本都读取这里。
 */

export interface Category {
  slug: string
  path: string
  title: string
  label: string
  tagline: string
  description: string
  primaryKeyword: string
  icon: string
  pillar: boolean
  group: 'content' | 'trust' | 'utility'
  related: string[]
}

export const categories: Category[] = [
  {
    slug: 'recommend',
    path: '/recommend/',
    title: '机场推荐中心',
    label: '机场推荐',
    tagline: '按稳定、预算、性价比、新手与大流量分类精选',
    description: '2026机场推荐中心：按稳定性、便宜预算、性价比、新手入门与按量大流量等真实需求分类筛选优质机场。',
    primaryKeyword: '机场推荐中心',
    icon: 'compass',
    pillar: true,
    group: 'content',
    related: ['ranking', 'brands', 'compare', 'network', 'guides']
  },
  {
    slug: 'ranking',
    path: '/ranking/',
    title: '2026 机场排行榜',
    label: '排行榜',
    tagline: '稳定、便宜、专线机场综合评选与选型梯队',
    description: '2026机场排行榜：基于套餐价格、IEPL专线规格、节点测速证据与服务稳定性的综合评选与决策参考。',
    primaryKeyword: '机场排行榜',
    icon: 'chart',
    pillar: true,
    group: 'content',
    related: ['recommend', 'brands', 'compare', 'methodology']
  },
  {
    slug: 'brands',
    path: '/brands/',
    title: '机场品牌资料库',
    label: '品牌库',
    tagline: '16家主流机场品牌档案、套餐与节点测速证据',
    description: '收录16家主流机场品牌的官方参数、入门价格、流量规格、线路协议与2026-08-11本站节点测速截图证据。',
    primaryKeyword: '机场品牌资料库',
    icon: 'cloud',
    pillar: true,
    group: 'content',
    related: ['recommend', 'ranking', 'compare']
  },
  {
    slug: 'compare',
    path: '/compare/',
    title: '品牌对比中心',
    label: '品牌对比',
    tagline: '同价位、同流量与同场景横向真实选型对比',
    description: '机场横向对比中心：针对20元档专线、低价年付、AI场景与节点调度提供客观的同类机场对比。',
    primaryKeyword: '机场对比',
    icon: 'compare',
    pillar: false,
    group: 'content',
    related: ['brands', 'recommend', 'ranking']
  },
  {
    slug: 'clients',
    path: '/clients/',
    title: '客户端教程',
    label: '客户端',
    tagline: 'Clash、Shadowrocket、v2rayN 与 sing-box 配置指南',
    description: '客户端教程中心：提供 Clash Verge Rev、Shadowrocket 小火箭、v2rayN 等全平台客户端下载、安装与订阅导入指南。',
    primaryKeyword: '机场客户端',
    icon: 'terminal',
    pillar: true,
    group: 'content',
    related: ['guides', 'troubleshooting', 'network']
  },
  {
    slug: 'network',
    path: '/network/',
    title: '线路与协议知识',
    label: '线路知识',
    tagline: 'IEPL、IPLC 专线、BGP 中转与 VLESS 协议全解析',
    description: '线路与协议知识中心：深度解析 IEPL、IPLC 内网专线原理、中转直连差异与 VLESS、Shadowsocks 传输协议。',
    primaryKeyword: '机场线路',
    icon: 'route',
    pillar: true,
    group: 'content',
    related: ['compare', 'recommend', 'troubleshooting']
  },
  {
    slug: 'free',
    path: '/free/',
    title: '免费节点与订阅指南',
    label: '免费节点',
    tagline: '公开免费节点风险防范与付费机场对比',
    description: '免费节点与免费订阅指南：全面揭示公开免费节点与订阅的安全风险、隐私泄漏防范与付费专线机场对比。',
    primaryKeyword: '免费节点',
    icon: 'shield',
    pillar: true,
    group: 'content',
    related: ['recommend', 'guides', 'network']
  },
  {
    slug: 'ai',
    path: '/ai/',
    title: 'AI 工具机场专区',
    label: 'AI 专区',
    tagline: 'ChatGPT、Claude 与 Gemini 节点选择与访问排障',
    description: 'AI 工具机场专区：针对 ChatGPT、Claude、Gemini 的出口地区、IP 信誉要求与访问异常排障提供选型指导。',
    primaryKeyword: 'AI机场',
    icon: 'spark',
    pillar: true,
    group: 'content',
    related: ['troubleshooting', 'streaming', 'recommend']
  },
  {
    slug: 'streaming',
    path: '/streaming/',
    title: '流媒体解锁专区',
    label: '流媒体',
    tagline: 'Netflix、YouTube 4K 与 Disney+ 解锁与播放指南',
    description: '流媒体解锁专区：全面分析 Netflix 原创剧解锁、YouTube 4K 流畅播放、Disney+ 区域限制与节点选择。',
    primaryKeyword: '流媒体机场',
    icon: 'play',
    pillar: true,
    group: 'content',
    related: ['ai', 'network', 'troubleshooting']
  },
  {
    slug: 'troubleshooting',
    path: '/troubleshooting/',
    title: '故障排查中心',
    label: '故障排查',
    tagline: '节点超时、全红、订阅失败与无法连接排查指南',
    description: '机场故障排查急救中心：系统解决节点全部超时、全红 TIMEOUT、订阅导入更新失败与海外网站打不开等问题。',
    primaryKeyword: '机场故障排查',
    icon: 'wrench',
    pillar: true,
    group: 'content',
    related: ['clients', 'network', 'guides']
  },
  {
    slug: 'guides',
    path: '/guides/',
    title: '新手使用指南',
    label: '新手指南',
    tagline: '机场小白入门、选型标准、VPN 区别与避坑清单',
    description: '新手指南中心：为小白用户解释什么是机场、节点、订阅，如何选购合适机场以及 VPN、代理、加速器的核心区别。',
    primaryKeyword: '机场使用指南',
    icon: 'book',
    pillar: true,
    group: 'content',
    related: ['recommend', 'clients', 'troubleshooting']
  },
  {
    slug: 'glossary',
    path: '/glossary/',
    title: '机场术语词典',
    label: '术语词典',
    tagline: '一站查清所有代理、专线、协议与网络名词',
    description: '机场术语词典：收录 IEPL、IPLC、VLESS、订阅、节点、落地、BGP 等核心名词的大白话通俗解释。',
    primaryKeyword: '机场术语词典',
    icon: 'dictionary',
    pillar: false,
    group: 'content',
    related: ['guides', 'network']
  },
  {
    slug: 'topics',
    path: '/topics/',
    title: '机场核心专题',
    label: '专题',
    tagline: '按核心问题横向聚合的深度主题',
    description: '机场核心专题：按大流量母词、价格套餐、节点调度等核心问题横向串联的全站深度专题聚合。',
    primaryKeyword: '机场专题',
    icon: 'target',
    pillar: true,
    group: 'content',
    related: ['recommend', 'network']
  },
  {
    slug: 'articles',
    path: '/articles/',
    title: '全站文章库',
    label: '文章库',
    tagline: '按时间与分类归档的深度分析与评测长文',
    description: '机场推荐全站文章归档库，收录已发布的全部评测、教程与专题分析长文。',
    primaryKeyword: '机场文章库',
    icon: 'layers',
    pillar: false,
    group: 'content',
    related: ['recommend', 'guides']
  },
  {
    slug: 'tags',
    path: '/tags/',
    title: '标签索引',
    label: '标签',
    tagline: '按主题标签横向浏览全站内容',
    description: '机场推荐标签索引：按专线、协议、客户端、AI访问、流媒体等主题标签横向检索全站内容。',
    primaryKeyword: '机场标签索引',
    icon: 'tag',
    pillar: false,
    group: 'content',
    related: ['topics', 'articles', 'glossary']
  },
  {
    slug: 'search',
    path: '/search/',
    title: '全文搜索',
    label: '搜索',
    tagline: '在全站正式发布内容中检索',
    description: '机场推荐全文搜索页，基于 Pagefind 静态索引快速检索品牌、教程与知识。',
    primaryKeyword: '机场推荐站内搜索',
    icon: 'search',
    pillar: false,
    group: 'utility',
    related: ['brands', 'guides']
  },
  {
    slug: 'about',
    path: '/about/',
    title: '关于机场推荐',
    label: '关于我们',
    tagline: '我们是谁、立场、评测机制与原则',
    description: '关于机场推荐（jichangtuij.com）：独立透明的机场选型与评测参考平台。',
    primaryKeyword: '关于机场推荐',
    icon: 'info',
    pillar: false,
    group: 'trust',
    related: ['methodology', 'editorial-policy', 'affiliate-policy']
  },
  {
    slug: 'methodology',
    path: '/methodology/',
    title: '评测方法论',
    label: '评测方法',
    tagline: '实测样本、测速截图与四层数据分级原则',
    description: '机场推荐评测方法论：详细说明 2026-08-11 测速证据规范、数据分层原则与免责边界。',
    primaryKeyword: '机场评测方法',
    icon: 'ruler',
    pillar: false,
    group: 'trust',
    related: ['about', 'editorial-policy']
  },
  {
    slug: 'editorial-policy',
    path: '/editorial-policy/',
    title: '编辑原则',
    label: '编辑原则',
    tagline: '事实核验、不虚构排名与纠错机制',
    description: '机场推荐编辑原则：坚持厂商声明与本站实测分离，严禁伪造实测与虚假排名承诺。',
    primaryKeyword: '机场推荐编辑原则',
    icon: 'pen',
    pillar: false,
    group: 'trust',
    related: ['methodology', 'affiliate-policy']
  },
  {
    slug: 'affiliate-policy',
    path: '/affiliate-policy/',
    title: '推广披露',
    label: '推广披露',
    tagline: '推广链接声明与透明商业机制',
    description: '机场推荐推广披露说明：明确披露推广合作关系，说明佣金不影响实测证据与事实陈述。',
    primaryKeyword: '机场推广披露',
    icon: 'balance',
    pillar: false,
    group: 'trust',
    related: ['about', 'editorial-policy']
  },
  {
    slug: 'privacy',
    path: '/privacy/',
    title: '隐私政策',
    label: '隐私政策',
    tagline: '无侵入统计与用户数据保护政策',
    description: '机场推荐隐私政策：保护访问者隐私，不收集敏感个人信息。',
    primaryKeyword: '机场推荐隐私政策',
    icon: 'lock',
    pillar: false,
    group: 'trust',
    related: ['terms', 'about']
  },
  {
    slug: 'terms',
    path: '/terms/',
    title: '使用条款',
    label: '使用条款',
    tagline: '内容免责声明与合规使用提醒',
    description: '机场推荐使用条款：网络技术信息仅供学习参考，请遵守所在地法律法规。',
    primaryKeyword: '机场推荐使用条款',
    icon: 'doc',
    pillar: false,
    group: 'trust',
    related: ['privacy', 'about']
  }
]

export const categoryMap: Record<string, Category> = Object.fromEntries(
  categories.map((c) => [c.slug, c])
)

export const pillarCategories = categories.filter((c) => c.pillar)

export function categoryOf(pathname: string): Category | undefined {
  const seg = pathname.replace(/^\//, '').split('/')[0]
  return categoryMap[seg]
}
