"use client";

import Link from "next/link";
import { useMemo } from "react";
import { TrophyCount } from "./TrophyCount";
import { GameIcon } from "./home/GameIcon";
import type { MatchResult } from "../lib/trophy";
import { getRank } from "../lib/trophy";
import { localizedRankName } from "../lib/i18n/labels";
import { getPlayCopy } from "../lib/i18n/play";
import { useLocale } from "../lib/i18n/useLocale";

type Props = {
  result: MatchResult;
  playerScore: number;
  opponentScore: number;
  opponentName: string;
  trophiesBefore: number;
  trophiesAfter: number;
  delta: number;
  subjectName: string;
  onRematch: () => void;
  onOpenReview: () => void;
};

const COPY: Record<MatchResult, { tone: string }> = {
  win: { tone: "text-[var(--brand-deep)]" },
  lose: { tone: "text-[var(--red)]" },
  draw: { tone: "text-[var(--ink)]" },
};

export function ResultScreen({
  result,
  playerScore,
  opponentScore,
  opponentName,
  trophiesBefore,
  trophiesAfter,
  delta,
  subjectName,
  onRematch,
  onOpenReview,
}: Props) {
  const rank = getRank(trophiesAfter);
  const { locale } = useLocale();
  const play = getPlayCopy(locale);
  const copy = COPY[result];
  const deltaText = delta > 0 ? `+${delta}` : `${delta}`;
  const pieces = useMemo(
    () =>
      Array.from({ length: result === "win" ? 18 : 0 }, (_, i) => ({
        id: i,
        left: `${6 + ((i * 17) % 88)}%`,
        delay: `${(i % 8) * 0.08}s`,
        duration: `${1.6 + (i % 5) * 0.18}s`,
        color: ["#ffc938", "#0f8f6f", "#e85d4c", "#2f80ed", "#f2994a"][i % 5],
      })),
    [result],
  );

  return (
    <section className="animate-phase-in relative mx-auto flex w-full max-w-lg flex-1 flex-col items-center justify-center gap-6 overflow-hidden px-5 py-10 text-center">
      {pieces.map((p) => (
        <span
          key={p.id}
          className="confetti-piece"
          style={{
            left: p.left,
            animationDelay: p.delay,
            animationDuration: p.duration,
            background: p.color,
          }}
        />
      ))}

      <h1
        className={`animate-banner-drop font-[family-name:var(--font-display)] text-5xl font-bold sm:text-6xl ${copy.tone}`}
      >
        {play.result[result]}
      </h1>

      <div className="grid w-full grid-cols-2 gap-3">
        <ScoreCard label={play.you} score={playerScore} highlight delay="0.1s" />
        <ScoreCard label={opponentName} score={opponentScore} delay="0.2s" />
      </div>

      <div
        className="animate-trophy-burst w-full rounded-[2rem] bg-white/75 px-6 py-5 shadow-[var(--shadow)] backdrop-blur"
        style={{ animationDelay: "0.25s" }}
      >
        <p className="text-sm font-bold tracking-wide text-[var(--ink-soft)]">
          {play.dungeonTrophies(subjectName)}
        </p>
        <p className="mt-2 flex items-center justify-center gap-2 font-[family-name:var(--font-display)] text-4xl font-bold text-[var(--ink)]">
          <GameIcon name="trophy" size="progress" className="animate-float shrink-0" />
          <TrophyCount value={trophiesAfter} />
          <span
            className={`ml-3 inline-block text-2xl ${
              delta > 0
                ? "animate-score-float text-[var(--brand)]"
                : delta < 0
                  ? "text-[var(--red)]"
                  : "text-[var(--ink-soft)]"
            }`}
          >
            {delta === 0 ? "±0" : deltaText}
          </span>
        </p>
        <p className="mt-1 text-sm text-[var(--ink-soft)]">
          {play.rankLine(trophiesBefore, trophiesAfter, localizedRankName(rank.id, locale))}
        </p>
      </div>

      <button
        type="button"
        onClick={onOpenReview}
        className="pressable animate-pulse-glow w-full rounded-[1.4rem] bg-[rgba(20,53,47,0.9)] px-6 py-4 text-lg font-extrabold text-[var(--accent)] shadow-[var(--shadow)]"
      >
        {play.openReview}
      </button>

      <div className="flex w-full flex-col gap-3 sm:flex-row">
        <button
          type="button"
          onClick={onRematch}
          className="pressable flex-1 rounded-full bg-[var(--brand)] px-6 py-4 text-lg font-extrabold text-white shadow-[var(--shadow)] transition hover:bg-[var(--brand-deep)]"
        >
          {play.rematch}
        </button>
        <Link
          href="/leaderboard"
          className="pressable flex flex-1 items-center justify-center rounded-full bg-[var(--accent)] px-6 py-4 text-lg font-extrabold text-[var(--ink)] shadow-[var(--shadow)] transition hover:bg-[var(--accent-deep)] hover:text-white"
        >
          {play.seeLeaderboard}
        </Link>
      </div>
      <Link
        href="/"
        className="text-sm font-bold text-[var(--brand-deep)] underline-offset-4 hover:underline"
      >
        {play.backHome}
      </Link>
    </section>
  );
}

function ScoreCard({
  label,
  score,
  highlight,
  delay = "0s",
}: {
  label: string;
  score: number;
  highlight?: boolean;
  delay?: string;
}) {
  return (
    <div
      className={`animate-rise-in rounded-3xl px-4 py-5 shadow-[var(--shadow)] ${
        highlight ? "bg-[var(--brand)] text-white" : "bg-white/80 text-[var(--ink)]"
      }`}
      style={{ animationDelay: delay }}
    >
      <p className={`truncate text-sm font-bold ${highlight ? "text-white/80" : "text-[var(--ink-soft)]"}`}>
        {label}
      </p>
      <p className="mt-1 font-[family-name:var(--font-display)] text-3xl font-bold">{score}</p>
    </div>
  );
}
