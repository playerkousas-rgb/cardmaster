import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "TCG Prompt & Card Master - Pro",
  description: "AI TCG Prompt Generator & Instant Visual Card Maker for Pokémon, One Piece and Yu-Gi-Oh",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-TW">
      <body className="antialiased selection:bg-cyan-500 selection:text-slate-950">
        {children}
      </body>
    </html>
  );
}
