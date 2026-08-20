"use client";

import type { ReactNode } from "react";

import { GameIcon } from "../home/GameIcon";
import { UtilityIcon } from "../icons/UtilityIcon";

type Props = {
  icon: "coin" | "gem";
  value: number;
  variant: "coin" | "gem";
  className?: string;
  children?: ReactNode;
};

export function GameResource({ icon, value, variant, className = "" }: Props) {
  return (
    <span
      className={`currency-hud inline-flex h-8 shrink-0 items-center gap-1 rounded-full py-0 pl-1.5 pr-0.5 text-[11px] font-black tabular-nums text-[#fff4d6] ${className}`}
    >
      <GameIcon name={icon} size="utility" />
      {value.toLocaleString()}
      <span
        className={`currency-plus ml-0.5 flex h-[18px] w-[18px] items-center justify-center rounded-full ${
          variant === "gem" ? "bg-[#7046d8] currency-plus--gem" : "bg-[#58b94b]"
        }`}
      >
        <UtilityIcon name="plus" className="h-3 w-3" />
      </span>
    </span>
  );
}

