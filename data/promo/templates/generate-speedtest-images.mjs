/**
 * 品牌测速图生成器（内部工具）。
 * 数据来源：data/promo/test-records/*-speedtest-raw.md（2026-08-03 晚高峰 · 香港 10G 测试机 · 站长实测）。
 * 输出：docs/public/images/jichangcloud-speedtest-<id>-2026-08.svg
 * 用法：node data/promo/templates/generate-speedtest-images.mjs
 */
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const OUT_DIR = path.resolve(__dirname, '../../../docs/public/images')

const TEST_DATE = '2026-08-03 晚高峰'
const ENV_LINE = '工具：MiaoKo 订阅测速（50 节点全量）｜测试机：香港 · 10G 端口｜本站实测'
const BAR_MAX = 620 // MB/s，五家统一刻度，保证横向可比

const CAVEAT_1 = '说明：速度为香港 10G 测试机视角，家庭宽带用户以本地带宽为上限；延迟为测试机经完整链路的握手耗时（TLS RTT），'
const CAVEAT_2 = '与大陆家宽视角不同。完整 50 节点数据与异常节点记录见站内测试档案；结论仅代表本次测试时点。'

const brands = [
  {
    id: 'guangsuyun',
    name: '光速云',
    rows: [
      ['g', '香港 HKG-04', 104, 554.6],
      ['g', '香港 HKG-12', 106, 547.2],
      ['g', '新加坡 SIN-03', 109, 460.5],
      ['g', '日本 TYO-05', 155, 198.3],
      ['y', '台湾 TPE-03', 139, 80.3],
      ['y', '美国 LAX-02', 245, 18.1]
    ],
    summary: '汇总：50 节点全量 ｜ 香港区典型 390–555 MB/s ｜ 异常 2 节点：新加坡SIN-01（KB 级）、日本TYO-09（高延迟）'
  },
  {
    id: 'feimaoyun',
    name: '飞猫云',
    rows: [
      ['g', '香港05', 97, 546.2],
      ['g', '香港01', 99, 540.8],
      ['g', '新加坡06', 84, 401.3],
      ['g', '日本04', 144, 258.0],
      ['y', '台湾04', 204, 103.0],
      ['y', '美国03', 247, 21.0]
    ],
    summary: '汇总：50 节点全量 ｜ 新加坡区延迟全场最低（78–96ms）｜ 异常 2 节点：台湾02（不可用）、日本05（KB 级）'
  },
  {
    id: 'lingmao',
    name: '灵猫网络',
    rows: [
      ['g', '香港 Hong Kong05', 104, 546.0],
      ['g', '香港 Hong Kong06', 108, 544.0],
      ['g', '新加坡 Singapore06', 105, 435.0],
      ['g', '日本 Japan05', 134, 189.7],
      ['y', '台湾 Taiwan01', 135, 76.9],
      ['y', '美国 United States04', 245, 13.9]
    ],
    summary: '汇总：50 节点全量 ｜ 香港区 503–551 MB/s ｜ 异常：Taiwan05 延迟 391ms、1 节点 KB 级速度'
  },
  {
    id: 'xingdaomeng',
    name: '星岛梦',
    rows: [
      ['g', '香港 Cloud-01', 113, 529.8],
      ['g', '新加坡 Cloud-01', 97, 239.8],
      ['g', '新加坡 Cloud-07', 97, 214.1],
      ['g', '日本 Cloud-03', 139, 107.4],
      ['y', '台湾 Cloud-01', 179, 78.2],
      ['y', '美国 Cloud-06', 252, 11.4]
    ],
    summary: '汇总：50 节点全量 ｜ 香港区 490–547 MB/s ｜ 弱项：台湾 Cloud-04（18.7 MB/s）、美国区 7.7–13 MB/s'
  },
  {
    id: 'weituyun',
    name: '唯兔云',
    rows: [
      ['g', '香港HK02', 100, 516.3],
      ['g', '香港HK08', 97, 502.1],
      ['g', '新加坡SG05', 95, 339.0],
      ['g', '日本JPN02', 137, 169.9],
      ['y', '台湾TWN05', 173, 84.8],
      ['y', '美国US02', 245, 12.3]
    ],
    summary: '汇总：50 节点全量 ｜ 香港区 434–548 MB/s ｜ 异常 2 节点：台湾TWN03（不可用）、台湾TWN01（偏弱）'
  }
]

const esc = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')

function renderBrand(b) {
  const rowsSvg = b.rows
    .map((row, i) => {
      const [tone, node, rtt, speed] = row
      const y = 152 + i * 62
      const dot = tone === 'g' ? '#00e676' : '#ffd54f'
      const barFill = tone === 'g' ? '#00e676' : '#ffd54f'
      const w = Math.max(6, Math.round((speed / BAR_MAX) * 784))
      return `
  <circle cx="58" cy="${y - 5}" r="5" fill="${dot}"/>
  <text class="t" x="76" y="${y}">${esc(node)}</text>
  <text class="s" x="420" y="${y}">握手延迟：${rtt}ms</text>
  <text class="s" x="600" y="${y}">平均：${speed.toFixed(1)} MB/s</text>
  <rect x="48" y="${y + 12}" width="784" height="10" rx="5" fill="#3c3c3c"/>
  <rect x="48" y="${y + 12}" width="${w}" height="10" rx="5" fill="${barFill}"/>`
    })
    .join('\n')

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 880 600" width="880" height="600" role="img" aria-labelledby="spdT-${b.id} spdD-${b.id}">
  <title id="spdT-${b.id}">${esc(b.name)}测速报告（${TEST_DATE}，香港 10G 测试机，本站实测）</title>
  <desc id="spdD-${b.id}">深色测速报告：${esc(b.name)}订阅 50 节点全量测试中六个代表性节点的握手延迟与平均速度，附条形图。${esc(b.summary)}。速度为香港 10G 测试机视角，家庭宽带用户以本地带宽为上限；延迟为完整链路握手耗时，与大陆家宽视角不同。</desc>
  <style>
    .t{font-family:"Cascadia Code","Microsoft YaHei",monospace;font-size:15px;font-weight:700;fill:#e8e8e8}
    .s{font-family:"Cascadia Code","Microsoft YaHei",monospace;font-size:12.5px;fill:#9da5b4}
    .sm{font-family:"Microsoft YaHei",sans-serif;font-size:11px;fill:#7a828e}
    .wm{font-family:"Microsoft YaHei",sans-serif;font-size:12px;fill:#ffffff;opacity:0.3}
  </style>
  <rect x="0" y="0" width="880" height="600" fill="#1e1e1e"/>
  <rect x="24" y="24" width="832" height="552" rx="10" fill="#252526" stroke="#3c3c3c" stroke-width="1"/>
  <text class="t" x="48" y="64">🌐 ${esc(b.name)} 测速报告 · ${TEST_DATE}</text>
  <line x1="48" y1="80" x2="832" y2="80" stroke="#3c3c3c"/>
  <text class="s" x="48" y="104">${esc(ENV_LINE)}</text>
  <line x1="48" y1="120" x2="832" y2="120" stroke="#3c3c3c"/>
${rowsSvg}
  <line x1="48" y1="500" x2="832" y2="500" stroke="#3c3c3c"/>
  <text class="s" x="48" y="524">${esc(b.summary)}</text>
  <text class="sm" x="48" y="546">${esc(CAVEAT_1)}</text>
  <text class="sm" x="48" y="562">${esc(CAVEAT_2)}</text>
  <text class="wm" x="716" y="546">jichangcloud.com</text>
</svg>
`
}

for (const b of brands) {
  const file = path.join(OUT_DIR, `jichangcloud-speedtest-${b.id}-2026-08.svg`)
  fs.writeFileSync(file, renderBrand(b))
  console.log('written', path.basename(file))
}
