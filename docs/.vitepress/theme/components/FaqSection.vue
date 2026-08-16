<script setup lang="ts">
/**
 * FAQ 模块。
 * 内容来自 frontmatter.faq，与 FAQPage 结构化数据同源，
 * 保证「页面上显示的问答」与「输出给搜索引擎的问答」完全一致。
 */
import { computed } from 'vue'
import { useData } from 'vitepress'
import JcIcon from './JcIcon.vue'

const props = withDefaults(defineProps<{ title?: string; id?: string }>(), {
  title: '常见问题',
  id: 'faq'
})

const { frontmatter } = useData()

const items = computed(() => {
  const raw = frontmatter.value.faq
  if (!Array.isArray(raw)) return []
  return raw
    .filter((i: any) => i && i.q && i.a)
    .map((i: any) => ({ q: String(i.q), a: String(i.a) }))
})
</script>

<template>
  <section v-if="items.length" class="jc-faq-section" :id="title ? undefined : id">
    <!-- 标题为空时不渲染空的 H2：上层页面通常已经有「常见问题」这一级标题 -->
    <h2 v-if="title" :id="id">{{ title }}</h2>
    <div class="jc-faq">
      <details v-for="(item, i) in items" :key="i" class="jc-faq__item" :open="i === 0">
        <summary class="jc-faq__q">
          <span>{{ item.q }}</span>
          <JcIcon name="plus" :size="16" class="jc-faq__icon" />
        </summary>
        <div class="jc-faq__a">{{ item.a }}</div>
      </details>
    </div>
  </section>
</template>
