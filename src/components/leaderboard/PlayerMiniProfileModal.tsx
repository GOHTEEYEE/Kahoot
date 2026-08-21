"use client";

import type { ReactNode } from "react";
import { GameModal } from "../game-ui/GameModal";
import type { LeaderboardEntry, RankingSubjectFilter } from "../../lib/leaderboard";
import { GameIcon } from "../home/GameIcon";
import { localizedGrade } from "../../lib/i18n/home";
import { getLeaderboardCopy, rankingSubjectLabel } from "../../lib/i18n/leaderboard";
import { getSharedLabels, localizedRankName } from "../../lib/i18n/labels";
import { useLocale } from "../../lib/i18n/useLocale";

type Props = {
  open: boolean;
  onClose: () => void;
  player: LeaderboardEntry | null;
  place: number;
  subject: RankingSubjectFilter;
  isMe?: boolean;
};

export function PlayerMiniProfileModal({ open, onClose, player, place, subject, isMe }: Props) {
  const { locale } = useLocale();
  const copy = getLeaderboardCopy(locale);
  const labels = getSharedLabels(locale);
  if (!player) return null;

  return (
    <GameModal
      open={open}
      title={isMe ? `${player.displayName}${labels.youSuffix}` : player.displayName}
      subtitle={copy.playerProfile}
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
            {isMe ? labels.youSuffix : ""}
          </p>
          <p className="mt-1 text-sm font-extrabold text-[#8a5a18]">
            {localizedGrade(player.grade as 1 | 2 | 3 | 4 | 5 | 6, locale)} · {player.school}
          </p>
        </div>
        <div className="grid w-full grid-cols-2 gap-2">
          <Stat label={copy.currentSubject} value={rankingSubjectLabel(subject, locale)} />
          <Stat label={copy.rank} value={`#${place}`} />
          <Stat
            label={copy.trophies}
            value={
              <span className="inline-flex items-center justify-center gap-1">
                <GameIcon name="trophy" size="utility" className="h-5 w-5" />
                {player.trophies}
              </span>
            }
          />
          <Stat label={copy.rankTitle} value={localizedRankName(player.rankTitle, locale)} />
        </div>
        <p className="text-xs font-bold text-[#8a7355]">{copy.record(player.wins, player.losses)}</p>
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
