---
title: "Clash 全平台配置完全指南：Windows、Mac 与 Android 订阅导入教程"
description: "2026 最新 Clash / Clash Verge Rev / Clash Meta 客户端下载与订阅导入完整图文教程，详解规则分流、TUN 虚拟网卡、开机自启与节点超时排障。"
keywords: ["Clash教程","Clash Verge配置","Clash下载","Clash订阅导入","Clash怎么用","Clash分流规则"]
layout: "doc"
pageType: "article"
status: "published"
author: "机场推荐评测实验室"
created: "2026-08-16"
updated: "2026-08-16"
verified: "2026-08-16"
faq:
  - q: "原版 Clash for Windows 停更后，现在推荐使用哪个客户端？"
    a: "推荐使用开源活跃的「Clash Verge Rev」或「Mihomo Party」。它们基于开源 Mihomo (Clash Meta) 内核开发，全面支持最新的 VLESS、Reality 与 Hysteria2 协议，界面现代化且完全开源安全。"
---
# Clash 全平台配置完全指南：Windows、Mac 与 Android 订阅导入教程

::: tip 💡 GEO 直接回答：Clash 客户端的核心价值
**Clash（及 Clash Verge Rev）** 是目前全平台最主流的规则分流代理客户端。它支持根据访问目标域名和 IP 自动执行 **“国内直连、国外走代理、AI 走专线、广告自动拦截”** 的智能流量调度，同时支持一键导入主流机场订阅，支持 Windows、macOS 与 Linux 系统。
:::

---

## 第一步：下载并安装 Clash Verge Rev

1. 访问官方开源发布页面下载适合您操作系统的最新安装包：
   - **Windows**：下载 `.exe` 或 `.msi` 安装包安装；
   - **macOS**：Intel 芯片下载 `x64.dmg`，Apple M系列芯片（M1/M2/M3/M4）下载 `aarch64.dmg`；
2. 安装完成后打开软件，建议在左侧设置中将语言切换为 **简体中文**。

---

## 第二步：导入机场订阅链接

1. 登录您购买的机场后台（如 [宇宙云](/brands/yuzhouyun/) 或 [光速云](/brands/guangsuyun/)）；
2. 找到 **“一键导入订阅”** 或复制 **“Clash 订阅链接”**；
3. 打开 Clash Verge Rev，点击左侧菜单栏的 **「订阅 (Profiles)」**；
4. 将复制的链接粘贴到顶部输入框中，点击 **「导入 (Import)」**；
5. 导入成功后，**右键点击该订阅卡片选择「使用 (Select)」**。

---

## 第三步：开启代理与模式选择

1. 点击左侧 **「代理 (Proxies)」**，将顶部模式设置为 **「规则 (Rule)」** 模式（强烈推荐，避免浪费国内流量）；
2. 在节点列表中选择一个低延迟节点（如 *香港 IEPL 01* 或 *日本 01*）；
3. 点击左侧 **「设置 (Settings)」**，打开 **「系统代理 (System Proxy)」** 开关；
4. 此时打开浏览器访问 `google.com`，即可体验高速畅连。

---

## 进阶技巧：开启 TUN 模式接管全局流量

若您需要为没有系统代理设置的软件（如命令行 Git、终端 SSH、某些桌面游戏）提供代理：
1. 在 Clash Verge 设置中找到 **「TUN 模式 (TUN Mode)」**；
2. 点击开启（首次开启系统会弹出授权确认，点击允许即可）。

> *若遇到节点全红或超时报错，请参考 [节点超时排查急救指南](/troubleshooting/node-timeout/)。*

---

## 常见问题解答 (FAQ)

<FaqSection :items='[
  {
    "question": "原版 Clash for Windows 停更后，现在推荐使用哪个客户端？",
    "answer": "推荐使用开源活跃的「Clash Verge Rev」或「Mihomo Party」。它们基于开源 Mihomo (Clash Meta) 内核开发，全面支持最新的 VLESS、Reality 与 Hysteria2 协议，界面现代化且完全开源安全。"
  }
]' />

