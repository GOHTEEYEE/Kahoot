"use client";

import type { CSSProperties } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";
import { resolveWorldPlate, type WorldArtPack } from "../../lib/animation/worldArt";
import type { WorldStageId } from "../../lib/worlds";
import { ANIM } from "../../lib/animation/animationConfig";
import { playSfx } from "../../lib/audio/sfx";
import { getMascotForSubject } from "../../lib/animation/mascotAnimation";
import { parallaxOffset } from "../../lib/animation/worldAnimation";
import { useParallaxPointer } from "../../lib/animation/useParallaxPointer";
import { usePrefersReducedMotion } from "../../lib/usePrefersReducedMotion";
import { WorldParticles } from "./WorldLayers";
import { IslandAmbientFx } from "./IslandAmbientFx";
import { IslandWaterfalls, LivingMascot } from "./IslandLivingFx";

type Props = {
  pack: WorldArtPack;
  stage?: WorldStageId;
  onIslandClick?: () => void;
};

/**
 * Island sits freely on the Home background.
 * No circular crop, no rectangular plate, no extra sky/frame.
 */
export function ArtWorldScene({ pack, stage, onIslandClick }: Props) {
  const reduced = usePrefersReducedMotion();
  const parallaxOn = !reduced;
  const { ref, offset, onMove, onLeave } = useParallaxPointer(parallaxOn);
  const mascot = getMascotForSubject(pack.subject);
  const [bubble, setBubble] = useState<string | null>(null);
  const [waving, setWaving] = useState(false);

  const wd = parallaxOffset("world", offset.x, offset.y);
  const fg = parallaxOffset("foreground", offset.x, offset.y);
  const ms = parallaxOffset("mascot", offset.x, offset.y);

  const layer = (x: number, y: number): CSSProperties => ({
    transform: `translate3d(${x}px, ${y}px, 0)`,
    transition: reduced ? undefined : "transform 120ms linear",
  });

  function onMascotTap() {
    playSfx("mascot");
    if (reduced) return;
    setBubble(mascot.speechOnTap);
    setWaving(true);
    window.setTimeout(() => setBubble(null), ANIM.mascot.speechMs);
    window.setTimeout(() => setWaving(false), ANIM.mascot.waveMs);
  }

  const hs = pack.mascotHotspot;
  const worldPlate = resolveWorldPlate(pack, stage);
  const stagePlate = stage ? pack.stageOverlay?.[stage] : undefined;

  return (
    <div
      ref={ref}
      onPointerMove={onMove}
      onPointerLeave={onLeave}
      className="absolute inset-0 bg-transparent"
    >
      <div className="absolute inset-0 flex items-center justify-center" style={layer(wd.x, wd.y)}>
          <div
            aria-hidden
            className="pointer-events-none absolute bottom-[6%] left-1/2 z-0 h-[28%] w-[72%] -translate-x-1/2 rounded-[100%] bg-[radial-gradient(ellipse_at_center,rgba(255,236,180,0.28)_0%,transparent_70%)] blur-[14px]"
          />
          <div
            aria-hidden
            className="pointer-events-none absolute bottom-[1%] left-1/2 z-0 h-[14%] w-[58%] -translate-x-1/2 rounded-[100%] bg-[radial-gradient(ellipse_at_center,rgba(18,36,22,0.32)_0%,rgba(40,78,48,0.08)_52%,transparent_74%)] blur-[8px]"
          />
          <div
            aria-hidden
            className="pointer-events-none absolute bottom-0 left-[12%] right-[12%] z-[2] h-[18%] bg-gradient-to-t from-white/25 via-white/8 to-transparent blur-[6px]"
          />
        <div className="relative z-[1] h-full w-full">
          {/* Poster stays painted so the island never blanks if VP9 fails. */}
          {worldPlate.src ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={worldPlate.src}
              alt=""
              draggable={false}
              className={`pointer-events-none absolute inset-0 z-[1] h-full w-full object-center ${
                pack.worldFit === "cover" ? "object-cover" : "object-contain"
              }`}
              style={{ objectPosition: worldPlate.position }}
            />
          ) : null}
          {pack.videoSrc && !reduced ? (
            <video
              autoPlay
              loop
              muted
              playsInline
              preload="auto"
              poster={pack.posterSrc}
              className="absolute inset-0 h-full w-full object-contain object-center"
              style={{ background: "transparent" }}
            >
              <source src={`${pack.videoSrc}?v=hd`} type="video/webm" />
            </video>
          ) : null}
          {stagePlate ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={stagePlate.src}
              alt=""
              draggable={false}
              className="pointer-events-none absolute inset-0 h-full w-full object-contain object-center"
              style={{ objectPosition: stagePlate.position ?? pack.world.position }}
            />
          ) : null}

          {pack.waterfallHotspots ? (
            <IslandWaterfalls falls={pack.waterfallHotspots} reduced={reduced} />
          ) : null}

          <IslandAmbientFx ambient={pack.ambient} reduced={reduced} />

          {onIslandClick ? (
            <button
              type="button"
              aria-label="查看关卡地图"
              onClick={() => {
                playSfx("whoosh");
                onIslandClick();
              }}
              className="absolute inset-[6%] z-[3] cursor-pointer border-0 bg-transparent p-0"
            />
          ) : null}

          {pack.liveMascot && pack.character ? (
            <LivingMascot
              src={pack.character.src}
              waveSrc={pack.characterWave?.src}
              waving={waving}
              reduced={reduced}
              hotspot={hs}
            />
          ) : null}

          <button
            type="button"
            aria-label={`${mascot.displayName} — tap to say hi`}
            onClick={onMascotTap}
            className="absolute z-[4] border-0 bg-transparent p-0"
            style={{
              left: `${hs.left * 100}%`,
              top: `${hs.top * 100}%`,
              width: `${hs.width * 100}%`,
              height: `${hs.height * 100}%`,
            }}
          />
        </div>
      </div>

      <WorldParticles
        subjectId={pack.subject}
        reduced={reduced}
        style={layer(fg.x * 0.35, fg.y * 0.35)}
      />

      <div style={layer(ms.x, ms.y)} className="pointer-events-none absolute inset-0 z-20">
        <AnimatePresence>
          {bubble ? (
            <motion.span
              initial={{ opacity: 0, scale: 0.85, y: 8 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.25 }}
              className="absolute z-30 max-w-[11rem] -translate-x-1/2 -translate-y-full whitespace-nowrap rounded-full bg-white/95 px-3 py-1.5 text-[10px] font-extrabold text-[#5a4630] shadow-[0_8px_20px_rgba(40,30,10,0.25)]"
              style={{
                left: `${(hs.left + hs.width * 0.5) * 100}%`,
                top: `${hs.top * 100}%`,
              }}
            >
              {bubble}
            </motion.span>
          ) : null}
        </AnimatePresence>
      </div>
    </div>
  );
}
