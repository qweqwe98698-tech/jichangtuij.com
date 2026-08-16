<script setup lang="ts">
/**
 * 移动端无障碍抽屉菜单：焦点锁定、Escape 关闭、路由变化自动关闭。
 */
import { nextTick, ref, watch } from 'vue'
import { useRoute } from 'vitepress'
import JcIcon from './JcIcon.vue'
import { primaryNav, secondaryNav, primaryCta, footerGroups } from '../../data/navigation'

const props = defineProps<{ open: boolean }>()
const emit = defineEmits<{ (e: 'update:open', v: boolean): void }>()

const route = useRoute()
const panelEl = ref<HTMLElement | null>(null)
const closeBtn = ref<HTMLElement | null>(null)
let lastFocused: HTMLElement | null = null

/** 按标题查找，避免页脚分组顺序调整后这里跟着错位 */
const trustGroup = footerGroups.find((g) => g.title.includes('政策') || g.title.includes('关于')) ?? footerGroups[footerGroups.length - 1]

function close() {
  emit('update:open', false)
}

function currentTop() {
  return `/${route.path.replace(/^\//, '').split('/')[0]}/`
}

watch(
  () => props.open,
  async (open) => {
    if (open) {
      lastFocused = document.activeElement as HTMLElement | null
      document.body.classList.add('jc-lock')
      await nextTick()
      closeBtn.value?.focus()
    } else {
      document.body.classList.remove('jc-lock')
      lastFocused?.focus?.()
    }
  }
)

watch(
  () => route.path,
  () => close()
)

function onKeydown(e: KeyboardEvent) {
  if (e.key === 'Escape') {
    e.preventDefault()
    close()
    return
  }
  if (e.key !== 'Tab' || !panelEl.value) return
  const focusables = panelEl.value.querySelectorAll<HTMLElement>(
    'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])'
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
</script>

<template>
  <Teleport to="body">
    <!-- 显式声明时长：不依赖 transitionend，避免抽屉在个别环境下残留并挡住页面 -->
    <Transition name="jc-drawer" :duration="420">
      <div
        v-if="open"
        id="jc-mobile-drawer"
        class="jc-drawer"
        role="dialog"
        aria-modal="true"
        aria-label="站点导航"
        @keydown="onKeydown"
      >
        <div class="jc-drawer__scrim" @click="close"></div>

        <div ref="panelEl" class="jc-drawer__panel">
          <div class="jc-drawer__head">
            <a class="jc-logo" href="/" aria-label="机场推荐首页">
              <img
                class="jc-logo__mark"
                src="/logo-mark.svg"
                alt=""
                width="34"
                height="34"
                aria-hidden="true"
              />
              <span class="jc-logo__text">
                <span class="jc-logo__zh">机场推荐</span>
              </span>
            </a>
            <button
              ref="closeBtn"
              type="button"
              class="jc-icon-btn"
              aria-label="关闭导航菜单"
              @click="close"
            >
              <JcIcon name="close" :size="20" />
            </button>
          </div>

          <a class="jc-btn jc-btn--primary jc-btn--block" :href="primaryCta.link">
            {{ primaryCta.text }}
            <JcIcon name="arrow-right" :size="16" />
          </a>

          <nav class="jc-drawer__group" aria-label="主要栏目">
            <p class="jc-drawer__group-title">主要栏目</p>
            <a
              v-for="item in primaryNav"
              :key="item.link"
              class="jc-drawer__link"
              :class="{ 'is-active': currentTop() === item.link }"
              :href="item.link"
            >
              {{ item.text }}
              <small v-if="item.desc">{{ item.desc }}</small>
            </a>
          </nav>

          <nav class="jc-drawer__group" aria-label="更多栏目">
            <p class="jc-drawer__group-title">更多栏目</p>
            <a
              v-for="item in secondaryNav"
              :key="item.link"
              class="jc-drawer__link"
              :class="{ 'is-active': currentTop() === item.link }"
              :href="item.link"
            >
              {{ item.text }}
            </a>
          </nav>

          <nav class="jc-drawer__group" aria-label="平台政策与披露">
            <p class="jc-drawer__group-title">{{ trustGroup.title }}</p>
            <a
              v-for="item in trustGroup.items"
              :key="item.link"
              class="jc-drawer__link"
              :href="item.link"
            >
              {{ item.text }}
            </a>
          </nav>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>
