/**
 * IndexNow 主动推送脚本 (适用于 Bing、Yandex、Naver 等支持 IndexNow 的搜索引擎)
 * 读取 sitemap.xml 中的所有规范 URL 并批量提交
 */
import fs from 'fs'
import path from 'path'
import https from 'https'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const ROOT_DIR = path.resolve(__dirname, '..')
const DIST_DIR = path.join(ROOT_DIR, 'docs/.vitepress/dist')
const SITEMAP_PATH = path.join(DIST_DIR, 'sitemap.xml')

const HOST = 'jichangtuij.com'
const KEY = '1d24090832404c3bae3799acec195451'
const KEY_LOCATION = `https://${HOST}/${KEY}.txt`

if (!fs.existsSync(SITEMAP_PATH)) {
  console.error('未找到 sitemap.xml，请先执行 npm run build')
  process.exit(1)
}

const sitemapContent = fs.readFileSync(SITEMAP_PATH, 'utf-8')
const urlMatches = sitemapContent.match(/<loc>(https:\/\/[^<]+)<\/loc>/g) || []
const urlList = urlMatches.map((m) => m.replace(/<\/?loc>/g, ''))

console.log(`=== IndexNow 准备推送 ${urlList.length} 个规范 URL 至 IndexNow API ===`)

const payload = JSON.stringify({
  host: HOST,
  key: KEY,
  keyLocation: KEY_LOCATION,
  urlList
})

const options = {
  hostname: 'api.indexnow.org',
  port: 443,
  path: '/indexnow',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json; charset=utf-8',
    'Content-Length': Buffer.byteLength(payload)
  }
}

const req = https.request(options, (res) => {
  console.log(`IndexNow API 响应状态码: ${res.statusCode} (${res.statusMessage})`)
  if (res.statusCode === 200 || res.statusCode === 202) {
    console.log('✓ IndexNow 批量推送成功！Bing 将优先安排抓取与发现。')
  } else {
    console.log(`! IndexNow 返回非 200 响应: ${res.statusCode}`)
  }
})

req.on('error', (e) => {
  console.log(`IndexNow 网络请求提示: ${e.message} (离线或本地环境属正常现象)`)
})

req.write(payload)
req.end()
