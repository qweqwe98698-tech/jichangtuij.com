<script setup lang="ts">
import { onMounted, onBeforeUnmount, ref } from 'vue'
import JcIcon from './JcIcon.vue'

const visible = ref(false)

function onScroll() {
  visible.value = window.scrollY > 640
}

function toTop() {
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  window.scrollTo({ top: 0, behavior: reduce ? 'auto' : 'smooth' })
}

onMounted(() => {
  onScroll()
  window.addEventListener('scroll', onScroll, { passive: true })
})

onBeforeUnmount(() => window.removeEventListener('scroll', onScroll))
</script>

<template>
  <Transition name="jc-fade">
    <button
      v-if="visible"
      type="button"
      class="jc-backtop"
      aria-label="回到页面顶部"
      data-pagefind-ignore
      @click="toTop"
    >
      <JcIcon name="arrow-up" :size="18" />
    </button>
  </Transition>
</template>
