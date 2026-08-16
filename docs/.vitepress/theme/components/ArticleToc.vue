<script setup lang="ts">
/**
 * 页面目录。桌面端固定在右侧，窄屏折叠为 details。
 * 当前章节高亮基于滚动位置计算，不引入额外依赖。
 */
import { computed, onMounted, onBeforeUnmount, ref, watch } from 'vue'
import { useData, useRoute } from 'vitepress'

const { page } = useData()
const route = useRoute()

interface FlatHeader {
  link: string
  title: string
  level: number
}

const activeLink = ref('')
let ticking = false

const flat = computed<FlatHeader[]>(() => {
  const out: FlatHeader[] = []
  const walk = (list: any[] = []) => {
    for (const h of list) {
      out.push({ link: h.link, title: h.title, level: h.level })
      if (h.children?.length) walk(h.children)
    }
  }
  walk(page.value.headers as any[])
  return out
})

function updateActive() {
  ticking = false
  const offset = 120
  let current = ''
  for (const h of flat.value) {
    const el = document.getElementById(decodeURIComponent(h.link.slice(1)))
    if (!el) continue
    if (el.getBoundingClientRect().top - offset <= 0) current = h.link
  }
  // 滚动到底部时高亮最后一项
  if (window.innerHeight + window.scrollY >= document.body.offsetHeight - 8 && flat.value.length) {
    current = flat.value[flat.value.length - 1].link
  }
  activeLink.value = current
}

function onScroll() {
  if (ticking) return
  ticking = true
  requestAnimationFrame(updateActive)
}

onMounted(() => {
  updateActive()
  window.addEventListener('scroll', onScroll, { passive: true })
})

onBeforeUnmount(() => window.removeEventListener('scroll', onScroll))

watch(() => route.path, () => setTimeout(updateActive, 60))
</script>

<template>
  <nav v-if="flat.length" class="jc-toc" aria-label="本页目录" data-pagefind-ignore>
    <p class="jc-toc__title">本页目录</p>
    <ul class="jc-toc__list">
      <li v-for="h in flat" :key="h.link">
        <a
          class="jc-toc__link"
          :class="{ 'is-active': activeLink === h.link, 'jc-toc__link--sub': h.level > 2 }"
          :href="h.link"
        >
          {{ h.title }}
        </a>
      </li>
    </ul>
  </nav>
</template>
