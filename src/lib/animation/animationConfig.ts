/** Centralized animation timing for MathArena home world (Version 1). */

export const ANIM = {
  entrance: {
    background: 0,
    platform: 100,
    environment: 200,
    building: 300,
    mascot: 400,
    trophy: 500,
    challenge: 600,
    totalMs: 900,
  },
  worldSwitch: {
    durationMs: 500,
    exitScale: 0.97,
    enterScale: 0.97,
  },
  trophy: {
    countMs: 800,
    barMs: 800,
  },
  challenge: {
    breatheMs: 2800,
    hoverScale: 1.035,
    pressScale: 0.97,
    idleScale: 1.01,
  },
  mascot: {
    speechMs: 2500,
    waveMs: 1100,
    idleCycleMs: 6500,
  },
  parallax: {
    background: 2,
    mountains: 3.5,
    world: 5,
    foreground: 7,
    mascot: 9,
    maxPx: 10,
  },
  atmosphere: {
    cloudMs: 16_000,
    treeMs: 4200,
    particleMs: 5500,
    waterMs: 4500,
    towerFloatMs: 5600,
  },
} as const;
