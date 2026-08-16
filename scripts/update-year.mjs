#!/usr/bin/env node
/**
 * 年份检查与更新。
 *
 * 站内的年份统一由 docs/.vitepress/data/site.ts 中的 CURRENT_YEAR 在构建时生成，
 * 因此正常情况下不需要手动改任何文件。这个脚本用于：
 *   1. 扫描 Markdown 与配置中是否残留了写死的年份
 *   2. 使用 --fix 时，把写死的旧年份替换为当前年份
 *
 * 用法：
 *   node scripts/update-year.mjs          仅检查
 *   node scripts/update-year.mjs --fix    检查并替换
 */

import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const ROOT = path.resolve(__dirname, '..')
const DOCS = path.join(ROOT, 'docs')

const CURRENT_YEAR = new Date().getFullYear()
const FIX = process.argv.includes('--fix')

const SKIP_DIRS = new Set(['node_modules', 'dist', 'cache', '.git'])

/** 只关心「作为内容出现的年份」，日期字段（date/updated）由 frontmatter 管理，不在此处处理 */
const CONTENT_YEAR_RE = /(20\d{2})\s*年/g

function walk(dir, out = []) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (entry.name.startsWith('.') && entry.name !== '.vitepress') continue
    const full = path.join(dir, entry.name)
    if (entry.isDirectory()) {
      if (SKIP_DIRS.has(entry.name)) continue
      walk(full, out)
    } else if (/\.(md|ts|mts|vue|json)$/.test(entry.name)) {
      out.push(full)
    }
  }
  return out
}

const files = walk(DOCS)
const findings = []

for (const file of files) {
  const text = fs.readFileSync(file, 'utf-8')
  CONTENT_YEAR_RE.lastIndex = 0
  let m
  let updated = text
  let changed = false

  while ((m = CONTENT_YEAR_RE.exec(text))) {
    const year = Number(m[1])
    if (year === CURRENT_YEAR) continue
    findings.push({
      file: path.relative(ROOT, file).replace(/\\/g, '/'),
      found: m[0],
      year
    })
    if (FIX) {
      updated = updated.replace(m[0], `${CURRENT_YEAR}年`)
      changed = true
    }
  }

  if (changed) fs.writeFileSync(file, updated, 'utf-8')
}

console.log(`\n=== 年份检查（当前年份：${CURRENT_YEAR}）===`)

if (!findings.length) {
  console.log('  · 未发现写死的过期年份')
  console.log('  · 页脚与 Feed 的年份由 site.ts 的 CURRENT_YEAR 在构建时自动生成\n')
  process.exit(0)
}

console.log(`  · 发现 ${findings.length} 处与当前年份不一致的年份表述：`)
for (const f of findings.slice(0, 40)) {
  console.log(`    - ${f.file}：${f.found}`)
}
if (findings.length > 40) console.log(`    - ……以及另外 ${findings.length - 40} 处`)

if (FIX) {
  console.log(`\n  · 已全部替换为 ${CURRENT_YEAR} 年`)
} else {
  console.log('\n  · 如需自动替换，运行：node scripts/update-year.mjs --fix')
  console.log('  · 注意：历史记录中的年份属于事实陈述，替换前请人工确认')
}
console.log('')
