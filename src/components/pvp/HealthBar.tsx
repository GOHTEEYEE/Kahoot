"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { PVP_LOW_HP } from "../../lib/pvp/config";

type Props = {
  current: number;
  max: number;
  tone: "ally" | "foe";
};

function useAnimatedNumber(value: number) {
  const [shown, setShown] = useState(value);
  const shownRef = useRef(value);

  useEffect(() => {
    const from = shownRef.current;
    const to = value;
    if (from === to) return;
    const t0 = performance.now();
    const dur = 420;
    let raf = 0;
    const tick = (now: number) => {
      const k = Math.min(1, (now - t0) / dur);
      const next = Math.round(from + (to - from) * k);
      shownRef.current = next;
      setShown(next);
      if (k < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [value]);

  return shown;
}

export function HealthBar({ current, max, tone }: Props) {
  const shown = useAnimatedNumber(Math.max(0, current));
  const pct = Math.max(0, Math.min(100, (current / Math.max(1, max)) * 100));
  const low = current / max <= PVP_LOW_HP;
  const fill =
    tone === "ally"
      ? "from-[#3ec6ff] via-[#4ade80] to-[#b8f070]"
      : "from-[#ff6b5a] via-[#ff8a4a] to-[#ffc14a]";

  return (
    <div className="min-w-0">
      <div className="mb-0.5 flex items-center justify-between gap-1 text-[9px] font-extrabold tracking-wide text-white/90">
        <span>HP</span>
        <span className={`shrink-0 tabular-nums ${low ? "text-[#ffe27a]" : ""}`}>
          {shown} / {max}
        </span>
      </div>
      <div
        className={`h-2.5 overflow-hidden rounded-full bg-black/45 ring-1 ring-white/25 ${
          low ? "pvp-hp-pulse" : ""
        }`}
      >
        <motion.div
          className={`h-full rounded-full bg-gradient-to-r ${fill}`}
          animate={{ width: `${pct}%` }}
          transition={{ type: "spring", stiffness: 240, damping: 28 }}
        />
      </div>
    </div>
  );
}
