"use client";

import type { EmoteId } from "../../lib/pvp/types";
import type { PvpCopy } from "../../lib/i18n/pvp";

const ORDER: EmoteId[] = ["cheer", "fast", "nice", "wow", "coming", "think"];
const ICONS: Record<EmoteId, string> = {
  cheer: "💪",
  fast: "🔥",
  nice: "👏",
  wow: "😱",
  coming: "😎",
  think: "🤔",
};

type Props = {
  copy: PvpCopy;
  disabled?: boolean;
  onSend: (emote: EmoteId) => void;
};

export function EmoteBar({ copy, disabled, onSend }: Props) {
  return (
    <div className="flex justify-center gap-1">
      {ORDER.map((id) => (
        <button
          key={id}
          type="button"
          disabled={disabled}
          title={copy.emotes[id]}
          onClick={() => onSend(id)}
          className="flex h-8 w-8 items-center justify-center rounded-full bg-white/80 text-base ring-1 ring-white/70 disabled:opacity-50"
        >
          <span aria-hidden>{ICONS[id]}</span>
          <span className="sr-only">{copy.emotes[id]}</span>
        </button>
      ))}
    </div>
  );
}
