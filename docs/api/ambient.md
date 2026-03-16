## Ambient

Decorative and atmospheric components. they add visual texture without conveying content. all ambient components have `aria-hidden="true"` and respect `prefers-reduced-motion`.

do not rely on ambient components to communicate meaning — they are supplementary to layout and content, not substitutes.

---

## GridOverlay

> a full-bleed background grid using 72px crossing lines with an edge fade. creates the field notebook or mission control grid atmosphere.

### Import

```svelte
<script lang="ts">
	import { GridOverlay } from '$lib';
</script>
```

### Props

| prop    | type     | default | required | description            |
| ------- | -------- | ------- | -------- | ---------------------- |
| `class` | `string` | `''`    | no       | additional CSS classes |

### Positioning

GridOverlay is `position: absolute; inset: 0`. the parent must have `position: relative` (or any non-static position) for the grid to fill it correctly.

### Examples

```svelte
<!-- full-section grid background -->
<section style="position: relative; min-height: 100vh;">
	<GridOverlay />
	<div style="position: relative; z-index: 1;">
		<Text as="h1" variant="heading">field station</Text>
	</div>
</section>

<!-- inside a StageScene's ambient slot -->
<StageScene>
	{#snippet ambient()}
		<GridOverlay />
		<Vignette />
	{/snippet}

	{#snippet heading()}
		<Text as="h1" variant="heading" expression="title-card">coordinates</Text>
	{/snippet}
</StageScene>
```

---

## CornerBrackets

> four `L`-shaped brackets at the corners of the parent element. a reticle framing device.

### Import

```svelte
<script lang="ts">
	import { CornerBrackets } from '$lib';
</script>
```

### Props

| prop    | type     | default                | required | description                          |
| ------- | -------- | ---------------------- | -------- | ------------------------------------ |
| `size`  | `number` | `32`                   | no       | arm length of each bracket in pixels |
| `color` | `string` | `'var(--line-strong)'` | no       | bracket color (any CSS color value)  |
| `class` | `string` | `''`                   | no       | additional CSS classes               |

### Positioning

CornerBrackets is `position: absolute; inset: 0; pointer-events: none`. the parent must have `position: relative`.

### Examples

```svelte
<!-- framing a card -->
<div style="position: relative; padding: 2rem;">
	<CornerBrackets />
	<Text as="h2" variant="heading">coordinates locked</Text>
</div>

<!-- accent-colored brackets for emphasis -->
<div style="position: relative; padding: 1.5rem;">
	<CornerBrackets color="var(--accent)" size={24} />
	<StatusDot status="ok" />
	<Text variant="caption">signal acquired</Text>
</div>
```

---

## ScanBand

> an animated gradient band that sweeps across the element along the x or y axis. radar or scanner effect.

### Import

```svelte
<script lang="ts">
	import { ScanBand } from '$lib';
</script>
```

### Props

| prop       | type         | default     | required | description                                       |
| ---------- | ------------ | ----------- | -------- | ------------------------------------------------- |
| `active`   | `boolean`    | `true`      | no       | toggles the animation on/off                      |
| `axis`     | `'x' \| 'y'` | `'x'`       | no       | sweep direction                                   |
| `size`     | `string`     | `undefined` | no       | CSS width (x-axis) or height (y-axis) of the band |
| `duration` | `string`     | `undefined` | no       | animation duration (e.g. `'4s'`, `'8s'`)          |
| `gradient` | `string`     | `undefined` | no       | custom CSS gradient for the band                  |
| `class`    | `string`     | `''`        | no       | additional CSS classes                            |

### Positioning

`position: absolute; inset: 0; pointer-events: none`. parent must have `position: relative` and `overflow: hidden`.

### Examples

```svelte
<!-- horizontal scan on a panel -->
<div style="position: relative; overflow: hidden;">
	<ScanBand axis="x" duration="6s" />
	<Panel>
		<Text as="h2" variant="heading">scanner active</Text>
	</Panel>
</div>

<!-- vertical scan, paused -->
<div style="position: relative; overflow: hidden;">
	<ScanBand axis="y" active={isScanning} />
</div>
```

---

## Vignette

> fixed-position radial darkening at the edges of the viewport. adds cinematic depth to full-page layouts.

### Import

```svelte
<script lang="ts">
	import { Vignette } from '$lib';
</script>
```

### Props

| prop    | type     | default | required | description            |
| ------- | -------- | ------- | -------- | ---------------------- |
| `class` | `string` | `''`    | no       | additional CSS classes |

### Positioning

`position: fixed; inset: 0; pointer-events: none; z-index: 0`. place it early in the document so content layers above it. it does not scroll with the page.

### Examples

```svelte
<!-- in a page layout, before the main content -->
<Vignette />
<main>
	<StageScene>...</StageScene>
</main>
```

---

## ParallaxLayer

> a container that moves in response to mouse position, creating a floating parallax effect. requires `--px` and `--py` CSS custom properties on a parent element.

### Import

```svelte
<script lang="ts">
	import { ParallaxLayer } from '$lib';
</script>
```

### Props

| prop       | type     | default | required | description                                                    |
| ---------- | -------- | ------- | -------- | -------------------------------------------------------------- |
| `strength` | `number` | `18`    | no       | parallax movement multiplier in pixels. higher = more movement |
| `class`    | `string` | `''`    | no       | additional CSS classes                                         |

### Slots

| slot      | description                       |
| --------- | --------------------------------- |
| `default` | content to move with the parallax |

### Critical: The `--px` / `--py` Requirement

**ParallaxLayer is non-functional without a parent that sets `--px` and `--py` CSS custom properties.**

these properties are normalized pointer coordinates (0–1) within the container. you must add a `pointermove` handler to the wrapping element that sets them:

```svelte
<script lang="ts">
	let container: HTMLElement;

	function handlePointerMove(e: PointerEvent) {
		const rect = container.getBoundingClientRect();
		const px = (e.clientX - rect.left) / rect.width;
		const py = (e.clientY - rect.top) / rect.height;
		container.style.setProperty('--px', px.toString());
		container.style.setProperty('--py', py.toString());
	}
</script>

<div bind:this={container} onpointermove={handlePointerMove} style="position: relative;">
	<ParallaxLayer strength={20}>
		<GridOverlay />
	</ParallaxLayer>

	<ParallaxLayer strength={10}>
		<CornerBrackets />
	</ParallaxLayer>
</div>
```

### Layering Multiple ParallaxLayers

different `strength` values on different layers create depth. higher strength moves more, appearing "closer." lower strength moves less, appearing "further away":

```svelte
<ParallaxLayer strength={30}><!-- foreground --></ParallaxLayer>
<ParallaxLayer strength={15}><!-- midground --></ParallaxLayer>
<ParallaxLayer strength={5}><!-- background --></ParallaxLayer>
```

### Reduced Motion

when `prefers-reduced-motion: reduce` is set, the transition on ParallaxLayer is removed — the element still responds to pointer position but without animation.

### Do Not Use When

- the container scrolls — parallax on scroll requires a different implementation
- the content inside ParallaxLayer is interactive — the movement can cause fitts's law issues with small targets

### Examples

```svelte
<!-- full parallax hero section -->
<script lang="ts">
	let hero: HTMLElement;

	function onPointerMove(e: PointerEvent) {
		const r = hero.getBoundingClientRect();
		hero.style.setProperty('--px', ((e.clientX - r.left) / r.width).toString());
		hero.style.setProperty('--py', ((e.clientY - r.top) / r.height).toString());
	}
</script>

<section
	bind:this={hero}
	onpointermove={onPointerMove}
	style="position: relative; min-height: 100vh; overflow: hidden;"
>
	<ParallaxLayer strength={8}>
		<GridOverlay />
	</ParallaxLayer>

	<ParallaxLayer strength={20}>
		<CornerBrackets size={48} />
	</ParallaxLayer>

	<div style="position: relative; z-index: 10; padding: var(--space-scene);">
		<Text as="h1" variant="heading" expression="title-card">field station</Text>
	</div>
</section>
```

---

## SignalRing

> concentric pulsing circles, like a sonar or radar ping. indicates active broadcast, live connectivity, or presence.

### Import

```svelte
<script lang="ts">
	import { SignalRing } from '$lib';
</script>
```

### Props

| prop     | type      | default           | required | description                          |
| -------- | --------- | ----------------- | -------- | ------------------------------------ |
| `active` | `boolean` | `true`            | no       | enables the pulse animation          |
| `size`   | `number`  | `200`             | no       | outer diameter of the ring in pixels |
| `color`  | `string`  | `'var(--signal)'` | no       | ring color                           |
| `class`  | `string`  | `''`              | no       | additional CSS classes               |

### Examples

```svelte
<!-- active signal indicator -->
<SignalRing active={isConnected} />

<!-- accent-colored, larger ring -->
<SignalRing size={300} color="var(--accent)" />

<!-- paused when disconnected -->
<SignalRing active={connectionStatus === 'ok'} />
```

---

## GlyphMark

> a small SVG glyph from the hyvnt-ui ornament set. used as abstract markers, dividers, and decorative accents.

### Import

```svelte
<script lang="ts">
	import { GlyphMark } from '$lib';
</script>
```

### Props

| prop      | type                                        | default                | required | description            |
| --------- | ------------------------------------------- | ---------------------- | -------- | ---------------------- |
| `variant` | `'cross' \| 'reticle' \| 'coord' \| 'mark'` | `'cross'`              | no       | glyph shape            |
| `size`    | `number`                                    | `16`                   | no       | glyph size in pixels   |
| `color`   | `string`                                    | `'var(--line-strong)'` | no       | glyph color            |
| `class`   | `string`                                    | `''`                   | no       | additional CSS classes |

### Variants

**cross**
A simple `+` or `×` mark. use as a general-purpose position marker or section ornament.

**reticle**
A circle with cross-hairs. use to indicate a target, focal point, or coordinate.

**coord**
A bracket-and-dot coordinate notation mark. use in map-adjacent layouts or coordinate displays.

**mark**
A diamond or chevron mark. use as a section separator or list marker.

### Examples

```svelte
<!-- as a section ornament -->
<GlyphMark variant="reticle" size={24} color="var(--accent)" />
<Text as="h2" variant="heading">coordinates</Text>

<!-- as a decorative divider element -->
<Stack direction="horizontal" align="center" gap="var(--space-sm)">
	<Divider />
	<GlyphMark variant="mark" />
	<Divider />
</Stack>
```

---

## DataStream

> a column of scrolling monospace characters — a data/signal stream visual effect.

### Import

```svelte
<script lang="ts">
	import { DataStream } from '$lib';
</script>
```

### Notes

DataStream is a purely decorative visual element with no user-facing content. use it as a background texture in data-heavy layouts or terminal-themed sections. characters are randomized and not meaningful.

### Do Not Use When

- you need to display actual data — use `Table` or `CodeBlock`
- the page has high information density — the animation will compete with content

---

## ThreadLine

> an SVG line with an animated dot that travels along it. represents a connection, sequence, or data path.

### Import

```svelte
<script lang="ts">
	import { ThreadLine } from '$lib';
</script>
```

### Notes

ThreadLine renders an SVG path between two points with an animated circle that traverses the line. dimensions and endpoints are configured via props. see the source file for the full prop API. the animation respects `prefers-reduced-motion`.

---

→ next: [docs/api/depth-components.md](depth-components.md) — depth system component API reference
