"use client";

import { useEffect, useState } from "react";
import { playSfx } from "../../lib/audio/sfx";
import { usePrefersReducedMotion } from "../../lib/usePrefersReducedMotion";

const ARENA_WEBM = "/worlds/chinese/arena-kling-loop.webm?v=9";
const ARENA_MOV = "/worlds/chinese/arena-kling-loop.mov?v=9";
const ARENA_POSTER = "/worlds/chinese/arena-kling-poster.png?v=9";

type Props = {
  onIslandClick?: () => void;
};

function usePrefersHevcAlpha() {
  const [hevc, setHevc] = useState(false);
  useEffect(() => {
    const ua = navigator.userAgent;
    const isSafari = /safari/i.test(ua) && !/chrome|chromium|android/i.test(ua);
    setHevc(isSafari);
  }, []);
  return hevc;
}

/** Chinese LV1 Kling loop with real alpha — WebM (Chrome) / HEVC MOV (Safari). */
export function VideoArena({ onIslandClick }: Props) {
  const reduced = usePrefersReducedMotion();
  const hevc = usePrefersHevcAlpha();
  const src = hevc ? ARENA_MOV : ARENA_WEBM;
  const type = hevc ? 'video/mp4; codecs="hvc1"' : "video/webm";

  return (
    <div className="absolute inset-0 flex items-center justify-center bg-transparent">
      <div className="relative h-[82%] w-[82%]">
        {reduced ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={ARENA_POSTER}
            alt=""
            draggable={false}
            className="pointer-events-none absolute inset-0 h-full w-full object-contain object-center"
          />
        ) : (
          <video
            key={src}
            autoPlay
            loop
            muted
            playsInline
            preload="auto"
            poster={ARENA_POSTER}
            className="pointer-events-none absolute inset-0 h-full w-full bg-transparent object-contain object-center"
          >
            <source src={src} type={type} />
          </video>
        )}

        {onIslandClick ? (
          <button
            type="button"
            aria-label="View stage map"
            onClick={() => {
              playSfx("whoosh");
              onIslandClick();
            }}
            className="absolute inset-[6%] z-[3] cursor-pointer border-0 bg-transparent p-0"
          />
        ) : null}
      </div>
    </div>
  );
}

/** Feature flag: Chinese Home arena uses Kling loop video. */
export const USE_VIDEO_CHINESE_ARENA = true;
