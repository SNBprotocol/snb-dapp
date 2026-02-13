"use client";

import FadeIn from "@/components/motion/FadeIn";

export default function FeatureCard({
  title,
  desc,
  index,
  showIndex = true,
  size = "default",
}: {
  title: string;
  desc: string;
  index?: number;
  showIndex?: boolean;
  size?: "default" | "compact";
}) {

  const order =
    showIndex && index !== undefined
      ? String(index + 1).padStart(2, "0")
      : null;

  const isCompact = size === "compact";

  return (
    <FadeIn>
      <div className={`feature-card ${isCompact ? "compact" : ""}`}>

        {order && (
          <div className="feature-index">
            {order}
          </div>
        )}

        <h3 className="feature-title">{title}</h3>
        <p className="feature-desc">{desc}</p>

        <style jsx>{`

          /* ============================= */
          /* Base Card */
          /* ============================= */

          .feature-card {
            position: relative;
            width: 100%;
            box-sizing: border-box;

            padding: 34px 28px 30px;
            border-radius: 22px;

            background:
              linear-gradient(
                180deg,
                rgba(255,255,255,0.05),
                rgba(255,255,255,0.015)
              );

            border: 1px solid rgba(255,255,255,0.09);
            overflow: hidden;

            transform: translateZ(0);

            transition:
              transform 0.35s ease,
              border-color 0.35s ease,
              box-shadow 0.35s ease;
          }

          .feature-card::before {
            content: "";
            position: absolute;
            inset: 0;
            pointer-events: none;

            background:
              radial-gradient(
                260px 160px at 24px 24px,
                rgba(250,204,21,0.22),
                transparent 65%
              );

            opacity: 0;
            transition: opacity 0.35s ease;
          }

          .feature-card:hover {
            transform: translateY(-6px);
            border-color: rgba(250,204,21,0.5);
            box-shadow:
              0 28px 64px rgba(0,0,0,0.65),
              0 0 48px rgba(250,204,21,0.18);
          }

          .feature-card:hover::before {
            opacity: 1;
          }

          /* ============================= */
          /* Compact Mode */
          /* ============================= */

          .feature-card.compact {
            padding: 28px 24px 24px;
          }

          /* ============================= */
          /* Index */
          /* ============================= */

          .feature-index {
            position: absolute;
            top: 18px;
            left: 20px;

            font-size: 12px;
            font-weight: 800;
            letter-spacing: 0.16em;

            color: rgba(250,204,21,0.95);
            text-shadow:
              0 0 10px rgba(250,204,21,0.35);
          }

          /* ============================= */
          /* Title */
          /* ============================= */

          .feature-title {
            margin-top: ${order ? "22px" : "0"};
            font-size: 19px;
            font-weight: 800;
            margin-bottom: 12px;
            letter-spacing: -0.01em;
          }

          .feature-card.compact .feature-title {
            font-size: 17px;
            margin-bottom: 10px;
          }

          /* ============================= */
          /* Description */
          /* ============================= */

          .feature-desc {
            font-size: 14px;
            line-height: 1.7;
            color: rgba(255,255,255,0.68);
          }

          .feature-card.compact .feature-desc {
            font-size: 13px;
            line-height: 1.75;
          }

          /* ============================= */
          /* Mobile */
          /* ============================= */

          @media (max-width: 768px) {

            .feature-card {
              padding: 26px 22px;
              transform: none !important;
              box-shadow:
                0 14px 32px rgba(0,0,0,0.55);
            }

            .feature-card.compact {
              padding: 22px 20px;
            }

            .feature-card::before {
              display: none;
            }

            .feature-index {
              font-size: 11px;
            }

            .feature-title {
              font-size: 17px;
            }

            .feature-card.compact .feature-title {
              font-size: 16px;
            }

            .feature-desc {
              font-size: 13px;
            }

            .feature-card.compact .feature-desc {
              font-size: 12.5px;
            }
          }

          /* ============================= */
          /* iOS Safe */
          /* ============================= */

          @supports (-webkit-touch-callout: none) {
            .feature-card {
              max-width: 100%;
              overflow-x: hidden;
            }

            .feature-card::before {
              display: none;
            }

            .feature-card:hover {
              transform: none;
              box-shadow:
                0 14px 32px rgba(0,0,0,0.55);
            }
          }

        `}</style>
      </div>
    </FadeIn>
  );
}
