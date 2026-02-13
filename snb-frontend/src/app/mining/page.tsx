"use client";

import { useEffect, useState, useRef } from "react";
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
const BLOCK_TIME_SEC = 2;

function format4(v: string) {
  const n = Number(v);
  if (isNaN(n)) return "0.0000";
  return n.toFixed(4);
}

/* ========================
   Unified tx error handler
======================== */
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

  const [stakedDisplay, setStakedDisplay] = useState("0");
  const [pending, setPending] = useState("0");
  const [lastStakeBlock, setLastStakeBlock] =
    useState<number | null>(null);

  const [walletLP, setWalletLP] = useState("0");
  const [stakeAmount, setStakeAmount] = useState("");
  const [unstakeAmount, setUnstakeAmount] = useState("");

  const [currentBlock, setCurrentBlock] =
    useState<number | null>(null);

  const listeningRef = useRef(false);

  /* =========================
     Load mining data
  ========================= */
  async function reload(silent = false) {
    if (!account) {
      setLoading(false);
      return;
    }

    if (!silent) setLoading(true);

    try {
      const info = await loadMiningInfo(account);
      setStakedDisplay(info.stakedDisplay);
      setPending(info.pendingSNB);
      setLastStakeBlock(info.lastStakeBlock ?? null);

      const lp = await loadWalletLP(account);
      setWalletLP(lp);
    } catch (e) {
      console.warn("[mining] reload failed (ignored)", e);
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

    const provider = getReadProvider(CHAIN_ID.BSC_TESTNET);
    if (!provider) return;

    let cancelled = false;

    const poll = async () => {
      try {
        const block = await provider.getBlockNumber();
        if (!cancelled) setCurrentBlock(block);
      } catch {}
    };

    poll();
    const timer = setInterval(poll, 10_000);

    return () => {
      cancelled = true;
      clearInterval(timer);
    };
  }, [account, isCorrectNetwork]);

  useEffect(() => {
    reload();
  }, [account, isCorrectNetwork]);

  /* =========================
     Claim (FINAL · ABI SAFE)
  ========================= */
  async function handleClaim() {
    if (txState !== "idle" || !account) return;

    setTxState("claiming");

    try {
      await claimReward();

      toast.success(t("tx.success"));

      // ✅ 乐观更新
      setPending("0");

      // ✅ ABI 无关的“链确认”方式：等下一个区块
      const provider = getReadProvider(CHAIN_ID.BSC_TESTNET);
      if (!provider || listeningRef.current) return;

      listeningRef.current = true;

      provider.once("block", () => {
        reload(true);
        listeningRef.current = false;
      });
    } catch (err: any) {
      showTxError(err, t);
    } finally {
      setTxState("idle");
    }
  }

  /* =========================
     Stake / Withdraw（不动）
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
      reload();
    } catch (err: any) {
      showTxError(err, t);
    } finally {
      setTxState("idle");
    }
  }

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
      reload();
    } catch (err: any) {
      showTxError(err, t);
    } finally {
      setTxState("idle");
    }
  }

  /* =========================
     Unstake lock calc
  ========================= */
  let canUnstake = true;
  let blocksLeft = 0;
  let minutesLeft = 0;

  if (
    lastStakeBlock !== null &&
    currentBlock !== null &&
    Number(stakedDisplay) > 0
  ) {
    const unlockBlock = lastStakeBlock + MIN_STAKE_BLOCKS;
    if (currentBlock < unlockBlock) {
      canUnstake = false;
      blocksLeft = unlockBlock - currentBlock;
      minutesLeft = Math.ceil(
        (blocksLeft * BLOCK_TIME_SEC) / 60
      );
    }
  }

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
        value={loading ? "-" : `${format4(pending)} SNB`}
      />

      <button
        className="btn"
        disabled={pending === "0" || txState !== "idle"}
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

        {Number(stakedDisplay) > 0 && (
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
