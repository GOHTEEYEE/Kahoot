"use client";

import { AnimatePresence, motion } from "framer-motion";

type Props = {
  message: string;
};

export function GameToast({ message }: Props) {
  return (
    <AnimatePresence>
      {message ? (
        <motion.p
          key={message}
          initial={{ opacity: 0, y: 12, scale: 0.92 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 8, scale: 0.96 }}
          transition={{ type: "spring", stiffness: 420, damping: 28 }}
          className="fixed bottom-[calc(4.1rem+env(safe-area-inset-bottom))] left-1/2 z-50 max-w-[88%] -translate-x-1/2 truncate rounded-full bg-[#3c3425]/92 px-4 py-2 text-center text-sm font-bold text-[#fff8ea] shadow-[0_8px_20px_rgba(40,25,10,0.35)] ring-1 ring-[#ffe7b8]/45 backdrop-blur-sm"
          role="status"
        >
          {message}
        </motion.p>
      ) : null}
    </AnimatePresence>
  );
}
