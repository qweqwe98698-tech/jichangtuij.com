#!/usr/bin/env node
/**
 * 从 scripts/outlines/*.mjs 生成：
 *   1. 72 篇文章中「尚未完成写作」的扩写型大纲 Markdown（draft:true / noindex:true）
 *   2. data/keyword-map.json —— 主关键词与 URL 的唯一映射，构建时检查冲突
 *   3. data/content-plan.json —— 全部 72 个选题的状态与进度
 *
 * 已经完成写作的文章（status: 'published'）不会被覆盖，
 * 生成器只负责草稿页面与数据文件。
 *
 * 用法：node scripts/generate-outlines.mjs
 */

import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const ROOT = path.resolve(__dirname, '..')
const DOCS = path.join(ROOT, 'docs')
const DATA = path.join(ROOT, 'data')

const BUILD_DATE = process.env.JC_CONTENT_DATE || '2026-08-02'

const CATEGORY_TITLES = {
  recommend: '机场推荐',
  rankings: '机场排行榜',
  reviews: '机场评测',
  compare: '对比选择',
  network: '线路与协议',
  clients: '客户端教程',
  guides: '使用指南',
  'ai-access': 'AI 工具访问',
  streaming: '流媒体解锁',
  troubleshooting: '故障排查',
  warnings: '避坑与风险预警',
  knowledge: '机场知识库',
  regions: '网络与用户场景',
  glossary: '术语词典',
  faq: '常见问题',
  updates: '网站更新记录',
  methodology: '评测方法',
  submit: '申请收录',
  'affiliate-policy': '推广披露'
}

const INTENT_LABELS = {
  informational: '信息型',
  commercial: '商业调研型',
  transactional: '交易型',
  navigational: '导航型',
  troubleshooting: '问题解决型'
}

const TYPE_LABELS = {
  recommendation: '推荐型',
  tutorial: '教程型',
  troubleshooting: '故障排查型',
  comparison: '对比型',
  warning: '风险预警型',
  term: '术语型',
  guide: '指南型',
  methodology: '方法型',
  policy: '规则型',
  hub: '栏目型',
  faq: '问答型',
  update: '记录型'
}

/** ---------- 载入内容矩阵 ---------- */

const parts = ['part-a', 'part-b', 'part-c', 'part-d', 'part-e', 'part-f']
const entries = []
for (const p of parts) {
  const mod = await import(`./outlines/${p}.mjs`)
  entries.push(...mod.default)
}

/** ---------- 一致性检查 ---------- */

const problems = []

if (entries.length !== 72) {
  problems.push(`内容矩阵应为 72 条，当前为 ${entries.length} 条`)
}

const seenId = new Map()
const seenSlug = new Map()
const seenKeyword = new Map()

for (const e of entries) {
  if (seenId.has(e.id)) problems.push(`重复的编号：${e.id}`)
  seenId.set(e.id, e)

  if (seenSlug.has(e.slug)) problems.push(`重复的路径：${e.slug}`)
  seenSlug.set(e.slug, e)

  const kw = e.primaryKeyword.trim()
  if (seenKeyword.has(kw)) {
    problems.push(
      `主关键词冲突：「${kw}」同时分配给 /${seenKeyword.get(kw).slug}/ 和 /${e.slug}/`
    )
  }
  seenKeyword.set(kw, e)

  if (!CATEGORY_TITLES[e.category]) problems.push(`未知栏目：${e.category}（${e.slug}）`)
  if (e.status !== 'published') {
    if (!e.answerDraft || e.answerDraft.length < 20) {
      problems.push(`直接回答草稿过短：${e.slug}`)
    }
    if (!Array.isArray(e.sections) || e.sections.length < 5) {
      problems.push(`H2 数量不足 5 个：${e.slug}`)
    }
    for (const s of e.sections || []) {
      if (!s.points || s.points.length < 3) {
        problems.push(`「${s.h2}」扩写要点不足 3 条：${e.slug}`)
      }
    }
    if (!Array.isArray(e.faq) || e.faq.length < 5) {
      problems.push(`FAQ 问题不足 5 个：${e.slug}`)
    }
  }
}

if (problems.length) {
  console.error('[outlines] 内容矩阵校验失败：')
  for (const p of problems) console.error('  - ' + p)
  process.exit(1)
}

/** ---------- 生成 Markdown ---------- */

function yamlList(items) {
  return `[${items.map((i) => JSON.stringify(String(i))).join(', ')}]`
}

function renderOutline(e) {
  const categoryTitle = CATEGORY_TITLES[e.category]
  const url = `/${e.slug}/`
  const tags = [categoryTitle, TYPE_LABELS[e.contentType] || '内容', '写作大纲']

  const fm = [
    '---',
    `title: ${JSON.stringify(e.title)}`,
    `description: ${JSON.stringify(e.description)}`,
    `date: "${BUILD_DATE}"`,
    `updated: "${BUILD_DATE}"`,
    'author: 机场云编辑部',
    `category: ${JSON.stringify(categoryTitle)}`,
    `tags: ${yamlList(tags)}`,
    `keywords: ${yamlList([e.primaryKeyword, ...e.secondaryKeywords])}`,
    'outline: [2, 3]',
    'readingTime: 0',
    'featured: false',
    'draft: true',
    'noindex: true',
    'status: outline',
    'cover: /og/default-og.webp',
    `contentType: ${e.contentType}`,
    `intent: ${e.intent}`,
    `updateCondition: ${JSON.stringify(e.updateCondition)}`,
    '---',
    ''
  ].join('\n')

  const lines = []
  lines.push(`# ${e.title}`)
  lines.push('')
  lines.push('::: warning 这是一篇未完成的写作大纲')
  lines.push(
    '本页只包含选题结构、扩写要点与核验清单，尚未完成事实核验，因此不会进入站点地图、全文搜索、内容 Feed 与首页文章流，也不应作为结论引用。已完成核验的内容请见[更新记录](/updates/)。'
  )
  lines.push(':::')
  lines.push('')

  lines.push('## 选题定位')
  lines.push('')
  lines.push(`- **主关键词**：${e.primaryKeyword}`)
  lines.push(`- **辅助关键词**：${e.secondaryKeywords.join('、')}`)
  lines.push(`- **搜索意图**：${INTENT_LABELS[e.intent] || e.intent}`)
  lines.push(`- **内容类型**：${TYPE_LABELS[e.contentType] || e.contentType}`)
  lines.push(`- **所属支柱页**：[${CATEGORY_TITLES[e.category]}](${e.pillar})`)
  lines.push(`- **计划路径**：\`${url}\``)
  lines.push('')

  lines.push('## 目标读者与要解决的问题')
  lines.push('')
  lines.push(`**目标读者**：${e.audience}`)
  lines.push('')
  lines.push(`**要解决的问题**：${e.problem}`)
  lines.push('')

  lines.push('## 直接回答草稿')
  lines.push('')
  lines.push('> ' + e.answerDraft)
  lines.push('')
  lines.push(
    `（草稿长度约 ${e.answerDraft.length} 字，正式发布前需压缩到 40—80 个中文字符，并确保可以被独立引用。）`
  )
  lines.push('')

  lines.push('## 文章结构与扩写要点')
  lines.push('')
  e.sections.forEach((s, i) => {
    lines.push(`### H2 ${i + 1}：${s.h2}`)
    lines.push('')
    for (const p of s.points) lines.push(`- ${p}`)
    lines.push('')
  })

  lines.push('## 建议表格')
  lines.push('')
  lines.push(e.table)
  lines.push('')

  lines.push('## 建议图示')
  lines.push('')
  lines.push(e.figure)
  lines.push('')

  lines.push('## 数据核验清单')
  lines.push('')
  for (const v of e.verify) lines.push(`- [ ] ${v}`)
  lines.push('- [ ] 全文不含虚构品牌、虚假评分与未记录条件的性能数字')
  lines.push('- [ ] 所有内部链接指向真实存在且已发布的页面')
  // 锚文本使用目标页面的完整标题：同一锚文本不应指向多个不同 URL
  lines.push('- [ ] 术语用法与[机场常用术语词典](/glossary/airport-terms/)一致')
  lines.push('')

  lines.push('## FAQ 问题清单')
  lines.push('')
  e.faq.forEach((q, i) => lines.push(`${i + 1}. ${q}`))
  lines.push('')
  lines.push(
    '（正式写作时，这些问题需要以 `faq` frontmatter 字段提供答案，页面显示与 FAQPage 结构化数据由同一份数据渲染。）'
  )
  lines.push('')

  lines.push('## 建议内部链接')
  lines.push('')
  for (const l of e.internalLinks) lines.push(`- [${l}](${l})`)
  lines.push('')

  lines.push('## 建议外部资料类型')
  lines.push('')
  lines.push(e.externalSources || '暂不需要外部资料，以站内已核验内容为准。')
  lines.push('')

  lines.push('## 更新条件')
  lines.push('')
  lines.push(e.updateCondition)
  lines.push('')

  lines.push('## 内容完成标准')
  lines.push('')
  lines.push(e.doneCriteria)
  lines.push('')

  return fm + lines.join('\n')
}

let written = 0
let skipped = 0

for (const e of entries) {
  const dir = path.join(DOCS, ...e.slug.split('/'))
  const file = path.join(dir, 'index.md')

  if (e.status === 'published') {
    if (!fs.existsSync(file)) {
      console.error(`[outlines] 标记为 published 但文件不存在：${path.relative(ROOT, file)}`)
      process.exitCode = 1
    }
    skipped++
    continue
  }

  fs.mkdirSync(dir, { recursive: true })
  fs.writeFileSync(file, renderOutline(e), 'utf-8')
  written++
}

/** ---------- 生成 keyword-map.json ---------- */

const keywordMap = entries.map((e) => ({
  primaryKeyword: e.primaryKeyword,
  secondaryKeywords: e.secondaryKeywords,
  slug: `/${e.slug}/`,
  contentType: e.contentType,
  intent: e.intent,
  pillar: e.pillar,
  status: e.status
}))

fs.writeFileSync(
  path.join(DATA, 'keyword-map.json'),
  JSON.stringify(keywordMap, null, 2) + '\n',
  'utf-8'
)

/** ---------- 生成 content-plan.json ---------- */

const plan = {
  generatedAt: new Date().toISOString().slice(0, 10),
  total: entries.length,
  published: entries.filter((e) => e.status === 'published').length,
  outline: entries.filter((e) => e.status !== 'published').length,
  statusValues: ['outline', 'researching', 'writing', 'reviewing', 'published', 'archived'],
  entries: entries.map((e) => ({
    id: e.id,
    title: e.title,
    url: `/${e.slug}/`,
    category: e.category,
    primaryKeyword: e.primaryKeyword,
    contentType: e.contentType,
    intent: INTENT_LABELS[e.intent] || e.intent,
    pillar: e.pillar,
    status: e.status,
    summary: e.description
  }))
}

fs.writeFileSync(
  path.join(DATA, 'content-plan.json'),
  JSON.stringify(plan, null, 2) + '\n',
  'utf-8'
)

console.log(`[outlines] 大纲写入 ${written} 篇，跳过已完成文章 ${skipped} 篇`)
console.log(`[outlines] data/keyword-map.json 与 data/content-plan.json 已更新`)
