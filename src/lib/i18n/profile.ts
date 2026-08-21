import type { AppLocale } from "./locale";

export type ProfileCopy = {
  pageTitle: string;
  changeAvatar: string;
  editProfile: string;
  titlePrefix: string;
  xpToNext: (level: number, xp: number) => string;
  statsAria: string;
  trophy: string;
  power: string;
  streak: string;
  challenges: string;
  streakDays: (n: number) => string;
  heroesTitle: string;
  heroesSubtitle: string;
  openArena: (subject: string) => string;
  radarAria: string;
  strongest: string;
  nextBreakthrough: string;
  lightAbility: string;
  trophiesToLevel: (n: number, level: number) => string;
  maxStage: string;
  viewSubjectDetails: string;
  recordTitle: string;
  streakBanner: (n: number) => string;
  weekCalendarAria: string;
  studied: string;
  notStudied: string;
  weeklyProgress: string;
  weeklyChallenges: (done: number, goal: number) => string;
  achievementsTitle: string;
  unlockedCount: (n: number, total: number) => string;
  viewAllAchievements: string;
  allAchievements: string;
  backToProfile: string;
  editTitle: string;
  editSubtitle: string;
  save: string;
  saved: string;
  nickname: string;
  avatar: string;
  age: string;
  grade: string;
  school: string;
  state: string;
  pickAvatarTitle: string;
  pickAvatarSubtitle: string;
  trophyModalTitle: string;
  total: (n: number) => string;
  trophyHint: string;
  cupsWins: (cups: number, wins: number) => string;
  powerTitle: string;
  powerHint: string;
  abilityOf: (subject: string) => string;
  challengeDone: string;
  achievement: string;
  streakTitle: string;
  currentDays: (n: number) => string;
  currentStreak: string;
  longestStreak: string;
  recentDays: string;
  challengeHistory: string;
  totalTimes: (n: number) => string;
  times: (n: number) => string;
  winsTrophiesMastery: (wins: number, trophies: number, mastery: number) => string;
  dayDetail: string;
  dayDone: string;
  dayEmpty: string;
  completedChallenges: string;
  goLearn: string;
  achievementFallback: string;
  completed: string;
  locked: string;
  inProgress: string;
  condition: string;
  progress: string;
  status: string;
  subjectDetails: string;
  subjectDetailsSub: string;
  masteryTrophiesChallenges: (mastery: number, trophies: number, games: number) => string;
  currentArena: (name: string) => string;
  nextLevelTrophies: (level: number, n: number) => string;
  maxWorld: string;
};

export const PROFILE_I18N: Record<AppLocale, ProfileCopy> = {
  zh: {
    pageTitle: "我的资料",
    changeAvatar: "更换头像",
    editProfile: "编辑资料",
    titlePrefix: "称号",
    xpToNext: (level, xp) => `距离 Lv.${level} 还需 ${xp.toLocaleString()} XP`,
    statsAria: "玩家统计",
    trophy: "奖杯",
    power: "学习战力",
    streak: "连续学习",
    challenges: "完成挑战",
    streakDays: (n) => `${n}天`,
    heroesTitle: "我的学习英雄",
    heroesSubtitle: "五大科目能力分布",
    openArena: (subject) => `打开${subject}擂台`,
    radarAria: "科目能力雷达",
    strongest: "最强科目",
    nextBreakthrough: "下一项突破",
    lightAbility: "去挑战点亮能力",
    trophiesToLevel: (n, level) => `再获得 ${n} 奖杯，将达到 Lv.${level}`,
    maxStage: "已达最高关卡",
    viewSubjectDetails: "查看科目详情 >",
    recordTitle: "学习记录",
    streakBanner: (n) => `🔥 连续学习 ${n} 天`,
    weekCalendarAria: "本周学习日历",
    studied: "已学习",
    notStudied: "未学习",
    weeklyProgress: "本周学习进度",
    weeklyChallenges: (done, goal) => `${done} / ${goal} 次挑战`,
    achievementsTitle: "我的成就",
    unlockedCount: (n, total) => `已获得 ${n} / ${total}`,
    viewAllAchievements: "查看全部成就 >",
    allAchievements: "全部成就",
    backToProfile: "返回资料",
    editTitle: "编辑资料",
    editSubtitle: "更新你的学习英雄档案",
    save: "保存",
    saved: "已保存 ✓",
    nickname: "昵称",
    avatar: "头像",
    age: "年龄",
    grade: "年级",
    school: "学校",
    state: "州属",
    pickAvatarTitle: "更换头像",
    pickAvatarSubtitle: "选择你的学习英雄形象",
    trophyModalTitle: "奖杯",
    total: (n) => `总计 ${n}`,
    trophyHint: "奖杯来自各科目擂台对战与挑战奖励。",
    cupsWins: (cups, wins) => `${cups} 杯 · ${wins} 胜`,
    powerTitle: "学习战力",
    powerHint: "战力 = 各科能力分 + 挑战加成 + 成就加成",
    abilityOf: (subject) => `${subject}能力`,
    challengeDone: "挑战完成",
    achievement: "成就",
    streakTitle: "连续学习",
    currentDays: (n) => `当前 ${n} 天`,
    currentStreak: "当前连续：",
    longestStreak: "最长连续：",
    recentDays: "最近学习日：",
    challengeHistory: "挑战历史",
    totalTimes: (n) => `累计 ${n} 次`,
    times: (n) => `${n} 次`,
    winsTrophiesMastery: (wins, trophies, mastery) =>
      `胜 ${wins} · 奖杯 ${trophies} · 掌握度 ${mastery}%`,
    dayDetail: "学习详情",
    dayDone: "已完成学习",
    dayEmpty: "这一天还没有学习记录",
    completedChallenges: "完成挑战：",
    goLearn: "去擂台或挑战页完成一次学习吧！",
    achievementFallback: "成就",
    completed: "已完成",
    locked: "未解锁",
    inProgress: "进行中",
    condition: "条件",
    progress: "进度",
    status: "状态",
    subjectDetails: "科目详情",
    subjectDetailsSub: "能力 · 关卡 · 解锁",
    masteryTrophiesChallenges: (mastery, trophies, games) =>
      `掌握度 ${mastery}% · 奖杯 ${trophies} · 挑战 ${games}`,
    currentArena: (name) => `当前 Arena：${name}`,
    nextLevelTrophies: (level, n) => `下一关 Lv.${level}：再获得 ${n} 奖杯`,
    maxWorld: "已达最高世界关卡",
  },
  en: {
    pageTitle: "My Profile",
    changeAvatar: "Change avatar",
    editProfile: "Edit profile",
    titlePrefix: "Title",
    xpToNext: (level, xp) => `${xp.toLocaleString()} XP to Lv.${level}`,
    statsAria: "Player stats",
    trophy: "Trophies",
    power: "Power",
    streak: "Streak",
    challenges: "Challenges",
    streakDays: (n) => (n === 1 ? "1 day" : `${n} days`),
    heroesTitle: "My Learning Heroes",
    heroesSubtitle: "Ability across five subjects",
    openArena: (subject) => `Open ${subject} arena`,
    radarAria: "Subject ability radar",
    strongest: "Strongest subject",
    nextBreakthrough: "Next breakthrough",
    lightAbility: "Play a challenge to light this up",
    trophiesToLevel: (n, level) => `${n} more trophies to reach Lv.${level}`,
    maxStage: "Highest stage reached",
    viewSubjectDetails: "View subject details >",
    recordTitle: "Learning log",
    streakBanner: (n) => `🔥 ${n}-day streak`,
    weekCalendarAria: "This week's learning calendar",
    studied: "Studied",
    notStudied: "Not studied",
    weeklyProgress: "This week's progress",
    weeklyChallenges: (done, goal) => `${done} / ${goal} challenges`,
    achievementsTitle: "My achievements",
    unlockedCount: (n, total) => `${n} / ${total} unlocked`,
    viewAllAchievements: "View all achievements >",
    allAchievements: "All achievements",
    backToProfile: "Back to profile",
    editTitle: "Edit profile",
    editSubtitle: "Update your learning hero card",
    save: "Save",
    saved: "Saved ✓",
    nickname: "Nickname",
    avatar: "Avatar",
    age: "Age",
    grade: "Year",
    school: "School",
    state: "State",
    pickAvatarTitle: "Change avatar",
    pickAvatarSubtitle: "Pick your learning hero look",
    trophyModalTitle: "Trophies",
    total: (n) => `Total ${n}`,
    trophyHint: "Trophies come from arena battles and challenge rewards.",
    cupsWins: (cups, wins) => `${cups} trophies · ${wins} wins`,
    powerTitle: "Learning power",
    powerHint: "Power = subject ability + challenge bonus + achievement bonus",
    abilityOf: (subject) => `${subject} ability`,
    challengeDone: "Challenges completed",
    achievement: "Achievements",
    streakTitle: "Learning streak",
    currentDays: (n) => `Current ${n} days`,
    currentStreak: "Current streak:",
    longestStreak: "Longest streak:",
    recentDays: "Recent study days:",
    challengeHistory: "Challenge history",
    totalTimes: (n) => `${n} total`,
    times: (n) => `${n}x`,
    winsTrophiesMastery: (wins, trophies, mastery) =>
      `${wins} wins · ${trophies} trophies · ${mastery}% mastery`,
    dayDetail: "Study details",
    dayDone: "Study completed",
    dayEmpty: "No study recorded this day",
    completedChallenges: "Challenges completed:",
    goLearn: "Play an arena or challenge to log a study day!",
    achievementFallback: "Achievement",
    completed: "Completed",
    locked: "Locked",
    inProgress: "In progress",
    condition: "Condition",
    progress: "Progress",
    status: "Status",
    subjectDetails: "Subject details",
    subjectDetailsSub: "Ability · Stage · Unlock",
    masteryTrophiesChallenges: (mastery, trophies, games) =>
      `${mastery}% mastery · ${trophies} trophies · ${games} challenges`,
    currentArena: (name) => `Current arena: ${name}`,
    nextLevelTrophies: (level, n) => `Next Lv.${level}: ${n} more trophies`,
    maxWorld: "Highest world stage reached",
  },
  ms: {
    pageTitle: "Profil Saya",
    changeAvatar: "Tukar avatar",
    editProfile: "Edit profil",
    titlePrefix: "Gelaran",
    xpToNext: (level, xp) => `${xp.toLocaleString()} XP lagi ke Lv.${level}`,
    statsAria: "Stat pemain",
    trophy: "Trofi",
    power: "Kuasa",
    streak: "Rentetan",
    challenges: "Cabaran",
    streakDays: (n) => `${n} hari`,
    heroesTitle: "Wira Pembelajaran",
    heroesSubtitle: "Taburan keupayaan lima subjek",
    openArena: (subject) => `Buka arena ${subject}`,
    radarAria: "Radar keupayaan subjek",
    strongest: "Subjek terkuat",
    nextBreakthrough: "Pencapaian seterusnya",
    lightAbility: "Cabar untuk nyalakan keupayaan",
    trophiesToLevel: (n, level) => `${n} trofi lagi untuk capai Lv.${level}`,
    maxStage: "Peringkat tertinggi dicapai",
    viewSubjectDetails: "Lihat butiran subjek >",
    recordTitle: "Rekod pembelajaran",
    streakBanner: (n) => `🔥 ${n} hari berturut`,
    weekCalendarAria: "Kalendar pembelajaran minggu ini",
    studied: "Sudah belajar",
    notStudied: "Belum belajar",
    weeklyProgress: "Kemajuan minggu ini",
    weeklyChallenges: (done, goal) => `${done} / ${goal} cabaran`,
    achievementsTitle: "Pencapaian saya",
    unlockedCount: (n, total) => `${n} / ${total} dibuka`,
    viewAllAchievements: "Lihat semua pencapaian >",
    allAchievements: "Semua pencapaian",
    backToProfile: "Kembali ke profil",
    editTitle: "Edit profil",
    editSubtitle: "Kemas kini kad wira pembelajaran",
    save: "Simpan",
    saved: "Disimpan ✓",
    nickname: "Nama samaran",
    avatar: "Avatar",
    age: "Umur",
    grade: "Tahun",
    school: "Sekolah",
    state: "Negeri",
    pickAvatarTitle: "Tukar avatar",
    pickAvatarSubtitle: "Pilih rupa wira pembelajaran",
    trophyModalTitle: "Trofi",
    total: (n) => `Jumlah ${n}`,
    trophyHint: "Trofi datang dari pertarungan arena dan ganjaran cabaran.",
    cupsWins: (cups, wins) => `${cups} trofi · ${wins} menang`,
    powerTitle: "Kuasa pembelajaran",
    powerHint: "Kuasa = keupayaan subjek + bonus cabaran + bonus pencapaian",
    abilityOf: (subject) => `Keupayaan ${subject}`,
    challengeDone: "Cabaran selesai",
    achievement: "Pencapaian",
    streakTitle: "Rentetan belajar",
    currentDays: (n) => `Semasa ${n} hari`,
    currentStreak: "Rentetan semasa:",
    longestStreak: "Rentetan terpanjang:",
    recentDays: "Hari belajar terkini:",
    challengeHistory: "Sejarah cabaran",
    totalTimes: (n) => `${n} jumlah`,
    times: (n) => `${n}x`,
    winsTrophiesMastery: (wins, trophies, mastery) =>
      `${wins} menang · ${trophies} trofi · ${mastery}% penguasaan`,
    dayDetail: "Butiran belajar",
    dayDone: "Pembelajaran selesai",
    dayEmpty: "Tiada rekod pembelajaran hari ini",
    completedChallenges: "Cabaran selesai:",
    goLearn: "Main arena atau cabaran untuk rekod hari belajar!",
    achievementFallback: "Pencapaian",
    completed: "Selesai",
    locked: "Terkunci",
    inProgress: "Dalam kemajuan",
    condition: "Syarat",
    progress: "Kemajuan",
    status: "Status",
    subjectDetails: "Butiran subjek",
    subjectDetailsSub: "Keupayaan · Peringkat · Buka",
    masteryTrophiesChallenges: (mastery, trophies, games) =>
      `${mastery}% penguasaan · ${trophies} trofi · ${games} cabaran`,
    currentArena: (name) => `Arena semasa: ${name}`,
    nextLevelTrophies: (level, n) => `Lv.${level} seterusnya: ${n} trofi lagi`,
    maxWorld: "Peringkat dunia tertinggi dicapai",
  },
};

export function getProfileCopy(locale: AppLocale): ProfileCopy {
  return PROFILE_I18N[locale] ?? PROFILE_I18N.zh;
}
