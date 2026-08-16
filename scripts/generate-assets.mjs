#!/usr/bin/env node
/**
 * 生成位图品牌资产：apple-touch-icon.png、favicon.ico、og/default-og.webp
 *
 * 这是一次性资产生成脚本，产物已经提交到仓库，正常构建与部署不需要执行它。
 * 只有在修改 LOGO 或 OG 模板后才需要重新运行：
 *
 *     npm install --no-save sharp
 *     node scripts/generate-assets.mjs
 *
 * 之所以不把 sharp 放进 devDependencies，是为了让 Cloudflare Pages 与
 * 传统主机的安装过程保持轻量，不引入原生依赖带来的构建风险。
 */

import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const ROOT = path.resolve(__dirname, '..')
const PUBLIC_DIR = path.join(ROOT, 'docs', 'public')

let sharp
try {
  sharp = (await import('sharp')).default
} catch {
  console.error(
    '[assets] 未找到 sharp。请先运行：npm install --no-save sharp\n' +
      '         仓库中已包含生成好的位图资产，只有修改 LOGO 后才需要重新生成。'
  )
  process.exit(1)
}

const faviconSvg = fs.readFileSync(path.join(PUBLIC_DIR, 'favicon.svg'))

/** ---------- apple-touch-icon.png (180x180) ---------- */
await sharp(faviconSvg, { density: 400 })
  .resize(180, 180)
  .flatten({ background: '#246bfd' })
  .png({ compressionLevel: 9 })
  .toFile(path.join(PUBLIC_DIR, 'apple-touch-icon.png'))
console.log('[assets] apple-touch-icon.png')

/** ---------- favicon.ico (16 / 32 / 48，PNG 压缩条目) ---------- */
const sizes = [16, 32, 48]
const pngs = []
for (const size of sizes) {
  pngs.push(
    await sharp(faviconSvg, { density: 512 })
      .resize(size, size)
      .png({ compressionLevel: 9 })
      .toBuffer()
  )
}

const header = Buffer.alloc(6)
header.writeUInt16LE(0, 0) // reserved
header.writeUInt16LE(1, 2) // type: icon
header.writeUInt16LE(sizes.length, 4)

const entries = []
let offset = 6 + sizes.length * 16
sizes.forEach((size, i) => {
  const entry = Buffer.alloc(16)
  entry.writeUInt8(size === 256 ? 0 : size, 0)
  entry.writeUInt8(size === 256 ? 0 : size, 1)
  entry.writeUInt8(0, 2) // palette
  entry.writeUInt8(0, 3) // reserved
  entry.writeUInt16LE(1, 4) // color planes
  entry.writeUInt16LE(32, 6) // bits per pixel
  entry.writeUInt32LE(pngs[i].length, 8)
  entry.writeUInt32LE(offset, 12)
  offset += pngs[i].length
  entries.push(entry)
})

fs.writeFileSync(
  path.join(PUBLIC_DIR, 'favicon.ico'),
  Buffer.concat([header, ...entries, ...pngs])
)
console.log('[assets] favicon.ico')

/** ---------- og/default-og.webp (1200x630) ---------- */
const ogSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#fbfdff"/>
      <stop offset="55%" stop-color="#f2f7ff"/>
      <stop offset="100%" stop-color="#e8f1ff"/>
    </linearGradient>
    <radialGradient id="halo1" cx="0.5" cy="0.5" r="0.5">
      <stop offset="0%" stop-color="#8dc8ff" stop-opacity="0.55"/>
      <stop offset="100%" stop-color="#8dc8ff" stop-opacity="0"/>
    </radialGradient>
    <radialGradient id="halo2" cx="0.5" cy="0.5" r="0.5">
      <stop offset="0%" stop-color="#21c3d6" stop-opacity="0.4"/>
      <stop offset="100%" stop-color="#21c3d6" stop-opacity="0"/>
    </radialGradient>
    <linearGradient id="ring" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#21c3d6"/>
      <stop offset="100%" stop-color="#246bfd"/>
    </linearGradient>
    <linearGradient id="cloud" x1="0.1" y1="0" x2="0.9" y2="1">
      <stop offset="0%" stop-color="#246bfd"/>
      <stop offset="100%" stop-color="#164ec5"/>
    </linearGradient>
    <linearGradient id="flow" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0%" stop-color="#246bfd" stop-opacity="0.15"/>
      <stop offset="50%" stop-color="#21c3d6" stop-opacity="0.9"/>
      <stop offset="100%" stop-color="#246bfd" stop-opacity="0.15"/>
    </linearGradient>
  </defs>

  <rect width="1200" height="630" fill="url(#bg)"/>
  <ellipse cx="180" cy="90" rx="420" ry="300" fill="url(#halo1)"/>
  <ellipse cx="1060" cy="120" rx="380" ry="280" fill="url(#halo2)"/>

  <g opacity="0.5">
    ${Array.from({ length: 12 }, (_, i) => `<path d="M0 ${i * 56 + 28}H1200" stroke="#1a4570" stroke-opacity="0.05" stroke-width="1"/>`).join('')}
    ${Array.from({ length: 22 }, (_, i) => `<path d="M${i * 56 + 28} 0V630" stroke="#1a4570" stroke-opacity="0.05" stroke-width="1"/>`).join('')}
  </g>

  <g transform="translate(96 92) scale(1.55)">
    <path d="M47.5 12.8A24 24 0 1 0 47.5 51.2" fill="none" stroke="url(#ring)" stroke-width="4.6" stroke-linecap="round" opacity="0.5"/>
    <path d="M23.4 41.6a8.6 8.6 0 0 1-.7-17.1 11.6 11.6 0 0 1 21.6-3.4 8.9 8.9 0 0 1 1 20.5h-8.5v6.2a6.4 6.4 0 0 1-11.4 4l-.3-.4" fill="none" stroke="url(#cloud)" stroke-width="4.2" stroke-linecap="round" stroke-linejoin="round"/>
    <circle cx="24.6" cy="30.4" r="2.9" fill="#246bfd"/>
    <circle cx="33.2" cy="24.6" r="2.9" fill="#21c3d6"/>
    <circle cx="41.6" cy="31.6" r="2.9" fill="#246bfd"/>
  </g>

  <text x="212" y="152" font-family="Microsoft YaHei, PingFang SC, Noto Sans CJK SC, sans-serif" font-size="44" font-weight="700" fill="#10233c" letter-spacing="3">机场云</text>
  <text x="214" y="190" font-family="Segoe UI, Inter, Arial, sans-serif" font-size="20" font-weight="600" fill="#7e8da1" letter-spacing="7">JICHANGCLOUD</text>

  <text x="96" y="316" font-family="Microsoft YaHei, PingFang SC, Noto Sans CJK SC, sans-serif" font-size="62" font-weight="700" fill="#10233c">把复杂线路讲明白</text>
  <text x="96" y="398" font-family="Microsoft YaHei, PingFang SC, Noto Sans CJK SC, sans-serif" font-size="62" font-weight="700" fill="#164ec5">帮你选择真正适合的机场</text>

  <text x="96" y="466" font-family="Microsoft YaHei, PingFang SC, Noto Sans CJK SC, sans-serif" font-size="26" fill="#50627a">机场推荐 · 线路解析 · 客户端教程 · 避坑预警</text>

  <g transform="translate(96 516)">
    <path d="M0 40 C 140 40, 160 6, 300 6 S 500 40, 640 40" fill="none" stroke="#1a4570" stroke-opacity="0.15" stroke-width="2"/>
    <path d="M0 40 C 140 40, 160 6, 300 6 S 500 40, 640 40" fill="none" stroke="url(#flow)" stroke-width="3" stroke-linecap="round" stroke-dasharray="10 14"/>
    <circle cx="0" cy="40" r="7" fill="#ffffff" stroke="#246bfd" stroke-width="3"/>
    <circle cx="300" cy="6" r="7" fill="#ffffff" stroke="#21c3d6" stroke-width="3"/>
    <circle cx="640" cy="40" r="7" fill="#ffffff" stroke="#246bfd" stroke-width="3"/>
  </g>

  <text x="1104" y="576" text-anchor="end" font-family="Segoe UI, Inter, Arial, sans-serif" font-size="24" font-weight="600" fill="#7e8da1">jichangcloud.com</text>
</svg>`

fs.mkdirSync(path.join(PUBLIC_DIR, 'og'), { recursive: true })

await sharp(Buffer.from(ogSvg), { density: 144 })
  .resize(1200, 630)
  .webp({ quality: 88 })
  .toFile(path.join(PUBLIC_DIR, 'og', 'default-og.webp'))
console.log('[assets] og/default-og.webp')

// 同时导出一张 PNG 备份，方便不支持 WebP 的分享平台手动替换
await sharp(Buffer.from(ogSvg), { density: 144 })
  .resize(1200, 630)
  .png({ compressionLevel: 9 })
  .toFile(path.join(PUBLIC_DIR, 'og', 'default-og.png'))
console.log('[assets] og/default-og.png')

console.log('[assets] 全部位图资产生成完成')
