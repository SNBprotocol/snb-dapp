import {
  Contract,
  formatUnits,
  parseUnits,
} from "ethers";
import { getSigner, getReadProvider } from "@/lib/providers";
import { LP_MINING_ABI } from "@/abi/SNBLPMining";
import { ERC20_ABI } from "@/abi/erc20";
import {
  getContractAddress,
  getContractStartBlock,
} from "@/config/contracts";
import { CHAIN_ID } from "@/config/networks";
import { TOKENS } from "@/config/tokens";
import { parseMiningTxError } from "./parseTxError";

/* ========================
   Types
======================== */

export type MiningInfo = {
  stakedRaw: string;
  stakedDisplay: string;
  pendingSNB: string;
  lastStakeBlock: number;
};

/* ========================
   Cache（按 user）
======================== */

const CACHE_TTL = 15_000; // 15 秒

type CacheEntry<T> = {
  data: T;
  at: number;
};

const miningInfoCache = new Map<string, CacheEntry<MiningInfo>>();
const walletLPCache = new Map<string, CacheEntry<string>>();

const miningInFlight = new Map<string, Promise<MiningInfo>>();
const walletLPInFlight = new Map<string, Promise<string>>();

function cacheKey(user: string) {
  return `${CHAIN_ID.BSC_MAINNET}:${user.toLowerCase()}`;
}

const EMPTY_MINING: MiningInfo = {
  stakedRaw: "0",
  stakedDisplay: "0",
  pendingSNB: "0",
  lastStakeBlock: 0,
};

/* ========================
   LP Mining startBlock
======================== */

const LP_MINING_START_BLOCK =
  getContractStartBlock(
    CHAIN_ID.BSC_MAINNET,
    "LP_MINING"
  );

/* ========================
   Load mining info（只读 + cache）
======================== */

export async function loadMiningInfo(
  user: string
): Promise<MiningInfo> {
  const key = cacheKey(user);
  const now = Date.now();

  const cached = miningInfoCache.get(key);
  if (cached && now - cached.at < CACHE_TTL) {
    return cached.data;
  }

  if (miningInFlight.has(key)) {
    return miningInFlight.get(key)!;
  }

  const task = (async () => {
    try {
      const chainId = CHAIN_ID.BSC_MAINNET;
      const provider = getReadProvider(chainId);
      if (!provider) {
        return cached?.data ?? EMPTY_MINING;
      }

      const mining = new Contract(
        getContractAddress(chainId, "LP_MINING"),
        LP_MINING_ABI,
        provider
      );

      const snb = new Contract(
        TOKENS[chainId].SNB,
        ERC20_ABI,
        provider
      );

      const [info, pending, decimals] = await Promise.all([
        mining.userInfo(user),
        mining.pendingReward(user),
        snb.decimals(),
      ]);

      const result: MiningInfo = {
        stakedRaw: info.amount.toString(),
        stakedDisplay: formatUnits(info.amount, 18),
        pendingSNB: formatUnits(pending, decimals),
        lastStakeBlock: Number(info.lastStakeBlock),
      };

      miningInfoCache.set(key, {
        data: result,
        at: Date.now(),
      });

      return result;
    } catch (e) {
      console.warn("[mining] loadMiningInfo failed", e);
      return cached?.data ?? EMPTY_MINING;
    } finally {
      miningInFlight.delete(key);
    }
  })();

  miningInFlight.set(key, task);
  return task;
}

/* ========================
   Wallet LP balance（只读 + cache）
======================== */

export async function loadWalletLP(
  user: string
): Promise<string> {
  const key = cacheKey(user);
  const now = Date.now();

  const cached = walletLPCache.get(key);
  if (cached && now - cached.at < CACHE_TTL) {
    return cached.data;
  }

  if (walletLPInFlight.has(key)) {
    return walletLPInFlight.get(key)!;
  }

  const task = (async () => {
    try {
      const chainId = CHAIN_ID.BSC_MAINNET;
      const provider = getReadProvider(chainId);
      if (!provider) {
        return cached?.data ?? "0";
      }

      const lp = new Contract(
        TOKENS[chainId].SNB_LP,
        ERC20_ABI,
        provider
      );

      const [balance, decimals] = await Promise.all([
        lp.balanceOf(user),
        lp.decimals(),
      ]);

      const result = formatUnits(balance, decimals);

      walletLPCache.set(key, {
        data: result,
        at: Date.now(),
      });

      return result;
    } catch (e) {
      console.warn("[mining] loadWalletLP failed", e);
      return cached?.data ?? "0";
    } finally {
      walletLPInFlight.delete(key);
    }
  })();

  walletLPInFlight.set(key, task);
  return task;
}

/* ========================
   Stake LP（交易）
======================== */

export async function stakeLP(amount: string) {
  try {
    const signer = await getSigner();
    if (!signer) throw new Error("NO_WALLET");

    const network = await signer.provider!.getNetwork();
    const chainId = Number(network.chainId);

    if (chainId !== CHAIN_ID.BSC_MAINNET) {
      throw new Error("WRONG_NETWORK");
    }

    const lpAddress = TOKENS[chainId].SNB_LP;
    const miningAddress = getContractAddress(
      chainId,
      "LP_MINING"
    );

    const lp = new Contract(lpAddress, ERC20_ABI, signer);
    const mining = new Contract(
      miningAddress,
      LP_MINING_ABI,
      signer
    );

    const decimals = await lp.decimals();
    const rawAmount = parseUnits(amount, decimals);
    const user = await signer.getAddress();

    const balance = await lp.balanceOf(user);
    if (balance < rawAmount) {
      throw new Error("INSUFFICIENT_LP");
    }

    const allowance = await lp.allowance(
      user,
      miningAddress
    );
    if (allowance < rawAmount) {
      const approveTx = await lp.approve(
        miningAddress,
        rawAmount
      );
      await approveTx.wait();
    }

    const tx = await mining.stake(rawAmount);
    return tx.wait();
  } catch (err) {
    throw parseMiningTxError(err);
  }
}

/* ========================
   Withdraw LP（交易）
======================== */

export async function withdrawLP(amount: string) {
  try {
    const signer = await getSigner();
    if (!signer) throw new Error("NO_WALLET");

    const network = await signer.provider!.getNetwork();
    const chainId = Number(network.chainId);

    if (chainId !== CHAIN_ID.BSC_MAINNET) {
      throw new Error("WRONG_NETWORK");
    }

    const mining = new Contract(
      getContractAddress(chainId, "LP_MINING"),
      LP_MINING_ABI,
      signer
    );

    const rawAmount = parseUnits(amount, 18);
    const tx = await mining.withdraw(rawAmount);
    return tx.wait();
  } catch (err) {
    throw parseMiningTxError(err);
  }
}

/* ========================
   Claim reward（交易）
======================== */

export async function claimReward() {
  try {
    const signer = await getSigner();
    if (!signer) throw new Error("NO_WALLET");

    const network = await signer.provider!.getNetwork();
    const chainId = Number(network.chainId);

    if (chainId !== CHAIN_ID.BSC_MAINNET) {
      throw new Error("WRONG_NETWORK");
    }

    const mining = new Contract(
      getContractAddress(chainId, "LP_MINING"),
      LP_MINING_ABI,
      signer
    );

    const tx = await mining.withdraw(0);
    return tx;
  } catch (err) {
    throw parseMiningTxError(err);
  }
}
