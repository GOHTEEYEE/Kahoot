"use client";

import { useLayoutEffect, useRef, useState } from "react";
import { PLAYER_HERO } from "../../lib/pvp/heroes";
import { usePrefersReducedMotion } from "../../lib/usePrefersReducedMotion";

function usePrefersHevcAlpha() {
  const [hevc, setHevc] = useState(false);
  useLayoutEffect(() => {
    const ua = navigator.userAgent;
    const isSafari = /safari/i.test(ua) && !/chrome|chromium|android/i.test(ua);
    setHevc(isSafari);
  }, []);
  return hevc;
}

type Kind = "victory" | "defeat";

function ResultClip({ kind }: { kind: Kind }) {
  const reduced = usePrefersReducedMotion();
  const hevc = usePrefersHevcAlpha();
  const ref = useRef<HTMLVideoElement>(null);
  const [failed, setFailed] = useState(false);
  const webm = kind === "victory" ? PLAYER_HERO.winWebm : PLAYER_HERO.loseWebm;
  const mov = kind === "victory" ? PLAYER_HERO.winMov : PLAYER_HERO.loseMov;
  const rate = kind === "victory" ? PLAYER_HERO.winRate : PLAYER_HERO.loseRate;
  const src = hevc ? mov : webm;
  const type = hevc ? 'video/mp4; codecs="hvc1"' : "video/webm";

  useLayoutEffect(() => {
    const el = ref.current;
    if (!el || failed || reduced) return;
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

  if (failed || reduced || !webm) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img src={PLAYER_HERO.src} alt="" draggable={false} className="pvp-result-panda-sprite" />
    );
  }

  return (
    <video
      ref={ref}
      key={src}
      muted
      playsInline
      preload="auto"
      disablePictureInPicture
      className="pvp-result-panda-sprite"
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
  );
}

export function VictoryCharacter() {
  return <ResultClip kind="victory" />;
}

export function DefeatCharacter() {
  return <ResultClip kind="defeat" />;
}
