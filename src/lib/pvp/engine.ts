import type { Question } from "../questions";
import { calcAttackPower } from "./config";
import { ITEM_LIMITS, PVP_MAX_HP, PVP_QUESTIONS } from "./config";
import type { ItemId } from "./items";
import type {
  AnswerHistoryItem,
  AttackEvent,
  BattleState,
  FighterId,
  FighterState,
  KnowledgeMatch,
} from "./types";

function clamp(n: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, n));
}

export function createFighter(init: {
  id: string;
  name: string;
  avatar: string;
  heroEmoji: string;
  heroName: string;
  level: number;
  comboProtected?: boolean;
}): FighterState {
  return {
    id: init.id,
    name: init.name,
    avatar: init.avatar,
    heroEmoji: init.heroEmoji,
    heroName: init.heroName,
    level: init.level,
    hp: PVP_MAX_HP,
    maxHp: PVP_MAX_HP,
    currentCombo: 0,
    maxCombo: 0,
    correctCount: 0,
    answeredCount: 0,
    accuracy: 0,
    totalAnswerMs: 0,
    averageAnswerTime: 0,
    currentAttackPower: 0,
    answered: false,
    answerTime: null,
    choice: null,
    lastDamage: 0,
    comboProtected: Boolean(init.comboProtected),
  };
}

export function createBattleState(total = PVP_QUESTIONS): BattleState {
  return {
    currentQuestion: 0,
    totalQuestions: total,
    questionStartTime: 0,
    playerScore: 0,
    opponentScore: 0,
    battleStatus: "match",
    currentAttacker: null,
    attackEvents: [],
    answerHistory: [],
    elapsedMs: 0,
    revealedWrong: [],
    freezeUntil: null,
    hasteArmed: false,
    playerEmote: null,
    opponentEmote: null,
    opponentStatus: "thinking",
    itemsUsed: { scout: 0, freeze: 0, haste: 0, shield: 0 },
    comboBreakFlash: false,
  };
}

export function createMatch(player: FighterState, opponent: FighterState, questions: Question[]): KnowledgeMatch {
  return {
    player,
    opponent,
    questions,
    battle: createBattleState(questions.length),
  };
}

function other(who: FighterId): FighterId {
  return who === "player" ? "opponent" : "player";
}

function recordAnswerStats(fighter: FighterState, elapsedMs: number, correct: boolean): FighterState {
  const answeredCount = fighter.answeredCount + 1;
  const correctCount = fighter.correctCount + (correct ? 1 : 0);
  const totalAnswerMs = fighter.totalAnswerMs + elapsedMs;
  return {
    ...fighter,
    answeredCount,
    correctCount,
    totalAnswerMs,
    accuracy: correctCount / answeredCount,
    averageAnswerTime: totalAnswerMs / answeredCount / 1000,
  };
}

function applyCombo(fighter: FighterState, correct: boolean): FighterState {
  if (correct) {
    const combo = fighter.currentCombo + 1;
    return {
      ...fighter,
      currentCombo: combo,
      maxCombo: Math.max(fighter.maxCombo, combo),
      comboProtected: false,
    };
  }
  if (fighter.comboProtected) {
    return { ...fighter, comboProtected: false };
  }
  return { ...fighter, currentCombo: 0 };
}

function patchHistory(
  history: AnswerHistoryItem[],
  index: number,
  who: FighterId,
  patch: Partial<AnswerHistoryItem>,
): AnswerHistoryItem[] {
  const next = [...history];
  const existing = next[index] ?? {
    questionIndex: index,
    playerCorrect: null,
    opponentCorrect: null,
    playerDamage: 0,
    opponentDamage: 0,
    playerMs: null,
    opponentMs: null,
  };
  next[index] = { ...existing, ...patch };
  if (who === "player") {
    if (patch.playerCorrect !== undefined) next[index].playerCorrect = patch.playerCorrect;
    if (patch.playerDamage !== undefined) next[index].playerDamage = patch.playerDamage;
    if (patch.playerMs !== undefined) next[index].playerMs = patch.playerMs;
  } else {
    if (patch.opponentCorrect !== undefined) next[index].opponentCorrect = patch.opponentCorrect;
    if (patch.opponentDamage !== undefined) next[index].opponentDamage = patch.opponentDamage;
    if (patch.opponentMs !== undefined) next[index].opponentMs = patch.opponentMs;
  }
  return next;
}

export type ResolveAnswerResult = {
  match: KnowledgeMatch;
  event: AttackEvent;
  comboBroke: boolean;
};

export function resolveAnswer(
  match: KnowledgeMatch,
  who: FighterId,
  choice: number | null,
  elapsedMs: number,
): ResolveAnswerResult | null {
  const fighter = match[who];
  if (fighter.answered || match.battle.battleStatus === "ended") return null;

  const question = match.questions[match.battle.currentQuestion];
  if (!question) return null;

  const correct = choice !== null && choice === question.correctIndex;
  const haste = who === "player" && match.battle.hasteArmed;
  const calc = calcAttackPower({
    correct,
    elapsedSec: elapsedMs / 1000,
    comboBefore: fighter.comboProtected && !correct ? fighter.currentCombo : fighter.currentCombo,
    haste: haste && correct,
  });

  let nextFighter = applyCombo(recordAnswerStats(fighter, elapsedMs, correct), correct);
  if (!correct && fighter.comboProtected) {
    nextFighter = { ...nextFighter, currentCombo: fighter.currentCombo, comboProtected: false };
  }
  nextFighter = {
    ...nextFighter,
    answered: true,
    answerTime: elapsedMs,
    choice,
    lastDamage: calc.damage,
    currentAttackPower: calc.damage,
    currentCombo: correct ? calc.combo : nextFighter.currentCombo,
    maxCombo: Math.max(nextFighter.maxCombo, correct ? calc.combo : nextFighter.currentCombo),
  };

  const event: AttackEvent = {
    id: `${who}-${match.battle.currentQuestion}-${elapsedMs}`,
    from: who,
    to: other(who),
    damage: calc.damage,
    combo: nextFighter.currentCombo,
    correct,
    power: correct && calc.combo >= 5,
    questionIndex: match.battle.currentQuestion,
  };

  const historyPatch =
    who === "player"
      ? { playerCorrect: correct, playerDamage: calc.damage, playerMs: elapsedMs }
      : { opponentCorrect: correct, opponentDamage: calc.damage, opponentMs: elapsedMs };

  const battle: BattleState = {
    ...match.battle,
    hasteArmed: who === "player" ? false : match.battle.hasteArmed,
    comboBreakFlash: who === "player" && calc.broke && fighter.currentCombo > 0 && !fighter.comboProtected,
    opponentStatus:
      who === "opponent" ? (correct ? "correct" : "wrong") : match.battle.opponentStatus,
    answerHistory: patchHistory(match.battle.answerHistory, match.battle.currentQuestion, who, historyPatch),
    playerScore: match.battle.playerScore + (who === "player" ? calc.damage : 0),
    opponentScore: match.battle.opponentScore + (who === "opponent" ? calc.damage : 0),
  };

  return {
    comboBroke: calc.broke && fighter.currentCombo > 0 && !fighter.comboProtected,
    event,
    match: {
      ...match,
      [who]: nextFighter,
      battle,
    },
  };
}

export function applyDamage(match: KnowledgeMatch, event: AttackEvent): KnowledgeMatch {
  if (event.damage <= 0) return match;
  const target = match[event.to];
  const hp = clamp(target.hp - event.damage, 0, target.maxHp);
  return {
    ...match,
    [event.to]: { ...target, hp },
  };
}

export function bothAnswered(match: KnowledgeMatch): boolean {
  return match.player.answered && match.opponent.answered;
}

export function resetForNextQuestion(match: KnowledgeMatch, nextIndex: number, now: number): KnowledgeMatch {
  return {
    ...match,
    player: {
      ...match.player,
      answered: false,
      answerTime: null,
      choice: null,
      lastDamage: 0,
    },
    opponent: {
      ...match.opponent,
      answered: false,
      answerTime: null,
      choice: null,
      lastDamage: 0,
    },
    battle: {
      ...match.battle,
      currentQuestion: nextIndex,
      questionStartTime: now,
      elapsedMs: 0,
      revealedWrong: [],
      freezeUntil: null,
      opponentStatus: "thinking",
      comboBreakFlash: false,
      battleStatus: "question",
      currentAttacker: null,
    },
  };
}

export function canUseItem(match: KnowledgeMatch, item: ItemId): boolean {
  return match.battle.itemsUsed[item] < ITEM_LIMITS[item];
}

export function useScout(match: KnowledgeMatch): KnowledgeMatch | null {
  if (!canUseItem(match, "scout")) return null;
  const question = match.questions[match.battle.currentQuestion];
  if (!question) return null;
  const wrong = [0, 1, 2, 3].filter(
    (i) => i !== question.correctIndex && !match.battle.revealedWrong.includes(i),
  );
  if (wrong.length === 0) return null;
  const pick = wrong[Math.floor(Math.random() * wrong.length)];
  return {
    ...match,
    battle: {
      ...match.battle,
      revealedWrong: [...match.battle.revealedWrong, pick],
      itemsUsed: { ...match.battle.itemsUsed, scout: match.battle.itemsUsed.scout + 1 },
    },
  };
}

export function useHaste(match: KnowledgeMatch): KnowledgeMatch | null {
  if (!canUseItem(match, "haste") || match.battle.hasteArmed) return null;
  return {
    ...match,
    battle: {
      ...match.battle,
      hasteArmed: true,
      itemsUsed: { ...match.battle.itemsUsed, haste: match.battle.itemsUsed.haste + 1 },
    },
  };
}

export function useShield(match: KnowledgeMatch): KnowledgeMatch | null {
  if (!canUseItem(match, "shield") || match.player.comboProtected) return null;
  return {
    ...match,
    player: { ...match.player, comboProtected: true },
    battle: {
      ...match.battle,
      itemsUsed: { ...match.battle.itemsUsed, shield: match.battle.itemsUsed.shield + 1 },
    },
  };
}

export function markFreezeUsed(match: KnowledgeMatch): KnowledgeMatch | null {
  if (!canUseItem(match, "freeze")) return null;
  return {
    ...match,
    battle: {
      ...match.battle,
      freezeUntil: match.battle.elapsedMs + 3000,
      itemsUsed: { ...match.battle.itemsUsed, freeze: match.battle.itemsUsed.freeze + 1 },
    },
  };
}

export function winnerOf(match: KnowledgeMatch): "player" | "opponent" | "draw" {
  if (match.player.hp > match.opponent.hp) return "player";
  if (match.opponent.hp > match.player.hp) return "opponent";
  if (match.battle.playerScore > match.battle.opponentScore) return "player";
  if (match.battle.opponentScore > match.battle.playerScore) return "opponent";
  return "draw";
}
