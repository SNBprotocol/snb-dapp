"use client";

import { useI18n } from "@/lib/i18n";
import FadeIn from "@/components/motion/FadeIn";
import EntryCard from "@/components/home/EntryCard";

export default function GetStarted() {
  const { t } = useI18n();

  const items = [
    {
      href: "/zap",
      label: "FOR NEW USERS",
      title: t("home.start.zap"),
      desc: t("home.start.zapDesc"),
      tone: "gold" as const,
    },
    {
      href: "/mining",
      label: "EARN & STAKE",
      title: t("home.start.mining"),
      desc: t("home.start.miningDesc"),
      tone: "gold" as const,
    },
    {
      href: "/stats",
      label: "PROTOCOL DATA",
      title: t("home.start.stats"),
      desc: t("home.start.statsDesc"),
      tone: "purple" as const,
    },
  ];

  return (
    <section className="gs-root" id="start">
      <FadeIn>
        <div className="gs-header">
          <span className="gs-eyebrow">
            START USING SNB
          </span>

          <h2 className="gs-title">
            {t("home.start.title")}
          </h2>

          <p className="gs-subtitle">
            {t("home.start.subtitle")}
          </p>
        </div>
      </FadeIn>

      <div className="gs-list">
        {items.map((item, i) => (
          <FadeIn key={item.href} delay={i * 0.12}>
            <div className="gs-item">
              <div className="gs-item-label">
                {item.label}
              </div>

              <EntryCard
                href={item.href}
                title={item.title}
                desc={item.desc}
                tone={item.tone}
              />
            </div>
          </FadeIn>
        ))}
      </div>

      <style jsx>{`
        .gs-root {
          margin-top: 140px;
          padding: 0 16px;
        }

        .gs-header {
          text-align: center;
          margin-bottom: 48px;
        }

        .gs-eyebrow {
          font-size: 11px;
          font-weight: 700;
          letter-spacing: 0.18em;
          color: #facc15;
          margin-bottom: 8px;
          display: inline-block;
        }

        .gs-title {
          font-size: 28px;
          font-weight: 900;
          margin-bottom: 10px;
        }

        .gs-subtitle {
          font-size: 15px;
          color: #9ca3af;
        }

        .gs-list {
          display: grid;
          grid-template-columns: 1fr;
          gap: 32px;
        }

        .gs-item {
          display: flex;
          flex-direction: column;
          gap: 10px;
        }

        .gs-item-label {
          font-size: 11px;
          font-weight: 700;
          letter-spacing: 0.14em;
          color: rgba(255,255,255,0.45);
          padding-left: 8px;
        }

        @media (min-width: 769px) {
          .gs-root {
            max-width: 1100px;
            margin: 180px auto 0;
          }

          .gs-title {
            font-size: 36px;
          }

          .gs-list {
            grid-template-columns: repeat(3, 1fr);
            gap: 28px;
          }
        }
      `}</style>
    </section>
  );
}
