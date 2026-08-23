"use client";

import { OpponentStatus, PlayerStatus } from "./PlayerStatus";
import type { FighterState } from "../../lib/pvp/types";
import type { PvpCopy } from "../../lib/i18n/pvp";

type Props = {
  player: FighterState;
  opponent: FighterState;
  questionIndex: number;
  total: number;
  copy: PvpCopy;
  comboBroke: boolean;
  playerDanger: boolean;
  opponentDanger: boolean;
  stretchLabel?: string;
};

export function BattleHeader({
  player,
  opponent,
  questionIndex,
  total,
  copy,
  comboBroke,
  playerDanger,
  opponentDanger,
  stretchLabel,
}: Props) {
  return (
    <div className="pointer-events-none px-2 pt-[max(0.12rem,env(safe-area-inset-top))]">
      <div className="flex items-start gap-1">
        <PlayerStatus fighter={player} copy={copy} youLabel={copy.you} danger={playerDanger} broke={comboBroke} />
        <div className="flex w-[3.8rem] shrink-0 flex-col items-center pt-0.5">
          <span className="font-[family-name:var(--font-display)] text-[1.15rem] font-black leading-none text-white drop-shadow-[0_2px_0_rgba(20,12,8,0.45)]">
            {copy.vs}
          </span>
          <span className="mt-0.5 text-center text-[8px] font-extrabold leading-tight text-[#ffe9b0]">
            {copy.questionN(questionIndex + 1, total)}
          </span>
          {stretchLabel ? (
            <span className="mt-0.5 rounded-full bg-[#ff7a3a] px-1.5 py-px text-[8px] font-black text-white">
              {stretchLabel}
            </span>
          ) : null}
        </div>
        <OpponentStatus fighter={opponent} copy={copy} danger={opponentDanger} />
      </div>
    </div>
  );
}
