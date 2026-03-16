# hyvui — AI agent orientation

## what this is

hyvui is a Svelte 5 component library with a dark, operator-adjacent aesthetic. Visual decisions derive from a set of design constraints (not from taste). The token layer is CSS custom properties, exposed to Tailwind v4 via `@theme`.

## importing components

```svelte
<script lang="ts">
	import { Button, Card, StatusDot } from '$lib';
</script>
```

All components and the `tokens` object are exported from `$lib` (the barrel at `src/lib/index.ts`).

## token system

Tokens live in two places:

- **CSS custom properties** — `src/lib/tokens/tokens.css`, imported by `app.css`. Use `var(--accent)` etc.
- **TypeScript constants** — `import { tokens } from '$lib'` for canvas/animation/script use.
- **Tailwind classes** — token colors are available as `text-accent`, `bg-bg-elev`, `border-signal`, etc. via the `@theme` block in `app.css`.

Never use raw hex colors or Tailwind's built-in palette names. Always go through the token layer.

## fonts

Two typefaces. Both must be loaded by the consuming application:

- **ET Book** (serif) — self-hosted. Used for all body text and headings. Get it from [edwardtufte/et-book](https://github.com/edwardtufte/et-book).
- **IBM Plex Mono** — from Google Fonts or self-hosted. Used for all labels, metadata, UI strings.

Weight is almost always 400. Hierarchy comes from size, tracking, and color — not weight.

## feedback component decision tree

```
temporary, non-blocking notification?        → Toast
persistent inline system message?            → Alert
content loading, shape not yet known?        → Skeleton
system is alive / idle / processing?         → StatusDot
multi-line terminal-style status sequence?   → StatusLine
zero data, no error?                         → EmptyState
request failed or signal lost?               → ErrorState
```

## component group map

| group      | covers                                                       |
| ---------- | ------------------------------------------------------------ |
| primitives | text rendering, labels, icons, dividers, surface containers  |
| inputs     | buttons, text fields, selects, checkboxes, toggles, uploads  |
| feedback   | status indicators, toasts, alerts, skeletons, empty/error    |
| layout     | stacks, grids, cards, panels, modals, drawers, popovers      |
| navigation | top bars, sidebars, tabs, breadcrumbs, dropdown menus        |
| display    | badges, avatars, tables, code blocks, metrics, blockquotes   |
| ambient    | decorative overlays — grids, brackets, scan bands, vignettes |
| patterns   | pre-wired compositions — page headers, confirm dialogs, etc. |

## anti-patterns

- **do not** hardcode hex colors. every color must reference a CSS custom property.
- **do not** use Tailwind's built-in color names (`text-blue-500`). use token classes (`text-accent`).
- **do not** add `border-radius` without checking the aesthetics guide. the default is no rounding.
- **do not** introduce new accent hues. only gold (`--accent`) and teal (`--signal`) exist.
- **do not** use heavy font weights for hierarchy. use size, tracking, and color instead.
- **do not** assemble primitives manually when a `patterns/` component already exists for that layout.

## copy voice rules

- lowercase for all UI strings, labels, and metadata
- short sentences. fragments are fine.
- no em-dashes
- error states describe the condition, not the cause — "signal interrupted", not "server returned 500"
- never use title case in labels or buttons
- never say "error" or "warning" as a title

## ambient / ornamental components

`GridOverlay`, `CornerBrackets`, `ScanBand`, `Vignette`, `ParallaxLayer` — decorative, non-interactive, semantically invisible. All render with `aria-hidden="true"`.

Use them to:

- add atmospheric depth to sections (`GridOverlay`, `Vignette`)
- frame important containers (`CornerBrackets`)
- signal active system state (`ScanBand`)
- add subtle pointer-following motion (`ParallaxLayer`)

Parent elements must have `position: relative` for absolute-positioned ambient layers.

## patterns

`patterns/` has pre-wired compositions. Always check if a pattern exists before building a similar layout from primitives:

- `PageHeader` — title + subtitle + breadcrumb + actions layout
- `ConfirmDialog` — modal with confirm/cancel. title names the action, never asks "are you sure?"
- `SearchBar` — input with optional loading indicator and filter trigger
- `ActionBar` — bulk selection bar, appears when items are selected
- `TerminalBoot` — orchestrated StatusLine sequence with stagger timing

---

## phase 2: expressiveness layer

### registers

A register shifts the _weight distribution_ of the design — which typeface leads, how present ornaments are, how heavy surfaces feel. Apply to `<body>` or any root container:

```svelte
<svelte:body data-register="field-notebook" />
```

| register          | character                      | use for                      |
| ----------------- | ------------------------------ | ---------------------------- |
| `field-notebook`  | warm, editorial, serif-forward | portfolios, narrative pages  |
| `mission-control` | dense, mono-forward, precise   | dashboards, tools            |
| `archive`         | cool, spacious, muted          | galleries, indexes, catalogs |

No register declared = Phase 1 defaults. Registers are non-breaking.

Import utilities: `import { applyRegister, clearRegister } from '$lib'`

### typographic expressions

Add `expression` prop to `Text` to declare compositional intent:

| expression   | feel                        | use for                               |
| ------------ | --------------------------- | ------------------------------------- |
| `title-card` | very large, compressed      | scene-opening headers                 |
| `manifesto`  | italic, oblique, calm       | philosophical statements, pull-quotes |
| `readout`    | mono, subdued               | data output, status text              |
| `whisper`    | small, muted, italic        | supporting notes, parenthetical       |
| `command`    | mono, uppercase, gold       | CTAs, action labels                   |
| `chapter`    | mono, uppercase, line after | section openers, scene numbers        |

```svelte
<Text variant="heading" expression="title-card" as="h1">deep signal</Text>
```

Expressions and variants are orthogonal — setting an expression doesn't remove the variant.

### svelte actions

Four composable behaviors. Apply to any element with `use:`:

| action                              | does                         | use when                           |
| ----------------------------------- | ---------------------------- | ---------------------------------- |
| `use:surface`                       | entrance animation on mount  | any element that appears           |
| `use:echo`                          | gold pulse on click          | confirms, form submits             |
| `use:reveal={{ target: '.class' }}` | reveals child on hover       | hidden metadata, secondary actions |
| `use:resolve={fn}`                  | status flash on state change | form outcomes, fetch results       |

```svelte
<script>
	import { surface, echo, reveal, resolve } from '$lib';
	let resolveAction;
</script>

<div use:surface={{ delay: 100 }} use:reveal={{ target: '.meta' }}>
	<span>main content</span>
	<span class="meta">shown on hover</span>
</div>
<button use:echo onclick={handleSubmit}>submit</button>
<form use:resolve={(a) => (resolveAction = a)}>...</form>
```

### scene templates

Scene templates encode the layout conventions from AESTHETICS.md as starting postures. Use them before building page layouts from primitives.

| scene            | character                 | use for                       |
| ---------------- | ------------------------- | ----------------------------- |
| `NarrativeScene` | asymmetric, serif-forward | about, portfolio, story       |
| `ReadoutScene`   | dense, mono-forward       | dashboards, data, logs        |
| `StageScene`     | centered, theatrical      | hero, landing, feature reveal |
| `ArchiveScene`   | uniform grid, cold        | galleries, indexes, catalogs  |
| `LogScene`       | terminal, full-width      | process, boot, system output  |

```svelte
<StageScene>
	{#snippet label()}<Label>v2.0 — released</Label>{/snippet}
	{#snippet heading()}<Text expression="title-card">signal acquired</Text>{/snippet}
	{#snippet actions()}<Button variant="primary">enter</Button>{/snippet}
</StageScene>
```

### project override layer

Copy `src/lib/system/override-template.css` into your project as `theme.css`. Import it after `app.css`. Uncomment and adjust `--reg-*` properties.

This is the only sanctioned override surface. Do not target component class names. Do not change color values in this file — palette lives in tokens.css.

---

## depth system

hyvui includes a CSS 3D depth system for layered spatial interfaces.

### tokens

| token                | value                                  | role                 |
| -------------------- | -------------------------------------- | -------------------- |
| `--perspective-near` | `600px`                                | tight, dramatic      |
| `--perspective-mid`  | `1200px`                               | balanced default     |
| `--perspective-far`  | `2400px`                               | subtle, editorial    |
| `--depth-ground`     | `0px`                                  | base plane           |
| `--depth-raised`     | `24px`                                 | elevated content     |
| `--depth-foreground` | `48px`                                 | closest to viewer    |
| `--tilt-max`         | `8deg`                                 | pointer-tilt ceiling |
| `--tilt-transition`  | `0.35s cubic-bezier(0.33, 1, 0.68, 1)` | smooth return        |

All 3D transforms are disabled when `prefers-reduced-motion: reduce`.

### components

| component     | does                                                            | use when                             |
| ------------- | --------------------------------------------------------------- | ------------------------------------ |
| `DepthStage`  | establishes `perspective` + `preserve-3d` context               | wrapping any 3D scene                |
| `DepthLayer`  | places children at a z-level (`ground`, `raised`, `foreground`) | separating content into depth planes |
| `FloatCard`   | self-contained card with pointer-driven tilt                    | cards that need physicality          |
| `HorizonGrid` | canvas-drawn receding grid with gold→teal gradient              | backgrounds, spatial grounding       |
| `Plinth`      | near-invisible receding surface under content                   | anchoring floating elements          |

```svelte
<DepthStage perspective="mid">
	<DepthLayer level="ground">
		<HorizonGrid rows={14} cols={8} vanishY={0.35} />
	</DepthLayer>
	<DepthLayer level="raised">
		<FloatCard tiltMax={6}>
			<Text variant="heading">elevated content</Text>
		</FloatCard>
		<Plinth width="80%" depth="20px" />
	</DepthLayer>
</DepthStage>
```

### ornament components

| component    | does                                                  | use when                           |
| ------------ | ----------------------------------------------------- | ---------------------------------- |
| `SignalRing` | pulsing sonar rings expanding from center             | empty states, loading, atmosphere  |
| `GlyphMark`  | small SVG glyph (`cross`, `reticle`, `coord`, `mark`) | decorative markers, waypoints      |
| `DataStream` | scrolling monospace character column                  | ambient data feel, dashboard edges |
| `ThreadLine` | SVG line with animated traveling dot                  | connecting related elements        |

All ornaments are `aria-hidden` and respect reduced motion.
