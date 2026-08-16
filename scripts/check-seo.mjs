#!/usr/bin/env node
/**
 * SEO 检查。对构建产物中的每个页面检查：
 *   - title / description 是否存在且唯一
 *   - H1 数量
 *   - canonical / robots / lang / Open Graph / Twitter Card
 *   - JSON-LD 是否为合法 JSON，类型是否与页面匹配
 *   - 草稿与 noindex 页面是否被正确排除在 sitemap 之外
 *   - 关键词是否重复分配给多个 URL（读取 data/keyword-map.json）
 */

import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const ROOT = path.resolve(__dirname, '..')
const DIST = path.join(ROOT, 'docs', '.vitepress', 'dist')
const ORIGIN = 'https://jichangtuij.com'

if (!fs.existsSync(DIST)) {
  console.error('[seo] 构建目录不存在，请先运行 npm run build')
  process.exit(1)
}

const errors = []
const warnings = []

function rel(p) {
  return path.relative(DIST, p).replace(/\\/g, '/')
}

function walk(dir, out = []) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name)
    if (entry.isDirectory()) {
      if (entry.name === 'pagefind' || entry.name === 'assets') continue
      walk(full, out)
    } else if (entry.name.endsWith('.html')) {
      out.push(full)
    }
  }
  return out
}

function meta(html, attr, value) {
  const re = new RegExp(`<meta[^>]+${attr}="${value}"[^>]*content="([^"]*)"`, 'i')
  const m = html.match(re)
  if (m) return m[1]
  const re2 = new RegExp(`<meta[^>]+content="([^"]*)"[^>]*${attr}="${value}"`, 'i')
  const m2 = html.match(re2)
  return m2 ? m2[1] : null
}

const files = walk(DIST)
const titles = new Map()
const descriptions = new Map()
const canonicals = new Map()
/** 主关键词 → URL，用于检测同一查询被多个页面争抢（关键词蚕食） */
const primaryKeywords = new Map()
/** 页面类型分布，用于确认每种模板都真的存在 */
const pageTypes = new Map()

let indexable = 0
let noindexed = 0
let withSpeakable = 0
let withCollection = 0

for (const file of files) {
  const html = fs.readFileSync(file, 'utf-8')
  const name = rel(file)
  const is404 = name === '404.html'

  // ---- lang ----
  if (!/<html[^>]+lang="zh-CN"/.test(html)) {
    errors.push(`${name}：缺少 lang="zh-CN"`)
  }

  // ---- title ----
  const titleMatch = html.match(/<title>([^<]*)<\/title>/)
  const title = titleMatch ? titleMatch[1].trim() : ''
  if (!title) errors.push(`${name}：title 为空`)
  if (title.length > 70) warnings.push(`${name}：title 偏长（${title.length} 字符）`)

  // ---- description ----
  const desc = meta(html, 'name', 'description')
  if (!desc || !desc.trim()) errors.push(`${name}：description 为空`)
  else if (desc.length > 200) warnings.push(`${name}：description 偏长（${desc.length} 字符）`)

  // ---- robots ----
  const robots = meta(html, 'name', 'robots')
  if (!robots && !is404) errors.push(`${name}：缺少 robots meta`)
  const isNoindex = robots ? robots.includes('noindex') : false
  if (isNoindex) noindexed++
  else if (!is404) indexable++

  // ---- H1 ----
  const h1Count = (html.match(/<h1[\s>]/g) || []).length
  if (h1Count === 0) errors.push(`${name}：没有 H1`)
  if (h1Count > 1) errors.push(`${name}：H1 数量为 ${h1Count}，应为 1`)

  // ---- canonical ----
  const canonicalMatch = html.match(/<link[^>]+rel="canonical"[^>]*href="([^"]+)"/)
  if (!is404) {
    if (!canonicalMatch) {
      errors.push(`${name}：缺少 canonical`)
    } else {
      const c = canonicalMatch[1]
      if (!c.startsWith(ORIGIN)) errors.push(`${name}：canonical 未使用正式域名（${c}）`)
      if (canonicals.has(c) && !isNoindex) {
        errors.push(`canonical 重复：${canonicals.get(c)} 与 ${name} 都指向 ${c}`)
      }
      if (!isNoindex) canonicals.set(c, name)
    }
  }

  // ---- Open Graph / Twitter ----
  if (!is404) {
    for (const p of ['og:title', 'og:description', 'og:url', 'og:image', 'og:type']) {
      if (!meta(html, 'property', p)) errors.push(`${name}：缺少 ${p}`)
    }
    if (!meta(html, 'name', 'twitter:card')) errors.push(`${name}：缺少 twitter:card`)
    if (!meta(html, 'name', 'twitter:title')) errors.push(`${name}：缺少 twitter:title`)
  }

  // ---- JSON-LD ----
  if (!is404) {
    const blocks = [
      ...html.matchAll(/<script[^>]+type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/g)
    ]
    if (blocks.length === 0) {
      errors.push(`${name}：缺少 JSON-LD 结构化数据`)
    }
    for (const b of blocks) {
      let parsed
      try {
        parsed = JSON.parse(b[1])
      } catch {
        errors.push(`${name}：JSON-LD 不是合法 JSON`)
        continue
      }
      // FAQPage 只有在页面真的渲染了 FAQ 时才允许出现
      const type = parsed['@type']
      if (type === 'FAQPage') {
        const q = (parsed.mainEntity || []).length
        if (q === 0) errors.push(`${name}：输出了空的 FAQPage`)
        const rendered = (html.match(/class="jc-faq__item"/g) || []).length
        if (rendered < q) {
          errors.push(`${name}：FAQPage 声明 ${q} 条，但页面只渲染了 ${rendered} 条`)
        }
      }
      if (type === 'ItemList') {
        const items = (parsed.itemListElement || []).length
        if (items === 0) errors.push(`${name}：输出了空的 ItemList`)
        // numberOfItems 必须与实际条目数一致，否则是向搜索引擎低报或虚报清单规模
        if (typeof parsed.numberOfItems === 'number' && parsed.numberOfItems !== items) {
          errors.push(
            `${name}：ItemList 声明 numberOfItems=${parsed.numberOfItems}，但实际有 ${items} 条`
          )
        }
      }
      // Dataset 的每个下载地址必须真实存在于构建产物中。
      // 曾因 absoluteUrl() 给文件路径补尾斜杠，导致 contentUrl 全部指向 404。
      if (type === 'Dataset') {
        for (const d of parsed.distribution || []) {
          const u = String(d.contentUrl || '')
          if (!u.startsWith(ORIGIN)) continue
          const p = path.join(DIST, u.slice(ORIGIN.length))
          if (!fs.existsSync(p)) {
            errors.push(`${name}：Dataset 的 contentUrl 指向不存在的文件（${u}）`)
          }
        }
        const dlen = String(parsed.description || '').length
        if (dlen < 50) {
          errors.push(`${name}：Dataset 的 description 仅 ${dlen} 字符，Google 要求至少 50`)
        }
      }
      // HowTo 的每一步若声明了锚点 URL，该锚点必须在页面上真实存在
      if (type === 'HowTo') {
        for (const step of parsed.step || []) {
          const anchor = String(step.url || '').split('#')[1]
          if (anchor && !html.includes(`id="${anchor}"`)) {
            errors.push(`${name}：HowToStep 指向锚点 #${anchor}，但页面上不存在该 id`)
          }
        }
      }
      if (type === 'DefinedTermSet' && (parsed.hasDefinedTerm || []).length === 0) {
        errors.push(`${name}：输出了空的 DefinedTermSet`)
      }
      // 禁止伪造评价类数据
      const raw = b[1]
      for (const forbidden of ['AggregateRating', 'ratingValue', 'reviewCount']) {
        if (raw.includes(forbidden)) {
          errors.push(`${name}：JSON-LD 中出现了未经核实的评价字段（${forbidden}）`)
        }
      }
    }
  }

  // ---- 未被解析的 Markdown 语法 ----
  // VitePress 把紧贴组件标签的内容当作原始 HTML 块处理，不做 Markdown 解析。
  // 结果是 **强调** 与 [文本](/链接/) 会以原始语法暴露给读者。
  // 2026-08-15 曾因此在 21 个页面上留下 76 处字面 ** 与 28 处未渲染链接，
  // 且当时全部门禁均为绿——因为没有任何一项检查页面上的 Markdown 有没有被渲染。
  // 修法是在组件标签内侧补空行；本检查用于防止同类问题再次进入构建产物。
  if (!is404) {
    // 只看正文区域，避开 JSON-LD、script/style，以及 <code>/<pre>——
    // 后者里出现 Markdown 语法通常是在举例说明约定本身（例如更新记录里
    // 「不要在 frontmatter 中使用 `[文本](/路径/)`」），属于正常内容。
    const body = html
      .replace(/<script[\s\S]*?<\/script>/g, '')
      .replace(/<style[\s\S]*?<\/style>/g, '')
      .replace(/<pre[\s\S]*?<\/pre>/g, '')
      .replace(/<code[\s\S]*?<\/code>/g, '')
    const literalBold = (body.match(/\*\*[^*\s][^*]*\*\*/g) || []).length
    const literalLink = (body.match(/\[[^\]\n]{1,60}\]\(\/[^)\s]*\)/g) || []).length
    if (literalBold > 0) {
      errors.push(
        `${name}：页面上出现 ${literalBold} 处未被解析的 **强调** 语法（组件标签内侧需要补空行）`
      )
    }
    if (literalLink > 0) {
      errors.push(
        `${name}：页面上出现 ${literalLink} 处未被解析的 Markdown 链接语法（组件标签内侧需要补空行；frontmatter 纯文本字段则应改为文字提及）`
      )
    }
  }

  // ---- 页面类型与 GEO 标记 ----
  const pt = meta(html, 'name', 'jc:page-type')
  if (!is404) {
    if (!pt) errors.push(`${name}：缺少 jc:page-type 标记`)
    else pageTypes.set(pt, (pageTypes.get(pt) || 0) + 1)
    if (html.includes('SpeakableSpecification')) {
      withSpeakable++
      // speakable 声明的 cssSelector 必须在页面上真实存在，否则生成式引擎按该选择器
      // 取不到任何内容，属于结构化数据与可见内容不符。
      for (const m of html.matchAll(/"cssSelector":\[([^\]]*)\]/g)) {
        for (const sel of m[1].match(/"\.([\w-]+)"/g) || []) {
          const cls = sel.replace(/[".]/g, '')
          if (!html.includes(`class="${cls}`) && !html.includes(` ${cls}"`) && !html.includes(` ${cls} `)) {
            errors.push(`${name}：speakable 指向 .${cls}，但页面上不存在该元素`)
          }
        }
      }
    }
    // 只统计「本页自身就是聚合页」的情况。
    // 文章节点里的 isPartOf 也会引用 CollectionPage，必须用本页 canonical 精确匹配才不会重复计数。
    const selfCanonical = (html.match(/<link[^>]+rel="canonical"[^>]*href="([^"]+)"/) || [])[1]
    if (
      selfCanonical &&
      html.includes(`"@type":"CollectionPage","@id":"${selfCanonical}#webpage"`)
    ) {
      withCollection++
    }
  }

  // ---- hreflang（可索引页面必须自指） ----
  if (!is404 && !isNoindex) {
    if (!/rel="alternate"[^>]*hreflang="zh-Hans"/.test(html)) {
      errors.push(`${name}：缺少 hreflang="zh-Hans" 自指声明`)
    }
  }

  // ---- 主关键词唯一性（防止关键词蚕食） ----
  if (!is404 && !isNoindex) {
    const kw = meta(html, 'name', 'jc:primary-keyword')
    if (!kw) {
      errors.push(`${name}：可索引页面没有声明主关键词（frontmatter.keywords 第一项）`)
    } else if (primaryKeywords.has(kw)) {
      errors.push(
        `主关键词冲突：「${kw}」同时分配给 ${primaryKeywords.get(kw)} 与 ${name}，会造成关键词蚕食`
      )
    } else {
      primaryKeywords.set(kw, name)
    }
  }

  // ---- 唯一性 ----
  if (!isNoindex && !is404) {
    if (titles.has(title)) errors.push(`title 重复：${titles.get(title)} 与 ${name}`)
    else titles.set(title, name)

    if (desc) {
      if (descriptions.has(desc)) {
        errors.push(`description 重复：${descriptions.get(desc)} 与 ${name}`)
      } else descriptions.set(desc, name)
    }
  }
}

/** ---------- sitemap 与草稿一致性 ---------- */

const sitemapFile = path.join(DIST, 'sitemap.xml')
let sitemapUrls = []
if (fs.existsSync(sitemapFile)) {
  const xml = fs.readFileSync(sitemapFile, 'utf-8')
  sitemapUrls = [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1])
} else {
  errors.push('缺少 sitemap.xml')
}

for (const u of sitemapUrls) {
  const p = u.replace(ORIGIN, '').replace(/^\//, '')
  const f = path.join(DIST, p === '' ? 'index.html' : path.join(p, 'index.html'))
  if (!fs.existsSync(f)) {
    errors.push(`sitemap 中的 URL 没有对应页面：${u}`)
    continue
  }
  const html = fs.readFileSync(f, 'utf-8')
  if (/name="robots"[^>]*content="[^"]*noindex/.test(html)) {
    errors.push(`sitemap 中包含 noindex 页面：${u}`)
  }
  // 用机器标记判断草稿，而不是页面上的中文提示文案
  if (/<meta name="jc:page-status" content="draft">/.test(html)) {
    errors.push(`sitemap 中包含草稿页面：${u}`)
  }
}

// 可索引页面必须都在 sitemap 中
const sitemapSet = new Set(sitemapUrls)
for (const file of files) {
  const name = rel(file)
  if (name === '404.html') continue
  const html = fs.readFileSync(file, 'utf-8')
  if (/name="robots"[^>]*content="[^"]*noindex/.test(html)) continue
  const urlPath = name === 'index.html' ? '/' : '/' + name.replace(/index\.html$/, '')
  const url = ORIGIN + urlPath
  if (!sitemapSet.has(url)) {
    errors.push(`可索引页面未进入 sitemap：${url}`)
  }
}

/** ---------- 关键词映射唯一性 ---------- */

const kmFile = path.join(ROOT, 'data', 'keyword-map.json')
if (fs.existsSync(kmFile)) {
  const km = JSON.parse(fs.readFileSync(kmFile, 'utf-8'))
  const seen = new Map()
  for (const item of km) {
    const kw = item.primaryKeyword.trim()
    if (seen.has(kw)) {
      errors.push(`主关键词「${kw}」被同时分配给 ${seen.get(kw)} 与 ${item.slug}`)
    }
    seen.set(kw, item.slug)
  }

  // 提前拦截「草稿发布后才会出现」的冲突：
  // 规划中的 72 篇文章不能与任何已上线页面的主关键词重复。
  for (const [kw, page] of primaryKeywords) {
    if (seen.has(kw)) {
      const slug = seen.get(kw)
      const pageUrl = '/' + page.replace(/index\.html$/, '')
      if (slug !== pageUrl) {
        errors.push(
          `规划冲突：内容矩阵中的 ${slug} 与已上线页面 ${pageUrl} 都使用主关键词「${kw}」，` +
            `该草稿发布后会造成关键词蚕食，请现在就在 scripts/outlines/ 中调整`
        )
      }
    }
  }

  console.log(`  · 关键词映射条目：${km.length}`)
} else {
  warnings.push('缺少 data/keyword-map.json，无法检查关键词冲突')
}

/** ---------- Feed ---------- */

const feedFile = path.join(DIST, 'feed.xml')
if (fs.existsSync(feedFile)) {
  const feed = fs.readFileSync(feedFile, 'utf-8')
  const items = [...feed.matchAll(/<link>([^<]+)<\/link>/g)].map((m) => m[1])
  for (const link of items) {
    if (link === `${ORIGIN}/`) continue
    if (!sitemapSet.has(link)) {
      errors.push(`Feed 中包含未发布或未收录的页面：${link}`)
    }
  }
  console.log(`  · Feed 条目：${Math.max(items.length - 1, 0)}`)
}

/** ---------- 输出 ---------- */

/** ---------- 必须存在的页面类型 ---------- */

for (const required of ['home', 'hub', 'topic', 'tag', 'article', 'policy']) {
  if (!pageTypes.get(required)) {
    errors.push(`缺少页面类型「${required}」——每种页面模板都应至少有一个实例`)
  }
}

console.log('\n=== SEO 检查 ===')
console.log(`  · 页面总数：${files.length}`)
console.log(`  · 可索引页面：${indexable}`)
console.log(`  · noindex 页面：${noindexed}`)
console.log(`  · sitemap URL：${sitemapUrls.length}`)
console.log(`  · 主关键词（互不冲突）：${primaryKeywords.size}`)
console.log(`  · CollectionPage 聚合页：${withCollection}`)
console.log(`  · 含 speakable 标记的页面：${withSpeakable}`)
console.log(
  `  · 页面类型分布：${[...pageTypes.entries()].map(([k, v]) => `${k}×${v}`).join('、')}`
)

if (warnings.length) {
  console.log('\n--- 警告 ---')
  for (const w of [...new Set(warnings)].slice(0, 30)) console.log('  ! ' + w)
  const uw = [...new Set(warnings)].length
  if (uw > 30) console.log(`  ! ……以及另外 ${uw - 30} 条警告`)
}

if (errors.length) {
  console.error('\n--- 错误 ---')
  for (const e of [...new Set(errors)].slice(0, 60)) console.error('  x ' + e)
  const ue = [...new Set(errors)].length
  if (ue > 60) console.error(`  x ……以及另外 ${ue - 60} 条错误`)
  console.error(`\n[seo] 失败：${ue} 项错误\n`)
  process.exit(1)
}

console.log('\n[seo] 全部 SEO 检查通过\n')
