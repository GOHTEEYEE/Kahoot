import type { GameIconId } from "./gameIcons";

export type ChallengeMode = "arena" | "rush" | "boss" | "friend" | "adventure";

export type ChallengeResult = {
  mode: ChallengeMode;
  score: number;
  correct: number;
  total: number;
  duration: number;
  trophyEarned: number;
  goldEarned: number;
  fragmentsEarned: number;
  xpEarned: number;
};

export type ChallengeTone = "gold" | "sky" | "crimson" | "violet" | "green";

export type ChallengeSilhouette = "castle" | "hourglass" | "boss" | "friends" | "mountains";

export type ChallengeModeMeta = {
  id: ChallengeMode;
  href: string;
  icon: GameIconId;
  rewardIcon: GameIconId;
  tone: ChallengeTone;
  silhouette: ChallengeSilhouette;
};

export const CHALLENGE_MODES: ChallengeModeMeta[] = [
  {
    id: "arena",
    href: "/pvp",
    icon: "swords",
    rewardIcon: "trophy",
    tone: "gold",
    silhouette: "castle",
  },
  {
    id: "rush",
    href: "/challenge/rush",
    icon: "quest",
    rewardIcon: "coin",
    tone: "sky",
    silhouette: "hourglass",
  },
  {
    id: "boss",
    href: "/challenge/boss",
    icon: "spirit",
    rewardIcon: "medal",
    tone: "crimson",
    silhouette: "boss",
  },
  {
    id: "friend",
    href: "/challenge/friend",
    icon: "mail",
    rewardIcon: "mail",
    tone: "violet",
    silhouette: "friends",
  },
  {
    id: "adventure",
    href: "/challenge/adventure",
    icon: "map",
    rewardIcon: "fragment",
    tone: "green",
    silhouette: "mountains",
  },
];
