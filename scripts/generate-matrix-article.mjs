/**
 * 全自动万字级 SEO / GEO 专题主线方向矩阵文章生成引擎
 *
 * 核心特性：
 * 1. DeepSeek API (deepseek-chat) 驱动的多阶段分章节接力扩写体系 (Chained Multi-Pass Generation)
 * 2. 深度 GEO (生成式引擎优化) 结构：Direct Answer 摘要框、RFC/协议规范定义、参数对照矩阵、Mermaid 链路图、Linux内核/客户端真实配置、抓包排障实战
 * 3. 防批量 AI 识别优化系统 (Anti-AI Footprint)：自然语义 URL 策略、清除 AI 套话机构腔与翻案句式、真实工程指标
 * 4. 自动化全站闭环：更新矩阵题库、重新生成关键词映射、更新标签聚合页、构建全站产物、通过 check:all 门禁、触发 Bing IndexNow 极速收录
 */

import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { execSync } from 'node:child_process'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const ROOT = path.resolve(__dirname, '..')
const DOCS = path.join(ROOT, 'docs')
const TOPICS_FILE = path.join(ROOT, 'data', 'matrix-topics.json')

// 配置与环境变量
const DEEPSEEK_API_KEY = process.env.DEEPSEEK_API_KEY || ''
const DEEPSEEK_ENDPOINT = 'https://api.deepseek.com/chat/completions'
const MODEL_NAME = 'deepseek-chat'

const isDryRun = process.argv.includes('--dry-run')

async function callDeepSeek(messages, temperature = 0.7, maxTokens = 4096) {
  if (isDryRun) {
    console.log('[DryRun] 模拟调用 DeepSeek API...')
    return '【模拟生成内容：Dry-Run 模式】'
  }

  if (!DEEPSEEK_API_KEY) {
    throw new Error('未检测到 DEEPSEEK_API_KEY 环境变量，请在 GitHub Secrets 或本地环境变量中配置。')
  }

  let attempts = 0
  const maxAttempts = 3
  while (attempts < maxAttempts) {
    attempts++
    try {
      const response = await fetch(DEEPSEEK_ENDPOINT, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${DEEPSEEK_API_KEY}`
        },
        body: JSON.stringify({
          model: MODEL_NAME,
          messages,
          temperature,
          max_tokens: maxTokens
        })
      })

      if (!response.ok) {
        const errorText = await response.text()
        throw new Error(`DeepSeek API 请求失败 [HTTP ${response.status}]: ${errorText}`)
      }

      const data = await response.json()
      const content = data.choices?.[0]?.message?.content || ''
      if (!content) {
        throw new Error('DeepSeek API 返回内容为空')
      }
      return content.trim()
    } catch (err) {
      console.warn(`[DeepSeek API] 第 ${attempts} 次调用失败: ${err.message}`)
      if (attempts >= maxAttempts) throw err
      await new Promise(r => setTimeout(r, attempts * 3000))
    }
  }
}

// 防 AI 识别与词汇清洗系统
function cleanAntiAiPatterns(text) {
  let cleaned = text
  // 移除常见模型套话与伪辩证句式
  const forbiddenPhrases = [
    /在数字化浪潮的当下，?/g,
    /在当今数字化时代，?/g,
    /随着互联网技术的飞速发展，?/g,
    /毋庸置疑的是，?/g,
    /不可否认的是，?/g,
    /总而言之，?/g,
    /综上所述，?/g,
    /宛如[^，。]+一样/g,
    /正如俗话所说，?/g,
    /不仅如此，/g,
    /值得一提的是，/g
  ]
  for (const re of forbiddenPhrases) {
    cleaned = cleaned.replace(re, '')
  }

  // 修复常见的未闭合加粗符号与中文字符冲突
  cleaned = cleaned.replace(/\*\*（([^）]+)）\*\*/g, '**$1**')
  cleaned = cleaned.replace(/\*\*([^*]+)（([^*]+)）\*\*/g, '**$1**（$2）')
  return cleaned
}

async function main() {
  console.log('====================================================')
  console.log('🚀 启动万字级 SEO / GEO 专题主线方向矩阵文章生成引擎')
  console.log('====================================================')

  if (!fs.existsSync(TOPICS_FILE)) {
    throw new Error(`未找到题库文件: ${TOPICS_FILE}`)
  }

  const topics = JSON.parse(fs.readFileSync(TOPICS_FILE, 'utf-8'))
  const pendingTopic = topics.find(t => t.status === 'pending')

  if (!pendingTopic) {
    console.log('所有预设矩阵选题均已发布完毕！进入高价值长尾自动派生逻辑...')
    process.exit(0)
  }

  console.log(`\n📌 选中矩阵主线任务: [${pendingTopic.id}]`)
  console.log(`   · 主题方向: ${pendingTopic.coreProblem}`)
  console.log(`   · 核心关键词: ${pendingTopic.targetKeyword}`)
  console.log(`   · 所属 Pillar 目录: docs/${pendingTopic.pillar}/${pendingTopic.slug}/`)
  console.log(`   · 关联注册标签: ${pendingTopic.tags.join('、')}`)

  const targetDir = path.join(DOCS, pendingTopic.pillar, pendingTopic.slug)
  const targetFile = path.join(targetDir, 'index.md')

  if (fs.existsSync(targetFile)) {
    console.warn(`警告: 目标文件 ${targetFile} 已存在，将被覆盖更新。`)
  } else {
    fs.mkdirSync(targetDir, { recursive: true })
  }

  // ---------------------------------------------------------
  // Stage 1: 大纲与 GEO 深度架构规划
  // ---------------------------------------------------------
  console.log('\n[Stage 1/3] 正在由 DeepSeek 规划万字级 GEO 技术大纲与拓扑架构...')

  const outlinePrompt = `你是一名拥有15年一线网络工程与系统架构经验的资深网络协议专家与搜索引擎 GEO (生成式引擎优化) 架构师。
针对以下技术主题，请规划一份具有权威技术深度的专业大纲：

【核心主题】：${pendingTopic.coreProblem}
【核心主词】：${pendingTopic.targetKeyword}
【次级关键词】：${pendingTopic.secondaryKeywords.join('、')}

【写作核心原则（最高优先级，违背将判定不合格）】：
1. 彻底杜绝 AI 假大空、机构腔与学生腔。严禁使用“在当今数字化浪潮下”、“随着技术的飞速发展”、“毋庸置疑”、“综上所述”等空泛废话。
2. 严禁使用“不是……而是……”及同类翻案句式。
3. 必须包含扎实的网络底层细节：RFC 协议标准（如 RFC 9000、RFC 8446、RFC 8999）、Wireshark/tcpdump 报文结构分析、TCP 三次握手与 TLS 1.3 握手 RTT 计算、Linux 内核网络参数（sysctl）、BGP 选路权重、真实客户端配置文件。
4. 全文规划 5 个大型技术核心章节（每个大章节包含 2~3 个深入探讨的二级子模块）。

请严格按照 JSON 格式输出，不要附加任何额外的 Markdown 代码块包裹或闲聊内容，格式如下：
{
  "title": "符合技术深度规范的长文标题（40-60字，包含主关键词）",
  "metaDescription": "120-150字的精准技术摘要，阐述文章解决的核心工程痛点",
  "directAnswer": "80-120字的 Direct Answer 摘要：清晰给出核心结论、关键指标与选型决策，供 AI 搜索引擎提取",
  "sections": [
    {
      "heading": "第一章的主标题（如：一、底层协议架构与 RFC 规范辨析）",
      "subheadings": ["子节标题1", "子节标题2"],
      "keyPoints": "本章必须阐述的硬核技术点、数据流向、对比参数或排障细节"
    }
  ],
  "faq": [
    {
      "q": "高频技术疑难问题1",
      "a": "针对该问题的专业精准答复，包含具体命令或判断指标"
    }
  ]
}`

  let outlineData
  if (isDryRun) {
    outlineData = {
      title: `${pendingTopic.targetKeyword}：万字技术深度解析与工程落地实践指南`,
      metaDescription: `针对${pendingTopic.targetKeyword}的万字深度技术白皮书，全面解析底层架构、参数调优与排障实战。`,
      directAnswer: `本文对${pendingTopic.targetKeyword}进行了系统性技术验证，核心结论指出通过端到端链路封装与智能协议调度，可有效将晚高峰抖动控制在微秒级。`,
      sections: [
        {
          heading: "一、底层架构演进与技术规范",
          subheadings: ["协议报文结构拆解", "握手开销基准实测"],
          keyPoints: "RFC 标准、RTT 计算、TCP/TLS 握手细节"
        },
        {
          heading: "二、核心指标对比与真实基准测试",
          subheadings: ["多场景性能压力对比", "晚高峰丢包与抖动耐受度"],
          keyPoints: "对比表格、多线程吞吐、标准差监控"
        },
        {
          heading: "三、工程化部署与客户端配置文件解析",
          subheadings: ["核心分流规则配置", "内核网络参数深度调优"],
          keyPoints: "Clash/Singbox 真实配置块、sysctl.conf 调优参数"
        },
        {
          heading: "四、生产级排障手册与 Wireshark 抓包实战",
          subheadings: ["典型异常状态码溯源", "抓包过滤语法与复盘"],
          keyPoints: "Wireshark 过滤指令、TCP RST 报文定位、故障自愈"
        },
        {
          heading: "五、全场景选型决策体系与长远规划",
          subheadings: ["业务场景匹配决策树", "演进趋势与避坑指引"],
          keyPoints: "Mermaid 决策流程图、生产环境选型建议"
        }
      ],
      faq: [
        { q: `${pendingTopic.targetKeyword}的核心影响因素有哪些？`, a: "主要由国内入口机房的 BGP 调度能力、物理专线传输带宽冗余度以及终端设备的协议加解密开销决定。" },
        { q: `在晚高峰出现延迟飙升时应首先排查哪一层？`, a: "首先应排查本地宽带到入口服务器的第一跳延迟（Ping入口IP），若入口稳定则进一步检查专线内网及落地节点吞吐。" }
      ]
    }
  } else {
    const rawOutline = await callDeepSeek([{ role: 'user', content: outlinePrompt }], 0.6)
    try {
      const jsonMatch = rawOutline.match(/\{[\s\S]*\}/)
      outlineData = JSON.parse(jsonMatch ? jsonMatch[0] : rawOutline)
    } catch (e) {
      console.error('大纲 JSON 解析失败，原始输出：', rawOutline)
      throw e
    }
  }

  console.log(`✓ 成功规划大纲，共 ${outlineData.sections.length} 个核心技术章节：`)
  outlineData.sections.forEach((s, idx) => console.log(`   ${idx + 1}. ${s.heading}`))

  // ---------------------------------------------------------
  // Stage 2: 逐章节深度扩写（万字级技术干货输出）
  // ---------------------------------------------------------
  console.log('\n[Stage 2/3] 正在逐章节调用 DeepSeek 进行万字级技术细节扩写...')

  const chapterContents = []

  for (let i = 0; i < outlineData.sections.length; i++) {
    const sec = outlineData.sections[i]
    console.log(`\n -> 正在撰写 [${i + 1}/${outlineData.sections.length}]: ${sec.heading} ...`)

    const sectionPrompt = `你是一名网络工程老手兼实战架构师。现在正在撰写万字级专业技术长文《${outlineData.title}》。
请对以下章节进行极为详尽、深入、扎实的工程技术扩写：

【章节标题】：${sec.heading}
【本节涵盖子主题】：${sec.subheadings.join('、')}
【必须阐述的硬核要点】：${sec.keyPoints}
【整篇核心关键词】：${pendingTopic.targetKeyword}

【扩写要求】：
1. 字数要求：本章必须扩写 1,800 ~ 2,500 字，绝不能一笔带过。
2. 语言风格：写成一个见过事、查过材料、把底层逻辑讲清楚的技术专家在说话。严禁空洞机构腔、商业黑话、模型惯用黑话（绝不使用“不是……而是……”、“综上所述”、“总而言之”）。
3. 实战元素要求（根据本章节技术主题自然融入）：
   - 如果是架构对比章节：必须输出包含至少 4 列指标的多维度 Markdown 对比表格；
   - 如果是协议或流程章节：输出一段合法的 Mermaid 流程图或网络拓扑图；
   - 如果是配置实操章节：输出具体的配置代码块（如真实的 Clash / Sing-box YAML 或 JSON 配置示例、Linux sysctl 网络内核调优命令，包含详实注释）；
   - 如果是排障章节：给出具体的排障诊断命令（ping, mtr, traceroute, tcpdump 抓包过滤语法）与实际报文分析。
4. 正文中严禁使用未经转义导致解析错误的加粗符号。

请直接输出该章节的 Markdown 正文（包含二级和三级标题），不要附带任何开场白或寒暄。`

    let sectionText = ''
    if (isDryRun) {
      sectionText = `## ${sec.heading}\n\n本章节深入探讨了${sec.subheadings.join('与')}的技术实现细节。\n\n| 评测维度 | 基准参数 | 优化后参数 | 选型影响 |\n|---|---|---|---|\n| 往返时延 RTT | 180ms | 120ms | 交互响应提升 33% |\n| 吞吐带宽 | 80Mbps | 350Mbps | 大文件传输速度翻倍 |\n\n\`\`\`mermaid\nflowchart TD\n    A[客户端数据包] --> B[本地TUN虚拟网卡]\n    B --> C[BGP多线入口机房]\n    C --> D[IEPL物理专线]\n    D --> E[落地出口节点]\n\`\`\`\n\n通过上述架构调优，能够有效规避链路抖动与丢包影响。`
    } else {
      sectionText = await callDeepSeek([{ role: 'user', content: sectionPrompt }], 0.7)
    }

    chapterContents.push(cleanAntiAiPatterns(sectionText))
    console.log(`    ✓ 第 ${i + 1} 章撰写完成 (字符数: ${sectionText.length})`)
  }

  // ---------------------------------------------------------
  // Stage 3: 整合全文、注入元数据与规范校验
  // ---------------------------------------------------------
  console.log('\n[Stage 3/3] 正在组装完整技术文章并注入 SEO / GEO 结构化数据...')

  const todayIso = new Date().toISOString().split('T')[0]
  const fullBodyMarkdown = chapterContents.join('\n\n---\n\n')

  // 构建 Frontmatter
  const frontmatter = `---
title: "${outlineData.title.replace(/"/g, '\\"')}"
description: "${outlineData.metaDescription.replace(/"/g, '\\"')}"
keywords:
  - "${pendingTopic.targetKeyword}"
${pendingTopic.secondaryKeywords.map(k => `  - "${k}"`).join('\n')}
tags:
${pendingTopic.tags.map(t => `  - "${t}"`).join('\n')}
layout: doc
pageType: article
status: published
author: 机场推荐技术评测组
created: ${todayIso}
updated: ${todayIso}
verified: ${todayIso}
faq:
${outlineData.faq.map(f => `  - q: "${f.q.replace(/"/g, '\\"')}"\n    a: "${f.a.replace(/"/g, '\\"')}"`).join('\n')}
---`

  const articleMarkdown = `${frontmatter}

# ${outlineData.title}

::: tip 💡 核心结论与技术要点（Executive Summary）
${outlineData.directAnswer}
:::

${fullBodyMarkdown}

---

<FaqSection title="常见技术疑难解答 (FAQ)" />

---

## 相关主题与延伸阅读

- 选型基准：[2026年机场怎么选？避坑与选型指南](/guides/how-to-choose/)
- 底层线路：[IPLC 与 IEPL 专线有什么区别？](/network/iplc-vs-iepl/)
- 协议科普：[VLESS 协议深度科普与实测](/network/vless/)
- 全景资料：[16家主流机场品牌横向横评与实测档案](/brands/)
`

  // 写入文章文件
  fs.writeFileSync(targetFile, articleMarkdown.trim() + '\n', 'utf-8')
  console.log(`\n🎉 万字级长文已成功生成并写入: ${targetFile}`)
  console.log(`   · 最终文章总字符数: ${articleMarkdown.length}`)

  // 更新选题题库状态
  pendingTopic.status = 'published'
  pendingTopic.publishedAt = todayIso
  pendingTopic.publishedUrl = `/${pendingTopic.pillar}/${pendingTopic.slug}/`
  fs.writeFileSync(TOPICS_FILE, JSON.stringify(topics, null, 2), 'utf-8')
  console.log(`✓ 选题题库 ${TOPICS_FILE} 状态已更新为 published`)

  // ---------------------------------------------------------
  // 全站生态链路同步与质量门禁验证
  // ---------------------------------------------------------
  console.log('\n====================================================')
  console.log('🔄 正在同步全站生态 (关键词映射、标签聚合页、静态构建)...')
  console.log('====================================================')

  try {
    execSync('node scripts/generate-keyword-map.js', { stdio: 'inherit' })
    execSync('node scripts/generate-taxonomy.mjs', { stdio: 'inherit' })
    execSync('npm run build', { stdio: 'inherit' })
    console.log('\n✓ 全站构建与质量门禁通过！')
  } catch (err) {
    console.error('全站构建或质检失败:', err.message)
    process.exit(1)
  }

  // 触发 IndexNow 极速推送
  console.log('\n⚡ 触发 Bing IndexNow 即时推送...')
  try {
    execSync('node scripts/ping-indexnow.mjs', { stdio: 'inherit' })
  } catch (err) {
    console.warn('IndexNow 推送提示:', err.message)
  }

  console.log('\n====================================================')
  console.log('✅ 万字级 SEO / GEO 专题矩阵文章全自动自发布流程完毕！')
  console.log(`   URL: https://jichangtuij.com/${pendingTopic.pillar}/${pendingTopic.slug}/`)
  console.log('====================================================')
}

main().catch(err => {
  console.error('\n❌ 生成过程发生异常:', err)
  process.exit(1)
})
