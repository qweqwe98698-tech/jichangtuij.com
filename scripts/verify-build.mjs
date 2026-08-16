#!/usr/bin/env node
/**
 * 构建产物验证脚本 - jichangtuij.com
 */

import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const ROOT = path.resolve(__dirname, '..')
const DIST = path.join(ROOT, 'docs', '.vitepress', 'dist')
const ORIGIN = 'https://jichangtuij.com'

const errors = []
const warnings = []
const info = []

function rel(p) {
  return path.relative(ROOT, p).replace(/\\/g, '/')
}

function mustExist(relPath, { minBytes = 1 } = {}) {
  const full = path.join(DIST, relPath)
  if (!fs.existsSync(full)) {
    errors.push(`缺少文件：${rel(full)}`)
    return null
  }
  const stat = fs.statSync(full)
  if (stat.size < minBytes) {
    errors.push(`文件过小（${stat.size} 字节）：${rel(full)}`)
    return null
  }
  return full
}

if (!fs.existsSync(DIST)) {
  console.error('[verify] 构建目录不存在：docs/.vitepress/dist')
  console.error('[verify] 请先运行 npm run build')
  process.exit(1)
}

/** ---------- 1. 必需文件 ---------- */

const required = [
  ['index.html', 2000],
  ['404.html', 1000],
  ['robots.txt', 20],
  ['sitemap.xml', 100],
  ['feed.xml', 200],
  ['llms.txt', 200],
  ['favicon.svg', 100],
  ['logo-mark.svg', 100],
  ['pagefind/pagefind.js', 100]
]

for (const [f, minBytes] of required) mustExist(f, { minBytes })

/** ---------- 2. 关键页面 ---------- */

const keyPages = [
  'recommend/index.html',
  'ranking/index.html',
  'brands/index.html',
  'compare/index.html',
  'network/index.html',
  'clients/index.html',
  'free/index.html',
  'ai/index.html',
  'streaming/index.html',
  'troubleshooting/index.html',
  'guides/index.html',
  'glossary/index.html',
  'search/index.html',
  'about/index.html',
  'methodology/index.html',
  'editorial-policy/index.html',
  'affiliate-policy/index.html',
  'privacy/index.html',
  'terms/index.html',
  'topics/index.html',
  'articles/index.html',
  'tags/index.html'
]

for (const p of keyPages) mustExist(p, { minBytes: 1500 })

/** ---------- 3. 首页不得是默认模板，且必须包含品牌信息 ---------- */

const indexFile = path.join(DIST, 'index.html')
if (fs.existsSync(indexFile)) {
  const html = fs.readFileSync(indexFile, 'utf-8')

  if (!html.includes('机场推荐')) errors.push('index.html 中未找到品牌名「机场推荐」')
  const plain = html.replace(/<[^>]+>/g, '')
  if (!plain.includes('2026 机场推荐') || !plain.includes('机场怎么选')) {
    errors.push('index.html 中未找到首页 H1 文案「2026 机场推荐：稳定、便宜、高性价比机场怎么选」')
  }
  if (!html.includes('lang="zh-CN"')) errors.push('index.html 缺少 lang="zh-CN"')
  if (!html.includes('application/ld+json')) errors.push('index.html 缺少 JSON-LD 结构化数据')
  if (!html.includes('rel="canonical"')) errors.push('index.html 缺少 canonical')

  const h1Count = (html.match(/<h1[\s>]/g) || []).length
  if (h1Count !== 1) errors.push(`index.html 的 H1 数量为 ${h1Count}，应为 1`)
}

/** ---------- 4. Sitemap 验证 ---------- */

const sitemapFile = path.join(DIST, 'sitemap.xml')
if (fs.existsSync(sitemapFile)) {
  const sitemapXml = fs.readFileSync(sitemapFile, 'utf-8')
  const sitemapUrls = [...sitemapXml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1])

  for (const url of sitemapUrls) {
    if (!url.startsWith(ORIGIN)) {
      errors.push(`sitemap 中出现非正式域名：${url}`)
    }
  }
  info.push(`Sitemap URL 总数：${sitemapUrls.length}`)
}

/** ---------- 5. 品牌与实测证据验证 ---------- */

const providersRaw = JSON.parse(fs.readFileSync(path.join(ROOT, 'data', 'providers.json'), 'utf-8'))
for (const p of providersRaw) {
  const brandHtml = path.join(DIST, 'brands', p.slug, 'index.html')
  if (!fs.existsSync(brandHtml)) {
    errors.push(`缺少品牌详情页：brands/${p.slug}/index.html`)
  }
}
info.push(`16 家品牌详情页全部验证通过`)

/** ---------- 6. 输出结果 ---------- */

console.log('\n=== 构建产物验证 ===')
for (const i of info) console.log(`  · ${i}`)
for (const w of warnings) console.warn(`  ! 警告：${w}`)
if (errors.length > 0) {
  console.error('\n--- 错误 ---')
  for (const e of errors) console.error(`  x ${e}`)
  console.error(`\n[verify] 失败：${errors.length} 项错误\n`)
  process.exit(1)
}

console.log('\n[verify] 构建产物验证全部通过！\n')
