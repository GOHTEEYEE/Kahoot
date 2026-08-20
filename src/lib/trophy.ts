export type MatchResult = "win" | "lose" | "draw";

export type Rank = {
  id: string;
  name: string;
  minTrophies: number;
  color: string;
};

export const RANKS: Rank[] = [
  { id: "rookie", name: "新手营", minTrophies: 0, color: "#5c8a7a" },
  { id: "bronze", name: "青铜", minTrophies: 100, color: "#b87333" },
  { id: "silver", name: "白银", minTrophies: 300, color: "#8a9aab" },
  { id: "gold", name: "黄金", minTrophies: 600, color: "#e6a817" },
  { id: "master", name: "大师", minTrophies: 1000, color: "#1f8a70" },
  { id: "legend", name: "传说", minTrophies: 1500, color: "#e85d04" },
];

export function getRank(trophies: number): Rank {
  let current = RANKS[0];
  for (const rank of RANKS) {
    if (trophies >= rank.minTrophies) current = rank;
  }
  return current;
}

export function getNextRank(trophies: number): Rank | null {
  const rank = getRank(trophies);
  const index = RANKS.findIndex((r) => r.id === rank.id);
  return RANKS[index + 1] ?? null;
}

export function calcTrophyDelta(
  result: MatchResult,
  playerTrophies: number,
  opponentTrophies: number,
): number {
  if (result === "draw") return 0;

  const diff = opponentTrophies - playerTrophies;

  if (result === "win") {
    const bonus = diff > 0 ? Math.min(10, Math.floor(diff / 50)) : 0;
    return 20 + bonus;
  }

  const extra = diff < 0 ? Math.min(5, Math.floor(Math.abs(diff) / 50)) : 0;
  return -(15 + extra);
}

export function applyTrophyChange(current: number, delta: number): number {
  return Math.max(0, current + delta);
}

export function decideResult(
  playerScore: number,
  opponentScore: number,
): MatchResult {
  if (playerScore > opponentScore) return "win";
  if (playerScore < opponentScore) return "lose";
  return "draw";
}
