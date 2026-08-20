"use client";

import type { SubjectId } from "../../lib/curriculum";
import type { SubjectWorld, WorldStageId } from "../../lib/worlds";
import { getWorldArtPack } from "../../lib/animation/worldArt";
import { ArtWorldScene } from "./ArtWorldScene";

type Props = {
  subject: SubjectId;
  world: SubjectWorld;
  stage: WorldStageId;
  onIslandClick?: () => void;
};

/** Home world viewport — always asset-composed (ArtWorldScene). */
export function WorldScene({ subject, stage, onIslandClick }: Props) {
  const artPack = getWorldArtPack(subject);
  return <ArtWorldScene pack={artPack} stage={stage} onIslandClick={onIslandClick} />;
}
