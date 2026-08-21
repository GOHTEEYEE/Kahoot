import type { AppLocale } from "./locale";
import type { WorldStageId } from "../worlds";

export type PlayerTitleId = "camp" | "bronze" | "silver" | "gold" | "master" | "legend";

export type RankId = "rookie" | "bronze" | "silver" | "gold" | "master" | "legend";

export type SharedLabels = {
  loading: string;
  preparing: string;
  back: string;
  close: string;
  you: string;
  youSuffix: string;
  trophies: string;
  titles: Record<PlayerTitleId, string>;
  ranks: Record<RankId, string>;
  weekdays: readonly [string, string, string, string, string, string, string];
  worldStages: Record<WorldStageId, string>;
  avatars: Record<string, string>;
  ageYears: (n: number) => string;
  days: (n: number) => string;
  trophyAria: (n: number) => string;
};

export const SHARED_I18N: Record<AppLocale, SharedLabels> = {
  zh: {
    loading: "加载中…",
    preparing: "准备中…",
    back: "返回",
    close: "关闭",
    you: "你",
    youSuffix: " · 你",
    trophies: "奖杯",
    titles: {
      camp: "新手营",
      bronze: "青铜",
      silver: "白银",
      gold: "黄金",
      master: "大师",
      legend: "传奇",
    },
    ranks: {
      rookie: "新手营",
      bronze: "青铜",
      silver: "白银",
      gold: "黄金",
      master: "大师",
      legend: "传说",
    },
    weekdays: ["一", "二", "三", "四", "五", "六", "日"],
    worldStages: {
      village: "小村庄",
      academy: "学院",
      temple: "神殿",
      city: "大城",
      kingdom: "浮空王国",
      empire: "云上帝国",
    },
    avatars: {
      momo: "墨墨",
      "momo-wave": "挥手墨墨",
      "momo-lv1": "小岛墨墨",
      chinese: "华文英雄",
      math: "数学英雄",
      english: "英文英雄",
      malay: "马来文英雄",
      science: "科学英雄",
    },
    ageYears: (n) => `${n}岁`,
    days: (n) => `${n}天`,
    trophyAria: (n) => `${n} 奖杯`,
  },
  en: {
    loading: "Loading…",
    preparing: "Getting ready…",
    back: "Back",
    close: "Close",
    you: "You",
    youSuffix: " · You",
    trophies: "Trophies",
    titles: {
      camp: "Rookie Camp",
      bronze: "Bronze",
      silver: "Silver",
      gold: "Gold",
      master: "Master",
      legend: "Legend",
    },
    ranks: {
      rookie: "Rookie Camp",
      bronze: "Bronze",
      silver: "Silver",
      gold: "Gold",
      master: "Master",
      legend: "Legend",
    },
    weekdays: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
    worldStages: {
      village: "Tiny Village",
      academy: "Academy",
      temple: "Temple",
      city: "Large City",
      kingdom: "Floating Kingdom",
      empire: "Sky Empire",
    },
    avatars: {
      momo: "Momo",
      "momo-wave": "Waving Momo",
      "momo-lv1": "Island Momo",
      chinese: "Chinese Hero",
      math: "Math Hero",
      english: "English Hero",
      malay: "Malay Hero",
      science: "Science Hero",
    },
    ageYears: (n) => `${n} yrs`,
    days: (n) => (n === 1 ? "1 day" : `${n} days`),
    trophyAria: (n) => `${n} trophies`,
  },
  ms: {
    loading: "Memuatkan…",
    preparing: "Bersedia…",
    back: "Kembali",
    close: "Tutup",
    you: "Anda",
    youSuffix: " · Anda",
    trophies: "Trofi",
    titles: {
      camp: "Kem Baharu",
      bronze: "Gangsa",
      silver: "Perak",
      gold: "Emas",
      master: "Guru",
      legend: "Legenda",
    },
    ranks: {
      rookie: "Kem Baharu",
      bronze: "Gangsa",
      silver: "Perak",
      gold: "Emas",
      master: "Guru",
      legend: "Legenda",
    },
    weekdays: ["Isn", "Sel", "Rab", "Kha", "Jum", "Sab", "Ahd"],
    worldStages: {
      village: "Kampung Kecil",
      academy: "Akademi",
      temple: "Kuil",
      city: "Bandar Besar",
      kingdom: "Kerajaan Terapung",
      empire: "Empayar Langit",
    },
    avatars: {
      momo: "Momo",
      "momo-wave": "Momo Melambai",
      "momo-lv1": "Momo Pulau",
      chinese: "Wira Cina",
      math: "Wira Matematik",
      english: "Wira Inggeris",
      malay: "Wira Melayu",
      science: "Wira Sains",
    },
    ageYears: (n) => `${n} thn`,
    days: (n) => `${n} hari`,
    trophyAria: (n) => `${n} trofi`,
  },
};

export function getSharedLabels(locale: AppLocale): SharedLabels {
  return SHARED_I18N[locale] ?? SHARED_I18N.zh;
}

export function localizedPlayerTitle(id: PlayerTitleId, locale: AppLocale): string {
  return getSharedLabels(locale).titles[id];
}

export function localizedRankName(id: string, locale: AppLocale): string {
  const ranks = getSharedLabels(locale).ranks;
  return ranks[id as RankId] ?? id;
}

export function localizedWorldStageName(id: WorldStageId, locale: AppLocale): string {
  return getSharedLabels(locale).worldStages[id] ?? id;
}

export function localizedWeekday(index: number, locale: AppLocale): string {
  return getSharedLabels(locale).weekdays[index] ?? "";
}

export function localizedAvatarLabel(id: string, locale: AppLocale): string {
  return getSharedLabels(locale).avatars[id] ?? id;
}
