<script setup lang="ts">
/**
 * 文档页左侧栏目导航：当前栏目的已发布文章 + 相关栏目入口。
 * 只显示真实存在且已发布的页面。
 */
import { computed } from 'vue'
import { useRoute } from 'vitepress'
import { data as articleData } from '../data/articles.data'
import { categoryMap, categories } from '../../data/categories'

const route = useRoute()

const currentUrl = computed(() => route.path.replace(/index\.html$/, '').replace(/\.html$/, '/'))
const seg = computed(() => currentUrl.value.replace(/^\//, '').split('/')[0])
const category = computed(() => categoryMap[seg.value])

const siblings = computed(() =>
  articleData.articles
    .filter((a) => a.category === seg.value)
    .slice()
    .sort((a, b) => a.url.localeCompare(b.url))
)

const relatedCategories = computed(() =>
  (category.value?.related || [])
    .map((slug) => categoryMap[slug])
    .filter(Boolean)
)

const pillars = computed(() => categories.filter((c) => c.pillar))
</script>

<template>
  <nav class="jc-sidenav" aria-label="栏目导航" data-pagefind-ignore>
    <div v-if="category" class="jc-sidenav__group">
      <p class="jc-sidenav__title">{{ category.title }}</p>
      <ul class="jc-sidenav__list">
        <li>
          <!-- 锚文本用栏目全称而不是「栏目首页」：后者在 20 个栏目里指向 20 个不同目标，没有信息量 -->
          <a
            class="jc-sidenav__link"
            :class="{ 'is-active': currentUrl === category.path }"
            :href="category.path"
          >
            {{ category.title }}·栏目首页
          </a>
        </li>
        <li v-for="a in siblings" :key="a.url">
          <a
            class="jc-sidenav__link"
            :class="{ 'is-active': currentUrl === a.url }"
            :href="a.url"
          >
            {{ a.title }}
          </a>
        </li>
      </ul>
      <p v-if="!siblings.length" class="jc-sidenav__empty">
        本栏目正式发布的文章会在这里列出。
      </p>
    </div>

    <div v-if="relatedCategories.length" class="jc-sidenav__group">
      <p class="jc-sidenav__title">相关栏目</p>
      <ul class="jc-sidenav__list">
        <li v-for="c in relatedCategories" :key="c.slug">
          <a class="jc-sidenav__link" :href="c.path">{{ c.title }}</a>
        </li>
      </ul>
    </div>

    <div class="jc-sidenav__group">
      <p class="jc-sidenav__title">支柱栏目</p>
      <ul class="jc-sidenav__list">
        <li v-for="c in pillars" :key="c.slug">
          <a
            class="jc-sidenav__link"
            :class="{ 'is-active': seg === c.slug }"
            :href="c.path"
          >
            {{ c.title }}
          </a>
        </li>
      </ul>
    </div>

    <!-- 侧边栏推荐中心快捷发现入口 -->
    <div class="jc-sidenav__recommend">
      <div class="jc-sidenav__recommend-head">
        <JcIcon name="compass" :size="15" />
        <strong>机场推荐中心</strong>
      </div>
      <p class="jc-sidenav__recommend-desc">按预算与用途快速筛选服务商</p>
      <a class="jc-btn jc-btn--primary jc-btn--xs jc-sidenav__recommend-btn" href="/recommend/">
        进入选择中心
      </a>
    </div>
  </nav>
</template>

<style scoped>
.jc-sidenav__empty {
  margin-top: var(--jc-space-2);
  font-size: var(--jc-text-xs);
  color: var(--jc-muted);
  line-height: var(--jc-leading-snug);
  padding-inline: 12px;
}

.jc-sidenav__recommend {
  margin-top: var(--jc-space-5);
  padding: var(--jc-space-3) var(--jc-space-4);
  background: var(--jc-surface-sunken);
  border: 1px solid var(--jc-primary-soft);
  border-radius: var(--jc-radius-md);
}

.jc-sidenav__recommend-head {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: var(--jc-text-xs);
  color: var(--jc-primary-deep);
}

.jc-sidenav__recommend-desc {
  margin: 4px 0 var(--jc-space-3);
  font-size: var(--jc-text-xs);
  color: var(--jc-text-soft);
  line-height: var(--jc-leading-snug);
}

.jc-sidenav__recommend-btn {
  width: 100%;
  text-align: center;
  justify-content: center;
}
</style>
