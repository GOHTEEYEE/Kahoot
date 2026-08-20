import type { SubjectId } from "./curriculum";

export type ExplainRequest = {
  subject: SubjectId;
  prompt: string;
  options: string[];
  correctIndex: number;
  playerChoice: number | null;
  language?: "zh" | "en" | "ms";
};

// ─── Math step-by-step engine ────────────────────────────────────────────────

function extractNumbers(text: string): number[] {
  return [...text.matchAll(/-?\d+(?:\.\d+)?/g)].map(Number);
}

function mathSteps(prompt: string, correct: string): string[] {
  const p = prompt.toLowerCase();
  const nums = extractNumbers(prompt);

  // Percentage / profit rate: 利润率, profit margin, 折扣率, 百分比
  if (/利润率|profit.?rate|profit.?margin/.test(p)) {
    const cost = nums[0];
    const price = nums[1];
    if (cost != null && price != null && cost !== 0) {
      const profit = price - cost;
      const rate = ((profit / cost) * 100).toFixed(0);
      return [
        `📌 利润率 = (售价 - 成本) ÷ 成本 × 100%`,
        `第一步：计算利润`,
        `  利润 = 售价 - 成本 = ${price} - ${cost} = ${profit}`,
        `第二步：计算利润率`,
        `  利润率 = ${profit} ÷ ${cost} × 100% = ${rate}%`,
        `✅ 答案：${correct}`,
      ];
    }
  }

  // Percentage of amount: 百分之, %
  if (/百分之|(\d+)\s*%\s*(of|的)/.test(p)) {
    const pctMatch = prompt.match(/(\d+(?:\.\d+)?)\s*%/);
    const baseNums = extractNumbers(prompt.replace(/\d+%/, ""));
    if (pctMatch && baseNums.length > 0) {
      const pct = parseFloat(pctMatch[1]);
      const base = baseNums[0];
      const result = (pct / 100) * base;
      return [
        `📌 百分比计算：数量 × 百分率`,
        `第一步：${base} × ${pct}% = ${base} × ${pct / 100}`,
        `第二步：= ${result}`,
        `✅ 答案：${correct}`,
      ];
    }
  }

  // Discount: 折扣, discount
  if (/折扣|discount|打.*折/.test(p)) {
    const pctMatch = prompt.match(/(\d+(?:\.\d+)?)\s*%/);
    const origMatch = prompt.match(/(\d+(?:\.\d+)?)/);
    if (pctMatch && origMatch) {
      const pct = parseFloat(pctMatch[1]);
      const orig = parseFloat(origMatch[1]);
      if (orig !== parseFloat(pctMatch[1])) {
        const disc = (orig * (1 - pct / 100)).toFixed(2);
        return [
          `📌 折后价 = 原价 × (1 - 折扣率)`,
          `= ${orig} × (1 - ${pct}%) = ${orig} × ${(1 - pct / 100).toFixed(2)}`,
          `= ${disc}`,
          `✅ 答案：${correct}`,
        ];
      }
    }
  }

  // Perimeter / area
  if (/周长|perimeter/.test(p) && nums.length >= 2) {
    if (/正方形|square/.test(p)) {
      const s = nums[0];
      return [
        `📌 正方形周长 = 边长 × 4`,
        `= ${s} × 4 = ${s * 4}`,
        `✅ 答案：${correct}`,
      ];
    }
    if (/长方形|rectangle/.test(p)) {
      const [l, w] = nums;
      return [
        `📌 长方形周长 = (长 + 宽) × 2`,
        `= (${l} + ${w}) × 2 = ${(l + w) * 2}`,
        `✅ 答案：${correct}`,
      ];
    }
  }
  if (/面积|area/.test(p) && nums.length >= 2) {
    if (/正方形|square/.test(p)) {
      const s = nums[0];
      return [
        `📌 正方形面积 = 边长²`,
        `= ${s} × ${s} = ${s * s}`,
        `✅ 答案：${correct}`,
      ];
    }
    if (/长方形|rectangle/.test(p)) {
      const [l, w] = nums;
      return [
        `📌 长方形面积 = 长 × 宽`,
        `= ${l} × ${w} = ${l * w}`,
        `✅ 答案：${correct}`,
      ];
    }
    if (/三角形|triangle/.test(p)) {
      const [base, h] = nums;
      return [
        `📌 三角形面积 = 底 × 高 ÷ 2`,
        `= ${base} × ${h} ÷ 2 = ${(base * h) / 2}`,
        `✅ 答案：${correct}`,
      ];
    }
  }

  // Fraction addition/subtraction
  if (/分之/.test(prompt)) {
    return [
      `📌 分数运算：先通分（找公分母），再运算分子`,
      `最后化简结果到最简分数。`,
      `✅ 正确答案：${correct}`,
    ];
  }

  // Speed = distance / time
  if (/速度|speed|时速|km\/h/.test(p) && nums.length >= 2) {
    if (/路程|distance/.test(p)) {
      const [dist, time] = nums;
      return [
        `📌 速度 = 路程 ÷ 时间`,
        `= ${dist} ÷ ${time} = ${(dist / time).toFixed(2)}`,
        `✅ 答案：${correct}`,
      ];
    }
    if (/时间|time/.test(p)) {
      const [dist, speed] = nums;
      return [
        `📌 时间 = 路程 ÷ 速度`,
        `= ${dist} ÷ ${speed} = ${(dist / speed).toFixed(2)} 小时`,
        `✅ 答案：${correct}`,
      ];
    }
  }

  // Average
  if (/平均|average|均值/.test(p) && nums.length >= 2) {
    const sum = nums.reduce((a, b) => a + b, 0);
    return [
      `📌 平均数 = 各数之和 ÷ 数量`,
      `各数：${nums.join("、")}`,
      `总和 = ${sum}，共 ${nums.length} 个数`,
      `平均 = ${sum} ÷ ${nums.length} = ${(sum / nums.length).toFixed(2)}`,
      `✅ 答案：${correct}`,
    ];
  }

  // Simple arithmetic: detect operator in prompt
  if (nums.length >= 2) {
    const [a, b] = nums;
    if (/\+|加/.test(prompt)) {
      return [
        `📌 加法`,
        `${a} + ${b} = ${a + b}`,
        `✅ 答案：${correct}`,
      ];
    }
    if (/-|减/.test(prompt.replace(/→|–/g, ""))) {
      return [
        `📌 减法`,
        `${a} - ${b} = ${a - b}`,
        `✅ 答案：${correct}`,
      ];
    }
    if (/×|✕|\*|乘/.test(prompt)) {
      return [
        `📌 乘法`,
        `${a} × ${b} = ${a * b}`,
        `✅ 答案：${correct}`,
      ];
    }
    if (/÷|\/|除/.test(prompt)) {
      return [
        `📌 除法`,
        `${a} ÷ ${b} = ${b !== 0 ? (a / b).toFixed(2) : "undefined"}`,
        `✅ 答案：${correct}`,
      ];
    }
  }

  // Fallback math tip
  return [
    `📌 解题思路：`,
    `找出题目中的已知量，确认用什么公式，代入数字，逐步计算。`,
    `✅ 正确答案：${correct}`,
  ];
}

// ─── English step-by-step engine ─────────────────────────────────────────────

function englishExplain(prompt: string, correct: string, chosen: string): string {
  const p = prompt.toLowerCase();

  // Tense detection
  if (/past tense|past form|simple past/.test(p)) {
    const isIrregular = /go|come|run|eat|drink|see|write|take|give|make|know|say|get|do|have|be|buy|bring|think|become|begin|break|choose|drive|fall|feel|find|forget|grow|hold|keep|leave|lose|meet|pay|read|ride|ring|rise|send|sing|sit|sleep|speak|spend|stand|swim|teach|tell|wear|win/.test(correct.toLowerCase());
    return [
      `💡 Past Tense`,
      isIrregular
        ? `"${correct}" is an irregular past tense — it does NOT follow the regular -ed rule.`
        : `Regular verbs add -ed to form the past tense.`,
      `❌ You chose: "${chosen}"`,
      `✅ Correct: "${correct}"`,
      `💬 Tip: Common irregular verbs — go→went, see→saw, eat→ate, write→wrote, run→ran.`,
    ].join("\n");
  }

  if (/present.*continuous|present.*progressive|is.*ing|are.*ing/.test(p) || /\bis\b.*___.*ing|\bare\b.*___.*ing/.test(p)) {
    return [
      `💡 Present Continuous Tense`,
      `Use: am/is/are + verb-ing  (for actions happening right now)`,
      `Example: She is running. They are eating.`,
      `❌ You chose: "${chosen}"`,
      `✅ Correct: "${correct}"`,
      `💬 Tip: The verb must end in -ing when using is/are.`,
    ].join("\n");
  }

  if (/future|will\s+___/.test(p)) {
    return [
      `💡 Future Tense`,
      `Use: will + base verb (no -s, no -ed, no -ing)`,
      `Example: She will go. They will play.`,
      `❌ You chose: "${chosen}"`,
      `✅ Correct: "${correct}"`,
    ].join("\n");
  }

  // Subject-verb agreement
  if (/he|she|it.*___|singular.*verb|verb.*singular/.test(p) || /she\s+___|\bhe\s+___|\bit\s+___/.test(p)) {
    return [
      `💡 Subject-Verb Agreement`,
      `He / She / It → add -s or -es to the verb (3rd person singular)`,
      `Example: She runs. He watches. It flies.`,
      `I / You / We / They → use base form (no -s)`,
      `❌ You chose: "${chosen}"`,
      `✅ Correct: "${correct}"`,
    ].join("\n");
  }

  // Articles a/an/the
  if (/\ba\b.*\ban\b|\ban\b.*\ba\b|article|a or an/.test(p) || /choose.*\ba\b|\ba\b.*\ban\b/.test(p)) {
    return [
      `💡 Articles: A vs An`,
      `Use "a" before consonant sounds: a cat, a book, a university (y-sound)`,
      `Use "an" before vowel sounds: an apple, an hour (silent h), an egg`,
      `❌ You chose: "${chosen}"`,
      `✅ Correct: "${correct}"`,
      `💬 Tip: It's about the SOUND, not the letter — "an hour" because the h is silent.`,
    ].join("\n");
  }

  // Plural forms
  if (/plural|more than one/.test(p)) {
    return [
      `💡 Plural Nouns`,
      `Most nouns: add -s  (cat → cats)`,
      `Nouns ending in -s, -x, -z, -ch, -sh: add -es  (box → boxes, watch → watches)`,
      `Nouns ending in consonant + y: change y → ies  (baby → babies)`,
      `Irregular: child → children, mouse → mice, foot → feet, tooth → teeth`,
      `❌ You chose: "${chosen}"`,
      `✅ Correct: "${correct}"`,
    ].join("\n");
  }

  // Prepositions
  if (/preposition|in, on, at|at, on, in|choose.*preposition/.test(p) || /\b(in|on|at|under|above|beside|between|behind|through)\b.*___/.test(p)) {
    return [
      `💡 Prepositions of Time/Place`,
      `AT → specific time or place: at 3pm, at school, at the door`,
      `ON → days/dates/surfaces: on Monday, on the table, on 1 May`,
      `IN → months/years/enclosed spaces: in March, in 2025, in the box`,
      `❌ You chose: "${chosen}"`,
      `✅ Correct: "${correct}"`,
    ].join("\n");
  }

  // Conjunctions
  if (/conjunction|connect.*sentence|joining word/.test(p) || /and|but|or|because|although|unless|so.*___/.test(p)) {
    return [
      `💡 Conjunctions`,
      `AND → adds two similar ideas: I like cats and dogs.`,
      `BUT → shows contrast: I like cats but not dogs.`,
      `BECAUSE → gives a reason: She cried because she was sad.`,
      `ALTHOUGH → shows contrast (even though): Although it rained, we went out.`,
      `UNLESS → means "if not": I won't go unless you come.`,
      `❌ You chose: "${chosen}"`,
      `✅ Correct: "${correct}"`,
    ].join("\n");
  }

  // Comparatives / superlatives
  if (/comparative|superlative|more.*most|___er|___est/.test(p)) {
    return [
      `💡 Comparatives & Superlatives`,
      `Short adjectives: add -er / -est  (tall → taller → tallest)`,
      `Long adjectives (2+ syllables): use more / most  (beautiful → more beautiful → most beautiful)`,
      `Irregular: good → better → best | bad → worse → worst | far → farther → farthest`,
      `❌ You chose: "${chosen}"`,
      `✅ Correct: "${correct}"`,
    ].join("\n");
  }

  // Pronouns
  if (/pronoun|subject pronoun|object pronoun|possessive/.test(p)) {
    return [
      `💡 Pronouns`,
      `Subject (does the action): I, you, he, she, it, we, they`,
      `Object (receives the action): me, you, him, her, it, us, them`,
      `Possessive adjective: my, your, his, her, its, our, their`,
      `Possessive pronoun: mine, yours, his, hers, ours, theirs`,
      `❌ You chose: "${chosen}"`,
      `✅ Correct: "${correct}"`,
    ].join("\n");
  }

  // Opposite / antonym
  if (/opposite|antonym/.test(p)) {
    return [
      `💡 Antonyms (Opposites)`,
      `The opposite of a word means it has the completely reversed meaning.`,
      `❌ You chose: "${chosen}" — this is NOT the opposite.`,
      `✅ Correct opposite: "${correct}"`,
      `💬 Tip: Build a list of common antonym pairs to memorise!`,
    ].join("\n");
  }

  // Synonym
  if (/synonym|same meaning|closest meaning/.test(p)) {
    return [
      `💡 Synonyms (Same/Similar Meaning)`,
      `A synonym is a word with the same or very similar meaning.`,
      `❌ You chose: "${chosen}" — this doesn't have the same meaning.`,
      `✅ The correct synonym: "${correct}"`,
    ].join("\n");
  }

  // Reported speech
  if (/reported speech|indirect speech/.test(p)) {
    return [
      `💡 Reported Speech`,
      `Direct → Indirect: tense shifts back one step`,
      `  "I eat" → he said he ate`,
      `  "I am eating" → he said he was eating`,
      `  "I will go" → he said he would go`,
      `  "I don't know" → he said he didn't know`,
      `❌ You chose: "${chosen}"`,
      `✅ Correct: "${correct}"`,
    ].join("\n");
  }

  // Vocabulary / meaning
  if (/mean|meaning|definition|what does/.test(p)) {
    return [
      `💡 Vocabulary`,
      `❌ You chose: "${chosen}" — that is NOT the correct meaning.`,
      `✅ "${correct}" is the right definition.`,
      `💬 Tip: Look for context clues in the question, and try using the word in a sentence to check if it fits.`,
    ].join("\n");
  }

  // Spelling
  if (/spell|correct spelling|which is spelled/.test(p)) {
    return [
      `💡 Spelling`,
      `❌ You chose: "${chosen}" — that is misspelled.`,
      `✅ The correct spelling is: "${correct}"`,
      `💬 Tip: Break the word into syllables and sound it out. Watch for silent letters and double letters.`,
    ].join("\n");
  }

  // Parts of speech
  if (/noun|verb|adjective|adverb|part.*speech/.test(p)) {
    const posGuide: Record<string, string> = {
      noun: "A noun is a person, place, thing, or idea. (e.g. teacher, school, happiness)",
      verb: "A verb is an action or state word. (e.g. run, eat, is, think)",
      adjective: "An adjective describes a noun. (e.g. tall, happy, red)",
      adverb: "An adverb describes a verb/adjective/adverb. (e.g. quickly, very, often)",
    };
    const matched = Object.keys(posGuide).find((k) => p.includes(k));
    return [
      `💡 Parts of Speech`,
      matched ? posGuide[matched] : `Identify whether the word is a noun, verb, adjective, or adverb.`,
      `❌ You chose: "${chosen}"`,
      `✅ Correct: "${correct}"`,
    ].join("\n");
  }

  // Generic English fallback
  return [
    `💡 English Tip`,
    `❌ You chose: "${chosen}"`,
    `✅ Correct answer: "${correct}"`,
    `💬 Re-read the question carefully. Look for keywords like tense markers (yesterday, now, tomorrow), singular/plural signals, or context clues that point to the right answer.`,
  ].join("\n");
}

export function localExplain(input: ExplainRequest): string {
  const correct = input.options[input.correctIndex] ?? "";
  const chosen =
    input.playerChoice == null ? "没有作答（超时）" : (input.options[input.playerChoice] ?? "");
  const isCorrect = input.playerChoice === input.correctIndex;

  if (isCorrect) {
    if (input.subject === "math") {
      const steps = mathSteps(input.prompt, correct);
      return [
        `✅ 答对了！我们一起来回顾一下：`,
        ...steps,
      ].join("\n");
    }
    return `✅ 答对了！正确答案是「${correct}」。再读一遍题目，巩固一下为什么选这个。`;
  }

  // Wrong answer
  const header = `❌ 你选了「${chosen}」，正确答案是「${correct}」。\n题目：「${input.prompt}」\n`;

  if (input.subject === "math") {
    const steps = mathSteps(input.prompt, correct);
    return header + "\n" + steps.join("\n");
  }

  const subjectTip: Record<SubjectId, string> = {
    math: "",
    chinese: [
      `💡 解题思路：`,
      `先确定题目问的是什么类型——字义、反义词、近义词、成语，还是修辞手法？`,
      `然后逐一排除明显不符合的选项，找最贴切的答案。`,
      `✅ 正确答案是「${correct}」，记住这个选项！`,
    ].join("\n"),
    english: englishExplain(input.prompt, correct, chosen),
    malay: [
      `💡 Petunjuk:`,
      `Baca soalan dengan teliti — adakah ia menguji tatabahasa, kosa kata, atau maksud?`,
      `Buang pilihan yang jelas salah, kemudian pilih jawapan yang paling tepat.`,
      `✅ Jawapan yang betul ialah "${correct}".`,
    ].join("\n"),
    science: [
      `💡 解题思路：`,
      `把题目中的现象和你学过的科学概念对上号。`,
      `想想生活中的例子——光、热、力、水循环、动植物……找到最符合的选项。`,
      `✅ 正确答案是「${correct}」，记住这个知识点！`,
    ].join("\n"),
  };

  return header + subjectTip[input.subject];
}
