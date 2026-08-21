"use client";

import { useEffect, useRef } from "react";
import { usePrefersReducedMotion } from "../../lib/usePrefersReducedMotion";
import { playSfx } from "../../lib/audio/sfx";

/** Opaque MP4 (pure black plate) — keyed to alpha on canvas each frame. */
const ARENA_VIDEO = "/worlds/chinese/arena-kling-loop.mp4?v=7";
const ARENA_POSTER = "/worlds/chinese/arena-kling-poster.png?v=7";

/** Luma below this → transparent. */
const KEY_LUMA = 16;
const KEY_SOFT = 14;

type Props = {
  onIslandClick?: () => void;
};

/**
 * Chinese LV1 Kling loop with black background removed via canvas chroma-key,
 * so the Home sky shows through.
 */
export function VideoArena({ onIslandClick }: Props) {
  const reduced = usePrefersReducedMotion();
  const hostRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rafRef = useRef(0);
  const vfcRef = useRef(0);

  useEffect(() => {
    if (reduced) return;
    const host = hostRef.current;
    const video = videoRef.current;
    const canvas = canvasRef.current;
    if (!host || !video || !canvas) return;

    const ctx = canvas.getContext("2d", { willReadFrequently: true, alpha: true });
    if (!ctx) return;

    let alive = true;

    const resize = () => {
      const rect = host.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const cw = Math.max(1, Math.round(rect.width * dpr));
      const ch = Math.max(1, Math.round(rect.height * dpr));
      if (canvas.width !== cw || canvas.height !== ch) {
        canvas.width = cw;
        canvas.height = ch;
      }
    };

    const paint = () => {
      if (!alive) return;
      resize();
      const vw = video.videoWidth;
      const vh = video.videoHeight;
      const cw = canvas.width;
      const ch = canvas.height;
      if (vw < 2 || vh < 2 || video.readyState < 2) return;

      const scale = Math.min(cw / vw, ch / vh);
      const dw = vw * scale;
      const dh = vh * scale;
      const dx = (cw - dw) / 2;
      const dy = (ch - dh) / 2;

      ctx.clearRect(0, 0, cw, ch);
      ctx.drawImage(video, dx, dy, dw, dh);

      const frame = ctx.getImageData(0, 0, cw, ch);
      const d = frame.data;
      for (let i = 0; i < d.length; i += 4) {
        const r = d[i]!;
        const g = d[i + 1]!;
        const b = d[i + 2]!;
        const luma = 0.2126 * r + 0.7152 * g + 0.0722 * b;
        if (luma <= KEY_LUMA) {
          d[i + 3] = 0;
        } else if (luma < KEY_LUMA + KEY_SOFT) {
          d[i + 3] = Math.round(((luma - KEY_LUMA) / KEY_SOFT) * 255);
        }
      }
      ctx.putImageData(frame, 0, 0);
    };

    const tick = () => {
      paint();
      const anyVideo = video as HTMLVideoElement & {
        requestVideoFrameCallback?: (cb: () => void) => number;
        cancelVideoFrameCallback?: (id: number) => void;
      };
      if (typeof anyVideo.requestVideoFrameCallback === "function") {
        vfcRef.current = anyVideo.requestVideoFrameCallback(() => tick());
      } else {
        rafRef.current = requestAnimationFrame(tick);
      }
    };

    const onReady = () => {
      void video.play().catch(() => undefined);
      paint();
    };

    video.addEventListener("loadeddata", onReady);
    video.addEventListener("playing", onReady);
    const ro = new ResizeObserver(() => paint());
    ro.observe(host);

    void video.play().catch(() => undefined);
    tick();

    return () => {
      alive = false;
      ro.disconnect();
      video.removeEventListener("loadeddata", onReady);
      video.removeEventListener("playing", onReady);
      cancelAnimationFrame(rafRef.current);
      const anyVideo = video as HTMLVideoElement & {
        cancelVideoFrameCallback?: (id: number) => void;
      };
      anyVideo.cancelVideoFrameCallback?.(vfcRef.current);
    };
  }, [reduced]);

  return (
    <div ref={hostRef} className="absolute inset-0 bg-transparent">
      {reduced ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={ARENA_POSTER}
          alt=""
          draggable={false}
          className="pointer-events-none absolute inset-0 h-full w-full object-contain object-center"
        />
      ) : (
        <>
          <video
            ref={videoRef}
            key={ARENA_VIDEO}
            autoPlay
            loop
            muted
            playsInline
            preload="auto"
            className="pointer-events-none absolute h-px w-px opacity-0"
            aria-hidden
          >
            <source src={ARENA_VIDEO} type="video/mp4" />
          </video>
          <canvas
            ref={canvasRef}
            className="pointer-events-none absolute inset-0 h-full w-full"
            style={{ background: "transparent" }}
          />
        </>
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
  );
}

/** Feature flag: Chinese Home arena uses Kling loop video. */
export const USE_VIDEO_CHINESE_ARENA = true;
