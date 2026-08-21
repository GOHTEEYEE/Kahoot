import type { CSSProperties } from "react";
import {
  AbsoluteFill,
  Easing,
  Img,
  interpolate,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";

/** Square island promo — modular LV1 arena. */
export const ARENA_WIDTH = 720;
export const ARENA_HEIGHT = 720;
/** Seamless 2s loop @ 30fps */
export const ARENA_DURATION_FRAMES = 60;

type NodeSpec = {
  id: string;
  src: string;
  /** % of stage */
  left: string;
  top: string;
  width: string;
  z: number;
  transformOrigin?: string;
};

/** Layout tuned to ModularStaticArena / island-foundation composition. */
const NODES: NodeSpec[] = [
  {
    id: "foundation",
    src: "worlds/chinese/lv1/static/island-foundation.png",
    left: "6%",
    top: "8%",
    width: "88%",
    z: 1,
  },
  {
    id: "path",
    src: "worlds/chinese/lv1/static/stone-path.png",
    left: "38%",
    top: "46%",
    width: "24%",
    z: 2,
  },
  {
    id: "academy",
    src: "worlds/chinese/buildings/academy-standalone-cut.png",
    left: "30.5%",
    top: "14%",
    width: "39%",
    z: 3,
    transformOrigin: "50% 95%",
  },
  {
    id: "tree01",
    src: "worlds/chinese/lv1/static/cherry-tree-01.png",
    left: "6%",
    top: "10%",
    width: "28%",
    z: 4,
    transformOrigin: "50% 95%",
  },
  {
    id: "tree02",
    src: "worlds/chinese/lv1/static/cherry-tree-02.png",
    left: "66%",
    top: "11%",
    width: "26%",
    z: 4,
    transformOrigin: "50% 95%",
  },
  {
    id: "bush01",
    src: "worlds/chinese/lv1/static/bush-01.png",
    left: "26%",
    top: "42%",
    width: "10%",
    z: 5,
  },
  {
    id: "bush02",
    src: "worlds/chinese/lv1/static/bush-02.png",
    left: "64%",
    top: "43%",
    width: "9%",
    z: 5,
  },
  {
    id: "flower01",
    src: "worlds/chinese/lv1/static/flower-cluster-01.png",
    left: "33%",
    top: "54%",
    width: "7%",
    z: 8,
  },
  {
    id: "flower02",
    src: "worlds/chinese/lv1/static/flower-cluster-02.png",
    left: "58%",
    top: "55%",
    width: "7.5%",
    z: 8,
  },
  {
    id: "rock01",
    src: "worlds/chinese/lv1/static/rock-small-01.png",
    left: "30%",
    top: "58%",
    width: "5%",
    z: 8,
  },
  {
    id: "rock02",
    src: "worlds/chinese/lv1/static/rock-small-02.png",
    left: "62%",
    top: "59%",
    width: "5.2%",
    z: 8,
  },
  {
    id: "sign",
    src: "worlds/chinese/lv1/static/sign-board.png",
    left: "16%",
    top: "44%",
    width: "9%",
    z: 9,
  },
];

const PETALS = [
  { x: 10, delay: 0, size: 11, drift: 16, dur: 1 },
  { x: 24, delay: 10, size: 9, drift: -14, dur: 1.1 },
  { x: 40, delay: 22, size: 12, drift: 20, dur: 0.95 },
  { x: 56, delay: 4, size: 10, drift: -18, dur: 1.05 },
  { x: 70, delay: 28, size: 11, drift: 12, dur: 1 },
  { x: 84, delay: 14, size: 9, drift: -10, dur: 1.15 },
  { x: 18, delay: 36, size: 10, drift: 8, dur: 1 },
  { x: 62, delay: 44, size: 12, drift: -16, dur: 0.9 },
  { x: 48, delay: 52, size: 8, drift: 14, dur: 1.2 },
  { x: 32, delay: 18, size: 10, drift: -8, dur: 1 },
] as const;

const FALLS = [
  { left: "18%", top: "52%", width: 46, height: 168 },
  { left: "70%", top: "52%", width: 46, height: 168 },
] as const;

function loop01(frame: number, duration: number, speed = 1) {
  return ((frame * speed) % duration) / duration;
}

function clamp01(v: number) {
  return Math.max(0, Math.min(1, v));
}

function RiverFall({
  frame,
  duration,
  style,
}: {
  frame: number;
  duration: number;
  style: CSSProperties;
}) {
  const shift = loop01(frame, duration) * 64;
  return (
    <div
      style={{
        position: "absolute",
        overflow: "hidden",
        borderRadius: 22,
        pointerEvents: "none",
        ...style,
      }}
    >
      <Img
  src={staticFile("worlds/chinese/lv1/animated/water.png")}
  style={{
    position: "absolute",
    left: "50%",
    top: 0,
    width: "160%",
    height: "200%",
    transform: `translate(-50%, ${-shift}px)`,
    objectFit: "cover",
    opacity: 0.92,
    mixBlendMode: "screen",
    translate: "-5.2px 2.1px"
  }}
/>
      <div
        style={{
          position: "absolute",
          inset: 0,
          transform: `translateY(${shift * 0.55}px)`,
          backgroundImage:
            "repeating-linear-gradient(180deg, transparent 0px, rgba(180,235,255,0.15) 4px, rgba(255,255,255,0.55) 10px, rgba(120,210,255,0.35) 18px, rgba(255,255,255,0.25) 26px, transparent 48px)",
          backgroundSize: "100% 48px",
          opacity: 0.55,
          WebkitMaskImage:
            "linear-gradient(90deg, transparent 0%, #000 22%, #000 78%, transparent 100%)",
          maskImage:
            "linear-gradient(90deg, transparent 0%, #000 22%, #000 78%, transparent 100%)",
        }}
      />
      <div
        style={{
          position: "absolute",
          left: "50%",
          bottom: 2,
          width: "110%",
          height: 22,
          transform: "translateX(-50%)",
          borderRadius: "50%",
          background:
            "radial-gradient(ellipse at center, rgba(255,255,255,0.8) 0%, rgba(180,230,255,0.3) 45%, transparent 72%)",
          opacity: 0.5 + Math.sin(loop01(frame, duration) * Math.PI * 2) * 0.22,
        }}
      />
    </div>
  );
}

/** Tiny porcelain tea cup drawn with CSS (no extra asset). */
function TeaCup({ steam }: { steam: number }) {
  return (
    <div style={{ position: "relative", width: 34, height: 28 }}>
      <div
        style={{
          position: "absolute",
          left: 4,
          top: 8,
          width: 22,
          height: 16,
          borderRadius: "4px 4px 10px 10px",
          background: "linear-gradient(180deg, #fff8ef 0%, #f0e0c8 55%, #e2c9a0 100%)",
          boxShadow: "inset 0 2px 0 rgba(255,255,255,0.7), 0 2px 3px rgba(60,40,10,0.25)",
          border: "1px solid rgba(180,140,80,0.45)",
        }}
      />
      <div
        style={{
          position: "absolute",
          left: 7,
          top: 10,
          width: 16,
          height: 5,
          borderRadius: "50%",
          background: "radial-gradient(ellipse at center, #6b3a18 0%, #3d2110 70%)",
          opacity: 0.9,
        }}
      />
      <div
        style={{
          position: "absolute",
          right: 0,
          top: 11,
          width: 10,
          height: 10,
          borderRadius: "50%",
          border: "2.5px solid #e8d2ae",
          borderLeftColor: "transparent",
          borderBottomColor: "transparent",
          transform: "rotate(35deg)",
        }}
      />
      {[0, 1, 2].map((i) => (
        <div
          key={i}
          style={{
            position: "absolute",
            left: 8 + i * 5,
            top: 0,
            width: 3,
            height: 10,
            borderRadius: 999,
            background: "rgba(255,255,255,0.55)",
            opacity: steam * (0.35 + i * 0.15),
            transform: `translateY(${-steam * (4 + i * 2)}px) scaleY(${1 + steam})`,
            filter: "blur(1px)",
          }}
        />
      ))}
    </div>
  );
}

/**
 * 2s story beat (seamless):
 * 0.00–0.40  raise cup → sip tea
 * 0.40–0.55  lower cup
 * 0.55–0.88  look at camera + smile (wave pose)
 * 0.88–1.00  ease back to idle (matches frame 0)
 */
export function ChineseArenaLoop() {
  const frame = useCurrentFrame();
  const { durationInFrames, fps } = useVideoConfig();
  const t = frame / durationInFrames;

  const islandBob = Math.sin(t * Math.PI * 2) * 6;
  const islandRot = Math.sin(t * Math.PI * 2) * 0.28;

  // Tree sway (rooted)
  const treeSwayL = Math.sin(t * Math.PI * 2) * 1.4;
  const treeSwayR = Math.sin(t * Math.PI * 2 + 0.8) * -1.5;

  // --- Momo action curves ---
  const cupRaise = interpolate(frame, [0, 0.18 * fps, 0.32 * fps, 0.48 * fps], [0, 1, 1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.bezier(0.33, 1, 0.68, 1),
  });
  const sipTilt = interpolate(frame, [0.14 * fps, 0.26 * fps, 0.36 * fps], [0, 1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.bezier(0.4, 0, 0.2, 1),
  });
  const smileBlend = interpolate(
    frame,
    [0.5 * fps, 0.62 * fps, 0.86 * fps, durationInFrames],
    [0, 1, 1, 0],
    {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
      easing: Easing.bezier(0.22, 1, 0.36, 1),
    },
  );
  const waveBob = interpolate(frame, [0.58 * fps, 0.7 * fps, 0.82 * fps], [0, 1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const breathe = 1 + Math.sin(t * Math.PI * 4) * 0.015;
  const momoIdleY = Math.sin(t * Math.PI * 4) * -2;

  const cupY = interpolate(cupRaise, [0, 1], [18, -28]);
  const cupRot = interpolate(cupRaise, [0, 1], [-12, -38]);
  const cupOpacity = interpolate(smileBlend, [0, 0.35], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const headTilt = interpolate(sipTilt, [0, 1], [0, -12]);
  const steam = clamp01(cupRaise * (1 - sipTilt * 0.3));

  return (
    <AbsoluteFill
      style={{
        background:
          "linear-gradient(180deg, #8ec8ea 0%, #c5e6f6 35%, #e8f4fc 62%, #eef8ee 100%)",
        overflow: "hidden",
      }}
    >
      <Img
        src={staticFile("worlds/chinese/lv1/static/background-sky.png")}
        style={{
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
          objectFit: "cover",
          objectPosition: "50% 30%",
          opacity: 0.88,
        }}
      />

      {/* Soft drifting haze */}
      <div
        style={{
          position: "absolute",
          top: "10%",
          left: `${-8 + loop01(frame, durationInFrames, 0.4) * 100}%`,
          width: 200,
          height: 64,
          borderRadius: "50%",
          background: "rgba(255,255,255,0.4)",
          filter: "blur(20px)",
        }}
      />

      {/* Island stage */}
      <div
        style={{
          position: "absolute",
          left: "50%",
          top: "52%",
          width: 640,
          height: 640,
          translate: `-50% calc(-50% + ${islandBob}px)`,
          rotate: `${islandRot}deg`,
          transformOrigin: "50% 62%",
        }}
      >
        {/* Ground shadow */}
        <div
          style={{
            position: "absolute",
            left: "16%",
            right: "16%",
            bottom: "2%",
            height: 34,
            borderRadius: "50%",
            background: "rgba(30,50,35,0.3)",
            filter: "blur(14px)",
            zIndex: 0,
          }}
        />

        {NODES.map((n) => {
          let rotate = "0deg";
          if (n.id === "tree01") rotate = `${treeSwayL}deg`;
          if (n.id === "tree02") rotate = `${treeSwayR}deg`;
          if (n.id === "academy") {
            rotate = `${Math.sin(t * Math.PI * 2) * 0.2}deg`;
          }
          return (
            <Img
key={n.id}
src={staticFile(n.src)}
style={{
position: "absolute",
left: n.left,
top: n.top,
width: n.width,
height: "auto",
zIndex: n.z,
rotate,
transformOrigin: n.transformOrigin ?? "50% 90%",
filter: "drop-shadow(0 10px 16px rgba(30,50,35,0.18))",
translate: "25.4px 79.9px"
}}
/>
          );
        })}

        {/* Flowing rivers / falls off the island edge */}
        {FALLS.map((f, i) => (
          <RiverFall
            key={i}
            frame={frame + i * 9}
            duration={durationInFrames}
            style={{
              left: f.left,
              top: f.top,
              width: f.width,
              height: f.height,
              zIndex: 6,
              opacity: 0.9,
            }}
          />
        ))}

        {/* Momo — drink then smile at camera */}
        <div
          style={{
            position: "absolute",
            left: "38%",
            top: "38%",
            width: "24%",
            height: "36%",
            zIndex: 7,
            translate: `0px ${momoIdleY}px`,
            scale: `${breathe}`,
            transformOrigin: "50% 92%",
          }}
        >
          {/* Idle / tea pose */}
          <div
            style={{
              position: "absolute",
              inset: 0,
              opacity: 1 - smileBlend,
              rotate: `${headTilt}deg`,
              transformOrigin: "50% 70%",
            }}
          >
            <Img
              src={staticFile("worlds/chinese/lv1/static/momo.png")}
              style={{
                width: "100%",
                height: "100%",
                objectFit: "contain",
                objectPosition: "bottom",
                filter: "drop-shadow(0 8px 10px rgba(40,25,10,0.28))",
              }}
            />
            <div
              style={{
                position: "absolute",
                left: "58%",
                top: "48%",
                opacity: cupOpacity,
                translate: `${interpolate(cupRaise, [0, 1], [0, -6])}px ${cupY}px`,
                rotate: `${cupRot}deg`,
                transformOrigin: "20% 80%",
                scale: `${interpolate(cupRaise, [0, 1], [0.92, 1.05])}`,
              }}
            >
              <TeaCup steam={steam} />
            </div>
          </div>

          {/* Smile / wave at camera */}
          <div
            style={{
              position: "absolute",
              inset: 0,
              opacity: smileBlend,
              translate: `0px ${interpolate(waveBob, [0, 1], [0, -4])}px`,
              scale: `${interpolate(smileBlend, [0, 1], [0.98, 1.04], {
                output: "perceptual-scale",
                extrapolateLeft: "clamp",
                extrapolateRight: "clamp",
              })}`,
              transformOrigin: "50% 92%",
            }}
          >
            <Img
src={staticFile("worlds/chinese/momo-wave.png")}
style={{
width: "100%",
height: "100%",
objectFit: "contain",
objectPosition: "bottom",
filter: "drop-shadow(0 8px 10px rgba(40,25,10,0.28))",
translate: "36.6px 0.7px"
}}
/>
          </div>
        </div>
      </div>

      {/* Cherry blossom petals */}
      {PETALS.map((p, i) => {
        const cycle = loop01(frame + p.delay, Math.round(durationInFrames * p.dur));
        const y = -6 + cycle * 108;
        const x = p.x + Math.sin(cycle * Math.PI * 2 + i) * (p.drift / 9);
        const rot = cycle * 360 * (i % 2 === 0 ? 1 : -1);
        const opacity =
          cycle < 0.08 ? cycle / 0.08 : cycle > 0.86 ? (1 - cycle) / 0.14 : 0.88;
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: `${x}%`,
              top: `${y}%`,
              width: p.size,
              height: p.size * 0.72,
              borderRadius: "65% 35% 60% 40%",
              background:
                "linear-gradient(135deg, #ffc4dc 0%, #ff8fbf 48%, #f56aa4 100%)",
              opacity,
              rotate: `${rot}deg`,
              boxShadow: "0 0 5px rgba(255,180,210,0.5)",
              zIndex: 20,
            }}
          />
        );
      })}
    </AbsoluteFill>
  );
}
