<script setup lang="ts">
/**
 * 机场实测数据与证据展示组件 (Dark Observatory 风格)
 * 严格保留原始测试时间与局限说明，严禁输出虚假排名或永久稳定断言。
 */
import { ref, onMounted } from 'vue'
import { withBase } from 'vitepress'
import JcIcon from './JcIcon.vue'

const props = withDefaults(
  defineProps<{
    providerName?: string
    testDate?: string | null
    testTime?: string
    backend?: string
    protocolDisplayed?: string
    screenshot?: string
    verificationStatus?: 'measured' | 'review-required' | string
    notes?: string
  }>(),
  {
    providerName: '服务商',
    testDate: '2026-08-11',
    verificationStatus: 'measured'
  }
)

const showModal = ref(false)
const isMounted = ref(false)

onMounted(() => {
  isMounted.value = true
})
</script>

<template>
  <div class="jc-measurement-card">
    <header class="jc-measurement-head">
      <div class="jc-measurement-title">
        <span class="jc-icon-tile jc-icon-tile--sm">
          <JcIcon name="gauge" :size="16" />
        </span>
        <strong>{{ providerName }} · 节点测速实测记录</strong>
      </div>
      <div class="jc-measurement-badges">
        <span
          class="jc-badge"
          :class="{
            'jc-badge--ok': verificationStatus === 'measured',
            'jc-badge--warn': verificationStatus === 'review-required'
          }"
        >
          {{ verificationStatus === 'measured' ? 'MEASURED 已测速' : 'REVIEW REQUIRED 日期待复核' }}
        </span>
      </div>
    </header>

    <div class="jc-measurement-grid">
      <div class="jc-measurement-item">
        <span class="jc-measurement-label">测试日期时间</span>
        <span class="jc-measurement-val">
          {{ testDate ? `${testDate} ${testTime || ''}` : `未全量确认 (${testTime || ''} CST)` }}
        </span>
      </div>

      <div class="jc-measurement-item">
        <span class="jc-measurement-label">测试后端 / 环境</span>
        <span class="jc-measurement-val">{{ backend || '珠海联通 5Gbps / 32 线程' }}</span>
      </div>

      <div class="jc-measurement-item">
        <span class="jc-measurement-label">截图中显示协议</span>
        <span class="jc-measurement-val">{{ protocolDisplayed || 'Shadowsocks / VLESS' }}</span>
      </div>

      <div class="jc-measurement-item">
        <span class="jc-measurement-label">证据来源说明</span>
        <span class="jc-measurement-val">本站保存之原始测速截图</span>
      </div>
    </div>

    <p v-if="notes" class="jc-measurement-notes">
      <JcIcon name="info" :size="14" />
      <span>{{ notes }}</span>
    </p>

    <div v-if="screenshot" class="jc-measurement-evidence">
      <div class="jc-measurement-thumb" @click="showModal = true">
        <img
          :src="withBase(screenshot)"
          :alt="`${providerName} 节点测速实测截图`"
          loading="lazy"
          decoding="async"
          width="360"
          height="450"
        />
        <div class="jc-measurement-overlay">
          <JcIcon name="eye" :size="20" />
          <span>点击查看原始大图证据</span>
        </div>
      </div>

      <p class="jc-measurement-caption">
        <strong>单次测试局限说明：</strong>
        本图记录当次测试环境下的节点延迟与吞吐结果，仅代表该时间点与测试线路，不代表长期表现、所有用户体验、AI/流媒体解锁或未来稳定性。
      </p>
    </div>

    <!-- 大图弹窗 modal (使用 isMounted 挂载，彻底规避 SSR Teleport 激活失败) -->
    <ClientOnly>
      <Teleport v-if="isMounted && showModal" to="body">
        <div class="jc-modal-backdrop" @click="showModal = false">
          <div class="jc-modal-content" @click.stop>
            <header class="jc-modal-head">
              <h3>{{ providerName }} 原始测速截图 (只读证据)</h3>
              <button type="button" class="jc-modal-close" @click="showModal = false">
                <JcIcon name="close" :size="20" />
              </button>
            </header>
            <div class="jc-modal-body">
              <img :src="withBase(screenshot)" :alt="`${providerName} 节点测速实测原图`" />
            </div>
          </div>
        </div>
      </Teleport>
    </ClientOnly>
  </div>
</template>

<style scoped>
.jc-measurement-card {
  margin: var(--jc-space-5) 0;
  padding: var(--jc-space-5);
  background: var(--jc-surface-sunken);
  border: 1px solid var(--jc-border-strong);
  border-radius: var(--jc-radius-md);
}

.jc-measurement-head {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: var(--jc-space-3);
  margin-bottom: var(--jc-space-4);
}

.jc-measurement-title {
  display: flex;
  align-items: center;
  gap: var(--jc-space-2);
  font-size: var(--jc-text-base);
  color: var(--jc-text);
}

.jc-badge {
  font-size: 11px;
  font-weight: 700;
  padding: 3px 8px;
  border-radius: var(--jc-radius-pill);
  letter-spacing: 0.5px;
}

.jc-badge--ok {
  background: rgba(16, 185, 129, 0.15);
  color: #10b981;
  border: 1px solid rgba(16, 185, 129, 0.3);
}

.jc-badge--warn {
  background: rgba(245, 158, 11, 0.15);
  color: #f59e0b;
  border: 1px solid rgba(245, 158, 11, 0.3);
}

.jc-measurement-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: var(--jc-space-3);
  margin-bottom: var(--jc-space-4);
  padding: var(--jc-space-3);
  background: var(--jc-surface-raised);
  border-radius: var(--jc-radius-sm);
}

.jc-measurement-item {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.jc-measurement-label {
  font-size: var(--jc-text-xs);
  color: var(--jc-muted);
}

.jc-measurement-val {
  font-size: var(--jc-text-sm);
  color: var(--jc-text);
  font-weight: 500;
}

.jc-measurement-notes {
  display: flex;
  align-items: flex-start;
  gap: 6px;
  font-size: var(--jc-text-xs);
  color: var(--jc-text-soft);
  margin-bottom: var(--jc-space-4);
  line-height: var(--jc-leading-relaxed);
}

.jc-measurement-thumb {
  position: relative;
  max-width: 320px;
  border-radius: var(--jc-radius-sm);
  overflow: hidden;
  border: 1px solid var(--jc-border);
  cursor: pointer;
}

.jc-measurement-thumb img {
  display: block;
  width: 100%;
  height: auto;
}

.jc-measurement-overlay {
  position: absolute;
  inset: 0;
  background: rgba(15, 23, 42, 0.75);
  color: #fff;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 6px;
  opacity: 0;
  transition: opacity 0.2s ease;
  font-size: var(--jc-text-xs);
}

.jc-measurement-thumb:hover .jc-measurement-overlay {
  opacity: 1;
}

.jc-measurement-caption {
  margin-top: var(--jc-space-3);
  font-size: var(--jc-text-xs);
  color: var(--jc-muted);
  line-height: var(--jc-leading-relaxed);
}

.jc-modal-backdrop {
  position: fixed;
  inset: 0;
  z-index: 9999;
  background: rgba(0, 0, 0, 0.85);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
}

.jc-modal-content {
  background: var(--jc-surface-raised);
  border-radius: var(--jc-radius-md);
  max-width: 900px;
  max-height: 90vh;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.jc-modal-head {
  padding: 12px 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid var(--jc-border);
}

.jc-modal-head h3 {
  font-size: var(--jc-text-sm);
  color: var(--jc-text);
  margin: 0;
}

.jc-modal-close {
  background: transparent;
  border: none;
  color: var(--jc-text-soft);
  cursor: pointer;
}

.jc-modal-body {
  padding: 16px;
  overflow-y: auto;
}

.jc-modal-body img {
  max-width: 100%;
  height: auto;
  display: block;
  margin: 0 auto;
}
</style>
