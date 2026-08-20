"use client";

import type { BotOpponent } from "../lib/bot";
import { GameIcon } from "./home/GameIcon";

type MatchPlayer = {
  nickname: string;
  trophies: number;
};

type Props = {
  player: MatchPlayer;
  opponent: BotOpponent | null;
  searching: boolean;
  topic?: string;
  kind?: "arena" | "friend";
};

export function MatchScreen({ player, opponent, searching, topic, kind = "arena" }: Props) {
  const friend = kind === "friend";
  return (
    <section
      className={`animate-phase-in mx-auto flex w-full max-w-lg flex-1 flex-col items-center justify-center gap-8 px-5 py-10 text-center ${
        !searching && opponent ? "animate-screen-shake" : ""
      }`}
    >
      <p className="font-[family-name:var(--font-display)] text-sm font-semibold tracking-[0.2em] text-[var(--brand-deep)] uppercase">
        {searching ? (friend ? "好友对战" : "正在匹配对手") : "对战即将开始"}
      </p>
      {topic ? (
        <p className="animate-rise-in rounded-full bg-white/80 px-4 py-2 text-sm font-extrabold text-[var(--ink)] shadow-sm">
          {topic}
        </p>
      ) : null}

      <div className="relative flex w-full items-center justify-between gap-3">
        <PlayerChip name={player.nickname} trophies={player.trophies} side="you" />

        <div className="relative flex h-16 w-16 shrink-0 items-center justify-center">
          {searching ? (
            <>
              <span className="radar-ring" />
              <span className="radar-ring delay" />
            </>
          ) : null}
          <div
            className={`relative z-10 flex h-14 w-14 items-center justify-center overflow-hidden rounded-full bg-[var(--accent)] font-[family-name:var(--font-display)] text-xl font-bold text-[var(--ink)] shadow-[var(--shadow)] ${
              searching ? "animate-pulse-glow" : "animate-vs-impact"
            }`}
          >
            VS
            {searching ? <span className="animate-sweep absolute inset-0" /> : null}
          </div>
        </div>

        <PlayerChip
          name={opponent?.nickname ?? "????"}
          trophies={opponent?.trophies ?? 0}
          side="foe"
          placeholder={!opponent}
          found={!searching && !!opponent}
        />
      </div>

      <p className="max-w-xs text-base text-[var(--ink-soft)]">
        {searching
          ? friend
            ? "好友正在入场…"
            : "正在寻找奖杯相近的对手…"
          : friend
            ? "好友已加入！准备开战！"
            : "对手已找到！准备开战！"}
      </p>
    </section>
  );
}

function PlayerChip({
  name,
  trophies,
  side,
  placeholder,
  found,
}: {
  name: string;
  trophies: number;
  side: "you" | "foe";
  placeholder?: boolean;
  found?: boolean;
}) {
  const slam =
    side === "you"
      ? "animate-slam-left"
      : found
        ? "animate-slam-right"
        : placeholder
          ? "animate-pulse"
          : "animate-slam-right";

  return (
    <div
      className={`flex min-w-0 flex-1 flex-col items-center gap-2 rounded-3xl px-3 py-4 ${
        side === "you" ? "bg-[var(--brand)] text-white" : "bg-white/80 text-[var(--ink)]"
      } shadow-[var(--shadow)] ${slam}`}
    >
      <span className="truncate font-[family-name:var(--font-display)] text-lg font-semibold">
        {name}
      </span>
      <span className={`inline-flex items-center gap-1 text-sm font-bold ${side === "you" ? "text-white/90" : "text-[var(--ink-soft)]"}`}>
        <GameIcon name="trophy" size="utility" />
        {placeholder ? "—" : trophies}
      </span>
    </div>
  );
}
