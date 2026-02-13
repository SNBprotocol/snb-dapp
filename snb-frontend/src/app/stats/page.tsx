"use client";

import { useEffect, useState } from "react";
import StatCard from "@/components/StatCard";
import { loadStats } from "@/lib/stats";
import type { Stats } from "@/lib/stats";
import { useI18n } from "@/lib/i18n";

export default function StatsPage() {
  const { t } = useI18n();
  const [stats, setStats] = useState<Stats | null>(null);

  useEffect(() => {
    let mounted = true;

    async function safeLoad() {
      try {
        const data = await loadStats();
        if (mounted) {
          setStats(data);
        }
      } catch (err) {
        console.warn("[StatsPage] load failed", err);
      }
    }

    safeLoad();

    return () => {
      mounted = false;
    };
  }, []);

  if (!stats) {
    return (
      <>
        <StatCard title={t("stats.circulating")} value={t("loading")} />
        <StatCard title={t("stats.burned")} value={t("loading")} />
        <StatCard title={t("stats.totalFees")} value={t("loading")} />
        <StatCard title={t("stats.totalLPStaked")} value={t("loading")} />
      </>
    );
  }

  return (
    <>
      <StatCard
        title={t("stats.circulating")}
        value={`${stats.circulating.toLocaleString()} SNB`}
      />

      <StatCard
        title={`🔥 ${t("stats.burned")}`}
        value={`${stats.burned.toLocaleString()} SNB`}
        sub={t("stats.irreversible")}
      />

      <StatCard
        title={t("stats.totalFees")}
        value={`${stats.totalFeesDistributed.toLocaleString()} SNB`}
      />

      <StatCard
        title={t("stats.totalLPStaked")}
        value={`${stats.totalLPStaked.toLocaleString()} LP`}
      />

      <div
        style={{
          marginTop: 16,
          fontSize: 12,
          color: "rgba(255,255,255,0.45)",
          textAlign: "center",
        }}
      >
        {t("stats.onchainNote")}
      </div>
    </>
  );
}
