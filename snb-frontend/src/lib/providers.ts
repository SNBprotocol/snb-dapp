/**
 * =========================
 * ⚠️ 兼容壳（非常重要）
 *
 * - 保证旧代码还能 import
 * - 内部全部转发到新 providers/*
 * - 未来可逐步删掉旧 API
 * =========================
 */

/* ===== 只读 RPC ===== */
export {
  getReadProvider,
  resetReadProvider,
} from "./providers/readProvider";

/**
 * ✅ 兼容旧名字
 * ⚠️ wallet-context / 旧页面还在用
 */
export { resetReadProvider as resetProvider } from "./providers/readProvider";

/* ===== 钱包 signer ===== */
export { getSigner } from "./providers/signer";
