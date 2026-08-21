"use client";

import type { CSSProperties } from "react";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";

type Fall = { left: number; top: number; width: number; height: number };

type WaterProps = {
  falls: Fall[];
  reduced: boolean;
};

const WATERFALL_FLOW_SRC = "/worlds/shared/waterfall-flow.webm?v=1";
const WATER_SPLASH_SRC = "/worlds/shared/water-splash.webm?v=1";

const DROPLETS = [
  { x: "28%", delay: 0, dur: 1.4 },
  { x: "52%", delay: 0.4, dur: 1.25 },
  { x: "74%", delay: 0.75, dur: 1.55 },
];

function useRemotionFxAvailable(): boolean {
  const [ok, setOk] = useState(false);

  useEffect(() => {
    let cancelled = false;
    fetch(WATERFALL_FLOW_SRC, { method: "HEAD" })
      .then((res) => {
        if (!cancelled) setOk(res.ok);
      })
      .catch(() => {
        if (!cancelled) setOk(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  return ok;
}

/** Remotion WebM loops (preferred) with CSS gradient fallback. */
export function IslandWaterfalls({ falls, reduced }: WaterProps) {
  const remotionFx = useRemotionFxAvailable();
  if (reduced) return null;

  return (
    <div className="pointer-events-none absolute inset-0 z-[3]" aria-hidden>
      {falls.map((fall, i) => (
        <div key={i} className="island-fall absolute" style={hotspotStyle(fall)}>
          {remotionFx ? (
            <>
              <video
                autoPlay
                loop
                muted
                playsInline
                preload="auto"
                className="island-fall-video island-fall-video-flow"
                style={{ animationDelay: `${i * -0.25}s` }}
              >
                <source src={WATERFALL_FLOW_SRC} type="video/webm" />
              </video>
              <video
                autoPlay
                loop
                muted
                playsInline
                preload="auto"
                className="island-fall-video island-fall-video-splash"
                style={{ animationDelay: `${i * -0.4}s` }}
              >
                <source src={WATER_SPLASH_SRC} type="video/webm" />
              </video>
            </>
          ) : (
            <>
              <span className="island-fall-stream island-fall-stream-a" style={{ animationDelay: `${i * -0.2}s` }} />
              <span
                className="island-fall-stream island-fall-stream-b"
                style={{ animationDelay: `${i * -0.45}s` }}
              />
              {DROPLETS.map((d, di) => (
                <span
                  key={di}
                  className="island-fall-drop"
                  style={{
                    left: d.x,
                    animationDuration: `${d.dur}s`,
                    animationDelay: `${i * 0.15 + d.delay}s`,
                  }}
                />
              ))}
              <span className="island-fall-splash island-fall-splash-run" />
              <span
                className="island-fall-splash island-fall-splash-b island-fall-splash-run"
                style={{ animationDelay: "0.35s" }}
              />
            </>
          )}
        </div>
      ))}
    </div>
  );
}

function hotspotStyle(h: Fall): CSSProperties {
  return {
    left: `${h.left * 100}%`,
    top: `${h.top * 100}%`,
    width: `${h.width * 100}%`,
    height: `${h.height * 100}%`,
  };
}

type MascotProps = {
  src: string;
  waveSrc?: string;
  waving: boolean;
  reduced: boolean;
  hotspot: { left: number; top: number; width: number; height: number };
};

/** Pose swap (idle ↔ wave) — mascot only, not the island plate. */
export function LivingMascot({ src, waveSrc, waving, reduced, hotspot }: MascotProps) {
  const [pose, setPose] = useState<"idle" | "wave">("idle");

  useEffect(() => {
    if (reduced || !waveSrc) {
      setPose(waving ? "wave" : "idle");
      return;
    }
    if (waving) {
      setPose("wave");
      return;
    }

    setPose("idle");
    let tick = 0;
    const id = window.setInterval(() => {
      setPose("wave");
      tick = window.setTimeout(() => setPose("idle"), 720);
    }, 4200);
    return () => {
      window.clearInterval(id);
      window.clearTimeout(tick);
    };
  }, [waving, reduced, waveSrc]);

  const frame = pose === "wave" && waveSrc ? waveSrc : src;

  return (
    <motion.img
      key={frame}
      src={frame}
      alt=""
      draggable={false}
      className="absolute z-[4] object-contain object-bottom drop-shadow-[0_6px_8px_rgba(40,25,10,0.28)]"
      style={{
        left: `${hotspot.left * 100}%`,
        top: `${hotspot.top * 100}%`,
        width: `${hotspot.width * 100}%`,
        height: `${hotspot.height * 100}%`,
        transformOrigin: "50% 92%",
      }}
      initial={{ opacity: 0.7, scale: 0.97 }}
      animate={
        reduced
          ? { opacity: 1, scale: 1, y: 0, rotate: 0 }
          : waving
            ? { opacity: 1, rotate: [0, -8, 10, -4, 0], scale: [1, 1.06, 1], y: 0 }
            : {
                opacity: 1,
                y: [0, -3.5, 0],
                rotate: [0, 1.6, -1.2, 0],
                scale: [1, 1.025, 1],
              }
      }
      transition={
        waving
          ? { duration: 0.85, ease: "easeInOut" }
          : reduced
            ? { duration: 0.3 }
            : { duration: 3.4, repeat: Infinity, ease: "easeInOut" }
      }
    />
  );
}
