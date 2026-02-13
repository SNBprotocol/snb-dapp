"use client";

import Link from "next/link";
import ConnectWallet from "./ConnectWallet";

export default function Header() {
  return (
    <header className="header">
      {/* 左侧占位，保证中间居中 */}
      <div style={{ width: 120 }} />

      {/* 中间 Logo 区 */}
      <Link href="/" className="logo-wrap">
        <img src="/logo.png" alt="SNB Logo" className="logo-img" />
        <span className="logo-text">SNB</span>
      </Link>

      {/* 右侧钱包 */}
      <ConnectWallet />
    </header>
  );
}
