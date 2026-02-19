"use client";

import { useEffect, useState, useRef } from "react";
import StatCard from "@/components/StatCard";
import LoadingButton from "@/components/LoadingButton";
import { useI18n } from "@/lib/i18n";
import { useWallet } from "@/lib/wallet-context";
import { toast } from "@/components/Toast";
import { zapAndStake } from "@/lib/zapStake";
import { loadZapPool } from "@/lib/zap/readPool";

const MAX_ZAP_RATIO = 0.05;

export default function ZapPage() {
  const { t } = useI18n();
  const { account, isCorrectNetwork } = useWallet();

  const [bnb, setBnb] = useState("");
  const [loading, setLoading] = useState(false);

  const [estimatedSNB, setEstimatedSNB] = useState("0");
  const [estimatedLP, setEstimatedLP] = useState("0");
  const [maxZapBNB, setMaxZapBNB] =
    useState<number | null>(null);

  // ℹ️ tooltip
  const [showTip, setShowTip] = useState(false);
  const tipRef = useRef<HTMLDivElement | null>(null);

  const bnbNum = Number(bnb);
  const isValidAmount =
    !Number.isNaN(bnbNum) && bnbNum > 0;

  /* ===== tooltip outside click ===== */
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (
        tipRef.current &&
        !tipRef.current.contains(e.target as Node)
      ) {
        setShowTip(false);
      }
    }

    if (showTip) {
      document.addEventListener(
        "mousedown",
        handleClickOutside
      );
    }
    return () => {
      document.removeEventListener(
        "mousedown",
        handleClickOutside
      );
    };
  }, [showTip]);

  /* =========================
     Read pool (cached)
  ========================= */
  useEffect(() => {
    let cancelled = false;

    async function calc() {
      try {
        const {
          reserveBNB,
          reserveSNB,
          totalSupply,
        } = await loadZapPool();

        if (cancelled) return;

        const maxZap = reserveBNB * MAX_ZAP_RATIO * 2;
        setMaxZapBNB(
          Number(maxZap.toFixed(4))
        );

        if (!isValidAmount || reserveBNB === 0) {
          setEstimatedSNB("0");
          setEstimatedLP("0");
          return;
        }

        const halfBNB = bnbNum / 2;
        const amountInWithFee = halfBNB * 997;

        const snbOut =
          (amountInWithFee * reserveSNB) /
          (reserveBNB * 1000 + amountInWithFee);

        const lpMinted =
          Math.min(
            halfBNB / reserveBNB,
            snbOut / reserveSNB
          ) * totalSupply;

        setEstimatedSNB(snbOut.toFixed(4));
        setEstimatedLP(lpMinted.toFixed(4));
      } catch {
        // 永远静默
      }
    }

    calc();
    return () => {
      cancelled = true;
    };
  }, [bnb, isValidAmount]);

  /* =========================
     Zap tx
  ========================= */
  async function handleZap() {
    if (!account) {
      toast.error(t("wallet.connect"));
      return;
    }

    if (!isCorrectNetwork) {
      toast.error(t("wallet.wrongNetwork"));
      return;
    }

    if (!isValidAmount) {
      toast.error(t("zap.invalidAmount"));
      return;
    }

    if (
      maxZapBNB !== null &&
      bnbNum > maxZapBNB
    ) {
      toast.error(
        t("zap.maxExceeded").replace(
          "{max}",
          maxZapBNB.toString()
        )
      );
      return;
    }

    try {
      setLoading(true);
      const tx = await zapAndStake(bnb);
      await tx.wait();
      toast.success(t("tx.success"));
      setBnb("");
    } catch (e: any) {
      if (e?.code === 4001) {
        toast.error(t("tx.rejected"));
      } else {
        toast.error(t("tx.failed"));
      }
    } finally {
      setLoading(false);
    }
  }

  /* =========================
     Render
  ========================= */
  return (
    <div style={{ maxWidth: 520, margin: "0 auto" }}>
      <h1
        style={{
          fontSize: 28,
          fontWeight: 700,
          marginBottom: 12,
        }}
      >
        {t("zap.title")}
      </h1>

      <div
        className="card"
        style={{ marginBottom: 24 }}
      >
        <div style={{ fontSize: 14, color: "#ccc" }}>
          {t("zap.autoStakeTip")}
        </div>
      </div>

      <div className="card">
        <div className="label">
          {t("zap.pay")}
        </div>
        <input
          value={bnb}
          onChange={(e) => setBnb(e.target.value)}
          placeholder="0.0"
          className="input-big"
        />

        {maxZapBNB !== null &&
          maxZapBNB > 0 && (
            <div
              className="tip"
              style={{
                display: "flex",
                alignItems: "center",
                gap: 6,
              }}
              ref={tipRef}
            >
              <span>
                {t("zap.maxTip").replace(
                  "{max}",
                  maxZapBNB.toString()
                )}
              </span>

              <button
                type="button"
                onClick={() =>
                  setShowTip((v) => !v)
                }
                style={{
                  background: "none",
                  border: "none",
                  color: "#4da3ff",
                  cursor: "pointer",
                  fontSize: 14,
                }}
              >
                ℹ️
              </button>

              {showTip && (
                <div
                  style={{
                    position: "absolute",
                    marginTop: 32,
                    padding: "8px 10px",
                    background: "#111",
                    border: "1px solid #333",
                    borderRadius: 6,
                    fontSize: 12,
                    color: "#ccc",
                    maxWidth: 260,
                    zIndex: 10,
                  }}
                >
                  {t("zap.maxTipHelp")}
                </div>
              )}
            </div>
          )}
      </div>

      <div className="grid-2">
        <StatCard
          title={t("zap.estimatedSNB")}
          value={`~ ${estimatedSNB}`}
        />
        <StatCard
          title={t("zap.estimatedLP")}
          value={`~ ${estimatedLP}`}
        />
      </div>

      <LoadingButton
        loading={loading}
        disabled={
          !account || loading || !isValidAmount
        }
        onClick={handleZap}
      >
        {!account
          ? t("wallet.connect")
          : loading
          ? t("zap.zapping")
          : t("zap.addLiquidity")}
      </LoadingButton>
    </div>
  );
}
