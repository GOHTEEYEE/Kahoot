# Game Assets

Organized asset library for MathArena mobile game UI.

## Structure

- `icons/` — HUD & navigation 3D icons (symlinked from `/public/icons`)
- `backgrounds/` — Sky / atmosphere backgrounds
- `worlds/` — Reserved for world-specific art copies
- `ui/` — Buttons, frames, ornaments
- `characters/` — Mascots & heroes
- `rewards/` — Trophy road & loot art
- `fonts/` — Optional local font files

## Manifest

See `assets-manifest.json` for id → path mapping, source, and license.

## Adding assets

1. Prefer CC0 sources ([Kenney](https://kenney.nl/assets))
2. Add file under the appropriate folder
3. Register in `assets-manifest.json`
4. Wire through `src/lib/gameIcons.ts` or world art packs

Do not hotlink external URLs at runtime.
