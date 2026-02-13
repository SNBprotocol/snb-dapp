import { JsonRpcProvider } from "ethers";
import { RPC_URLS } from "@/config/rpc";

/**
 * =========================
 * 终极只读 RPC Provider
 *
 * 特性：
 * - RPC fallback
 * - 熔断（失败的 RPC 会被暂时禁用）
 * - provider cache（安卓 / iOS 稳定）
 * - 永远不用 window.ethereum
 * =========================
 */

/** provider 缓存：chainId -> provider */
const providerCache = new Map<number, JsonRpcProvider>();

/** RPC 熔断表：url -> disabledUntil(timestamp) */
const rpcCircuitBreaker = new Map<string, number>();

/** 熔断时间（毫秒） */
const CIRCUIT_BREAK_MS = 30_000;

/**
 * 判断 RPC 是否可用
 */
function isRpcAvailable(url: string) {
  const disabledUntil = rpcCircuitBreaker.get(url);
  if (!disabledUntil) return true;

  if (Date.now() > disabledUntil) {
    rpcCircuitBreaker.delete(url);
    return true;
  }

  return false;
}

/**
 * 标记 RPC 失败（进入熔断）
 */
function markRpcFailed(url: string) {
  rpcCircuitBreaker.set(url, Date.now() + CIRCUIT_BREAK_MS);
}

/**
 * 获取只读 Provider（终极版）
 */
export function getReadProvider(
  chainId: number
): JsonRpcProvider | null {
  // ♻️ 优先使用缓存
  if (providerCache.has(chainId)) {
    return providerCache.get(chainId)!;
  }

  const urls = RPC_URLS[chainId];
  if (!urls || urls.length === 0) return null;

  // 选一个当前未熔断的 RPC
  const url = urls.find(isRpcAvailable);
  if (!url) {
    console.warn(
      `[readProvider] all RPCs temporarily disabled for chain ${chainId}`
    );
    return null;
  }

  const provider = new JsonRpcProvider(url, chainId, {
    staticNetwork: true,
  });

  // ⚠️ 关键：warm-up + 熔断保护
  provider
    .getBlockNumber()
    .catch(() => {
      console.warn(`[readProvider] RPC failed, circuit open: ${url}`);
      markRpcFailed(url);
      providerCache.delete(chainId);
    });

  providerCache.set(chainId, provider);
  return provider;
}

/**
 * 手动重置（切链 / debug / 强制刷新）
 */
export function resetReadProvider(chainId?: number) {
  if (chainId !== undefined) {
    providerCache.delete(chainId);
  } else {
    providerCache.clear();
  }
}
