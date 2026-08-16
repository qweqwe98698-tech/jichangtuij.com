<script setup lang="ts">
/**
 * 404 页面。静态站点会真实返回 404 状态，不做任何跳转到首页的处理。
 */
import JcIcon from './JcIcon.vue'
import { useSearch } from '../composables/useSearch'

const { open } = useSearch()
</script>

<template>
  <div class="jc-container jc-notfound">
    <svg
      class="jc-notfound__art"
      viewBox="0 0 320 180"
      role="img"
      aria-label="示意图：一朵云的连线中断，表示该页面暂时无法到达"
    >
      <defs>
        <linearGradient id="jc404Cloud" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stop-color="var(--jc-surface-solid)" />
          <stop offset="100%" stop-color="var(--jc-surface-sunken)" />
        </linearGradient>
      </defs>

      <!-- 左侧云 -->
      <path
        d="M56 104a22 22 0 0 1 3-43.7A30 30 0 0 1 116 54a19 19 0 0 1 2.4 50H56Z"
        fill="url(#jc404Cloud)"
        stroke="var(--jc-border-strong)"
        stroke-width="1.6"
      />
      <!-- 右侧云 -->
      <path
        d="M206 122a20 20 0 0 1 2.7-39.8A27 27 0 0 1 258 76a17 17 0 0 1 2.2 46H206Z"
        fill="url(#jc404Cloud)"
        stroke="var(--jc-border-strong)"
        stroke-width="1.6"
      />

      <!-- 断开的连线 -->
      <path
        d="M124 92h26"
        stroke="var(--jc-primary)"
        stroke-width="2.4"
        stroke-linecap="round"
      />
      <path
        d="M176 100h26"
        stroke="var(--jc-primary)"
        stroke-width="2.4"
        stroke-linecap="round"
      />
      <path
        d="M154 84l14 24"
        stroke="var(--jc-danger)"
        stroke-width="2.2"
        stroke-linecap="round"
      />
      <path
        d="M168 84l-14 24"
        stroke="var(--jc-danger)"
        stroke-width="2.2"
        stroke-linecap="round"
      />

      <!-- 节点 -->
      <circle cx="124" cy="92" r="4" fill="var(--jc-primary)" />
      <circle cx="202" cy="100" r="4" fill="var(--jc-primary)" />
      <circle cx="88" cy="90" r="2.6" fill="var(--jc-sky)" />
      <circle cx="236" cy="98" r="2.6" fill="var(--jc-sky)" />
    </svg>

    <p class="jc-notfound__code">404 · NOT FOUND</p>
    <h1 class="jc-notfound__title">这条线路没有找到</h1>
    <p class="jc-notfound__desc">
      页面可能已移动、改名或暂时不可用。你可以回到首页重新开始，直接搜索关键词，
      也可以从下面的常用入口继续。
    </p>

    <div class="jc-notfound__actions">
      <a class="jc-btn jc-btn--primary" href="/">
        <JcIcon name="arrow-left" :size="16" />
        返回首页
      </a>
      <button type="button" class="jc-btn jc-btn--ghost" @click="open()">
        <JcIcon name="search" :size="16" />
        打开搜索
      </button>
      <a class="jc-btn jc-btn--ghost" href="/recommend/">
        <JcIcon name="compass" :size="16" />
        查看机场推荐
      </a>
      <a class="jc-btn jc-btn--ghost" href="/clients/">
        <JcIcon name="terminal" :size="16" />
        查看热门教程
      </a>
    </div>

    <nav class="jc-notfound__more" aria-label="其他常用入口">
      <a href="/ranking/">机场排行榜</a>
      <a href="/brands/">品牌资料库</a>
      <a href="/compare/">品牌对比</a>
      <a href="/network/">线路与协议</a>
      <a href="/troubleshooting/">故障排查</a>
      <a href="/guides/">新手使用指南</a>
      <a href="/glossary/">术语词典</a>
    </nav>
  </div>
</template>

<style scoped>
.jc-notfound__more {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: var(--jc-space-4);
  margin-top: var(--jc-space-6);
  padding-top: var(--jc-space-5);
  border-top: 1px solid var(--jc-border);
  font-size: var(--jc-text-sm);
  width: min(100%, 640px);
}
</style>
