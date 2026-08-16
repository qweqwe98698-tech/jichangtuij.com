/**
 * 构建期内容索引（Node 侧）。
 * config.mts、sitemap 过滤、feed 生成与检查脚本都通过这里读取全站 Markdown 的 frontmatter。
 */

import fs from 'node:fs'
import path from 'node:path'
import matter from 'gray-matter'

export interface PageRecord {
  /** 绝对文件路径 */
  file: string
  /** 相对 docs 的路径，例如 network/what-is-iepl/index.md */
  relativePath: string
  /** 规范化站内路径，始终以 / 开头并以 / 结尾 */
  url: string
  title: string
  description: string
  date: string
  updated: string
  author: string
  category: string
  tags: string[]
  keywords: string[]
  contentType: string
  intent: string
  status: string
  cover: string
  canonical: string
  answer: string
  draft: boolean
  noindex: boolean
  featured: boolean
  layout: string
  /** 正文字符数（去掉 frontmatter 后） */
  bodyChars: number
}

const IGNORED = new Set(['node_modules', '.vitepress', 'public'])

function walk(dir: string, out: string[] = []): string[] {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (entry.name.startsWith('.') && entry.name !== '.vitepress') continue
    const full = path.join(dir, entry.name)
    if (entry.isDirectory()) {
      if (IGNORED.has(entry.name)) continue
      walk(full, out)
    } else if (entry.isFile() && entry.name.endsWith('.md')) {
      out.push(full)
    }
  }
  return out
}

/** docs 相对路径 → 站内规范 URL */
export function relativePathToUrl(relativePath: string): string {
  let p = relativePath.replace(/\\/g, '/')
  if (p === '404.md') return '/404.html'
  p = p.replace(/(^|\/)index\.md$/, '$1')
  p = p.replace(/\.md$/, '/')
  if (!p.startsWith('/')) p = `/${p}`
  if (!p.endsWith('/')) p = `${p}/`
  return p.replace(/\/{2,}/g, '/')
}

function toStringValue(v: unknown, fallback = ''): string {
  if (v === undefined || v === null) return fallback
  if (v instanceof Date) return v.toISOString().slice(0, 10)
  return String(v)
}

function toArray(v: unknown): string[] {
  if (Array.isArray(v)) return v.map((x) => String(x))
  if (typeof v === 'string' && v.trim()) return [v.trim()]
  return []
}

export function scanPages(docsDir: string): PageRecord[] {
  const files = walk(docsDir)
  const records: PageRecord[] = []

  for (const file of files) {
    const raw = fs.readFileSync(file, 'utf-8')
    const { data, content } = matter(raw)
    const relativePath = path.relative(docsDir, file).replace(/\\/g, '/')
    const url = relativePathToUrl(relativePath)

    records.push({
      file,
      relativePath,
      url,
      title: toStringValue(data.title),
      description: toStringValue(data.description),
      date: toStringValue(data.date),
      updated: toStringValue(data.updated || data.date),
      author: toStringValue(data.author, '机场推荐评测实验室'),
      category: toStringValue(data.category),
      tags: toArray(data.tags),
      keywords: toArray(data.keywords),
      contentType: toStringValue(data.contentType, 'guide'),
      intent: toStringValue(data.intent, 'informational'),
      status: toStringValue(data.status, data.draft === false ? 'published' : 'outline'),
      cover: toStringValue(data.cover, '/og/default-og.webp'),
      canonical: toStringValue(data.canonical),
      answer: toStringValue(data.answer),
      draft: data.draft === true,
      noindex: data.noindex === true,
      featured: data.featured === true,
      layout: toStringValue(data.layout),
      bodyChars: content.replace(/\s/g, '').length
    })
  }

  return records.sort((a, b) => a.url.localeCompare(b.url))
}

/** 可被索引的页面：非草稿、非 noindex、非 404、非搜索页 */
export function isIndexable(p: PageRecord): boolean {
  if (p.draft || p.noindex) return false
  if (p.url === '/404.html') return false
  if (p.url === '/search/') return false
  return true
}

/** 正式发布的文章（排除栏目页与首页），按更新时间倒序 */
export function publishedArticles(records: PageRecord[]): PageRecord[] {
  return records
    .filter(isIndexable)
    .filter((p) => p.url !== '/')
    .filter((p) => p.url.replace(/^\/|\/$/g, '').includes('/'))
    .sort((a, b) => (a.updated < b.updated ? 1 : a.updated > b.updated ? -1 : 0))
}

let cache: PageRecord[] | null = null

export function getPages(docsDir: string, fresh = false): PageRecord[] {
  if (!cache || fresh) cache = scanPages(docsDir)
  return cache
}
