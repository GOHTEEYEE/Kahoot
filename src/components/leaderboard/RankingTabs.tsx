"use client";

import { playSfx } from "../../lib/audio/sfx";
import {
  RANKING_PERIODS,
  RANKING_SUBJECT_TAB_IDS,
  type RankingPeriod,
  type RankingSubjectFilter,
} from "../../lib/leaderboard";
import { getLeaderboardCopy, rankingSubjectLabel } from "../../lib/i18n/leaderboard";
import { useLocale } from "../../lib/i18n/useLocale";

type SubjectProps = {
  value: RankingSubjectFilter;
  onChange: (v: RankingSubjectFilter) => void;
};

export function RankingSubjectTabs({ value, onChange }: SubjectProps) {
  const { locale } = useLocale();

  return (
    <div className="-mx-1 flex gap-1.5 overflow-x-auto px-1 pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
      {RANKING_SUBJECT_TAB_IDS.map((id) => {
        const active = value === id;
        return (
          <button
            key={id}
            type="button"
            onClick={() => {
              playSfx("tap");
              onChange(id);
            }}
            className={`shrink-0 rounded-full px-3.5 py-1.5 text-[12px] font-extrabold transition-transform active:scale-95 ${
              active
                ? "bg-[var(--game-green)] text-white shadow-[0_3px_0_rgba(45,120,35,0.45),0_6px_12px_rgba(40,25,10,0.16)]"
                : "bg-[#fff8ea] text-[#6b4525] shadow-sm ring-1 ring-[#e8c98a]/50"
            }`}
          >
            {rankingSubjectLabel(id, locale)}
          </button>
        );
      })}
    </div>
  );
}

type PeriodProps = {
  value: RankingPeriod;
  onChange: (v: RankingPeriod) => void;
};

export function RankingPeriodTabs({ value, onChange }: PeriodProps) {
  const { locale } = useLocale();
  const copy = getLeaderboardCopy(locale);

  return (
    <div className="flex gap-1 rounded-full bg-[#fff8ea]/70 p-1 ring-1 ring-[#e8c98a]/40">
      {RANKING_PERIODS.map((id) => {
        const active = value === id;
        return (
          <button
            key={id}
            type="button"
            onClick={() => {
              playSfx("tap");
              onChange(id);
            }}
            className={`flex-1 rounded-full px-1 py-1.5 text-[11px] font-extrabold transition-transform active:scale-95 ${
              active ? "bg-[#a96b32] text-[#fff8ea] shadow-sm" : "text-[#8a7355]"
            }`}
          >
            {copy.periods[id]}
          </button>
        );
      })}
    </div>
  );
}
