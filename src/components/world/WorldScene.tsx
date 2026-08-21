"use client";

import type { SubjectId } from "../../lib/curriculum";
import type { SubjectWorld, WorldStageId } from "../../lib/worlds";
import { getWorldArtPack } from "../../lib/animation/worldArt";
import { PixiWorldScene } from "./PixiWorldScene";
import {
  ModularStaticArena,
  USE_MODULAR_STATIC_CHINESE_ARENA,
} from "./ModularStaticArena";
import { USE_VIDEO_CHINESE_ARENA, VideoArena } from "./VideoArena";

type Props = {
  subject: SubjectId;
  world: SubjectWorld;
  stage: WorldStageId;
  onIslandClick?: () => void;
};

/**
 * Home world viewport.
 * Chinese LV1 → Kling video arena (preferred) → modular static → Pixi baked plate.
 */
export function WorldScene({ subject, stage, onIslandClick }: Props) {
  const artPack = getWorldArtPack(subject);

  if (subject === "chinese" && USE_VIDEO_CHINESE_ARENA) {
    return <VideoArena onIslandClick={onIslandClick} />;
  }

  if (subject === "chinese" && USE_MODULAR_STATIC_CHINESE_ARENA) {
    return <ModularStaticArena pack={artPack} stage={stage} onIslandClick={onIslandClick} />;
  }

  return <PixiWorldScene pack={artPack} stage={stage} onIslandClick={onIslandClick} />;
}
