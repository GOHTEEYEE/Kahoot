"use client";

import { motion } from "framer-motion";

type Props = {
  amount: number;
  side: "player" | "opponent";
  show: boolean;
  power?: boolean;
};

export function DamageNumber({ amount, side, show, power }: Props) {
  if (!show || amount <= 0) return null;
  return (
    <motion.span
      key={`${side}-${amount}`}
      initial={{ opacity: 0, y: 10, scale: 0.7 }}
      animate={{ opacity: [0, 1, 1, 0], y: [8, -14, -26], scale: [0.7, power ? 1.35 : 1.18, 1] }}
      transition={{ duration: 0.9, ease: "easeOut" }}
      className={`pointer-events-none absolute ${
        side === "opponent" ? "right-0" : "left-0"
      } -top-1 z-20 font-[family-name:var(--font-display)] font-black drop-shadow-[0_2px_0_rgba(80,30,10,0.5)] ${
        power ? "text-2xl text-[#ffe27a]" : "text-xl text-[#fff4c8]"
      }`}
    >
      -{amount}
    </motion.span>
  );
}
