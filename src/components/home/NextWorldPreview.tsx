"use client";

import { motion } from "framer-motion";
import { getWorldArtPack, peekWorldPlate } from "../../lib/animation/worldArt";
import { getNextWorldStage, getWorldStage } from "../../lib/worlds";
import type { SubjectId } from "../../lib/curriculum";
import { playSfx } from "../../lib/audio/sfx";
import { GameIcon } from "./GameIcon";

type Props = {
  subject: SubjectId;
  trophies: number;
  onOpenMap: () => void;
  nested?: boolean;
};

export function NextWorldPreview({ subject, trophies, onOpenMap, nested = false }: Props) {
  const next = getNextWorldStage(trophies);
  const shell = nested
    ? "flex w-full items-center gap-2 px-0.5 py-0 text-left"
    : "hud-dark flex w-full items-center gap-2.5 rounded-[1rem] px-2.5 py-1.5 text-left ring-1 ring-[#ffe7b4]/20";

  if (!next) {
    const current = getWorldStage(trophies);
    return (
      <div className={shell}>
        <p className="min-w-0 flex-1 truncate text-[11px] font-extrabold text-[#ffe7b4]">
          {current.name} · Max world
        </p>
      </div>
    );
  }

  const pack = getWorldArtPack(subject);
  const { plate, designed } = peekWorldPlate(pack, next.id);
  const remain = Math.max(0, next.minTrophies - trophies);

  return (
    <motion.button
      type="button"
      whileTap={{ scale: 0.98 }}
      onClick={() => {
        playSfx("whoosh");
        onOpenMap();
      }}
      className={shell}
      aria-label={`下一世界 ${next.name}`}
    >
      <span className="relative h-9 w-9 shrink-0 overflow-hidden rounded-[0.65rem] bg-[#cfe4f4]/70 ring-1 ring-white/25">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={plate.src}
          alt=""
          draggable={false}
          className={`h-full w-full object-contain object-center ${designed ? "" : "opacity-70"}`}
        />
      </span>
      <span className="min-w-0 flex-1">
        <span className="block text-[8px] font-extrabold tracking-[0.16em] text-[#c4b08a]">
          NEXT WORLD
        </span>
        <span className="block truncate font-[family-name:var(--font-display)] text-[14px] font-bold leading-tight text-[#fff6e4]">
          {next.name}
        </span>
      </span>
      <span className="shrink-0 text-right">
        <span className="flex items-center justify-end gap-0.5 text-[12px] font-extrabold text-[#ffe27a]">
          <GameIcon name="trophy" size="utility" />
          {next.minTrophies}
        </span>
        <span className="block text-[8px] font-bold text-white/55">还差 {remain}</span>
      </span>
    </motion.button>
  );
}
