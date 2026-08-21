"use client";

import { GameModal } from "../game-ui/GameModal";
import { getLeaderboardCopy } from "../../lib/i18n/leaderboard";
import { useLocale } from "../../lib/i18n/useLocale";

type Props = {
  open: boolean;
  onClose: () => void;
};

export function RankingRulesModal({ open, onClose }: Props) {
  const { locale } = useLocale();
  const copy = getLeaderboardCopy(locale);

  return (
    <GameModal open={open} title={copy.rulesTitle} subtitle={copy.rulesSubtitle} onClose={onClose}>
      <ul className="space-y-3 text-sm font-bold leading-relaxed text-[#5a4630]">
        {copy.rulesBody.map((row) => (
          <li key={row.heading}>
            <span className="text-[var(--brand-deep)]">{row.heading}</span>
            <br />
            {row.body}
          </li>
        ))}
      </ul>
    </GameModal>
  );
}
