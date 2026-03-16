## Depth System

---

## Concept

the depth system adds CSS 3D perspective to layouts. it is not WebGL, not canvas rendering, not actual 3D modeling. it uses CSS `perspective`, `transform-style: preserve-3d`, and `translateZ` to create the visual impression that content exists at different distances from the viewer.

what it adds:

- layered z-depth between elements in the same layout
- a 3D tilt response to pointer movement (via `FloatCard`)
- a vanishing-point grid background (via `HorizonGrid`)
- parallax-like depth when combined with `ParallaxLayer`

what it doesn't do:

- it won't create complex 3D geometry or camera movement
- it won't work inside scrollable overflow containers
- it won't compose with other `perspective` contexts without breaking

---

## Z-Levels

the depth system defines three named z-levels. components use CSS custom properties to position themselves:

| level        | CSS variable              | visual position                                | use for                                                 |
| ------------ | ------------------------- | ---------------------------------------------- | ------------------------------------------------------- |
| `ground`     | `var(--depth-ground)`     | base plane — 0 or slightly negative translateZ | background elements: grids, decorative layers, textures |
| `raised`     | `var(--depth-raised)`     | primary content plane — ~20–40px forward       | main UI: cards, data, primary layout                    |
| `foreground` | `var(--depth-foreground)` | prominent plane — ~60–100px forward            | featured elements, hero text, focal content             |

the exact pixel values are defined in `src/lib/system/depth/depth.css`.

---

## Perspective Presets

`DepthStage` accepts three perspective presets that control how dramatic the 3D effect appears:

| preset | effect                                                                            | use for                                                                                 |
| ------ | --------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------- |
| `near` | close perspective — strong 3D distortion, elements appear to advance dramatically | hero sections, dramatic single-focus moments                                            |
| `mid`  | moderate perspective — balanced depth without strong distortion                   | dashboards, card grids, most general-purpose depth layouts                              |
| `far`  | distant perspective — very subtle depth, nearly flat                              | backgrounds, very large layouts, contexts where strong distortion would be disorienting |

---

## Component Reference

see [docs/api/depth-components.md](api/depth-components.md) for the full prop API of each depth component.

- `DepthStage` — establishes the 3D perspective context
- `DepthLayer` — positions content at a z-level within a DepthStage
- `FloatCard` — self-contained tilt card (does not use DepthStage)
- `HorizonGrid` — perspective-projected vanishing-point grid background
- `Plinth` — flat 3D platform for content to rest on

---

## Composition Patterns

### 1. Basic: DepthStage + DepthLayer

the fundamental pattern. layer your content at different z-levels:

```svelte
<DepthStage perspective="mid">
	<DepthLayer level="ground">
		<HorizonGrid />
	</DepthLayer>

	<DepthLayer level="raised">
		<Grid cols={3} gap="var(--space-md)">
			<MetricCard label="signals" value="142" trend="up" />
			<MetricCard label="coverage" value="94%" trend="neutral" />
			<MetricCard label="errors" value="3" trend="down" />
		</Grid>
	</DepthLayer>
</DepthStage>
```

### 2. Card Tilt: FloatCard Standalone

FloatCard is self-contained — no DepthStage needed. use it directly in any layout:

```svelte
<Grid cols={3} gap="var(--space-lg)">
	{#each metrics as m}
		<FloatCard>
			<MetricCard label={m.label} value={m.value} trend={m.trend} />
		</FloatCard>
	{/each}
</Grid>
```

### 3. Dashboard: DepthStage Wrapping a Metric Grid

a typical data dashboard layout — HorizonGrid at ground, metric cards at raised:

```svelte
<ReadoutScene title="mission control">
	<DepthStage perspective="far">
		<DepthLayer level="ground">
			<HorizonGrid rows={8} cols={6} vanishY={0.5} />
		</DepthLayer>

		<DepthLayer level="raised">
			<Grid cols="repeat(auto-fill, minmax(200px, 1fr))" gap="var(--space-md)">
				{#each kpis as kpi}
					<MetricCard label={kpi.label} value={kpi.value} trend={kpi.trend} />
				{/each}
			</Grid>
		</DepthLayer>
	</DepthStage>
</ReadoutScene>
```

### 4. Hero: StageScene + FloatCard + HorizonGrid Animated

a cinematic landing layout:

```svelte
<StageScene>
	{#snippet ambient()}
		<DepthStage perspective="far">
			<DepthLayer level="ground">
				<HorizonGrid animated vanishY={0.35} />
			</DepthLayer>
		</DepthStage>
		<Vignette />
		<CornerBrackets size={48} />
	{/snippet}

	{#snippet heading()}
		<Text as="h1" variant="heading" expression="title-card">field station</Text>
	{/snippet}

	{#snippet subheading()}
		<Text variant="body" color="soft">signal acquired.</Text>
	{/snippet}

	{#snippet actions()}
		<FloatCard elevation="foreground">
			<Button variant="primary">enter</Button>
		</FloatCard>
	{/snippet}
</StageScene>
```

### 5. Parallax Layer Depth

combine `ParallaxLayer` with DepthStage for pointer-responsive depth:

```svelte
<script lang="ts">
	let stage: HTMLElement;

	function onPointerMove(e: PointerEvent) {
		const r = stage.getBoundingClientRect();
		stage.style.setProperty('--px', ((e.clientX - r.left) / r.width).toString());
		stage.style.setProperty('--py', ((e.clientY - r.top) / r.height).toString());
	}
</script>

<div bind:this={stage} onpointermove={onPointerMove} style="position: relative; min-height: 100vh;">
	<ParallaxLayer strength={5}>
		<GridOverlay />
	</ParallaxLayer>

	<ParallaxLayer strength={15}>
		<CornerBrackets size={64} />
	</ParallaxLayer>

	<ParallaxLayer strength={30}>
		<Text as="h1" variant="heading" expression="title-card">approach</Text>
	</ParallaxLayer>
</div>
```

### 6. Plinth Platform

content resting on a 3D base:

```svelte
<DepthStage perspective="near">
	<DepthLayer level="ground">
		<Plinth width="300px" depth="24px" />
	</DepthLayer>
	<DepthLayer level="raised">
		<FloatCard>
			<MetricCard label="altitude" value="3,400m" trend="neutral" />
		</FloatCard>
	</DepthLayer>
</DepthStage>
```

---

## Conflict Warnings

### 1. Do Not Nest FloatCard Inside DepthStage

**FloatCard creates its own perspective context.** placing it inside `DepthStage` (which also creates a perspective context) produces two competing `perspective` declarations on ancestor elements. the result is broken 3D rendering — tilts appear distorted, transforms compound incorrectly.

```svelte
<!-- this is broken — FloatCard inside DepthStage -->
<DepthStage>
	<DepthLayer level="raised">
		<FloatCard>...</FloatCard>
		<!-- conflict: two perspective contexts -->
	</DepthLayer>
</DepthStage>

<!-- correct: use them separately -->
<DepthStage>
	<DepthLayer level="raised">
		<Card>...</Card>
		<!-- regular card inside depth stage -->
	</DepthLayer>
</DepthStage>

<FloatCard>...</FloatCard>
<!-- float card stands alone -->
```

### 2. Do Not Use Depth Inside Scrollable Overflow Containers

`transform-style: preserve-3d` does not compose correctly with `overflow: scroll`, `overflow: auto`, or `overflow: hidden`. if a `DepthStage` or any of its ancestors have one of these overflow values, the 3D transforms will be flattened and depth will not appear.

ensure the depth container and its scroll ancestors have `overflow: visible`.

### 3. Do Not Use DepthLayer Without DepthStage

`DepthLayer` applies `translateZ` values. without a parent `DepthStage` to establish `perspective`, `translateZ` has no visual effect — the element simply renders at the same z-position as everything else. the composition does nothing.

```svelte
<!-- useless — no perspective context -->
<DepthLayer level="foreground">
	<Text as="h1">this appears flat</Text>
</DepthLayer>

<!-- correct: DepthLayer always inside DepthStage -->
<DepthStage>
	<DepthLayer level="foreground">
		<Text as="h1">this appears forward</Text>
	</DepthLayer>
</DepthStage>
```

---

## Reduced Motion Behavior

when `prefers-reduced-motion: reduce` is set:

- `FloatCard` tilt is disabled — the card renders flat, static, with no pointer response
- `HorizonGrid` animation (when `animated`) stops — the grid renders static
- `ParallaxLayer` transitions are removed — the element still responds to `--px`/`--py` but without animation
- `DepthStage` and `DepthLayer` still apply their `translateZ` values — the layering effect remains, as it is not animation-dependent

---

→ next: [docs/recipes.md](recipes.md) — composition recipes
