"use client";

import { useEffect, useMemo, useState } from "react";
import { useWallet } from "@/lib/wallet-context";
import { useI18n } from "@/lib/i18n";

const CONNECT_TIMEOUT = 12_000; // 12 秒兜底（iOS 专用）

/**
 * =========================
 * 环境判断（只在组件层用）
 * =========================
 */
function isIOS() {
  if (typeof navigator === "undefined") return false;
  return /iPhone|iPad|iPod/i.test(navigator.userAgent);
}

function isMetaMaskInAppBrowser() {
  if (typeof navigator === "undefined") return false;
  const ua = navigator.userAgent || "";
  return ua.includes("MetaMask");
}

export default function ConnectWallet() {
  const {
    account,
    isCorrectNetwork,
    isConnecting,
    connect,
  } = useWallet();

  const { t } = useI18n();

  /**
   * =========================
   * UI 兜底锁（防止 iOS 卡死）
   * =========================
   */
  const [forceUnlocked, setForceUnlocked] = useState(false);

  useEffect(() => {
    if (!isConnecting) {
      setForceUnlocked(false);
      return;
    }

    const timer = setTimeout(() => {
      console.warn("[wallet] connect timeout, force unlock UI");
      setForceUnlocked(true);
    }, CONNECT_TIMEOUT);

    return () => clearTimeout(timer);
  }, [isConnecting]);

  const disabled = isConnecting && !forceUnlocked;

  /**
   * =========================
   * 环境判断（用于轻提示）
   * =========================
   */
  const showIOSMetaMaskHint = useMemo(() => {
    return isIOS() && isMetaMaskInAppBrowser();
  }, []);

  /**
   * =========================
   * 已连接但网络不对
   * =========================
   */
  if (account && !isCorrectNetwork) {
    return (
      <button
        className="btn danger"
        onClick={connect}
        disabled={disabled}
      >
        {isConnecting && !forceUnlocked
          ? t("wallet.switching")
          : t("wallet.switchNetwork")}
      </button>
    );
  }

  /**
   * =========================
   * 已连接 & 网络正确
   * =========================
   */
  if (account) {
    return (
      <div className="btn" style={{ cursor: "default" }}>
        {account.slice(0, 6)}...{account.slice(-4)}
      </div>
    );
  }

  /**
   * =========================
   * 未连接
   * =========================
   */
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 4,
      }}
    >
      <button
        className="btn primary"
        onClick={connect}
        disabled={disabled}
      >
        {isConnecting && !forceUnlocked
          ? t("wallet.connecting")
          : t("wallet.connect")}
      </button>

      {/* 🔹 极轻量 iOS MetaMask 提示 */}
      {showIOSMetaMaskHint && (
        <div
          style={{
            fontSize: 12,
            color: "#888",
            lineHeight: 1.3,
            textAlign: "center",
            maxWidth: 200,
          }}
        >
          {t("wallet.ios.metamask_soft_hint", {
            defaultValue:
              "iOS users: TokenPocket / imToken recommended",
          })}
        </div>
      )}
    </div>
  );
}
