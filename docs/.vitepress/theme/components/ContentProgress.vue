<script setup lang="ts">
/**
 * 栏目内容进度表。
 * 已发布的选题给出链接；仍在写作或核验中的选题只显示标题与状态，
 * 不做成链接，也不会进入站点地图、Feed 与全文搜索。
 */
import { computed } from 'vue'
import { data as plan } from '../data/plan.data'
import { data as articleData } from '../data/articles.data'

const props = defineProps<{ category: string }>()

const publishedUrls = computed(() => new Set(articleData.articles.map((a) => a.url)))

const entries = computed(() => plan.byCategory[props.category] || [])

const statusLabel: Record<string, string> = {
  outline: '大纲已建立',
  researching: '资料核验中',
  writing: '写作中',
  reviewing: '复核中',
  published: '已发布',
  archived: '已归档'
}
</script>

<template>
  <div v-if="entries.length" class="jc-table-wrap" role="region" aria-label="本栏目内容进度" tabindex="0">
    <table class="jc-table">
      <caption>
        本栏目选题与写作进度。只有标记为「已发布」的条目完成了事实核验，可以直接阅读与引用。
      </caption>
      <thead>
        <tr>
          <th scope="col">选题</th>
          <th scope="col">主关键词</th>
          <th scope="col">搜索意图</th>
          <th scope="col">状态</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="e in entries" :key="e.id">
          <th scope="row">
            <a v-if="publishedUrls.has(e.url)" :href="e.url">{{ e.title }}</a>
            <span v-else>{{ e.title }}</span>
          </th>
          <td>{{ e.primaryKeyword }}</td>
          <td>{{ e.intent }}</td>
          <td>
            <span
              class="jc-tag"
              :class="{ 'jc-tag--muted': !publishedUrls.has(e.url) }"
            >
              {{ publishedUrls.has(e.url) ? '已发布' : statusLabel[e.status] || e.status }}
            </span>
          </td>
        </tr>
      </tbody>
    </table>
  </div>

  <p v-else class="jc-empty">本栏目的选题计划正在建立中。</p>
</template>
