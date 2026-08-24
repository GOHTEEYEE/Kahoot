"use client";

import { useLayoutEffect, useRef, useState } from "react";
import { PLAYER_HERO } from "../../lib/pvp/heroes";
import { useSafariHevc } from "../../lib/pvp/useSafariHevc";
import { usePrefersReducedMotion } from "../../lib/usePrefersReducedMotion";

type Kind = "victory" | "defeat";

function ResultClip({ kind }: { kind: Kind }) {
  const reduced = usePrefersReducedMotion();
  const hevc = useSafariHevc();
  const ref = useRef<HTMLVideoElement>(null);
  const [failed, setFailed] = useState(false);
  const [painted, setPainted] = useState(false);
  const webm = kind === "victory" ? PLAYER_HERO.winWebm : PLAYER_HERO.loseWebm;
  const mov = kind === "victory" ? PLAYER_HERO.winMov : PLAYER_HERO.loseMov;
  const rate = kind === "victory" ? PLAYER_HERO.winRate : PLAYER_HERO.loseRate;
  const src = hevc && mov ? mov : webm;
  const type = hevc && mov ? 'video/mp4; codecs="hvc1"' : "video/webm";

  useLayoutEffect(() => {
    const el = ref.current;
    if (!el || failed || reduced || !src) return;
    el.playbackRate = rate;
    const start = window.setTimeout(() => {
      try {
        el.currentTime = 0;
      } catch {
        /* ignore */
      }
      void el.play().catch(() => setFailed(true));
    }, 600);
    return () => window.clearTimeout(start);
  }, [failed, rate, reduced, src]);

  const fallback = (
    // eslint-disable-next-line @next/next/no-img-element
    <img src={PLAYER_HERO.src} alt="" draggable={false} className="pvp-result-panda-sprite" />
  );

  if (failed || reduced || !webm) return fallback;

  return (
    <div className="relative flex h-full min-h-0 w-fit max-h-full max-w-full items-end justify-center">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={PLAYER_HERO.src}
        alt=""
        draggable={false}
        className={`pvp-result-panda-sprite${painted ? " invisible" : ""}`}
      />
      <video
        ref={ref}
        key={src}
        muted
        playsInline
        preload="auto"
        disablePictureInPicture
        className="pointer-events-none absolute inset-0 h-full w-full bg-transparent object-contain object-bottom"
        onPlaying={() => setPainted(true)}
        onError={() => setFailed(true)}
        onEnded={(event) => {
          const el = event.currentTarget;
          el.pause();
          try {
            if (Number.isFinite(el.duration) && el.duration > 0) {
              el.currentTime = Math.max(0, el.duration - 0.04);
            }
          } catch {
            /* hold whatever frame we have */
          }
        }}
      >
        <source src={src} type={type} />
      </video>
    </div>
  );
}

export function VictoryCharacter() {
  return <ResultClip kind="victory" />;
}

export function DefeatCharacter() {
  return <ResultClip kind="defeat" />;
}
