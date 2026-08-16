<script setup lang="ts">
/**
 * 推广链接组件 —— 按《推广披露与编辑独立性》的承诺逐条标注。
 *
 * 硬性规则：
 *  1. 站内任何推广（返佣）链接必须经由本组件输出，禁止裸写 <a>；
 *  2. 「推广」徽标与链接不可分离，悬停可见完整披露说明；
 *  3. rel="sponsored nofollow noopener" 向搜索引擎与浏览器声明商业关系；
 *  4. 链接文本必须包含品牌名（如「光速云官网注册」），不得使用「点击这里」类空泛文本。
 */
defineProps<{
  href: string
  buttonClass?: string
  hideBadge?: boolean
}>()

const disclosure =
  '推广链接：经此链接注册，机场推荐可能获得服务商支付的佣金，用户支付金额不变。' +
  '推广关系不影响本站的事实描述、测试结论与排列顺序，详见「推广披露与编辑独立性」页面。'
</script>

<template>
  <span class="jc-sponsored">
    <a
      :href="href"
      :class="buttonClass || 'jc-btn jc-btn--primary jc-btn--sm'"
      rel="sponsored nofollow noopener"
      target="_blank"
    >
      <slot>官网注册</slot>
    </a>
    <span v-if="!hideBadge" class="jc-sponsored__badge" :title="disclosure" aria-label="推广链接说明">推广</span>
  </span>
</template>

<style scoped>
.jc-sponsored {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  max-width: 100%;
}

.jc-sponsored a {
  flex: 1;
  text-align: center;
  justify-content: center;
  white-space: nowrap;
}

.jc-sponsored__badge {
  display: inline-block;
  padding: 1px 6px;
  border-radius: var(--jc-radius-pill, 9999px);
  border: 1px solid var(--jc-border-strong, rgba(255, 255, 255, 0.2));
  font-size: 11px;
  line-height: 1.4;
  color: var(--jc-text-soft, #94a3b8);
  background: var(--jc-surface-sunken, rgba(0, 0, 0, 0.2));
  cursor: help;
  white-space: nowrap;
  flex-shrink: 0;
}
</style>
