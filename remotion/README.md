# Remotion — island water FX + arena promo loop

## Preview

```bash
npm run remotion:studio
```

Open compositions **ChineseArenaLoop**, **WaterfallFlow**, and **WaterSplash**.

## Arena promo loop（模块化岛屿 · 喝茶 → 看镜头笑 · 樱花 · 流水）

```bash
npm run remotion:render:arena        # → public/worlds/chinese/arena-loop.mp4
npm run remotion:render:arena:webm   # → public/worlds/chinese/arena-loop.webm
```

720×720 · **2s** · 30fps · seamless loop  
Assets: `island-foundation` + academy/trees/momo · petals · river falls

## Water FX (transparent WebM)

```bash
npm run remotion:render:fx
```

| File | Size | Loop |
|------|------|------|
| `public/worlds/shared/waterfall-flow.webm` | 128×384 | 1.5s |
| `public/worlds/shared/water-splash.webm` | 160×96 | 1.2s |

Both use **VP9 + alpha** (`yuva420p`). Re-run after editing `remotion/compositions/*`.

## In the app

- Water FX: Home waterfall hotspots (`IslandLivingFx`)
- Arena loop: share / social / marketing — not wired into Home by default
