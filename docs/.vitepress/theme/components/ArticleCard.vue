<script setup lang="ts">
import JcIcon from './JcIcon.vue'
import type { ArticleMeta } from '../data/articles.data'

withDefaults(defineProps<{ article: ArticleMeta; showCategory?: boolean }>(), {
  showCategory: true
})

const typeLabels: Record<string, string> = {
  recommendation: '推荐',
  tutorial: '教程',
  troubleshooting: '排查',
  comparison: '对比',
  warning: '风险',
  term: '术语',
  guide: '指南',
  methodology: '方法',
  policy: '规则',
  hub: '栏目',
  faq: '问答',
  update: '记录'
}
</script>

<template>
  <article class="jc-card jc-card--link">
    <div class="jc-article-card__meta">
      <span v-if="showCategory && article.categoryTitle" class="jc-tag">
        {{ article.categoryTitle }}
      </span>
      <span v-if="typeLabels[article.contentType]" class="jc-tag jc-tag--muted">
        {{ typeLabels[article.contentType] }}
      </span>
      <time v-if="article.updated" :datetime="article.updated">更新于 {{ article.updated }}</time>
    </div>

    <h3 class="jc-card__title">
      <a class="jc-card__overlay" :href="article.url">{{ article.title }}</a>
    </h3>

    <p class="jc-card__desc">{{ article.answer || article.description }}</p>

    <p class="jc-card__foot">
      阅读全文
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
