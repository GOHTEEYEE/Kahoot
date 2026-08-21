"use client";

import { useEffect, useId, useMemo, useState } from "react";
import { animate, useMotionValue, useMotionValueEvent } from "framer-motion";
import type { SubjectId } from "../../lib/curriculum";
import { MASTERY_SUBJECTS } from "../../lib/mastery";
import { usePrefersReducedMotion } from "../../lib/usePrefersReducedMotion";

const SIZE = 320;
const CX = 160;
const CY = 160;
const MAX_R = 92;
const RINGS = [0.25, 0.5, 0.75, 1];
const N = 5;

type Props = {
  values: Record<SubjectId, number>;
};

function angleOf(i: number): number {
  return -Math.PI / 2 + (i * 2 * Math.PI) / N;
}

function pt(i: number, t: number): { x: number; y: number } {
  const a = angleOf(i);
  const r = MAX_R * t;
  return { x: CX + r * Math.cos(a), y: CY + r * Math.sin(a) };
}

function poly(ts: number[]): string {
  return ts
    .map((t, i) => {
      const p = pt(i, t);
      return `${p.x.toFixed(1)},${p.y.toFixed(1)}`;
    })
    .join(" ");
}

/** Ability radar — no center character / avatar. */
export function MasteryRadar({ values }: Props) {
  const reduced = usePrefersReducedMotion();
  const uid = useId().replace(/:/g, "");
  const progress = useMotionValue(reduced ? 1 : 0);
  const [t, setT] = useState(reduced ? 1 : 0);
  const signature = MASTERY_SUBJECTS.map((s) => values[s.id] ?? 0).join(",");

  useMotionValueEvent(progress, "change", setT);

  useEffect(() => {
    if (reduced) {
      progress.set(1);
      setT(1);
      return;
    }
    progress.set(0);
    const ctrl = animate(progress, 1, {
      duration: 1.05,
      ease: [0.16, 1, 0.3, 1],
    });
    return () => ctrl.stop();
  }, [progress, reduced, signature]);

  const shown = useMemo(
    () => MASTERY_SUBJECTS.map((s) => ((values[s.id] ?? 0) / 100) * t),
    [t, values],
  );
  const fill = poly(shown);

  return (
    <div
      className="relative mx-auto aspect-square w-full max-w-[15.5rem]"
      role="img"
      aria-label={`科目能力雷达。${MASTERY_SUBJECTS.map((s) => `${s.hud} ${values[s.id] ?? 0}`).join("，")}`}
    >
      <svg viewBox={`0 0 ${SIZE} ${SIZE}`} className="h-full w-full overflow-visible" aria-hidden>
        <defs>
          <linearGradient id={`${uid}-fill`} x1="50%" y1="0%" x2="50%" y2="100%">
            <stop offset="0%" stopColor="#7ed957" stopOpacity="0.55" />
            <stop offset="100%" stopColor="#2f9e6e" stopOpacity="0.28" />
          </linearGradient>
        </defs>

        {RINGS.map((ring) => (
          <polygon
            key={ring}
            points={poly(Array(N).fill(ring) as number[])}
            fill={ring === 1 ? "rgba(255,248,234,0.35)" : "none"}
            stroke={ring === 1 ? "rgba(90,58,22,0.28)" : "rgba(138,90,24,0.14)"}
            strokeWidth={ring === 1 ? 1.6 : 1}
          />
        ))}

        {MASTERY_SUBJECTS.map((s, i) => {
          const outer = pt(i, 1);
          return (
            <line
              key={s.id}
              x1={CX}
              y1={CY}
              x2={outer.x}
              y2={outer.y}
              stroke="rgba(90,58,22,0.16)"
              strokeWidth="1"
            />
          );
        })}

        <polygon
          points={fill}
          fill={`url(#${uid}-fill)`}
          stroke="#3cb86a"
          strokeWidth="2.4"
          strokeLinejoin="round"
        />

        {MASTERY_SUBJECTS.map((s, i) => {
          const p = pt(i, shown[i] || 0);
          return (
            <circle
              key={`${s.id}-dot`}
              cx={p.x}
              cy={p.y}
              r="4"
              fill="#fff8ea"
              stroke="#2f9e6e"
              strokeWidth="2"
            />
          );
        })}
      </svg>

      {MASTERY_SUBJECTS.map((s, i) => {
        const p = pt(i, 1.28);
        return (
          <div
            key={s.id}
            className="pointer-events-none absolute z-10 w-[3.2rem] -translate-x-1/2 -translate-y-1/2 text-center"
            style={{ left: `${(p.x / SIZE) * 100}%`, top: `${(p.y / SIZE) * 100}%` }}
          >
            <p className="font-[family-name:var(--font-display)] text-[11px] font-bold leading-tight text-[#3d2f1e]">
              {s.hud}
            </p>
          </div>
        );
      })}
    </div>
  );
}
