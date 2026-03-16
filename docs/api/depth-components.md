## Depth System Components

The depth system adds CSS 3D perspective to layouts. it is not WebGL — it uses CSS `transform-style: preserve-3d`, `perspective`, and `translateZ` to create layered depth within the browser's rendering model.

read [docs/depth.md](../depth.md) for the conceptual overview, z-level values, and conflict warnings before using these components.

---

## DepthStage

> establishes a 3D perspective context. all `DepthLayer` children inside it render within that perspective. this is the required root for any depth composition.

### Import

```svelte
<script lang="ts">
	import { DepthStage } from '$lib';
</script>
```

### Props

| prop          | type                       | default | required | description                                                                |
| ------------- | -------------------------- | ------- | -------- | -------------------------------------------------------------------------- |
| `perspective` | `'near' \| 'mid' \| 'far'` | `'mid'` | no       | the CSS perspective distance — controls how dramatic the 3D effect appears |
| `originX`     | `number`                   | `50`    | no       | perspective origin X as a percentage of the element width                  |
| `originY`     | `number`                   | `50`    | no       | perspective origin Y as a percentage of the element height                 |
| `as`          | `string`                   | `'div'` | no       | the HTML element to render                                                 |
| `class`       | `string`                   | `''`    | no       | additional CSS classes                                                     |

### Slots

| slot      | description           |
| --------- | --------------------- |
| `default` | `DepthLayer` children |

### Perspective Presets

**near**
Close perspective — strong 3D distortion. elements appear to recede and advance dramatically. use for hero sections or focused dramatic moments.

**mid**
Moderate perspective — balanced depth without strong distortion. use for dashboards, card grids, and readout layouts.

**far**
Distant perspective — subtle depth, almost flat. elements barely recede. use for backgrounds and very large layouts where strong distortion would be disorienting.

### Do Not Use When

- you are placing `FloatCard` inside the stage — `FloatCard` is self-contained with its own perspective context. nesting it inside `DepthStage` creates conflicting perspective contexts and breaks the tilt effect.
- the content inside is inside a scrollable overflow container — `transform-style: preserve-3d` does not compose correctly with `overflow: scroll` or `overflow: hidden`.

### Examples

```svelte
<!-- basic depth stage with two layers -->
<DepthStage perspective="mid">
	<DepthLayer level="ground">
		<HorizonGrid />
	</DepthLayer>
	<DepthLayer level="raised">
		<Grid cols={3}>
			{#each metrics as m}
				<MetricCard label={m.label} value={m.value} trend={m.trend} />
			{/each}
		</Grid>
	</DepthLayer>
</DepthStage>

<!-- hero with shifted perspective origin -->
<DepthStage perspective="near" originX={60} originY={40}>
	<DepthLayer level="ground">
		<GridOverlay />
	</DepthLayer>
	<DepthLayer level="foreground">
		<Text as="h1" variant="heading" expression="title-card">coordinates</Text>
	</DepthLayer>
</DepthStage>
```

---

## DepthLayer

> a layer within a `DepthStage` that positions content at a specific z-level. must be a direct child of `DepthStage`.

### Import

```svelte
<script lang="ts">
	import { DepthLayer } from '$lib';
</script>
```

### Props

| prop    | type                                   | default    | required | description                            |
| ------- | -------------------------------------- | ---------- | -------- | -------------------------------------- |
| `level` | `'ground' \| 'raised' \| 'foreground'` | `'ground'` | no       | z-axis position within the depth stage |
| `as`    | `string`                               | `'div'`    | no       | the HTML element to render             |
| `class` | `string`                               | `''`       | no       | additional CSS classes                 |

### Slots

| slot      | description                          |
| --------- | ------------------------------------ |
| `default` | content rendered at this depth level |

### Z-Level Values

| level        | CSS value                                      | visual position                                 |
| ------------ | ---------------------------------------------- | ----------------------------------------------- |
| `ground`     | `var(--depth-ground)` (0 or slightly negative) | base layer — background elements, grids         |
| `raised`     | `var(--depth-raised)` (~20–40px forward)       | primary content — cards, data, main UI          |
| `foreground` | `var(--depth-foreground)` (~60–100px forward)  | prominent elements — featured content, overlays |

### Do Not Use Without DepthStage

`DepthLayer` without a `DepthStage` parent has no effect — `translateZ` only creates visible depth within a perspective context.

### Examples

```svelte
<DepthStage perspective="mid">
	<!-- background: grid at ground level -->
	<DepthLayer level="ground">
		<HorizonGrid animated />
	</DepthLayer>

	<!-- content: cards at raised level -->
	<DepthLayer level="raised">
		<Grid cols={2} gap="var(--space-lg)">
			<Card><Text variant="body">signal log</Text></Card>
			<Card><Text variant="body">active sectors</Text></Card>
		</Grid>
	</DepthLayer>

	<!-- hero text: prominent at foreground level -->
	<DepthLayer level="foreground">
		<Text as="h1" variant="heading" expression="title-card">readout</Text>
	</DepthLayer>
</DepthStage>
```

---

## FloatCard

> a self-contained card that tilts in 3D in response to pointer position. does not require a `DepthStage` — it establishes its own perspective context.

### Import

```svelte
<script lang="ts">
	import { FloatCard } from '$lib';
</script>
```

### Props

| prop        | type                       | default    | required | description                                                |
| ----------- | -------------------------- | ---------- | -------- | ---------------------------------------------------------- |
| `tiltMax`   | `number`                   | `8`        | no       | maximum tilt angle in degrees. higher = more dramatic tilt |
| `elevation` | `'raised' \| 'foreground'` | `'raised'` | no       | shadow and visual elevation level                          |
| `class`     | `string`                   | `''`       | no       | additional CSS classes                                     |

### Slots

| slot      | description  |
| --------- | ------------ |
| `default` | card content |

### Critical: Do Not Nest Inside DepthStage

**FloatCard must not be placed inside a `DepthStage`.**

FloatCard applies its own `perspective` and `transform-style: preserve-3d`. placing it inside `DepthStage` (which also sets perspective) creates two competing perspective contexts. the result is distorted, broken 3D rendering. this is a hard constraint, not a style preference.

correct usage: FloatCard stands alone or inside a regular non-perspective container.

```svelte
<!-- correct: FloatCard outside a DepthStage -->
<Grid cols={3}>
	<FloatCard>
		<MetricCard label="signal" value="94%" trend="up" />
	</FloatCard>
</Grid>

<!-- incorrect: FloatCard inside DepthStage -->
<DepthStage>
	<DepthLayer level="raised">
		<FloatCard>...</FloatCard>
		<!-- breaks the tilt effect -->
	</DepthLayer>
</DepthStage>
```

### Elevation Variants

**raised**
Moderate shadow (`--shadow-card`). use for cards in a grid at normal prominence.

**foreground**
Heavier shadow (`--shadow-veil`). use for a featured card or single-focus card that needs more visual separation.

### Reduced Motion

when `prefers-reduced-motion: reduce` is set, the tilt transform is disabled. the card remains static.

### Accessibility

the tilt is purely decorative. card content is fully accessible. interactive elements inside FloatCard receive normal focus behavior.

### Examples

```svelte
<!-- basic float card grid -->
<Grid cols={3} gap="var(--space-lg)">
	{#each metrics as m}
		<FloatCard>
			<MetricCard label={m.label} value={m.value} trend={m.trend} />
		</FloatCard>
	{/each}
</Grid>

<!-- featured card with higher elevation -->
<FloatCard elevation="foreground" tiltMax={12}>
	<Surface variant="panel" withInset>
		<Text as="h2" variant="heading">primary readout</Text>
		<Text variant="body" color="soft">all systems nominal.</Text>
	</Surface>
</FloatCard>
```

---

## HorizonGrid

> a perspective-projected grid with a vanishing point — like a road or landing strip receding into the distance. used as a background plane in depth scenes.

### Import

```svelte
<script lang="ts">
	import { HorizonGrid } from '$lib';
</script>
```

### Props

| prop       | type      | default | required | description                                                    |
| ---------- | --------- | ------- | -------- | -------------------------------------------------------------- |
| `rows`     | `number`  | `12`    | no       | number of horizontal grid lines                                |
| `cols`     | `number`  | `8`     | no       | number of vertical grid lines                                  |
| `vanishY`  | `number`  | `0.35`  | no       | vertical position of the vanishing point (0 = top, 1 = bottom) |
| `animated` | `boolean` | `false` | no       | enables subtle forward-movement animation                      |
| `class`    | `string`  | `''`    | no       | additional CSS classes                                         |

### Positioning

`position: absolute; inset: 0`. parent must have `position: relative`.

### Examples

```svelte
<!-- static horizon grid in a DepthStage -->
<DepthStage perspective="far">
	<DepthLayer level="ground">
		<HorizonGrid rows={10} cols={6} vanishY={0.4} />
	</DepthLayer>
	<DepthLayer level="raised">
		<Text as="h1" expression="title-card">approach</Text>
	</DepthLayer>
</DepthStage>

<!-- animated for a motion effect -->
<section style="position: relative; min-height: 60vh; overflow: hidden;">
	<HorizonGrid animated vanishY={0.3} />
</section>
```

---

## Plinth

> a flat 3D base platform. gives content the appearance of resting on a physical surface.

### Import

```svelte
<script lang="ts">
	import { Plinth } from '$lib';
</script>
```

### Props

| prop    | type     | default  | required | description                                        |
| ------- | -------- | -------- | -------- | -------------------------------------------------- |
| `width` | `string` | `'100%'` | no       | CSS width of the platform                          |
| `depth` | `string` | `'20px'` | no       | CSS height of the platform edge (the 3D side face) |
| `class` | `string` | `''`     | no       | additional CSS classes                             |

### Examples

```svelte
<!-- card resting on a plinth -->
<DepthStage perspective="near">
	<DepthLayer level="ground">
		<Plinth />
	</DepthLayer>
	<DepthLayer level="raised">
		<FloatCard>
			<MetricCard label="altitude" value="3,400m" trend="neutral" />
		</FloatCard>
	</DepthLayer>
</DepthStage>
```

---

→ next: [docs/api/patterns.md](patterns.md) — pattern component API reference
