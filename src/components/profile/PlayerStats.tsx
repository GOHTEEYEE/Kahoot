"use client";

import { GameIcon } from "../home/GameIcon";
import { playSfx } from "../../lib/audio/sfx";
import type { ProfileSnapshot } from "../../lib/profile";
import { getProfileCopy } from "../../lib/i18n/profile";
import { useLocale } from "../../lib/i18n/useLocale";

type StatKey = "trophy" | "power" | "streak" | "challenges";

type Props = {
  profile: ProfileSnapshot;
  onOpen: (key: StatKey) => void;
};

export function PlayerStats({ profile, onOpen }: Props) {
  const { locale } = useLocale();
  const copy = getProfileCopy(locale);
  const stats: {
    key: StatKey;
    label: string;
    icon: "trophy" | "swords" | "quest" | "challenge";
    value: string;
  }[] = [
    { key: "trophy", label: copy.trophy, icon: "trophy", value: String(profile.trophies) },
    { key: "power", label: copy.power, icon: "swords", value: String(profile.learningPower.total) },
    {
      key: "streak",
      label: copy.streak,
      icon: "quest",
      value: copy.streakDays(profile.streak.current),
    },
    {
      key: "challenges",
      label: copy.challenges,
      icon: "challenge",
      value: String(profile.completedChallenges),
    },
  ];

  return (
    <section className="mt-3 grid grid-cols-4 gap-1.5" aria-label={copy.statsAria}>
      {stats.map((s) => (
        <button
          key={s.key}
          type="button"
          onClick={() => {
            playSfx("tap");
            onOpen(s.key);
          }}
          className="hud-plate flex flex-col items-center rounded-[1.15rem] px-1 py-2.5 ring-1 ring-[#f0d9a0]/90 transition active:scale-[0.97]"
          aria-label={s.label}
        >
          <GameIcon name={s.icon} className="h-7 w-7" />
          <p className="mt-1 font-[family-name:var(--font-display)] text-[15px] font-bold leading-none text-[#3d2f1e] tabular-nums">
            {s.value}
          </p>
          <p className="mt-1 text-[8px] font-extrabold leading-tight text-[#8a5a18]">{s.label}</p>
        </button>
      ))}
    </section>
  );
}
