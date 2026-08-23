import { getCurrentAccount } from "../storage";
import { speedLeadSeconds, type PvpMatchResult, type PvpOutcome, type PvpQuestionResult } from "./matchResult";
import type { SubjectId } from "../curriculum";

export type BattleLogFighter = {
  name: string;
  avatar: string;
  emoji: string;
  correctAnswers: number;
  totalQuestions: number;
  accuracy: number;
  averageAnswerTime: number;
  finalHp: number;
  maxHp: number;
};

export type BattleLogEntry = {
  id: string;
  timestamp: number;
  subject: SubjectId;
  level: number;
  player: BattleLogFighter;
  opponent: BattleLogFighter;
  result: PvpOutcome;
  trophyChange: number;
  xpChange: number;
  knowledgeShield: number;
  speedLead: number;
  questions: PvpQuestionResult[];
};

const LOG_KEY_PREFIX = "matharena:pvp-battle-log:";
const SEEN_KEY_PREFIX = "matharena:pvp-battle-log-seen:";
export const BATTLE_LOG_EVENT = "matharena:battle-log";
const MAX_ENTRIES = 80;

function accountKey(): string {
  return getCurrentAccount()?.id ?? "guest";
}

function logKey(accountId = accountKey()): string {
  return `${LOG_KEY_PREFIX}${accountId}`;
}

function seenKey(accountId = accountKey()): string {
  return `${SEEN_KEY_PREFIX}${accountId}`;
}

function canUseStorage(): boolean {
  return typeof window !== "undefined" && typeof window.localStorage !== "undefined";
}

function notify(): void {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new Event(BATTLE_LOG_EVENT));
}

function fighterFrom(result: PvpMatchResult, side: "player" | "opponent"): BattleLogFighter {
  const src = result[side];
  return {
    name: src.name,
    avatar: src.avatar,
    emoji: src.heroEmoji,
    correctAnswers: src.correctAnswers,
    totalQuestions: src.totalQuestions,
    accuracy: src.accuracy,
    averageAnswerTime: src.averageAnswerTime,
    finalHp: src.hp,
    maxHp: src.maxHp,
  };
}

export function battleLogFromMatch(result: PvpMatchResult): BattleLogEntry {
  return {
    id: result.matchId,
    timestamp: result.timestamp,
    subject: result.subject,
    level: result.level ?? 1,
    player: fighterFrom(result, "player"),
    opponent: fighterFrom(result, "opponent"),
    result: result.result,
    trophyChange: result.rewards.trophy,
    xpChange: result.rewards.xp,
    knowledgeShield: result.rewards.knowledgeShield,
    speedLead: speedLeadSeconds(result),
    questions: result.questions ?? [],
  };
}

export function loadBattleLog(): BattleLogEntry[] {
  if (!canUseStorage()) return [];
  try {
    const raw = window.localStorage.getItem(logKey());
    if (!raw) return [];
    const parsed = JSON.parse(raw) as unknown;
    if (!Array.isArray(parsed)) return [];
    return parsed
      .filter((row): row is BattleLogEntry => Boolean(row && typeof row === "object" && typeof (row as BattleLogEntry).id === "string"))
      .sort((a, b) => b.timestamp - a.timestamp);
  } catch {
    return [];
  }
}

function saveBattleLog(entries: BattleLogEntry[]): void {
  if (!canUseStorage()) return;
  try {
    window.localStorage.setItem(logKey(), JSON.stringify(entries.slice(0, MAX_ENTRIES)));
  } catch {
    /* ignore quota */
  }
}

export function recordBattleLog(result: PvpMatchResult): BattleLogEntry {
  const entry = battleLogFromMatch(result);
  const existing = loadBattleLog();
  if (existing.some((row) => row.id === entry.id)) return entry;
  saveBattleLog([entry, ...existing]);
  notify();
  return entry;
}

export function getBattleLogUnseenCount(): number {
  if (!canUseStorage()) return 0;
  try {
    const seenRaw = window.localStorage.getItem(seenKey());
    const seenAt = seenRaw ? Number(seenRaw) : 0;
    const cutoff = Number.isFinite(seenAt) ? seenAt : 0;
    return loadBattleLog().filter((row) => row.timestamp > cutoff).length;
  } catch {
    return 0;
  }
}

export function markBattleLogSeen(): void {
  if (!canUseStorage()) return;
  try {
    window.localStorage.setItem(seenKey(), String(Date.now()));
    notify();
  } catch {
    /* ignore */
  }
}
