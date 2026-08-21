"use client";

import { motion } from "framer-motion";

import {
  getNextTrophyReward,
  getPreviousTrophyMilestone,
} from "../../lib/worlds";
import { TrophyCount } from "../TrophyCount";
import { usePrefersReducedMotion } from "../../lib/usePrefersReducedMotion";
import { getHomeCopy } from "../../lib/i18n/home";
import { useLocale } from "../../lib/i18n/useLocale";
import { GameIcon } from "../home/GameIcon";

type Props = {
  trophies: number;
  mascotName: string;
};

/** Dark RPG-style progression rail below the island hero. */
export function GameTrophyBar({ trophies, mascotName }: Props) {
  const reduced = usePrefersReducedMotion();
  const { locale } = useLocale();
  const copy = getHomeCopy(locale);
  const next = getNextTrophyReward(trophies);
  const prev = getPreviousTrophyMilestone(trophies);
  const target = next?.trophies ?? Math.max(trophies, 1);
  const span = Math.max(1, target - prev);
  const progress = next ? Math.min(1, (trophies - prev) / span) : 1;
  const need = next ? Math.max(0, next.trophies - trophies) : 0;
  const isFragment = Boolean(next?.title.toLowerCase().includes("fragment"));
  const rewardLabel = isFragment ? `${mascotName} Fragment ×20` : next?.title ?? "";

  return (
    <section
      className="trophy-rail trophy-rail--compact flex w-full shrink-0 items-center rounded-[1.25rem] px-2.5 ring-1 ring-[#ffe7b8]/14"
      style={{ height: "var(--trophy-panel-height)", borderRadius: "1.25rem" }}
    >
      <div className="flex w-full items-center gap-2">
        <div className="flex shrink-0 items-center gap-1.5">
          <GameIcon name="trophy" size="progress" className="h-8 w-8" />
          <div className="leading-none">
            <TrophyCount
              value={trophies}
              className="reward-glow font-[family-name:var(--font-display)] text-[clamp(1.05rem,4.2vw,1.25rem)] font-bold text-[#fff4d0]"
            />
            <p className="mt-0.5 text-[6.5px] font-black tracking-[0.18em] text-[#ffd9a0]">
              TROPHY
            </p>
          </div>
        </div>

        <div className="relative h-2 min-w-0 flex-1 overflow-hidden rounded-full bg-black/52 ring-1 ring-[#ffe27a]/25">
          <motion.div
            className="relative h-full origin-left overflow-hidden rounded-full bg-gradient-to-r from-[#ff8a2a] via-[#ffc14a] to-[#fff38a] will-change-transform trophy-bar-shine"
            initial={{ scaleX: 0 }}
            animate={{ scaleX: progress }}
            transition={{
              duration: reduced ? 0.2 : 0.85,
              ease: [0.16, 1, 0.3, 1],
            }}
          />
        </div>

        {next ? (
          <div className="flex max-w-[42%] shrink-0 items-center gap-1.5 text-right">
            <div className="min-w-0">
              <p className="text-[6.5px] font-extrabold tracking-[0.12em] text-white/45">
                {copy.nextReward}
              </p>
              <p className="truncate text-[10px] font-extrabold text-[#ffe27a]">
                {rewardLabel}
              </p>
              <p className="text-[7.5px] font-bold text-white/60">
                {copy.trophyToUnlock(need)}
              </p>
            </div>
            <span className="reward-orb-glow flex h-8 w-8 shrink-0 items-center justify-center rounded-[0.65rem] bg-gradient-to-b from-[#9a72ff] to-[#7046d8] ring-1 ring-white/40">
              <GameIcon name="reward" size="sideHud" />
            </span>
          </div>
        ) : (
          <p className="text-[11px] font-bold text-[#ffe27a]">{copy.allCollected}</p>
        )}
      </div>
    </section>
  );
}

