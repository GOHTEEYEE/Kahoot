"use client";

import type { CSSProperties } from "react";
import { motion } from "framer-motion";
import type { SubjectWorld, WorldStageId } from "../../lib/worlds";
import { ANIM } from "../../lib/animation/animationConfig";

type LayerProps = {
  world: SubjectWorld;
  stage: WorldStageId;
  reduced: boolean;
  style?: CSSProperties;
};

function richnessOf(stage: WorldStageId): number {
  return stage === "village"
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
}

export function WorldSky({ world, reduced, style }: Omit<LayerProps, "stage">) {
  return (
    <div
      className={`absolute inset-0 ${reduced ? "" : "world-sky-shift"}`}
      style={{
        ...style,
        background: `linear-gradient(180deg, ${world.skyFrom} 0%, ${world.skyTo} 58%, ${world.wood} 100%)`,
      }}
    />
  );
}

export function WorldAtmosphere({ style }: { style?: CSSProperties }) {
  return (
    <div
      className="absolute inset-0 bg-[radial-gradient(circle_at_50%_30%,rgba(255,255,255,0.55),transparent_55%)]"
      style={style}
    />
  );
}

export function WorldClouds({ reduced, style }: { reduced: boolean; style?: CSSProperties }) {
  return (
    <div className="absolute inset-0" style={style}>
      <motion.div
        className="absolute top-[12%] left-[18%] h-5 w-16 rounded-full bg-white/70 will-change-transform"
        animate={reduced ? undefined : { x: [-10, 10, -10] }}
        transition={{ duration: ANIM.atmosphere.cloudMs / 1000, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute top-[22%] left-[52%] h-4 w-12 rounded-full bg-white/50 will-change-transform"
        animate={reduced ? undefined : { x: [10, -10, 10] }}
        transition={{
          duration: (ANIM.atmosphere.cloudMs + 3000) / 1000,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 2,
        }}
      />
    </div>
  );
}

export function WorldMountains({ world, style }: { world: SubjectWorld; style?: CSSProperties }) {
  return (
    <div className="absolute inset-x-0 bottom-[42%] h-[28%]" style={style}>
      <div
        className="absolute bottom-0 left-[8%] h-16 w-24 opacity-35"
        style={{
          clipPath: "polygon(50% 0%, 100% 100%, 0% 100%)",
          background: world.wood,
        }}
      />
      <div
        className="absolute bottom-0 left-[38%] h-20 w-28 opacity-25"
        style={{
          clipPath: "polygon(50% 0%, 100% 100%, 0% 100%)",
          background: world.accent,
        }}
      />
      <div
        className="absolute bottom-0 right-[10%] h-14 w-20 opacity-30"
        style={{
          clipPath: "polygon(50% 0%, 100% 100%, 0% 100%)",
          background: world.wood,
        }}
      />
    </div>
  );
}

export function WorldWater({ reduced, style }: { reduced: boolean; style?: CSSProperties }) {
  return (
    <div className="absolute inset-0" style={style}>
      <div className="absolute bottom-[34%] left-[12%] right-[18%] h-3 overflow-hidden rounded-full bg-[#7ec8e8]/80">
        {!reduced ? (
          <span className="water-sheen absolute inset-y-0 left-0 w-1/2 rounded-full bg-white/50" />
        ) : null}
      </div>
      <div className="pointer-events-none absolute bottom-[35%] left-[20%] right-[28%] h-1 rounded-full bg-white/40" />
      <div className="absolute bottom-[36%] left-[28%] right-[34%] h-2 rounded-full bg-[#c4a07a]" />
      <div className="absolute bottom-[36%] left-[36%] h-5 w-1 bg-[#a67c52]/70" />
      <div className="absolute bottom-[36%] right-[42%] h-5 w-1 bg-[#a67c52]/70" />
    </div>
  );
}

export function WorldTrees({
  stage,
  reduced,
  style,
}: {
  stage: WorldStageId;
  reduced: boolean;
  style?: CSSProperties;
}) {
  const richness = richnessOf(stage);
  return (
    <div className="absolute inset-0" style={style}>
      <Tree left="8%" bottom="28%" size={richness >= 2 ? "md" : "sm"} delay={0} reduced={reduced} />
      <Tree left="78%" bottom="30%" size={richness >= 3 ? "lg" : "md"} delay={0.7} reduced={reduced} />
      {richness >= 4 ? <Tree left="18%" bottom="26%" size="sm" delay={1.4} reduced={reduced} /> : null}
      {richness >= 5 ? <Tree left="68%" bottom="27%" size="sm" delay={2.1} reduced={reduced} /> : null}
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
      transition={{ duration: ANIM.atmosphere.treeMs / 1000, repeat: Infinity, delay, ease: "easeInOut" }}
    >
      <div className="mx-auto h-[55%] w-[90%] rounded-full bg-[#5fbf73]" />
      <div className="mx-auto -mt-1 h-[50%] w-[18%] rounded bg-[#9a6b3f]" />
    </motion.div>
  );
}

export function WorldBuildings({
  world,
  stage,
  reduced,
  style,
}: {
  world: SubjectWorld;
  stage: WorldStageId;
  reduced: boolean;
  style?: CSSProperties;
}) {
  const richness = richnessOf(stage);
  return (
    <motion.div
      className="absolute bottom-[38%] left-1/2 origin-bottom -translate-x-1/2 will-change-transform"
      style={style}
      initial={reduced ? false : { opacity: 0, scale: 0.96 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.45, delay: reduced ? 0 : 0.22, ease: [0.22, 1, 0.36, 1] }}
    >
      <div className="relative h-28 w-40">
        <div
          className="absolute bottom-0 left-10 h-14 w-16 rounded-t-2xl shadow-md"
          style={{ background: world.accent }}
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
              style={{ background: world.accent }}
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
    </motion.div>
  );
}

export function WorldDecorations({
  stage,
  reduced,
  style,
}: {
  stage: WorldStageId;
  reduced: boolean;
  style?: CSSProperties;
}) {
  const richness = richnessOf(stage);
  return (
    <div className="absolute inset-0" style={style}>
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
    </div>
  );
}

export function WorldTerrain({ world, style }: { world: SubjectWorld; style?: CSSProperties }) {
  return (
    <div
      className="absolute inset-x-0 bottom-0 h-[30%]"
      style={{
        ...style,
        background: `linear-gradient(180deg, transparent, ${world.wood}cc)`,
      }}
    />
  );
}

export function WorldParticles({
  reduced,
  style,
}: {
  subjectId: import("../../lib/curriculum").SubjectId;
  reduced: boolean;
  style?: CSSProperties;
}) {
  if (reduced) return null;
  const spots = [
    { left: "14%", top: "34%", delay: 0 },
    { left: "28%", top: "42%", delay: 0.5 },
    { left: "44%", top: "30%", delay: 1.0 },
    { left: "58%", top: "38%", delay: 0.3 },
    { left: "72%", top: "28%", delay: 1.4 },
    { left: "36%", top: "48%", delay: 0.8 },
    { left: "64%", top: "46%", delay: 1.7 },
    { left: "20%", top: "52%", delay: 1.1 },
    { left: "80%", top: "40%", delay: 0.6 },
    { left: "50%", top: "24%", delay: 1.9 },
  ];

  return (
    <div className="pointer-events-none absolute inset-0" style={style}>
      {spots.map((s, i) => (
        <motion.span
          key={i}
          className="absolute rounded-full bg-white/70 will-change-transform"
          style={{
            left: s.left,
            top: s.top,
            width: 3 + (i % 2),
            height: 3 + (i % 2),
            boxShadow: "0 0 6px rgba(255,255,255,0.35)",
          }}
          animate={{ y: [6, -16], opacity: [0, 0.45, 0] }}
          transition={{
            duration: ANIM.atmosphere.particleMs / 1000 + (i % 3) * 0.35,
            repeat: Infinity,
            delay: s.delay,
            ease: "easeOut",
          }}
        />
      ))}
    </div>
  );
}

export function WorldForeground({ reduced, style }: { reduced: boolean; style?: CSSProperties }) {
  return (
    <div className="pointer-events-none absolute inset-0" style={style}>
      <motion.div
        className="absolute bottom-[8%] left-[4%] h-8 w-10 rounded-t-full bg-[#4f9d63]/55"
        animate={reduced ? undefined : { rotate: [-1.5, 1.5, -1.5] }}
        transition={{ duration: 3.8, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute bottom-[7%] right-[5%] h-7 w-9 rounded-t-full bg-[#4f9d63]/45"
        animate={reduced ? undefined : { rotate: [1.5, -1.5, 1.5] }}
        transition={{ duration: 4.2, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
      />
    </div>
  );
}
