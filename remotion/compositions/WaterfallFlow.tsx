import { AbsoluteFill, useCurrentFrame } from "remotion";

/** Narrow vertical strip — tiles inside island waterfall hotspots. */
export const WATERFALL_WIDTH = 128;
export const WATERFALL_HEIGHT = 384;
/** One full texture cycle = composition length (seamless loop). */
export const WATERFALL_DURATION_FRAMES = 45;

const STRIPE = 56;

export function WaterfallFlow() {
  const frame = useCurrentFrame();
  const shift = (frame / WATERFALL_DURATION_FRAMES) * STRIPE;

  return (
    <AbsoluteFill style={{ backgroundColor: "transparent" }}>
      <AbsoluteFill
        style={{
          transform: `translateY(${shift}px)`,
          backgroundImage: [
            "repeating-linear-gradient(180deg,",
            "transparent 0px,",
            "rgba(180, 235, 255, 0.15) 4px,",
            "rgba(255, 255, 255, 0.55) 10px,",
            "rgba(120, 210, 255, 0.35) 18px,",
            "rgba(255, 255, 255, 0.25) 26px,",
            "rgba(160, 225, 255, 0.2) 34px,",
            "transparent 48px)",
          ].join(" "),
          backgroundSize: `100% ${STRIPE}px`,
          WebkitMaskImage:
            "linear-gradient(90deg, transparent 0%, #000 18%, #000 82%, transparent 100%)",
          maskImage:
            "linear-gradient(90deg, transparent 0%, #000 18%, #000 82%, transparent 100%)",
        }}
      />
      <AbsoluteFill
        style={{
          transform: `translateY(${-shift * 0.65}px)`,
          opacity: 0.55,
          backgroundImage: [
            "repeating-linear-gradient(180deg,",
            "transparent 0px,",
            "rgba(255, 255, 255, 0.35) 8px,",
            "transparent 22px)",
          ].join(" "),
          backgroundSize: "100% 36px",
          WebkitMaskImage:
            "linear-gradient(90deg, transparent 5%, #000 30%, #000 70%, transparent 95%)",
          maskImage:
            "linear-gradient(90deg, transparent 5%, #000 30%, #000 70%, transparent 95%)",
        }}
      />
      {/* Falling highlight streaks */}
      {[0.22, 0.48, 0.72].map((x, i) => (
        <div
          key={i}
          style={{
            position: "absolute",
            left: `${x * 100}%`,
            top: 0,
            width: 3,
            height: "28%",
            borderRadius: 999,
            background:
              "linear-gradient(180deg, rgba(255,255,255,0.85) 0%, rgba(200,240,255,0.2) 100%)",
            transform: `translateY(${((frame + i * 12) % WATERFALL_DURATION_FRAMES) / WATERFALL_DURATION_FRAMES * (WATERFALL_HEIGHT * 0.85)}px)`,
            opacity: 0.5,
          }}
        />
      ))}
    </AbsoluteFill>
  );
}
