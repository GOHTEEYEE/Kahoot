import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";

export const SPLASH_WIDTH = 160;
export const SPLASH_HEIGHT = 96;
export const SPLASH_DURATION_FRAMES = 36;

export function WaterSplash() {
  const frame = useCurrentFrame();
  const t = frame / SPLASH_DURATION_FRAMES;

  const scale = interpolate(t, [0, 0.45, 1], [0.35, 1.15, 1.35]);
  const opacity = interpolate(t, [0, 0.2, 0.55, 1], [0, 0.85, 0.55, 0.08]);

  return (
    <AbsoluteFill style={{ backgroundColor: "transparent", justifyContent: "flex-end" }}>
      <div
        style={{
          position: "absolute",
          left: "50%",
          bottom: "8%",
          width: "88%",
          height: "62%",
          transform: `translate(-50%, 0) scale(${scale})`,
          borderRadius: "50%",
          opacity,
          background:
            "radial-gradient(ellipse at center, rgba(255,255,255,0.95) 0%, rgba(180,235,255,0.55) 38%, rgba(120,200,255,0.15) 62%, transparent 72%)",
          filter: "blur(1px)",
        }}
      />
      <div
        style={{
          position: "absolute",
          left: "50%",
          bottom: "18%",
          width: "55%",
          height: "28%",
          transform: `translate(-50%, 0) scale(${scale * 0.85})`,
          borderRadius: "50%",
          opacity: opacity * 0.7,
          background:
            "radial-gradient(ellipse at center, rgba(255,255,255,0.75) 0%, transparent 70%)",
        }}
      />
    </AbsoluteFill>
  );
}
