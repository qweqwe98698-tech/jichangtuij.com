<script setup lang="ts">
/**
 * 决策表 / 对比表。
 * 数据来自 frontmatter.decisionTable：{ caption, head: [], rows: [[]] }
 * 表格在窄屏可横向滚动，不会撑破正文宽度。
 */
import { computed } from 'vue'
import { useData } from 'vitepress'

const props = withDefaults(
  defineProps<{
    caption?: string
    head?: string[]
    rows?: string[][]
    source?: string
  }>(),
  { caption: '', head: undefined, rows: undefined, source: 'decisionTable' }
)

const { frontmatter } = useData()

const table = computed(() => {
  if (props.head?.length && props.rows?.length) {
    return { caption: props.caption, head: props.head, rows: props.rows }
  }
  const fm = frontmatter.value[props.source]
  if (fm && Array.isArray(fm.head) && Array.isArray(fm.rows)) {
    return {
      caption: String(fm.caption || props.caption || ''),
      head: fm.head.map(String),
      rows: fm.rows.map((r: unknown[]) => r.map(String))
    }
  }
  return null
})
</script>

<template>
  <div v-if="table" class="jc-table-wrap" role="region" :aria-label="table.caption || '对比表'" tabindex="0">
    <table class="jc-table">
      <caption v-if="table.caption">{{ table.caption }}</caption>
      <thead>
        <tr>
          <th v-for="(h, i) in table.head" :key="i" scope="col">{{ h }}</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(row, ri) in table.rows" :key="ri">
          <th v-if="row.length" scope="row">{{ row[0] }}</th>
          <td v-for="(cell, ci) in row.slice(1)" :key="ci">{{ cell }}</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>
