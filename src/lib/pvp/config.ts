/** Tunable knowledge-battle combat numbers. */

export const PVP_QUESTIONS = 10;
export const PVP_MAX_HP = 1000;
export const PVP_BASE_DAMAGE = 50;
export const PVP_QUESTION_CAP_MS = 12_000;
export const PVP_FREEZE_MS = 3_000;
export const PVP_HASTE_SHAVE_SEC = 2;
export const PVP_ATTACK_MS = 720;
/** Fallback wall-clock cues if the attack clip does not report time. */
export const PVP_PLAYER_SWING_MS = 500;
export const PVP_PLAYER_IMPACT_MS = 920;
export const PVP_PLAYER_ATTACK_MS = 1920;
export const PVP_RESOLVE_GAP_MS = 650;
export const PVP_LOW_HP = 0.3;

export const SPEED_BONUS_TABLE = [
  { maxSec: 2, bonus: 50 },
  { maxSec: 3, bonus: 35 },
  { maxSec: 5, bonus: 20 },
  { maxSec: 8, bonus: 10 },
] as const;

export const COMBO_MULT_TABLE = [
  { minCombo: 1, multiplier: 1.0 },
  { minCombo: 2, multiplier: 1.1 },
  { minCombo: 3, multiplier: 1.2 },
  { minCombo: 4, multiplier: 1.3 },
  { minCombo: 5, multiplier: 1.4 },
] as const;

export const ITEM_LIMITS = {
  scout: 1,
  freeze: 1,
  haste: 1,
  shield: 1,
} as const;

export function speedBonus(elapsedSec: number): number {
  const t = Math.max(0, elapsedSec);
  for (const row of SPEED_BONUS_TABLE) {
    if (t <= row.maxSec) return row.bonus;
  }
  return 0;
}

/** Combo of 1 after the first correct answer uses 1.0x. */
export function comboMultiplier(combo: number): number {
  if (combo <= 0) return 1;
  let mult = 1;
  for (const row of COMBO_MULT_TABLE) {
    if (combo >= row.minCombo) mult = row.multiplier;
  }
  return mult;
}

export function comboBonusPct(combo: number): number {
  return Math.round((comboMultiplier(combo) - 1) * 100);
}

export type AttackCalcInput = {
  correct: boolean;
  elapsedSec: number;
  comboBefore: number;
  haste?: boolean;
};

export type AttackCalcResult = {
  damage: number;
  combo: number;
  broke: boolean;
  multiplier: number;
  speedBonus: number;
};

/** Correctness first: wrong answers always deal 0, regardless of speed. */
export function calcAttackPower(input: AttackCalcInput): AttackCalcResult {
  if (!input.correct) {
    return { damage: 0, combo: 0, broke: true, multiplier: 1, speedBonus: 0 };
  }
  const combo = input.comboBefore + 1;
  const elapsed = input.haste
    ? Math.max(0, input.elapsedSec - PVP_HASTE_SHAVE_SEC)
    : input.elapsedSec;
  const bonus = speedBonus(elapsed);
  const multiplier = comboMultiplier(combo);
  const damage = Math.round((PVP_BASE_DAMAGE + bonus) * multiplier);
  return { damage, combo, broke: false, multiplier, speedBonus: bonus };
}
