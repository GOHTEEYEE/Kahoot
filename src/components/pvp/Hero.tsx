"use client";

import { useLayoutEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { PVP_LOW_HP } from "../../lib/pvp/config";
import { PLAYER_HERO } from "../../lib/pvp/heroes";
import type { FighterState } from "../../lib/pvp/types";
import { usePrefersReducedMotion } from "../../lib/usePrefersReducedMotion";

type Props = {
  fighter: FighterState;
  side: "player" | "opponent";
  attacking?: boolean;
  preparing?: boolean;
  hit?: boolean;
  celebrating?: boolean;
  crying?: boolean;
  onSwing?: () => void;
  onImpact?: () => void;
};

function usePrefersHevcAlpha() {
  const [hevc, setHevc] = useState(false);
  useLayoutEffect(() => {
    const ua = navigator.userAgent;
    const isSafari = /safari/i.test(ua) && !/chrome|chromium|android/i.test(ua);
    setHevc(isSafari);
  }, []);
  return hevc;
}

const SPRITE_CLASS =
  "relative z-[2] h-full max-h-full w-auto max-w-full bg-transparent object-contain object-bottom";

export function Hero({ fighter, side, attacking, preparing, hit, celebrating, crying, onSwing, onImpact }: Props) {
  const nervous = fighter.hp / fighter.maxHp <= PVP_LOW_HP;
  const combo = fighter.currentCombo;
  const reduced = usePrefersReducedMotion();
  const hevc = usePrefersHevcAlpha();
  const clipRef = useRef<HTMLVideoElement>(null);
  const winRef = useRef<HTMLVideoElement>(null);
  const loseRef = useRef<HTMLVideoElement>(null);
  const swingRef = useRef(onSwing);
  const impactRef = useRef(onImpact);
  swingRef.current = onSwing;
  impactRef.current = onImpact;
  const hasClip = Boolean(PLAYER_HERO.attackWebm);
  const hasWinClip = Boolean(PLAYER_HERO.winWebm);
  const hasLoseClip = Boolean(PLAYER_HERO.loseWebm);
  const playWin = Boolean(hasWinClip && celebrating && !reduced);
  const playLose = Boolean(hasLoseClip && crying && !reduced && !playWin);
  const playClip = Boolean(hasClip && attacking && !reduced && !playWin && !playLose);
  const freezeMotion = playClip || playWin || playLose;
  const showReaction = playWin || playLose;
  const face = side === "opponent" ? " -scale-x-100" : "";
  const aura =
    combo >= 5
      ? "rgba(255, 170, 60, 0.5)"
      : combo >= 3
        ? "rgba(120, 210, 255, 0.4)"
        : combo >= 1
          ? "rgba(180, 230, 255, 0.22)"
          : "transparent";

  useLayoutEffect(() => {
    const el = clipRef.current;
    if (!el || !hasClip) return;
    el.playbackRate = PLAYER_HERO.attackRate;
    if (!playClip) {
      el.pause();
      el.currentTime = 0;
      return;
    }
    el.pause();
    try {
      el.currentTime = 0;
    } catch {
      /* ignore seek errors on some browsers */
    }
    let armed = false;
    let swung = false;
    let landed = false;
    const cue = () => {
      const t = el.currentTime;
      if (!armed) {
        if (t >= PLAYER_HERO.swingAt) return;
        armed = true;
      }
      if (!swung && t >= PLAYER_HERO.swingAt) {
        swung = true;
        swingRef.current?.();
      }
      if (!landed && t >= PLAYER_HERO.impactAt) {
        landed = true;
        impactRef.current?.();
      }
    };
    el.addEventListener("timeupdate", cue);
    let raf = 0;
    const loop = () => {
      cue();
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    void el.play().catch(() => undefined);
    return () => {
      el.removeEventListener("timeupdate", cue);
      cancelAnimationFrame(raf);
    };
  }, [playClip, hasClip]);

  useLayoutEffect(() => {
    const el = winRef.current;
    if (!el || !hasWinClip) return;
    el.playbackRate = PLAYER_HERO.winRate;
    if (!playWin) {
      el.pause();
      el.currentTime = 0;
      return;
    }
    try {
      el.currentTime = 0;
    } catch {
      /* ignore seek errors on some browsers */
    }
    void el.play().catch(() => undefined);
  }, [playWin, hasWinClip]);

  useLayoutEffect(() => {
    const el = loseRef.current;
    if (!el || !hasLoseClip) return;
    el.playbackRate = PLAYER_HERO.loseRate;
    if (!playLose) {
      el.pause();
      el.currentTime = 0;
      return;
    }
    try {
      el.currentTime = 0;
    } catch {
      /* ignore seek errors on some browsers */
    }
    void el.play().catch(() => undefined);
  }, [playLose, hasLoseClip]);

  const clipSrc = hevc ? PLAYER_HERO.attackMov : PLAYER_HERO.attackWebm;
  const clipType = hevc ? 'video/mp4; codecs="hvc1"' : "video/webm";
  const winSrc = hevc ? PLAYER_HERO.winMov : PLAYER_HERO.winWebm;
  const winType = hevc ? 'video/mp4; codecs="hvc1"' : "video/webm";
  const loseSrc = hevc ? PLAYER_HERO.loseMov : PLAYER_HERO.loseWebm;
  const loseType = hevc ? 'video/mp4; codecs="hvc1"' : "video/webm";

  return (
    <motion.div
      className="relative flex min-h-0 w-full flex-1 items-end justify-center"
      transformTemplate={freezeMotion ? () => "none" : undefined}
      animate={
        freezeMotion
          ? { x: 0, y: 0, scale: 1, rotate: 0 }
          : attacking
            ? { x: side === "player" ? [0, 10, 0] : [0, -10, 0], y: [0, -6, 0], scale: [1, 1.04, 1] }
            : preparing
              ? { y: [0, -4, 0] }
              : hit
                ? { x: side === "player" ? [0, -7, 5, 0] : [0, 7, -5, 0] }
                : nervous
                  ? { rotate: [-1.8, 1.8, -1.8] }
                  : { y: [0, combo >= 3 ? -4 : -2, 0] }
      }
      transition={
        freezeMotion
          ? { duration: 0 }
          : attacking || hit
            ? { duration: 0.42, ease: "easeOut" }
            : { duration: nervous ? 0.26 : preparing ? 0.38 : 2.2, repeat: Infinity, ease: "easeInOut" }
      }
    >
      <div
        className={`relative flex h-full min-h-0 w-full items-end justify-center${
          playClip ? (side === "opponent" ? " pvp-hero-rush-foe" : " pvp-hero-rush") : ""
        }`}
      >
        <span className="pvp-hero-shadow" aria-hidden />
        <span
          className="pointer-events-none absolute inset-[8%_4%_12%] z-0 rounded-[42%]"
          style={{ background: `radial-gradient(circle, ${aura} 0%, transparent 72%)` }}
        />
        {fighter.comboProtected ? (
          <span className="pointer-events-none absolute inset-[10%_8%_4%] rounded-[42%] ring-2 ring-sky-200/80" />
        ) : null}
        {hasClip ? (
          <>
            <video
              ref={clipRef}
              key={clipSrc}
              muted
              playsInline
              preload="auto"
              disablePictureInPicture
              className={`${SPRITE_CLASS}${face}${showReaction ? " hidden" : ""}`}
            >
              <source src={clipSrc} type={clipType} />
            </video>
            {hasWinClip ? (
              <video
                ref={winRef}
                key={winSrc}
                muted
                playsInline
                preload="auto"
                disablePictureInPicture
                className={`${SPRITE_CLASS}${face}${playWin ? "" : " hidden"}`}
              >
                <source src={winSrc} type={winType} />
              </video>
            ) : null}
            {hasLoseClip ? (
              <video
                ref={loseRef}
                key={loseSrc}
                muted
                playsInline
                preload="auto"
                disablePictureInPicture
                className={`${SPRITE_CLASS}${face}${playLose ? "" : " hidden"}`}
              >
                <source src={loseSrc} type={loseType} />
              </video>
            ) : null}
          </>
        ) : fighter.avatar ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={fighter.avatar} alt="" draggable={false} className={`${SPRITE_CLASS}${face}`} />
        ) : (
          <span className="relative z-[2] text-[clamp(3.2rem,16svh,5.5rem)] leading-none">{fighter.heroEmoji}</span>
        )}
      </div>
    </motion.div>
  );
}
