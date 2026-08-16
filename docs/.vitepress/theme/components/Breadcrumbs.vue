<script setup lang="ts">
import { computed } from 'vue'
import { useData, useRoute } from 'vitepress'
import { categoryMap } from '../../data/categories'

const route = useRoute()
const { frontmatter } = useData()

const crumbs = computed(() => {
  const url = route.path.replace(/index\.html$/, '').replace(/\.html$/, '/')
  const segs = url.replace(/^\/|\/$/g, '').split('/').filter(Boolean)
  const items: { text: string; link?: string }[] = [{ text: '首页', link: '/' }]

  if (segs.length > 0) {
    const cat = categoryMap[segs[0]]
    if (cat) {
      if (segs.length === 1) items.push({ text: cat.title })
      else items.push({ text: cat.title, link: cat.path })
    }
  }

  if (segs.length > 1) {
    items.push({ text: String(frontmatter.value.title || '当前页面') })
  }

  return items
})
</script>

<template>
  <nav class="jc-breadcrumbs" aria-label="面包屑导航" data-pagefind-ignore>
    <template v-for="(c, i) in crumbs" :key="i">
      <span v-if="i > 0" class="jc-breadcrumbs__sep" aria-hidden="true">›</span>
      <a v-if="c.link" :href="c.link">{{ c.text }}</a>
      <span v-else aria-current="page">{{ c.text }}</span>
    </template>
  </nav>
</template>
