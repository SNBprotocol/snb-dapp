export const LP_MINING_ABI = [
  // view
  "function userInfo(address user) view returns (uint256 amount, uint256 rewardDebt, uint256 lastStakeBlock)",
  "function pendingReward(address user) view returns (uint256)",

  // user actions
  "function stake(uint256 amount)",
  "function withdraw(uint256 amount)",
  "function emergencyWithdraw()",

  // admin (可选)
  "function setZap(address zap, bool allowed)"
];
