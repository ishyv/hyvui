# hyvui — AI agent orientation

## what this is

hyvui is a Svelte 5 component library with a dark, operator-adjacent aesthetic. Visual decisions derive from a set of design constraints (not from taste). The token layer is generated CSS custom properties with typed component props.

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
- **Optional presets** — import `@hyvnt/hyvui/themes.css` for material themes and `@hyvnt/hyvui/fonts.css` for self-hosted type. Neither is loaded implicitly.

Never use raw hex colors or framework palette names in component code. Always go through the token layer.

## fonts

Two typefaces are supported by the optional self-hosted preset:

- **ET Book** (serif) — self-hosted. Used for all body text and headings. Get it from [edwardtufte/et-book](https://github.com/edwardtufte/et-book).
- **IBM Plex Mono** — self-hosted regular, medium, and semibold. Used for all labels, metadata, UI strings.

If the preset is omitted, the generated fallback stacks remain usable offline. The base stylesheet never injects a network font request.

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
- **do not** use framework color utilities as the consumer contract. use semantic CSS variables (`var(--accent)`).
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

`patterns/` has pre-wired compositions. Check them after naming the visual idea, not as a substitute for composition:

- `PageHeader` — title + subtitle + breadcrumb + actions layout
- `ConfirmDialog` — modal with confirm/cancel. title names the action, never asks "are you sure?"
- `SearchBar` — input with optional loading indicator and filter trigger
- `ActionBar` — bulk selection bar, appears when items are selected
- `TerminalBoot` — orchestrated StatusLine sequence with stagger timing

---

## phase 2: expressiveness layer

### next: composition before component assembly

HyvUI Next is an additive, agent-native research surface. Start with the visual idea and its
relationships before choosing a scene template or a card grid. The proof routes use `Composition`
and `CompositionNode` when a page needs explicit focal points, counterweights, fields, connectors,
interruptions, frames, echoes, or overlaps.

These proof modules are private. Do not import them from `@hyvnt/hyvui`; use the `/next-lab` routes and
`docs/next.md` while the public API boundary remains under review.

The private research contract is intentionally small:

- `ArtDirection` holds the seed, mood/material context, density, rhythm, motion, and adaptation policy;
- `CompositionNodeSpec` describes a participant, its visual role, capabilities, and explicit constraints;
- `CompositionRelation` names a relationship between node IDs and describes its behavior and fallback;
- `getAgentManifest()` is the only package-facing discovery helper for the research surface.

For an art-directed piece, `ArtDirection.authority: 'strong'` opts into the local art director. Pair it
with one gesture such as `altarpiece`, `fracture`, `procession`, `reliquary`, `installation`, or
`weather-system`, then state the `thesis`, `focal`, `motif`, `palette`, `typography`, `depth`, and
`interaction` behavior. Strong authority may recompose visual planes and add semantic-free atmosphere
only in `apply` mode. It cannot remove required content, change DOM semantic order, or override
explicit manual placement.

Use `adaptation: 'suggest'` while developing or evaluating. `disabled` preserves authored layout.
`apply` is bounded and still yields to explicit manual placement. Strong art direction is local to its
composition field. `suggest` exposes the art plan without applying poses or atmosphere. The runtime
does not run a global observer and does not silently reorder content.

```text
choose a focal point
choose the field or counterweight around it
name the relationship that gives the piece identity
choose the smallest material that can express it
add a fallback for narrow screens
inspect the result before enabling application
```

Use the agent manifest for possibilities, not only props:

```ts
import { getAgentManifest } from "@hyvnt/hyvui";
```

Do not repeat the same scene wrapper for every page, turn every participant into a card, or add
random offsets without a visual reason. A gesture must have one governing thesis. See `docs/next.md`
for the full vocabulary and the research/prototype evidence.

### biome grammar

HyvUI Next describes twelve host biomes rather than one universal art style:

`operational-apparatus`, `manifesto-print`, `deconstructed-editorial`,
`quiet-object-gallery`, `ceremonial-reliquary`, `ecological-elegy`,
`oneiric-object-poetry`, `machine-ecology`, `celestial-cartography`,
`post-digital-morphology`, `kinetic-rupture`, and `noise-commons`.

Choose one host before choosing grafts. A biome carries spatial law, attention economy, density,
material, light, typography, information mode, time model, viewer role, interaction verbs, frame
modes, passage modes, compatible channels, anti-patterns, and responsive behavior. Add no more than
two named grafts. Each graft must name its channel and bridge or conflict. Destructive combinations
are rejected rather than averaged.

Use the public layout `Frame` when the piece is a held tableau or discrete scene. The `Passage` proof
remains private to the research routes and is used only when scrolling expresses procession,
absorption, excavation, accumulation, or traversal. These prototypes use ordinary semantic HTML.
Native hash links, keyboard focus, touch scrolling, reduced-motion fallbacks, and a static passage mode
are required. Never trap the wheel or build a page-wide observer.

The machine-readable discovery surface is `getAgentManifest().biomes`; the read-only CLI examples are
`npm run inspect:next -- --manifest` and `npm run inspect:next -- --file schemas/examples/biome-composition.json`.

### registers

A register shifts the _weight distribution_ of the design — which typeface leads, how present ornaments are, how heavy surfaces feel. Apply to `<body>` or any root container:

```svelte
<svelte:body data-weight="field-notebook" />
```

| register          | character                      | use for                      |
| ----------------- | ------------------------------ | ---------------------------- |
| `field-notebook`  | warm, editorial, serif-forward | portfolios, narrative pages  |
| `mission-control` | dense, mono-forward, precise   | dashboards, tools            |
| `archive`         | cool, spacious, muted          | galleries, indexes, catalogs |

No register declared = Phase 1 defaults. Registers are non-breaking.

Import utilities: `import { applyWeight, clearWeight } from '$lib'`

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

Scene templates encode the layout conventions from AESTHETICS.md as starting postures. Use one when its structure is the visual idea; otherwise compose from materials and relationships.

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
