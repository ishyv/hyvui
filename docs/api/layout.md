## Layout

Structural containers. these don't display content — they organize it.

---

## Stack

> flexbox layout primitive. arranges children vertically or horizontally with consistent spacing.

### Import

```svelte
<script lang="ts">
	import { Stack } from '$lib';
</script>
```

### Props

| prop        | type                         | default             | required | description                                                                                   |
| ----------- | ---------------------------- | ------------------- | -------- | --------------------------------------------------------------------------------------------- |
| `direction` | `'vertical' \| 'horizontal'` | `'vertical'`        | no       | flex direction                                                                                |
| `gap`       | `string`                     | `'var(--space-md)'` | no       | CSS gap value between children                                                                |
| `align`     | `string`                     | `undefined`         | no       | `align-items` value (`center`, `flex-start`, `flex-end`, `stretch`, `baseline`)               |
| `justify`   | `string`                     | `undefined`         | no       | `justify-content` value (`flex-start`, `flex-end`, `center`, `space-between`, `space-around`) |
| `wrap`      | `boolean`                    | `false`             | no       | enables `flex-wrap`                                                                           |
| `as`        | `string`                     | `'div'`             | no       | the HTML element to render                                                                    |
| `class`     | `string`                     | `''`                | no       | additional CSS classes                                                                        |

### Examples

```svelte
<!-- vertical stack with default gap -->
<Stack>
	<Text as="h2" variant="heading">coordinates</Text>
	<Text variant="body">sector 7, grid reference 44.2°N</Text>
	<Button variant="secondary">lock in</Button>
</Stack>

<!-- horizontal stack of buttons -->
<Stack direction="horizontal" gap="var(--space-xs)" align="center">
	<Button variant="primary">deploy</Button>
	<Button variant="ghost">cancel</Button>
</Stack>

<!-- wrapping tag list -->
<Stack direction="horizontal" gap="var(--space-xs)" wrap>
	{#each tags as tag}
		<Badge>{tag}</Badge>
	{/each}
</Stack>
```

---

## Grid

> container-responsive CSS grid. `auto` mode computes column count from the element's available width (so it behaves inside panels/modals, not just at viewport breakpoints).

### Import

```svelte
<script lang="ts">
	import { Grid } from '$lib';
</script>
```

### Props

| prop          | type                   | default             | required | description                                                                                      |
| ------------- | ---------------------- | ------------------- | -------- | ------------------------------------------------------------------------------------------------ |
| `mode`        | `'auto' \| 'template'` | `'auto'`            | no       | auto-compute columns or use a raw template                                                       |
| `minColWidth` | `string`               | `'16rem'`           | no       | minimum column width (auto mode)                                                                 |
| `maxCols`     | `number`               | `undefined`         | no       | max columns cap (auto mode)                                                                      |
| `cols`        | `number \| string`     | `1`                 | no       | template mode: raw `grid-template-columns`; auto mode: numeric values are treated as `maxCols`\* |
| `gap`         | `string`               | `'var(--space-md)'` | no       | CSS gap value                                                                                    |
| `as`          | `string`               | `'div'`             | no       | the HTML element to render                                                                       |
| `class`       | `string`               | `''`                | no       | additional CSS classes                                                                           |

\* Back-compat: `cols={3}` in `auto` mode behaves like `maxCols={3}`.

### Examples

```svelte
<!-- auto: compute columns from container width -->
<Grid minColWidth="16rem" maxCols={3} gap="var(--space-lg)">
	{#each items as item}
		<Card>
			<Text as="h3" variant="heading">{item.title}</Text>
		</Card>
	{/each}
</Grid>

<!-- template: raw grid-template-columns -->
<Grid mode="template" cols="repeat(auto-fill, minmax(280px, 1fr))">
	{#each metrics as m}
		<MetricCard label={m.label} value={m.value} trend={m.trend} />
	{/each}
</Grid>
```

---

## Card

> a discrete elevated content unit with optional header and footer slots.

### Import

```svelte
<script lang="ts">
	import { Card } from '$lib';
</script>
```

### Props

| prop            | type     | default | required | description                                                                    |
| --------------- | -------- | ------- | -------- | ------------------------------------------------------------------------------ |
| `staggerOffset` | `number` | `0`     | no       | translateY offset in pixels applied at render — for staggered entrance effects |
| `class`         | `string` | `''`    | no       | additional CSS classes                                                         |

### Slots

| slot      | description                                             |
| --------- | ------------------------------------------------------- |
| `header`  | rendered at the top of the card, above the default slot |
| `default` | main card body content                                  |
| `footer`  | rendered at the bottom of the card                      |

### Examples

```svelte
<!-- basic card -->
<Card>
	<Text as="h3" variant="heading">signal intercept</Text>
	<Text variant="body">received at 14:23 UTC. awaiting confirmation.</Text>
</Card>

<!-- card with header and footer -->
<Card>
	{#snippet header()}
		<Label color="accent">priority</Label>
	{/snippet}

	<Text as="h3" variant="heading">encrypted transmission</Text>
	<Text variant="body">origin coordinates pending verification.</Text>

	{#snippet footer()}
		<Button variant="secondary" size="sm">verify</Button>
	{/snippet}
</Card>

<!-- staggered cards (apply incrementing offset) -->
{#each entries as entry, i}
	<Card staggerOffset={i * 4}>
		<Text variant="body">{entry.title}</Text>
	</Card>
{/each}
```

---

## Panel

> a major section container. larger than Card, used for full-width content regions, sidebars, and information panels.

### Import

```svelte
<script lang="ts">
	import { Panel } from '$lib';
</script>
```

### Props

| prop        | type      | default | required | description                                        |
| ----------- | --------- | ------- | -------- | -------------------------------------------------- |
| `withInset` | `boolean` | `false` | no       | adds a teal top-edge accent line via pseudoelement |
| `class`     | `string`  | `''`    | no       | additional CSS classes                             |

### Slots

| slot      | description                                |
| --------- | ------------------------------------------ |
| `header`  | section header — title, label, or controls |
| `default` | main panel body content                    |

### Examples

```svelte
<!-- basic panel -->
<Panel>
	{#snippet header()}
		<Text as="h2" variant="heading">mission log</Text>
	{/snippet}

	<Text variant="body">entries from the last active period.</Text>
</Panel>

<!-- panel with teal inset for emphasis -->
<Panel withInset>
	{#snippet header()}
		<Label color="signal">live</Label>
		<Text as="h2" variant="heading">system readout</Text>
	{/snippet}

	<StatusLine status="ok" message="all channels nominal" />
</Panel>
```

---

## Modal

> a blocking overlay dialog. uses the native `<dialog>` element. supports keyboard dismissal and backdrop click.

### Import

```svelte
<script lang="ts">
	import { Modal } from '$lib';
</script>
```

### Props

| prop    | type      | default     | required | description                           |
| ------- | --------- | ----------- | -------- | ------------------------------------- |
| `open`  | `boolean` | `false`     | yes      | controls whether the modal is visible |
| `title` | `string`  | `undefined` | no       | displayed in the modal header         |
| `class` | `string`  | `''`        | no       | additional CSS classes                |

### Slots

| slot      | description                                        |
| --------- | -------------------------------------------------- |
| `header`  | replaces the default title area entirely           |
| `default` | modal body content                                 |
| `footer`  | action buttons or supporting content at the bottom |

### Events

| event     | payload | when                                                   |
| --------- | ------- | ------------------------------------------------------ |
| `onclose` | `void`  | modal requests to close (Escape key or backdrop click) |

### Focus and Keyboard Behavior

- on open: focus is moved into the modal automatically (native `<dialog>` behavior)
- **Escape key:** closes the modal and fires `onclose`
- **backdrop click:** closes the modal and fires `onclose`
- focus is trapped inside the modal while open — Tab cycles through focusable elements within

the modal does **not** manage its own `open` state. you must handle `onclose` and set `open = false` in the parent.

### Accessibility

Uses the native `<dialog>` element with `aria-modal="true"`. the title (if provided) is set as `aria-label`. focus trap is provided by the browser's native dialog implementation.

### Do Not Use When

- you need a non-blocking panel — use `Drawer`
- you need an anchored tooltip — use `Popover`
- you need a simple yes/no confirmation — use `ConfirmDialog` (wraps Modal)

### Examples

```svelte
<!-- controlled modal with open/close state -->
<script lang="ts">
	let open = $state(false);
</script>

<Button variant="secondary" onclick={() => (open = true)}>open details</Button>

<Modal {open} title="transmission details" onclose={() => (open = false)}>
	<Text variant="body">
		the signal was received at 14:23 UTC from sector 7. decryption pending.
	</Text>

	{#snippet footer()}
		<Stack direction="horizontal" gap="var(--space-xs)" justify="flex-end">
			<Button variant="ghost" onclick={() => (open = false)}>dismiss</Button>
			<Button variant="primary" onclick={handleConfirm}>acknowledge</Button>
		</Stack>
	{/snippet}
</Modal>

<!-- modal with custom header slot -->
<Modal {open} onclose={() => (open = false)}>
	{#snippet header()}
		<Stack direction="horizontal" align="center" gap="var(--space-sm)">
			<StatusDot status="warn" />
			<Text as="h2" variant="heading">attention required</Text>
		</Stack>
	{/snippet}

	<Text variant="body">this action cannot be reversed.</Text>
</Modal>
```

---

## Drawer

> a side panel that slides in from the left or right edge of the viewport. non-blocking — the page behind it remains interactive with a backdrop overlay.

### Import

```svelte
<script lang="ts">
	import { Drawer } from '$lib';
</script>
```

### Props

| prop    | type                | default   | required | description                            |
| ------- | ------------------- | --------- | -------- | -------------------------------------- |
| `open`  | `boolean`           | `false`   | yes      | controls whether the drawer is visible |
| `side`  | `'left' \| 'right'` | `'right'` | no       | which edge the drawer slides in from   |
| `width` | `string`            | `'320px'` | no       | CSS width of the drawer panel          |
| `class` | `string`            | `''`      | no       | additional CSS classes                 |

### Slots

| slot      | description          |
| --------- | -------------------- |
| `default` | drawer panel content |

### Events

| event     | payload | when                         |
| --------- | ------- | ---------------------------- |
| `onclose` | `void`  | backdrop click or Escape key |

### Examples

```svelte
<script lang="ts">
	let drawerOpen = $state(false);
</script>

<Button variant="ghost" onclick={() => (drawerOpen = true)}>open nav</Button>

<Drawer open={drawerOpen} side="left" onclose={() => (drawerOpen = false)}>
	<SidebarNav items={navItems} onnavigate={() => (drawerOpen = false)} />
</Drawer>
```

---

## Popover

> a small anchored panel positioned with Floating UI. portals to `document.body` by default to avoid overflow clipping and closes on outside click / Escape.

### Import

```svelte
<script lang="ts">
	import { Popover } from '$lib';
</script>
```

### Props

| prop        | type          | default          | required | description                                                      |
| ----------- | ------------- | ---------------- | -------- | ---------------------------------------------------------------- |
| `open`      | `boolean`     | `false`          | yes      | controls whether the popover is visible                          |
| `anchor`    | `HTMLElement` | `null`           | yes      | reference element used for positioning (required when `open`)    |
| `placement` | `Placement`   | `'bottom-start'` | no       | Floating UI placement (`bottom-start`, `top-end`, etc.)          |
| `offset`    | `number`      | `8`              | no       | distance from anchor in pixels                                   |
| `portal`    | `boolean`     | `true`           | no       | when true, moves the popover node to `document.body` on mount    |
| `class`     | `string`      | `''`             | no       | additional CSS classes                                           |
| `onclose`   | `() => void`  | `undefined`      | no       | fires when the popover requests to close (outside click, Escape) |

### Slots

| slot      | description     |
| --------- | --------------- |
| `default` | popover content |

### Do Not Use When

- the popover contains a list of selectable items — use `DropdownMenu`
- you need a blocking overlay — use `Modal`

### Examples

```svelte
<script lang="ts">
	let infoOpen = $state(false);
	let anchorEl: HTMLElement | null = $state(null);
</script>

<span bind:this={anchorEl} style="display: inline-block;">
	<Button variant="ghost" size="sm" onclick={() => (infoOpen = !infoOpen)}>info</Button>
</span>

<Popover
	open={infoOpen}
	anchor={anchorEl}
	placement="bottom-start"
	onclose={() => (infoOpen = false)}
>
	<Text variant="caption">last updated 2 hours ago.</Text>
</Popover>
```

---

→ next: [docs/api/navigation.md](navigation.md) — navigation component API reference
