"use client";

import { useEffect, useId, useMemo, useState } from "react";
import { animate, useMotionValue, useMotionValueEvent } from "framer-motion";
import type { SubjectId } from "../../lib/curriculum";
import { MASTERY_SUBJECTS } from "../../lib/mastery";
import { SubjectMascotIcon } from "../icons/SubjectMascotIcon";
import { usePrefersReducedMotion } from "../../lib/usePrefersReducedMotion";

const SIZE = 420;
const CX = 210;
const CY = 214;
const MAX_R = 100;
const RINGS = [0.25, 0.5, 0.75, 1];

type Props = {
  values: Record<SubjectId, number>;
  overall: number;
};

function angleOf(i: number): number {
  return -Math.PI / 2 + (i * 2 * Math.PI) / 5;
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

export function MasteryRadar({ values, overall }: Props) {
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
      duration: 1.2,
      ease: [0.16, 1, 0.3, 1],
    });
    return () => ctrl.stop();
  }, [progress, reduced, signature]);

  const shown = useMemo(
    () => MASTERY_SUBJECTS.map((s) => ((values[s.id] ?? 0) / 100) * t),
    [t, values],
  );
  const fill = poly(shown);
  const shownOverall = Math.round(overall * t);

  return (
    <div
      className="relative mx-auto aspect-square w-full max-w-[23rem]"
      role="img"
      aria-label={`科目掌握度五边形。总掌握度 ${overall}。${MASTERY_SUBJECTS.map((s) => `${s.name} ${values[s.id] ?? 0}%`).join("，")}`}
    >
      <svg viewBox={`0 0 ${SIZE} ${SIZE}`} className="h-full w-full overflow-visible" aria-hidden>
        <defs>
          <radialGradient id={`${uid}-disc`} cx="50%" cy="42%" r="62%">
            <stop offset="0%" stopColor="#fff8e4" />
            <stop offset="62%" stopColor="#f3d59a" />
            <stop offset="100%" stopColor="#c99248" />
          </radialGradient>
          <linearGradient id={`${uid}-fill`} x1="50%" y1="0%" x2="50%" y2="100%">
            <stop offset="0%" stopColor="#ffe27a" stopOpacity="0.95" />
            <stop offset="52%" stopColor="#7ee08a" stopOpacity="0.78" />
            <stop offset="100%" stopColor="#2f9e6e" stopOpacity="0.52" />
          </linearGradient>
          <filter id={`${uid}-glow`} x="-45%" y="-45%" width="190%" height="190%">
            <feGaussianBlur stdDeviation="6" result="blur" />
            <feColorMatrix
              in="blur"
              type="matrix"
              values="1 0 0 0 0.15  0 1 0 0 0.08  0 0 1 0 0  0 0 0 0.85 0"
              result="tint"
            />
            <feMerge>
              <feMergeNode in="tint" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        <circle cx={CX} cy={CY} r="156" fill={`url(#${uid}-disc)`} opacity="0.48" />
        <circle cx={CX} cy={CY} r="156" fill="none" stroke="rgba(255,226,122,0.45)" strokeWidth="3" />

        {RINGS.map((ring) => (
          <polygon
            key={ring}
            points={poly(Array(5).fill(ring) as number[])}
            fill={ring === 1 ? "rgba(255,248,234,0.12)" : "none"}
            stroke={ring === 1 ? "rgba(90,58,22,0.42)" : "rgba(138,90,24,0.2)"}
            strokeWidth={ring === 1 ? 2.4 : 1.15}
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
              stroke="rgba(90,58,22,0.2)"
              strokeWidth="1.15"
            />
          );
        })}

        <polygon
          className="mastery-glow-poly"
          points={fill}
          fill="#ffe27a"
          stroke="none"
          filter={`url(#${uid}-glow)`}
          opacity="0.55"
        />
        <polygon
          points={fill}
          fill={`url(#${uid}-fill)`}
          stroke="#ffe27a"
          strokeWidth="3.4"
          strokeLinejoin="round"
          filter={`url(#${uid}-glow)`}
        />
        <polygon
          points={fill}
          fill="none"
          stroke="#fff8ea"
          strokeWidth="1.2"
          strokeLinejoin="round"
          opacity="0.9"
        />

        {MASTERY_SUBJECTS.map((s, i) => {
          const p = pt(i, shown[i] || 0);
          return (
            <circle
              key={`${s.id}-dot`}
              cx={p.x}
              cy={p.y}
              r="5.5"
              fill="#fff8ea"
              stroke={s.accent}
              strokeWidth="2.5"
            />
          );
        })}
      </svg>

      <div className="pointer-events-none absolute left-1/2 top-1/2 z-10 flex h-[5rem] w-[5rem] -translate-x-1/2 -translate-y-1/2 flex-col items-center justify-center rounded-full bg-gradient-to-b from-[#fff8ea] to-[#f0d089] shadow-[0_8px_18px_rgba(80,50,10,0.3),0_0_18px_rgba(255,210,80,0.45),inset_0_1px_0_rgba(255,255,255,0.9)] ring-[3px] ring-[#ffe7b4]">
        <span className="font-[family-name:var(--font-display)] text-[1.7rem] font-bold leading-none text-[#3d2f1e]">
          {shownOverall}
        </span>
        <span className="mt-0.5 text-[8px] font-extrabold leading-none tracking-[0.12em] text-[#8a5a18] uppercase">
          Mastery
        </span>
        <span className="mt-0.5 text-[8px] font-extrabold leading-none text-[#a07840]">掌握度</span>
      </div>

      {MASTERY_SUBJECTS.map((s, i) => {
        const p = pt(i, 1.46);
        const score = Math.round((values[s.id] ?? 0) * t);
        return (
          <div
            key={s.id}
            className="pointer-events-none absolute z-10 w-[5.1rem] -translate-x-1/2 -translate-y-1/2 text-center"
            style={{ left: `${(p.x / SIZE) * 100}%`, top: `${(p.y / SIZE) * 100}%` }}
          >
            <span
              className="mx-auto flex h-8 w-8 items-center justify-center overflow-hidden rounded-full shadow-[0_3px_0_rgba(90,50,10,0.22)] ring-2 ring-white"
              style={{ background: s.accent }}
            >
              <SubjectMascotIcon subject={s.id} className="h-7 w-7 object-contain" />
            </span>
            <p className="mt-0.5 font-[family-name:var(--font-display)] text-[11px] font-bold leading-tight text-[#3d2f1e]">
              {s.compact}
            </p>
            <p className="text-[8px] font-extrabold leading-tight text-[#8a7355]">{s.hud}</p>
            <p className="mt-0.5 text-[12px] font-extrabold tabular-nums" style={{ color: s.accent }}>
              {score}%
            </p>
          </div>
        );
      })}
    </div>
  );
}
