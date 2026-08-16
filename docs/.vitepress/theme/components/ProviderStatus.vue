<script setup lang="ts">
/**
 * 机场品牌状态表 (`ProviderStatus.vue`)
 * 显示 16 家品牌收录状态、时间戳、说明及直达官网注册按钮。
 * 所有推广链接均独立带 rel="sponsored nofollow"。
 */
import { data as providerData } from '../data/providers.data'
import SponsoredLink from './SponsoredLink.vue'

const statusLabel: Record<string, string> = {
  active: '正常运营',
  watch: '观察中',
  stopped: '已停止服务'
}

/**
 * 格式化【核验状态】/【数据来源】/【待核验项】为可读块
 */
function parseNotes(notes: string) {
  if (!notes) return []
  
  // 匹配 【...】 块
  const parts = notes.split(/(?=【[^】]+】)/)
  return parts.map(part => {
    const match = part.match(/^【([^】]+)】(.*)/)
    if (match) {
      return {
        tag: match[1],
        content: match[2].trim()
      }
    }
    return { tag: '', content: part.trim() }
  }).filter(item => item.content || item.tag)
}
</script>

<template>
  <div
    v-if="providerData.hasData"
    class="jc-table-wrap jc-status-table-wrap"
    role="region"
    aria-label="已收录机场品牌数据库"
    tabindex="0"
  >
    <table class="jc-table jc-status-table">
      <caption>已收录 16 家品牌状态与核验证据库（所有数据附带实测记录与官方依据）。</caption>
      <thead>
        <tr>
          <th scope="col" class="col-name">品牌名称</th>
          <th scope="col" class="col-status">运营状态</th>
          <th scope="col" class="col-date">首次收录</th>
          <th scope="col" class="col-date">最近核实</th>
          <th scope="col" class="col-notes">说明与数据来源</th>
          <th scope="col" class="col-actions">官网注册 / 详情</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="p in providerData.providers" :key="p.id">
          <td class="col-name">
            <a :href="`/brands/${p.slug}/`" class="jc-brand-link">
              <strong>{{ p.name }}</strong>
            </a>
          </td>
          <td class="col-status">
            <span
              class="jc-status-pill"
              :class="{
                'jc-status-pill--active': p.status === 'active',
                'jc-status-pill--watch': p.status === 'watch',
                'jc-status-pill--stopped': p.status === 'stopped'
              }"
            >
              <span class="jc-status-dot"></span>
              {{ statusLabel[p.status] || p.status }}
            </span>
          </td>
          <td class="col-date">
            <time :datetime="p.firstSeen">{{ p.firstSeen }}</time>
          </td>
          <td class="col-date">
            <time :datetime="p.lastVerified">{{ p.lastVerified }}</time>
          </td>
          <td class="col-notes">
            <div class="jc-note-chunks">
              <div
                v-for="(chunk, idx) in parseNotes(p.notes)"
                :key="idx"
                class="jc-note-chunk"
              >
                <span
                  v-if="chunk.tag"
                  class="jc-note-tag"
                  :class="{
                    'jc-note-tag--ok': chunk.tag === '核验状态',
                    'jc-note-tag--src': chunk.tag === '数据来源',
                    'jc-note-tag--pending': chunk.tag === '待核验项'
                  }"
                >
                  {{ chunk.tag }}
                </span>
                <span class="jc-note-text">{{ chunk.content }}</span>
              </div>
            </div>
          </td>
          <td class="col-actions">
            <div class="jc-action-group">
              <SponsoredLink
                :href="p.site"
                class="jc-btn jc-btn--primary jc-btn--xs jc-register-btn"
                target="_blank"
                rel="sponsored nofollow"
              >
                官网注册
              </SponsoredLink>
              <a :href="`/brands/${p.slug}/`" class="jc-btn jc-btn--quiet jc-btn--xs">
                查看实测
              </a>
            </div>
          </td>
        </tr>
      </tbody>
    </table>
  </div>

  <div v-else class="jc-empty">
    <p><strong>当前没有已发布的品牌数据。</strong></p>
  </div>
</template>

<style scoped>
.jc-status-table-wrap {
  margin: var(--jc-space-5) 0;
  border: 1px solid var(--jc-border);
  border-radius: var(--jc-radius-md);
  overflow-x: auto;
  background: var(--jc-surface);
  box-shadow: var(--jc-shadow-sm);
}

.jc-status-table {
  width: 100%;
  border-collapse: collapse;
  font-size: var(--jc-text-sm);
  text-align: left;
}

.jc-status-table th,
.jc-status-table td {
  padding: 12px 14px;
  border-bottom: 1px solid var(--jc-border-subtle);
  vertical-align: middle;
}

.jc-status-table th {
  background: var(--jc-surface-sunken);
  color: var(--jc-muted);
  font-weight: 600;
  font-size: var(--jc-text-xs);
  letter-spacing: 0.5px;
  white-space: nowrap;
}

.jc-status-table tr:hover td {
  background: var(--jc-surface-sunken);
}

/* 列宽度与换行控制 */
.col-name {
  white-space: nowrap;
  font-size: var(--jc-text-base);
}

.jc-brand-link {
  color: var(--jc-text);
  text-decoration: none;
  font-weight: 700;
}

.jc-brand-link:hover {
  color: var(--jc-primary);
}

.col-status {
  white-space: nowrap;
}

.jc-status-pill {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 3px 9px;
  border-radius: var(--jc-radius-pill);
  font-size: 12px;
  font-weight: 600;
  white-space: nowrap;
}

.jc-status-pill--active {
  background: rgba(16, 185, 129, 0.12);
  color: #059669;
  border: 1px solid rgba(16, 185, 129, 0.25);
}

.dark .jc-status-pill--active {
  background: rgba(16, 185, 129, 0.2);
  color: #34d399;
}

.jc-status-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: currentColor;
}

.col-date {
  white-space: nowrap;
  font-family: var(--jc-font-mono, monospace);
  font-size: 13px;
  color: var(--jc-text-soft);
}

.col-notes {
  min-width: 320px;
  line-height: 1.5;
}

.jc-note-chunks {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.jc-note-chunk {
  display: flex;
  align-items: baseline;
  gap: 6px;
}

.jc-note-tag {
  font-size: 11px;
  font-weight: 700;
  padding: 1px 6px;
  border-radius: var(--jc-radius-sm);
  white-space: nowrap;
  flex-shrink: 0;
}

.jc-note-tag--ok {
  background: rgba(59, 130, 246, 0.12);
  color: #2563eb;
}

.dark .jc-note-tag--ok {
  background: rgba(59, 130, 246, 0.2);
  color: #60a5fa;
}

.jc-note-tag--src {
  background: rgba(107, 114, 128, 0.12);
  color: #4b5563;
}

.dark .jc-note-tag--src {
  background: rgba(156, 163, 175, 0.2);
  color: #d1d5db;
}

.jc-note-tag--pending {
  background: rgba(245, 158, 11, 0.12);
  color: #d97706;
}

.dark .jc-note-tag--pending {
  background: rgba(245, 158, 11, 0.2);
  color: #fbbf24;
}

.jc-note-text {
  font-size: var(--jc-text-xs);
  color: var(--jc-text-soft);
}

.col-actions {
  white-space: nowrap;
}

.jc-action-group {
  display: flex;
  align-items: center;
  gap: 8px;
}

.jc-register-btn {
  font-weight: 600;
}
</style>
