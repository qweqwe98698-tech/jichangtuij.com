<script setup lang="ts">
/**
 * 术语词典列表。数据源为 data/glossary.json，页面显示与 DefinedTermSet 结构化数据同源。
 */
import { computed, ref } from 'vue'
import JcIcon from './JcIcon.vue'
import { data as glossary } from '../data/glossary.data'

const activeCategory = ref('')
const keyword = ref('')

const termById = computed(() => Object.fromEntries(glossary.terms.map((t) => [t.id, t])))

const filtered = computed(() => {
  const kw = keyword.value.trim().toLowerCase()
  return glossary.terms.filter((t) => {
    if (activeCategory.value && t.category !== activeCategory.value) return false
    if (!kw) return true
    return (
      t.term.toLowerCase().includes(kw) ||
      t.en.toLowerCase().includes(kw) ||
      t.definition.toLowerCase().includes(kw)
    )
  })
})

const grouped = computed(() => {
  const map = new Map<string, typeof glossary.terms>()
  for (const t of filtered.value) {
    if (!map.has(t.category)) map.set(t.category, [])
    map.get(t.category)!.push(t)
  }
  return [...map.entries()]
})
</script>

<template>
  <div class="jc-glossary">
    <div class="jc-glossary__controls" data-pagefind-ignore>
      <label class="jc-glossary__search">
        <JcIcon name="search" :size="16" />
        <input
          v-model="keyword"
          type="search"
          placeholder="按术语、英文名或释义筛选"
          aria-label="在术语词典中筛选"
        />
      </label>

      <div class="jc-glossary__filters" role="group" aria-label="按主题筛选术语">
        <button
          type="button"
          class="jc-filter-chip"
          :class="{ 'is-active': activeCategory === '' }"
          :aria-pressed="activeCategory === ''"
          @click="activeCategory = ''"
        >
          全部（{{ glossary.terms.length }}）
        </button>
        <button
          v-for="c in glossary.categories"
          :key="c"
          type="button"
          class="jc-filter-chip"
          :class="{ 'is-active': activeCategory === c }"
          :aria-pressed="activeCategory === c"
          @click="activeCategory = activeCategory === c ? '' : c"
        >
          {{ c }}
        </button>
      </div>
    </div>

    <p v-if="!filtered.length" class="jc-empty">
      没有匹配的术语。可以清空筛选条件，或到<a href="/guides/">新手指南</a>查看完整解释。
    </p>

    <section v-for="[cat, items] in grouped" :key="cat" class="jc-glossary__group">
      <h2 :id="`term-${cat}`">{{ cat }}</h2>
      <dl class="jc-glossary__list">
        <div v-for="t in items" :key="t.id" :id="t.id" class="jc-glossary__item">
          <dt>
            <span class="jc-glossary__term">{{ t.term }}</span>
            <span v-if="t.en" class="jc-glossary__en">{{ t.en }}</span>
          </dt>
          <dd>
            <p class="jc-glossary__def">{{ t.definition }}</p>
            <p class="jc-glossary__detail">{{ t.detail }}</p>
            <p v-if="t.related.length" class="jc-glossary__related">
              相关术语：
              <a v-for="r in t.related" :key="r" :href="`#${r}`">{{ termById[r]?.term || r }}</a>
            </p>
          </dd>
        </div>
      </dl>
    </section>
  </div>
</template>

<style scoped>
.jc-glossary__controls {
  display: flex;
  flex-direction: column;
  gap: var(--jc-space-3);
  margin-bottom: var(--jc-space-6);
  padding: var(--jc-space-4);
  border: 1px solid var(--jc-border);
  border-radius: var(--jc-radius-lg);
  background: var(--jc-surface);
}

.jc-glossary__search {
  display: flex;
  align-items: center;
  gap: var(--jc-space-3);
  min-height: 44px;
  padding: 0 var(--jc-space-4);
  border: 1px solid var(--jc-border);
  border-radius: var(--jc-radius-pill);
  background: var(--jc-surface-solid);
  color: var(--jc-muted);
}

.jc-glossary__search input {
  flex: 1;
  min-width: 0;
  border: none;
  background: transparent;
  outline: none;
  font-size: var(--jc-text-sm);
  color: var(--jc-text);
}

.jc-glossary__filters {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}

.jc-glossary__group + .jc-glossary__group {
  margin-top: var(--jc-space-7);
}

.jc-glossary__list {
  display: grid;
  gap: var(--jc-space-4);
  margin: var(--jc-space-4) 0 0;
}

.jc-glossary__item {
  padding: var(--jc-space-4) var(--jc-space-5);
  border: 1px solid var(--jc-border);
  border-left: 3px solid var(--jc-sky);
  border-radius: var(--jc-radius-md);
  background: var(--jc-surface);
  scroll-margin-top: calc(var(--jc-header-height) + 24px);
}

.jc-glossary__item dt {
  display: flex;
  flex-wrap: wrap;
  align-items: baseline;
  gap: var(--jc-space-2);
  margin-bottom: var(--jc-space-2);
}

.jc-glossary__term {
  font-size: var(--jc-text-md);
  font-weight: 700;
}

.jc-glossary__en {
  font-family: var(--jc-font-mono);
  font-size: var(--jc-text-xs);
  color: var(--jc-muted);
}

.jc-glossary__item dd {
  margin: 0;
}

.jc-glossary__def {
  font-size: var(--jc-text-sm);
  line-height: var(--jc-leading-relaxed);
  font-weight: 500;
}

.jc-glossary__detail {
  margin-top: 8px;
  font-size: var(--jc-text-sm);
  line-height: var(--jc-leading-relaxed);
  color: var(--jc-text-soft);
}

.jc-glossary__related {
  margin-top: 10px;
  font-size: var(--jc-text-xs);
  color: var(--jc-muted);
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}
</style>
