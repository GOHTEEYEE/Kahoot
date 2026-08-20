export type Grade = 1 | 2 | 3 | 4 | 5 | 6;

export type SubjectId = "chinese" | "english" | "malay" | "math" | "science";

export const GRADES: Grade[] = [1, 2, 3, 4, 5, 6];

export const SUBJECTS: { id: SubjectId; name: string; short: string }[] = [
  { id: "chinese", name: "华文", short: "华" },
  { id: "english", name: "英文", short: "英" },
  { id: "malay", name: "马来文", short: "马" },
  { id: "math", name: "数学", short: "数" },
  { id: "science", name: "科学", short: "科" },
];

export type DungeonMeta = {
  id: SubjectId;
  name: string;
  dungeonName: string;
  tagline: string;
  accent: string;
  accentSoft: string;
  motif: string;
};

/** Each subject is a challengeable dungeon/instance cover. */
export const DUNGEONS: DungeonMeta[] = [
  {
    id: "chinese",
    name: "华文",
    dungeonName: "Ink Academy",
    tagline: "墨香与汉字的小天地",
    accent: "#c45c26",
    accentSoft: "#f3d2b5",
    motif: "文",
  },
  {
    id: "english",
    name: "英文",
    dungeonName: "Word Keep",
    tagline: "单词与语法城堡",
    accent: "#2f6fed",
    accentSoft: "#cfe0ff",
    motif: "Aa",
  },
  {
    id: "malay",
    name: "马来文",
    dungeonName: "Istana Bahasa",
    tagline: "Bahasa Melayu 挑战",
    accent: "#0f8f6f",
    accentSoft: "#c8f0e3",
    motif: "BM",
  },
  {
    id: "math",
    name: "数学",
    dungeonName: "Arithmetic Canyon",
    tagline: "数字积木峡谷",
    accent: "#e6a817",
    accentSoft: "#ffe9a8",
    motif: "∑",
  },
  {
    id: "science",
    name: "科学",
    dungeonName: "Experiment Tower",
    tagline: "好奇泡泡实验室",
    accent: "#5b4fcf",
    accentSoft: "#ddd0ff",
    motif: "科",
  },
];

export function gradeLabel(grade: Grade): string {
  return `${grade}年级`;
}

export function subjectLabel(id: SubjectId): string {
  return SUBJECTS.find((s) => s.id === id)?.name ?? id;
}

export function getDungeon(id: SubjectId): DungeonMeta {
  return DUNGEONS.find((d) => d.id === id) ?? DUNGEONS[3];
}

export type StudyPrefs = {
  grade: Grade;
  subject: SubjectId;
};

export const DEFAULT_PREFS: StudyPrefs = {
  grade: 1,
  subject: "math",
};
