"use client";

import { AnimatePresence, motion } from "framer-motion";

type Props = {
  show: boolean;
  ok: boolean;
  title: string;
  speed?: string;
  detail: string;
};

export function BattleEvent({ show, ok, title, speed, detail }: Props) {
  return (
    <AnimatePresence>
      {show ? (
        <motion.div
          initial={{ opacity: 0, y: 8, scale: 0.92 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -6 }}
          className={`pointer-events-none absolute left-1/2 top-1.5 z-20 -translate-x-1/2 rounded-2xl px-3 py-1.5 text-center shadow-[0_6px_16px_rgba(40,25,10,0.2)] ${
            ok ? "bg-[#e8ffd8] text-[#1f7a32]" : "bg-[#ffe4dc] text-[#b43020]"
          }`}
        >
          <p className="text-sm font-black leading-tight">{title}</p>
          {speed ? <p className="text-[11px] font-extrabold">{speed}</p> : null}
          <p className="text-[11px] font-extrabold">{detail}</p>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
