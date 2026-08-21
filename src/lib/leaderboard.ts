import type { SubjectId } from "./curriculum";
import { SUBJECTS } from "./curriculum";
import { getRank } from "./trophy";
import { getLeaderboard } from "./storage";

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

export const RANKING_PERIODS: { id: RankingPeriod; label: string }[] = [
  { id: "all", label: "总榜" },
  { id: "weekly", label: "本周" },
  { id: "monthly", label: "本月" },
  { id: "friends", label: "好友榜" },
];

export const RANKING_SUBJECT_TABS: { id: RankingSubjectFilter; label: string }[] = [
  { id: "all", label: "总奖杯" },
  ...SUBJECTS.map((s) => ({ id: s.id as RankingSubjectFilter, label: s.name })),
];

function enrich(row: ReturnType<typeof getLeaderboard>[number]): LeaderboardEntry {
  const rank = getRank(row.trophies);
  return {
    ...row,
    rankTitle: rank.name,
    rankColor: rank.color,
  };
}

/** Local ranking service — swap implementation later for Supabase. */
export function loadRanking(
  subject: RankingSubjectFilter,
  period: RankingPeriod,
  meUsername: string | null,
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
    motivation: motivationCopy(meIndex, trophyGap),
    gapLine: gapCopy(meIndex, trophyGap, above),
  };
}

export function gapCopy(
  meIndex: number,
  trophyGap: number,
  above: LeaderboardEntry | null,
): string {
  if (meIndex < 0) return "完成一场挑战，登上奖杯榜！";
  if (meIndex === 0) return "你现在是第 1 名！继续保持！";
  if (!above) return "继续挑战，冲击更高排名！";
  if (trophyGap <= 0) return `与第 ${meIndex} 名奖杯相同，再赢一场就能反超！`;
  return `距离第 ${meIndex} 名还差 ${trophyGap} 奖杯`;
}

export function motivationCopy(meIndex: number, trophyGap: number): string {
  if (meIndex < 0) return "去挑战赢奖杯，马上就能上榜！";
  if (meIndex === 0) return "你已经登顶！继续保持冠军！";
  if (trophyGap <= 0) return "只差一点！现在正是反超的机会！";
  if (trophyGap <= 49) return "只差一点！现在正是反超的机会！";
  if (trophyGap <= 100) return "再努力一点，就能追上上一名！";
  return "继续挑战，冲击更高排名！";
}

export function nextRankGoalLine(meIndex: number, trophyGap: number): string {
  if (meIndex < 0) return "赢下第一场，开启你的奖杯之路！";
  if (meIndex === 0) return "你现在是第 1 名！继续保持！";
  if (trophyGap <= 0) return `当前排名 ${meIndex + 1}，再赢一场冲击第 ${meIndex} 名！`;
  return `当前排名 ${meIndex + 1}，继续加油冲击第 ${meIndex} 名！`;
}

export function distanceToTopN(me: LeaderboardEntry | null, rows: LeaderboardEntry[], n: number): string | null {
  if (!me || rows.length === 0) return null;
  const meIdx = rows.findIndex((r) => r.username === me.username);
  if (meIdx < 0) return null;
  if (meIdx + 1 <= n) return `你已进入 Top ${n}！`;
  const cutoff = rows[n - 1];
  if (!cutoff) return null;
  const need = Math.max(0, cutoff.trophies - me.trophies + 1);
  return `距离 Top ${n} 还差 ${need} 分`;
}

export function subjectLabel(subject: RankingSubjectFilter): string {
  if (subject === "all") return "总奖杯";
  return SUBJECTS.find((s) => s.id === subject)?.name ?? subject;
}
