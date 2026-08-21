"use client";

import type { ReactNode } from "react";
import { GameModal } from "../game-ui/GameModal";
import type { LeaderboardEntry } from "../../lib/leaderboard";
import { subjectLabel, type RankingSubjectFilter } from "../../lib/leaderboard";
import { GameIcon } from "../home/GameIcon";

type Props = {
  open: boolean;
  onClose: () => void;
  player: LeaderboardEntry | null;
  place: number;
  subject: RankingSubjectFilter;
  isMe?: boolean;
};

export function PlayerMiniProfileModal({ open, onClose, player, place, subject, isMe }: Props) {
  if (!player) return null;

  return (
    <GameModal
      open={open}
      title={isMe ? `${player.displayName} · 你` : player.displayName}
      subtitle="选手资料 · Profile"
      onClose={onClose}
    >
      <div className="flex flex-col items-center gap-3 text-center">
        <div className="relative flex h-20 w-20 items-center justify-center overflow-hidden rounded-full bg-[#ffe9c4] shadow-[var(--game-shadow)] ring-4 ring-[#fff8ea]">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/worlds/chinese/momo.png?v=live"
            alt=""
            className="h-full w-full object-cover object-top"
            draggable={false}
          />
        </div>
        <div>
          <p className="font-[family-name:var(--font-display)] text-2xl font-bold text-[#3d2f1e]">
            {player.displayName}
            {isMe ? " · 你" : ""}
          </p>
          <p className="mt-1 text-sm font-extrabold text-[#8a5a18]">
            {player.grade}年级 · {player.school}
          </p>
        </div>
        <div className="grid w-full grid-cols-2 gap-2">
          <Stat label="当前科目" value={subjectLabel(subject)} />
          <Stat label="排名" value={`#${place}`} />
          <Stat
            label="奖杯"
            value={
              <span className="inline-flex items-center justify-center gap-1">
                <GameIcon name="trophy" size="utility" className="h-5 w-5" />
                {player.trophies}
              </span>
            }
          />
          <Stat label="段位" value={player.rankTitle} />
        </div>
        <p className="text-xs font-bold text-[#8a7355]">
          战绩 {player.wins} 胜 · {player.losses} 负
        </p>
      </div>
    </GameModal>
  );
}

function Stat({ label, value }: { label: string; value: ReactNode }) {
  return (
    <div className="rounded-2xl bg-white/80 px-3 py-2.5 shadow-sm ring-1 ring-[#e8c98a]/40">
      <p className="text-[10px] font-extrabold tracking-wide text-[#8a7355] uppercase">{label}</p>
      <p className="mt-0.5 font-[family-name:var(--font-display)] text-lg font-bold text-[#3d2f1e]">
        {value}
      </p>
    </div>
  );
}
