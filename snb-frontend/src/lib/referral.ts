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
   Cache (referral network only)
========================= */

const CACHE_TTL = 30_000;
const cache = new Map<string, { data: ReferralData; at: number }>();
const inFlight = new Map<string, Promise<ReferralData>>();

const LOG_CHUNK_SIZE = 5000; // 更安全的 chunk 大小

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

export async function loadReferral(
  user: string
): Promise<ReferralData> {
  const now = Date.now();
  const key = user.toLowerCase();

  const hit = cache.get(key);
  if (hit && now - hit.at < CACHE_TTL) {
    return hit.data;
  }

  if (inFlight.has(key)) {
    return inFlight.get(key)!;
  }

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

      const level2: string[] = [];

      for (const addr of level1) {
        try {
          const subs: string[] =
            await registry.getDirectReferrals(addr);
          for (const s of subs) {
            level2.push(getAddress(s));
          }
        } catch {}
      }

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
   Bind referrer (tx)
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

/* =========================================================
   Referral reward stats (FINAL STABLE VERSION)
========================================================= */

export async function loadReferralRewardsFinal(
  user: string
): Promise<ReferralRewardStats> {
  if (!ethers.isAddress(user)) {
    return { total: 0n, level1: 0n, level2: 0n, history: [] };
  }

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
  const eventFragment = iface.getEvent("ReferralReward");
  const topic0 = eventFragment.topicHash;

  const latest = await provider.getBlockNumber();

  const startBlock =
    getContractStartBlock(chainId, "REWARD_DISTRIBUTOR") ?? latest;

  let from = startBlock;

  let total = 0n;
  let level1 = 0n;
  let level2 = 0n;

  const history: ReferralRewardHistoryItem[] = [];

  const paddedUser = ethers.zeroPadValue(user, 32);

  while (from <= latest) {
    const to = Math.min(from + LOG_CHUNK_SIZE - 1, latest);

    try {
      const logs = await provider.getLogs({
        address: distributor,
        topics: [topic0, paddedUser],
        fromBlock: from,
        toBlock: to,
      });

      for (const log of logs) {
        try {
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
        } catch {}
      }
    } catch (err) {
      console.warn("[referral] chunk skipped", err);
    }

    from = to + 1;
  }

  return {
    total,
    level1,
    level2,
    history: history
      .sort((a, b) => b.blockNumber - a.blockNumber)
      .slice(0, 20),
  };
}

/* =========================
   Manual cache reset
========================= */

export function resetReferralCache(user?: string) {
  if (user) {
    const key = user.toLowerCase();
    cache.delete(key);
    inFlight.delete(key);
  } else {
    cache.clear();
    inFlight.clear();
  }
}
