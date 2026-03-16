## Patterns

Pre-composed, opinionated components for common high-level UI scenarios. each pattern bundles multiple primitives into a single component with a specific use case.

---

## PageHeader

> a standardized page or section header with title, subtitle, breadcrumb area, and action area.

### Import

```svelte
<script lang="ts">
	import { PageHeader } from '$lib';
</script>
```

### Props

| prop       | type     | default     | required | description                     |
| ---------- | -------- | ----------- | -------- | ------------------------------- |
| `title`    | `string` | —           | yes      | the page or section title       |
| `subtitle` | `string` | `undefined` | no       | supporting text below the title |
| `class`    | `string` | `''`        | no       | additional CSS classes          |

### Slots

| slot         | description                                                       |
| ------------ | ----------------------------------------------------------------- |
| `breadcrumb` | rendered above the title — for `Breadcrumb` or navigation context |
| `actions`    | rendered to the right of the title — for `Button`, `Badge`, etc.  |

### Examples

```svelte
<!-- basic page header -->
<PageHeader title="field log" subtitle="entries from the active mission period" />

<!-- with breadcrumb and actions -->
<PageHeader title="signal archive">
	{#snippet breadcrumb()}
		<Breadcrumb items={[{ label: 'mission control', href: '/' }, { label: 'archive' }]} />
	{/snippet}

	{#snippet actions()}
		<Stack direction="horizontal" gap="var(--space-xs)">
			<Button variant="ghost" size="sm">filter</Button>
			<Button variant="primary" size="sm">new entry</Button>
		</Stack>
	{/snippet}
</PageHeader>
```

---

## ConfirmDialog

> a modal confirmation dialog for destructive or irreversible actions. wraps `Modal` with confirm/cancel button wiring.

### Import

```svelte
<script lang="ts">
	import { ConfirmDialog } from '$lib';
</script>
```

### Props

| prop           | type      | default     | required | description                                        |
| -------------- | --------- | ----------- | -------- | -------------------------------------------------- |
| `open`         | `boolean` | `false`     | yes      | controls dialog visibility                         |
| `title`        | `string`  | —           | yes      | what is being confirmed                            |
| `description`  | `string`  | `undefined` | no       | consequence or context                             |
| `confirmLabel` | `string`  | `'confirm'` | no       | label for the confirm button                       |
| `cancelLabel`  | `string`  | `'cancel'`  | no       | label for the cancel button                        |
| `destructive`  | `boolean` | `false`     | no       | styles the confirm button as `destructive` variant |
| `class`        | `string`  | `''`        | no       | additional CSS classes                             |

### Events

| event       | payload | when                                                       |
| ----------- | ------- | ---------------------------------------------------------- |
| `onconfirm` | `void`  | user clicks the confirm button                             |
| `oncancel`  | `void`  | user clicks cancel, presses Escape, or clicks the backdrop |

### Accessibility

Inherits the `Modal` focus trap and keyboard behavior. the confirm button receives initial focus when `destructive` is false; the cancel button receives initial focus when `destructive` is true (preventing accidental destructive confirmation).

### Do Not Use When

- you need a multi-step confirmation — build a custom `Modal`
- you need to show complex content in the confirm dialog — build a custom `Modal`

### Examples

```svelte
<script lang="ts">
	let confirmOpen = $state(false);

	async function handleDelete() {
		confirmOpen = false;
		await deleteRecord(recordId);
		toastStore.push('record removed', 'ok');
	}
</script>

<Button variant="destructive" onclick={() => (confirmOpen = true)}>delete record</Button>

<ConfirmDialog
	open={confirmOpen}
	title="delete this record?"
	description="this cannot be undone. the entry will be permanently removed."
	confirmLabel="delete"
	destructive
	onconfirm={handleDelete}
	oncancel={() => (confirmOpen = false)}
/>
```

---

## SearchBar

> a styled search input with loading state and search event.

### Import

```svelte
<script lang="ts">
	import { SearchBar } from '$lib';
</script>
```

### Props

| prop          | type      | default    | required | description                                          |
| ------------- | --------- | ---------- | -------- | ---------------------------------------------------- |
| `value`       | `string`  | `''`       | no       | bindable search value                                |
| `placeholder` | `string`  | `'search'` | no       | placeholder text                                     |
| `loading`     | `boolean` | `false`    | no       | shows a loading indicator while results are fetching |
| `class`       | `string`  | `''`       | no       | additional CSS classes                               |

### Events

| event      | payload  | when                            |
| ---------- | -------- | ------------------------------- |
| `onsearch` | `string` | user submits search (Enter key) |

### Examples

```svelte
<script lang="ts">
	let query = $state('');
	let loading = $state(false);

	async function handleSearch(term: string) {
		loading = true;
		results = await searchRecords(term);
		loading = false;
	}
</script>

<SearchBar bind:value={query} {loading} placeholder="search the archive" onsearch={handleSearch} />
```

---

## ActionBar

> a bulk-action toolbar that appears when items are selected. shows a count of selected items and a slot for action buttons.

### Import

```svelte
<script lang="ts">
	import { ActionBar } from '$lib';
</script>
```

### Props

| prop    | type     | default | required | description                        |
| ------- | -------- | ------- | -------- | ---------------------------------- |
| `count` | `number` | `0`     | yes      | number of currently selected items |
| `class` | `string` | `''`    | no       | additional CSS classes             |

### Slots

| slot      | description                                             |
| --------- | ------------------------------------------------------- |
| `actions` | bulk action buttons (e.g. delete selected, export, tag) |

### Events

| event     | payload | when                                  |
| --------- | ------- | ------------------------------------- |
| `onclear` | `void`  | user clicks the clear/deselect button |

### Examples

```svelte
<script lang="ts">
	let selected = $state<string[]>([]);

	function handleBulkDelete() {
		deleteManyRecords(selected);
		selected = [];
	}
</script>

{#if selected.length > 0}
	<ActionBar count={selected.length} onclear={() => (selected = [])}>
		{#snippet actions()}
			<Button variant="ghost" size="sm">export</Button>
			<Button variant="destructive" size="sm" onclick={handleBulkDelete}>delete selected</Button>
		{/snippet}
	</ActionBar>
{/if}
```

---

## TerminalBoot

> an animated boot sequence component that reveals lines one by one, each with a status glyph. fires `oncomplete` when all lines have been displayed.

### Import

```svelte
<script lang="ts">
	import { TerminalBoot } from '$lib';
</script>
```

### Props

| prop         | type                                                                | default  | required | description                                                 |
| ------------ | ------------------------------------------------------------------- | -------- | -------- | ----------------------------------------------------------- |
| `lines`      | `{ status: 'ok' \| 'pend' \| 'warn' \| 'fail'; message: string }[]` | `[]`     | yes      | the sequence of lines to display                            |
| `delay`      | `number`                                                            | `600`    | no       | ms to wait before starting the sequence                     |
| `interval`   | `number`                                                            | `700`    | no       | ms between each line appearing                              |
| `instant`    | `boolean`                                                           | `false`  | no       | shows all lines immediately, skipping animation             |
| `showCursor` | `boolean`                                                           | `true`   | no       | shows a blinking cursor on the last line while it is active |
| `tone`       | `'split' \| 'line'`                                                 | `'line'` | no       | passed to `StatusLine` for each row — layout style          |
| `class`      | `string`                                                            | `''`     | no       | additional CSS classes                                      |

### Events

| event        | payload | when                          |
| ------------ | ------- | ----------------------------- |
| `oncomplete` | `void`  | all lines have been displayed |

### The `oncomplete` Pattern

`oncomplete` is the key to correct TerminalBoot usage. **the sequence is a gate — content should not be shown until the boot is complete.**

the canonical pattern:

```svelte
<script lang="ts">
	let booted = $state(false);
</script>

{#if !booted}
	<TerminalBoot lines={bootLines} oncomplete={() => (booted = true)} />
{:else}
	<main use:surface>
		<!-- your actual content -->
	</main>
{/if}
```

do not attempt to skip or bypass `oncomplete` for the content reveal. the transition from boot screen to content is the user's orientation moment.

### Accessibility

all lines are visible in the DOM immediately (with `visibility: hidden` before their reveal time) so screen readers can access the content without waiting. the animation is purely visual.

when `prefers-reduced-motion: reduce` is set, all lines appear instantly and `oncomplete` fires immediately.

### Do Not Use When

- you need a real-time log stream — TerminalBoot replays a pre-defined sequence only
- you need a single status message — use `StatusLine` directly

### Examples

```svelte
<!-- typical boot sequence gate -->
<script lang="ts">
	import { TerminalBoot } from '$lib';
	import { surface } from '$lib';

	let booted = $state(false);

	const bootLines = [
		{ status: 'ok', message: 'token layer initialized' },
		{ status: 'ok', message: 'register system mounted' },
		{ status: 'ok', message: 'depth context established' },
		{ status: 'pend', message: 'awaiting confirmation' },
		{ status: 'ok', message: 'signal acquired — all systems nominal' }
	] as const;
</script>

{#if !booted}
	<div style="padding: var(--space-scene); min-height: 100dvh; display: flex; align-items: center;">
		<TerminalBoot lines={bootLines} delay={400} interval={600} oncomplete={() => (booted = true)} />
	</div>
{:else}
	<div use:surface>
		<StageScene>
			{#snippet heading()}
				<Text as="h1" variant="heading" expression="title-card">field station</Text>
			{/snippet}
		</StageScene>
	</div>
{/if}

<!-- instant mode for testing or reduced-motion users -->
<TerminalBoot lines={bootLines} instant oncomplete={() => (booted = true)} />
```

---

→ next: [docs/api/scenes.md](scenes.md) — scene template API reference
