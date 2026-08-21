import type { AppLocale } from "./locale";
import type { MatchResult } from "../trophy";

export type PlayCopy = {
  matching: string;
  friendMatch: string;
  matchStarting: string;
  searchingFoe: string;
  friendEntering: string;
  foeFound: string;
  friendReady: string;
  result: Record<MatchResult, string>;
  you: string;
  dungeonTrophies: (subject: string) => string;
  rankLine: (before: number, after: number, rank: string) => string;
  openReview: string;
  rematch: string;
  seeLeaderboard: string;
  backHome: string;
  reviewTitle: string;
  reviewSub: (correct: number, total: number) => string;
  unanswered: string;
  questionN: (n: number, ok: boolean) => string;
  wrong: string;
  yourAnswer: string;
  correctAnswer: string;
  explaining: string;
  explainAgain: string;
  explainAi: string;
  explainFail: string;
  explainNetwork: string;
  countdownGo: string;
  shapes: [string, string, string, string];
  selected: string;
  challengeable: string;
  dungeonTag: (name: string) => string;
  difficulty: (grade: string) => string;
  correctGain: (n: number) => string;
  timesUp: string;
  wrongNext: string;
  waitingFriend: string;
  again: string;
  back: string;
  adventureHint: string;
  remain: (n: number) => string;
  explored: string;
  enter: string;
  bossDown: (name: string) => string;
  bossRetry: string;
  trophyRoad: string;
  trophyRoadOpen: string;
  current: string;
  backHomeShort: string;
  spiritsTitle: string;
  spiritsHint: string;
  mascotReady: string;
  nextWorldAria: (name: string) => string;
  needMore: (n: number) => string;
  maxWorld: string;
  dungeonInstance: (name: string) => string;
  trophyRoadItems: Record<number, { title: string; detail: string }>;
};

export const PLAY_I18N: Record<AppLocale, PlayCopy> = {
  zh: {
    matching: "正在匹配对手",
    friendMatch: "好友对战",
    matchStarting: "对战即将开始",
    searchingFoe: "正在寻找奖杯相近的对手…",
    friendEntering: "好友正在入场…",
    foeFound: "对手已找到！准备开战！",
    friendReady: "好友已加入！准备开战！",
    result: { win: "胜利！", lose: "差一点！", draw: "平局" },
    you: "你",
    dungeonTrophies: (subject) => `${subject}副本奖杯`,
    rankLine: (before, after, rank) => `${before} → ${after} · 段位 ${rank}`,
    openReview: "打开复盘宝箱 · 看对错 + AI 讲解",
    rematch: "再来一局",
    seeLeaderboard: "看排行榜",
    backHome: "返回首页",
    reviewTitle: "复盘宝箱",
    reviewSub: (correct, total) => `答对 ${correct}/${total} · 点题目可看 AI 讲解`,
    unanswered: "未作答",
    questionN: (n, ok) => `第 ${n} 题 · ${ok ? "正确" : "错误"}`,
    wrong: "错",
    yourAnswer: "你的答案：",
    correctAnswer: "正确答案：",
    explaining: "AI 讲解中…",
    explainAgain: "再看一遍讲解",
    explainAi: "AI 讲解",
    explainFail: "暂时无法生成讲解，请稍后再试。",
    explainNetwork: "网络出错，请稍后再试。",
    countdownGo: "开始!",
    shapes: ["三角", "菱形", "圆形", "方块"],
    selected: "已选中",
    challengeable: "可挑战",
    dungeonTag: (name) => `${name}副本`,
    difficulty: (grade) => `难度 · ${grade}`,
    correctGain: (n) => `答对了！+${n}`,
    timesUp: "时间到！",
    wrongNext: "答错了，下一题加油！",
    waitingFriend: "等待好友答题…",
    again: "再来一次",
    back: "返回",
    adventureHint: "探索地点 · 答对题目解锁奖励",
    remain: (n) => `还差 ${n}`,
    explored: "已探索",
    enter: "进入",
    bossDown: (name) => `${name} 倒下了！`,
    bossRetry: "再练一练就能赢",
    trophyRoad: "奖杯之路",
    trophyRoadOpen: "打开奖杯之路",
    current: "当前",
    backHomeShort: "返回 Home",
    spiritsTitle: "科目精灵",
    spiritsHint: "收集页 · 后续接碎片系统",
    mascotReady: "准备好挑战了吗？",
    nextWorldAria: (name) => `下一世界 ${name}`,
    needMore: (n) => `还差 ${n}`,
    maxWorld: "Max world",
    dungeonInstance: (name) => `${name}副本`,
    trophyRoadItems: {
      50: { title: "精灵碎片", detail: "科目精灵碎片 x10" },
      100: { title: "头像框", detail: "暖木头像框" },
      200: { title: "世界升级", detail: "世界升级材料" },
      300: { title: "擂台皮肤", detail: "纸灯擂台皮肤" },
      500: { title: "传说精灵", detail: "传说精灵碎片" },
      1000: { title: "Boss 挑战", detail: "解锁 Boss 挑战" },
    },
  },
  en: {
    matching: "Finding an opponent",
    friendMatch: "Friend battle",
    matchStarting: "Battle starting",
    searchingFoe: "Looking for a trophy-matched opponent…",
    friendEntering: "Friend is joining…",
    foeFound: "Opponent found! Get ready!",
    friendReady: "Friend joined! Get ready!",
    result: { win: "Victory!", lose: "So close!", draw: "Draw" },
    you: "You",
    dungeonTrophies: (subject) => `${subject} trophies`,
    rankLine: (before, after, rank) => `${before} → ${after} · Rank ${rank}`,
    openReview: "Open review chest · answers + AI explain",
    rematch: "Play again",
    seeLeaderboard: "See rankings",
    backHome: "Back to home",
    reviewTitle: "Review chest",
    reviewSub: (correct, total) => `${correct}/${total} correct · tap a question for AI explain`,
    unanswered: "No answer",
    questionN: (n, ok) => `Q${n} · ${ok ? "Correct" : "Wrong"}`,
    wrong: "X",
    yourAnswer: "Your answer: ",
    correctAnswer: "Correct answer: ",
    explaining: "AI explaining…",
    explainAgain: "Read explain again",
    explainAi: "AI explain",
    explainFail: "Couldn't generate an explanation. Try again later.",
    explainNetwork: "Network error. Try again later.",
    countdownGo: "Go!",
    shapes: ["Triangle", "Diamond", "Circle", "Square"],
    selected: "Selected",
    challengeable: "Ready",
    dungeonTag: (name) => `${name} dungeon`,
    difficulty: (grade) => `Difficulty · ${grade}`,
    correctGain: (n) => `Correct! +${n}`,
    timesUp: "Time's up!",
    wrongNext: "Wrong — next question!",
    waitingFriend: "Waiting for your friend…",
    again: "Try again",
    back: "Back",
    adventureHint: "Explore spots · answer correctly to unlock rewards",
    remain: (n) => `${n} more`,
    explored: "Explored",
    enter: "Enter",
    bossDown: (name) => `${name} is down!`,
    bossRetry: "Practice a bit more and you'll win",
    trophyRoad: "Trophy Road",
    trophyRoadOpen: "Open Trophy Road",
    current: "Current",
    backHomeShort: "Back to Home",
    spiritsTitle: "Subject spirits",
    spiritsHint: "Collection page · fragments coming soon",
    mascotReady: "Ready to challenge?",
    nextWorldAria: (name) => `Next world ${name}`,
    needMore: (n) => `${n} more`,
    maxWorld: "Max world",
    dungeonInstance: (name) => `${name} dungeon`,
    trophyRoadItems: {
      50: { title: "Spirit Fragment", detail: "Subject spirit fragments x10" },
      100: { title: "Avatar Frame", detail: "Warm wood avatar frame" },
      200: { title: "World Upgrade", detail: "World upgrade materials" },
      300: { title: "Arena Skin", detail: "Paper-lantern arena skin" },
      500: { title: "Legendary Spirit", detail: "Legendary spirit fragments" },
      1000: { title: "Boss Battle", detail: "Unlock Boss Challenge" },
    },
  },
  ms: {
    matching: "Mencari lawan",
    friendMatch: "Pertarungan rakan",
    matchStarting: "Pertarungan akan mula",
    searchingFoe: "Mencari lawan dengan trofi serupa…",
    friendEntering: "Rakan sedang masuk…",
    foeFound: "Lawan dijumpai! Bersedia!",
    friendReady: "Rakan sudah masuk! Bersedia!",
    result: { win: "Menang!", lose: "Hampir!", draw: "Seri" },
    you: "Anda",
    dungeonTrophies: (subject) => `Trofi ${subject}`,
    rankLine: (before, after, rank) => `${before} → ${after} · Pangkat ${rank}`,
    openReview: "Buka peti ulasan · jawapan + AI",
    rematch: "Main lagi",
    seeLeaderboard: "Lihat kedudukan",
    backHome: "Kembali ke laman",
    reviewTitle: "Peti ulasan",
    reviewSub: (correct, total) => `${correct}/${total} betul · ketik soalan untuk AI`,
    unanswered: "Tidak dijawab",
    questionN: (n, ok) => `S${n} · ${ok ? "Betul" : "Salah"}`,
    wrong: "X",
    yourAnswer: "Jawapan anda: ",
    correctAnswer: "Jawapan betul: ",
    explaining: "AI menerangkan…",
    explainAgain: "Baca semula",
    explainAi: "Terang AI",
    explainFail: "Tidak dapat jana penjelasan. Cuba lagi kemudian.",
    explainNetwork: "Ralat rangkaian. Cuba lagi kemudian.",
    countdownGo: "Mula!",
    shapes: ["Segi tiga", "Berlian", "Bulatan", "Segi empat"],
    selected: "Dipilih",
    challengeable: "Sedia",
    dungeonTag: (name) => `Penjara ${name}`,
    difficulty: (grade) => `Kesukaran · ${grade}`,
    correctGain: (n) => `Betul! +${n}`,
    timesUp: "Masa tamat!",
    wrongNext: "Salah — soalan seterusnya!",
    waitingFriend: "Menunggu rakan menjawab…",
    again: "Cuba lagi",
    back: "Kembali",
    adventureHint: "Terokai lokasi · jawab betul untuk buka ganjaran",
    remain: (n) => `${n} lagi`,
    explored: "Diterokai",
    enter: "Masuk",
    bossDown: (name) => `${name} tumbang!`,
    bossRetry: "Berlatih lagi dan anda akan menang",
    trophyRoad: "Jalan Trofi",
    trophyRoadOpen: "Buka Jalan Trofi",
    current: "Semasa",
    backHomeShort: "Kembali ke Laman",
    spiritsTitle: "Roh subjek",
    spiritsHint: "Halaman koleksi · serpihan akan datang",
    mascotReady: "Sedia untuk cabaran?",
    nextWorldAria: (name) => `Dunia seterusnya ${name}`,
    needMore: (n) => `${n} lagi`,
    maxWorld: "Dunia maksimum",
    dungeonInstance: (name) => `Penjara ${name}`,
    trophyRoadItems: {
      50: { title: "Serpihan Roh", detail: "Serpihan roh subjek x10" },
      100: { title: "Bingkai Avatar", detail: "Bingkai kayu hangat" },
      200: { title: "Naik Taraf Dunia", detail: "Bahan naik taraf dunia" },
      300: { title: "Kulit Arena", detail: "Kulit arena lampu kertas" },
      500: { title: "Roh Legenda", detail: "Serpihan roh legenda" },
      1000: { title: "Cabaran BOSS", detail: "Buka Cabaran BOSS" },
    },
  },
};

export function getPlayCopy(locale: AppLocale): PlayCopy {
  return PLAY_I18N[locale] ?? PLAY_I18N.zh;
}
