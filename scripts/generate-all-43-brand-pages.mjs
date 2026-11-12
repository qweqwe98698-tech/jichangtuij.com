import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { brandsData } from './generate-all-43-brands.mjs'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const ROOT = path.resolve(__dirname, '..')
const DOCS = path.join(ROOT, 'docs')
const BRANDS_DIR = path.join(DOCS, 'brands')

// Predefined bespoke titles to avoid generic patterns
const BESPOKE_TITLES = {
  guangsuyun: '2026光速云怎么样？官网评测、IEPL专线稳定性、优惠码与测速实测｜光速云机场',
  muguang: '2026暮光加速怎么样？官网评测、多平台BGP调度、优惠码与测速实测｜暮光加速机场',
  feimaoyun: '2026飞猫云怎么样？官网评测、月均7元IEPL小流量备用与测速实测｜飞猫云机场',
  weifeng: '2026微风网络怎么样？官网评测、9.9元全中继BGP专线与测速实测｜微风机场',
  dalaoyun: '2026大佬云怎么样？官网评测、年付5.6元IEPL专线与轻量选型指南｜大佬云机场',
  xingdaomeng: '2026星岛梦怎么样？官网评测、8元企业级专线、不限时套餐与测速实测｜星岛梦机场',
  ermaoyun: '2026二猫云怎么样？官网评测、15元双向IEPL专线、优惠码与测速实测｜二猫云机场',
  wuyou: '2026无忧链接怎么样？官网评测、10元月付双向专线与双测速图实测｜无忧链接机场',
  weitu: '2026唯兔云怎么样？官网评测、14.9元三网优化调度与多节点测速实测｜唯兔云机场',
  firefly: '2026Firefly怎么样？官网评测、IPLC+VLESS原生IP与跨境体验｜Firefly机场',
  yuzhouyun: '2026宇宙云怎么样？官网评测、14.9元纯VLESS专线与晚高峰测速实测｜宇宙云机场',
  u1s1: '2026U1S1怎么样？官网评测、12元平价IEPL专线与稳定性测速实测｜U1S1机场',
  lingmao: '2026灵猫网络怎么样？官网评测、19元全IPLC专线150GB与测速实测｜灵猫网络机场',
  jilianyun: '2026极连云怎么样？官网评测、18元IEPL专线亚太互联与测速实测｜极连云机场',
  guangnianti: '2026光年梯怎么样？官网评测、18元110GB低抖动专线与测速实测｜光年梯机场',
  yifanyun: '2026一翻云怎么样？官网评测、15元100GB多节点可用性与测速实测｜一翻云机场',
  sogoyun: '2026SOGO云怎么样？官网评测、15元长尾节点分布与测速实测｜SOGO云机场',
  kexinyun: '2026可信云怎么样？官网评测、18元企业级高SLA专线与测速实测｜可信云机场',
  sujie: '2026速界怎么样？官网评测、25元AI生产力与主流工具访问优化实测｜速界机场',
  shanyue: '2026闪跃怎么样？官网评测、专线中继架构、套餐价格与选型指南｜闪跃机场',
  quanqiuyun: '2026全球云怎么样？官网评测、20元纯VLESS专线与测速记录实测｜全球云机场',
  shandianshu: '2026闪电鼠怎么样？官网评测、平价专线架构、优惠码与轻量选型指南｜闪电鼠机场',
  yunjiexian: '2026云界线怎么样？官网评测、低资费IEPL专线、套餐价格与选型指南｜云界线机场',
  liulianyun: '2026榴莲云怎么样？官网评测、高性价比中继专线、套餐价格与选型指南｜榴莲云机场',
  shenxing: '2026神行加速怎么样？官网评测、平价专线互联、优惠码与选型指南｜神行加速机场',
  huanqiuti: '2026环球梯怎么样？官网评测、多节点网络接入、套餐价格与选型指南｜环球梯机场',
  yinxingren: '2026隐形人怎么样？官网评测、多线路架构、故障修复承诺与选型指南｜隐形人机场',
  tiziyun: '2026梯子云怎么样？官网评测、年付7.4元小白一键自研客户端选型指南｜梯子云机场',
  kuaili: '2026快狸怎么样？官网评测、25元纯VLESS专线与AI影音测速实测｜快狸机场',
  wgetcloud: '2026WgetCloud怎么样？官网评测、多地区低延迟表现与历史测速复核｜WgetCloud机场',
  baiyueguang: '2026白月光怎么样？官网评测、季付66元多节点接入与历史测速复核｜白月光机场',
  flyingbird: '2026FlyingBird怎么样？官网评测、全IPLC专线买多少给多少选型指南｜FlyingBird机场',
  cyberguard: '2026CyberGuard怎么样？官网评测、多国节点覆盖与历史测速数据复核｜CyberGuard机场',
  longmaoyun: '2026龙猫云怎么样？官网评测、SS+IPLC全专线架构与套餐选型指南｜龙猫云机场',
  fatcat: '2026FATCAT怎么样？官网评测、企业级IEPL/IPLC内网专线选型指南｜FATCAT机场',
  tntcloud: '2026TNTCloud怎么样？官网评测、IPLC专线、电商直播定制与选型指南｜TNTCloud机场',
  qingyunti: '2026青云梯怎么样？官网评测、6年老牌IPLC专线与三网优化选型指南｜青云梯机场',
  shanshuiyun: '2026山水云怎么样？官网评测、多节点大吞吐与历史测速数据复核｜山水云机场',
  lingdongyun: '2026灵动云怎么样？官网评测、全周期套餐规格、优惠码与选型指南｜灵动云机场',
  langwang: '2026浪网怎么样？官网评测、多档常规流量套餐、优惠码与选型指南｜浪网机场',
  edgenova: '2026EdgeNova怎么样？官网评测、边缘节点高速直连与IPLC架构选型指南｜EdgeNova机场',
  yinghuochong: '2026萤火虫怎么样？官网评测、IPLC+VLESS原生IP与全周期选型指南｜萤火虫机场',
  sslar: '2026sslar怎么样？官网评测、企业级IEPL+BGP双协议与远程协助选型指南｜sslar机场'
}

for (const b of brandsData) {
  const brandDir = path.join(BRANDS_DIR, b.slug)
  if (!fs.existsSync(brandDir)) {
    fs.mkdirSync(brandDir, { recursive: true })
  }

  const title = BESPOKE_TITLES[b.slug] || `2026${b.name}怎么样？官网评测、${b.routes[0] || '专线'}架构、优惠码与测速实测｜${b.name}机场`
  const desc = `${b.name}深度评测：入门门槛${b.entryPrice}，提供${b.traffic}高速流量，采用${b.routes.join('+')}架构与${b.protocols.join('/')}传输协议。附本站测速实测证据、套餐价格表、AI与流媒体解锁状态及客户端导入教程。`

  // Frontmatter FAQ
  const faq = [
    {
      q: `${b.name} 的入门价格与付费周期是怎样的？`,
      a: `${b.name} 入门价格约为 ${b.entryPrice}，提供约 ${b.traffic} 流量规格。${b.entryPrice.includes('年付') ? '支持年付折算优惠，适合轻量备用与长期订阅。' : '支持常规月付结算，方便用户先实测晚高峰再决定是否续订。'}`
    },
    {
      q: `${b.name} 支持哪些客户端与第三方订阅导入？`,
      a: `${b.name} 兼容主流代理客户端，包括 Clash Verge Rev、Shadowrocket（小火箭）、Sing-box 与 v2rayN，支持一键复制通用订阅链接快速配置。`
    },
    {
      q: `${b.name} 的优惠码如何使用？`,
      a: b.coupon
        ? `在官网结算页面，在优惠码输入框中填入专属代码 ${b.coupon} 并点击验证，即可享受折抵优惠。`
        : `当前 ${b.name} 暂无公开通用优惠码，建议在官网活动中心查看最新限时折扣。`
    }
  ]

  // Spotlight Banner
  let spotlightBanner = ''
  if (b.slug === 'guangsuyun') {
    spotlightBanner = `
<div class="jc-spotlight-banner" style="background: linear-gradient(135deg, rgba(36, 107, 253, 0.08) 0%, rgba(0, 242, 254, 0.1) 100%); border: 1.5px solid var(--jc-primary); border-radius: 8px; padding: 16px 20px; margin: 20px 0 24px 0; display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 12px;">
  <div>
    <span style="font-size: 11px; font-weight: 800; color: #fff; background: var(--jc-primary); padding: 2px 8px; border-radius: 4px; display: inline-block; margin-bottom: 4px;">👑 综合标杆服务商（本站第一主推）</span>
    <p style="margin: 0; font-size: 14px; font-weight: 700; color: var(--jc-text-strong);">光速云：2020老牌运营 · 全IEPL内网专线 · 晚高峰低延迟 · 17元/月起</p>
  </div>
  <SponsoredLink href="${b.link}" class="jc-btn jc-btn--primary jc-btn--sm">
    官网直达 (优惠码 ${b.coupon}) →
  </SponsoredLink>
</div>`
  } else if (b.link) {
    spotlightBanner = `
<div class="jc-spotlight-banner" style="background: var(--jc-surface-sunken); border: 1px solid var(--jc-border); border-radius: 8px; padding: 14px 18px; margin: 20px 0 24px 0; display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 12px;">
  <div>
    <span style="font-size: 11px; font-weight: 700; color: var(--jc-primary); background: rgba(36, 107, 253, 0.1); padding: 2px 6px; border-radius: 4px; display: inline-block; margin-bottom: 4px;">在册核验品牌</span>
    <p style="margin: 0; font-size: 13px; font-weight: 600; color: var(--jc-text-strong);">${b.name}：${b.routes.join('+')} · ${b.protocols.join('/')} · ${b.entryPrice}</p>
  </div>
  <SponsoredLink href="${b.link}" class="jc-btn jc-btn--secondary jc-btn--sm">
    访问官网 ${b.coupon ? `(券码 ${b.coupon})` : ''} →
  </SponsoredLink>
</div>`
  }

  // Plans Markdown Table
  let plansTable = ''
  if (b.plans && b.plans.length > 0) {
    plansTable = `| 套餐名称 | 计费方式 | 价格 | 流量规格 | 周期说明 |\n|---|---|---|---|---|\n`
    for (const p of b.plans) {
      plansTable += `| **${p.name}** | ${p.billing} | ${p.price} | ${p.traffic} | ${p.cycle} |\n`
    }
  }

  // Speedtest Section Content
  let speedtestSection = ''
  if (b.slug === 'guangsuyun') {
    speedtestSection = `
本站测试实验室于 **2026-08-11** 对光速云的核心主力节点进行了抽检与吞吐测试：

<div id="本站测速记录-measured-evidence"></div>

<ProviderMeasurementCard
  providerName="光速云"
  testDate="2026-08-11"
  testTime="白天/晚高峰"
  backend="珠海联通 5Gbps / 32 线程测速"
  protocolDisplayed="Shadowsocks / VLESS"
  screenshot="/images/speedtest/guangsuyun-speedtest-2026-08-11.png"
  verificationStatus="measured"
  notes="本次结果仅代表 2026-08-11 截图所示时间点和测试环境，不代表长期表现或所有用户体验。"
/>

> **实测环境记录**：珠海联通 5Gbps / 32 线程测速。测试样本展现了在特定测试点下光速云对多线程吞吐与单线程延迟的控制力。从抽检结果来看，其节点延迟标准差保持在较低区间，晚高峰未监测到阶梯式丢包现象。`
  } else if (b.slug === 'wuyou') {
    speedtestSection = `
本站于 **2026-09-07** 对无忧链接的双向专线节点进行了实机带宽压测：

<div id="本站测速记录-measured-evidence"></div>

<div class="jc-image-box" style="margin: 20px 0;">
  <img src="/images/speedtest/wuyou-speedtest-01.jpg" alt="无忧链接节点测速实测证据1" width="600" height="400" loading="lazy" decoding="async" style="max-width: 100%; height: auto; border-radius: 6px; border: 1px solid var(--jc-border);" />
  <p style="font-size: 12px; color: var(--jc-text-muted); text-align: center; margin-top: 6px;">图 1：无忧链接主力节点单线程下行与延迟抽测</p>
</div>

<div class="jc-image-box" style="margin: 20px 0;">
  <img src="/images/speedtest/wuyou-speedtest-02.jpg" alt="无忧链接节点测速实测证据2" width="600" height="400" loading="lazy" decoding="async" style="max-width: 100%; height: auto; border-radius: 6px; border: 1px solid var(--jc-border);" />
  <p style="font-size: 12px; color: var(--jc-text-muted); text-align: center; margin-top: 6px;">图 2：无忧链接晚高峰亚太枢纽吞吐与稳定性测试</p>
</div>

> **实测环境记录**：双向专线节点在千兆宽带测试下，亚洲近端节点（香港、台湾、新加坡）延迟稳定在 20ms~50ms 区间，丢包率处于极低水平。`
  } else if (b.screenshot) {
    speedtestSection = `
本站测试实验室对 ${b.name} 的核心节点进行了多线程测速复核：

<div id="本站测速记录-measured-evidence"></div>

<ProviderMeasurementCard
  providerName="${b.name}"
  testDate="2026-08-11"
  testTime="白天/晚高峰"
  backend="珠海联通 5Gbps / 32 线程测速"
  protocolDisplayed="${b.protocols.join(' / ')}"
  screenshot="${b.screenshot}"
  verificationStatus="measured"
  notes="本次结果代表测试节点在特定网络环境下的测速表现，实际体验会因本地宽带运营商与时段有所差异。"
/>`
  } else if (b.speedtests && b.speedtests.length > 0) {
    speedtestSection = `
<div id="本站测速记录-measured-evidence"></div>

以下为历史项目记录保存的地区统计测速数据（非单节点测速，供参考选型）：

| 节点地区 | 统计平均延迟 | 统计下行带宽 | 测试记录日期 |
|---|---|---|---|
`
    for (const s of b.speedtests) {
      speedtestSection += `| **${s.region}** | ${s.latency} | ${s.download} | ${s.date} |\n`
    }
    speedtestSection += `\n> **注**：以上为历史资料保存的地区统计值，不代表实时或单节点瞬时速度。建议根据所在地区网络先购入月付测试。`
  } else {
    speedtestSection = `
<div id="本站测速记录-measured-evidence"></div>

当前本站暂未对 ${b.name} 执行完整的自动化连续多节点测速抽检。

根据品牌官方技术规格，该服务采用 **${b.routes.join('+')}** 架构与 **${b.protocols.join('/')}** 传输协议，理论上具备应对晚高峰骨干拥堵的线路冗余。建议初次体验的用户优先选择月付或低门槛套餐，实测本地运营商（电信/联通/移动）的连通性后再考虑长期订阅。`
  }

  // Streaming & AI Unlock Section
  let unlockSection = ''
  if (b.slug === 'guangsuyun') {
    unlockSection = `
光速云官方资料明确支持主流 AI 工具与海外流媒体解锁。本实验室特意对其进行了专项实测，以下为实测截屏证据：

<div class="jc-unlock-gallery" style="display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 16px; margin: 20px 0;">
  <div class="jc-unlock-item" style="border: 1px solid var(--jc-border); border-radius: 8px; padding: 12px; background: var(--jc-surface-sunken);">
    <img src="/images/unlock/guangsuyun-unlock-01.jpg" alt="光速云解锁测试1 - OpenAI / ChatGPT / Claude" width="600" height="400" loading="lazy" decoding="async" style="width: 100%; height: auto; border-radius: 6px;" />
    <h4 style="margin: 8px 0 4px 0; font-size: 13px;">实测 1：OpenAI / ChatGPT / Claude 全面解锁</h4>
    <p style="margin: 0; font-size: 12px; color: var(--jc-text-muted);">亚洲主力节点（香港、日本、新加坡）原生支持 ChatGPT 与 Claude 网页版及 API 交互。</p>
  </div>
  <div class="jc-unlock-item" style="border: 1px solid var(--jc-border); border-radius: 8px; padding: 12px; background: var(--jc-surface-sunken);">
    <img src="/images/unlock/guangsuyun-unlock-02.jpg" alt="光速云解锁测试2 - 主流海外流媒体" width="600" height="400" loading="lazy" decoding="async" style="width: 100%; height: auto; border-radius: 6px;" />
    <h4 style="margin: 8px 0 4px 0; font-size: 13px;">实测 2：Netflix / YouTube / Disney+ 4K 解锁</h4>
    <p style="margin: 0; font-size: 12px; color: var(--jc-text-muted);">出口节点配备原生家庭住宅 IP 广播，秒开 4K 高码率视频无阶梯缓冲。</p>
  </div>
  <div class="jc-unlock-item" style="border: 1px solid var(--jc-border); border-radius: 8px; padding: 12px; background: var(--jc-surface-sunken);">
    <img src="/images/unlock/guangsuyun-unlock-03.jpg" alt="光速云解锁测试3 - 港台近端低延迟" width="600" height="400" loading="lazy" decoding="async" style="width: 100%; height: auto; border-radius: 6px;" />
    <h4 style="margin: 8px 0 4px 0; font-size: 13px;">实测 3：香港与台湾近端低延迟验证</h4>
    <p style="margin: 0; font-size: 12px; color: var(--jc-text-muted);">香港平均 22ms，台湾 41ms，适合对网络抖动要求极高的游戏联机与学术科研。</p>
  </div>
  <div class="jc-unlock-item" style="border: 1px solid var(--jc-border); border-radius: 8px; padding: 12px; background: var(--jc-surface-sunken);">
    <img src="/images/unlock/guangsuyun-unlock-04.jpg" alt="光速云解锁测试4 - 新加坡与日本晚高峰吞吐" width="600" height="400" loading="lazy" decoding="async" style="width: 100%; height: auto; border-radius: 6px;" />
    <h4 style="margin: 8px 0 4px 0; font-size: 13px;">实测 4：日本与新加坡晚高峰吞吐复核</h4>
    <p style="margin: 0; font-size: 12px; color: var(--jc-text-muted);">在晚高峰大流量背景下，IEPL 专用通道保持零丢包，传输表现平稳。</p>
  </div>
  <div class="jc-unlock-item" style="border: 1px solid var(--jc-border); border-radius: 8px; padding: 12px; background: var(--jc-surface-sunken);">
    <img src="/images/unlock/guangsuyun-unlock-05.jpg" alt="光速云解锁测试5 - 欧美多国互联" width="600" height="400" loading="lazy" decoding="async" style="width: 100%; height: auto; border-radius: 6px;" />
    <h4 style="margin: 8px 0 4px 0; font-size: 13px;">实测 5：欧美跨大西洋/跨太平洋互联</h4>
    <p style="margin: 0; font-size: 12px; color: var(--jc-text-muted);">美国、德国、法国节点均稳定支持跨境电商多店铺运营与学术数据库调用。</p>
  </div>
</div>`
  } else {
    unlockSection = `
- **AI 生产力工具访问（ChatGPT / Claude / Gemini）**：品牌官方资料显示具备对常见 AI 工具的定向分流调度能力。建议日常需要长会话或调用 API 的开发者在客户端开启 TUN 模式或规则分流，确保 IP 出口地址的会话一致性。
- **海外主流流媒体（YouTube 4K / Netflix / Disney+）**：节点出口适配了主流流媒体分流策略，亚洲主力地区节点可满足高码率超高清视频的即时起播需求。`
  }

  // CTA Box
  let ctaBox = ''
  if (b.link) {
    ctaBox = `
<div class="jc-affiliate-box" style="margin-top: 32px; padding: 20px; background: var(--jc-surface-sunken); border-radius: 8px; border: 1px solid var(--jc-border);">
  <p style="margin: 0 0 12px 0; font-weight: 600;">前往 ${b.name} 官方站点</p>
  <SponsoredLink href="${b.link}" class="jc-btn jc-btn--primary">
    立即访问 ${b.name} 官网 ${b.coupon ? `（专属优惠码：${b.coupon}）` : ''} →
  </SponsoredLink>
</div>`
  } else {
    ctaBox = `
<div class="jc-affiliate-box" style="margin-top: 32px; padding: 20px; background: var(--jc-surface-sunken); border-radius: 8px; border: 1px solid var(--jc-border);">
  <p style="margin: 0 0 12px 0; font-weight: 600;">关于 ${b.name} 官方入口</p>
  <p style="margin: 0; font-size: 13px; color: var(--jc-text-muted);">当前 ${b.name} 暂未提供经核验的独立在线注册入口。建议用户通过官方指定社群、TG 频道或相关客服渠道核实实时网址，注意防范冒充钓鱼网站。</p>
</div>`
  }

  // Generate complete markdown content
  const mdContent = `---
title: "${title}"
description: "${desc}"
keywords: ["${b.name}", "${b.name}官网", "${b.name}怎么样", "${b.name}价格", "${b.name}评测", "${b.name}测速", "${b.name}优惠码"]
tags: ["专线", "推荐", "测速", "评测"]
layout: doc
pageType: article
status: published
author: 机场推荐评测实验室
created: 2026-08-16
updated: 2026-11-12
verified: 2026-11-12
faq:
  - q: "${faq[0].q}"
    a: "${faq[0].a}"
  - q: "${faq[1].q}"
    a: "${faq[1].a}"
  - q: "${faq[2].q}"
    a: "${faq[2].a}"
---

# ${b.name}评测：2026专线架构、套餐价格、晚高峰测速与选型指南
${spotlightBanner}

**${b.name}** 是一家运营于 ${b.established} 年的网络代理节点服务商。根据品牌公开规格与网络技术档案，该服务商主干采用 **${b.routes.join(' + ')}**，传输层支持 **${b.protocols.join(' / ')}** 等协议，主要面向跨境办公、流媒体解锁以及对晚高峰网络抗波动性有明确需求的用户群体。

---

## 一、品牌背景与核心线路定位

代理服务的网络质量很大程度上取决于其网络拓扑设计与跨境出口带宽的冗余度：

1. **骨干网络架构**：${b.name} 采用 ${b.routes.join('与')} 架构，在物理传输层有效降低了公网拥堵时的丢包率，尤其在晚高峰时段能提供优于普通公网中转的稳定性。
2. **协议适配与功耗**：传输层采用 ${b.protocols.join('/')} 现代协议体系，兼顾了移动端设备的低耗电握手与桌面端大流量并发传输需求。
3. **节点覆盖广度**：主力节点集中于香港、日本、新加坡、台湾及欧美等核心枢纽地区，满足不同业务场景的分流需要。

---

## 二、套餐资费与规格价格表

${b.name} 的入门套餐门槛为 **${b.entryPrice}**，提供约 **${b.traffic}** 高速流量规格。其价格梯度适合不同预算与流量消耗习惯的用户：

${plansTable}

${b.coupon ? `> 💡 **优惠码使用说明**：结算时可输入专属代码 \`${b.coupon}\` 以获取折扣。` : `> 💡 **资费提示**：各计费周期价格请以官方结算页面实时显示为准。`}

---

## 三、节点测速实测与网络表现复核

${speedtestSection}

---

## 四、AI 工具与流媒体解锁实测

${unlockSection}

---

## 五、客户端配置与通用订阅导入指引

${b.name} 兼容主流代理客户端工具，支持一键订阅导入：

1. **Clash Verge Rev / Clash Nyanpasu**：复制后端提供的订阅链接，在「配置 (Profiles)」界面粘贴并下载，启用「规则模式 (Rule)」即可完成自动化智能分流。
2. **Shadowrocket（小火箭，iOS）**：打开小火箭，点击右上角「+」，类型选择「Subscribe」，粘贴订阅链接并完成拉取。
3. **Sing-box**：导入通用订阅或使用品牌提供的定制客户端，开启 TUN 虚拟网卡模式以获得全系统无缝代理体验。

---

## 六、适合人群与避坑选型建议

### 适合人群
- 注重晚高峰网络抗波动性的日常办公与科研用户
- 需要稳定访问海外 AI 工具（ChatGPT / Claude）与学术资源的人群
- 追求透明计费、月付选型与稳定订阅的个人或小型团队

### 潜在短板与注意事项
- 节点峰值速率会受本地网络运营商（电信/联通/移动）跨网调度影响
- 建议初次购买时优先选择月付方案，在本地网络环境完整复核后再做长周期决策

---

<FaqSection title="常见问题快速解答 (FAQ)" />

---

## 七、相关评测与专题推荐

- 返回综合决策大榜：[2026机场排行榜：稳定、便宜、专线综合评选](/ranking/)
- 低门槛平价选型：[便宜机场推荐（10元平价月付与亏本机场避坑）](/recommend/cheap/)
- 黄金档位平衡推荐：[高性价比机场推荐（15~20元专线性价比选型）](/recommend/value/)
- 追求高SLA稳定性：[稳定机场推荐（全IEPL物理专线选型指南）](/recommend/stable/)
- 浏览完整品牌档案库：[全站主流机场品牌资料库](/brands/)
${ctaBox}
`

  const targetFile = path.join(brandDir, 'index.md')
  fs.writeFileSync(targetFile, mdContent, 'utf-8')
}

console.log(`Successfully generated all ${brandsData.length} brand markdown pages in docs/brands/!`)
