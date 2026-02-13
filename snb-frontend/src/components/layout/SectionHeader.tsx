"use client";

export default function SectionHeader({
  eyebrow,
  title,
  subtitle,
}: {
  eyebrow?: string;
  title: string;
  subtitle?: string;
}) {
  return (
    <div className="section-header">
      {eyebrow && (
        <div className="section-eyebrow">
          {eyebrow}
        </div>
      )}

      <h2 className="section-title">
        {title}
      </h2>

      {subtitle && (
        <p className="section-subtitle">
          {subtitle}
        </p>
      )}

      <style jsx>{`
        .section-header {
          text-align: center;
          margin-bottom: 80px;
          padding: 0 16px;
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
          margin-bottom: 12px;
        }

        .section-subtitle {
          max-width: 680px;
          margin: 0 auto;
          font-size: 16px;
          line-height: 1.6;
          color: #9ca3af;
        }

        @media (max-width: 768px) {
          .section-header {
            margin-bottom: 60px;
          }

          .section-title {
            font-size: 28px;
          }

          .section-subtitle {
            font-size: 15px;
          }
        }
      `}</style>
    </div>
  );
}
