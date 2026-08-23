const PANDA = {
  emoji: "🐼",
  nameZh: "熊猫勇士",
  nameEn: "Panda Hero",
  src: "/worlds/shared/panda-hero.png?v=pvp6",
  attackWebm: "/worlds/shared/panda-attack.webm?v=pvp6",
  attackMov: "/worlds/shared/panda-attack.mov?v=pvp6",
  /** Source clip is ~4s; speed up so the punch reads in the arena. */
  attackRate: 2.4,
  /** Source-time cues (seconds). Fist starts ~1.05s, fully out ~2.08s. */
  swingAt: 1.05,
  impactAt: 2.08,
  winWebm: "/worlds/shared/panda-win.webm?v=pvp6",
  winMov: "/worlds/shared/panda-win.mov?v=pvp6",
  winRate: 1,
  loseWebm: "/worlds/shared/panda-lose.webm?v=pvp7",
  loseMov: "/worlds/shared/panda-lose.mov?v=pvp7",
  loseRate: 1,
} as const;

export const PLAYER_HERO = PANDA;
export const OPPONENT_HERO = PANDA;
