import type { Grade, SubjectId } from "./curriculum";
import {
  createEmptyStats,
  gradeFromAge,
  type StudentAccount,
  type SubjectStats,
} from "./account";
import { MOCK_ACCOUNTS } from "./mockData";
import { logLearningActivity } from "./learningLog";

const ACCOUNTS_KEY = "matharena:accounts";
const SESSION_KEY = "matharena:session";
const PREFS_KEY = "matharena:prefs";
const SEEDED_KEY = "matharena:mock-seeded-v1";

export type SessionPrefs = {
  subject: SubjectId;
  locale?: "en" | "zh" | "ms";
};

function canUseStorage(): boolean {
  return typeof window !== "undefined" && typeof window.localStorage !== "undefined";
}

function ensureMockSeed(): void {
  if (!canUseStorage()) return;
  try {
    if (localStorage.getItem(SEEDED_KEY) === "1") return;

    const existing = (() => {
      try {
        const raw = localStorage.getItem(ACCOUNTS_KEY);
        if (!raw) return [] as StudentAccount[];
        return JSON.parse(raw) as StudentAccount[];
      } catch {
        return [] as StudentAccount[];
      }
    })();

    const byUser = new Map(existing.map((a) => [a.username.toLowerCase(), a]));
    for (const mock of MOCK_ACCOUNTS) {
      if (!byUser.has(mock.username.toLowerCase())) {
        byUser.set(mock.username.toLowerCase(), mock);
      }
    }
    localStorage.setItem(ACCOUNTS_KEY, JSON.stringify([...byUser.values()]));
    localStorage.setItem(SEEDED_KEY, "1");
  } catch (e) {
    console.warn("Storage seeding failed", e);
  }
}

function readAccounts(): StudentAccount[] {
  if (!canUseStorage()) return [];
  ensureMockSeed();
  try {
    const raw = localStorage.getItem(ACCOUNTS_KEY);
    if (!raw) return [...MOCK_ACCOUNTS];
    return JSON.parse(raw) as StudentAccount[];
  } catch {
    return [...MOCK_ACCOUNTS];
  }
}

function writeAccounts(list: StudentAccount[]): void {
  if (!canUseStorage()) return;
  try {
    localStorage.setItem(ACCOUNTS_KEY, JSON.stringify(list));
  } catch (e) {
    console.error("Failed to write accounts to storage", e);
  }
}

export function getSessionUsername(): string | null {
  if (!canUseStorage()) return null;
  try {
    return localStorage.getItem(SESSION_KEY);
  } catch {
    return null;
  }
}

export function setSession(username: string | null): void {
  if (!canUseStorage()) return;
  try {
    if (!username) localStorage.removeItem(SESSION_KEY);
    else localStorage.setItem(SESSION_KEY, username);
  } catch {
    /* ignore */
  }
}

export function getCurrentAccount(): StudentAccount | null {
  const username = getSessionUsername();
  if (!username) return null;
  return (
    readAccounts().find((a) => a.username.toLowerCase() === username.toLowerCase()) ?? null
  );
}

export function logout(): void {
  setSession(null);
}

export type SignUpInput = {
  username: string;
  password: string;
  displayName: string;
  age: number;
  school: string;
  state: string;
  contact: string;
};

import { supabase } from "./supabase";

// ... 现有变量 ...

export async function signUp(input: SignUpInput): Promise<{ ok: true; account: StudentAccount } | { ok: false; error: string }> {
  const username = input.username.trim();
  const password = input.password.trim();
  
  // 1. 在 Supabase Auth 注册 (使用 email 格式的模拟或真正 email)
  const email = `${username}@matharena.fake`;
  const { data: authData, error: authError } = await supabase.auth.signUp({
    email,
    password,
  });

  if (authError) return { ok: false, error: authError.message };
  if (!authData.user) return { ok: false, error: "注册失败，请稍后再试" };

  const userId = authData.user.id;
  const now = Date.now();
  
  const account: StudentAccount = {
    id: userId,
    username,
    password, // 仅为了保持本地兼容性
    displayName: input.displayName.trim(),
    age: Number(input.age),
    school: input.school.trim(),
    state: input.state.trim(),
    contact: input.contact.trim(),
    grade: gradeFromAge(Number(input.age)),
    stats: createEmptyStats(),
    createdAt: now,
    updatedAt: now,
  };

  // 2. 将扩展数据写入 profiles 表
  const { error: profileError } = await supabase.from('profiles').insert({
    id: userId,
    username,
    display_name: account.displayName,
    grade: account.grade,
    age: account.age,
    school: account.school,
    state: account.state,
    contact: account.contact
  });

  if (profileError) {
    console.error("Profile sync failed", profileError);
    // 虽然失败了，但 Auth 已成功，我们可以继续
  }

  // 同步本地存储作为备份
  const list = readAccounts();
  list.push(account);
  writeAccounts(list);
  setSession(username);

  return { ok: true, account };
}

export async function signIn(
  username: string,
  password: string,
): Promise<{ ok: true; account: StudentAccount } | { ok: false; error: string }> {
  // 0. 优先检查 Mock 账号
  const list = readAccounts();
  const localAccount = list.find(
    (a) =>
      a.username.toLowerCase() === username.trim().toLowerCase() &&
      a.password === password,
  );

  if (localAccount) {
    setSession(localAccount.username);
    return { ok: true, account: localAccount };
  }

  // 1. Supabase Auth 登录
  const email = `${username}@matharena.fake`;
  const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (authError) return { ok: false, error: "登录名或密码不正确" };
  
  // 2. 获取用户详细资料
  const { data: profile, error: profileError } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', authData.user.id)
    .single();

  if (profileError || !profile) {
    // 降级到本地存储查找
    const list = readAccounts();
    const local = list.find((a) => a.username.toLowerCase() === username.trim().toLowerCase());
    if (local) {
      setSession(local.username);
      return { ok: true, account: local };
    }
    return { ok: false, error: "无法同步用户资料" };
  }

  // 3. 构建 account 对象（包含统计数据，这里可以进一步查询，但先保持基础同步）
  const account: StudentAccount = {
    id: profile.id,
    username: profile.username,
    password: password,
    displayName: profile.display_name,
    age: profile.age,
    school: profile.school,
    state: profile.state,
    contact: profile.contact,
    grade: profile.grade,
    stats: createEmptyStats(), // TODO: 从 subject_stats 表获取
    createdAt: new Date(profile.created_at).getTime(),
    updatedAt: new Date(profile.updated_at).getTime(),
  };

  setSession(account.username);
  return { ok: true, account };
}

export function saveAccount(account: StudentAccount): StudentAccount {
  const list = readAccounts();
  const next = { ...account, updatedAt: Date.now() };
  const idx = list.findIndex((a) => a.id === account.id);
  if (idx >= 0) list[idx] = next;
  else list.push(next);
  writeAccounts(list);
  return next;
}

export function getSubjectStats(account: StudentAccount, subject: SubjectId): SubjectStats {
  return account.stats[subject] ?? { trophies: 0, wins: 0, losses: 0, draws: 0 };
}

export function recordSubjectMatch(
  account: StudentAccount,
  subject: SubjectId,
  result: "win" | "lose" | "draw",
  newTrophies: number,
): StudentAccount {
  const prev = getSubjectStats(account, subject);
  const trophyDelta = Math.max(0, newTrophies) - prev.trophies;
  const stats = {
    ...account.stats,
    [subject]: {
      trophies: Math.max(0, newTrophies),
      wins: prev.wins + (result === "win" ? 1 : 0),
      losses: prev.losses + (result === "lose" ? 1 : 0),
      draws: prev.draws + (result === "draw" ? 1 : 0),
    },
  };
  const next = saveAccount({ ...account, stats });
  logLearningActivity(account.id, subject, {
    challenges: 1,
    xp: result === "win" ? 16 : result === "draw" ? 10 : 6,
    trophy: Math.max(0, trophyDelta),
  });
  return next;
}

export type ProfileEditInput = {
  displayName: string;
  age: number;
  grade: Grade;
  school: string;
  state: string;
  avatar?: string;
};

export function updateStudentProfile(
  account: StudentAccount,
  input: ProfileEditInput,
): StudentAccount {
  const age = Math.max(6, Math.min(18, Math.round(input.age)));
  const grade = ([1, 2, 3, 4, 5, 6].includes(input.grade) ? input.grade : gradeFromAge(age)) as Grade;
  const next = saveAccount({
    ...account,
    displayName: input.displayName.trim() || account.displayName,
    age,
    grade,
    school: input.school.trim() || account.school,
    state: input.state.trim() || account.state,
    avatar: input.avatar?.trim() || account.avatar,
  });

  void supabase
    .from("profiles")
    .update({
      display_name: next.displayName,
      age: next.age,
      grade: next.grade,
      school: next.school,
      state: next.state,
      updated_at: new Date().toISOString(),
    })
    .eq("id", next.id)
    .then(({ error }) => {
      if (error) console.warn("Profile cloud sync skipped", error.message);
    });

  return next;
}

/** Side-mode trophy drip. Does not count as an Arena win/loss. */
export function addSubjectTrophies(
  account: StudentAccount,
  subject: SubjectId,
  delta: number,
): StudentAccount {
  if (delta === 0) return account;
  const prev = getSubjectStats(account, subject);
  const trophies = Math.max(0, prev.trophies + delta);
  return saveAccount({
    ...account,
    stats: {
      ...account.stats,
      [subject]: { ...prev, trophies },
    },
  });
}

export function getLeaderboard(subject?: SubjectId): Array<{
  username: string;
  displayName: string;
  school: string;
  state: string;
  grade: number;
  trophies: number;
  wins: number;
  losses: number;
}> {
  const list = readAccounts();
  if (subject) {
    return list
      .map((a) => {
        const s = getSubjectStats(a, subject);
        return {
          username: a.username,
          displayName: a.displayName,
          school: a.school,
          state: a.state,
          grade: a.grade,
          trophies: s.trophies,
          wins: s.wins,
          losses: s.losses,
        };
      })
      .sort((a, b) => b.trophies - a.trophies || b.wins - a.wins || a.displayName.localeCompare(b.displayName));
  }

  return list
    .map((a) => {
      const trophies = Object.values(a.stats).reduce((sum, s) => sum + s.trophies, 0);
      const wins = Object.values(a.stats).reduce((sum, s) => sum + s.wins, 0);
      const losses = Object.values(a.stats).reduce((sum, s) => sum + s.losses, 0);
      return {
        username: a.username,
        displayName: a.displayName,
        school: a.school,
        state: a.state,
        grade: a.grade,
        trophies,
        wins,
        losses,
      };
    })
    .sort((a, b) => b.trophies - a.trophies || b.wins - a.wins || a.displayName.localeCompare(b.displayName));
}

export function getSelectedSubject(): SubjectId {
  if (!canUseStorage()) return "math";
  try {
    const raw = localStorage.getItem(PREFS_KEY);
    if (!raw) return "math";
    const parsed = JSON.parse(raw) as { subject?: SubjectId; grade?: number };
    const s = parsed.subject;
    if (s === "chinese" || s === "english" || s === "malay" || s === "math" || s === "science") {
      return s;
    }
  } catch {
    /* ignore */
  }
  return "math";
}

export function saveSelectedSubject(subject: SubjectId): void {
  if (!canUseStorage()) return;
  try {
    const account = getCurrentAccount();
    const existing = readPrefs();
    localStorage.setItem(
      PREFS_KEY,
      JSON.stringify({ ...existing, subject, grade: account?.grade ?? 1 }),
    );
  } catch {
    /* ignore */
  }
}

function readPrefs(): SessionPrefs & { grade?: number } {
  if (!canUseStorage()) return { subject: "math" };
  try {
    const raw = localStorage.getItem(PREFS_KEY);
    if (!raw) return { subject: "math" };
    return JSON.parse(raw) as SessionPrefs & { grade?: number };
  } catch {
    return { subject: "math" };
  }
}

export function getLocale(): "en" | "zh" | "ms" {
  const prefs = readPrefs();
  const l = prefs.locale;
  if (l === "en" || l === "zh" || l === "ms") return l;
  return "zh";
}

export function saveLocale(locale: "en" | "zh" | "ms"): void {
  if (!canUseStorage()) return;
  try {
    const existing = readPrefs();
    localStorage.setItem(PREFS_KEY, JSON.stringify({ ...existing, locale }));
  } catch {
    /* ignore */
  }
}

/** @deprecated old nickname API — kept for migration silence */
export type PlayerProfile = StudentAccount;
