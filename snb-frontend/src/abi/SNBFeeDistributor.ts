export const SNB_FEE_DISTRIBUTOR_ABI = [
  /* ========================
     基础信息
  ======================== */

  "function snb() view returns (address)",
  "function lpMining() view returns (address)",
  "function rewardPool() view returns (address)",

  /* ========================
     分发比例（可选展示）
  ======================== */

  "function lpShare() view returns (uint256)",
  "function buybackShare() view returns (uint256)",
  "function liquidityShare() view returns (uint256)",
  "function rewardShare() view returns (uint256)",

  /* ========================
     统计数据（你 Stats 页真正该用的）
  ======================== */

  // 累计分发总量
  "function totalDistributed() view returns (uint256)",

  // 累计分发到 LPMining
  "function totalDistributedToLP() view returns (uint256)",

  // 累计分发到 RewardPool（含推荐基数）
  "function totalDistributedToReward() view returns (uint256)",

  /* ========================
     分发执行
  ======================== */

  // ⚠️ 注意：需要传 trader 地址
  "function distribute(address trader)",
] as const;
