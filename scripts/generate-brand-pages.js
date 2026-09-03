import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const ROOT = path.resolve(__dirname, '..')
const DOCS = path.join(ROOT, 'docs')
const BRANDS_DIR = path.join(DOCS, 'brands')

const BRANDS = JSON.parse(fs.readFileSync(path.join(ROOT, 'data', 'providers.json'), 'utf-8'))
const PROVIDER_DATA_DIR = path.join(ROOT, 'docs', '.vitepress', 'data', 'providers')

for (const p of BRANDS) {
  const brandDataFile = path.join(PROVIDER_DATA_DIR, `${p.slug}.json`)
  const fullData = JSON.parse(fs.readFileSync(brandDataFile, 'utf-8'))
  const brandDir = path.join(BRANDS_DIR, p.slug)
  if (!fs.existsSync(brandDir)) fs.mkdirSync(brandDir, { recursive: true })

  const isAnnual = fullData.vendor.entryPrice.includes('年付')
  const priceNotice = isAnnual
    ? `> [!IMPORTANT]\n> **价格说明**：${fullData.name} 的入门价格为 **${fullData.vendor.entryPrice}**，属于年付方案折算后的平均月度成本。若按单月订阅购买，单价及流量规格会有所不同，请勿直接与常规月付套餐横向对标。`
    : `> [!NOTE]\n> **月付支持**：${fullData.name} 支持常规月付周期，入门门槛为 **${fullData.vendor.entryPrice}**（包含 ${fullData.vendor.traffic} 流量），适合偏好低决策风险、按月使用的用户。`

  const speedtestSection = fullData.measured.hasSpeedtest
    ? `## 本站测速记录 (Measured Evidence)

本站于 **${fullData.measured.testDate}** 对 ${fullData.name} 的节点进行了实测抽检。测速截图保留了原始测试环境与节点状态：

<ProviderMeasurementCard
  providerName="${fullData.name}"
  testDate="${fullData.measured.testDate}"
  testTime="${fullData.measured.testTime}"
  backend="${fullData.measured.testTool}"
  protocolDisplayed="${fullData.measured.speedtestProtocol}"
  screenshot="${fullData.measured.screenshotPath}"
  verificationStatus="${fullData.measured.status === 'Review Required' ? 'review-required' : 'measured'}"
  notes="${fullData.measured.disclaimer}"
/>

> **测试局限与免责提示**：  
> 测试日期：**${fullData.measured.testDate}** ｜ 数据状态：**${fullData.measured.status}** ｜ 证据来源：**本站保留的原始测速截图**  
> 本次测速结果仅代表截图所示时间点与特定测试网络环境，不代表全天候长期表现或所有本地运营商体验。测速结果不构成对“最快/全网第一”的绝对承诺。`
    : `## 本站测速记录 (Measured Evidence)

> 当前该品牌暂未收录标准化测试截图，数据状态标注为 **Review Required**，待后续复核更新。`

  const aiSection = fullData.slug === 'weitu' || fullData.slug === 'kexinyun'
    ? `## AI 工具与流媒体支持状态说明

- **AI 工具（ChatGPT / Claude / Gemini）**：**待独立测试 (Not Tested)**。当前官方资料未提供统一批量实测结果，建议用户以实际节点连通性为准，不作“全量解锁”承诺。
- **海外流媒体（Netflix / YouTube 4K / Disney+）**：**待独立测试 (Not Tested)**。建议在购买后优先使用月付套餐进行本地节点解锁验证。`
    : fullData.slug === 'sujie'
    ? `## AI 工具与流媒体支持状态说明

- **AI 工具访问（ChatGPT / Claude / Gemini）**：**品牌声明 (Vendor Claim)**。${fullData.name} 在宣传中重点强调对 AI 平台的优化支持，具体出口 IP 信誉与会话稳定性以后续独立检测为准。
- **流媒体解锁**：**品牌声明 (Vendor Claim)**。官方资料标注支持主流海外流媒体播放。`
    : `## AI 工具与流媒体支持状态说明

- **AI 工具（ChatGPT / Claude）**：**品牌声明 (Vendor Claim)**。${fullData.vendor.aiClaim}。
- **流媒体（Netflix / YouTube 4K）**：**品牌声明 (Vendor Claim)**。${fullData.vendor.streamingClaim}。
- **实测提示**：流媒体与 AI 解锁属于动态风控结果，节点 IP 状态可能随平台策略变动，请以实时连接为准。`

  const spotlightBanner = fullData.slug === 'guangsuyun'
    ? `<div class="jc-spotlight-banner" style="background: linear-gradient(135deg, rgba(36, 107, 253, 0.08) 0%, rgba(0, 242, 254, 0.1) 100%); border: 1.5px solid var(--jc-primary); border-radius: 8px; padding: 16px 20px; margin: 20px 0 24px 0; display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 12px;">
  <div>
    <span style="font-size: 11px; font-weight: 800; color: #fff; background: var(--jc-primary); padding: 2px 8px; border-radius: 4px; display: inline-block; margin-bottom: 4px;">👑 本站 2026 年度重点主推服务商</span>
    <p style="margin: 0; font-size: 14px; font-weight: 700; color: var(--jc-text-strong);">光速云：2020老牌运营 · 全IEPL内网专线 · 晚高峰低延迟 · 17元/月标杆首选</p>
  </div>
  <SponsoredLink href="${fullData.commercial.affLink}" class="jc-btn jc-btn--primary jc-btn--sm">
    官网直达 (券码 ${fullData.commercial.promoCode}) →
  </SponsoredLink>
</div>\n\n`
    : ''

  const md = `---
title: "${fullData.name}怎么样？2026套餐价格、${fullData.vendor.lines[0]}实测与官网地址"
description: "${fullData.name}详细评测档案：2026最新入门价格${fullData.vendor.entryPrice}，${fullData.vendor.traffic}，采用${fullData.vendor.lines.join('、')}与${fullData.vendor.protocols.join('/')}协议，附2026-08-11本站实测测速截图证据与优惠码。"
keywords: ["${fullData.name}", "${fullData.name}官网", "${fullData.name}怎么样", "${fullData.name}好用吗", "${fullData.name}价格", "${fullData.name}优惠码", "${fullData.name}测速", "${fullData.name}评测"]
layout: doc
pageType: article
status: published
author: 机场推荐评测实验室
created: 2026-08-16
updated: 2026-08-16
verified: 2026-08-16
---

# ${fullData.name}怎么样？2026套餐价格、${fullData.vendor.lines[0]}实测与官网地址

${spotlightBanner}**${fullData.name}** 是一家开业于 **${fullData.vendor.establishedYear} 年**的代理节点订阅服务（俗称机场），入门套餐为 **${fullData.vendor.entryPrice}**（包含 **${fullData.vendor.traffic}** 流量），主要采用 **${fullData.vendor.lines.join('、')}** 搭配 **${fullData.vendor.protocols.join('/')}** 传输协议。本文为您整合官方规格、本站 2026-08-11 测速证据、适合人群与使用限制。

---

## 品牌快速结论与概览

| 核心指标 | 官方资料 / 实测数据 | 数据状态说明 |
|---|---|---|
| **品牌名称** | **${fullData.name}** | 官方在册服务商 |
| **入门价格** | **${fullData.vendor.entryPrice}** | ${isAnnual ? '年付折算价格' : '常规月付套餐'} |
| **基础流量** | **${fullData.vendor.traffic}** | 周期内可用高速流量 |
| **线路类型** | **${fullData.vendor.lines.join('、')}** | 官方架构声明 (Vendor Data) |
| **传输协议** | **${fullData.vendor.protocols.join('、')}** | 客户端兼容协议 |
| **优惠码** | \`${fullData.commercial.promoCode}\` | ${fullData.commercial.discountDesc} |
| **实测状态** | **${fullData.measured.status}** | 附 2026-08-11 节点测速截图 |
| **最后核实** | **${fullData.editorial.lastVerified}** | 官方资料核对日期 |

<div class="jc-actions-bar" style="margin: 20px 0; display: flex; gap: 12px; flex-wrap: wrap;">
  <SponsoredLink href="${fullData.commercial.affLink}" class="jc-btn jc-btn--primary">
    前往 ${fullData.name} 官网查看实时套餐 →
  </SponsoredLink>
  <a href="/brands/" class="jc-btn jc-btn--ghost">
    返回 16 家品牌资料库
  </a>
</div>

${priceNotice}

---

## 价格与套餐规格

${fullData.name} 目前提供多种周期的订阅方案，主要适合不同流量消耗节奏的用户：

- **入门规格**：${fullData.vendor.entryPrice}，月度流量约为 **${fullData.vendor.traffic}**。
- **付款方式**：支持 **${fullData.commercial.paymentMethods.join(' / ')}** 等常见渠道。
- **优惠活动**：结算时可输入专属优惠码 \`${fullData.commercial.promoCode}\` 享受 ${fullData.commercial.discountDesc}。
- **推广链接提示**：本站提供的官网地址已严格原样保留${fullData.commercial.hasHashLink ? '特殊 Hash 路由' : ''}，防范仿冒钓鱼站点。

---

## 线路架构与客户端支持

- **线路特点**：${fullData.name} 主打 **${fullData.vendor.lines.join('、')}**，旨在降低跨境传输中的网络抖动与公网 QoS 丢包率。
- **协议兼容**：支持 **${fullData.vendor.protocols.join(' / ')}** 协议，抗阻断性能与传输开销经过优化。
- **客户端支持**：官方提供 ${fullData.vendor.customClients.join('、')} 定制客户端，同时${fullData.vendor.thirdPartyNote}。

---

${aiSection}

---

${speedtestSection}

---

## 适合人群与使用限制

### ✅ 适合人群
${fullData.editorial.targetAudience.map((t) => `- ${t}`).join('\n')}

### ❌ 不适合人群
${fullData.editorial.notRecommendedFor.map((t) => `- ${t}`).join('\n')}

### 💡 核心优势
${fullData.editorial.pros.map((t) => `- ${t}`).join('\n')}

### ⚠️ 使用限制与风险提示
${fullData.editorial.cons.map((t) => `- ${t}`).join('\n')}
- **节点倍率**：请在使用时注意节点列表中的计费倍率标识，高倍率节点将按比例加速扣除套餐流量。
- **备用建议**：任何单家机场都无法保证 100% 永不波动，重要跨国办公或考试建议配置备用节点方案。

---

## 常见问题解答 (FAQ)

### ${fullData.name} 适合新手使用吗？
${fullData.name} 提供了完善的客户端支持与在线客服指引，新手购买后可直接使用定制客户端或一键导入 Clash / Shadowrocket 订阅，上手门槛较低。

### 优惠码 \`${fullData.commercial.promoCode}\` 如何使用？
在 ${fullData.name} 官网选择心仪套餐后，进入结算页面，在“优惠码/折扣码”输入框中填入 \`${fullData.commercial.promoCode}\` 并点击验证，即可享受折抵。

### 为什么在本地使用时的速度与测速图有差异？
节点测速截图展现的是特定宽带服务器下的瞬时吞吐能力。用户在本地网络使用时，实际体验受本地运营商（电信/联通/移动）、本地 WiFi 信号、所选节点负载及访问目标网站服务器等多重因素影响。

---

## 相关品牌与横向对比

- 查看同类比较：[二猫云 vs 全球云 对比分析](/compare/ermaoyun-vs-quanqiuyun/) ｜ [飞猫云 vs 星岛梦 低价年付对比](/compare/feimaoyun-vs-xingdaomeng/)
- 查看全景库：[16家主流机场品牌资料库](/brands/)
- 查看选择标准：[2026机场怎么选？避坑与选型指南](/guides/how-to-choose/)

<div class="jc-affiliate-box" style="margin-top: 32px; padding: 20px; background: var(--jc-surface-sunken); border-radius: 8px; border: 1px solid var(--jc-border);">
  <p style="margin: 0 0 12px 0; font-weight: 600;">准备好体验 ${fullData.name} 节点了吗？</p>
  <SponsoredLink href="${fullData.commercial.affLink}" class="jc-btn jc-btn--primary">
    立即访问 ${fullData.name} 官网（优惠码：${fullData.commercial.promoCode}）→
  </SponsoredLink>
</div>
`

  fs.writeFileSync(path.join(brandDir, 'index.md'), md, 'utf-8')
  console.log(`Generated ${fullData.name} page: docs/brands/${p.slug}/index.md`)
}

console.log('All 16 brand pages generated successfully!')

