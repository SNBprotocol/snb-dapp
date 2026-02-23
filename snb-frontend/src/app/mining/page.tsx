"use client";

import { useEffect, useState } from "react";
import StatCard from "@/components/StatCard";
import {
  claimReward,
  withdrawLP,
  loadMiningInfo,
  stakeLP,
  loadWalletLP,
} from "@/lib/mining";
import { useI18n } from "@/lib/i18n";
import { toast } from "@/components/Toast";
import { useWallet } from "@/lib/wallet-context";
import { getReadProvider } from "@/lib/providers";
import { CHAIN_ID } from "@/config/networks";

type TxState = "idle" | "claiming" | "withdrawing" | "staking";

const MIN_STAKE_BLOCKS = 900;
const BLOCK_TIME_SEC = 0.6;

/* ======================== */
function format4(v: string) {
  const n = Number(v);
  if (isNaN(n)) return "0.0000";
  return n.toFixed(4);
}

/* ======================== */
function showTxError(err: any, t: any) {
  switch (err?.code) {
    case 4001:
    case "USER_REJECTED":
      toast.error(t("tx.rejected"));
      break;
    case "TOO_EARLY":
      toast.error(t("mining.tooEarly"));
      break;
    case "INSUFFICIENT":
      toast.error(t("mining.insufficientLP"));
      break;
    case "WRONG_NETWORK":
      toast.error(t("tx.wrongNetwork"));
      break;
    default:
      toast.error(t("tx.failed"));
  }
}

export default function MiningPage() {
  const { t } = useI18n();
  const { account, isCorrectNetwork } = useWallet();

  const [txState, setTxState] = useState<TxState>("idle");
  const [loading, setLoading] = useState(true);

  const [stakedRaw, setStakedRaw] = useState("0");
  const [stakedDisplay, setStakedDisplay] = useState("0");
  const [pending, setPending] = useState("0");
  const [lastStakeBlock, setLastStakeBlock] = useState<number | null>(null);

  const [walletLP, setWalletLP] = useState("0");
  const [stakeAmount, setStakeAmount] = useState("");
  const [unstakeAmount, setUnstakeAmount] = useState("");

  const [currentBlock, setCurrentBlock] = useState<number | null>(null);

  /* =========================
     Reload mining state
     ⭐ 增加 force 参数
  ========================= */
  async function reload(silent = false, force = false) {
    if (!account) {
      setLoading(false);
      return;
    }

    if (!silent) setLoading(true);

    try {
      const info = await loadMiningInfo(account, force);

      setStakedRaw(info.stakedRaw);
      setStakedDisplay(info.stakedDisplay);
      setPending(info.pendingSNB);
      setLastStakeBlock(info.lastStakeBlock ?? null);

      const lp = await loadWalletLP(account);
      setWalletLP(lp);
    } catch (e) {
      console.warn("[mining] reload failed", e);
    } finally {
      if (!silent) setLoading(false);
    }
  }

  /* =========================
     Poll block number
  ========================= */
  useEffect(() => {
    if (!account || !isCorrectNetwork) {
      setCurrentBlock(null);
      return;
    }

    const provider = getReadProvider(CHAIN_ID.BSC_MAINNET);
    if (!provider) return;

    const poll = async () => {
      try {
        const block = await provider.getBlockNumber();
        setCurrentBlock(block);
      } catch {}
    };

    poll();
    const timer = setInterval(poll, 10_000);

    return () => clearInterval(timer);
  }, [account, isCorrectNetwork]);

  useEffect(() => {
    reload();
  }, [account, isCorrectNetwork]);

  /* =========================
     Claim reward
     ⭐ 强制刷新
  ========================= */
  async function handleClaim() {
    if (txState !== "idle" || !account) return;

    setTxState("claiming");

    try {
      const tx = await claimReward();
      await tx.wait();

      toast.success(t("tx.success"));

      setPending("0"); 
      await reload(true, true);   // ⭐ 关键：force = true

    } catch (err: any) {
      showTxError(err, t);
    } finally {
      setTxState("idle");
    }
  }

  /* =========================
     Stake LP
     ⭐ 强制刷新
  ========================= */
  async function handleStake() {
    if (txState !== "idle") return;

    if (!stakeAmount || Number(stakeAmount) <= 0) {
      toast.error(t("mining.invalidAmount"));
      return;
    }

    if (Number(stakeAmount) > Number(walletLP)) {
      toast.error(t("mining.insufficientLP"));
      return;
    }

    setTxState("staking");

    try {
      await stakeLP(stakeAmount);

      toast.success(t("tx.success"));
      setStakeAmount("");
      reload(false, true);  // ⭐ 强制刷新
    } catch (err: any) {
      showTxError(err, t);
    } finally {
      setTxState("idle");
    }
  }

  /* =========================
     Withdraw LP
     ⭐ 强制刷新
  ========================= */
  async function handleWithdraw() {
    if (!canUnstake || txState !== "idle") return;

    if (!unstakeAmount || Number(unstakeAmount) <= 0) {
      toast.error(t("mining.invalidAmount"));
      return;
    }

    setTxState("withdrawing");

    try {
      await withdrawLP(unstakeAmount);

      toast.success(t("tx.success"));
      setUnstakeAmount("");
      reload(false, true);  // ⭐ 强制刷新
    } catch (err: any) {
      showTxError(err, t);
    } finally {
      setTxState("idle");
    }
  }

  /* =========================
     Lock calculation
  ========================= */
  let canUnstake = true;
  let blocksLeft = 0;
  let minutesLeft = 0;

  if (
    lastStakeBlock !== null &&
    currentBlock !== null &&
    BigInt(stakedRaw) > 0n
  ) {
    const unlockBlock = lastStakeBlock + MIN_STAKE_BLOCKS;

    if (currentBlock < unlockBlock) {
      canUnstake = false;
      blocksLeft = unlockBlock - currentBlock;
      minutesLeft = Math.ceil((blocksLeft * BLOCK_TIME_SEC) / 60);
    }
  }

  /* =========================
     Dust Safe Pending
  ========================= */
  const pendingNum = Number(pending);
  const displayPending =
    pendingNum < 0.0001 ? "0" : pending;

  /* =========================
     Render
  ========================= */
  return (
    <>
      <StatCard
        title={t("mining.stakedLP")}
        value={loading ? "-" : format4(stakedDisplay)}
      />

      <StatCard
        title={t("mining.pendingReward")}
        value={loading ? "-" : `${format4(displayPending)} SNB`}
      />

      <button
        className="btn"
        disabled={pendingNum < 0.0001 || txState !== "idle"}
        onClick={handleClaim}
      >
        {txState === "claiming"
          ? t("mining.claiming")
          : t("mining.claim")}
      </button>

      <div style={{ marginTop: 24 }}>
        <StatCard
          title={t("mining.walletLP")}
          value={format4(walletLP)}
        />

        {BigInt(stakedRaw) > 0n && (
          <div style={{ marginTop: 8, fontSize: 13, color: "#999" }}>
            ⏳ {t("mining.unstakeRule", { blocks: MIN_STAKE_BLOCKS })}
          </div>
        )}

        {!canUnstake && (
          <div style={{ marginTop: 6, fontSize: 13, color: "#f5c542" }}>
            🔒 {t("mining.unstakeLocked", { minutes: minutesLeft })} (
            {blocksLeft} blocks)
          </div>
        )}

        <div style={{ display: "flex", gap: 8, marginTop: 12 }}>
          <input
            className="input"
            placeholder={t("mining.stakeAmount")}
            value={stakeAmount}
            onChange={(e) => setStakeAmount(e.target.value)}
          />
          <button
            className="btn secondary"
            onClick={() => setStakeAmount(walletLP)}
          >
            MAX
          </button>
        </div>

        <button
          className="btn"
          style={{ marginTop: 12 }}
          disabled={txState !== "idle"}
          onClick={handleStake}
        >
          {txState === "staking"
            ? t("mining.staking")
            : t("mining.stake")}
        </button>

        <div style={{ display: "flex", gap: 8, marginTop: 12 }}>
          <input
            className="input"
            placeholder={t("mining.unstakeAmount")}
            value={unstakeAmount}
            onChange={(e) => setUnstakeAmount(e.target.value)}
          />
          <button
            className="btn secondary"
            onClick={() => setUnstakeAmount(stakedDisplay)}
          >
            MAX
          </button>
        </div>

        <button
          className="btn secondary"
          style={{ marginTop: 12 }}
          disabled={!canUnstake || txState !== "idle"}
          onClick={handleWithdraw}
        >
          {txState === "withdrawing"
            ? t("mining.unstaking")
            : t("mining.unstake")}
        </button>
      </div>
    </>
  );
}
