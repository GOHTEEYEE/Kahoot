import type { SubjectId } from "./curriculum";
import { SUBJECTS } from "./curriculum";
import type { StudentAccount } from "./account";
import { getMockEconomy } from "./worlds";
import { logLearningActivity } from "./learningLog";

export type RewardGrant = {
  gold: number;
  gems?: number;
  fragments: number;
  xp: number;
  trophy?: number;
};

export type Wallet = {
  coins: number;
  gems: number;
  xp: number;
  fragments: Record<SubjectId, number>;
};

function walletKey(accountId: string): string {
  return `matharena:wallet:${accountId}`;
}

function emptyFragments(): Record<SubjectId, number> {
  return SUBJECTS.reduce(
    (acc, s) => {
      acc[s.id] = 0;
      return acc;
    },
    {} as Record<SubjectId, number>,
  );
}

function canUseStorage(): boolean {
  return typeof window !== "undefined" && typeof window.localStorage !== "undefined";
}

export function seedWallet(account: StudentAccount): Wallet {
  const mock = getMockEconomy(account);
  // Align wallet XP with mock level bands (250 XP per level).
  const xp = Math.max(0, (mock.xpLevel - 1) * 250 + Math.round((mock.xpProgress / 50) * 250));
  return {
    coins: mock.coins,
    gems: mock.gems,
    xp,
    fragments: emptyFragments(),
  };
}

export function readWallet(account: StudentAccount): Wallet {
  if (!canUseStorage()) return seedWallet(account);
  try {
    const raw = localStorage.getItem(walletKey(account.id));
    if (!raw) {
      const seeded = seedWallet(account);
      localStorage.setItem(walletKey(account.id), JSON.stringify(seeded));
      return seeded;
    }
    const parsed = JSON.parse(raw) as Partial<Wallet>;
    return {
      coins: parsed.coins ?? 0,
      gems: parsed.gems ?? 0,
      xp: parsed.xp ?? 0,
      fragments: { ...emptyFragments(), ...parsed.fragments },
    };
  } catch {
    return seedWallet(account);
  }
}

export function saveWallet(accountId: string, wallet: Wallet): Wallet {
  if (canUseStorage()) {
    localStorage.setItem(walletKey(accountId), JSON.stringify(wallet));
  }
  return wallet;
}

export function grantRewards(
  account: StudentAccount,
  subject: SubjectId,
  grant: RewardGrant,
): Wallet {
  const wallet = readWallet(account);
  const next: Wallet = {
    coins: wallet.coins + Math.max(0, grant.gold),
    gems: wallet.gems + Math.max(0, grant.gems ?? 0),
    xp: wallet.xp + Math.max(0, grant.xp),
    fragments: {
      ...wallet.fragments,
      [subject]: (wallet.fragments[subject] ?? 0) + Math.max(0, grant.fragments),
    },
  };
  const saved = saveWallet(account.id, next);
  logLearningActivity(account.id, subject, {
    challenges: 1,
    xp: Math.max(0, grant.xp),
    trophy: Math.max(0, grant.trophy ?? 0),
  });
  return saved;
}
