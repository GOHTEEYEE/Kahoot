"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { AnswerGrid } from "../AnswerGrid";
import { TimerBar } from "../TimerBar";
import { ChallengeResult } from "./ChallengeResult";
import { ChallengeShell } from "./ChallengeShell";
import type { ChallengeResult as Result } from "../../lib/challenge";
import { pickRushQuestions, QUESTION_TIME_MS, type Question } from "../../lib/questions";
import { rushPoints, rushRewards, RUSH_DURATION_MS } from "../../lib/rush";
import { grantRewards } from "../../lib/rewards";
import { addSubjectTrophies, getCurrentAccount, getSelectedSubject } from "../../lib/storage";
import type { StudentAccount } from "../../lib/account";
import type { SubjectId } from "../../lib/curriculum";
import { usePrefersReducedMotion } from "../../lib/usePrefersReducedMotion";
import { playSfx } from "../../lib/audio/sfx";
import { useAudioScene } from "../../lib/audio/useAudioScene";
import { getChallengeCopy } from "../../lib/i18n/challenge";
import { getSharedLabels } from "../../lib/i18n/labels";
import { useLocale } from "../../lib/i18n/useLocale";

type Phase = "play" | "result";

export function RushBattle() {
  const router = useRouter();
  const { locale } = useLocale();
  const challenge = getChallengeCopy(locale);
  const labels = getSharedLabels(locale);
  const reduced = usePrefersReducedMotion();
  useAudioScene("battle");
  const [account, setAccount] = useState<StudentAccount | null>(null);
  const [subject, setSubject] = useState<SubjectId>("math");
  const [phase, setPhase] = useState<Phase>("play");
  const [deck, setDeck] = useState<Question[]>([]);
  const [index, setIndex] = useState(0);
  const [runMs, setRunMs] = useState(RUSH_DURATION_MS);
  const [qMs, setQMs] = useState(QUESTION_TIME_MS);
  const [selected, setSelected] = useState<number | null>(null);
  const [reveal, setReveal] = useState(false);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [bestStreak, setBestStreak] = useState(0);
  const [correct, setCorrect] = useState(0);
  const [answered, setAnswered] = useState(0);
  const [pop, setPop] = useState("");
  const [result, setResult] = useState<Result | null>(null);
  const paid = useRef(false);
  const runEnd = useRef(0);
  const qEnd = useRef(0);

  const boot = useCallback(() => {
    const current = getCurrentAccount();
    if (!current) {
      router.replace("/auth");
      return;
    }
    const sub = getSelectedSubject();
    setAccount(current);
    setSubject(sub);
    setDeck(pickRushQuestions(current.grade));
    setIndex(0);
    setPhase("play");
    setScore(0);
    setStreak(0);
    setBestStreak(0);
    setCorrect(0);
    setAnswered(0);
    setSelected(null);
    setReveal(false);
    setPop("");
    setResult(null);
    paid.current = false;
    runEnd.current = performance.now() + RUSH_DURATION_MS;
    qEnd.current = performance.now() + QUESTION_TIME_MS;
    setRunMs(RUSH_DURATION_MS);
    setQMs(QUESTION_TIME_MS);
  }, [router]);

  useEffect(() => {
    const id = window.setTimeout(() => boot(), 0);
    return () => window.clearTimeout(id);
  }, [boot]);

  const finishRun = useCallback(
    (final: { score: number; correct: number; answered: number; best: number }) => {
      if (!account || paid.current) return;
      paid.current = true;
      const rewards = rushRewards(final.correct, final.score);
      grantRewards(account, subject, {
        gold: rewards.gold,
        fragments: rewards.fragments,
        xp: rewards.xp,
      });
      if (rewards.trophy > 0) addSubjectTrophies(account, subject, rewards.trophy);
      setResult({
        mode: "rush",
        score: final.score,
        correct: final.correct,
        total: final.answered,
        duration: RUSH_DURATION_MS,
        trophyEarned: rewards.trophy,
        goldEarned: rewards.gold,
        fragmentsEarned: rewards.fragments,
        xpEarned: rewards.xp,
      });
      setPhase("result");
    },
    [account, subject],
  );

  useEffect(() => {
    if (phase !== "play") return;
    const id = window.setInterval(() => {
      const leftRun = Math.max(0, runEnd.current - performance.now());
      const leftQ = Math.max(0, qEnd.current - performance.now());
      setRunMs(leftRun);
      setQMs(leftQ);
      if (leftRun <= 0) {
        window.clearInterval(id);
        window.setTimeout(() => {
          finishRun({ score, correct, answered, best: bestStreak });
        }, 0);
        return;
      }
      if (leftQ <= 0 && !reveal) {
        window.clearInterval(id);
        window.setTimeout(() => resolve(null), 0);
      }
    }, 50);
    return () => window.clearInterval(id);
    // resolve is recreated each render; interval restarts on index/reveal.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase, index, reveal, score, correct, answered, bestStreak, finishRun]);

  const question = deck[index % Math.max(deck.length, 1)];

  function nextQuestion(nextScore: number, nextCorrect: number, nextAnswered: number, nextBest: number) {
    if (runEnd.current - performance.now() <= 0) {
      finishRun({ score: nextScore, correct: nextCorrect, answered: nextAnswered, best: nextBest });
      return;
    }
    setIndex((i) => i + 1);
    setSelected(null);
    setReveal(false);
    setPop("");
    qEnd.current = performance.now() + QUESTION_TIME_MS;
    setQMs(QUESTION_TIME_MS);
  }

  function resolve(choice: number | null) {
    if (!question || reveal || phase !== "play") return;
    const isCorrect = choice !== null && choice === question.correctIndex;
    const nextStreak = isCorrect ? streak + 1 : 0;
    const gain = rushPoints(isCorrect, qMs, nextStreak);
    const nextScore = score + gain;
    const nextCorrect = correct + (isCorrect ? 1 : 0);
    const nextAnswered = answered + 1;
    const nextBest = Math.max(bestStreak, nextStreak);
    setSelected(choice);
    setReveal(true);
    setStreak(nextStreak);
    setBestStreak(nextBest);
    setScore(nextScore);
    setCorrect(nextCorrect);
    setAnswered(nextAnswered);
    setPop(isCorrect ? `CORRECT!  STREAK ×${nextStreak}  +${gain}` : "MISS");
    playSfx(isCorrect ? "correct" : "wrong");
    window.setTimeout(() => nextQuestion(nextScore, nextCorrect, nextAnswered, nextBest), 620);
  }

  if (!account || !question) {
    return <div className="flex flex-1 items-center justify-center text-[#6b5340]">{labels.preparing}</div>;
  }

  if (phase === "result" && result) {
    return (
      <ChallengeShell title={challenge.modes.rush.title} subtitle={challenge.modes.rush.description} backHref="/challenge">
        <ChallengeResult
          title="KNOWLEDGE RUSH COMPLETE"
          extra={`Best Streak ${bestStreak} · Answered ${result.total}`}
          fanfare={result.correct >= Math.max(1, Math.floor(result.total * 0.4)) ? "win" : "lose"}
          result={result}
          onAgain={boot}
          onHome={() => router.push("/challenge")}
        />
      </ChallengeShell>
    );
  }

  const seconds = Math.ceil(runMs / 1000);

  return (
    <ChallengeShell title={challenge.modes.rush.title} subtitle={challenge.modes.rush.description} backHref="/challenge">
      <div className="flex items-center justify-between gap-2">
        <div
          className={`hud-dark rounded-full px-3 py-1 font-[family-name:var(--font-display)] text-2xl font-bold text-[#ffe27a] ${
            seconds <= 8 && !reduced ? "animate-pulse" : ""
          }`}
        >
          TIME {seconds}
        </div>
        <div className="text-right">
          <p className="font-[family-name:var(--font-display)] text-xl font-bold text-[#2a2118]">{score}</p>
          <p className="text-[10px] font-extrabold text-[#8a5a18]">Q{answered + 1}</p>
        </div>
      </div>
      <div className="mt-2">
        <TimerBar remainingMs={runMs} totalMs={RUSH_DURATION_MS} />
      </div>

      {streak > 1 ? (
        <motion.p
          key={streak}
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="mt-2 text-center font-[family-name:var(--font-display)] text-sm font-bold text-[#d88912]"
        >
          STREAK ×{streak}
        </motion.p>
      ) : (
        <div className="mt-2 h-5" />
      )}

      <div className="mt-2 rounded-[1.4rem] bg-white/80 px-4 py-6 text-center shadow-[0_8px_18px_rgba(40,25,10,0.1)]">
        <p className="font-[family-name:var(--font-display)] text-[22px] font-bold leading-snug text-[#2a2118]">
          {question.prompt}
        </p>
      </div>

      <div className="mt-3">
        <AnswerGrid
          dealKey={index}
          options={question.options}
          disabled={reveal}
          selectedIndex={selected}
          correctIndex={question.correctIndex}
          reveal={reveal}
          onSelect={(i) => resolve(i)}
        />
      </div>
      {pop ? (
        <p className="mt-3 text-center text-sm font-extrabold text-[#2a2118]">{pop}</p>
      ) : null}
    </ChallengeShell>
  );
}
