import { Contract, formatUnits } from "ethers";
import { getReadProvider } from "@/lib/providers";
import { getContractAddress } from "@/config/contracts";
import { TOKENS } from "@/config/tokens";
import { CHAIN_ID } from "@/config/networks";

const PAIR_ABI = [
  "function getReserves() view returns (uint112,uint112,uint32)",
  "function totalSupply() view returns (uint256)",
  "function token0() view returns (address)",
  "function token1() view returns (address)",
];

/* =========================
   Types
========================= */

export type ZapPoolInfo = {
  reserveBNB: number;
  reserveSNB: number;
  totalSupply: number;
};

/* =========================
   Cache
========================= */

const CACHE_TTL = 20_000;

let cache: { data: ZapPoolInfo; at: number } | null = null;
let inFlight: Promise<ZapPoolInfo> | null = null;

/* =========================
   Read pool (cached)
========================= */

export async function loadZapPool(): Promise<ZapPoolInfo> {
  const now = Date.now();

  if (cache && now - cache.at < CACHE_TTL) {
    return cache.data;
  }

  if (inFlight) {
    return inFlight;
  }

  const task = (async () => {
    try {
      /* =========================
         ✅ 动态获取当前链
      ========================== */

      let chainId: number = CHAIN_ID.BSC_MAINNET;

      if (typeof window !== "undefined" && window.ethereum) {
        const hex = await window.ethereum.request({
          method: "eth_chainId",
        });
        chainId = parseInt(hex, 16);
      }

      const provider = getReadProvider(chainId);
      if (!provider) {
        throw new Error("NO_RPC");
      }

      await provider.getBlockNumber();

      const pairAddress = getContractAddress(chainId, "SNB_LP");
      const pair = new Contract(pairAddress, PAIR_ABI, provider);

      const [reserves, totalSupply, token0, token1] =
        await Promise.all([
          pair.getReserves(),
          pair.totalSupply(),
          pair.token0(),
          pair.token1(),
        ]);

      const r0 = reserves[0];
      const r1 = reserves[1];

      const snbAddr = TOKENS[chainId].SNB.toLowerCase();

      let reserveBNB: number;
      let reserveSNB: number;

      if (token0.toLowerCase() === snbAddr) {
        reserveSNB = Number(formatUnits(r0, 18));
        reserveBNB = Number(formatUnits(r1, 18));
      } else {
        reserveBNB = Number(formatUnits(r0, 18));
        reserveSNB = Number(formatUnits(r1, 18));
      }

      const result: ZapPoolInfo = {
        reserveBNB,
        reserveSNB,
        totalSupply: Number(formatUnits(totalSupply, 18)),
      };

      cache = {
        data: result,
        at: Date.now(),
      };

      return result;
    } catch (e) {
      console.warn("[zap] loadZapPool failed", e);
      if (cache) return cache.data;

      return {
        reserveBNB: 0,
        reserveSNB: 0,
        totalSupply: 0,
      };
    } finally {
      inFlight = null;
    }
  })();

  inFlight = task;
  return task;
}
