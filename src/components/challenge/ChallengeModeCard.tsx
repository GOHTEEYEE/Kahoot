"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import type { ChallengeModeMeta } from "../../lib/challenge";
import type { ChallengeCopy } from "../../lib/i18n/challenge";
import { playSfx } from "../../lib/audio/sfx";
import { usePrefersReducedMotion } from "../../lib/usePrefersReducedMotion";
import { GameIcon } from "../home/GameIcon";
import { ChallengeArrowButton } from "./ChallengeArrowButton";
import { ChallengeReward } from "./ChallengeReward";
import { ChallengeSilhouette } from "./ChallengeSilhouette";

type Props = {
  mode: ChallengeModeMeta;
  copy: ChallengeCopy;
  delay?: number;
};

export function ChallengeModeCard({ mode, copy, delay = 0 }: Props) {
  const reduced = usePrefersReducedMotion();
  const text = copy.modes[mode.id];

  return (
    <motion.div
      initial={reduced ? false : { opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
    >
      <Link
        href={mode.href}
        onClick={() => playSfx(mode.id === "arena" ? "challenge" : "tap")}
        className="block"
      >
        <motion.article
          whileHover={reduced ? undefined : { scale: 1.02, filter: "brightness(1.03)" }}
          whileTap={{ scale: 0.97 }}
          transition={{ duration: 0.18, ease: "easeOut" }}
          className={`challenge-card challenge-card--${mode.tone} relative flex min-h-[5.35rem] items-center gap-2.5 overflow-hidden px-2.5 py-2 sm:min-h-[5.5rem] sm:gap-3 sm:px-3`}
        >
          <span className="challenge-card-gloss pointer-events-none absolute inset-x-5 top-1 h-2 rounded-full" aria-hidden />
          <ChallengeSilhouette kind={mode.silhouette} />

          <span className="challenge-icon-badge relative z-[1] flex h-[3.65rem] w-[3.65rem] shrink-0 items-center justify-center sm:h-[3.85rem] sm:w-[3.85rem]">
            <GameIcon name={mode.icon} className="h-[2.85rem] w-[2.85rem] sm:h-[3rem] sm:w-[3rem]" />
          </span>

          <span className="relative z-[1] min-w-0 flex-1 pr-1 text-left">
            <span className="challenge-card-title block font-[family-name:var(--font-display)] text-[clamp(1.02rem,4.2vw,1.18rem)] font-bold leading-tight">
              {text.title}
            </span>
            <span className="challenge-card-desc mt-0.5 block text-[clamp(0.68rem,2.6vw,0.78rem)] font-extrabold leading-snug">
              {text.description}
            </span>
            <ChallengeReward icon={mode.rewardIcon} label={text.reward} />
          </span>

          <ChallengeArrowButton className="relative z-[1]" />
        </motion.article>
      </Link>
    </motion.div>
  );
}
