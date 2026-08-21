"use client";

import { GameIcon } from "../home/GameIcon";
import type { LeaderboardEntry } from "../../lib/leaderboard";

type Props = {
  me: LeaderboardEntry | null;
  place: number;
};

/** Summary card below the list — not part of ranks 1–10. */
export function CurrentUserRanking({ me, place }: Props) {
  return (
    <section className="rounded-[1.25rem] bg-[#3c3425]/94 px-3.5 py-3 text-[#fff8ea] shadow-[var(--game-shadow)] ring-1 ring-[#ffe7b8]/20">
      <p className="text-[11px] font-extrabold tracking-wide text-[#ffe7b4]/85 uppercase">
        我的排名
      </p>
      {!me || place < 1 ? (
        <p className="mt-2 font-[family-name:var(--font-display)] text-base font-bold">
          尚未上榜 · 完成挑战即可入榜
        </p>
      ) : (
        <div className="mt-2 flex items-center gap-2.5">
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[var(--game-green)] font-[family-name:var(--font-display)] text-[15px] font-black text-white">
            {place}
          </span>
          <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-full bg-[#ffe9c4] ring-2 ring-white/40">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/worlds/chinese/momo.png?v=live"
              alt=""
              className="h-full w-full object-cover object-top"
              draggable={false}
            />
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate font-[family-name:var(--font-display)] text-[15px] font-bold">
              {me.displayName} · 你
            </p>
            <p className="truncate text-[11px] font-bold text-[#ffe7b4]/75">
              {me.rankTitle} · {me.grade}年级
            </p>
          </div>
          <div className="flex shrink-0 items-center gap-0.5 text-[#ffd75a]">
            <GameIcon name="trophy" size="utility" className="h-[18px] w-[18px]" />
            <span className="font-[family-name:var(--font-display)] text-[18px] font-bold tabular-nums">
              {me.trophies}
            </span>
          </div>
        </div>
      )}
    </section>
  );
}
