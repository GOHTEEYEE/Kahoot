"use client";

import { useLayoutEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { PVP_LOW_HP } from "../../lib/pvp/config";
import { PLAYER_HERO } from "../../lib/pvp/heroes";
import { useSafariHevc } from "../../lib/pvp/useSafariHevc";
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

function playFromStart(el: HTMLVideoElement) {
  const kick = () => {
    void el.play().catch(() => undefined);
  };
  try {
    if (el.currentTime > 0.02) el.currentTime = 0;
  } catch {
    /* ignore seek errors on some browsers */
  }
  if (el.seeking) {
    el.addEventListener("seeked", kick, { once: true });
    return;
  }
  if (el.readyState >= HTMLMediaElement.HAVE_CURRENT_DATA) {
    kick();
    return;
  }
  el.addEventListener("canplay", kick, { once: true });
}

function clipOf(hevc: boolean, webm?: string, mov?: string) {
  if (hevc && mov) return { src: mov, type: 'video/mp4; codecs="hvc1"' as const };
  if (!webm) return null;
  return { src: webm, type: "video/webm" as const };
}

const SPRITE_IMG =
  "relative z-[1] h-full max-h-full w-auto max-w-full bg-transparent object-contain object-bottom";
const SPRITE_VIDEO =
  "pointer-events-none absolute inset-0 z-[2] h-full w-full bg-transparent object-contain object-bottom";

export function Hero({ fighter, side, attacking, preparing, hit, celebrating, crying, onSwing, onImpact }: Props) {
  const nervous = fighter.hp / fighter.maxHp <= PVP_LOW_HP;
  const combo = fighter.currentCombo;
  const reduced = usePrefersReducedMotion();
  const hevc = useSafariHevc();
  const clipRef = useRef<HTMLVideoElement>(null);
  const winRef = useRef<HTMLVideoElement>(null);
  const loseRef = useRef<HTMLVideoElement>(null);
  const swingRef = useRef(onSwing);
  const impactRef = useRef(onImpact);
  swingRef.current = onSwing;
  impactRef.current = onImpact;
  const [attackPainted, setAttackPainted] = useState(false);
  const [winPainted, setWinPainted] = useState(false);
  const [losePainted, setLosePainted] = useState(false);

  const hasClip = Boolean(PLAYER_HERO.attackWebm);
  const hasWinClip = Boolean(PLAYER_HERO.winWebm);
  const hasLoseClip = Boolean(PLAYER_HERO.loseWebm);
  const playWin = Boolean(hasWinClip && celebrating && !reduced);
  const playLose = Boolean(hasLoseClip && crying && !reduced && !playWin);
  const playClip = Boolean(hasClip && attacking && !reduced && !playWin && !playLose);
  const freezeMotion = playClip || playWin || playLose;
  const hideIdle = (playClip && attackPainted) || (playWin && winPainted) || (playLose && losePainted);
  const attackClip = clipOf(hevc, PLAYER_HERO.attackWebm, PLAYER_HERO.attackMov);
  const winClip = clipOf(hevc, PLAYER_HERO.winWebm, PLAYER_HERO.winMov);
  const loseClip = clipOf(hevc, PLAYER_HERO.loseWebm, PLAYER_HERO.loseMov);
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
    if (!playClip) setAttackPainted(false);
  }, [playClip]);
  useLayoutEffect(() => {
    if (!playWin) setWinPainted(false);
  }, [playWin]);
  useLayoutEffect(() => {
    if (!playLose) setLosePainted(false);
  }, [playLose]);

  useLayoutEffect(() => {
    const el = clipRef.current;
    if (!el || !hasClip) return;
    el.playbackRate = PLAYER_HERO.attackRate;
    if (!playClip) {
      el.pause();
      try {
        el.currentTime = 0;
      } catch {
        /* ignore */
      }
      return;
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
    playFromStart(el);
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
      try {
        el.currentTime = 0;
      } catch {
        /* ignore */
      }
      return;
    }
    playFromStart(el);
  }, [playWin, hasWinClip]);

  useLayoutEffect(() => {
    const el = loseRef.current;
    if (!el || !hasLoseClip) return;
    el.playbackRate = PLAYER_HERO.loseRate;
    if (!playLose) {
      el.pause();
      try {
        el.currentTime = 0;
      } catch {
        /* ignore */
      }
      return;
    }
    playFromStart(el);
  }, [playLose, hasLoseClip]);

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
        <div className="relative z-[2] flex h-full min-h-0 w-fit max-w-full items-end justify-center">
          {fighter.avatar ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={fighter.avatar}
              alt=""
              draggable={false}
              className={`${SPRITE_IMG}${face}${hideIdle ? " invisible" : ""}`}
            />
          ) : hideIdle ? null : (
            <span className="relative z-[1] text-[clamp(3.2rem,16svh,5.5rem)] leading-none">{fighter.heroEmoji}</span>
          )}
          {attackClip ? (
            <video
              ref={clipRef}
              muted
              playsInline
              preload="auto"
              disablePictureInPicture
              key={attackClip.src}
              className={`${SPRITE_VIDEO}${face} ${playClip ? "opacity-100" : "opacity-0"}`}
              onPlaying={() => setAttackPainted(true)}
            >
              <source src={attackClip.src} type={attackClip.type} />
            </video>
          ) : null}
          {winClip ? (
            <video
              ref={winRef}
              muted
              playsInline
              preload="auto"
              disablePictureInPicture
              key={winClip.src}
              className={`${SPRITE_VIDEO}${face} ${playWin ? "opacity-100" : "opacity-0"}`}
              onPlaying={() => setWinPainted(true)}
            >
              <source src={winClip.src} type={winClip.type} />
            </video>
          ) : null}
          {loseClip ? (
            <video
              ref={loseRef}
              muted
              playsInline
              preload="auto"
              disablePictureInPicture
              key={loseClip.src}
              className={`${SPRITE_VIDEO}${face} ${playLose ? "opacity-100" : "opacity-0"}`}
              onPlaying={() => setLosePainted(true)}
            >
              <source src={loseClip.src} type={loseClip.type} />
            </video>
          ) : null}
        </div>
      </div>
    </motion.div>
  );
}
