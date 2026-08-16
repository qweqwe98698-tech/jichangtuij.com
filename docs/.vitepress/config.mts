import { defineConfig, type HeadConfig } from 'vitepress'
import fs from 'node:fs'
import path from 'node:path'
import crypto from 'node:crypto'
import { fileURLToPath } from 'node:url'

import { ORIGIN, LANG, brand, seo, absoluteUrl, CURRENT_YEAR } from './data/site'
import { categories, categoryMap } from './data/categories'
import { primaryNav } from './data/navigation'
import { scanPages, isIndexable, publishedArticles, type PageRecord } from './data/content'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const DOCS_DIR = path.resolve(__dirname, '..')
const ROOT_DIR = path.resolve(DOCS_DIR, '..')

/** 构建期扫描一次全站 frontmatter，供 sitemap / feed / llms.txt / 结构化数据共用 */
const PAGES: PageRecord[] = scanPages(DOCS_DIR)
const PAGE_BY_URL = new Map(PAGES.map((p) => [p.url, p]))
const INDEXABLE_URLS = new Set(PAGES.filter(isIndexable).map((p) => p.url))

/** 术语表：用于 DefinedTerm 实体标注，同时校验 frontmatter.entities 是否真实存在 */
const GLOSSARY: Array<{ id: string; term: string; definition: string }> = JSON.parse(
  fs.readFileSync(path.join(ROOT_DIR, 'data', 'glossary.json'), 'utf-8')
)
const GLOSSARY_BY_ID = new Map(GLOSSARY.map((t) => [t.id, t]))
const GLOSSARY_URL = `${ORIGIN}/glossary/airport-terms/`

/** 每个栏目下已正式发布的文章，用于栏目页的 CollectionPage → ItemList */
const PUBLISHED_BY_CATEGORY = new Map<string, PageRecord[]>()
for (const p of publishedArticles(PAGES)) {
  const seg = p.url.replace(/^\//, '').split('/')[0]
  if (!PUBLISHED_BY_CATEGORY.has(seg)) PUBLISHED_BY_CATEGORY.set(seg, [])
  PUBLISHED_BY_CATEGORY.get(seg)!.push(p)
}
for (const list of PUBLISHED_BY_CATEGORY.values()) {
  list.sort((a, b) =>
    a.updated < b.updated ? 1 : a.updated > b.updated ? -1 : a.title.localeCompare(b.title)
  )
}

function esc(value: string): string {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}

/** 内容中的年份占位符，构建时替换为当前年份，避免写死过期年份 */
const YEAR_TOKEN = /%%YEAR%%/g
function withYear(value: string): string {
  return String(value).replace(YEAR_TOKEN, String(CURRENT_YEAR))
}

function normalizeUrl(raw: string): string {
  let p = raw.startsWith('/') ? raw : `/${raw}`
  p = p.replace(/index\.html$/, '')
  p = p.replace(/\.html$/, '/')
  if (!p.endsWith('/')) p = `${p}/`
  return p.replace(/\/{2,}/g, '/')
}

/** 页面类型：决定使用哪一套结构化数据模板 */
type PageType = 'home' | 'hub' | 'topic' | 'tag' | 'article' | 'policy' | 'utility' | 'notFound'

function resolvePageType(url: string, fm: Record<string, any>, is404: boolean): PageType {
  if (is404) return 'notFound'
  if (url === '/') return 'home'
  if (fm.pageType) return fm.pageType as PageType
  const segs = url.replace(/^\/|\/$/g, '').split('/').filter(Boolean)
  if (segs[0] === 'topics') return 'topic'
  if (segs[0] === 'tags') return 'tag'
  if (segs.length === 1) {
    const cat = categoryMap[segs[0]]
    if (cat?.group === 'utility') return 'utility'
    if (cat?.group === 'trust') return 'policy'
    return 'hub'
  }
  return 'article'
}

/** 面包屑：/network/what-is-iepl/ → 首页 › 线路与协议 › 当前页 */
function buildBreadcrumb(url: string, title: string) {
  const items = [{ name: '首页', item: absoluteUrl('/') }]
  const segs = url.replace(/^\/|\/$/g, '').split('/').filter(Boolean)
  if (segs.length > 0) {
    const cat = categoryMap[segs[0]]
    if (cat) items.push({ name: cat.title, item: absoluteUrl(cat.path) })
  }
  if (segs.length > 1) items.push({ name: title, item: absoluteUrl(url) })
  return items
}

const organization = {
  '@type': 'Organization',
  '@id': `${ORIGIN}/#organization`,
  name: brand.nameZh,
  alternateName: brand.nameEn,
  url: `${ORIGIN}/`,
  logo: {
    '@type': 'ImageObject',
    '@id': `${ORIGIN}/#logo`,
    url: `${ORIGIN}/logo.svg`,
    contentUrl: `${ORIGIN}/logo.svg`,
    width: 260,
    height: 64,
    caption: '机场云 JichangCloud 标识'
  },
  image: { '@id': `${ORIGIN}/#logo` },
  description: brand.independence,
  slogan: brand.slogan,
  knowsLanguage: ['zh-CN'],
  knowsAbout: [
    '机场代理',
    '机场推荐',
    '机场导航',
    '机场评测',
    '机场订阅',
    '线路类型',
    'IEPL',
    'IPLC',
    'BGP',
    'Clash',
    'Shadowrocket',
    'V2rayN',
    'sing-box'
  ]
}

const website = {
  '@type': 'WebSite',
  '@id': `${ORIGIN}/#website`,
  url: `${ORIGIN}/`,
  name: seo.title,
  alternateName: brand.nameEn,
  description: seo.description,
  inLanguage: LANG,
  publisher: { '@id': `${ORIGIN}/#organization` },
  copyrightHolder: { '@id': `${ORIGIN}/#organization` },
  // 站内搜索真实可用：/search/?q= 会自动打开搜索并带入关键词
  potentialAction: {
    '@type': 'SearchAction',
    target: {
      '@type': 'EntryPoint',
      urlTemplate: `${ORIGIN}/search/?q={search_term_string}`
    },
    'query-input': 'required name=search_term_string'
  }
}

/** contentType → schema.org 文章类型 */
const ARTICLE_TYPE_MAP: Record<string, string> = {
  term: 'TechArticle',
  guide: 'TechArticle',
  tutorial: 'TechArticle',
  troubleshooting: 'TechArticle',
  methodology: 'TechArticle',
  comparison: 'TechArticle',
  recommendation: 'Article',
  warning: 'Article',
  update: 'Article',
  faq: 'Article',
  policy: 'Article',
  hub: 'Article'
}

/**
 * speakable 的 cssSelector —— 只列出该页面真实渲染了的区域。
 * .jc-answer__text 由 <AnswerBox /> 输出，条件是 frontmatter.answer；
 * .jc-facts__list 由 <KeyFacts /> 输出，条件是 frontmatter.keyFacts 非空。
 * 声明页面上不存在的选择器会让生成式引擎取不到内容，`check:seo` 会因此报错。
 */
function speakableSelectors(fm: Record<string, any>) {
  const sel: string[] = ['.jc-answer__text']
  if (Array.isArray(fm.keyFacts) && fm.keyFacts.length > 0) sel.push('.jc-facts__list')
  return sel
}

/** frontmatter.entities → DefinedTerm 实体，用于把页面主题锚定到术语表 */
function resolveEntities(fm: Record<string, any>, where: string) {
  const ids: string[] = Array.isArray(fm.entities) ? fm.entities.map(String) : []
  const out: Record<string, unknown>[] = []
  for (const id of ids) {
    const term = GLOSSARY_BY_ID.get(id)
    if (!term) {
      throw new Error(
        `[jichangcloud] ${where} 的 entities 引用了不存在的术语「${id}」，请检查 data/glossary.json`
      )
    }
    out.push({
      '@type': 'DefinedTerm',
      '@id': `${GLOSSARY_URL}#${id}`,
      name: term.term,
      description: term.definition,
      inDefinedTermSet: { '@type': 'DefinedTermSet', '@id': `${GLOSSARY_URL}#termset` },
      url: `${GLOSSARY_URL}#${id}`
    })
  }
  return out
}

/** 从 frontmatter.itemList 或栏目下的已发布文章生成 ItemList（只包含页面上真实渲染的条目） */
function resolveItemList(
  fm: Record<string, any>,
  url: string,
  pageType: PageType
): { name: string; url: string }[] {
  const declared = Array.isArray(fm.itemList) ? fm.itemList : []
  if (declared.length) {
    return declared
      .filter((i: any) => i && i.name && i.url)
      .map((i: any) => ({ name: withYear(String(i.name)), url: String(i.url) }))
  }
  // 标签页：与 TaggedArticles 组件同源，都按文章 frontmatter.tags 计算
  if (pageType === 'tag' && fm.tag) {
    return publishedArticles(PAGES)
      .filter((p) => p.tags.includes(String(fm.tag)))
      .sort((a, b) =>
        a.updated < b.updated ? 1 : a.updated > b.updated ? -1 : a.title.localeCompare(b.title)
      )
      .map((p) => ({ name: p.title, url: p.url }))
  }
  if (pageType !== 'hub') return []
  const slug = url.replace(/^\/|\/$/g, '')
  const list = PUBLISHED_BY_CATEGORY.get(slug) || []
  // 列出该栏目下全部已发布子页，而不是截断到固定条数。
  // ItemList 的语义是「这个页面上有哪些条目」，截断会向搜索引擎低报清单规模——
  // 例如 /brands/ 页面上有 16 家，此前 ItemList 只声明 6 家。
  return list.map((p) => ({ name: p.title, url: p.url }))
}

/**
 * 主结构化数据图谱。
 * 每种页面类型输出与之匹配的类型，绝不输出页面上不存在的内容。
 */
function buildJsonLd(
  record: PageRecord | undefined,
  fm: Record<string, any>,
  url: string,
  title: string,
  description: string,
  pageType: PageType
) {
  const graph: Record<string, unknown>[] = [organization, website]
  const pageId = `${absoluteUrl(url)}#webpage`
  const isCollection = pageType === 'hub' || pageType === 'topic' || pageType === 'tag'
  const segs = url.replace(/^\/|\/$/g, '').split('/').filter(Boolean)
  const cat = categoryMap[segs[0]]

  // 页面主题实体：把页面锚定到术语表中的具体概念，帮助搜索与生成式系统消歧
  const entities = resolveEntities(fm, url)

  const pageNode: Record<string, unknown> = {
    '@type': isCollection ? 'CollectionPage' : 'WebPage',
    '@id': pageId,
    url: absoluteUrl(url),
    name: title,
    description,
    inLanguage: LANG,
    isPartOf: { '@id': `${ORIGIN}/#website` },
    // about 表示「这个页面讲的是什么」，因此指向术语实体而不是站点组织本身
    about: entities.length ? entities.map((e) => ({ '@id': (e as any)['@id'] })) : undefined,
    publisher: { '@id': `${ORIGIN}/#organization` },
    primaryImageOfPage: {
      '@type': 'ImageObject',
      url: absoluteUrl(String(fm.cover || seo.defaultOg)).replace(/\/$/, '')
    }
  }
  if (record?.date) pageNode.datePublished = record.date
  if (record?.updated) pageNode.dateModified = record.updated

  // GEO：把「快速回答」与「核心结论」标记为可朗读 / 可摘录区域。
  // 选择器必须与页面实际渲染的元素一致——.jc-facts__list 由 <KeyFacts /> 输出，
  // 只有声明了 keyFacts 的页面才有。声明页面上不存在的选择器，等于让生成式引擎
  // 按该选择器取不到任何内容，属于结构化数据与可见内容不符。
  if (fm.answer) {
    pageNode.speakable = {
      '@type': 'SpeakableSpecification',
      cssSelector: speakableSelectors(fm)
    }
  }

  const crumbs = buildBreadcrumb(url, title)
  if (crumbs.length > 1) {
    pageNode.breadcrumb = { '@id': `${absoluteUrl(url)}#breadcrumb` }
    graph.push({
      '@type': 'BreadcrumbList',
      '@id': `${absoluteUrl(url)}#breadcrumb`,
      itemListElement: crumbs.map((c, i) => ({
        '@type': 'ListItem',
        position: i + 1,
        name: c.name,
        item: c.item
      }))
    })
  }

  // 聚合页：把页面上真实渲染的条目写成 ItemList
  const items = resolveItemList(fm, url, pageType)
  if (isCollection && items.length) {
    pageNode.mainEntity = { '@id': `${absoluteUrl(url)}#itemlist` }
    graph.push({
      '@type': 'ItemList',
      '@id': `${absoluteUrl(url)}#itemlist`,
      name: `${title} · 内容列表`,
      numberOfItems: items.length,
      itemListOrder: 'https://schema.org/ItemListOrderDescending',
      itemListElement: items.map((item, i) => ({
        '@type': 'ListItem',
        position: i + 1,
        name: item.name,
        url: absoluteUrl(item.url)
      }))
    })
  }

  graph.push(pageNode)

  // 首页：主导航实体，帮助搜索引擎理解站点结构
  if (pageType === 'home') {
    graph.push(
      ...primaryNav.map((item) => ({
        '@type': 'SiteNavigationElement',
        '@id': `${ORIGIN}/#nav-${item.link.replace(/\//g, '')}`,
        name: item.text,
        description: item.desc,
        url: absoluteUrl(item.link)
      }))
    )
  }

  if (entities.length) graph.push(...entities)

  // 文章页与专题页：专题页既是聚合页，也是一篇有作者、有时间、有主题的原创文章
  if ((pageType === 'article' || pageType === 'topic') && record) {
    const articleNode: Record<string, unknown> = {
      '@type': ARTICLE_TYPE_MAP[record.contentType] || 'Article',
      '@id': `${absoluteUrl(url)}#article`,
      headline: title,
      name: title,
      description,
      inLanguage: LANG,
      isAccessibleForFree: true,
      datePublished: record.date || undefined,
      dateModified: record.updated || record.date || undefined,
      author: {
        '@type': 'Organization',
        '@id': `${ORIGIN}/#organization`,
        name: record.author || brand.author,
        url: `${ORIGIN}/about/`
      },
      publisher: { '@id': `${ORIGIN}/#organization` },
      mainEntityOfPage: { '@id': pageId },
      isPartOf: cat ? { '@type': 'CollectionPage', '@id': `${absoluteUrl(cat.path)}#webpage` } : undefined,
      articleSection: cat?.title,
      image: absoluteUrl(String(fm.cover || seo.defaultOg)).replace(/\/$/, ''),
      keywords: record.keywords.length ? record.keywords.join('，') : undefined
    }
    if (entities.length) {
      articleNode.about = entities.map((e) => ({ '@id': (e as any)['@id'] }))
      articleNode.mentions = entities.map((e) => ({ '@id': (e as any)['@id'] }))
    }
    if (fm.answer) {
      articleNode.abstract = withYear(String(fm.answer))
      articleNode.speakable = {
        '@type': 'SpeakableSpecification',
        cssSelector: speakableSelectors(fm)
      }
    }
    graph.push(articleNode)
  }

  return { '@context': 'https://schema.org', '@graph': graph }
}

/** 额外的独立结构化数据块：FAQ / HowTo / DefinedTermSet */
function buildExtraJsonLd(frontmatter: Record<string, any>, url: string, title: string) {
  const blocks: Record<string, unknown>[] = []

  const faq = Array.isArray(frontmatter.faq) ? frontmatter.faq : []
  if (faq.length > 0) {
    blocks.push({
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      '@id': `${absoluteUrl(url)}#faq`,
      inLanguage: LANG,
      isPartOf: { '@id': `${absoluteUrl(url)}#webpage` },
      mainEntity: faq
        .filter((i: any) => i && i.q && i.a)
        .map((i: any) => ({
          '@type': 'Question',
          name: withYear(String(i.q)),
          acceptedAnswer: { '@type': 'Answer', text: withYear(String(i.a)) }
        }))
    })
  }

  const steps = Array.isArray(frontmatter.howto) ? frontmatter.howto : []
  if (steps.length > 0) {
    blocks.push({
      '@context': 'https://schema.org',
      '@type': 'HowTo',
      '@id': `${absoluteUrl(url)}#howto`,
      name: withYear(title),
      inLanguage: LANG,
      totalTime: frontmatter.howtoTime ? String(frontmatter.howtoTime) : undefined,
      step: steps
        .filter((s: any) => s && s.name)
        // 不输出 step 级的 url。schema.org 中 HowToStep.url 应指向页面上该步骤的锚点，
        // 而本站的步骤来自 frontmatter.howto、正文中并没有对应的 id="step-N" 元素，
        // 指向不存在的锚点属于结构化数据与可见内容不符。url 本身是可选字段。
        .map((s: any, i: number) => ({
          '@type': 'HowToStep',
          position: i + 1,
          name: String(s.name),
          text: String(s.text || s.name)
        }))
    })
  }

  // Dataset：面向 Google Dataset Search 的结构化数据。
  // 必填 name 与 description；distribution 用 DataDownload，需 contentUrl 与 encodingFormat。
  // 参考 developers.google.com/search/docs/appearance/structured-data/dataset
  const dist = Array.isArray(frontmatter.datasetDistribution)
    ? frontmatter.datasetDistribution
    : []
  if (dist.length > 0) {
    blocks.push({
      '@context': 'https://schema.org',
      '@type': 'Dataset',
      '@id': `${absoluteUrl(url)}#dataset`,
      name: withYear(title),
      description: String(frontmatter.description || ''),
      url: absoluteUrl(url),
      inLanguage: LANG,
      isAccessibleForFree: true,
      creator: { '@id': `${ORIGIN}/#organization` },
      publisher: { '@id': `${ORIGIN}/#organization` },
      license: frontmatter.datasetLicense
        ? String(frontmatter.datasetLicense)
        : undefined,
      version: frontmatter.updated ? String(frontmatter.updated) : undefined,
      datePublished: frontmatter.date ? String(frontmatter.date) : undefined,
      dateModified: frontmatter.updated ? String(frontmatter.updated) : undefined,
      keywords: Array.isArray(frontmatter.keywords)
        ? frontmatter.keywords.map(String)
        : undefined,
      temporalCoverage: frontmatter.datasetTemporalCoverage
        ? String(frontmatter.datasetTemporalCoverage)
        : undefined,
      variableMeasured: Array.isArray(frontmatter.datasetVariables)
        ? frontmatter.datasetVariables.map(String)
        : undefined,
      distribution: dist
        .filter((d: any) => d && d.url)
        .map((d: any) => ({
          '@type': 'DataDownload',
          name: d.name ? String(d.name) : undefined,
          // 不能用 absoluteUrl()——它会给路径补尾斜杠，
          // 而这里指向的是具体文件（providers.json），补斜杠会得到 404 的地址。
          contentUrl: `${ORIGIN}${String(d.url).startsWith('/') ? '' : '/'}${String(d.url)}`,
          encodingFormat: d.format ? String(d.format) : 'application/json'
        }))
    })
  }

  // 术语页直接读取 data/glossary.json，保证页面显示与结构化数据同源
  let terms = Array.isArray(frontmatter.definedTerms) ? frontmatter.definedTerms : []
  if (frontmatter.definedTermsSource === 'glossary') {
    terms = GLOSSARY.map((t) => ({ id: t.id, term: t.term, definition: t.definition }))
  }
  if (terms.length > 0) {
    blocks.push({
      '@context': 'https://schema.org',
      '@type': 'DefinedTermSet',
      '@id': `${absoluteUrl(url)}#termset`,
      name: title,
      inLanguage: LANG,
      hasDefinedTerm: terms
        .filter((t: any) => t && t.term && t.definition)
        .map((t: any) => ({
          '@type': 'DefinedTerm',
          '@id': t.id ? `${absoluteUrl(url)}#${t.id}` : undefined,
          name: String(t.term),
          description: String(t.definition),
          inDefinedTermSet: { '@id': `${absoluteUrl(url)}#termset` }
        }))
    })
  }

  return blocks
}

export default defineConfig({
  srcDir: '.',
  outDir: './.vitepress/dist',
  cacheDir: './.vitepress/cache',

  lang: LANG,
  title: brand.nameZh,
  titleTemplate: `:title｜${brand.nameZh}`,
  description: seo.description,

  cleanUrls: false,
  metaChunk: true,
  lastUpdated: false,
  ignoreDeadLinks: false,

  head: [
    ['meta', { charset: 'utf-8' }],
    ['meta', { name: 'viewport', content: 'width=device-width,initial-scale=1,viewport-fit=cover' }],
    ['link', { rel: 'icon', href: '/favicon.svg', type: 'image/svg+xml' }],
    ['link', { rel: 'alternate icon', href: '/favicon.ico', sizes: 'any' }],
    ['link', { rel: 'apple-touch-icon', href: '/apple-touch-icon.png', sizes: '180x180' }],
    ['link', { rel: 'manifest', href: '/site.webmanifest' }],
    ['meta', { name: 'theme-color', content: '#f7faff' }],
    ['meta', { name: 'format-detection', content: 'telephone=no' }],
    ['meta', { name: 'author', content: brand.author }],
    ['meta', { name: 'publisher', content: brand.nameZh }],
    ['meta', { name: 'generator', content: 'VitePress · Cloud Halo Theme' }],
    ['meta', { property: 'og:site_name', content: brand.nameZh }],
    ['meta', { property: 'og:locale', content: 'zh_CN' }],
    ['meta', { name: 'twitter:card', content: seo.twitterCard }],
    [
      'link',
      { rel: 'alternate', type: 'application/rss+xml', title: '机场推荐 内容更新', href: '/feed.xml' }
    ]
  ],

  markdown: {
    lineNumbers: false,
    theme: { light: 'github-light', dark: 'github-dark' },
    anchor: { permalink: false },
    headers: { level: [2, 3, 4] },
    container: {
      tipLabel: '提示',
      warningLabel: '注意',
      dangerLabel: '警告',
      infoLabel: '说明',
      detailsLabel: '展开查看'
    }
  },

  sitemap: {
    hostname: ORIGIN,
    lastmodDateOnly: false,
    transformItems(items) {
      return items
        .map((item) => {
          const url = normalizeUrl(item.url)
          const page = PAGE_BY_URL.get(url)
          const lastmod = page?.updated
            ? new Date(`${page.updated}T00:00:00Z`).getTime()
            : item.lastmod
          return { ...item, url: url.replace(/^\//, ''), lastmod }
        })
        .filter((item) => {
          const url = normalizeUrl(`/${item.url}`)
          if (url === '/404.html/' || url.startsWith('/404')) return false
          if (url === '/search/') return false
          return INDEXABLE_URLS.has(url)
        })
    }
  },

  transformPageData(pageData) {
    const url = normalizeUrl(
      '/' + pageData.relativePath.replace(/(^|\/)index\.md$/, '$1').replace(/\.md$/, '.html')
    )
    const record = PAGE_BY_URL.get(url)
    const fm = pageData.frontmatter as Record<string, any>

    const isHome = url === '/'
    const is404 = pageData.relativePath === '404.md'
    const pageType = resolvePageType(url, fm, is404)

    const title = withYear(
      isHome ? seo.title : String(fm.title || pageData.title || brand.nameZh)
    )
    const description = withYear(String(fm.description || seo.description))
    const canonical = fm.canonical ? String(fm.canonical) : absoluteUrl(url)
    const cover = absoluteUrl(String(fm.cover || seo.defaultOg)).replace(/\/$/, '')
    const indexable = !is404 && !fm.draft && !fm.noindex && url !== '/search/'

    const head: HeadConfig[] = [
      [
        'meta',
        {
          name: 'robots',
          content: indexable
            ? 'index,follow,max-image-preview:large,max-snippet:-1,max-video-preview:-1'
            : 'noindex,nofollow'
        }
      ],
      ['meta', { property: 'og:type', content: isHome ? 'website' : 'article' }],
      ['meta', { property: 'og:title', content: title }],
      ['meta', { property: 'og:description', content: description }],
      ['meta', { property: 'og:url', content: canonical }],
      ['meta', { property: 'og:image', content: cover }],
      ['meta', { property: 'og:image:width', content: '1200' }],
      ['meta', { property: 'og:image:height', content: '630' }],
      ['meta', { property: 'og:image:alt', content: `${title} - 机场推荐 JichangTuij` }],
      ['meta', { name: 'twitter:title', content: title }],
      ['meta', { name: 'twitter:description', content: description }],
      ['meta', { name: 'twitter:image', content: cover }],
      ['meta', { name: 'twitter:image:alt', content: `${title} - 机场推荐 JichangTuij` }]
    ]

    // 404 页面没有对应的规范资源，不输出 canonical / hreflang
    if (!is404) {
      head.unshift(
        ['link', { rel: 'canonical', href: canonical }],
        ['link', { rel: 'alternate', hreflang: 'zh-Hans', href: canonical }],
        ['link', { rel: 'alternate', hreflang: 'x-default', href: canonical }]
      )
    }

    if (fm.date) head.push(['meta', { property: 'article:published_time', content: String(fm.date) }])
    if (fm.updated)
      head.push(['meta', { property: 'article:modified_time', content: String(fm.updated) }])
    if (fm.date || fm.updated)
      head.push(['meta', { name: 'last-modified', content: String(fm.updated || fm.date) }])

    /**
     * 主关键词的唯一来源：
     *   - 首页取 seo.primaryKeyword（品牌词）
     *   - 栏目页 / 政策页 / 功能页取 categories.ts 中登记的 primaryKeyword
     *   - 文章页取 frontmatter.keywords 的第一项
     * 这样栏目页与其下属文章不可能因为手写 frontmatter 漂移而争抢同一个查询。
     */
    const fmKeywords: string[] = Array.isArray(fm.keywords) ? fm.keywords.map(String) : []
    const segs = url.replace(/^\/|\/$/g, '').split('/').filter(Boolean)
    const ownCategory = segs.length === 1 ? categoryMap[segs[0]] : undefined

    let primaryKeyword = fmKeywords[0]
    if (isHome) primaryKeyword = seo.primaryKeyword
    else if (ownCategory) primaryKeyword = ownCategory.primaryKeyword

    const kws = primaryKeyword
      ? [primaryKeyword, ...fmKeywords.filter((k) => k !== primaryKeyword)]
      : fmKeywords

    if (kws.length) {
      head.push(['meta', { name: 'keywords', content: kws.map(withYear).join('，') }])
      // 主关键词单独输出，供 check:seo 强制校验「一个可索引 URL 只占一个主关键词」
      head.push(['meta', { name: 'jc:primary-keyword', content: withYear(kws[0]) }])
    }
    if (fm.intent) head.push(['meta', { name: 'jc:search-intent', content: String(fm.intent) }])
    head.push(['meta', { name: 'jc:page-type', content: pageType }])

    /**
     * 内容状态的机器标记。
     * 检查脚本据此识别草稿，而不是去匹配页面上的中文提示文案 ——
     * 后者一旦被改写，所有「草稿不得进入 sitemap / Pagefind」的校验都会静默失效。
     */
    if (!is404) {
      head.push([
        'meta',
        { name: 'jc:page-status', content: fm.draft === true ? 'draft' : 'published' }
      ])
      head.push([
        'meta',
        { name: 'jc:content-status', content: String(fm.status || (fm.draft ? 'outline' : 'published')) }
      ])
    }
    if (fm.answer) head.push(['meta', { name: 'jc:answer', content: withYear(String(fm.answer)) }])

    if (!is404) {
      head.push([
        'script',
        { type: 'application/ld+json' },
        JSON.stringify(buildJsonLd(record, fm, url, title, description, pageType))
      ])
      for (const block of buildExtraJsonLd(fm, url, title)) {
        head.push(['script', { type: 'application/ld+json' }, JSON.stringify(block)])
      }
    }

    pageData.frontmatter.head = [...(pageData.frontmatter.head || []), ...head]
  },

  /**
   * 输出后处理：
   *   1. 把 %%YEAR%% 占位符替换为构建时的当前年份（正文、标题、meta、JSON-LD 一次覆盖）
   *   2. 为 404 页面注入静态兜底内容 —— VitePress 出于路由原因会把 404 的 #app 留空，
   *      交给客户端渲染；兜底内容放在 <noscript> 中，不干扰 Vue 挂载。
   */
  transformHtml(code, id) {
    let html = code.replace(YEAR_TOKEN, String(CURRENT_YEAR))
    if (!id.endsWith('404.html')) return html

    const links = [
      ['/', '返回首页'],
      ['/recommend/', '机场推荐'],
      ['/ranking/', '机场排行榜'],
      ['/brands/', '品牌资料库'],
      ['/compare/', '品牌对比'],
      ['/clients/', '客户端教程'],
      ['/network/', '线路与协议'],
      ['/troubleshooting/', '故障排查'],
      ['/guides/', '新手指南'],
      ['/glossary/', '术语词典'],
      ['/search/', '全文搜索']
    ]
      .map(([href, text]) => `<li><a href="${href}">${text}</a></li>`)
      .join('')

    const fallback = `<noscript><div class="jc-container jc-notfound"><p class="jc-notfound__code">404 · NOT FOUND</p><h1 class="jc-notfound__title">这条线路没有找到</h1><p class="jc-notfound__desc">页面可能已移动、改名或暂时不可用。你可以回到首页重新开始，也可以从下面的常用入口继续。</p><ul class="jc-notfound__fallback">${links}</ul></div></noscript>`

    return html.replace('<div id="app">', `${fallback}<div id="app">`)
  },

  async buildEnd(siteConfig) {
    const outDir = siteConfig.outDir
    const pages = scanPages(DOCS_DIR)
    const articles = publishedArticles(pages)
    const now = new Date().toUTCString()

    // ---------- feed.xml：只包含正式发布文章 ----------
    const feedItems = articles
      .slice(0, 50)
      .map((a) => {
        const link = absoluteUrl(a.url)
        const pub = a.date ? new Date(`${a.date}T08:00:00+08:00`).toUTCString() : now
        return [
          '    <item>',
          `      <title>${esc(withYear(a.title))}</title>`,
          `      <link>${esc(link)}</link>`,
          `      <guid isPermaLink="true">${esc(link)}</guid>`,
          `      <pubDate>${pub}</pubDate>`,
          `      <dc:creator>${esc(a.author)}</dc:creator>`,
          `      <category>${esc(categoryMap[a.url.split('/')[1]]?.title || a.category)}</category>`,
          `      <description>${esc(withYear(a.description))}</description>`,
          '    </item>'
        ].join('\n')
      })
      .join('\n')

    const feed = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:dc="http://purl.org/dc/elements/1.1/" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${esc(seo.title)}</title>
    <link>${ORIGIN}/</link>
    <atom:link href="${ORIGIN}/feed.xml" rel="self" type="application/rss+xml" />
    <description>${esc(seo.description)}</description>
    <language>zh-cn</language>
    <copyright>${CURRENT_YEAR} ${brand.nameZh} ${brand.nameEn}</copyright>
    <lastBuildDate>${now}</lastBuildDate>
    <generator>JichangCloud Static Feed Builder</generator>
${feedItems}
  </channel>
</rss>
`
    fs.writeFileSync(path.join(outDir, 'feed.xml'), feed, 'utf-8')

    // ---------- llms.txt：面向 AI 回答引擎的机器可读索引 ----------
    const hubLines = categories
      .filter((c) => c.group === 'content')
      .map((c) => `- [${c.title}](${ORIGIN}${c.path}): ${c.tagline}（主题词：${c.primaryKeyword}）`)
      .join('\n')

    const articleLines = articles
      .map((a) => {
        const answer = a.answer ? ` 快速回答：${withYear(a.answer)}` : ''
        return `- [${withYear(a.title)}](${absoluteUrl(a.url)}): ${withYear(a.description)}${answer}`
      })
      .join('\n')

    const topicPages = pages
      .filter((p) => p.url.startsWith('/topics/') && p.url !== '/topics/' && isIndexable(p))
      .map((p) => `- [${withYear(p.title)}](${absoluteUrl(p.url)}): ${withYear(p.description)}`)
      .join('\n')

    const entityLines = GLOSSARY.map(
      (t) => `- ${t.term}（${t.en || t.id}）：${t.definition} → ${GLOSSARY_URL}#${t.id}`
    ).join('\n')

    const llms = `# ${brand.nameZh} ${brand.nameEn}

> ${brand.slogan}。${brand.independence}

站点语言：简体中文（zh-CN）
站点类型：机场代理、机场推荐、机场导航、机场评测、线路知识、客户端教程、故障排查与风险预警的独立信息平台
正式域名：${ORIGIN}
内容负责方：${brand.author}
最后生成时间：${new Date().toISOString()}

## 引用说明

- 本站不销售、不代理、不运营任何机场或网络服务。
- 在没有可核验的真实测试数据之前，本站不发布速度、延迟、解锁结论与品牌排名。
- 引用本站内容时请注明页面标题与链接，并保留页面上标注的更新时间。
- 仅下列 URL 属于正式发布内容，其余为未完成草稿，不应被引用。
- 每篇正式文章顶部的「快速回答」是可以独立引用的结论摘要，本文件已一并给出。

## 主题专题（跨栏目聚合）

${topicPages || '- 暂无'}

## 核心栏目

${hubLines}

## 正式发布页面

${articleLines}

## 术语实体表

以下术语在全站只维护一处定义，可作为实体消歧依据：

${entityLines}

## 编辑与信任

- [关于机场推荐](${ORIGIN}/about/): 我们是谁、做什么、不做什么
- [评测方法](${ORIGIN}/methodology/): 样本、周期、环境与结论边界
- [编辑原则](${ORIGIN}/editorial-policy/): 事实核验、修订与独立性承诺
- [推广披露](${ORIGIN}/affiliate-policy/): 推广关系与排序原则
- [隐私政策](${ORIGIN}/privacy/): 访问者隐私保护政策
- [使用条款](${ORIGIN}/terms/): 免责声明与合规提醒

## 机器可读入口

- Sitemap: ${ORIGIN}/sitemap.xml
- Feed: ${ORIGIN}/feed.xml
- Robots: ${ORIGIN}/robots.txt
- 站内搜索: ${ORIGIN}/search/?q={关键词}
`
    fs.writeFileSync(path.join(outDir, 'llms.txt'), llms, 'utf-8')
    fs.writeFileSync(path.join(DOCS_DIR, 'public', 'llms.txt'), llms, 'utf-8')

    // ---------- 公开数据集：机器可读、可引用、可校验 ----------
    // 只输出可核验的事实字段。刻意剥离三类内容：
    //   1. 返佣链接（含 ?code= 参数）—— 数据集不应传播返佣码，否则性质从事实数据变成广告投放；
    //   2. 优惠码 —— 同上，属商业信息而非事实；
    //   3. positioning 营销定位语 —— 属编辑观点，不是可核验事实。
    // 每条记录带 page 字段指回本站对应页面，使引用可溯源。
    {
      const DATASET_DIR = path.join(outDir, 'dataset')
      fs.mkdirSync(DATASET_DIR, { recursive: true })

      const providersRaw = JSON.parse(
        fs.readFileSync(path.join(ROOT_DIR, 'data', 'providers.json'), 'utf-8')
      )
      const glossaryRaw = JSON.parse(
        fs.readFileSync(path.join(ROOT_DIR, 'data', 'glossary.json'), 'utf-8')
      )

      const LICENSE = 'CC BY 4.0'
      const LICENSE_URL = 'https://creativecommons.org/licenses/by/4.0/'
      const ATTRIBUTION = `数据来源：机场推荐 JichangTuij（${ORIGIN}）`

      const providersPublic = {
        $schema: 'https://json-schema.org/draft/2020-12/schema',
        name: '机场推荐已收录服务商公开资料',
        description:
          '各服务商官网公开标注的参数与本站的核验日期。价格与流量为官网标注口径，不代表本站对其真实性的背书。',
        license: LICENSE,
        licenseUrl: LICENSE_URL,
        attribution: ATTRIBUTION,
        disclaimer:
          '收录不构成推荐，排列顺序按资料建立时间，不代表性能或质量排名。本站不销售、不代理、不运营任何网络服务。',
        count: providersRaw.length,
        records: providersRaw.map((p: any) => ({
          id: p.id,
          name: p.name,
          page: `${ORIGIN}/brands/${p.slug}/`,
          status: p.status,
          established: p.established,
          entryPrice: p.entryPrice,
          isAnnualDiscount: p.isAnnualDiscount,
          traffic: p.traffic,
          protocols: p.protocols,
          routes: p.routes,
          firstSeen: p.firstSeen,
          lastVerified: p.lastVerified,
          lastMeasured: p.lastMeasured,
          verificationNotes: p.notes
        }))
      }

      const measurementsPublic = {
        name: '机场推荐节点测速记录清单',
        description:
          '本站保存的测速截图记录索引。每条记录标注测试时刻、图中显示的协议、测试后端与日期可信度。',
        license: LICENSE,
        licenseUrl: LICENSE_URL,
        attribution: ATTRIBUTION,
        limitations: [
          '单次快照，各品牌测试时间不同',
          '不构成受控的跨品牌排名',
          '未测试 AI 工具与流媒体解锁能力',
          '不能证明长期稳定性',
          '速度数值来自高带宽测试机，不代表家庭宽带可获得的速度'
        ],
        count: providersRaw.filter((p: any) => p.lastMeasured || p.slug === 'kosing').length,
        records: providersRaw
          .filter((p: any) => p.lastMeasured || p.slug === 'kosing')
          .map((p: any) => ({
            provider: p.name,
            page: `${ORIGIN}/brands/${p.slug}/`,
            measuredOn: p.lastMeasured,
            dateConfidence: p.lastMeasured ? 'visible-in-image' : 'unverified',
            screenshotAvailable: true
          }))
      }

      const glossaryPublic = {
        name: '机场推荐术语词典',
        description: '机场（代理服务）领域常用术语的定义。',
        license: LICENSE,
        licenseUrl: LICENSE_URL,
        attribution: ATTRIBUTION,
        count: glossaryRaw.length,
        records: glossaryRaw.map((t: any) => ({
          id: t.id,
          term: t.term,
          definition: t.definition,
          page: `${ORIGIN}/glossary/#${t.id}`
        }))
      }

      const files: Record<string, unknown> = {
        'providers.json': providersPublic,
        'measurements.json': measurementsPublic,
        'glossary.json': glossaryPublic
      }

      const manifestFiles = []
      for (const [fname, payload] of Object.entries(files)) {
        const body = JSON.stringify(payload, null, 2) + '\n'
        fs.writeFileSync(path.join(DATASET_DIR, fname), body, 'utf-8')
        manifestFiles.push({
          file: fname,
          url: `${ORIGIN}/dataset/${fname}`,
          bytes: Buffer.byteLength(body),
          sha256: crypto.createHash('sha256').update(body).digest('hex')
        })
      }

      const manifest = {
        name: '机场推荐公开数据集',
        publisher: '机场推荐 JichangTuij',
        homepage: ORIGIN,
        license: LICENSE,
        licenseUrl: LICENSE_URL,
        attribution: ATTRIBUTION,
        citationNote:
          '引用时请注明数据来源与本页面标注的核验日期。数据会随复核更新，请以本清单中的 sha256 判断你手上的副本是否为最新。',
        excluded: [
          '推广链接与返佣参数（本数据集不传播返佣码）',
          '优惠码',
          '营销定位语'
        ],
        generatedAt: new Date().toISOString(),
        files: manifestFiles
      }
      fs.writeFileSync(
        path.join(DATASET_DIR, 'manifest.json'),
        JSON.stringify(manifest, null, 2) + '\n',
        'utf-8'
      )
    }

    // ---------- 构建统计，供验收报告使用 ----------
    const stats = {
      generatedAt: new Date().toISOString(),
      totalPages: pages.length,
      indexablePages: pages.filter(isIndexable).length,
      draftPages: pages.filter((p) => p.draft).length,
      publishedArticles: articles.length,
      outDir: path.relative(ROOT_DIR, outDir).replace(/\\/g, '/')
    }
    fs.writeFileSync(
      path.join(ROOT_DIR, 'data', 'build-stats.json'),
      JSON.stringify(stats, null, 2) + '\n',
      'utf-8'
    )
  }
})
