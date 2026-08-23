import { PVP_FREEZE_MS, PVP_QUESTION_CAP_MS } from "./config";
import type { ItemId } from "./items";
import type { EmoteId, KnowledgeBattleChannel, OpponentEvent } from "./types";

function rand(min: number, max: number): number {
  return min + Math.random() * (max - min);
}

/**
 * Local stand-in for a second student. Swap this factory for a WebSocket
 * channel later — the rest of the battle UI talks only to KnowledgeBattleChannel.
 */
export function createMockOpponentChannel(opts?: {
  accuracy?: number;
  minThinkMs?: number;
  maxThinkMs?: number;
}): KnowledgeBattleChannel {
  const accuracy = opts?.accuracy ?? 0.68;
  const minThink = opts?.minThinkMs ?? 1400;
  const maxThink = opts?.maxThinkMs ?? 6200;

  const listeners = new Set<(event: OpponentEvent) => void>();
  let timer: number | null = null;
  let freezeLeft = 0;
  let disposed = false;
  let questionGen = 0;

  function emit(event: OpponentEvent) {
    listeners.forEach((fn) => fn(event));
  }

  function clearTimer() {
    if (timer != null) {
      window.clearTimeout(timer);
      timer = null;
    }
  }

  return {
    onEvent(handler) {
      listeners.add(handler);
      return () => listeners.delete(handler);
    },
    sendAnswer() {
      /* mock opponent does not react to player's choice */
    },
    sendEmote() {
      if (disposed || Math.random() > 0.18) return;
      const pool: EmoteId[] = ["wow", "fast", "think", "nice"];
      window.setTimeout(() => {
        if (!disposed) emit({ type: "emote", emote: pool[Math.floor(Math.random() * pool.length)] });
      }, 400 + Math.random() * 900);
    },
    startQuestion(_index, correctIndex, options) {
      if (disposed) return;
      clearTimer();
      const gen = ++questionGen;
      const think = Math.min(PVP_QUESTION_CAP_MS - 400, rand(minThink, maxThink));
      const delay = think + freezeLeft;
      freezeLeft = 0;
      timer = window.setTimeout(() => {
        if (disposed || gen !== questionGen) return;
        const correct = Math.random() < accuracy;
        let choice: number;
        if (correct) {
          choice = correctIndex;
        } else {
          const wrong = Array.from({ length: options }, (_, i) => i).filter((i) => i !== correctIndex);
          choice = wrong[Math.floor(Math.random() * wrong.length)] ?? 0;
        }
        emit({ type: "answered", choice, elapsedMs: Math.round(delay) });
      }, delay);
    },
    applyItem(item: ItemId) {
      if (item === "freeze") freezeLeft += PVP_FREEZE_MS;
    },
    dispose() {
      disposed = true;
      clearTimer();
      listeners.clear();
    },
  };
}
