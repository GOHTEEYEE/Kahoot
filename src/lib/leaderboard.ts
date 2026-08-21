import type { SubjectId } from "./curriculum";
import { SUBJECTS } from "./curriculum";
import { getRank } from "./trophy";
import { getLeaderboard } from "./storage";
import type { AppLocale } from "./i18n/locale";
import { gapCopy, motivationCopy } from "./i18n/leaderboard";

export type RankingSubjectFilter = SubjectId | "all";

export type RankingPeriod = "all" | "weekly" | "monthly" | "friends";

export type LeaderboardEntry = {
  username: string;
  displayName: string;
  school: string;
  state: string;
  grade: number;
  trophies: number;
  wins: number;
  losses: number;
  rankTitle: string;
  rankColor: string;
};

export type RankingSnapshot = {
  subject: RankingSubjectFilter;
  period: RankingPeriod;
  rows: LeaderboardEntry[];
  meUsername: string | null;
  meIndex: number; // 0-based, -1 if missing
  me: LeaderboardEntry | null;
  above: LeaderboardEntry | null;
  trophyGap: number;
  motivation: string;
  gapLine: string;
};

export const RANKING_PERIODS: RankingPeriod[] = ["all", "weekly", "monthly", "friends"];

export const RANKING_SUBJECT_TAB_IDS: RankingSubjectFilter[] = [
  "all",
  ...SUBJECTS.map((s) => s.id as RankingSubjectFilter),
];

function enrich(row: ReturnType<typeof getLeaderboard>[number]): LeaderboardEntry {
  const rank = getRank(row.trophies);
  return {
    ...row,
    rankTitle: rank.id,
    rankColor: rank.color,
  };
}

/** Local ranking service — swap implementation later for Supabase. */
export function loadRanking(
  subject: RankingSubjectFilter,
  period: RankingPeriod,
  meUsername: string | null,
  locale: AppLocale = "zh",
): RankingSnapshot {
  // Period UI is ready; weekly/monthly/friends currently share all-time local data.
  void period;
  const raw = subject === "all" ? getLeaderboard() : getLeaderboard(subject);
  const rows = raw.map(enrich);
  const meIndex = meUsername ? rows.findIndex((r) => r.username === meUsername) : -1;
  const me = meIndex >= 0 ? rows[meIndex]! : null;
  const above = meIndex > 0 ? rows[meIndex - 1]! : null;
  const trophyGap = me && above ? Math.max(0, above.trophies - me.trophies) : 0;

  return {
    subject,
    period,
    rows,
    meUsername,
    meIndex,
    me,
    above,
    trophyGap,
    motivation: motivationCopy(locale, meIndex, trophyGap),
    gapLine: gapCopy(locale, meIndex, trophyGap, above != null),
  };
}
