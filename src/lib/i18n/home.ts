import type { AppLocale } from "./locale";
import type { Grade, SubjectId } from "../curriculum";

export type HomeCopy = {
  loading: string;
  loadingTip: string;
  grade: (g: Grade) => string;
  subjects: Record<SubjectId, string>;
  worldNames: Record<SubjectId, string>;
  dailyChest: string;
  dailyMission: string;
  battlePass: string;
  events: string;
  season: string;
  world: string;
  challenge: string;
  challengeSub: string;
  worldMap: string;
  worldMapSub: string;
    worldMapTitle: string;
    worldMapHint: string;
    viewMap: string;
    unlockFree: string;
  unlockTrophies: (n: number) => string;
  mapComingSoon: string;
  current: string;
  preview: string;
  unlocked: string;
  needMore: string;
  close: string;
  nextReward: string;
  trophyToUnlock: (n: number) => string;
  allCollected: string;
  mail: string;
  notify: string;
  sfxOn: string;
  sfxOff: string;
  settings: string;
  battleLog: string;
  noMail: string;
  noNotify: string;
  nav: {
    home: string;
    spirits: string;
    pass: string;
    rank: string;
    profile: string;
  };
  toastChest: string;
  toastMission: string;
  toastEvent: string;
  toastSeason: string;
};

export const HOME_I18N: Record<AppLocale, HomeCopy> = {
  zh: {
    loading: "正在进入 MathArena...",
    loadingTip: "答得快、答得对，才能打败所有怪物！",
    grade: (g) => `${g}年级`,
    subjects: {
      chinese: "华文",
      english: "英文",
      malay: "马来文",
      math: "数学",
      science: "科学",
    },
    worldNames: {
      chinese: "墨香书院",
      english: "Word Keep",
      malay: "Istana Bahasa",
      math: "Arithmetic Canyon",
      science: "Experiment Tower",
    },
    dailyChest: "每日宝箱",
    dailyMission: "每日任务",
    battlePass: "通行证",
    events: "活动中心",
    season: "赛季",
    world: "世界",
    challenge: "挑战",
    challengeSub: "CHALLENGE",
    worldMap: "世界地图",
    worldMapSub: "WORLD MAP",
    worldMapTitle: "世界地图",
    worldMapHint: "点关卡看小岛",
    viewMap: "查看关卡地图",
    unlockFree: "免费解锁",
    unlockTrophies: (n) => `${n} 奖杯解锁`,
    mapComingSoon: "地图即将揭晓",
    current: "当前",
    preview: "预览",
    unlocked: "已解锁",
    needMore: "还差",
    close: "关闭",
    nextReward: "NEXT REWARD",
    trophyToUnlock: (n) => `再 ${n} 奖杯解锁`,
    allCollected: "已集齐",
    mail: "邮件",
    notify: "通知",
    sfxOn: "打开音效",
    sfxOff: "关闭音效",
    settings: "设置",
    battleLog: "对战记录",
    noMail: "暂无新邮件",
    noNotify: "暂无新通知",
    nav: {
      home: "首页",
      spirits: "精灵",
      pass: "通行证",
      rank: "排行榜",
      profile: "我的",
    },
    toastChest: "每日宝箱已领取",
    toastMission: "完成 1 场 Challenge 吧！",
    toastEvent: "活动即将开始",
    toastSeason: "赛季奖励已更新",
  },
  en: {
    loading: "Entering MathArena...",
    loadingTip: "Answer fast, answer right, and defeat all the monsters!",
    grade: (g) => `Year ${g}`,
    subjects: {
      chinese: "Chinese",
      english: "English",
      malay: "Malay",
      math: "Math",
      science: "Science",
    },
    worldNames: {
      chinese: "Ink Academy",
      english: "Word Keep",
      malay: "Language Palace",
      math: "Arithmetic Canyon",
      science: "Experiment Tower",
    },
    dailyChest: "Daily Chest",
    dailyMission: "Daily Quests",
    battlePass: "Pass",
    events: "Events",
    season: "Season",
    world: "World",
    challenge: "Challenge",
    challengeSub: "START",
    worldMap: "World Map",
    worldMapSub: "EXPLORE",
    worldMapTitle: "World Map",
    worldMapHint: "Tap a stage to preview the island",
    viewMap: "View stage map",
    unlockFree: "Free unlock",
    unlockTrophies: (n) => `${n} trophies to unlock`,
    mapComingSoon: "Map coming soon",
    current: "Current",
    preview: "Preview",
    unlocked: "Unlocked",
    needMore: "Need",
    close: "Close",
    nextReward: "NEXT REWARD",
    trophyToUnlock: (n) => `${n} Trophy to unlock`,
    allCollected: "Complete",
    mail: "Mail",
    notify: "Notifications",
    sfxOn: "Unmute SFX",
    sfxOff: "Mute SFX",
    settings: "Settings",
    battleLog: "Battle Log",
    noMail: "No new mail",
    noNotify: "No new notifications",
    nav: {
      home: "Home",
      spirits: "Spirits",
      pass: "Pass",
      rank: "Rank",
      profile: "Profile",
    },
    toastChest: "Daily Chest claimed",
    toastMission: "Complete 1 Challenge!",
    toastEvent: "Events starting soon",
    toastSeason: "Season rewards updated",
  },
  ms: {
    loading: "Memasuki MathArena...",
    loadingTip: "Jawab pantas, jawab betul, dan kalahkan semua raksasa!",
    grade: (g) => `Tahun ${g}`,
    subjects: {
      chinese: "Bahasa Cina",
      english: "Bahasa Inggeris",
      malay: "Bahasa Melayu",
      math: "Matematik",
      science: "Sains",
    },
    worldNames: {
      chinese: "Akademi Dakwat",
      english: "Word Keep",
      malay: "Istana Bahasa",
      math: "Lembah Aritmetik",
      science: "Menara Eksperimen",
    },
    dailyChest: "Peti Harian",
    dailyMission: "Misi Harian",
    battlePass: "Pas",
    events: "Aktiviti",
    season: "Musim",
    world: "Dunia",
    challenge: "Cabaran",
    challengeSub: "MULA",
    worldMap: "Peta Dunia",
    worldMapSub: "TEROKAI",
    worldMapTitle: "Peta Dunia",
    worldMapHint: "Ketik peringkat untuk lihat pulau",
    viewMap: "Lihat peta peringkat",
    unlockFree: "Buka percuma",
    unlockTrophies: (n) => `${n} trofi untuk buka`,
    mapComingSoon: "Peta akan datang",
    current: "Semasa",
    preview: "Pratonton",
    unlocked: "Dibuka",
    needMore: "Perlu",
    close: "Tutup",
    nextReward: "GANJARAN SETERUSNYA",
    trophyToUnlock: (n) => `${n} Trofi lagi`,
    allCollected: "Lengkap",
    mail: "Mel",
    notify: "Pemberitahuan",
    sfxOn: "Hidupkan bunyi",
    sfxOff: "Senyapkan bunyi",
    settings: "Tetapan",
    battleLog: "Rekod Lawan",
    noMail: "Tiada mel baharu",
    noNotify: "Tiada pemberitahuan",
    nav: {
      home: "Laman",
      spirits: "Roh",
      pass: "Pas",
      rank: "Kedudukan",
      profile: "Saya",
    },
    toastChest: "Peti Harian dituntut",
    toastMission: "Selesaikan 1 Cabaran!",
    toastEvent: "Aktiviti akan bermula",
    toastSeason: "Ganjaran musim dikemas kini",
  },
};

export function getHomeCopy(locale: AppLocale): HomeCopy {
  return HOME_I18N[locale] ?? HOME_I18N.zh;
}

export function localizedGrade(grade: Grade, locale: AppLocale): string {
  return getHomeCopy(locale).grade(grade);
}

export function localizedSubject(id: SubjectId, locale: AppLocale): string {
  return getHomeCopy(locale).subjects[id] ?? id;
}

export function localizedWorldName(id: SubjectId, locale: AppLocale): string {
  return getHomeCopy(locale).worldNames[id] ?? id;
}
