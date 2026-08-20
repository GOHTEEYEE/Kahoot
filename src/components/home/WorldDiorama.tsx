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
import { getWorldArtPack } from "../../lib/animation/worldArt";
import { GameWorldHeader } from "../game-ui/GameWorldHeader";

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
  const artPack = getWorldArtPack(subject);
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
    <div className="relative flex min-h-0 w-full flex-1 flex-col items-center justify-start pt-0">
      <GameWorldHeader
        onClick={openMap}
        subjectName={world.subjectName}
        subjectLevel={stage.level}
        worldName={world.worldName}
        isPreview={Boolean(viewingStage && viewingStage !== earned.id)}
        trophies={trophies}
        trophyCap={trophyCap}
        plaqueProgress={plaqueProgress}
      />

      <div className="island-arena relative mx-auto flex w-full items-end justify-center">
        {children}
        <div className={`island-stage relative island-shadow ${reduced ? "" : "island-idle-float"}`}>
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

          <div
            className={`relative h-full w-full ${
              artPack.islandHeroScale == null ? "origin-[50%_58%] scale-[var(--island-scale)]" : ""
            }`}
            style={
              artPack.islandHeroScale == null
                ? undefined
                : {
                    transformOrigin: artPack.islandHeroOrigin ?? "50% 58%",
                    transform: `scale(${artPack.islandHeroScale})`,
                  }
            }
          >
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
