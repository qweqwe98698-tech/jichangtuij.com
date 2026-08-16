<script setup lang="ts">
/**
 * 相关文章推荐（最多 6 篇）。
 * 优先级：手动指定 → 同一栏目 → 相同内容类型 → 相同标签 → 支柱栏目关系。
 * 只推荐正式发布内容，绝不随机填充无关文章。
 */
import { computed } from 'vue'
import { useData, useRoute } from 'vitepress'
import ArticleCard from './ArticleCard.vue'
import { data as articleData } from '../data/articles.data'
import { categoryMap } from '../../data/categories'
import type { ArticleMeta } from '../data/articles.data'

const props = withDefaults(defineProps<{ limit?: number; title?: string }>(), {
  limit: 6,
  title: '相关阅读'
})

const { frontmatter } = useData()
const route = useRoute()

const currentUrl = computed(() =>
  route.path.replace(/index\.html$/, '').replace(/\.html$/, '/')
)

const related = computed<ArticleMeta[]>(() => {
  const all = articleData.articles.filter((a) => a.url !== currentUrl.value)
  const picked: ArticleMeta[] = []
  const seen = new Set<string>()

  const push = (item?: ArticleMeta) => {
    if (!item || seen.has(item.url) || picked.length >= props.limit) return
    seen.add(item.url)
    picked.push(item)
  }

  // 1. 手动指定
  const manual = Array.isArray(frontmatter.value.related)
    ? frontmatter.value.related.map(String)
    : []
  for (const url of manual) push(all.find((a) => a.url === url))

  const seg = currentUrl.value.replace(/^\//, '').split('/')[0]
  const type = String(frontmatter.value.contentType || '')
  const tags = Array.isArray(frontmatter.value.tags) ? frontmatter.value.tags.map(String) : []

  // 2. 同一栏目
  for (const a of all) if (a.category === seg) push(a)
  // 3. 相同内容类型
  for (const a of all) if (type && a.contentType === type) push(a)
  // 4. 相同标签
  for (const a of all) if (tags.some((t) => a.tags.includes(t))) push(a)
  // 5. 相关栏目
  const relatedCats = categoryMap[seg]?.related || []
  for (const a of all) if (relatedCats.includes(a.category)) push(a)

  return picked
})
</script>

<template>
  <section v-if="related.length" class="jc-related" aria-labelledby="jc-related-title">
    <h2 id="jc-related-title" class="jc-section-title" style="font-size: var(--jc-text-lg)">
      {{ title }}
    </h2>
    <div class="jc-grid jc-grid--3">
      <ArticleCard v-for="a in related" :key="a.url" :article="a" />
    </div>
  </section>
</template>
