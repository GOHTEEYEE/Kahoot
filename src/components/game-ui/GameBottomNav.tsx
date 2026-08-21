"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";

import { playSfx } from "../../lib/audio/sfx";
import { getHomeCopy } from "../../lib/i18n/home";
import { useLocale } from "../../lib/i18n/useLocale";
import { usePrefersReducedMotion } from "../../lib/usePrefersReducedMotion";
import { GameIcon } from "../home/GameIcon";

const TAB_DEFS = [
  { href: "/", key: "home" as const, sub: "Home", icon: "home" },
  { href: "/spirits", key: "spirits" as const, sub: "Spirits", icon: "spirit" },
  { href: "/rewards", key: "pass" as const, sub: "Pass", icon: "medal" },
  { href: "/leaderboard", key: "rank" as const, sub: "Rank", icon: "trophy" },
  { href: "/profile", key: "profile" as const, sub: "Profile", icon: "backpack" },
] as const;

export function GameBottomNav() {
  const pathname = usePathname();
  const reduced = usePrefersReducedMotion();
  const { locale } = useLocale();
  const copy = getHomeCopy(locale);

  return (
    <nav className="pointer-events-none absolute inset-x-0 bottom-0 z-40 px-2 pb-[max(0.35rem,env(safe-area-inset-bottom))]">
      <ul className="nav-dock pointer-events-auto mx-auto flex h-[var(--home-nav-h)] w-full items-stretch justify-between gap-0.5 rounded-[1.35rem] px-1.5 py-0.5">
        {TAB_DEFS.map((tab) => {
          const label = copy.nav[tab.key];
          const active =
            tab.href === "/"
              ? pathname === "/"
              : pathname === tab.href || pathname.startsWith(`${tab.href}/`);

          return (
            <li key={tab.href} className="flex flex-1 items-stretch">
              <Link
                href={tab.href}
                onClick={() => playSfx("tap")}
                className={`flex w-full flex-col items-center justify-center gap-0.5 rounded-[0.9rem] px-0.5 py-1 text-center transition-transform duration-200 ${
                  active ? "nav-tab-active" : "text-[#8a7355]"
                }`}
                aria-label={`${label} ${tab.sub}`}
              >
                <motion.span
                  key={`${tab.href}-${active ? "on" : "off"}`}
                  className={`flex h-8 w-8 items-center justify-center rounded-xl ${
                    active ? "opacity-100 saturate-100" : "opacity-75 saturate-[0.88]"
                  }`}
                  aria-hidden
                  initial={active && !reduced ? { scale: 1 } : false}
                  animate={active && !reduced ? { scale: [1, 1.07, 1] } : { scale: 1 }}
                  transition={{ duration: 0.24, ease: "easeOut" }}
                >
                  <GameIcon name={tab.icon} size="nav" />
                </motion.span>
                <span className="font-[family-name:var(--font-display)] text-[9px] font-bold leading-none">
                  {label}
                </span>
                <span className="text-[6px] font-extrabold leading-none tracking-wide opacity-60">
                  {tab.sub}
                </span>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
