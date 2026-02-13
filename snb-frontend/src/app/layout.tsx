// src/app/layout.tsx
import "./globals.css";
import { WalletProvider } from "@/lib/wallet-context";
import { I18nProvider } from "@/lib/i18n";
import ClientHeader from "@/components/ClientHeader";

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
