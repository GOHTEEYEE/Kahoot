const MUTE_KEY = "matharena:sfx-muted";

export type SfxScene = "home" | "battle";

export type SfxName =
  | "tap"
  | "hud"
  | "chest"
  | "mission"
  | "pass"
  | "challenge"
  | "whoosh"
  | "world"
  | "mascot"
  | "mail"
  | "mute"
  | "answer"
  | "correct"
  | "wrong"
  | "win"
  | "lose"
  | "hit"
  | "countdown"
  | "go"
  | "match";

type Tone = {
  freq: number;
  dur: number;
  type?: OscillatorType;
  gain?: number;
  delay?: number;
  slideTo?: number;
};

type Patch = (audio: AudioContext) => void;

let ctx: AudioContext | null = null;
let master: GainNode | null = null;
let keeper: OscillatorNode | null = null;
let muted = false;
let armed = false;
let scene: SfxScene = "home";
const pending: SfxName[] = [];
const muteListeners = new Set<() => void>();

function readMuted(): boolean {
  if (typeof window === "undefined") return false;
  try {
    return window.localStorage.getItem(MUTE_KEY) === "1";
  } catch {
    return false;
  }
}

muted = typeof window !== "undefined" ? readMuted() : false;

export function isSfxMuted(): boolean {
  return muted;
}

export function getSfxScene(): SfxScene {
  return scene;
}

export function setSfxScene(next: SfxScene): void {
  scene = next;
}

export function setSfxMuted(next: boolean): void {
  muted = next;
  if (typeof window !== "undefined") {
    try {
      window.localStorage.setItem(MUTE_KEY, next ? "1" : "0");
    } catch {
      /* ignore */
    }
  }
  muteListeners.forEach((fn) => fn());
}

export function toggleSfxMuted(): boolean {
  setSfxMuted(!muted);
  return muted;
}

export function subscribeSfxMute(fn: () => void): () => void {
  muteListeners.add(fn);
  return () => muteListeners.delete(fn);
}

function getCtx(): AudioContext | null {
  if (typeof window === "undefined") return null;
  const AC =
    window.AudioContext ||
    (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
  if (!AC) return null;
  if (!ctx) {
    ctx = new AC();
    master = ctx.createGain();
    master.gain.value = 0.42;
    master.connect(ctx.destination);
  }
  return ctx;
}

function keepAlive(audio: AudioContext): void {
  if (keeper) return;
  try {
    keeper = audio.createOscillator();
    keeper.frequency.value = 40;
    const g = audio.createGain();
    g.gain.value = 0.00008;
    keeper.connect(g);
    g.connect(audio.destination);
    keeper.start();
  } catch {
    keeper = null;
  }
}

async function resume(): Promise<AudioContext | null> {
  const audio = getCtx();
  if (!audio) return null;
  if (audio.state === "suspended") {
    try {
      await audio.resume();
    } catch {
      return audio;
    }
  }
  if (audio.state === "running") keepAlive(audio);
  return audio;
}

function unlock(): void {
  void resume().then((audio) => {
    if (!audio || audio.state !== "running") return;
    if (pending.length === 0) return;
    const batch = pending.splice(0);
    for (const name of batch) fire(name, audio);
  });
}

export function armSfx(): void {
  if (armed || typeof window === "undefined") return;
  armed = true;
  window.addEventListener("pointerdown", unlock, { capture: true });
  window.addEventListener("keydown", unlock, { capture: true });
  window.addEventListener("pointerup", unlock, { capture: true });
  window.addEventListener("visibilitychange", () => {
    if (document.visibilityState === "visible") unlock();
  });
}

function envGain(audio: AudioContext, peak: number, dur: number, delay = 0): GainNode {
  const g = audio.createGain();
  const t = audio.currentTime + delay;
  const attack = Math.min(0.008, Math.max(0.004, dur * 0.2));
  const end = t + Math.max(dur, attack + 0.02);
  g.gain.setValueAtTime(0.0001, t);
  g.gain.exponentialRampToValueAtTime(Math.max(0.0002, peak), t + attack);
  g.gain.exponentialRampToValueAtTime(0.0001, end);
  return g;
}

function playTone(audio: AudioContext, dest: AudioNode, tone: Tone): void {
  const osc = audio.createOscillator();
  osc.type = tone.type ?? "triangle";
  const t0 = audio.currentTime + (tone.delay ?? 0);
  osc.frequency.setValueAtTime(tone.freq, t0);
  if (tone.slideTo) {
    osc.frequency.exponentialRampToValueAtTime(Math.max(20, tone.slideTo), t0 + tone.dur);
  }
  const g = envGain(audio, tone.gain ?? 0.22, tone.dur, tone.delay ?? 0);
  osc.connect(g);
  g.connect(dest);
  osc.start(t0);
  osc.stop(t0 + tone.dur + 0.02);
}

function playNoise(
  audio: AudioContext,
  dest: AudioNode,
  dur: number,
  opts: { gain?: number; freq?: number; q?: number; delay?: number; type?: BiquadFilterType } = {},
): void {
  const length = Math.max(1, Math.floor(audio.sampleRate * dur));
  const buffer = audio.createBuffer(1, length, audio.sampleRate);
  const data = buffer.getChannelData(0);
  for (let i = 0; i < length; i += 1) data[i] = Math.random() * 2 - 1;
  const src = audio.createBufferSource();
  src.buffer = buffer;
  const filter = audio.createBiquadFilter();
  filter.type = opts.type ?? "bandpass";
  filter.frequency.value = opts.freq ?? 1800;
  filter.Q.value = opts.q ?? 1.2;
  const g = envGain(audio, opts.gain ?? 0.18, dur, opts.delay ?? 0);
  src.connect(filter);
  filter.connect(g);
  g.connect(dest);
  const t0 = audio.currentTime + (opts.delay ?? 0);
  src.start(t0);
  src.stop(t0 + dur);
}

function mix(audio: AudioContext, gain = 1): GainNode {
  const bus = audio.createGain();
  bus.gain.value = gain;
  bus.connect(master ?? audio.destination);
  return bus;
}

function kick(audio: AudioContext, dest: AudioNode, delay = 0, gain = 0.28): void {
  playTone(audio, dest, { freq: 150, dur: 0.14, type: "sine", gain, delay, slideTo: 38 });
  playNoise(audio, dest, 0.05, { freq: 180, q: 0.7, gain: gain * 0.35, delay, type: "lowpass" });
}

const HOME: Record<SfxName, Patch> = {
  tap(audio) {
    const bus = mix(audio);
    playTone(audio, bus, { freq: 980, dur: 0.06, type: "triangle", gain: 0.15 });
    playTone(audio, bus, { freq: 1480, dur: 0.045, type: "sine", gain: 0.08, delay: 0.016 });
  },
  hud(audio) {
    const bus = mix(audio);
    playTone(audio, bus, { freq: 1046, dur: 0.08, type: "sine", gain: 0.14 });
  },
  mail(audio) {
    const bus = mix(audio);
    playTone(audio, bus, { freq: 784, dur: 0.09, type: "sine", gain: 0.14 });
    playTone(audio, bus, { freq: 1174, dur: 0.11, type: "sine", gain: 0.12, delay: 0.07 });
  },
  chest(audio) {
    const bus = mix(audio);
    playNoise(audio, bus, 0.09, { freq: 420, q: 0.8, gain: 0.22 });
    playTone(audio, bus, { freq: 392, dur: 0.1, type: "square", gain: 0.08 });
    playTone(audio, bus, { freq: 1046, dur: 0.14, type: "sine", gain: 0.16, delay: 0.06 });
    playTone(audio, bus, { freq: 1568, dur: 0.18, type: "sine", gain: 0.12, delay: 0.12 });
    playTone(audio, bus, { freq: 2093, dur: 0.2, type: "sine", gain: 0.08, delay: 0.18 });
  },
  mission(audio) {
    const bus = mix(audio);
    playNoise(audio, bus, 0.07, { freq: 2400, q: 0.6, gain: 0.1 });
    playTone(audio, bus, { freq: 659, dur: 0.1, type: "triangle", gain: 0.14 });
    playTone(audio, bus, { freq: 880, dur: 0.12, type: "triangle", gain: 0.12, delay: 0.08 });
  },
  pass(audio) {
    const bus = mix(audio);
    playTone(audio, bus, { freq: 523, dur: 0.1, type: "triangle", gain: 0.14 });
    playTone(audio, bus, { freq: 659, dur: 0.12, type: "triangle", gain: 0.12, delay: 0.07 });
    playTone(audio, bus, { freq: 784, dur: 0.16, type: "sine", gain: 0.12, delay: 0.14 });
  },
  challenge(audio) {
    const bus = mix(audio);
    playTone(audio, bus, { freq: 392, dur: 0.1, type: "triangle", gain: 0.12 });
    playTone(audio, bus, { freq: 523, dur: 0.1, type: "triangle", gain: 0.12, delay: 0.06 });
    playTone(audio, bus, { freq: 784, dur: 0.16, type: "sine", gain: 0.16, delay: 0.12 });
    playTone(audio, bus, { freq: 1046, dur: 0.2, type: "sine", gain: 0.12, delay: 0.2 });
  },
  whoosh(audio) {
    const bus = mix(audio);
    playNoise(audio, bus, 0.18, { freq: 1400, q: 0.6, gain: 0.12 });
    playTone(audio, bus, { freq: 520, dur: 0.16, type: "sine", gain: 0.06, slideTo: 260 });
  },
  world(audio) {
    const bus = mix(audio);
    playTone(audio, bus, { freq: 523, dur: 0.12, type: "triangle", gain: 0.14 });
    playTone(audio, bus, { freq: 659, dur: 0.12, type: "triangle", gain: 0.13, delay: 0.08 });
    playTone(audio, bus, { freq: 784, dur: 0.16, type: "sine", gain: 0.14, delay: 0.16 });
    playTone(audio, bus, { freq: 1046, dur: 0.22, type: "sine", gain: 0.11, delay: 0.24 });
  },
  mascot(audio) {
    const bus = mix(audio);
    playTone(audio, bus, { freq: 587, dur: 0.12, type: "sine", gain: 0.16, slideTo: 880 });
    playTone(audio, bus, { freq: 1174, dur: 0.1, type: "triangle", gain: 0.08, delay: 0.1 });
  },
  mute(audio) {
    const bus = mix(audio);
    playTone(audio, bus, { freq: 392, dur: 0.09, type: "sine", gain: 0.12 });
  },
  answer(audio) {
    const bus = mix(audio);
    playTone(audio, bus, { freq: 740, dur: 0.06, type: "triangle", gain: 0.14 });
  },
  correct(audio) {
    HOME.pass(audio);
  },
  wrong(audio) {
    const bus = mix(audio);
    playTone(audio, bus, { freq: 280, dur: 0.14, type: "sine", gain: 0.14, slideTo: 140 });
    playNoise(audio, bus, 0.08, { freq: 400, q: 0.8, gain: 0.08 });
  },
  win(audio) {
    HOME.chest(audio);
  },
  lose(audio) {
    const bus = mix(audio);
    playTone(audio, bus, { freq: 392, dur: 0.16, type: "sine", gain: 0.12 });
    playTone(audio, bus, { freq: 311, dur: 0.2, type: "sine", gain: 0.12, delay: 0.12 });
    playTone(audio, bus, { freq: 247, dur: 0.28, type: "triangle", gain: 0.14, delay: 0.26 });
  },
  hit(audio) {
    HOME.tap(audio);
  },
  countdown(audio) {
    const bus = mix(audio);
    playTone(audio, bus, { freq: 880, dur: 0.08, type: "sine", gain: 0.14 });
  },
  go(audio) {
    HOME.challenge(audio);
  },
  match(audio) {
    HOME.mission(audio);
  },
};

const BATTLE: Record<SfxName, Patch> = {
  tap(audio) {
    const bus = mix(audio);
    kick(audio, bus, 0, 0.16);
    playTone(audio, bus, { freq: 620, dur: 0.045, type: "square", gain: 0.05 });
  },
  hud(audio) {
    const bus = mix(audio);
    playTone(audio, bus, { freq: 1568, dur: 0.06, type: "square", gain: 0.06 });
    playTone(audio, bus, { freq: 2093, dur: 0.08, type: "sine", gain: 0.1, delay: 0.03 });
  },
  mail(audio) {
    BATTLE.hud(audio);
  },
  chest(audio) {
    BATTLE.win(audio);
  },
  mission(audio) {
    BATTLE.match(audio);
  },
  pass(audio) {
    BATTLE.correct(audio);
  },
  challenge(audio) {
    const bus = mix(audio);
    playTone(audio, bus, { freq: 196, dur: 0.16, type: "sawtooth", gain: 0.08 });
    playTone(audio, bus, { freq: 294, dur: 0.14, type: "square", gain: 0.05, delay: 0.02 });
    playTone(audio, bus, { freq: 784, dur: 0.16, type: "triangle", gain: 0.14, delay: 0.08 });
    playTone(audio, bus, { freq: 1174, dur: 0.2, type: "sine", gain: 0.1, delay: 0.16 });
  },
  whoosh(audio) {
    const bus = mix(audio, 1.15);
    playNoise(audio, bus, 0.22, { freq: 2400, q: 0.55, gain: 0.2, type: "bandpass" });
    playNoise(audio, bus, 0.2, { freq: 900, q: 0.7, gain: 0.14, delay: 0.04, type: "lowpass" });
    playTone(audio, bus, { freq: 620, dur: 0.2, type: "sine", gain: 0.08, slideTo: 140 });
  },
  world(audio) {
    BATTLE.challenge(audio);
  },
  mascot(audio) {
    const bus = mix(audio);
    playTone(audio, bus, { freq: 440, dur: 0.08, type: "square", gain: 0.08 });
    playTone(audio, bus, { freq: 880, dur: 0.1, type: "triangle", gain: 0.12, delay: 0.05 });
  },
  mute(audio) {
    HOME.mute(audio);
  },
  answer(audio) {
    const bus = mix(audio);
    playNoise(audio, bus, 0.04, { freq: 2200, q: 1.4, gain: 0.12 });
    playTone(audio, bus, { freq: 220, dur: 0.07, type: "square", gain: 0.07 });
  },
  correct(audio) {
    const bus = mix(audio);
    playTone(audio, bus, { freq: 880, dur: 0.08, type: "triangle", gain: 0.16 });
    playTone(audio, bus, { freq: 1320, dur: 0.1, type: "sine", gain: 0.14, delay: 0.055 });
    playTone(audio, bus, { freq: 1760, dur: 0.14, type: "sine", gain: 0.1, delay: 0.11 });
  },
  wrong(audio) {
    const bus = mix(audio);
    playTone(audio, bus, { freq: 160, dur: 0.18, type: "sawtooth", gain: 0.12, slideTo: 90 });
    playNoise(audio, bus, 0.16, { freq: 280, q: 0.6, gain: 0.16, type: "lowpass" });
    playTone(audio, bus, { freq: 90, dur: 0.2, type: "square", gain: 0.06, delay: 0.04 });
  },
  win(audio) {
    const bus = mix(audio);
    kick(audio, bus, 0, 0.22);
    playTone(audio, bus, { freq: 523, dur: 0.12, type: "triangle", gain: 0.16, delay: 0.02 });
    playTone(audio, bus, { freq: 659, dur: 0.12, type: "triangle", gain: 0.14, delay: 0.12 });
    playTone(audio, bus, { freq: 784, dur: 0.14, type: "sine", gain: 0.16, delay: 0.22 });
    playTone(audio, bus, { freq: 1046, dur: 0.28, type: "sine", gain: 0.18, delay: 0.34 });
    playTone(audio, bus, { freq: 1568, dur: 0.32, type: "sine", gain: 0.1, delay: 0.42 });
  },
  lose(audio) {
    const bus = mix(audio);
    kick(audio, bus, 0, 0.2);
    playTone(audio, bus, { freq: 311, dur: 0.18, type: "sawtooth", gain: 0.08 });
    playTone(audio, bus, { freq: 247, dur: 0.22, type: "triangle", gain: 0.14, delay: 0.14 });
    playTone(audio, bus, { freq: 185, dur: 0.36, type: "sine", gain: 0.16, delay: 0.3, slideTo: 98 });
  },
  hit(audio) {
    const bus = mix(audio, 1.25);
    playNoise(audio, bus, 0.045, { freq: 3200, q: 1.6, gain: 0.28 });
    playNoise(audio, bus, 0.09, { freq: 700, q: 0.8, gain: 0.22, type: "bandpass" });
    kick(audio, bus, 0, 0.38);
    playTone(audio, bus, { freq: 210, dur: 0.08, type: "square", gain: 0.07 });
  },
  countdown(audio) {
    const bus = mix(audio);
    playTone(audio, bus, { freq: 660, dur: 0.1, type: "square", gain: 0.1 });
    playTone(audio, bus, { freq: 990, dur: 0.08, type: "sine", gain: 0.12, delay: 0.02 });
  },
  go(audio) {
    const bus = mix(audio);
    kick(audio, bus, 0, 0.24);
    playTone(audio, bus, { freq: 392, dur: 0.12, type: "sawtooth", gain: 0.08 });
    playTone(audio, bus, { freq: 784, dur: 0.18, type: "triangle", gain: 0.16, delay: 0.04 });
    playTone(audio, bus, { freq: 1174, dur: 0.22, type: "sine", gain: 0.12, delay: 0.1 });
  },
  match(audio) {
    const bus = mix(audio);
    playTone(audio, bus, { freq: 196, dur: 0.14, type: "sawtooth", gain: 0.08 });
    playTone(audio, bus, { freq: 392, dur: 0.12, type: "triangle", gain: 0.12, delay: 0.06 });
    playTone(audio, bus, { freq: 587, dur: 0.18, type: "sine", gain: 0.14, delay: 0.14 });
  },
};

function fire(name: SfxName, audio: AudioContext): void {
  if (name !== "mute" && muted) return;
  if (audio.state !== "running") {
    pending.push(name);
    return;
  }
  try {
    const pack = scene === "battle" ? BATTLE : HOME;
    (pack[name] ?? HOME[name])(audio);
  } catch {
    /* ignore closed / interrupted context */
  }
}

export function playSfx(name: SfxName): void {
  armSfx();
  if (name !== "mute" && muted) return;
  const audio = getCtx();
  if (!audio) return;
  if (audio.state === "running") {
    keepAlive(audio);
    fire(name, audio);
    return;
  }
  if (pending.length > 12) pending.shift();
  pending.push(name);
  void resume().then((ready) => {
    if (!ready || ready.state !== "running") return;
    const batch = pending.splice(0);
    for (const queued of batch) fire(queued, ready);
  });
}
