import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const ROOT = path.resolve(__dirname, '..')
const PROVIDERS_DIR = path.join(ROOT, 'docs', '.vitepress', 'data', 'providers')
const PROVIDERS_JSON_PATH = path.join(ROOT, 'data', 'providers.json')

if (!fs.existsSync(PROVIDERS_DIR)) {
  fs.mkdirSync(PROVIDERS_DIR, { recursive: true })
}

const BRANDS = [
  {
    slug: 'guangsuyun',
    name: '光速云',
    vendor: {
      entryPrice: '17元/月',
      traffic: '110GB/月',
      protocols: ['VLESS', 'Shadowsocks'],
      lines: ['IEPL 专线'],
      nodeCount: '50+',
      customClients: ['Windows', 'macOS', 'Android'],
      thirdPartySupport: true,
      thirdPartyNote: '支持 Clash、Shadowrocket 等第三方客户端，可联系在线客服获取订阅导入方式',
      aiClaim: '品牌资料显示支持常见 AI 工具（ChatGPT / Claude）访问',
      streamingClaim: '品牌资料显示支持主流海外流媒体（Netflix / YouTube 4K）解锁',
      establishedYear: 2020
    },
    measured: {
      hasSpeedtest: true,
      testDate: '2026-08-11',
      testTime: '白天/晚高峰',
      screenshotPath: '/images/speedtest/guangsuyun-speedtest-2026-08-11.png',
      speedtestProtocol: 'Shadowsocks / VLESS',
      testTool: '珠海联通 5Gbps / 32 线程测速',
      status: 'Measured',
      aiUnlockTested: false,
      streamingUnlockTested: false,
      disclaimer: '本次结果仅代表 2026-08-11 截图所示时间点和测试环境，不代表长期表现或所有用户体验。'
    },
    commercial: {
      promoCode: 'AMM',
      discountDesc: '新人注册 8 折',
      affLink: 'https://sahude.gsyvipaff.com/#/?code=keqgvT5Y',
      hasHashLink: true,
      paymentMethods: ['支付宝', '微信', 'USDT'],
      isSponsored: true
    },
    editorial: {
      oneSentenceTagline: '老牌综合型 / IEPL 专线 / VLESS 协议 / AI 与流媒体品牌声明',
      positioning: '老牌综合型 / IEPL / VLESS / AI 与流媒体',
      targetAudience: [
        '注重晚高峰稳定性的日常办公用户',
        '需要 AI 工具访问与海外流媒体使用的综合用户',
        '偏好运营时间较长、节点覆盖广泛的老牌服务商'
      ],
      notRecommendedFor: [
        '寻找 10 元以下超低预算套餐的用户',
        '仅偶尔轻量使用且不想月付 17 元的用户'
      ],
      pros: [
        '2020 年开业，运营时间长，线路调度较成熟',
        '主打企业级 IEPL 内网专线与 VLESS 协议',
        '月付 17 元提供 110GB 流量，规格均衡，支持自研与第三方客户端'
      ],
      cons: [
        'AI 与流媒体能力当前属于品牌声明，未做独立自动化连续检测',
        '第三方订阅导入需通过在线客服指引获取'
      ],
      priceSegment: '17',
      lastVerified: '2026-08-16'
    }
  },
  {
    slug: 'xingdaomeng',
    name: '星岛梦',
    vendor: {
      entryPrice: '约8元/月 (年付折算)',
      traffic: '60GB/月',
      protocols: ['Shadowsocks'],
      lines: ['企业级内网专线'],
      nodeCount: '40+',
      customClients: ['Windows', 'Android'],
      thirdPartySupport: true,
      thirdPartyNote: '支持第三方客户端订阅导入，具体方式可咨询官方客服',
      aiClaim: '品牌资料标注支持日常跨境与基础 AI 浏览',
      streamingClaim: '支持常见海外流媒体基础播放',
      establishedYear: 2020
    },
    measured: {
      hasSpeedtest: true,
      testDate: '2026-08-11',
      testTime: '白天时段',
      screenshotPath: '/images/speedtest/xingdaomeng-speedtest-2026-08-11.png',
      speedtestProtocol: 'Shadowsocks',
      testTool: '珠海联通 5Gbps / 32 线程测速',
      status: 'Measured',
      aiUnlockTested: false,
      streamingUnlockTested: false,
      disclaimer: '本次结果仅代表 2026-08-11 截图所示时间点和测试环境，不代表长期表现或所有用户体验。'
    },
    commercial: {
      promoCode: 'nmw888',
      discountDesc: '新人注册 9 折',
      affLink: 'https://guangs.xingdaomeng.com/#/?code=1TynBYnR',
      hasHashLink: true,
      paymentMethods: ['支付宝', '微信', 'USDT'],
      isSponsored: true
    },
    editorial: {
      oneSentenceTagline: '低价年付 / 套餐丰富 / 不限时套餐 / 轻量备用方案',
      positioning: '低价年付 / 套餐丰富 / 不限时套餐',
      targetAudience: [
        '预算有限、日常流量需求在 60GB 以内的小流量用户',
        '希望购买不限时流量包作为长期备用线路的用户',
        '能够接受年付付款周期的个人轻度用户'
      ],
      notRecommendedFor: [
        '仅愿意按月支付（不接受年付预付）的用户',
        '每月需要大流量下载或高频 4K 视频的用户'
      ],
      pros: [
        '年付折算低至约 8 元/月，长期持有成本极低',
        '提供不限时套餐选项，适合作为备用防失联',
        '运营时间较长（2020开业），支持支付宝/微信支付'
      ],
      cons: [
        '8 元/月属于年付折算单价，不应与常规月付直接横比',
        '单月 60GB 流量较小，不适合重度多设备家庭共享'
      ],
      priceSegment: '8',
      lastVerified: '2026-08-16'
    }
  },
  {
    slug: 'lingmao',
    name: '灵猫网络',
    vendor: {
      entryPrice: '19元/月',
      traffic: '150GB/月',
      protocols: ['Shadowsocks'],
      lines: ['企业级内网专线'],
      nodeCount: '45+',
      customClients: ['Windows', 'Android', 'macOS'],
      thirdPartySupport: true,
      thirdPartyNote: '支持订阅导入，具体方式可咨询在线客服',
      aiClaim: '品牌资料显示支持常见 AI 工具',
      streamingClaim: '品牌资料显示支持常见流媒体访问',
      establishedYear: 2024
    },
    measured: {
      hasSpeedtest: true,
      testDate: '2026-08-11',
      testTime: '白天时段',
      screenshotPath: '/images/speedtest/lingmaowangluo-speedtest-2026-08-11.png',
      speedtestProtocol: 'Shadowsocks',
      testTool: '珠海联通 5Gbps / 32 线程测速',
      status: 'Measured',
      aiUnlockTested: false,
      streamingUnlockTested: false,
      disclaimer: '本次结果仅代表 2026-08-11 截图所示时间点和测试环境，不代表长期表现或所有用户体验。'
    },
    commercial: {
      promoCode: 'lmao888',
      discountDesc: '新人注册 9 折',
      affLink: 'https://vip01.civetnet.com/#/?code=8MIAyxak',
      hasHashLink: true,
      paymentMethods: ['支付宝', '微信', 'USDT'],
      isSponsored: true
    },
    editorial: {
      oneSentenceTagline: '月付大流量 / 150GB / 企业级专线 / 套餐种类丰富',
      positioning: '月付大流量 / 150GB / 套餐种类丰富',
      targetAudience: [
        '希望使用月付套餐、不想一次性预付长期费用的用户',
        '每月流量需求较高（约 150GB）的视频与日常重度浏览用户',
        '需要多设备同时接入的中高频个人用户'
      ],
      notRecommendedFor: [
        '极低预算轻度用户（每月只用 20-30GB）',
        '追求 10 元以下廉价套餐的用户'
      ],
      pros: [
        '19 元/月即可获得 150GB 大流量，月付单价流量比极佳',
        '采用企业级专线线路，同时提供不限时套餐方案',
        '支持支付宝/微信/USDT 多种支付方式'
      ],
      cons: [
        '2024 年新开业，运营历史相较 2020 年品牌稍短',
        'AI 与流媒体解锁能力以官方声明为主，建议结合节点实际测试'
      ],
      priceSegment: '19',
      lastVerified: '2026-08-16'
    }
  },
  {
    slug: 'feimaoyun',
    name: '飞猫云',
    vendor: {
      entryPrice: '约7元/月 (年付折算)',
      traffic: '50GB/月',
      protocols: ['Shadowsocks'],
      lines: ['IEPL 专线'],
      nodeCount: '35+',
      customClients: ['Windows', 'Android', 'macOS'],
      thirdPartySupport: true,
      thirdPartyNote: '支持第三方客户端，订阅导入方式需咨询客服',
      aiClaim: '品牌资料显示覆盖常见 AI 工具使用场景',
      streamingClaim: '品牌资料显示覆盖主流海外流媒体',
      establishedYear: 2023
    },
    measured: {
      hasSpeedtest: true,
      testDate: '2026-08-11',
      testTime: '晚高峰时段',
      screenshotPath: '/images/speedtest/feimaoyun-speedtest-2026-08-11.png',
      speedtestProtocol: 'Shadowsocks',
      testTool: '珠海联通 5Gbps / 32 线程测速',
      status: 'Measured',
      aiUnlockTested: false,
      streamingUnlockTested: false,
      disclaimer: '本次结果仅代表 2026-08-11 截图所示时间点和测试环境，不代表长期表现或所有用户体验。'
    },
    commercial: {
      promoCode: 'flycat888',
      discountDesc: '新用户季付及以上 8 折',
      affLink: 'https://guangs.flycataff.com/#/?code=6uq0Xe9y',
      hasHashLink: true,
      paymentMethods: ['支付宝', '微信', 'USDT'],
      isSponsored: true
    },
    editorial: {
      oneSentenceTagline: '低价小流量 / 年付折算约7元 / IEPL 专线 / 轻度用户首选',
      positioning: '低价小流量 / 年付 / IEPL / 轻度用户',
      targetAudience: [
        '日常流量消耗较小（每月约 30-50GB）的轻度用户',
        '希望将长期年持有成本控制在百元以内的预算优先型用户',
        '需要 IEPL 专线基础稳定性的个人浏览用户'
      ],
      notRecommendedFor: [
        '需要每月按月支付、排斥年付付款周期的用户',
        '视频常开、流量需求 > 100GB 的大流量用户'
      ],
      pros: [
        '年付折合约 7 元/月，是 16 家品牌中专线年付门槛最低之一',
        '标配 IEPL 专线与自研客户端支持',
        '新用户季付及以上可享 8 折优惠码 flycat888'
      ],
      cons: [
        '7 元/月为年付折算价格，不可误解为直接月付 7 元',
        '月流量 50GB 偏小，需注意流量消耗节奏'
      ],
      priceSegment: '7',
      lastVerified: '2026-08-16'
    }
  },
  {
    slug: 'weitu',
    name: '唯兔云',
    vendor: {
      entryPrice: '14.9元/月',
      traffic: '100GB/月',
      protocols: ['VLESS', 'Shadowsocks'],
      lines: ['三网优化', '智能负载均衡', 'IEPL 专线（服务商标注）'],
      nodeCount: '60+',
      customClients: ['Windows', 'macOS', 'Android', 'iOS'],
      thirdPartySupport: true,
      thirdPartyNote: '支持 Clash、v2rayN、Shadowrocket 等主流客户端订阅导入',
      aiClaim: '当前资料未提供统一实测结果，建议以实际节点测试为准',
      streamingClaim: '当前资料未提供统一实测结果，建议以实际节点测试为准',
      establishedYear: 2023
    },
    measured: {
      hasSpeedtest: true,
      testDate: '2026-08-11',
      testTime: '白天时段',
      screenshotPath: '/images/speedtest/weituyun-speedtest-2026-08-11.png',
      speedtestProtocol: 'Shadowsocks / VLESS',
      testTool: '珠海联通 5Gbps / 32 线程测速',
      status: 'Measured',
      aiUnlockTested: false,
      streamingUnlockTested: false,
      disclaimer: '本次结果仅代表 2026-08-11 截图所示时间点和测试环境，不代表长期表现或所有用户体验。'
    },
    commercial: {
      promoCode: 'rabbit',
      discountDesc: '新用户 9 折',
      affLink: 'https://guangs.v2yunvipaff.com/#/?code=xIutqOBA',
      hasHashLink: true,
      paymentMethods: ['支付宝', '微信', 'USDT'],
      isSponsored: true
    },
    editorial: {
      oneSentenceTagline: '节点丰富 / VLESS 协议 / 60+ 节点 / 三网优化与智能负载均衡',
      positioning: '节点丰富 / VLESS / 三网优化 / 智能负载均衡',
      targetAudience: [
        '看重节点地区覆盖面与节点备选数量的用户',
        '需要三网优化调度与 VLESS 协议支持的极客/进阶用户',
        '希望把月付预算控制在 15 元以内同时拥有 100GB 流量的用户'
      ],
      notRecommendedFor: [
        '追求 100% 确定性全流媒体/AI 专属解锁承诺的用户（目前状态为待独立测试）'
      ],
      pros: [
        '14.9 元/月入门套餐提供 100GB 流量与 60+ 节点，调度冗余度大',
        '主打 VLESS 协议、三网优化和智能负载均衡',
        '公开卖点更偏向网络调度与节点覆盖，技术倾向明确'
      ],
      cons: [
        'AI 与流媒体当前无本站统一批量实测证据，标记为“待独立测试”，非全部解锁',
        '节点较多时需依赖客户端自动测速选择最优组'
      ],
      priceSegment: '15',
      lastVerified: '2026-08-16'
    }
  },
  {
    slug: 'yuzhouyun',
    name: '宇宙云',
    vendor: {
      entryPrice: '14.9元/月',
      traffic: '100GB/月',
      protocols: ['VLESS'],
      lines: ['IEPL 专线'],
      nodeCount: '45+',
      customClients: ['Windows', 'Android', 'macOS'],
      thirdPartySupport: true,
      thirdPartyNote: '支持第三方客户端，具体订阅导入方式需咨询客服',
      aiClaim: '品牌资料显示覆盖常见 AI 浏览场景',
      streamingClaim: '资料显示覆盖常见流媒体使用场景',
      establishedYear: 2023
    },
    measured: {
      hasSpeedtest: true,
      testDate: '2026-08-11',
      testTime: '晚间时段',
      screenshotPath: '/images/speedtest/yuzhouyun-speedtest-2026-08-11.png',
      speedtestProtocol: 'VLESS',
      testTool: '珠海联通 5Gbps / 32 线程测速',
      status: 'Measured',
      aiUnlockTested: false,
      streamingUnlockTested: false,
      disclaimer: '本次结果仅代表 2026-08-11 截图所示时间点和测试环境，不代表长期表现或所有用户体验。'
    },
    commercial: {
      promoCode: 'YUZHOU553',
      discountDesc: '专属优惠码 YUZHOU553',
      affLink: 'https://guangs.yuzoucloud.cc/#/register?code=yrThwMP1',
      hasHashLink: true,
      paymentMethods: ['支付宝', '微信', 'USDT'],
      isSponsored: true
    },
    editorial: {
      oneSentenceTagline: '15元档 / VLESS 协议 / IEPL 专线 / 性价比专线标杆',
      positioning: '15元档 / VLESS / IEPL / 性价比',
      targetAudience: [
        '希望把月付预算严格控制在 15 元以内，同时明确要求 IEPL 专线的用户',
        '月流量需求约 100GB 的日常影音与学习办公用户',
        '偏好纯 VLESS 协议现代化连接的用户'
      ],
      notRecommendedFor: [
        '需要每月 300GB+ 极高流量下载的大户'
      ],
      pros: [
        '14.9 元档即可获得 100GB IEPL 专线，性价比十分突出',
        '全面支持 VLESS 协议，抗封锁与传输效率良好',
        '提供自研客户端与第三方订阅导入支持'
      ],
      cons: [
        '入门套餐不支持过多设备同时高并发占用',
        '流媒体/AI 解锁以品牌资料为准，需结合实测节点'
      ],
      priceSegment: '15',
      lastVerified: '2026-08-16'
    }
  },
  {
    slug: 'u1s1',
    name: 'U1S1',
    vendor: {
      entryPrice: '20元/月',
      traffic: '120GB/月',
      protocols: ['VLESS', 'Shadowsocks'],
      lines: ['IEPL 专线'],
      nodeCount: '50+',
      customClients: ['Windows', 'macOS', 'Android'],
      thirdPartySupport: true,
      thirdPartyNote: '支持订阅导入，适配 Clash、Shadowrocket 等',
      aiClaim: '品牌资料显示支持常见 AI 工具',
      streamingClaim: '资料显示支持常见流媒体访问场景',
      establishedYear: 2023
    },
    measured: {
      hasSpeedtest: true,
      testDate: '2026-08-11',
      testTime: '白天时段',
      screenshotPath: '/images/speedtest/u1s1-speedtest-2026-08-11.png',
      speedtestProtocol: 'Shadowsocks / VLESS',
      testTool: '珠海联通 5Gbps / 32 线程测速',
      status: 'Measured',
      aiUnlockTested: false,
      streamingUnlockTested: false,
      disclaimer: '本次结果仅代表 2026-08-11 截图所示时间点和测试环境，不代表长期表现或所有用户体验。'
    },
    commercial: {
      promoCode: 'akaka',
      discountDesc: '专属优惠码 akaka',
      affLink: 'https://guangs.vipaff.cc/#/?code=xhX5X22f',
      hasHashLink: true,
      paymentMethods: ['支付宝', '微信', 'USDT'],
      isSponsored: true
    },
    editorial: {
      oneSentenceTagline: '20元档 / 120GB / VLESS 协议 / IEPL 专线 / 均衡月付',
      positioning: '20元档 / 120GB / VLESS / IEPL',
      targetAudience: [
        '希望购买 20 元档月付套餐，同时比较注重 IEPL 专线品质的普通用户',
        '月流量在 100-120GB 之间的日常综合用户',
        '多端设备使用且希望操作简便的用户'
      ],
      notRecommendedFor: [
        '需要每月 200GB+ 极高流量且预算仅 20 元的用户'
      ],
      pros: [
        '20 元提供 120GB 流量，在专线稳定性与流量之间取得平衡',
        '支持 VLESS 协议与 IEPL 内网专线',
        '支持自研客户端与通用第三方客户端订阅导入'
      ],
      cons: [
        '在 20 元档同价位中，流量略低于一翻云（150GB）与二猫云（130GB）',
        'AI 解锁为官方声明，未做全量自动化复核'
      ],
      priceSegment: '20',
      lastVerified: '2026-08-16'
    }
  },
  {
    slug: 'jilianyun',
    name: '极连云',
    vendor: {
      entryPrice: '18元/月',
      traffic: '100GB/月',
      protocols: ['Shadowsocks'],
      lines: ['IEPL 专线'],
      nodeCount: '45+',
      customClients: ['Windows', 'Android', 'macOS'],
      thirdPartySupport: true,
      thirdPartyNote: '支持第三方客户端，具体导入方式可联系在线客服',
      aiClaim: '品牌资料显示覆盖常见流媒体及 AI 工具使用场景',
      streamingClaim: '品牌资料显示覆盖常见流媒体及 AI 工具使用场景',
      establishedYear: 2024
    },
    measured: {
      hasSpeedtest: true,
      testDate: '2026-08-11',
      testTime: '白天时段',
      screenshotPath: '/images/speedtest/jilianyun-speedtest-2026-08-11.png',
      speedtestProtocol: 'Shadowsocks',
      testTool: '珠海联通 5Gbps / 32 线程测速',
      status: 'Measured',
      aiUnlockTested: false,
      streamingUnlockTested: false,
      disclaimer: '本次结果仅代表 2026-08-11 截图所示时间点和测试环境，不代表长期表现或所有用户体验。'
    },
    commercial: {
      promoCode: 'ji8888',
      discountDesc: '专属优惠码 ji8888',
      affLink: 'https://guangs.jlyvipaff.com/#/?code=VM1rKGUu',
      hasHashLink: true,
      paymentMethods: ['支付宝', '微信', 'USDT'],
      isSponsored: true
    },
    editorial: {
      oneSentenceTagline: '18元档 / IEPL 专线 / 综合使用 / 平价专线稳定之选',
      positioning: '18元档 / IEPL / 综合使用',
      targetAudience: [
        'AI、流媒体与日常网页需求比较均衡的用户',
        '希望把月预算控制在 20 元以内的个人用户',
        '看重 IEPL 专线抗抖动能力的跨境外贸与学习人群'
      ],
      notRecommendedFor: [
        '寻求 10 元以下超低价套餐的轻度用户'
      ],
      pros: [
        '18 元档提供 100GB IEPL 专线流量，价格适中',
        '兼顾常见海外流媒体与 AI 访问场景',
        '提供自研客户端与在线客服支持'
      ],
      cons: [
        '2024 年新开业，运营历史待继续观察',
        '主要支持 Shadowsocks 协议，VLESS 节点分布较少'
      ],
      priceSegment: '18',
      lastVerified: '2026-08-16'
    }
  },
  {
    slug: 'guangnianti',
    name: '光年梯',
    vendor: {
      entryPrice: '18元/月',
      traffic: '110GB/月',
      protocols: ['VLESS', 'Shadowsocks'],
      lines: ['IEPL 专线'],
      nodeCount: '50+',
      customClients: ['Windows', 'macOS', 'Android'],
      thirdPartySupport: true,
      thirdPartyNote: '支持第三方客户端订阅导入',
      aiClaim: '资料显示支持常见 AI 工具和主流流媒体场景',
      streamingClaim: '资料显示支持常见 AI 工具和主流流媒体场景',
      establishedYear: 2025
    },
    measured: {
      hasSpeedtest: true,
      testDate: '2026-08-11',
      testTime: '白天时段',
      screenshotPath: '/images/speedtest/guangnianti-speedtest-2026-08-11.png',
      speedtestProtocol: 'Shadowsocks / VLESS',
      testTool: '珠海联通 5Gbps / 32 线程测速',
      status: 'Measured',
      aiUnlockTested: false,
      streamingUnlockTested: false,
      disclaimer: '本次结果仅代表 2026-08-11 截图所示时间点和测试环境，不代表长期表现或所有用户体验。'
    },
    commercial: {
      promoCode: 'gnt6666',
      discountDesc: '专属优惠码 gnt6666',
      affLink: 'https://guangs.gntaff.com/#/?code=X1FoxjGE',
      hasHashLink: true,
      paymentMethods: ['支付宝', '微信', 'USDT'],
      isSponsored: true
    },
    editorial: {
      oneSentenceTagline: '18元档 / 110GB / VLESS 协议 / IEPL 专线 / 新锐专线方案',
      positioning: '18元档 / 110GB / VLESS / IEPL',
      targetAudience: [
        '想购买中低价位专线套餐（18元），同时有 AI、流媒体和日常代理需求的用户',
        '月流量约 110GB 的日常白领与学生群体',
        '偏好 VLESS 协议与新开业高带宽冗余线路的用户'
      ],
      notRecommendedFor: [
        '对服务商运营年份有硬性要求（>3年）的保守型用户'
      ],
      pros: [
        '18 元提供 110GB 流量，比同价位极连云多出 10GB 流量',
        '提供 VLESS 协议与 IEPL 内网专线组合',
        '支持支付宝/微信支付与全平台自研客户端'
      ],
      cons: [
        '2025 年新开业，需持续关注晚高峰抗拥堵持续性',
        'AI 解锁仍属品牌声明阶段'
      ],
      priceSegment: '18',
      lastVerified: '2026-08-16'
    }
  },
  {
    slug: 'yifanyun',
    name: '一翻云',
    vendor: {
      entryPrice: '20元/月',
      traffic: '150GB/月',
      protocols: ['VLESS', 'Shadowsocks'],
      lines: ['IEPL 专线'],
      nodeCount: '55+',
      customClients: ['Windows', 'Android', 'macOS'],
      thirdPartySupport: true,
      thirdPartyNote: '支持订阅导入，适配主流客户端',
      aiClaim: '资料显示兼顾流媒体与 AI 工具使用',
      streamingClaim: '资料显示兼顾流媒体与 AI 工具使用',
      establishedYear: 2024
    },
    measured: {
      hasSpeedtest: true,
      testDate: '2026-08-11',
      testTime: '白天时段',
      screenshotPath: '/images/speedtest/yifanyun-speedtest-2026-08-11.png',
      speedtestProtocol: 'Shadowsocks / VLESS',
      testTool: '珠海联通 5Gbps / 32 线程测速',
      status: 'Measured',
      aiUnlockTested: false,
      streamingUnlockTested: false,
      disclaimer: '本次结果仅代表 2026-08-11 截图所示时间点和测试环境，不代表长期表现或所有用户体验。'
    },
    commercial: {
      promoCode: 'yfy6666',
      discountDesc: '专属优惠码 yfy6666',
      affLink: 'https://guangs.1flyunaff.cc/#/register?code=Yr7FhB7r',
      hasHashLink: true,
      paymentMethods: ['支付宝', '微信', 'USDT'],
      isSponsored: true
    },
    editorial: {
      oneSentenceTagline: '20元档大流量 / 150GB / VLESS 协议 / IEPL 专线 / 大流量首选',
      positioning: '20元档大流量 / 150GB / VLESS / IEPL',
      targetAudience: [
        '每月流量需求超过 100GB，希望提高 20 元档流量性价比的用户',
        '高频看 YouTube 4K、TikTok 视频与下载日常资源的用户',
        '需要 VLESS 协议与 IEPL 专线结合的个人/多设备用户'
      ],
      notRecommendedFor: [
        '寻找 10 元以下超低价套餐的轻度用户'
      ],
      pros: [
        '20 元档提供高达 150GB 流量，同价位专线中流量规格最突出',
        '标配 VLESS 协议与 IEPL 专线',
        '推广注册链接 Hash 路径已原样保存'
      ],
      cons: [
        '需注意高倍率节点的流量扣除倍率规则',
        'AI 解锁状态为品牌声明，未经过本站批量自动化检测'
      ],
      priceSegment: '20',
      lastVerified: '2026-08-16'
    }
  },
  {
    slug: 'ermaoyun',
    name: '二猫云',
    vendor: {
      entryPrice: '20元/月',
      traffic: '130GB/月',
      protocols: ['VLESS', 'Shadowsocks'],
      lines: ['IEPL 专线'],
      nodeCount: '50+',
      customClients: ['Windows', 'Android', 'macOS'],
      thirdPartySupport: true,
      thirdPartyNote: '支持订阅导入，适配 Clash、Shadowrocket 等',
      aiClaim: '品牌资料显示支持相关使用场景，实际能力建议结合具体节点测试',
      streamingClaim: '品牌资料显示支持相关使用场景，实际能力建议结合具体节点测试',
      establishedYear: 2023
    },
    measured: {
      hasSpeedtest: true,
      testDate: '2026-08-11',
      testTime: '白天/晚高峰',
      screenshotPath: '/images/speedtest/ermaoyun-speedtest-2026-08-11.png',
      speedtestProtocol: 'Shadowsocks / VLESS',
      testTool: '珠海联通 5Gbps / 32 线程测速',
      status: 'Measured',
      aiUnlockTested: false,
      streamingUnlockTested: false,
      disclaimer: '本次结果仅代表 2026-08-11 截图所示时间点和测试环境，不代表长期表现或所有用户体验。'
    },
    commercial: {
      promoCode: 'ermao5555',
      discountDesc: '专属优惠码 ermao5555',
      affLink: 'https://guangs.2maoyunaff.cc/#/?code=7mjvgGbW',
      hasHashLink: true,
      paymentMethods: ['支付宝', '微信', 'USDT'],
      isSponsored: true
    },
    editorial: {
      oneSentenceTagline: '20元档 / 130GB / VLESS 协议 / IEPL 专线 / 流量与专线均衡',
      positioning: '20元档 / 130GB / VLESS / IEPL',
      targetAudience: [
        '每月中等偏大流量需求（130GB），希望兼顾专线品质的个人用户',
        '日常进行社交媒体、AI 对话及视频浏览的综合用户',
        '偏好 20 元月付、注重线路冗余稳定性的用户'
      ],
      notRecommendedFor: [
        '需要每月 300GB+ 极高流量的重度下载用户'
      ],
      pros: [
        '20 元提供 130GB 流量，介于 U1S1（120GB）与一翻云（150GB）之间，平衡性强',
        '全节点标配 VLESS 协议与 IEPL 内网专线',
        '支持快捷支付与第三方客户端订阅一键导入'
      ],
      cons: [
        'AI 与流媒体能力目前属于品牌资料声明，未提供独立批量实测',
        '无免费试用体验，需直接购买月付套餐'
      ],
      priceSegment: '20',
      lastVerified: '2026-08-16'
    }
  },
  {
    slug: 'sogoyun',
    name: 'SOGO 云',
    vendor: {
      entryPrice: '25元/月',
      traffic: '150GB/月',
      protocols: ['VLESS', 'Shadowsocks'],
      lines: ['IEPL 专线'],
      nodeCount: '60+',
      customClients: ['Windows', 'Android', 'macOS'],
      thirdPartySupport: true,
      thirdPartyNote: '支持订阅导入，适配各种主流第三方客户端',
      aiClaim: '资料显示覆盖常见流媒体和 AI 工具使用场景',
      streamingClaim: '资料显示覆盖常见流媒体和 AI 工具使用场景',
      establishedYear: 2026
    },
    measured: {
      hasSpeedtest: true,
      testDate: '2026-08-11',
      testTime: '白天时段',
      screenshotPath: '/images/speedtest/sogoyun-speedtest-2026-08-11.png',
      speedtestProtocol: 'Shadowsocks / VLESS',
      testTool: '珠海联通 5Gbps / 32 线程测速',
      status: 'Measured',
      aiUnlockTested: false,
      streamingUnlockTested: false,
      disclaimer: '本次结果仅代表 2026-08-11 截图所示时间点和测试环境，不代表长期表现或所有用户体验。'
    },
    commercial: {
      promoCode: 'sss777',
      discountDesc: '专属优惠码 sss777',
      affLink: 'https://guangs.sogoyunaff.cc/#/?code=327Vs0w7',
      hasHashLink: true,
      paymentMethods: ['支付宝', '微信', 'USDT'],
      isSponsored: true
    },
    editorial: {
      oneSentenceTagline: '25元档 / 150GB / VLESS 协议 / IEPL 专线 / 综合型高端之选',
      positioning: '25元档 / 150GB / VLESS / IEPL / 综合型',
      targetAudience: [
        '希望获得约 150GB 月流量，同时兼顾视频、AI 与日常代理使用的中高预算用户',
        '注重 2026 年新开业节点低拥堵率与高速带宽冗余的用户',
        '多设备协作办公需要稳定专线保障的用户'
      ],
      notRecommendedFor: [
        '预算在 15 元以下寻求平价替代的用户'
      ],
      pros: [
        '25 元入门套餐提供 150GB 大容量 IEPL 专线流量',
        '2026 年新上线，节点带宽利用率相对宽松',
        '推广注册链接包含特殊 Hash 路径并已严格原样保留'
      ],
      cons: [
        '开业时间较新，长期稳定性和客服保障仍需时间检验',
        '入门价格 25 元相对 15-20 元档门槛稍高'
      ],
      priceSegment: '25',
      lastVerified: '2026-08-16'
    }
  },
  {
    slug: 'kexinyun',
    name: '可信云',
    vendor: {
      entryPrice: '25元/月',
      traffic: '150GB/月',
      protocols: ['VLESS', 'Shadowsocks'],
      lines: ['IEPL 专线'],
      nodeCount: '50+',
      customClients: ['Windows', 'Android', 'macOS'],
      thirdPartySupport: true,
      thirdPartyNote: '支持第三方客户端，具体方式以官方说明为准',
      aiClaim: '当前没有统一实测数据，应避免写成“全部解锁”',
      streamingClaim: '当前没有统一实测数据，应避免写成“全部解锁”',
      establishedYear: 2024
    },
    measured: {
      hasSpeedtest: true,
      testDate: '2026-08-11',
      testTime: '待全量复核',
      screenshotPath: '/images/speedtest/kexinyun-speedtest-2026-08-11.png',
      speedtestProtocol: 'Shadowsocks / VLESS',
      testTool: '珠海联通 5Gbps / 32 线程测速',
      status: 'Review Required',
      aiUnlockTested: false,
      streamingUnlockTested: false,
      disclaimer: '本次结果仅代表原始截图证据，该截图缺乏完整年月日标注，数据状态标注为 Review Required 待复核。'
    },
    commercial: {
      promoCode: 'kkk333',
      discountDesc: '专属优惠码 kkk333',
      affLink: 'https://guangs.kosingaff.com/#/register?code=UYDtNlCY',
      hasHashLink: true,
      paymentMethods: ['支付宝', '微信', 'USDT'],
      isSponsored: true
    },
    editorial: {
      oneSentenceTagline: '25元档 / 150GB / VLESS 协议 / IEPL 专线 / 专线大流量',
      positioning: '25元档 / 150GB / VLESS / IEPL',
      targetAudience: [
        '每月需要约 150GB 流量，并偏好 VLESS 专线线路的用户',
        '主要适用于日常网页浏览、视频播放和多设备日常使用场景的用户'
      ],
      notRecommendedFor: [
        '寻求 10-15 元超低预算套餐的用户',
        '要求 100% 承诺 AI/流媒体全解锁凭证的用户（目前无统一实测）'
      ],
      pros: [
        '25 元档提供 150GB 大流量与 IEPL 内网专线',
        '全节点支持 VLESS 与 Shadowsocks 协议',
        '支持全平台客户端配置'
      ],
      cons: [
        '测速截图未包含完整年月日标注，本站严格标记为待复核状态',
        'AI 与流媒体当前无本站实测数据，严禁宣传为“全部解锁”'
      ],
      priceSegment: '25',
      lastVerified: '2026-08-16'
    }
  },
  {
    slug: 'sujie',
    name: '速界',
    vendor: {
      entryPrice: '25元/月',
      traffic: '150GB/月',
      protocols: ['VLESS', 'Shadowsocks'],
      lines: ['IEPL 专线'],
      nodeCount: '50+',
      customClients: ['Windows', 'Android', 'macOS'],
      thirdPartySupport: true,
      thirdPartyNote: '支持订阅导入，适配主流代理客户端',
      aiClaim: '品牌资料重点强调 AI 工具访问场景，作为品牌声明展示',
      streamingClaim: '覆盖主流视频流媒体基础播放',
      establishedYear: 2024
    },
    measured: {
      hasSpeedtest: true,
      testDate: '2026-08-11',
      testTime: '白天时段',
      screenshotPath: '/images/speedtest/sujie-speedtest-2026-08-11.png',
      speedtestProtocol: 'Shadowsocks / VLESS',
      testTool: '珠海联通 5Gbps / 32 线程测速',
      status: 'Measured',
      aiUnlockTested: false,
      streamingUnlockTested: false,
      disclaimer: '本次结果仅代表 2026-08-11 截图所示时间点和测试环境，不代表长期表现或所有用户体验。'
    },
    commercial: {
      promoCode: 'sss1111',
      discountDesc: '专属优惠码 sss1111',
      affLink: 'https://guangs.speedworldaff.cc/#/register?code=xgXzEfZB',
      hasHashLink: true,
      paymentMethods: ['支付宝', '微信', 'USDT'],
      isSponsored: true
    },
    editorial: {
      oneSentenceTagline: 'AI 场景主打 / 25元档 / 150GB / VLESS 协议 / IEPL 专线',
      positioning: 'AI 场景 / 25元档 / 150GB / VLESS / IEPL',
      targetAudience: [
        '经常使用 ChatGPT、Claude、Gemini 等 AI 工具，同时需要稳定代理线路的用户',
        '月流量需求约 150GB 的中重度日常科研与编程用户',
        '注重专线直连与 VLESS 协议低延迟特性的用户'
      ],
      notRecommendedFor: [
        '低预算轻量个人用户（月消费意愿 < 15元）'
      ],
      pros: [
        '以 VLESS 和 IEPL 专线为核心，25 元入门套餐提供 150GB 流量',
        '品牌资料特别针对 AI 工具场景进行出口节点优化声明',
        '支持自研客户端与第三方订阅一键导入'
      ],
      cons: [
        'AI 支持目前属于品牌声明，具体 ChatGPT / Claude 可用性以后续实际检测为准',
        '无免费试用方案'
      ],
      priceSegment: '25',
      lastVerified: '2026-08-16'
    }
  },
  {
    slug: 'kuaili',
    name: '快狸',
    vendor: {
      entryPrice: '25元/月',
      traffic: '150GB/月',
      protocols: ['VLESS'],
      lines: ['IEPL 专线'],
      nodeCount: '50+',
      customClients: ['Windows', 'Android', 'macOS'],
      thirdPartySupport: true,
      thirdPartyNote: '支持订阅导入，适配各大客户端',
      aiClaim: '资料显示覆盖常见流媒体及 AI 服务访问场景',
      streamingClaim: '资料显示覆盖常见流媒体及 AI 服务访问场景',
      establishedYear: 2023
    },
    measured: {
      hasSpeedtest: true,
      testDate: '2026-08-11',
      testTime: '白天时段',
      screenshotPath: '/images/speedtest/kuaili-speedtest-2026-08-11.png',
      speedtestProtocol: 'VLESS',
      testTool: '珠海联通 5Gbps / 32 线程测速',
      status: 'Measured',
      aiUnlockTested: false,
      streamingUnlockTested: false,
      disclaimer: '本次结果仅代表 2026-08-11 截图所示时间点和测试环境，不代表长期表现或所有用户体验。'
    },
    commercial: {
      promoCode: 'kkk2222',
      discountDesc: '专属优惠码 kkk2222',
      affLink: 'https://guangs.kuailicloud.cc/#/register?code=AiqyM8oG',
      hasHashLink: true,
      paymentMethods: ['支付宝', '微信', 'USDT'],
      isSponsored: true
    },
    editorial: {
      oneSentenceTagline: '25元档 / 150GB / 纯 VLESS 协议 / IEPL 专线 / 视频与AI综合型',
      positioning: '25元档 / 150GB / 综合型 / VLESS / IEPL',
      targetAudience: [
        '视频、AI 和日常代理需求比较均衡的中等流量用户',
        '偏好纯 VLESS 协议配置、看重 IEPL 专线低延迟稳定性的用户',
        '月流量需求约 150GB 的多设备家庭或个人重度用户'
      ],
      notRecommendedFor: [
        '预算低于 20 元的平价需求用户'
      ],
      pros: [
        '采用纯 VLESS 协议并提供 IEPL 专线节点，传输协议现代化',
        '25 元档提供 150GB 月流量，容量充足',
        '提供自研客户端与第三方订阅无缝导入'
      ],
      cons: [
        '仅提供 VLESS 协议，老旧客户端可能需要升级内核',
        'AI 与流媒体解锁仍待后续独立自动化批量实测'
      ],
      priceSegment: '25',
      lastVerified: '2026-08-16'
    }
  },
  {
    slug: 'quanqiuyun',
    name: '全球云',
    vendor: {
      entryPrice: '20元/月',
      traffic: '120GB/月',
      protocols: ['VLESS', 'Shadowsocks'],
      lines: ['IEPL 专线'],
      nodeCount: '50+',
      customClients: ['Windows', 'macOS', 'Android'],
      thirdPartySupport: true,
      thirdPartyNote: '支持第三方客户端订阅导入',
      aiClaim: '资料显示覆盖网页、视频流媒体以及 AI 工具访问场景',
      streamingClaim: '资料显示覆盖网页、视频流媒体以及 AI 工具访问场景',
      establishedYear: 2026
    },
    measured: {
      hasSpeedtest: true,
      testDate: '2026-08-11',
      testTime: '白天时段',
      screenshotPath: '/images/speedtest/quanqiuyun-speedtest-2026-08-11.png',
      speedtestProtocol: 'Shadowsocks / VLESS',
      testTool: '珠海联通 5Gbps / 32 线程测速',
      status: 'Measured',
      aiUnlockTested: false,
      streamingUnlockTested: false,
      disclaimer: '本次结果仅代表 2026-08-11 截图所示时间点和测试环境，不代表长期表现或所有用户体验。'
    },
    commercial: {
      promoCode: 'qqy7777',
      discountDesc: '专属优惠码 qqy7777',
      affLink: 'https://guangs.gcvipaff.com/#/?code=Ov2nvU9C',
      hasHashLink: true,
      paymentMethods: ['支付宝', '微信', 'USDT'],
      isSponsored: true
    },
    editorial: {
      oneSentenceTagline: '20元档 / 120GB / VLESS 协议 / IEPL 专线 / 2026 综合型专线',
      positioning: '20元档 / 120GB / VLESS / IEPL',
      targetAudience: [
        '希望把预算控制在 20 元左右，日常流量需求约 100-120GB 的用户',
        '注重 2026 年新开业节点低负载与 IEPL 专线稳定性的日常用户',
        '需要兼顾网页浏览、流媒体以及基础 AI 访问场景的用户'
      ],
      notRecommendedFor: [
        '极低预算（<10元）轻度用户'
      ],
      pros: [
        '20 元入门套餐包含 120GB 流量，以 VLESS 与 IEPL 专线为核心卖点',
        '2026 年新上线，节点带宽充裕度较好',
        '全平台客户端支持与便捷支付宝/微信支付'
      ],
      cons: [
        '开业时间较新，需观察长周期晚高峰表现',
        'AI 与流媒体目前属于厂商资料声明'
      ],
      priceSegment: '20',
      lastVerified: '2026-08-16'
    }
  }
]

// 1. 写入 docs/.vitepress/data/providers/{slug}.json
for (const brand of BRANDS) {
  const filePath = path.join(PROVIDERS_DIR, `${brand.slug}.json`)
  fs.writeFileSync(filePath, JSON.stringify(brand, null, 2), 'utf-8')
}
console.log(`Successfully generated 16 brand JSON files in ${PROVIDERS_DIR}`)

// 2. 写入 data/providers.json (供全站目录、列表、筛选器使用)
const flatProviders = BRANDS.map((b) => ({
  id: b.slug,
  slug: b.slug,
  name: b.name,
  status: 'active',
  firstSeen: '2026-08-03',
  lastVerified: b.editorial.lastVerified,
  lastMeasured: b.measured.status === 'Review Required' ? null : b.measured.testDate,
  site: b.commercial.affLink,
  couponCode: b.commercial.promoCode,
  established: String(b.vendor.establishedYear),
  entryPrice: b.vendor.entryPrice,
  isAnnualDiscount: b.vendor.entryPrice.includes('年付'),
  traffic: b.vendor.traffic,
  protocols: b.vendor.protocols,
  routes: b.vendor.lines,
  positioning: b.editorial.positioning,
  notes: `【核验状态】官网公开信息已确认（${b.editorial.oneSentenceTagline}）；【数据来源】官方参数与 2026-08-11 本站测速截图；【待核验项】长周期连续晚高峰丢包率与独立 AI 解锁复测。`
}))

fs.writeFileSync(PROVIDERS_JSON_PATH, JSON.stringify(flatProviders, null, 2), 'utf-8')
console.log(`Successfully updated ${PROVIDERS_JSON_PATH}`)
