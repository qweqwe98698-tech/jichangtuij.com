<script setup lang="ts">
/**
 * 分享工具：只使用浏览器原生能力（复制链接 / Web Share），不加载任何第三方脚本。
 */
import { ref } from 'vue'
import JcIcon from './JcIcon.vue'

const copied = ref(false)
const canShare = ref(false)

if (typeof navigator !== 'undefined' && 'share' in navigator) canShare.value = true

async function copyLink() {
  try {
    await navigator.clipboard.writeText(window.location.href)
    copied.value = true
    setTimeout(() => (copied.value = false), 2200)
  } catch {
    copied.value = false
  }
}

async function share() {
  try {
    await navigator.share({ title: document.title, url: window.location.href })
  } catch {
    /* 用户取消分享，不做处理 */
  }
}

function printPage() {
  window.print()
}
</script>

<template>
  <div class="jc-share" data-pagefind-ignore>
    <span class="jc-share__label">分享这一页</span>

    <button type="button" class="jc-btn jc-btn--ghost jc-btn--sm" @click="copyLink">
      <JcIcon :name="copied ? 'check' : 'link'" :size="15" />
      {{ copied ? '链接已复制' : '复制链接' }}
    </button>

    <button v-if="canShare" type="button" class="jc-btn jc-btn--ghost jc-btn--sm" @click="share">
      <JcIcon name="external" :size="15" />
      系统分享
    </button>

    <button type="button" class="jc-btn jc-btn--ghost jc-btn--sm" @click="printPage">
      <JcIcon name="doc" :size="15" />
      打印或存为 PDF
    </button>
  </div>
</template>
