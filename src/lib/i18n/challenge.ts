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
  friendSubtitle: string;
  createRoom: string;
  enterCode: string;
  join: string;
  joining: string;
  howTo: string;
  yourCode: string;
  copyCode: string;
  copyInvite: string;
  waitingFriend: string;
  waitingHint: string;
  creating: string;
  needCode: string;
  loginOther: string;
  joinFailed: string;
  copiedCode: string;
  copiedInvite: string;
  errors: Record<string, string>;
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
    friendSubtitle: "Online · room code or invite link",
    createRoom: "Create Room",
    enterCode: "Enter Room Code",
    join: "Join",
    joining: "Joining...",
    howTo: "One phone taps Create Room, then send the code or invite link. The friend logs in with another account and Joins.",
    yourCode: "Your Room Code",
    copyCode: "Copy Code",
    copyInvite: "Copy Invite Link",
    waitingFriend: "Waiting for Friend...",
    waitingHint: "Send the code or invite link to another phone. After they log in with a different account and open the link, the battle starts.",
    creating: "Creating room...",
    needCode: "Enter the 6-digit room code shown on the host phone",
    loginOther: "Log in with another account before opening the invite link",
    joinFailed: "Couldn't join. Please try again",
    copiedCode: "Room code copied",
    copiedInvite: "Invite link copied — send it to a friend",
    errors: {
      not_found: "Room not found or expired. Ask the host to create a new one",
      self: "You can't join your own room. Log in with another account",
      full: "Room is full",
      invalid: "Invalid request. Please try again",
      db_required: "Online friend battles need Supabase. See supabase_friend_rooms.sql",
      db_error: "Room server is unavailable. Please try again",
      network: "Can't connect. Check your network and retry",
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
    friendSubtitle: "在线联机 · 房间码或邀请链接",
    createRoom: "创建房间",
    enterCode: "输入房间码",
    join: "加入",
    joining: "加入中...",
    howTo: "一台手机点创建房间，把房间码或邀请链接发给朋友；对方用另一个账号登录后加入。",
    yourCode: "你的房间码",
    copyCode: "复制房间码",
    copyInvite: "复制邀请链接",
    waitingFriend: "等待好友加入...",
    waitingHint: "把房间码或邀请链接发给另一台手机。对方登录不同账号后打开链接，对战会自动开始。",
    creating: "正在创建房间...",
    needCode: "请输入房主手机上显示的 6 位房间码",
    loginOther: "请先登录另一个账号再打开邀请链接",
    joinFailed: "加入失败，请重试",
    copiedCode: "已复制房间码",
    copiedInvite: "已复制邀请链接，发给朋友打开即可加入",
    errors: {
      not_found: "房间不存在或已过期，请让房主重新开房",
      self: "不能加入自己的房间，请用另一个账号登录",
      full: "房间已满",
      invalid: "请求无效，请重试",
      db_required: "线上好友对战需要配置 Supabase，请看 supabase_friend_rooms.sql",
      db_error: "房间服务器暂时不可用，请稍后再试",
      network: "网络连不上，请检查网络后重试",
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
    friendSubtitle: "Dalam talian · kod bilik atau pautan jemputan",
    createRoom: "Cipta Bilik",
    enterCode: "Masukkan Kod Bilik",
    join: "Sertai",
    joining: "Menyertai...",
    howTo: "Satu telefon ketik Cipta Bilik, kemudian hantar kod atau pautan. Rakan log masuk dengan akaun lain lalu Sertai.",
    yourCode: "Kod Bilik Anda",
    copyCode: "Salin Kod",
    copyInvite: "Salin Pautan Jemputan",
    waitingFriend: "Menunggu rakan...",
    waitingHint: "Hantar kod atau pautan ke telefon lain. Selepas mereka log masuk dengan akaun berbeza dan buka pautan, pertarungan bermula.",
    creating: "Mencipta bilik...",
    needCode: "Masukkan kod 6 digit yang dipaparkan pada telefon tuan rumah",
    loginOther: "Log masuk dengan akaun lain sebelum membuka pautan jemputan",
    joinFailed: "Tidak dapat sertai. Sila cuba lagi",
    copiedCode: "Kod bilik disalin",
    copiedInvite: "Pautan jemputan disalin — hantar kepada rakan",
    errors: {
      not_found: "Bilik tidak dijumpai atau tamat tempoh. Minta tuan rumah cipta baharu",
      self: "Tidak boleh sertai bilik sendiri. Log masuk dengan akaun lain",
      full: "Bilik penuh",
      invalid: "Permintaan tidak sah. Sila cuba lagi",
      db_required: "Pertarungan rakan dalam talian memerlukan Supabase. Lihat supabase_friend_rooms.sql",
      db_error: "Pelayan bilik tidak tersedia. Sila cuba lagi",
      network: "Tidak dapat sambung. Periksa rangkaian dan cuba lagi",
    },
  },
};

export function getChallengeCopy(locale: AppLocale): ChallengeCopy {
  return CHALLENGE_I18N[locale];
}
