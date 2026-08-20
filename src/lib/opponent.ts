import type { BotOpponent } from "./bot";

export type OpponentType = "bot" | "friend" | "player";

export type BattleOpponent = {
  type: OpponentType;
  id: string;
  nickname: string;
  trophies: number;
  roomCode?: string;
  role?: "host" | "guest";
};

const PENDING_KEY = "matharena:pending-opponent";

export function botAsOpponent(bot: BotOpponent): BattleOpponent {
  return { type: "bot", id: bot.id, nickname: bot.nickname, trophies: bot.trophies };
}

export function setPendingOpponent(opponent: BattleOpponent): void {
  if (typeof window === "undefined") return;
  sessionStorage.setItem(PENDING_KEY, JSON.stringify(opponent));
}

export function consumePendingOpponent(): BattleOpponent | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = sessionStorage.getItem(PENDING_KEY);
    sessionStorage.removeItem(PENDING_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as BattleOpponent;
    if (!parsed?.nickname) return null;
    return parsed;
  } catch {
    return null;
  }
}

export function asBotShape(opponent: BattleOpponent): BotOpponent {
  return { id: opponent.id, nickname: opponent.nickname, trophies: opponent.trophies };
}
