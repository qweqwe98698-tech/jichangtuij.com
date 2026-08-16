<script setup lang="ts">
/**
 * 关注更新卡片。
 * 本站不设置邮件列表，也不接入任何第三方表单或统计脚本，
 * 因此这里只提供真实可用的入口：更新记录页与 RSS Feed。
 */
import JcIcon from './JcIcon.vue'
</script>

<template>
  <section class="jc-follow" aria-labelledby="jc-follow-title">
    <div>
      <h2 id="jc-follow-title" class="jc-section-title" style="font-size: var(--jc-text-xl)">
        跟进内容更新
      </h2>
      <p class="jc-section-desc">
        机场推荐不收集邮箱，也不使用第三方订阅表单。所有内容变更、事实修订与栏目调整都会记录在更新页，
        你可以直接用任意 RSS 阅读器订阅本站 Feed，或者收藏更新记录页定期查看。
      </p>
    </div>

    <div class="jc-follow__actions">
      <a class="jc-btn jc-btn--primary" href="/updates/">
        <JcIcon name="clock" :size="16" />
        查看更新记录
      </a>
      <a class="jc-btn jc-btn--ghost" href="/feed.xml">
        <JcIcon name="rss" :size="16" />
        订阅 RSS Feed
      </a>
    </div>
  </section>
</template>
