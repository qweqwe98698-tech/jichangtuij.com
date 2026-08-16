<script setup lang="ts">
import { computed, onMounted, onBeforeUnmount, ref } from 'vue'
import { useData, useRoute } from 'vitepress'
import JcIcon from './JcIcon.vue'
import SearchButton from './SearchButton.vue'
import MobileMenu from './MobileMenu.vue'
import { primaryNav, primaryCta } from '../../data/navigation'
import { brand } from '../../data/site'

const { isDark } = useData()
const route = useRoute()

const stuck = ref(false)
const drawerOpen = ref(false)

function onScroll() {
  stuck.value = window.scrollY > 8
}

onMounted(() => {
  onScroll()
  window.addEventListener('scroll', onScroll, { passive: true })
})

onBeforeUnmount(() => window.removeEventListener('scroll', onScroll))

const currentTop = computed(() => `/${route.path.replace(/^\//, '').split('/')[0]}/`)

function isActive(link: string) {
  return currentTop.value === link
}

function toggleTheme() {
  isDark.value = !isDark.value
}
</script>

<template>
  <header class="jc-header" :class="{ 'jc-header--stuck': stuck }" data-pagefind-ignore>
    <div class="jc-container jc-header__inner">
      <a class="jc-logo" href="/" aria-label="机场推荐 JichangTuij 首页">
        <img
          class="jc-logo__mark"
          src="/logo-mark.svg"
          alt=""
          width="34"
          height="34"
          aria-hidden="true"
        />
        <span class="jc-logo__text">
          <span class="jc-logo__zh">{{ brand.nameZh }}</span>
          <span class="jc-logo__en">{{ brand.nameEn }}</span>
        </span>
      </a>

      <nav class="jc-nav" aria-label="主导航">
        <a
          v-for="item in primaryNav"
          :key="item.link"
          class="jc-nav__link"
          :class="{ 'is-active': isActive(item.link) }"
          :href="item.link"
          :aria-current="isActive(item.link) ? 'page' : undefined"
        >
          {{ item.text }}
        </a>
      </nav>

      <div class="jc-header__actions">
        <SearchButton variant="icon" />

        <button
          type="button"
          class="jc-icon-btn"
          :aria-label="isDark ? '切换到浅色模式' : '切换到深色模式'"
          :aria-pressed="isDark"
          @click="toggleTheme"
        >
          <JcIcon :name="isDark ? 'sun' : 'moon'" :size="19" />
        </button>

        <a class="jc-btn jc-btn--primary jc-header__cta" :href="primaryCta.link">
          {{ primaryCta.text }}
          <JcIcon name="arrow-right" :size="16" />
        </a>

        <button
          type="button"
          class="jc-icon-btn jc-drawer-toggle"
          aria-label="打开导航菜单"
          :aria-expanded="drawerOpen"
          aria-controls="jc-mobile-drawer"
          @click="drawerOpen = true"
        >
          <JcIcon name="menu" :size="20" />
        </button>
      </div>
    </div>

    <MobileMenu v-model:open="drawerOpen" />
  </header>
</template>

<style scoped>
@media (max-width: 640px) {
  .jc-header__cta {
    display: none;
  }
}
</style>
