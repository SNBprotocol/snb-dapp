"use client";

import { useI18n } from "@/lib/i18n";

export default function LangSwitch() {
  const { lang, switchLang } = useI18n();

  return (
    <div
      style={{
        display: "flex",
        background: "#111",
        borderRadius: 999,
        padding: 4,
        gap: 4,
        border: "1px solid #222",
      }}
    >
      {(["zh", "en"] as const).map((l) => {
        const active = lang === l;
        return (
          <button
            key={l}
            onClick={() => switchLang(l)}
            style={{
              padding: "4px 10px",
              borderRadius: 999,
              fontSize: 12,
              fontWeight: 600,
              background: active ? "#facc15" : "transparent",
              color: active ? "#000" : "#aaa",
              cursor: "pointer",
              border: "none",
            }}
          >
            {l.toUpperCase()}
          </button>
        );
      })}
    </div>
  );
}
