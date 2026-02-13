"use client";

import { useI18n } from "@/lib/i18n";

export default function SNBFooter() {
  const { t } = useI18n();

  return (
    <footer className="footer-root">
      {/* ===== Top ===== */}
      <div className="footer-inner">
        {/* Brand */}
        <div className="footer-brand">
          <div className="footer-brand-head">
            <img
              src="/logo.png"
              alt="SNB"
              className="footer-logo-img"
            />
            <span className="footer-logo-text">SNB</span>
          </div>

          <p className="footer-tagline">
            {t("home.footer.tagline")}
          </p>
        </div>

        {/* Protocol + Verify */}
        <div className="footer-cols">
          <div className="footer-col">
            <div className="footer-col-title">
              {t("home.footer.protocol")}
            </div>
            <a href="/zap">{t("home.footer.zap")}</a>
            <a href="/mining">{t("home.footer.mining")}</a>
            <a href="/stats">{t("home.footer.stats")}</a>
          </div>

          <div className="footer-col">
            <div className="footer-col-title">
              {t("home.footer.verify")}
            </div>
            <a
              href="https://bscscan.com"
              target="_blank"
              rel="noopener noreferrer"
            >
              BscScan
            </a>
            <a
              href="https://github.com"
              target="_blank"
              rel="noopener noreferrer"
            >
              GitHub
            </a>
          </div>
        </div>
      </div>

      {/* ===== Bottom ===== */}
      <div className="footer-bottom">
        <span>© 2026 SNB Protocol</span>

        <div className="footer-links">
          <a href="/terms">Terms</a>
          <a href="/privacy">Privacy</a>
        </div>

        <div className="footer-social">
          {/* X */}
          <a
            href="https://x.com/SNBprotocol"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="X"
          >
            <svg viewBox="0 0 24 24">
              <path d="M18.244 2H21l-6.54 7.47L22 22h-6.6l-5.17-6.6L4.2 22H2l7-8L2 2h6.7l4.7 6L18.244 2z" />
            </svg>
          </a>

          {/* Telegram */}
          <a
            href="https://t.me/SNBprotocol"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Telegram"
          >
            <svg viewBox="0 0 24 24">
              <path d="M9.9 15.6l-.4 4.2c.6 0 .9-.3 1.2-.6l2.9-2.8 6 4.4c1.1.6 1.9.3 2.2-1l4-18.8c.4-1.6-.6-2.2-1.6-1.8L1.4 9.3c-1.6.6-1.6 1.5-.3 1.9l5.5 1.7L19.8 6c.6-.4 1.2-.2.7.3" />
            </svg>
          </a>

          {/* Discord */}
          <a
            href="https://discord.gg/9k8SvTgwu"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Discord"
          >
            <svg viewBox="0 0 24 24">
              <path d="M20.3 4.4A19.6 19.6 0 0015.8 3l-.2.4a18.3 18.3 0 00-5.2 0L10.2 3a19.6 19.6 0 00-4.5 1.4C2.9 8.3 2.3 12.1 2.6 15.9a19.8 19.8 0 005.9 3l.7-1a13 13 0 01-1.9-.9l.4-.3a13.9 13.9 0 0010.6 0l.4.3c-.6.4-1.2.7-1.9.9l.7 1a19.8 19.8 0 005.9-3c.4-4.2-.6-8-2.9-11.5z" />
            </svg>
          </a>
        </div>
      </div>

      <style jsx>{`
        .footer-root {
          margin-top: 160px;
          padding: 72px 24px 32px;
          background:
            radial-gradient(
              800px 300px at 50% 0%,
              rgba(250,204,21,0.08),
              transparent 65%
            );
          border-top: 1px solid rgba(255,255,255,0.08);
        }

        .footer-inner {
          max-width: 1200px;
          margin: 0 auto;
          display: grid;
          grid-template-columns: 2fr 2fr;
          gap: 48px;
        }

        .footer-brand-head {
          display: flex;
          align-items: center;
          gap: 12px;
          margin-bottom: 12px;
        }

        .footer-logo-img {
          width: 36px;
          height: 36px;
          object-fit: contain;
        }

        .footer-logo-text {
          font-size: 20px;
          font-weight: 900;
        }

        .footer-tagline {
          font-size: 14px;
          line-height: 1.5;
          color: rgba(255,255,255,0.6);
          max-width: 320px;
          text-align: left;
        }

        .footer-cols {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 48px;
        }

        .footer-col-title {
          font-size: 12px;
          font-weight: 700;
          letter-spacing: 0.14em;
          color: rgba(255,255,255,0.7);
          margin-bottom: 14px;
        }

        .footer-col a {
          display: block;
          font-size: 14px;
          color: rgba(255,255,255,0.6);
          margin-bottom: 10px;
          text-decoration: none;
        }

        .footer-col a:hover {
          color: #facc15;
        }

        .footer-bottom {
          max-width: 1200px;
          margin: 48px auto 0;
          padding-top: 20px;
          border-top: 1px solid rgba(255,255,255,0.06);
          display: grid;
          grid-template-columns: 1fr auto auto;
          align-items: center;
          gap: 16px;
          font-size: 13px;
          color: rgba(255,255,255,0.5);
        }

        .footer-links a {
          margin-right: 16px;
          font-weight: 600;
          color: rgba(255,255,255,0.6);
          text-decoration: none;
        }

        .footer-social {
          display: flex;
          gap: 12px;
        }

        .footer-social a {
          width: 34px;
          height: 34px;
          border-radius: 50%;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          background: rgba(255,255,255,0.06);
          transition: all 0.25s ease;
        }

        .footer-social svg {
          width: 16px;
          height: 16px;
          fill: rgba(255,255,255,0.85);
          transition: fill 0.25s ease;
        }

        .footer-social a:hover {
          background: rgba(250,204,21,0.18);
          transform: translateY(-2px);
        }

        .footer-social a:hover svg {
          fill: #facc15;
        }

        @media (max-width: 768px) {
          .footer-inner {
            grid-template-columns: 1fr;
            gap: 36px;
          }

          .footer-brand {
            align-items: flex-start;
            text-align: left;
          }

          .footer-brand-head {
            justify-content: flex-start;
          }

          .footer-cols {
            grid-template-columns: 1fr 1fr;
            gap: 32px;
            text-align: center;
          }

          .footer-bottom {
            grid-template-columns: 1fr;
            gap: 12px;
            text-align: center;
          }

          .footer-links,
          .footer-social {
            justify-content: center;
          }
        }
      `}</style>
    </footer>
  );
}
