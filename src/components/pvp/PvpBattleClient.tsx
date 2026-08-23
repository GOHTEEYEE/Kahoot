"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { CountdownOverlay } from "../CountdownOverlay";
import { AnswerButton } from "./AnswerButton";
import { BattleArena } from "./BattleArena";
import { BattleEvent } from "./BattleEvent";
import { BattleTimer } from "./Timer";
import { EmoteBar } from "./EmoteBar";
import { ItemBar } from "./ItemBar";
import { QuestionCard } from "./QuestionCard";
import { QuestionProgress } from "./QuestionProgress";
import { playSfx } from "../../lib/audio/sfx";
import { useAudioScene } from "../../lib/audio/useAudioScene";
import { getCurrentAccount, getSelectedSubject, getSubjectStats } from "../../lib/storage";
import { getMockEconomy, getSubjectWorld } from "../../lib/worlds";
import { pickMatchQuestions } from "../../lib/questions";
import { localizedSubject } from "../../lib/i18n/home";
import { getPvpCopy } from "../../lib/i18n/pvp";
import { useLocale } from "../../lib/i18n/useLocale";
import { getSharedLabels } from "../../lib/i18n/labels";
import {
  PVP_PLAYER_ATTACK_MS,
  PVP_PLAYER_IMPACT_MS,
  PVP_PLAYER_SWING_MS,
  PVP_QUESTIONS,
  PVP_QUESTION_CAP_MS,
  PVP_RESOLVE_GAP_MS,
} from "../../lib/pvp/config";
import {
  applyDamage,
  bothAnswered,
  createFighter,
  createMatch,
  markFreezeUsed,
  resetForNextQuestion,
  resolveAnswer,
  useHaste,
  useScout,
  useShield,
  winnerOf,
} from "../../lib/pvp/engine";
import { PLAYER_HERO, OPPONENT_HERO } from "../../lib/pvp/heroes";
import type { ItemId } from "../../lib/pvp/items";
import { applyPvpRewardsOnce, buildPvpMatchResult, savePvpMatchResult } from "../../lib/pvp/matchResult";
import { recordBattleLog } from "../../lib/pvp/battleLog";
import { createMockOpponentChannel } from "../../lib/pvp/mockOpponent";
import type { AttackEvent, EmoteId, KnowledgeBattleChannel, KnowledgeMatch } from "../../lib/pvp/types";

type Phase = "boot" | "match" | "countdown" | "battle" | "leaving";

export function PvpBattleClient() {
  const router = useRouter();
  const { locale } = useLocale();
  const copy = getPvpCopy(locale);
  const labels = getSharedLabels(locale);
  useAudioScene("battle");
  const [phase, setPhase] = useState<Phase>("boot");
  const [match, setMatch] = useState<KnowledgeMatch | null>(null);
  const [subjectName, setSubjectName] = useState("");
  const [attack, setAttack] = useState<AttackEvent | null>(null);
  const [hitSide, setHitSide] = useState<"player" | "opponent" | null>(null);
  const [playerFlash, setPlayerFlash] = useState<{
    ok: boolean;
    title: string;
    speed?: string;
    detail: string;
  } | null>(null);
  const [itemHint, setItemHint] = useState("");
  const [comeback, setComeback] = useState(false);

  const matchRef = useRef<KnowledgeMatch | null>(null);
  const channelRef = useRef<KnowledgeBattleChannel | null>(null);
  const queueRef = useRef<AttackEvent[]>([]);
  const playingRef = useRef(false);
  const finishingRef = useRef(false);
  const advanceTimer = useRef<number | null>(null);
  const emoteTimer = useRef<number | null>(null);
  const leaveTimer = useRef<number | null>(null);
  const cueRef = useRef({ swung: false, hit: false, event: null as AttackEvent | null });

  const commit = useCallback((next: KnowledgeMatch) => {
    matchRef.current = next;
    setMatch(next);
  }, []);

  const bootMatch = useCallback(() => {
    const account = getCurrentAccount();
    if (!account) {
      router.replace("/auth");
      return;
    }
    const subject = getSelectedSubject();
    const trophies = getSubjectStats(account, subject).trophies;
    const level = getMockEconomy(account).xpLevel;
    const questions = pickMatchQuestions(account.grade, subject, PVP_QUESTIONS);
    const heroName = locale === "zh" ? PLAYER_HERO.nameZh : PLAYER_HERO.nameEn;
    const foeName = locale === "zh" ? OPPONENT_HERO.nameZh : OPPONENT_HERO.nameEn;
    const next = createMatch(
      createFighter({
        id: account.id,
        name: account.displayName,
        avatar: PLAYER_HERO.src,
        heroEmoji: PLAYER_HERO.emoji,
        heroName,
        level,
      }),
      createFighter({
        id: "mock-sara",
        name: "Sara",
        avatar: OPPONENT_HERO.src,
        heroEmoji: OPPONENT_HERO.emoji,
        heroName: foeName,
        level: Math.max(1, level + (Math.random() > 0.5 ? -1 : 0)),
      }),
      questions,
    );
    queueRef.current = [];
    playingRef.current = false;
    finishingRef.current = false;
    if (leaveTimer.current) window.clearTimeout(leaveTimer.current);
    commit(next);
    setAttack(null);
    setHitSide(null);
    setPlayerFlash(null);
    setItemHint("");
    setComeback(false);
    setSubjectName(localizedSubject(subject, locale) || getSubjectWorld(subject).subjectName);
    channelRef.current?.dispose();
    const accuracy = Math.min(0.86, 0.56 + trophies / 2400);
    channelRef.current = createMockOpponentChannel({ accuracy });
    setPhase("match");
  }, [commit, locale, router]);

  useEffect(() => {
    bootMatch();
    return () => {
      channelRef.current?.dispose();
      if (advanceTimer.current) window.clearTimeout(advanceTimer.current);
      if (emoteTimer.current) window.clearTimeout(emoteTimer.current);
      if (leaveTimer.current) window.clearTimeout(leaveTimer.current);
    };
  }, [bootMatch]);

  const finishBattle = useCallback(
    (latest: KnowledgeMatch) => {
      if (finishingRef.current) return;
      finishingRef.current = true;
      const ended = { ...latest, battle: { ...latest.battle, battleStatus: "ended" as const } };
      commit(ended);
      setPhase("leaving");
      const account = getCurrentAccount();
      const subject = getSelectedSubject();
      const trophiesBefore = account ? getSubjectStats(account, subject).trophies : 0;
      const opponentTrophies = Math.max(80, ended.opponent.level * 80);
      let result = buildPvpMatchResult(ended, { subject, trophiesBefore, opponentTrophies });
      result = applyPvpRewardsOnce(result);
      savePvpMatchResult(result);
      recordBattleLog(result);
      const w = winnerOf(ended);
      playSfx(w === "player" ? "win" : w === "opponent" ? "lose" : "wrong");
      if (leaveTimer.current) window.clearTimeout(leaveTimer.current);
      leaveTimer.current = window.setTimeout(() => {
        router.replace("/pvp/result");
      }, 420);
    },
    [commit, router],
  );

  const startQuestion = useCallback(
    (latest: KnowledgeMatch, index: number) => {
      const q = latest.questions[index];
      if (!q) {
        finishBattle(latest);
        return;
      }
      const now = performance.now();
      const ready = resetForNextQuestion(latest, index, now);
      const started = {
        ...ready,
        battle: { ...ready.battle, questionStartTime: now, battleStatus: "question" as const },
      };
      commit(started);
      channelRef.current?.startQuestion(index, q.correctIndex, q.options.length);
    },
    [commit, finishBattle],
  );

  const tryAdvance = useCallback(() => {
    const latest = matchRef.current;
    if (!latest || playingRef.current || queueRef.current.length > 0) return;
    if (!bothAnswered(latest)) return;
    if (advanceTimer.current) window.clearTimeout(advanceTimer.current);
    advanceTimer.current = window.setTimeout(() => {
      const cur = matchRef.current;
      if (!cur || finishingRef.current) return;
      if (cur.player.hp <= 0 || cur.opponent.hp <= 0) {
        finishBattle(cur);
        return;
      }
      const nextIndex = cur.battle.currentQuestion + 1;
      if (nextIndex >= cur.questions.length) {
        finishBattle(cur);
        return;
      }
      startQuestion(cur, nextIndex);
    }, PVP_RESOLVE_GAP_MS);
  }, [finishBattle, startQuestion]);

  const onAttackSwing = useCallback(() => {
    if (cueRef.current.swung) return;
    cueRef.current.swung = true;
    playSfx("whoosh");
  }, []);

  const onAttackImpact = useCallback(() => {
    if (cueRef.current.hit) return;
    cueRef.current.hit = true;
    const next = cueRef.current.event;
    if (!next) return;
    const cur = matchRef.current;
    if (cur) commit(applyDamage(cur, next));
    setHitSide(next.to);
    playSfx("hit");
  }, [commit]);

  const pumpQueue = useCallback(() => {
    if (playingRef.current) return;
    const next = queueRef.current.shift();
    if (!next) {
      tryAdvance();
      return;
    }
    playingRef.current = true;
    setAttack(next);
    const latest = matchRef.current;
    if (latest) {
      commit({
        ...latest,
        battle: {
          ...latest.battle,
          currentAttacker: next.from,
          opponentStatus:
            next.from === "opponent" ? (next.correct ? "attacking" : "wrong") : latest.battle.opponentStatus,
        },
      });
    }
    if (next.from === "opponent" && next.correct && next.combo >= 3) {
      setComeback(true);
      window.setTimeout(() => setComeback(false), 1800);
    }
    if (next.correct && next.damage > 0) {
      cueRef.current = { swung: false, hit: false, event: next };
      window.setTimeout(() => onAttackSwing(), PVP_PLAYER_SWING_MS);
      window.setTimeout(() => onAttackImpact(), PVP_PLAYER_IMPACT_MS);
      window.setTimeout(() => {
        setHitSide(null);
        setAttack(null);
        playingRef.current = false;
        pumpQueue();
      }, PVP_PLAYER_ATTACK_MS + 280);
      return;
    }
    window.setTimeout(() => {
      setAttack(null);
      playingRef.current = false;
      pumpQueue();
    }, 280);
  }, [commit, onAttackImpact, onAttackSwing, tryAdvance]);

  const enqueue = useCallback(
    (event: AttackEvent) => {
      queueRef.current.push(event);
      pumpQueue();
    },
    [pumpQueue],
  );

  const onPlayerChoice = useCallback(
    (choice: number | null) => {
      const latest = matchRef.current;
      if (finishingRef.current) return;
      if (!latest || latest.player.answered || latest.battle.battleStatus === "ended" || phase === "leaving") return;
      const elapsed = Math.min(PVP_QUESTION_CAP_MS, latest.battle.elapsedMs);
      const resolved = resolveAnswer(latest, "player", choice, elapsed);
      if (!resolved) return;
      playSfx(resolved.event.correct ? "correct" : "wrong");
      commit(resolved.match);
      setPlayerFlash({
        ok: resolved.event.correct,
        title: resolved.event.correct ? `✓ ${copy.correct}` : `✕ ${copy.wrong}`,
        speed: copy.speedLine((elapsed / 1000).toFixed(1)),
        detail: resolved.event.correct
          ? resolved.event.power
            ? `🔥 ${copy.powerAttack} ${copy.damage(resolved.event.damage)}`
            : copy.damage(resolved.event.damage)
          : copy.zeroDamage,
      });
      window.setTimeout(() => setPlayerFlash(null), 1100);
      channelRef.current?.sendAnswer(choice ?? -1, elapsed);
      enqueue(resolved.event);
    },
    [commit, copy, enqueue, phase],
  );

  useEffect(() => {
    const channel = channelRef.current;
    if (!channel || phase !== "battle") return;
    return channel.onEvent((event) => {
      if (event.type === "emote") {
        const cur = matchRef.current;
        if (!cur) return;
        commit({ ...cur, battle: { ...cur.battle, opponentEmote: event.emote } });
        window.setTimeout(() => {
          const later = matchRef.current;
          if (later) commit({ ...later, battle: { ...later.battle, opponentEmote: null } });
        }, 1800);
        return;
      }
      const cur = matchRef.current;
      if (!cur || cur.opponent.answered) return;
      const resolved = resolveAnswer(cur, "opponent", event.choice, event.elapsedMs);
      if (!resolved) return;
      commit({
        ...resolved.match,
        battle: {
          ...resolved.match.battle,
          opponentStatus: resolved.event.correct ? "correct" : "wrong",
        },
      });
      enqueue(resolved.event);
    });
  }, [phase, commit, enqueue]);

  useEffect(() => {
    if (phase !== "battle") return;
    const id = window.setInterval(() => {
      const cur = matchRef.current;
      if (!cur || cur.battle.battleStatus !== "question") return;
      const elapsed = performance.now() - cur.battle.questionStartTime;
      if (!cur.player.answered) {
        commit({ ...cur, battle: { ...cur.battle, elapsedMs: elapsed } });
      }
      if (elapsed >= PVP_QUESTION_CAP_MS) {
        if (!cur.player.answered) onPlayerChoice(null);
        const after = matchRef.current;
        if (after && !after.opponent.answered) {
          const resolved = resolveAnswer(after, "opponent", null, elapsed);
          if (resolved) {
            commit({
              ...resolved.match,
              battle: {
                ...resolved.match.battle,
                opponentStatus: resolved.event.correct ? "correct" : "wrong",
              },
            });
            enqueue(resolved.event);
          }
        }
      }
    }, 50);
    return () => window.clearInterval(id);
  }, [phase, commit, onPlayerChoice, enqueue]);

  function onUseItem(item: ItemId) {
    const cur = matchRef.current;
    if (!cur || cur.player.answered) return;
    let next: KnowledgeMatch | null = null;
    if (item === "scout") next = useScout(cur);
    if (item === "freeze") next = markFreezeUsed(cur);
    if (item === "haste") next = useHaste(cur);
    if (item === "shield") next = useShield(cur);
    if (!next) return;
    playSfx("hud");
    commit(next);
    channelRef.current?.applyItem(item);
    setItemHint(
      item === "scout"
        ? copy.scoutUsed
        : item === "freeze"
          ? copy.freezeUsed
          : item === "haste"
            ? copy.hasteOn
            : copy.shieldOn,
    );
    window.setTimeout(() => setItemHint(""), 1400);
  }

  function onEmote(emote: EmoteId) {
    const cur = matchRef.current;
    if (!cur) return;
    playSfx("mascot");
    commit({ ...cur, battle: { ...cur.battle, playerEmote: emote } });
    channelRef.current?.sendEmote(emote);
    if (emoteTimer.current) window.clearTimeout(emoteTimer.current);
    emoteTimer.current = window.setTimeout(() => {
      const later = matchRef.current;
      if (later) commit({ ...later, battle: { ...later.battle, playerEmote: null } });
    }, 1800);
  }

  if (!match) {
    return (
      <div className="flex flex-1 items-center justify-center text-[var(--ink-soft)]">{labels.preparing}</div>
    );
  }

  const question = match.questions[match.battle.currentQuestion];
  const history = match.questions.map((_, i) => {
    const row = match.battle.answerHistory[i];
    return row ? row.playerCorrect : null;
  });

  return (
    <div
      className={`pvp-battle-root relative mx-auto flex h-[100dvh] w-full max-w-[430px] flex-col overflow-hidden bg-[#182444]${
        phase === "leaving" ? " is-leaving" : ""
      }`}
    >
      <BattleArena
        player={match.player}
        opponent={match.opponent}
        questionIndex={match.battle.currentQuestion}
        total={match.battle.totalQuestions}
        copy={copy}
        comboBroke={match.battle.comboBreakFlash}
        attack={attack}
        hitSide={hitSide}
        playerEmote={match.battle.playerEmote}
        opponentEmote={match.battle.opponentEmote}
        opponentStatus={match.battle.opponentStatus}
        comeback={comeback}
        winner={null}
        onSwing={onAttackSwing}
        onImpact={onAttackImpact}
      />

      <section className="pvp-question-panel relative flex min-h-0 h-[50%] flex-col gap-2 overflow-y-auto px-3 pb-[max(0.55rem,env(safe-area-inset-bottom))] pt-2">
        <BattleEvent
          show={Boolean(playerFlash)}
          ok={playerFlash?.ok ?? false}
          title={playerFlash?.title ?? ""}
          speed={playerFlash?.speed}
          detail={playerFlash?.detail ?? ""}
        />
        <div className="flex items-center justify-between gap-2">
          <BattleTimer
            elapsedMs={
              match.player.answered && match.player.answerTime != null
                ? match.player.answerTime
                : match.battle.elapsedMs
            }
            capMs={PVP_QUESTION_CAP_MS}
            locked={match.player.answered}
            label={copy.timer}
          />
          <QuestionProgress
            total={match.battle.totalQuestions}
            current={match.battle.currentQuestion}
            history={history}
          />
        </div>

        {phase === "battle" && question ? (
          <QuestionCard
            subject={subjectName}
            prompt={question.prompt}
            badge={
              match.battle.currentQuestion >= match.battle.totalQuestions - 1
                ? copy.finalQuestion
                : match.battle.currentQuestion === match.battle.totalQuestions - 2
                  ? copy.lateGame
                  : match.battle.currentQuestion === match.battle.totalQuestions - 3
                    ? copy.clutch
                    : undefined
            }
          />
        ) : (
          <article className="shrink-0 rounded-[1.2rem] bg-white px-3.5 py-6 text-center text-sm font-extrabold text-[#7a5a38]">
            {copy.matchFound}
          </article>
        )}

        {phase === "battle" && question ? (
          <div className="grid min-h-0 flex-1 grid-cols-2 content-start gap-2">
            {question.options.map((option, index) => (
              <AnswerButton
                key={`${match.battle.currentQuestion}-${index}`}
                index={index}
                text={option}
                letter={copy.letters[index]}
                disabled={match.player.answered || phase !== "battle"}
                selected={match.player.choice === index}
                correct={match.player.answered && index === question.correctIndex}
                wrong={match.player.answered && match.player.choice === index && index !== question.correctIndex}
                revealedWrong={match.battle.revealedWrong.includes(index)}
                onSelect={() => onPlayerChoice(index)}
              />
            ))}
          </div>
        ) : (
          <div className="min-h-0 flex-1" />
        )}

        {itemHint ? (
          <p className="text-center text-[10px] font-extrabold text-[#5a3a20]">{itemHint}</p>
        ) : null}

        <ItemBar
          copy={copy}
          used={match.battle.itemsUsed}
          disabled={phase !== "battle" || match.player.answered}
          onUse={onUseItem}
        />
        <EmoteBar copy={copy} disabled={phase !== "battle"} onSend={onEmote} />
      </section>

      {phase === "match" ? (
        <MatchFound
          title={copy.matchFound}
          left={`${match.player.heroEmoji} ${match.player.name}`}
          right={`${match.opponent.heroEmoji} ${match.opponent.name}`}
          vs={copy.vs}
          onDone={() => setPhase("countdown")}
        />
      ) : null}

      {phase === "countdown" ? (
        <CountdownOverlay
          onDone={() => {
            setPhase("battle");
            const cur = matchRef.current;
            if (cur) startQuestion(cur, 0);
          }}
        />
      ) : null}

    </div>
  );
}

function MatchFound({
  title,
  left,
  right,
  vs,
  onDone,
}: {
  title: string;
  left: string;
  right: string;
  vs: string;
  onDone: () => void;
}) {
  useEffect(() => {
    const id = window.setTimeout(onDone, 1200);
    playSfx("match");
    return () => window.clearTimeout(id);
  }, [onDone]);

  return (
    <div className="absolute inset-0 z-40 flex items-center justify-center bg-[#1c3048]/50 px-6">
      <motion.div
        initial={{ scale: 0.86, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="w-full rounded-[1.5rem] bg-[#fff8ea] px-5 py-8 text-center shadow-[0_16px_40px_rgba(20,30,40,0.28)]"
      >
        <p className="text-xs font-black tracking-[0.2em] text-[#c45c20]">{title}</p>
        <div className="mt-5 flex items-center justify-between gap-3 font-[family-name:var(--font-display)] text-lg font-black text-[#3a2a18]">
          <span className="min-w-0 flex-1 truncate">{left}</span>
          <span className="text-[#f5b62b]">{vs}</span>
          <span className="min-w-0 flex-1 truncate">{right}</span>
        </div>
      </motion.div>
    </div>
  );
}
