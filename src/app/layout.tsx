import type { Metadata } from "next";
import { Fredoka, Nunito } from "next/font/google";
import "./globals.css";
import { SfxBoot } from "../components/SfxBoot";
import { DebugConsole } from "../components/DebugConsole";
import { HtmlLang } from "../components/HtmlLang";

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
  title: "MathArena",
  description: "Primary quiz battles: Chinese, English, Malay, Math, Science. Earn trophies and climb the ranks.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="zh-CN"
      className={`${display.variable} ${body.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="flex min-h-full flex-col" suppressHydrationWarning>
        <HtmlLang />
        <DebugConsole />
        <SfxBoot />
        {children}
      </body>
    </html>
  );
}
