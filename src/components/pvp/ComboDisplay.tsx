"use client";

import { AnimatePresence, motion } from "framer-motion";
import type { PvpCopy } from "../../lib/i18n/pvp";

type Props = {
  combo: number;
  broke?: boolean;
  copy: PvpCopy;
  compact?: boolean;
};

export function ComboDisplay({ combo, broke, copy, compact }: Props) {
  if (compact) {
    if (broke) {
      return <span className="text-[9px] font-black text-[#ffd0a8]">{copy.comboBreak}</span>;
    }
    if (combo < 1) return <span className="text-[9px] font-extrabold text-white/55">🔥 ×0</span>;
    return (
      <span className={`text-[9px] font-black ${combo >= 5 ? "text-[#ffe27a]" : "text-[#ffd08a]"}`}>
        🔥 ×{combo}
      </span>
    );
  }

  return (
    <div className="pointer-events-none flex min-h-[1.1rem] items-center justify-center">
      <AnimatePresence mode="wait">
        {broke ? (
          <motion.p
            key="break"
            initial={{ scale: 0.7, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ opacity: 0 }}
            className="rounded-full bg-[#3a2418]/80 px-2 py-0.5 text-[10px] font-black tracking-wide text-[#ffd0a8]"
          >
            {copy.comboBreak}
          </motion.p>
        ) : combo >= 2 ? (
          <motion.p
            key={combo}
            initial={{ scale: 0.8, y: 4, opacity: 0 }}
            animate={{ scale: [1, combo >= 5 ? 1.08 : 1, 1], y: 0, opacity: 1 }}
            className="rounded-full bg-[#fff4d2] px-2 py-0.5 text-[10px] font-black text-[#9a3a10] shadow-[0_2px_0_rgba(160,70,20,0.25)]"
          >
            🔥 {copy.combo(combo)}
          </motion.p>
        ) : null}
      </AnimatePresence>
    </div>
  );
}
