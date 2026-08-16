<script setup lang="ts">
/**
 * 内容配图组件。统一强制以下图片 SEO 要求：
 *   - 必填 alt（描述图片信息，而不是重复标题）
 *   - 必填 width / height（避免布局偏移，也让搜索引擎提前知道尺寸）
 *   - 默认 loading="lazy" + decoding="async"；首屏图片可用 priority 关闭懒加载
 *   - 可选 title 属性与可见的 figcaption
 *   - 文件名必须是描述性的 kebab-case，路径统一在 /images/ 下
 *
 * 图片本身是静态资源，出现在服务端渲染出的 HTML 中，不依赖客户端 JavaScript。
 */
import { computed } from 'vue'

const props = withDefaults(
  defineProps<{
    src: string
    alt: string
    width: number | string
    height: number | string
    caption?: string
    title?: string
    /** 首屏图片：关闭懒加载并提高解码优先级 */
    priority?: boolean
  }>(),
  { caption: '', title: '', priority: false }
)

if (import.meta.env.DEV) {
  if (!props.alt) console.warn(`[JcFigure] 缺少 alt：${props.src}`)
  if (!/^\/images\/[a-z0-9-]+\.(svg|webp|png|jpg)$/.test(props.src)) {
    console.warn(`[JcFigure] 图片路径应为 /images/<描述性-kebab-case 文件名>：${props.src}`)
  }
}

const loading = computed(() => (props.priority ? 'eager' : 'lazy'))
const decoding = computed(() => (props.priority ? 'sync' : 'async'))
const fetchpriority = computed(() => (props.priority ? 'high' : 'auto'))
</script>

<template>
  <figure class="jc-figure">
    <img
      class="jc-figure__img"
      :src="src"
      :alt="alt"
      :title="title || undefined"
      :width="width"
      :height="height"
      :loading="loading"
      :decoding="decoding"
      :fetchpriority="fetchpriority"
    />
    <figcaption v-if="caption">{{ caption }}</figcaption>
  </figure>
</template>

<style scoped>
.jc-figure__img {
  width: 100%;
  height: auto;
  border: 1px solid var(--jc-border);
  border-radius: var(--jc-radius-md);
  background: var(--jc-surface-raised);
}
</style>
