import { Contract, getAddress, ethers } from "ethers";
import ReferralRegistryAbi from "@/abi/ReferralRegistry";
import RewardDistributorAbi from "@/abi/RewardDistributor";
import {
  getContractAddress,
  getContractStartBlock,
} from "@/config/contracts";
import { CHAIN_ID } from "@/config/networks";
import { getReadProvider, getSigner } from "@/lib/providers";

/* =========================
   Types
========================= */

export type ReferralData = {
  referrer: string | null;
  level1: string[];
  level2: string[];
};

export type ReferralRewardHistoryItem = {
  user: string;
  amount: bigint;
  level: number;
  blockNumber: number;
};

export type ReferralRewardStats = {
  total: bigint;
  level1: bigint;
  level2: bigint;
  history: ReferralRewardHistoryItem[];
};

/* =========================
   🚀 Graph（改成 Worker）
========================= */

// ❗换成你的 Worker URL
const GRAPH_URL =
  "https://api.snbprotocol.com";

/* =========================
   Cache（双缓存🔥）
========================= */

const cache = new Map<string, { data: ReferralData; at: number }>();
const inFlight = new Map<string, Promise<ReferralData>>();

const CACHE_TTL = 30_000;

// 🔥 Graph缓存
const graphCache = new Map<string, { data: any; at: number }>();
const graphInFlight = new Map<string, Promise<any>>();

const GRAPH_CACHE_TTL = 30_000;

/* =========================
   Helpers
========================= */

function empty(): ReferralData {
  return { referrer: null, level1: [], level2: [] };
}

async function getActiveChainId(provider: any): Promise<number> {
  const network = await provider.getNetwork();
  return Number(network.chainId);
}

/* =========================
   Referral network
========================= */

export async function loadReferral(user: string): Promise<ReferralData> {
  const key = user.toLowerCase();
  const now = Date.now();

  const hit = cache.get(key);
  if (hit && now - hit.at < CACHE_TTL) {
    return hit.data;
  }

  if (inFlight.has(key)) return inFlight.get(key)!;

  const task = (async () => {
    try {
      const provider = getReadProvider(CHAIN_ID.BSC_MAINNET);
      if (!provider) return empty();

      const chainId = await getActiveChainId(provider);

      const registry = new Contract(
        getContractAddress(chainId, "REFERRAL_REGISTRY"),
        ReferralRegistryAbi,
        provider
      );

      const rawReferrer: string = await registry.getReferrer(user);

      const referrer =
        rawReferrer && rawReferrer !== ethers.ZeroAddress
          ? getAddress(rawReferrer)
          : null;

      const rawLevel1 = await registry.getDirectReferrals(user);
      const level1 = rawLevel1.map(getAddress);

      const subs = await Promise.all(
        level1.map((addr) =>
          registry.getDirectReferrals(addr).catch(() => [])
        )
      );

      const level2 = subs.flat().map(getAddress);

      const result = { referrer, level1, level2 };

      cache.set(key, { data: result, at: Date.now() });

      return result;
    } catch (e) {
      console.warn("[referral] load failed", e);
      return empty();
    } finally {
      inFlight.delete(key);
    }
  })();

  inFlight.set(key, task);
  return task;
}
/* =========================
   Bind referrer
========================= */

export async function bindReferrer(referrer: string) {
  const signer = await getSigner();
  if (!signer) throw new Error("NO_WALLET");

  const network = await signer.provider!.getNetwork();
  const chainId = Number(network.chainId);

  if (chainId !== CHAIN_ID.BSC_MAINNET) {
    throw new Error("WRONG_NETWORK");
  }

  const registry = new Contract(
    getContractAddress(chainId, "REFERRAL_REGISTRY"),
    ReferralRegistryAbi,
    signer
  );

  const tx = await registry.setReferrer.populateTransaction(referrer);

  // 👉 防止 gas 估算失败
  tx.gasLimit = 150_000n;

  return signer.sendTransaction(tx);
}
/* =========================
   🔥 Graph fetch（最终版）
========================= */

async function fetchFromGraph(user: string) {
  const key = user.toLowerCase();
  const now = Date.now();

  // ✅ 缓存命中
  const hit = graphCache.get(key);
  if (hit && now - hit.at < GRAPH_CACHE_TTL) {
    console.log("🟢 Graph CACHE HIT");
    return hit.data;
  }

  // ✅ 防并发
  if (graphInFlight.has(key)) {
    console.log("🟡 Graph IN-FLIGHT");
    return graphInFlight.get(key)!;
  }

  const task = (async () => {
    try {
      console.log("🔴 Graph FETCH");

      const res = await fetch(GRAPH_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          query: `
          {
            referralRewards(
              first: 200
              where: { referrer: "${key}" }
              orderBy: blockNumber
              orderDirection: desc
            ) {
              user
              amount
              level
              blockNumber
            }
          }
        `,
        }),
      });

      if (!res.ok) {
  console.warn("Graph HTTP error", res.status);
  return null;
}

const json = await res.json();

      const data = json.data?.referralRewards || [];

      // ✅ 写缓存
      graphCache.set(key, {
        data,
        at: Date.now(),
      });

      return data;
    } catch (e) {
      console.warn("❌ Graph failed", e);
      return null;
    } finally {
      graphInFlight.delete(key);
    }
  })();

  graphInFlight.set(key, task);
  return task;
}

/* =========================
   🎯 主入口
========================= */

export async function loadReferralRewardsFinal(
  user: string
): Promise<ReferralRewardStats> {
  if (!ethers.isAddress(user)) {
    return { total: 0n, level1: 0n, level2: 0n, history: [] };
  }

  const graphData = await fetchFromGraph(user);

  // ✅ Graph 正常
  if (graphData && graphData.length > 0) {
    let total = 0n;
    let level1 = 0n;
    let level2 = 0n;

    const history: ReferralRewardHistoryItem[] = [];

    for (const item of graphData) {
      const amount = BigInt(item.amount);
      const level = Number(item.level);

      total += amount;
      if (level === 1) level1 += amount;
      if (level === 2) level2 += amount;

      history.push({
        user: item.user,
        amount,
        level,
        blockNumber: Number(item.blockNumber),
      });
    }

    return {
      total,
      level1,
      level2,
      history: history.slice(0, 20),
    };
  }

  // ❗ Graph挂了才fallback
  console.warn("⚠️ Graph empty → fallback RPC");

  return loadReferralRewardsFallback(user);
}

/* =========================
   🟡 fallback（分段扫描 + 缓存🔥）
========================= */

const fallbackCache = new Map<
  string,
  { data: ReferralRewardStats; at: number }
>();

const FALLBACK_CACHE_TTL = 20_000;

async function loadReferralRewardsFallback(
  user: string
): Promise<ReferralRewardStats> {
  const key = user.toLowerCase();
  const now = Date.now();

  // ✅ 缓存命中
  const hit = fallbackCache.get(key);
  if (hit && now - hit.at < FALLBACK_CACHE_TTL) {
    console.log("🟢 FALLBACK CACHE HIT");
    return hit.data;
  }

  try {
    const provider = getReadProvider(CHAIN_ID.BSC_MAINNET);
    if (!provider)
      return { total: 0n, level1: 0n, level2: 0n, history: [] };

    const chainId = await getActiveChainId(provider);

    const distributor = getContractAddress(
      chainId,
      "REWARD_DISTRIBUTOR"
    );

    const contract = new Contract(
      distributor,
      RewardDistributorAbi,
      provider
    );

    const iface = contract.interface;
    const topic0 = iface.getEvent("ReferralReward").topicHash;

    const latest = await provider.getBlockNumber();

    const startBlock =
      getContractStartBlock(chainId, "REWARD_DISTRIBUTOR") ??
      latest;

    const paddedUser = ethers.zeroPadValue(user, 32);

    // 🔥 分段扫描（核心）
    const STEP = 5000;

    let total = 0n;
    let level1 = 0n;
    let level2 = 0n;

    const history: ReferralRewardHistoryItem[] = [];

    console.log("🟡 fallback scanning...");

    for (let from = startBlock; from <= latest; from += STEP) {
      const to = Math.min(from + STEP, latest);

      try {
        const logs = await provider.getLogs({
          address: distributor,
          topics: [topic0, paddedUser],
          fromBlock: from,
          toBlock: to,
        });

        for (const log of logs) {
          const e = iface.parseLog(log);

          const amount = e.args.amount as bigint;
          const level = Number(e.args.level);

          total += amount;
          if (level === 1) level1 += amount;
          if (level === 2) level2 += amount;

          history.push({
            user,
            amount,
            level,
            blockNumber: log.blockNumber,
          });
        }
      } catch (err) {
        console.warn("⚠️ segment failed", from, to);
      }
    }

    const result = {
      total,
      level1,
      level2,
      history: history.slice(-20).reverse(),
    };

    // ✅ 写缓存
    fallbackCache.set(key, {
      data: result,
      at: Date.now(),
    });

    return result;
  } catch (e) {
    console.warn("❌ fallback failed", e);
    return { total: 0n, level1: 0n, level2: 0n, history: [] };
  }
}

/* =========================
   Reset
========================= */

export function resetReferralCache(user?: string) {
  if (user) {
    const key = user.toLowerCase();
    cache.delete(key);
    inFlight.delete(key);
    graphCache.delete(key);
    graphInFlight.delete(key);
  } else {
    cache.clear();
    inFlight.clear();
    graphCache.clear();
    graphInFlight.clear();
  }
}
