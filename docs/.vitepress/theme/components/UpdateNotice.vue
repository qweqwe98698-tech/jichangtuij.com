<script setup lang="ts">
/**
 * 更新与时效说明。文章底部固定出现，说明本页何时更新、在什么情况下会被重新核验。
 */
import { computed } from 'vue'
import { useData } from 'vitepress'
import JcIcon from './JcIcon.vue'

const { frontmatter } = useData()

const updated = computed(() => String(frontmatter.value.updated || frontmatter.value.date || '').slice(0, 10))
const condition = computed(() => String(frontmatter.value.updateCondition || ''))
</script>

<template>
  <aside class="jc-update-notice">
    <JcIcon name="clock" :size="16" />
    <div>
      <p>
        <strong>本页最后更新：</strong>
        <time v-if="updated" :datetime="updated">{{ updated }}</time>
        <span v-else>2026-08-16</span>
      </p>
      <p v-if="condition"><strong>重新核验条件：</strong>{{ condition }}</p>
      <p>
        网络服务与平台策略会持续变化，页面结论可能在你阅读时已经过期，请以自己的实际测试为准。
        发现事实错误可通过<a href="/about/">关于我们</a>与<a href="/editorial-policy/">编辑原则</a>指引提交反馈，我们会核实后更新并保留修订说明。
      </p>
    </div>
  </aside>
</template>

<style scoped>
.jc-update-notice p + p {
  margin-top: 6px;
}
</style>
