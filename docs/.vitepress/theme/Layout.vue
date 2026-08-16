<script setup lang="ts">
/**
 * Cloud Halo 主布局。
 * layout 取值：home（首页）/ hub（栏目页）/ page（政策与说明页）/ 404 / 默认为文章页。
 *
 * Pagefind 索引控制：
 *   只有正式发布页面的正文容器会带 data-pagefind-body，
 *   导航、页脚、背景、目录、分享等区域统一 data-pagefind-ignore。
 */
import { computed } from 'vue'
import { Content, useData, useRoute } from 'vitepress'

import CloudBackdrop from './components/CloudBackdrop.vue'
import SiteHeader from './components/SiteHeader.vue'
import SiteFooter from './components/SiteFooter.vue'
import SearchModal from './components/SearchModal.vue'
import BackToTop from './components/BackToTop.vue'
import HomePage from './components/HomePage.vue'
import NotFoundPage from './components/NotFoundPage.vue'
import SideNav from './components/SideNav.vue'
import Breadcrumbs from './components/Breadcrumbs.vue'
import ArticleMeta from './components/ArticleMeta.vue'
import ArticleToc from './components/ArticleToc.vue'
import RelatedPosts from './components/RelatedPosts.vue'
import PrevNext from './components/PrevNext.vue'
import UpdateNotice from './components/UpdateNotice.vue'
import NextStepMatrix from './components/NextStepMatrix.vue'
import ShareTools from './components/ShareTools.vue'
import JcIcon from './components/JcIcon.vue'
import { categoryMap } from '../data/categories'

const { frontmatter, page } = useData()
const route = useRoute()

const layout = computed(() => String(frontmatter.value.layout || 'doc'))
const isHome = computed(() => layout.value === 'home')
const is404 = computed(() => layout.value === '404' || page.value.isNotFound)
const isHub = computed(() => layout.value === 'hub')
const isPlain = computed(() => layout.value === 'page')

const currentUrl = computed(() => route.path.replace(/index\.html$/, '').replace(/\.html$/, '/'))
const seg = computed(() => currentUrl.value.replace(/^\//, '').split('/')[0])
const category = computed(() => categoryMap[seg.value])

const isDraft = computed(() => frontmatter.value.draft === true)
const isNoindex = computed(() => frontmatter.value.noindex === true)
const isSearchPage = computed(() => currentUrl.value === '/search/')

/** 只有可索引页面才进入 Pagefind */
const indexable = computed(
  () => !is404.value && !isDraft.value && !isNoindex.value && !isSearchPage.value
)

const updated = computed(() =>
  String(frontmatter.value.updated || frontmatter.value.date || '').slice(0, 10)
)

const hasToc = computed(
  () => frontmatter.value.aside !== false && (page.value.headers?.length || 0) > 0
)
const showArticleFurniture = computed(() => !isHome.value && !is404.value && !isPlain.value)
</script>

<template>
  <div class="jc-root">
    <a class="jc-skip-link" href="#jc-main">跳到主要内容</a>

    <CloudBackdrop />

    <div class="jc-shell">
      <SiteHeader />

      <main id="jc-main" class="jc-main" tabindex="-1">
        <!-- 首页 -->
        <HomePage v-if="isHome" />

        <!-- 404 -->
        <NotFoundPage v-else-if="is404" />

        <!-- 政策 / 说明页：单栏窄版 -->
        <div v-else-if="isPlain" class="jc-container">
          <div class="jc-doc jc-doc--plain">
            <div class="jc-doc__body">
              <Breadcrumbs />
              <article
                class="jc-prose"
                :data-pagefind-body="indexable ? '' : undefined"
                :data-pagefind-meta="indexable && updated ? `updated:${updated}` : undefined"
                :data-pagefind-filter="
                  indexable && category ? `category:${category.title}` : undefined
                "
              >
                <Content />
              </article>
              <UpdateNotice />
              <ShareTools />
              <RelatedPosts title="继续阅读" :limit="3" />
            </div>
          </div>
        </div>

        <!-- 栏目页与文章页 -->
        <div v-else class="jc-container">
          <div class="jc-doc" :class="{ 'jc-doc--no-aside': !hasToc }">
            <aside class="jc-doc__nav">
              <SideNav />
            </aside>

            <div class="jc-doc__body">
              <Breadcrumbs />

              <div v-if="isDraft" class="jc-draft-banner" data-pagefind-ignore>
                <JcIcon name="alert" :size="18" />
                <div>
                  <strong>这是一篇未完成的写作大纲</strong>
                  本页只包含选题结构、核验清单与写作要点，尚未完成事实核验，
                  因此不会进入站点地图、全文搜索与首页文章流，也不建议作为结论引用。
                  已完成的内容可以在<a href="/updates/">更新记录</a>中查看。
                </div>
              </div>

              <ArticleMeta v-if="showArticleFurniture" />

              <details v-if="hasToc" class="jc-toc-mobile" data-pagefind-ignore>
                <summary>本页目录</summary>
                <div class="jc-toc-mobile__body">
                  <ArticleToc />
                </div>
              </details>

              <article
                class="jc-prose"
                :class="{ 'jc-prose--wide': isHub }"
                :data-pagefind-body="indexable ? '' : undefined"
                :data-pagefind-meta="indexable && updated ? `updated:${updated}` : undefined"
                :data-pagefind-filter="
                  indexable && category ? `category:${category.title}` : undefined
                "
              >
                <Content />
              </article>

              <template v-if="showArticleFurniture">
                <NextStepMatrix />
                <UpdateNotice />
                <ShareTools />
                <PrevNext />
                <RelatedPosts />
              </template>
            </div>

            <aside v-if="hasToc" class="jc-doc__aside">
              <ArticleToc />
            </aside>
          </div>
        </div>
      </main>

      <SiteFooter />
    </div>

    <SearchModal />
    <BackToTop />
  </div>
</template>
