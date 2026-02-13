require("@nomicfoundation/hardhat-toolbox");
require("@nomicfoundation/hardhat-verify");
require("dotenv").config();

/**
 * ⚠️ 注意：
 * - PRIVATE_KEY：测试网 / 主网都用
 * - BSCSCAN_API_KEY：可选（合约验证用）
 */

module.exports = {
  solidity: {
    version: "0.8.20",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200,
      },
      evmVersion: "paris",
    },
  },

  networks: {
    /* =========================
       BSC 主网（你原来的）
    ========================= */
    bsc: {
  url: process.env.BSC_RPC || "",
  chainId: 56,
  accounts: process.env.PRIVATE_KEY
    ? [process.env.PRIVATE_KEY]
    : [],
},


    /* =========================
       ✅ BSC 测试网（新增）
    ========================= */
    bscTestnet: {
      url: "https://bsc-testnet.publicnode.com",
      chainId: 97,
      accounts: process.env.PRIVATE_KEY
        ? [process.env.PRIVATE_KEY]
        : [],
    },
  },

  etherscan: {
  apiKey: process.env.BSCSCAN_API_KEY,
},

};
