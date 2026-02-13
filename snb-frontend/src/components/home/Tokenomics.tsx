"use client";

import FeatureCard from "./FeatureCard";
import { useI18n } from "@/lib/i18n";

export default function Tokenomics() {
  const { t } = useI18n();

  return (
    <section className="section-root" id="tokenomics">

      {/* ===== Header ===== */}
      <div className="section-header">

        <div className="section-eyebrow">
          TOKENOMICS
        </div>

        <h2 className="section-title">
          {t("home.tokenomics.title")}
        </h2>

      </div>

      {/* ===== Content ===== */}
      <div className="section-content tokenomics-flow">

        <div className="tokenomics-phase-label">
          TOKEN STRUCTURE
        </div>

        <div className="tokenomics-row">

          <FeatureCard
            showIndex={false}
            title={t("home.tokenomics.totalSupply")}
            desc="100,000,000 SNB"
          />

          <FeatureCard
            showIndex={false}
            title={t("home.tokenomics.buyTax")}
            desc="5%"
          />

          <FeatureCard
            showIndex={false}
            title={t("home.tokenomics.sellTax")}
            desc="5%"
          />

        </div>

      </div>

      <style jsx>{`

        /* =======================================
           ✅ Section System
        ======================================== */

        .section-root {
          margin-top: 140px;
          padding: 0 16px;
          position: relative;
          overflow-x: hidden;
        }

        .section-header {
          text-align: center;
          margin-bottom: 80px;
        }

        .section-eyebrow {
          font-size: 12px;
          font-weight: 700;
          letter-spacing: 0.18em;
          text-transform: uppercase;
          color: rgba(250,204,21,0.75);
          margin-bottom: 18px;
        }

        .section-title {
          font-size: 36px;
          font-weight: 900;
          letter-spacing: -0.02em;
        }

        .section-content {
          max-width: 1100px;
          margin: 0 auto;
        }

        /* =======================================
           🔥 Tokenomics Layout
        ======================================== */

        .tokenomics-flow {
          position: relative;
        }

        .tokenomics-phase-label {
          text-align: center;
          font-size: 12px;
          font-weight: 700;
          letter-spacing: 0.18em;
          text-transform: uppercase;
          color: rgba(250,204,21,0.75);
          margin-bottom: 32px;
        }

        .tokenomics-row {
          display: grid;
          grid-template-columns: repeat(3, minmax(0, 1fr));
          gap: 28px;
        }

        /* 🔥 统一标题颜色（与 TokenInfo 一致） */

        #tokenomics :global(.feature-title) {
          color: rgba(255,255,255,0.6);
        }

        /* 🔥 放大数值（5% & Supply） */

        #tokenomics :global(.feature-desc) {
          font-size: 28px;
          font-weight: 900;
          line-height: 1.2;
          color: #fff;
        }

        /* ===== Mobile ===== */

        @media (max-width: 900px) {
          .tokenomics-row {
            grid-template-columns: 1fr;
            gap: 22px;
          }
        }

        @media (max-width: 768px) {

          .section-root {
            margin-top: 100px;
          }

          .section-title {
            font-size: 28px;
          }

          #tokenomics :global(.feature-desc) {
            font-size: 24px;
          }
        }

        /* 🍎 iOS */

        @supports (-webkit-touch-callout: none) {
          .tokenomics-row {
            grid-template-columns: 1fr;
          }
        }

      `}</style>
    </section>
  );
}
