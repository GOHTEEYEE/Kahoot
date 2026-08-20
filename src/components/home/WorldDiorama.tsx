"use client";

import type { ReactNode } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  getNextTrophyReward,
  getSubjectWorld,
  getStageById,
  getPreviousTrophyMilestone,
  getWorldStage,
} from "../../lib/worlds";
import type { SubjectId } from "../../lib/curriculum";
import type { WorldStageId } from "../../lib/worlds";
import { usePrefersReducedMotion } from "../../lib/usePrefersReducedMotion";
import { ANIM } from "../../lib/animation/animationConfig";
import { WorldScene } from "../world/WorldScene";
import { playSfx } from "../../lib/audio/sfx";
import { GameIcon } from "./GameIcon";

const ISLAND_SPARKLES = [
  { left: "18%", top: "12%", delay: 0 },
  { left: "78%", top: "18%", delay: 0.8 },
  { left: "62%", top: "8%", delay: 1.6 },
  { left: "32%", top: "22%", delay: 2.2 },
] as const;

type Props = {
  subject: SubjectId;
  trophies: number;
  viewingStage?: WorldStageId | null;
  onIslandClick?: () => void;
  children?: ReactNode;
};

export function WorldDiorama({ subject, trophies, viewingStage, onIslandClick, children }: Props) {
  const reduced = usePrefersReducedMotion();
  const world = getSubjectWorld(subject);
  const earned = getWorldStage(trophies);
  const stage = viewingStage ? getStageById(viewingStage) : earned;
  const switchMs = ANIM.worldSwitch.durationMs / 1000;
  const nextReward = getNextTrophyReward(trophies);
  const prev = getPreviousTrophyMilestone(trophies);
  const trophyCap = nextReward?.trophies ?? Math.max(trophies, 200);
  const span = Math.max(1, trophyCap - prev);
  const plaqueProgress = nextReward ? Math.min(1, (trophies - prev) / span) : 1;

  function openMap() {
    playSfx("whoosh");
    onIslandClick?.();
  }

  return (
    <div className="relative flex w-full min-h-0 flex-1 flex-col items-center justify-center pt-0">
      <motion.button
        type="button"
        onClick={openMap}
        className="wood-plaque-leaf relative z-20 mx-auto mb-1 block shrink-0"
        style={{ width: "var(--world-title-width)" }}
        aria-label="查看关卡地图"
        whileTap={{ scale: 0.98 }}
      >
        <div className="world-sign world-sign--compact plaque-glint relative overflow-hidden rounded-[var(--game-radius)] px-3 pb-1.5 pt-1 text-center">
          <span className="wood-leaf wood-leaf-left" aria-hidden />
          <span className="wood-leaf wood-leaf-right" aria-hidden />

          <p className="text-[8px] font-extrabold leading-none tracking-[0.1em] text-[#ffe9c4]">
            {world.subjectName} · LV.{stage.level}
            {viewingStage && viewingStage !== earned.id ? " · PREVIEW" : ""}
          </p>

          <h2 className="mt-0.5 font-[family-name:var(--font-display)] text-[clamp(0.92rem,3.8vw,1.05rem)] font-bold leading-tight text-[#fff8ea] drop-shadow-[0_1px_0_rgba(90,40,10,0.45)]">
            {world.worldName}
          </h2>

          <div className="mx-auto mt-1 flex items-center justify-center gap-1">
            <GameIcon name="trophy" size="utility" className="shrink-0" />
            <span className="text-[9px] font-extrabold tabular-nums tracking-wide text-[#ffe27a]">
              {trophies} / {trophyCap}
            </span>
          </div>

          <div className="mx-auto mt-1 flex w-[88%] items-center gap-1 rounded-full bg-[#3c3425]/35 px-1 py-0.5 ring-1 ring-[#ffe7b8]/20">
            <div className="relative h-1 min-w-0 flex-1 overflow-hidden rounded-full bg-black/40">
              <motion.div
                className="h-full rounded-full bg-gradient-to-r from-[#ff8a2a] via-[#ffc14a] to-[#fff38a]"
                initial={{ width: 0 }}
                animate={{ width: `${Math.round(plaqueProgress * 100)}%` }}
                transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
              />
            </div>
          </div>
        </div>
      </motion.button>

      <div className="island-arena relative mx-auto flex w-full flex-1 items-center justify-center">
        {children}
        <div className="island-stage relative island-shadow">
          {!reduced
            ? ISLAND_SPARKLES.map((s, i) => (
                <span
                  key={i}
                  className="island-sparkle pointer-events-none absolute z-20 h-1.5 w-1.5 rounded-full bg-white/80 shadow-[0_0_6px_rgba(255,255,255,0.7)]"
                  style={{ left: s.left, top: s.top, animationDelay: `${s.delay}s` }}
                  aria-hidden
                />
              ))
            : null}

          <div className="relative h-full w-full origin-[50%_56%] scale-[var(--island-scale)]">
            <AnimatePresence mode="wait">
              <motion.div
                key={`${subject}-${stage.id}`}
                initial={false}
                animate={{ opacity: 1, scale: 1 }}
                exit={
                  reduced
                    ? { opacity: 0 }
                    : { opacity: 0.7, scale: ANIM.worldSwitch.exitScale }
                }
                transition={{ duration: reduced ? 0.2 : switchMs, ease: [0.22, 1, 0.36, 1] }}
                className="relative h-full w-full"
              >
                <WorldScene
                  subject={subject}
                  world={world}
                  stage={stage.id}
                  onIslandClick={onIslandClick}
                />
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
}
