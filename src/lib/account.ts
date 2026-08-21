import type { Grade, SubjectId } from "./curriculum";
import { SUBJECTS } from "./curriculum";

/** Malaysia primary: age 7 ≈ Year 1 … age 12 ≈ Year 6 */
export function gradeFromAge(age: number): Grade {
  const raw = Math.round(age) - 6;
  if (raw <= 1) return 1;
  if (raw >= 6) return 6;
  return raw as Grade;
}

export const MALAYSIA_STATES = [
  "Johor",
  "Kedah",
  "Kelantan",
  "Melaka",
  "Negeri Sembilan",
  "Pahang",
  "Perak",
  "Perlis",
  "Pulau Pinang",
  "Sabah",
  "Sarawak",
  "Selangor",
  "Terengganu",
  "W.P. Kuala Lumpur",
  "W.P. Labuan",
  "W.P. Putrajaya",
] as const;

export type MalaysiaState = (typeof MALAYSIA_STATES)[number];

export type SubjectStats = {
  trophies: number;
  wins: number;
  losses: number;
  draws: number;
};

export type StudentAccount = {
  id: string;
  /** Login name (unique) */
  username: string;
  password: string;
  displayName: string;
  age: number;
  school: string;
  state: string;
  contact: string;
  /** Primary grade band (editable on profile) */
  grade: Grade;
  /** Profile avatar image path */
  avatar?: string;
  stats: Record<SubjectId, SubjectStats>;
  createdAt: number;
  updatedAt: number;
};

export function emptySubjectStats(): SubjectStats {
  return { trophies: 0, wins: 0, losses: 0, draws: 0 };
}

export function createEmptyStats(): Record<SubjectId, SubjectStats> {
  return SUBJECTS.reduce(
    (acc, s) => {
      acc[s.id] = emptySubjectStats();
      return acc;
    },
    {} as Record<SubjectId, SubjectStats>,
  );
}

export function totalTrophies(account: StudentAccount): number {
  return SUBJECTS.reduce((sum, s) => sum + (account.stats[s.id]?.trophies ?? 0), 0);
}
