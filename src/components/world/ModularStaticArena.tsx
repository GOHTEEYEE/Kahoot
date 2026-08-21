"use client";

import { useEffect, useRef, useState } from "react";
import { Application, Assets, Container, Rectangle, Sprite, Texture } from "pixi.js";
import { fitContain } from "../../lib/animation/pixiFit";
import { playSfx } from "../../lib/audio/sfx";
import { ArtWorldScene } from "./ArtWorldScene";
import type { WorldArtPack } from "../../lib/animation/worldArt";
import type { WorldStageId } from "../../lib/worlds";

type Props = {
  pack: WorldArtPack;
  stage?: WorldStageId;
  onIslandClick?: () => void;
};

/** Design space matching LV1 island plate proportions (like stages/academy.png). */
const DESIGN = 1024;

type NodeSpec = {
  id: string;
  src: string;
  /** Center X in design space */
  x: number;
  /** Anchor Y in design space (usually feet / base) */
  y: number;
  /** Width in design space */
  width: number;
  anchorX?: number;
  anchorY?: number;
  layer: "IslandBase" | "TerrainDecor" | "Buildings" | "Vegetation" | "Mascot" | "Foreground";
};

/**
 * FINAL STATIC modular Chinese LV1 — unified island-foundation.
 * Composition reference: stages/academy.png (layout only).
 */
const NODES: NodeSpec[] = [
  // 1. Unified floating island (replaces island-base + island-rocks)
  {
    id: "islandFoundation",
    src: "/worlds/chinese/lv1/static/island-foundation.png",
    x: 512,
    y: 560,
    width: 900,
    anchorX: 0.5,
    anchorY: 0.55,
    layer: "IslandBase",
  },
  // 2. Path embedded on grass
  {
    id: "stonePath",
    src: "/worlds/chinese/lv1/static/stone-path.png",
    x: 512,
    y: 575,
    width: 240,
    anchorX: 0.5,
    anchorY: 0.72,
    layer: "TerrainDecor",
  },
  // 3. Academy grounded on grass (center-back)
  {
    id: "academy",
    src: "/worlds/chinese/buildings/academy-standalone-cut.png",
    x: 512,
    y: 455,
    width: 390,
    anchorX: 0.5,
    anchorY: 0.94,
    layer: "Buildings",
  },
  // 4–7 Trees + bushes (after academy per depth stack)
  {
    id: "tree01",
    src: "/worlds/chinese/lv1/static/cherry-tree-01.png",
    x: 265,
    y: 420,
    width: 270,
    anchorX: 0.5,
    anchorY: 0.94,
    layer: "Vegetation",
  },
  {
    id: "tree02",
    src: "/worlds/chinese/lv1/static/cherry-tree-02.png",
    x: 765,
    y: 425,
    width: 255,
    anchorX: 0.5,
    anchorY: 0.94,
    layer: "Vegetation",
  },
  {
    id: "bush01",
    src: "/worlds/chinese/lv1/static/bush-01.png",
    x: 340,
    y: 505,
    width: 95,
    anchorX: 0.5,
    anchorY: 0.88,
    layer: "Vegetation",
  },
  {
    id: "bush02",
    src: "/worlds/chinese/lv1/static/bush-02.png",
    x: 690,
    y: 510,
    width: 88,
    anchorX: 0.5,
    anchorY: 0.88,
    layer: "Vegetation",
  },
  // 8 Momo standing on grass / path
  {
    id: "momo",
    src: "/worlds/chinese/lv1/static/momo.png",
    x: 512,
    y: 545,
    width: 195,
    anchorX: 0.5,
    anchorY: 0.94,
    layer: "Mascot",
  },
  // 9–12 Flowers + small rocks grounded on front grass
  {
    id: "flower01",
    src: "/worlds/chinese/lv1/static/flower-cluster-01.png",
    x: 395,
    y: 590,
    width: 64,
    anchorX: 0.5,
    anchorY: 0.88,
    layer: "Foreground",
  },
  {
    id: "flower02",
    src: "/worlds/chinese/lv1/static/flower-cluster-02.png",
    x: 635,
    y: 595,
    width: 68,
    anchorX: 0.5,
    anchorY: 0.88,
    layer: "Foreground",
  },
  {
    id: "rock01",
    src: "/worlds/chinese/lv1/static/rock-small-01.png",
    x: 370,
    y: 615,
    width: 48,
    anchorX: 0.5,
    anchorY: 0.88,
    layer: "Foreground",
  },
  {
    id: "rock02",
    src: "/worlds/chinese/lv1/static/rock-small-02.png",
    x: 670,
    y: 620,
    width: 50,
    anchorX: 0.5,
    anchorY: 0.88,
    layer: "Foreground",
  },
  // Sign last (front-most prop)
  {
    id: "signBoard",
    src: "/worlds/chinese/lv1/static/sign-board.png",
    x: 250,
    y: 535,
    width: 88,
    anchorX: 0.5,
    anchorY: 0.96,
    layer: "Foreground",
  },
];

export type ModularStaticReport = {
  loaded: string[];
  failed: string[];
  placements: Array<{ id: string; x: number; y: number; scale: number; width: number }>;
};

declare global {
  interface Window {
    __modularArenaReport?: ModularStaticReport;
  }
}

/**
 * Experimental STATIC modular Chinese LV1 arena.
 * No animation / video / particles / shaders.
 */
export function ModularStaticArena({ pack, stage, onIslandClick }: Props) {
  const hostRef = useRef<HTMLDivElement>(null);
  const [failed, setFailed] = useState(false);
  const onIslandClickRef = useRef(onIslandClick);
  onIslandClickRef.current = onIslandClick;

  useEffect(() => {
    const host = hostRef.current;
    if (!host) return;

    let destroyed = false;
    let app: Application | null = null;
    let ro: ResizeObserver | null = null;

    (async () => {
      const report: ModularStaticReport = { loaded: [], failed: [], placements: [] };
      try {
        const urls = [...new Set(NODES.map((n) => n.src))];
        for (const url of urls) {
          try {
            await Assets.load(url);
            report.loaded.push(url);
          } catch {
            report.failed.push(url);
          }
        }
        if (destroyed) return;
        if (report.failed.length === urls.length) {
          setFailed(true);
          window.__modularArenaReport = report;
          return;
        }

        const next = new Application();
        await next.init({
          resizeTo: host,
          backgroundAlpha: 0,
          antialias: true,
          resolution: Math.min(window.devicePixelRatio || 1, 2),
          autoDensity: true,
          preference: "webgl",
          autoStart: true,
        });
        if (destroyed) {
          next.destroy(true, { children: true });
          return;
        }
        app = next;
        host.replaceChildren(app.canvas);
        app.canvas.style.display = "block";
        app.canvas.style.width = "100%";
        app.canvas.style.height = "100%";

        const arena = new Container({ label: "Arena" });
        const layers = {
          IslandBase: new Container({ label: "IslandBase" }),
          TerrainDecor: new Container({ label: "TerrainDecor" }),
          Buildings: new Container({ label: "Buildings" }),
          Vegetation: new Container({ label: "Vegetation" }),
          Mascot: new Container({ label: "Mascot" }),
          Foreground: new Container({ label: "Foreground" }),
        };
        // Depth: Foundation → Path → Academy → Trees/Bushes → Momo → Flowers/Rocks → Sign
        arena.addChild(
          layers.IslandBase,
          layers.TerrainDecor,
          layers.Buildings,
          layers.Vegetation,
          layers.Mascot,
          layers.Foreground,
        );
        app.stage.addChild(arena);

        const sprites = new Map<string, Sprite>();

        for (const node of NODES) {
          if (report.failed.includes(node.src)) continue;
          const loaded = Assets.get(node.src);
          const tex = loaded instanceof Texture ? loaded : Texture.from(node.src);
          const sprite = new Sprite({ texture: tex, label: node.id });
          sprite.anchor.set(node.anchorX ?? 0.5, node.anchorY ?? 0.5);
          const s = node.width / Math.max(1, tex.width);
          sprite.scale.set(s);
          sprite.x = node.x;
          sprite.y = node.y;
          layers[node.layer].addChild(sprite);
          sprites.set(node.id, sprite);
          report.placements.push({
            id: node.id,
            x: node.x,
            y: node.y,
            scale: Number(s.toFixed(4)),
            width: node.width,
          });
        }

        arena.eventMode = "static";
        arena.cursor = "pointer";
        arena.hitArea = new Rectangle(0, 0, DESIGN, DESIGN);
        arena.on("pointertap", () => {
          const fn = onIslandClickRef.current;
          if (!fn) return;
          playSfx("whoosh");
          fn();
        });

        const layout = () => {
          if (!app) return;
          const fit = fitContain(app.screen.width, app.screen.height, DESIGN, DESIGN, 0.5, 0.52);
          arena.x = fit.x;
          arena.y = fit.y;
          arena.scale.set(fit.scale);
          app.render();
        };

        layout();
        // One extra frame so GPU textures settle, then freeze (static arena — no motion).
        await new Promise<void>((resolve) => {
          requestAnimationFrame(() => {
            app?.render();
            app?.ticker.stop();
            resolve();
          });
        });
        ro = new ResizeObserver(() => layout());
        ro.observe(host);
        window.__modularArenaReport = report;
      } catch (e) {
        console.error("ModularStaticArena failed", e);
        if (!destroyed) setFailed(true);
      }
    })();

    return () => {
      destroyed = true;
      ro?.disconnect();
      if (app) {
        app.destroy(
          { removeView: true, releaseGlobalResources: false },
          { children: true, texture: false, textureSource: false },
        );
        app = null;
      }
    };
  }, [pack.subject, stage]);

  if (failed) {
    return <ArtWorldScene pack={pack} stage={stage} onIslandClick={onIslandClick} />;
  }

  return <div ref={hostRef} className="absolute inset-0 bg-transparent" />;
}

/** Feature flag: Chinese experimental modular static arena. */
export const USE_MODULAR_STATIC_CHINESE_ARENA = true;
