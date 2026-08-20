"use client";

import { motion } from "framer-motion";
import type { SubjectWorld, WorldStageId } from "../../lib/worlds";
import { usePrefersReducedMotion } from "../../lib/usePrefersReducedMotion";

type Props = {
  world: SubjectWorld;
  stage: WorldStageId;
};

const PARTICLES = [
  { left: "12%", top: "32%", delay: 0, duration: 5.2 },
  { left: "22%", top: "40%", delay: 0.4, duration: 6.1 },
  { left: "31%", top: "28%", delay: 0.8, duration: 4.8 },
  { left: "41%", top: "36%", delay: 1.1, duration: 5.6 },
  { left: "52%", top: "24%", delay: 0.2, duration: 6.4 },
  { left: "61%", top: "38%", delay: 1.5, duration: 5.0 },
  { left: "70%", top: "30%", delay: 0.6, duration: 5.8 },
  { left: "78%", top: "42%", delay: 1.8, duration: 4.6 },
  { left: "18%", top: "48%", delay: 2.1, duration: 6.0 },
  { left: "48%", top: "44%", delay: 0.9, duration: 5.4 },
  { left: "66%", top: "50%", delay: 1.3, duration: 5.9 },
  { left: "36%", top: "52%", delay: 1.7, duration: 4.9 },
] as const;

export function WorldBackground({ world, stage }: Props) {
  const reduced = usePrefersReducedMotion();
  const richness =
    stage === "village"
      ? 1
      : stage === "academy"
        ? 2
        : stage === "temple"
          ? 3
          : stage === "city"
            ? 4
            : stage === "kingdom"
              ? 5
              : 6;

  return (
    <div className="absolute inset-0 overflow-hidden rounded-[1.6rem]">
      <div
        className={`absolute inset-0 ${reduced ? "" : "world-sky-shift"}`}
        style={{
          background: `linear-gradient(180deg, ${world.skyFrom} 0%, ${world.skyTo} 58%, ${world.wood} 100%)`,
        }}
      />

      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_30%,rgba(255,255,255,0.55),transparent_55%)]" />

      <motion.div
        className="absolute top-[12%] left-[18%] h-5 w-16 rounded-full bg-white/70 will-change-transform"
        animate={reduced ? undefined : { x: [-10, 10, -10] }}
        transition={{ duration: 16, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute top-[22%] left-[52%] h-4 w-12 rounded-full bg-white/50 will-change-transform"
        animate={reduced ? undefined : { x: [10, -10, 10] }}
        transition={{ duration: 19, repeat: Infinity, ease: "easeInOut", delay: 2 }}
      />

      {!reduced
        ? PARTICLES.map((p, i) => (
            <motion.span
              key={i}
              className="absolute h-1.5 w-1.5 rounded-full bg-white/75 will-change-transform"
              style={{ left: p.left, top: p.top }}
              animate={{ y: [8, -14], opacity: [0, 0.8, 0] }}
              transition={{
                duration: p.duration,
                repeat: Infinity,
                delay: p.delay,
                ease: "easeOut",
              }}
            />
          ))
        : null}

      <div className="absolute bottom-[34%] left-[12%] right-[18%] h-3 overflow-hidden rounded-full bg-[#7ec8e8]/80">
        {!reduced ? <span className="water-sheen absolute inset-y-0 left-0 w-1/2 rounded-full bg-white/50" /> : null}
        <span className="absolute bottom-[34%] left-[20%] right-[28%] h-1 rounded-full bg-white/40" />
      </div>
      <div className="pointer-events-none absolute bottom-[35%] left-[20%] right-[28%] h-1 rounded-full bg-white/40" />

      <div className="absolute bottom-[36%] left-[28%] right-[34%] h-2 rounded-full bg-[#c4a07a]" />
      <div className="absolute bottom-[36%] left-[36%] h-5 w-1 bg-[#a67c52]/70" />
      <div className="absolute bottom-[36%] right-[42%] h-5 w-1 bg-[#a67c52]/70" />

      <Tree left="8%" bottom="28%" size={richness >= 2 ? "md" : "sm"} delay={0} reduced={reduced} />
      <Tree left="78%" bottom="30%" size={richness >= 3 ? "lg" : "md"} delay={0.7} reduced={reduced} />
      {richness >= 4 ? <Tree left="18%" bottom="26%" size="sm" delay={1.4} reduced={reduced} /> : null}
      {richness >= 5 ? <Tree left="68%" bottom="27%" size="sm" delay={2.1} reduced={reduced} /> : null}

      <motion.div
        className="absolute bottom-[38%] left-1/2 origin-bottom -translate-x-1/2 will-change-transform"
        animate={reduced ? undefined : { y: [0, -3, 0], scale: [1, 1.01, 1] }}
        transition={{ duration: 5.6, repeat: Infinity, ease: "easeInOut" }}
      >
        <ToyTown accent={world.accent} richness={richness} reduced={reduced} />
      </motion.div>

      {richness >= 3 ? (
        <motion.div
          className="absolute bottom-[29%] left-[24%] text-sm will-change-transform"
          animate={reduced ? undefined : { x: [0, 6, 0] }}
          transition={{ duration: 4.2, repeat: Infinity, ease: "easeInOut" }}
        >
          🐣
        </motion.div>
      ) : null}
      {richness >= 4 ? (
        <motion.div
          className="absolute bottom-[28%] right-[22%] text-sm will-change-transform"
          animate={reduced ? undefined : { y: [0, -3, 0] }}
          transition={{ duration: 3.4, repeat: Infinity, ease: "easeInOut" }}
        >
          🐥
        </motion.div>
      ) : null}

      <div
        className="absolute inset-x-0 bottom-0 h-[30%]"
        style={{
          background: `linear-gradient(180deg, transparent, ${world.wood}cc)`,
        }}
      />
    </div>
  );
}

function Tree({
  left,
  bottom,
  size,
  delay,
  reduced,
}: {
  left: string;
  bottom: string;
  size: "sm" | "md" | "lg";
  delay: number;
  reduced: boolean;
}) {
  const dim = size === "lg" ? "h-12 w-8" : size === "md" ? "h-10 w-7" : "h-8 w-5";
  return (
    <motion.div
      className={`absolute origin-bottom ${dim} will-change-transform`}
      style={{ left, bottom }}
      animate={reduced ? undefined : { rotate: [-1, 1, -1] }}
      transition={{ duration: 4.2, repeat: Infinity, delay, ease: "easeInOut" }}
    >
      <div className="mx-auto h-[55%] w-[90%] rounded-full bg-[#5fbf73]" />
      <div className="mx-auto -mt-1 h-[50%] w-[18%] rounded bg-[#9a6b3f]" />
    </motion.div>
  );
}

function ToyTown({
  accent,
  richness,
  reduced,
}: {
  accent: string;
  richness: number;
  reduced: boolean;
}) {
  return (
    <div className="relative h-28 w-40">
      <div
        className="absolute bottom-0 left-10 h-14 w-16 rounded-t-2xl shadow-md"
        style={{ background: accent }}
      />
      <div className="absolute bottom-14 left-8 h-0 w-0 border-l-[40px] border-r-[40px] border-b-[22px] border-l-transparent border-r-transparent border-b-[#d9a066]" />
      <span
        className={`absolute bottom-6 left-[3.85rem] h-3.5 w-3.5 rounded-[3px] bg-[#ffe27a] ${reduced ? "" : "tower-window-glow"}`}
      />
      <div className="absolute bottom-4 left-[3.6rem] h-6 w-5 rounded-t-md bg-[#fff8ea]/85" />

      {richness >= 2 ? (
        <div className="absolute bottom-0 left-1 h-10 w-10 rounded-t-xl bg-[#f0d7b0] shadow">
          <div className="absolute -top-3 left-0 h-0 w-0 border-l-[20px] border-r-[20px] border-b-[14px] border-l-transparent border-r-transparent border-b-[#c9845a]" />
          <span
            className={`absolute bottom-3 left-3 h-2.5 w-2.5 rounded-[2px] bg-[#ffe27a] ${reduced ? "" : "tower-window-glow"}`}
          />
        </div>
      ) : null}

      {richness >= 3 ? (
        <div className="absolute bottom-0 right-1 h-16 w-9 rounded-t-lg bg-white/85 shadow">
          <div
            className="absolute -top-4 left-1/2 h-6 w-6 -translate-x-1/2 rounded-full"
            style={{ background: accent }}
          />
        </div>
      ) : null}

      {richness >= 4 ? (
        <>
          <div className="absolute bottom-0 left-[4.8rem] h-12 w-8 rounded-t-md bg-[#efd2a8]" />
          <div className="absolute bottom-12 left-[4.5rem] h-3 w-10 rounded bg-[#c9a06c]" />
        </>
      ) : null}

      {richness >= 5 ? (
        <div className="absolute -top-2 left-1/2 h-8 w-24 -translate-x-1/2 rounded-full bg-white/50 blur-[1px]" />
      ) : null}
    </div>
  );
}
