import type { AppLocale } from "./locale";

export type AchievementCopy = {
  name: string;
  description: string;
  condition: string;
};

const ZH: Record<string, AchievementCopy> = {
  "first-trophy": {
    name: "第一个奖杯",
    description: "获得你的第一座奖杯。",
    condition: "累计奖杯 ≥ 1",
  },
  "streak-7": {
    name: "连续学习 7天",
    description: "坚持每天完成学习，连续 7 天。",
    condition: "连续完成学习 7 天",
  },
  thinker: {
    name: "思考达人",
    description: "整体科目掌握度达到良好水平。",
    condition: "总掌握度 ≥ 60",
  },
  challenger: {
    name: "挑战达人",
    description: "完成足够多的挑战对局。",
    condition: "累计完成挑战 ≥ 20",
  },
  top10: {
    name: "排行榜 Top10",
    description: "进入总榜前十名。",
    condition: "总榜排名 ≤ 10",
  },
  "subject-ace": {
    name: "科目高手",
    description: "任一科目掌握度达到 80。",
    condition: "单科掌握度 ≥ 80",
  },
  explorer: {
    name: "五科初探",
    description: "每个科目都至少挑战过一次。",
    condition: "五科均有对局",
  },
  collector: {
    name: "百杯收集者",
    description: "累计奖杯达到 100。",
    condition: "累计奖杯 ≥ 100",
  },
  "streak-3": {
    name: "三日坚持",
    description: "连续学习 3 天。",
    condition: "连续完成学习 3 天",
  },
  "winner-10": {
    name: "十胜勇士",
    description: "累计获得 10 场胜利。",
    condition: "总胜场 ≥ 10",
  },
};

const EN: Record<string, AchievementCopy> = {
  "first-trophy": {
    name: "First trophy",
    description: "Earn your first trophy.",
    condition: "Total trophies ≥ 1",
  },
  "streak-7": {
    name: "7-day streak",
    description: "Study every day for 7 days in a row.",
    condition: "Complete study 7 days in a row",
  },
  thinker: {
    name: "Thinker",
    description: "Reach a solid overall subject mastery.",
    condition: "Overall mastery ≥ 60",
  },
  challenger: {
    name: "Challenger",
    description: "Finish enough challenge matches.",
    condition: "Challenges completed ≥ 20",
  },
  top10: {
    name: "Top 10",
    description: "Reach the overall top 10.",
    condition: "Overall rank ≤ 10",
  },
  "subject-ace": {
    name: "Subject ace",
    description: "Reach 80 mastery in any subject.",
    condition: "Any subject mastery ≥ 80",
  },
  explorer: {
    name: "Five-subject start",
    description: "Play at least one challenge in every subject.",
    condition: "All five subjects played",
  },
  collector: {
    name: "Hundred-cup collector",
    description: "Reach 100 trophies in total.",
    condition: "Total trophies ≥ 100",
  },
  "streak-3": {
    name: "Three-day grit",
    description: "Study 3 days in a row.",
    condition: "Complete study 3 days in a row",
  },
  "winner-10": {
    name: "Ten-win hero",
    description: "Win 10 matches in total.",
    condition: "Total wins ≥ 10",
  },
};

const MS: Record<string, AchievementCopy> = {
  "first-trophy": {
    name: "Trofi pertama",
    description: "Dapatkan trofi pertama anda.",
    condition: "Jumlah trofi ≥ 1",
  },
  "streak-7": {
    name: "7 hari berturut",
    description: "Belajar setiap hari selama 7 hari berturut-turut.",
    condition: "Selesai belajar 7 hari berturut-turut",
  },
  thinker: {
    name: "Pemikir",
    description: "Capai penguasaan subjek keseluruhan yang baik.",
    condition: "Penguasaan keseluruhan ≥ 60",
  },
  challenger: {
    name: "Pencabar",
    description: "Selesaikan cukup banyak perlawanan cabaran.",
    condition: "Cabaran selesai ≥ 20",
  },
  top10: {
    name: "Top 10",
    description: "Masuk 10 teratas keseluruhan.",
    condition: "Kedudukan keseluruhan ≤ 10",
  },
  "subject-ace": {
    name: "Johan subjek",
    description: "Capai penguasaan 80 dalam mana-mana subjek.",
    condition: "Penguasaan mana-mana subjek ≥ 80",
  },
  explorer: {
    name: "Mula lima subjek",
    description: "Cabar sekurang-kurangnya sekali dalam setiap subjek.",
    condition: "Kelima-lima subjek telah dimainkan",
  },
  collector: {
    name: "Pengumpul 100",
    description: "Capai 100 trofi keseluruhan.",
    condition: "Jumlah trofi ≥ 100",
  },
  "streak-3": {
    name: "Tekad 3 hari",
    description: "Belajar 3 hari berturut-turut.",
    condition: "Selesai belajar 3 hari berturut-turut",
  },
  "winner-10": {
    name: "Wira 10 kemenangan",
    description: "Menang 10 perlawanan keseluruhan.",
    condition: "Jumlah kemenangan ≥ 10",
  },
};

const BY_LOCALE: Record<AppLocale, Record<string, AchievementCopy>> = {
  zh: ZH,
  en: EN,
  ms: MS,
};

export function getAchievementCopy(id: string, locale: AppLocale): AchievementCopy | null {
  return BY_LOCALE[locale]?.[id] ?? ZH[id] ?? null;
}

export function formatAchievementProgress(
  id: string,
  locale: AppLocale,
  data: { current: number; target?: number; rank?: number; unranked?: boolean },
): string {
  if (id === "top10") {
    if (data.unranked) {
      return locale === "en" ? "Unranked" : locale === "ms" ? "Belum tersenarai" : "未上榜";
    }
    if (data.rank != null) {
      return locale === "en" || locale === "ms" ? `#${data.rank}` : `第 ${data.rank} 名`;
    }
  }
  if (id === "streak-7" || id === "streak-3") {
    const unit = locale === "en" ? "days" : locale === "ms" ? "hari" : "天";
    return `${data.current} / ${data.target} ${unit}`;
  }
  if (data.target != null) return `${data.current} / ${data.target}`;
  return String(data.current);
}
