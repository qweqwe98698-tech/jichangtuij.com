#!/usr/bin/env node
/**
 * 把构建产物打包成 jichangcloud-cloudflare-upload.zip
 *
 * 要求：
 *   - 压缩包根目录直接是 index.html / 404.html / assets/ / pagefind/ 等
 *   - 不额外套一层目录
 *   - 包含 .htaccess、_headers、_redirects 等以点或下划线开头的文件
 *
 * 使用 Node 内置 zlib 实现最小可用的 ZIP 写入，不引入任何第三方依赖，
 * 因此在 Windows、macOS、Linux 与 CI 环境下行为一致。
 */

import fs from 'node:fs'
import path from 'node:path'
import zlib from 'node:zlib'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const ROOT = path.resolve(__dirname, '..')
const DIST = path.join(ROOT, 'docs', '.vitepress', 'dist')
const OUT = path.join(ROOT, 'jichangcloud-cloudflare-upload.zip')

if (!fs.existsSync(DIST)) {
  console.error('[zip] 构建目录不存在，请先运行 npm run build')
  process.exit(1)
}

/** ---------- CRC32 ---------- */

const CRC_TABLE = (() => {
  const table = new Uint32Array(256)
  for (let i = 0; i < 256; i++) {
    let c = i
    for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1
    table[i] = c >>> 0
  }
  return table
})()

function crc32(buf) {
  let c = 0xffffffff
  for (let i = 0; i < buf.length; i++) c = CRC_TABLE[(c ^ buf[i]) & 0xff] ^ (c >>> 8)
  return (c ^ 0xffffffff) >>> 0
}

/** ---------- DOS 时间戳 ---------- */

function dosTime(date) {
  const time =
    (date.getHours() << 11) | (date.getMinutes() << 5) | (Math.floor(date.getSeconds() / 2) & 0x1f)
  const day =
    ((date.getFullYear() - 1980) << 9) | ((date.getMonth() + 1) << 5) | date.getDate()
  return { time: time & 0xffff, date: day & 0xffff }
}

/** ---------- 收集文件 ---------- */

function walk(dir, base = '', out = []) {
  const entries = fs.readdirSync(dir, { withFileTypes: true }).sort((a, b) =>
    a.name.localeCompare(b.name)
  )
  for (const entry of entries) {
    const full = path.join(dir, entry.name)
    const relPath = base ? `${base}/${entry.name}` : entry.name
    if (entry.isDirectory()) walk(full, relPath, out)
    else if (entry.isFile()) out.push({ full, relPath })
  }
  return out
}

const files = walk(DIST)
if (files.length === 0) {
  console.error('[zip] 构建目录为空')
  process.exit(1)
}

/** ---------- 写入 ZIP ---------- */

const localParts = []
const centralParts = []
let offset = 0
let totalRaw = 0

for (const file of files) {
  const data = fs.readFileSync(file.full)
  const stat = fs.statSync(file.full)
  const nameBuf = Buffer.from(file.relPath, 'utf-8')
  const crc = crc32(data)
  const { time, date } = dosTime(stat.mtime)

  // 已压缩的二进制格式不再重复压缩，避免体积反而变大
  const skipDeflate = /\.(webp|png|jpg|jpeg|gif|ico|woff2?|zip|gz|br)$/i.test(file.relPath)
  const compressed = skipDeflate ? data : zlib.deflateRawSync(data, { level: 9 })
  const useDeflate = !skipDeflate && compressed.length < data.length
  const payload = useDeflate ? compressed : data
  const method = useDeflate ? 8 : 0

  totalRaw += data.length

  // 通用标志位第 11 位：文件名使用 UTF-8
  const flags = 0x0800

  const local = Buffer.alloc(30)
  local.writeUInt32LE(0x04034b50, 0)
  local.writeUInt16LE(20, 4) // version needed
  local.writeUInt16LE(flags, 6)
  local.writeUInt16LE(method, 8)
  local.writeUInt16LE(time, 10)
  local.writeUInt16LE(date, 12)
  local.writeUInt32LE(crc, 14)
  local.writeUInt32LE(payload.length, 18)
  local.writeUInt32LE(data.length, 22)
  local.writeUInt16LE(nameBuf.length, 26)
  local.writeUInt16LE(0, 28)

  localParts.push(local, nameBuf, payload)

  const central = Buffer.alloc(46)
  central.writeUInt32LE(0x02014b50, 0)
  central.writeUInt16LE(0x031e, 4) // version made by (UNIX)
  central.writeUInt16LE(20, 6)
  central.writeUInt16LE(flags, 8)
  central.writeUInt16LE(method, 10)
  central.writeUInt16LE(time, 12)
  central.writeUInt16LE(date, 14)
  central.writeUInt32LE(crc, 16)
  central.writeUInt32LE(payload.length, 20)
  central.writeUInt32LE(data.length, 24)
  central.writeUInt16LE(nameBuf.length, 28)
  central.writeUInt16LE(0, 30) // extra
  central.writeUInt16LE(0, 32) // comment
  central.writeUInt16LE(0, 34) // disk
  central.writeUInt16LE(0, 36) // internal attrs
  // 外部属性：UNIX 权限 0644 放在高 16 位；左移后需转成无符号数
  central.writeUInt32LE(((0o100644 << 16) >>> 0), 38)
  central.writeUInt32LE(offset, 42)

  centralParts.push(central, nameBuf)

  offset += local.length + nameBuf.length + payload.length
}

const centralBuf = Buffer.concat(centralParts)
const eocd = Buffer.alloc(22)
eocd.writeUInt32LE(0x06054b50, 0)
eocd.writeUInt16LE(0, 4)
eocd.writeUInt16LE(0, 6)
eocd.writeUInt16LE(files.length, 8)
eocd.writeUInt16LE(files.length, 10)
eocd.writeUInt32LE(centralBuf.length, 12)
eocd.writeUInt32LE(offset, 16)
eocd.writeUInt16LE(0, 20)

fs.writeFileSync(OUT, Buffer.concat([...localParts, centralBuf, eocd]))

/** ---------- 校验根目录结构 ---------- */

const roots = new Set(files.map((f) => f.relPath.split('/')[0]))
const expected = ['index.html', '404.html', 'assets', 'pagefind', 'robots.txt', 'sitemap.xml', '_headers', '_redirects']
const missing = expected.filter((e) => !roots.has(e))

const zipSize = fs.statSync(OUT).size

console.log('\n=== 打包完成 ===')
console.log(`  · 输出文件：${path.relative(ROOT, OUT).replace(/\\/g, '/')}`)
console.log(`  · 文件数量：${files.length}`)
console.log(`  · 原始体积：${(totalRaw / 1024 / 1024).toFixed(2)} MB`)
console.log(`  · 压缩体积：${(zipSize / 1024 / 1024).toFixed(2)} MB`)
console.log(`  · 根目录条目：${[...roots].sort().join(', ')}`)

if (missing.length) {
  console.error(`\n[zip] 压缩包根目录缺少：${missing.join(', ')}`)
  process.exit(1)
}

console.log('\n[zip] 压缩包根目录结构正确，可直接用于 Cloudflare Pages Direct Upload\n')
