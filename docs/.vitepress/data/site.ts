/**
 * 机场推荐 jichangtuij.com — 全站品牌与 SEO 常量
 * 这里是品牌信息的唯一来源，修改此文件即可全站生效。
 */

export const ORIGIN = 'https://jichangtuij.com'
export const DOMAIN = 'jichangtuij.com'
export const LANG = 'zh-CN'

/** 构建时自动取当前年份，避免文案里出现写死的过期年份 */
export const CURRENT_YEAR = new Date().getFullYear()

export const brand = {
  nameZh: '机场推荐',
  nameEn: 'JichangTuij',
  domain: DOMAIN,
  origin: ORIGIN,
  lang: LANG,
  author: '机场推荐评测实验室',
  slogan:
    '从价格、流量、线路类型、客户端兼容、AI/流媒体场景与本站测试记录等维度进行整理，帮助你根据实际需求选择更适合自己的机场',
  sloganSub: '2026 机场推荐 · 持续更新',
  independence:
    '机场推荐（jichangtuij.com）是独立透明的机场评测与决策参考平台，所有品牌资料与实测证据严格分离展示。'
} as const

export const seo = {
  title: '2026 机场推荐：稳定、便宜、高性价比机场怎么选｜机场推荐',
  titleTemplate: ':title｜机场推荐',
  description:
    '2026 机场推荐：从稳定机场、便宜机场、高性价比机场、专线机场、机场排行榜、16家品牌实测档案、测速证据与客户端配置出发，从价格、流量、线路类型等多维度帮助你选择更适合自己的机场。',
  h1: '2026 机场推荐：稳定、便宜、高性价比机场怎么选',
  subtitle:
    '从价格、流量、线路类型、客户端兼容、AI/流媒体场景与本站测试记录等维度进行整理，帮助你根据实际需求选择更适合自己的机场。',
  heroTag: '2026 机场推荐 · 持续更新',
  defaultOg: '/images/og-default.png',
  twitterCard: 'summary_large_image',
  /**
   * 首页独占的主关键词。
   */
  primaryKeyword: '机场推荐'
} as const

/** 全站统一实体名称，禁止在不同页面创造互相冲突的写法 */
export const entities = [
  '机场推荐',
  'JichangTuij',
  '稳定机场',
  '便宜机场',
  '高性价比机场',
  '机场排行榜',
  '机场评测',
  '机场订阅',
  '节点',
  '线路',
  '客户端',
  'IEPL',
  'IPLC',
  'BGP',
  'Clash',
  'Shadowrocket',
  'v2rayN',
  'sing-box'
] as const

/** 内容状态机：只有 published 才会进入正式索引 */
export const CONTENT_STATUS = [
  'outline',
  'researching',
  'writing',
  'reviewing',
  'published',
  'archived'
] as const

export type ContentStatus = (typeof CONTENT_STATUS)[number]

/** 内容类型 → 页面模板 */
export const CONTENT_TYPES = [
  'recommendation',
  'tutorial',
  'troubleshooting',
  'comparison',
  'warning',
  'term',
  'guide',
  'methodology',
  'policy',
  'hub',
  'faq',
  'update'
] as const

export type ContentType = (typeof CONTENT_TYPES)[number]

/** 搜索意图 */
export const INTENTS = [
  'informational',
  'commercial',
  'transactional',
  'navigational',
  'troubleshooting'
] as const

export type Intent = (typeof INTENTS)[number]

/** 把任意站内路径规范化为带尾斜杠的绝对 URL */
export function absoluteUrl(pathname: string): string {
  if (!pathname) return `${ORIGIN}/`
  let p = pathname
  if (/^https?:\/\//i.test(p)) return p
  if (!p.startsWith('/')) p = `/${p}`
  p = p.replace(/index\.html$/, '')
  p = p.replace(/\.html$/, '/')
  if (!p.endsWith('/')) p = `${p}/`
  p = p.replace(/\/{2,}/g, '/')
  return `${ORIGIN}${p}`
}
