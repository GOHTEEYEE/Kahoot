"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { AnswerGrid } from "../AnswerGrid";
import { TimerBar } from "../TimerBar";
import { BossHealthBar } from "./BossHealthBar";
import { ChallengeResult } from "./ChallengeResult";
import { ChallengeShell } from "./ChallengeShell";
import type { ChallengeResult as Result } from "../../lib/challenge";
import {
  BOSS_HEARTS,
  BOSS_QUESTIONS,
  bossDamage,
  buildBoss,
  type Boss,
} from "../../lib/boss";
import { pickMatchQuestions, QUESTION_TIME_MS, type Question } from "../../lib/questions";
import { grantRewards } from "../../lib/rewards";
import { getCurrentAccount, getSelectedSubject, getSubjectStats } from "../../lib/storage";
import type { StudentAccount } from "../../lib/account";
import type { Grade, SubjectId } from "../../lib/curriculum";
import { usePrefersReducedMotion } from "../../lib/usePrefersReducedMotion";
import { playSfx } from "../../lib/audio/sfx";
import { useAudioScene } from "../../lib/audio/useAudioScene";
import { getChallengeCopy } from "../../lib/i18n/challenge";
import { localizedGrade } from "../../lib/i18n/home";
import { getPlayCopy } from "../../lib/i18n/play";
import { getSharedLabels } from "../../lib/i18n/labels";
import { useLocale } from "../../lib/i18n/useLocale";

type Phase = "play" | "result";

export function BossBattle() {
  const router = useRouter();
  const { locale } = useLocale();
  const play = getPlayCopy(locale);
  const challenge = getChallengeCopy(locale);
  const labels = getSharedLabels(locale);
  const reduced = usePrefersReducedMotion();
  useAudioScene("battle");
  const [account, setAccount] = useState<StudentAccount | null>(null);
  const [subject, setSubject] = useState<SubjectId>("math");
  const [grade, setGrade] = useState<Grade>(1);
  const [boss, setBoss] = useState<Boss | null>(null);
  const [hp, setHp] = useState(0);
  const [hearts, setHearts] = useState(BOSS_HEARTS);
  const [deck, setDeck] = useState<Question[]>([]);
  const [index, setIndex] = useState(0);
  const [qMs, setQMs] = useState(QUESTION_TIME_MS);
  const [selected, setSelected] = useState<number | null>(null);
  const [reveal, setReveal] = useState(false);
  const [flash, setFlash] = useState("");
  const [shake, setShake] = useState(false);
  const [phase, setPhase] = useState<Phase>("play");
  const [result, setResult] = useState<Result | null>(null);
  const [correct, setCorrect] = useState(0);
  const paid = useRef(false);
  const qEnd = useRef(0);
  const started = useRef(0);

  const boot = useCallback(() => {
    const current = getCurrentAccount();
    if (!current) {
      router.replace("/auth");
      return;
    }
    const sub = getSelectedSubject();
    const trophies = getSubjectStats(current, sub).trophies;
    const nextBoss = buildBoss(sub, current.grade, trophies);
    setAccount(current);
    setSubject(sub);
    setGrade(current.grade);
    setBoss(nextBoss);
    setHp(nextBoss.maxHp);
    setHearts(BOSS_HEARTS);
    setDeck(pickMatchQuestions(current.grade, sub, BOSS_QUESTIONS));
    setIndex(0);
    setSelected(null);
    setReveal(false);
    setFlash("");
    setPhase("play");
    setResult(null);
    setCorrect(0);
    paid.current = false;
    started.current = performance.now();
    qEnd.current = performance.now() + QUESTION_TIME_MS;
    setQMs(QUESTION_TIME_MS);
  }, [router]);

  useEffect(() => {
    const id = window.setTimeout(() => boot(), 0);
    return () => window.clearTimeout(id);
  }, [boot]);

  useEffect(() => {
    if (phase !== "play" || reveal) return;
    const id = window.setInterval(() => {
      const left = Math.max(0, qEnd.current - performance.now());
      setQMs(left);
      if (left <= 0) {
        window.clearInterval(id);
        window.setTimeout(() => resolve(null), 0);
      }
    }, 50);
    return () => window.clearInterval(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase, reveal, index]);

  const question = deck[index];

  function endRun(win: boolean, hits: number) {
    if (!account || !boss || paid.current) return;
    paid.current = true;
    const grant = win
      ? boss.reward
      : { gold: Math.floor(boss.reward.gold / 4), fragments: 1, xp: 6 };
    grantRewards(account, subject, grant);
    setResult({
      mode: "boss",
      score: Math.max(0, boss.maxHp - hp),
      correct: hits,
      total: deck.length,
      duration: performance.now() - started.current,
      trophyEarned: 0,
      goldEarned: grant.gold,
      fragmentsEarned: grant.fragments,
      xpEarned: grant.xp,
    });
    setPhase("result");
  }

  function advance(nextHp: number, nextHearts: number, nextCorrect: number) {
    if (nextHp <= 0) {
      endRun(true, nextCorrect);
      return;
    }
    if (nextHearts <= 0) {
      endRun(false, nextCorrect);
      return;
    }
    const nextIndex = index + 1;
    if (nextIndex >= deck.length) {
      endRun(nextHp <= 0, nextCorrect);
      return;
    }
    setIndex(nextIndex);
    setSelected(null);
    setReveal(false);
    setFlash("");
    qEnd.current = performance.now() + QUESTION_TIME_MS;
    setQMs(QUESTION_TIME_MS);
  }

  function resolve(choice: number | null) {
    if (!question || reveal || !boss) return;
    const isCorrect = choice !== null && choice === question.correctIndex;
    const hit = bossDamage(isCorrect, qMs, QUESTION_TIME_MS);
    const nextHp = Math.max(0, hp - hit.damage);
    const nextHearts = isCorrect ? hearts : hearts - 1;
    const nextCorrect = correct + (isCorrect ? 1 : 0);
    setSelected(choice);
    setReveal(true);
    setHp(nextHp);
    setHearts(nextHearts);
    setCorrect(nextCorrect);
    if (hit.crit) {
      setFlash("CRITICAL HIT!");
      setShake(true);
      window.setTimeout(() => setShake(false), 420);
      playSfx("correct");
      playSfx("hit");
    } else if (isCorrect) {
      setFlash("ATTACK!");
      playSfx("correct");
    } else {
      setFlash("MISS!");
      playSfx("wrong");
    }
    window.setTimeout(() => advance(nextHp, nextHearts, nextCorrect), 800);
  }

  if (!account || !boss || !question) {
    return <div className="flex flex-1 items-center justify-center text-[#6b5340]">{labels.preparing}</div>;
  }

  if (phase === "result" && result) {
    const win = hp <= 0;
    return (
      <ChallengeShell title={challenge.modes.boss.title} subtitle={locale === "zh" ? boss.name : boss.nameEn} backHref="/challenge">
        <ChallengeResult
          title={win ? "BOSS DEFEATED" : "RETRY THE BOSS"}
          fanfare={win ? "win" : "lose"}
          extra={win ? play.bossDown(locale === "zh" ? boss.name : boss.nameEn) : play.bossRetry}
          result={result}
          onAgain={boot}
          onHome={() => router.push("/challenge")}
        />
      </ChallengeShell>
    );
  }

  return (
    <ChallengeShell title={challenge.modes.boss.title} subtitle={locale === "zh" ? boss.name : boss.nameEn} backHref="/challenge">
      <motion.div
        animate={shake && !reduced ? { x: [0, -8, 8, -5, 5, 0] } : { x: 0 }}
        className="hud-dark rounded-[1.25rem] px-3 py-3"
      >
        <p className="text-center text-[10px] font-extrabold tracking-[0.16em] text-[#c4b08a] uppercase">
          Boss
        </p>
        <h2 className="text-center font-[family-name:var(--font-display)] text-[22px] font-bold text-[#fff6e4]">
          {boss ? (locale === "zh" ? boss.name : boss.nameEn) : ""}
        </h2>
        <div className="mt-2">
          <BossHealthBar current={hp} max={boss.maxHp} />
        </div>
        <p className="mt-2 text-center text-[16px] tracking-wide" aria-label={`${hearts} hearts`}>
          {"❤️".repeat(hearts)}
          <span className="opacity-30">{"🖤".repeat(Math.max(0, BOSS_HEARTS - hearts))}</span>
        </p>
      </motion.div>

      <p className="mt-2 text-center text-[11px] font-extrabold text-[#8a5a18]">
        Q{index + 1}/{deck.length} · {localizedGrade(grade, locale)}
      </p>
      <TimerBar remainingMs={qMs} totalMs={QUESTION_TIME_MS} />

      <div className="mt-3 rounded-[1.4rem] bg-white/80 px-4 py-6 text-center shadow-[0_8px_18px_rgba(40,25,10,0.1)]">
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
      {flash ? (
        <p className="mt-3 text-center font-[family-name:var(--font-display)] text-lg font-bold text-[#d44532]">
          {flash}
        </p>
      ) : null}
    </ChallengeShell>
  );
}
