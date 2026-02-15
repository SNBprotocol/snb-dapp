// src/app/layout.tsx
import "./globals.css";
import { WalletProvider } from "@/lib/wallet-context";
import { I18nProvider } from "@/lib/i18n";
import ClientHeader from "@/components/ClientHeader";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "SNB Protocol",
  description:
    "SNB is a transparent on-chain mining protocol with integrated Zap entry on BSC.",
  applicationName: "SNB",
  metadataBase: new URL("https://snb-dapp.pages.dev"),
  openGraph: {
    title: "SNB Protocol",
    description:
      "Transparent on-chain mining with built-in Zap entry. Live on BSC.",
    url: "https://snb-dapp.pages.dev",
    siteName: "SNB",
    type: "website",
  },
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="zh">
      <body className="bg-black text-white">
        <I18nProvider>
          <WalletProvider>
            <ClientHeader />
            <main
              style={{
                maxWidth: 1100,
                margin: "0 auto",
                padding: "32px 24px",
              }}
            >
              {children}
            </main>
          </WalletProvider>
        </I18nProvider>
      </body>
    </html>
  );
}
