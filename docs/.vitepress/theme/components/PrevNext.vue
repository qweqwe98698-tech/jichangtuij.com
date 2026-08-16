<script setup lang="ts">
/**
 * 上一篇 / 下一篇。基于同栏目内已发布文章的更新时间顺序。
 */
import { computed } from 'vue'
import { useRoute } from 'vitepress'
import { data as articleData } from '../data/articles.data'

const route = useRoute()

const currentUrl = computed(() => route.path.replace(/index\.html$/, '').replace(/\.html$/, '/'))
const seg = computed(() => currentUrl.value.replace(/^\//, '').split('/')[0])

const siblings = computed(() =>
  articleData.articles
    .filter((a) => a.category === seg.value)
    .slice()
    .sort((a, b) => a.url.localeCompare(b.url))
)

const index = computed(() => siblings.value.findIndex((a) => a.url === currentUrl.value))
const prev = computed(() => (index.value > 0 ? siblings.value[index.value - 1] : null))
const next = computed(() =>
  index.value >= 0 && index.value < siblings.value.length - 1
    ? siblings.value[index.value + 1]
    : null
)
</script>

<template>
  <nav v-if="prev || next" class="jc-prevnext" aria-label="同栏目文章导航">
    <a v-if="prev" class="jc-prevnext__item" :href="prev.url" rel="prev">
      <span class="jc-prevnext__label">上一篇</span>
      <span class="jc-prevnext__title">{{ prev.title }}</span>
    </a>
    <span v-else></span>

    <a v-if="next" class="jc-prevnext__item jc-prevnext__item--next" :href="next.url" rel="next">
      <span class="jc-prevnext__label">下一篇</span>
      <span class="jc-prevnext__title">{{ next.title }}</span>
    </a>
  </nav>
</template>
