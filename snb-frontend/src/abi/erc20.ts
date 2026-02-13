export const ERC20_ABI = [
  // 基础信息
  "function name() view returns (string)",
  "function symbol() view returns (string)",
  "function decimals() view returns (uint8)",

  // 余额
  "function balanceOf(address owner) view returns (uint256)",

  // 授权相关
  "function allowance(address owner, address spender) view returns (uint256)",
  "function approve(address spender, uint256 amount) returns (bool)",

  // 转账（有些页面可能会用）
  "function transfer(address to, uint256 amount) returns (bool)"
];
