"use client";

import type { ReactNode } from "react";
import { motion } from "framer-motion";

import { gameUiTokens } from "../../lib/game-ui-tokens";
import { usePrefersReducedMotion } from "../../lib/usePrefersReducedMotion";

type Props = {
  ariaLabel: string;
  onClick?: () => void;
  children: ReactNode;
  badge?: string;
  className?: string;
  disabled?: boolean;
};

export function GameIconButton({
  ariaLabel,
  onClick,
  children,
  badge,
  className = "",
  disabled,
}: Props) {
  const reduced = usePrefersReducedMotion();

  return (
    <motion.button
      type="button"
      aria-label={ariaLabel}
      onClick={onClick}
      disabled={disabled}
      whileHover={reduced ? undefined : { scale: 1.02 }}
      whileTap={{ scale: 0.97 }}
      transition={{ type: "spring", stiffness: 420, damping: 22 }}
      className={`relative flex items-center justify-center rounded-full ${className}`}
      style={{
        height: gameUiTokens.buttonHeights.hudRound,
        width: gameUiTokens.buttonHeights.hudRound,
        borderRadius: gameUiTokens.radii.pill,
      }}
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

