import type { StudentAccount } from "./account";
import type { SubjectId } from "./curriculum";
import { SUBJECTS } from "./curriculum";

export type LearningEntry = {
  date: string; // YYYY-MM-DD
  subject: SubjectId;
  challenges: number;
  xp: number;
  trophy: number;
};

export type DayActivity = {
  date: string;
  weekday: number; // 0=Mon … 6=Sun (display order)
  label: string;
  completed: boolean;
  challenges: number;
  xp: number;
  trophy: number;
  bySubject: Partial<Record<SubjectId, number>>;
};

const WEEK_LABELS = ["一", "二", "三", "四", "五", "六", "日"] as const;

function canUseStorage(): boolean {
  return typeof window !== "undefined" && typeof window.localStorage !== "undefined";
}

function logKey(accountId: string): string {
  return `matharena:learning-log:${accountId}`;
}

function todayKey(d = new Date()): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

function parseDateKey(key: string): Date {
  const [y, m, d] = key.split("-").map(Number);
  return new Date(y, m - 1, d);
}

function addDays(key: string, delta: number): string {
  const d = parseDateKey(key);
  d.setDate(d.getDate() + delta);
  return todayKey(d);
}

function mondayOfWeek(ref = new Date()): string {
  const d = new Date(ref.getFullYear(), ref.getMonth(), ref.getDate());
  const day = d.getDay(); // 0 Sun
  const offset = day === 0 ? -6 : 1 - day;
  d.setDate(d.getDate() + offset);
  return todayKey(d);
}

function totalGames(account: StudentAccount): number {
  return SUBJECTS.reduce((sum, s) => {
    const st = account.stats[s.id];
    return sum + (st?.wins ?? 0) + (st?.losses ?? 0) + (st?.draws ?? 0);
  }, 0);
}

function readRaw(accountId: string): LearningEntry[] {
  if (!canUseStorage()) return [];
  try {
    const raw = localStorage.getItem(logKey(accountId));
    if (!raw) return [];
    const parsed = JSON.parse(raw) as LearningEntry[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function writeRaw(accountId: string, entries: LearningEntry[]): void {
  if (!canUseStorage()) return;
  try {
    localStorage.setItem(logKey(accountId), JSON.stringify(entries));
  } catch {
    /* ignore */
  }
}

/**
 * When the student already has match history but no dated log,
 * backfill recent days from totals so streak/calendar stay meaningful.
 */
function ensureBootstrapped(accountId: string, account: StudentAccount): LearningEntry[] {
  const existing = readRaw(accountId);
  if (existing.length > 0) return existing;

  const games = totalGames(account);
  if (games <= 0) return [];

  const days = Math.min(14, Math.max(1, Math.ceil(games / 3)));
  const perDay = Math.max(1, Math.floor(games / days));
  const entries: LearningEntry[] = [];
  let remaining = games;
  const subjects = SUBJECTS.map((s) => s.id);

  for (let i = days - 1; i >= 0; i--) {
    const date = addDays(todayKey(), -i);
    const chunk = i === 0 ? remaining : Math.min(remaining, perDay);
    remaining -= chunk;
    if (chunk <= 0) continue;
    const subject = subjects[(days - i) % subjects.length]!;
    const trophiesShare = Math.max(
      0,
      Math.round((account.stats[subject]?.trophies ?? 0) / Math.max(1, days)),
    );
    entries.push({
      date,
      subject,
      challenges: chunk,
      xp: chunk * 8,
      trophy: Math.min(trophiesShare, chunk * 2),
    });
  }

  writeRaw(accountId, entries);
  return entries;
}

export function getLearningEntries(accountId: string, account?: StudentAccount): LearningEntry[] {
  if (account) return ensureBootstrapped(accountId, account);
  return readRaw(accountId);
}

export function logLearningActivity(
  accountId: string,
  subject: SubjectId,
  grant: { challenges?: number; xp?: number; trophy?: number },
): void {
  const entries = readRaw(accountId);
  const date = todayKey();
  entries.push({
    date,
    subject,
    challenges: Math.max(1, grant.challenges ?? 1),
    xp: Math.max(0, grant.xp ?? 0),
    trophy: Math.max(0, grant.trophy ?? 0),
  });
  writeRaw(accountId, entries);
}

function aggregateDay(date: string, entries: LearningEntry[]): Omit<DayActivity, "weekday" | "label"> {
  const dayEntries = entries.filter((e) => e.date === date);
  const bySubject: Partial<Record<SubjectId, number>> = {};
  let challenges = 0;
  let xp = 0;
  let trophy = 0;
  for (const e of dayEntries) {
    challenges += e.challenges;
    xp += e.xp;
    trophy += e.trophy;
    bySubject[e.subject] = (bySubject[e.subject] ?? 0) + e.challenges;
  }
  return {
    date,
    completed: challenges > 0,
    challenges,
    xp,
    trophy,
    bySubject,
  };
}

export function getWeekActivity(accountId: string, account?: StudentAccount): DayActivity[] {
  const entries = getLearningEntries(accountId, account);
  const monday = mondayOfWeek();
  return WEEK_LABELS.map((label, i) => {
    const date = addDays(monday, i);
    return {
      ...aggregateDay(date, entries),
      weekday: i,
      label,
    };
  });
}

export function getDayActivity(
  accountId: string,
  date: string,
  account?: StudentAccount,
): DayActivity {
  const entries = getLearningEntries(accountId, account);
  const d = parseDateKey(date);
  const jsDay = d.getDay();
  const weekday = jsDay === 0 ? 6 : jsDay - 1;
  return {
    ...aggregateDay(date, entries),
    weekday,
    label: WEEK_LABELS[weekday] ?? "",
  };
}

export function getLearningStreak(
  accountId: string,
  account?: StudentAccount,
): { current: number; longest: number } {
  const entries = getLearningEntries(accountId, account);
  const active = new Set(entries.filter((e) => e.challenges > 0).map((e) => e.date));
  if (active.size === 0) return { current: 0, longest: 0 };

  let longest = 0;
  let run = 0;
  const sorted = [...active].sort();
  let prev: string | null = null;
  for (const date of sorted) {
    if (prev && addDays(prev, 1) === date) run += 1;
    else run = 1;
    longest = Math.max(longest, run);
    prev = date;
  }

  let current = 0;
  let cursor = todayKey();
  if (!active.has(cursor)) {
    cursor = addDays(cursor, -1);
  }
  while (active.has(cursor)) {
    current += 1;
    cursor = addDays(cursor, -1);
  }

  return { current, longest: Math.max(longest, current) };
}

export function getWeeklyChallengeCount(accountId: string, account?: StudentAccount): number {
  return getWeekActivity(accountId, account).reduce((sum, d) => sum + d.challenges, 0);
}
