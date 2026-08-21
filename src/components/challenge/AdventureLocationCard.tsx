"use client";

import { motion } from "framer-motion";
import type { AdventureLocation } from "../../lib/adventure";
import { playSfx } from "../../lib/audio/sfx";
import { GameIcon } from "../home/GameIcon";
import { getPlayCopy } from "../../lib/i18n/play";
import { useLocale } from "../../lib/i18n/useLocale";

type Props = {
  location: AdventureLocation;
  locked: boolean;
  cleared: boolean;
  remain: number;
  onEnter: () => void;
};

export function AdventureLocationCard({ location, locked, cleared, remain, onEnter }: Props) {
  const { locale } = useLocale();
  const play = getPlayCopy(locale);
  const name = locale === "zh" ? location.name : location.nameEn;
  return (
    <motion.button
      type="button"
      disabled={locked}
      whileTap={locked ? undefined : { scale: 0.97 }}
      onClick={() => {
        if (locked) return;
        playSfx("world");
        onEnter();
      }}
      className={`flex w-full items-center gap-3 rounded-[1.2rem] px-3 py-3 text-left ring-1 ${
        locked
          ? "bg-[#efe4cc]/80 text-[#8a7355]"
          : cleared
            ? "bg-[#e8ffd4] text-[#2a2118] ring-[#8ee06f]/70"
            : "hud-chip text-[#2a2118]"
      }`}
    >
      <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-[0.9rem] bg-white/70">
        <GameIcon name={cleared ? "chest" : locked ? "gear" : "map"} className="h-8 w-8" />
      </span>
      <span className="min-w-0 flex-1">
        <span className="block font-[family-name:var(--font-display)] text-[16px] font-bold leading-tight">
          {name}
        </span>
        {locale === "zh" ? (
          <span className="block text-[11px] font-extrabold text-[#6b5340]">{location.nameEn}</span>
        ) : null}
        <span className="mt-0.5 block text-[10px] font-bold text-[#8a5a18]">{location.description}</span>
      </span>
      <span className="shrink-0 text-right text-[10px] font-extrabold">
        {locked ? (
          <>
            <GameIcon name="trophy" className="mx-auto h-4 w-4" />
            {play.remain(remain)}
          </>
        ) : cleared ? (
          play.explored
        ) : (
          play.enter
        )}
      </span>
    </motion.button>
  );
}
