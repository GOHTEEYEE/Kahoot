"use client";

import { motion } from "framer-motion";

import { usePrefersReducedMotion } from "../../lib/usePrefersReducedMotion";
import { GameIcon } from "../home/GameIcon";

type Props = {
  onClick: () => void;
  subjectName: string;
  subjectLevel: number;
  worldName: string;
  isPreview?: boolean;
  trophies: number;
  trophyCap: number;
  plaqueProgress: number; // 0..1
};

export function GameWorldHeader({
  onClick,
  subjectName,
  subjectLevel,
  worldName,
  isPreview,
  trophies,
  trophyCap,
  plaqueProgress,
}: Props) {
  const reduced = usePrefersReducedMotion();

  return (
    <motion.button
      type="button"
      onClick={onClick}
      className="wood-plaque-leaf relative z-20 mx-auto mb-0.5 block shrink-0"
      style={{ width: "var(--world-title-width)" }}
      aria-label="查看关卡地图"
      whileTap={{ scale: 0.98 }}
    >
      <div
        className="world-sign world-sign--compact plaque-glint relative overflow-hidden rounded-[1.15rem] px-3 pb-1 pt-1 text-center"
        style={{ borderRadius: "1.15rem", minHeight: "68px" }}
      >
        <span className="wood-leaf wood-leaf-left" aria-hidden />
        <span className="wood-leaf wood-leaf-right" aria-hidden />
        <span className="world-sign__lantern" aria-hidden />

        <p className="text-[7.5px] font-extrabold leading-none tracking-[0.12em] text-[#ffe9c4]">
          {subjectName} · LV.{subjectLevel}
          {isPreview ? " · PREVIEW" : ""}
        </p>

        <h2 className="mt-0.5 font-[family-name:var(--font-display)] text-[clamp(0.92rem,3.8vw,1.05rem)] font-bold leading-tight text-[#fff8ea] drop-shadow-[0_1px_0_rgba(90,40,10,0.45)]">
          {worldName}
        </h2>

        <div className="mx-auto mt-0.5 flex items-center justify-center gap-1">
          <GameIcon name="trophy" size="utility" className="shrink-0" />
          <span className="text-[8.5px] font-extrabold tabular-nums tracking-wide text-[#ffe27a]">
            {trophies} / {trophyCap}
          </span>
        </div>

        <div className="mx-auto mt-0.5 flex w-[88%] items-center gap-1 rounded-full bg-[#3c3425]/35 px-1 py-0.5 ring-1 ring-[#ffe7b8]/20">
          <div className="relative h-[3px] min-w-0 flex-1 overflow-hidden rounded-full bg-black/40">
            <motion.div
              className="h-full rounded-full bg-gradient-to-r from-[#ff8a2a] via-[#ffc14a] to-[#fff38a]"
              initial={{ width: 0 }}
              animate={{ width: `${Math.round(Math.max(0, Math.min(1, plaqueProgress)) * 100)}%` }}
              transition={{ duration: reduced ? 0.2 : 0.7, ease: [0.22, 1, 0.36, 1] }}
            />
          </div>
        </div>
      </div>
    </motion.button>
  );
}

