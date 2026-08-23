import type { SubjectId } from "../curriculum";
import { grantRewards } from "../rewards";
import { getCurrentAccount, getSelectedSubject, getSubjectStats, recordSubjectMatch } from "../storage";
import { applyTrophyChange, calcTrophyDelta, type MatchResult } from "../trophy";
import { winnerOf } from "./engine";
import type { KnowledgeMatch } from "./types";

export type PvpOutcome = "win" | "lose" | "draw";

export type PvpFighterResult = {
  name: string;
  avatar: string;
  heroEmoji: string;
  hp: number;
  maxHp: number;
  correctAnswers: number;
  totalQuestions: number;
  accuracy: number;
  totalAnswerTime: number;
  averageAnswerTime: number;
  damage: number;
  trophy?: number;
  xp?: number;
  knowledgeShield?: number;
};

export type PvpQuestionResult = {
  index: number;
  correct: boolean;
  timeSec: number;
  damage: number;
};

export type PvpMatchResult = {
  matchId: string;
  result: PvpOutcome;
  subject: SubjectId;
  level: number;
  player: PvpFighterResult;
  opponent: PvpFighterResult;
  battle: {
    totalQuestions: number;
    completedQuestions: number;
    playerScore: number;
    opponentScore: number;
    playerFinalHp: number;
    opponentFinalHp: number;
    playerWin: boolean;
    winReason: "hp" | "score" | "draw";
  };
  questions: PvpQuestionResult[];
  rewards: {
    trophy: number;
    xp: number;
    knowledgeShield: number;
    combo: number;
    claimed: boolean;
  };
  timestamp: number;
};

const RESULT_KEY = "matharena:pvp-last-result";
const CLAIMED_KEY = "matharena:pvp-claimed-ids";

function canUseStorage(): boolean {
  return typeof window !== "undefined" && typeof window.sessionStorage !== "undefined";
}

function pct(correct: number, total: number): number {
  if (total <= 0) return 0;
  return Math.round((correct / total) * 100);
}

function xpFor(result: PvpOutcome): number {
  if (result === "win") return 16;
  if (result === "draw") return 10;
  return 6;
}

function shieldFor(result: PvpOutcome, accuracy: number, combo: number): number {
  const base = result === "win" ? 15 : result === "draw" ? 8 : 5;
  return base + Math.floor(accuracy / 20) * 2 + Math.min(5, Math.max(0, combo));
}

export function outcomeOf(match: KnowledgeMatch): PvpOutcome {
  const winner = winnerOf(match);
  if (winner === "player") return "win";
  if (winner === "opponent") return "lose";
  return "draw";
}

export function buildPvpMatchResult(
  match: KnowledgeMatch,
  opts: { subject: SubjectId; trophiesBefore: number; opponentTrophies: number },
): PvpMatchResult {
  const result = outcomeOf(match);
  const total = match.battle.totalQuestions || match.questions.length;
  const completed = Math.max(match.player.answeredCount, match.opponent.answeredCount, match.battle.answerHistory.length);
  const playerAcc = pct(match.player.correctCount, total);
  const foeAcc = pct(match.opponent.correctCount, total);
  const combo = match.player.maxCombo;
  const trophy = calcTrophyDelta(result as MatchResult, opts.trophiesBefore, opts.opponentTrophies);
  const xp = xpFor(result);
  const knowledgeShield = shieldFor(result, playerAcc, combo);
  const winReason =
    match.player.hp !== match.opponent.hp ? "hp" : match.battle.playerScore !== match.battle.opponentScore ? "score" : "draw";
  const matchId = `pvp_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`;
  const questions = match.battle.answerHistory.map((row, i) => ({
    index: row.questionIndex ?? i,
    correct: Boolean(row.playerCorrect),
    timeSec: Number(((row.playerMs ?? 0) / 1000).toFixed(1)),
    damage: row.playerDamage,
  }));

  return {
    matchId,
    result,
    subject: opts.subject,
    level: match.player.level,
    questions,
    player: {
      name: match.player.name,
      avatar: match.player.avatar,
      heroEmoji: match.player.heroEmoji,
      hp: Math.round(match.player.hp),
      maxHp: match.player.maxHp,
      correctAnswers: match.player.correctCount,
      totalQuestions: total,
      accuracy: playerAcc,
      totalAnswerTime: match.player.totalAnswerMs,
      averageAnswerTime: match.player.averageAnswerTime,
      damage: match.battle.playerScore,
      trophy,
      xp,
      knowledgeShield,
    },
    opponent: {
      name: match.opponent.name,
      avatar: match.opponent.avatar,
      heroEmoji: match.opponent.heroEmoji,
      hp: Math.round(match.opponent.hp),
      maxHp: match.opponent.maxHp,
      correctAnswers: match.opponent.correctCount,
      totalQuestions: total,
      accuracy: foeAcc,
      totalAnswerTime: match.opponent.totalAnswerMs,
      averageAnswerTime: match.opponent.averageAnswerTime,
      damage: match.battle.opponentScore,
    },
    battle: {
      totalQuestions: total,
      completedQuestions: completed,
      playerScore: match.battle.playerScore,
      opponentScore: match.battle.opponentScore,
      playerFinalHp: Math.round(match.player.hp),
      opponentFinalHp: Math.round(match.opponent.hp),
      playerWin: result === "win",
      winReason,
    },
    rewards: {
      trophy,
      xp,
      knowledgeShield,
      combo,
      claimed: false,
    },
    timestamp: Date.now(),
  };
}

export function savePvpMatchResult(result: PvpMatchResult): void {
  if (!canUseStorage()) return;
  try {
    window.sessionStorage.setItem(RESULT_KEY, JSON.stringify(result));
  } catch {
    /* ignore quota */
  }
}

export function loadPvpMatchResult(): PvpMatchResult | null {
  if (!canUseStorage()) return null;
  try {
    const raw = window.sessionStorage.getItem(RESULT_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as PvpMatchResult;
  } catch {
    return null;
  }
}

export function clearPvpMatchResult(): void {
  if (!canUseStorage()) return;
  try {
    window.sessionStorage.removeItem(RESULT_KEY);
  } catch {
    /* ignore */
  }
}

function claimedIds(): string[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(CLAIMED_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as unknown;
    return Array.isArray(parsed) ? parsed.filter((id): id is string => typeof id === "string") : [];
  } catch {
    return [];
  }
}

function markClaimed(matchId: string): void {
  if (typeof window === "undefined") return;
  const next = [...new Set([...claimedIds(), matchId])].slice(-80);
  window.localStorage.setItem(CLAIMED_KEY, JSON.stringify(next));
}

export function applyPvpRewardsOnce(result: PvpMatchResult): PvpMatchResult {
  if (result.rewards.claimed || claimedIds().includes(result.matchId)) {
    return { ...result, rewards: { ...result.rewards, claimed: true } };
  }
  const account = getCurrentAccount();
  const subject = result.subject || getSelectedSubject();
  if (account) {
    const before = getSubjectStats(account, subject).trophies;
    const after = applyTrophyChange(before, result.rewards.trophy);
    recordSubjectMatch(account, subject, result.result, after);
    grantRewards(account, subject, {
      gold: result.result === "win" ? 40 : result.result === "draw" ? 20 : 12,
      fragments: result.rewards.knowledgeShield,
      xp: result.rewards.xp,
      trophy: Math.max(0, result.rewards.trophy),
    });
  }
  markClaimed(result.matchId);
  const claimed = { ...result, rewards: { ...result.rewards, claimed: true } };
  savePvpMatchResult(claimed);
  return claimed;
}

export function speedLeadSeconds(result: PvpMatchResult): number {
  return Number((result.opponent.averageAnswerTime - result.player.averageAnswerTime).toFixed(1));
}

export function shareText(result: PvpMatchResult, locale: "zh" | "en" | "ms"): string {
  const acc = `${result.player.accuracy}%`;
  const lead = speedLeadSeconds(result);
  const speed =
    lead > 0
      ? locale === "en"
        ? `faster by ${lead}s`
        : locale === "ms"
          ? `lebih laju ${lead}s`
          : `领先 ${lead}s`
      : lead < 0
        ? locale === "en"
          ? `slower by ${Math.abs(lead)}s`
          : locale === "ms"
            ? `lebih perlahan ${Math.abs(lead)}s`
            : `慢 ${Math.abs(lead)}s`
        : locale === "en"
          ? "same pace"
          : locale === "ms"
            ? "sama laju"
            : "速度持平";
  const combo = result.rewards.combo;
  if (result.result === "win") {
    if (locale === "en") {
      return `🏆 I won a knowledge battle!\n🎯 Accuracy: ${acc}\n⚡ Speed: ${speed}\n🔥 Combo ×${combo}\nCome challenge me!`;
    }
    if (locale === "ms") {
      return `🏆 Saya menang perlawanan ilmu!\n🎯 Ketepatan: ${acc}\n⚡ Kelajuan: ${speed}\n🔥 Kombo ×${combo}\nCabar saya!`;
    }
    return `🏆 我刚刚赢下了一场知识对战！\n🎯 正确率：${acc}\n⚡ 答题速度${speed}\n🔥 连击 ×${combo}\n来挑战我！`;
  }
  if (locale === "en") {
    return `⚔️ Close one!\n🎯 Accuracy: ${acc}\n⚡ Speed: ${speed}\nSee you next match!`;
  }
  if (locale === "ms") {
    return `⚔️ Hampir menang!\n🎯 Ketepatan: ${acc}\n⚡ Kelajuan: ${speed}\nJumpa di ronde seterusnya!`;
  }
  return `⚔️ 这局差一点！\n🎯 正确率：${acc}\n⚡ 答题速度${speed}\n下一局再战！`;
}
