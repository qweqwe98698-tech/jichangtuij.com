<script setup lang="ts">
import JcIcon from './JcIcon.vue'
import { footerGroups } from '../../data/navigation'
import { brand, CURRENT_YEAR } from '../../data/site'
</script>

<template>
  <footer class="jc-footer" data-pagefind-ignore>
    <div class="jc-container">
      <div class="jc-footer__top">
        <div class="jc-footer__brand">
          <a class="jc-logo" href="/" aria-label="机场推荐 JichangTuij 首页">
            <img
              class="jc-logo__mark"
              src="/logo-mark.svg"
              alt=""
              width="34"
              height="34"
              aria-hidden="true"
            />
            <span class="jc-logo__text">
              <span class="jc-logo__zh">{{ brand.nameZh }}</span>
              <span class="jc-logo__en">{{ brand.nameEn }}</span>
            </span>
          </a>
          <p>{{ brand.slogan }}。{{ brand.independence }}</p>
          <p>
            没有可核验的真实测试数据时，我们不会发布速度、延迟、解锁结论与品牌排名。
            所有结论都会标注更新时间与适用条件。
          </p>
        </div>

        <nav
          v-for="group in footerGroups"
          :key="group.title"
          class="jc-footer__group"
          :aria-label="group.title"
        >
          <p class="jc-footer__group-title">{{ group.title }}</p>
          <ul class="jc-footer__list">
            <li v-for="item in group.items" :key="item.link">
              <a :href="item.link">{{ item.text }}</a>
            </li>
          </ul>
        </nav>
      </div>

      <p class="jc-footer__disclaimer">
        免责声明：机场推荐（jichangtuij.com）提供的是通用技术知识、选择方法与风险提示，不构成对任何具体服务的担保或投资建议。
        网络服务的可用性会随平台策略、线路状态与运营情况变化，页面结论可能在你阅读时已经失效，请以实际测试为准。
        读者应遵守所在地法律法规以及所使用平台的服务条款。本站不销售、不代理、不运营任何机场或网络服务，
        也不提供节点、订阅链接或破解工具。
      </p>

      <div class="jc-footer__bottom">
        <span>© {{ CURRENT_YEAR }} {{ brand.nameZh }} {{ brand.nameEn }} · {{ brand.domain }}</span>
        <span class="jc-footer__links">
          <a href="/privacy/">隐私政策</a>
          <span aria-hidden="true">·</span>
          <a href="/terms/">使用条款</a>
          <span aria-hidden="true">·</span>
          <a href="/editorial-policy/">编辑原则</a>
          <span aria-hidden="true">·</span>
          <a href="/feed.xml" rel="alternate">
            <JcIcon name="rss" :size="13" />
            Feed
          </a>
        </span>
      </div>
    </div>
  </footer>
</template>

<style scoped>
.jc-footer__links {
  display: inline-flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 8px;
}

.jc-footer__links a {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  color: var(--jc-text-soft);
}

.jc-footer__links a:hover {
  color: var(--jc-primary);
}
</style>
