import type { SubjectId } from "../curriculum";

export type MascotCharacter = "nova" | "lexi" | "momo" | "numo" | "bahasa";

export type MascotState =
  | "idle"
  | "wave"
  | "happy"
  | "sad"
  | "celebrate"
  | "sleep"
  | "thinking"
  | "encourage";

export type MascotProfile = {
  character: MascotCharacter;
  displayName: string;
  emoji: string;
  /** Place .riv files here when ready. Missing files fall back to image/emoji. */
  riveSrc: string;
  /** Optional painted character plate used when Rive is missing. */
  imageFallback?: string;
  speechOnTap: string;
  accent: string;
};

export const SUBJECT_TO_CHARACTER: Record<SubjectId, MascotCharacter> = {
  science: "nova",
  english: "lexi",
  chinese: "momo",
  math: "numo",
  malay: "bahasa",
};

export const MASCOT_PROFILES: Record<MascotCharacter, MascotProfile> = {
  nova: {
    character: "nova",
    displayName: "Nova",
    emoji: "🧪",
    riveSrc: "/rive/characters/nova.riv",
    imageFallback: "/worlds/science/hero.png",
    speechOnTap: "准备好探索了吗？",
    accent: "#6a63d8",
  },
  lexi: {
    character: "lexi",
    displayName: "Lexi",
    emoji: "📘",
    riveSrc: "/rive/characters/lexi.riv",
    /** Painted character plate until Rive ships */
    imageFallback: "/worlds/english/lexi.png",
    speechOnTap: "Ready for a challenge?",
    accent: "#4a7fd4",
  },
  momo: {
    character: "momo",
    displayName: "墨墨",
    emoji: "🖌️",
    riveSrc: "/rive/characters/momo.riv",
    imageFallback: "/worlds/chinese/momo.png?v=live",
    speechOnTap: "今天一起学点新的吧！",
    accent: "#b85c38",
  },
  numo: {
    character: "numo",
    displayName: "Numo",
    emoji: "🔢",
    riveSrc: "/rive/characters/numo.riv",
    imageFallback: "/worlds/math/hero.png",
    speechOnTap: "来挑战一道数学题吧！",
    accent: "#e0a21a",
  },
  bahasa: {
    character: "bahasa",
    displayName: "Bahasa",
    emoji: "🍃",
    riveSrc: "/rive/characters/bahasa.riv",
    imageFallback: "/worlds/malay/hero.png",
    speechOnTap: "Jom kita cuba!",
    accent: "#2f9e6e",
  },
};

export function getMascotForSubject(subject: SubjectId): MascotProfile {
  return MASCOT_PROFILES[SUBJECT_TO_CHARACTER[subject]];
}

/** Suggested Rive State Machine input names (when asset exists). */
export const RIVE_TRIGGERS = {
  wave: "wave",
  celebrate: "celebrate",
  tap: "tap",
  correct: "correct",
  wrong: "wrong",
} as const;
