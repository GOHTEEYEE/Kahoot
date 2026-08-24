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
import { USE_VIDEO_CHINESE_ARENA } from "../world/VideoArena";
import { playSfx } from "../../lib/audio/sfx";
import { getWorldArtPack } from "../../lib/animation/worldArt";
import { GameWorldHeader } from "../game-ui/GameWorldHeader";
import { localizedSubject, localizedWorldName } from "../../lib/i18n/home";
import { useLocale } from "../../lib/i18n/useLocale";

type Props = {
  subject: SubjectId;
  trophies: number;
  viewingStage?: WorldStageId | null;
  onIslandClick?: () => void;
  children?: ReactNode;
};

export function WorldDiorama({ subject, trophies, viewingStage, onIslandClick, children }: Props) {
  const { locale } = useLocale();
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
  /** Chrome freezes alpha <video> if any ancestor uses CSS transform/filter. Scale with width instead. */
  const videoArena = subject === "chinese" && USE_VIDEO_CHINESE_ARENA;
  const heroScale = artPack.islandHeroScale;

  function openMap() {
    playSfx("whoosh");
    onIslandClick?.();
  }

  return (
    <div className="relative flex min-h-0 w-full flex-1 flex-col items-center justify-start pt-0">
      <GameWorldHeader
        onClick={openMap}
        subjectName={localizedSubject(subject, locale)}
        subjectLevel={stage.level}
        worldName={localizedWorldName(subject, locale)}
        isPreview={Boolean(viewingStage && viewingStage !== earned.id)}
        trophies={trophies}
        trophyCap={trophyCap}
        plaqueProgress={plaqueProgress}
      />

      <div className="island-arena relative mx-auto flex w-full items-end justify-center">
        {children}
        <div
          className="island-stage relative island-shadow"
          style={
            videoArena
              ? {
                  width: `calc(var(--island-size) * ${heroScale ?? 1.1})`,
                  maxWidth: `calc(var(--island-size) * ${heroScale ?? 1.1})`,
                }
              : undefined
          }
        >
          <div
            className={`relative h-full w-full ${
              videoArena || heroScale != null ? "" : "origin-[50%_58%] scale-[var(--island-scale)]"
            }`}
            style={
              videoArena || heroScale == null
                ? undefined
                : {
                    transformOrigin: artPack.islandHeroOrigin ?? "50% 58%",
                    transform: `scale(${heroScale})`,
                  }
            }
          >
            <AnimatePresence mode="wait">
              {videoArena ? (
                <div key={`${subject}-${stage.id}`} className="relative h-full w-full">
                  <WorldScene
                    subject={subject}
                    world={world}
                    stage={stage.id}
                    onIslandClick={onIslandClick}
                  />
                </div>
              ) : (
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
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
}
