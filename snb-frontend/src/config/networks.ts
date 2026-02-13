/* =========================
   Chain ID
========================= */
export const CHAIN_ID = {
  BSC_MAINNET: 56,
  BSC_TESTNET: 97,
} as const;
export type ChainId = typeof CHAIN_ID[keyof typeof CHAIN_ID];

/* =========================
   Network Params（钱包用）
========================= */
export const NETWORK_PARAMS = {
  [CHAIN_ID.BSC_MAINNET]: {
    chainId: "0x38",
    chainName: "BNB Smart Chain",
    nativeCurrency: {
      name: "BNB",
      symbol: "BNB",
      decimals: 18,
    },
    rpcUrls: ["https://bsc-dataseed.binance.org/"],
    blockExplorerUrls: ["https://bscscan.com"],
  },

  [CHAIN_ID.BSC_TESTNET]: {
    chainId: "0x61",
    chainName: "BNB Smart Chain Testnet",
    nativeCurrency: {
      name: "tBNB",
      symbol: "tBNB",
      decimals: 18,
    },
    rpcUrls: ["https://bsc-testnet.publicnode.com"],
    blockExplorerUrls: ["https://testnet.bscscan.com"],
  },
};
