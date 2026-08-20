"use client";

import { motion } from "framer-motion";
import { usePrefersReducedMotion } from "../../lib/usePrefersReducedMotion";

const MOTES = [
  { left: "8%", top: "12%", delay: 0, dur: 7.5, size: 3 },
  { left: "22%", top: "8%", delay: 1.2, dur: 8.6, size: 2 },
  { left: "44%", top: "10%", delay: 0.5, dur: 7.1, size: 3 },
  { left: "68%", top: "14%", delay: 1.6, dur: 9.2, size: 2 },
  { left: "84%", top: "9%", delay: 0.8, dur: 7.8, size: 3 },
  { left: "32%", top: "24%", delay: 2.1, dur: 8.4, size: 2 },
  { left: "58%", top: "20%", delay: 1.3, dur: 7.3, size: 2 },
] as const;

/** Quiet sky-to-meadow backdrop — cards stay the hero. */
export function ChallengeBackground() {
  const reduced = usePrefersReducedMotion();

  return (
    <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden" aria-hidden>
      <div className="challenge-sky absolute inset-0" />
      <div className="challenge-diamond-grid absolute inset-0" />
      <div
        className={`home-cloud home-cloud-a ${reduced ? "" : "home-cloud-drift"}`}
        aria-hidden
      />
      <div
        className={`home-cloud home-cloud-b ${reduced ? "" : "home-cloud-drift-slow"}`}
        aria-hidden
      />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_18%,rgba(255,255,255,0.22)_0%,transparent_48%)]" />
      <div className="home-vignette absolute inset-0 opacity-50" />

      {!reduced
        ? MOTES.map((m, i) => (
            <motion.span
              key={i}
              className="absolute rounded-full bg-white/50"
              style={{
                left: m.left,
                top: m.top,
                width: m.size,
                height: m.size,
                boxShadow: "0 0 5px rgba(255,255,255,0.3)",
              }}
              animate={{ y: [4, -12], opacity: [0, 0.3, 0] }}
              transition={{
                duration: m.dur,
                repeat: Infinity,
                delay: m.delay,
                ease: "easeOut",
              }}
            />
          ))
        : null}
    </div>
  );
}
