"use client";

import Link from "next/link";
import type { AchievementView } from "../../lib/achievements";
import type { ProfileSnapshot } from "../../lib/profile";
import { GameIcon } from "../home/GameIcon";
import { playSfx } from "../../lib/audio/sfx";
import { getProfileCopy } from "../../lib/i18n/profile";
import { useLocale } from "../../lib/i18n/useLocale";

type Props = {
  profile: ProfileSnapshot;
  onOpen: (a: AchievementView) => void;
};

function AchievementGlyph({ achievement }: { achievement: AchievementView }) {
  const map = {
    trophy: "trophy",
    fire: "quest",
    brain: "spirit",
    swords: "swords",
    lock: "leaderboard",
    star: "medal",
    map: "map",
    medal: "medal",
  } as const;
  return <GameIcon name={map[achievement.icon]} className="h-8 w-8" />;
}

export function AchievementSection({ profile, onOpen }: Props) {
  const { locale } = useLocale();
  const copy = getProfileCopy(locale);
  const preview = profile.achievements.slice(0, 5);

  return (
    <section className="hud-plate mt-3 rounded-[1.5rem] p-4 ring-1 ring-[#f0d9a0]/90">
      <div className="flex items-end justify-between gap-2">
        <h3 className="font-[family-name:var(--font-display)] text-[17px] font-bold text-[#3d2f1e]">
          {copy.achievementsTitle}
        </h3>
        <p className="text-[11px] font-extrabold tabular-nums text-[#8a5a18]">
          {copy.unlockedCount(profile.unlockedCount, profile.achievementTotal)}
        </p>
      </div>

      <ul className="mt-3 grid grid-cols-5 gap-2">
        {preview.map((a) => (
          <li key={a.id}>
            <button
              type="button"
              onClick={() => {
                playSfx("tap");
                onOpen(a);
              }}
              className={`flex w-full flex-col items-center gap-1 rounded-[1rem] px-1 py-2 ring-1 transition active:scale-95 ${
                a.unlocked
                  ? "bg-[#fff8ea] ring-[#e8c98a]/70"
                  : "bg-[#ebe4d4]/80 ring-[#d5c9a8]/50 grayscale opacity-70"
              }`}
              aria-label={a.name}
            >
              <AchievementGlyph achievement={a} />
              <span className="line-clamp-2 text-center text-[8px] font-extrabold leading-tight text-[#3d2f1e]">
                {a.name}
              </span>
            </button>
          </li>
        ))}
      </ul>

      <Link
        href="/achievements"
        onClick={() => playSfx("tap")}
        className="mt-3 block w-full text-center text-[12px] font-extrabold text-[#2f9e6e]"
      >
        {copy.viewAllAchievements}
      </Link>
    </section>
  );
}
