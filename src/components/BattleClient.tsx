"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { AnswerGrid } from "./AnswerGrid";
import { CountdownOverlay } from "./CountdownOverlay";
import { MatchScreen } from "./MatchScreen";
import { ResultScreen } from "./ResultScreen";
import { ReviewBox, type ReviewItem } from "./ReviewBox";
import { TimerBar } from "./TimerBar";
import { createBotOpponent, simulateBotAnswers, type BotOpponent } from "../lib/bot";
import { foeAnswers, getFriendRoom, submitFriendAnswer } from "../lib/friend";
import { asBotShape, consumePendingOpponent, type BattleOpponent } from "../lib/opponent";
import {
  pickMatchQuestions,
  QUESTION_TIME_MS,
  scoreForAnswer,
  type Question,
} from "../lib/questions";
import {
  getCurrentAccount,
  getSelectedSubject,
  getSubjectStats,
  recordSubjectMatch,
} from "../lib/storage";
import type { StudentAccount } from "../lib/account";
import {
  getDungeon,
  type Grade,
  type SubjectId,
} from "../lib/curriculum";
import { playSfx } from "../lib/audio/sfx";
import { useAudioScene } from "../lib/audio/useAudioScene";
import { localizedGrade, localizedSubject } from "../lib/i18n/home";
import { getSharedLabels } from "../lib/i18n/labels";
import { getPlayCopy } from "../lib/i18n/play";
import { useLocale } from "../lib/i18n/useLocale";
import {
  applyTrophyChange,
  calcTrophyDelta,
  decideResult,
  type MatchResult,
} from "../lib/trophy";

type Phase = "match" | "countdown" | "battle" | "result";

type RoundState = {
  questions: Question[];
  index: number;
  playerScores: number[];
  playerChoices: (number | null)[];
  botScores: number[];
  botTotal: number;
  selected: number | null;
  reveal: boolean;
  remainingMs: number;
  locked: boolean;
};

export function BattleClient() {
  const router = useRouter();
  const { locale } = useLocale();
  const play = getPlayCopy(locale);
  const labels = getSharedLabels(locale);
  useAudioScene("battle");
  const [account, setAccount] = useState<StudentAccount | null>(null);
  const [grade, setGrade] = useState<Grade>(1);
  const [subject, setSubject] = useState<SubjectId>("math");
  const [phase, setPhase] = useState<Phase>("match");
  const [opponent, setOpponent] = useState<BotOpponent | null>(null);
  const [searching, setSearching] = useState(true);
  const [matchKind, setMatchKind] = useState<"arena" | "friend">("arena");
  const [round, setRound] = useState<RoundState | null>(null);
  const [lastGain, setLastGain] = useState<number | null>(null);
  const [reviewOpen, setReviewOpen] = useState(false);
  const [reviewItems, setReviewItems] = useState<ReviewItem[]>([]);
  const [outcome, setOutcome] = useState<{
    result: MatchResult;
    playerScore: number;
    opponentScore: number;
    trophiesBefore: number;
    trophiesAfter: number;
    delta: number;
  } | null>(null);

  const timerRef = useRef<number | null>(null);
  const deadlineRef = useRef<number>(0);
  const matchStarted = useRef(false);
  const prefsRef = useRef({ grade: 1 as Grade, subject: "math" as SubjectId });
  const pendingFriendRef = useRef<BattleOpponent | null>(null);
  const [foeLiveScore, setFoeLiveScore] = useState(0);
  const [waitingFoe, setWaitingFoe] = useState(false);

  const prepareBattle = useCallback((bot: BotOpponent, questions?: Question[]) => {
    const { grade: g, subject: s } = prefsRef.current;
    const picked = questions && questions.length > 0 ? questions : pickMatchQuestions(g, s);
    const botSim = simulateBotAnswers(picked, bot.trophies);
    setRound({
      questions: picked,
      index: 0,
      playerScores: [],
      playerChoices: [],
      botScores: questions?.length ? picked.map(() => 0) : botSim.scores,
      botTotal: questions?.length ? 0 : botSim.total,
      selected: null,
      reveal: false,
      remainingMs: QUESTION_TIME_MS,
      locked: false,
    });
  }, []);

  const startMatchmaking = useCallback(
    async (player: StudentAccount, sub: SubjectId) => {
      setPhase("match");
      setSearching(true);
      setOpponent(null);
      setOutcome(null);
      setRound(null);
      setLastGain(null);
      setReviewOpen(false);
      setReviewItems([]);
      setFoeLiveScore(0);
      setWaitingFoe(false);

      const trophies = getSubjectStats(player, sub).trophies;
      const pending = consumePendingOpponent();
      pendingFriendRef.current = pending?.type === "friend" ? pending : null;
      const isFriend = pending?.type === "friend";
      setMatchKind(isFriend ? "friend" : "arena");

      let bot: BotOpponent = pending ? asBotShape(pending) : createBotOpponent(trophies);
      let sharedQuestions: Question[] | undefined;

      if (isFriend && pending?.roomCode) {
        const room = await getFriendRoom(pending.roomCode);
        if (room?.guest) {
          const foe = pending.role === "host" ? room.guest : room.host;
          bot = asBotShape({
            type: "friend",
            id: foe.id,
            nickname: foe.nickname,
            trophies: foe.trophies,
          });
          sharedQuestions = room.questions;
        }
      }

      window.setTimeout(() => {
        setOpponent(bot);
        setSearching(false);
        prepareBattle(bot, sharedQuestions);
        window.setTimeout(() => setPhase("countdown"), isFriend ? 700 : 900);
      }, isFriend ? 450 : 2200);
    },
    [prepareBattle],
  );

  useEffect(() => {
    const current = getCurrentAccount();
    if (!current) {
      router.replace("/auth");
      return;
    }
    const sub = getSelectedSubject();
    setAccount(current);
    setGrade(current.grade);
    setSubject(sub);
    prefsRef.current = { grade: current.grade, subject: sub };
    if (!matchStarted.current) {
      matchStarted.current = true;
      startMatchmaking(current, sub);
    }
  }, [router, startMatchmaking]);

  const clearTimer = useCallback(() => {
    if (timerRef.current != null) {
      window.clearInterval(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  const finishQuestion = useCallback(
    (choice: number | null, remainingMs: number) => {
      setRound((prev) => {
        if (!prev || prev.locked) return prev;
        const question = prev.questions[prev.index];
        const correct = choice !== null && choice === question.correctIndex;
        const points = scoreForAnswer(correct, remainingMs);
        playSfx(correct ? "correct" : "wrong");
        setLastGain(points > 0 ? points : 0);

        const pending = pendingFriendRef.current;
        const player = getCurrentAccount();
        if (pending?.roomCode && player) {
          void submitFriendAnswer({
            code: pending.roomCode,
            playerId: player.id,
            index: prev.index,
            choice,
            remainingMs,
          });
        }

        return {
          ...prev,
          selected: choice,
          reveal: true,
          locked: true,
          remainingMs,
          playerScores: [...prev.playerScores, points],
          playerChoices: [...prev.playerChoices, choice],
        };
      });
    },
    [],
  );

  useEffect(() => {
    if (phase !== "battle" || !round || round.locked || round.reveal) return;

    deadlineRef.current = performance.now() + QUESTION_TIME_MS;
    clearTimer();
    timerRef.current = window.setInterval(() => {
      const left = Math.max(0, deadlineRef.current - performance.now());
      setRound((prev) => (prev ? { ...prev, remainingMs: left } : prev));
      if (left <= 0) {
        clearTimer();
        finishQuestion(null, 0);
      }
    }, 50);

    return clearTimer;
  }, [phase, round?.index, round?.locked, round?.reveal, clearTimer, finishQuestion]);

  useEffect(() => {
    const pending = pendingFriendRef.current;
    if (!pending?.roomCode || !account) return;
    if (phase !== "battle" && phase !== "countdown" && phase !== "match") return;

    const timer = window.setInterval(async () => {
      const room = await getFriendRoom(pending.roomCode!);
      if (!room) return;
      const answers = foeAnswers(room, account.id);
      const total = answers.reduce((sum, item) => sum + item.score, 0);
      setFoeLiveScore(total);
      setRound((prev) => {
        if (!prev) return prev;
        const botScores = prev.questions.map((_, i) => answers[i]?.score ?? 0);
        return {
          ...prev,
          botScores,
          botTotal: total,
        };
      });
    }, 500);

    return () => window.clearInterval(timer);
  }, [account, phase]);

  useEffect(() => {
    if (!round?.reveal || !account || !opponent || phase !== "battle") return;

    const pending = pendingFriendRef.current;
    let cancelled = false;

    async function maybeAdvance() {
      let latestFoeTotal = round!.botTotal;
      if (pending?.roomCode) {
        setWaitingFoe(true);
        const started = Date.now();
        while (!cancelled && Date.now() - started < 14000) {
          const room = await getFriendRoom(pending.roomCode);
          const answers = room ? foeAnswers(room, account!.id) : [];
          latestFoeTotal = answers.reduce((sum, item) => sum + item.score, 0);
          if (answers[round!.index] != null) break;
          await new Promise((r) => window.setTimeout(r, 350));
        }
        if (!cancelled) setWaitingFoe(false);
      }
      if (cancelled) return;

      await new Promise((r) => window.setTimeout(r, 950));
      if (cancelled) return;

      const nextIndex = round!.index + 1;
      if (nextIndex >= round!.questions.length) {
        const playerScore = round!.playerScores.reduce((a, b) => a + b, 0);
        const opponentScore = latestFoeTotal;
        const result = decideResult(playerScore, opponentScore);
        const before = getSubjectStats(account!, subject).trophies;
        const delta = calcTrophyDelta(result, before, opponent!.trophies);
        const trophiesAfter = applyTrophyChange(before, delta);
        const updated = recordSubjectMatch(account!, subject, result, trophiesAfter);
        setAccount(updated);

        const items: ReviewItem[] = round!.questions.map((q, i) => ({
          question: q,
          playerChoice: round!.playerChoices[i] ?? null,
          points: round!.playerScores[i] ?? 0,
        }));
        setReviewItems(items);

        setOutcome({
          result,
          playerScore,
          opponentScore,
          trophiesBefore: before,
          trophiesAfter,
          delta,
        });
        setPhase("result");
        return;
      }

      setLastGain(null);
      setRound((prev) => {
        if (!prev) return prev;
        return {
          ...prev,
          index: nextIndex,
          selected: null,
          reveal: false,
          remainingMs: QUESTION_TIME_MS,
          locked: false,
        };
      });
    }

    void maybeAdvance();
    return () => {
      cancelled = true;
    };
  }, [round?.reveal, round?.index, account, opponent, phase, subject]);

  const onCountdownDone = useCallback(() => {
    setPhase("battle");
  }, []);

  const currentQuestion = useMemo(() => {
    if (!round) return null;
    return round.questions[round.index];
  }, [round]);

  const playerLiveScore = round?.playerScores.reduce((a, b) => a + b, 0) ?? 0;
  const botLiveScore =
    matchKind === "friend"
      ? foeLiveScore
      : (round?.botScores.slice(0, round.playerScores.length).reduce((a, b) => a + b, 0) ?? 0);

  function onSelect(index: number) {
    if (!round || round.locked) return;
    clearTimer();
    finishQuestion(index, round.remainingMs);
  }

  function rematch() {
    if (matchKind === "friend") {
      router.push("/challenge/friend");
      return;
    }
    if (!account) return;
    matchStarted.current = true;
    void startMatchmaking(account, subject);
  }

  if (!account) {
    return (
      <div className="flex flex-1 items-center justify-center text-[var(--ink-soft)]">
        {labels.preparing}
      </div>
    );
  }

  const matchPlayer = {
    nickname: account.displayName,
    trophies: getSubjectStats(account, subject).trophies,
  };

  if (phase === "match" || phase === "countdown") {
    return (
      <>
        <MatchScreen
          player={matchPlayer}
          opponent={opponent}
          searching={searching}
          kind={matchKind}
          topic={`${localizedGrade(grade, locale)} · ${getDungeon(subject).dungeonName}`}
        />
        {phase === "countdown" ? <CountdownOverlay onDone={onCountdownDone} /> : null}
      </>
    );
  }

  if (phase === "result" && outcome && opponent) {
    return (
      <>
        <ResultScreen
          result={outcome.result}
          playerScore={outcome.playerScore}
          opponentScore={outcome.opponentScore}
          opponentName={opponent.nickname}
          trophiesBefore={outcome.trophiesBefore}
          trophiesAfter={outcome.trophiesAfter}
          delta={outcome.delta}
          subjectName={localizedSubject(subject, locale)}
          onRematch={rematch}
          onOpenReview={() => setReviewOpen(true)}
        />
        <ReviewBox
          open={reviewOpen}
          subject={subject}
          items={reviewItems}
          onClose={() => setReviewOpen(false)}
        />
      </>
    );
  }

  if (!round || !currentQuestion || !opponent) {
    return null;
  }

  const feedbackText =
    round.selected === currentQuestion.correctIndex
      ? play.correctGain(round.playerScores[round.playerScores.length - 1] ?? 0)
      : round.selected == null
        ? play.timesUp
        : play.wrongNext;

  return (
    <section className="animate-phase-in mx-auto flex w-full max-w-2xl flex-1 flex-col gap-5 px-5 py-6">
      <div className="flex items-center justify-between gap-3 text-sm font-extrabold">
        <div className="relative rounded-2xl bg-[var(--brand)] px-3 py-2 text-white transition-transform">
          {account.displayName} · {playerLiveScore}
          {round.reveal && lastGain != null && lastGain > 0 ? (
            <span className="animate-score-float absolute -top-3 right-2 text-xs text-[var(--accent)]">
              +{lastGain}
            </span>
          ) : null}
        </div>
        <div className="text-center text-[var(--ink-soft)]">
          <div>
            {round.index + 1}/{round.questions.length}
          </div>
          <div className="text-xs font-bold">
            {localizedGrade(grade, locale)} · {getDungeon(subject).dungeonName}
          </div>
        </div>
        <div className="rounded-2xl bg-white/80 px-3 py-2 text-[var(--ink)]">
          {opponent.nickname} · {botLiveScore}
        </div>
      </div>

      <TimerBar remainingMs={round.remainingMs} totalMs={QUESTION_TIME_MS} />

      <div
        key={`q-${round.index}`}
        className="animate-pop rounded-[2rem] bg-white/75 px-5 py-8 text-center shadow-[var(--shadow)] backdrop-blur"
      >
        <p className="font-[family-name:var(--font-display)] text-2xl font-semibold leading-snug text-[var(--ink)] sm:text-3xl">
          {currentQuestion.prompt}
        </p>
      </div>

      <AnswerGrid
        dealKey={round.index}
        options={currentQuestion.options}
        disabled={round.locked}
        selectedIndex={round.selected}
        correctIndex={currentQuestion.correctIndex}
        reveal={round.reveal}
        onSelect={onSelect}
      />

      {round.reveal ? (
        <p
          className={`text-center text-base font-extrabold animate-pop ${
            round.selected === currentQuestion.correctIndex
              ? "text-[var(--brand-deep)]"
              : "text-[var(--red)]"
          }`}
        >
          {waitingFoe ? play.waitingFriend : feedbackText}
        </p>
      ) : null}
    </section>
  );
}
