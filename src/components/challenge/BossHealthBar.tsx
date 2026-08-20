"use client";

import { motion } from "framer-motion";

type Props = {
  current: number;
  max: number;
};

export function BossHealthBar({ current, max }: Props) {
  const pct = Math.max(0, Math.min(100, (current / Math.max(1, max)) * 100));
  return (
    <div className="w-full">
      <div className="mb-1 flex items-center justify-between text-[10px] font-extrabold text-[#fff6e4]">
        <span>HP</span>
        <span>
          {Math.max(0, current)} / {max}
        </span>
      </div>
      <div className="h-3.5 overflow-hidden rounded-full bg-black/45 ring-1 ring-white/20">
        <motion.div
          className="h-full rounded-full bg-gradient-to-r from-[#ff5a4a] via-[#ff9a4a] to-[#ffe27a]"
          animate={{ width: `${pct}%` }}
          transition={{ type: "spring", stiffness: 220, damping: 24 }}
        />
      </div>
    </div>
  );
}
