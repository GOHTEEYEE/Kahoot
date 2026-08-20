import type { Grade, SubjectId } from "../curriculum";

export type QuestionCategory = SubjectId | "general";

export type Question = {
  id: string;
  grade: Grade;
  subject: SubjectId;
  prompt: string;
  options: [string, string, string, string];
  correctIndex: 0 | 1 | 2 | 3;
  category?: QuestionCategory;
};

export function q(
  id: string,
  grade: Grade,
  subject: SubjectId,
  prompt: string,
  options: [string, string, string, string],
  correctIndex: 0 | 1 | 2 | 3,
  category?: QuestionCategory,
): Question {
  return {
    id,
    grade,
    subject,
    prompt,
    options,
    correctIndex,
    category: category ?? subject,
  };
}

export function questionCategory(question: Question): QuestionCategory {
  return question.category ?? question.subject;
}

export const QUESTIONS_PER_MATCH = 5;
export const QUESTION_TIME_MS = 10_000;
export const BASE_SCORE = 100;
export const TIME_BONUS_PER_100MS = 1;

export function scoreForAnswer(correct: boolean, remainingMs: number): number {
  if (!correct) return 0;
  const clamped = Math.max(0, Math.min(QUESTION_TIME_MS, remainingMs));
  return BASE_SCORE + Math.floor(clamped / 100) * TIME_BONUS_PER_100MS;
}

export function shufflePick<T>(items: T[], count: number): T[] {
  const pool = [...items];
  for (let i = pool.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [pool[i], pool[j]] = [pool[j], pool[i]];
  }
  return pool.slice(0, Math.min(count, pool.length));
}

export function shuffleAll<T>(items: T[]): T[] {
  return shufflePick(items, items.length);
}

