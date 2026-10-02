#!/usr/bin/env node
/**
 * 根据 scripts/taxonomy/tags.mjs 与全站文章 frontmatter 生成标签体系：
 *   1. docs/tags/<slug>/index.md   每个已注册标签的聚合页
 *   2. data/tag-registry.json      标签、slug、聚合数量与是否可索引（供主题组件读取）
 *
 * 反薄弱页规则：聚合数量 < THRESHOLD 的标签页输出 noindex，
 * 页面依然存在且可抓取，但不进入站点地图与全文搜索。
 *
 * 用法：node scripts/generate-taxonomy.mjs
 */

import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import matter from 'gray-matter'

import { tags as REGISTRY, THRESHOLD } from './taxonomy/tags.mjs'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const ROOT = path.resolve(__dirname, '..')
const DOCS = path.join(ROOT, 'docs')
const TAGS_DIR = path.join(DOCS, 'tags')
const BUILD_DATE = process.env.JC_CONTENT_DATE || '2026-08-02'

/** ---------- 扫描已发布文章 ---------- */

function walk(dir, out = []) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (entry.name.startsWith('.')) continue
    const full = path.join(dir, entry.name)
    if (entry.isDirectory()) {
      if (entry.name === 'public' || entry.name === 'tags') continue
      walk(full, out)
    } else if (entry.name.endsWith('.md')) out.push(full)
  }
  return out
}

const articles = []
for (const file of walk(DOCS)) {
  const rel = path.relative(DOCS, file).replace(/\\/g, '/')
  if (rel === '404.md') continue
  const { data } = matter(fs.readFileSync(file, 'utf-8'))
  if (data.draft === true || data.noindex === true) continue

  let url = '/' + rel.replace(/(^|\/)index\.md$/, '$1').replace(/\.md$/, '/')
  url = url.replace(/\/{2,}/g, '/')
  if (!url.endsWith('/')) url += '/'
  // 只统计文章级页面（两段及以上路径），栏目页不参与标签聚合
  if (!url.replace(/^\/|\/$/g, '').includes('/')) continue

  articles.push({
    url,
    title: String(data.title || ''),
    tags: Array.isArray(data.tags) ? data.tags.map(String) : [],
    // 标签页的内容就是它聚合的这批文章，因此它的更新时间应取其中最新的一篇，
    // 而不是一个全站统一的构建日期——后者会让 sitemap 的 lastmod 失真。
    updated: String(data.updated || data.date || '')
  })
}

/** ---------- 统计标签频次 ---------- */

const counts = new Map()
for (const a of articles) {
  for (const t of a.tags) counts.set(t, (counts.get(t) || 0) + 1)
}

const registeredNames = new Set(REGISTRY.map((t) => t.name))
const unregisteredAtThreshold = [...counts.entries()]
  .filter(([name, n]) => !registeredNames.has(name) && n >= THRESHOLD)
  .sort((a, b) => b[1] - a[1])

/** ---------- 生成标签页 ---------- */

// 只清理由本脚本生成的标签子目录，保留人工维护的 docs/tags/index.md
fs.mkdirSync(TAGS_DIR, { recursive: true })
for (const entry of fs.readdirSync(TAGS_DIR, { withFileTypes: true })) {
  if (entry.isDirectory()) fs.rmSync(path.join(TAGS_DIR, entry.name), { recursive: true, force: true })
}

const entries = []

for (const tag of REGISTRY) {
  const count = counts.get(tag.name) || 0
  const indexable = count >= THRESHOLD
  if (!indexable) continue
  const dir = path.join(TAGS_DIR, tag.slug)
  fs.mkdirSync(dir, { recursive: true })

  // 该标签页的更新时间 = 它聚合的文章中最新的一篇。没有文章时回落到 BUILD_DATE。
  const tagDates = articles
    .filter((a) => a.tags.includes(tag.name))
    .map((a) => a.updated)
    .filter(Boolean)
    .sort()
  const tagUpdated = tagDates.length > 0 ? tagDates[tagDates.length - 1] : BUILD_DATE

  const faqLines =
    Array.isArray(tag.faq) && tag.faq.length > 0
      ? [
          'faq:',
          ...tag.faq.flatMap((item) => [
            `  - q: ${JSON.stringify(item.q)}`,
            `    a: ${JSON.stringify(item.a)}`
          ])
        ]
      : []

  const fm = [
    '---',
    'pageType: tag',
    `title: ${JSON.stringify(tag.title)}`,
    `description: ${JSON.stringify(tag.description)}`,
    `tag: ${JSON.stringify(tag.name)}`,
    `date: "${BUILD_DATE}"`,
    `updated: "${tagUpdated}"`,
    'author: 机场推荐评测实验室',
    'category: 标签索引',
    `tags: ${JSON.stringify(['标签索引'])}`,
    `keywords: ${JSON.stringify([tag.primaryKeyword, `${tag.name}相关文章`, '机场标签'])}`,
    'outline: [2, 3]',
    'contentType: hub',
    'intent: navigational',
    `status: ${indexable ? 'published' : 'outline'}`,
    'draft: false',
    `noindex: ${indexable ? 'false' : 'true'}`,
    'cover: /og/default-og.webp',
    `answer: ${JSON.stringify(
      `「${tag.name}」标签聚合了全站 ${count} 篇已发布内容，可以按同一主题横向浏览分散在不同栏目的文章。`
    )}`,
    `updateCondition: ${JSON.stringify('当带有该标签的已发布文章数量或范围发生变化时自动更新。')}`,
    ...faqLines,
    '---',
    ''
  ].join('\n')

  const body = []
  body.push(`# ${tag.title}`)
  body.push('')
  body.push('<AnswerBox />')
  body.push('')
  for (const p of tag.intro) {
    body.push(p)
    body.push('')
  }

  if (!indexable) {
    body.push('::: info 这个标签页当前不进入索引')
    body.push(
      `本站的规则是：聚合到 ${THRESHOLD} 篇及以上已发布文章的标签才进入站点地图与全文搜索。当前这个标签聚合了 ${count} 篇，尚未达到门槛，因此页面输出 \`noindex\` —— 它依然可以正常访问和抓取，只是不参与索引，以免产生只有几条链接的低价值页面。随着相关文章发布，它会自动转为可索引。`
    )
    body.push(':::')
    body.push('')
  }

  body.push('## 本标签下的文章')
  body.push('')
  body.push('<TaggedArticles />')
  body.push('')

  if (Array.isArray(tag.faq) && tag.faq.length > 0) {
    body.push('## 常见问题')
    body.push('')
    body.push('<FaqSection title="" />')
    body.push('')
  }

  body.push('## 继续浏览')
  body.push('')
  body.push('<div class="jc-grid jc-grid--3">')
  body.push(
    '  <TopicCard title="标签索引" icon="tag" summary="查看全部标签及各自聚合的文章数量。" link="/tags/" link-text="返回标签索引" />'
  )
  body.push(
    '  <TopicCard title="机场专题" icon="target" summary="按核心问题横向聚合的跨栏目主题页。" link="/topics/" link-text="进入专题" />'
  )
  body.push(
    '  <TopicCard title="全文搜索" icon="search" summary="在全站已发布内容中检索任意关键词。" link="/search/" link-text="打开搜索" />'
  )
  body.push('</div>')
  body.push('')

  fs.writeFileSync(path.join(dir, 'index.md'), fm + body.join('\n'), 'utf-8')

  entries.push({
    slug: tag.slug,
    name: tag.name,
    title: tag.title,
    primaryKeyword: tag.primaryKeyword,
    count,
    indexable,
    path: `/tags/${tag.slug}/`
  })
}

entries.sort((a, b) => b.count - a.count || a.name.localeCompare(b.name))

fs.writeFileSync(
  path.join(ROOT, 'data', 'tag-registry.json'),
  JSON.stringify({ threshold: THRESHOLD, generatedAt: BUILD_DATE, tags: entries }, null, 2) + '\n',
  'utf-8'
)

/** ---------- 输出 ---------- */

const indexed = entries.filter((e) => e.indexable).length
console.log(`\n=== 标签体系生成 ===`)
console.log(`  · 已注册标签：${entries.length}`)
console.log(`  · 达到 ${THRESHOLD} 篇门槛、进入索引：${indexed}`)
console.log(`  · 未达门槛、输出 noindex：${entries.length - indexed}`)
console.log(`  · 参与统计的已发布文章：${articles.length}`)

if (unregisteredAtThreshold.length) {
  console.log(`\n  ! 以下标签已达到 ${THRESHOLD} 篇但尚未注册，建议在 scripts/taxonomy/tags.mjs 中补充介绍：`)
  for (const [name, n] of unregisteredAtThreshold) console.log(`    - ${name}（${n} 篇）`)
}
console.log('')
