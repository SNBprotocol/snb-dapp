import { Contract, formatUnits } from "ethers";
import { getReadProvider } from "@/lib/providers";
import { getContractAddress } from "@/config/contracts";
import { TOKENS } from "@/config/tokens";
import { CHAIN_ID } from "@/config/networks";

import { SNB_TOKEN_ABI } from "@/abi/SNBToken";
import { SNB_FEE_DISTRIBUTOR_ABI } from "@/abi/SNBFeeDistributor";
import { ERC20_ABI } from "@/abi/erc20";

/* ========================
   Types
======================== */

export type Stats = {
  circulating: number;
  burned: number;
  totalFeesDistributed: number;
  totalLPStaked: number;
};

/* ========================
   Cache
======================== */

const CACHE_TTL = 30_000;

let cachedStats: Stats | null = null;
let cachedAt = 0;
let inFlight: Promise<Stats> | null = null;

const FALLBACK: Stats = {
  circulating: 0,
  burned: 0,
  totalFeesDistributed: 0,
  totalLPStaked: 0,
};

/* ========================
   Load stats
======================== */

export async function loadStats(): Promise<Stats> {
  const now = Date.now();

  if (cachedStats && now - cachedAt < CACHE_TTL) {
    return cachedStats;
  }

  if (inFlight) {
    return inFlight;
  }

  inFlight = (async () => {
    try {
      /* ========================
         ✅ 动态获取当前链
      ======================== */

      let chainId: number = CHAIN_ID.BSC_MAINNET;

      if (typeof window !== "undefined" && window.ethereum) {
        const hex = await window.ethereum.request({
          method: "eth_chainId",
        });
        chainId = parseInt(hex, 16);
      }

      const provider = getReadProvider(chainId);
      if (!provider) {
        return cachedStats ?? FALLBACK;
      }

      /* ===== SNB Token ===== */
      const snbAddress = TOKENS[chainId]?.SNB;
      if (!snbAddress) {
        return cachedStats ?? FALLBACK;
      }

      const snb = new Contract(
        snbAddress,
        SNB_TOKEN_ABI,
        provider
      );

      let decimals = 18;
      let circulating = 0;
      let burned = 0;

      try {
        decimals = await snb.decimals();

        const totalSupplyRaw = await snb.totalSupply();
        const totalSupply = Number(
          formatUnits(totalSupplyRaw, decimals)
        );

        const BURN_ADDRESS =
          "0x000000000000000000000000000000000000dEaD";

        const burnedRaw = await snb.balanceOf(BURN_ADDRESS);
        burned = Number(
          formatUnits(burnedRaw, decimals)
        );

        circulating = Math.max(totalSupply - burned, 0);
      } catch (err) {
        console.warn("[Stats] SNB read failed", err);
      }

      /* ===== Fee Distributor ===== */
      let totalFeesDistributed = 0;

      try {
        const distributorAddress = getContractAddress(
          chainId,
          "FEE_DISTRIBUTOR"
        );

        const distributor = new Contract(
          distributorAddress,
          SNB_FEE_DISTRIBUTOR_ABI,
          provider
        );

        const raw = await distributor.totalDistributed();
        totalFeesDistributed = Number(
          formatUnits(raw, decimals)
        );
      } catch (err) {
        console.warn("[Stats] totalDistributed read failed", err);
      }

      /* ===== Total LP Staked ===== */
      let totalLPStaked = 0;

      try {
        const lpToken = new Contract(
          TOKENS[chainId].SNB_LP,
          ERC20_ABI,
          provider
        );

        const miningAddress = getContractAddress(
          chainId,
          "LP_MINING"
        );

        const [raw, lpDecimals] = await Promise.all([
          lpToken.balanceOf(miningAddress),
          lpToken.decimals(),
        ]);

        totalLPStaked = Number(
          formatUnits(raw, lpDecimals)
        );
      } catch (err) {
        console.warn("[Stats] LP balanceOf(mining) failed", err);
      }

      const result: Stats = {
        circulating,
        burned,
        totalFeesDistributed,
        totalLPStaked,
      };

      cachedStats = result;
      cachedAt = Date.now();

      return result;
    } catch (err) {
      console.warn("[Stats] load failed", err);
      return cachedStats ?? FALLBACK;
    } finally {
      inFlight = null;
    }
  })();

  return inFlight;
}
