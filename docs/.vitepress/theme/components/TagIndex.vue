<script setup lang="ts">
/**
 * 标签索引。列出全部标签、各自聚合的已发布文章数量，以及是否达到可索引门槛。
 * 未达门槛的标签页仍然可以点进去、可以被抓取，但会输出 noindex —— 避免产生薄弱索引页。
 */
import { computed } from 'vue'
import { data as tagData } from '../data/tags.data'

const indexed = computed(() => tagData.tags.filter((t) => t.indexable))
const thin = computed(() => tagData.tags.filter((t) => !t.indexable))
</script>

<template>
  <div class="jc-tagindex">
    <section>
      <h2 id="可索引标签">可索引标签</h2>
      <p>
        聚合到 {{ tagData.threshold }} 篇及以上已发布文章的标签，具备独立的浏览价值，会进入站点地图与搜索索引。
      </p>
      <ul v-if="indexed.length" class="jc-tagindex__list">
        <li v-for="t in indexed" :key="t.slug">
          <a class="jc-tagindex__tag" :href="t.path">
            <span class="jc-tagindex__name">{{ t.name }}</span>
            <span class="jc-tagindex__count">{{ t.count }} 篇</span>
          </a>
        </li>
      </ul>
      <p v-else class="jc-empty">
        目前还没有标签达到 {{ tagData.threshold }} 篇的门槛。随着正式发布文章增加，达标的标签会自动出现在这里。
      </p>
    </section>

    <section>
      <h2 id="观察中的标签">观察中的标签</h2>
      <p>
        聚合内容不足 {{ tagData.threshold }} 篇的标签，页面依然存在且可以正常访问与抓取，
        但会输出 <code>noindex</code>，不进入站点地图 —— 这是为了避免制造只有一两条链接的低价值索引页。
        当聚合数量达标后，它会自动转为可索引。
      </p>
      <ul v-if="thin.length" class="jc-tagindex__list jc-tagindex__list--muted">
        <li v-for="t in thin" :key="t.slug">
          <a class="jc-tagindex__tag" :href="t.path">
            <span class="jc-tagindex__name">{{ t.name }}</span>
            <span class="jc-tagindex__count">{{ t.count }} 篇</span>
          </a>
        </li>
      </ul>
      <p v-else class="jc-empty">当前所有标签都已达到可索引门槛。</p>
    </section>
  </div>
</template>

<style scoped>
.jc-tagindex__list {
  list-style: none;
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin: var(--jc-space-4) 0;
  padding: 0;
}

.jc-tagindex__list li::before {
  content: none;
}

.jc-tagindex__tag {
  display: inline-flex;
  align-items: baseline;
  gap: 8px;
  min-height: 40px;
  padding: 8px 16px;
  border: 1px solid var(--jc-border);
  border-radius: var(--jc-radius-pill);
  background: var(--jc-primary-softer);
  color: var(--jc-text);
  font-size: var(--jc-text-sm);
  font-weight: 600;
  border-bottom: 1px solid var(--jc-border);
}

.jc-tagindex__tag:hover {
  border-color: rgba(36, 107, 253, 0.36);
  color: var(--jc-primary-deep);
}

.jc-tagindex__list--muted .jc-tagindex__tag {
  background: var(--jc-surface-sunken);
  font-weight: 500;
}

.jc-tagindex__count {
  font-size: var(--jc-text-xs);
  color: var(--jc-muted);
  font-weight: 500;
}
</style>
