import type { SubjectId } from "./curriculum";

/** Semantic game icon ids used across the UI. */
export type GameIconId =
  | "chest"
  | "mission"
  | "quest"
  | "pass"
  | "medal"
  | "trophy"
  | "map"
  | "challenge"
  | "swords"
  | "reward"
  | "fragment"
  | "event"
  | "speaker"
  | "gift"
  | "leaderboard"
  | "spirits"
  | "spirit"
  | "profile"
  | "backpack"
  | "settings"
  | "gear"
  | "notification"
  | "bell"
  | "mail"
  | "coin"
  | "gem"
  | "home";

export type GameIconTier = "major" | "utility";

export type GameIconSize = "nav" | "challenge" | "worldMap" | "sideHud" | "quickAction" | "utility" | "progress";

/** PNG filename in /public/icons (null → use IconPlaceholder). */
export const GAME_ICON_FILES: Record<GameIconId, string | null> = {
  chest: "chest",
  mission: "quest",
  quest: "quest",
  pass: "medal",
  medal: "medal",
  trophy: "trophy",
  map: "map",
  challenge: "swords",
  swords: "swords",
  reward: "fragment",
  fragment: "fragment",
  event: "speaker",
  speaker: "speaker",
  gift: null,
  leaderboard: "trophy",
  spirits: "spirit",
  spirit: "spirit",
  profile: "backpack",
  backpack: "backpack",
  settings: "gear",
  gear: "gear",
  notification: "bell",
  bell: "bell",
  mail: "mail",
  coin: "coin",
  gem: "gem",
  home: "home",
};

export const GAME_ICON_TIER: Record<GameIconId, GameIconTier> = {
  chest: "major",
  mission: "major",
  quest: "major",
  pass: "major",
  medal: "major",
  trophy: "major",
  map: "major",
  challenge: "major",
  swords: "major",
  reward: "major",
  fragment: "major",
  event: "major",
  speaker: "major",
  gift: "major",
  leaderboard: "major",
  spirits: "major",
  spirit: "major",
  profile: "major",
  backpack: "major",
  home: "major",
  settings: "utility",
  gear: "utility",
  notification: "utility",
  bell: "utility",
  mail: "utility",
  coin: "major",
  gem: "major",
};

/** Recommended display sizes (Tailwind classes). */
export const GAME_ICON_SIZES: Record<GameIconSize, string> = {
  nav: "h-9 w-9",
  challenge: "h-14 w-14",
  worldMap: "h-9 w-9",
  sideHud: "h-8 w-8",
  quickAction: "h-[clamp(2.35rem,9.5vw,3.1rem)] w-[clamp(2.35rem,9.5vw,3.1rem)]",
  utility: "h-5 w-5",
  progress: "h-8 w-8",
};

export const MISSING_ICON_ART: Partial<
  Record<GameIconId, { label: string; description: string }>
> = {
  gift: {
    label: "gift",
    description:
      "3D red/yellow gift box with ribbon bow, warm toy-like bevel, transparent PNG, ~256px, matches chest/trophy lighting.",
  },
};

export function resolveGameIconFile(id: GameIconId): string | null {
  return GAME_ICON_FILES[id] ?? null;
}

export function gameIconSrc(id: GameIconId): string | null {
  const file = resolveGameIconFile(id);
  return file ? `/icons/${file}.png` : null;
}

export function isMajorGameIcon(id: GameIconId): boolean {
  return GAME_ICON_TIER[id] === "major";
}

export function subjectHeroSrc(subject: SubjectId): string {
  return `/worlds/${subject}/hero.png`;
}
