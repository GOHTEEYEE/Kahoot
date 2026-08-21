/** Fit a texture into a box like CSS object-fit: contain + object-position. */
export function fitContain(
  boxW: number,
  boxH: number,
  texW: number,
  texH: number,
  posX = 0.5,
  posY = 0.5,
): { x: number; y: number; width: number; height: number; scale: number } {
  if (boxW <= 0 || boxH <= 0 || texW <= 0 || texH <= 0) {
    return { x: 0, y: 0, width: boxW, height: boxH, scale: 1 };
  }
  const scale = Math.min(boxW / texW, boxH / texH);
  const width = texW * scale;
  const height = texH * scale;
  const x = (boxW - width) * posX;
  const y = (boxH - height) * posY;
  return { x, y, width, height, scale };
}

/** Parse CSS object-position like "50% 52%" into 0–1 fractions. */
export function parseObjectPosition(position?: string): { x: number; y: number } {
  if (!position) return { x: 0.5, y: 0.5 };
  const parts = position.trim().split(/\s+/);
  const read = (raw: string | undefined, fallback: number) => {
    if (!raw) return fallback;
    if (raw.endsWith("%")) {
      const n = Number.parseFloat(raw);
      return Number.isFinite(n) ? n / 100 : fallback;
    }
    return fallback;
  };
  return { x: read(parts[0], 0.5), y: read(parts[1] ?? parts[0], 0.5) };
}

export function stripAssetQuery(src: string): string {
  return src.split("?")[0] ?? src;
}
