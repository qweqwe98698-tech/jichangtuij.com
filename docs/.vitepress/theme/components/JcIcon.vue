<script setup lang="ts">
/**
 * 原创线性图标组件。
 * 全部图标为内联 SVG，不请求外部资源；装饰性使用时 aria-hidden，
 * 作为按钮唯一内容时通过 label 提供可读名称。
 */
import { computed } from 'vue'

const props = withDefaults(
  defineProps<{
    name: string
    size?: number | string
    label?: string
    strokeWidth?: number
  }>(),
  { size: 20, label: '', strokeWidth: 1.7 }
)

/** 24x24 视口下的路径定义 */
const paths: Record<string, string> = {
  compass: 'M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18Z M15.4 8.6l-1.9 4.9-4.9 1.9 1.9-4.9 4.9-1.9Z',
  chart: 'M4 20V10 M9.5 20V5 M15 20v-7 M20.5 20V8 M3 20h18',
  gauge: 'M4 18a8 8 0 1 1 16 0 M12 14l4-4 M12 18v.01',
  compare: 'M9 4v16 M15 4v16 M4 8h4 M4 16h4 M16 8h4 M16 16h4',
  route: 'M5 6h6a3 3 0 0 1 0 6H8a3 3 0 0 0 0 6h6 M5 6a1.6 1.6 0 1 0 0-.02 M19 18a1.6 1.6 0 1 0 0-.02',
  terminal: 'M5 5h14v14H5z M8.5 10l2.2 2-2.2 2 M13 14h3',
  book: 'M5 4h9a3 3 0 0 1 3 3v13H8a3 3 0 0 1-3-3V4Z M17 20h2V7 M8.5 8.5h5 M8.5 12h5',
  spark: 'M12 3.5l1.9 4.9 4.9 1.9-4.9 1.9L12 17.1l-1.9-4.9-4.9-1.9 4.9-1.9L12 3.5Z M18.5 16.5l.8 2 2 .8-2 .8-.8 2-.8-2-2-.8 2-.8.8-2Z',
  play: 'M4 6.5A2.5 2.5 0 0 1 6.5 4h11A2.5 2.5 0 0 1 20 6.5v11a2.5 2.5 0 0 1-2.5 2.5h-11A2.5 2.5 0 0 1 4 17.5v-11Z M10.4 9.2l4.2 2.8-4.2 2.8V9.2Z',
  wrench: 'M15.5 4.5a4.5 4.5 0 0 0-5.6 5.6L4 16v4h4l5.9-5.9a4.5 4.5 0 0 0 5.6-5.6l-2.7 2.7-2.3-2.3 2.7-2.7Z',
  shield: 'M12 3.5l7 2.6v5.3c0 4.2-2.9 7.5-7 9.1-4.1-1.6-7-4.9-7-9.1V6.1l7-2.6Z M9.2 12l2 2 3.6-3.8',
  layers: 'M12 3.5 3.5 8 12 12.5 20.5 8 12 3.5Z M4 12.5 12 17l8-4.5 M4 16.5 12 21l8-4.5',
  globe: 'M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18Z M3.2 9.5h17.6 M3.2 14.5h17.6 M12 3c-2.4 2.6-3.6 5.6-3.6 9s1.2 6.4 3.6 9c2.4-2.6 3.6-5.6 3.6-9S14.4 5.6 12 3Z',
  dictionary: 'M6 4h11a2 2 0 0 1 2 2v14H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2Z M9 9.5h6 M9 13h4 M19 17H6',
  question: 'M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18Z M9.6 9.6a2.5 2.5 0 1 1 3.3 2.4c-.6.2-.9.8-.9 1.4v.5 M12 17v.01',
  clock: 'M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18Z M12 7.2V12l3.2 2',
  search: 'M11 18a7 7 0 1 0 0-14 7 7 0 0 0 0 14Z M16.2 16.2 21 21',
  info: 'M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18Z M12 11v5.5 M12 7.8v.01',
  ruler: 'M4.5 14.5 14.5 4.5l5 5-10 10-5-5Z M8 11l1.8 1.8 M11 8l1.8 1.8',
  pen: 'M4 20h4L19.2 8.8a2.1 2.1 0 0 0 0-3l-1-1a2.1 2.1 0 0 0-3 0L4 16v4Z M14.5 6.5 17.5 9.5',
  balance: 'M12 4v16 M6 8h12 M6 8 3 15h6L6 8Z M18 8l-3 7h6l-3-7Z M8 20h8',
  inbox: 'M4 13.5 6.4 5.5A2 2 0 0 1 8.3 4h7.4a2 2 0 0 1 1.9 1.5L20 13.5V18a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2v-4.5Z M4 13.5h4.2l1 2.2h5.6l1-2.2H20',
  lock: 'M6.5 10.5h11V20h-11v-9.5Z M8.8 10.5V7.8a3.2 3.2 0 0 1 6.4 0v2.7 M12 14v2.5',
  doc: 'M6 3.5h7l5 5V20.5H6V3.5Z M13 3.5v5h5 M9 13h6 M9 16.5h4',
  coin: 'M12 20c4.4 0 8-1.8 8-4s-3.6-4-8-4-8 1.8-8 4 3.6 4 8 4Z M4 16v-4 M20 16v-4 M12 12c4.4 0 8-1.8 8-4s-3.6-4-8-4-8 1.8-8 4 3.6 4 8 4Z',
  menu: 'M4 7h16 M4 12h16 M4 17h10',
  close: 'M6 6l12 12 M18 6 6 18',
  sun: 'M12 16.5a4.5 4.5 0 1 0 0-9 4.5 4.5 0 0 0 0 9Z M12 2.5v2 M12 19.5v2 M21.5 12h-2 M4.5 12h-2 M18.7 5.3l-1.4 1.4 M6.7 17.3l-1.4 1.4 M18.7 18.7l-1.4-1.4 M6.7 6.7 5.3 5.3',
  moon: 'M20 14.2A8.2 8.2 0 0 1 9.8 4 8.5 8.5 0 1 0 20 14.2Z',
  'arrow-right': 'M4.5 12h15 M13.5 6l6 6-6 6',
  'arrow-left': 'M19.5 12h-15 M10.5 6l-6 6 6 6',
  'arrow-up': 'M12 19.5v-15 M6 10.5l6-6 6 6',
  'arrow-down': 'M12 4.5v15 M6 13.5l6 6 6-6',
  plus: 'M12 5v14 M5 12h14',
  check: 'M5 12.5 10 17.5 19 7',
  alert: 'M12 4 21 19.5H3L12 4Z M12 10v4.2 M12 17.2v.01',
  external: 'M14 4h6v6 M20 4l-8.5 8.5 M18 14v4.5a1.5 1.5 0 0 1-1.5 1.5h-11A1.5 1.5 0 0 1 4 18.5v-11A1.5 1.5 0 0 1 5.5 6H10',
  copy: 'M9 9h9.5v11H9V9Z M15 9V4.5H5.5V16H9',
  link: 'M10.5 13.5a3.5 3.5 0 0 0 5 0l3-3a3.5 3.5 0 0 0-5-5l-1.5 1.5 M13.5 10.5a3.5 3.5 0 0 0-5 0l-3 3a3.5 3.5 0 0 0 5 5l1.5-1.5',
  calendar: 'M4.5 6.5h15V20h-15V6.5Z M8.5 4v4.5 M15.5 4v4.5 M4.5 11h15',
  user: 'M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8Z M4.5 20a7.5 7.5 0 0 1 15 0',
  tag: 'M4 4h7.2L20 12.8 12.8 20 4 11.2V4Z M8 8v.01',
  filter: 'M4 6h16 M7 12h10 M10 18h4',
  cloud: 'M7 18.5a4 4 0 0 1-.4-8A5.5 5.5 0 0 1 17.4 10a3.8 3.8 0 0 1 .4 8.5H7Z',
  target: 'M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18Z M12 16.5a4.5 4.5 0 1 0 0-9 4.5 4.5 0 0 0 0 9Z M12 12v.01',
  rss: 'M5.5 18.5v.01 M5 12a7.5 7.5 0 0 1 7.5 7.5 M5 6.5A13 13 0 0 1 18 19.5',
  list: 'M9 6.5h11 M9 12h11 M9 17.5h11 M4.5 6.5v.01 M4.5 12v.01 M4.5 17.5v.01'
}

const d = computed(() => paths[props.name] || paths.info)
const px = computed(() => (typeof props.size === 'number' ? `${props.size}px` : props.size))
</script>

<template>
  <svg
    class="jc-icon"
    :width="px"
    :height="px"
    viewBox="0 0 24 24"
    fill="none"
    :stroke-width="strokeWidth"
    stroke="currentColor"
    stroke-linecap="round"
    stroke-linejoin="round"
    :role="label ? 'img' : undefined"
    :aria-label="label || undefined"
    :aria-hidden="label ? undefined : 'true'"
    focusable="false"
  >
    <title v-if="label">{{ label }}</title>
    <path :d="d" />
  </svg>
</template>

<style scoped>
.jc-icon {
  flex: none;
  display: inline-block;
  vertical-align: middle;
}
</style>
