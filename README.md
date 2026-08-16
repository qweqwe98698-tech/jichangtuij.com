# 机场推荐 (jichangtuij.com)

> **2026 稳定、便宜、高性价比机场推荐与选型决策知识平台**  
> 坚持四层数据解耦展示（官方资料 / 实测证据 / 编辑建议 / 商业链接），标配首屏 GEO 答案引擎与本地全文搜索。

---

## 🌟 核心特性与架构

- **现代化技术栈**：基于 [VitePress](https://vitepress.dev/) + Vue 3 构建的高性能静态网站，毫秒级首屏加载；
- **全矩阵内容体系**：包含 88 个页面（62 个规范索引页面）、16 家主流机场品牌档案库与 2026-08-11 原始节点测速截图证据；
- **GEO 与 AI 搜索优化**：深度适配 Google AI Overviews、Bing Copilot、ChatGPT Search 与 Perplexity 结构化直出（`<AnswerBox>`、`<DecisionTable>`、`FAQPage Schema`、`Speakable`）；
- **交互式留存工具**：
  - **30 秒智能选型匹配器 (`QuickFinder.vue`)**：根据设备、用途与预算即时筛选 TOP 方案；
  - **线路传输动态模拟器 (`CloudConsole.vue`)**：动态演示 IEPL 跨境内网专线 vs 公网直连底层差异；
  - **下一步决策行动矩阵 (`NextStepMatrix.vue`)**：杜绝死胡同页面，构建深度内链闭环；
- **全自动门禁流水线**：内置链接检查器（0 死链保证）、SEO 规则验证器与构建产物自动核验。

---

## 📁 目录结构

```text
.
├── data/                       # 核心数据层 (服务商 JSON、关键词映射表、标签注册表)
├── docs/                       # 网站内容与主题源码
│   ├── .vitepress/             # VitePress 站点配置、路由、主题组件与样式
│   │   ├── components/         # Vue 3 交互组件 (QuickFinder, CloudConsole, NextStepMatrix 等)
│   │   ├── config.mts          # 站点元数据、JSON-LD 注入、Sitemap 与 RSS Feed 配置
│   │   └── theme/              # 简白品牌主题样式与布局
│   ├── brands/                 # 16 家机场品牌详细评测与测速档案
│   ├── recommend/              # 稳定、便宜、性价比、新手机场推荐支柱
│   ├── clients/                # Clash、Shadowrocket、v2rayN 配置教程
│   ├── network/                # IEPL/IPLC 专线、VLESS 协议技术科普
│   ├── ai/                     # ChatGPT / Claude 原生节点专区
│   ├── streaming/              # Netflix 4K 流媒体解锁专区
│   ├── troubleshooting/        # 节点超时全红、订阅更新失败排障中心
│   ├── guides/                 # 新手入门与选型避坑指南
│   ├── sitemap/                # HTML 网站全景地图页面
│   └── public/                 # 静态资源 (robots.txt, manifest, 测速图, IndexNow 密钥)
└── scripts/                    # 自动化数据生成、死链检查与 SEO 检验脚本
```

---

## 🛠️ 本地开发与构建命令

```bash
# 1. 安装依赖
npm install

# 2. 启动本地开发服务 (支持热重载)
npm run dev

# 3. 执行完整生产构建与门禁检测 (包含数据生成、静态编译、全文索引、SEO与死链扫描)
npm run build

# 4. 预览生产构建静态产物
npm run preview
```

---

## 🚀 部署建议

本站为标准纯静态站点（Static HTML），可直接一键部署至以下平台：
- **Cloudflare Pages**：构建命令 `npm run build`，输出目录 `docs/.vitepress/dist`；
- **Vercel** / **Netlify**：构建命令 `npm run build`，输出目录 `docs/.vitepress/dist`；
- **传统 Apache / Nginx 虚拟主机**：直接将 `docs/.vitepress/dist` 内的所有文件上传至网站根目录即可（已内置 `.htaccess` 与 `_redirects` 伪静态规则）。

---

## 📄 版权与许可

本项目采用 [MIT License](LICENSE) 开源许可。公开数据集遵循 [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/) 共享协议。
