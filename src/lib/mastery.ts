import type { StudentAccount, SubjectStats } from "./account";
import type { SubjectId } from "./curriculum";
import { SUBJECTS } from "./curriculum";

export type MasterySubject = {
  id: SubjectId;
  name: string;
  compact: string;
  hud: string;
  accent: string;
};

/** Display order around the pentagon, clockwise from the top. */
export const MASTERY_SUBJECTS: MasterySubject[] = [
  { id: "chinese", name: "Chinese", compact: "Chinese", hud: "华文", accent: "#b85c38" },
  { id: "english", name: "English", compact: "English", hud: "英文", accent: "#4a7fd4" },
  { id: "malay", name: "Bahasa Melayu", compact: "Bahasa", hud: "马来文", accent: "#2f9e6e" },
  { id: "math", name: "Mathematics", compact: "Math", hud: "数学", accent: "#e0a21a" },
  { id: "science", name: "Science", compact: "Science", hud: "科学", accent: "#6a63d8" },
];

function clamp(n: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, n));
}

/**
 * Learning mastery 0–100 from match results.
 * Not trophies: win quality + how much the student has actually practiced.
 */
export function subjectMastery(stats: SubjectStats | undefined): number {
  if (!stats) return 0;
  const games = stats.wins + stats.losses + stats.draws;
  if (games <= 0) return 0;
  const winShare = (stats.wins + stats.draws * 0.4) / games;
  const practice = 1 - Math.exp(-games / 10);
  return Math.round(clamp(winShare * 72 + practice * 28, 0, 100));
}

export function subjectMasteryMap(account: StudentAccount): Record<SubjectId, number> {
  return SUBJECTS.reduce(
    (acc, s) => {
      acc[s.id] = subjectMastery(account.stats[s.id]);
      return acc;
    },
    {} as Record<SubjectId, number>,
  );
}

export function overallMastery(values: Record<SubjectId, number>): number {
  const sum = SUBJECTS.reduce((n, s) => n + (values[s.id] ?? 0), 0);
  return Math.round(sum / SUBJECTS.length);
}
