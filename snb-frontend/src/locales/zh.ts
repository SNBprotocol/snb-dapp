export default {
  common: {
    loading: "加载中…",
    confirm: "确认",
    cancel: "取消",
    copy: "复制",
    copied: "已复制",
  },

  nav: {
    dashboard: "首页",
    zap: "一键流动性",
    mining: "挖矿",
    referral: "推荐",
    stats: "数据",
    whitepaper: "白皮书",
    overview: "概览",
  },
  
  

  home: {
    hero: {
      title: "SNB DeFi Infrastructure",
      subtitle: "一套全自动的流动性与挖矿收益系统",
      ctaMining: "开始挖矿",
      ctaZap: "一键添加流动性",
      desc: "交易 → 流动性 → 挖矿 → 收益，全部由链上合约自动完成。",
      statusLabel: "协议状态：",
      statusValue: "已在BNB Chain上线",
      ctaBadgeFast: "最快入口",
      ctaZapDesc: "进入 SNB 的最快方式",
      manifestoTitle: "拒绝末日剧本，寻找Crypto失落的灵魂",
      value:
      "Crypto是对抗数字化极权、保持技术世界多样性与自由的防线",
      manifestoGoal:
      "我们的核心目标：构建一个完全去中心化的应用",
      join: "加入我们，从这里开始",
      ctaPrimary: "立即开始",
      ctaSecondary: "了解机制",
      eyebrow: "一个自运行的去中心化金融协议",

    },
    tokenInfo: {
  title: "代币信息",
  name: "代币名称",
  symbol: "代币符号",
  network: "网络",
  contract: "合约地址"
},
tokenomics: {
  title: "代币经济模型",
  totalSupply: "总供应量",
  buyTax: "买入税",
  sellTax: "卖出税",
  lpMining: "LP 挖矿",
  lpMiningDesc: "通过质押 LP 获得奖励",
  referral: "推荐系统",
  referralDesc: "邀请好友获得奖励"
},

    trust: {
      rule1: {
        title: "无法托管用户资产",
        desc: "协议本身不具备托管用户资金的能力，资产始终由用户钱包完全控制。",
      },
      rule2: {
        title: "无法随意修改规则",
        desc: "核心协议逻辑与奖励公式在部署后不可被任意更改。",
      },
      rule3: {
        title: "无法限制参与资格",
        desc: "协议无需白名单或许可，任何地址均可自由参与。",
      },
      rule4: {
        title: "无法绕过透明性",
        desc: "所有状态变更均永久记录在链上，任何人均可审计。",
      },
    },

    cta: {
      mining: "开始挖矿",
      zap: "一键添加流动性",
    },

    how: {
      title: "SNB 如何运作",
      subtitle: "从交易到流动性，再到挖矿与激励的完整闭环",

      trade: {
        title: "交易手续费回流",
        desc: "每一笔 SNB 交易都会自动扣税，手续费将回流至奖励分发系统。",
      },

      zap: {
        title: "一键添加流动性",
        desc: "使用 BNB 一键添加 SNB 流动性，无需手动兑换、配对或授权。",
      },

      mining: {
        title: "LP 挖矿与锁仓保护",
        desc: "LP 将自动进入挖矿池，最小锁仓机制有效防止短期套利行为。",
      },

      referral: {
        title: "推荐奖励机制",
        desc: "推荐关系永久记录在链上，奖励自动分发，无需人工结算。",
      },
    },

    start: {
      title: "开始使用 SNB",
      subtitle: "选择你的入口，开始参与 SNB 生态",
      mining: "进入挖矿",
      miningDesc: "质押 LP 代币，赚取 SNB 奖励",
      zap: "一键参与",
      zapDesc: "一键添加流动性并自动质押",
      stats: "查看数据",
      statsDesc: "查看协议运行与收益数据",
    },

    security: {
      title: "安全性与透明度",
      fact1: {
        title: "完全链上执行",
        desc: "所有核心逻辑均由不可变的智能合约执行，不依赖任何链下脚本或人工操作。",
      },
      fact2: {
        title: "确定性奖励分配",
        desc: "挖矿与推荐奖励完全基于合约算法计算，并按既定规则自动分发。",
      },
      fact3: {
        title: "防滥用锁定机制",
        desc: "质押锁定期与提现限制在合约层强制执行，用于防止短期套利行为。",
      },
      fact4: {
        title: "可公开验证",
        desc: "所有合约、交易与奖励流向均可通过区块浏览器独立验证。",
      },
    },
    footer: {
        tagline: "一个完全链上的流动性与挖矿基础设施。",
        protocol: "协议",
        zap: "一键流动性",
        mining: "挖矿",
        stats: "数据",
        verify: "验证",
  },

  },



  dashboard: {
    title: "仪表盘",
    totalLP: "总锁仓量",
    myLP: "我的 LP",
    pendingRewards: "待领取奖励",
  },

  zap: {
    title: "一键添加流动性",
    pay: "支付 (BNB)",
    tip: "将自动拆分并添加为 LP",
    estimatedSNB: "预计获得 SNB",
    estimatedLP: "预计获得 LP",
    addLiquidity: "添加流动性",
    zapping: "处理中…",
    autoStakeTip: "部分BNB将被自动兑换为SNB并添加为流动性，LP将自动质押以获得挖矿收益",
    poolLimit: "当前池子深度限制，最大可添加 {{value}} BNB",
    maxTip: "最大可添加：{max} BNB（基于当前池子）",
    maxExceeded: "当前池子深度限制，最大可添加 {max} BNB",
    maxTipHelp:
    "为避免价格冲击和交易失败，单次添加流动性会限制在当前池子深度的安全范围内。",
  },

  mining: {
    title: "挖矿",
    stakedLP: "已质押 LP",
    pendingReward: "待领取奖励",
    claim: "领取奖励",
    claiming: "领取中…",
    unstake: "解除质押",
    confirmUnstake: "确认解除全部质押的 LP？",
    noStake: "当前没有质押的 LP",
    unstaking: "解除质押中…",
    walletLP: "钱包 LP 余额",
    stake: "质押 LP",
    staking: "质押中...",
    invalidAmount: "数量不合法",
    exceedWalletLP: "超过钱包 LP 余额",
    unstakeRule: "完成质押后，解除质押需要等待 {blocks} 个区块",
    unstakeLocked: "LP 已锁定，预计 {minutes} 分钟后可解除质押",
    stakeAmount: "请输入质押数量",
    unstakeAmount: "请输入解除质押数量",
    tooEarly: "当前还未到可领取时间",
    insufficientLP: "LP 余额不足",
  },

  

  stats: {
    title: "协议数据",
    circulating: "流通量",
    burned: "已销毁数量",
    totalDistributed: "已分发奖励",
    irreversible: "通过链上机制永久销毁",
    onchainNote: "所有数据均直接来源于链上合约。",
    totalFees: "协议历史手续费总额",
    totalLPStaked: "LP 挖矿总质押量"
  },

  wallet: {
    connect: "连接钱包",
    connected: "已连接",
    switchNetwork: "切换网络",
    connecting: "连接中...",
    wrongNetwork: "当前网络不正确，请切换至 BNB Chain",
    connectFailed: "无法连接钱包，请重试",
    install: "请安装兼容的钱包",
    noProvider: "未检测到钱包，请安装兼容的钱包，推荐使用 TokenPocket 或 imToken 等移动端钱包。",
    ios: {
    metamask_soft_hint:
      "iOS 用户建议使用 TokenPocket 或 imToken",
  },
  },

  tx: {
  sending: "交易发送中...",
  confirming: "等待区块确认中...",
  pending: "交易处理中",
  success: "交易成功",
  submitted: "交易已提交",
  rejected: "交易已被用户取消",
  failed: "交易失败",
  reverted: "交易执行失败",
  outOfGas: "Gas 不足，交易无法完成",

  unknown: "交易失败，请重试",
},

  referral: {
    title: "推荐",
    subtitle: "绑定推荐人，参与链上活动即可获得推荐奖励",

    myReferrer: "我的推荐人",
    notBound: "未绑定",

    bindTitle: "绑定推荐人",
    bindPlaceholder: "输入推荐人地址（0x...）",
    binding: "绑定中...",
    confirm: "确认绑定",

    myInvitees: "我的下级",
    noInvitees: "暂无下级用户",

    rewardsTitle: "推荐奖励说明",

    ruleOne: "每个用户<b>只能绑定一个推荐人</b>",
    ruleEarn: "推荐人可获得以下奖励分成：",
    ruleLP: "LP 挖矿收益",
    ruleFee: "交易手续费收益",
    ruleAuto: "奖励由合约自动分发",
    ruleNoClaim: "无需手动领取推荐奖励",

    noteToken: "📌 推荐奖励以 SNB 代币发放",
    noteActivity: "📌 实际奖励取决于真实链上行为",
    invalidAddress: "无效的地址",
    bindSuccess: "推荐人绑定成功",
    // === 网络概览 ===
  networkTitle: "我的推荐网络",
  networkReferrer: "我的推荐人",
  networkLevel1: "一级下级",
  networkLevel2: "二级下级",

  // === 下级列表 ===
  level1Title: "一级推荐用户",
  level2Title: "二级推荐用户",
  level1Empty: "暂无一级下级",
  level2Empty: "暂无二级下级",

  // === 推荐奖励说明 ===

  rewardRuleLevel1:
    "一级推荐可获得其挖矿奖励的 10%",
  rewardRuleLevel2:
    "二级推荐可获得其挖矿奖励的 5%",
  rewardAuto: "奖励由合约自动分发",
  rewardNoClaim: "无需手动领取",
  rewardToken: "推荐奖励以 SNB 代币发放",
  rewardActivity:
    "实际奖励取决于真实链上行为",
  rewardsCardTitle: "推荐奖励",
  rewardsTotal: "累计获得",
  rewardsLast: "奖励分级展示",
  rewardsLevel1: "一级",
  rewardsLevel2: "二级"
  },

whitepaper: {
  title: "SNB 白皮书",

  overview: {
    title: "项目概述",
    content:
      "SNB 是一个构建于 BNB Chain 之上的去中心化 DeFi 基础设施协议，旨在提供可持续的流动性激励机制与完全透明的链上收益分配体系。\n\n" +
      "不同于依赖高通胀或固定 APY 承诺的收益型协议，SNB 采用确定性、合约级约束的激励模型。包括代币供给限制、奖励分发与推荐激励在内的所有核心逻辑，均由智能合约在链上自动执行。\n\n" +
      "协议设计强调流动性提供者、参与用户与代币经济之间的长期价值一致性，同时尽量减少治理复杂度与人为干预空间。",
  },

  token: {
    title: "代币架构",
    content:
      "SNB 是符合 BEP-20 标准的代币，总发行量固定为 100,000,000 枚，合约部署完成后不再具备任何增发能力，确保供给的可预测性。\n\n" +
      "协议相关的费用逻辑在代币合约层面实现，仅在协议预定义的链上交互场景中触发，例如流动性操作或系统级执行路径。普通的钱包点对点转账不收取任何额外费用。\n\n" +
      "所有费用规则均由合约不可变地强制执行，确保协议价值流转过程公开透明、可验证，并具备抗链下干预能力。",
  },

  economics: {
    title: "代币经济与费用流转",
    content:
      "SNB 协议产生的所有费用均来源于协议定义的链上交互行为，而非普通转账。\n\n" +
      "所有协议费用将被路由至费用分配合约（Fee Distributor），并按照既定规则分配至流动性激励、奖励分发、推荐激励等模块。\n\n" +
      "该设计确保协议价值在生态内部形成可持续的闭环流转，而不依赖额外的通胀发行或人为调整。",
  },

  liquidity: {
    title: "流动性与 Zap 机制",
    content:
      "用户可通过手动方式或 SNB Zap 合约向协议添加流动性。\n\n" +
      "Zap 合约将多步骤的资产转换与流动性添加流程整合为单笔交易，自动完成资产转换并注入流动性池，从而降低使用门槛与操作复杂度。\n\n" +
      "所有 Zap 操作均在链上执行，不涉及资产托管或链下撮合。",
  },

  mining: {
    title: "LP 挖矿机制",
    content:
      "流动性提供者可将 LP 代币质押至 LP Mining 合约中，以获取 SNB 奖励。\n\n" +
      "奖励按照质押比例与时间线性分配，不设固定年化收益率，实际收益随协议状态动态变化。\n\n" +
      "该模型避免不可持续的高收益承诺，引导用户参与长期、稳定的流动性建设。",
  },

  referral: {
    title: "推荐激励系统",
    content:
      "SNB 设计了可选的链上推荐系统，用于激励用户进行自然增长。\n\n" +
      "每个地址仅可绑定一个推荐人，且关系一经建立不可更改。推荐奖励来源于协议实际产生的费用，而非额外代币发行。\n\n" +
      "该机制在控制滥用风险的同时，确保推荐收益的透明性与可验证性。",
  },

  risk: {
    title: "风险提示",
    content:
      "参与 DeFi 协议存在一定风险，包括但不限于智能合约风险、市场波动风险以及流动性风险。\n\n" +
      "尽管 SNB 的合约设计尽量减少人为干预并强调确定性执行，但任何系统均无法完全规避风险。\n\n" +
      "用户在参与前应充分了解相关机制，并根据自身风险承受能力做出判断。",
  },
  phase2: {
    architecture: {
      title: "协议整体架构",
      content: `
SNB 被设计为一个由多个专业化合约组成的模块化链上协议，每个合约均承担明确且独立的职责。

协议并未将所有逻辑集中在单一合约中，而是将代币发行、流动性注入、挖矿激励、费用分发与推荐关系拆分为独立模块。这种设计降低了系统性风险，提高了可审计性，并允许各模块在不破坏整体协议稳定性的前提下独立演进。

SNB 代币合约构成协议的核心，定义了代币供给规则与转账费用机制。围绕其构建的是流动性 Zap、LP 挖矿、奖励分发与推荐注册等辅助合约。所有交互均通过显式接口完成，避免隐式依赖或隐藏状态耦合。

该模块化架构体现了 SNB 的核心设计取向：以长期协议稳健性优先，而非短期功能堆叠。
      `,
    },

    feeFlow: {
      title: "费用流转与价值回流",
      content: `
SNB 协议中的所有经济价值均源自真实的链上使用行为。

当 SNB 代币发生交易转账时，协议会按既定规则收取一部分交易费用。这些费用并非凭空铸造的奖励，而是来源于实际的用户行为。所有收取的费用将被路由至费用分发合约，作为协议内部价值分配的核心枢纽。

随后，费用将根据协议规则分配给流动性提供者、挖矿参与者及其他激励模块。SNB 不承诺固定收益，奖励规模随协议使用情况自然变化，从机制上避免不可持续的激励模型。

通过将使用行为产生的价值回流至为协议提供稳定性的参与者，SNB 构建了一个闭环经济系统，而非依赖持续外部资金流入。
      `,
    },

    incentives: {
      title: "激励一致性设计",
      content: `
SNB 的激励机制基于一个核心理念：协议的长期健康依赖于激励一致性，而非参与人数的最大化。

流动性提供者、挖矿参与者与推荐人共享同一费用来源，其收益直接与协议整体使用情况挂钩，而非各自独立的奖励曲线。这种设计抑制了短期挖矿套利行为，降低了高通胀模型中常见的价值抽离问题。

协议不存在人为放大的 APY，不进行无限增发，也不通过牺牲后续参与者利益来补贴早期用户。真正为协议提供流动性与使用价值的参与者，才能获得相应回报。

SNB 更关注参与质量，而非参与规模。
      `,
    },

    governance: {
      title: "治理哲学",
      content: `
在当前阶段，SNB 有意降低治理复杂度。

核心经济参数被直接写入智能合约，并不频繁开放修改权限。这种设计减少了治理攻击面，避免参数随意调整带来的不确定性，并为参与者提供稳定、可预期的协议行为。

SNB 并未急于引入治理投票机制，而是优先保证规则的不可变性、透明性与自动执行。未来如引入治理机制，其目标将是扩展协议能力，而非改变其基础经济规则。

在 SNB 中，治理被视为一种责任，而不是噱头。
      `,
    },

    upgrade: {
      title: "升级边界与未来扩展",
      content: `
SNB 在设计之初便明确了协议的边界。

代币经济模型、费用机制与分配逻辑被视为协议的稳定基石，不作为频繁升级的对象。未来的发展方向将集中于新增模块、外部集成或辅助合约，在不破坏既有假设的前提下扩展协议能力。

这种约束式扩展策略避免了无节制升级与功能膨胀所带来的风险。在保持核心规则稳定的同时，SNB 为理性、可控的演进保留空间。

SNB 并不试图成为包罗万象的协议，而是致力于作为去中心化金融体系中可靠、可组合的基础模块。
      `,
    },
    ownership: {
      title: "所有权与控制机制",
      content: `SNB Protocol 采用渐进式去中心化设计模型。

在协议初始部署阶段，合约中保留的 owner 权限仅用于参数校准与风险控制，不用于任何形式的资产托管或收益干预。

当协议运行进入稳定阶段后，所有 owner 权限将通过链上交易永久放弃，使 SNB 成为一个完全自治、非托管的去中心化系统。

所有所有权变更行为均可通过链上交易进行公开验证。`,
    },
  },
}




};
