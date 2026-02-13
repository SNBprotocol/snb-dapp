"use client";

import { useWallet } from "@/lib/wallet-context";

export default function ConnectButton() {
  const { isConnecting, account } = useWallet();

  const handleConnect = () => {
    // ⚠️ 同步触发，iOS MetaMask 才认
    window.dispatchEvent(new Event("wallet:connect"));
  };

  if (account) {
    return (
      <button disabled>
        {account.slice(0, 6)}...{account.slice(-4)}
      </button>
    );
  }

  return (
    <button onClick={handleConnect} disabled={isConnecting}>
      {isConnecting ? "Connecting..." : "Connect Wallet"}
    </button>
  );
}
