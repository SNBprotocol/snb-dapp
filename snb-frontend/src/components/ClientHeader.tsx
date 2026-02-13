"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import ConnectWallet from "@/components/ConnectWallet";
import LangSwitch from "@/components/LangSwitch";
import { useI18n } from "@/lib/i18n";

const tabs = [
  { key: "overview", href: "/dashboard" },
  { key: "zap", href: "/zap" },
  { key: "mining", href: "/mining" },
  { key: "referral", href: "/referral" },
  { key: "stats", href: "/stats" },
  { key: "whitepaper", href: "/whitepaper" },
];

export default function ClientHeader() {
  const pathname = usePathname();
  const { t } = useI18n();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const isHome = pathname === "/";

  function isActive(href: string) {
    return pathname === href || pathname.startsWith(href + "/");
  }

  /* 首页滚动联动（其它页面不受影响） */
  useEffect(() => {
    if (!isHome) {
      setScrolled(false);
      return;
    }

    function onScroll() {
      setScrolled(window.scrollY > 40);
    }

    window.addEventListener("scroll", onScroll);
    onScroll();

    return () => window.removeEventListener("scroll", onScroll);
  }, [isHome]);

  return (
    <header
      style={{
        borderBottom: "1px solid #222",
        background: scrolled ? "rgba(0,0,0,0.55)" : "#000",
        backdropFilter: scrolled ? "blur(10px)" : "none",
        position: "sticky",
        top: 0,
        zIndex: 50,
        transition: "background 0.25s ease, backdrop-filter 0.25s ease",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "14px 24px",
          gap: 12,
        }}
      >
        {/* 左侧 Logo */}
        <Link
          href="/"
          className="logo-wrap"
          style={{
            display: "flex",
            alignItems: "center",
            gap: 10,
            textDecoration: "none",
            flexShrink: 0,
          }}
        >
          <Image
            src="/logo.png"
            alt="SNB Logo"
            width={32}
            height={32}
            priority
            className="logo-img"
          />
          <span className="logo-text">SNB</span>
        </Link>

        {/* 中间 Tabs（仅桌面） */}
        <nav className="nav-desktop">
          {tabs.map((tab) => {
            const active = isActive(tab.href);
            return (
              <Link
                key={tab.href}
                href={tab.href}
                style={{
                  padding: "6px 12px",
                  borderRadius: 12,
                  background: active ? "#facc15" : "transparent",
                  color: active ? "#000" : "#fff",
                  fontWeight: 600,
                }}
              >
                {t(`nav.${tab.key}`)}
              </Link>
            );
          })}
        </nav>

        {/* 右侧：始终显示（桌面 + 移动） */}
        <div
          className="nav-right"
          style={{
            display: "flex",
            alignItems: "center",
            gap: 10,
            flexShrink: 0,
          }}
        >
          <LangSwitch />
          <ConnectWallet />

          {/* 汉堡按钮（仅移动端） */}
          <button
            className="nav-mobile-btn"
            onClick={() => setOpen((v) => !v)}
            aria-label="menu"
          >
            ☰
          </button>
        </div>
      </div>

      {/* 移动端菜单 */}
{open && (
  <div className="nav-mobile-menu">
    {/* ✅ 移动端菜单顶部：语言 + 钱包（始终可见） */}
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        gap: 12,
        padding: "12px",
        marginBottom: 12,
        borderBottom: "1px solid #222",
      }}
    >
      <LangSwitch />
      <ConnectWallet />
    </div>

    {/* 导航列表 */}
    <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
      {tabs.map((tab) => {
        const active = isActive(tab.href);
        return (
          <Link
            key={tab.href}
            href={tab.href}
            onClick={() => setOpen(false)}
            style={{
              padding: "10px 12px",
              borderRadius: 12,
              background: active ? "#facc15" : "transparent",
              color: active ? "#000" : "#fff",
              fontWeight: 600,
            }}
          >
            {t(`nav.${tab.key}`)}
          </Link>
        );
      })}
    </div>
  </div>
)}
    </header>
  );
}
