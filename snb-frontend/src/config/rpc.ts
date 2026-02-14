// config/rpc.ts
import { CHAIN_ID } from "@/config/networks";

export const RPC_URLS: Record<number, string[]> = {
  [CHAIN_ID.BSC_TESTNET]: [
    // ✅ 推荐优先级从上到下
    "https://bsc-testnet.publicnode.com",
    "https://data-seed-prebsc-1-s1.binance.org:8545",
    "https://data-seed-prebsc-2-s1.binance.org:8545",
  ],

  [CHAIN_ID.BSC_MAINNET]: [
    "https://rpc.ankr.com/bsc",
    "https://bsc.publicnode.com",
    "https://bsc-dataseed.binance.org",
  ],
};
