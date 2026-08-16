<script setup lang="ts">
/**
 * 全站搜索弹窗（Pagefind 静态索引）
 * - Ctrl/Command + K 打开，Escape 关闭
 * - 输入防抖 200ms，中文关键词由 Pagefind 自带高亮
 * - 支持栏目筛选，键盘上下选择，焦点锁定在弹窗内
 * - 索引未构建时给出明确提示，不报错也不显示空白弹窗
 */
import { computed, nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { useRouter } from 'vitepress'
import JcIcon from './JcIcon.vue'
import SearchResults from './SearchResults.vue'
import { useSearch, loadPagefind, normalizeHitUrl, type SearchHit } from '../composables/useSearch'
import { categories, categoryMap } from '../../data/categories'

const { isOpen, initialQuery, open, close, toggle, _isOpen } = useSearch()
const router = useRouter()

/**
 * 全局快捷键在这里统一注册。
 * SearchModal 在 Layout 中只会存在一个实例，因此不会出现重复绑定导致的抵消问题。
 */
function onGlobalKeydown(e: KeyboardEvent) {
  if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
    e.preventDefault()
    toggle()
    return
  }
  // 「/」：不在输入控件中时打开搜索
  if (e.key === '/' && !e.metaKey && !e.ctrlKey && !e.altKey && !isOpen.value) {
    const t = e.target as HTMLElement | null
    const tag = t?.tagName?.toLowerCase()
    if (tag === 'input' || tag === 'textarea' || tag === 'select' || t?.isContentEditable) return
    e.preventDefault()
    open()
  }
}

onMounted(() => window.addEventListener('keydown', onGlobalKeydown))
onBeforeUnmount(() => window.removeEventListener('keydown', onGlobalKeydown))

const query = ref('')
const rawHits = ref<SearchHit[]>([])
const activeIndex = ref(0)
const state = ref<'idle' | 'loading' | 'ready' | 'empty' | 'unavailable'>('idle')
const activeFilter = ref('')

const panelEl = ref<HTMLElement | null>(null)
const inputEl = ref<HTMLInputElement | null>(null)

let debounceTimer: number | undefined
let lastToken = 0
let lastFocused: HTMLElement | null = null

const filterableCategories = computed(() =>
  categories.filter((c) => c.group === 'content' && c.slug !== 'search')
)

const hits = computed(() =>
  activeFilter.value
    ? rawHits.value.filter((h) => h.url.startsWith(`/${activeFilter.value}/`))
    : rawHits.value
)

/** 无结果时的建议入口 */
const suggestions = [
  { text: '机场推荐方法', link: '/recommend/' },
  { text: '线路与协议', link: '/network/' },
  { text: '客户端教程', link: '/clients/' },
  { text: '故障排查', link: '/troubleshooting/' },
  { text: '术语词典', link: '/glossary/' },
  { text: '新手指南', link: '/guides/' }
]

function categoryOfUrl(url: string): string {
  const seg = url.replace(/^\//, '').split('/')[0]
  return categoryMap[seg]?.title || ''
}

async function runSearch(q: string) {
  const token = ++lastToken
  if (!q.trim()) {
    rawHits.value = []
    state.value = 'idle'
    return
  }

  state.value = 'loading'
  const pagefind = await loadPagefind()
  if (token !== lastToken) return

  if (!pagefind) {
    state.value = 'unavailable'
    rawHits.value = []
    return
  }

  try {
    const search = await pagefind.search(q)
    if (token !== lastToken) return
    const raw = await Promise.all(search.results.slice(0, 24).map((r: any) => r.data()))
    if (token !== lastToken) return

    rawHits.value = raw.map((d: any, i: number) => {
      const url = normalizeHitUrl(d.url)
      return {
        id: `${i}-${url}`,
        url,
        title: d.meta?.title || d.meta?.h1 || url,
        excerpt: d.excerpt || '',
        category: d.filters?.category?.[0] || categoryOfUrl(url),
        updated: d.meta?.updated || ''
      } as SearchHit
    })
    activeIndex.value = 0
    state.value = rawHits.value.length ? 'ready' : 'empty'
  } catch {
    state.value = 'unavailable'
    rawHits.value = []
  }
}

watch(query, (q) => {
  window.clearTimeout(debounceTimer)
  debounceTimer = window.setTimeout(() => runSearch(q), 200)
})

watch(activeFilter, () => {
  activeIndex.value = 0
})

watch(isOpen, async (open) => {
  if (open) {
    lastFocused = document.activeElement as HTMLElement | null
    query.value = initialQuery.value || ''
    document.body.classList.add('jc-lock')
    await nextTick()
    inputEl.value?.focus()
    if (query.value) runSearch(query.value)
  } else {
    document.body.classList.remove('jc-lock')
    window.clearTimeout(debounceTimer)
    lastToken++
    rawHits.value = []
    activeFilter.value = ''
    state.value = 'idle'
    lastFocused?.focus?.()
  }
})

function go(hit: SearchHit) {
  close()
  router.go(hit.url)
}

function onKeydown(e: KeyboardEvent) {
  if (e.key === 'Escape') {
    e.preventDefault()
    close()
    return
  }

  if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
    e.preventDefault()
    const total = hits.value.length
    if (!total) return
    const dir = e.key === 'ArrowDown' ? 1 : -1
    activeIndex.value = (activeIndex.value + dir + total) % total
    nextTick(() => {
      document
        .getElementById(`jc-search-option-${activeIndex.value}`)
        ?.scrollIntoView({ block: 'nearest' })
    })
    return
  }

  if (e.key === 'Enter') {
    const hit = hits.value[activeIndex.value]
    if (hit) {
      e.preventDefault()
      go(hit)
    }
    return
  }

  // 焦点锁定
  if (e.key === 'Tab' && panelEl.value) {
    const focusables = panelEl.value.querySelectorAll<HTMLElement>(
      'a[href], button:not([disabled]), input, [tabindex]:not([tabindex="-1"])'
    )
    if (!focusables.length) return
    const first = focusables[0]
    const last = focusables[focusables.length - 1]
    if (e.shiftKey && document.activeElement === first) {
      e.preventDefault()
      last.focus()
    } else if (!e.shiftKey && document.activeElement === last) {
      e.preventDefault()
      first.focus()
    }
  }
}

function toggleFilter(slug: string) {
  activeFilter.value = activeFilter.value === slug ? '' : slug
}

function onClickSuggestion(link: string) {
  close()
  router.go(link)
}

// 允许外部直接关闭
function onScrim() {
  _isOpen.value = false
}
</script>

<template>
  <Teleport to="body">
    <!-- 显式声明时长：不依赖 transitionend，避免个别环境下元素残留并挡住页面 -->
    <Transition name="jc-modal" :duration="240">
      <div
        v-if="isOpen"
        class="jc-search-modal"
        role="dialog"
        aria-modal="true"
        aria-label="站内搜索"
        @keydown="onKeydown"
      >
        <div class="jc-search-modal__scrim" @click="onScrim"></div>

        <div ref="panelEl" class="jc-search-modal__panel">
          <div class="jc-search-modal__head">
            <JcIcon name="search" :size="20" />
            <input
              ref="inputEl"
              v-model="query"
              class="jc-search-modal__input"
              type="search"
              autocomplete="off"
              autocorrect="off"
              spellcheck="false"
              placeholder="搜索节点超时、IEPL、ChatGPT、订阅更新失败…"
              aria-label="搜索关键词"
              aria-controls="jc-search-body"
            />
            <button type="button" class="jc-icon-btn" aria-label="关闭搜索" @click="close()">
              <JcIcon name="close" :size="18" />
            </button>
          </div>

          <div class="jc-search-modal__filters" role="group" aria-label="按栏目筛选">
            <button
              type="button"
              class="jc-filter-chip"
              :class="{ 'is-active': activeFilter === '' }"
              :aria-pressed="activeFilter === ''"
              @click="activeFilter = ''"
            >
              全部栏目
            </button>
            <button
              v-for="c in filterableCategories"
              :key="c.slug"
              type="button"
              class="jc-filter-chip"
              :class="{ 'is-active': activeFilter === c.slug }"
              :aria-pressed="activeFilter === c.slug"
              @click="toggleFilter(c.slug)"
            >
              {{ c.label }}
            </button>
          </div>

          <div id="jc-search-body" class="jc-search-modal__body" aria-live="polite">
            <p v-if="state === 'idle'" class="jc-search-state">
              输入关键词开始检索。搜索范围仅包含正式发布的内容，未完成的草稿不会出现在结果中。
            </p>

            <p v-else-if="state === 'loading'" class="jc-search-state">正在检索…</p>

            <p v-else-if="state === 'unavailable'" class="jc-search-state">
              全文搜索将在完成正式构建后启用。<br />
              本地开发时请先运行 <code>npm run build</code>，再用 <code>npm run preview</code> 预览。
            </p>

            <template v-else-if="state === 'ready' && hits.length">
              <SearchResults
                :hits="hits"
                :active-index="activeIndex"
                @select="go"
                @hover="(i) => (activeIndex = i)"
              />
            </template>

            <div v-else class="jc-search-state">
              <p v-if="activeFilter">
                当前栏目下没有匹配「{{ query }}」的内容，可以取消栏目筛选后重试。
              </p>
              <p v-else>没有找到与「{{ query }}」匹配的内容。可以试试下面这些入口：</p>
              <div class="jc-search-suggest">
                <button
                  v-for="s in suggestions"
                  :key="s.link"
                  type="button"
                  class="jc-filter-chip"
                  @click="onClickSuggestion(s.link)"
                >
                  {{ s.text }}
                </button>
              </div>
            </div>
          </div>

          <div class="jc-search-modal__foot">
            <span class="jc-search-hint"><kbd class="jc-kbd">↑</kbd><kbd class="jc-kbd">↓</kbd> 选择</span>
            <span class="jc-search-hint"><kbd class="jc-kbd">Enter</kbd> 打开</span>
            <span class="jc-search-hint"><kbd class="jc-kbd">Esc</kbd> 关闭</span>
            <span class="jc-search-hint" style="margin-left: auto">索引由 Pagefind 静态生成</span>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
.jc-search-suggest {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 8px;
  margin-top: var(--jc-space-4);
}
</style>
