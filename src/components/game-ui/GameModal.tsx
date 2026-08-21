"use client";

import type { ReactNode } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { playSfx } from "../../lib/audio/sfx";

type Props = {
  open: boolean;
  title: string;
  subtitle?: string;
  onClose: () => void;
  children: ReactNode;
  /** Optional footer actions inside the sheet */
  footer?: ReactNode;
};

/**
 * Reusable cream game sheet modal — matches Home / World picker language.
 */
export function GameModal({ open, title, subtitle, onClose, children, footer }: Props) {
  return (
    <AnimatePresence>
      {open ? (
        <motion.div
          className="fixed inset-0 z-[80] flex items-end justify-center bg-[#3d2f1e]/45 p-4 sm:items-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => {
            playSfx("tap");
            onClose();
          }}
        >
          <motion.div
            role="dialog"
            aria-modal
            aria-labelledby="game-modal-title"
            initial={{ y: 40, opacity: 0, scale: 0.96 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: 24, opacity: 0 }}
            transition={{ type: "spring", stiffness: 320, damping: 26 }}
            className="flex max-h-[86vh] w-full max-w-md flex-col overflow-hidden rounded-[1.6rem] bg-[#fff8ea] shadow-[0_24px_60px_rgba(60,40,15,0.35)] ring-1 ring-[#e8c98a]/50"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="wood-plaque shrink-0 px-5 py-3">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <h3
                    id="game-modal-title"
                    className="font-[family-name:var(--font-display)] text-2xl font-bold text-[#fff8ea] drop-shadow-[0_2px_0_rgba(90,40,10,0.4)]"
                  >
                    {title}
                  </h3>
                  {subtitle ? (
                    <p className="mt-0.5 text-xs font-bold text-[#ffe7b4]/85">{subtitle}</p>
                  ) : null}
                </div>
                <button
                  type="button"
                  aria-label="关闭"
                  onClick={() => {
                    playSfx("tap");
                    onClose();
                  }}
                  className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#fff8ea]/18 text-lg font-black text-[#fff8ea] ring-1 ring-[#ffe7b8]/35"
                >
                  ×
                </button>
              </div>
            </div>
            <div className="min-h-0 flex-1 overflow-y-auto px-4 py-4 text-[var(--ink)]">{children}</div>
            {footer ? <div className="shrink-0 border-t border-[#e8c98a]/40 px-4 py-3">{footer}</div> : null}
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
