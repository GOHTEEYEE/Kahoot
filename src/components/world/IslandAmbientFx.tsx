"use client";

import type { CSSProperties } from "react";
import type { IslandHotspot, WorldAmbientConfig } from "../../lib/animation/worldArt";

type HotspotStyle = CSSProperties & {
  left: string;
  top: string;
  width: string;
  height: string;
};

function hotspotStyle(h: IslandHotspot): HotspotStyle {
  return {
    left: `${h.left * 100}%`,
    top: `${h.top * 100}%`,
    width: `${h.width * 100}%`,
    height: `${h.height * 100}%`,
  };
}

type Props = {
  ambient?: WorldAmbientConfig;
  reduced: boolean;
};

/** Lightweight CSS-only environmental motion — no duplicate island plate layers. */
export function IslandAmbientFx({ ambient, reduced }: Props) {
  if (reduced || !ambient) return null;

  const petalCount = ambient.petals?.count ?? 5;
  const petalOrigin = ambient.petals?.origin;

  return (
    <div className="pointer-events-none absolute inset-0 z-[2]" aria-hidden>
      {ambient.waterSurfaces?.map((spot, i) => (
        <div key={`water-${i}`} className="island-water-surface absolute" style={hotspotStyle(spot)}>
          <span className="island-water-surface__sheen" style={{ animationDelay: `${i * -1.1}s` }} />
          <span className="island-water-surface__ripple" style={{ animationDelay: `${i * -0.7}s` }} />
        </div>
      ))}

      {ambient.flag ? (
        <div className="island-flag absolute" style={hotspotStyle(ambient.flag)}>
          <span className="island-flag__fabric" />
        </div>
      ) : null}

      {ambient.foliage?.map((item, i) => (
        <div
          key={`foliage-${i}`}
          className="island-foliage absolute"
          style={{
            ...hotspotStyle(item.hotspot),
            animationDelay: `${item.delay ?? i * 0.4}s`,
          }}
        />
      ))}

      {petalOrigin ? (
        <div className="absolute overflow-visible" style={hotspotStyle(petalOrigin)}>
          {Array.from({ length: petalCount }, (_, i) => (
            <span
              key={i}
              className="island-petal"
              style={
                {
                  "--petal-delay": `${i * 1.35 + (i % 2) * 0.4}s`,
                  "--petal-x": `${12 + i * 14}%`,
                  "--petal-drift": `${i % 2 === 0 ? 12 : -10}px`,
                } as CSSProperties
              }
            />
          ))}
        </div>
      ) : null}

      <div className="island-ambient-light absolute inset-0" />
    </div>
  );
}
