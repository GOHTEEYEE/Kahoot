"use client";

import { motion } from "framer-motion";
import type { DayActivity } from "../../lib/learningLog";
import type { ProfileSnapshot } from "../../lib/profile";
import { playSfx } from "../../lib/audio/sfx";
import { localizedWeekday } from "../../lib/i18n/labels";
import { getProfileCopy } from "../../lib/i18n/profile";
import { useLocale } from "../../lib/i18n/useLocale";

type Props = {
  profile: ProfileSnapshot;
  onDay: (day: DayActivity) => void;
};

export function LearningRecord({ profile, onDay }: Props) {
  const { locale } = useLocale();
  const copy = getProfileCopy(locale);
  const weeklyPct = Math.min(
    100,
    Math.round((profile.weeklyChallenges / Math.max(1, profile.weeklyGoal)) * 100),
  );

  return (
    <section className="hud-plate mt-3 rounded-[1.5rem] p-4 ring-1 ring-[#f0d9a0]/90">
      <h3 className="font-[family-name:var(--font-display)] text-[17px] font-bold text-[#3d2f1e]">
        {copy.recordTitle}
      </h3>
      <p className="mt-1 text-[12px] font-extrabold text-[#c45c26]">
        {copy.streakBanner(profile.streak.current)}
      </p>

      <div className="mt-3 grid grid-cols-7 gap-1.5" role="list" aria-label={copy.weekCalendarAria}>
        {profile.weekDays.map((day) => (
          <button
            key={day.date}
            type="button"
            role="listitem"
            onClick={() => {
              playSfx("tap");
              onDay(day);
            }}
            className="flex flex-col items-center gap-1 rounded-xl py-1.5 transition active:scale-95"
            aria-label={`${day.date} ${day.completed ? copy.studied : copy.notStudied}`}
          >
            <span className="text-[9px] font-extrabold text-[#8a5a18]">
              {localizedWeekday(day.weekday, locale)}
            </span>
            <span
              className={`flex h-7 w-7 items-center justify-center rounded-full text-[12px] font-black ${
                day.completed
                  ? "bg-[#65c84a] text-white shadow-[0_2px_0_#2a9828]"
                  : "bg-[#efe4c8] text-[#b8a078] ring-1 ring-[#e0cfa0]"
              }`}
            >
              {day.completed ? "✓" : ""}
            </span>
          </button>
        ))}
      </div>

      <div className="mt-4">
        <div className="mb-1 flex items-center justify-between text-[11px] font-extrabold text-[#8a5a18]">
          <span>{copy.weeklyProgress}</span>
          <span className="tabular-nums">
            {copy.weeklyChallenges(profile.weeklyChallenges, profile.weeklyGoal)}
          </span>
        </div>
        <div className="h-2.5 overflow-hidden rounded-full bg-[#3c3425]/12 ring-1 ring-white/45">
          <motion.div
            className="h-full rounded-full bg-gradient-to-r from-[#65c84a] to-[#b8f070]"
            initial={{ width: 0 }}
            animate={{ width: `${weeklyPct}%` }}
            transition={{ duration: 0.6 }}
          />
        </div>
      </div>
    </section>
  );
}
