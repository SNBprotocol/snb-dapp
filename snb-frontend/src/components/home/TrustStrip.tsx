"use client";

import { useI18n } from "@/lib/i18n";
import FadeIn from "@/components/motion/FadeIn";

export default function TrustStrip() {
  const { t } = useI18n();

  const items = [
    {
      title: t("home.trust.rule1.title"),
      desc: t("home.trust.rule1.desc"),
    },
    {
      title: t("home.trust.rule2.title"),
      desc: t("home.trust.rule2.desc"),
    },
    {
      title: t("home.trust.rule3.title"),
      desc: t("home.trust.rule3.desc"),
    },
    {
      title: t("home.trust.rule4.title"),
      desc: t("home.trust.rule4.desc"),
    },
  ];

  return (
    <section className="trust-strip">
      <div className="trust-bg" />

      <FadeIn>
        <div className="trust-inner">
          <div className="trust-header">
            <span className="trust-eyebrow">
              PROTOCOL GUARANTEES
            </span>
            <h3 className="trust-title">
              What the Protocol Cannot Do
            </h3>
          </div>

          <div className="trust-list">
            {items.map((item, i) => (
              <FadeIn key={i} delay={i * 0.1}>
                <div className="trust-item">
                  <div className="trust-item-title">
                    {item.title}
                  </div>
                  <div className="trust-item-desc">
                    {item.desc}
                  </div>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </FadeIn>

      <style jsx>{`
        .trust-strip {
          position: relative;
          width: 100%;
          padding: 96px 16px;
          background: linear-gradient(
            180deg,
            rgba(255,255,255,0.02),
            rgba(255,255,255,0.005)
          );
          border-top: 1px solid rgba(255,255,255,0.06);
          border-bottom: 1px solid rgba(255,255,255,0.06);
          overflow-x: hidden; /* 🔥 iOS 必须 */
        }

        .trust-bg {
          position: absolute;
          inset: 0;
          background: radial-gradient(
            800px 300px at 50% 0%,
            rgba(250,204,21,0.14),
            transparent 65%
          );
          pointer-events: none;
        }

        .trust-inner {
          position: relative;
          max-width: 960px;
          margin: 0 auto;
        }

        .trust-header {
          text-align: center;
          margin-bottom: 48px;
        }

        .trust-eyebrow {
          font-size: 11px;
          font-weight: 700;
          letter-spacing: 0.18em;
          color: rgba(250,204,21,0.9);
          margin-bottom: 10px;
          display: inline-block;
        }

        .trust-title {
          font-size: 26px;
          font-weight: 900;
        }

        .trust-list {
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr)); /* 🔥 */
          gap: 28px;
          max-width: 100%;
        }

        .trust-item {
          padding: 26px 22px;
          border-radius: 18px;
          background: rgba(0,0,0,0.35);
          border: 1px solid rgba(255,255,255,0.08);
        }

        .trust-item-title {
          font-size: 13px;
          font-weight: 800;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          margin-bottom: 10px;
        }

        .trust-item-desc {
          font-size: 14px;
          line-height: 1.6;
          color: #9ca3af;
        }

        @media (max-width: 768px) {
          .trust-strip {
            padding: 72px 16px;
          }

          .trust-title {
            font-size: 22px;
          }

          .trust-list {
            grid-template-columns: 1fr;
            gap: 20px;
          }
        }

        /* 🍎 iOS 兜底 */
        @supports (-webkit-touch-callout: none) {
          .trust-strip {
            overflow-x: hidden;
          }
        }
      `}</style>
    </section>
  );
}
