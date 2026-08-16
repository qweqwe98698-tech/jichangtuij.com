<script setup lang="ts">
import { computed } from 'vue'
import JcIcon from './JcIcon.vue'

const props = withDefaults(
  defineProps<{ type?: 'info' | 'success' | 'warning' | 'danger'; title?: string }>(),
  { type: 'warning', title: '' }
)

const icon = computed(
  () =>
    ({ info: 'info', success: 'check', warning: 'alert', danger: 'shield' })[props.type] || 'alert'
)

const defaultTitle = computed(
  () =>
    ({ info: '说明', success: '可以这样做', warning: '注意', danger: '风险提示' })[props.type] ||
    '注意'
)
</script>

<template>
  <aside class="jc-notice" :class="`jc-notice--${type}`">
    <p class="jc-notice__head">
      <JcIcon :name="icon" :size="16" />
      {{ title || defaultTitle }}
    </p>
    <div class="jc-notice__body">
      <slot />
    </div>
  </aside>
</template>
