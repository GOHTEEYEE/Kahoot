import type { SubjectId } from "../curriculum";
import type { WorldStageId } from "../worlds";

export type WorldArtLayer = {
  src: string;
  /** CSS object-position */
  position?: string;
};

export type IslandHotspot = { left: number; top: number; width: number; height: number };

export type WorldAmbientConfig = {
  waterSurfaces?: IslandHotspot[];
  flag?: IslandHotspot;
  foliage?: Array<{ hotspot: IslandHotspot; delay?: number }>;
  petals?: { origin: IslandHotspot; count?: number };
};

export type WorldArtPack = {
  subject: SubjectId;
  folder: string;
  sky: WorldArtLayer;
  /** Full diorama midground (landmark + environment; may include baked mascot). */
  world: WorldArtLayer;
  /** How the island plate is fitted. Default: cover. */
  worldFit?: "cover" | "contain";
  foreground: WorldArtLayer;
  /** Hide fringe overlay when the hero plate already includes foreground. */
  showForeground?: boolean;
  /** Optional character plate for future cutout / Rive reference. */
  character?: WorldArtLayer;
  /** Optional looping video for the living island (center world). */
  videoSrc?: string;
  posterSrc?: string;
  /** Normalized hotspot for mascot tap (0–1). */
  mascotHotspot: { left: number; top: number; width: number; height: number };
  /** Draw `character` as a living overlay (island art must not bake the mascot). */
  liveMascot?: boolean;
  /** Optional waving pose swapped in on idle ticks and tap. */
  characterWave?: WorldArtLayer;
  /** Waterfall sheets glued to the island plate (0–1 of the island box). */
  waterfallHotspots?: IslandHotspot[];
  /** GPU-friendly environmental motion hotspots (water, flag, foliage, petals). */
  ambient?: WorldAmbientConfig;
  /**
   * Optional stage overlays — when files exist, richer worlds unlock by trophy stage.
   * Place under /public/worlds/{folder}/stages/{stage}.png
   */
  stageOverlay?: Partial<Record<WorldStageId, WorldArtLayer>>;
  /**
   * Full island plate replacements unlocked by trophy stage.
   * Village (Lv.1) uses `world` / `posterSrc`. Higher stages fall back to the latest plate below them.
   */
  stageWorld?: Partial<Record<WorldStageId, WorldArtLayer>>;
  /** Optional per-world hero scale override (default: CSS --island-scale). */
  islandHeroScale?: number;
  /** Optional per-world hero transform origin (default: 50% 58%). */
  islandHeroOrigin?: string;
  /** Island plate width:height ratio (default: CSS --island-aspect). */
  islandAspect?: number;
};

/** Premium painted world packs. Compose via ArtWorldScene — never CSS house/tree fakes. */
export const WORLD_ART_PACKS: Record<SubjectId, WorldArtPack> = {
  chinese: {
    subject: "chinese",
    folder: "chinese",
    sky: { src: "/worlds/shared/home-bg.png", position: "50% 35%" },
    // Layered game plate (transparent) — NOT a baked screenshot of the whole scene.
    world: { src: "/worlds/chinese/stages/academy.png?v=live", position: "50% 52%" },
    worldFit: "contain",
    posterSrc: "/worlds/chinese/stages/academy.png?v=live",
    foreground: { src: "/worlds/chinese/foreground.png", position: "50% 100%" },
    showForeground: false,
    character: { src: "/worlds/chinese/momo.png?v=live", position: "50% 50%" },
    characterWave: { src: "/worlds/chinese/momo-wave.png?v=wave", position: "50% 50%" },
    liveMascot: true,
    mascotHotspot: { left: 0.36, top: 0.5, width: 0.28, height: 0.38 },
    islandHeroScale: 1.12,
    islandHeroOrigin: "50% 58%",
    waterfallHotspots: [
      { left: 0.18, top: 0.54, width: 0.11, height: 0.28 },
      { left: 0.7, top: 0.54, width: 0.11, height: 0.28 },
    ],
    ambient: {
      waterSurfaces: [{ left: 0.18, top: 0.78, width: 0.64, height: 0.09 }],
      foliage: [
        { hotspot: { left: 0.06, top: 0.46, width: 0.14, height: 0.12 }, delay: 0 },
        { hotspot: { left: 0.78, top: 0.48, width: 0.14, height: 0.12 }, delay: 0.7 },
      ],
      petals: { origin: { left: 0.04, top: 0.18, width: 0.92, height: 0.42 }, count: 11 },
    },
  },
  english: {
    subject: "english",
    folder: "english",
    sky: { src: "/worlds/shared/home-bg.png", position: "50% 35%" },
    world: { src: "/worlds/english/island.png?v=cut", position: "50% 52%" },
    worldFit: "contain",
    posterSrc: "/worlds/english/island.png?v=cut",
    foreground: { src: "/worlds/english/foreground.png", position: "50% 100%" },
    showForeground: false,
    character: { src: "/worlds/english/lexi.png", position: "50% 50%" },
    mascotHotspot: { left: 0.16, top: 0.5, width: 0.24, height: 0.28 },
    waterfallHotspots: [
      { left: 0.24, top: 0.52, width: 0.1, height: 0.26 },
      { left: 0.64, top: 0.52, width: 0.1, height: 0.26 },
    ],
    ambient: {
      waterSurfaces: [{ left: 0.16, top: 0.76, width: 0.68, height: 0.11 }],
      flag: { left: 0.44, top: 0.1, width: 0.1, height: 0.07 },
      foliage: [
        { hotspot: { left: 0.04, top: 0.4, width: 0.18, height: 0.22 }, delay: 0 },
        { hotspot: { left: 0.72, top: 0.46, width: 0.16, height: 0.18 }, delay: 0.9 },
      ],
    },
  },
  math: {
    subject: "math",
    folder: "math",
    sky: { src: "/worlds/shared/home-bg.png", position: "50% 35%" },
    world: { src: "/worlds/math/island.png?v=lv1", position: "50% 52%" },
    posterSrc: "/worlds/math/island.png?v=lv1",
    worldFit: "contain",
    showForeground: false,
    foreground: { src: "/worlds/math/foreground.png", position: "50% 100%" },
    mascotHotspot: { left: 0.16, top: 0.5, width: 0.24, height: 0.28 },
    waterfallHotspots: [
      { left: 0.22, top: 0.5, width: 0.11, height: 0.28 },
      { left: 0.66, top: 0.5, width: 0.11, height: 0.28 },
    ],
    ambient: {
      waterSurfaces: [{ left: 0.14, top: 0.75, width: 0.72, height: 0.12 }],
      flag: { left: 0.45, top: 0.08, width: 0.1, height: 0.08 },
      foliage: [
        { hotspot: { left: 0.03, top: 0.38, width: 0.2, height: 0.26 }, delay: 0 },
        { hotspot: { left: 0.74, top: 0.44, width: 0.15, height: 0.2 }, delay: 0.6 },
      ],
    },
  },
  science: {
    subject: "science",
    folder: "science",
    sky: { src: "/worlds/shared/home-bg.png", position: "50% 35%" },
    world: { src: "/worlds/science/island.png", position: "50% 54%" },
    posterSrc: "/worlds/science/island.png",
    worldFit: "contain",
    showForeground: false,
    foreground: { src: "/worlds/science/foreground.png", position: "50% 100%" },
    mascotHotspot: { left: 0.34, top: 0.48, width: 0.24, height: 0.3 },
    waterfallHotspots: [
      { left: 0.23, top: 0.5, width: 0.1, height: 0.27 },
      { left: 0.65, top: 0.5, width: 0.1, height: 0.27 },
    ],
    ambient: {
      waterSurfaces: [{ left: 0.15, top: 0.74, width: 0.7, height: 0.12 }],
      flag: { left: 0.44, top: 0.09, width: 0.1, height: 0.07 },
      foliage: [
        { hotspot: { left: 0.04, top: 0.4, width: 0.18, height: 0.24 }, delay: 0 },
        { hotspot: { left: 0.73, top: 0.48, width: 0.14, height: 0.16 }, delay: 0.8 },
      ],
    },
  },
  malay: {
    subject: "malay",
    folder: "malay",
    sky: { src: "/worlds/shared/home-bg.png", position: "50% 35%" },
    world: { src: "/worlds/malay/island.png?v=lv1", position: "50% 52%" },
    posterSrc: "/worlds/malay/island.png?v=lv1",
    worldFit: "contain",
    showForeground: false,
    foreground: { src: "/worlds/malay/foreground.png", position: "50% 100%" },
    mascotHotspot: { left: 0.16, top: 0.5, width: 0.24, height: 0.28 },
    waterfallHotspots: [
      { left: 0.22, top: 0.5, width: 0.11, height: 0.28 },
      { left: 0.66, top: 0.5, width: 0.11, height: 0.28 },
    ],
    ambient: {
      waterSurfaces: [{ left: 0.14, top: 0.75, width: 0.72, height: 0.12 }],
      flag: { left: 0.44, top: 0.09, width: 0.1, height: 0.07 },
      foliage: [
        { hotspot: { left: 0.03, top: 0.38, width: 0.2, height: 0.26 }, delay: 0 },
        { hotspot: { left: 0.72, top: 0.46, width: 0.16, height: 0.18 }, delay: 0.5 },
      ],
    },
    stageWorld: {
      academy: { src: "/worlds/malay/stages/academy.png?v=lv2", position: "50% 52%" },
      temple: { src: "/worlds/malay/stages/temple.png?v=lv3", position: "50% 52%" },
      city: { src: "/worlds/malay/stages/city.png?v=lv4", position: "50% 52%" },
      kingdom: { src: "/worlds/malay/stages/kingdom.png?v=lv5", position: "50% 52%" },
      empire: { src: "/worlds/malay/stages/empire.png?v=lv6", position: "50% 52%" },
    },
  },
};

export function getWorldArtPack(subject: SubjectId): WorldArtPack {
  return WORLD_ART_PACKS[subject];
}

const WORLD_STAGE_ORDER: WorldStageId[] = [
  "village",
  "academy",
  "temple",
  "city",
  "kingdom",
  "empire",
];

/** Island plate for the current trophy stage. Missing higher stages reuse the latest unlocked plate. */
export function resolveWorldPlate(pack: WorldArtPack, stage?: WorldStageId): WorldArtLayer {
  if (stage && pack.stageWorld) {
    const idx = WORLD_STAGE_ORDER.indexOf(stage);
    for (let i = idx; i >= 0; i--) {
      const plate = pack.stageWorld[WORLD_STAGE_ORDER[i]];
      if (plate) return plate;
    }
  }
  return {
    src: pack.posterSrc ?? pack.world.src,
    position: pack.world.position,
  };
}

/** Preview art for a specific stage in the world map. `designed` is false when that level has no unique plate yet. */
export function peekWorldPlate(
  pack: WorldArtPack,
  stage: WorldStageId,
): { plate: WorldArtLayer; designed: boolean } {
  if (stage === "village") {
    return {
      plate: {
        src: pack.posterSrc ?? pack.world.src,
        position: pack.world.position,
      },
      designed: true,
    };
  }
  const exact = pack.stageWorld?.[stage];
  if (exact) return { plate: exact, designed: true };
  return { plate: resolveWorldPlate(pack, stage), designed: false };
}

/** Asset path convention for future layered packs / stage unlocks. */
export function worldAssetRoot(subject: SubjectId): string {
  return `/worlds/${WORLD_ART_PACKS[subject].folder}`;
}
