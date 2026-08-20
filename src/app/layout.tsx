import type { Metadata } from "next";
import { Fredoka, Nunito } from "next/font/google";
import "./globals.css";
import { SfxBoot } from "../components/SfxBoot";
import { DebugConsole } from "../components/DebugConsole";

const display = Fredoka({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["500", "600", "700"],
});

const body = Nunito({
  variable: "--font-body",
  subsets: ["latin"],
  weight: ["500", "700", "800"],
});

export const metadata: Metadata = {
  title: "MathArena · 学习擂台",
  description: "小学1–6年级对战：华文、英文、马来文、数学、科学，赢取奖杯冲排行榜",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="zh-CN"
      className={`${display.variable} ${body.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col">
        <DebugConsole />
        <SfxBoot />
        {children}
      </body>
    </html>
  );
}
