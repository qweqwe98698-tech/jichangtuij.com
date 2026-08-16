import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const REGISTRY = path.resolve(__dirname, '../../../../data/tag-registry.json')

export interface TagEntry {
  /** URL 片段，ASCII kebab-case */
  slug: string
  /** 中文标签名，与文章 frontmatter.tags 中的值完全一致 */
  name: string
  /** 标签页标题 */
  title: string
  /** 标签页主关键词 */
  primaryKeyword: string
  /** 已发布文章数量 */
  count: number
  /** 是否达到可索引门槛 */
  indexable: boolean
  path: string
}

declare const data: { tags: TagEntry[]; threshold: number }
export { data }

export default {
  watch: [REGISTRY],
  load(): { tags: TagEntry[]; threshold: number } {
    if (!fs.existsSync(REGISTRY)) return { tags: [], threshold: 3 }
    const raw = JSON.parse(fs.readFileSync(REGISTRY, 'utf-8'))
    return { tags: raw.tags || [], threshold: raw.threshold ?? 3 }
  }
}
