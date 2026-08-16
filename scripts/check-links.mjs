#!/usr/bin/env node
/**
 * 链接检查。扫描构建产物中的全部 HTML，检查：
 *   - 空 href / href="#" / javascript:void(0)
 *   - 站内链接指向的文件是否存在（含尾斜杠目录与 .html）
 *   - 站内锚点是否真实存在于目标页面
 *   - 图片、脚本、样式等资源是否存在
 *   - 路径大小写问题
 *   - localhost、测试域名、Windows 本地路径
 */

import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const ROOT = path.resolve(__dirname, '..')
const DIST = path.join(ROOT, 'docs', '.vitepress', 'dist')

if (!fs.existsSync(DIST)) {
  console.error('[links] 构建目录不存在，请先运行 npm run build')
  process.exit(1)
}

const errors = []
const warnings = []

function rel(p) {
  return path.relative(DIST, p).replace(/\\/g, '/')
}

function walk(dir, out = []) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name)
    if (entry.isDirectory()) {
      if (entry.name === 'pagefind') continue
      walk(full, out)
    } else if (entry.name.endsWith('.html')) {
      out.push(full)
    }
  }
  return out
}

/** 构建产物的真实文件索引（用于大小写敏感检查） */
const fileIndex = new Set()
function indexFiles(dir) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name)
    if (entry.isDirectory()) indexFiles(full)
    else fileIndex.add(rel(full))
  }
}
indexFiles(DIST)

/** 缓存每个页面的锚点集合 */
const anchorCache = new Map()

function anchorsOf(htmlPath) {
  if (anchorCache.has(htmlPath)) return anchorCache.get(htmlPath)
  const set = new Set()
  if (fs.existsSync(htmlPath)) {
    const html = fs.readFileSync(htmlPath, 'utf-8')
    for (const m of html.matchAll(/\sid="([^"]+)"/g)) set.add(m[1])
    for (const m of html.matchAll(/\sname="([^"]+)"/g)) set.add(m[1])
  }
  anchorCache.set(htmlPath, set)
  return set
}

/** 把站内路径解析为磁盘文件 */
function resolveInternal(urlPath) {
  let p = decodeURIComponent(urlPath)
  if (p.startsWith('/')) p = p.slice(1)
  if (p === '') return path.join(DIST, 'index.html')
  if (p.endsWith('/')) return path.join(DIST, p, 'index.html')
  const asFile = path.join(DIST, p)
  if (fs.existsSync(asFile) && fs.statSync(asFile).isFile()) return asFile
  const asDir = path.join(DIST, p, 'index.html')
  if (fs.existsSync(asDir)) return asDir
  return asFile
}

const htmlFiles = walk(DIST)
let linkCount = 0
let assetCount = 0

const EXTERNAL = /^(https?:)?\/\//i
const SPECIAL = /^(mailto:|tel:|data:|blob:|#)/i

/** 无信息量的锚文本：既不能说明目标内容，也无法被搜索引擎用于理解页面关系 */
const GENERIC_ANCHORS = [
  '点击这里',
  '点这里',
  '这里',
  '点击',
  '更多',
  '查看更多',
  '详情',
  '链接',
  'click here',
  'read more',
  'here'
]

/** 内部链接图：URL → 指向它的页面集合，用于孤立页面检测 */
const inbound = new Map()
/** 锚文本统计：文本 → 目标 URL 集合，用于锚文本一致性检查 */
const anchorTexts = new Map()

function isIndexableHtml(html) {
  return !/name="robots"[^>]*content="[^"]*noindex/.test(html)
}

/** 取出 <a> 的可见文本（含图片 alt），用于锚文本质量检查 */
function anchorText(tag, inner) {
  const aria = tag.match(/\saria-label="([^"]*)"/)
  if (aria) return aria[1].trim()
  const alt = inner.match(/<img[^>]*\salt="([^"]+)"/)
  const text = inner
    .replace(/<[^>]+>/g, ' ')
    .replace(/&[a-z#0-9]+;/gi, ' ')
    .replace(/\s+/g, ' ')
    .trim()
  return text || (alt ? alt[1].trim() : '')
}

for (const file of htmlFiles) {
  const html = fs.readFileSync(file, 'utf-8')
  const from = rel(file)

  // ---- href ----
  for (const m of html.matchAll(/\shref="([^"]*)"/g)) {
    const href = m[1]
    linkCount++

    if (href.trim() === '') {
      errors.push(`${from}：出现空 href`)
      continue
    }
    if (href === '#') {
      errors.push(`${from}：出现 href="#"`)
      continue
    }
    if (/^javascript:/i.test(href)) {
      errors.push(`${from}：出现 javascript: 链接（${href}）`)
      continue
    }
    if (/localhost|127\.0\.0\.1|\.pages\.dev|example\.com/i.test(href)) {
      errors.push(`${from}：出现本地或测试域名链接（${href}）`)
      continue
    }
    if (/^[a-zA-Z]:\\/.test(href)) {
      errors.push(`${from}：出现 Windows 本地路径（${href}）`)
      continue
    }
    if (EXTERNAL.test(href)) {
      if (href.startsWith('http://')) {
        warnings.push(`${from}：外部链接未使用 HTTPS（${href}）`)
      }
      continue
    }
    if (SPECIAL.test(href)) {
      // 纯锚点：检查当前页面是否存在该 id
      if (href.startsWith('#') && href.length > 1) {
        const id = decodeURIComponent(href.slice(1))
        if (!anchorsOf(file).has(id)) {
          errors.push(`${from}：页内锚点不存在（${href}）`)
        }
      }
      continue
    }
    if (!href.startsWith('/')) {
      warnings.push(`${from}：使用了相对链接（${href}），建议统一为绝对站内路径`)
      continue
    }

    const [pathPart, hash] = href.split('#')
    const target = resolveInternal(pathPart)

    if (!fs.existsSync(target)) {
      errors.push(`${from}：站内链接目标不存在（${href}）`)
      continue
    }

    const targetRel = rel(target)
    if (!fileIndex.has(targetRel)) {
      errors.push(`${from}：路径大小写不匹配（${href}）`)
      continue
    }

    if (hash) {
      const id = decodeURIComponent(hash)
      if (!anchorsOf(target).has(id)) {
        errors.push(`${from}：锚点在目标页面不存在（${href}）`)
      }
    }
  }

  // ---- src ----
  for (const m of html.matchAll(/\ssrc="([^"]*)"/g)) {
    const src = m[1]
    assetCount++

    if (src.trim() === '') {
      errors.push(`${from}：出现空 src`)
      continue
    }
    if (EXTERNAL.test(src)) {
      errors.push(`${from}：引用了外部资源（${src}），本站要求全部资源本地化`)
      continue
    }
    if (SPECIAL.test(src)) continue
    if (!src.startsWith('/')) continue

    const target = resolveInternal(src.split('?')[0].split('#')[0])
    if (!fs.existsSync(target)) {
      errors.push(`${from}：资源不存在（${src}）`)
    }
  }

  // ---- 样式表与预加载 ----
  for (const m of html.matchAll(/<link[^>]+href="([^"]+)"[^>]*>/g)) {
    const href = m[1]
    if (EXTERNAL.test(href)) {
      const tag = m[0]
      if (/rel="(stylesheet|preload|preconnect|dns-prefetch)"/.test(tag)) {
        errors.push(`${from}：引用了外部样式或字体资源（${href}）`)
      }
    }
  }

  // ---- 图片属性完整性：alt / width / height / 懒加载 ----
  for (const m of html.matchAll(/<img\b[^>]*>/g)) {
    const tag = m[0]
    const src = (tag.match(/\ssrc="([^"]*)"/) || [])[1] || '(无 src)'

    if (!/\salt=/.test(tag)) {
      errors.push(`${from}：图片缺少 alt 属性（${src}）`)
    }
    if (!/\swidth="/.test(tag) || !/\sheight="/.test(tag)) {
      errors.push(`${from}：图片缺少 width/height，会造成布局偏移（${src}）`)
    }
    // 装饰性图片（alt="" + aria-hidden）不强制懒加载；内容图片必须声明加载策略
    const decorative = /\salt=""/.test(tag) && /aria-hidden="true"/.test(tag)
    if (!decorative && !/\sloading="(lazy|eager)"/.test(tag)) {
      errors.push(`${from}：内容图片缺少 loading 属性（${src}）`)
    }
    if (!decorative && !/\sdecoding="/.test(tag)) {
      warnings.push(`${from}：内容图片缺少 decoding 属性（${src}）`)
    }
    // 内容图片应使用描述性文件名，放在 /images/ 下
    if (!decorative && src.startsWith('/') && !/^\/(images|og)\//.test(src)) {
      warnings.push(`${from}：内容图片建议放在 /images/ 下并使用描述性文件名（${src}）`)
    }
  }

  // ---- 锚文本质量 + 内部链接图 ----
  if (isIndexableHtml(html)) {
    const fromUrl = from === 'index.html' ? '/' : '/' + from.replace(/index\.html$/, '')
    for (const m of html.matchAll(/<a\b([^>]*)>([\s\S]*?)<\/a>/g)) {
      const attrs = m[1]
      const hrefMatch = attrs.match(/\shref="([^"]*)"/)
      if (!hrefMatch) continue
      const href = hrefMatch[1]
      if (!href.startsWith('/') || EXTERNAL.test(href)) continue

      const text = anchorText(attrs, m[2])
      const targetUrl = href.split('#')[0].split('?')[0]

      if (!text) {
        errors.push(`${from}：存在没有可读锚文本的链接（${href}）`)
        continue
      }
      if (GENERIC_ANCHORS.includes(text.toLowerCase())) {
        errors.push(`${from}：锚文本「${text}」没有信息量，无法说明目标内容（${href}）`)
      }

      if (targetUrl && targetUrl !== fromUrl) {
        if (!inbound.has(targetUrl)) inbound.set(targetUrl, new Set())
        inbound.get(targetUrl).add(fromUrl)
      }
      if (!anchorTexts.has(text)) anchorTexts.set(text, new Set())
      anchorTexts.get(text).add(targetUrl)
    }
  }
}

/** ---------- 孤立页面检测：可索引页面必须有站内入口 ---------- */

for (const file of htmlFiles) {
  const rel = rel_(file)
  if (rel === '404.html') continue
  const html = fs.readFileSync(file, 'utf-8')
  if (!isIndexableHtml(html)) continue

  const url = rel === 'index.html' ? '/' : '/' + rel.replace(/index\.html$/, '')
  if (url === '/') continue

  const sources = inbound.get(url)
  if (!sources || sources.size === 0) {
    errors.push(`孤立页面：${url} 可以被索引，但站内没有任何页面链接到它`)
  }
}

function rel_(p) {
  return path.relative(DIST, p).replace(/\\/g, '/')
}

/** ---------- 锚文本一致性：同一锚文本不应指向多个不同目标 ---------- */

for (const [text, targets] of anchorTexts) {
  if (targets.size > 1 && text.length > 3) {
    const list = [...targets].slice(0, 4).join('、')
    warnings.push(`锚文本「${text}」指向了 ${targets.size} 个不同目标：${list}`)
  }
}

/** ---------- 重复路径检查（大小写不同但内容相同的目录） ---------- */

const lowerMap = new Map()
for (const f of fileIndex) {
  const lower = f.toLowerCase()
  if (lowerMap.has(lower) && lowerMap.get(lower) !== f) {
    errors.push(`存在仅大小写不同的重复路径：${lowerMap.get(lower)} 与 ${f}`)
  }
  lowerMap.set(lower, f)
}

/** ---------- 输出 ---------- */

console.log('\n=== 链接检查 ===')
console.log(`  · 扫描页面：${htmlFiles.length}`)
console.log(`  · 检查链接：${linkCount}`)
console.log(`  · 检查资源：${assetCount}`)
console.log(`  · 建立内链关系：${inbound.size} 个目标页面`)
console.log(`  · 不同锚文本：${anchorTexts.size}`)

if (warnings.length) {
  console.log('\n--- 警告 ---')
  for (const w of [...new Set(warnings)].slice(0, 40)) console.log('  ! ' + w)
  if (warnings.length > 40) console.log(`  ! ……以及另外 ${warnings.length - 40} 条警告`)
}

if (errors.length) {
  console.error('\n--- 错误 ---')
  for (const e of [...new Set(errors)].slice(0, 60)) console.error('  x ' + e)
  const unique = [...new Set(errors)].length
  if (unique > 60) console.error(`  x ……以及另外 ${unique - 60} 条错误`)
  console.error(`\n[links] 失败：${unique} 项错误\n`)
  process.exit(1)
}

console.log('\n[links] 全部链接检查通过\n')
