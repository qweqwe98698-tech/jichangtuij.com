<script setup lang="ts">
/**
 * 专题页的内容清单。
 * 数据来自 frontmatter.itemList，与该页面输出的 ItemList 结构化数据同源，
 * 因此「页面上看到的条目」与「告诉搜索引擎的条目」永远一致。
 *
 * 每一条都必须带描述性锚文本（条目标题本身），不使用「点击这里」这类无意义锚文本。
 */
import { computed } from 'vue'
import { useData } from 'vitepress'
import JcIcon from './JcIcon.vue'

const props = withDefaults(defineProps<{ title?: string; source?: string }>(), {
  title: '',
  source: 'itemList'
})

const { frontmatter } = useData()

interface Item {
  name: string
  url: string
  note?: string
  stage?: string
}

const items = computed<Item[]>(() => {
  const raw = frontmatter.value[props.source]
  if (!Array.isArray(raw)) return []
  return raw
    .filter((i: any) => i && i.name && i.url)
    .map((i: any) => ({
      name: String(i.name),
      url: String(i.url),
      note: i.note ? String(i.note) : '',
      stage: i.stage ? String(i.stage) : ''
    }))
})
</script>

<template>
  <section v-if="items.length" class="jc-topic-index">
    <h2 v-if="title">{{ title }}</h2>
    <ol class="jc-topic-index__list">
      <li v-for="(item, i) in items" :key="item.url" class="jc-topic-index__item">
        <span v-if="item.stage" class="jc-topic-index__stage">{{ item.stage }}</span>
        <a class="jc-topic-index__link" :href="item.url">{{ item.name }}</a>
        <p v-if="item.note" class="jc-topic-index__note">{{ item.note }}</p>
        <JcIcon name="arrow-right" :size="15" class="jc-topic-index__arrow" />
        <span class="jc-visually-hidden">第 {{ i + 1 }} 项</span>
      </li>
    </ol>
  </section>
</template>

<style scoped>
.jc-topic-index__list {
  list-style: none;
  display: grid;
  gap: var(--jc-space-3);
  margin: var(--jc-space-4) 0;
  padding: 0;
  counter-reset: none;
}

.jc-topic-index__item {
  position: relative;
  display: grid;
  grid-template-columns: minmax(0, 1fr) auto;
  align-items: center;
  gap: 4px var(--jc-space-3);
  padding: var(--jc-space-4) var(--jc-space-5);
  border: 1px solid var(--jc-border);
  border-left: 3px solid var(--jc-primary);
  border-radius: var(--jc-radius-md);
  background: var(--jc-surface);
  transition:
    transform var(--jc-dur) var(--jc-ease-out),
    box-shadow var(--jc-dur) var(--jc-ease-out);
}

.jc-topic-index__item::before {
  content: none;
}

.jc-topic-index__item:hover {
  transform: translateY(-2px);
  box-shadow: var(--jc-shadow-sm);
}

.jc-topic-index__stage {
  grid-column: 1 / -1;
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.08em;
  color: var(--jc-primary-deep);
}

.jc-topic-index__link {
  font-size: var(--jc-text-md);
  font-weight: 600;
  color: var(--jc-text);
  border-bottom: none;
}

.jc-topic-index__link::after {
  content: '';
  position: absolute;
  inset: 0;
  border-radius: inherit;
}

.jc-topic-index__link:hover {
  color: var(--jc-primary-deep);
}

.jc-topic-index__note {
  grid-column: 1 / 2;
  margin: 0;
  font-size: var(--jc-text-sm);
  line-height: var(--jc-leading-snug);
  color: var(--jc-text-soft);
}

.jc-topic-index__arrow {
  grid-row: 1 / 2;
  grid-column: 2 / 3;
  color: var(--jc-primary);
}
</style>
