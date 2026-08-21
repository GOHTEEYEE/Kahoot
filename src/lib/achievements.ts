import type { StudentAccount } from "./account";
import { totalTrophies } from "./account";
import { SUBJECTS } from "./curriculum";
import { overallMastery, subjectMasteryMap } from "./mastery";
import { getLearningStreak } from "./learningLog";
import { getLeaderboard } from "./storage";
import type { AppLocale } from "./i18n/locale";
import { formatAchievementProgress, getAchievementCopy } from "./i18n/achievements";

export type AchievementDef = {
  id: string;
  name: string;
  description: string;
  condition: string;
  icon: "trophy" | "fire" | "brain" | "swords" | "lock" | "star" | "map" | "medal";
};

export type AchievementView = AchievementDef & {
  unlocked: boolean;
  progress: number; // 0–100
  progressLabel: string;
  unlockedAt: string | null;
};

export const ACHIEVEMENT_DEFS: AchievementDef[] = [
  {
    id: "first-trophy",
    name: "第一个奖杯",
    description: "获得你的第一座奖杯。",
    condition: "累计奖杯 ≥ 1",
    icon: "trophy",
  },
  {
    id: "streak-7",
    name: "连续学习 7天",
    description: "坚持每天完成学习，连续 7 天。",
    condition: "连续完成学习 7 天",
    icon: "fire",
  },
  {
    id: "thinker",
    name: "思考达人",
    description: "整体科目掌握度达到良好水平。",
    condition: "总掌握度 ≥ 60",
    icon: "brain",
  },
  {
    id: "challenger",
    name: "挑战达人",
    description: "完成足够多的挑战对局。",
    condition: "累计完成挑战 ≥ 20",
    icon: "swords",
  },
  {
    id: "top10",
    name: "排行榜 Top10",
    description: "进入总榜前十名。",
    condition: "总榜排名 ≤ 10",
    icon: "lock",
  },
  {
    id: "subject-ace",
    name: "科目高手",
    description: "任一科目掌握度达到 80。",
    condition: "单科掌握度 ≥ 80",
    icon: "star",
  },
  {
    id: "explorer",
    name: "五科初探",
    description: "每个科目都至少挑战过一次。",
    condition: "五科均有对局",
    icon: "map",
  },
  {
    id: "collector",
    name: "百杯收集者",
    description: "累计奖杯达到 100。",
    condition: "累计奖杯 ≥ 100",
    icon: "medal",
  },
  {
    id: "streak-3",
    name: "三日坚持",
    description: "连续学习 3 天。",
    condition: "连续完成学习 3 天",
    icon: "fire",
  },
  {
    id: "winner-10",
    name: "十胜勇士",
    description: "累计获得 10 场胜利。",
    condition: "总胜场 ≥ 10",
    icon: "swords",
  },
];

function totalGames(account: StudentAccount): number {
  return SUBJECTS.reduce((sum, s) => {
    const st = account.stats[s.id];
    return sum + (st?.wins ?? 0) + (st?.losses ?? 0) + (st?.draws ?? 0);
  }, 0);
}

function totalWins(account: StudentAccount): number {
  return SUBJECTS.reduce((sum, s) => sum + (account.stats[s.id]?.wins ?? 0), 0);
}

function pct(current: number, target: number): number {
  if (target <= 0) return 100;
  return Math.min(100, Math.round((current / target) * 100));
}

function unlockedDate(account: StudentAccount, unlocked: boolean): string | null {
  if (!unlocked) return null;
  const d = new Date(account.updatedAt || account.createdAt);
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

export function evaluateAchievements(
  account: StudentAccount,
  locale: AppLocale = "zh",
): AchievementView[] {
  const trophies = totalTrophies(account);
  const mastery = subjectMasteryMap(account);
  const overall = overallMastery(mastery);
  const games = totalGames(account);
  const wins = totalWins(account);
  const streak = getLearningStreak(account.id, account).current;
  const explored = SUBJECTS.filter((s) => {
    const st = account.stats[s.id];
    return (st?.wins ?? 0) + (st?.losses ?? 0) + (st?.draws ?? 0) > 0;
  }).length;
  const maxMastery = Math.max(0, ...SUBJECTS.map((s) => mastery[s.id] ?? 0));

  let rank = 999;
  try {
    const board = getLeaderboard();
    const idx = board.findIndex((r) => r.username === account.username);
    if (idx >= 0) rank = idx + 1;
  } catch {
    /* ignore */
  }

  const checks: Record<
    string,
    { unlocked: boolean; progress: number; progressLabel: string }
  > = {
    "first-trophy": {
      unlocked: trophies >= 1,
      progress: pct(trophies, 1),
      progressLabel: `${Math.min(trophies, 1)} / 1`,
    },
    "streak-7": {
      unlocked: streak >= 7,
      progress: pct(streak, 7),
      progressLabel: formatAchievementProgress("streak-7", locale, {
        current: Math.min(streak, 7),
        target: 7,
      }),
    },
    thinker: {
      unlocked: overall >= 60,
      progress: pct(overall, 60),
      progressLabel: `${overall} / 60`,
    },
    challenger: {
      unlocked: games >= 20,
      progress: pct(games, 20),
      progressLabel: `${Math.min(games, 20)} / 20`,
    },
    top10: {
      unlocked: rank <= 10,
      progress: rank <= 10 ? 100 : pct(Math.max(0, 50 - rank), 40),
      progressLabel: formatAchievementProgress("top10", locale, {
        current: rank,
        rank,
        unranked: rank >= 999,
      }),
    },
    "subject-ace": {
      unlocked: maxMastery >= 80,
      progress: pct(maxMastery, 80),
      progressLabel: `${maxMastery} / 80`,
    },
    explorer: {
      unlocked: explored >= SUBJECTS.length,
      progress: pct(explored, SUBJECTS.length),
      progressLabel: `${explored} / ${SUBJECTS.length}`,
    },
    collector: {
      unlocked: trophies >= 100,
      progress: pct(trophies, 100),
      progressLabel: `${Math.min(trophies, 100)} / 100`,
    },
    "streak-3": {
      unlocked: streak >= 3,
      progress: pct(streak, 3),
      progressLabel: formatAchievementProgress("streak-3", locale, {
        current: Math.min(streak, 3),
        target: 3,
      }),
    },
    "winner-10": {
      unlocked: wins >= 10,
      progress: pct(wins, 10),
      progressLabel: `${Math.min(wins, 10)} / 10`,
    },
  };

  return ACHIEVEMENT_DEFS.map((def) => {
    const c = checks[def.id] ?? { unlocked: false, progress: 0, progressLabel: "0" };
    const copy = getAchievementCopy(def.id, locale);
    return {
      ...def,
      name: copy?.name ?? def.name,
      description: copy?.description ?? def.description,
      condition: copy?.condition ?? def.condition,
      unlocked: c.unlocked,
      progress: c.progress,
      progressLabel: c.progressLabel,
      unlockedAt: unlockedDate(account, c.unlocked),
    };
  });
}
