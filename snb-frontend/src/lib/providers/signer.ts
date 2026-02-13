import { BrowserProvider, JsonRpcSigner } from "ethers";

/**
 * =========================
 * 钱包 Signer（写交易专用）
 * =========================
 * - 永远从 window.ethereum 即时获取
 * - 不做缓存（非常重要）
 * - 只用于写操作
 */

export async function getSigner(): Promise<JsonRpcSigner | null> {
  if (typeof window === "undefined") return null;
  if (!window.ethereum) return null;

  try {
    const provider = new BrowserProvider(window.ethereum);

    // ⚠️ 不要提前 eth_requestAccounts
    // MetaMask 会在 sendTransaction 时自动弹
    const signer = await provider.getSigner();

    return signer;
  } catch (e) {
    console.warn("[signer] getSigner failed:", e);
    return null;
  }
}
