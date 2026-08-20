"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";
import { useRive } from "@rive-app/react-canvas";
import {
  MASCOT_PROFILES,
  type MascotCharacter,
  type MascotState,
} from "../../lib/animation/mascotAnimation";
import { ANIM } from "../../lib/animation/animationConfig";
import { usePrefersReducedMotion } from "../../lib/usePrefersReducedMotion";

type Props = {
  character: MascotCharacter;
  state?: MascotState;
  className?: string;
  interactive?: boolean;
};

async function probeRiveAsset(src: string): Promise<boolean> {
  try {
    const res = await fetch(src, { method: "HEAD", cache: "force-cache" });
    if (res.ok) return true;
    // Some hosts reject HEAD — try a tiny ranged GET
    const get = await fetch(src, {
      method: "GET",
      headers: { Range: "bytes=0-0" },
      cache: "force-cache",
    });
    return get.ok || get.status === 206;
  } catch {
    return false;
  }
}

/**
 * Rive-ready mascot renderer.
 * Place .riv files under /public/rive/characters/{character}.riv
 * Falls back to emoji + Framer Motion when the asset is missing.
 */
export function AnimatedMascot({
  character,
  state = "idle",
  className = "",
  interactive = true,
}: Props) {
  const profile = MASCOT_PROFILES[character];
  const reduced = usePrefersReducedMotion();
  const [hasRive, setHasRive] = useState<boolean | null>(null);
  const [localState, setLocalState] = useState<MascotState>(state);
  const [bubble, setBubble] = useState<string | null>(null);

  useEffect(() => {
    let alive = true;
    probeRiveAsset(profile.riveSrc).then((ok) => {
      if (alive) setHasRive(ok);
    });
    return () => {
      alive = false;
    };
  }, [profile.riveSrc]);

  useEffect(() => {
    setLocalState(state);
  }, [state]);

  function onTap() {
    if (!interactive || reduced) return;
    setLocalState("wave");
    setBubble(profile.speechOnTap);
    window.setTimeout(() => setBubble(null), ANIM.mascot.speechMs);
    window.setTimeout(() => setLocalState("idle"), ANIM.mascot.waveMs);
  }

  return (
    <div className={`relative flex flex-col items-center ${className}`}>
      <AnimatePresence>
        {bubble ? (
          <motion.span
            initial={{ opacity: 0, scale: 0.8, y: 6 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.25 }}
            className="absolute -top-8 z-20 max-w-[9.5rem] whitespace-nowrap rounded-full bg-white px-2.5 py-1 text-[10px] font-extrabold text-[#5a4630] shadow"
          >
            {bubble}
          </motion.span>
        ) : null}
      </AnimatePresence>

      {hasRive === true ? (
        <RiveCharacter
          src={profile.riveSrc}
          onTap={onTap}
          interactive={interactive}
        />
      ) : (
        <FallbackMascot
          emoji={profile.emoji}
          imageSrc={profile.imageFallback}
          accent={profile.accent}
          name={profile.displayName}
          animState={localState}
          reduced={reduced}
          onTap={onTap}
          interactive={interactive}
        />
      )}
    </div>
  );
}

function RiveCharacter({
  src,
  onTap,
  interactive,
}: {
  src: string;
  onTap: () => void;
  interactive: boolean;
}) {
  const { RiveComponent } = useRive({
    src,
    autoplay: true,
    // When a State Machine exists in the .riv, wire triggers here.
  });

  return (
    <button
      type="button"
      onClick={onTap}
      disabled={!interactive}
      aria-label="Mascot"
      className="h-16 w-16 overflow-hidden rounded-[1.15rem] border-0 bg-transparent p-0 shadow-[0_10px_18px_rgba(80,50,20,0.22)] ring-[3px] ring-white/80"
    >
      <RiveComponent className="h-full w-full" />
    </button>
  );
}

function FallbackMascot({
  emoji,
  imageSrc,
  accent,
  name,
  animState,
  reduced,
  onTap,
  interactive,
}: {
  emoji: string;
  imageSrc?: string;
  accent: string;
  name: string;
  animState: MascotState;
  reduced: boolean;
  onTap: () => void;
  interactive: boolean;
}) {
  const reacting = animState === "wave" || animState === "celebrate";
  const useImage = Boolean(imageSrc);

  return (
    <motion.button
      type="button"
      aria-label={name}
      disabled={!interactive}
      onClick={onTap}
      animate={
        reduced
          ? undefined
          : reacting
            ? { y: [0, -8, 0, -4, 0], rotate: [0, -6, 8, -4, 0], scale: [1, 1.06, 1] }
            : {
                scale: [1, 1.02, 1, 1, 1.02, 1],
                y: [0, -3, 0, 0, -2, 0],
                rotate: [-1, 1, 0, -1, 1, 0],
              }
      }
      transition={
        reacting
          ? { duration: 0.9, ease: "easeInOut" }
          : { duration: ANIM.mascot.idleCycleMs / 1000, repeat: Infinity, ease: "easeInOut" }
      }
      className="relative flex cursor-pointer flex-col items-center border-0 bg-transparent p-0 will-change-transform disabled:cursor-default"
    >
      {useImage ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={imageSrc}
          alt=""
          draggable={false}
          className="h-[4.5rem] w-[4.5rem] object-contain drop-shadow-[0_10px_14px_rgba(80,50,20,0.28)]"
        />
      ) : (
        <div
          className="flex h-14 w-14 items-center justify-center rounded-[1.15rem] text-2xl shadow-[0_10px_18px_rgba(80,50,20,0.22)] ring-[3px] ring-white/80"
          style={{ background: `linear-gradient(145deg, ${accent}, #5a4630)` }}
        >
          <span aria-hidden>{emoji}</span>
        </div>
      )}
      <span className="mt-1 rounded-full bg-[#5a4630]/55 px-2 py-0.5 text-[10px] font-extrabold text-white backdrop-blur">
        {name}
      </span>
    </motion.button>
  );
}
