<script setup lang="ts">
/**
 * GEO「关键事实 / 核心结论」模块。
 * 可以传 items，也可以读取 frontmatter.keyFacts。
 */
import { computed } from 'vue'
import { useData } from 'vitepress'

const props = withDefaults(
  defineProps<{ title?: string; items?: string[]; source?: string }>(),
  { title: '核心结论', items: undefined, source: 'keyFacts' }
)

const { frontmatter } = useData()

const list = computed<string[]>(() => {
  if (props.items?.length) return props.items
  const fromFm = frontmatter.value[props.source]
  return Array.isArray(fromFm) ? fromFm.map(String) : []
})
</script>

<template>
  <section v-if="list.length" class="jc-facts">
    <h2 class="jc-facts__title">{{ title }}</h2>
    <ul class="jc-facts__list">
      <li v-for="(item, i) in list" :key="i">{{ item }}</li>
    </ul>
  </section>
</template>
