const MUTE_KEY = "matharena:bgm-muted";

let muted = false;
const listeners = new Set<() => void>();

function readMuted(): boolean {
  if (typeof window === "undefined") return false;
  try {
    return window.localStorage.getItem(MUTE_KEY) === "1";
  } catch {
    return false;
  }
}

muted = typeof window !== "undefined" ? readMuted() : false;

/** Background music muted (independent of SFX). */
export function isBgmMuted(): boolean {
  return muted;
}

export function isBackgroundMusicEnabled(): boolean {
  return !muted;
}

export function setBgmMuted(next: boolean): void {
  muted = next;
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(MUTE_KEY, next ? "1" : "0");
  } catch {
    /* ignore */
  }
  listeners.forEach((fn) => fn());
}

export function setBackgroundMusicEnabled(enabled: boolean): void {
  setBgmMuted(!enabled);
}

export function subscribeBgmMute(fn: () => void): () => void {
  listeners.add(fn);
  return () => listeners.delete(fn);
}
