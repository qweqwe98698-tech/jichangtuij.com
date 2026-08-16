<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vitepress'
import JcIcon from './JcIcon.vue'

const props = defineProps<{
  type?: 'brand' | 'client' | 'network' | 'troubleshooting' | 'guide' | 'recommend' | 'auto'
  currentTitle?: string
}>()

const route = useRoute()

const currentPath = computed(() => route.path)

const resolvedType = computed(() => {
  if (props.type && props.type !== 'auto') return props.type
  const p = currentPath.value
  if (p.startsWith('/brands/')) return 'brand'
  if (p.startsWith('/clients/')) return 'client'
  if (p.startsWith('/network/')) return 'network'
  if (p.startsWith('/troubleshooting/')) return 'troubleshooting'
  if (p.startsWith('/recommend/')) return 'recommend'
  return 'guide'
})

interface StepItem {
  title: string
  desc: string
  link: string
  btnText: string
  icon: string
  isPrimary?: boolean
}

const matrixItems = computed<StepItem[]>(() => {
  const t = resolvedType.value

  if (t === 'brand') {
    return [
      {
        title: '横向对比选型',
        desc: '查看该品牌与其他主流专线机场在价格、线路与实测上的头对头对比。',
        link: '/compare/',
        btnText: '查看品牌对比',
        icon: 'git-compare'
      },
      {
        title: '客户端配置教程',
        desc: '在 Windows、Mac 或 iPhone 上一键导入该机场订阅并开启规则分流。',
        link: '/clients/',
        btnText: '查看客户端教程',
        icon: 'terminal',
        isPrimary: true
      },
      {
        title: '常见故障排障',
        desc: '遇到节点超时、全红或订阅无法更新？按标准急救步骤 1 分钟排查。',
        link: '/troubleshooting/',
        btnText: '故障排查中心',
        icon: 'wrench'
      }
    ]
  }

  if (t === 'client') {
    return [
      {
        title: '匹配优质专线机场',
        desc: '客户端配置完成？查看针对该客户端完美兼容的 IEPL 稳定专线推荐。',
        link: '/recommend/stable/',
        btnText: '查看稳定专线推荐',
        icon: 'compass',
        isPrimary: true
      },
      {
        title: '节点超时排查急救',
        desc: '节点全部 TIMEOUT 无法连接？检查系统时间、TUN 虚拟网卡与本地防火墙。',
        link: '/troubleshooting/node-timeout/',
        btnText: '节点超时排障指南',
        icon: 'alert-triangle'
      },
      {
        title: '专线与协议科普',
        desc: '了解 IEPL 专线与 VLESS 协议如何在底层提升传输速度与稳定性。',
        link: '/network/iplc-vs-iepl/',
        btnText: '专线原理解析',
        icon: 'route'
      }
    ]
  }

  if (t === 'troubleshooting') {
    return [
      {
        title: '升级稳定专线方案',
        desc: '若频繁受直连线路封锁困扰，建议换用内网过境的 IEPL 物理专线。',
        link: '/recommend/stable/',
        btnText: '查看稳定专线推荐',
        icon: 'shield',
        isPrimary: true
      },
      {
        title: '客户端正确配置',
        desc: '检查客户端分流规则，确保国内直连、海外走代理，避免 DNS 污染。',
        link: '/clients/clash/',
        btnText: 'Clash 配置指南',
        icon: 'terminal'
      },
      {
        title: 'ChatGPT 专属排障',
        desc: '遇到 OpenAI 地区不支持或 Cloudflare 拦截？查看 AI 节点专属排查法。',
        link: '/ai/chatgpt/',
        btnText: 'ChatGPT 排障指南',
        icon: 'help-circle'
      }
    ]
  }

  // default / guide / recommend
  return [
    {
      title: '16 家品牌全景资料库',
      desc: '按价格、线路与实测证据全面检索主流机场公开资费与 2026-08-11 测速记录。',
      link: '/brands/',
      btnText: '浏览品牌资料库',
      icon: 'cloud'
    },
    {
      title: '2026 机场推荐总览',
      desc: '按稳定、便宜、性价比与新手分类精准定位合适套餐。',
      link: '/recommend/',
      btnText: '查看推荐方案',
      icon: 'compass',
      isPrimary: true
    },
    {
      title: '新手选型避坑清单',
      desc: '如何辨别真假专线、避免永久套餐陷阱与合理选择月付周期。',
      link: '/guides/how-to-choose/',
      btnText: '选型避坑指南',
      icon: 'book'
    }
  ]
})
</script>

<template>
  <section class="jc-next-step" aria-label="下一步决策行动矩阵">
    <div class="jc-next-step__head">
      <div class="jc-next-step__title-box">
        <span class="jc-next-step__icon">
          <JcIcon name="compass" :size="18" />
        </span>
        <div>
          <h3 class="jc-next-step__title">下一步：继续探索与决策</h3>
          <p class="jc-next-step__sub">杜绝死胡同页面，按清晰路径完成您的网络配置与选型闭环</p>
        </div>
      </div>
    </div>

    <div class="jc-next-step__grid">
      <div
        v-for="item in matrixItems"
        :key="item.title"
        class="jc-next-step__card"
        :class="{ 'jc-next-step__card--primary': item.isPrimary }"
      >
        <div class="jc-next-step__card-head">
          <span class="jc-next-step__card-icon">
            <JcIcon :name="item.icon" :size="16" />
          </span>
          <h4 class="jc-next-step__card-title">{{ item.title }}</h4>
        </div>
        <p class="jc-next-step__card-desc">{{ item.desc }}</p>
        <a
          :href="item.link"
          class="jc-btn jc-btn--sm"
          :class="item.isPrimary ? 'jc-btn--primary' : 'jc-btn--ghost'"
        >
          {{ item.btnText }}
          <JcIcon name="arrow-right" :size="12" />
        </a>
      </div>
    </div>
  </section>
</template>

<style scoped>
.jc-next-step {
  margin: var(--jc-space-6) 0 var(--jc-space-4) 0;
  padding: clamp(20px, 3vw, 28px);
  background: var(--jc-surface-sunken);
  border: 1px solid var(--jc-border);
  border-radius: var(--jc-radius-lg);
}

.jc-next-step__head {
  margin-bottom: var(--jc-space-4);
  padding-bottom: var(--jc-space-3);
  border-bottom: 1px solid var(--jc-border);
}

.jc-next-step__title-box {
  display: flex;
  align-items: center;
  gap: var(--jc-space-3);
}

.jc-next-step__icon {
  width: 36px;
  height: 36px;
  background: var(--jc-primary-softer);
  color: var(--jc-primary-deep);
  border-radius: var(--jc-radius-sm);
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.jc-next-step__title {
  margin: 0;
  font-size: var(--jc-text-base);
  font-weight: 700;
  color: var(--jc-text-strong);
}

.jc-next-step__sub {
  margin: 2px 0 0 0;
  font-size: var(--jc-text-xs);
  color: var(--jc-text-soft);
}

.jc-next-step__grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: var(--jc-space-3);
}

.jc-next-step__card {
  background: var(--jc-surface-solid);
  border: 1px solid var(--jc-border);
  border-radius: var(--jc-radius-md);
  padding: var(--jc-space-4);
  display: flex;
  flex-direction: column;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.jc-next-step__card:hover {
  transform: translateY(-2px);
  box-shadow: var(--jc-shadow-sm);
  border-color: var(--jc-primary);
}

.jc-next-step__card--primary {
  border-color: var(--jc-primary);
  background: linear-gradient(to bottom, var(--jc-surface-solid), var(--jc-primary-softer));
}

.jc-next-step__card-head {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: var(--jc-space-2);
}

.jc-next-step__card-icon {
  color: var(--jc-primary);
  display: inline-flex;
}

.jc-next-step__card-title {
  margin: 0;
  font-size: var(--jc-text-sm);
  font-weight: 700;
  color: var(--jc-text-strong);
}

.jc-next-step__card-desc {
  font-size: 12px;
  line-height: 1.5;
  color: var(--jc-text-soft);
  margin: 0 0 var(--jc-space-3) 0;
  flex-grow: 1;
}

.jc-next-step__card a {
  align-self: flex-start;
  margin-top: auto;
}
</style>
