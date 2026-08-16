<script setup lang="ts">
/**
 * 线路传输动态模拟器 —— 首屏右侧核心交互视觉
 * 支持一键切换【IEPL 跨境内网专线】与【普通公网直连】，
 * 直观动态展示数据过境路径、晚高峰丢包率与延迟差异。
 */
import { ref } from 'vue'
import JcIcon from './JcIcon.vue'

const activeMode = ref<'iepl' | 'direct'>('iepl')
</script>

<template>
  <figure class="jc-console" aria-labelledby="jc-console-title">
    <figcaption class="jc-visually-hidden">
      示意图：IEPL 内网专线与公网直连线路传输机制与性能指标动态对比模拟器。
    </figcaption>

    <!-- 顶部状态栏与模式切换切换器 -->
    <div class="jc-console__head">
      <div>
        <p id="jc-console-title" class="jc-console__title">线路传输动态模拟器</p>
        <p class="jc-console__sub">点击切换体验内网物理专线与公网直连底层差异</p>
      </div>
      <div class="jc-console__status-dot" :class="activeMode === 'iepl' ? 'is-iepl' : 'is-direct'">
        <span class="jc-console__dot-pulse"></span>
        {{ activeMode === 'iepl' ? 'IEPL 专线保通' : '公网直连链路' }}
      </div>
    </div>

    <!-- 交互模式切换开关 -->
    <div class="jc-console__switch">
      <button
        type="button"
        class="jc-console__switch-btn"
        :class="{ 'is-active': activeMode === 'iepl' }"
        @click="activeMode = 'iepl'"
      >
        <JcIcon name="shield" :size="14" />
        ⚡ IEPL 跨境内网专线 (推荐)
      </button>
      <button
        type="button"
        class="jc-console__switch-btn"
        :class="{ 'is-active': activeMode === 'direct' }"
        @click="activeMode = 'direct'"
      >
        <JcIcon name="globe" :size="14" />
        🌐 普通公网直连
      </button>
    </div>

    <!-- 动态网络光缆流向拓扑图 -->
    <div class="jc-console__map">
      <svg viewBox="0 0 420 170" role="img" aria-hidden="true" focusable="false">
        <defs>
          <linearGradient id="ieplLaser" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stop-color="var(--jc-primary)" stop-opacity="0.3" />
            <stop offset="50%" stop-color="#00f2fe" stop-opacity="1" />
            <stop offset="100%" stop-color="var(--jc-primary)" stop-opacity="0.3" />
          </linearGradient>

          <linearGradient id="directJitter" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stop-color="#f59e0b" stop-opacity="0.4" />
            <stop offset="50%" stop-color="#ef4444" stop-opacity="0.9" />
            <stop offset="100%" stop-color="#f59e0b" stop-opacity="0.4" />
          </linearGradient>

          <filter id="laserGlow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>

        <!-- 底层科技网格 -->
        <g opacity="0.25">
          <path
            v-for="i in 5"
            :key="`grid-${i}`"
            :d="`M14 ${18 + (i - 1) * 34} H406`"
            stroke="var(--jc-border-strong)"
            stroke-width="1"
            stroke-dasharray="2 6"
          />
        </g>

        <!-- 模式 A: IEPL 专线路径 (平滑、端到端内网光纤) -->
        <g v-if="activeMode === 'iepl'">
          <!-- 物理内网管道背景 -->
          <path
            d="M46 110 C 130 110, 150 48, 210 48 S 290 110, 374 110"
            fill="none"
            stroke="rgba(36, 107, 253, 0.2)"
            stroke-width="8"
            stroke-linecap="round"
          />
          <path
            d="M46 110 C 130 110, 150 48, 210 48 S 290 110, 374 110"
            fill="none"
            stroke="var(--jc-primary)"
            stroke-width="2"
          />
          <!-- 动态高速光流 -->
          <path
            class="jc-laser-flow"
            d="M46 110 C 130 110, 150 48, 210 48 S 290 110, 374 110"
            fill="none"
            stroke="url(#ieplLaser)"
            stroke-width="3"
            filter="url(#laserGlow)"
            stroke-linecap="round"
          />

          <!-- 专线节点 -->
          <g>
            <circle cx="46" cy="110" r="14" fill="rgba(36, 107, 253, 0.15)" />
            <circle cx="46" cy="110" r="6" fill="#fff" stroke="var(--jc-primary)" stroke-width="2.5" />
            <text x="46" y="136" text-anchor="middle" font-size="11" font-weight="700" fill="var(--jc-text)">国内入口</text>
            <text x="46" y="149" text-anchor="middle" font-size="9" fill="var(--jc-muted)">深圳/上海BGP</text>
          </g>

          <g>
            <circle cx="210" cy="48" r="16" fill="rgba(0, 242, 254, 0.2)" />
            <circle cx="210" cy="48" r="7" fill="#00f2fe" stroke="var(--jc-primary)" stroke-width="2" />
            <text x="210" y="26" text-anchor="middle" font-size="11" font-weight="700" fill="#0284c7">跨境内网专线光缆</text>
            <text x="210" y="38" text-anchor="middle" font-size="9" fill="#0369a1">物理直连 · 不经 GFW 审查</text>
          </g>

          <g>
            <circle cx="374" cy="110" r="14" fill="rgba(36, 107, 253, 0.15)" />
            <circle cx="374" cy="110" r="6" fill="#fff" stroke="var(--jc-primary)" stroke-width="2.5" />
            <text x="374" y="136" text-anchor="middle" font-size="11" font-weight="700" fill="var(--jc-text)">海外落地</text>
            <text x="374" y="149" text-anchor="middle" font-size="9" fill="var(--jc-muted)">香港/日本/美西</text>
          </g>
        </g>

        <!-- 模式 B: 普通公网直连路径 (公网骨干拥堵、GFW 审查队列) -->
        <g v-else>
          <!-- 抖动虚线公网路径 -->
          <path
            d="M46 110 C 120 140, 150 65, 210 65 S 300 140, 374 110"
            fill="none"
            stroke="rgba(239, 68, 68, 0.2)"
            stroke-width="5"
            stroke-dasharray="4 4"
          />
          <!-- 抖动丢包公网光斑 -->
          <path
            class="jc-jitter-flow"
            d="M46 110 C 120 140, 150 65, 210 65 S 300 140, 374 110"
            fill="none"
            stroke="url(#directJitter)"
            stroke-width="2.5"
            stroke-linecap="round"
            stroke-dasharray="8 12"
          />

          <!-- 直连节点 -->
          <g>
            <circle cx="46" cy="110" r="12" fill="rgba(245, 158, 11, 0.15)" />
            <circle cx="46" cy="110" r="5.5" fill="#fff" stroke="#f59e0b" stroke-width="2" />
            <text x="46" y="136" text-anchor="middle" font-size="11" font-weight="700" fill="var(--jc-text)">本地设备</text>
            <text x="46" y="149" text-anchor="middle" font-size="9" fill="var(--jc-muted)">公网宽带直连</text>
          </g>

          <g>
            <circle cx="210" cy="65" r="15" fill="rgba(239, 68, 68, 0.15)" />
            <circle cx="210" cy="65" r="6" fill="#ef4444" stroke="#b91c1c" stroke-width="2" />
            <text x="210" y="42" text-anchor="middle" font-size="11" font-weight="700" fill="#dc2626">公网国际骨干出口</text>
            <text x="210" y="54" text-anchor="middle" font-size="9" fill="#991b1b">GFW 审查 + 晚高峰 QoS 拥堵</text>
          </g>

          <g>
            <circle cx="374" cy="110" r="12" fill="rgba(245, 158, 11, 0.15)" />
            <circle cx="374" cy="110" r="5.5" fill="#fff" stroke="#f59e0b" stroke-width="2" />
            <text x="374" y="136" text-anchor="middle" font-size="11" font-weight="700" fill="var(--jc-text)">目标服务器</text>
            <text x="374" y="149" text-anchor="middle" font-size="9" fill="var(--jc-muted)">机房公网 IP</text>
          </g>
        </g>
      </svg>
    </div>

    <!-- 遥测实测指标对比栏 (4-Grid Telemetry) -->
    <div class="jc-console__metrics" :class="activeMode === 'iepl' ? 'is-iepl' : 'is-direct'">
      <div class="jc-console__metric-item">
        <span class="jc-console__metric-label">平均延迟</span>
        <span class="jc-console__metric-val">
          {{ activeMode === 'iepl' ? '~35ms 恒定低抖动' : '150ms ~ 320ms 频繁抖动' }}
        </span>
      </div>

      <div class="jc-console__metric-item">
        <span class="jc-console__metric-label">晚高峰丢包率</span>
        <span class="jc-console__metric-val">
          {{ activeMode === 'iepl' ? '< 0.1% 物理专线保通' : '15% ~ 30% 拥堵严重' }}
        </span>
      </div>

      <div class="jc-console__metric-item">
        <span class="jc-console__metric-label">抗审查能力</span>
        <span class="jc-console__metric-val">
          {{ activeMode === 'iepl' ? '物理内网不过 GFW' : '公网直接探测易受阻断' }}
        </span>
      </div>

      <div class="jc-console__metric-item">
        <span class="jc-console__metric-label">AI / 流媒体支持</span>
        <span class="jc-console__metric-val">
          {{ activeMode === 'iepl' ? '纯净原生出口 · 极少风控' : '机房万人共用 IP · 常遇拦截' }}
        </span>
      </div>
    </div>

    <!-- 结论胶囊 -->
    <div class="jc-console__verdict" :class="activeMode === 'iepl' ? 'is-iepl' : 'is-direct'">
      <JcIcon :name="activeMode === 'iepl' ? 'check-circle' : 'alert'" :size="15" />
      <span>
        {{
          activeMode === 'iepl'
            ? '选型结论：工作科研、ChatGPT/Claude、外贸与 4K 流媒体首选 IEPL 专线。'
            : '选型结论：仅适合预算极低、偶尔查阅网页轻度用户，晚高峰极易卡顿。'
        }}
      </span>
    </div>

    <!-- 快捷导流链接 -->
    <div class="jc-console__links">
      <a href="/network/iplc-vs-iepl/" class="jc-console__link">
        了解 IPLC vs IEPL 区别 →
      </a>
      <a href="/recommend/stable/" class="jc-console__link">
        查看稳定专线推荐 →
      </a>
    </div>
  </figure>
</template>

<style scoped>
.jc-console {
  background: var(--jc-surface-solid);
  border: 1px solid var(--jc-border);
  border-radius: var(--jc-radius-lg);
  padding: clamp(18px, 2.8vw, 24px);
  box-shadow: var(--jc-shadow-md);
  margin: 0;
}

.jc-console__head {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: var(--jc-space-2);
  margin-bottom: var(--jc-space-3);
}

.jc-console__title {
  margin: 0;
  font-size: var(--jc-text-base);
  font-weight: 800;
  color: var(--jc-text-strong);
}

.jc-console__sub {
  margin: 2px 0 0 0;
  font-size: 12px;
  color: var(--jc-text-soft);
}

.jc-console__status-dot {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-size: 11px;
  font-weight: 700;
  padding: 3px 8px;
  border-radius: var(--jc-radius-pill);
  flex-shrink: 0;
}

.jc-console__status-dot.is-iepl {
  background: rgba(16, 185, 129, 0.12);
  color: #10b981;
  border: 1px solid rgba(16, 185, 129, 0.3);
}

.jc-console__status-dot.is-direct {
  background: rgba(245, 158, 11, 0.12);
  color: #d97706;
  border: 1px solid rgba(245, 158, 11, 0.3);
}

.jc-console__dot-pulse {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: currentColor;
  box-shadow: 0 0 6px currentColor;
}

.jc-console__switch {
  display: grid;
  grid-template-columns: 1.15fr 0.85fr;
  gap: 6px;
  background: var(--jc-surface-sunken);
  padding: 4px;
  border-radius: var(--jc-radius-sm);
  border: 1px solid var(--jc-border);
  margin-bottom: var(--jc-space-3);
}

.jc-console__switch-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  padding: 6px 10px;
  font-size: 12px;
  font-weight: 600;
  color: var(--jc-text-soft);
  background: transparent;
  border: none;
  border-radius: var(--jc-radius-xs);
  cursor: pointer;
  transition: all 0.15s ease;
  white-space: nowrap;
}

.jc-console__switch-btn:hover {
  color: var(--jc-text-strong);
}

.jc-console__switch-btn.is-active {
  background: var(--jc-surface-solid);
  color: var(--jc-primary-deep);
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.08);
  font-weight: 700;
}

.jc-console__map {
  background: var(--jc-surface-sunken);
  border: 1px solid var(--jc-border);
  border-radius: var(--jc-radius-md);
  padding: 8px;
  margin-bottom: var(--jc-space-3);
}

.jc-console__map svg {
  display: block;
  width: 100%;
  height: auto;
}

/* 激光专线光流动效 */
.jc-laser-flow {
  stroke-dasharray: 18 12;
  animation: laserStream 1.8s linear infinite;
}

@keyframes laserStream {
  to {
    stroke-dashoffset: -300;
  }
}

/* 直连抖动动效 */
.jc-jitter-flow {
  animation: jitterStream 3.5s linear infinite;
}

@keyframes jitterStream {
  to {
    stroke-dashoffset: -200;
  }
}

/* 4-Grid Telemetry Metrics */
.jc-console__metrics {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 6px var(--jc-space-3);
  background: var(--jc-surface-sunken);
  border: 1px solid var(--jc-border);
  border-radius: var(--jc-radius-sm);
  padding: var(--jc-space-3);
  margin-bottom: var(--jc-space-3);
}

.jc-console__metric-item {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.jc-console__metric-label {
  font-size: 11px;
  color: var(--jc-text-soft);
}

.jc-console__metric-val {
  font-size: 12px;
  font-weight: 700;
  color: var(--jc-text-strong);
}

.jc-console__metrics.is-iepl .jc-console__metric-val {
  color: var(--jc-primary-deep);
}

.jc-console__metrics.is-direct .jc-console__metric-val {
  color: #b45309;
}

.jc-console__verdict {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 12px;
  line-height: 1.4;
  padding: 8px 12px;
  border-radius: var(--jc-radius-sm);
  margin-bottom: var(--jc-space-3);
}

.jc-console__verdict.is-iepl {
  background: rgba(36, 107, 253, 0.08);
  color: var(--jc-primary-deep);
  border: 1px solid rgba(36, 107, 253, 0.2);
}

.jc-console__verdict.is-direct {
  background: rgba(245, 158, 11, 0.08);
  color: #b45309;
  border: 1px solid rgba(245, 158, 11, 0.25);
}

.jc-console__links {
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 8px;
  font-size: 12px;
  border-top: 1px solid var(--jc-border);
  padding-top: var(--jc-space-2);
}

.jc-console__link {
  color: var(--jc-primary);
  font-weight: 600;
}

.jc-console__link:hover {
  text-decoration: underline;
}
</style>
