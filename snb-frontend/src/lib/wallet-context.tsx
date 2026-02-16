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
   * 🔑 初始化自动识别已连接钱包（简洁稳定版）
   * =================================================
   */
  useEffect(() => {
    if (typeof window === "undefined") return;
    if (!window.ethereum) return;

    let cancelled = false;

    async function initWallet() {
      try {
        const accounts: string[] = await window.ethereum.request({
          method: "eth_accounts",
        });

        if (!cancelled && accounts && accounts.length > 0) {
          setAccount(accounts[0]);
        }

        const hexChainId: string = await window.ethereum.request({
          method: "eth_chainId",
        });

        if (!cancelled) {
          const parsed = parseInt(hexChainId, 16);
          setChainId(parsed);
          resetReadProvider(parsed);
        }
      } catch {
        // 安静失败
      }
    }

    initWallet();

    return () => {
      cancelled = true;
    };
  }, []);

  /**
   * =================================================
   * ✅ 唯一的钱包连接入口
   * =================================================
   */
  const connect = useCallback(async () => {
    if (isConnecting) return;

    try {
      setIsConnecting(true);

      const res = await connectWallet();

      setAccount(res.account);
      setChainId(res.chainId);

      resetReadProvider(res.chainId);

      // ❌ 已移除 iOS reload
    } catch (err: any) {
      console.warn("[wallet] connect aborted", err?.message || err);
    } finally {
      setIsConnecting(false);
    }
  }, [isConnecting]);

  /**
   * =================================================
   * ✅ 钱包事件监听（幂等安全版）
   * =================================================
   */
  useEffect(() => {
    if (typeof window === "undefined") return;
    if (!window.ethereum) return;

    const onAccountsChanged = (accounts: string[]) => {
      const next =
        accounts && accounts.length > 0 ? accounts[0] : null;

      // 🛑 幂等保护
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
