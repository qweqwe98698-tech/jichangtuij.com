<script setup lang="ts">
/**
 * 机场品牌资料库全面展示组件 (`/brands/`)
 * 提供全部 16 家已收录品牌、数据状态与搜索筛选，明确标注排序按收录或字母规则，不构成性能排名。
 */
import { ref, computed } from 'vue'
import JcIcon from './JcIcon.vue'
import SponsoredLink from './SponsoredLink.vue'
import { providersData } from '../data/providersData'

const search = ref('')
const filterProtocol = ref('all')
const filterRoute = ref('all')

const filteredProviders = computed(() => {
  return providersData.filter((p) => {
    const q = search.value.trim().toLowerCase()
    const matchesSearch =
      !q ||
      p.name.toLowerCase().includes(q) ||
      p.positioning.toLowerCase().includes(q) ||
      p.protocols.some((pr) => pr.toLowerCase().includes(q)) ||
      p.routes.some((r) => r.toLowerCase().includes(q))

    const matchesProtocol =
      filterProtocol.value === 'all' || p.protocols.includes(filterProtocol.value)

    const matchesRoute =
      filterRoute.value === 'all' || p.routes.some((r) => r.includes(filterRoute.value))

    return matchesSearch && matchesProtocol && matchesRoute
  })
})
</script>

<template>
  <div class="jc-directory">
    <!-- 搜素与筛选工具栏 -->
    <div class="jc-directory__toolbar">
      <div class="jc-directory__search">
        <JcIcon name="search" :size="16" />
        <input
          v-model="search"
          type="search"
          placeholder="搜索品牌名称、协议 (VLESS/SS) 或线路类型 (IEPL)..."
          aria-label="搜索品牌"
        />
      </div>

      <div class="jc-directory__filters">
        <select v-model="filterProtocol" aria-label="按协议筛选">
          <option value="all">全部协议</option>
          <option value="VLESS">VLESS 协议</option>
          <option value="Shadowsocks">Shadowsocks 协议</option>
        </select>

        <select v-model="filterRoute" aria-label="按线路筛选">
          <option value="all">全部线路类型</option>
          <option value="IEPL">IEPL 专线</option>
          <option value="IPLC">IPLC 专线</option>
          <option value="三网优化">三网优化</option>
        </select>
      </div>
    </div>

    <p class="jc-directory__count">
      共收录 <strong>{{ filteredProviders.length }}</strong> 家品牌资料（排列顺序不代表性能或质量排名）
    </p>

    <!-- 品牌卡片响应式栅格 -->
    <div v-if="filteredProviders.length" class="jc-brand-grid">
      <article
        v-for="p in filteredProviders"
        :key="p.id"
        class="jc-card jc-provider-item"
      >
        <!-- 1. Header & Title -->
        <div class="jc-provider-item__head">
          <span class="jc-icon-tile">
            <JcIcon name="cloud" :size="20" />
          </span>
          <div class="jc-provider-item__meta">
            <h3 class="jc-card__title jc-provider-item__title">
              <a :href="`/brands/${p.slug}/`">{{ p.name }}</a>
            </h3>
            <!-- 2. Price & Traffic -->
            <p class="jc-provider-item__price">
              {{ p.entryPrice }} · {{ p.traffic }}
            </p>
          </div>
        </div>

        <!-- 3. Description (Core Positioning) -->
        <p class="jc-card__desc jc-provider-item__desc">{{ p.positioning }}</p>

        <!-- 4. Tags (Protocols & Routes) -->
        <div class="jc-provider-item__tags">
          <span v-for="pr in p.protocols" :key="pr" class="jc-tag-chip">{{ pr }}</span>
          <span v-for="r in p.routes" :key="r" class="jc-tag-chip jc-tag-chip--route">{{ r }}</span>
        </div>

        <!-- 5. Status Block -->
        <div class="jc-provider-item__status">
          <div class="jc-status-item">
            <span class="jc-status-dot jc-status-dot--ok"></span>
            <span>公开资料：已核验 ({{ p.lastVerified }})</span>
          </div>
          <div class="jc-status-item">
            <span
              class="jc-status-dot"
              :class="p.lastMeasured ? 'jc-status-dot--ok' : 'jc-status-dot--pending'"
            ></span>
            <span>实测记录：{{ p.lastMeasured ? `1 次 (${p.lastMeasured})` : '日期待复核' }}</span>
          </div>
        </div>

        <!-- 6. Actions (Fixed at bottom) -->
        <div class="jc-provider-item__actions">
          <a class="jc-btn jc-btn--quiet jc-btn--sm jc-action-link" :href="`/brands/${p.slug}/`">
            查看资料与实测
          </a>
          <SponsoredLink
            :href="p.site"
            button-class="jc-btn jc-btn--primary jc-btn--sm jc-action-btn"
            class="jc-sponsored-cta"
          >
            官网注册
          </SponsoredLink>
        </div>
      </article>
    </div>

    <div v-else class="jc-directory__empty">
      <JcIcon name="info" :size="24" />
      <p>未找到符合条件的品牌，尝试切换筛选条件或清除搜索词。</p>
    </div>
  </div>
</template>

<style scoped>
.jc-directory__toolbar {
  display: flex;
  flex-wrap: wrap;
  gap: var(--jc-space-3);
  margin-bottom: var(--jc-space-4);
}

.jc-directory__search {
  flex: 1;
  min-width: 260px;
  display: flex;
  align-items: center;
  gap: var(--jc-space-2);
  padding: 8px 14px;
  background: var(--jc-surface-sunken);
  border: 1px solid var(--jc-border);
  border-radius: var(--jc-radius-sm);
}

.jc-directory__search input {
  flex: 1;
  background: transparent;
  border: none;
  outline: none;
  color: var(--jc-text);
  font-size: var(--jc-text-sm);
}

.jc-directory__filters {
  display: flex;
  gap: var(--jc-space-2);
}

.jc-directory__filters select {
  padding: 8px 12px;
  background: var(--jc-surface-sunken);
  border: 1px solid var(--jc-border);
  border-radius: var(--jc-radius-sm);
  color: var(--jc-text);
  font-size: var(--jc-text-xs);
  outline: none;
}

.jc-directory__count {
  font-size: var(--jc-text-xs);
  color: var(--jc-muted);
  margin-bottom: var(--jc-space-4);
}

/* 品牌卡片 Grid - 自适应与断点规范 */
.jc-brand-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: var(--jc-space-5);
  align-items: stretch;
  width: 100%;
}

@media (min-width: 1500px) {
  .jc-brand-grid {
    grid-template-columns: repeat(3, minmax(300px, 1fr));
  }
}

@media (min-width: 900px) and (max-width: 1499px) {
  .jc-brand-grid {
    grid-template-columns: repeat(2, minmax(300px, 1fr));
  }
}

@media (max-width: 767px) {
  .jc-brand-grid {
    grid-template-columns: 1fr;
  }
}

/* 卡片内部 Flex Column 分区 */
.jc-provider-item {
  display: flex;
  flex-direction: column;
  height: 100%;
  padding: var(--jc-space-5);
  background: var(--jc-surface);
  border: 1px solid var(--jc-border);
  border-radius: var(--jc-radius-md);
  box-shadow: var(--jc-shadow-sm);
  overflow: hidden; /* 绝对禁止溢出 */
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.jc-provider-item:hover {
  border-color: var(--jc-border-strong);
  box-shadow: var(--jc-shadow-md);
}

.jc-provider-item__head {
  display: flex;
  align-items: flex-start;
  gap: var(--jc-space-3);
  margin-bottom: var(--jc-space-2);
}

.jc-provider-item__meta {
  flex: 1;
  min-width: 0;
}

.jc-provider-item__title {
  font-size: var(--jc-text-lg);
  font-weight: 700;
  margin: 0;
  white-space: nowrap;
  word-break: keep-all;
  overflow: hidden;
  text-overflow: ellipsis;
}

.jc-provider-item__title a {
  color: var(--jc-text);
  text-decoration: none;
}

.jc-provider-item__title a:hover {
  color: var(--jc-primary);
}

.jc-provider-item__price {
  font-size: var(--jc-text-xs);
  color: var(--jc-primary-deep);
  font-weight: 600;
  margin-top: 4px;
  line-height: 1.4;
  word-break: normal;
  overflow-wrap: anywhere;
}

.jc-provider-item__desc {
  font-size: var(--jc-text-xs);
  color: var(--jc-text-soft);
  line-height: 1.5;
  margin: var(--jc-space-2) 0;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.jc-provider-item__tags {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  margin: var(--jc-space-2) 0 var(--jc-space-3);
}

.jc-tag-chip {
  font-size: 11px;
  padding: 2px 8px;
  border-radius: var(--jc-radius-pill);
  background: var(--jc-primary-soft);
  color: var(--jc-primary-deep);
  font-weight: 500;
  white-space: nowrap; /* 单个标签禁止拆成两行 */
  flex-shrink: 0;
}

.jc-tag-chip--route {
  background: var(--jc-surface-sunken);
  color: var(--jc-text-soft);
  border: 1px solid var(--jc-border);
}

/* 状态区 - 紧凑显示 */
.jc-provider-item__status {
  padding: 8px 12px;
  background: var(--jc-surface-sunken);
  border-radius: var(--jc-radius-sm);
  font-size: var(--jc-text-xs);
  display: flex;
  flex-direction: column;
  gap: 4px;
  margin-bottom: var(--jc-space-3);
}

.jc-status-item {
  display: flex;
  align-items: center;
  gap: 6px;
  color: var(--jc-text-soft);
  white-space: nowrap;
}

.jc-status-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  flex-shrink: 0;
}

.jc-status-dot--ok {
  background: var(--jc-success);
}

.jc-status-dot--pending {
  background: var(--jc-warning);
}

/* 底部操作按钮组 - 严格局限于卡片内部，margin-top: auto 固定在底部 */
.jc-provider-item__actions {
  margin-top: auto;
  padding-top: var(--jc-space-3);
  border-top: 1px solid var(--jc-border-subtle);
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 8px;
  width: 100%;
}

.jc-action-link {
  flex: 1 1 120px;
  min-height: 44px;
  max-width: 100%;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  white-space: nowrap;
  box-sizing: border-box;
}

.jc-sponsored-cta {
  flex: 1 1 130px;
  max-width: 100%;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  box-sizing: border-box;
}

.jc-action-btn {
  width: 100%;
  min-height: 44px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  white-space: nowrap;
  box-sizing: border-box;
}

.jc-directory__empty {
  padding: 40px;
  text-align: center;
  color: var(--jc-muted);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
}
</style>
