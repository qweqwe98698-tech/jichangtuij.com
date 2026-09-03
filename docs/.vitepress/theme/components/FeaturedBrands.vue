<script setup lang="ts">
import { computed } from 'vue'
import JcIcon from './JcIcon.vue'
import SponsoredLink from './SponsoredLink.vue'
import { providersData } from '../data/providersData'

// 首页精选 6 家具有典型代表性的品牌
const FEATURED_SLUGS = ['guangsuyun', 'feimaoyun', 'xingdaomeng', 'lingmao', 'ermaoyun', 'sogoyun']

const featuredList = computed(() => {
  return FEATURED_SLUGS.map((slug) => providersData.find((p) => p.slug === slug || p.id === slug)).filter(Boolean)
})
</script>

<template>
  <div class="jc-featured-brands">
    <div class="jc-brand-grid">
      <article
        v-for="p in featuredList"
        :key="p!.id"
        class="jc-card jc-provider-item"
        :class="{ 'jc-provider-item--spotlight': p!.slug === 'guangsuyun' }"
      >
        <!-- 1. Header & Title -->
        <div class="jc-provider-item__head">
          <span class="jc-icon-tile" :class="{ 'jc-icon-tile--gold': p!.slug === 'guangsuyun' }">
            <JcIcon :name="p!.slug === 'guangsuyun' ? 'spark' : 'cloud'" :size="20" />
          </span>
          <div class="jc-provider-item__meta">
            <div class="jc-provider-item__title-row">
              <h3 class="jc-card__title jc-provider-item__title">
                <a :href="`/brands/${p!.slug}/`">{{ p!.name }}</a>
              </h3>
              <span v-if="p!.slug === 'guangsuyun'" class="jc-spotlight-pill">
                👑 本站主推
              </span>
            </div>
            <p class="jc-provider-item__price">
              {{ p!.entryPrice }} · {{ p!.traffic }}
            </p>
          </div>
        </div>

        <!-- 2. Tagline / Positioning -->
        <p class="jc-card__desc jc-provider-item__desc">{{ p!.positioning }}</p>

        <!-- 3. Tags (Protocols & Routes) -->
        <div class="jc-provider-item__tags">
          <span v-for="pr in p!.protocols" :key="pr" class="jc-tag-chip">{{ pr }}</span>
          <span v-for="r in p!.routes" :key="r" class="jc-tag-chip jc-tag-chip--route">{{ r }}</span>
        </div>

        <!-- 4. Key Facts & Verification -->
        <div class="jc-provider-item__facts">
          <span class="jc-provider-item__badge jc-provider-item__badge--active">
            <JcIcon name="check-circle" :size="12" />
            在册核验
          </span>
          <span v-if="p!.lastMeasured" class="jc-provider-item__badge jc-provider-item__badge--measured">
            <JcIcon name="gauge" :size="12" />
            实测证据: {{ p!.lastMeasured }}
          </span>
        </div>

        <!-- 5. Actions -->
        <div class="jc-provider-item__actions">
          <a :href="`/brands/${p!.slug}/`" class="jc-btn jc-btn--ghost jc-btn--sm">
            查看档案
          </a>
          <a :href="`/brands/${p!.slug}/#本站测速记录-measured-evidence`" class="jc-btn jc-btn--ghost jc-btn--sm">
            查看测速
          </a>
          <SponsoredLink
            :href="p!.site"
            class="jc-btn jc-btn--primary jc-btn--sm"
          >
            前往官网
            <JcIcon name="arrow-right" :size="12" />
          </SponsoredLink>
        </div>
      </article>
    </div>

    <!-- 查看全部 16 家品牌入口 -->
    <div class="jc-featured-footer">
      <a href="/brands/" class="jc-btn jc-btn--primary jc-btn--lg">
        <JcIcon name="layers" :size="18" />
        查看全部 16 家机场品牌资料与测速证据库
        <JcIcon name="arrow-right" :size="16" />
      </a>
    </div>
  </div>
</template>

<style scoped>
.jc-featured-brands {
  display: flex;
  flex-direction: column;
  gap: var(--jc-space-6);
}

.jc-brand-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: var(--jc-space-4);
}

@media (max-width: 1024px) {
  .jc-brand-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 640px) {
  .jc-brand-grid {
    grid-template-columns: 1fr;
  }
}

.jc-provider-item {
  display: flex;
  flex-direction: column;
  padding: var(--jc-space-4);
  background: var(--jc-surface-raised);
  border: 1px solid var(--jc-border);
  border-radius: var(--jc-radius-md);
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.jc-provider-item--spotlight {
  border-color: var(--jc-primary);
  background: linear-gradient(180deg, var(--jc-surface-solid) 0%, var(--jc-primary-softer) 100%);
  box-shadow: 0 4px 16px rgba(36, 107, 253, 0.12);
}

.jc-icon-tile--gold {
  background: rgba(245, 158, 11, 0.15);
  color: #f59e0b;
  border-color: rgba(245, 158, 11, 0.3);
}

.jc-provider-item__title-row {
  display: flex;
  align-items: center;
  gap: 8px;
}

.jc-spotlight-pill {
  font-size: 11px;
  font-weight: 800;
  color: #b45309;
  background: #fef3c7;
  border: 1px solid #fde68a;
  padding: 1px 6px;
  border-radius: 4px;
}

.jc-provider-item:hover {
  transform: translateY(-2px);
  box-shadow: var(--jc-shadow-md);
  border-color: var(--jc-border-strong);
}

.jc-provider-item--spotlight:hover {
  border-color: var(--jc-primary);
  box-shadow: 0 6px 20px rgba(36, 107, 253, 0.2);
}

.jc-provider-item__head {
  display: flex;
  align-items: center;
  gap: var(--jc-space-3);
  margin-bottom: var(--jc-space-3);
}

.jc-provider-item__title {
  margin: 0;
  font-size: var(--jc-text-base);
  font-weight: 700;
}

.jc-provider-item__title a {
  color: var(--jc-text);
  text-decoration: none;
}

.jc-provider-item__title a:hover {
  color: var(--jc-primary);
}

.jc-provider-item__price {
  margin: 2px 0 0 0;
  font-size: var(--jc-text-xs);
  font-weight: 600;
  color: var(--jc-primary-deep);
}

.jc-provider-item__desc {
  font-size: var(--jc-text-xs);
  color: var(--jc-text-soft);
  margin: 0 0 var(--jc-space-3) 0;
  line-height: var(--jc-leading-relaxed);
  flex-grow: 1;
}

.jc-provider-item__tags {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  margin-bottom: var(--jc-space-3);
}

.jc-tag-chip {
  font-size: 11px;
  padding: 2px 8px;
  background: var(--jc-surface-sunken);
  border-radius: var(--jc-radius-xs);
  color: var(--jc-text-soft);
  border: 1px solid var(--jc-border);
}

.jc-tag-chip--route {
  background: rgba(36, 107, 253, 0.08);
  color: var(--jc-primary-deep);
  border-color: rgba(36, 107, 253, 0.2);
}

.jc-provider-item__facts {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: var(--jc-space-4);
  font-size: 11px;
}

.jc-provider-item__badge {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 2px 6px;
  border-radius: 4px;
  font-weight: 600;
}

.jc-provider-item__badge--active {
  background: rgba(16, 185, 129, 0.1);
  color: #10b981;
}

.jc-provider-item__badge--measured {
  background: rgba(59, 130, 246, 0.1);
  color: #3b82f6;
}

.jc-provider-item__actions {
  display: flex;
  gap: 6px;
  align-items: center;
  margin-top: auto;
}

.jc-provider-item__actions .jc-btn {
  flex: 1;
  text-align: center;
  justify-content: center;
  font-size: 12px;
  padding: 6px 8px;
}

.jc-featured-footer {
  display: flex;
  justify-content: center;
  margin-top: var(--jc-space-4);
}
</style>
