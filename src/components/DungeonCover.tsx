"use client";

import type { CSSProperties } from "react";
import type { DungeonMeta } from "../lib/curriculum";
import { localizedSubject } from "../lib/i18n/home";
import { getPlayCopy } from "../lib/i18n/play";
import { useLocale } from "../lib/i18n/useLocale";

type Props = {
  dungeon: DungeonMeta;
  selected: boolean;
  gradeLabelText: string;
  onSelect: () => void;
  onChallenge?: () => void;
};

export function DungeonCover({
  dungeon,
  selected,
  gradeLabelText,
  onSelect,
}: Props) {
  const { locale } = useLocale();
  const play = getPlayCopy(locale);
  return (
    <button
      type="button"
      onClick={onSelect}
      aria-pressed={selected}
      className={`dungeon-cover pressable relative isolate flex min-h-[176px] flex-col overflow-hidden rounded-[1.6rem] text-left transition duration-200 ${
        selected ? "dungeon-cover-selected scale-[1.02]" : "hover:scale-[1.01]"
      }`}
      style={
        {
          "--dungeon-accent": dungeon.accent,
          "--dungeon-soft": dungeon.accentSoft,
        } as CSSProperties
      }
    >
      <span className="dungeon-cover-bg" aria-hidden />
      <span className="dungeon-cover-shine" aria-hidden />
      <span className="dungeon-motif" aria-hidden>
        {dungeon.motif}
      </span>

      <div className="relative z-10 flex h-full flex-col justify-between p-4 text-white">
        <div className="flex items-start justify-between gap-2">
          <span className="rounded-full bg-black/25 px-2.5 py-1 text-[11px] font-extrabold tracking-wide backdrop-blur-sm">
            {play.dungeonTag(localizedSubject(dungeon.id, locale))}
          </span>
          {selected ? (
            <span className="animate-pop rounded-full bg-[var(--accent)] px-2.5 py-1 text-[11px] font-extrabold text-[var(--ink)]">
              {play.selected}
            </span>
          ) : (
            <span className="rounded-full bg-white/20 px-2.5 py-1 text-[11px] font-extrabold backdrop-blur-sm">
              {play.challengeable}
            </span>
          )}
        </div>

        <div>
          <h3 className="font-[family-name:var(--font-display)] text-2xl font-bold leading-tight drop-shadow-sm">
            {dungeon.dungeonName}
          </h3>
          <p className="mt-1 text-sm font-bold text-white/85">{dungeon.tagline}</p>
          <p className="mt-3 text-xs font-extrabold tracking-wide text-white/75">
            {play.difficulty(gradeLabelText)}
          </p>
        </div>
      </div>
    </button>
  );
}
