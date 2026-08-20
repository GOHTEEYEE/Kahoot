import { scoreForAnswer } from "./questions";

export const RUSH_DURATION_MS = 30_000;

export function rushPoints(correct: boolean, remainingMs: number, streakAfter: number): number {
  if (!correct) return 0;
  const base = scoreForAnswer(true, remainingMs);
  const mult = 1 + Math.min(Math.max(streakAfter - 1, 0), 5) * 0.15;
  return Math.round(base * mult);
}

export function rushRewards(correct: number, score: number) {
  return {
    gold: 24 + correct * 8 + Math.floor(score / 120),
    fragments: Math.min(8, 2 + Math.floor(correct / 2)),
    xp: 12 + correct * 4,
    trophy: Math.min(5, Math.floor(correct / 3)),
  };
}
