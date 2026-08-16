import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import matter from 'gray-matter'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const ROOT = path.resolve(__dirname, '..')
const DOCS = path.join(ROOT, 'docs')

function walk(dir, out = []) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (entry.name.startsWith('.')) continue
    const full = path.join(dir, entry.name)
    if (entry.isDirectory()) {
      if (entry.name === 'public' || entry.name === 'tags') continue
      walk(full, out)
    } else if (entry.name.endsWith('.md')) {
      out.push(full)
    }
  }
  return out
}

const files = walk(DOCS)
const keywordMap = []
const contentPlan = []

for (const file of files) {
  const rel = path.relative(DOCS, file).replace(/\\/g, '/')
  if (rel === '404.md') continue
  const content = fs.readFileSync(file, 'utf-8')
  const { data } = matter(content)
  
  let url = '/' + rel.replace(/(^|\/)index\.md$/, '$1').replace(/\.md$/, '/')
  url = url.replace(/\/{2,}/g, '/')
  if (!url.endsWith('/')) url += '/'

  const primaryKeyword = data.keywords?.[0] || data.title?.split(/[:：｜|]/)[0] || url

  keywordMap.push({
    slug: url,
    primaryKeyword: primaryKeyword.trim(),
    pillar: '/' + url.replace(/^\//, '').split('/')[0] + '/',
    intent: data.intent || 'informational',
    pageType: data.pageType || 'article'
  })

  contentPlan.push({
    url: url,
    title: data.title || '',
    pillar: '/' + url.replace(/^\//, '').split('/')[0] + '/',
    primaryKeyword: primaryKeyword.trim(),
    status: data.status || 'published'
  })
}

fs.writeFileSync(path.join(ROOT, 'data', 'keyword-map.json'), JSON.stringify(keywordMap, null, 2), 'utf-8')
fs.writeFileSync(path.join(ROOT, 'data', 'content-plan.json'), JSON.stringify(contentPlan, null, 2), 'utf-8')
console.log(`Generated data/keyword-map.json and data/content-plan.json with ${keywordMap.length} entries.`)
