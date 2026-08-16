<script setup lang="ts">
/**
 * 文章列表。只显示正式发布内容；数据源为空时给出明确说明，不留白也不编造条目。
 */
import { computed } from 'vue'
import ArticleCard from './ArticleCard.vue'
import { data as articleData } from '../data/articles.data'

const props = withDefaults(
  defineProps<{
    /** 限定栏目 slug */
    category?: string
    /** 限定标签 */
    tag?: string
    /** 排除的 URL（通常是当前页） */
    exclude?: string
    limit?: number
    columns?: 2 | 3
    emptyText?: string
    showCategory?: boolean
  }>(),
  {
    category: '',
    tag: '',
    exclude: '',
    limit: 6,
    columns: 3,
    emptyText: '',
    showCategory: true
  }
)

const list = computed(() => {
  let items = articleData.articles
  if (props.category) items = items.filter((a) => a.category === props.category)
  if (props.tag) items = items.filter((a) => a.tags.includes(props.tag))
  if (props.exclude) items = items.filter((a) => a.url !== props.exclude)
  return items.slice(0, props.limit)
})
</script>

<template>
  <div v-if="list.length" class="jc-grid" :class="columns === 2 ? 'jc-grid--2' : 'jc-grid--3'">
    <ArticleCard
      v-for="a in list"
      :key="a.url"
      :article="a"
      :show-category="showCategory"
    />
  </div>

  <p v-else class="jc-empty">
    {{
      emptyText ||
      '本栏目的文章正在写作与核验中。我们只发布已经完成事实核验的内容，完成后会出现在这里，并同步进入站点更新记录。'
    }}
  </p>
</template>
