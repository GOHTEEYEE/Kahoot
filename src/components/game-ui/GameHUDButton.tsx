"use client";

import type { ReactNode } from "react";
import { motion } from "framer-motion";

import { gameUiTokens } from "../../lib/game-ui-tokens";
import { usePrefersReducedMotion } from "../../lib/usePrefersReducedMotion";

type Props = {
  ariaLabel: string;
  onClick?: () => void;
  badge?: string;
  children: ReactNode;
  className?: string;
};

export function GameHUDButton({
  ariaLabel,
  onClick,
  badge,
  children,
  className = "",
}: Props) {
  const reduced = usePrefersReducedMotion();

  return (
    <motion.button
      type="button"
      aria-label={ariaLabel}
      onClick={onClick}
      whileTap={{ scale: 0.92 }}
      whileHover={reduced ? undefined : { scale: 1.03 }}
      className={`hud-round-btn relative flex h-9 w-9 items-center justify-center rounded-full ${className}`}
      style={{ borderRadius: gameUiTokens.radii.pill }}
    >
      {children}
      {badge ? (
        <motion.span
          className="absolute -right-0.5 -top-0.5 flex h-3.5 min-w-3.5 items-center justify-center rounded-full bg-[#f04444] px-0.5 text-[7px] font-black text-white ring-1 ring-white"
          animate={{ scale: [1, 1.08, 1] }}
          transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
          aria-hidden
        >
          {badge}
        </motion.span>
      ) : null}
    </motion.button>
  );
}

