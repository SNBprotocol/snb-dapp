"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import { ethers } from "ethers";
import { useWallet } from "@/lib/wallet-context";
import {
  loadReferral,
  loadReferralRewardsFinal,
  bindReferrer,
  resetReferralCache,
} from "@/lib/referral";
import { useI18n } from "@/lib/i18n";
import { toast } from "@/components/Toast";

function short(addr: string) {
  return addr.slice(0, 6) + "..." + addr.slice(-4);
}

// SNB 显示格式（最多 3 位小数）
function formatSNB(value: bigint, decimals = 3) {
  const str = ethers.formatEther(value);
  const [int, dec = ""] = str.split(".");
  if (decimals === 0) return int;
  return `${int}.${dec.slice(0, decimals)}`;
}

export default function ReferralPage() {
  const { account, isCorrectNetwork } = useWallet();
  const { t } = useI18n();

  const [referrer, setReferrer] = useState<string | null>(null);
  const [level1, setLevel1] = useState<string[]>([]);
  const [level2, setLevel2] = useState<string[]>([]);

  const [rewardStats, setRewardStats] = useState<{
    total: bigint;
    level1: bigint;
    level2: bigint;
  } | null>(null);

  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const loadingRef = useRef(false);

  const isBound = !!referrer && referrer !== ethers.ZeroAddress;

  function safeT(key: string, fallback: string) {
    const v = t(key);
    return v === key ? fallback : v;
  }

  /**
   * 🔧 修复 1：钱包切换时，立即清空旧奖励，防止串号
   */
  useEffect(() => {
    setRewardStats(null);
  }, [account]);

  const load = useCallback(async () => {
    if (!account || !ethers.isAddress(account)) {
      setReferrer(null);
      setLevel1([]);
      setLevel2([]);
      setRewardStats(null);
      return;
    }

    if (loadingRef.current) return;
    loadingRef.current = true;

    try {
      const data = await loadReferral(account);
      setReferrer(data.referrer || null);
      setLevel1(data.level1 || []);
      setLevel2(data.level2 || []);

      const rewards = await loadReferralRewardsFinal(account);
      setRewardStats({
        total: rewards.total,
        level1: rewards.level1,
        level2: rewards.level2,
      });
    } catch (e) {
      console.warn("[Referral] load skipped", e);
    } finally {
      loadingRef.current = false;
    }
  }, [account]);

  async function bind() {
    if (!ethers.isAddress(input)) {
      toast.error(safeT("referral.invalidAddress", "Invalid address"));
      return;
    }

    if (!isCorrectNetwork) {
      toast.error(safeT("wallet.switchNetwork", "Please switch network"));
      return;
    }

    setLoading(true);
    try {
      const tx = await bindReferrer(input);
      toast.success(safeT("tx.sending", "Transaction submitted"));
      await tx.wait();
      toast.success(safeT("tx.success", "Transaction confirmed"));

      setInput("");
      resetReferralCache(account!);
      setTimeout(load, 600);
    } catch {
      toast.error(safeT("tx.failed", "Transaction failed"));
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, [load]);

  const level1ToShow = level1.length <= 10 ? level1 : level1.slice(-10);
  const level2ToShow = level2.length <= 10 ? level2 : level2.slice(-10);

  return (
    <div style={{ maxWidth: 560, margin: "0 auto" }}>
      <h1 style={{ fontSize: 28, fontWeight: 700, marginBottom: 8 }}>
        {t("referral.title")}
      </h1>

      <p style={{ color: "#888", marginBottom: 24 }}>
        {t("referral.subtitle")}
      </p>

      {/* 网络概览 */}
      <div className="card">
        <div className="card-title">{t("referral.networkTitle")}</div>
        <div className="card-value" style={{ fontSize: 14 }}>
          <div>
            {t("referral.networkReferrer")}:{" "}
            {isBound ? short(referrer!) : t("referral.notBound")}
          </div>
          <div style={{ marginTop: 6 }}>
            {t("referral.networkLevel1")}: {level1.length}
            &nbsp;|&nbsp;
            {t("referral.networkLevel2")}: {level2.length}
          </div>
        </div>
      </div>

      {/* 绑定推荐人 */}
      {!isBound && (
        <div className="card">
          <div className="card-title" style={{ marginBottom: 12 }}>
            {t("referral.bindTitle")}
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={t("referral.bindPlaceholder")}
              className="input"
            />

            <button
              disabled={loading}
              onClick={bind}
              className={`btn ${loading ? "loading" : ""}`}
            >
              {loading
                ? safeT("referral.binding", "Binding...")
                : t("referral.confirm")}
            </button>
          </div>
        </div>
      )}

      {/* ✅ Referral Rewards（加业务判断，防止错误显示） */}
      {rewardStats && (level1.length > 0 || level2.length > 0) && (
        <div className="card">
          <div className="card-title">
            {t("referral.rewardsCardTitle")}
          </div>

          <div className="card-value" style={{ fontSize: 14, lineHeight: "1.7" }}>
            <div>
              {t("referral.rewardsTotal")}:{" "}
              {formatSNB(rewardStats.total)} SNB
            </div>

            <div style={{ marginTop: 8 }}>
              {t("referral.rewardsLast")}:
            </div>

            <div style={{ marginTop: 4 }}>
              {t("referral.rewardsLevel1")}{" "}
              {formatSNB(rewardStats.level1)} SNB
            </div>

            <div>
              {t("referral.rewardsLevel2")}{" "}
              {formatSNB(rewardStats.level2)} SNB
            </div>
          </div>
        </div>
      )}

      {/* 一级下级 */}
      <div className="card">
        <div className="card-title">
          {t("referral.level1Title")} ({level1.length})
        </div>

        {level1.length === 0 && (
          <div className="muted">{t("referral.level1Empty")}</div>
        )}

        {level1ToShow.map((a) => (
          <div key={a} className="list-item">
            {short(a)}
          </div>
        ))}
      </div>

      {/* 二级下级 */}
      <div className="card">
        <div className="card-title">
          {t("referral.level2Title")} ({level2.length})
        </div>

        {level2.length === 0 && (
          <div className="muted">{t("referral.level2Empty")}</div>
        )}

        {level2ToShow.map((a) => (
          <div key={a} className="list-item">
            {short(a)}
          </div>
        ))}
      </div>

      {/* 推荐奖励说明 */}
      <div
        style={{
          marginTop: 32,
          background: "#0b0b0b",
          border: "1px solid #222",
          borderRadius: 16,
          padding: 20,
        }}
      >
        <div style={{ fontSize: 16, fontWeight: 700, marginBottom: 12 }}>
          {t("referral.rewardsTitle")}
        </div>

        <ul
          style={{
            fontSize: 14,
            color: "#ccc",
            lineHeight: "1.8",
            paddingLeft: 18,
          }}
        >
          <li>{t("referral.rewardRuleLevel1")}</li>
          <li>{t("referral.rewardRuleLevel2")}</li>
          <li>{t("referral.rewardAuto")}</li>
          <li>{t("referral.rewardNoClaim")}</li>
        </ul>

        <div style={{ marginTop: 12, fontSize: 13, color: "#888" }}>
          {t("referral.rewardToken")}
          <br />
          {t("referral.rewardActivity")}
        </div>
      </div>
    </div>
  );
}
