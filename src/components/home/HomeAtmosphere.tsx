"use client";

import { motion } from "framer-motion";
import { usePrefersReducedMotion } from "../../lib/usePrefersReducedMotion";

const MOTES = [
  { left: "12%", top: "22%", delay: 0, dur: 7.2, size: 3 },
  { left: "28%", top: "18%", delay: 1.1, dur: 8.4, size: 2 },
  { left: "46%", top: "14%", delay: 0.4, dur: 6.8, size: 3 },
  { left: "63%", top: "20%", delay: 1.8, dur: 9.1, size: 2 },
  { left: "78%", top: "16%", delay: 0.7, dur: 7.6, size: 3 },
  { left: "18%", top: "38%", delay: 2.2, dur: 8.8, size: 2 },
  { left: "54%", top: "34%", delay: 1.4, dur: 7.0, size: 2 },
  { left: "86%", top: "30%", delay: 0.9, dur: 8.2, size: 3 },
] as const;

/** Atmospheric sky gradient — island is the hero; background creates depth only. */
export function HomeAtmosphere() {
  const reduced = usePrefersReducedMotion();

  return (
    <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden" aria-hidden>
      <div className="home-sky absolute inset-0" />
      <div
        className={`home-cloud home-cloud-a ${reduced ? "" : "home-cloud-drift"}`}
        aria-hidden
      />
      <div
        className={`home-cloud home-cloud-b ${reduced ? "" : "home-cloud-drift-slow"}`}
        aria-hidden
      />
      <div
        className={`home-cloud home-cloud-c ${reduced ? "" : "home-cloud-drift"}`}
        aria-hidden
      />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_42%,rgba(255,255,255,0.14)_0%,transparent_52%)]" />
      <div className="home-vignette absolute inset-0 opacity-60" />

      {!reduced
        ? MOTES.map((m, i) => (
            <motion.span
              key={i}
              className="absolute rounded-full bg-white/55"
              style={{
                left: m.left,
                top: m.top,
                width: m.size,
                height: m.size,
                boxShadow: "0 0 6px rgba(255,255,255,0.35)",
              }}
              animate={{ y: [6, -14], opacity: [0, 0.35, 0] }}
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
