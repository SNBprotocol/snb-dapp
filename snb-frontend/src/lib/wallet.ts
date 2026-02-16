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
   🔥 等待 injected provider
   解决安卓 MetaMask 延迟注入问题
========================= */
async function waitForInjectedProvider(
  timeout = 2000,
  interval = 100
): Promise<any | null> {
  const start = Date.now();

  while (Date.now() - start < timeout) {
    if (window.ethereum) {
      return window.ethereum;
    }
    await sleep(interval);
  }

  return null;
}

/* =========================
   等待 accounts ready
========================= */
async function waitForAccounts(
  provider: any,
  timeout = 8_000,
  interval = 300
): Promise<string[]> {
  const start = Date.now();

  while (Date.now() - start < timeout) {
    const accounts: string[] = await provider.request({
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
   ✅ connectWallet（终极跨端稳定版）
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
    /* =====================================================
       🔥 等待 injected provider（关键修复）
    ====================================================== */
    const injected = await waitForInjectedProvider();

    if (injected) {
      console.log("[wallet] using injected provider");

      // 1️⃣ 请求授权
      await withTimeout(
        injected.request({
          method: "eth_requestAccounts",
        }),
        10_000
      );

      // 2️⃣ 等 accounts 真正 ready
      const accounts = await waitForAccounts(injected);
      const account = accounts[0];

      // 3️⃣ 当前链
      const hexChainId: string = await injected.request({
        method: "eth_chainId",
      });

      let currentChainId = parseInt(hexChainId, 16);

      /* =========================
         🎯 目标链：BSC 主网
      ========================== */
      const targetChainId = CHAIN_ID.BSC_MAINNET;
      const targetParams = NETWORK_PARAMS[targetChainId];

      // 4️⃣ 如有必要，切链
      if (currentChainId !== targetChainId) {
        try {
          await injected.request({
            method: "wallet_switchEthereumChain",
            params: [{ chainId: targetParams.chainId }],
          });
        } catch (err: any) {
          if (err?.code === 4902) {
            await injected.request({
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

      return {
        account,
        chainId: currentChainId,
      };
    }

    /* =====================================================
       🟦 fallback：WalletConnect
       仅在确实没有 injected 时才触发
    ====================================================== */
    console.log("[wallet] fallback to WalletConnect");

    const { signer } = await getWCSigner();

    const account = await signer.getAddress();
    const network = await signer.provider.getNetwork();

    return {
      account,
      chainId: Number(network.chainId),
    };
  } finally {
    connecting = false;
  }
}
