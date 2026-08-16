<script setup lang="ts">
/**
 * GEO「快速回答」模块。
 * 内容来自 frontmatter.answer（40—80 个中文字符），确保页面显示与结构化数据一致。
 */
import { computed } from 'vue'
import { useData } from 'vitepress'
import JcIcon from './JcIcon.vue'

const props = defineProps<{ text?: string; label?: string }>()
const { frontmatter } = useData()

const content = computed(() => props.text || String(frontmatter.value.answer || '').trim())
</script>

<template>
  <section v-if="content" class="jc-answer" aria-labelledby="jc-answer-label">
    <p id="jc-answer-label" class="jc-answer__label">
      <JcIcon name="target" :size="15" />
      {{ label || '快速回答' }}
    </p>
    <p class="jc-answer__text">{{ content }}</p>
  </section>
</template>
