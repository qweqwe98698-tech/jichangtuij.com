<script setup lang="ts">
import { computed } from 'vue'
import { useData, useRoute } from 'vitepress'
import JcIcon from './JcIcon.vue'
import { categoryMap } from '../../data/categories'
import { data as tagData } from '../data/tags.data'

const { frontmatter } = useData()
const route = useRoute()

function fmt(v: unknown): string {
  if (!v) return ''
  return String(v).slice(0, 10)
}

const category = computed(() => {
  const seg = route.path.replace(/^\//, '').split('/')[0]
  return categoryMap[seg]
})

const published = computed(() => fmt(frontmatter.value.date))
const updated = computed(() => fmt(frontmatter.value.updated || frontmatter.value.date))
const author = computed(() => String(frontmatter.value.author || '机场推荐评测实验室'))
const readingTime = computed(() => Number(frontmatter.value.readingTime || 0))
/**
 * 已注册并生成了聚合页的标签渲染成链接，其余只作为普通文本。
 * 这样可以保证站内不会出现指向不存在页面的链接。
 */
const tagPath = computed(() =>
  Object.fromEntries(tagData.tags.map((t) => [t.name, t.path]))
)

const tags = computed(() =>
  (Array.isArray(frontmatter.value.tags) ? frontmatter.value.tags.map(String) : []).map((t) => ({
    name: t,
    path: tagPath.value[t] || ''
  }))
)
</script>

<template>
  <div class="jc-meta">
    <span v-if="category" class="jc-meta__item">
      <JcIcon name="layers" :size="14" />
      <a :href="category.path">{{ category.title }}</a>
    </span>

    <span class="jc-meta__item">
      <JcIcon name="user" :size="14" />
      <a href="/about/">{{ author }}</a>
    </span>

    <span v-if="published" class="jc-meta__item">
      <JcIcon name="calendar" :size="14" />
      发布 <time :datetime="published">{{ published }}</time>
    </span>

    <span v-if="updated" class="jc-meta__item">
      <JcIcon name="clock" :size="14" />
      更新 <time :datetime="updated">{{ updated }}</time>
    </span>

    <span v-if="readingTime > 0" class="jc-meta__item">
      <JcIcon name="book" :size="14" />
      约 {{ readingTime }} 分钟
    </span>

    <span v-if="tags.length" class="jc-meta__item jc-meta__tags">
      <JcIcon name="tag" :size="14" />
      <template v-for="t in tags" :key="t.name">
        <a v-if="t.path" class="jc-tag" :href="t.path">{{ t.name }}</a>
        <span v-else class="jc-tag jc-tag--muted">{{ t.name }}</span>
      </template>
    </span>
  </div>
</template>

<style scoped>
.jc-meta__tags {
  flex-wrap: wrap;
  gap: 5px;
}
</style>
