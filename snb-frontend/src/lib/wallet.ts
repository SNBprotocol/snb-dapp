import { CHAIN_ID, NETWORK_PARAMS } from "@/config/networks";
import { getWCSigner } from "@/lib/walletconnect";

declare global {
  interface Window {
    ethereum?: any;
  }
}

export interface ConnectResult {
  account: string;
  chainId: number;
}

/**
 * 🔒 防止并发连接（非常重要）
 */
let connecting = false;

/* =========================
   iOS 判断
========================= */
function isIOS() {
  if (typeof navigator === "undefined") return false;
  return /iPhone|iPad|iPod/i.test(navigator.userAgent);
}

/* =========================
   sleep
========================= */
function sleep(ms: number) {
  return new Promise((r) => setTimeout(r, ms));
}

/* =========================
   超时保护
========================= */
function withTimeout<T>(promise: Promise<T>, ms = 10_000): Promise<T> {
  return new Promise((resolve, reject) => {
    const timer = setTimeout(() => {
      reject(new Error("WALLET_TIMEOUT"));
    }, ms);

    promise
      .then((res) => {
        clearTimeout(timer);
        resolve(res);
      })
      .catch((err) => {
        clearTimeout(timer);
        reject(err);
      });
  });
}

/* =========================
   等待 accounts ready
========================= */
async function waitForAccounts(
  timeout = 8_000,
  interval = 300
): Promise<string[]> {
  const start = Date.now();

  while (Date.now() - start < timeout) {
    const accounts: string[] = await window.ethereum.request({
      method: "eth_accounts",
    });

    if (accounts && accounts.length > 0) {
      return accounts;
    }

    await sleep(interval);
  }

  throw new Error("ACCOUNTS_NOT_READY");
}

/* =========================================================
   ✅ connectWallet（主网稳定版）
========================================================= */
export async function connectWallet(): Promise<ConnectResult> {
  if (connecting) {
    throw new Error("CONNECTING");
  }

  if (typeof window === "undefined") {
    throw new Error("NO_WINDOW");
  }

  connecting = true;

  try {
    /* =========================
       🟦 iOS → WalletConnect
    ========================== */
    if (isIOS()) {
      const { signer } = await getWCSigner();

      const account = await signer.getAddress();
      const network = await signer.provider.getNetwork();

      return {
        account,
        chainId: Number(network.chainId),
      };
    }

    /* =========================
       🟩 Desktop / Android
    ========================== */
    if (!window.ethereum) {
      throw new Error("NO_WALLET");
    }

    // 1️⃣ 请求授权
    await withTimeout(
      window.ethereum.request({
        method: "eth_requestAccounts",
      }),
      10_000
    );

    // 2️⃣ 等 accounts 真正 ready
    const accounts = await waitForAccounts();
    const account = accounts[0];

    // 3️⃣ 当前链
    const hexChainId: string = await window.ethereum.request({
      method: "eth_chainId",
    });

    let currentChainId = parseInt(hexChainId, 16);

    /* =========================
       🎯 目标链：主网
    ========================== */
    const targetChainId = CHAIN_ID.BSC_MAINNET;
    const targetParams = NETWORK_PARAMS[targetChainId];

    // 4️⃣ 如有必要，切链
    if (currentChainId !== targetChainId) {
      try {
        await window.ethereum.request({
          method: "wallet_switchEthereumChain",
          params: [{ chainId: targetParams.chainId }],
        });
      } catch (err: any) {
        if (err?.code === 4902) {
          await window.ethereum.request({
            method: "wallet_addEthereumChain",
            params: [targetParams],
          });
        } else {
          throw err;
        }
      }

      await sleep(500);
      currentChainId = targetChainId;
    }

    // 5️⃣ 返回最终状态
    return {
      account,
      chainId: currentChainId,
    };
  } finally {
    connecting = false;
  }
}
