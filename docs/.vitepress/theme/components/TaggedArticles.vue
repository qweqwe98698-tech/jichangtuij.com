<script setup lang="ts">
/**
 * 标签页的文章列表。
 * 与 config.mts 中生成的 ItemList 结构化数据同源：两者都从文章 frontmatter 的 tags 字段计算，
 * 因此不会出现「结构化数据里有、页面上没有」的情况。
 */
import { computed } from 'vue'
import { useData } from 'vitepress'
import ArticleCard from './ArticleCard.vue'
import { data as articleData } from '../data/articles.data'

const { frontmatter } = useData()

const tag = computed(() => String(frontmatter.value.tag || ''))

const list = computed(() =>
  articleData.articles
    .filter((a) => a.tags.includes(tag.value))
    .slice()
    .sort((a, b) =>
      a.updated < b.updated ? 1 : a.updated > b.updated ? -1 : a.title.localeCompare(b.title)
    )
)

/** 这些文章分布在哪些栏目，用于给读者一个横向视角 */
const spread = computed(() => {
  const map = new Map<string, { title: string; path: string; n: number }>()
  for (const a of list.value) {
    const key = a.category
    if (!map.has(key)) map.set(key, { title: a.categoryTitle, path: `/${key}/`, n: 0 })
    map.get(key)!.n++
  }
  return [...map.values()].sort((a, b) => b.n - a.n)
})
</script>

<template>
  <div class="jc-tagpage">
    <p v-if="spread.length" class="jc-tagpage__spread">
      这个标签横跨
      <template v-for="(s, i) in spread" :key="s.path">
        <a :href="s.path">{{ s.title }}</a><span v-if="i < spread.length - 1">、</span>
      </template>
      {{ spread.length > 1 ? '等' : '' }}{{ spread.length }} 个栏目，共 {{ list.length }} 篇已发布文章。
    </p>

    <div v-if="list.length" class="jc-grid jc-grid--2">
      <ArticleCard v-for="a in list" :key="a.url" :article="a" />
    </div>

    <p v-else class="jc-empty">
      这个标签下暂时还没有正式发布的文章。相关选题正在写作与核验中，完成后会自动出现在这里。
    </p>
  </div>
</template>

<style scoped>
.jc-tagpage__spread {
  margin-bottom: var(--jc-space-5);
  padding: var(--jc-space-4) var(--jc-space-5);
  border: 1px solid var(--jc-border);
  border-left: 3px solid var(--jc-cyan);
  border-radius: var(--jc-radius-md);
  background: var(--jc-surface-sunken);
  font-size: var(--jc-text-sm);
  line-height: var(--jc-leading-relaxed);
}
</style>
