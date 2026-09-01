# HyvUI library revamp brief

> Diagnostic catalog of inconsistencies in HyvUI 0.4.0 surfaced while consuming the library for the tx-v2 Discord bot dashboard. Every finding cites the file path and line where the evidence lives so a maintainer can verify without re-investigating. Meant to be handed to an agent working _inside this repo_ (the HyvUI source), one finding per PR.

## Context

HyvUI 0.4.0 is internally coherent in _philosophy_ — `SKILL.md` and `AESTHETICS.md` define a clear operator-adjacent design language with explicit anti-patterns. The library mostly follows its own rules (font-weight 400 is universal, gold/teal palette is enforced in base, dark-first is non-negotiable).

But the _implementation_ drifts from the philosophy in measurable ways. The consequence: an app built strictly to the design law (lowercase copy, no hex, no Tailwind builtins, etc.) still ends up visually inconsistent because the library itself ships dozens of distinct numeric values where a few tokens would do. The goal of this revamp is **Apple-tier consistency**: pick a small set of tokens, drive every component through them, eliminate magic numbers.

This is a refactor of the existing 0.4.0 surface area, not a rewrite. The component API contracts stay; their internals get normalized.

## Principles for the revamp

1. **One scale per axis.** Type, spacing, radius, shadow, transition — each is a finite ordered scale. Components pick a step on the scale; they do not invent values.
2. **Tokens cascade, components consume.** A component never hardcodes a numeric value where a `var(--…)` exists. If a token is missing, the fix is to add the token, not the magic number.
3. **Visual contract per primitive.** If `Surface` renders with `--radius-md`, it renders with `--radius-md` everywhere, regardless of register. Registers shift palette and weight, never structure.
4. **No raw color literals inside components.** All `rgba(…)` inside component CSS must come from tokens (`--text`, `--signal`, `--accent`, etc., or register-derived equivalents).
5. **Parity across input components.** Anything that's a form input (`Input`, `Textarea`, `Select`, `Toggle`, `Checkbox`, `FileUpload`) has the same prop shape for `label`, `description` / `hint`, `error`, `disabled`. The consumer should not need a wrapper to normalize them.

## Findings

### F1 — Font-size: 25+ distinct values, no scale

Evidence: `grep -rn "font-size" src/lib/components/` (or `dist/components/` in the published tarball) returns hits at `0.58rem`, `0.6rem`, `0.62rem`, `0.66rem`, `0.68rem`, `0.7rem`, `0.72rem`, `0.74rem`, `0.75rem`, `0.82rem`, `0.88rem`, `0.9rem`, `0.98rem`, `1.02rem`, `1.03rem`, `1.04rem`, `1.2rem`, `1.4rem`, plus several `clamp()` triples (`1.75-3.25`, `1.8-3.0`, `2.0-3.25`, `2.0-3.0`, `1.1-1.6`). The differences between several values (`1.02rem` vs `1.03rem`, `0.65rem` vs `0.66rem` vs `0.68rem`) are visually indistinguishable but exist as independent magic numbers.

**Concrete examples:**

- `Text.svelte` body = `1.03rem`; `Text.svelte` italic = `1.02rem` (same role, different size)
- `Input.svelte` label = `0.7rem`; error = `0.66rem`; `Select.svelte` label = `0.7rem`; error = `0.66rem`; `Textarea` same pattern — three sizes for "small mono text" within one form
- `MetricCard.svelte` label = `0.68rem` vs `Label.svelte` = `0.7rem` (same semantic role, two values)

**Proposed fix:** introduce a modular type scale in `tokens.css`:

```css
/* ratio ~1.2, base 1rem */
--text-2xs: 0.694rem; /* small mono labels — replaces 0.66, 0.68, 0.7 cluster */
--text-xs: 0.833rem; /* dense ui text — replaces 0.82, 0.88 */
--text-sm: 1rem; /* body baseline */
--text-md: 1.2rem; /* emphasized body, EmptyState/ErrorState title */
--text-lg: 1.44rem; /* ArchiveScene title */
--text-xl: 1.728rem;
--text-2xl: 2.074rem;
--text-3xl: clamp(2.074rem, 4vw, 3.25rem); /* page hero */
```

Then sweep every component CSS file replacing the magic number with the closest scale step. This is a mechanical refactor (~80 line edits across ~30 files).

### F2 — Padding: hardcoded numerics, spacing tokens ignored

Evidence: `grep -rnE "padding:\s*[0-9]" src/lib/components/` returns dozens of hits using `0.25rem`, `0.5rem`, `0.55rem`, `0.625rem`, `0.65rem`, `0.75rem`, `0.85rem`, `0.9rem`, `1rem`, `1.15rem`, `1.25rem`, `2rem`. The library defines `--space-2xs` through `--space-3xl` cleanly in `tokens.css:43-57` but almost no component uses them.

**Concrete examples:**

- `SidebarNav.svelte` — `padding: 0.55rem 0.9rem` (neither value is a token)
- `Tabs.svelte` — `padding: 0.65rem 0.85rem` (neither value is a token)
- `Button.svelte` — `padding: 0.75rem 1.15rem` for md, `0.5rem 0.8rem` for sm
- `DropdownMenu.svelte` — `padding: 0.75rem 0.85rem`
- `Toast.svelte` — `padding: 0.625rem 1rem`

**Proposed fix:** route every component padding through `var(--space-*)`. Where the existing magic number doesn't match a token, either snap to the nearest token or introduce a _new_ named token (`--space-control-y: 0.6rem` etc. for control-internal padding). No hardcoded numerics in component styles, full stop.

### F3 — Surface renders differently per register (silent structural drift)

Evidence: `src/lib/components/primitives/Surface.svelte`:

```css
:global([data-register="hextech"]) .hyvui-surface {
  border-radius: var(--radius-sm);
}
```

Under base + arcane: `--radius-md` (4px). Under hextech only: `--radius-sm` (2px). Same component, same prop, different geometry.

**Why this is wrong:** registers are supposed to shift _palette and weight_, never _structure_. A card stays a card; only its skin changes. If hextech genuinely wants tighter corners, that's a token bind: hextech sets `--radius-md: 2px` in its own tokens file, and Surface keeps using `--radius-md` blindly. The current approach embeds register-specific logic inside Surface, which means every new register has to be tested against every component.

**Proposed fix:** delete the `[data-register='hextech']` selector from `Surface.svelte`. If hextech wants sharper corners, override `--radius-md` inside `src/lib/tokens/hextech.css`. Same pattern for any future component that's been special-cased per register.

### F4 — Raw RGB literals inside components

Evidence: `src/lib/components/primitives/Surface.svelte`:

```css
background:
  linear-gradient(180deg, rgba(240, 232, 218, 0.04), transparent 20%),
  linear-gradient(90deg, rgba(121, 166, 163, 0.03), transparent 30%);
```

`240, 232, 218` is `--text` (#f0e8da). `121, 166, 163` is `--signal` (#79a6a3). Both should be `color-mix(in srgb, var(--text) 4%, transparent)` and the equivalent for `--signal`.

Same pattern: Surface has `rgba(255, 255, 255, 0.05)` (white literal — should be `color-mix(in srgb, var(--text) 5%, transparent)`); `rgba(121, 166, 163, 0.14)` (signal-as-rgb); `rgba(184, 115, 51, 0.2)` (brass-as-rgb, should use `--htx-brass`).

**Why this is wrong:** the library's own `SKILL.md` says "do not hardcode hex colors". Embedded RGB literals are the same violation in a different syntax. They also defeat the register override mechanism — a project setting `--text: #ffffff` (e.g. a future light-mode register) sees Surface still pulling `rgba(240, 232, 218, ...)`.

**Proposed fix:** replace every `rgba(<literal>, <alpha>)` inside component styles with `color-mix(in srgb, var(--token) <alpha*100>%, transparent)`. Compatibility: `color-mix` is supported in every modern browser since early 2023.

### F5 — Form input prop shape inconsistency

Evidence: API surface from `*.svelte.d.ts`:

| Component    | `label` | `description` / `hint` | `error` |
| ------------ | ------- | ---------------------- | ------- |
| `Input`      | yes     | `hint`                 | yes     |
| `Textarea`   | yes     | `hint`                 | yes     |
| `Select`     | yes     | **no**                 | yes     |
| `Toggle`     | yes     | **no**                 | **no**  |
| `Checkbox`   | yes     | **no**                 | **no**  |
| `FileUpload` | yes     | **no**                 | **no**  |

Consequence: in tx-v2 we built a `FormField.svelte` wrapper purely to give Select/Toggle/Checkbox the description+error treatment they lack. That wrapper shouldn't need to exist.

**Proposed fix:** add `description` (rename `hint` for clarity) and `error` to Select, Toggle, Checkbox, FileUpload. Standardize on `description` as the prop name; deprecate `hint` on Input/Textarea with a 0.5.0 cleanup.

### F6 — SidebarNav can't accept icons (or any rich content)

Evidence: `src/lib/components/navigation/SidebarNav.svelte` items typed as `{ label: string; href: string; active?: boolean }`. The render is a flat `{item.label}` text node, no slot. Most real-world sidebar nav has a leading icon per item — tx-v2's `GuildShell` had `lucide-svelte` icons in 0.3.0 usage and had to drop them when migrating to `SidebarNav` 0.4.0.

**Proposed fix:** add an `icon?: Snippet` field to NavItem, render it before the label with `gap: var(--space-xs)`. Backward compatible — items without icons render unchanged.

### F7 — `--radius-lg` is dead

Evidence: `src/lib/tokens/tokens.css` defines `--radius-lg: 6px`. `grep -rn "var(--radius-lg)" src/lib/components/` returns zero hits. The library has three radius tokens but only uses two.

**Proposed fix:** either use `--radius-lg` somewhere semantically (modal corners? drawer corners?) or remove it from the public token API. Carrying it as a no-op is misleading.

### F8 — `prefers-reduced-motion` is enforced per-component instead of centrally

Evidence: every animated component has its own `@media (prefers-reduced-motion: reduce)` block (`HexGrid.svelte`, `SidebarNav.svelte`, `FloatCard.svelte`, etc.). When a new animated component is added, the maintainer has to remember to add the block. There's no compile-time enforcement.

**Proposed fix:** define a single `--motion-allowed: 1` token at `:root` that flips to `0` under `prefers-reduced-motion: reduce`, then have every animated component multiply its animation-duration / transition-duration by `calc(<base> * var(--motion-allowed))`. With duration zero, animations become instant. A single source of truth.

(Alternative: a `:where(html:not([data-motion="off"]))` selector pattern. Same effect, different mechanism.)

### F9 — `Text` has two body sizes

Evidence: `src/lib/components/primitives/Text.svelte` — `.hyvui-text-body { font-size: 1.03rem }`; `.hyvui-text-italic { font-size: 1.02rem }`. Same semantic role (body prose), one in italic variant. The 0.01rem difference is invisible but exists as two independent values to maintain.

**Proposed fix:** unify on `--text-sm` (per F1's proposed scale). Italic variant inherits the size; only `font-style` changes.

### F10 — `Avatar` font-size is computed from `size` prop

Evidence: `src/lib/components/display/Avatar.svelte` — `style:font-size="{size * 0.38}px"`. Pixel arithmetic inside an SSR-rendered `style:` attribute couples typography to a single hardcoded ratio.

**Proposed fix:** if Avatar must scale its initials with `size`, use `font-size: calc(<size> * 0.38)` in CSS via a CSS custom property: `style:--avatar-size="{size}px"` and `font-size: calc(var(--avatar-size) * 0.38)`. Lets a consumer override the ratio per project if needed.

### F11 — Inconsistent sizing prop conventions

Evidence:

- `Button` accepts `size: 'sm' | 'md'`
- `StatusDot` accepts `size: number` (pixels)
- `Avatar` accepts `size: number` (pixels)
- `Input`, `Select`, `Textarea`, `Toggle`, `Checkbox` — no size prop at all
- `CornerBrackets` accepts `size: number` (pixels)
- `Skeleton` has `width` and `height` separately

**Proposed fix:** establish a single sizing convention. Recommendation: enum-of-tokens (`'xs' | 'sm' | 'md' | 'lg'`) for all UI controls, pixel `size` only for genuinely scale-free decorative primitives (Avatar, StatusDot, CornerBrackets). Add `size` to inputs (sm = current behavior, md = 1.1x, lg = 1.25x).

### F12 — Register family overload

Evidence: `SKILL.md` documents three "weight registers" (`field-notebook`, `mission-control`, `archive`) that shift density/font emphasis without changing colors. `src/lib/tokens/hextech.css` and `src/lib/tokens/arcane.css` introduce two "theme registers" that fully remap colors. Both families use the same `[data-register='…']` selector. Consequence: a consumer cannot have both `mission-control` (weight) and `hextech` (color) active on the same element. The README example `<AppShell register="mission-control">` plus a per-section `<div data-register="hextech">` mostly works because the inner shadow wins, but the weight register's typographic effects (`--reg-font-primary` etc.) silently revert inside hextech zones because hextech redefines those vars too.

**Proposed fix:** split into two attributes — `data-weight="mission-control"` and `data-theme="hextech"` — with separate CSS selectors. The two are then orthogonal. `AppShell` updates to accept both `weight` and `theme` props.

### F14 — Toggle emits a synthetic Event with null currentTarget

Evidence: `src/lib/components/inputs/Toggle.svelte`:

```ts
function toggle() {
  if (disabled) return;
  checked = !checked;
  onchange?.(new Event("change"));
}
```

A freshly-constructed `Event` object has `currentTarget: null` and `target: null` until it is dispatched via `EventTarget.dispatchEvent()`. Toggle never dispatches — it just hands the synthetic event to the consumer.

**Why this breaks real-world usage:** consumers commonly use `onchange` to walk up the DOM from the toggle, e.g. `e.currentTarget.closest('form').requestSubmit()` to drive a toggle-on-change form submit pattern. This silently fails because `currentTarget` is `null` — the toggle visually flips (internal `$bindable` mutates) but the consumer's side effect never runs.

Discovered while implementing the tx-v2 dashboard's feature-toggle page. The fix locally was to capture `bind:this` on the form, but the library should not force consumers to work around this.

**Proposed fix:** dispatch the event from a real DOM node:

```svelte
<button bind:this={buttonEl} onclick={toggle} ...>
```

```ts
function toggle() {
  if (disabled) return;
  checked = !checked;
  buttonEl?.dispatchEvent(new Event("change", { bubbles: true }));
}
```

Or even simpler — emit a `ChangeEvent`-like custom event with `target` and `currentTarget` populated. The receiver should be able to do everything an HTML form input's onchange handler can do.

Same audit should be applied to `Checkbox` — verify it doesn't have the same synthetic-event hazard.

### F13 — Documentation drift

Evidence:

- README claims "42 components" but actual `src/lib/components/**` count is higher
- `llms.txt` lists `Surface` as a primitive with prop `withInset`, but `Surface.svelte` has no `withInset` prop — it's the consumer (e.g. `Panel`) that passes `withInset` and Surface applies `hyvui-surface-inset` class via composition. Confusing.
- `SKILL.md` says "use `applyRegister`" but the recommended path is `<AppShell register="…">`. Both work, but two patterns are documented as if they're equivalent.

**Proposed fix:** doc sweep — sync README counts, clarify Surface vs Panel composition, designate one canonical API (AppShell + `data-register` attribute, deprecate top-level `applyRegister` for app boundaries).

## Suggested execution order

Fixing all of this is too big for one pass. Recommended sequence, biggest-impact-first:

1. **F1 + F2 (type scale + spacing scale)** — touches the most files but is mechanical. Land it as 0.5.0 with a "no API changes, internal-only refactor" changelog. After this, the library's visual consistency jumps dramatically.
2. **F4 (raw RGB literals)** — also mechanical; takes ~1 hour. Fixes the design-law violation the library itself warns against. Same release as F1+F2.
3. **F5 (form input prop parity)** — additive API change. Ship as 0.6.0. Consumers immediately delete their `FormField` wrappers.
4. **F6 (SidebarNav icons)** — also additive. Same 0.6.0 release.
5. **F8 (centralized reduced-motion)** — internal refactor, no API change. Same release window.
6. **F11 (sizing prop convention)** — breaking-ish (some `size: number` props become enums). Ship as 0.7.0 with a codemod or migration note.
7. **F12 (register family split)** — breaking change to attribute names. Ship as 1.0.0 with a deprecation window where both `data-register` and `data-weight`+`data-theme` work in parallel for a release.
8. **F3 (Surface register branching)** — fold into F12.
9. **F7, F9, F10, F13** — opportunistic cleanups, batch into 1.0.0 polish.

After 1.0.0 lands, consumers like tx-v2 can simplify: drop per-page font-size floors (F1 fixes them upstream), drop `FormField` wrappers (F5 obsoletes them), reintroduce icons in `SidebarNav` (F6).

## What this brief is NOT

- It is not a complete API audit. Components not consumed in tx-v2 (PullQuote, Manifesto, ChapterMark, ShowcaseFrame, RegisterSwitcher, TerminalBoot, depth/_ beyond FloatCard, scenes/_ beyond StageScene/ReadoutScene/ArchiveScene) have only had cursory inspection.
- It is not a visual-design critique. The palette, ambient motifs, and overall mood are excellent; that's not what's being questioned.
- It is not a request to add features. With one exception (F5/F6), every finding is about _removing_ drift, not _adding_ surface.

## How to use this brief

Hand this file to an agent inside the HyvUI repo with this prompt template:

> "You are working in the HyvUI source repo. Read REVAMP-BRIEF.md fully. Pick one finding (start with F1 or F2 — they're the highest impact, lowest API risk). Investigate the relevant files in `src/lib/components/**`. Propose the refactor with a concrete file diff and a verification step. Do not touch other findings in the same PR. The goal is incremental, auditable consistency wins, not a big-bang rewrite."

Each finding has enough context to stand alone. F1 and F2 are independent and can ship in either order.
