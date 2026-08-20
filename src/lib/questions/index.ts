import type { Grade, SubjectId } from "../curriculum";
import { CHINESE_QUESTIONS } from "./chinese";
import { ENGLISH_QUESTIONS } from "./english";
import { GENERAL_QUESTIONS } from "./general";
import { MALAY_QUESTIONS } from "./malay";
import { MATH_QUESTIONS } from "./math";
import { SCIENCE_QUESTIONS } from "./science";
import {
  QUESTIONS_PER_MATCH,
  questionCategory,
  shuffleAll,
  shufflePick,
  type Question,
  type QuestionCategory,
} from "./types";

export type { Question, QuestionCategory } from "./types";
export {
  QUESTIONS_PER_MATCH,
  QUESTION_TIME_MS,
  BASE_SCORE,
  TIME_BONUS_PER_100MS,
  scoreForAnswer,
  questionCategory,
} from "./types";

export const ALL_QUESTIONS: Question[] = [
  ...MATH_QUESTIONS,
  ...CHINESE_QUESTIONS,
  ...ENGLISH_QUESTIONS,
  ...MALAY_QUESTIONS,
  ...SCIENCE_QUESTIONS,
];

export function getQuestions(grade: Grade, subject: SubjectId): Question[] {
  return ALL_QUESTIONS.filter((item) => item.grade === grade && item.subject === subject);
}

export function pickMatchQuestions(
  grade: Grade,
  subject: SubjectId,
  count = QUESTIONS_PER_MATCH,
): Question[] {
  const pool = getQuestions(grade, subject);
  if (pool.length === 0) {
    return shufflePick(
      ALL_QUESTIONS.filter((item) => item.subject === subject),
      count,
    );
  }
  return shufflePick(pool, count);
}

export function pickByCategory(
  grade: Grade,
  category: QuestionCategory,
  count: number,
): Question[] {
  const bank = category === "general" ? GENERAL_QUESTIONS : ALL_QUESTIONS;
  const exact = bank.filter(
    (item) => item.grade === grade && questionCategory(item) === category,
  );
  if (exact.length >= count) return shufflePick(exact, count);
  const nearby = bank.filter((item) => questionCategory(item) === category);
  return shufflePick(nearby, count);
}

/** Mixed pool for Knowledge Rush — all subjects + general knowledge. */
export function pickRushQuestions(grade: Grade, count = 40): Question[] {
  const nearby: Question[] = [];
  for (const item of [...ALL_QUESTIONS, ...GENERAL_QUESTIONS]) {
    if (Math.abs(item.grade - grade) <= 1) nearby.push(item);
  }
  const pool = nearby.length > 0 ? nearby : [...ALL_QUESTIONS, ...GENERAL_QUESTIONS];
  return shuffleAll(pool).slice(0, Math.max(count, 8));
}

/** @deprecated use pickMatchQuestions(grade, subject) */
export const QUESTIONS = MATH_QUESTIONS;
