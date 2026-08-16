<script setup lang="ts">
/**
 * 机场推荐 jichangtuij.com 首页布局
 * 结构：
 * Hero → 6大核心决策卡 → 6家精选品牌库入口 → 4步选择流程 → 线路与客户端知识 → 故障排查与避坑预警 → 常见问题
 */
import HeroSection from './HeroSection.vue'
import QuickFinder from './QuickFinder.vue'
import FeaturedBrands from './FeaturedBrands.vue'
import FaqSection from './FaqSection.vue'
import JcIcon from './JcIcon.vue'
import { decisionCards, footerGroups } from '../../data/navigation'
</script>

<template>
  <div class="jc-home">
    <!-- 1. 首屏 Hero -->
    <HeroSection />

    <!-- 2. 30秒智能选型匹配器 (即时交互降低跳出率) -->
    <section class="jc-section" style="padding-top: 0; padding-bottom: 0;">
      <div class="jc-container">
        <QuickFinder />
      </div>
    </section>

    <!-- 3. 六大决策卡 (对应总指令第七节要求) -->
    <section class="jc-section" aria-labelledby="jc-decision-title">
      <div class="jc-container">
        <header class="jc-section-head">
          <p class="jc-eyebrow"><JcIcon name="compass" :size="14" />按需求快速直达</p>
          <h2 id="jc-decision-title" class="jc-section-title">按使用场景与预算找到适合的机场</h2>
          <p class="jc-section-desc">
            不同机场在专线成本、流量冗余与协议调度上各有取舍。先明确您的首要目标，直达专属选型方案：
          </p>
        </header>

        <div class="jc-grid jc-grid--3">
          <article
            v-for="card in decisionCards"
            :key="card.title"
            class="jc-card jc-decision-card"
          >
            <div class="jc-decision-card__header">
              <span class="jc-icon-tile">
                <JcIcon :name="card.icon" :size="20" />
              </span>
              <div>
                <h3 class="jc-card__title jc-decision-card__title">{{ card.title }}</h3>
                <p class="jc-decision-card__tagline">{{ card.tagline }}</p>
              </div>
            </div>
            <p class="jc-card__desc jc-decision-card__desc">{{ card.desc }}</p>
            <a :href="card.link" class="jc-btn jc-btn--ghost jc-btn--sm jc-decision-card__btn">
              {{ card.linkText }}
              <JcIcon name="arrow-right" :size="12" />
            </a>
          </article>
        </div>
      </div>
    </section>

    <!-- 3. 首页 16 家机场展示：6家精选 + 查看全部品牌 (对应第八节要求) -->
    <section class="jc-section jc-section--sunken" aria-labelledby="jc-brand-title">
      <div class="jc-container">
        <header class="jc-section-head">
          <p class="jc-eyebrow"><JcIcon name="cloud" :size="14" />品牌资料与实测</p>
          <h2 id="jc-brand-title" class="jc-section-title">主流机场品牌档案与节点测速证据</h2>
          <p class="jc-section-desc">
            收录 16 家机场公开参数、月付/年付门槛与 2026-08-11 本站节点测速截图证据。四层数据解耦展示，排列顺序不代表性能排名。
          </p>
        </header>

        <div class="jc-affiliate-compact">
          <JcIcon name="info" :size="14" />
          <span>本站包含推广合作关系，实测证据与品牌资料严格独立披露；测速仅代表当次测试环境。</span>
        </div>

        <FeaturedBrands />
      </div>
    </section>

    <!-- 4. 四步选型流程 -->
    <section class="jc-section" aria-labelledby="jc-flow-title">
      <div class="jc-container">
        <header class="jc-section-head">
          <p class="jc-eyebrow"><JcIcon name="route" :size="14" />选型方法论</p>
          <h2 id="jc-flow-title" class="jc-section-title">新手选机场的四步避坑法则</h2>
          <p class="jc-section-desc">
            从明确使用场景到本地宽带匹配，掌握这四步，轻松避开虚标节点与跑路风险。
          </p>
        </header>

        <div class="jc-grid jc-grid--4">
          <div class="jc-card jc-flow-card">
            <span class="jc-flow-card__step">01</span>
            <h3 class="jc-flow-card__title">确定核心用途</h3>
            <p class="jc-flow-card__desc">AI 工具看 IP 信誉与会话保持；流媒体看地区解锁与带宽；办公看长连接与丢包率。</p>
            <a href="/guides/how-to-choose/" class="jc-card__link">查看用途对照表 →</a>
          </div>

          <div class="jc-card jc-flow-card">
            <span class="jc-flow-card__step">02</span>
            <h3 class="jc-flow-card__title">核实线路类型</h3>
            <p class="jc-flow-card__desc">区分普通公网直连、BGP 中转与 IEPL/IPLC 跨境内网专线，晚高峰稳定性差异显著。</p>
            <a href="/network/iplc-vs-iepl/" class="jc-card__link">解析专线原理 →</a>
          </div>

          <div class="jc-card jc-flow-card">
            <span class="jc-flow-card__step">03</span>
            <h3 class="jc-flow-card__title">先月付验证</h3>
            <p class="jc-flow-card__desc">初次选购建议选择月付周期，在本地网络及常用晚高峰实际体验后再考虑长期套餐。</p>
            <a href="/recommend/cheap/" class="jc-card__link">查看平价月付方案 →</a>
          </div>

          <div class="jc-card jc-flow-card">
            <span class="jc-flow-card__step">04</span>
            <h3 class="jc-flow-card__title">匹配客户端</h3>
            <p class="jc-flow-card__desc">Windows 首选 Clash Verge / v2rayN，iOS 首选小火箭，Android 首选 Clash / sing-box。</p>
            <a href="/clients/" class="jc-card__link">下载客户端教程 →</a>
          </div>
        </div>
      </div>
    </section>

    <!-- 5. 常见问题 FAQ -->
    <section class="jc-section jc-section--sunken" aria-labelledby="jc-faq-title">
      <div class="jc-container jc-container--narrow">
        <header class="jc-section-head jc-section-head--center">
          <p class="jc-eyebrow"><JcIcon name="help-circle" :size="14" />常见问题解答</p>
          <h2 id="jc-faq-title" class="jc-section-title">2026 机场推荐高频答疑</h2>
        </header>

        <FaqSection
          :items="[
            {
              question: '为什么不同人在同一家机场的体验差异很大？',
              answer: '机场节点的实际表现极大程度取决于用户的本地运营商（电信/联通/移动）、地理位置、接入宽带以及访问时段。例如中国移动在国际出口直连上可能出现 QoS 限速，而通过 IEPL 专线中转则能获得稳定低延迟。'
            },
            {
              question: 'IEPL 专线与普通直连/中转机场有什么区别？',
              answer: 'IEPL（国际以太网私网专线）采用运营商物理内网过境，流量完全不经过公网 GFW 审查节点，因此在敏感时期和晚高峰具有极高的抗封锁能力与确定性延迟；直连线路则容易受公网拥堵与阻断影响。'
            },
            {
              question: '为什么本站不给出所谓的“全网最快机场”排名？',
              answer: '网络测速结果受测试点带宽、测试时段、并发线程及落地节点实时负载等多种因素影响，单次测速仅代表当次环境。我们坚持提供可核验的原始截图与参数事实，由用户根据自身预算与场景做出理性判断。'
            },
            {
              question: '使用 ChatGPT 或 Claude 提示打不开怎么办？',
              answer: 'AI 工具普遍对出口节点的 IP 类型（数据中心机房 IP vs 原生住宅 IP）和会话稳定性有严格风控。若遇阻断，通常需要切换至支持 AI 场景的原生节点，并清理浏览器 Cookie 或开启无痕模式。'
            }
          ]"
        />
      </div>
    </section>
  </div>
</template>

<style scoped>
.jc-decision-card {
  display: flex;
  flex-direction: column;
  padding: var(--jc-space-5);
  background: var(--jc-surface-raised);
  border: 1px solid var(--jc-border);
  border-radius: var(--jc-radius-md);
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.jc-decision-card:hover {
  transform: translateY(-2px);
  box-shadow: var(--jc-shadow-md);
  border-color: var(--jc-border-strong);
}

.jc-decision-card__header {
  display: flex;
  align-items: center;
  gap: var(--jc-space-3);
  margin-bottom: var(--jc-space-3);
}

.jc-decision-card__title {
  margin: 0;
  font-size: var(--jc-text-base);
  font-weight: 700;
  color: var(--jc-text);
}

.jc-decision-card__tagline {
  margin: 2px 0 0 0;
  font-size: 12px;
  color: var(--jc-primary-deep);
  font-weight: 500;
}

.jc-decision-card__desc {
  font-size: var(--jc-text-sm);
  color: var(--jc-text-soft);
  margin: 0 0 var(--jc-space-4) 0;
  line-height: var(--jc-leading-relaxed);
  flex-grow: 1;
}

.jc-decision-card__btn {
  margin-top: auto;
  align-self: flex-start;
}

.jc-flow-card {
  position: relative;
  display: flex;
  flex-direction: column;
  padding: var(--jc-space-5);
  background: var(--jc-surface-raised);
  border: 1px solid var(--jc-border);
  border-radius: var(--jc-radius-md);
}

.jc-flow-card__step {
  font-size: 28px;
  font-weight: 800;
  color: var(--jc-primary);
  opacity: 0.3;
  margin-bottom: var(--jc-space-2);
}

.jc-flow-card__title {
  font-size: var(--jc-text-base);
  font-weight: 700;
  margin: 0 0 var(--jc-space-2) 0;
  color: var(--jc-text);
}

.jc-flow-card__desc {
  font-size: var(--jc-text-sm);
  color: var(--jc-text-soft);
  margin: 0 0 var(--jc-space-4) 0;
  line-height: var(--jc-leading-relaxed);
  flex-grow: 1;
}
</style>
