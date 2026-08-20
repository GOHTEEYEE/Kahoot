"use client";

import { motion } from "framer-motion";
import { ANIM } from "../../lib/animation/animationConfig";
import { playSfx } from "../../lib/audio/sfx";
import { usePrefersReducedMotion } from "../../lib/usePrefersReducedMotion";
import { GameIcon } from "./GameIcon";

type Props = {
  onClick: () => void;
  disabled?: boolean;
};

export function ChallengeButton({ onClick, disabled }: Props) {
  const reduced = usePrefersReducedMotion();
  const { breatheMs, hoverScale } = ANIM.challenge;

  return (
    <motion.button
      type="button"
      disabled={disabled}
      onClick={() => {
        playSfx("challenge");
        onClick();
      }}
      whileHover={reduced ? undefined : { scale: hoverScale }}
      whileTap={{ scale: 0.97, y: 3 }}
      transition={{ type: "spring", stiffness: 420, damping: 22 }}
      className={`cta-gold relative flex h-full min-w-0 basis-[58%] items-center justify-center rounded-[var(--game-radius)] px-3 will-change-transform disabled:opacity-50 ${
        reduced ? "" : "cta-idle-glow"
      }`}
      style={{ animationDuration: `${breatheMs}ms`, minHeight: "var(--home-cta-height)" }}
    >
      <span className="pointer-events-none absolute inset-x-7 top-2 h-2.5 rounded-full bg-white/48" />
      <span className="relative z-10 flex items-center justify-center gap-2.5 text-[#4a320e]">
        <GameIcon name="challenge" size="challenge" />
        <span className="text-left leading-tight">
          <span className="block font-[family-name:var(--font-display)] text-[clamp(1.15rem,4.8vw,1.35rem)] font-bold drop-shadow-[0_1px_0_rgba(255,255,255,0.45)]">
            挑战
          </span>
          <span className="block text-[9px] font-extrabold tracking-[0.18em] opacity-70">
            CHALLENGE
          </span>
        </span>
      </span>
    </motion.button>
  );
}
