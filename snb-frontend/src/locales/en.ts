export default {
  common: {
    loading: "Loading...",
    confirm: "Confirm",
    cancel: "Cancel",
    copy: "Copy",
    copied: "Copied",
  },

  nav: {
    dashboard: "Dashboard",
    zap: "Zap Liquidity",
    mining: "Mining",
    referral: "Referral",
    stats: "Stats",
    whitepaper: "Whitepaper",
    overview: "Overview",
  },
  
  
  home: {
    hero: {
      title: "SNB DeFi Infrastructure",
      subtitle: "An Automated Liquidity & Mining System",
      ctaMining: "Start Mining",
      desc: "Trade → Liquidity → Mining → Rewards. All automated on-chain.",
      ctaZap: "Liquidity Zap",
      statusLabel: "Protocol status:",
      statusValue: "Live on BNB Chain",
      ctaBadgeFast: "FASTEST ENTRY",
      ctaZapDesc: "Fastest way to enter SNB",
      manifestoTitle:
      "Reject dystopian narratives. Rediscover the lost soul of Crypto.",
      value:
      "Crypto is the last line of defense against digital authoritarianism, preserving diversity and freedom in technology.",
      manifestoGoal:
      "Our core mission: to build a fully decentralized application.",
      join: "Join us. Start here.",
      ctaPrimary: "Get Started",
      ctaSecondary: "Protocol Design",
      eyebrow: "DECENTRALIZED LIQUIDITY INFRASTRUCTURE",
    },
    tokenInfo: {
  title: "Token Information",
  name: "Token Name",
  symbol: "Symbol",
  network: "Network",
  contract: "Contract"
},
tokenomics: {
  title: "Tokenomics",
  totalSupply: "Total Supply",
  buyTax: "Buy Tax",
  sellTax: "Sell Tax",
  lpMining: "LP Mining",
  lpMiningDesc: "Earn rewards by staking LP",
  referral: "Referral System",
  referralDesc: "Invite friends and earn bonuses"
},

    trust: {
      rule1: {
        title: "Cannot Custody User Funds",
        desc: "The protocol has no ability to take custody of user assets. Funds remain under user-controlled wallets at all times.",
      },
      rule2: {
        title: "Cannot Modify Core Rules",
        desc: "Core protocol logic and reward formulas cannot be arbitrarily changed after deployment.",
      },
      rule3: {
        title: "Cannot Restrict Participation",
        desc: "No whitelist or approval is required to participate. Any address can interact with the protocol.",
      },
      rule4: {
        title: "Cannot Bypass Transparency",
        desc: "All state changes are recorded on-chain and are permanently auditable by anyone.",
      },
    },

    cta: {
      mining: "Start Mining",
      zap: "One-click Liquidity",
    },

    how: {
      title: "How SNB Works",
      subtitle: "A complete loop from trading to liquidity, mining, and incentives",

      trade: {
        title: "Trade Fee Redistribution",
        desc: "Every SNB transfer triggers an on-chain tax. Fees are automatically routed to the reward system.",
      },

      zap: {
        title: "One-click Liquidity",
        desc: "Add liquidity with BNB in a single transaction. No manual swap, no LP handling.",
      },

      mining: {
        title: "LP Mining with Lock Protection",
        desc: "LP tokens are automatically staked into mining pools. Minimum lock prevents short-term farming abuse.",
      },

      referral: {
        title: "Referral Rewards",
        desc: "Referral relationships are permanently recorded on-chain. Rewards are distributed automatically.",
      },
    },

    start: {
      title: "Get Started with SNB",
      subtitle: "Choose your entry point and start using the SNB ecosystem",
      mining: "Enter Mining",
      miningDesc: "Stake LP tokens and earn SNB rewards",
      zap: "Join via Zap",
      zapDesc: "One-click add liquidity and auto-stake",
      stats: "View Stats",
      statsDesc: "Explore protocol data and performance",
    },

    security: {
      title: "Security & Transparency",
      fact1: {
        title: "Fully On-Chain Execution",
        desc: "All core logic is executed by immutable smart contracts. No off-chain scripts or manual intervention are involved.",
      },
      fact2: {
        title: "Deterministic Reward Distribution",
        desc: "Mining and referral rewards are calculated algorithmically and distributed according to predefined rules.",
      },
      fact3: {
        title: "Anti-Abuse Lock Mechanisms",
        desc: "Stake lock periods and withdrawal constraints are enforced at the contract level to prevent short-term abuse.",
      },
      fact4: {
        title: "Publicly Verifiable",
        desc: "All contracts, transactions, and reward flows can be independently verified via block explorers.",
      },
    },
    footer: {
       tagline: "An on-chain liquidity and mining infrastructure.",
       protocol: "PROTOCOL",
       zap: "Zap Liquidity",
       mining: "Mining",
       stats: "Stats",
       verify: "VERIFY",
    },
  },



  dashboard: {
    title: "Dashboard",
    totalLP: "Total LP",
    myLP: "My LP",
    pendingRewards: "Pending Rewards",
  },

  zap: {
    title: "Zap Liquidity",
    pay: "Pay (BNB)",
    tip: "Will be split automatically and added as LP",
    estimatedSNB: "Estimated SNB",
    estimatedLP: "Estimated LP",
    addLiquidity: "Add Liquidity",
    zapping: "Zapping...",
    autoStakeTip: "A portion of BNB will be automatically swapped to SNB and added as liquidity. The resulting LP tokens will be automatically staked to earn mining rewards.",
    poolLimit: "Pool depth limit, max allowed {{value}} BNB",
    maxTip: "Maximum addable: {max} BNB (based on current pool)",
    maxExceeded: "Pool depth limit exceeded. Max allowed: {max} BNB",
    maxTipHelp:
    "To avoid price impact and failed transactions, single zap liquidity is limited to a safe percentage of current pool depth.",
  },

  mining: {
    title: "Mining",
    stakedLP: "Staked LP",
    pendingReward: "Pending Reward",
    claim: "Claim Reward",
    claiming: "Claiming...",
    unstake: "Unstake LP",
    confirmUnstake: "Withdraw all staked LP?",
    noStake: "No LP staked",
    unstaking: "Unstaking...",
    walletLP: "Wallet LP Balance",
    stake: "Stake LP",
    staking: "Staking...",
    invalidAmount: "Invalid amount",
    exceedWalletLP: "Exceeds wallet LP balance",
    unstakeRule: "After staking, unstaking requires waiting {blocks} blocks",
    unstakeLocked: "LP is locked, available to unstake in ~{minutes} minutes",
    stakeAmount: "Enter stake amount",
    unstakeAmount: "Enter unstake amount",
    tooEarly: "Not yet available for claiming",
    insufficientLP: "Insufficient LP balance",
  },

  

  stats: {
    title: "Protocol Stats",
    circulating: "Circulating Supply",
    burned: "Burned Supply",
    totalDistributed: "Total Rewards Distributed",
    irreversible: "Irreversibly burned on-chain",
    onchainNote: "All metrics are derived directly from on-chain data.",
    totalFees: "Total Fees Distributed",
    totalLPStaked: "Total LP Staked"
  },

  wallet: {
    connect: "Connect Wallet",
    connected: "Connected",
    switchNetwork: "Switch Network",
    connecting: "Connecting...",
    wrongNetwork: "Please switch to BNB Chain to continue",
    connectFailed: "Unable to connect wallet",
    install: "Install a wallet",
    noProvider: "No wallet detected. Please install a compatible wallet.",
    ios: {
    metamask_soft_hint:
      "iOS users: TokenPocket / imToken recommended",
  },
  },

  tx: {
  sending: "Sending transaction...",
  confirming: "Waiting for confirmation...",
  pending: "Transaction pending",
  success: "Transaction successful",
  submitted: "Transaction submitted",
  rejected: "Transaction rejected by user",
  failed: "Transaction failed",
  reverted: "Transaction reverted",
  outOfGas: "Insufficient gas fee",
  
  unknown: "Transaction failed. Please try again",
},

  

  // ===== Referral Page =====
  referral: {
    title: "Referral",
    subtitle: "Bind a referrer and earn rewards from on-chain activity",

    myReferrer: "My Referrer",
    notBound: "Not bound",

    bindTitle: "Bind Referrer",
    bindPlaceholder: "Enter referrer address (0x...)",
    binding: "Binding...",
    confirm: "Confirm",

    myInvitees: "My Invitees",
    noInvitees: "No invitees yet",

    rewardsTitle: "Referral Rewards",

    ruleOne: "Each user can bind <b>one referrer only</b>",
    ruleEarn: "Referrer earns a percentage of:",
    ruleLP: "LP mining rewards",
    ruleFee: "Trading fee rewards",
    ruleAuto: "Rewards are distributed automatically on-chain",
    ruleNoClaim: "No action required to claim referral rewards",

    noteToken: "📌 Referral rewards are paid in SNB tokens",
    noteActivity: "📌 Rewards depend on actual on-chain activity",
    invalidAddress: "Invalid address",
    bindSuccess: "Referrer bound successfully",
    // === Network overview ===
  networkTitle: "Your Referral Network",
  networkReferrer: "Referrer",
  networkLevel1: "Level 1",
  networkLevel2: "Level 2",

  // === Lists ===
  level1Title: "Level 1 Referrals",
  level2Title: "Level 2 Referrals",
  level1Empty: "No direct referrals yet",
  level2Empty: "No indirect referrals yet",

  // === Rewards ===

  rewardRuleLevel1:
    "Direct referrals earn 10% of their mining rewards",
  rewardRuleLevel2:
    "Indirect referrals earn 5% of their mining rewards",
  rewardAuto: "Rewards are distributed automatically on-chain",
  rewardNoClaim: "No manual claim required",
  rewardToken: "Rewards are paid in SNB tokens",
  rewardActivity:
    "Rewards depend on actual on-chain activity",
  rewardsCardTitle: "Referral Rewards",
  rewardsTotal: "Total Earned",
  rewardsLast: "Reward grading display",
  rewardsLevel1: "Level 1",
  rewardsLevel2: "Level 2"
  },


whitepaper: {
  title: "SNB Whitepaper",

  overview: {
    title: "Overview",
    content:
      "SNB is a decentralized DeFi infrastructure protocol built on BNB Chain, designed to provide sustainable liquidity incentives and transparent on-chain reward distribution.\n\n" +
      "Unlike yield-driven systems that rely on aggressive inflation or fixed APY promises, SNB adopts a deterministic and contract-enforced incentive model. All core logic, including token supply constraints, reward distribution, and referral incentives, is executed entirely on-chain.\n\n" +
      "The protocol prioritizes long-term value alignment between liquidity providers, protocol participants, and the underlying token economy, while minimizing governance complexity and discretionary intervention.",
  },

  token: {
    title: "Token Architecture",
    content:
      "SNB is a BEP-20 compliant token with a fixed total supply of 100,000,000 SNB. No additional minting is possible after deployment, ensuring strict supply predictability.\n\n" +
      "Protocol-related fee logic is implemented directly at the token contract level and is triggered only during predefined protocol-aligned on-chain interactions, such as liquidity operations or system-defined executions. Standard peer-to-peer transfers between wallets are not subject to additional fees.\n\n" +
      "All fee rules are immutable and enforced entirely on-chain, ensuring that protocol value flows remain transparent, verifiable, and resistant to off-chain control or manual intervention.",
  },

  economics: {
    title: "Token Economics & Fee Flow",
    content:
      "All protocol-generated fees are routed to the Fee Distributor contract.\n\n" +
      "These fees originate exclusively from predefined protocol interactions and are not derived from arbitrary token transfers. The Fee Distributor allocates collected value across liquidity incentives, reward distribution mechanisms, referral incentives, and other system-aligned components.\n\n" +
      "This design ensures that protocol revenue is recycled back into the ecosystem in a deterministic manner, without relying on inflationary emissions or discretionary redistribution.",
  },

  liquidity: {
    title: "Liquidity & Zap Design",
    content:
      "Liquidity can be added to SNB pools either manually or through the SNB Zap contract.\n\n" +
      "The Zap mechanism abstracts complex multi-step liquidity provision into a single on-chain transaction, automatically converting assets and adding liquidity on behalf of the user. This reduces friction, minimizes user error, and improves capital efficiency.\n\n" +
      "All Zap operations are executed fully on-chain and interact directly with underlying liquidity pools, without custody or off-chain execution.",
  },

  mining: {
    title: "LP Mining Mechanism",
    content:
      "Liquidity providers can stake LP tokens to earn SNB rewards through the LP Mining contract.\n\n" +
      "Rewards are distributed linearly over time based on stake proportion and duration. There is no fixed APY, and reward rates dynamically reflect actual protocol activity.\n\n" +
      "This model avoids unsustainable yield promises and mitigates short-term speculative behavior, aligning incentives toward long-term liquidity participation.",
  },

  referral: {
    title: "Referral Incentive System",
    content:
      "SNB includes an optional on-chain referral system designed to incentivize organic user growth.\n\n" +
      "Each address may bind a single referrer, and referral relationships are immutable once set. Referral rewards are derived exclusively from protocol-generated fees rather than token inflation.\n\n" +
      "This structure discourages referral abuse while maintaining transparent and verifiable reward attribution on-chain.",
  },

  risk: {
    title: "Risk Disclosure",
    content:
      "Participation in DeFi protocols involves inherent risks, including but not limited to smart contract vulnerabilities, market volatility, and liquidity risks.\n\n" +
      "While SNB’s contracts are designed to minimize discretionary control and enforce deterministic behavior, no system can be considered entirely risk-free.\n\n" +
      "Users should assess their own risk tolerance and conduct independent evaluation before interacting with the protocol.",
  },

  phase2: {
    architecture: {
      title: "Protocol Architecture",
      content: `
SNB is designed as a modular, on-chain protocol composed of multiple specialized contracts, each with clearly defined responsibilities.

At the core of the system is the SNB token contract, which defines immutable supply constraints and protocol-level fee rules applied only to specific execution paths. Surrounding it are auxiliary contracts responsible for liquidity zapping, LP mining, fee distribution, and referral tracking.

All contracts interact through explicit and permissioned interfaces. Ordinary wallet-to-wallet transfers are not affected by protocol fee logic, ensuring predictable and user-friendly token behavior.

This modular architecture minimizes systemic risk, improves auditability, and prioritizes long-term protocol resilience over short-term feature density.
      `,
    },

    feeFlow: {
      title: "Fee Flow & Value Recycling",
      content: `
All economic value within the SNB protocol originates from real, protocol-defined on-chain activity.

Fees are generated exclusively during specific protocol interactions and routed to the Fee Distributor contract. These fees are not abstract emissions or algorithmic rewards, but concrete value derived from usage.

From there, value is redistributed to liquidity providers, mining participants, and referral incentives according to immutable contract rules. SNB does not guarantee fixed yields, ensuring that incentives scale naturally with protocol adoption.

By recycling usage-derived value back into contributors, SNB establishes a closed-loop economic system without reliance on continuous external inflows.
      `,
    },

    incentives: {
      title: "Incentive Alignment",
      content: `
SNB is designed around the principle that long-term protocol health depends on aligned incentives rather than maximum participation.

Liquidity providers, miners, and referrers share the same underlying fee pool, directly linking rewards to protocol usage. There are no artificially boosted APYs, unlimited emissions, or preferential treatment for early participants.

The protocol favors quality of participation over quantity, aligning incentives toward sustained engagement.
      `,
    },

    governance: {
      title: "Governance Philosophy",
      content: `
SNB intentionally minimizes governance complexity.

Core economic parameters are embedded directly into smart contracts and are not subject to frequent modification. This reduces governance attack surfaces and provides predictable protocol behavior.

Any future governance mechanisms, if introduced, will focus on extending functionality rather than altering foundational economic rules.

In SNB, governance is treated as a responsibility, not a feature.
      `,
    },

    upgrade: {
      title: "Upgrade Path & Future Scope",
      content: `
Core token economics, fee mechanisms, and distribution logic are intended to remain stable and immutable.

Future development will focus on adding new modules or integrations that interact with the existing system without altering its core assumptions.

SNB aims to remain a reliable, composable building block within the broader decentralized finance ecosystem.
      `,
    },

    ownership: {
      title: "Ownership & Control",
      content: `
SNB Protocol is designed with a progressive decentralization model.

During the initial deployment phase, limited owner privileges exist solely for parameter calibration and risk mitigation.

Once the protocol reaches operational stability, all owner privileges will be permanently renounced on-chain, making SNB a fully autonomous and non-custodial system.

All ownership changes are transparent and verifiable via on-chain transactions.
      `,
    },
  },
}




};
