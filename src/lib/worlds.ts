import type { SubjectId } from "./curriculum";
import { DUNGEONS } from "./curriculum";
import type { StudentAccount } from "./account";
import { totalTrophies } from "./account";

export type WorldStageId = "village" | "academy" | "temple" | "city" | "kingdom" | "empire";

export type WorldStage = {
  id: WorldStageId;
  level: 1 | 2 | 3 | 4 | 5 | 6;
  name: string;
  nameEn: string;
  minTrophies: number;
};

export const WORLD_STAGES: WorldStage[] = [
  { id: "village", level: 1, name: "小村庄", nameEn: "Tiny Village", minTrophies: 0 },
  { id: "academy", level: 2, name: "学院", nameEn: "Academy", minTrophies: 100 },
  { id: "temple", level: 3, name: "神殿", minTrophies: 300, nameEn: "Temple" },
  { id: "city", level: 4, name: "大城", nameEn: "Large City", minTrophies: 600 },
  { id: "kingdom", level: 5, name: "浮空王国", nameEn: "Floating Kingdom", minTrophies: 1000 },
  { id: "empire", level: 6, name: "云上帝国", nameEn: "Sky Empire", minTrophies: 1800 },
];

export type SubjectWorld = {
  subject: SubjectId;
  subjectName: string;
  worldName: string;
  tagline: string;
  mascotName: string;
  mascotEmoji: string;
  accent: string;
  skyFrom: string;
  skyTo: string;
  wood: string;
  paper: string;
};

export const SUBJECT_WORLDS: SubjectWorld[] = [
  {
    subject: "chinese",
    subjectName: "华文",
    worldName: "墨香书院",
    tagline: "墨香与汉字的小天地",
    mascotName: "墨墨",
    mascotEmoji: "🖌️",
    accent: "#b85c38",
    skyFrom: "#fff4e6",
    skyTo: "#f0c9a0",
    wood: "#8b5a2b",
    paper: "#fff8ef",
  },
  {
    subject: "english",
    subjectName: "英文",
    worldName: "Word Keep",
    tagline: "字母城堡的温柔冒险",
    mascotName: "Lexi",
    mascotEmoji: "📘",
    accent: "#4a7fd4",
    skyFrom: "#eef6ff",
    skyTo: "#b7d4ff",
    wood: "#6b7c93",
    paper: "#f5f9ff",
  },
  {
    subject: "malay",
    subjectName: "马来文",
    worldName: "Istana Bahasa",
    tagline: "绿意语言岛屿",
    mascotName: "Bahasa",
    mascotEmoji: "🍃",
    accent: "#2f9e6e",
    skyFrom: "#e9fff4",
    skyTo: "#9be4c0",
    wood: "#3f6b4f",
    paper: "#f3fff8",
  },
  {
    subject: "math",
    subjectName: "数学",
    worldName: "Arithmetic Canyon",
    tagline: "数字积木峡谷",
    mascotName: "Numo",
    mascotEmoji: "🔢",
    accent: "#e0a21a",
    skyFrom: "#fff9e8",
    skyTo: "#ffe29a",
    wood: "#8a6a2a",
    paper: "#fffced",
  },
  {
    subject: "science",
    subjectName: "科学",
    worldName: "Experiment Tower",
    tagline: "好奇泡泡实验室",
    mascotName: "Nova",
    mascotEmoji: "🧪",
    accent: "#6a63d8",
    skyFrom: "#f3f0ff",
    skyTo: "#cfc8ff",
    wood: "#55508a",
    paper: "#faf8ff",
  },
];

export type TrophyReward = {
  trophies: number;
  title: string;
  detail: string;
};

export const TROPHY_ROAD: TrophyReward[] = [
  { trophies: 50, title: "Spirit Fragment", detail: "科目精灵碎片 x10" },
  { trophies: 100, title: "Avatar Frame", detail: "暖木头像框" },
  { trophies: 200, title: "World Upgrade", detail: "世界升级材料" },
  { trophies: 300, title: "Arena Skin", detail: "纸灯擂台皮肤" },
  { trophies: 500, title: "Legendary Spirit", detail: "传说精灵碎片" },
  { trophies: 1000, title: "Boss Battle", detail: "解锁 Boss 挑战" },
];

export function getSubjectWorld(subject: SubjectId): SubjectWorld {
  return SUBJECT_WORLDS.find((w) => w.subject === subject) ?? SUBJECT_WORLDS[3];
}

export function getWorldStage(trophies: number): WorldStage {
  let current = WORLD_STAGES[0];
  for (const stage of WORLD_STAGES) {
    if (trophies >= stage.minTrophies) current = stage;
  }
  return current;
}

export function getStageById(id: WorldStageId): WorldStage {
  return WORLD_STAGES.find((s) => s.id === id) ?? WORLD_STAGES[0];
}

export function getNextTrophyReward(trophies: number): TrophyReward | null {
  return TROPHY_ROAD.find((r) => r.trophies > trophies) ?? null;
}

export function getNextWorldStage(trophies: number): WorldStage | null {
  const current = getWorldStage(trophies);
  const idx = WORLD_STAGES.findIndex((s) => s.id === current.id);
  if (idx < 0 || idx >= WORLD_STAGES.length - 1) return null;
  return WORLD_STAGES[idx + 1];
}

export function getPreviousTrophyMilestone(trophies: number): number {
  const passed = TROPHY_ROAD.filter((r) => r.trophies <= trophies);
  if (passed.length === 0) return 0;
  return passed[passed.length - 1].trophies;
}

export function getMockEconomy(account: StudentAccount) {
  const total = totalTrophies(account);
  return {
    xpLevel: Math.max(1, Math.floor(total / 50) + 1),
    xpProgress: total % 50,
    coins: 120 + total * 3,
    gems: 8 + account.grade * 5 + Math.floor(total / 100),
  };
}

export function syncDungeonName(subject: SubjectId): string {
  return (
    DUNGEONS.find((d) => d.id === subject)?.dungeonName ??
    getSubjectWorld(subject).worldName
  );
}
