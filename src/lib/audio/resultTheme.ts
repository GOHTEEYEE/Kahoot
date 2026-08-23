import { isBgmMuted } from "./bgm";

export type ResultMood = "win" | "lose" | "draw";

type Note = {
  freq: number;
  at: number;
  dur: number;
  gain?: number;
  type?: OscillatorType;
};

let ctx: AudioContext | null = null;
let master: GainNode | null = null;
let timer: number | null = null;
let playing = false;

function audio(): AudioContext | null {
  if (typeof window === "undefined") return null;
  const AC =
    window.AudioContext ||
    (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
  if (!AC) return null;
  if (!ctx) {
    ctx = new AC();
    master = ctx.createGain();
    master.gain.value = 0.22;
    master.connect(ctx.destination);
  }
  return ctx;
}

function tone(audioCtx: AudioContext, dest: AudioNode, note: Note, t0: number): void {
  const osc = audioCtx.createOscillator();
  const g = audioCtx.createGain();
  osc.type = note.type ?? "triangle";
  const start = t0 + note.at;
  const end = start + note.dur;
  osc.frequency.setValueAtTime(note.freq, start);
  g.gain.setValueAtTime(0.0001, start);
  g.gain.exponentialRampToValueAtTime(Math.max(0.0002, note.gain ?? 0.16), start + 0.02);
  g.gain.exponentialRampToValueAtTime(0.0001, end);
  osc.connect(g);
  g.connect(dest);
  osc.start(start);
  osc.stop(end + 0.02);
}

const WIN: { cycle: number; notes: Note[] } = {
  cycle: 1.92,
  notes: [
    { freq: 523, at: 0, dur: 0.18, gain: 0.18 },
    { freq: 659, at: 0.18, dur: 0.18, gain: 0.16 },
    { freq: 784, at: 0.36, dur: 0.18, gain: 0.18 },
    { freq: 1046, at: 0.54, dur: 0.34, gain: 0.2 },
    { freq: 784, at: 0.9, dur: 0.16, gain: 0.12 },
    { freq: 1318, at: 1.08, dur: 0.28, gain: 0.14, type: "sine" },
    { freq: 1046, at: 1.38, dur: 0.42, gain: 0.16 },
    { freq: 261, at: 0, dur: 1.8, gain: 0.05, type: "sine" },
    { freq: 392, at: 0.54, dur: 1.2, gain: 0.04, type: "sine" },
  ],
};

const LOSE: { cycle: number; notes: Note[] } = {
  cycle: 2.7,
  notes: [
    { freq: 392, at: 0, dur: 0.42, gain: 0.14, type: "sine" },
    { freq: 349, at: 0.4, dur: 0.42, gain: 0.13, type: "sine" },
    { freq: 329, at: 0.82, dur: 0.48, gain: 0.13, type: "sine" },
    { freq: 261, at: 1.28, dur: 0.7, gain: 0.15, type: "triangle" },
    { freq: 196, at: 2.0, dur: 0.62, gain: 0.12, type: "sine" },
    { freq: 130, at: 0, dur: 2.55, gain: 0.05, type: "sine" },
  ],
};

const DRAW: { cycle: number; notes: Note[] } = {
  cycle: 2.2,
  notes: [
    { freq: 440, at: 0, dur: 0.28, gain: 0.12, type: "sine" },
    { freq: 523, at: 0.3, dur: 0.28, gain: 0.12, type: "sine" },
    { freq: 494, at: 0.62, dur: 0.4, gain: 0.12, type: "sine" },
    { freq: 392, at: 1.08, dur: 0.7, gain: 0.13, type: "triangle" },
    { freq: 220, at: 0, dur: 2.05, gain: 0.045, type: "sine" },
  ],
};

function pack(mood: ResultMood) {
  if (mood === "win") return WIN;
  if (mood === "lose") return LOSE;
  return DRAW;
}

function stop(): void {
  playing = false;
  if (timer != null) {
    window.clearInterval(timer);
    timer = null;
  }
  if (master && ctx) {
    try {
      master.gain.setTargetAtTime(0.0001, ctx.currentTime, 0.08);
    } catch {
      /* ignore */
    }
  }
}

/** Looping victory / defeat theme. Town BGM stays ducked while this plays. */
export function startResultTheme(mood: ResultMood): () => void {
  stop();
  if (typeof window === "undefined" || isBgmMuted()) return () => undefined;
  const audioCtx = audio();
  if (!audioCtx || !master) return () => undefined;
  playing = true;
  master.gain.setValueAtTime(0.0001, audioCtx.currentTime);
  master.gain.exponentialRampToValueAtTime(0.22, audioCtx.currentTime + 0.12);
  const song = pack(mood);
  const kick = () => {
    if (!playing || !ctx || !master) return;
    const t0 = ctx.currentTime + 0.04;
    for (const note of song.notes) tone(ctx, master, note, t0);
  };
  void audioCtx.resume().then(() => {
    if (!playing) return;
    kick();
    timer = window.setInterval(kick, song.cycle * 1000);
  });
  return stop;
}
