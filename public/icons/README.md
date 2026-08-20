# Game Icon System

Polished 3D PNG icons for major game actions. All assets share warm lighting, soft bevel, and toy-like proportions matching the floating island art.

## Major icons (3D PNG)

| Semantic id   | File           | Used for              |
|---------------|----------------|------------------------|
| `chest`       | chest.png      | Daily chest            |
| `mission`     | quest.png      | Daily missions         |
| `pass`        | medal.png      | Battle pass            |
| `trophy`      | trophy.png     | Trophies, rank         |
| `map`         | map.png        | World map              |
| `challenge`   | swords.png     | Challenge button       |
| `reward`      | fragment.png   | Trophy road rewards    |
| `event`       | speaker.png    | Events / announcements |
| `spirits`     | spirit.png     | Spirits tab            |
| `profile`     | backpack.png   | Profile tab            |
| `home`        | home.png       | Home tab               |
| `coin`        | coin.png       | Currency               |
| `gem`         | gem.png        | Premium currency       |

## Utility icons (3D PNG in `/public/icons`)

| Semantic id      | File      |
|------------------|-----------|
| `mail`           | mail.png  |
| `notification`   | bell.png  |
| `settings`       | gear.png  |

Small SVG utilities (`plus`, `close`, `arrow-*`) live in `UtilityIcon.tsx`.

## Missing assets (placeholder)

| Id     | Recommended art |
|--------|-----------------|
| `gift` | 3D red/yellow gift box with ribbon bow, warm toy-like bevel, transparent PNG ~256px, same lighting as chest/trophy |

Replace by adding `public/icons/gift.png` and setting `GAME_ICON_FILES.gift = "gift"` in `src/lib/gameIcons.ts`.

## Usage

```tsx
import { GameIcon } from "@/components/home/GameIcon";

<GameIcon name="challenge" size="challenge" />
<GameIcon name="chest" size="sideHud" />
<GameIcon name="mail" size="utility" />
```

Size presets: `nav` (36px), `challenge` (56px), `worldMap` (44px), `sideHud` (32px), `utility` (20px), `progress` (32px).

## License

Existing PNGs are project art assets. When adding new icons, prefer [Kenney Game Icons](https://kenney.nl/assets/game-icons) (CC0) or similar CC0 packs only.
