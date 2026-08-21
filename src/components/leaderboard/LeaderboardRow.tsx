"use client";

import { motion } from "framer-motion";
import { playSfx } from "../../lib/audio/sfx";
import type { LeaderboardEntry } from "../../lib/leaderboard";
import { GameIcon } from "../home/GameIcon";
import { localizedGrade } from "../../lib/i18n/home";
import { getSharedLabels, localizedRankName } from "../../lib/i18n/labels";
import { useLocale } from "../../lib/i18n/useLocale";

type Props = {
  place: number;
  entry: LeaderboardEntry;
  isMe: boolean;
  onClick: () => void;
  /** When true, omit outer card chrome (used inside unified list). */
  embedded?: boolean;
};

function rankBadgeClass(place: number, isMe: boolean): string {
  if (isMe) return "bg-white/25 text-[#fff8ea]";
  if (place === 1) return "bg-[#f5c842] text-[#4a320e]";
  if (place === 2) return "bg-[#c5d4e8] text-[#3d4a5c]";
  if (place === 3) return "bg-[#e8b888] text-[#5a3a18]";
  return "bg-[#d7ebf7] text-[#3d5a6e]";
}

export function LeaderboardRow({ place, entry, isMe, onClick, embedded = true }: Props) {
  const { locale } = useLocale();
  const labels = getSharedLabels(locale);
  return (
    <motion.button
      type="button"
      onClick={() => {
        playSfx("tap");
        onClick();
      }}
      whileTap={{ scale: 0.985 }}
      className={`flex min-h-[74px] w-full items-center gap-2.5 px-3 py-2 text-left transition-colors ${
        embedded
          ? isMe
            ? "bg-[var(--game-green)] text-[#fff8ea]"
            : "bg-transparent text-[#3d2f1e] hover:bg-[#fff4d8]/55"
          : isMe
            ? "rounded-[1.15rem] bg-[var(--game-green)] text-[#fff8ea] shadow-[var(--game-shadow)]"
            : "rounded-[1.15rem] bg-[#fff8ea] text-[#3d2f1e] shadow-[var(--game-shadow)] ring-1 ring-[#e8c98a]/40"
      }`}
    >
      <span
        className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full font-[family-name:var(--font-display)] text-[14px] font-black ${rankBadgeClass(place, isMe)}`}
      >
        {place}
      </span>

      <div className="relative h-11 w-11 shrink-0 overflow-hidden rounded-full bg-[#ffe9c4] ring-2 ring-white/80">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/worlds/chinese/momo.png?v=live"
          alt=""
          className="h-full w-full object-cover object-top"
          draggable={false}
        />
      </div>

      <div className="min-w-0 flex-1">
        <p className="truncate font-[family-name:var(--font-display)] text-[15px] font-bold leading-tight">
          {entry.displayName}
          {isMe ? labels.youSuffix : ""}
        </p>
        <p className={`truncate text-[11px] font-extrabold leading-snug ${isMe ? "text-white/85" : "text-[#8a7355]"}`}>
          <span style={{ color: isMe ? undefined : entry.rankColor }}>{localizedRankName(entry.rankTitle, locale)}</span>
          {" · "}
          {localizedGrade(entry.grade as 1 | 2 | 3 | 4 | 5 | 6, locale)}
        </p>
        <p className={`truncate text-[10px] font-bold leading-snug ${isMe ? "text-white/70" : "text-[#a08968]"}`}>
          {entry.school}
        </p>
      </div>

      <div
        className={`flex shrink-0 flex-col items-end leading-none ${isMe ? "text-[#fff8ea]" : "text-[#8a5a18]"}`}
      >
        <span className="inline-flex items-center gap-0.5">
          <GameIcon name="trophy" size="utility" className="h-[18px] w-[18px]" />
          <span className="font-[family-name:var(--font-display)] text-[18px] font-bold tabular-nums">
            {entry.trophies}
          </span>
        </span>
      </div>
    </motion.button>
  );
}

export function LeaderboardRowSkeleton() {
  return (
    <div className="flex min-h-[74px] w-full items-center gap-2.5 px-3 py-2">
      <div className="h-8 w-8 shrink-0 animate-pulse rounded-full bg-[#e8dcc4]/80" />
      <div className="h-11 w-11 shrink-0 animate-pulse rounded-full bg-[#e8dcc4]/80" />
      <div className="min-w-0 flex-1 space-y-1.5">
        <div className="h-3.5 w-28 animate-pulse rounded bg-[#e8dcc4]/80" />
        <div className="h-2.5 w-36 animate-pulse rounded bg-[#e8dcc4]/55" />
        <div className="h-2.5 w-24 animate-pulse rounded bg-[#e8dcc4]/45" />
      </div>
      <div className="h-4 w-10 animate-pulse rounded bg-[#e8dcc4]/70" />
    </div>
  );
}
