"use client";

import { useI18n } from "@/lib/i18n";
import { useState } from "react";

export default function TokenInfo() {
  const { t } = useI18n();
  const [copied, setCopied] = useState(false);

  const contract =
    "0xb44F9B20c27e535B7acf0BC5bB8c871f4125c84f";

  function copyAddress() {
    navigator.clipboard.writeText(contract);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <section className="section-root">

      {/* ===== Header ===== */}
      <div className="section-header">

        <div className="section-eyebrow">
          TOKEN OVERVIEW
        </div>

        <h2 className="section-title">
          {t("home.tokenInfo.title")}
        </h2>

      </div>

      {/* ===== Grid ===== */}
      <div className="section-content token-grid">

        <div className="feature-card">
          <h3>{t("home.tokenInfo.name")}</h3>
          <p>Snowball Coin</p>
        </div>

        <div className="feature-card">
          <h3>{t("home.tokenInfo.symbol")}</h3>
          <p>SNB</p>
        </div>

        <div className="feature-card">
          <h3>{t("home.tokenInfo.network")}</h3>
          <p>BNB Smart Chain</p>
        </div>

        <div className="feature-card highlight">
          <h3>{t("home.tokenInfo.contract")}</h3>

          <div className="contract-box">
            <span className="address">
              {contract.slice(0, 6)}...
              {contract.slice(-4)}
            </span>

            <button onClick={copyAddress}>
              {copied ? "✓ Copied" : "Copy"}
            </button>
          </div>
        </div>

      </div>

      <style jsx>{`

        /* =======================================
           ✅ 统一模块系统（不会影响视觉）
        ======================================== */

        .section-root {
          margin-top: 140px; /* 统一节奏 */
          padding: 0 16px;
          overflow-x: hidden;
        }

        .section-header {
          text-align: center;
          margin-bottom: 80px; /* 统一 header 间距 */
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
          font-size: 36px; /* 统一标题比例 */
          font-weight: 900;
          letter-spacing: -0.02em;
        }

        .section-content {
          max-width: 1100px;
          margin: 0 auto;
        }

        /* =======================================
           🔽 以下全部是你原来的样式
        ======================================== */

        .token-grid {
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 28px;
        }

        .feature-card {
          padding: 48px;
          border-radius: 22px;

          background:
            linear-gradient(
              180deg,
              rgba(255,255,255,0.05),
              rgba(255,255,255,0.015)
            );

          border: 1px solid rgba(255,255,255,0.09);
          backdrop-filter: blur(24px);

          transition:
            transform 0.35s ease,
            border-color 0.35s ease,
            box-shadow 0.35s ease;

          transform: translateZ(0);
        }

        .feature-card:hover {
          transform: translateY(-6px);
          border-color: rgba(250,204,21,0.5);
          box-shadow:
            0 28px 64px rgba(0,0,0,0.65),
            0 0 48px rgba(250,204,21,0.18);
        }

        .highlight {
          border-color: rgba(250,204,21,0.45);
          box-shadow:
            0 0 40px rgba(250,204,21,0.12);
        }

        .feature-card h3 {
          font-size: 16px;
          font-weight: 600;
          margin-bottom: 16px;
          color: rgba(255,255,255,0.6);
          letter-spacing: 0.05em;
        }

        .feature-card p {
          font-size: 24px;
          font-weight: 900;
          color: #fff;
        }

        .contract-box {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 12px;

          padding: 10px 18px;
          border-radius: 999px;

          background: rgba(250,204,21,0.08);
          border: 1px solid rgba(250,204,21,0.35);

          flex-wrap: wrap;
        }

        .address {
          font-size: 14px;
          font-weight: 600;
          color: #facc15;
          word-break: break-all;
        }

        button {
          background: none;
          border: none;
          color: #fff;
          font-size: 13px;
          cursor: pointer;
          opacity: 0.75;
          transition: 0.2s;
        }

        button:hover {
          opacity: 1;
        }

        /* ===== Responsive ===== */

        @media (max-width: 900px) {
          .token-grid {
            grid-template-columns: 1fr;
          }
        }

        @media (max-width: 768px) {

          .section-root {
            margin-top: 100px;
          }

          .section-title {
            font-size: 28px;
          }

          .feature-card {
            padding: 36px;
            transform: none !important;
            box-shadow:
              0 14px 32px rgba(0,0,0,0.55);
          }

          .contract-box {
            width: 100%;
            justify-content: space-between;
          }
        }

        @supports (-webkit-touch-callout: none) {
          .token-grid {
            grid-template-columns: 1fr !important;
          }

          .feature-card:hover {
            transform: none;
            box-shadow:
              0 14px 32px rgba(0,0,0,0.55);
          }
        }

      `}</style>
    </section>
  );
}
