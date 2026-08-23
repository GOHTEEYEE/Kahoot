"use client";

import { PVP_ITEMS, type ItemId } from "../../lib/pvp/items";
import { playSfx } from "../../lib/audio/sfx";
import type { PvpCopy } from "../../lib/i18n/pvp";

const ICONS: Record<ItemId, string> = {
  scout: "🔍",
  freeze: "⏱",
  haste: "⚡",
  shield: "🛡",
};

type Props = {
  copy: PvpCopy;
  used: Record<ItemId, number>;
  disabled?: boolean;
  onUse: (item: ItemId) => void;
};

export function ItemBar({ copy, used, disabled, onUse }: Props) {
  return (
    <div className="flex gap-1.5">
      {PVP_ITEMS.map((id) => {
        const spent = used[id] > 0;
        return (
          <button
            key={id}
            type="button"
            disabled={disabled || spent}
            title={copy.items[id].hint}
            onClick={() => {
              playSfx("tap");
              onUse(id);
            }}
            className="flex min-h-9 min-w-0 flex-1 flex-col items-center justify-center rounded-xl bg-[#fff8ea]/90 px-1 py-1 text-[9px] font-extrabold text-[#5a3a20] ring-1 ring-[#e8c98a]/70 disabled:opacity-40"
          >
            <span className="text-sm leading-none">{ICONS[id]}</span>
            <span className="truncate">{copy.items[id].label}</span>
          </button>
        );
      })}
    </div>
  );
}
