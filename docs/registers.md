## Register System

---

## Concept

a register is a named design weight preset that shifts the visual character of the entire page or a scoped section. registers adjust typographic scale, font selection, spacing, surface opacity, and accent weight. they do not change colors, component behavior, or layout.

think of registers as moods rather than themes: the same component looks subtly different in `field-notebook` (warm, editorial, serif-heavy) versus `mission-control` (dense, mono-forward, precise) versus `archive` (cool, spacious, muted).

registers operate through CSS custom properties (`--reg-*` variables) that components read internally. you do not need to modify any component code to use a register.

---

## Available Registers

| name              | character                      | primary font      | use for                                                                   |
| ----------------- | ------------------------------ | ----------------- | ------------------------------------------------------------------------- |
| `field-notebook`  | warm, editorial, serif-forward | ET Book           | portfolios, articles, field journals, personal projects                   |
| `mission-control` | dense, precise, mono-forward   | IBM Plex Mono     | dashboards, admin panels, data-heavy applications, operational interfaces |
| `archive`         | cool, spacious, muted          | ET Book (lighter) | galleries, collections, reference documentation, archival interfaces      |

---

## Applying a Register

### Method 1 — Svelte Body Attribute (recommended for whole-page)

```svelte
<!-- in +layout.svelte or any page component -->
<svelte:body data-register="field-notebook" />
```

### Method 2 — JavaScript (programmatic or dynamic)

```svelte
<script lang="ts">
	import { applyRegister, clearRegister } from '$lib';
	import type { Register } from '$lib';

	// apply on mount
	applyRegister('mission-control');

	// switch registers dynamically
	function switchRegister(r: Register) {
		applyRegister(r);
	}

	// return to defaults
	clearRegister();
</script>
```

### Method 3 — Scoped to a Section

registers can be applied to any element, not just `body`. the register variables cascade to all descendants:

```svelte
<!-- page uses field-notebook globally -->
<svelte:body data-register="field-notebook" />

<!-- but this section uses archive -->
<section data-register="archive">
	<ArchiveScene title="reference documents">
		<!-- content here renders with archive register variables -->
	</ArchiveScene>
</section>
```

scoped registers compose correctly — children of a scoped element see that register's variables, not the page-level register.

---

## Register Variable Reference

all `--reg-*` variables are defined in `src/lib/system/register.css`. the `:root` defaults are the "no register" fallbacks.

| variable                    | `:root` default | `field-notebook` | `mission-control` | `archive` |
| --------------------------- | --------------- | ---------------- | ----------------- | --------- |
| `--reg-font-heading`        | ET Book         | ET Book          | IBM Plex Mono     | ET Book   |
| `--reg-font-body`           | ET Book         | ET Book          | ET Book           | ET Book   |
| `--reg-heading-tracking`    | `-0.02em`       | `-0.03em`        | `0.05em`          | `0em`     |
| `--reg-heading-line-height` | `1.1`           | `1.05`           | `1.2`             | `1.15`    |
| `--reg-body-size`           | `1.1rem`        | `1.15rem`        | `0.95rem`         | `1rem`    |
| `--reg-label-size`          | `0.72rem`       | `0.72rem`        | `0.7rem`          | `0.68rem` |
| `--reg-label-tracking`      | `0.12em`        | `0.1em`          | `0.18em`          | `0.14em`  |
| `--reg-surface-opacity`     | `1`             | `0.95`           | `1`               | `0.9`     |
| `--reg-ornament-opacity`    | `0.6`           | `0.7`            | `0.4`             | `0.5`     |
| `--reg-accent-weight`       | `normal`        | `normal`         | `600`             | `normal`  |
| `--reg-signal-weight`       | `normal`        | `normal`         | `500`             | `normal`  |
| `--reg-space-scale`         | `1`             | `1.05`           | `0.9`             | `1.1`     |

---

## Combining Registers with the Override Layer

the project override layer (`src/theme.css`) takes the highest precedence:

```
tokens.css (base) → register.css (register shift) → theme.css (project override)
```

if your `theme.css` sets `--reg-body-size: 1.2rem`, that value will apply regardless of which register is active. use this when you need a consistent project-wide value that ignores register shifts.

if you want register-relative overrides, set the `--reg-*` variables directly inside the register `[data-register="..."]` selector in `theme.css`:

```css
/* theme.css */
[data-register='mission-control'] {
	--reg-body-size: 0.875rem; /* tighter than default mission-control */
}
```

---

## Register Comparison

the same `Card` component containing a heading, body text, and an accent label renders noticeably differently across registers:

**field-notebook**
The heading uses ET Book with tight tracking and slightly larger body text. the surface has a warm, paper-like quality. labels feel handwritten and organic. the overall impression is editorial — like a formatted journal entry.

**mission-control**
The heading switches to IBM Plex Mono — uppercase, tracked wide. body text is slightly smaller and tighter. ornaments are more subdued. the surface reads clinical and precise — like a control panel or dashboard readout.

**archive**
The heading uses ET Book at looser tracking with more breathing room. surface opacity is reduced, making the background gradient more visible. labels are smallest and most muted. the overall impression is cool, ordered, and reference-like — like a museum catalog card.

---

→ next: [docs/expressions.md](expressions.md) — typographic expression reference
