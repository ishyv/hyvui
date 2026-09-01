# AGENTS.md

This file provides guidance to Codex (codex.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev          # start dev server
npm run build        # build library (svelte-package + publint)
npm run check        # type check with svelte-check
npm run check:watch  # continuous type checking
npm run lint         # check formatting (Prettier)
npm run format       # fix formatting
npm run test:e2e     # build + run Playwright tests (1600x900 viewport)
```

## Architecture

**hyvui** (`@hyvnt/hyvui`) is a Svelte 5 component library with a dark, operator-adjacent aesthetic. Published via `src/lib/index.ts`. `src/routes/` is a demo/docs site, not part of the published library.

### Three augmentation layers

The library has three orthogonal styling layers that compose. Pick none, one, two, or all three. The base library is the soul; the layers do not replace it.

| Layer                 | HTML attribute            | Helper          | Purpose                                    |
| --------------------- | ------------------------- | --------------- | ------------------------------------------ |
| **register (weight)** | `data-weight` on `<body>` | `applyWeight()` | typographic density and emotional register |
| **theme**             | `data-theme` on `<body>`  | `applyTheme()`  | material identity (palette + motif)        |
| **grade**             | `data-grade` on `<body>`  | `applyGrade()`  | film-look color grading                    |

> ⚠ Historical naming quirk: the codebase calls them "registers" in docs but the attribute is `data-weight`. The TypeScript helper is `applyWeight()`. Use the helper, not raw attributes, to stay consistent.

### Composition

1. **Base** — components in `src/lib/components/` organized by group (primitives, inputs, feedback, layout, navigation, display, ambient, depth, orchestration, ornaments, patterns, scenes)
2. **Expressive** — register-aware mood; `Text` expressions carry semantic intent; actions (`surface`, `echo`, `reveal`, `resolve`, `track`) compose onto any element
3. **Spatial** — CSS 3D depth system (`DepthStage`, `DepthLayer`, `FloatCard`, `HorizonGrid`, `Plinth`) in `src/lib/system/depth/`
4. **Cinematic** — `Sequence` (choreographed reveal), `KineticText` (letter/word/mask/telegraph), `--key-light-angle` (directional shadow), grades (color filter on `<body>`)
5. **Ornamental** — frame/network/mark ornaments in `src/lib/components/ornaments/` with per-register glyph libraries in `glyphs/`

### Token system

All tokens are CSS custom properties in `src/lib/tokens/tokens.css`. They are also available as:

- TypeScript constants via `import { tokens } from '$lib'`
- Tailwind v4 classes via the `@theme` block in `app.css`

Theme tokens (`hextech.css`, `arcane.css`) layer ON TOP of the base — they remap semantic colors (`--accent`, `--signal`, etc.) and add material recipes (see Theme Augmentation below).

**Never use raw hex colors or Tailwind's built-in color names.** Always reference tokens.

**Base palette (no theme):** gold (`--accent: #c79c57`) = human/warm/action; teal (`--signal: #79a6a3`) = machine/cool/data. Themes remap these.

### Registers (weight)

Applied to `<body>` via `applyWeight()`:

| weight            | character                      | use for                      |
| ----------------- | ------------------------------ | ---------------------------- |
| `field-notebook`  | warm, editorial, serif-forward | portfolios, narrative pages  |
| `mission-control` | dense, mono-forward, precise   | dashboards, tools            |
| `archive`         | cool, spacious, muted          | galleries, indexes, catalogs |

### Themes (motif + palette)

Applied to `<body>` via `applyTheme()`. **Themes have soul.** They are not just recolors. Each carries a material identity and motion personality drawn from a real reference (the Arcane Netflix series).

| theme     | identity                                                                                                     | reference                                                                                                                                             |
| --------- | ------------------------------------------------------------------------------------------------------------ | ----------------------------------------------------------------------------------------------------------------------------------------------------- |
| `hextech` | brass machinery housing a crystal that holds light. mechanical + sacred. precise. art deco.                  | Piltover (Arcane S1/S2): brass clockwork, hex crystals, scan lines, the hextech rifle, hexgates, gem-cut housings                                     |
| `arcane`  | divine, mystical, angelic — a living manifestation that is both organism and miracle. iridescent. breathing. | The Hexcore (Arcane): biomechanical, fractal, white-hot core, magenta-violet bleed, plant growth, mutation. Viktor's transformation. Cathedral light. |

See `src/lib/tokens/hextech.css` and `src/lib/tokens/arcane.css` for the material recipes. See `AESTHETICS.md` § "Theme Augmentation" for the full visual language reference.

### Grades (film-look)

Applied to `<body>` via `applyGrade()`. A single CSS `filter` on the body element; does not cascade into ::before/::after, so textures stay independent.

| grade           | filter recipe                                      |
| --------------- | -------------------------------------------------- |
| `cold-archive`  | cool, lifted blacks, washed                        |
| `interrogation` | high contrast, desaturated mids, slight green push |
| `twilight`      | warm shadows, magenta highlights                   |
| `dailies`       | flat, slightly green, broadcast look               |

### Patterns and scenes

Always check `src/lib/components/patterns/` before assembling a layout from primitives. Check `src/lib/components/scenes/` before building page layouts.

## Anti-patterns

- No hardcoded hex colors. No Tailwind built-in color names (`text-blue-500`). Use token classes.
- No `border-radius` without intent — the default is no rounding.
- No new accent hues in the base palette — only gold and teal. Themes can introduce their own hue families.
- No heavy font weights for hierarchy — use size, tracking, and color instead.
- Do not assemble primitives manually when a `patterns/` component exists.
- Do not target component class names for overrides. The only sanctioned override surface is a copy of `src/lib/system/override-template.css` imported after `app.css`.
- Do not flatten theme surfaces — every theme panel should layer 4–6 effects (gradient body + clip-path + drop-shadow stack + animated sweep + inset bevel + hover state).
- Do not write theme-specific code in components without consulting `--surface-brass-bg` / `--surface-crystal-bg` / `--arc-iridescent` / `--clip-octagon` / `--clip-shard`. These are the canonical material vocabularies.

## Typography

Two typefaces only:

- **ET Book** (serif) — self-hosted, used for all body text and headings
- **IBM Plex Mono** — used for all labels, metadata, UI strings, nav items

Weight is almost always 400. Hierarchy comes from size, tracking, and color — not weight.

## Copy voice

- Lowercase for all UI strings, labels, and metadata
- Short sentences. Fragments are fine.
- No em-dashes. Use periods.
- Error states describe the condition, not the cause: "signal interrupted", not "server returned 500"
- Never use title case in labels or buttons
- Never say "error" or "warning" as a title
- For theme showcases: specific anchor details (proper nouns, exact times) beat generic poetry. "PAULSEN-9 holding bearing 240 for six hours" beats "a vigilant watch in the night."
- For arcane theme content: Latin cadence works ("ex tenebris lux"). Reverent, present-tense witness voice. Treat the manifestation as something seen, not something studied.
- For hextech theme content: workshop voice. Time-stamped log entries. Technical readings. Numeric specificity ("rig iv · mmcdxii"). Mention the operator by name.

## Hover & micro-interaction philosophy

Every theme-aware element should react to hover with intentional feedback. Subtlety is the rule — never large-scale transforms.

- Hextech: brass-cyan glow expansion (drop-shadow stack intensifies), border picks up the cyan-electric on hover
- Arcane: magenta/white-hot aura blooms (drop-shadow stack intensifies, iridescent border-image becomes more saturated)
- Base: translateY(-2px) lift on cards, translateX(6px) on list items, scale(1.03) on active dots
