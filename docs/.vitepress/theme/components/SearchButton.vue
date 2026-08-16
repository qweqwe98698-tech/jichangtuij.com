<script setup lang="ts">
/**
 * 搜索入口按钮。
 * 注意：全局快捷键（Ctrl/Command + K、/）由 SearchModal 统一注册，
 * 这里不再监听键盘事件 —— 页面上可能同时存在多个 SearchButton，
 * 重复注册会导致快捷键被触发多次而互相抵消。
 */
import { onMounted, ref } from 'vue'
import JcIcon from './JcIcon.vue'
import { useSearch } from '../composables/useSearch'

withDefaults(defineProps<{ variant?: 'icon' | 'bar'; placeholder?: string }>(), {
  variant: 'icon',
  placeholder: '搜索「节点超时」「IEPL」「ChatGPT」…'
})

const { open } = useSearch()
const isMac = ref(false)

onMounted(() => {
  isMac.value = /Mac|iPhone|iPad/i.test(navigator.platform || navigator.userAgent)
})
</script>

<template>
  <button
    v-if="variant === 'icon'"
    type="button"
    class="jc-icon-btn"
    aria-label="打开站内搜索"
    aria-keyshortcuts="Control+K Meta+K"
    @click="open()"
  >
    <JcIcon name="search" :size="20" />
  </button>

  <button
    v-else
    type="button"
    class="jc-hero__searchbar"
    aria-label="打开站内搜索"
    aria-keyshortcuts="Control+K Meta+K"
    @click="open()"
  >
    <JcIcon name="search" :size="18" />
    <span>{{ placeholder }}</span>
    <span class="jc-hero__kbd" aria-hidden="true">
      <kbd class="jc-kbd">{{ isMac ? '⌘' : 'Ctrl' }}</kbd>
      <kbd class="jc-kbd">K</kbd>
    </span>
  </button>
</template>
