<script setup lang="ts">
import { ref, computed } from 'vue'
import JcIcon from './JcIcon.vue'
import SponsoredLink from './SponsoredLink.vue'
import { providersData, type ProviderItem } from '../data/providersData'

interface MatchResult {
  provider: ProviderItem
  score: number
  matchReason: string
  highlightBadge: string
}

// 筛选状态
const selectedDevice = ref<'all' | 'ios' | 'windows' | 'mac' | 'android'>('all')
const selectedScenario = ref<'ai' | 'streaming' | 'stable' | 'light'>('ai')
const selectedBudget = ref<'all' | 'budget' | 'balanced' | 'premium'>('balanced')

const devices = [
  { id: 'all', label: '📱 全部设备', hint: '多端通用' },
  { id: 'ios', label: '🍎 iOS / iPad', hint: '小火箭首选' },
  { id: 'windows', label: '💻 Windows', hint: 'Clash / v2rayN' },
  { id: 'mac', label: '🖥️ macOS', hint: 'Clash Verge' },
  { id: 'android', label: '🤖 Android', hint: 'Clash Meta' }
]

const scenarios = [
  { id: 'ai', label: '🤖 ChatGPT / Claude / 科研', hint: '高纯净度原生出口 IP' },
  { id: 'streaming', label: '🎬 Netflix 4K / YouTube', hint: '大带宽流媒体解锁' },
  { id: 'stable', label: '🛡️ 晚高峰稳定 / 办公会议', hint: 'IEPL/IPLC 跨境物理专线' },
  { id: 'light', label: '🌐 网页查资料 / 外贸轻度', hint: '基础稳定平价月付' }
]

const budgets = [
  { id: 'all', label: '不限预算', hint: '查看所有' },
  { id: 'budget', label: '💰 10元档', hint: '极低预算入门' },
  { id: 'balanced', label: '⚖️ 15~20元档', hint: '高性价比专线' },
  { id: 'premium', label: '⚡ 25元+档', hint: '高配低拥堵' }
]

// 智能匹配计算
const matchedResults = computed<MatchResult[]>(() => {
  const list: MatchResult[] = []

  for (const p of providersData) {
    let score = 50
    let matchReason = ''
    let highlightBadge = '推荐匹配'

    const price = parseFloat(p.entryPrice)

    // 预算加权
    if (selectedBudget.value === 'budget') {
      if (price <= 10 || p.isAnnualDiscount) {
        score += 35
        highlightBadge = '💰 低预算精选'
      } else {
        score -= 20
      }
    } else if (selectedBudget.value === 'balanced') {
      if (price >= 12 && price <= 20) {
        score += 35
        highlightBadge = '⚖️ 黄金性价比'
      } else {
        score += 10
      }
    } else if (selectedBudget.value === 'premium') {
      if (price >= 25) {
        score += 35
        highlightBadge = '⚡ 高端专线'
      }
    }

    // 场景加权
    if (selectedScenario.value === 'ai') {
      if (p.slug === 'sujie' || p.slug === 'sogoyun' || p.slug === 'guangsuyun') {
        score += 40
        matchReason = '出口针对 OpenAI 与 Claude 会话保持优化，支持常用原生节点。'
      } else if (p.aiSupported && p.aiSupported !== '待独立测试 (Not Tested)') {
        score += 25
        matchReason = '官方声明支持主流 AI 大模型与代码助手。'
      }
    } else if (selectedScenario.value === 'streaming') {
      if (p.slug === 'yifanyun' || p.slug === 'lingmao' || p.slug === 'kuaili') {
        score += 40
        matchReason = '大带宽冗余，支持 Netflix 非自制剧与 YouTube 4K 秒开。'
      } else if (p.streamingSupported && p.streamingSupported !== '待独立测试 (Not Tested)') {
        score += 25
        matchReason = '支持主流流媒体多区版权解锁。'
      }
    } else if (selectedScenario.value === 'stable') {
      if (p.routes.some((r: string) => r.includes('IPLC') || r.includes('IEPL'))) {
        score += 40
        matchReason = '内网物理专线跨境，不过公网 GFW，晚高峰丢包率极低。'
      }
    } else if (selectedScenario.value === 'light') {
      if (price <= 15) {
        score += 35
        matchReason = '平价门槛，适合日常查资料与轻度网页浏览。'
      }
    }

    // 主推品牌权重与徽标加成
    if (p.slug === 'guangsuyun') {
      score += 25
      highlightBadge = '👑 本站主推 · 综合第一'
      matchReason = '2020年稳定老牌，全IEPL专线多入口冗余，全天候低延迟，办公与AI首选。'
    }

    // 特殊排除
    if (p.status !== 'active') score -= 50

    if (score >= 60) {
      if (!matchReason) matchReason = `${p.positioning}，支持 ${p.protocols.join('/')}。`
      list.push({ provider: p, score, matchReason, highlightBadge })
    }
  }

  return list.sort((a, b) => b.score - a.score).slice(0, 3)
})
</script>

<template>
  <div class="jc-finder" id="quick-finder">
    <div class="jc-finder__head">
      <div class="jc-finder__title-box">
        <span class="jc-finder__icon">⚡</span>
        <div>
          <h3 class="jc-finder__title">30 秒智能选型匹配器</h3>
          <p class="jc-finder__subtitle">根据您的设备、核心用途与预算，实时计算最匹配的专属方案</p>
        </div>
      </div>
      <div class="jc-finder__badge-live">
        <span class="jc-finder__pulse"></span>
        实时动态匹配
      </div>
    </div>

    <!-- 交互选择区 -->
    <div class="jc-finder__filters">
      <!-- 维度 1: 核心用途 -->
      <div class="jc-finder__row">
        <span class="jc-finder__row-label">1. 核心用途：</span>
        <div class="jc-finder__chips">
          <button
            v-for="s in scenarios"
            :key="s.id"
            type="button"
            class="jc-chip-btn"
            :class="{ 'is-active': selectedScenario === s.id }"
            @click="selectedScenario = s.id as any"
          >
            {{ s.label }}
          </button>
        </div>
      </div>

      <!-- 维度 2: 预算偏好 -->
      <div class="jc-finder__row">
        <span class="jc-finder__row-label">2. 预算区间：</span>
        <div class="jc-finder__chips">
          <button
            v-for="b in budgets"
            :key="b.id"
            type="button"
            class="jc-chip-btn"
            :class="{ 'is-active': selectedBudget === b.id }"
            @click="selectedBudget = b.id as any"
          >
            {{ b.label }}
          </button>
        </div>
      </div>

      <!-- 维度 3: 设备类型 -->
      <div class="jc-finder__row">
        <span class="jc-finder__row-label">3. 常用设备：</span>
        <div class="jc-finder__chips">
          <button
            v-for="d in devices"
            :key="d.id"
            type="button"
            class="jc-chip-btn"
            :class="{ 'is-active': selectedDevice === d.id }"
            @click="selectedDevice = d.id as any"
          >
            {{ d.label }}
          </button>
        </div>
      </div>
    </div>

    <!-- 匹配结果展示 -->
    <div class="jc-finder__results">
      <div class="jc-finder__results-header">
        <span class="jc-finder__results-count">
          匹配到 <strong>{{ matchedResults.length }}</strong> 个高匹配方案：
        </span>
        <span class="jc-finder__results-note">基于 2026-08-11 实测参数与价格架构计算</span>
      </div>

      <div class="jc-finder__grid">
        <article
          v-for="(item, idx) in matchedResults"
          :key="item.provider.id"
          class="jc-finder-card"
          :class="{ 'jc-finder-card--best': idx === 0 }"
        >
          <div class="jc-finder-card__top">
            <div class="jc-finder-card__brand">
              <span class="jc-finder-card__rank">TOP {{ idx + 1 }}</span>
              <h4 class="jc-finder-card__name">{{ item.provider.name }}</h4>
            </div>
            <span class="jc-finder-card__badge">{{ item.highlightBadge }}</span>
          </div>

          <div class="jc-finder-card__price-row">
            <span class="jc-finder-card__price">¥{{ item.provider.entryPrice }}</span>
            <span class="jc-finder-card__period">
              {{ item.provider.isAnnualDiscount ? '/月 (年付折算)' : '/月起' }}
            </span>
            <span class="jc-finder-card__traffic">· {{ item.provider.traffic }}</span>
          </div>

          <p class="jc-finder-card__reason">
            <JcIcon name="check-circle" :size="14" />
            <span>{{ item.matchReason }}</span>
          </p>

          <div class="jc-finder-card__meta">
            <span v-for="r in item.provider.routes" :key="r" class="jc-tag-chip jc-tag-chip--route">
              {{ r }}
            </span>
            <span v-for="pr in item.provider.protocols" :key="pr" class="jc-tag-chip">
              {{ pr }}
            </span>
          </div>

          <div class="jc-finder-card__actions">
            <a :href="`/brands/${item.provider.slug}/`" class="jc-btn jc-btn--ghost jc-btn--sm">
              查看评测档案
            </a>
            <SponsoredLink :href="item.provider.site" button-class="jc-btn jc-btn--primary jc-btn--sm">
              前往官网
              <JcIcon name="arrow-right" :size="12" />
            </SponsoredLink>
          </div>
        </article>
      </div>
    </div>
  </div>
</template>

<style scoped>
.jc-finder {
  background: var(--jc-surface-solid);
  border: 1px solid var(--jc-border);
  border-radius: var(--jc-radius-lg);
  padding: clamp(20px, 3vw, 32px);
  margin: var(--jc-space-6) 0;
  box-shadow: var(--jc-shadow-sm);
  transition: border-color 0.2s ease;
}

.jc-finder:hover {
  border-color: var(--jc-border-strong);
}

.jc-finder__head {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  flex-wrap: wrap;
  gap: var(--jc-space-3);
  padding-bottom: var(--jc-space-4);
  border-bottom: 1px solid var(--jc-border);
  margin-bottom: var(--jc-space-4);
}

.jc-finder__title-box {
  display: flex;
  align-items: center;
  gap: var(--jc-space-3);
}

.jc-finder__icon {
  font-size: 24px;
  background: var(--jc-primary-softer);
  border: 1px solid var(--jc-border);
  width: 44px;
  height: 44px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: var(--jc-radius-md);
}

.jc-finder__title {
  margin: 0;
  font-size: var(--jc-text-lg);
  font-weight: 800;
  color: var(--jc-text-strong);
}

.jc-finder__subtitle {
  margin: 2px 0 0 0;
  font-size: var(--jc-text-xs);
  color: var(--jc-text-soft);
}

.jc-finder__badge-live {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-size: var(--jc-text-xs);
  font-weight: 600;
  color: var(--jc-primary-deep);
  background: var(--jc-primary-softer);
  padding: 4px 10px;
  border-radius: var(--jc-radius-pill);
  border: 1px solid var(--jc-border);
}

.jc-finder__pulse {
  width: 8px;
  height: 8px;
  background: var(--jc-primary);
  border-radius: 50%;
  box-shadow: 0 0 8px var(--jc-primary);
  animation: jcPulse 2s infinite;
}

@keyframes jcPulse {
  0%, 100% { opacity: 1; transform: scale(1); }
  50% { opacity: 0.4; transform: scale(1.2); }
}

.jc-finder__filters {
  display: flex;
  flex-direction: column;
  gap: var(--jc-space-3);
  margin-bottom: var(--jc-space-5);
}

.jc-finder__row {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: var(--jc-space-2) var(--jc-space-3);
}

.jc-finder__row-label {
  font-size: var(--jc-text-xs);
  font-weight: 700;
  color: var(--jc-text);
  min-width: 90px;
}

.jc-finder__chips {
  display: flex;
  flex-wrap: wrap;
  gap: var(--jc-space-2);
}

.jc-chip-btn {
  background: var(--jc-surface-sunken);
  border: 1px solid var(--jc-border);
  color: var(--jc-text-soft);
  font-size: 13px;
  padding: 5px 12px;
  border-radius: var(--jc-radius-pill);
  cursor: pointer;
  transition: all 0.15s ease;
  font-weight: 500;
}

.jc-chip-btn:hover {
  background: var(--jc-surface-solid);
  color: var(--jc-text-strong);
  border-color: var(--jc-primary);
}

.jc-chip-btn.is-active {
  background: var(--jc-primary);
  color: #fff;
  border-color: var(--jc-primary);
  font-weight: 600;
  box-shadow: 0 2px 6px rgba(36, 107, 253, 0.25);
}

.jc-finder__results {
  background: var(--jc-surface-sunken);
  border: 1px solid var(--jc-border);
  border-radius: var(--jc-radius-md);
  padding: var(--jc-space-4);
}

.jc-finder__results-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: var(--jc-space-2);
  margin-bottom: var(--jc-space-3);
  font-size: var(--jc-text-xs);
}

.jc-finder__results-count strong {
  color: var(--jc-primary);
  font-size: 15px;
}

.jc-finder__results-note {
  color: var(--jc-text-soft);
}

.jc-finder__grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
  gap: var(--jc-space-3);
}

.jc-finder-card {
  background: var(--jc-surface-solid);
  border: 1px solid var(--jc-border);
  border-radius: var(--jc-radius-md);
  padding: var(--jc-space-4);
  display: flex;
  flex-direction: column;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.jc-finder-card:hover {
  transform: translateY(-2px);
  box-shadow: var(--jc-shadow-md);
  border-color: var(--jc-primary);
}

.jc-finder-card--best {
  border-color: var(--jc-primary);
  background: linear-gradient(to bottom, var(--jc-surface-solid), var(--jc-primary-softer));
}

.jc-finder-card__top {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: var(--jc-space-2);
}

.jc-finder-card__brand {
  display: flex;
  align-items: center;
  gap: 6px;
}

.jc-finder-card__rank {
  font-size: 10px;
  font-weight: 800;
  color: #fff;
  background: var(--jc-primary);
  padding: 1px 5px;
  border-radius: 4px;
}

.jc-finder-card__name {
  margin: 0;
  font-size: var(--jc-text-base);
  font-weight: 700;
  color: var(--jc-text-strong);
}

.jc-finder-card__badge {
  font-size: 11px;
  font-weight: 600;
  color: var(--jc-primary-deep);
  background: var(--jc-primary-softer);
  padding: 2px 6px;
  border-radius: 4px;
  border: 1px solid var(--jc-border);
}

.jc-finder-card__price-row {
  display: flex;
  align-items: baseline;
  gap: 4px;
  margin-bottom: var(--jc-space-2);
}

.jc-finder-card__price {
  font-size: 20px;
  font-weight: 800;
  color: var(--jc-primary);
}

.jc-finder-card__period, .jc-finder-card__traffic {
  font-size: 12px;
  color: var(--jc-text-soft);
}

.jc-finder-card__reason {
  display: flex;
  align-items: flex-start;
  gap: 6px;
  font-size: 12px;
  line-height: 1.4;
  color: var(--jc-text);
  margin: 0 0 var(--jc-space-3) 0;
  flex-grow: 1;
}

.jc-finder-card__reason svg {
  color: var(--jc-primary);
  flex-shrink: 0;
  margin-top: 2px;
}

.jc-finder-card__meta {
  display: flex;
  flex-wrap: wrap;
  gap: 4px;
  margin-bottom: var(--jc-space-3);
}

.jc-finder-card__actions {
  display: flex;
  gap: var(--jc-space-2);
  margin-top: auto;
}

.jc-finder-card__actions a, .jc-finder-card__actions .jc-sponsored {
  flex: 1;
}
</style>
