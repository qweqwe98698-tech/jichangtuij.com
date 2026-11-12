import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const ROOT = path.resolve(__dirname, '..')
const DOCS = path.join(ROOT, 'docs')
const BRANDS_DIR = path.join(DOCS, 'brands')
const PROVIDER_DATA_DIR = path.join(DOCS, '.vitepress', 'data', 'providers')
const PROVIDERS_JSON_PATH = path.join(ROOT, 'data', 'providers.json')

if (!fs.existsSync(PROVIDER_DATA_DIR)) {
  fs.mkdirSync(PROVIDER_DATA_DIR, { recursive: true })
}
if (!fs.existsSync(BRANDS_DIR)) {
  fs.mkdirSync(BRANDS_DIR, { recursive: true })
}

const rawText = fs.readFileSync('c:/Users/Pro User/Desktop/机场品牌信息/42家机场品牌清单.txt', 'utf-8')
const allLines = rawText.split(/\r?\n/)

// 1. Slugs & Image Assets
const SPEEDTEST_IMAGES = {
  guangsuyun: '/images/speedtest/guangsuyun-speedtest-2026-08-11.png',
  muguang: '/images/speedtest/muguang-speedtest-2026-08-11.png',
  weifeng: '/images/speedtest/weifeng-speedtest-2026-07-20.png',
  feimaoyun: '/images/speedtest/feimaoyun-speedtest-2026-08-11.png',
  xingdaomeng: '/images/speedtest/xingdaomeng-speedtest-2026-08-11.png',
  ermaoyun: '/images/speedtest/ermaoyun-speedtest-2026-08-11.png',
  wuyou: '/images/speedtest/wuyou-speedtest-01.jpg',
  weitu: '/images/speedtest/weituyun-speedtest-2026-08-11.png',
  yuzhouyun: '/images/speedtest/yuzhouyun-speedtest-2026-08-11.png',
  u1s1: '/images/speedtest/u1s1-speedtest-2026-08-11.png',
  lingmao: '/images/speedtest/lingmaowangluo-speedtest-2026-08-11.png',
  jilianyun: '/images/speedtest/jilianyun-speedtest-2026-08-11.png',
  guangnianti: '/images/speedtest/guangnianti-speedtest-2026-08-11.png',
  yifanyun: '/images/speedtest/yifanyun-speedtest-2026-08-11.png',
  sogoyun: '/images/speedtest/sogoyun-speedtest-2026-08-11.png',
  kexinyun: '/images/speedtest/kexinyun-speedtest-2026-08-11.png',
  sujie: '/images/speedtest/sujie-speedtest-2026-08-11.png',
  kuaili: '/images/speedtest/kuaili-speedtest-2026-08-11.png',
  quanqiuyun: '/images/speedtest/quanqiuyun-speedtest-2026-08-11.png'
}

const GUANGSUYUN_UNLOCK_IMAGES = [
  { path: '/images/unlock/guangsuyun-unlock-01.jpg', title: 'OpenAI / ChatGPT / Claude 权威解锁状态实测', desc: '测试涵盖 OpenAI API、ChatGPT 网页版与 Claude 3.5 Sonnet，亚洲主力节点全部实现原生解锁。' },
  { path: '/images/unlock/guangsuyun-unlock-02.jpg', title: '主流海外流媒体（Netflix / YouTube Premium / Disney+）解锁测试', desc: '4K 超高清码率视频即点即播，无阶梯缓冲，原生住宅 IP 出口支持全区流媒体。' },
  { path: '/images/unlock/guangsuyun-unlock-03.jpg', title: '香港与台湾枢纽节点低延迟与原生 IP 验证', desc: '香港平均延迟 22ms，台湾 41ms，支持大流量并发与低抖动游戏联机。' },
  { path: '/images/unlock/guangsuyun-unlock-04.jpg', title: '日本与新加坡核心节点晚高峰吞吐与抗封锁复测', desc: '单节点下行最高突破 500Mbps，专线物理管道保障晚高峰 0 丢包。' },
  { path: '/images/unlock/guangsuyun-unlock-05.jpg', title: '欧美长尾国家节点（美/法/德/英）全球互联覆盖测试', desc: '美国节点与欧洲节点均支持 AI 生产力工具与跨境电商合规访问。' }
]

// 2. Parse Part 1 (28 brands)
const p1Lines = allLines.slice(0, 964)
const p1Blocks = []
let cur1 = null

for (let i = 0; i < p1Lines.length; i++) {
  const line = p1Lines[i]
  const m = line.match(/^(?:主推)?##\s*(\d+)\.\s*([^\r\n（(]+)(?:[（(]([^）)]+)[）)])?/)
  if (m) {
    if (cur1) p1Blocks.push(cur1)
    cur1 = {
      order: parseInt(m[1]),
      name: m[2].trim(),
      slugHint: m[3] ? m[3].trim().toLowerCase() : '',
      lines: []
    }
  } else if (cur1) {
    cur1.lines.push(line)
  }
}
if (cur1) p1Blocks.push(cur1)

// 3. Parse Part 2 (14 brands)
const p2Lines = allLines.slice(964)
const targets = [
  'WgetCloud', '白月光', 'FlyingBird', 'CyberGuard', '龙猫云', 'FATCAT',
  'TNTCloud', '青云梯', '山水云', '灵动云', '浪网', 'EdgeNova', '萤火虫', 'sslar'
]

const p2Blocks = []
let cur2 = null
for (let i = 0; i < p2Lines.length; i++) {
  const line = p2Lines[i]
  const trimmed = line.trim().replace(/^##\s*/, '').replace(/^29\.\s*/, '')
  if (targets.includes(trimmed)) {
    if (cur2) p2Blocks.push(cur2)
    cur2 = {
      name: trimmed,
      lines: []
    }
  } else if (cur2) {
    cur2.lines.push(line)
  }
}
if (cur2) p2Blocks.push(cur2)

console.log(`Parsed ${p1Blocks.length} P1 brands and ${p2Blocks.length} P2 brands.`)

// Map Slugs
const SLUG_MAP = {
  '光速云': 'guangsuyun',
  '暮光加速': 'muguang',
  '飞猫云': 'feimaoyun',
  '微风网络': 'weifeng',
  '大佬云': 'dalaoyun',
  '星岛梦': 'xingdaomeng',
  '二猫云': 'ermaoyun',
  '无忧链接': 'wuyou',
  '唯兔云': 'weitu',
  'Firefly': 'firefly',
  '宇宙云': 'yuzhouyun',
  'U1S1': 'u1s1',
  '灵猫网络': 'lingmao',
  '极连云': 'jilianyun',
  '光年梯': 'guangnianti',
  '一翻云': 'yifanyun',
  'SOGO 云': 'sogoyun',
  '可信云': 'kexinyun',
  '速界': 'sujie',
  '闪跃': 'shanyue',
  '全球云': 'quanqiuyun',
  '闪电鼠': 'shandianshu',
  '云界线': 'yunjiexian',
  '榴莲云': 'liulianyun',
  '神行加速': 'shenxing',
  '环球梯': 'huanqiuti',
  '隐形人': 'yinxingren',
  '梯子云': 'tiziyun',
  'WgetCloud': 'wgetcloud',
  '白月光': 'baiyueguang',
  'FlyingBird': 'flyingbird',
  'CyberGuard': 'cyberguard',
  '龙猫云': 'longmaoyun',
  'FATCAT': 'fatcat',
  'TNTCloud': 'tntcloud',
  '青云梯': 'qingyunti',
  '山水云': 'shanshuiyun',
  '灵动云': 'lingdongyun',
  '浪网': 'langwang',
  'EdgeNova': 'edgenova',
  '萤火虫': 'yinghuochong',
  'sslar': 'sslar'
}

export { p1Blocks, p2Blocks, SLUG_MAP, SPEEDTEST_IMAGES, GUANGSUYUN_UNLOCK_IMAGES }
