import type { SubjectId } from "../curriculum";
import { ANIM } from "./animationConfig";

export type ParallaxLayer =
  | "background"
  | "mountains"
  | "world"
  | "foreground"
  | "mascot";

export const PARALLAX_STRENGTH: Record<ParallaxLayer, number> = {
  background: ANIM.parallax.background,
  mountains: ANIM.parallax.mountains,
  world: ANIM.parallax.world,
  foreground: ANIM.parallax.foreground,
  mascot: ANIM.parallax.mascot,
};

export type WorldFxKind =
  | "bubbles"
  | "letters"
  | "petals"
  | "numbers"
  | "tropical";

export function getWorldFx(subject: SubjectId): WorldFxKind {
  switch (subject) {
    case "science":
      return "bubbles";
    case "english":
      return "letters";
    case "chinese":
      return "petals";
    case "math":
      return "numbers";
    case "malay":
      return "tropical";
  }
}

export function clampParallax(value: number): number {
  const max = ANIM.parallax.maxPx;
  return Math.max(-max, Math.min(max, value));
}

export function parallaxOffset(
  layer: ParallaxLayer,
  nx: number,
  ny: number,
): { x: number; y: number } {
  const strength = PARALLAX_STRENGTH[layer];
  return {
    x: clampParallax(nx * strength),
    y: clampParallax(ny * strength * 0.65),
  };
}
