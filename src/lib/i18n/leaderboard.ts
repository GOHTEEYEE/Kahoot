import type { AppLocale } from "./locale";
import type { RankingPeriod, RankingSubjectFilter } from "../leaderboard";
import { localizedSubject } from "./home";

export type LeaderboardCopy = {
  title: string;
  subtitle: string;
  rules: string;
  back: string;
  loadError: string;
  reload: string;
  emptyTitle: string;
  emptyHint: string;
  goChallenge: string;
  colRank: string;
  colPlayer: string;
  colTrophies: string;
  myRank: string;
  notRanked: string;
  playerProfile: string;
  currentSubject: string;
  rank: string;
  trophies: string;
  rankTitle: string;
  record: (wins: number, losses: number) => string;
  allTrophies: string;
  periods: Record<RankingPeriod, string>;
  rulesTitle: string;
  rulesSubtitle: string;
  rulesBody: { heading: string; body: string }[];
};

export const LEADERBOARD_I18N: Record<AppLocale, LeaderboardCopy> = {
  zh: {
    title: "奖杯排行榜",
    subtitle: "各科目奖杯分开排 · 可看总奖杯",
    rules: "规则",
    back: "返回",
    loadError: "排行榜暂时无法加载",
    reload: "重新加载",
    emptyTitle: "还没有同学参加挑战",
    emptyHint: "完成一局挑战即可登上奖杯榜",
    goChallenge: "去挑战",
    colRank: "排名",
    colPlayer: "玩家信息",
    colTrophies: "奖杯数",
    myRank: "我的排名",
    notRanked: "尚未上榜 · 完成挑战即可入榜",
    playerProfile: "选手资料",
    currentSubject: "当前科目",
    rank: "排名",
    trophies: "奖杯",
    rankTitle: "段位",
    record: (wins, losses) => `战绩 ${wins} 胜 · ${losses} 负`,
    allTrophies: "总奖杯",
    periods: { all: "总榜", weekly: "本周", monthly: "本月", friends: "好友榜" },
    rulesTitle: "排行榜规则",
    rulesSubtitle: "Rules",
    rulesBody: [
      { heading: "奖杯怎么来？", body: "完成挑战、对战获胜可获得各科目奖杯。不同科目的奖杯分开计算。" },
      { heading: "排名怎么算？", body: "按当前筛选科目（或总奖杯）的奖杯数从高到低排列。奖杯相同则按胜场更多者优先。" },
      { heading: "时间范围", body: "「总榜」为累计奖杯。「本周 / 本月 / 好友榜」界面已就绪，数据接入后会按周期刷新。" },
      { heading: "平手怎么办？", body: "奖杯数相同：胜场多的排前面；仍相同则按昵称字母顺序。" },
      { heading: "何时更新？", body: "挑战结算后即时更新本地排行。云端榜单将按周期同步。" },
    ],
  },
  en: {
    title: "Trophy Rankings",
    subtitle: "Trophies ranked by subject · or view all",
    rules: "Rules",
    back: "Back",
    loadError: "Couldn't load the leaderboard",
    reload: "Reload",
    emptyTitle: "No classmates on the board yet",
    emptyHint: "Finish one challenge to join the trophy board",
    goChallenge: "Go challenge",
    colRank: "Rank",
    colPlayer: "Player",
    colTrophies: "Trophies",
    myRank: "My ranking",
    notRanked: "Not ranked yet · finish a challenge to join",
    playerProfile: "Player profile",
    currentSubject: "Current subject",
    rank: "Rank",
    trophies: "Trophies",
    rankTitle: "Rank",
    record: (wins, losses) => `Record ${wins} W · ${losses} L`,
    allTrophies: "All trophies",
    periods: { all: "All time", weekly: "This week", monthly: "This month", friends: "Friends" },
    rulesTitle: "Ranking rules",
    rulesSubtitle: "Rules",
    rulesBody: [
      { heading: "How do I earn trophies?", body: "Win challenges and battles to earn trophies for each subject. Subject trophies are counted separately." },
      { heading: "How is rank calculated?", body: "Players are sorted by trophies for the selected subject (or all trophies). Ties go to more wins." },
      { heading: "Time range", body: "All-time is cumulative trophies. This week / month / friends tabs are ready; live period data comes later." },
      { heading: "What about ties?", body: "Same trophies: more wins rank higher; still tied, then by nickname." },
      { heading: "When does it update?", body: "Local ranking updates as soon as a challenge ends. Cloud boards will sync on a schedule." },
    ],
  },
  ms: {
    title: "Kedudukan Trofi",
    subtitle: "Trofi mengikut subjek · atau jumlah",
    rules: "Peraturan",
    back: "Kembali",
    loadError: "Kedudukan tidak dapat dimuatkan",
    reload: "Muat semula",
    emptyTitle: "Belum ada rakan sekelas di papan",
    emptyHint: "Selesaikan satu cabaran untuk naik papan trofi",
    goChallenge: "Pergi cabar",
    colRank: "Kedudukan",
    colPlayer: "Pemain",
    colTrophies: "Trofi",
    myRank: "Kedudukan saya",
    notRanked: "Belum tersenarai · selesaikan cabaran untuk masuk",
    playerProfile: "Profil pemain",
    currentSubject: "Subjek semasa",
    rank: "Kedudukan",
    trophies: "Trofi",
    rankTitle: "Pangkat",
    record: (wins, losses) => `Rekod ${wins} M · ${losses} K`,
    allTrophies: "Semua trofi",
    periods: { all: "Keseluruhan", weekly: "Minggu ini", monthly: "Bulan ini", friends: "Rakan" },
    rulesTitle: "Peraturan kedudukan",
    rulesSubtitle: "Peraturan",
    rulesBody: [
      { heading: "Bagaimana dapat trofi?", body: "Menang cabaran dan pertarungan untuk dapat trofi setiap subjek. Trofi subjek dikira berasingan." },
      { heading: "Bagaimana kedudukan dikira?", body: "Pemain disusun mengikut trofi subjek dipilih (atau jumlah). Seri pergi kepada lebih banyak kemenangan." },
      { heading: "Julat masa", body: "Keseluruhan ialah trofi kumulatif. Tab minggu / bulan / rakan sudah sedia; data tempoh akan datang." },
      { heading: "Jika seri?", body: "Trofi sama: lebih menang di atas; masih seri, ikut nama samaran." },
      { heading: "Bila dikemas kini?", body: "Kedudukan tempatan dikemas kini selepas cabaran tamat. Papan awan akan disegerakkan kemudian." },
    ],
  },
};

export function getLeaderboardCopy(locale: AppLocale): LeaderboardCopy {
  return LEADERBOARD_I18N[locale] ?? LEADERBOARD_I18N.zh;
}

export function rankingSubjectLabel(subject: RankingSubjectFilter, locale: AppLocale): string {
  if (subject === "all") return getLeaderboardCopy(locale).allTrophies;
  return localizedSubject(subject, locale);
}

export function gapCopy(
  locale: AppLocale,
  meIndex: number,
  trophyGap: number,
  hasAbove: boolean,
): string {
  if (locale === "en") {
    if (meIndex < 0) return "Finish a challenge to join the trophy board!";
    if (meIndex === 0) return "You're #1! Keep it up!";
    if (!hasAbove) return "Keep challenging to climb higher!";
    if (trophyGap <= 0) return `Tied with #${meIndex} — one more win to overtake!`;
    return `${trophyGap} trophies behind #${meIndex}`;
  }
  if (locale === "ms") {
    if (meIndex < 0) return "Selesaikan cabaran untuk naik papan trofi!";
    if (meIndex === 0) return "Anda #1! Teruskan!";
    if (!hasAbove) return "Teruskan cabaran untuk naik lebih tinggi!";
    if (trophyGap <= 0) return `Sama trofi dengan #${meIndex} — satu kemenangan lagi untuk atasi!`;
    return `${trophyGap} trofi lagi ke #${meIndex}`;
  }
  if (meIndex < 0) return "完成一场挑战，登上奖杯榜！";
  if (meIndex === 0) return "你现在是第 1 名！继续保持！";
  if (!hasAbove) return "继续挑战，冲击更高排名！";
  if (trophyGap <= 0) return `与第 ${meIndex} 名奖杯相同，再赢一场就能反超！`;
  return `距离第 ${meIndex} 名还差 ${trophyGap} 奖杯`;
}

export function motivationCopy(locale: AppLocale, meIndex: number, trophyGap: number): string {
  if (locale === "en") {
    if (meIndex < 0) return "Win trophies in a challenge and you'll be on the board!";
    if (meIndex === 0) return "You're at the top — stay the champion!";
    if (trophyGap <= 49) return "So close! This is your chance to overtake!";
    if (trophyGap <= 100) return "A little more effort and you'll catch the next rank!";
    return "Keep challenging to climb higher!";
  }
  if (locale === "ms") {
    if (meIndex < 0) return "Menang trofi dalam cabaran dan anda akan tersenarai!";
    if (meIndex === 0) return "Anda di puncak — kekal juara!";
    if (trophyGap <= 49) return "Hampir! Ini peluang untuk atasi!";
    if (trophyGap <= 100) return "Sedikit lagi usaha untuk kejar kedudukan seterusnya!";
    return "Teruskan cabaran untuk naik lebih tinggi!";
  }
  if (meIndex < 0) return "去挑战赢奖杯，马上就能上榜！";
  if (meIndex === 0) return "你已经登顶！继续保持冠军！";
  if (trophyGap <= 49) return "只差一点！现在正是反超的机会！";
  if (trophyGap <= 100) return "再努力一点，就能追上上一名！";
  return "继续挑战，冲击更高排名！";
}

export function nextRankGoalLine(locale: AppLocale, meIndex: number, trophyGap: number): string {
  if (locale === "en") {
    if (meIndex < 0) return "Win your first match and start your trophy path!";
    if (meIndex === 0) return "You're #1! Keep it up!";
    if (trophyGap <= 0) return `Rank ${meIndex + 1} — one more win to take #${meIndex}!`;
    return `Rank ${meIndex + 1} — keep going for #${meIndex}!`;
  }
  if (locale === "ms") {
    if (meIndex < 0) return "Menang perlawanan pertama dan mulakan jalan trofi!";
    if (meIndex === 0) return "Anda #1! Teruskan!";
    if (trophyGap <= 0) return `Kedudukan ${meIndex + 1} — satu kemenangan lagi ke #${meIndex}!`;
    return `Kedudukan ${meIndex + 1} — teruskan ke #${meIndex}!`;
  }
  if (meIndex < 0) return "赢下第一场，开启你的奖杯之路！";
  if (meIndex === 0) return "你现在是第 1 名！继续保持！";
  if (trophyGap <= 0) return `当前排名 ${meIndex + 1}，再赢一场冲击第 ${meIndex} 名！`;
  return `当前排名 ${meIndex + 1}，继续加油冲击第 ${meIndex} 名！`;
}
