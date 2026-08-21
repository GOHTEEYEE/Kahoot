"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import {
  Application,
  Assets,
  Container,
  Graphics,
  Particle,
  ParticleContainer,
  Rectangle,
  Sprite,
  Texture,
  TilingSprite,
} from "pixi.js";
import { ANIM } from "../../lib/animation/animationConfig";
import {
  fitContain,
  parseObjectPosition,
  stripAssetQuery,
} from "../../lib/animation/pixiFit";
import { resolveWorldPlate, type IslandHotspot, type WorldArtPack } from "../../lib/animation/worldArt";
import { getMascotForSubject } from "../../lib/animation/mascotAnimation";
import type { WorldStageId } from "../../lib/worlds";
import { playSfx } from "../../lib/audio/sfx";
import { usePrefersReducedMotion } from "../../lib/usePrefersReducedMotion";
import { ArtWorldScene } from "./ArtWorldScene";

type Props = {
  pack: WorldArtPack;
  stage?: WorldStageId;
  onIslandClick?: () => void;
};

type SoftParticle = {
  particle: Particle;
  vx: number;
  vy: number;
  life: number;
  maxLife: number;
  kind: "petal" | "spark" | "dust";
};

function hotspotRect(plate: { x: number; y: number; width: number; height: number }, h: IslandHotspot) {
  return {
    x: plate.x + h.left * plate.width,
    y: plate.y + h.top * plate.height,
    width: h.width * plate.width,
    height: h.height * plate.height,
  };
}

function makeDotTexture(size: number, color: string): Texture {
  const canvas = document.createElement("canvas");
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext("2d");
  if (ctx) {
    const g = ctx.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2);
    g.addColorStop(0, color);
    g.addColorStop(1, "rgba(255,255,255,0)");
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, size, size);
  }
  return Texture.from(canvas);
}

/**
 * PixiJS v8 living arena — same plate / mascot / hotspots as ArtWorldScene.
 * Island artwork stays static; only water, falls, mascot idle, and ambient move.
 */
export function PixiWorldScene({ pack, stage, onIslandClick }: Props) {
  const reduced = usePrefersReducedMotion();
  const hostRef = useRef<HTMLDivElement>(null);
  const [failed, setFailed] = useState(false);
  const [bubble, setBubble] = useState<string | null>(null);
  const waveRef = useRef(false);
  const mascot = getMascotForSubject(pack.subject);
  const onIslandClickRef = useRef(onIslandClick);
  const speechRef = useRef(mascot.speechOnTap);
  onIslandClickRef.current = onIslandClick;
  speechRef.current = mascot.speechOnTap;

  useEffect(() => {
    if (reduced) return;
    const host = hostRef.current;
    if (!host) return;

    let destroyed = false;
    let app: Application | null = null;
    let resizeObserver: ResizeObserver | null = null;
    const cleanups: Array<() => void> = [];

    (async () => {
      try {
        const worldPlate = resolveWorldPlate(pack, stage);
        const islandUrl = stripAssetQuery(worldPlate.src);
        const mascotUrl = pack.character ? stripAssetQuery(pack.character.src) : null;
        const waveUrl = pack.characterWave ? stripAssetQuery(pack.characterWave.src) : null;

        const loadList: Array<string | { src: string; data: Record<string, unknown> }> = [islandUrl];
        if (mascotUrl) loadList.push(mascotUrl);
        if (waveUrl) loadList.push(waveUrl);
        loadList.push(stripAssetQuery("/worlds/shared/waterfall-tile.png"));
        loadList.push({
          src: stripAssetQuery("/worlds/shared/waterfall-flow.webm"),
          data: {
            autoPlay: true,
            loop: true,
            muted: true,
            playsinline: true,
            preload: true,
            updateFPS: 24,
          },
        });
        loadList.push({
          src: stripAssetQuery("/worlds/shared/water-splash.webm"),
          data: {
            autoPlay: true,
            loop: true,
            muted: true,
            playsinline: true,
            preload: true,
            updateFPS: 20,
          },
        });

        await Assets.load(loadList);
        if (destroyed || !hostRef.current) return;

        const islandTex = Texture.from(islandUrl);
        const tileTex = Texture.from(stripAssetQuery("/worlds/shared/waterfall-tile.png"));
        const flowTex = Texture.from(stripAssetQuery("/worlds/shared/waterfall-flow.webm"));
        const splashTex = Texture.from(stripAssetQuery("/worlds/shared/water-splash.webm"));
        const idleMascotTex = mascotUrl ? Texture.from(mascotUrl) : null;
        const waveMascotTex = waveUrl ? Texture.from(waveUrl) : null;

        const nextApp = new Application();
        await nextApp.init({
          resizeTo: host,
          backgroundAlpha: 0,
          antialias: true,
          resolution: Math.min(window.devicePixelRatio || 1, 2),
          autoDensity: true,
          preference: "webgl",
          powerPreference: "high-performance",
        });
        if (destroyed) {
          nextApp.destroy(true, { children: true });
          return;
        }
        app = nextApp;
        host.replaceChildren(app.canvas);
        app.canvas.style.display = "block";
        app.canvas.style.width = "100%";
        app.canvas.style.height = "100%";
        app.canvas.style.pointerEvents = "auto";

        const root = new Container({ label: "arena-root" });
        app.stage.addChild(root);

        const glow = new Graphics();
        root.addChild(glow);

        const island = new Sprite({
          texture: islandTex,
          label: "island-plate",
        });
        island.eventMode = "static";
        island.cursor = "pointer";
        island.on("pointertap", () => {
          const fn = onIslandClickRef.current;
          if (!fn) return;
          playSfx("whoosh");
          fn();
        });
        root.addChild(island);

        const fxLayer = new Container({ label: "fx-layer" });
        root.addChild(fxLayer);

        const waterTiles: TilingSprite[] = [];
        for (const spot of pack.ambient?.waterSurfaces ?? []) {
          const water = new TilingSprite({
            texture: tileTex,
            width: 64,
            height: 32,
          });
          water.alpha = 0.28;
          water.tint = 0x7ec8ff;
          water.tileScale.set(0.22, 0.18);
          water.blendMode = "soft-light";
          fxLayer.addChild(water);
          waterTiles.push(water);
          (water as TilingSprite & { __hotspot?: IslandHotspot }).__hotspot = spot;
        }

        type FallPair = { flow: Sprite; splash: Sprite; hotspot: IslandHotspot };
        const falls: FallPair[] = [];
        for (const spot of pack.waterfallHotspots ?? []) {
          const flow = new Sprite({ texture: flowTex });
          flow.alpha = 0.72;
          flow.blendMode = "screen";
          const splash = new Sprite({ texture: splashTex });
          splash.alpha = 0.55;
          splash.anchor.set(0.5, 0.85);
          splash.blendMode = "add";
          fxLayer.addChild(flow);
          fxLayer.addChild(splash);
          falls.push({ flow, splash, hotspot: spot });
        }

        // Baked flags: tiny shimmer only — never move building art.
        const flagShimmers: Graphics[] = [];
        if (pack.ambient?.flag) {
          const g = new Graphics();
          g.alpha = 0.2;
          fxLayer.addChild(g);
          flagShimmers.push(g);
          (g as Graphics & { __hotspot?: IslandHotspot }).__hotspot = pack.ambient.flag;
        }

        let mascotSprite: Sprite | null = null;
        if (pack.liveMascot && idleMascotTex) {
          mascotSprite = new Sprite({
            texture: idleMascotTex,
            label: "mascot",
          });
          mascotSprite.anchor.set(0.5, 0.92);
          mascotSprite.eventMode = "static";
          mascotSprite.cursor = "pointer";
          mascotSprite.on("pointertap", () => {
            playSfx("mascot");
            waveRef.current = true;
            setBubble(speechRef.current);
            window.setTimeout(() => setBubble(null), ANIM.mascot.speechMs);
            window.setTimeout(() => {
              waveRef.current = false;
            }, ANIM.mascot.waveMs);
          });
          root.addChild(mascotSprite);
        }

        const petalTex = makeDotTexture(16, "rgba(255,176,210,0.95)");
        const sparkTex = makeDotTexture(12, "rgba(255,255,255,0.95)");

        const petalBox = new ParticleContainer({
          texture: petalTex,
          dynamicProperties: { position: true, rotation: true, color: true },
          boundsArea: new Rectangle(0, 0, 512, 512),
        });
        const sparkBox = new ParticleContainer({
          texture: sparkTex,
          dynamicProperties: { position: true, color: true },
          boundsArea: new Rectangle(0, 0, 512, 512),
        });
        root.addChild(petalBox);
        root.addChild(sparkBox);

        const soft: SoftParticle[] = [];
        const petalCount = Math.min(pack.ambient?.petals?.count ?? 6, 8);
        for (let i = 0; i < petalCount; i++) {
          const p = new Particle({
            texture: petalTex,
            x: 0,
            y: 0,
            scaleX: 0.45,
            scaleY: 0.35,
            alpha: 0,
            anchorX: 0.5,
            anchorY: 0.5,
          });
          petalBox.addParticle(p);
          soft.push({
            particle: p,
            vx: (Math.random() - 0.5) * 8,
            vy: 10 + Math.random() * 12,
            life: Math.random(),
            maxLife: 1,
            kind: "petal",
          });
        }
        for (let i = 0; i < 5; i++) {
          const p = new Particle({
            texture: sparkTex,
            x: 0,
            y: 0,
            scaleX: 0.35,
            scaleY: 0.35,
            alpha: 0,
            anchorX: 0.5,
            anchorY: 0.5,
            tint: i % 2 === 0 ? 0xffffff : 0xffe8b0,
          });
          sparkBox.addParticle(p);
          soft.push({
            particle: p,
            vx: (Math.random() - 0.5) * 4,
            vy: -4 - Math.random() * 10,
            life: Math.random(),
            maxLife: 1,
            kind: i % 2 === 0 ? "spark" : "dust",
          });
        }

        const pos = parseObjectPosition(worldPlate.position ?? pack.world.position);
        let plateLayout = { x: 0, y: 0, width: 1, height: 1, scale: 1 };
        let elapsed = 0;
        let nextWaveAt = 4.2;

        const layout = () => {
          if (!app) return;
          const w = app.screen.width;
          const h = app.screen.height;
          plateLayout = fitContain(
            w,
            h,
            islandTex.width,
            islandTex.height,
            pos.x,
            pos.y,
          );
          island.x = plateLayout.x;
          island.y = plateLayout.y;
          island.width = plateLayout.width;
          island.height = plateLayout.height;

          glow.clear();
          glow.ellipse(
            plateLayout.x + plateLayout.width * 0.5,
            plateLayout.y + plateLayout.height * 0.86,
            plateLayout.width * 0.34,
            plateLayout.height * 0.07,
          );
          glow.fill({ color: 0xffe8a8, alpha: 0.16 });

          waterTiles.forEach((water) => {
            const spot = (water as TilingSprite & { __hotspot?: IslandHotspot }).__hotspot;
            if (!spot) return;
            const r = hotspotRect(plateLayout, spot);
            water.x = r.x;
            water.y = r.y;
            water.width = r.width;
            water.height = r.height;
          });

          falls.forEach(({ flow, splash, hotspot }) => {
            const r = hotspotRect(plateLayout, hotspot);
            flow.x = r.x;
            flow.y = r.y;
            flow.width = r.width;
            flow.height = r.height * 0.92;
            splash.x = r.x + r.width * 0.5;
            splash.y = r.y + r.height * 0.95;
            splash.width = r.width * 1.35;
            splash.height = r.height * 0.28;
          });

          flagShimmers.forEach((g) => {
            const spot = (g as Graphics & { __hotspot?: IslandHotspot }).__hotspot;
            if (!spot) return;
            const r = hotspotRect(plateLayout, spot);
            g.clear();
            g.ellipse(r.x + r.width * 0.5, r.y + r.height * 0.45, r.width * 0.45, r.height * 0.35);
            g.fill({ color: 0xffffff, alpha: 0.35 });
          });

          if (mascotSprite && pack.mascotHotspot) {
            const r = hotspotRect(plateLayout, pack.mascotHotspot);
            mascotSprite.x = r.x + r.width * 0.5;
            mascotSprite.y = r.y + r.height * 0.92;
            const targetH = r.height;
            const s = targetH / Math.max(1, mascotSprite.texture.height);
            mascotSprite.scale.set(s);
            (mascotSprite as Sprite & { __baseScale?: number }).__baseScale = s;
          }

          petalBox.boundsArea = new Rectangle(0, 0, w, h);
          sparkBox.boundsArea = new Rectangle(0, 0, w, h);
        };

        layout();
        resizeObserver = new ResizeObserver(() => layout());
        resizeObserver.observe(host);

        app.ticker.maxFPS = 30;
        const tick = () => {
          if (!app) return;
          const dt = app.ticker.deltaMS / 1000;
          elapsed += dt;

          // Horizontal water scroll — texture only
          for (const water of waterTiles) {
            water.tilePosition.x -= 12 * dt;
          }

          // Soft splash pulse (video already loops downward)
          for (const { splash } of falls) {
            const pulse = 0.48 + Math.sin(elapsed * 3.1) * 0.1;
            splash.alpha = pulse;
            splash.scale.y = 0.95 + Math.sin(elapsed * 4.2) * 0.06;
          }

          for (const g of flagShimmers) {
            g.alpha = 0.12 + Math.sin(elapsed * 2.4) * 0.08;
          }

          // Mascot idle — breathe / tiny bounce; occasional wave texture
          if (mascotSprite) {
            const base = (mascotSprite as Sprite & { __baseScale?: number }).__baseScale ?? 1;
            const breathe = 1 + Math.sin(elapsed * 2.1) * 0.015;
            const bob = Math.sin(elapsed * 2.1) * -1.6;
            const sway = Math.sin(elapsed * 1.3) * 0.018;
            mascotSprite.scale.set(base * breathe, base * breathe);
            mascotSprite.rotation = sway;
            const r = hotspotRect(plateLayout, pack.mascotHotspot);
            mascotSprite.y = r.y + r.height * 0.92 + bob;

            if (waveRef.current && waveMascotTex) {
              if (mascotSprite.texture !== waveMascotTex) mascotSprite.texture = waveMascotTex;
            } else if (idleMascotTex && mascotSprite.texture !== idleMascotTex) {
              mascotSprite.texture = idleMascotTex;
            }

            if (!waveRef.current && elapsed > nextWaveAt && waveMascotTex) {
              waveRef.current = true;
              nextWaveAt = elapsed + 4.5 + Math.random() * 2.5;
              window.setTimeout(() => {
                waveRef.current = false;
              }, 720);
            }
          }

          // Ambient particles (low count)
          const origin = pack.ambient?.petals?.origin;
          const area = origin
            ? hotspotRect(plateLayout, origin)
            : {
                x: plateLayout.x + plateLayout.width * 0.1,
                y: plateLayout.y + plateLayout.height * 0.15,
                width: plateLayout.width * 0.8,
                height: plateLayout.height * 0.35,
              };

          for (const s of soft) {
            s.life += dt / (s.kind === "petal" ? 5.5 : 3.8);
            if (s.life >= 1) {
              s.life = 0;
              s.particle.x = area.x + Math.random() * area.width;
              s.particle.y =
                s.kind === "petal"
                  ? area.y - 8
                  : plateLayout.y + plateLayout.height * (0.2 + Math.random() * 0.35);
              s.vx = (Math.random() - 0.5) * (s.kind === "petal" ? 14 : 6);
              s.vy =
                s.kind === "petal" ? 8 + Math.random() * 10 : -4 - Math.random() * 10;
            }
            s.particle.x += s.vx * dt;
            s.particle.y += s.vy * dt;
            if (s.kind === "petal") s.particle.rotation += dt * 1.2;
            const fade =
              s.life < 0.12 ? s.life / 0.12 : s.life > 0.82 ? (1 - s.life) / 0.18 : 0.75;
            s.particle.alpha = Math.max(0, fade * (s.kind === "spark" ? 0.55 : 0.7));
          }

          // Soft under-glow breathe (graphics alpha only)
          glow.alpha = 0.85 + Math.sin(elapsed * 1.1) * 0.15;
        };

        app.ticker.add(tick);
        cleanups.push(() => app?.ticker.remove(tick));
      } catch (err) {
        console.error("PixiWorldScene failed", err);
        if (!destroyed) setFailed(true);
      }
    })();

    return () => {
      destroyed = true;
      resizeObserver?.disconnect();
      cleanups.forEach((fn) => fn());
      if (app) {
        app.destroy(
          { removeView: true, releaseGlobalResources: false },
          { children: true, texture: false, textureSource: false },
        );
        app = null;
      }
    };
  }, [pack, stage, reduced]);

  if (reduced || failed) {
    return <ArtWorldScene pack={pack} stage={stage} onIslandClick={onIslandClick} />;
  }

  const hs = pack.mascotHotspot;

  return (
    <div ref={hostRef} className="absolute inset-0 bg-transparent">
      <div className="pointer-events-none absolute inset-0 z-20">
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
