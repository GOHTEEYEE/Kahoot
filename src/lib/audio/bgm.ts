const MUTE_KEY = "matharena:bgm-muted";
/** Town Theme RPG by cynicmusic — CC0. https://opengameart.org/content/town-theme-rpg */
const BGM_SRC = "/audio/home-bgm.mp3";
const BGM_VOLUME = 0.32;

let muted = false;
let armed = false;
let el: HTMLAudioElement | null = null;
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

export type BgmScene = "home" | "battle";
let scene: BgmScene = "home";

function ensureEl(): HTMLAudioElement | null {
  if (typeof window === "undefined") return null;
  if (!el) {
    el = new Audio(BGM_SRC);
    el.loop = true;
    el.preload = "auto";
    el.volume = BGM_VOLUME;
    el.setAttribute("aria-hidden", "true");
    el.style.display = "none";
    document.body.appendChild(el);
  }
  return el;
}

async function playIfAllowed(): Promise<void> {
  const audio = ensureEl();
  if (!audio || muted || scene === "battle") return;
  try {
    await audio.play();
  } catch {
    /* autoplay blocked until the next user gesture */
  }
}

/** Unlock and start looping BGM after the first tap (iOS / Chrome autoplay). */
export function armBgm(): void {
  if (armed || typeof window === "undefined") return;
  armed = true;
  ensureEl();
  const start = () => {
    void playIfAllowed();
  };
  window.addEventListener("pointerdown", start, { once: true, capture: true });
  window.addEventListener("keydown", start, { once: true, capture: true });
}

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
  const audio = ensureEl();
  if (audio) {
    if (next || scene === "battle") audio.pause();
    else void playIfAllowed();
  }
  listeners.forEach((fn) => fn());
}

export function setBackgroundMusicEnabled(enabled: boolean): void {
  setBgmMuted(!enabled);
}

/** Duck town BGM during combat so battle SFX / pulse can take over. */
export function setBgmScene(next: BgmScene): void {
  if (scene === next) return;
  scene = next;
  const audio = ensureEl();
  if (!audio) return;
  if (next === "battle" || muted) {
    audio.pause();
    return;
  }
  void playIfAllowed();
}

export function subscribeBgmMute(fn: () => void): () => void {
  listeners.add(fn);
  return () => listeners.delete(fn);
}
