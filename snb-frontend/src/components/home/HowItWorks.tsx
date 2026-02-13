"use client";

import FeatureCard from "./FeatureCard";
import { useI18n } from "@/lib/i18n";

export default function HowItWorks() {
  const { t } = useI18n();

  return (
    <section className="section-root" id="how">

      {/* ===== Header ===== */}
      <div className="section-header">

        <div className="section-eyebrow">
          HOW IT WORKS
        </div>

        <h2 className="section-title">
          {t("home.how.title")}
        </h2>

        <p className="section-subtitle">
          {t("home.how.subtitle")}
        </p>

      </div>

      {/* ===== Content ===== */}
      <div className="section-content how-flow">

        <div className="how-phase">

          <div className="how-phase-label">
            Value Sources
          </div>

          <div className="how-row">
            <FeatureCard
              index={0}
              size="compact"
              title={t("home.how.trade.title")}
              desc={t("home.how.trade.desc")}
            />
            <FeatureCard
              index={1}
              size="compact"
              title={t("home.how.zap.title")}
              desc={t("home.how.zap.desc")}
            />
          </div>
        </div>

        <div className="how-divider">
          <span />
        </div>

        <div className="how-phase">

          <div className="how-phase-label">
            Value Distribution
          </div>

          <div className="how-row">
            <FeatureCard
              index={2}
              size="compact"
              title={t("home.how.mining.title")}
              desc={t("home.how.mining.desc")}
            />
            <FeatureCard
              index={3}
              size="compact"
              title={t("home.how.referral.title")}
              desc={t("home.how.referral.desc")}
            />
          </div>
        </div>

      </div>

      <style jsx>{`

        /* ======================================= */
        /* ✅ Section System */
        /* ======================================= */

        .section-root {
          margin-top: 140px;
          padding: 0 16px;
          overflow-x: hidden;
        }

        .section-header {
          text-align: center;
          margin-bottom: 72px; /* 🔥 比之前略收紧 */
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
          font-size: 32px;
          font-weight: 900;
          letter-spacing: -0.02em;
          margin-bottom: 12px;
        }

        .section-subtitle {
          max-width: 680px;
          margin: 0 auto;
          font-size: 14.5px;
          line-height: 1.75;
          color: #9ca3af;
        }

        .section-content {
          max-width: 1100px;
          margin: 0 auto;
        }

        /* ======================================= */

        .how-phase {
          margin-bottom: 8px; /* 🔥 轻微压缩阶段间距 */
        }

        .how-phase-label {
          text-align: center;
          font-size: 11.5px;
          font-weight: 700;
          letter-spacing: 0.18em;
          text-transform: uppercase;
          color: rgba(250,204,21,0.75);
          margin-bottom: 20px; /* 🔥 更紧凑 */
        }

        .how-row {
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 28px;
        }

        .how-divider {
          height: 80px; /* 🔥 原来90，稍微紧凑 */
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .how-divider span {
          width: 2px;
          height: 100%;
          background: linear-gradient(
            180deg,
            transparent,
            rgba(250,204,21,0.65),
            transparent
          );
          box-shadow: 0 0 18px rgba(250,204,21,0.25);
        }

        /* ===== Mobile ===== */

        @media (max-width: 768px) {

          .section-root {
            margin-top: 100px;
          }

          .section-title {
            font-size: 26px;
          }

          .section-subtitle {
            font-size: 14px;
          }

          .how-row {
            grid-template-columns: 1fr;
            gap: 22px;
          }

          .how-divider {
            height: 56px;
          }

          .how-divider span {
            width: 60%;
            height: 2px;
            box-shadow: none;
            background: linear-gradient(
              90deg,
              transparent,
              rgba(250,204,21,0.65),
              transparent
            );
          }
        }

        /* 🍎 iOS */

        @supports (-webkit-touch-callout: none) {
          .how-row {
            grid-template-columns: 1fr;
          }

          .how-divider span {
            box-shadow: none;
          }
        }

      `}</style>
    </section>
  );
}
