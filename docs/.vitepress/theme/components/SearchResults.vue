<script setup lang="ts">
import type { SearchHit } from '../composables/useSearch'

defineProps<{
  hits: SearchHit[]
  activeIndex: number
}>()

const emit = defineEmits<{ (e: 'select', hit: SearchHit): void; (e: 'hover', i: number): void }>()
</script>

<template>
  <ul class="jc-search-results" role="listbox" aria-label="搜索结果">
    <li v-for="(hit, i) in hits" :key="hit.id" role="presentation">
      <a
        class="jc-search-result"
        :class="{ 'is-active': i === activeIndex }"
        :href="hit.url"
        role="option"
        :aria-selected="i === activeIndex"
        :id="`jc-search-option-${i}`"
        @click="emit('select', hit)"
        @mousemove="emit('hover', i)"
      >
        <div class="jc-search-result__title">{{ hit.title }}</div>
        <!-- excerpt 由 Pagefind 生成，内含 <mark> 高亮标记 -->
        <div class="jc-search-result__excerpt" v-html="hit.excerpt"></div>
        <div class="jc-search-result__meta">
          <span v-if="hit.category">{{ hit.category }}</span>
          <span v-if="hit.updated">更新于 {{ hit.updated }}</span>
          <span>{{ hit.url }}</span>
        </div>
      </a>
    </li>
  </ul>
</template>

<style scoped>
.jc-search-results {
  list-style: none;
  display: grid;
  gap: 2px;
}
</style>
