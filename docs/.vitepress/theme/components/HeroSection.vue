<script setup lang="ts">
import JcIcon from './JcIcon.vue'
import CloudConsole from './CloudConsole.vue'
import SearchButton from './SearchButton.vue'
import { seo } from '../../data/site'
</script>

<template>
  <section class="jc-hero" aria-labelledby="jc-hero-title">
    <div class="jc-container jc-hero__inner">
      <div class="jc-hero__text jc-reveal">
        <p class="jc-eyebrow">
          <JcIcon name="spark" :size="14" />
          {{ seo.heroTag }}
        </p>

        <h1 id="jc-hero-title" class="jc-hero__title">
          <span class="jc-hero__title-kicker">2026 机场推荐</span>
          <span class="jc-hero__title-hook">稳定、便宜、高性价比机场怎么选</span>
        </h1>

        <p class="jc-hero__lead">{{ seo.subtitle }}</p>

        <div class="jc-hero__actions">
          <a class="jc-btn jc-btn--primary" href="/recommend/">
            查看机场推荐
            <JcIcon name="arrow-right" :size="16" />
          </a>
          <a class="jc-btn jc-btn--ghost" href="/guides/how-to-choose/">
            机场怎么选
            <JcIcon name="book" :size="16" />
          </a>
        </div>

        <SearchButton variant="bar" />

        <p class="jc-hero__note">
          机场推荐（jichangtuij.com）坚持实测证据与厂商声明严格分离。所有测速数据保留原始测试时间与环境，不作虚假排名与夸大承诺。
        </p>
      </div>

      <div class="jc-hero__visual jc-reveal jc-reveal--d2">
        <CloudConsole />
      </div>
    </div>
  </section>
</template>
