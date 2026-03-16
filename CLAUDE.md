# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

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

**hyvui** (`@hyvnt/hyvui`) is a Svelte 5 component library with a dark, operator-adjacent aesthetic. Published via `src/lib/index.ts` (~102 exports). `src/routes/` is a demo/docs site, not part of the published library.

### Three additive layers

1. **Base** — 42 components in `src/lib/components/` organized by group (primitives, inputs, feedback, layout, navigation, display, ambient, depth, patterns, scenes)
2. **Expressive** — Registers shift ambient mood; `Text` expressions carry semantic intent; four Svelte actions (`surface`, `echo`, `reveal`, `resolve`) compose onto any element
3. **Spatial** — CSS 3D depth system (`DepthStage`, `DepthLayer`, `FloatCard`, `HorizonGrid`, `Plinth`) in `src/lib/system/depth/`

### Token system

All tokens are CSS custom properties in `src/lib/tokens/tokens.css`. They are also available as:
- TypeScript constants via `import { tokens } from '$lib'`
- Tailwind v4 classes via the `@theme` block in `app.css` (e.g., `text-accent`, `bg-bg-elev`, `border-signal`)

**Never use raw hex colors or Tailwind's built-in color names.** Always reference tokens.

**Two-color palette only:** gold (`--accent: #c79c57`) = human/warm/action; teal (`--signal: #79a6a3`) = machine/cool/data. No other hues.

### Registers

Registers are applied to `<body>` or a root container via `data-register` attribute or `applyRegister()`:

| register | character | use for |
|---|---|---|
| `field-notebook` | warm, editorial, serif-forward | portfolios, narrative pages |
| `mission-control` | dense, mono-forward, precise | dashboards, tools |
| `archive` | cool, spacious, muted | galleries, indexes, catalogs |

No register declared = default styles.

### Patterns and scenes

Always check `src/lib/components/patterns/` before assembling a layout from primitives. Check `src/lib/components/scenes/` before building page layouts — scene templates encode layout conventions as starting postures.

## Anti-patterns

- No hardcoded hex colors. No Tailwind built-in color names (`text-blue-500`). Use token classes.
- No `border-radius` without intent — the default is no rounding.
- No new accent hues — only gold and teal exist.
- No heavy font weights for hierarchy — use size, tracking, and color instead.
- Do not assemble primitives manually when a `patterns/` component exists.
- Do not target component class names for overrides. The only sanctioned override surface is a copy of `src/lib/system/override-template.css` imported after `app.css`.

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
