"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { AdventureLocationCard } from "./AdventureLocationCard";
import { AnswerGrid } from "../AnswerGrid";
import { ChallengeResult } from "./ChallengeResult";
import { ChallengeShell } from "./ChallengeShell";
import type { ChallengeResult as Result } from "../../lib/challenge";
import {
  adventureLocations,
  markAdventureClear,
  readAdventureClears,
  type AdventureLocation,
} from "../../lib/adventure";
import { pickByCategory, QUESTION_TIME_MS, type Question } from "../../lib/questions";
import { grantRewards } from "../../lib/rewards";
import { getCurrentAccount, getSelectedSubject, getSubjectStats } from "../../lib/storage";
import type { StudentAccount } from "../../lib/account";
import type { SubjectId } from "../../lib/curriculum";
import { playSfx } from "../../lib/audio/sfx";
import { useAudioScene } from "../../lib/audio/useAudioScene";
import { getChallengeCopy } from "../../lib/i18n/challenge";
import { localizedSubject, localizedWorldName } from "../../lib/i18n/home";
import { getPlayCopy } from "../../lib/i18n/play";
import { getSharedLabels } from "../../lib/i18n/labels";
import { useLocale } from "../../lib/i18n/useLocale";

type Phase = "map" | "play" | "result";

export function AdventureMap() {
  const router = useRouter();
  const { locale } = useLocale();
  const play = getPlayCopy(locale);
  const challenge = getChallengeCopy(locale);
  const labels = getSharedLabels(locale);
  const [account, setAccount] = useState<StudentAccount | null>(null);
  const [subject, setSubject] = useState<SubjectId>("math");
  const [trophies, setTrophies] = useState(0);
  const [clears, setClears] = useState<string[]>([]);
  const [phase, setPhase] = useState<Phase>("map");
  const [loc, setLoc] = useState<AdventureLocation | null>(null);
  const [deck, setDeck] = useState<Question[]>([]);
  const [index, setIndex] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [reveal, setReveal] = useState(false);
  const [correct, setCorrect] = useState(0);
  const [result, setResult] = useState<Result | null>(null);
  const paid = useRef(false);
  useAudioScene(phase === "play" || phase === "result" ? "battle" : "home");

  const boot = useCallback(() => {
    const current = getCurrentAccount();
    if (!current) {
      router.replace("/auth");
      return;
    }
    const sub = getSelectedSubject();
    setAccount(current);
    setSubject(sub);
    setTrophies(getSubjectStats(current, sub).trophies);
    setClears(readAdventureClears(current.id));
    setPhase("map");
    setLoc(null);
    setResult(null);
    paid.current = false;
  }, [router]);

  useEffect(() => {
    const id = window.setTimeout(() => boot(), 0);
    return () => window.clearTimeout(id);
  }, [boot]);

  function enter(location: AdventureLocation) {
    if (!account) return;
    const questions = pickByCategory(account.grade, location.questionCategory, 5);
    setLoc(location);
    setDeck(questions);
    setIndex(0);
    setSelected(null);
    setReveal(false);
    setCorrect(0);
    setPhase("play");
    paid.current = false;
    playSfx("whoosh");
  }

  function finish(hits: number) {
    if (!account || !loc || paid.current) return;
    paid.current = true;
    const cleared = hits >= 3;
    const grant = cleared
      ? loc.reward
      : { gold: Math.floor(loc.reward.gold / 3), fragments: 1, xp: 4 };
    grantRewards(account, subject, grant);
    if (cleared) setClears(markAdventureClear(account.id, loc.id));
    setResult({
      mode: "adventure",
      score: hits * 100,
      correct: hits,
      total: deck.length,
      duration: deck.length * QUESTION_TIME_MS,
      trophyEarned: 0,
      goldEarned: grant.gold,
      fragmentsEarned: grant.fragments,
      xpEarned: grant.xp,
    });
    setPhase("result");
  }

  function resolve(choice: number) {
    if (!deck[index] || reveal) return;
    const ok = choice === deck[index].correctIndex;
    const hits = correct + (ok ? 1 : 0);
    setSelected(choice);
    setReveal(true);
    setCorrect(hits);
    playSfx(ok ? "correct" : "wrong");
    window.setTimeout(() => {
      const next = index + 1;
      if (next >= deck.length) {
        finish(hits);
        return;
      }
      setIndex(next);
      setSelected(null);
      setReveal(false);
    }, 700);
  }

  if (!account) {
    return <div className="flex flex-1 items-center justify-center text-[#6b5340]">{labels.preparing}</div>;
  }

  const locations = adventureLocations(subject);
  const question = deck[index];

  if (phase === "result" && result && loc) {
    return (
      <ChallengeShell title={challenge.modes.adventure.title} subtitle={loc.nameEn} backHref="/challenge">
        <ChallengeResult
          title={result.correct >= 3 ? "LOCATION CLEARED" : "KEEP EXPLORING"}
          fanfare={result.correct >= 3 ? "win" : "lose"}
          extra={locale === "zh" ? loc.name : loc.nameEn}
          result={result}
          onAgain={() => enter(loc)}
          onHome={() => boot()}
        />
      </ChallengeShell>
    );
  }

  if (phase === "play" && loc && question) {
    return (
      <ChallengeShell
        title={locale === "zh" ? loc.name : loc.nameEn}
        subtitle={loc.nameEn}
        backHref="/challenge"
      >
        <p className="mb-2 text-center text-[11px] font-extrabold text-[#8a5a18]">
          Q{index + 1}/{deck.length}
        </p>
        <div className="rounded-[1.4rem] bg-white/80 px-4 py-6 text-center shadow-[0_8px_18px_rgba(40,25,10,0.1)]">
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
            onSelect={resolve}
          />
        </div>
      </ChallengeShell>
    );
  }

  return (
    <ChallengeShell
      title={challenge.modes.adventure.title}
      subtitle={`${localizedSubject(subject, locale)} · ${localizedWorldName(subject, locale)}`}
      backHref="/challenge"
    >
      <p className="mb-3 text-center text-[12px] font-bold text-[#6b5340]">{play.adventureHint}</p>
      <div className="flex flex-col gap-2.5">
        {locations.map((location) => {
          const locked = trophies < location.unlockedAtTrophy;
          return (
            <AdventureLocationCard
              key={location.id}
              location={location}
              locked={locked}
              cleared={clears.includes(location.id)}
              remain={Math.max(0, location.unlockedAtTrophy - trophies)}
              onEnter={() => enter(location)}
            />
          );
        })}
      </div>
    </ChallengeShell>
  );
}
