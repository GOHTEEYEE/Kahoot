import { QUESTION_TIME_MS, scoreForAnswer, type Question } from "./questions";

export type BotOpponent = {
  id: string;
  nickname: string;
  trophies: number;
};

const BOT_NAMES = [
  "闪电兔",
  "小算盘",
  "星星猫",
  "数学鸭",
  "勇敢虎",
  "聪明狐",
  "飞跃鸟",
  "能量熊",
  "彩虹鲸",
  "闪电龙",
  "果汁蛙",
  "奇奇鼠",
];

function clamp(n: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, n));
}

export function createBotOpponent(playerTrophies: number): BotOpponent {
  const spread = 40 + Math.floor(Math.random() * 80);
  const sign = Math.random() > 0.45 ? 1 : -1;
  const trophies = Math.max(0, playerTrophies + sign * spread);
  const nickname = BOT_NAMES[Math.floor(Math.random() * BOT_NAMES.length)];
  return {
    id: `bot-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
    nickname,
    trophies,
  };
}

/** Higher trophies → slightly smarter / faster bot. */
export function botAccuracy(trophies: number): number {
  return clamp(0.52 + trophies / 2200, 0.52, 0.9);
}

export function simulateBotAnswers(
  questions: Question[],
  botTrophies: number,
): { choices: (number | null)[]; scores: number[]; total: number } {
  const accuracy = botAccuracy(botTrophies);
  const choices: (number | null)[] = [];
  const scores: number[] = [];
  let total = 0;

  for (const question of questions) {
    const rollsCorrect = Math.random() < accuracy;
    const reacts = Math.random() > 0.06;
    if (!reacts) {
      choices.push(null);
      scores.push(0);
      continue;
    }

    let choice: number;
    if (rollsCorrect) {
      choice = question.correctIndex;
    } else {
      const wrong = [0, 1, 2, 3].filter((i) => i !== question.correctIndex);
      choice = wrong[Math.floor(Math.random() * wrong.length)];
    }

    const thinkMs =
      1200 + Math.random() * 5500 - Math.min(1500, botTrophies / 2);
    const remaining = Math.max(400, QUESTION_TIME_MS - thinkMs);
    const points = scoreForAnswer(choice === question.correctIndex, remaining);
    choices.push(choice);
    scores.push(points);
    total += points;
  }

  return { choices, scores, total };
}
