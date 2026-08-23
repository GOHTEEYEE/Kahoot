import type { Question } from "../questions";
import type { ItemId } from "./items";

export type FighterId = "player" | "opponent";

export type BattleStatus =
  | "match"
  | "countdown"
  | "question"
  | "attacking"
  | "ended";

export type OpponentStatus = "thinking" | "answered" | "correct" | "wrong" | "attacking";

export type EmoteId = "cheer" | "fast" | "nice" | "wow" | "coming" | "think";

export type FighterState = {
  id: string;
  name: string;
  avatar: string;
  heroEmoji: string;
  heroName: string;
  level: number;
  hp: number;
  maxHp: number;
  currentCombo: number;
  maxCombo: number;
  correctCount: number;
  answeredCount: number;
  accuracy: number;
  totalAnswerMs: number;
  averageAnswerTime: number;
  currentAttackPower: number;
  answered: boolean;
  answerTime: number | null;
  choice: number | null;
  lastDamage: number;
  comboProtected: boolean;
};

export type AttackEvent = {
  id: string;
  from: FighterId;
  to: FighterId;
  damage: number;
  combo: number;
  correct: boolean;
  power: boolean;
  questionIndex: number;
};

export type AnswerHistoryItem = {
  questionIndex: number;
  playerCorrect: boolean | null;
  opponentCorrect: boolean | null;
  playerDamage: number;
  opponentDamage: number;
  playerMs: number | null;
  opponentMs: number | null;
};

export type BattleState = {
  currentQuestion: number;
  totalQuestions: number;
  questionStartTime: number;
  playerScore: number;
  opponentScore: number;
  battleStatus: BattleStatus;
  currentAttacker: FighterId | null;
  attackEvents: AttackEvent[];
  answerHistory: AnswerHistoryItem[];
  elapsedMs: number;
  revealedWrong: number[];
  freezeUntil: number | null;
  hasteArmed: boolean;
  playerEmote: EmoteId | null;
  opponentEmote: EmoteId | null;
  opponentStatus: OpponentStatus;
  itemsUsed: Record<ItemId, number>;
  comboBreakFlash: boolean;
};

export type KnowledgeMatch = {
  player: FighterState;
  opponent: FighterState;
  battle: BattleState;
  questions: Question[];
};

export type OpponentEvent =
  | { type: "answered"; choice: number; elapsedMs: number }
  | { type: "emote"; emote: EmoteId };

export type KnowledgeBattleChannel = {
  onEvent: (handler: (event: OpponentEvent) => void) => () => void;
  sendAnswer: (choice: number, elapsedMs: number) => void;
  sendEmote: (emote: EmoteId) => void;
  startQuestion: (index: number, correctIndex: number, options: number) => void;
  applyItem: (item: ItemId) => void;
  dispose: () => void;
};
