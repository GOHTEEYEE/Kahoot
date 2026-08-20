import type { SubjectId } from "./curriculum";
import type { QuestionCategory } from "./questions";
import { getSubjectWorld } from "./worlds";

export type AdventureLocation = {
  id: string;
  worldId: SubjectId;
  name: string;
  nameEn: string;
  description: string;
  unlockedAtTrophy: number;
  questionCategory: QuestionCategory;
  reward: { gold: number; fragments: number; xp: number };
};

const BY_WORLD: Record<SubjectId, Omit<AdventureLocation, "worldId" | "questionCategory">[]> = {
  math: [
    { id: "number-tower", name: "数字塔", nameEn: "Number Tower", description: "Climb and count.", unlockedAtTrophy: 0, reward: { gold: 18, fragments: 2, xp: 10 } },
    { id: "addition-village", name: "加法村", nameEn: "Addition Village", description: "Add your way through.", unlockedAtTrophy: 20, reward: { gold: 22, fragments: 2, xp: 12 } },
    { id: "multi-forest", name: "乘法森林", nameEn: "Multiplication Forest", description: "Times tables among the trees.", unlockedAtTrophy: 50, reward: { gold: 28, fragments: 3, xp: 14 } },
    { id: "geo-valley", name: "几何谷", nameEn: "Geometry Valley", description: "Shapes and space.", unlockedAtTrophy: 100, reward: { gold: 32, fragments: 3, xp: 16 } },
    { id: "logic-cave", name: "逻辑洞", nameEn: "Logic Cave", description: "Think before you leap.", unlockedAtTrophy: 200, reward: { gold: 40, fragments: 4, xp: 20 } },
  ],
  science: [
    { id: "lab", name: "科学实验室", nameEn: "Science Lab", description: "Mix and marvel.", unlockedAtTrophy: 0, reward: { gold: 18, fragments: 2, xp: 10 } },
    { id: "volcano", name: "火山岛", nameEn: "Volcano Island", description: "Heat and earth.", unlockedAtTrophy: 20, reward: { gold: 22, fragments: 2, xp: 12 } },
    { id: "space", name: "太空观象台", nameEn: "Space Observatory", description: "Look up.", unlockedAtTrophy: 50, reward: { gold: 28, fragments: 3, xp: 14 } },
    { id: "ocean", name: "海湾", nameEn: "Ocean Bay", description: "Waves and life.", unlockedAtTrophy: 100, reward: { gold: 32, fragments: 3, xp: 16 } },
    { id: "dino", name: "恐龙谷", nameEn: "Dinosaur Valley", description: "Ancient Earth.", unlockedAtTrophy: 200, reward: { gold: 40, fragments: 4, xp: 20 } },
  ],
  chinese: [
    { id: "academy", name: "墨香书院", nameEn: "Ink Academy", description: "Start the path.", unlockedAtTrophy: 0, reward: { gold: 18, fragments: 2, xp: 10 } },
    { id: "chengyu", name: "成语庭", nameEn: "Chengyu Court", description: "Four-character wisdom.", unlockedAtTrophy: 20, reward: { gold: 22, fragments: 2, xp: 12 } },
    { id: "hanzi", name: "汉字塔", nameEn: "Hanzi Tower", description: "Stroke by stroke.", unlockedAtTrophy: 50, reward: { gold: 28, fragments: 3, xp: 14 } },
    { id: "poetry", name: "诗词桥", nameEn: "Poetry Bridge", description: "Words that sing.", unlockedAtTrophy: 100, reward: { gold: 32, fragments: 3, xp: 16 } },
    { id: "reading", name: "阅读阁", nameEn: "Reading Pavilion", description: "Stories wait.", unlockedAtTrophy: 200, reward: { gold: 40, fragments: 4, xp: 20 } },
  ],
  english: [
    { id: "keep", name: "Word Keep", nameEn: "Word Keep", description: "The castle gates.", unlockedAtTrophy: 0, reward: { gold: 18, fragments: 2, xp: 10 } },
    { id: "vocab", name: "Vocabulary Village", nameEn: "Vocabulary Village", description: "New words live here.", unlockedAtTrophy: 20, reward: { gold: 22, fragments: 2, xp: 12 } },
    { id: "grammar", name: "Grammar Tower", nameEn: "Grammar Tower", description: "Build correct sentences.", unlockedAtTrophy: 50, reward: { gold: 28, fragments: 3, xp: 14 } },
    { id: "speak", name: "Speaking Garden", nameEn: "Speaking Garden", description: "Find your voice.", unlockedAtTrophy: 100, reward: { gold: 32, fragments: 3, xp: 16 } },
    { id: "story", name: "Story Library", nameEn: "Story Library", description: "Read and retell.", unlockedAtTrophy: 200, reward: { gold: 40, fragments: 4, xp: 20 } },
  ],
  malay: [
    { id: "istana", name: "Istana Bahasa", nameEn: "Istana Bahasa", description: "The language palace.", unlockedAtTrophy: 0, reward: { gold: 18, fragments: 2, xp: 10 } },
    { id: "kata", name: "Kata Village", nameEn: "Kata Village", description: "Words of daily life.", unlockedAtTrophy: 20, reward: { gold: 22, fragments: 2, xp: 12 } },
    { id: "tata", name: "Tatabahasa Tower", nameEn: "Tatabahasa Tower", description: "Grammar climbs high.", unlockedAtTrophy: 50, reward: { gold: 28, fragments: 3, xp: 14 } },
    { id: "garden", name: "Bahasa Garden", nameEn: "Bahasa Garden", description: "Speak with heart.", unlockedAtTrophy: 100, reward: { gold: 32, fragments: 3, xp: 16 } },
    { id: "cerita", name: "Cerita Bridge", nameEn: "Cerita Bridge", description: "Stories across the river.", unlockedAtTrophy: 200, reward: { gold: 40, fragments: 4, xp: 20 } },
  ],
};

export function adventureLocations(subject: SubjectId): AdventureLocation[] {
  const category: QuestionCategory = subject;
  return (BY_WORLD[subject] ?? BY_WORLD.math).map((loc) => ({
    ...loc,
    worldId: subject,
    questionCategory: category,
  }));
}

export function adventureWorldTitle(subject: SubjectId): string {
  const w = getSubjectWorld(subject);
  return `${w.subjectName} · ${w.worldName}`;
}

function progressKey(accountId: string): string {
  return `matharena:adventure:${accountId}`;
}

export function readAdventureClears(accountId: string): string[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(progressKey(accountId));
    if (!raw) return [];
    const parsed = JSON.parse(raw) as { completed?: string[] };
    return parsed.completed ?? [];
  } catch {
    return [];
  }
}

export function markAdventureClear(accountId: string, locationId: string): string[] {
  const next = Array.from(new Set([...readAdventureClears(accountId), locationId]));
  if (typeof window !== "undefined") {
    localStorage.setItem(progressKey(accountId), JSON.stringify({ completed: next }));
  }
  return next;
}
