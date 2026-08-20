import type { AppLocale } from "./locale";
import type { ChallengeMode } from "../challenge";

export type ChallengeCopy = {
  pageTitle: string;
  pageSubtitle: string;
  backLabel: string;
  modes: Record<
    ChallengeMode,
    { title: string; description: string; reward: string }
  >;
};

export const CHALLENGE_I18N: Record<AppLocale, ChallengeCopy> = {
  en: {
    pageTitle: "Choose Your Challenge",
    pageSubtitle: "CHOOSE A MODE AND START THE CHALLENGE",
    backLabel: "Back",
    modes: {
      arena: {
        title: "Arena Battle",
        description: "Real-time Quiz",
        reward: "Trophy +20",
      },
      rush: {
        title: "Knowledge Rush",
        description: "30 Seconds Challenge",
        reward: "Gold + Fragment",
      },
      boss: {
        title: "Boss Challenge",
        description: "Defeat the Knowledge Boss",
        reward: "Boss Reward",
      },
      friend: {
        title: "Friend Battle",
        description: "Challenge Your Friend",
        reward: "Room Code",
      },
      adventure: {
        title: "Adventure",
        description: "Explore & Learn",
        reward: "World Progress",
      },
    },
  },
  zh: {
    pageTitle: "选择挑战模式",
    pageSubtitle: "请选择一个模式，开始挑战",
    backLabel: "返回",
    modes: {
      arena: {
        title: "竞技对战",
        description: "实时知识问答",
        reward: "奖励 +20",
      },
      rush: {
        title: "知识冲刺",
        description: "30秒快速挑战",
        reward: "金币 + 碎片",
      },
      boss: {
        title: "BOSS挑战",
        description: "击败知识BOSS",
        reward: "BOSS奖励",
      },
      friend: {
        title: "好友对战",
        description: "挑战你的好友",
        reward: "房间码对战",
      },
      adventure: {
        title: "冒险探索",
        description: "探索学习世界",
        reward: "世界进度",
      },
    },
  },
  ms: {
    pageTitle: "Pilih Cabaran",
    pageSubtitle: "PILIH MOD DAN MULAKAN CABARAN",
    backLabel: "Kembali",
    modes: {
      arena: {
        title: "Arena Battle",
        description: "Kuiz Masa Nyata",
        reward: "Trofi +20",
      },
      rush: {
        title: "Knowledge Rush",
        description: "Cabaran 30 Saat",
        reward: "Emas + Fragment",
      },
      boss: {
        title: "Cabaran BOSS",
        description: "Kalahkan BOSS Pengetahuan",
        reward: "Ganjaran BOSS",
      },
      friend: {
        title: "Battle Rakan",
        description: "Cabaran Rakan Anda",
        reward: "Kod Bilik",
      },
      adventure: {
        title: "Pengembaraan",
        description: "Terokai Dunia Pembelajaran",
        reward: "Kemajuan Dunia",
      },
    },
  },
};

export function getChallengeCopy(locale: AppLocale): ChallengeCopy {
  return CHALLENGE_I18N[locale];
}
