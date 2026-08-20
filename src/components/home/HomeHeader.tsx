"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import type { ReactNode } from "react";
import { gradeLabel, type Grade } from "../../lib/curriculum";
import { isSfxMuted, playSfx, setSfxMuted } from "../../lib/audio/sfx";
import { useSfxMuted } from "../../lib/audio/useSfxMuted";
import { GameIcon } from "./GameIcon";
import { UtilityIcon } from "../icons/UtilityIcon";

type Props = {
  name: string;
  grade: Grade;
  xpLevel: number;
  xpProgress?: number;
  coins: number;
  gems: number;
  onNotify?: () => void;
  onMail?: () => void;
};

export function HomeHeader({
  name,
  grade,
  xpLevel,
  xpProgress = 0,
  coins,
  gems,
  onNotify,
  onMail,
}: Props) {
  const muted = useSfxMuted();
  const initial = name.trim().slice(0, 1).toUpperCase() || "?";
  const xpNow = xpLevel * 250 + xpProgress * 8;
  const xpMax = (xpLevel + 1) * 250;
  const xpPct = Math.min(100, Math.round((xpNow / xpMax) * 100));

  return (
    <header className="relative z-30 shrink-0 py-0.5">
      <div className="flex items-start gap-2">
        <div className="profile-plate flex min-w-0 shrink-0 items-center gap-2.5 rounded-[1.1rem] px-2.5 py-2">
          <div className="relative shrink-0">
            <div className="profile-avatar flex h-10 w-10 items-center justify-center rounded-full font-[family-name:var(--font-display)] text-base font-bold text-[#4a3414]">
              {initial}
            </div>
            <span className="level-badge absolute -bottom-1 -right-1 flex h-4 min-w-4 items-center justify-center rounded-full px-1 text-[8px] font-black leading-none text-[#ffe27a]">
              {xpLevel}
            </span>
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate font-[family-name:var(--font-display)] text-[14px] font-bold leading-tight text-[#2a2118]">
              {name}
            </p>
            <p className="mt-0.5 text-[9px] font-extrabold leading-none tracking-wide text-[#6b5340]">
              {gradeLabel(grade)} · Lv.{xpLevel}
            </p>
            <div className="mt-1.5 flex items-center gap-1.5">
              <div className="h-2 min-w-0 flex-1 overflow-hidden rounded-full bg-[#3c3425]/14 ring-1 ring-white/45">
                <motion.div
                  className="h-full rounded-full bg-gradient-to-r from-[#58b94b] via-[#7ed957] to-[#b8f070]"
                  initial={{ width: 0 }}
                  animate={{ width: `${xpPct}%` }}
                  transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                />
              </div>
              <span className="shrink-0 text-[8px] font-black tabular-nums text-[#6b5340]">
                {xpPct}%
              </span>
            </div>
          </div>
        </div>

        <div className="flex shrink-0 flex-col items-end gap-1.5">
          <div className="flex items-center gap-1">
            <CurrencyPill icon="coin" value={coins} variant="coin" />
            <CurrencyPill icon="gem" value={gems} variant="gem" />
          </div>
          <div className="flex items-center gap-1">
            <HudRoundBtn
              label="邮件"
              badge="3"
              onClick={() => {
                playSfx("mail");
                onMail?.();
              }}
            >
              <GameIcon name="mail" size="utility" />
            </HudRoundBtn>
            <HudRoundBtn
              label="通知"
              badge="2"
              onClick={() => {
                playSfx("hud");
                onNotify?.();
              }}
            >
              <GameIcon name="notification" size="utility" />
            </HudRoundBtn>
            <HudRoundBtn
              label={muted ? "打开音效" : "关闭音效"}
              onClick={() => {
                if (isSfxMuted()) {
                  setSfxMuted(false);
                  playSfx("hud");
                } else {
                  playSfx("mute");
                  setSfxMuted(true);
                }
              }}
            >
              <span className="relative">
                <GameIcon name="event" size="utility" />
                {muted ? (
                  <span className="absolute inset-0 flex items-center justify-center text-[9px] font-black text-[#f04444]">
                    /
                  </span>
                ) : null}
              </span>
            </HudRoundBtn>
            <Link
              href="/profile"
              aria-label="设置"
              onClick={() => playSfx("tap")}
              className="hud-round-btn flex h-9 w-9 shrink-0 items-center justify-center rounded-full"
            >
              <GameIcon name="settings" size="utility" />
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}

function CurrencyPill({
  icon,
  value,
  variant,
}: {
  icon: "coin" | "gem";
  value: number;
  variant: "coin" | "gem";
}) {
  return (
    <span className="currency-hud inline-flex h-8 shrink-0 items-center gap-1 rounded-full py-0 pl-1.5 pr-0.5 text-[11px] font-black tabular-nums text-[#fff4d6]">
      <GameIcon name={icon} size="utility" />
      {value.toLocaleString()}
      <span
        className={`currency-plus ml-0.5 flex h-[18px] w-[18px] items-center justify-center rounded-full ${
          variant === "gem" ? "bg-[#7046d8] currency-plus--gem" : "bg-[#58b94b]"
        }`}
      >
        <UtilityIcon name="plus" className="h-3 w-3" />
      </span>
    </span>
  );
}

function HudRoundBtn({
  label,
  badge,
  onClick,
  children,
}: {
  label: string;
  badge?: string;
  onClick?: () => void;
  children: ReactNode;
}) {
  return (
    <motion.button
      type="button"
      aria-label={label}
      whileTap={{ scale: 0.92 }}
      onClick={onClick}
      className="hud-round-btn relative flex h-9 w-9 shrink-0 items-center justify-center rounded-full"
    >
      {children}
      {badge ? (
        <motion.span
          className="absolute -right-0.5 -top-0.5 flex h-3.5 min-w-3.5 items-center justify-center rounded-full bg-[#f04444] px-0.5 text-[7px] font-black text-white ring-1 ring-white"
          animate={{ scale: [1, 1.08, 1] }}
          transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
        >
          {badge}
        </motion.span>
      ) : null}
    </motion.button>
  );
}
