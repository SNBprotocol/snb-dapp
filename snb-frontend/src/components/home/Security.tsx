"use client";

import { useI18n } from "@/lib/i18n";
import FadeIn from "@/components/motion/FadeIn";

export default function Security() {
  const { t } = useI18n();

  const items = [
    {
      title: t("home.security.fact1.title"),
      desc: t("home.security.fact1.desc"),
    },
    {
      title: t("home.security.fact2.title"),
      desc: t("home.security.fact2.desc"),
    },
    {
      title: t("home.security.fact3.title"),
      desc: t("home.security.fact3.desc"),
    },
    {
      title: t("home.security.fact4.title"),
      desc: t("home.security.fact4.desc"),
    },
  ];

  return (
    <section className="security-root">
      <FadeIn>
        <div className="security-header">
          <h2 className="security-title">
            {t("home.security.title")}
          </h2>
        </div>
      </FadeIn>

      <div className="security-grid">
        {items.map((item, i) => (
          <FadeIn key={i} delay={i * 0.08}>
            <div className="security-card">
              <div className="security-card-title">
                {item.title}
              </div>
              <div className="security-card-desc">
                {item.desc}
              </div>
            </div>
          </FadeIn>
        ))}
      </div>

      <style jsx>{`
        .security-root {
          max-width: 1100px;
          margin: 120px auto;
          padding: 0 16px;
          overflow-x: hidden; /* 🔥 iOS 必须 */
        }

        .security-header {
          text-align: center;
          margin-bottom: 48px;
        }

        .security-title {
          font-size: 28px;
          font-weight: 900;
        }

        .security-grid {
          display: grid;
          grid-template-columns: repeat(4, minmax(0, 1fr)); /* 🔥 */
          gap: 24px;
          max-width: 100%;
          overflow-x: hidden;
        }

        .security-card {
          padding: 28px 22px;
          border-radius: 18px;
          background: rgba(255,255,255,0.04);
          border: 1px solid rgba(255,255,255,0.08);
          transition: border-color 0.25s ease;
        }

        .security-card-title {
          font-size: 14px;
          font-weight: 800;
          margin-bottom: 10px;
          color: #fff;
        }

        .security-card-desc {
          font-size: 14px;
          line-height: 1.6;
          color: #9ca3af;
        }

        /* 桌面端 hover */
        @media (hover: hover) {
          .security-card:hover {
            border-color: rgba(250,204,21,0.45);
            box-shadow: 0 16px 40px rgba(0,0,0,0.45);
          }
        }

        /* ===== Tablet / Mobile ===== */
        @media (max-width: 1024px) {
          .security-grid {
            grid-template-columns: repeat(2, 1fr);
          }
        }

        @media (max-width: 768px) {
          .security-grid {
            grid-template-columns: 1fr;
            gap: 18px;
          }
        }

        /* 🍎 iOS 专用兜底 */
        @supports (-webkit-touch-callout: none) {
          .security-grid {
            grid-template-columns: 1fr;
          }

          .security-card {
            box-shadow: none;
          }
        }
      `}</style>
    </section>
  );
}
