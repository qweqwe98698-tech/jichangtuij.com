import { createContentLoader } from 'vitepress'
import { categoryMap } from '../../data/categories'

export interface ArticleMeta {
  url: string
  title: string
  description: string
  date: string
  updated: string
  author: string
  category: string
  categoryTitle: string
  tags: string[]
  contentType: string
  intent: string
  featured: boolean
  readingTime: number
  answer: string
}

export interface ArticlesData {
  /** 正式发布的文章（不含首页与栏目页） */
  articles: ArticleMeta[]
  /** 栏目页 */
  hubs: ArticleMeta[]
  /** 统计：总页面 / 可索引 / 草稿 */
  stats: { total: number; published: number; drafts: number }
}

function normalize(url: string): string {
  let u = url || '/'
  u = u.replace(/index\.html$/, '')
  u = u.replace(/\.html$/, '/')
  if (!u.startsWith('/')) u = `/${u}`
  if (!u.endsWith('/')) u = `${u}/`
  return u.replace(/\/{2,}/g, '/')
}

function toDate(v: unknown): string {
  if (!v) return ''
  if (v instanceof Date) return v.toISOString().slice(0, 10)
  return String(v).slice(0, 10)
}

declare const data: ArticlesData
export { data }

export default createContentLoader('**/*.md', {
  includeSrc: false,
  excerpt: false,
  transform(raw): ArticlesData {
    const all = raw.map((page) => {
      const fm = page.frontmatter as Record<string, any>
      const url = normalize(page.url)
      const slug = url.replace(/^\//, '').split('/')[0]
      return {
        url,
        slug,
        isHub: url.replace(/^\/|\/$/g, '').split('/').filter(Boolean).length <= 1,
        draft: fm.draft === true,
        noindex: fm.noindex === true,
        meta: {
          url,
          title: String(fm.title || ''),
          description: String(fm.description || ''),
          date: toDate(fm.date),
          updated: toDate(fm.updated || fm.date),
          author: String(fm.author || '机场推荐评测实验室'),
          category: slug,
          categoryTitle: categoryMap[slug]?.title || '',
          tags: Array.isArray(fm.tags) ? fm.tags.map(String) : [],
          contentType: String(fm.contentType || 'guide'),
          intent: String(fm.intent || 'informational'),
          featured: fm.featured === true,
          readingTime: Number(fm.readingTime || 0),
          answer: String(fm.answer || '')
        } as ArticleMeta
      }
    })

    const live = all.filter((p) => !p.draft && !p.noindex && p.url !== '/404.html/')

    const articles = live
      .filter((p) => !p.isHub)
      .map((p) => p.meta)
      .sort((a, b) => (a.updated < b.updated ? 1 : a.updated > b.updated ? -1 : a.title.localeCompare(b.title)))

    const hubs = live
      .filter((p) => p.isHub && p.url !== '/')
      .map((p) => p.meta)

    return {
      articles,
      hubs,
      stats: {
        total: all.length,
        published: live.length,
        drafts: all.filter((p) => p.draft).length
      }
    }
  }
})
