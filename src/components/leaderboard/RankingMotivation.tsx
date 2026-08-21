"use client";

import { nextRankGoalLine } from "../../lib/i18n/leaderboard";
import { useLocale } from "../../lib/i18n/useLocale";

type Props = {
  gapLine: string;
  motivation: string;
  meIndex: number;
  trophyGap: number;
};

export function RankingMotivation({ gapLine, motivation, meIndex, trophyGap }: Props) {
  const { locale } = useLocale();

  return (
    <section className="rounded-[1.25rem] bg-gradient-to-br from-[#fff8ea] to-[#ffe9c4] px-3.5 py-3 shadow-[var(--game-shadow)] ring-1 ring-[#e8c98a]/40">
      <p className="font-[family-name:var(--font-display)] text-[15px] font-bold text-[#3d2f1e]">
        {gapLine}
      </p>
      <p className="mt-0.5 text-[12px] font-extrabold text-[#8a5a18]">
        {nextRankGoalLine(locale, meIndex, trophyGap)}
      </p>
      <p className="mt-1 text-[11px] font-bold text-[#6b4525]/80">{motivation}</p>
    </section>
  );
}
