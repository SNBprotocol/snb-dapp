"use client";

import { useI18n } from "@/lib/i18n";
import { useEffect, useState } from "react";

export default function Hero() {
  const { t } = useI18n();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  function scrollTo(id: string) {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }

  return (
    <section className={`hero-root ${mounted ? "mounted" : ""}`}>
      <div className="hero-bg" />

      <div className="hero-eyebrow">{t("home.hero.eyebrow")}</div>

      <h1 className="hero-title">
        <span className="hero-title-main">
          {t("home.hero.title")}
        </span>
      </h1>

      <p className="hero-subtitle">{t("home.hero.subtitle")}</p>
      <p className="hero-value">{t("home.hero.value")}</p>

      <p className="hero-status">
        {t("home.hero.statusLabel")}{" "}
        <span>{t("home.hero.statusValue")}</span>
      </p>

      <div className="hero-actions">
        <button
          className="hero-btn primary"
          onClick={() => scrollTo("start")}
        >
          {t("home.hero.ctaPrimary")}
        </button>

        <button
          className="hero-btn secondary"
          onClick={() => scrollTo("how")}
        >
          {t("home.hero.ctaSecondary")}
        </button>
      </div>

      <div className="hero-divider" />

      <style jsx>{`
        .hero-root {
          position: relative;
          width: 100%;
          padding: 120px 16px 100px;
          text-align: center;
          overflow-x: hidden;
          opacity: 0;
        }

        .hero-root.mounted {
          opacity: 1;
          transition: opacity 0.2s ease;
        }

        .hero-bg {
          position: absolute;
          inset: 0;
          pointer-events: none;
          background:
            radial-gradient(
              600px 300px at 50% 0%,
              rgba(250,204,21,0.14),
              transparent 60%
            );
        }

        @supports (-webkit-touch-callout: none) {
          .hero-bg {
            display: none;
          }
        }

        .hero-eyebrow {
          font-size: 11px;
          letter-spacing: 0.18em;
          color: rgba(250,204,21,0.85);
          margin-bottom: 18px;
        }

        .hero-title {
          font-size: 40px;
          font-weight: 900;
          margin-bottom: 16px;

          /* 🔥 关键修复 */
          line-height: 1.2;
          padding-top: 4px;

          /* 强制 GPU 渲染，防 iOS 裁剪 */
          transform: translateZ(0);
        }

        .hero-title-main {
          background: linear-gradient(180deg, #fff, #e5e7eb);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }

        /* 🔥 iOS 专用修复：禁用渐变裁剪 */
        @supports (-webkit-touch-callout: none) {
          .hero-title-main {
            background: none;
            -webkit-text-fill-color: #ffffff;
          }
        }

        .hero-subtitle,
        .hero-value {
          max-width: 720px;
          margin: 0 auto 24px;
          line-height: 1.7;
          color: rgba(255,255,255,0.8);
        }

        .hero-status {
          font-size: 13px;
          color: #9ca3af;
          margin-bottom: 36px;
        }

        .hero-status span {
          color: #22c55e;
        }

        .hero-actions {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 14px;
        }

        .hero-btn {
          width: 100%;
          max-width: 280px;
          padding: 14px 36px;
          border-radius: 999px;
          font-weight: 800;
          border: 1px solid rgba(255,255,255,0.25);
          background: rgba(255,255,255,0.06);
          color: #fff;
        }

        .hero-btn.primary {
          border-color: rgba(250,204,21,0.85);
          box-shadow: 0 0 28px rgba(250,204,21,0.5);
        }

        .hero-divider {
          margin: 64px auto 0;
          width: 120px;
          height: 1px;
          background: linear-gradient(
            90deg,
            transparent,
            rgba(255,255,255,0.35),
            transparent
          );
        }
      `}</style>
    </section>
  );
}
