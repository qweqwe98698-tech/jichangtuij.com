<script setup lang="ts">
/**
 * 首页「热门机场推荐」卡片：展示单个服务商的公开事实、定位与决策入口。
 * 推广链接经 SponsoredLink 组件输出，遵循与站内文章相同的披露规则。
 */
import JcIcon from './JcIcon.vue'
import SponsoredLink from './SponsoredLink.vue'

defineProps<{
  name: string
  tagline: string
  href: string
  positioning?: string
  tags?: string[]
  confirmed?: string
  pending?: string
  reviewLink?: string
}>()
</script>

<template>
  <article class="jc-card jc-provider">
    <div class="jc-provider__head">
      <span class="jc-icon-tile">
        <JcIcon name="cloud" :size="20" />
      </span>
      <div class="jc-provider__meta">
        <h3 class="jc-card__title">{{ name }}</h3>
        <p v-if="positioning" class="jc-provider__positioning">{{ positioning }}</p>
      </div>
    </div>

    <p class="jc-card__desc">{{ tagline }}</p>

    <div v-if="tags && tags.length" class="jc-provider__tags">
      <span v-for="t in tags" :key="t" class="jc-tag-chip">{{ t }}</span>
    </div>

    <div v-if="confirmed || pending" class="jc-provider__status">
      <p v-if="confirmed" class="jc-provider__status-item jc-provider__status-item--ok">
        <span class="jc-status-dot jc-status-dot--ok"></span>
        <strong>已确认：</strong>{{ confirmed }}
      </p>
      <p v-if="pending" class="jc-provider__status-item jc-provider__status-item--pending">
        <span class="jc-status-dot jc-status-dot--pending"></span>
        <strong>待核验：</strong>{{ pending }}
      </p>
    </div>

    <div class="jc-provider__actions">
      <a v-if="reviewLink" class="jc-btn jc-btn--quiet jc-btn--sm" :href="reviewLink">
        查看详细评测
      </a>
      <SponsoredLink :href="href" class="jc-btn jc-btn--primary jc-btn--sm">
        查看官网信息
      </SponsoredLink>
    </div>
  </article>
</template>

<style scoped>
.jc-provider {
  display: flex;
  flex-direction: column;
  height: 100%;
}

.jc-provider__head {
  display: flex;
  align-items: flex-start;
  gap: var(--jc-space-3);
  margin-bottom: var(--jc-space-2);
}

.jc-provider__meta {
  flex: 1;
}

.jc-provider__positioning {
  font-size: var(--jc-text-xs);
  color: var(--jc-primary-deep);
  font-weight: 600;
  margin-top: 2px;
}

.jc-provider__tags {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  margin: var(--jc-space-3) 0;
}

.jc-tag-chip {
  font-size: 11px;
  padding: 2px 8px;
  border-radius: var(--jc-radius-pill);
  background: var(--jc-primary-soft);
  color: var(--jc-primary-deep);
  font-weight: 500;
}

.jc-provider__status {
  margin-top: var(--jc-space-3);
  padding: var(--jc-space-3);
  background: var(--jc-surface-sunken);
  border-radius: var(--jc-radius-sm);
  font-size: var(--jc-text-xs);
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.jc-provider__status-item {
  display: flex;
  align-items: center;
  gap: 6px;
  line-height: var(--jc-leading-snug);
  color: var(--jc-text-soft);
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

.jc-provider__actions {
  margin-top: auto;
  padding-top: var(--jc-space-4);
  display: flex;
  gap: var(--jc-space-2);
  align-items: center;
}

.jc-provider__actions :deep(.jc-btn),
.jc-provider__actions a {
  flex: 1;
  text-align: center;
  justify-content: center;
}
</style>
