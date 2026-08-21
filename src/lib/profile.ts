import type { StudentAccount, SubjectStats } from "./account";
import { totalTrophies } from "./account";
import type { Grade, SubjectId } from "./curriculum";
import { SUBJECTS } from "./curriculum";
import { localizedGrade, localizedSubject } from "./i18n/home";
import { localizedWorldStageName } from "./i18n/labels";
import { subjectMastery, subjectMasteryMap } from "./mastery";
import { readWallet } from "./rewards";
import { getNextWorldStage, getWorldStage } from "./worlds";
import {
  getLearningStreak,
  getWeekActivity,
  getWeeklyChallengeCount,
  type DayActivity,
} from "./learningLog";
import { evaluateAchievements, type AchievementView } from "./achievements";
import type { PlayerTitleId } from "./i18n/labels";
import type { AppLocale } from "./i18n/locale";

export const DEFAULT_AVATAR = "/worlds/chinese/momo.png?v=live";

export const AVATAR_OPTIONS = [
  { id: "momo", src: "/worlds/chinese/momo.png?v=live", label: "墨墨" },
  { id: "momo-wave", src: "/worlds/chinese/momo-wave.png", label: "挥手墨墨" },
  { id: "momo-lv1", src: "/worlds/chinese/lv1/static/momo.png", label: "小岛墨墨" },
  { id: "chinese", src: "/worlds/chinese/hero.png", label: "华文英雄" },
  { id: "math", src: "/worlds/math/hero.png", label: "数学英雄" },
  { id: "english", src: "/worlds/english/hero.png", label: "英文英雄" },
  { id: "malay", src: "/worlds/malay/hero.png", label: "马来文英雄" },
  { id: "science", src: "/worlds/science/hero.png", label: "科学英雄" },
] as const;

/** XP needed per account level (wallet.xp). */
export const XP_PER_LEVEL = 250;

export const WEEKLY_CHALLENGE_GOAL = 10;

const PLAYER_TITLES: { minTrophies: number; id: PlayerTitleId }[] = [
  { minTrophies: 800, id: "legend" },
  { minTrophies: 500, id: "master" },
  { minTrophies: 300, id: "gold" },
  { minTrophies: 150, id: "silver" },
  { minTrophies: 50, id: "bronze" },
  { minTrophies: 0, id: "camp" },
];

export type XpProgress = {
  level: number;
  currentXP: number;
  requiredXP: number;
  toNext: number;
  totalXp: number;
  pct: number;
};

export type SubjectProgressRow = {
  id: SubjectId;
  name: string;
  level: number;
  mastery: number;
  trophies: number;
  games: number;
  wins: number;
  toNextLevelTrophies: number | null;
  nextLevel: number | null;
  arenaName: string;
};

export type LearningPowerBreakdown = {
  total: number;
  bySubject: { id: SubjectId; name: string; points: number }[];
  challengeBonus: number;
  achievementBonus: number;
};

export type ProfileSnapshot = {
  account: StudentAccount;
  avatar: string;
  displayName: string;
  username: string;
  age: number;
  grade: Grade;
  gradeText: string;
  school: string;
  state: string;
  titleId: PlayerTitleId;
  title: string;
  xp: XpProgress;
  trophies: number;
  learningPower: LearningPowerBreakdown;
  streak: { current: number; longest: number };
  completedChallenges: number;
  mastery: Record<SubjectId, number>;
  subjects: SubjectProgressRow[];
  strongest: SubjectProgressRow | null;
  nextBreakthrough: {
    subject: SubjectProgressRow;
    trophiesNeeded: number;
    nextLevel: number;
  } | null;
  weekDays: DayActivity[];
  weeklyChallenges: number;
  weeklyGoal: number;
  achievements: AchievementView[];
  unlockedCount: number;
  achievementTotal: number;
};

export function getAvatarSrc(account: StudentAccount): string {
  return account.avatar?.trim() || DEFAULT_AVATAR;
}

export function getXpProgress(totalXp: number): XpProgress {
  const xp = Math.max(0, Math.floor(totalXp));
  const level = Math.max(1, Math.floor(xp / XP_PER_LEVEL) + 1);
  const currentXP = xp % XP_PER_LEVEL;
  const requiredXP = XP_PER_LEVEL;
  return {
    level,
    currentXP,
    requiredXP,
    toNext: requiredXP - currentXP || requiredXP,
    totalXp: xp,
    pct: Math.min(100, Math.round((currentXP / requiredXP) * 100)),
  };
}

export function getPlayerTitleId(trophies: number): PlayerTitleId {
  for (const row of PLAYER_TITLES) {
    if (trophies >= row.minTrophies) return row.id;
  }
  return "camp";
}

export function getPlayerTitle(trophies: number): string {
  return getPlayerTitleId(trophies);
}

function gamesOf(stats: SubjectStats | undefined): number {
  if (!stats) return 0;
  return stats.wins + stats.losses + stats.draws;
}

export function totalChallenges(account: StudentAccount): number {
  return SUBJECTS.reduce((sum, s) => sum + gamesOf(account.stats[s.id]), 0);
}

export function getLearningPower(
  account: StudentAccount,
  locale: AppLocale = "zh",
): LearningPowerBreakdown {
  const mastery = subjectMasteryMap(account);
  const bySubject = SUBJECTS.map((s) => ({
    id: s.id,
    name: localizedSubject(s.id, locale),
    points: Math.round((mastery[s.id] ?? 0) * 1.2 + (account.stats[s.id]?.trophies ?? 0) * 0.35),
  }));
  const challengeBonus = SUBJECTS.reduce((sum, s) => {
    const st = account.stats[s.id];
    return sum + (st?.wins ?? 0) * 4 + (st?.draws ?? 0) * 2;
  }, 0);
  const achievementBonus = evaluateAchievements(account).filter((a) => a.unlocked).length * 12;
  const total =
    bySubject.reduce((n, r) => n + r.points, 0) + challengeBonus + achievementBonus;
  return { total, bySubject, challengeBonus, achievementBonus };
}

export function getSubjectProgress(
  account: StudentAccount,
  locale: AppLocale = "zh",
): SubjectProgressRow[] {
  const mastery = subjectMasteryMap(account);
  return SUBJECTS.map((s) => {
    const stats = account.stats[s.id];
    const trophies = stats?.trophies ?? 0;
    const stage = getWorldStage(trophies);
    const next = getNextWorldStage(trophies);
    return {
      id: s.id,
      name: localizedSubject(s.id, locale),
      level: stage.level,
      mastery: mastery[s.id] ?? 0,
      trophies,
      games: gamesOf(stats),
      wins: stats?.wins ?? 0,
      toNextLevelTrophies: next ? Math.max(0, next.minTrophies - trophies) : null,
      nextLevel: next?.level ?? null,
      arenaName: localizedWorldStageName(stage.id, locale),
    };
  });
}

export function getStrongestSubject(rows: SubjectProgressRow[]): SubjectProgressRow | null {
  if (rows.length === 0) return null;
  return [...rows].sort(
    (a, b) => b.mastery - a.mastery || b.trophies - a.trophies || a.name.localeCompare(b.name),
  )[0];
}

export function getNextBreakthrough(
  rows: SubjectProgressRow[],
): { subject: SubjectProgressRow; trophiesNeeded: number; nextLevel: number } | null {
  const candidates = rows
    .filter((r) => r.toNextLevelTrophies != null && r.nextLevel != null)
    .sort(
      (a, b) =>
        (a.toNextLevelTrophies ?? 9999) - (b.toNextLevelTrophies ?? 9999) ||
        a.mastery - b.mastery,
    );
  const best = candidates[0];
  if (!best || best.toNextLevelTrophies == null || best.nextLevel == null) return null;
  return {
    subject: best,
    trophiesNeeded: best.toNextLevelTrophies,
    nextLevel: best.nextLevel,
  };
}

export function buildProfileSnapshot(
  account: StudentAccount,
  locale: AppLocale = "zh",
): ProfileSnapshot {
  const wallet = readWallet(account);
  const trophies = totalTrophies(account);
  const mastery = subjectMasteryMap(account);
  const subjects = getSubjectProgress(account, locale);
  const achievements = evaluateAchievements(account, locale);
  const unlockedCount = achievements.filter((a) => a.unlocked).length;
  const streak = getLearningStreak(account.id, account);
  const weekDays = getWeekActivity(account.id, account);
  const weeklyChallenges = getWeeklyChallengeCount(account.id, account);

  return {
    account,
    avatar: getAvatarSrc(account),
    displayName: account.displayName,
    username: account.username,
    age: account.age,
    grade: account.grade,
    gradeText: localizedGrade(account.grade, locale),
    school: account.school,
    state: account.state,
    titleId: getPlayerTitleId(trophies),
    title: getPlayerTitleId(trophies),
    xp: getXpProgress(wallet.xp),
    trophies,
    learningPower: getLearningPower(account, locale),
    streak,
    completedChallenges: totalChallenges(account),
    mastery,
    subjects,
    strongest: getStrongestSubject(subjects),
    nextBreakthrough: getNextBreakthrough(subjects),
    weekDays,
    weeklyChallenges,
    weeklyGoal: WEEKLY_CHALLENGE_GOAL,
    achievements,
    unlockedCount,
    achievementTotal: achievements.length,
  };
}

export function subjectTrophyHistory(
  account: StudentAccount,
  locale: AppLocale = "zh",
): {
  id: SubjectId;
  name: string;
  trophies: number;
  wins: number;
}[] {
  return SUBJECTS.map((s) => ({
    id: s.id,
    name: localizedSubject(s.id, locale),
    trophies: account.stats[s.id]?.trophies ?? 0,
    wins: account.stats[s.id]?.wins ?? 0,
  }));
}

export function masteryOf(stats: SubjectStats | undefined): number {
  return subjectMastery(stats);
}
