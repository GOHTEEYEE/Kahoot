import type { Grade, SubjectId } from "./curriculum";
import { getSubjectWorld, getWorldStage } from "./worlds";

export type Boss = {
  id: string;
  name: string;
  nameEn: string;
  subject: SubjectId;
  gradeRange: [Grade, Grade];
  maxHp: number;
  reward: { gold: number; fragments: number; xp: number };
};

const BOSSES: Record<SubjectId, { name: string; nameEn: string }> = {
  math: { name: "数字巨龙", nameEn: "Number Dragon" },
  science: { name: "火山巨兽", nameEn: "Volcano Beast" },
  english: { name: "Word Wizard", nameEn: "Word Wizard" },
  chinese: { name: "成语妖怪", nameEn: "Chengyu Spirit" },
  malay: { name: "Bahasa Guardian", nameEn: "Bahasa Guardian" },
};

export const BOSS_HEARTS = 5;
export const BOSS_QUESTIONS = 8;
export const BOSS_HIT = 110;
export const BOSS_CRIT = 190;

export function buildBoss(subject: SubjectId, grade: Grade, trophies: number): Boss {
    const stage = getWorldStage(trophies);
  const meta = BOSSES[subject];
  const maxHp = 720 + stage.level * 140 + grade * 36;
  return {
    id: `${subject}-${stage.id}`,
    name: meta.name,
    nameEn: meta.nameEn,
    subject,
    gradeRange: [grade, grade],
    maxHp,
    reward: {
      gold: 40 + stage.level * 12,
      fragments: 4 + stage.level,
      xp: 20 + stage.level * 8,
    },
  };
}

export function bossDamage(correct: boolean, remainingMs: number, questionTimeMs: number): {
  damage: number;
  crit: boolean;
} {
  if (!correct) return { damage: 0, crit: false };
  const crit = remainingMs / questionTimeMs >= 0.62;
  return { damage: crit ? BOSS_CRIT : BOSS_HIT, crit };
}

export function worldLabelForBoss(subject: SubjectId): string {
  return getSubjectWorld(subject).worldName;
}
