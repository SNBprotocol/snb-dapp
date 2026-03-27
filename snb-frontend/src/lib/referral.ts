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
   Graph Config
========================= */

const GRAPH_URL =
  "https://api.studio.thegraph.com/query/1745272/snb-referral/v0.0.1";

/* =========================
   Cache（新增 Graph缓存🔥）
========================= */

const cache = new Map<string, { data: ReferralData; at: number }>();
const inFlight = new Map<string, Promise<ReferralData>>();

const CACHE_TTL = 30_000;

// 👉 Graph缓存（关键）
const graphCache = new Map<
  string,
  { data: any; at: number }
>();

const GRAPH_CACHE_TTL = 10000; // 10秒

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
   Load referral network
========================= */

export async function loadReferral(user: string): Promise<ReferralData> {
  const now = Date.now();
  const key = user.toLowerCase();

  if (cache.get(key) && now - cache.get(key)!.at < CACHE_TTL) {
    return cache.get(key)!.data;
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

      const rawLevel1: string[] =
        await registry.getDirectReferrals(user);

      const level1 = rawLevel1.map(getAddress);

      const subsList = await Promise.all(
        level1.map((addr) =>
          registry.getDirectReferrals(addr).catch(() => [])
        )
      );

      const level2 = subsList.flat().map(getAddress);

      const result: ReferralData = { referrer, level1, level2 };
      cache.set(key, { data: result, at: Date.now() });

      return result;
    } catch (e) {
      console.warn("[referral] loadReferral failed", e);
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
  tx.gasLimit = 150_000n;

  return signer.sendTransaction(tx);
}

/* =========================
   🟢 Graph 查询（已加缓存🔥）
========================= */

async function fetchFromGraph(user: string) {
  const key = user.toLowerCase();

  // 👉 命中缓存
  const hit = graphCache.get(key);
  if (hit && Date.now() - hit.at < GRAPH_CACHE_TTL) {
    return hit.data;
  }

  try {
    const res = await fetch(GRAPH_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        query: `
        {
          referralRewards(
            first: 100
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

    const json = await res.json();

    const data = json.data?.referralRewards || [];

    // 👉 写入缓存
    graphCache.set(key, {
      data,
      at: Date.now(),
    });

    return data;
  } catch (e) {
    console.warn("Graph fetch failed", e);
    return null;
  }
}

/* =========================
   🟡 RPC fallback（保底）
========================= */

async function loadReferralRewardsFallback(
  user: string
): Promise<ReferralRewardStats> {
  const provider = getReadProvider(CHAIN_ID.BSC_MAINNET);
  if (!provider) {
    return { total: 0n, level1: 0n, level2: 0n, history: [] };
  }

  const chainId = await getActiveChainId(provider);
  const distributor = getContractAddress(chainId, "REWARD_DISTRIBUTOR");

  const contract = new Contract(
    distributor,
    RewardDistributorAbi,
    provider
  );

  const iface = contract.interface;
  const topic0 = iface.getEvent("ReferralReward").topicHash;

  const latest = await provider.getBlockNumber();
  const startBlock =
    getContractStartBlock(chainId, "REWARD_DISTRIBUTOR") ?? latest;

  const paddedUser = ethers.zeroPadValue(user, 32);

  let total = 0n;
  let level1 = 0n;
  let level2 = 0n;

  const history: ReferralRewardHistoryItem[] = [];

  try {
    const logs = await provider.getLogs({
      address: distributor,
      topics: [topic0, paddedUser],
      fromBlock: startBlock,
      toBlock: latest,
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
  } catch (e) {
    console.warn("fallback failed", e);
  }

  return {
    total,
    level1,
    level2,
    history: history.slice(0, 20),
  };
}

/* =========================
   🎯 最终入口
========================= */

export async function loadReferralRewardsFinal(
  user: string
): Promise<ReferralRewardStats> {
  if (!ethers.isAddress(user)) {
    return { total: 0n, level1: 0n, level2: 0n, history: [] };
  }

  const graphData = await fetchFromGraph(user);

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

  console.warn("⚠️ Graph not ready, skip fallback");

// 👉 直接返回空（不扫链）
return {
  total: 0n,
  level1: 0n,
  level2: 0n,
  history: [],
};
}

/* =========================
   Reset
========================= */

export function resetReferralCache(user?: string) {
  if (user) {
    const key = user.toLowerCase();
    cache.delete(key);
    inFlight.delete(key);
    graphCache.delete(key); // 👉 清Graph缓存
  } else {
    cache.clear();
    inFlight.clear();
    graphCache.clear();
  }
}
