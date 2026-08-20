"use client";

import type { ReactNode } from "react";
import { motion } from "framer-motion";

import { ANIM } from "../../lib/animation/animationConfig";
import { usePrefersReducedMotion } from "../../lib/usePrefersReducedMotion";
import type { GameIconId, GameIconSize } from "../../lib/gameIcons";
import { GameIcon } from "../home/GameIcon";
import { gameUiTokens } from "../../lib/game-ui-tokens";

type Props = {
  variant: "gold" | "green";
  icon: GameIconId;
  iconSize: GameIconSize;
  titleZh: string;
  titleEn: string;
  onClick: () => void;
  disabled?: boolean;
  children?: ReactNode;
  flexBasisClass?: string;
};

export function GameButton({
  variant,
  icon,
  iconSize,
  titleZh,
  titleEn,
  onClick,
  disabled,
  flexBasisClass = "basis-[58%]",
}: Props) {
  const reduced = usePrefersReducedMotion();
  const { breatheMs, hoverScale } = ANIM.challenge;

  const ctaClass = variant === "gold" ? "cta-gold" : "cta-green";
  const idleGlow = variant === "gold" ? "cta-idle-glow" : "";

  return (
    <motion.button
      type="button"
      disabled={disabled}
      onClick={onClick}
      whileHover={reduced ? undefined : { scale: hoverScale }}
      whileTap={{ scale: 0.97, y: 3 }}
      transition={{ type: "spring", stiffness: 420, damping: 22 }}
      className={`relative flex h-full min-w-0 ${flexBasisClass} items-center justify-center gap-2.5 rounded-[var(--game-radius)] px-3 will-change-transform disabled:opacity-50 ${ctaClass} ${idleGlow}`}
      style={{
        borderRadius: gameUiTokens.radii.lg,
        animationDuration: `${breatheMs}ms`,
        minHeight: "var(--home-cta-height)",
      }}
    >
      <span className="pointer-events-none absolute inset-x-7 top-2 h-2.5 rounded-full bg-white/48" />
      <span
        className={`relative z-10 flex items-center justify-center gap-2.5 ${
          variant === "gold" ? "text-[#4a320e]" : "text-[#fff8ea]"
        }`}
      >
        <GameIcon name={icon} size={iconSize} />
        <span className="text-left leading-tight">
          <span className="block font-[family-name:var(--font-display)] text-[clamp(1.15rem,4.8vw,1.35rem)] font-bold drop-shadow-[0_1px_0_rgba(255,255,255,0.45)]">
            {titleZh}
          </span>
          <span className="block text-[9px] font-extrabold tracking-[0.18em] opacity-70">
            {titleEn}
          </span>
        </span>
      </span>
    </motion.button>
  );
}

