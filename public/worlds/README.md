# MathArena World Assets

Asset-first miniature worlds. React composes plates via `ArtWorldScene`.

## Folder convention

```
/public/worlds/{subject}/
  sky.png              # far background
  hero.png             # main island / landmark plate
  foreground.png       # near fringe (masked)
  background/          # optional split layers
  buildings/
  environment/
  characters/
  stages/              # optional LV overlays: village|academy|temple|city|kingdom.png
```

## Subjects

| folder   | world              | mascot  |
|----------|--------------------|---------|
| chinese  | 墨香书院           | 墨墨    |
| english  | Word Keep          | Lexi    |
| math     | Arithmetic Canyon  | Numo    |
| science  | Experiment Tower   | Nova    |
| malay    | Istana Bahasa      | Bahasa  |

Do not invent CSS houses/trees as a substitute for these plates.
