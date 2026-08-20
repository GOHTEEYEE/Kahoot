# Rive character assets (Version 1)

Place compiled `.riv` files here:

- `nova.riv` — Science / Experiment Tower
- `lexi.riv` — English / Word Keep
- `momo.riv` — Chinese / 墨香书院
- `numo.riv` — Math / Arithmetic Canyon
- `bahasa.riv` — Bahasa Melayu / Istana Bahasa

Until a file exists, `AnimatedMascot` falls back to the emoji placeholder
with Framer Motion idle / tap animations. The app must not crash if a
`.riv` is missing.

Suggested State Machine triggers (optional):

- `wave` / `tap`
- `celebrate` / `correct`
- `wrong`
- `idle` (loop)
