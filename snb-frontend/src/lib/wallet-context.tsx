"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
  useRef,
} from "react";
import { CHAIN_ID } from "@/config/networks";
import { connectWallet } from "@/lib/wallet";
import { resetReadProvider } from "@/lib/providers";

export interface WalletState {
  account: string | null;
  chainId: number | null;
  isCorrectNetwork: boolean;
  isConnecting: boolean;
  connect: () => Promise<void>;
}

const WalletContext = createContext<WalletState | null>(null);

/**
 * iOS 判断（只用于连接成功后的 reload）
 */
function isIOS() {
  if (typeof navigator === "undefined") return false;
  return /iPhone|iPad|iPod/i.test(navigator.userAgent);
}

export function WalletProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [account, setAccount] = useState<string | null>(null);
  const [chainId, setChainId] = useState<number | null>(null);
  const [isConnecting, setIsConnecting] = useState(false);

  const isCorrectNetwork = chainId === CHAIN_ID.BSC_MAINNET;


  /**
   * 🔒 当前 account 的 ref（防止 MetaMask 重复事件）
   */
  const accountRef = useRef<string | null>(null);

  useEffect(() => {
    accountRef.current = account;
  }, [account]);

  /**
   * =================================================
   * 🔑 初始化同步（iOS MetaMask 终极版）
   * =================================================
   */
  useEffect(() => {
    if (typeof window === "undefined") return;
    if (!window.ethereum) return;

    let cancelled = false;

    async function syncWallet() {
      // 最多等 5 秒（20 * 250ms）
      for (let i = 0; i < 20; i++) {
        try {
          const accounts: string[] = await window.ethereum.request({
            method: "eth_accounts",
          });

          if (accounts && accounts.length > 0) {
            if (!cancelled) {
              setAccount(accounts[0]);
            }
            break;
          }
        } catch {
          // iOS / Android MetaMask 可能还没 ready，忽略
        }

        await new Promise((r) => setTimeout(r, 250));
      }

      try {
        const hexChainId: string = await window.ethereum.request({
          method: "eth_chainId",
        });
        if (!cancelled) {
          setChainId(parseInt(hexChainId, 16));
        }
      } catch {
        // 忽略
      }
    }

    syncWallet();

    return () => {
      cancelled = true;
    };
  }, []);

  /**
   * =================================================
   * ✅ 唯一的钱包连接入口（保持你的原逻辑）
   * =================================================
   */
  const connect = useCallback(async () => {
    if (isConnecting) return;

    try {
      setIsConnecting(true);

      const res = await connectWallet();

      setAccount(res.account);
      setChainId(res.chainId);

      resetReadProvider();

      /**
       * 🔥 iOS MetaMask 已知行为：
       * 首次授权成功后 provider 仍是旧实例
       * 必须 reload 一次
       */
      if (isIOS()) {
        setTimeout(() => {
          window.location.reload();
        }, 300);
      }
    } catch (err: any) {
      console.warn("[wallet] connect aborted", err?.message || err);
    } finally {
      setIsConnecting(false);
    }
  }, [isConnecting]);

  /**
   * =================================================
   * ✅ 钱包事件监听（幂等安全版）
   *
   * 🔑 关键修复点：
   * - 安卓 MetaMask 会重复触发 accountsChanged
   * - 如果 account 没变 → 直接 return
   * - 彻底消灭：
   *   MetaMask: 'eth_accounts' unexpectedly updated
   * =================================================
   */
  useEffect(() => {
    if (typeof window === "undefined") return;
    if (!window.ethereum) return;

    const onAccountsChanged = (accounts: string[]) => {
      const next =
        accounts && accounts.length > 0 ? accounts[0] : null;

      // 🛑 幂等保护：账户没变，直接忽略
      if (
        next &&
        accountRef.current &&
        next.toLowerCase() ===
          accountRef.current.toLowerCase()
      ) {
        return;
      }

      setAccount(next);
    };

    const onChainChanged = (hexChainId: string) => {
      const newChainId = parseInt(hexChainId, 16);
      setChainId(newChainId);
      resetReadProvider(newChainId);
    };

    window.ethereum.on("accountsChanged", onAccountsChanged);
    window.ethereum.on("chainChanged", onChainChanged);

    return () => {
      window.ethereum.removeListener(
        "accountsChanged",
        onAccountsChanged
      );
      window.ethereum.removeListener(
        "chainChanged",
        onChainChanged
      );
    };
  }, []);

  return (
    <WalletContext.Provider
      value={{
        account,
        chainId,
        isCorrectNetwork,
        isConnecting,
        connect,
      }}
    >
      {children}
    </WalletContext.Provider>
  );
}

export function useWallet(): WalletState {
  const ctx = useContext(WalletContext);
  if (!ctx) {
    throw new Error(
      "useWallet must be used within WalletProvider"
    );
  }
  return ctx;
}
