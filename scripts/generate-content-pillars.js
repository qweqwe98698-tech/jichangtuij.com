import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const ROOT = path.resolve(__dirname, '..')
const DOCS = path.join(ROOT, 'docs')

function ensureDir(dirPath) {
  if (!fs.existsSync(dirPath)) fs.mkdirSync(dirPath, { recursive: true })
}

function writeFile(relPath, content) {
  const fullPath = path.join(DOCS, relPath)
  ensureDir(path.dirname(fullPath))
  fs.writeFileSync(fullPath, content.trim() + '\n', 'utf-8')
  console.log(`Generated: docs/${relPath}`)
}

// ==========================================
// 1. 客户端系列 (docs/clients/)
// ==========================================

writeFile('clients/index.md', `---
title: "客户端教程总览：Clash、Shadowrocket、v2rayN 与 sing-box 配置指南"
description: "全平台代理客户端教程指南：覆盖 Windows、macOS、iOS、Android 各平台的 Clash Verge Rev、Shadowrocket 小火箭、v2rayN 与 sing-box 下载、安装与订阅导入教程。"
keywords: ["机场客户端", "Clash教程", "Shadowrocket教程", "v2rayN教程", "科学上网软件", "翻墙客户端"]
layout: doc
pageType: hub
status: published
author: 机场推荐评测实验室
created: 2026-08-16
updated: 2026-08-16
verified: 2026-08-16
---

# 客户端使用教程总览

代理客户端是连接代理节点与本地设备的核心桥梁。不同操作系统有各自最主流和稳定的客户端软件，本文为您汇总全平台下载、配置与订阅导入教程。

---

## 全平台客户端快速导航

<div class="jc-grid jc-grid--3" style="margin: 24px 0;">
  <div class="jc-card">
    <h3>💻 Windows / macOS 首选</h3>
    <p><strong>Clash Verge Rev</strong>：现代化开源内核、UI 简洁、支持 TUN 虚拟网卡模式。</p>
    <a href="/clients/clash/">查看 Clash 完整教程 →</a>
  </div>

  <div class="jc-card">
    <h3>📱 iOS / iPadOS 首选</h3>
    <p><strong>Shadowrocket (小火箭)</strong>：App Store 最经典的轻量规则分流工具。</p>
    <a href="/clients/shadowrocket/">查看小火箭使用指南 →</a>
  </div>

  <div class="jc-card">
    <h3>⚙️ Windows 经典备用</h3>
    <p><strong>v2rayN</strong>：老牌 Xray/V2Ray 核心客户端，深度支持 VLESS 与 Shadowsocks 协议。</p>
    <a href="/clients/v2rayn/">查看 v2rayN 使用指南 →</a>
  </div>
</div>

---

## 客户端选择的 3 个基本建议

1. **按操作系统选择，避免混用**：iOS 用户首选 Shadowrocket；Windows/Mac 用户首选 Clash Verge Rev；Android 用户推荐 Clash Meta 或 sing-box。
2. **认准官方开源仓库**：切勿在第三方不可信网站下载带有后门的“破解版/修改版”客户端。
3. **日常使用优先“规则模式 (Rule)”**：让国内流量直连、国外流量走代理，既节省套餐流量，又避免国内银行或软件触发异地风控。
`)

writeFile('clients/clash/index.md', `---
title: "Clash完整使用教程：下载、配置、订阅导入与Clash机场推荐"
description: "Clash完整使用指南：深度解析Clash Verge Rev下载安装、订阅链接导入、TUN模式开启、分流规则配置与常见节点超时排查，附适合Clash的优质专线机场推荐。"
keywords: ["Clash", "Clash下载", "Clash教程", "Clash订阅", "Clash Verge Rev", "Clash机场推荐", "Clash怎么用"]
layout: doc
pageType: article
status: published
author: 机场推荐评测实验室
created: 2026-08-16
updated: 2026-08-16
verified: 2026-08-16
---

# Clash完整使用教程：下载、配置、订阅导入与Clash机场推荐

**Clash**（及当前主流分支 **Clash Verge Rev / Mihomo**）是基于规则的多平台代理客户端软件。它能够根据目标网站域名和 IP 自动将网络流量分流至不同节点或直连，是目前 Windows 与 macOS 上最受推崇的工具。

---

## 一、Clash Verge Rev 下载与安装

1. 访问官方开源 Release 页面，根据操作系统下载安装包（Windows 选 \`.msi\` 或 \`.exe\`，macOS 选 \`.dmg\`）。
2. 安装后首次启动，进入设置将语言切换为“中文”。

---

## 二、如何导入机场订阅链接

1. 打开已购买的 [机场推荐品牌](/brands/) 官网后台（例如 [光速云](/brands/guangsuyun/) 或 [宇宙云](/brands/yuzhouyun/)）。
2. 在用户中心找到“一键导入 Clash”或“复制 Clash 订阅链接”。
3. 打开 Clash Verge Rev，点击左侧 **「订阅 (Profiles)」** 页面。
4. 将订阅 URL 粘贴进输入框，点击 **「保存/导入」**。
5. 等待节点列表下载完成，右键选中该配置激活为活动订阅。

---

## 三、日常使用与运行模式说明

- **规则模式 (Rule - 推荐)**：国内网站（百度、淘宝、微信等）直接连接不耗费流量；海外受阻网站（Google、YouTube、ChatGPT）自动通过节点代理。
- **全局模式 (Global)**：所有网络流量强制经过代理节点，适合排查单点连接故障。
- **直连模式 (Direct)**：所有流量直连，等同于关闭代理。
- **TUN 虚拟网卡模式**：劫持系统全量流量（包含命令行、游戏及不遵循系统代理的软件），在设置中可一键开启。

---

## 四、适合搭配 Clash 的优质专线机场

- **[光速云](/brands/guangsuyun/)**：17元/月 110GB，IEPL 专线，Clash 订阅解析兼容性极佳。
- **[宇宙云](/brands/yuzhouyun/)**：14.9元/月 100GB，纯 VLESS 协议，Clash Verge 原生支持。
- **[二猫云](/brands/ermaoyun/)**：20元/月 130GB，高性价比均衡专线。
`)

writeFile('clients/shadowrocket/index.md', `---
title: "Shadowrocket小火箭使用指南：配置、节点导入与小火箭机场推荐"
description: "Shadowrocket小火箭完整使用教程：详解iOS下载（美区Apple ID）、订阅链接一键导入、分流规则设置与节点测速，附适合小火箭的优质机场推荐。"
keywords: ["Shadowrocket", "小火箭", "Shadowrocket下载", "Shadowrocket教程", "Shadowrocket订阅", "小火箭机场推荐"]
layout: doc
pageType: article
status: published
author: 机场推荐评测实验室
created: 2026-08-16
updated: 2026-08-16
verified: 2026-08-16
---

# Shadowrocket小火箭使用指南：配置、节点导入与小火箭机场推荐

**Shadowrocket（俗称小火箭）** 是 iOS 与 iPadOS 平台上最流行、功能最全面的规则分流代理工具。

---

## 一、如何下载 Shadowrocket

由于 App Store 地区限制，Shadowrocket 未在中国大陆区上架：
1. 需要使用海外地区（如美国、香港、日本区）的 Apple ID 登录 App Store。
2. 搜索并购买下载正版 Shadowrocket（开发者为 Pan Guanming，请认准图标防止假冒）。

---

## 二、小火箭订阅导入步骤

1. 在 [机场品牌资料库](/brands/) 登录您的机场账户，复制通用订阅链接或小火箭专属链接。
2. 打开 Shadowrocket，点击右上角的 **「+」** 号。
3. 类型选择 **「Subscribe (订阅)」**。
4. 在“URL”栏中粘贴刚刚复制的链接，点击右上角 **「完成」** 保存。
5. 首页将自动拉取全部可用节点列表。

---

## 三、分流与连接建议

- **全局路由设置**：推荐在首页下方将全局路由保持为 **「配置 (Config)」**，实现自动分流。
- **节点延迟测试**：点击“连通性测试”，可一次性测试所有节点延迟，点击绿色低延迟节点即可一键连接。
`)

writeFile('clients/v2rayn/index.md', `---
title: "v2rayN从零上手教程：Windows客户端配置与VLESS节点导入"
description: "v2rayN使用指南：Windows平台Xray核心客户端安装、VLESS/Trojan/Shadowsocks节点订阅导入、系统代理与PAC规则配置全解析。"
keywords: ["v2rayN", "v2rayN下载", "v2rayN教程", "v2rayN订阅", "v2rayN节点", "VLESS客户端"]
layout: doc
pageType: article
status: published
author: 机场推荐评测实验室
created: 2026-08-16
updated: 2026-08-16
verified: 2026-08-16
---

# v2rayN从零上手教程：Windows客户端配置与VLESS节点导入

**v2rayN** 是 Windows 平台上功能极其强大的通用代理客户端，内置 Xray 与 sing-box 核心，对 **VLESS、VMess、Trojan 与 Shadowsocks** 拥有原生且完善的支持。

---

## 一、下载与解压安装

1. 从官方 GitHub Release 下载包含 Core 核心的 \`v2rayN-with-dependencies.zip\` 完整包。
2. 解压到非系统盘目录（避免管理员权限拦截），运行 \`v2rayN.exe\`。

---

## 二、添加订阅与更新

1. 复制机场提供的 V2Ray / 通用订阅链接。
2. 在 v2rayN 顶部菜单点击 **「订阅分组」** → **「订阅分组设置」**。
3. 点击“添加”，填入可选别名并粘贴订阅 URL，点击确定。
4. 顶部菜单点击 **「订阅分组」** → **「更新全部订阅（不通过代理）」**，节点列表即可加载。

---

## 三、启动与连接

1. 选中延迟最低的节点，按 Enter 键设为主节点。
2. 底部任务栏右键 v2rayN 托盘图标：
   - **系统代理**：选择 **「自动配置系统代理」**（图标变红即表示已开启）。
   - **路由规则**：选择 **「绕过大陆 (Whitelist)」**。
`)

// ==========================================
// 2. 线路与协议知识 (docs/network/)
// ==========================================

writeFile('network/index.md', `---
title: "线路与协议知识中心：IEPL、IPLC 专线、BGP 中转与 VLESS 协议全解析"
description: "机场线路与协议深度解析：揭秘直连、BGP 中转、IPLC 专线、IEPL 专线在晚高峰抗拥堵上的底层区别，以及 VLESS、Trojan 与 Shadowsocks 协议的性能优势。"
keywords: ["机场线路", "IPLC专线", "IEPL专线", "BGP中转", "VLESS协议", "专线机场原理"]
layout: doc
pageType: hub
status: published
author: 机场推荐评测实验室
created: 2026-08-16
updated: 2026-08-16
verified: 2026-08-16
---

# 线路与协议知识中心

许多用户在挑选机场时常常被“直连、中转、IEPL、IPLC、BGP、VLESS”等专业名词困扰。其实，**线路决定了连接的稳定性上限，而协议决定了抗封锁能力与传输效率**。

---

## 核心线路专题导航

<div class="jc-grid jc-grid--2" style="margin: 24px 0;">
  <div class="jc-card">
    <h3>🌐 专线对比：IPLC vs IEPL</h3>
    <p>深度解析跨境内网专线原理，为什么专线能够彻底免疫公网 GFW 审查与晚高峰拥堵。</p>
    <a href="/network/iplc-vs-iepl/">查看专线区别解析 →</a>
  </div>

  <div class="jc-card">
    <h3>⚡ 协议解析：VLESS 协议深度科普</h3>
    <p>相比传统 VMess 与 Trojan，VLESS 为什么能做到更低开销、更快速度与更高安全性。</p>
    <a href="/network/vless/">查看 VLESS 协议详解 →</a>
  </div>
</div>

---

## 线路类型性能阶梯

1. **公网直连 (Direct)**：用户设备 → 公网国际出口 → 目标服务器。成本最低，但极易在晚高峰受 QoS 严重限速或被阻断。
2. **国内 BGP 中转 (Transit)**：国内优质机房汇聚流量，再通过优化隧道转发至海外落地。较直连稳定性大幅提升。
3. **IEPL / IPLC 内网专线 (Dedicated Line)**：运营商端到端物理内网专线跨境，**不经公网骨干网出口**，延迟极其固定，晚高峰丢包率极低。
`)

writeFile('network/iplc-vs-iepl/index.md', `---
title: "IPLC与IEPL专线有什么区别？专线机场原理解析与防封锁指南"
description: "IPLC与IEPL区别深度解析：从物理层、跨境传输原理、晚高峰稳定性到成本价格，讲清楚为什么专线机场能够彻底规避GFW阻断与网络抖动。"
keywords: ["IPLC与IEPL区别", "IPLC专线", "IEPL专线", "专线机场", "IPLC是什么", "IEPL是什么"]
layout: doc
pageType: article
status: published
author: 机场推荐评测实验室
created: 2026-08-16
updated: 2026-08-16
verified: 2026-08-16
---

# IPLC与IEPL专线有什么区别？专线机场原理解析与防封锁指南

在代理节点服务中，**IPLC（国际私有租用线路）** 与 **IEPL（国际以太网私网专线）** 是高端稳定机场的核心标志。它们的共同特征是：**跨境传输全程走运营商物理内网，完全不经过公网 GFW 审查节点**。

---

## 一、IPLC 与 IEPL 的技术差异

| 对比维度 | IPLC (International Private Leased Circuit) | IEPL (International Ethernet Private Line) |
|---|---|---|
| **网络层级** | 物理层 / 传统 TDM 专线 | 二层以太网 (Layer 2 Ethernet) |
| **接入协议** | 点对点专属线路 | 以太网接口，配置与扩展更灵活 |
| **过境特性** | 完全不经公网，不经过 GFW | 完全不经公网，不经过 GFW |
| **实际用户体验** | 延迟恒定，晚高峰 0% 丢包 | 延迟恒定，晚高峰极低丢包，带宽弹性好 |
| **主流代表** | [灵猫网络](/brands/lingmao/) (全IPLC) | [光速云](/brands/guangsuyun/)、[二猫云](/brands/ermaoyun/)、[宇宙云](/brands/yuzhouyun/) |

---

## 二、为什么专线机场比普通直连稳定得多？

1. **不过 GFW**：数据在深圳/上海等内网入口直接进入专线跨境光缆到达香港/东京，敏感时期不会被阻断。
2. **确定性延迟**：公网直连在晚高峰延迟可能从 50ms 飙升至 300ms，而 IEPL 专线始终锁定在 40-50ms 范围内。
3. **极低丢包率**：专线承诺可用率通常达 99.9% 以上，彻底杜绝视频卡顿与会议断线。
`)

writeFile('network/vless/index.md', `---
title: "VLESS协议是什么？相比VMess与Trojan有什么优势与特点"
description: "VLESS协议深度科普：解析VLESS无状态轻量架构、XTLS/Reality流控技术优势，以及为什么主流新机场普遍从VMess迁移到VLESS。"
keywords: ["VLESS协议", "VLESS是什么", "VLESS与VMess区别", "VLESS Reality", "Xray协议", "VLESS机场推荐"]
layout: doc
pageType: article
status: published
author: 机场推荐评测实验室
created: 2026-08-16
updated: 2026-08-16
verified: 2026-08-16
---

# VLESS协议是什么？相比VMess与Trojan有什么优势与特点

**VLESS** 是一种轻量级的无状态传输协议，由 Xray / V2Ray 社区设计。它移除了传统 VMess 繁重的数据加密算法，将加密完全交由底层的 TLS / Reality 处理，从而大幅**降低了 CPU 资源占用并提升了吞吐速率**。

---

## VLESS 的三大核心优势

1. **更低延迟与更高吞吐**：无状态设计减少了握手过程中的解密开销，在高带宽并发下吞吐速度提升显著。
2. **抗封锁能力更强**：配合 XTLS / Reality 伪装技术，能够模拟真实热门网站的 TLS 握手特征，难以被主动探测识别。
3. **现代化客户端广泛支持**：Clash Verge Rev、v2rayN、Shadowrocket、sing-box 均原生支持 VLESS。

---

## 支持 VLESS 协议的推荐品牌

- **[唯兔云](/brands/weitu/)**：主打 60+ 节点 VLESS 智能调度与三网优化。
- **[宇宙云](/brands/yuzhouyun/)**：纯 VLESS + IEPL 专线，14.9元档性价比标杆。
- **[快狸](/brands/kuaili/)**：25元档纯 VLESS 现代化专线。
`)

// ==========================================
// 3. 免费节点与订阅指南 (docs/free/)
// ==========================================

writeFile('free/index.md', `---
title: "免费节点与免费订阅指南：公开节点安全风险与付费专线对比"
description: "免费节点与免费订阅深度科普：为什么不建议长期使用公开免费节点？解析公共节点的中间人劫持风险、隐私泄露与频繁失效问题，提供理性安全用网建议。"
keywords: ["免费节点", "免费机场", "免费订阅", "Clash免费节点", "免费节点安全吗", "每日免费节点"]
layout: doc
pageType: hub
status: published
author: 机场推荐评测实验室
created: 2026-08-16
updated: 2026-08-16
verified: 2026-08-16
---

# 免费节点与免费订阅指南

网络上流传的大量“每日免费节点”或“公开免费订阅”，虽然能让用户零成本尝试，但其背后隐藏着**极高的安全风险与极差的可用性**。本指南为您揭开免费节点的真实内幕。

---

## 免费节点的 4 大致命缺陷

1. **中间人劫持与隐私泄露**：公开免费节点通常由未知第三方或黑产团伙搭建，您的明文流量、DNS 查询记录甚至未加密 Cookie 可能被全程嗅探记录。
2. **高频失效与超时**：成千上万用户同时涌入同一个节点，带宽瞬间被挤爆，存活时间往往不超过数小时。
3. **被海外平台封禁风控**：由于大量黑产或爬虫滥用免费节点，其出口 IP 几乎全部被 Google、ChatGPT、Netflix 列入黑名单。
4. **钓鱼网站与恶意重定向**：部分免费节点会强行注入广告代码或将搜索结果重定向到钓鱼欺诈页面。

---

## 免费节点 vs 付费专线机场 对比

| 对比维度 | 公开免费节点 / 订阅 | 正规付费专线机场 |
|---|---|---|
| **隐私安全性** | 极低（存在日志监听风险） | 高（正规企业化运维） |
| **晚高峰可用率** | < 10%（严重丢包超时） | > 99%（IEPL 物理专线保通） |
| **AI / 流媒体支持** | 几乎全部被拉黑拒绝 | 针对性优化出口 IP 信誉 |
| **月均成本** | 0 元（但付出极高时间精力） | 7元～20元/月 平价月付 |

> [!TIP]
> **理性选择建议**：如果您仅为偶尔测试，可以使用免费节点；如果您需要日常稳定办公、学习科研或使用 AI 工具，建议选择 [飞猫云（年付折合约7元/月）](/brands/feimaoyun/) 或 [宇宙云（14.9元/月）](/brands/yuzhouyun/) 等平价正规服务。
`)

// ==========================================
// 4. AI 专区 (docs/ai/)
// ==========================================

writeFile('ai/index.md', `---
title: "AI 工具机场专区：ChatGPT、Claude 与 Gemini 节点选型与排障指南"
description: "AI 工具机场专区：系统梳理 ChatGPT、Claude、Gemini 等主流 AI 大模型对代理节点的出口地区、原生 IP 信誉与会话持久度的核心要求，附 AI 专属机场推荐。"
keywords: ["AI机场", "AI工具机场", "ChatGPT机场", "Claude机场", "Gemini机场", "ChatGPT打不开"]
layout: doc
pageType: hub
status: published
author: 机场推荐评测实验室
created: 2026-08-16
updated: 2026-08-16
verified: 2026-08-16
---

# AI 工具机场专区

访问 **ChatGPT、Claude、Gemini** 等主流人工智能工具，核心诉求与普通看视频不同。AI 平台对节点的**出口地区合规性、IP 信誉度（拒绝机房万人骑 IP）与长连接稳定性**有着极高要求。

---

## AI 专题文章导航

<div class="jc-grid jc-grid--2" style="margin: 24px 0;">
  <div class="jc-card">
    <h3>🤖 AI 专属机场推荐</h3>
    <p>精选针对 AI 工具出口 IP 进行优化的高质量 IEPL 专线机场。</p>
    <a href="/ai/airport/">查看 AI 机场推荐 →</a>
  </div>

  <div class="jc-card">
    <h3>🩺 ChatGPT 打不开排查</h3>
    <p>深度排查 ChatGPT 报错“Unable to load site”、Cloudflare 拦截与地区不支持提示。</p>
    <a href="/ai/chatgpt/">查看 ChatGPT 排障指南 →</a>
  </div>
</div>

---

## AI 平台的 3 大选型原则

1. **地区选择**：推荐使用 **美国、新加坡、日本、台湾** 节点；香港节点已被大多数 AI 官方明确列为不支持地区。
2. **出口 IP 纯净度**：万人共用机房 IP 极易触发 Cloudflare 5 秒盾与账号被封风控，需要选择出口具有原生住宅/商用纯净 IP 的服务商。
3. **会话保持 (Sticky Session)**：频繁切换出口 IP 会触发风控登出，推荐使用支持会话保持的专线节点。
`)

writeFile('ai/airport/index.md', `---
title: "2026 AI工具机场推荐：ChatGPT、Claude与Gemini原生解锁节点选择"
description: "2026 AI工具机场推荐：深度评测适合频繁使用 ChatGPT Plus、Claude Pro 与 Gemini Advanced 的优质专线机场，精选速界、光速云与 SOGO 云等优化品牌。"
keywords: ["AI机场推荐", "ChatGPT机场推荐", "Claude机场", "Gemini节点", "AI专用节点"]
layout: doc
pageType: article
status: published
author: 机场推荐评测实验室
created: 2026-08-16
updated: 2026-08-16
verified: 2026-08-16
---

# 2026 AI工具机场推荐：ChatGPT、Claude与Gemini原生解锁节点选择

对于科研、编程、外贸等高频依赖 **ChatGPT、Claude、Cursor、Gemini** 的用户，节点的稳定与 IP 纯净直接决定了工作效率。

---

## AI 场景推荐品牌精选

| 品牌名称 | 入门价格 | AI 支持声明 | 线路特点 | 档案链接 |
|---|---|---|---|---|
| **速界** | 25元/月 (150GB) | 品牌资料重点针对 AI 工具优化声明 | IEPL 专线 / VLESS | [查看速界档案](/brands/sujie/) |
| **光速云** | 17元/月 (110GB) | 官方声明覆盖 ChatGPT / Claude | 老牌专线 / VLESS | [查看光速云档案](/brands/guangsuyun/) |
| **SOGO 云** | 25元/月 (150GB) | 2026 新专线 / 高冗余低风控 | IEPL 专线 / VLESS | [查看 SOGO 云档案](/brands/sogoyun/) |
| **快狸** | 25元/月 (150GB) | 综合型视频与 AI 出口 | 纯 VLESS / IEPL | [查看快狸档案](/brands/kuaili/) |

> [!NOTE]
> **免责与实测提示**：各品牌对 AI 工具的支持当前属于**厂商声明 (Vendor Claim)**。各 AI 平台风控策略会动态更新，建议购买后优先使用月付套餐测试目标平台。
`)

writeFile('ai/chatgpt/index.md', `---
title: "ChatGPT打不开怎么办？国内访问ChatGPT网络排障与节点要求"
description: "ChatGPT无法访问、网络错误、提示地区不受支持排查指南：手把手教你如何切换节点地区、清理Cookie与解决Cloudflare拦截验证问题。"
keywords: ["ChatGPT打不开", "ChatGPT网络错误", "ChatGPT地区不支持", "ChatGPT无法登录", "ChatGPT节点"]
layout: doc
pageType: article
status: published
author: 机场推荐评测实验室
created: 2026-08-16
updated: 2026-08-16
verified: 2026-08-16
---

# ChatGPT打不开怎么办？国内访问ChatGPT网络排障与节点要求

当您打开 ChatGPT（chatgpt.com）遇到转圈、报错“Access Denied”、提示“Unsupported Country”或无限验证码循环时，通常是由**节点地区错误、IP 被 OpenAI 拉黑或浏览器缓存冲突**导致的。

---

## 4 步快速排障急救法

1. **第一步：确认当前节点地区（绝不能选香港）**
   - OpenAI 官方对中国大陆与香港地区实行服务封锁。请切换至 **美国（US）、新加坡（SG）、日本（JP）** 节点。
2. **第二步：开启客户端 TUN 模式或全局代理测试**
   - 检查规则分流是否将 \`openai.com\` 与 \`chatgpt.com\` 误判为直连。在 Clash 中可开启 TUN 模式排查。
3. **第三步：清理浏览器数据或开启无痕模式**
   - 浏览器本地可能残留了此前国内直连时的地区 Cookie，按 \`Ctrl + Shift + N\` 打开无痕窗口重新访问。
4. **第四步：更换同地区其他节点**
   - 若某节点 IP 刚被 Cloudflare 列入高危名单，切换至备用专线节点即可解决。
`)

// ==========================================
// 5. 流媒体专区 (docs/streaming/)
// ==========================================

writeFile('streaming/index.md', `---
title: "流媒体解锁专区：Netflix、YouTube 4K 与 Disney+ 解锁与播放指南"
description: "流媒体解锁专区：解析 Netflix 原创剧与非自制剧解锁原理、YouTube 4K 流畅播放带宽要求与多设备大屏观看注意事项，附流媒体机场推荐。"
keywords: ["流媒体机场", "Netflix解锁", "YouTube 4K机场", "Disney+解锁", "流媒体机场推荐"]
layout: doc
pageType: hub
status: published
author: 机场推荐评测实验室
created: 2026-08-16
updated: 2026-08-16
verified: 2026-08-16
---

# 流媒体解锁专区

海外主流流媒体平台（**Netflix、YouTube、Disney+、HBO Max**）对播放带宽与版权地区限制有严格要求。

---

## 流媒体专题文章导航

<div class="jc-grid jc-grid--2" style="margin: 24px 0;">
  <div class="jc-card">
    <h3>🎬 流媒体专属机场推荐</h3>
    <p>精选大带宽冗余、支持 4K 秒开与多区内容库解锁的专线机场。</p>
    <a href="/streaming/airport/">查看流媒体机场推荐 →</a>
  </div>

  <div class="jc-card">
    <h3>📺 Netflix 代理提示与解锁排查</h3>
    <p>解决“您似乎正在使用解除封锁程序或代理”提示，看全区非自制热播剧。</p>
    <a href="/streaming/netflix/">查看 Netflix 解锁指南 →</a>
  </div>
</div>
`)

writeFile('streaming/airport/index.md', `---
title: "2026流媒体机场推荐：Netflix、YouTube 4K与Disney+原生解锁指南"
description: "2026流媒体机场推荐：评测适合观看 Netflix 4K HDR、YouTube 60fps 与 Disney+ 的高速专线机场，精选一翻云、灵猫网络、二猫云与快狸等大流量服务商。"
keywords: ["流媒体机场推荐", "Netflix机场推荐", "4K机场推荐", "YouTube机场", "大流量流媒体机场"]
layout: doc
pageType: article
status: published
author: 机场推荐评测实验室
created: 2026-08-16
updated: 2026-08-16
verified: 2026-08-16
---

# 2026流媒体机场推荐：Netflix、YouTube 4K与Disney+原生解锁指南

流畅观看 4K 流媒体需要两大核心指标：**单线程下载带宽 > 30Mbps（抗抖动）** 与 **出口节点拥有原生地区版权识别**。

---

## 流媒体大流量代表品牌

- **[一翻云](/brands/yifanyun/)**：20元/月 150GB 大流量，IEPL 专线，适合大屏长期播放。
- **[灵猫网络](/brands/lingmao/)**：19元/月 150GB，全 IPLC 专线，月付流量性价比突出。
- **[快狸](/brands/kuaili/)**：25元/月 150GB，纯 VLESS 协议，视频流媒体综合型专线。
`)

writeFile('streaming/netflix/index.md', `---
title: "Netflix提示使用代理或打不开？Netflix解锁节点与流媒体排查"
description: "Netflix提示代理错误（Streaming Error）与只能看自制剧排查指南：解析Netflix区域版权机制、原生IP与DNS分流配置技巧。"
keywords: ["Netflix解锁", "Netflix提示使用代理", "Netflix只能看自制剧", "Netflix节点", "Netflix打不开"]
layout: doc
pageType: article
status: published
author: 机场推荐评测实验室
created: 2026-08-16
updated: 2026-08-16
verified: 2026-08-16
---

# Netflix提示使用代理或打不开？Netflix解锁节点与流媒体排查

如果您在 Netflix 播放时提示“**您似乎正在使用解除封锁程序或代理**”，或者**只能看到 Netflix 自制剧（如怪奇物语）而搜不到当地版权剧（如绝命毒师）**，说明当前节点的 IP 被识别为商业数据中心机房 IP。

---

## 快速排查与解决步骤

1. **区分自制剧与非自制剧**：在 Netflix 搜索“Breaking Bad”或“Friends”，若搜不到，说明当前节点仅能看全球自制剧，未完全解锁该区版权库。
2. **切换至专门标注“原生 / 流媒体”的节点**：在节点列表中寻找标注有 Netflix 或原生解锁的节点。
3. **关闭浏览器插件干扰**：禁用可能修改请求头的广告拦截插件，开启无痕模式重试。
`)

// ==========================================
// 6. 故障排查中心 (docs/troubleshooting/)
// ==========================================

writeFile('troubleshooting/index.md', `---
title: "机场与网络故障排查中心：节点超时、订阅失败与无法连接急救箱"
description: "机场故障排查中心：针对新手常见的节点全部超时、全红 TIMEOUT、订阅更新失败、连上但网页打不开等高频疑难问题提供分步急救方案。"
keywords: ["机场故障排查", "节点超时排查", "订阅失败排查", "翻墙连不上排查", "机场无法连接"]
layout: doc
pageType: hub
status: published
author: 机场推荐评测实验室
created: 2026-08-16
updated: 2026-08-16
verified: 2026-08-16
---

# 机场与网络故障排查中心

遇到网络连不上、节点超时或网页打不开时，不要慌张，绝大多数故障都可以通过标准化的 3 步排查快速定位。

---

## 高频故障急救指南

<div class="jc-grid jc-grid--2" style="margin: 24px 0;">
  <div class="jc-card">
    <h3>🔴 节点全部超时 / 全红排查</h3>
    <p>节点列表全部显示 TIMEOUT 或延迟测不通时的系统级急救流程。</p>
    <a href="/troubleshooting/node-timeout/">查看节点超时排查指南 →</a>
  </div>

  <div class="jc-card">
    <h3>🔄 订阅导入 / 更新失败排查</h3>
    <p>解决订阅链接无法下载、提示 404/500 或配置格式解析错误。</p>
    <a href="/troubleshooting/subscription-failed/">查看订阅失败排查指南 →</a>
  </div>
</div>
`)

writeFile('troubleshooting/node-timeout/index.md', `---
title: "机场节点全部超时怎么办？节点全红、TIMEOUT和无法连接排查指南"
description: "机场节点全部超时怎么办？系统梳理系统时间误差、本地杀毒防火墙拦截、订阅过期未续费与本地DNS污染等核心诱因及1分钟急救解决步骤。"
keywords: ["机场节点超时怎么办", "节点全红怎么办", "机场节点全部TIMEOUT", "Clash节点超时", "节点连不上"]
layout: doc
pageType: article
status: published
author: 机场推荐评测实验室
created: 2026-08-16
updated: 2026-08-16
verified: 2026-08-16
---

# 机场节点全部超时怎么办？节点全红、TIMEOUT和无法连接排查指南

当客户端（Clash、Shadowrocket、v2rayN）进行连通性测试时，如果**所有节点全部显示超时、全红或 TIMEOUT**，通常不是所有节点同时宕机，而是本地环境存在阻断。

---

## 1 分钟快速急救步骤

1. **核对电脑/手机系统时间（高发原因）**
   - VLESS / Shadowsocks 等协议依赖 TLS 握手加密，系统时间若与标准北京时间相差超过 60 秒，握手将全部失败。
   - **解决**：进入系统设置，开启“自动同步网络时间”。
2. **检查套餐流量是否用尽或过期**
   - 登录 [机场品牌资料库](/brands/) 对应后台，核实套餐是否已到期或周期内流量耗尽。
3. **关闭本地杀毒软件或冲突代理**
   - 检查电脑上是否同时运行了其他 VPN 软件或网页代理插件。
4. **重新更新订阅链接**
   - 服务商可能对后端入口进行了 IP 迁移，右键订阅点击“更新”，获取最新节点配置。
`)

writeFile('troubleshooting/subscription-failed/index.md', `---
title: "机场订阅导入失败怎么办？更新订阅错误与配置格式排查指南"
description: "机场订阅导入失败排查指南：全面解析订阅链接复制错误、前置代理拦截、SSL证书异常与客户端内核过旧导致的更新失败问题与解决方案。"
keywords: ["机场订阅导入失败", "订阅更新失败", "Clash订阅失败", "小火箭订阅错误", "订阅更新错误"]
layout: doc
pageType: article
status: published
author: 机场推荐评测实验室
created: 2026-08-16
updated: 2026-08-16
verified: 2026-08-16
---

# 机场订阅导入失败怎么办？更新订阅错误与配置格式排查指南

导入或更新机场订阅时提示“**Network Error / Download Failed / Invalid Format**”，请按以下顺序排查：

---

## 排查清单

1. **检查订阅链接完整性**：复制时是否多复制了空格，或者少复制了最后的 \`token\` 字符。
2. **关闭正在运行的代理再更新**：有时旧的代理已失效，导致订阅更新请求被旧代理死循环拦截。在更新订阅时选择“不通过代理直接更新”。
3. **升级客户端内核**：部分新协议（如 VLESS Reality）在老旧版本的 Clash 内核中无法解析，请升级至最新的 [Clash Verge Rev](/clients/clash/)。
`)

// ==========================================
// 7. 新手指南 (docs/guides/)
// ==========================================

writeFile('guides/index.md', `---
title: "新手使用指南：机场小白入门、选型标准、VPN 区别与避坑清单"
description: "新手使用指南中心：从什么是机场、节点、订阅讲起，全面解析 VPN 与机场的区别、国外网站打不开如何排查以及购买前的核心避坑清单。"
keywords: ["机场使用指南", "机场入门", "什么是机场", "机场怎么买", "机场避坑", "小白上网教程"]
layout: doc
pageType: hub
status: published
author: 机场推荐评测实验室
created: 2026-08-16
updated: 2026-08-16
verified: 2026-08-16
---

# 新手使用指南中心

如果您完全没有网络技术背景，建议按照以下顺序阅读本栏目文章，从概念认知到选购避坑一步到位。

---

## 新手核心 4 大必读文章

<div class="jc-grid jc-grid--2" style="margin: 24px 0;">
  <div class="jc-card">
    <h3>📖 1. 什么是机场、节点与订阅？</h3>
    <p>用最通俗的大白话解释代理技术核心概念。</p>
    <a href="/guides/beginner/">阅读新手科普 →</a>
  </div>

  <div class="jc-card">
    <h3>⚖️ 2. VPN、代理、加速器与机场的区别</h3>
    <p>搞清楚为什么传统 VPN 越来越卡，而专线机场更适合日常使用。</p>
    <a href="/guides/vpn-vs-airport/">阅读区别全解析 →</a>
  </div>

  <div class="jc-card">
    <h3>🛡️ 3. 机场怎么选？避坑与选型清单</h3>
    <p>手把手教你如何看懂参数，避免买到劣质虚标机场。</p>
    <a href="/guides/how-to-choose/">阅读选型清单 →</a>
  </div>

  <div class="jc-card">
    <h3>🌐 4. 国外网站打不开怎么办？</h3>
    <p>从 DNS、网络路径到代理工具的标准诊断顺序。</p>
    <a href="/guides/foreign-websites-inaccessible/">阅读访问排障 →</a>
  </div>
</div>
`)

writeFile('guides/beginner/index.md', `---
title: "机场是什么？节点、订阅与客户端小白通俗入门指南"
description: "机场是什么小白通俗入门：用生活化比喻解释什么是代理节点订阅服务（机场）、什么是节点、什么是订阅链接与客户端，快速建立基础认知。"
keywords: ["机场是什么", "什么是机场", "机场节点是什么", "机场订阅是什么", "机场怎么用", "机场小白教程"]
layout: doc
pageType: article
status: published
author: 机场推荐评测实验室
created: 2026-08-16
updated: 2026-08-16
verified: 2026-08-16
---

# 机场是什么？节点、订阅与客户端小白通俗入门指南

**代理节点订阅服务（俗称机场）**，是一种提供跨境网络加速与中转服务器连接的服务。之所以被称为“机场”，是因为早期开源代理软件 Shadowsocks 采用了纸飞机的图标，而提供大量节点服务器的平台便被戏称为“机场”。

---

## 4 个核心概念通俗解释

1. **节点（服务器）**：部署在香港、日本、美国等世界各地的中转服务器。你的设备连接到该节点后，由节点代你向海外网站发送和接收数据。
2. **订阅链接（网址）**：一串特殊的专属网络地址，里面包含了机场为你分配的全部节点配置信息。只要将该链接导入客户端，就能自动下载所有节点。
3. **客户端（连接软件）**：安装在电脑或手机上的软件（如 [Clash](/clients/clash/)、[小火箭](/clients/shadowrocket/)、[v2rayN](/clients/v2rayn/)），负责流量的接管与规则分流。
4. **套餐与流量**：通常按月或按年付费，例如 15元/月 100GB，表示在当前月份内可以使用 100GB 的高速中转流量。
`)

writeFile('guides/how-to-choose/index.md', `---
title: "机场怎么选？从预算、线路、稳定性到售后保障的避坑清单"
description: "机场怎么选？2026专业选购避坑清单：教你如何评估月付门槛、辨别真假IEPL专线、避免永久套餐陷阱与根据自身设备网络合理选型。"
keywords: ["机场怎么选", "机场购买指南", "机场推荐怎么选", "机场避坑", "机场靠谱吗", "买机场注意什么"]
layout: doc
pageType: article
status: published
author: 机场推荐评测实验室
created: 2026-08-16
updated: 2026-08-16
verified: 2026-08-16
---

# 机场怎么选？从预算、线路、稳定性到售后保障的避坑清单

挑选机场时，切忌被花哨的营销词汇迷惑。掌握以下 5 条黄金法则，助您避开 90% 的劣质服务商：

---

## 5 条选购避坑法则

1. **优先月付，严禁大额多年预付**：即使再老牌的服务商，也建议先以月付（15-20元档）试用，验证本地晚高峰表现稳定后，再考虑季付或年付。
2. **认准专线（IEPL / IPLC）**：日常工作、外贸、AI 办公必须标配内网专线，普通公网直连在晚高峰极易卡顿。
3. **核实支持的协议与客户端**：优先选择支持现代化 VLESS 协议的服务商，兼容性好且传输损耗小。
4. **警惕“超低价无限流量”与“永久套餐”**：专线带宽成本极为昂贵，无限制的超低价套餐必然严重超售甚至随时准备跑路。
5. **多端多设备需求确认**：确认套餐允许同时在线的设备数，家庭或办公室多人使用需预留充足设备连接数。
`)

writeFile('guides/foreign-websites-inaccessible/index.md', `---
title: "国外网站打不开怎么办？从DNS、网络路径到代理工具逐步排查"
description: "国外网站打不开怎么办排查指南：按官方服务状态、本地网络DNS配置、运营商拦截与代理网络工具逐步排查海外网站访问问题。"
keywords: ["国外网站打不开怎么办", "海外网站无法访问", "为什么国外网站打不开", "打不开外网", "国外网页打不开"]
layout: doc
pageType: article
status: published
author: 机场推荐评测实验室
created: 2026-08-16
updated: 2026-08-16
verified: 2026-08-16
---

# 国外网站打不开怎么办？从DNS、网络路径到代理工具逐步排查

当您在浏览器中访问 GitHub、ChatGPT、YouTube 或海外大学官网提示“无法访问此网站 / 连接已重置”时，请按照从低成本到高成本的顺序进行系统排查：

---

## 标准排查顺序

1. **排查 1：确认是否为目标服务器自身故障**
   - 访问第三方状态监控平台（如 Downdetector）确认目标服务是否全球性宕机。
2. **排查 2：本地 DNS 污染与解析检查**
   - 国内默认运营商 DNS 可能会对部分海外域名进行错误解析，可尝试将本地 DNS 修改为 \`8.8.8.8\` 或 \`1.1.1.1\`。
3. **排查 3：网络路径阻断与代理工具启用**
   - 若确认为跨境网络路径被防火墙拦截，需要借助正规代理服务（俗称机场）进行加密传输转发。
   - 参考：[2026 新手机场推荐](/recommend/beginner/) 与 [Clash 客户端使用指南](/clients/clash/)。
`)

writeFile('guides/vpn-vs-airport/index.md', `---
title: "VPN、代理、加速器与机场有什么区别？小白网络方案概念全解析"
description: "VPN、代理、加速器和机场有什么区别？通俗解析传统VPN全局加密、游戏加速器UDP优化与机场规则分流的本质差异，帮您选对工具。"
keywords: ["VPN和机场区别", "代理和VPN区别", "加速器和机场", "VPN是什么", "机场是什么", "科学上网工具对比"]
layout: doc
pageType: article
status: published
author: 机场推荐评测实验室
created: 2026-08-16
updated: 2026-08-16
verified: 2026-08-16
---

# VPN、代理、加速器与机场有什么区别？小白网络方案概念全解析

很多人将翻墙工具统称为“VPN”，但实际上 **VPN、网络代理（机场）与游戏加速器** 在技术底层与使用场景上有着根本区别：

---

## 核心区别对比

| 工具类型 | 核心设计初衷 | 流量处理方式 | 日常上网体验 |
|---|---|---|---|
| **传统 VPN** (ExpressVPN等) | 企业远程加密专网 | 全局强制接管所有流量 | 访问国内网站极慢，特征明显易被 GFW 封锁 |
| **代理服务 (机场)** | 绕过网络封锁与加速 | **智能分流 (国内直连/国外代理)** | **速度极快，不影响国内微信淘宝，抗封锁强** |
| **游戏加速器** (网易UU等) | 优化外服游戏 UDP 联机 | 仅针对特定游戏端口加速 | 无法用于打开网页、Google 或 ChatGPT |

**结论**：对于普通用户的网页浏览、视频观看、AI 工具与学习办公，**基于分流规则的代理服务（机场）** 是当前体验最好、速度最快且最节省流量的方案。
`)

// ==========================================
// 8. 词典、专题与文章归档 (docs/glossary/, docs/topics/, docs/articles/)
// ==========================================

writeFile('glossary/index.md', `---
title: "机场术语词典：一站查清所有代理、专线、协议与网络名词"
description: "机场术语词典汇集 IEPL、IPLC、VLESS、Trojan、Shadowsocks、订阅、节点、落地、中转、BGP、原生IP等核心名词通俗释义。"
keywords: ["机场术语词典", "机场名词解释", "IEPL是什么意思", "VLESS名词", "订阅是什么"]
layout: doc
pageType: hub
status: published
author: 机场推荐评测实验室
created: 2026-08-16
updated: 2026-08-16
verified: 2026-08-16
---

# 机场术语词典

<GlossaryList />
`)

writeFile('topics/index.md', `---
title: "机场核心专题：跨栏目深度聚合与主题选型"
description: "机场核心专题：按大流量母词、价格套餐、节点调度与安全预警横向串联的全站深度专题聚合。"
keywords: ["机场专题", "稳定机场专题", "便宜机场专题", "专线机场专题"]
layout: doc
pageType: hub
status: published
author: 机场推荐评测实验室
created: 2026-08-16
updated: 2026-08-16
verified: 2026-08-16
---

# 机场核心专题

<TopicIndex />
`)

writeFile('articles/index.md', `---
title: "全站文章归档库：深度评测、使用教程与行业分析"
description: "机场推荐全站文章归档库，收录已发布的全部评测、教程与专题分析长文。"
keywords: ["机场文章库", "机场文章归档", "机场评测文章"]
layout: doc
pageType: hub
status: published
author: 机场推荐评测实验室
created: 2026-08-16
updated: 2026-08-16
verified: 2026-08-16
---

# 全站文章归档库

<TaggedArticles />
`)

// ==========================================
// 9. 信任与政策页面 (docs/about/, methodology/, etc.)
// ==========================================

writeFile('about/index.md', `---
title: "关于机场推荐：平台立场、评测机制与原则说明"
description: "关于机场推荐（jichangtuij.com）：独立透明的机场选型与评测参考平台，不销售任何网络服务，坚持四层数据解耦展示。"
keywords: ["关于机场推荐", "机场推荐简介", "机场推荐团队"]
layout: doc
pageType: policy
status: published
author: 机场推荐评测实验室
created: 2026-08-16
updated: 2026-08-16
verified: 2026-08-16
---

# 关于机场推荐 (jichangtuij.com)

**机场推荐** 专注于为中文用户提供客观、透明、可复核的代理节点服务（机场）选型参考与技术教程。

## 我们的原则
1. **厂商数据与实测证据严格分离**：不将厂商自称的“支持AI/解锁流媒体”伪装成本站实测。
2. **测速证据保留时间戳**：明确标注 2026-08-11 测试日期与测试环境，拒绝虚构全网第一。
3. **推广关系透明披露**：显著标注推广链接，确保商业合作不影响事实陈述。
`)

writeFile('methodology/index.md', `---
title: "评测方法论：实测样本、测速截图与四层数据分级原则"
description: "机场推荐评测方法论：详细说明2026-08-11测速证据采集规范、数据分层原则（Vendor/Measured/Commercial/Editorial）与免责边界。"
keywords: ["机场评测方法", "机场测速标准", "数据分层规范"]
layout: doc
pageType: policy
status: published
author: 机场推荐评测实验室
created: 2026-08-16
updated: 2026-08-16
verified: 2026-08-16
---

# 评测方法论与数据分级规范

为确保全站信息的准确与客观，我们采用严格的 **四层数据分离模型**：

1. **Vendor (厂商声明)**：价格、名义流量、协议、架构声明。
2. **Measured (本站实测)**：保留时间戳（如 2026-08-11）的原始测速截图与测试环境。
3. **Commercial (商业信息)**：优惠码、推广链接、支付渠道。
4. **Editorial (编辑判断)**：适合人群、不适合人群、优缺点客观分析。
`)

writeFile('editorial-policy/index.md', `---
title: "编辑原则：事实核验、不虚构排名与纠错机制"
description: "机场推荐编辑原则：坚持厂商声明与本站实测分离，严禁伪造实测与虚假排名承诺。"
keywords: ["编辑原则", "内容准则", "纠错机制"]
layout: doc
pageType: policy
status: published
author: 机场推荐评测实验室
created: 2026-08-16
updated: 2026-08-16
verified: 2026-08-16
---

# 网站编辑原则

1. **首段直奔主题**：所有文章在 80-120 字内直接解答用户搜索的核心问题。
2. **拒绝虚假承诺**：严禁出现“100%稳定、永不封锁、全网最快”等无法核验的营销违禁词。
3. **纠错机制**：如品牌方调整资费或参数，用户与厂商均可通过反馈渠道提出事实更正。
`)

writeFile('affiliate-policy/index.md', `---
title: "推广披露：推广链接声明与透明商业机制"
description: "机场推荐推广披露说明：明确披露推广合作关系，说明佣金不影响实测证据与事实陈述。"
keywords: ["推广披露", "Affiliate声明", "商业说明"]
layout: doc
pageType: policy
status: published
author: 机场推荐评测实验室
created: 2026-08-16
updated: 2026-08-16
verified: 2026-08-16
---

# 推广披露与商业关系声明

本站部分指向服务商官网的链接为包含推广代码的合作链接（Affiliate Links）。当您通过该链接注册或购买服务时，本站可能会获得一定比例的推荐佣金。

**我们的独立性承诺**：
- 推广合作关系绝不影响对品牌优缺点的客观评判。
- 测速截图与实测数据独立生成，绝不接受付费修改实测结果。
`)

writeFile('privacy/index.md', `---
title: "隐私政策：无侵入统计与用户数据保护政策"
description: "机场推荐隐私政策：保护访问者隐私，不收集敏感个人信息。"
keywords: ["隐私政策", "用户隐私", "数据保护"]
layout: doc
pageType: policy
status: published
author: 机场推荐评测实验室
created: 2026-08-16
updated: 2026-08-16
verified: 2026-08-16
---

# 隐私政策

本站尊重并保护所有访问者的隐私权益：
- 本站作为静态内容展示平台，不设置强制注册或收集用户个人隐私信息。
- 本站采用轻量静态站内搜索，搜索词仅在本地或静态索引中匹配，不上传第三方追踪。
`)

writeFile('terms/index.md', `---
title: "使用条款：内容免责声明与合规使用提醒"
description: "机场推荐使用条款：网络技术信息仅供学习参考，请遵守所在地法律法规。"
keywords: ["使用条款", "免责声明", "合规提醒"]
layout: doc
pageType: policy
status: published
author: 机场推荐评测实验室
created: 2026-08-16
updated: 2026-08-16
verified: 2026-08-16
---

# 使用条款与免责声明

1. 本站发布的所有技术科普、评测数据与客户端配置教程仅供计算机网络技术研究与学术交流参考。
2. 用户在使用相关网络技术服务时，应自觉遵守中华人民共和国相关法律法规及服务所在地的法律政策。
`)

writeFile('search/index.md', `---
title: "站内全文搜索：快速检索品牌、教程与知识"
description: "基于 Pagefind 静态全文索引的站内搜索引擎，快速检索 16 家品牌、客户端教程与线路知识。"
keywords: ["站内搜索", "全文检索"]
layout: doc
pageType: utility
status: published
author: 机场推荐评测实验室
created: 2026-08-16
updated: 2026-08-16
verified: 2026-08-16
---

# 站内全文搜索

<SearchPanel />
`)

console.log('All content pillars and policy pages generated successfully!')
