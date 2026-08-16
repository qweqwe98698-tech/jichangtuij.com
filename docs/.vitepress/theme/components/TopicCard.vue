<script setup lang="ts">
/**
 * 主题卡片：用于首页「按需求选择」与栏目页「精选专题」。
 * 每张卡片都必须指向真实存在的站内页面。
 */
import JcIcon from './JcIcon.vue'

defineProps<{
  title: string
  icon: string
  summary: string
  audience?: string
  link: string
  linkText?: string
  tone?: 'default' | 'warn'
}>()
</script>

<template>
  <article class="jc-card jc-card--link jc-topic">
    <span class="jc-icon-tile" :class="{ 'jc-icon-tile--warn': tone === 'warn' }">
      <JcIcon :name="icon" :size="21" />
    </span>

    <h3 class="jc-card__title">
      <a class="jc-card__overlay" :href="link">{{ title }}</a>
    </h3>

    <p class="jc-card__desc">{{ summary }}</p>

    <p v-if="audience" class="jc-topic__audience">
      <JcIcon name="user" :size="13" />
      {{ audience }}
    </p>

    <p class="jc-card__foot">
      {{ linkText || '查看详情' }}
      <JcIcon name="arrow-right" :size="15" />
    </p>
  </article>
</template>

<style scoped>
.jc-card__title a {
  color: inherit;
}

.jc-card__title a:hover {
  color: var(--jc-primary-deep);
}

.jc-topic__audience {
  display: flex;
  align-items: flex-start;
  gap: 6px;
  margin-top: var(--jc-space-3);
  padding-top: var(--jc-space-3);
  border-top: 1px dashed var(--jc-border);
  font-size: var(--jc-text-xs);
  color: var(--jc-muted);
  line-height: var(--jc-leading-snug);
}
</style>
