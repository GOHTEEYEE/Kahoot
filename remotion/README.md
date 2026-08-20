# Remotion — island water FX

Pre-render **transparent WebM** loops for waterfall flow and base splash.  
The Home screen plays these inside clipped hotspots (`IslandLivingFx`); the island PNG stays static.

## Preview

```bash
npm run remotion:studio
```

Open compositions **WaterfallFlow** and **WaterSplash** in the browser.

## Export (requires FFmpeg on your Mac)

```bash
npm run remotion:render:fx
```

Outputs:

| File | Size | Loop |
|------|------|------|
| `public/worlds/shared/waterfall-flow.webm` | 128×384 | 1.5s |
| `public/worlds/shared/water-splash.webm` | 160×96 | 1.2s |

Both use **VP9 + alpha** (`yuva420p`). Re-run after editing `remotion/compositions/*`.

## In the app

- If WebM exists → `<video loop muted playsInline>` in each waterfall hotspot  
- If missing or `prefers-reduced-motion` → CSS gradient fallback (no broken layout)

Do **not** render the full island as video — only these small FX strips.
