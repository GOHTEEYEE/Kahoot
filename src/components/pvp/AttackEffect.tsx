"use client";

import { AnimatePresence, motion } from "framer-motion";
import type { AttackEvent } from "../../lib/pvp/types";

type Props = {
  attack: AttackEvent | null;
  powerLabel: string;
};

export function AttackEffect({ attack, powerLabel }: Props) {
  const fromPlayer = attack?.from === "player";
  const power = Boolean(attack?.power);
  const combo = attack?.combo ?? 1;
  const glyph = power ? "🔥" : combo >= 3 ? "📘" : "★";

  return (
    <div className="relative h-full min-w-0 w-full">
      <AnimatePresence>
        {attack?.correct && attack.damage > 0 ? (
          <motion.div
            key={attack.id}
            className="absolute top-1/2 -translate-y-1/2"
            initial={{ left: fromPlayer ? "4%" : "78%", scale: 0.55, opacity: 0, rotate: fromPlayer ? -20 : 20 }}
            animate={{ left: fromPlayer ? "78%" : "4%", scale: power ? 1.25 : 1, opacity: 1, rotate: 0 }}
            exit={{ opacity: 0, scale: 1.4 }}
            transition={{
              delay: fromPlayer ? 0.88 : 0,
              duration: power ? 0.48 : 0.55,
              ease: [0.22, 1, 0.36, 1],
            }}
          >
            <span
              className={`flex items-center justify-center rounded-full text-base shadow-[0_0_16px_rgba(255,230,140,0.9)] ${
                power
                  ? "h-10 w-10 bg-gradient-to-br from-[#fff4a0] via-[#ffb14a] to-[#ff6a3a]"
                  : combo >= 3
                    ? "h-8 w-8 bg-gradient-to-br from-[#fff7c8] to-[#7ad0ff]"
                    : "h-7 w-7 bg-gradient-to-br from-[#fff7b0] to-[#9ae0ff]"
              }`}
            >
              {glyph}
            </span>
          </motion.div>
        ) : null}
      </AnimatePresence>
      {power && attack?.correct ? (
        <motion.p
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          className="pointer-events-none absolute left-1/2 top-0 -translate-x-1/2 whitespace-nowrap rounded-full bg-[#ff7a3a] px-2 py-0.5 text-[9px] font-black text-white shadow-md"
        >
          🔥 {powerLabel}
        </motion.p>
      ) : null}
    </div>
  );
}
