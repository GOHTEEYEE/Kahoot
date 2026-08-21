"use client";

import { GameIcon } from "../home/GameIcon";
import { playSfx } from "../../lib/audio/sfx";
import type { ProfileSnapshot } from "../../lib/profile";

type StatKey = "trophy" | "power" | "streak" | "challenges";

type Props = {
  profile: ProfileSnapshot;
  onOpen: (key: StatKey) => void;
};

const STATS: {
  key: StatKey;
  label: string;
  icon: "trophy" | "swords" | "quest" | "challenge";
  value: (p: ProfileSnapshot) => string;
}[] = [
  { key: "trophy", label: "奖杯", icon: "trophy", value: (p) => String(p.trophies) },
  {
    key: "power",
    label: "学习战力",
    icon: "swords",
    value: (p) => String(p.learningPower.total),
  },
  {
    key: "streak",
    label: "连续学习",
    icon: "quest",
    value: (p) => `${p.streak.current}天`,
  },
  {
    key: "challenges",
    label: "完成挑战",
    icon: "challenge",
    value: (p) => String(p.completedChallenges),
  },
];

export function PlayerStats({ profile, onOpen }: Props) {
  return (
    <section className="mt-3 grid grid-cols-4 gap-1.5" aria-label="玩家统计">
      {STATS.map((s) => (
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
            {s.value(profile)}
          </p>
          <p className="mt-1 text-[8px] font-extrabold leading-tight text-[#8a5a18]">{s.label}</p>
        </button>
      ))}
    </section>
  );
}
