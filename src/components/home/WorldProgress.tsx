"use client";

import { GameTrophyBar } from "../game-ui/GameTrophyBar";

type Props = {
  trophies: number;
  mascotName: string;
  onOpenMap?: () => void;
};

/** Dark RPG-style progression rail below the island hero. */
export function WorldProgress({ trophies, mascotName }: Props) {
  return <GameTrophyBar trophies={trophies} mascotName={mascotName} />;
}
