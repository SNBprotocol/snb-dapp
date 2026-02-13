"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const NAVS = [
  { label: "Zap", href: "/zap" },
  { label: "Mining", href: "/mining" },
  { label: "Referral", href: "/referral" },
  { label: "Stats", href: "/stats" },
];

export default function TopNav() {
  const pathname = usePathname();

  return (
    <nav style={{ display: "flex", gap: 16 }}>
      {NAVS.map((item) => {
        const active =
          pathname === item.href ||
          pathname.startsWith(item.href + "/");

        return (
          <Link
            key={item.href}
            href={item.href}
            className={`topnav-link ${active ? "active" : ""}`}
          >
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}
