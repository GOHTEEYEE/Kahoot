import type { AppLocale } from "./locale";

export type BattleLogCopy = {
  title: string;
  all: string;
  wins: string;
  losses: string;
  victory: string;
  defeat: string;
  draw: string;
  accuracy: string;
  speedLead: (sec: string) => string;
  speedLag: (sec: string) => string;
  speedEven: string;
  emptyTitle: string;
  emptyBody: string;
  startBattle: string;
  detailTitle: string;
  finalHp: string;
  trophy: string;
  xp: string;
  breakdown: string;
  questionN: (n: number) => string;
  correct: string;
  wrong: string;
  damage: (n: number) => string;
  justNow: string;
  minutesAgo: (n: number) => string;
  hoursAgo: (n: number) => string;
  daysAgo: (n: number) => string;
};

export function getBattleLogCopy(locale: AppLocale): BattleLogCopy {
  return BATTLE_LOG_I18N[locale];
}

export const BATTLE_LOG_I18N: Record<AppLocale, BattleLogCopy> = {
  zh: {
    title: "Battle Log",
    all: "全部",
    wins: "胜利",
    losses: "失败",
    victory: "胜利",
    defeat: "失败",
    draw: "平局",
    accuracy: "正确率",
    speedLead: (sec) => `领先 ${sec}s`,
    speedLag: (sec) => `慢 ${sec}s`,
    speedEven: "速度持平",
    emptyTitle: "还没有对战记录",
    emptyBody: "完成第一场知识对战后，\n你的 Battle Log 会显示在这里。",
    startBattle: "开始第一场对战",
    detailTitle: "Battle Result",
    finalHp: "最终 HP",
    trophy: "Trophy",
    xp: "XP",
    breakdown: "答题明细",
    questionN: (n) => `第 ${n} 题`,
    correct: "正确",
    wrong: "错误",
    damage: (n) => (n > 0 ? `+${n} Damage` : "0 Damage"),
    justNow: "刚刚",
    minutesAgo: (n) => `${n}分钟前`,
    hoursAgo: (n) => `${n}小时前`,
    daysAgo: (n) => `${n}天前`,
  },
  en: {
    title: "Battle Log",
    all: "All",
    wins: "Wins",
    losses: "Losses",
    victory: "Victory",
    defeat: "Defeat",
    draw: "Draw",
    accuracy: "Accuracy",
    speedLead: (sec) => `Ahead ${sec}s`,
    speedLag: (sec) => `Behind ${sec}s`,
    speedEven: "Same pace",
    emptyTitle: "No battles yet",
    emptyBody: "Finish your first knowledge duel\nand it will show up here.",
    startBattle: "Start first battle",
    detailTitle: "Battle Result",
    finalHp: "Final HP",
    trophy: "Trophy",
    xp: "XP",
    breakdown: "Question breakdown",
    questionN: (n) => `Q${n}`,
    correct: "Correct",
    wrong: "Wrong",
    damage: (n) => (n > 0 ? `+${n} Damage` : "0 Damage"),
    justNow: "Just now",
    minutesAgo: (n) => `${n}m ago`,
    hoursAgo: (n) => `${n}h ago`,
    daysAgo: (n) => `${n}d ago`,
  },
  ms: {
    title: "Battle Log",
    all: "Semua",
    wins: "Menang",
    losses: "Kalah",
    victory: "Menang",
    defeat: "Kalah",
    draw: "Seri",
    accuracy: "Ketepatan",
    speedLead: (sec) => `Maju ${sec}s`,
    speedLag: (sec) => `Lambat ${sec}s`,
    speedEven: "Sama laju",
    emptyTitle: "Belum ada rekod",
    emptyBody: "Selesaikan perlawanan ilmu pertama\ndan ia akan muncul di sini.",
    startBattle: "Mula perlawanan pertama",
    detailTitle: "Keputusan Lawan",
    finalHp: "HP akhir",
    trophy: "Trofi",
    xp: "XP",
    breakdown: "Pecahan soalan",
    questionN: (n) => `Soalan ${n}`,
    correct: "Betul",
    wrong: "Salah",
    damage: (n) => (n > 0 ? `+${n} Damage` : "0 Damage"),
    justNow: "Tadi",
    minutesAgo: (n) => `${n} min lalu`,
    hoursAgo: (n) => `${n} jam lalu`,
    daysAgo: (n) => `${n} hari lalu`,
  },
};
