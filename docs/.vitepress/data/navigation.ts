/**
 * 导航与页脚结构。
 */

export interface NavItem {
  text: string
  link: string
  desc?: string
}

export interface NavGroup {
  title: string
  items: NavItem[]
}

/** 顶部主导航 */
export const primaryNav: NavItem[] = [
  { text: '机场推荐', link: '/recommend/', desc: '按需求与预算筛选' },
  { text: '排行榜', link: '/ranking/', desc: '2026综合梯队' },
  { text: '品牌库', link: '/brands/', desc: '16家品牌实测档案' },
  { text: '品牌对比', link: '/compare/', desc: '同价位横向对比' },
  { text: '客户端', link: '/clients/', desc: 'Clash / 小火箭教程' },
  { text: '线路知识', link: '/network/', desc: 'IEPL与VLESS解析' },
  { text: '故障排查', link: '/troubleshooting/', desc: '超时与无法连接急救' },
  { text: '新手指南', link: '/guides/', desc: '小白入门与避坑' }
]

/** 移动端抽屉里额外展开的次级栏目 */
export const secondaryNav: NavItem[] = [
  { text: '免费节点风险', link: '/free/' },
  { text: 'AI 工具专区', link: '/ai/' },
  { text: '流媒体解锁', link: '/streaming/' },
  { text: '术语词典', link: '/glossary/' },
  { text: '专题索引', link: '/topics/' },
  { text: '评测方法论', link: '/methodology/' },
  { text: '关于我们', link: '/about/' }
]

/** 主按钮 */
export const primaryCta: NavItem = { text: '查看机场推荐', link: '/recommend/' }

/** 页脚分组 */
export const footerGroups: NavGroup[] = [
  {
    title: '机场决策与选型',
    items: [
      { text: '机场推荐中心', link: '/recommend/' },
      { text: '稳定机场推荐', link: '/recommend/stable/' },
      { text: '便宜机场推荐', link: '/recommend/cheap/' },
      { text: '高性价比机场', link: '/recommend/value/' },
      { text: '2026 机场排行榜', link: '/ranking/' },
      { text: '机场品牌资料库', link: '/brands/' },
      { text: '品牌横向对比', link: '/compare/' }
    ]
  },
  {
    title: '客户端与配置',
    items: [
      { text: '客户端教程总览', link: '/clients/' },
      { text: 'Clash 完整教程', link: '/clients/clash/' },
      { text: 'Shadowrocket 小火箭', link: '/clients/shadowrocket/' },
      { text: 'v2rayN 使用指南', link: '/clients/v2rayn/' }
    ]
  },
  {
    title: '线路与场景知识',
    items: [
      { text: '线路与协议中心', link: '/network/' },
      { text: 'IPLC 与 IEPL 区别', link: '/network/iplc-vs-iepl/' },
      { text: 'VLESS 协议详解', link: '/network/vless/' },
      { text: 'AI 工具机场专区', link: '/ai/' },
      { text: '流媒体解锁专区', link: '/streaming/' },
      { text: '免费节点与风险', link: '/free/' }
    ]
  },
  {
    title: '新手与问题排查',
    items: [
      { text: '新手使用指南', link: '/guides/' },
      { text: '机场是什么小白科普', link: '/guides/beginner/' },
      { text: '机场怎么选避坑指南', link: '/guides/how-to-choose/' },
      { text: '国外网站打不开排查', link: '/guides/foreign-websites-inaccessible/' },
      { text: 'VPN与机场有什么区别', link: '/guides/vpn-vs-airport/' },
      { text: '故障排查急救中心', link: '/troubleshooting/' },
      { text: '机场术语词典', link: '/glossary/' }
    ]
  },
  {
    title: '平台政策与披露',
    items: [
      { text: '关于机场推荐', link: '/about/' },
      { text: '评测方法论', link: '/methodology/' },
      { text: '编辑原则', link: '/editorial-policy/' },
      { text: '推广披露', link: '/affiliate-policy/' },
      { text: '文章归档', link: '/articles/' },
      { text: '标签索引', link: '/tags/' },
      { text: '隐私政策', link: '/privacy/' },
      { text: '使用条款', link: '/terms/' },
      { text: '站内全文搜索', link: '/search/' }
    ]
  }
]

/** 首页「六大核心决策卡片」（对应总指令第七节要求） */
export interface DecisionCard {
  title: string
  icon: string
  tagline: string
  desc: string
  link: string
  linkText: string
}

export const decisionCards: DecisionCard[] = [
  {
    title: '稳定优先',
    icon: 'shield',
    tagline: 'IEPL 内网专线 · 晚高峰抗拥堵',
    desc: '适合工作依赖、外贸办公、对网络抖动与丢包零容忍的用户。',
    link: '/recommend/stable/',
    linkText: '查看稳定机场推荐'
  },
  {
    title: '预算优先',
    icon: 'coin',
    tagline: '低至 7-8 元 · 平价实用',
    desc: '适合轻度浏览、偶尔查资料或寻求高性价比年付/平价月付的用户。',
    link: '/recommend/cheap/',
    linkText: '查看便宜机场推荐'
  },
  {
    title: '性价比',
    icon: 'target',
    tagline: '15-20 元档 · 流量与专线平衡',
    desc: '兼顾 100-150GB 月流量与 VLESS+IEPL 专线，综合体验最佳区间。',
    link: '/recommend/value/',
    linkText: '查看性价比机场'
  },
  {
    title: 'AI工具',
    icon: 'spark',
    tagline: 'ChatGPT / Claude / Gemini 优化',
    desc: '针对原生出口 IP、会话保持与 AI 平台高频风控提供节点选型思路。',
    link: '/ai/airport/',
    linkText: '查看 AI 机场推荐'
  },
  {
    title: '流媒体',
    icon: 'play',
    tagline: 'Netflix 4K · YouTube · Disney+',
    desc: '大带宽冗余、原生地区内容库解锁与多设备大屏流畅播放支持。',
    link: '/streaming/airport/',
    linkText: '查看流媒体机场'
  },
  {
    title: '新手使用',
    icon: 'book',
    tagline: '零基础小白 · 一键导入 · 避坑指南',
    desc: '从什么是机场、节点与订阅讲起，手把手带你完成首次配置。',
    link: '/recommend/beginner/',
    linkText: '查看新手机场推荐'
  }
]
