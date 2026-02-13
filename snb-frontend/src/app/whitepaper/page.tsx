"use client";

import { useI18n } from "@/lib/i18n";

/* =========================
   Section Definitions
========================= */
const PHASE_1 = [
  { key: "overview", label: "Overview" },
  { key: "token", label: "Token Architecture" },
  { key: "economics", label: "Token Economics & Fee Flow" },
  { key: "liquidity", label: "Liquidity & Zap Design" },
  { key: "mining", label: "LP Mining Mechanism" },
  { key: "referral", label: "Referral Incentive System" },
  { key: "risk", label: "Risk Disclosure" },
];

const PHASE_2 = [
  { key: "architecture", label: "Protocol Architecture" },
  { key: "feeFlow", label: "Fee Flow & Value Recycling" },
  { key: "incentives", label: "Incentive Alignment" },
  { key: "governance", label: "Governance Philosophy" },
  { key: "upgrade", label: "Upgrade Path" },
  { key: "ownership", label: "Ownership & Control" },
];

export default function WhitepaperPage() {
  const { t } = useI18n();

  return (
    <div className="wp-root">
      <div className="wp-container">
        {/* ===== Sidebar TOC (Desktop Only) ===== */}
        <aside className="wp-toc">
          <div className="wp-toc-inner">
            <div className="wp-toc-phase">PHASE I</div>
            {PHASE_1.map((s) => (
              <a key={s.key} href={`#${s.key}`}>
                {s.label}
              </a>
            ))}

            <div className="wp-toc-phase">PHASE II</div>
            {PHASE_2.map((s) => (
              <a key={s.key} href={`#phase2-${s.key}`}>
                {s.label}
              </a>
            ))}
          </div>
        </aside>

        {/* ===== Content ===== */}
        <main className="wp-content">
          <h1 className="wp-title">
            {t("whitepaper.title")}
          </h1>

          {PHASE_1.map((s) => (
            <section key={s.key} id={s.key} className="wp-section">
              <h2>{t(`whitepaper.${s.key}.title`)}</h2>
              <p>{t(`whitepaper.${s.key}.content`)}</p>
            </section>
          ))}

          <div className="wp-phase-divider">
            PHASE II · SYSTEM ARCHITECTURE
          </div>

          {PHASE_2.map((s) => (
            <section
              key={s.key}
              id={`phase2-${s.key}`}
              className="wp-section"
            >
              <h2>{t(`whitepaper.phase2.${s.key}.title`)}</h2>
              <p>{t(`whitepaper.phase2.${s.key}.content`)}</p>
            </section>
          ))}
        </main>
      </div>

      <style jsx>{`
        .wp-root {
          padding: 64px 24px;
          max-width: 100%;
          overflow-x: hidden;
        }

        .wp-container {
          max-width: 1200px;
          margin: 0 auto;
          display: grid;
          grid-template-columns: 240px minmax(0, 1fr);
          gap: 64px;
        }

        /* ===== TOC ===== */
        .wp-toc-inner {
          position: sticky;
          top: 96px;
          display: flex;
          flex-direction: column;
          gap: 10px;
          border-left: 1px solid rgba(255,255,255,0.08);
          padding-left: 16px;
        }

        .wp-toc-phase {
          margin-top: 16px;
          font-size: 11px;
          letter-spacing: 0.16em;
          color: rgba(250,204,21,0.85);
        }

        .wp-toc a {
          font-size: 14px;
          color: rgba(255,255,255,0.65);
          text-decoration: none;
        }

        /* ===== Content ===== */
        .wp-content {
          width: 100%;
          max-width: 760px;
          min-width: 0;
        }

        .wp-title {
          font-size: 36px;
          font-weight: 800;
          margin-bottom: 40px;
        }

        .wp-section {
          margin-bottom: 56px;
        }

        .wp-section h2 {
          font-size: 22px;
          font-weight: 700;
          margin-bottom: 14px;
        }

        .wp-section p {
          font-size: 15px;
          line-height: 1.9;
          color: rgba(255,255,255,0.75);
          white-space: pre-line;
          max-width: 100%;
          overflow-wrap: break-word;
        }

        .wp-phase-divider {
          margin: 64px 0 32px;
          font-size: 13px;
          letter-spacing: 0.18em;
          color: rgba(250,204,21,0.9);
        }

        /* ===== Mobile ===== */
        @media (max-width: 768px) {
          .wp-container {
            grid-template-columns: 1fr;
          }

          .wp-toc {
            display: none;
          }

          .wp-content {
            max-width: 100%;
          }
        }

        /* 🍎 iOS / 🤖 Android：移动端彻底无目录 */
        @supports (-webkit-touch-callout: none) {
          .wp-container {
            display: block;
          }

          .wp-toc {
            display: none !important;
          }
        }
      `}</style>
    </div>
  );
}
