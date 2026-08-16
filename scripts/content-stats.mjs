#!/usr/bin/env node
/**
 * 内容统计。汇总构建产物的页面数量、正文体量与索引覆盖情况，
 * 用于生成验收报告，也可以在日常写作中检查大纲是否达到最小体量要求。
 *
 * 用法：node scripts/content-stats.mjs
 */

import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const ROOT = path.resolve(__dirname, '..')
const DIST = path.join(ROOT, 'docs', '.vitepress', 'dist')

if (!fs.existsSync(DIST)) {
  console.error('[stats] 构建目录不存在，请先运行 npm run build')
  process.exit(1)
}

function walk(dir, out = []) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name)
    if (entry.isDirectory()) {
      if (entry.name === 'pagefind' || entry.name === 'assets') continue
      walk(full, out)
    } else if (entry.name.endsWith('.html')) out.push(full)
  }
  return out
}

/**
 * 取出正文容器的完整 HTML。
 * 卡片组件本身也是 <article>，因此必须做嵌套配对，不能用非贪婪正则一次匹配。
 */
function extractProse(html) {
  const start = html.search(/<article class="jc-prose/)
  if (start === -1) return null
  const open = /<article\b/g
  const close = /<\/article>/g
  open.lastIndex = start + 1
  close.lastIndex = start + 1
  let depth = 1
  let cursor = start + 1
  while (depth > 0) {
    open.lastIndex = cursor
    close.lastIndex = cursor
    const o = open.exec(html)
    const c = close.exec(html)
    if (!c) return html.slice(start)
    if (o && o.index < c.index) {
      depth++
      cursor = o.index + 1
    } else {
      depth--
      cursor = c.index + 1
      if (depth === 0) return html.slice(start, c.index)
    }
  }
  return html.slice(start)
}

function plainTextLength(html) {
  return html
    .replace(/<script[\s\S]*?<\/script>/g, '')
    .replace(/<style[\s\S]*?<\/style>/g, '')
    .replace(/<[^>]+>/g, '')
    .replace(/&[a-z#0-9]+;/gi, '')
    .replace(/\s/g, '').length
}

const files = walk(DIST)
const drafts = []
const published = []
const hubs = []
const topics = []
const tagsIndexable = []
const tagsThin = []

for (const file of files) {
  const html = fs.readFileSync(file, 'utf-8')
  const rel = path.relative(DIST, file).replace(/\\/g, '/')
  if (rel === '404.html') continue

  const prose = extractProse(html)
  if (!prose) continue

  const record = { file: rel, chars: plainTextLength(prose) }
  const pageType = (html.match(/<meta name="jc:page-type" content="([^"]+)"/) || [])[1]
  const isNoindex = /name="robots"[^>]*content="[^"]*noindex/.test(html)

  // 用机器标记判断草稿，而不是页面上的中文提示文案
  if (/<meta name="jc:page-status" content="draft">/.test(html)) drafts.push(record)
  else if (pageType === 'topic') topics.push(record)
  else if (pageType === 'tag') (isNoindex ? tagsThin : tagsIndexable).push(record)
  else if (rel.split('/').length === 2) hubs.push(record)
  else published.push(record)
}

const byChars = (a, b) => a.chars - b.chars
for (const arr of [drafts, published, hubs, topics, tagsIndexable, tagsThin]) arr.sort(byChars)

const sum = (arr) => arr.reduce((s, x) => s + x.chars, 0)
const avg = (arr) => (arr.length ? Math.round(sum(arr) / arr.length) : 0)

function report(label, arr, min) {
  const below = arr.filter((x) => x.chars < min)
  console.log(`\n${label}`)
  console.log(`  数量：${arr.length}`)
  if (!arr.length) return
  console.log(`  正文字符：最短 ${arr[0].chars}（${arr[0].file}）`)
  console.log(`            最长 ${arr[arr.length - 1].chars}（${arr[arr.length - 1].file}）`)
  console.log(`            平均 ${avg(arr)}，合计 ${sum(arr)}`)
  console.log(`  低于 ${min} 字：${below.length ? below.map((x) => `${x.file}(${x.chars})`).join('、') : '无'}`)
}

const sitemap = fs.existsSync(path.join(DIST, 'sitemap.xml'))
  ? (fs.readFileSync(path.join(DIST, 'sitemap.xml'), 'utf-8').match(/<loc>/g) || []).length
  : 0

const pagefindPages = files.filter((f) =>
  fs.readFileSync(f, 'utf-8').includes('data-pagefind-body')
).length

console.log('\n=== 机场云内容统计 ===')
console.log(`  HTML 页面总数：${files.length}`)
console.log(`  sitemap URL：${sitemap}`)
console.log(`  Pagefind 索引页面：${pagefindPages}`)

report('栏目页 / 分类页（要求 ≥ 800 字）', hubs, 800)
report('专题页（要求 ≥ 1200 字）', topics, 1200)
report('已发布文章（要求 ≥ 800 字）', published, 800)
report('可索引标签页（要求 ≥ 600 字）', tagsIndexable, 600)
report('noindex 标签页（不参与索引，无字数要求）', tagsThin, 0)
report('写作大纲（要求 ≥ 600 字）', drafts, 600)

const total =
  sum(hubs) + sum(topics) + sum(published) + sum(tagsIndexable) + sum(tagsThin) + sum(drafts)
console.log(`\n  正文总字符数：${total}\n`)
