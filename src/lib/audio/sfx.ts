const MUTE_KEY = "matharena:sfx-muted";

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
  | "mute";

type Tone = {
  freq: number;
  dur: number;
  type?: OscillatorType;
  gain?: number;
  delay?: number;
  slideTo?: number;
};

let ctx: AudioContext | null = null;
let master: GainNode | null = null;
let muted = false;
let armed = false;
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
    master.gain.value = 0.28;
    master.connect(ctx.destination);
  }
  return ctx;
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
  return audio;
}

export function armSfx(): void {
  if (armed || typeof window === "undefined") return;
  armed = true;
  const unlock = () => {
    void resume();
  };
  window.addEventListener("pointerdown", unlock, { once: true, capture: true });
  window.addEventListener("keydown", unlock, { once: true, capture: true });
}

function envGain(audio: AudioContext, peak: number, dur: number, delay = 0): GainNode {
  const g = audio.createGain();
  const t = audio.currentTime + delay;
  g.gain.setValueAtTime(0.0001, t);
  g.gain.exponentialRampToValueAtTime(Math.max(0.0002, peak), t + 0.012);
  g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
  return g;
}

function playTone(audio: AudioContext, dest: AudioNode, tone: Tone): void {
  const osc = audio.createOscillator();
  osc.type = tone.type ?? "triangle";
  const t0 = audio.currentTime + (tone.delay ?? 0);
  osc.frequency.setValueAtTime(tone.freq, t0);
  if (tone.slideTo) {
    osc.frequency.exponentialRampToValueAtTime(tone.slideTo, t0 + tone.dur);
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
  opts: { gain?: number; freq?: number; q?: number; delay?: number } = {},
): void {
  const length = Math.max(1, Math.floor(audio.sampleRate * dur));
  const buffer = audio.createBuffer(1, length, audio.sampleRate);
  const data = buffer.getChannelData(0);
  for (let i = 0; i < length; i += 1) data[i] = Math.random() * 2 - 1;
  const src = audio.createBufferSource();
  src.buffer = buffer;
  const filter = audio.createBiquadFilter();
  filter.type = "bandpass";
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

function mix(audio: AudioContext): GainNode {
  const bus = audio.createGain();
  bus.connect(master ?? audio.destination);
  return bus;
}

const PATCH: Record<SfxName, (audio: AudioContext) => void> = {
  tap(audio) {
    const bus = mix(audio);
    playTone(audio, bus, { freq: 920, dur: 0.07, type: "triangle", gain: 0.16 });
    playTone(audio, bus, { freq: 1380, dur: 0.05, type: "sine", gain: 0.1, delay: 0.018 });
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
    playTone(audio, bus, { freq: 196, dur: 0.14, type: "sawtooth", gain: 0.1 });
    playTone(audio, bus, { freq: 294, dur: 0.12, type: "square", gain: 0.07, delay: 0.02 });
    playTone(audio, bus, { freq: 880, dur: 0.16, type: "triangle", gain: 0.16, delay: 0.08 });
    playTone(audio, bus, { freq: 1318, dur: 0.18, type: "sine", gain: 0.1, delay: 0.14 });
  },
  whoosh(audio) {
    const bus = mix(audio);
    playNoise(audio, bus, 0.22, { freq: 900, q: 0.7, gain: 0.16 });
    playTone(audio, bus, { freq: 420, dur: 0.2, type: "sine", gain: 0.08, slideTo: 180 });
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
};

export function playSfx(name: SfxName): void {
  armSfx();
  if (name !== "mute" && muted) return;
  void resume().then((audio) => {
    if (!audio) return;
    if (name !== "mute" && muted) return;
    try {
      PATCH[name](audio);
    } catch {
      /* ignore autoplay / closed context */
    }
  });
}
