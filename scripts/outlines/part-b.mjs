/**
 * 内容矩阵 B 组：价格与套餐（13—18）与线路知识（19—24）
 */

export default [
  {
    id: '13',
    title: '每月十元左右的机场怎么选',
    slug: 'recommend/airport-under-10-yuan',
    category: 'recommend',
    pillar: '/recommend/',
    contentType: 'recommendation',
    intent: 'commercial',
    status: 'published',
    description:
      '最低价格档能买到什么线路、覆盖哪些使用场景、有哪些必须提前确认的限制，以及这个价位的典型风险信号。',
    primaryKeyword: '10元机场推荐',
    secondaryKeywords: ['低价套餐', '入门套餐', '小流量套餐', '低预算机场', '短期试用'],
    audience: '预算极为有限、使用频率不高的轻量使用者',
    problem: '不清楚这个价位能覆盖什么、不能覆盖什么，容易期待过高。',
    answerDraft: '最低价位通常只能覆盖直连或普通中转与小额流量，适合轻量浏览，不适合高频视频与团队使用。',
    sections: [
      {
        h2: '这个价位对应什么成本结构',
        points: ['带宽采购在总成本中的占比', '为什么这个价位难以覆盖优化链路', '服务与运维成本被压缩的表现']
      },
      {
        h2: '能覆盖的使用场景',
        points: ['文字浏览与轻量 AI 对话', '偶尔查资料与收发邮件', '作为备用线路而非主力']
      },
      {
        h2: '不建议依赖的场景',
        points: ['长时间高清视频观看', '视频会议与实时协作', '多设备家庭共享']
      },
      {
        h2: '必须提前确认的限制',
        points: ['流量额度与倍率范围', '设备数限制', '是否限速与限制节点范围']
      },
      {
        h2: '这个价位的典型风险信号',
        points: ['价格低于带宽成本且只推长期套餐', '无公开条款与公告渠道', '售后仅有单一即时通讯渠道']
      },
      {
        h2: '低预算的实用策略',
        points: ['短周期付款降低单次损失', '把预算集中在真正的高频场景', '保留一条不同来源的备用线路']
      }
    ],
    table: '「使用场景 → 是否适合最低价位 → 主要限制」三列表。',
    figure: '预算档位与可覆盖场景的对应示意图。',
    verify: ['确认不出现任何具体金额的成本数字', '确认未提及任何品牌', '核对倍率说明与词典一致'],
    faq: ['这个价位能正常用吗？', '适合当主力线路吗？', '流量一般够用多久？', '为什么实际消耗比预期快？', '低价服务的售后怎么样？', '值得买长期套餐吗？'],
    internalLinks: ['/recommend/', '/warnings/airport-exit-scam-warning-signs/', '/glossary/airport-terms/', '/faq/airport-service-faq/'],
    externalSources: '公开的带宽成本结构说明资料',
    updateCondition: '行业入门档套餐的常见结构发生变化时',
    doneCriteria: '读者能判断这个价位是否覆盖自己的需求，并知道要确认哪些限制。'
  },

  {
    id: '14',
    title: '每月二十元机场选择指南',
    slug: 'recommend/airport-under-20-yuan',
    category: 'recommend',
    pillar: '/recommend/',
    contentType: 'recommendation',
    intent: 'commercial',
    status: 'published',
    description:
      '主流价位的套餐结构、可以合理预期的线路水平、流量与设备数的匹配方法，以及付款周期建议。',
    primaryKeyword: '20元机场推荐',
    secondaryKeywords: ['主流套餐', '中低预算', '流量匹配', '设备数限制', '性价比套餐'],
    audience: '日常使用为主、希望在预算与体验之间取得平衡的读者',
    problem: '不清楚这个价位应该期待什么样的线路组合与条款。',
    answerDraft: '主流价位通常混合直连与普通中转，可覆盖日常浏览与常规视频，专线节点通常只占少量。',
    sections: [
      {
        h2: '这个价位的典型套餐结构',
        points: ['以普通中转为主的节点组合', '少量高倍率节点作为补充', '流量额度的常见量级']
      },
      {
        h2: '可以合理预期的线路水平',
        points: ['白天表现通常稳定', '晚高峰存在一定波动属于正常', '不应期待专线级别的可预期性']
      },
      {
        h2: '流量与设备数的匹配',
        points: ['按实际用途估算月度消耗', '把高倍率节点的额外消耗计入', '家庭共享时确认设备数上限']
      },
      {
        h2: '值得额外确认的条款',
        points: ['流量重置日的计算方式', '是否允许手动重置及其费用', '退款窗口与折算方式']
      },
      {
        h2: '付款周期建议',
        points: ['首次一律选最短周期', '观察一个完整晚高峰周期后再延长', '避免为小幅折扣锁定长周期']
      },
      {
        h2: '什么时候应该升档',
        points: ['晚高峰波动开始影响工作时', '需要固定出口或特定地区时', '设备数或流量长期不够用时']
      }
    ],
    table: '「用途 → 月度流量估算方式 → 需要注意的倍率影响」三列表。',
    figure: '流量消耗估算的分场景示意图。',
    verify: ['确认流量量级描述不给出精确数字', '确认未涉及品牌与价格对比', '核对重置规则说明与词典一致'],
    faq: ['这个价位够日常用吗？', '流量买多少合适？', '几个人能一起用？', '什么时候该换更贵的套餐？', '首次买多久合适？', '重置日怎么算？'],
    internalLinks: ['/recommend/', '/knowledge/what-is-airport-subscription/', '/glossary/airport-terms/', '/faq/airport-service-faq/'],
    externalSources: '无需外部来源，以通用条款结构说明为主',
    updateCondition: '主流套餐的流量额度与节点组合结构发生变化时',
    doneCriteria: '读者能估算自己的月度流量需求并确认套餐是否匹配。'
  },

  {
    id: '15',
    title: '每月三十元机场选择指南',
    slug: 'recommend/airport-under-30-yuan',
    category: 'recommend',
    pillar: '/recommend/',
    contentType: 'recommendation',
    intent: 'commercial',
    status: 'published',
    description:
      '中档价位的套餐特征、专线节点出现的可能性、流媒体与 AI 场景的适配情况，以及售后能力的价值。',
    primaryKeyword: '30元机场推荐',
    secondaryKeywords: ['中档套餐', '专线可能性', '流媒体需求', 'AI访问需求', '售后价值'],
    audience: '有明确使用场景、愿意为可预期表现多付一些的读者',
    problem: '不确定多付的部分买到了什么，是否值得。',
    answerDraft: '中档价位通常提供更完整的线路组合与部分专线节点，溢价主要买的是晚高峰的可预期性。',
    sections: [
      {
        h2: '中档价位的典型特征',
        points: ['线路组合更完整，入口选择更多', '可能包含少量专线或优化节点', '售后与公告机制通常更完善']
      },
      {
        h2: '专线节点出现的可能性',
        points: ['专线通常以高倍率节点形式提供', '数量有限，不等于全线专线', '核对倍率范围避免流量迅速耗尽']
      },
      {
        h2: '流媒体场景的适配',
        points: ['解锁取决于出口类型而非价位', '中档套餐通常提供更多地区选择', '任何解锁结论都需要时间标注']
      },
      {
        h2: 'AI 访问场景的适配',
        points: ['关键在出口地区与 IP 信誉', '固定出口的价值高于带宽', '共享程度低的节点更有优势']
      },
      {
        h2: '售后能力为什么值得付费',
        points: ['故障时的响应速度直接影响可用性', '公告机制降低排查成本', '工单系统比单一聊天渠道更可追溯']
      },
      {
        h2: '判断是否值得升档',
        points: ['先确认瓶颈是否真的在线路', '本地网络与客户端配置的收益可能更大', '用连续观察数据支撑升档决定']
      }
    ],
    table: '「需求 → 中档价位是否能覆盖 → 需要额外确认的项」三列表。',
    figure: '价位与线路组合完整度的关系示意图。',
    verify: ['确认不对解锁能力作出承诺', '确认专线描述与线路栏目一致', '确认无品牌与价格对比'],
    faq: ['多付的钱买到了什么？', '这个价位能解锁流媒体吗？', '适合 AI 工具使用吗？', '专线节点会有多少？', '售后重要吗？', '值得从低档升上来吗？'],
    internalLinks: ['/recommend/', '/network/what-is-iepl/', '/ai-access/', '/streaming/', '/methodology/how-we-review-airports/'],
    externalSources: '无需外部来源',
    updateCondition: '中档套餐的常见节点组合与倍率结构发生变化时',
    doneCriteria: '读者能判断升档是否解决自己的实际瓶颈。'
  },

  {
    id: '16',
    title: '月付机场的优点与缺点',
    slug: 'recommend/monthly-airport-plans',
    category: 'recommend',
    pillar: '/recommend/',
    contentType: 'recommendation',
    intent: 'commercial',
    status: 'published',
    description:
      '月付在灵活性、风险敞口与总成本之间的权衡，适合的用户类型，以及续费管理的实用做法。',
    primaryKeyword: '月付机场推荐',
    secondaryKeywords: ['月付套餐', '付款周期', '风险敞口', '续费管理', '短周期付款'],
    audience: '希望保持灵活性、或尚未确认服务质量的读者',
    problem: '在单价与风险之间难以取舍，也缺少续费管理的方法。',
    answerDraft: '月付单价更高但单次风险敞口最小，适合观察期与所有尚未验证过完整晚高峰周期的服务。',
    sections: [
      {
        h2: '月付的核心价值',
        points: ['单次损失可控', '服务变差时可以立即停止', '给观察留出决策空间']
      },
      {
        h2: '月付的代价',
        points: ['单价通常高于长周期', '需要定期处理续费', '可能错过长期优惠']
      },
      {
        h2: '适合月付的情况',
        points: ['首次使用某个服务', '出现风险信号的观察期', '短期出行或临时需求']
      },
      {
        h2: '续费管理的实用做法',
        points: ['提前设置提醒避免断供', '记录每次续费时的服务状态', '主备线路的到期时间错开']
      },
      {
        h2: '什么时候可以考虑延长',
        points: ['已经观察过完整晚高峰周期', '故障处理能力得到验证', '条款稳定且公告连续']
      },
      {
        h2: '常见误区',
        points: ['为小幅折扣立刻转长周期', '忽略断供带来的隐性成本', '把月付当成不需要观察的理由']
      }
    ],
    table: '「用户情形 → 建议周期 → 理由」三列决策表。',
    figure: '不同付款周期下的风险敞口对比示意图。',
    verify: ['确认不出现具体折扣比例', '核对风险信号描述与风险栏目一致'],
    faq: ['月付是不是更贵？', '什么时候该转年付？', '忘记续费会怎样？', '月付适合长期使用吗？', '主备线路都要月付吗？', '短期出行怎么安排？'],
    internalLinks: ['/recommend/', '/compare/', '/warnings/airport-exit-scam-warning-signs/', '/glossary/airport-terms/'],
    externalSources: '无需外部来源',
    updateCondition: '行业常见付款周期结构发生变化时',
    doneCriteria: '读者能说明自己当前应该选择什么周期以及理由。'
  },

  {
    id: '17',
    title: '年付机场是否划算',
    slug: 'recommend/yearly-airport-plans',
    category: 'recommend',
    pillar: '/recommend/',
    contentType: 'recommendation',
    intent: 'commercial',
    status: 'published',
    description:
      '年付的折扣价值、现金流影响与运营风险集中问题，以及在什么条件下年付才是合理选择。',
    primaryKeyword: '年付机场推荐',
    secondaryKeywords: ['年付折扣', '长期套餐风险', '预付风险', '续费决策', '风险集中'],
    audience: '已经稳定使用一段时间、考虑用长周期换取折扣的读者',
    problem: '只看折扣幅度，忽略把一整年押在服务商存续能力上的风险。',
    answerDraft: '年付用折扣换取风险集中，只有在完整观察并验证过运营连续性之后才值得考虑。',
    sections: [
      {
        h2: '年付换到了什么',
        points: ['单价下降与续费成本减少', '锁定当前价格避免调价', '减少断供风险']
      },
      {
        h2: '年付的真实代价',
        points: ['一次性支付把风险集中在单一服务商', '服务变差时难以及时止损', '退款条款往往对长周期更不利']
      },
      {
        h2: '年付前必须完成的验证',
        points: ['完整观察至少一个晚高峰周期', '验证过一次真实故障的处理过程', '确认条款与公告的历史连续性']
      },
      {
        h2: '如何降低年付风险',
        points: ['把单次支付金额控制在可接受损失内', '同时保留一条不同来源的备用线路', '保留完整的订单与条款凭证']
      },
      {
        h2: '不建议年付的情形',
        points: ['服务上线时间很短', '出现任何风险信号组合', '折扣幅度异常且只推长周期']
      },
      {
        h2: '年付期间的例行动作',
        points: ['定期复测线路表现', '关注公告渠道的连续性', '发现异常时优先准备迁移而非追加付款']
      }
    ],
    table: '「验证项 → 是否完成 → 未完成时的建议」三列检查表。',
    figure: '年付与月付在风险敞口上的对比示意图。',
    verify: ['确认不出现具体折扣数字', '核对风险信号与风险栏目一致', '确认未对任何服务的存续作出预测'],
    faq: ['年付能省多少？', '什么条件下才该年付？', '年付后服务变差怎么办？', '退款一般怎么算？', '年付要准备备用线路吗？', '折扣特别大要警惕吗？'],
    internalLinks: ['/recommend/', '/warnings/airport-exit-scam-warning-signs/', '/warnings/status-and-blacklist-policy/', '/compare/'],
    externalSources: '无需外部来源',
    updateCondition: '行业长周期套餐结构或退款惯例发生变化时',
    doneCriteria: '读者能列出自己年付前的验证清单并逐项确认。'
  },

  {
    id: '18',
    title: '不限时与一次性套餐怎么选',
    slug: 'recommend/non-expiring-airport-plans',
    category: 'recommend',
    pillar: '/recommend/',
    contentType: 'recommendation',
    intent: 'commercial',
    status: 'published',
    description:
      '不限时流量包的机制、适用场景与需要确认的条款，以及它与「永久套餐」在风险性质上的本质区别。',
    primaryKeyword: '不限时机场推荐',
    secondaryKeywords: ['流量包', '不限时套餐', '备用线路', '一次性套餐', '永久套餐区别'],
    audience: '低频使用、或需要第二条备用线路的读者',
    problem: '把「不限时」与「永久」混为一谈，忽略两者的风险差别。',
    answerDraft: '不限时套餐只买流量不设周期，适合低频与备用，但要确认是否真的没有有效期与节点限制。',
    sections: [
      {
        h2: '不限时套餐的机制',
        points: ['只销售固定流量，不设月度重置', '流量用完即止，不自动续费', '适合消耗不规律的使用模式']
      },
      {
        h2: '与永久套餐的本质区别',
        points: ['不限时是流量维度，永久是时间维度', '永久承诺受服务商存续能力限制', '两者的风险性质完全不同']
      },
      {
        h2: '适合的使用场景',
        points: ['作为主力线路之外的备用', '短期出行或临时需求', '使用频率低但要求随时可用']
      },
      {
        h2: '必须确认的条款',
        points: ['是否真的没有有效期', '是否限制可用节点范围', '是否存在限速或倍率差异']
      },
      {
        h2: '作为备用线路的使用建议',
        points: ['提前导入并定期验证可用性', '与主力线路来自不同服务商', '记录切换步骤避免临时摸索']
      },
      {
        h2: '常见误区',
        points: ['以为不限时等于永久可用', '忽略节点范围限制导致关键场景不可用', '长期闲置不验证，需要时才发现失效']
      }
    ],
    table: '「套餐类型 → 计费维度 → 主要风险 → 适合场景」四列对照表。',
    figure: '周期套餐与流量包在消耗模式上的对比示意图。',
    verify: ['确认与永久套餐风险页面的表述不冲突', '确认未推荐任何具体品牌'],
    faq: ['不限时和永久是一回事吗？', '适合当主力吗？', '流量会过期吗？', '备用线路要怎么维护？', '为什么有节点范围限制？', '长期不用会失效吗？'],
    internalLinks: ['/recommend/', '/compare/', '/warnings/', '/glossary/airport-terms/'],
    externalSources: '无需外部来源',
    updateCondition: '行业流量包形态或条款惯例发生变化时',
    doneCriteria: '读者能区分不限时与永久，并说出备用线路的维护动作。'
  },

  {
    id: '19',
    title: 'IEPL 专线机场是什么',
    slug: 'network/what-is-iepl',
    category: 'network',
    pillar: '/network/',
    contentType: 'term',
    intent: 'informational',
    status: 'published',
    description: '已完成写作与事实核验的正式文章。',
    primaryKeyword: 'IEPL 机场',
    secondaryKeywords: ['IEPL 是什么', '国际以太网专线', 'IEPL 专线', '专线机场', '真假专线'],
    audience: '想弄清专线标签实际含义的读者',
    problem: '专线标签被广泛使用但缺少可验证的判断方法。',
    answerDraft: '见正文快速回答。',
    sections: [],
    table: '',
    figure: '',
    verify: [],
    faq: [],
    internalLinks: [],
    externalSources: '',
    updateCondition: '',
    doneCriteria: ''
  },

  {
    id: '20',
    title: 'IPLC 专线机场是什么',
    slug: 'network/what-is-iplc',
    category: 'network',
    pillar: '/network/',
    contentType: 'term',
    intent: 'informational',
    status: 'published',
    description:
      'IPLC 的定义、传统企业用途、在机场语境中的实际含义，以及常见的营销误区与判断方法。',
    primaryKeyword: 'IPLC 机场',
    secondaryKeywords: ['IPLC 是什么', '国际专用租用电路', '点到点专线', '专线营销误区', '专线判断'],
    audience: '看到 IPLC 标签、想确认它到底意味着什么的读者',
    problem: 'IPLC 与 IEPL 被混用，缺少判断标签是否属实的方法。',
    answerDraft: 'IPLC 是运营商提供的点到点跨境专用电路，带宽与路径固定独享，不经过公共互联网出口。',
    sections: [
      {
        h2: 'IPLC 的定义',
        points: ['国际专用租用电路的基本含义', '点到点连接与带宽独享的特征', '不经过公共互联网出口']
      },
      {
        h2: '传统企业用途',
        points: ['跨国企业分支机构互联', '对稳定性与可追责性的要求', '通常伴随服务等级承诺']
      },
      {
        h2: '在机场语境中的实际含义',
        points: ['经过多层转售后形态可能与原始产品不同', '与 IEPL 常被当作同义词使用', '标签本身不构成技术保证']
      },
      {
        h2: '线路特点与体感',
        points: ['路径固定，延迟表现可预期', '不与公网争抢，晚高峰波动小', '仍然可能被服务商超售']
      },
      {
        h2: '常见营销误区',
        points: ['把 IPLC 当作比 IEPL 更高的档次', '把专线等同于解锁能力', '用专线标签替代结构说明']
      },
      {
        h2: '判断方法',
        points: ['算单位成本是否落在专线区间', '看服务商是否说明线路结构', '测晚高峰波动是否符合专线特征']
      }
    ],
    table: '「特征项 → IPLC 的表现 → 用户可观察到的现象」三列表。',
    figure: '点到点专线与公网路径的对比示意图。',
    verify: ['核对定义与运营商公开资料一致', '确认与 IEPL 文章不重复也不冲突', '确认未对具体服务作出真假判断'],
    faq: ['IPLC 比 IEPL 好吗？', '为什么两个词经常混用？', '标了 IPLC 就一定稳定吗？', '价格应该是什么水平？', '怎么验证真假？', '个人用户需要吗？'],
    internalLinks: ['/network/what-is-iepl/', '/compare/iepl-vs-iplc/', '/network/', '/glossary/airport-terms/'],
    externalSources: '运营商公开的 IPLC 产品说明资料',
    updateCondition: '运营商专线产品定义或行业叫法发生变化时',
    doneCriteria: '读者能说清 IPLC 的定义，并知道标签不等于保证。'
  },

  {
    id: '21',
    title: 'BGP 线路适合哪些用户',
    slug: 'network/what-is-bgp-route',
    category: 'network',
    pillar: '/network/',
    contentType: 'term',
    intent: 'informational',
    status: 'published',
    description:
      'BGP 多线接入的工作方式、对入口质量与故障切换的价值，以及它为什么不是一种加速手段。',
    primaryKeyword: 'BGP 机场线路',
    secondaryKeywords: ['BGP 是什么', '多线接入', '故障切换', '入口优化', 'BGP 机房'],
    audience: '看到 BGP 标签、想知道它对自己是否有用的读者',
    problem: '把 BGP 当成加速技术，期待它提升带宽。',
    answerDraft: 'BGP 描述机房多运营商接入与自动选路的能力，价值在于覆盖与容错，不是提升带宽的手段。',
    sections: [
      {
        h2: 'BGP 在这里指什么',
        points: ['机房同时接入多家运营商', '通过路由协议为不同来源选择路径', '与代理协议无关的网络层概念']
      },
      {
        h2: '对入口质量的影响',
        points: ['不同运营商用户都能找到相对合适的路径', '减少因单一上游拥堵造成的波动', '对多运营商家庭环境有帮助']
      },
      {
        h2: '故障切换的价值',
        points: ['单条上游出问题时自动切换', '缩短故障影响时间', '不等于完全不会中断']
      },
      {
        h2: '为什么不是加速手段',
        points: ['不提升带宽上限', '不改变跨境段的拥堵状况', '不影响出口 IP 的平台判定']
      },
      {
        h2: '哪些用户受益明显',
        points: ['本地路由质量波动较大的用户', '家庭宽带质量不稳定的用户', '需要较高可用性的场景']
      },
      {
        h2: '常见误解',
        points: ['把 BGP 当成线路等级标签', '认为 BGP 一定优于单线', '用 BGP 解释所有速度问题']
      }
    ],
    table: '「用户情形 → BGP 是否有帮助 → 主要理由」三列表。',
    figure: '多线接入与单线接入在上游故障时的路径对比示意图。',
    verify: ['核对 BGP 描述符合网络协议的通用定义', '确认未把 BGP 描述为加速技术'],
    faq: ['BGP 能提速吗？', 'BGP 机房一定更好吗？', '对我的网络有帮助吗？', '和中转是一回事吗？', '怎么知道机房是不是 BGP？', '会影响解锁吗？'],
    internalLinks: ['/network/', '/knowledge/node-vs-route/', '/regions/', '/glossary/airport-terms/'],
    externalSources: '网络路由协议的公开技术资料',
    updateCondition: '行业对 BGP 标签的使用方式发生变化时',
    doneCriteria: '读者能说明 BGP 解决什么问题、不解决什么问题。'
  },

  {
    id: '22',
    title: '机场中转线路工作原理',
    slug: 'network/relay-route-explained',
    category: 'network',
    pillar: '/network/',
    contentType: 'term',
    intent: 'informational',
    status: 'published',
    description:
      '中转线路的三段结构、入口质量为什么决定体感、中转带来的额外故障点，以及不同国内网络环境下的表现差异。',
    primaryKeyword: '机场中转线路',
    secondaryKeywords: ['中转是什么', '入口服务器', '落地服务器', '中转延迟', '中转与直连'],
    audience: '想理解为什么同地区节点体验差别巨大的读者',
    problem: '只看出口地区，忽略入口与中转段对实际体验的决定作用。',
    answerDraft: '中转把流量先送到入口再转发到落地，用优化链路替换默认公网路径，入口质量决定体感。',
    sections: [
      {
        h2: '三段结构',
        points: ['入口负责接收本地流量', '中转负责跨境传输', '出口负责访问目标网站']
      },
      {
        h2: '入口为什么最关键',
        points: ['与本地运营商的互联质量决定国内段表现', '晚高峰拥堵通常发生在这一段', '同一入口对不同城市用户表现不同']
      },
      {
        h2: '中转段的实现方式差异',
        points: ['基于公网隧道的中转', '基于专线的中转', '两者成本与稳定性差距很大']
      },
      {
        h2: '多一跳带来的代价',
        points: ['增加一个可能故障的环节', '中转维护时整条线路受影响', '延迟通常略高于理论最短路径']
      },
      {
        h2: '不同网络环境下的表现',
        points: ['不同运营商到同一入口的路由不同', '南北与城市差异', '移动网络与固网的差异']
      },
      {
        h2: '如何观察中转质量',
        points: ['分别测量到节点与到目标网站的延迟', '连续多天记录晚高峰表现', '对比不同入口的节点']
      }
    ],
    table: '「路径段 → 常见问题 → 观察方法」三列表。',
    figure: '入口、中转、出口三段结构的示意图，标出常见瓶颈位置。',
    verify: ['核对与节点线路文章的表述一致', '确认未给出具体延迟数字'],
    faq: ['中转一定比直连快吗？', '入口在哪里重要吗？', '为什么别人用得好我用不好？', '中转会降低安全性吗？', '怎么判断问题在哪一段？', '换节点能解决入口问题吗？'],
    internalLinks: ['/network/', '/knowledge/node-vs-route/', '/regions/', '/troubleshooting/all-nodes-timeout/'],
    externalSources: '通用网络路径测量方法的公开资料',
    updateCondition: '行业常见中转组织方式发生变化时',
    doneCriteria: '读者能判断问题出现在入口、中转还是出口段。'
  },

  {
    id: '23',
    title: '机场直连线路是什么',
    slug: 'network/direct-route-explained',
    category: 'network',
    pillar: '/network/',
    contentType: 'term',
    intent: 'informational',
    status: 'published',
    description:
      '直连线路的工作方式、成本与性能特征、受公网状况影响的机制，以及与中转线路的适用场景对比。',
    primaryKeyword: '机场直连',
    secondaryKeywords: ['直连线路', '直连与中转', '公网路径', '直连优缺点', '低成本线路'],
    audience: '预算有限或想理解不同线路组织方式差别的读者',
    problem: '把直连简单等同于「差」，忽略它在特定条件下的优势。',
    answerDraft: '直连指客户端直接连接落地服务器，路径最短成本最低，但完全依赖公网状况，波动明显。',
    sections: [
      {
        h2: '直连的工作方式',
        points: ['没有中转环节，路径最短', '完全依赖默认公网路由', '结构简单，故障点最少']
      },
      {
        h2: '成本与性能特征',
        points: ['成本最低，常见于入门套餐', '网络空闲时表现可以很好', '不需要额外的入口资源']
      },
      {
        h2: '受公网状况影响的机制',
        points: ['跨境段拥堵直接反映为掉速', '路由策略调整会改变实际路径', '晚高峰波动通常大于中转']
      },
      {
        h2: '适合的使用场景',
        points: ['轻量浏览与低频使用', '对波动容忍度较高的场景', '作为备用而非主力']
      },
      {
        h2: '与中转的对比',
        points: ['直连路径短但不可控', '中转路径长但可优化', '两者不是优劣关系而是取舍']
      },
      {
        h2: '如何判断自己适合哪种',
        points: ['统计自己对波动的实际容忍度', '记录高频使用时段', '用连续观察数据而非单次测速判断']
      }
    ],
    table: '「对比项 → 直连 → 中转」三列对照表。',
    figure: '直连与中转路径的对比示意图。',
    verify: ['确认与中转文章表述互补而非重复', '确认未给出具体性能数字'],
    faq: ['直连是不是就是差？', '什么时候直连更好？', '为什么晚上特别不稳？', '直连便宜多少？', '能作为主力吗？', '怎么知道自己用的是直连？'],
    internalLinks: ['/network/', '/network/relay-route-explained/', '/compare/', '/knowledge/node-vs-route/'],
    externalSources: '无需外部来源',
    updateCondition: '行业对直连线路的常见定位发生变化时',
    doneCriteria: '读者能说出直连的适用边界并判断自己是否适合。'
  },

  {
    id: '24',
    title: '原生 IP 和住宅 IP 节点区别',
    slug: 'network/native-ip-vs-residential-ip',
    category: 'network',
    pillar: '/network/',
    contentType: 'comparison',
    intent: 'informational',
    status: 'published',
    description:
      '原生 IP 与住宅 IP 的定义差异、识别方法、在流媒体与 AI 平台上的不同作用，以及价格与营销误区。',
    primaryKeyword: '原生IP节点',
    secondaryKeywords: ['住宅IP', '广播IP', '机房IP', 'IP 信誉', '出口IP类型'],
    audience: '关心平台判定结果、想弄清 IP 类型差别的读者',
    problem: '把原生 IP 与住宅 IP 当成同一件事，导致选择方向错误。',
    answerDraft: '原生 IP 强调注册地与机房地区一致，住宅 IP 强调归属类型为家庭宽带，两者解决的问题不同。',
    sections: [
      {
        h2: '两个概念的定义',
        points: ['原生 IP：注册地与实际机房地区一致', '住宅 IP：归属家庭宽带运营商', '两者可以同时成立也可以互不相干']
      },
      {
        h2: '识别方法',
        points: ['通过 IP 归属查询确认注册地区', '通过归属类型判断是机房还是住宅', '提醒查询结果本身也可能滞后']
      },
      {
        h2: '在流媒体上的作用',
        points: ['地区判定主要看注册地是否一致', '使用密度影响是否被标记', '住宅 IP 不必然带来更好的解锁结果']
      },
      {
        h2: '在 AI 平台上的作用',
        points: ['风控更看重 IP 类型与历史信誉', '住宅 IP 在注册与验证环节更有优势', '日常使用通常不需要住宅 IP']
      },
      {
        h2: '价格与可用性差异',
        points: ['住宅 IP 带宽有限且价格高', '原生 IP 成本高于广播 IP', '高成本通常反映在流量倍率上']
      },
      {
        h2: '常见营销误区',
        points: ['把两个词混用制造高端印象', '宣称原生 IP 就能永久解锁', '用 IP 类型掩盖线路结构不透明']
      }
    ],
    table: '「IP 类型 → 定义 → 主要影响 → 常见代价」四列对照表。',
    figure: 'IP 类型与平台判定关系的示意图。',
    verify: ['核对定义与词典一致', '确认未对具体地区可用性作出结论', '确认未推荐任何品牌'],
    faq: ['原生 IP 和住宅 IP 哪个好？', '怎么查自己的出口类型？', '住宅 IP 值得多花钱吗？', '原生 IP 能保证解锁吗？', '广播 IP 是什么？', '为什么倍率更高？'],
    internalLinks: ['/network/', '/streaming/', '/ai-access/', '/glossary/airport-terms/'],
    externalSources: 'IP 地址注册与归属查询相关的公开资料',
    updateCondition: '行业对 IP 类型的叫法或平台判定机制发生变化时',
    doneCriteria: '读者能区分四种出口 IP 类型并说出各自的适用场景。'
  }
]
