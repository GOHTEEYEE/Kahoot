import type { AppLocale } from "./locale";
import type { EmoteId } from "../pvp/types";
import type { ItemId } from "../pvp/items";

export type PvpCopy = {
  matchFound: string;
  you: string;
  vs: string;
  questionN: (n: number, total: number) => string;
  clutch: string;
  lateGame: string;
  finalQuestion: string;
  powerAttack: string;
  danger: string;
  comeback: string;
  speedLine: (sec: string) => string;
  myAtk: string;
  foeAtk: string;
  hp: (cur: number, max: number) => string;
  combo: (n: number) => string;
  comboHint: (n: number, pct: number) => string;
  comboBreak: string;
  correct: string;
  wrong: string;
  damage: (n: number) => string;
  zeroDamage: string;
  thinking: (name: string) => string;
  answered: (name: string) => string;
  foeCorrect: (name: string) => string;
  foeWrong: (name: string) => string;
  foeCombo: (name: string, n: number) => string;
  foeCounter: (name: string) => string;
  foePower: (name: string, n: number) => string;
  timer: (sec: string) => string;
  items: Record<ItemId, { label: string; hint: string }>;
  emotes: Record<EmoteId, string>;
  battleOver: string;
  youWin: string;
  youLose: string;
  draw: string;
  rematch: string;
  back: string;
  home: string;
  share: string;
  shareCopied: string;
  shareTitle: string;
  resultWin: string;
  resultWinSub: string;
  resultLose: string;
  resultLoseSub: string;
  resultDraw: string;
  resultDrawSub: string;
  statAccuracy: string;
  statSpeed: string;
  statShield: string;
  speedLead: (sec: string) => string;
  speedLag: (sec: string) => string;
  speedEven: string;
  shieldOn: string;
  hasteOn: string;
  scoutUsed: string;
  freezeUsed: string;
  letters: [string, string, string, string];
};

export function getPvpCopy(locale: AppLocale): PvpCopy {
  return PVP_I18N[locale];
}

export const PVP_I18N: Record<AppLocale, PvpCopy> = {
  zh: {
    matchFound: "对战开始",
    you: "你",
    vs: "VS",
    questionN: (n, total) => `第 ${n} / ${total} 题`,
    clutch: "关键时刻",
    lateGame: "即将决出胜负",
    finalQuestion: "最后一题",
    powerAttack: "强力攻击",
    danger: "危险！",
    comeback: "对手正在反超！",
    speedLine: (sec) => `⚡ ${sec} 秒`,
    myAtk: "我的攻击力",
    foeAtk: "对手攻击力",
    hp: (cur, max) => `${cur} / ${max} HP`,
    combo: (n) => `COMBO ×${n}`,
    comboHint: (n, pct) => `连续答对 ${n} 题 · 攻击 +${pct}%`,
    comboBreak: "COMBO BREAK",
    correct: "答对！",
    wrong: "答错",
    damage: (n) => `+${n} DAMAGE`,
    zeroDamage: "0 DAMAGE",
    thinking: (name) => `${name} 正在作答...`,
    answered: (name) => `${name} 已答题`,
    foeCorrect: (name) => `✓ ${name} 答对了！`,
    foeWrong: (name) => `❌ ${name} 答错了！`,
    foeCombo: (name, n) => `🔥 ${name} COMBO ×${n}`,
    foeCounter: (name) => `⚠️ ${name} 正在反击！`,
    foePower: (name, n) => `⚡ ${name} 攻击力 ${n}`,
    timer: (sec) => `⏱ ${sec}s`,
    items: {
      scout: { label: "侦察镜", hint: "去掉一个错误选项" },
      freeze: { label: "时间冻结", hint: "对手多想 3 秒" },
      haste: { label: "极速符", hint: "下一题速度加成更高" },
      shield: { label: "专注盾", hint: "保护一次 Combo" },
    },
    emotes: {
      cheer: "加油！",
      fast: "好快！",
      nice: "厉害！",
      wow: "哇！",
      coming: "我来了！",
      think: "让我想想",
    },
    battleOver: "对战结束",
    youWin: "知识盾更亮！你赢了",
    youLose: "再练一局，下次更快",
    draw: "势均力敌",
    rematch: "再来一局",
    back: "返回挑战",
    home: "返回主页",
    share: "分享战绩",
    shareCopied: "战绩已复制！",
    shareTitle: "我的知识对战战绩",
    resultWin: "胜利！",
    resultWinSub: "你太棒了！",
    resultLose: "再接再厉！",
    resultLoseSub: "继续努力，下一局会更好！",
    resultDraw: "势均力敌",
    resultDrawSub: "再来一局分胜负！",
    statAccuracy: "正确率",
    statSpeed: "答题速度",
    statShield: "知识盾",
    speedLead: (sec) => `领先 ${sec}s`,
    speedLag: (sec) => `慢 ${sec}s`,
    speedEven: "速度持平",
    shieldOn: "专注盾已就绪",
    hasteOn: "极速符已点亮",
    scoutUsed: "已去掉一个错误选项",
    freezeUsed: "对手被冻结 3 秒",
    letters: ["A", "B", "C", "D"],
  },
  en: {
    matchFound: "MATCH FOUND",
    you: "You",
    vs: "VS",
    questionN: (n, total) => `Q ${n} / ${total}`,
    clutch: "Clutch time",
    lateGame: "Almost there",
    finalQuestion: "FINAL QUESTION",
    powerAttack: "POWER ATTACK",
    danger: "Danger!",
    comeback: "They're catching up!",
    speedLine: (sec) => `⚡ ${sec}s`,
    myAtk: "My attack",
    foeAtk: "Foe attack",
    hp: (cur, max) => `${cur} / ${max} HP`,
    combo: (n) => `COMBO ×${n}`,
    comboHint: (n, pct) => `${n} correct in a row · +${pct}% attack`,
    comboBreak: "COMBO BREAK",
    correct: "Correct!",
    wrong: "Wrong",
    damage: (n) => `+${n} DAMAGE`,
    zeroDamage: "0 DAMAGE",
    thinking: (name) => `${name} is answering...`,
    answered: (name) => `${name} locked in`,
    foeCorrect: (name) => `✓ ${name} got it!`,
    foeWrong: (name) => `❌ ${name} missed!`,
    foeCombo: (name, n) => `🔥 ${name} COMBO ×${n}`,
    foeCounter: (name) => `⚠️ ${name} is striking back!`,
    foePower: (name, n) => `⚡ ${name} hit for ${n}`,
    timer: (sec) => `⏱ ${sec}s`,
    items: {
      scout: { label: "Scout", hint: "Reveal one wrong choice" },
      freeze: { label: "Time freeze", hint: "Opponent waits 3s extra" },
      haste: { label: "Haste charm", hint: "Better speed bonus next" },
      shield: { label: "Focus shield", hint: "Protect combo once" },
    },
    emotes: {
      cheer: "Let's go!",
      fast: "So fast!",
      nice: "Nice!",
      wow: "Whoa!",
      coming: "Here I come!",
      think: "Let me think",
    },
    battleOver: "Battle over",
    youWin: "Your knowledge shield held. You win!",
    youLose: "Close one — try again",
    draw: "Draw",
    rematch: "Rematch",
    back: "Back to challenge",
    home: "Home",
    share: "Share",
    shareCopied: "Copied!",
    shareTitle: "My knowledge battle result",
    resultWin: "Victory!",
    resultWinSub: "You were amazing!",
    resultLose: "So close!",
    resultLoseSub: "Keep going — the next match is yours!",
    resultDraw: "Dead even",
    resultDrawSub: "One more round to settle it!",
    statAccuracy: "Accuracy",
    statSpeed: "Answer speed",
    statShield: "Knowledge shield",
    speedLead: (sec) => `Ahead ${sec}s`,
    speedLag: (sec) => `Behind ${sec}s`,
    speedEven: "Same pace",
    shieldOn: "Focus shield ready",
    hasteOn: "Haste charm armed",
    scoutUsed: "One wrong answer revealed",
    freezeUsed: "Opponent frozen 3s",
    letters: ["A", "B", "C", "D"],
  },
  ms: {
    matchFound: "LAWEN JUMPA",
    you: "Anda",
    vs: "VS",
    questionN: (n, total) => `Soalan ${n} / ${total}`,
    clutch: "Masa genting",
    lateGame: "Hampir tamat",
    finalQuestion: "SOALAN AKHIR",
    powerAttack: "SERANGAN KUAT",
    danger: "Bahaya!",
    comeback: "Lawan sedang undur!",
    speedLine: (sec) => `⚡ ${sec}s`,
    myAtk: "Serangan saya",
    foeAtk: "Serangan lawan",
    hp: (cur, max) => `${cur} / ${max} HP`,
    combo: (n) => `COMBO ×${n}`,
    comboHint: (n, pct) => `${n} betul berturut · +${pct}% serangan`,
    comboBreak: "COMBO PUTUS",
    correct: "Betul!",
    wrong: "Salah",
    damage: (n) => `+${n} DAMAGE`,
    zeroDamage: "0 DAMAGE",
    thinking: (name) => `${name} sedang jawab...`,
    answered: (name) => `${name} sudah jawab`,
    foeCorrect: (name) => `✓ ${name} betul!`,
    foeWrong: (name) => `❌ ${name} tersilap!`,
    foeCombo: (name, n) => `🔥 ${name} COMBO ×${n}`,
    foeCounter: (name) => `⚠️ ${name} sedang serang balik!`,
    foePower: (name, n) => `⚡ ${name} serang ${n}`,
    timer: (sec) => `⏱ ${sec}s`,
    items: {
      scout: { label: "Kanta", hint: "Buang satu jawapan salah" },
      freeze: { label: "Beku masa", hint: "Lawan fikir 3s lagi" },
      haste: { label: "Laju", hint: "Bonus kelajuan soalan seterusnya" },
      shield: { label: "Perisai", hint: "Lindungi Combo sekali" },
    },
    emotes: {
      cheer: "Semangat!",
      fast: "Laju!",
      nice: "Hebat!",
      wow: "Wah!",
      coming: "Saya datang!",
      think: "Fikir dulu",
    },
    battleOver: "Tamat",
    youWin: "Perisai ilmu anda menang!",
    youLose: "Cuba lagi",
    draw: "Seri",
    rematch: "Lawan lagi",
    back: "Kembali",
    home: "Laman utama",
    share: "Kongsi",
    shareCopied: "Disalin!",
    shareTitle: "Keputusan lawan ilmu saya",
    resultWin: "Menang!",
    resultWinSub: "Hebat sungguh!",
    resultLose: "Hampir!",
    resultLoseSub: "Teruskan — pusingan seterusnya lebih baik!",
    resultDraw: "Seri",
    resultDrawSub: "Lawan lagi untuk tentukan pemenang!",
    statAccuracy: "Ketepatan",
    statSpeed: "Kelajuan jawab",
    statShield: "Perisai ilmu",
    speedLead: (sec) => `Maju ${sec}s`,
    speedLag: (sec) => `Lambat ${sec}s`,
    speedEven: "Sama laju",
    shieldOn: "Perisai sedia",
    hasteOn: "Laju diaktifkan",
    scoutUsed: "Satu jawapan salah dibuang",
    freezeUsed: "Lawan beku 3s",
    letters: ["A", "B", "C", "D"],
  },
};
