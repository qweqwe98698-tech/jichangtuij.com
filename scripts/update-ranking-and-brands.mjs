import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const ROOT = path.resolve(__dirname, '..')
const providers = JSON.parse(fs.readFileSync(path.join(ROOT, 'data', 'providers.json'), 'utf-8'))

// Find provider helper
function getP(slug) {
  return providers.find(p => p.slug === slug || p.id === slug)
}

function makeRow(p, customHighlight = '') {
  const linkBtn = p.site
    ? `<SponsoredLink href="${p.site}">官网注册</SponsoredLink>`
    : `<span>核验渠道</span>`
  const crown = p.slug === 'guangsuyun' ? '👑 **光速云** (第一主推)' : `**${p.name}**`
  return `| ${crown} | ${p.entryPrice} (${p.traffic}) | ${customHighlight || p.positioning} | 综合办公、流媒体、AI | [查看${p.name}评测](/brands/${p.slug}/) | ${linkBtn} |`
}

// 1. Ranking Page Content
const tier1Slugs = ['guangsuyun', 'muguang', 'feimaoyun', 'weifeng', 'dalaoyun']
const tier2Slugs = ['xingdaomeng', 'ermaoyun', 'wuyou', 'weitu', 'firefly', 'yuzhouyun', 'u1s1', 'lingmao', 'jilianyun', 'guangnianti', 'yifanyun', 'sogoyun']
const tier3Slugs = ['kexinyun', 'sujie', 'shanyue', 'quanqiuyun', 'shandianshu', 'yunjiexian', 'liulianyun', 'shenxing', 'huanqiuti', 'yinxingren', 'tiziyun', 'kuaili']
const tier4Slugs = ['wgetcloud', 'baiyueguang', 'flyingbird', 'cyberguard', 'longmaoyun', 'fatcat', 'tntcloud', 'qingyunti', 'shanshuiyun', 'lingdongyun', 'langwang', 'edgenova', 'yinghuochong', 'sslar']

let rankingMd = `---
title: "2026机场排行榜：稳定、便宜、专线机场综合评选与决策天梯"
description: "2026机场综合排行榜：依据入门价格、线路类型（IEPL/IPLC专线）、节点实测证据与协议生态，对收录的42家主流机场进行综合梯队梳理，不作虚假排名，提供透明选型参考与各梯队深度评测。"
keywords: ["机场排行榜", "2026机场排行榜", "机场排名", "机场天梯榜", "机场推荐排行", "最好用的机场排行", "性价比机场排行", "便宜机场排行"]
layout: doc
pageType: article
status: published
author: 机场推荐评测实验室
created: 2026-08-16
updated: 2026-11-12
verified: 2026-11-12
---

# 2026机场排行榜：稳定、便宜、专线机场综合选择指南

本排行榜依据 **资费门槛、专线架构（IEPL/IPLC）、本站实测数据与协议支持**，将全站已收录的 42+ 家服务商划分为不同梯队，拒绝营销买榜，每家品牌均提供客观独立评测。

::: tip 💡 核心分类专栏直达
- 预算有限？前往 **[便宜机场推荐（10元平价月付与亏本机场避坑）](/recommend/cheap/)**
- 追求极致性价比？前往 **[高性价比机场推荐（15~20元黄金档平衡）](/recommend/value/)**
- 追求晚高峰 0 丢包？前往 **[稳定机场推荐（标配 IEPL 物理专线）](/recommend/stable/)**
- 人工智能与科研？前往 **[AI 工具机场选型指南（ChatGPT/Claude 解锁）](/ai/airport/)**
:::

---

## 第一梯队：核心标杆专线与本站主推品牌 (Top 1 ~ 5)

| 品牌名称 | 入门价格 | 核心卖点 | 适用场景 | 品牌评测 | 官网注册 |
|---|---|---|---|---|---|
`

for (const slug of tier1Slugs) {
  const p = getP(slug)
  if (p) rankingMd += makeRow(p) + '\n'
}

rankingMd += `
---

## 第二梯队：平价与高性价比专线 (Top 6 ~ 10 及黄金性价比梯队)

| 品牌名称 | 入门价格 | 核心卖点 | 适用场景 | 品牌评测 | 官网注册 |
|---|---|---|---|---|---|
`

for (const slug of tier2Slugs) {
  const p = getP(slug)
  if (p) rankingMd += makeRow(p) + '\n'
}

rankingMd += `
---

## 第三梯队：多协议与特色场景专线 (常规中继、多协议与灵活周期)

| 品牌名称 | 入门价格 | 核心卖点 | 适用场景 | 品牌评测 | 官网注册 |
|---|---|---|---|---|---|
`

for (const slug of tier3Slugs) {
  const p = getP(slug)
  if (p) rankingMd += makeRow(p) + '\n'
}

rankingMd += `
---

## 第四梯队：后置收录与历史参考品牌 (历史项目记录与长尾选型)

| 品牌名称 | 入门价格 | 核心卖点 | 适用场景 | 品牌评测 | 官网注册 |
|---|---|---|---|---|---|
`

for (const slug of tier4Slugs) {
  const p = getP(slug)
  if (p) rankingMd += makeRow(p) + '\n'
}

rankingMd += `
---

## 探索更多机场决策指南

- 了解专线与中转底层区别：[IEPL vs IPLC 专线深度解析](/network/iplc-vs-iepl/)
- 查看客户端配置：[Clash Verge 完整教程](/clients/clash/) 与 [Shadowrocket 小火箭教程](/clients/shadowrocket/)
- 前往完整品牌资料库：[42家机场品牌深度档案库](/brands/)
- 探索多维度对比：[机场品牌横向对比专栏](/compare/)
`

fs.writeFileSync(path.join(ROOT, 'docs', 'ranking', 'index.md'), rankingMd, 'utf-8')
console.log('Successfully updated docs/ranking/index.md')

// 2. Update docs/brands/index.md
let brandsMd = `---
title: "机场品牌资料库：42家主流机场套餐、线路与实测档案总览"
description: "机场品牌资料库收录 42+ 家主流机场的官方参数、入门价格、流量规格、线路协议与本站实测截屏证据，支持按价格、协议与线路多维筛选。"
keywords: ["机场品牌资料库", "机场品牌清单", "机场评测", "机场测速", "机场推荐品牌", "42家机场"]
layout: doc
pageType: hub
status: published
author: 机场推荐评测实验室
created: 2026-08-16
updated: 2026-11-12
verified: 2026-11-12
---

# 机场品牌资料库

**机场品牌资料库** 收录了当前市场上 **42+ 家主流代理节点服务商（俗称机场）** 的完整档案。本站坚持将 **品牌资料 (Vendor Data)** 与 **本站实测 (Measured)** 严格分离展示，所有测速与流媒体解锁数据均保留原始测试时间与测试环境。

> [!NOTE]
> **排序说明**：列表展示顺序按收录顺序排列，**不代表任何性能或质量排名**。请用户根据自身的使用预算、每月流量消耗以及特定场景（如 AI 工具或流媒体）进行理性筛选。

---

## 42+ 家品牌全量检索与筛选

<ProviderDirectory />

---

## 42 家机场价格与线路快速对比一览

| 品牌名称 | 入门价格 | 月度流量 | 核心线路与协议 | 推荐定位 | 档案链接 |
|---|---|---|---|---|---|
`

for (const p of providers) {
  brandsMd += `| **${p.name}** | ${p.entryPrice} | ${p.traffic} | ${p.routes.join('+')} / ${p.protocols.join('/')} | ${p.positioning} | [查看档案](/brands/${p.slug}/) |\n`
}

brandsMd += `
---

## 数据来源与核验规范

1. **厂商数据 (Vendor Data)**：套餐资费、节点数量、自研客户端与功能声明均源自品牌公开规格。
2. **实测证据 (Measured Evidence)**：所有测速图均来自本站实机测速记录，保留原始测试时间。
3. **商业披露 (Commercial)**：推广注册链接已核验，包含 Hash 路径的链接严格原样保存。
`

fs.writeFileSync(path.join(ROOT, 'docs', 'brands', 'index.md'), brandsMd, 'utf-8')
console.log('Successfully updated docs/brands/index.md')
