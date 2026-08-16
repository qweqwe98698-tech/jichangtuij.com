<script setup lang="ts">
/**
 * /search/ 页面上的搜索入口。
 * 真正的检索仍然由全站共享的 SearchModal 完成，避免两套索引逻辑。
 */
import { onMounted, ref } from 'vue'
import JcIcon from './JcIcon.vue'
import { useSearch } from '../composables/useSearch'

const { open } = useSearch()
const keyword = ref('')

/**
 * 支持 /search/?q=关键词 直接检索。
 * 这也是站点结构化数据中 SearchAction 声明的入口 —— 声明什么就必须真的能用。
 */
onMounted(() => {
  const q = new URLSearchParams(window.location.search).get('q')
  if (q && q.trim()) {
    keyword.value = q.trim()
    open(keyword.value)
  }
})

const shortcuts = [
  '节点全部超时',
  '订阅更新失败',
  'IEPL 和 IPLC 区别',
  'Clash 规则模式',
  'ChatGPT 无法访问',
  'Netflix 检测到代理',
  '机场跑路前兆',
  '原生 IP',
  'DNS 泄漏',
  '流量倍率'
]

function submit() {
  open(keyword.value)
}
</script>

<template>
  <div class="jc-searchpage" data-pagefind-ignore>
    <form class="jc-searchpage__form" role="search" @submit.prevent="submit">
      <label class="jc-searchpage__field">
        <JcIcon name="search" :size="18" />
        <input
          v-model="keyword"
          type="search"
          name="q"
          autocomplete="off"
          placeholder="输入关键词，例如：节点超时、IEPL、订阅更新失败"
          aria-label="搜索关键词"
        />
      </label>
      <button type="submit" class="jc-btn jc-btn--primary">
        开始搜索
        <JcIcon name="arrow-right" :size="16" />
      </button>
    </form>

    <p class="jc-searchpage__hint">
      也可以在任意页面按 <kbd class="jc-kbd">Ctrl</kbd> <kbd class="jc-kbd">K</kbd>
      （macOS 为 <kbd class="jc-kbd">⌘</kbd> <kbd class="jc-kbd">K</kbd>）打开搜索。
    </p>

    <div class="jc-searchpage__shortcuts">
      <p class="jc-searchpage__shortcuts-title">常见检索词</p>
      <div class="jc-searchpage__chips">
        <button
          v-for="s in shortcuts"
          :key="s"
          type="button"
          class="jc-filter-chip"
          @click="open(s)"
        >
          {{ s }}
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.jc-searchpage__form {
  display: flex;
  flex-wrap: wrap;
  gap: var(--jc-space-3);
  margin: var(--jc-space-5) 0 var(--jc-space-3);
}

.jc-searchpage__field {
  flex: 1 1 320px;
  display: flex;
  align-items: center;
  gap: var(--jc-space-3);
  min-height: 50px;
  padding: 0 var(--jc-space-5);
  border: 1px solid var(--jc-border-strong);
  border-radius: var(--jc-radius-pill);
  background: var(--jc-surface-raised);
  color: var(--jc-muted);
}

.jc-searchpage__field input {
  flex: 1;
  min-width: 0;
  border: none;
  background: transparent;
  outline: none;
  font-size: var(--jc-text-sm);
  color: var(--jc-text);
}

.jc-searchpage__hint {
  font-size: var(--jc-text-xs);
  color: var(--jc-muted);
}

.jc-searchpage__shortcuts {
  margin-top: var(--jc-space-6);
}

.jc-searchpage__shortcuts-title {
  font-size: var(--jc-text-xs);
  font-weight: 700;
  letter-spacing: 0.08em;
  color: var(--jc-muted);
  margin-bottom: var(--jc-space-3);
}

.jc-searchpage__chips {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}
</style>
