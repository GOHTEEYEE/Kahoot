"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";
import { usePrefersReducedMotion } from "../../lib/usePrefersReducedMotion";
import { getPlayCopy } from "../../lib/i18n/play";
import { useLocale } from "../../lib/i18n/useLocale";

type Props = {
  name: string;
  emoji: string;
  accent: string;
};

export function FloatingMascot({ name, emoji, accent }: Props) {
  const reduced = usePrefersReducedMotion();
  const { locale } = useLocale();
  const play = getPlayCopy(locale);
  const [reacting, setReacting] = useState(false);
  const [bubble, setBubble] = useState<string | null>(null);

  function react() {
    if (reacting || reduced) return;
    setReacting(true);
    setBubble(play.mascotReady);
    window.setTimeout(() => setBubble(null), 1800);
    window.setTimeout(() => setReacting(false), 1100);
  }

  return (
    <div className="absolute bottom-[16%] left-[58%] z-20 -translate-x-1/2">
      <motion.button
        type="button"
        aria-label={name}
        onClick={react}
        onHoverStart={react}
        animate={
          reduced
            ? undefined
            : reacting
              ? { y: [0, -8, 0, -4, 0], rotate: [0, -6, 8, -4, 0], scale: [1, 1.06, 1] }
              : {
                  scale: [1, 1.02, 1, 1, 1.02, 1],
                  y: [0, -3, 0, 0, -2, 0],
                  rotate: [-1, 1, 0, -1, 1, 0],
                }
        }
        transition={
          reacting
            ? { duration: 0.9, ease: "easeInOut" }
            : { duration: 6.5, repeat: Infinity, ease: "easeInOut" }
        }
        className="relative flex cursor-pointer flex-col items-center border-0 bg-transparent p-0 will-change-transform"
      >
        <AnimatePresence>
          {bubble ? (
            <motion.span
              initial={{ opacity: 0, scale: 0.8, y: 6 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              transition={{ duration: 0.25 }}
              className="absolute -top-7 whitespace-nowrap rounded-full bg-white px-2.5 py-1 text-[10px] font-extrabold text-[#5a4630] shadow"
            >
              {bubble}
            </motion.span>
          ) : null}
        </AnimatePresence>
        <div
          className="flex h-14 w-14 items-center justify-center rounded-[1.15rem] text-2xl shadow-[0_10px_18px_rgba(80,50,20,0.22)] ring-[3px] ring-white/80"
          style={{ background: `linear-gradient(145deg, ${accent}, #5a4630)` }}
        >
          <span aria-hidden>{emoji}</span>
        </div>
        <span className="mt-1 rounded-full bg-[#5a4630]/55 px-2 py-0.5 text-[10px] font-extrabold text-white backdrop-blur">
          {name}
        </span>
      </motion.button>
    </div>
  );
}
