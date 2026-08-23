"use client";

import { ComboDisplay } from "./ComboDisplay";
import { HealthBar } from "./HealthBar";
import type { FighterState } from "../../lib/pvp/types";
import type { PvpCopy } from "../../lib/i18n/pvp";

type Props = {
  fighter: FighterState;
  copy: PvpCopy;
  youLabel?: string;
  align: "left" | "right";
  danger?: boolean;
  broke?: boolean;
};

export function FighterStatus({ fighter, copy, youLabel, align, danger, broke }: Props) {
  const ally = align === "left";
  return (
    <div className={`min-w-0 flex-1 ${align === "right" ? "text-right" : "text-left"}`}>
      <p className="truncate text-[10px] font-black leading-tight text-white drop-shadow-[0_1px_2px_rgba(10,16,32,0.65)]">
        {fighter.name}
        {youLabel ? <span className="opacity-80"> · {youLabel}</span> : null}
        <span className="ml-1 font-bold text-white/70">Lv.{fighter.level}</span>
      </p>
      <div className="mt-0.5">
        <HealthBar current={fighter.hp} max={fighter.maxHp} tone={ally ? "ally" : "foe"} />
      </div>
      <div className={`mt-0.5 flex flex-wrap items-center gap-x-2 ${align === "right" ? "justify-end" : ""}`}>
        <span className={`text-[9px] font-extrabold tabular-nums ${ally ? "text-[#b8ecff]" : "text-[#ffd0b8]"}`}>
          ⚡ {fighter.currentAttackPower}
        </span>
        <ComboDisplay combo={fighter.currentCombo} broke={Boolean(broke)} copy={copy} compact />
      </div>
      {danger ? (
        <p className="mt-0.5 text-[9px] font-black text-[#ffe27a]">{copy.danger}</p>
      ) : null}
    </div>
  );
}

export function PlayerStatus(props: Omit<Props, "align">) {
  return <FighterStatus {...props} align="left" />;
}

export function OpponentStatus(props: Omit<Props, "align" | "youLabel">) {
  return <FighterStatus {...props} align="right" />;
}
