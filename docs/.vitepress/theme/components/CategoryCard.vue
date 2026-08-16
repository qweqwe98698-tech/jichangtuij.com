<script setup lang="ts">
import JcIcon from './JcIcon.vue'
import type { Category } from '../../data/categories'

defineProps<{ category: Category }>()
</script>

<template>
  <article class="jc-card jc-card--link">
    <span class="jc-icon-tile">
      <JcIcon :name="category.icon" :size="21" />
    </span>
    <h3 class="jc-card__title">
      <a class="jc-card__overlay" :href="category.path">{{ category.title }}</a>
    </h3>
    <p class="jc-card__desc">{{ category.tagline }}</p>
    <p class="jc-card__foot">
      进入栏目
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
</style>
