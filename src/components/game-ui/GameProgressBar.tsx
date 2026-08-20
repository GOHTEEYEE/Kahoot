"use client";

import { motion } from "framer-motion";

import { usePrefersReducedMotion } from "../../lib/usePrefersReducedMotion";

type Props = {
  value: number; // 0..1
  className?: string;
};

/**
 * Shared progress rail used by HUD panels.
 * Styling is intentionally aligned with trophy bar language.
 */
export function GameProgressBar({ value, className = "" }: Props) {
  const reduced = usePrefersReducedMotion();
  const v = Math.max(0, Math.min(1, value));

  return (
    <div className={`h-2 min-w-0 overflow-hidden rounded-full bg-black/40 ${className}`}>
      <motion.div
        className="h-full rounded-full bg-gradient-to-r from-[#ff8a2a] via-[#ffc14a] to-[#fff38a]"
        initial={{ width: 0 }}
        animate={{ width: `${Math.round(v * 100)}%` }}
        transition={{ duration: reduced ? 0.2 : 0.7, ease: [0.22, 1, 0.36, 1] }}
      />
    </div>
  );
}

