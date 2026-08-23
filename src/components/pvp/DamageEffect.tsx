"use client";

import { motion } from "framer-motion";

type Props = {
  amount: number;
  side: "player" | "opponent";
  show: boolean;
};

export function DamageEffect({ amount, side, show }: Props) {
  if (!show || amount <= 0) return null;
  return (
    <motion.span
      key={`${side}-${amount}`}
      initial={{ opacity: 0, y: 8, scale: 0.8 }}
      animate={{ opacity: [0, 1, 1, 0], y: [8, -18, -28], scale: [0.8, 1.12, 1] }}
      transition={{ duration: 0.85, ease: "easeOut" }}
      className={`pointer-events-none absolute ${
        side === "opponent" ? "right-1" : "left-1"
      } top-0 z-20 font-[family-name:var(--font-display)] text-lg font-black text-[#fff4c8] drop-shadow-[0_2px_0_rgba(80,30,10,0.45)]`}
    >
      -{amount}
    </motion.span>
  );
}
