/**
 * 首页模块数据。
 * 规则：首页所有链接只指向已正式发布的页面（栏目页、已发布文章或栏目页内的真实锚点），
 * 未完成的草稿大纲不会出现在首页任何位置。
 */

export interface HomeCard {
  title: string
  icon: string
  summary: string
  link: string
  linkText: string
}

/** 品牌可信度说明 */
export const trustPoints = [
  {
    icon: 'balance',
    title: '独立平台',
    text: '不销售、不代理、不运营任何机场或网络服务，也不提供节点与订阅链接。'
  },
  {
    icon: 'ruler',
    title: '方法先行',
    text: '先公开评测方法与判断标准，再谈结论；标准可以被读者自己复用。'
  },
  {
    icon: 'shield',
    title: '不编数据',
    text: '没有可核验的真实测试记录时，不输出速度、延迟、解锁结论与品牌排名。'
  },
  {
    icon: 'clock',
    title: '标注时效',
    text: '每页显示更新时间与重新核验条件，过期结论比没有结论更危险。'
  }
]

export interface ProviderPromo {
  name: string
  tagline: string
  href: string
  positioning?: string
  tags?: string[]
  confirmed?: string
  pending?: string
  reviewLink?: string
}

/**
 * 首页「热门机场推荐」卡片。
 * 只收录 data/providers.json 中 status 为 active 的服务商。
 * 提供公开核验数据与对应透明评测链接。
 */
export const providerPromoCards: ProviderPromo[] = [
  {
    name: '光速云',
    positioning: '主打 VLESS 协议与 IPLC 专线',
    tagline: '官网标注涵盖港日新美德等节点，提供月付、年付与不限时流量包，最高 10Gbps 带宽。',
    tags: ['AI 场景', '多地区节点', 'VLESS 协议'],
    confirmed: '公开套餐、线路架构与最高带宽参数',
    pending: '长周期晚高峰丢包分布',
    reviewLink: '/recommend/stable-airport-services/#光速云',
    href: 'https://sahude.gsyvipaff.com/#/?code=keqgvT5Y'
  },
  {
    name: '飞猫云',
    positioning: '多平台客户端兼容与备用包',
    tagline: '提供月付基础套餐与不限时备用流量包，适配多设备日常协同。',
    tags: ['多客户端', '备用流量包', '日常浏览'],
    confirmed: '多平台协议支持与一次性流量包',
    pending: '晚高峰极限带宽与办公稳定性',
    reviewLink: '/recommend/stable-airport-services/#飞猫云',
    href: 'https://guangs.flycataff.com/#/?code=6uq0Xe9y'
  },
  {
    name: '灵猫网络',
    positioning: '全 IPLC 专线与原生 IP 出口',
    tagline: '标注全 IPLC 专线、原生 IP 出口与 1 倍率节点，覆盖月/季/年多周期。',
    tags: ['IPLC 专线', '原生 IP', '1 倍率'],
    confirmed: '全专线架构说明与多周期套餐',
    pending: '不同运营商本地入口互联质量',
    reviewLink: '/recommend/stable-airport-services/#灵猫网络',
    href: 'https://vip01.civetnet.com/#/?code=8MIAyxak'
  },
  {
    name: '星岛梦',
    positioning: '流媒体解锁与海外访问场景',
    tagline: '覆盖港日新台美等主要地区节点，面向海外内容与影音播放场景。',
    tags: ['流媒体解锁', '多地区出口', '海外访问'],
    confirmed: '公开节点地区分布与影音场景适配',
    pending: '高风控 AI 平台 IP 信誉持久度',
    reviewLink: '/recommend/stable-airport-services/#星岛梦',
    href: 'https://guangs.xingdaomeng.com/#/?code=1TynBYnR'
  },
  {
    name: '唯兔云',
    positioning: '兼容主流客户端与多阶梯套餐',
    tagline: '支持主流客户端订阅，涵盖年付轻量包到大流量档位。',
    tags: ['多档位套餐', '主流协议', '轻量入门'],
    confirmed: '客户端兼容性说明与阶梯定价',
    pending: '多设备并发下的接入速率保留',
    reviewLink: '/recommend/stable-airport-services/#唯兔云',
    href: 'https://guangs.v2yunvipaff.com/#/?code=xIutqOBA'
  }
]

/** 热门机场选择专题 */
export const topicCards: HomeCard[] = [
  {
    title: '按预算筛选',
    icon: 'coin',
    summary: '十元、二十元、三十元档位分别能买到什么，低价压缩的是哪一项成本。',
    link: '/recommend/#按预算选择',
    linkText: '看预算与线路的对应关系'
  },
  {
    title: '按用途筛选',
    icon: 'target',
    summary: 'AI 工具、流媒体、远程办公与日常浏览，对线路的要求完全不同。',
    link: '/recommend/#按用途选择',
    linkText: '看用途决定的技术要求'
  },
  {
    title: '稳定性判断',
    icon: 'gauge',
    summary: '把「稳定」拆成晚高峰表现、丢包水平与故障恢复三个可观察项。',
    link: '/recommend/#按稳定性选择',
    linkText: '看稳定性的三个观察项'
  },
  {
    title: '套餐周期选择',
    icon: 'clock',
    summary: '月付、年付与不限时流量包各自的风险敞口和适用人群。',
    link: '/recommend/#按套餐周期选择',
    linkText: '看付款周期的风险差异'
  },
  {
    title: '评测方法公开',
    icon: 'ruler',
    summary: '样本怎么选、观察多久、环境怎么记录，以及哪些结论我们不会给。',
    link: '/methodology/how-we-review-airports/',
    linkText: '看完整评测流程'
  },
  {
    title: '排名规则说明',
    icon: 'chart',
    summary: '排行榜的收录门槛、评分维度与发布条件，全部提前公开。',
    link: '/rankings/',
    linkText: '看排名规则'
  }
]

/** 线路类型解释 */
export const routeCards: HomeCard[] = [
  {
    title: '直连线路',
    icon: 'route',
    summary: '结构最简单、成本最低，网络宽松时速度好，但受公网拥堵影响明显。',
    link: '/network/#直连线路',
    linkText: '看直连的优势与限制'
  },
  {
    title: '中转线路',
    icon: 'layers',
    summary: '用一段优化过的链路替换默认公网路径，入口质量决定实际体感。',
    link: '/network/#中转线路',
    linkText: '看中转的工作方式'
  },
  {
    title: 'IEPL 专线',
    icon: 'target',
    summary: '运营商跨境专用链路，不与公网争抢出口，但仍然可能被超售。',
    link: '/network/what-is-iepl/',
    linkText: '看专线原理与真假识别'
  },
  {
    title: 'IEPL 与 IPLC 区别',
    icon: 'compare',
    summary: '两者常被混用，真正的差异在组网层次、计费方式与实际交付形态。',
    link: '/compare/iepl-vs-iplc/',
    linkText: '看两者的核心差异'
  },
  {
    title: '多线接入与选路',
    icon: 'globe',
    summary: 'BGP 描述的是机房接入与故障切换能力，不是加速手段。',
    link: '/network/#多线接入与选路',
    linkText: '看多线接入的作用'
  },
  {
    title: '出口地址类型',
    icon: 'link',
    summary: '原生 IP、广播 IP 与住宅 IP 的区别，决定流媒体与 AI 平台的判定结果。',
    link: '/network/#出口地址类型',
    linkText: '看不同出口类型的影响'
  }
]

/** 客户端教程 */
export const clientCards: HomeCard[] = [
  {
    title: '按平台选择客户端',
    icon: 'terminal',
    summary: 'Windows、macOS、Android、iOS 各自的主流选择与关键差异。',
    link: '/clients/#按平台选择客户端',
    linkText: '看平台对照'
  },
  {
    title: '桌面端配置要点',
    icon: 'doc',
    summary: '系统代理、TUN 模式、开机启动与日志面板，桌面端最容易踩的坑。',
    link: '/clients/#桌面端客户端',
    linkText: '看桌面端要点'
  },
  {
    title: '移动端配置要点',
    icon: 'globe',
    summary: '后台存活、省电限制、移动数据与 WiFi 差异，以及安装渠道安全。',
    link: '/clients/#移动端客户端',
    linkText: '看移动端要点'
  },
  {
    title: '规则模式与分流',
    icon: 'filter',
    summary: '规则模式、全局模式与直连的分工，以及规则过旧导致的访问异常。',
    link: '/clients/#规则模式与分流',
    linkText: '看分流机制'
  }
]

/** AI 工具访问专题 */
export const aiCards: HomeCard[] = [
  {
    title: '访问失败通常不是速度问题',
    icon: 'spark',
    summary: 'AI 平台看的是出口地区、IP 信誉与会话一致性，带宽大小影响很小。',
    link: '/ai-access/#访问失败通常不是速度问题',
    linkText: '看真正的判定因素'
  },
  {
    title: '出口地区与账号一致性',
    icon: 'target',
    summary: '注册地区、登录地区与当前出口地区不一致，是最常见的失败原因。',
    link: '/ai-access/#出口地区与账号一致性',
    linkText: '看一致性要求'
  },
  {
    title: '长会话与连接稳定',
    icon: 'gauge',
    summary: '长文本生成与语音对话需要长连接稳定，频繁切换节点会中断会话。',
    link: '/ai-access/#会话稳定与长连接',
    linkText: '看长连接要求'
  }
]

/** 流媒体解锁专题 */
export const streamingCards: HomeCard[] = [
  {
    title: '解锁到底指什么',
    icon: 'play',
    summary: '解锁不是功能开关，而是出口 IP 没有被平台判定为代理的一种状态。',
    link: '/streaming/#解锁到底指什么',
    linkText: '看解锁的准确定义'
  },
  {
    title: '地区内容库的差异',
    icon: 'globe',
    summary: '同一个平台在不同地区的片库完全不同，选地区比选速度更重要。',
    link: '/streaming/#地区内容库的差异',
    linkText: '看地区差异'
  },
  {
    title: '解锁为什么会失效',
    icon: 'alert',
    summary: '共享出口被大量使用、平台策略更新、DNS 泄漏都会让解锁随时失效。',
    link: '/streaming/#解锁为什么会失效',
    linkText: '看失效原因'
  }
]

/** 节点故障排查 */
export const troubleCards: HomeCard[] = [
  {
    title: '节点全部超时',
    icon: 'wrench',
    summary: '先判断故障范围，再按订阅、网络、DNS、客户端、服务端的顺序排查。',
    link: '/troubleshooting/all-nodes-timeout/',
    linkText: '看完整诊断流程'
  },
  {
    title: '订阅相关问题',
    icon: 'link',
    summary: '订阅更新失败、节点列表为空、流量显示异常的常见原因与处理顺序。',
    link: '/troubleshooting/#订阅相关问题',
    linkText: '看订阅问题排查'
  },
  {
    title: '速度与延迟问题',
    icon: 'gauge',
    summary: '延迟高、晚高峰掉速、看似连上却很卡，分别对应不同的排查方向。',
    link: '/troubleshooting/#速度与延迟问题',
    linkText: '看速度问题排查'
  },
  {
    title: '平台访问问题',
    icon: 'spark',
    summary: 'AI 工具与流媒体访问失败时，先确认出口判定，再考虑更换节点。',
    link: '/troubleshooting/#平台访问问题',
    linkText: '看平台访问排查'
  }
]
