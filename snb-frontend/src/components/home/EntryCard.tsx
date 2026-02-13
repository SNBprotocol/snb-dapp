"use client";

import Link from "next/link";

type EntryCardProps = {
  href: string;
  title: string;
  desc: string;
  tone?: "gold" | "purple";
};

export default function EntryCard({
  href,
  title,
  desc,
  tone = "gold",
}: EntryCardProps) {
  return (
    <Link href={href} className={`entry-card ${tone}`}>
      <div className="entry-inner">
        <h3 className="entry-title">{title}</h3>
        <p className="entry-desc">{desc}</p>

        <div className="entry-cta">
          Enter <span>→</span>
        </div>
      </div>

      <style jsx>{`
        /* =====================
           外层 · 入口实体
        ====================== */
        .entry-card {
          position: relative;
          display: block;
          text-decoration: none;
          color: #fff;
          border-radius: 18px;
          padding: 1px;

          /* 卡片整体存在感 */
          background: transparent;
          box-shadow: 0 12px 32px rgba(0, 0, 0, 0.65);

          transition: transform 0.25s ease;
        }

        /* =====================
           🔥 发光边框（关键）
        ====================== */
        .entry-card::before {
          content: "";
          position: absolute;
          inset: 0;
          border-radius: inherit;
          pointer-events: none;
        }

        .entry-card.gold::before {
          box-shadow:
            0 0 0 1px rgba(250, 204, 21, 1),
            0 0 36px rgba(250, 204, 21, 0.55);
        }

        .entry-card.purple::before {
          box-shadow:
            0 0 0 1px rgba(139, 92, 246, 1),
            0 0 40px rgba(139, 92, 246, 0.6);
        }

        /* =====================
           内层 · 内容卡片
        ====================== */
        .entry-inner {
          position: relative;
          z-index: 1;

          background: linear-gradient(
            180deg,
            #121212,
            #0b0b0b
          );

          border-radius: 17px;
          padding: 26px 24px;

          /* 明确矩形边界 */
          border: 1px solid rgba(255, 255, 255, 0.32);
        }

        .entry-title {
          font-size: 20px;
          font-weight: 800;
          margin-bottom: 6px;
        }

        .entry-desc {
          font-size: 14px;
          line-height: 1.55;
          color: #e5e7eb;
          margin-bottom: 16px;
        }

        .entry-cta {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          font-size: 13px;
          font-weight: 800;
          letter-spacing: 0.12em;
          background: #facc15;
          color: #000;
          padding: 6px 16px;
          border-radius: 999px;
        }

        .entry-cta span {
          transition: transform 0.25s ease;
        }

        /* =====================
           Hover 反馈
        ====================== */
        @media (hover: hover) {
          .entry-card:hover {
            transform: translateY(-2px);
          }

          .entry-card:hover .entry-cta span {
            transform: translateX(6px);
          }
        }

        @media (hover: none) {
          .entry-card:active {
            transform: scale(0.97);
          }
        }
      `}</style>
    </Link>
  );
}
