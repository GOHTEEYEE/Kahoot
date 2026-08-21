import { gradeFromAge, type StudentAccount } from "./account";
import { createEmptyStats } from "./account";
import type { SubjectId } from "./curriculum";

function stats(partial: Partial<Record<SubjectId, { trophies: number; wins?: number; losses?: number }>>) {
  const base = createEmptyStats();
  (Object.keys(partial) as SubjectId[]).forEach((id) => {
    const p = partial[id];
    if (!p) return;
    base[id] = {
      trophies: p.trophies,
      wins: p.wins ?? Math.max(1, Math.floor(p.trophies / 40)),
      losses: p.losses ?? Math.max(0, Math.floor(p.trophies / 80)),
      draws: 0,
    };
  });
  return base;
}

/** Demo students for local mock-only mode. Password for all: demo1234 */
export const MOCK_ACCOUNTS: StudentAccount[] = [
  {
    id: "mock-ali",
    username: "demo_ali",
    password: "demo1234",
    displayName: "Ali",
    age: 8,
    school: "SJK(C) Mock School",
    state: "Selangor",
    contact: "parent.ali@mock.local",
    grade: gradeFromAge(8),
    stats: stats({
      math: { trophies: 120, wins: 6, losses: 2 },
      science: { trophies: 40 },
      english: { trophies: 80 },
    }),
    createdAt: 1,
    updatedAt: 1,
  },
  {
    id: "mock-mei",
    username: "demo_mei",
    password: "demo1234",
    displayName: "Mei Ling",
    age: 10,
    school: "SJK(C) Mock School",
    state: "Johor",
    contact: "parent.mei@mock.local",
    grade: gradeFromAge(10),
    stats: stats({
      chinese: { trophies: 260, wins: 12, losses: 3 },
      math: { trophies: 180 },
      malay: { trophies: 90 },
    }),
    createdAt: 2,
    updatedAt: 2,
  },
  {
    id: "mock-raj",
    username: "demo_raj",
    password: "demo1234",
    displayName: "Raj",
    age: 11,
    school: "SK Mock Putrajaya",
    state: "W.P. Putrajaya",
    contact: "parent.raj@mock.local",
    grade: gradeFromAge(11),
    stats: stats({
      english: { trophies: 340, wins: 15, losses: 4 },
      science: { trophies: 220 },
      math: { trophies: 150 },
    }),
    createdAt: 3,
    updatedAt: 3,
  },
  {
    id: "mock-sara",
    username: "demo_sara",
    password: "demo1234",
    displayName: "Sara",
    age: 9,
    school: "SK Mock Melaka",
    state: "Melaka",
    contact: "parent.sara@mock.local",
    grade: gradeFromAge(9),
    stats: stats({
      malay: { trophies: 200, wins: 9, losses: 2 },
      science: { trophies: 110 },
      chinese: { trophies: 70 },
    }),
    createdAt: 4,
    updatedAt: 4,
  },
  {
    id: "mock-chen",
    username: "demo_chen",
    password: "demo1234",
    displayName: "Chen Hao",
    age: 10,
    school: "SJK(C) Happy Valley",
    state: "Selangor",
    contact: "parent.chen@mock.local",
    grade: gradeFromAge(10),
    stats: stats({
      chinese: { trophies: 180, wins: 8 },
      math: { trophies: 95 },
    }),
    createdAt: 5,
    updatedAt: 5,
  },
  {
    id: "mock-aisyah",
    username: "demo_aisyah",
    password: "demo1234",
    displayName: "Aisyah",
    age: 9,
    school: "SK Taman Jaya",
    state: "Selangor",
    contact: "parent.aisyah@mock.local",
    grade: gradeFromAge(9),
    stats: stats({
      malay: { trophies: 155, wins: 7 },
      english: { trophies: 60 },
      chinese: { trophies: 45 },
    }),
    createdAt: 6,
    updatedAt: 6,
  },
  {
    id: "mock-lim",
    username: "demo_lim",
    password: "demo1234",
    displayName: "Lim Wei",
    age: 11,
    school: "SJK(C) Mock School",
    state: "Johor",
    contact: "parent.lim@mock.local",
    grade: gradeFromAge(11),
    stats: stats({
      math: { trophies: 210, wins: 10 },
      science: { trophies: 88 },
      chinese: { trophies: 120 },
    }),
    createdAt: 7,
    updatedAt: 7,
  },
  {
    id: "mock-kumar",
    username: "demo_kumar",
    password: "demo1234",
    displayName: "Kumar",
    age: 10,
    school: "SK Mock Putrajaya",
    state: "W.P. Putrajaya",
    contact: "parent.kumar@mock.local",
    grade: gradeFromAge(10),
    stats: stats({
      english: { trophies: 175, wins: 8 },
      science: { trophies: 140 },
      math: { trophies: 70 },
    }),
    createdAt: 8,
    updatedAt: 8,
  },
  {
    id: "mock-yuki",
    username: "demo_yuki",
    password: "demo1234",
    displayName: "Yuki Tan",
    age: 8,
    school: "SJK(C) Happy Valley",
    state: "Selangor",
    contact: "parent.yuki@mock.local",
    grade: gradeFromAge(8),
    stats: stats({
      chinese: { trophies: 95, wins: 4 },
      english: { trophies: 50 },
      math: { trophies: 40 },
    }),
    createdAt: 9,
    updatedAt: 9,
  },
  {
    id: "mock-farah",
    username: "demo_farah",
    password: "demo1234",
    displayName: "Farah",
    age: 9,
    school: "SK Mock Melaka",
    state: "Melaka",
    contact: "parent.farah@mock.local",
    grade: gradeFromAge(9),
    stats: stats({
      malay: { trophies: 130, wins: 6 },
      science: { trophies: 55 },
      chinese: { trophies: 30 },
    }),
    createdAt: 10,
    updatedAt: 10,
  },
];

export const MOCK_MODE = true;

export const DEMO_PASSWORD = "demo1234";
