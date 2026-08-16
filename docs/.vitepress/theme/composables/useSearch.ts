import { ref, readonly } from 'vue'

/**
 * 全站共享的搜索弹窗状态。
 * SearchButton、Hero 搜索框、快捷键、/search/ 页面都通过这里驱动同一个弹窗。
 */
const isOpen = ref(false)
const initialQuery = ref('')

export function useSearch() {
  function open(query = '') {
    initialQuery.value = query
    isOpen.value = true
  }

  function close() {
    isOpen.value = false
  }

  function toggle() {
    isOpen.value ? close() : open()
  }

  return {
    isOpen: readonly(isOpen),
    initialQuery: readonly(initialQuery),
    open,
    close,
    toggle,
    /** 供弹窗内部写回状态 */
    _isOpen: isOpen
  }
}

/** Pagefind 结果的统一形态 */
export interface SearchHit {
  id: string
  url: string
  title: string
  excerpt: string
  category: string
  updated: string
}

let pagefindPromise: Promise<any> | null = null

/**
 * 懒加载 Pagefind。索引体积较大，只在用户真正打开搜索时才请求。
 * 开发环境没有构建产物时返回 null，由界面提示「正式构建后启用」。
 */
export async function loadPagefind(): Promise<any | null> {
  if (typeof window === 'undefined') return null
  if (!pagefindPromise) {
    pagefindPromise = (async () => {
      try {
        const mod = await import(/* @vite-ignore */ `${window.location.origin}/pagefind/pagefind.js`)
        await mod.options?.({ excerptLength: 30 })
        await mod.init?.()
        return mod
      } catch {
        return null
      }
    })()
  }
  return pagefindPromise
}

/** 把 Pagefind 的 URL 规范化为站内带尾斜杠路径 */
export function normalizeHitUrl(raw: string): string {
  let url = raw || '/'
  url = url.replace(/index\.html$/, '')
  url = url.replace(/\.html$/, '/')
  if (!url.startsWith('/')) url = `/${url}`
  if (!url.endsWith('/')) url = `${url}/`
  return url.replace(/\/{2,}/g, '/')
}
