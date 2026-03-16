## Recipes

Named composition patterns — complete, copy-paste-ready examples for common scenarios.

---

## 1. Terminal Boot Page

a full boot sequence that gates the main application content until completion. the page starts as a terminal readout, transitions to the actual UI on `oncomplete`.

```svelte
<!-- src/routes/+page.svelte -->
<script lang="ts">
	import {
		TerminalBoot,
		StageScene,
		Text,
		Button,
		GridOverlay,
		Vignette,
		CornerBrackets,
		surface
	} from '$lib';

	let booted = $state(false);

	const bootLines = [
		{ status: 'ok', message: 'token layer initialized' },
		{ status: 'ok', message: 'register system mounted' },
		{ status: 'ok', message: 'depth context established' },
		{ status: 'ok', message: 'expression engine loaded' },
		{ status: 'pend', message: 'verifying coordinates' },
		{ status: 'ok', message: 'signal acquired — all systems nominal' }
	] as const;
</script>

{#if !booted}
	<div
		style="
    min-height: 100dvh;
    display: flex;
    align-items: center;
    padding: var(--space-scene);
    background: var(--bg);
  "
	>
		<TerminalBoot lines={bootLines} delay={400} interval={650} oncomplete={() => (booted = true)} />
	</div>
{:else}
	<div use:surface>
		<StageScene>
			{#snippet ambient()}
				<GridOverlay />
				<Vignette />
				<CornerBrackets size={48} />
			{/snippet}

			{#snippet label()}
				<span class="expr-command">field station — vol. 3</span>
			{/snippet}

			{#snippet heading()}
				<Text as="h1" variant="heading" expression="title-card">signal acquired</Text>
			{/snippet}

			{#snippet subheading()}
				<Text variant="body" color="soft">coordinates locked. the mission continues.</Text>
			{/snippet}

			{#snippet actions()}
				<Button variant="primary" href="/log">enter</Button>
			{/snippet}
		</StageScene>
	</div>
{/if}
```

---

## 2. Data Dashboard Card Grid

a ReadoutScene wrapping a DepthStage with MetricCards and a Table. the sidebar slot holds a system log panel.

```svelte
<script lang="ts">
	import {
		ReadoutScene,
		DepthStage,
		DepthLayer,
		HorizonGrid,
		Grid,
		MetricCard,
		Table,
		Panel,
		StatusDot,
		StatusLine,
		Text,
		Label,
		Stack
	} from '$lib';

	const kpiColumns = [
		{ key: 'name', label: 'metric' },
		{ key: 'value', label: 'value', align: 'right' as const },
		{ key: 'delta', label: 'delta', align: 'right' as const }
	];

	const kpiRows = [
		{ name: 'active signals', value: '142', delta: '+12' },
		{ name: 'coverage', value: '94%', delta: '0%' },
		{ name: 'failed contacts', value: '3', delta: '-1' }
	];
</script>

<ReadoutScene title="mission control">
	{#snippet header()}
		<Stack direction="horizontal" align="center" gap="var(--space-sm)">
			<StatusDot status="ok" />
			<Label>all systems nominal</Label>
		</Stack>
	{/snippet}

	<DepthStage perspective="far">
		<DepthLayer level="ground">
			<HorizonGrid rows={8} cols={6} vanishY={0.5} />
		</DepthLayer>

		<DepthLayer level="raised">
			<Grid cols={3} gap="var(--space-md)">
				<MetricCard label="active signals" value="142" trend="up" trendValue="+12" />
				<MetricCard label="coverage" value="94%" trend="neutral" />
				<MetricCard label="failed contacts" value="3" trend="down" trendValue="-1" />
			</Grid>
		</DepthLayer>
	</DepthStage>

	<Table columns={kpiColumns} rows={kpiRows} />

	{#snippet sidebar()}
		<Panel>
			{#snippet header()}
				<Text as="h3" variant="heading">system log</Text>
			{/snippet}
			<StatusLine status="ok" message="token layer initialized" />
			<StatusLine status="ok" message="register system mounted" />
			<StatusLine status="ok" message="coordinates locked" />
			<StatusLine status="pend" message="awaiting heartbeat" cursor />
		</Panel>
	{/snippet}
</ReadoutScene>
```

---

## 3. Confirmation Flow

a Button that opens a `ConfirmDialog`. on confirm, runs the destructive action and shows a toast.

```svelte
<script lang="ts">
	import { Button, ConfirmDialog, toastStore } from '$lib';

	let confirmOpen = $state(false);
	let recordId = 'entry-003';

	async function handleDelete() {
		confirmOpen = false;
		try {
			await deleteRecord(recordId);
			toastStore.push('record removed from archive', 'ok');
		} catch {
			toastStore.push('the removal could not complete — try again', 'fail');
		}
	}
</script>

<Button variant="destructive" onclick={() => (confirmOpen = true)}>delete record</Button>

<ConfirmDialog
	open={confirmOpen}
	title="delete this record?"
	description="this cannot be undone. the entry will be permanently removed from the archive."
	confirmLabel="delete"
	destructive
	onconfirm={handleDelete}
	oncancel={() => (confirmOpen = false)}
/>
```

---

## 4. Async Form Submission

Input and Textarea with a loading Button, `use:resolve` on the form, and a Toast on completion. manages submitting state in `$state`.

```svelte
<script lang="ts">
	import { Input, Textarea, Button, Panel, Text, Stack, resolve, toastStore } from '$lib';
	import type { ResolveAction } from '$lib';

	let resolveAction: ResolveAction;
	let submitting = $state(false);

	let callsign = $state('');
	let notes = $state('');

	async function handleSubmit() {
		if (!callsign.trim()) return;
		submitting = true;
		resolveAction.trigger('pend');

		try {
			await archiveEntry({ callsign, notes });
			resolveAction.trigger('ok');
			toastStore.push('entry archived', 'ok');
			callsign = '';
			notes = '';
		} catch {
			resolveAction.trigger('fail');
			toastStore.push('the signal interrupted — try again', 'fail');
		} finally {
			submitting = false;
		}
	}
</script>

<Panel use:resolve={(a) => (resolveAction = a)}>
	{#snippet header()}
		<Text as="h2" variant="heading">new field entry</Text>
	{/snippet}

	<form onsubmit|preventDefault={handleSubmit}>
		<Stack gap="var(--space-md)">
			<Input bind:value={callsign} label="callsign" placeholder="enter designation" />
			<Textarea
				bind:value={notes}
				label="field notes"
				placeholder="record observations..."
				autoresize
			/>
			<Button type="submit" variant="primary" loading={submitting} disabled={submitting}>
				{submitting ? 'archiving' : 'archive entry'}
			</Button>
		</Stack>
	</form>
</Panel>
```

---

## 5. Parallax Hero Section

a full-viewport hero with multiple ParallaxLayer depths driven by pointer movement. includes GridOverlay, CornerBrackets, and hero content at different depths.

```svelte
<script lang="ts">
	import { ParallaxLayer, GridOverlay, CornerBrackets, Vignette, Text, Button, Stack } from '$lib';

	let hero: HTMLElement;

	function onPointerMove(e: PointerEvent) {
		const r = hero.getBoundingClientRect();
		const px = (e.clientX - r.left) / r.width;
		const py = (e.clientY - r.top) / r.height;
		hero.style.setProperty('--px', px.toString());
		hero.style.setProperty('--py', py.toString());
	}
</script>

<section
	bind:this={hero}
	onpointermove={onPointerMove}
	style="
    position: relative;
    min-height: 100dvh;
    overflow: hidden;
    display: flex;
    align-items: center;
    justify-content: center;
  "
>
	<!-- far layer: grid background -->
	<ParallaxLayer strength={5}>
		<GridOverlay />
	</ParallaxLayer>

	<!-- mid layer: corner brackets -->
	<ParallaxLayer strength={14}>
		<CornerBrackets size={64} color="var(--line-strong)" />
	</ParallaxLayer>

	<!-- vignette (non-parallax) -->
	<Vignette />

	<!-- near layer: hero content -->
	<ParallaxLayer strength={28}>
		<div style="position: relative; z-index: 10; text-align: center; padding: var(--space-scene);">
			<span class="expr-command" style="display: block; margin-bottom: 1rem;">
				field station — vol. 3
			</span>
			<Text as="h1" variant="heading" expression="title-card">approach</Text>
			<Text variant="body" color="soft" style="margin-top: 1.5rem;">
				coordinates pending confirmation.
			</Text>
			<Stack
				direction="horizontal"
				justify="center"
				gap="var(--space-sm)"
				style="margin-top: 2rem;"
			>
				<Button variant="primary">enter</Button>
				<Button variant="ghost">archive</Button>
			</Stack>
		</div>
	</ParallaxLayer>
</section>
```

---

## 6. Staggered Content Reveal

a list of Cards that each animate in with `use:surface`, staggered by index. the delay is computed as `index × interval`.

```svelte
<script lang="ts">
	import { Card, Text, Label, Stack, surface } from '$lib';

	const entries = [
		{ id: 'e001', date: '2026-03-01', title: 'initial contact', excerpt: 'first signal detected.' },
		{ id: 'e002', date: '2026-03-03', title: 'calibration', excerpt: 'coordinates adjusted.' },
		{ id: 'e003', date: '2026-03-07', title: 'signal acquired', excerpt: 'lock confirmed.' },
		{ id: 'e004', date: '2026-03-12', title: 'field report', excerpt: 'full readout archived.' }
	];

	const STAGGER_INTERVAL = 100; // ms between each card
</script>

<Stack gap="var(--space-md)">
	{#each entries as entry, i}
		<div use:surface={{ delay: i * STAGGER_INTERVAL }}>
			<Card>
				<Label color="muted">{entry.date}</Label>
				<Text as="h3" variant="heading">{entry.title}</Text>
				<Text variant="body" color="soft">{entry.excerpt}</Text>
			</Card>
		</div>
	{/each}
</Stack>
```

---

## 7. Register-Scoped Section

a page that uses `field-notebook` globally but switches a reference section to `archive` by scoping `data-register`.

```svelte
<!-- src/routes/+page.svelte -->
<script lang="ts">
	import { NarrativeScene, ArchiveScene, Text, Card, Label, FloatCard } from '$lib';
</script>

<!-- global register for the editorial narrative -->
<svelte:body data-register="field-notebook" />

<!-- narrative section: warm, editorial, serif-forward -->
<NarrativeScene chapter="entry 007">
	{#snippet heading()}
		<Text as="h1" variant="heading" expression="title-card">field notes</Text>
	{/snippet}
	{#snippet copy()}
		<Text variant="body">
			the signal persisted through three rotations. coordinates held within acceptable deviation
			range.
		</Text>
	{/snippet}
</NarrativeScene>

<!-- reference section: switched to archive register -->
<section data-register="archive" style="padding: var(--space-scene) 0;">
	<ArchiveScene title="reference documents" cols={3}>
		{#each documents as doc}
			<FloatCard>
				<Card>
					<Label>{doc.category}</Label>
					<Text as="h3" variant="heading">{doc.title}</Text>
				</Card>
			</FloatCard>
		{/each}
	</ArchiveScene>
</section>
```

---

## 8. Empty + Error State Table

a Table that shows `EmptyState` when rows is empty, and switches to `ErrorState` when the fetch fails.

```svelte
<script lang="ts">
	import { Table, EmptyState, ErrorState, Button, Skeleton } from '$lib';

	type Entry = { callsign: string; sector: string; status: string };

	let loading = $state(true);
	let error = $state<Error | null>(null);
	let rows = $state<Entry[]>([]);

	const columns = [
		{ key: 'callsign', label: 'callsign' },
		{ key: 'sector', label: 'sector', align: 'center' as const },
		{ key: 'status', label: 'status', align: 'right' as const }
	];

	async function loadEntries() {
		loading = true;
		error = null;
		try {
			rows = await fetchEntries();
		} catch (e) {
			error = e as Error;
		} finally {
			loading = false;
		}
	}

	loadEntries();
</script>

{#if loading}
	<Skeleton variant="card" />
{:else if error}
	<ErrorState
		title="the signal interrupted"
		description="entries could not be retrieved. check your connection."
		retry
		onretry={loadEntries}
	/>
{:else}
	<Table {columns} {rows}>
		{#snippet empty()}
			<EmptyState
				title="no entries in this sector"
				description="begin a new field entry to populate this log."
			>
				<Button variant="secondary" size="sm">new entry</Button>
			</EmptyState>
		{/snippet}
	</Table>
{/if}
```

---

## 9. Countdown / Pending Redirect

a countdown timer with a reactive StatusLine footer and a cancelable redirect. based on the redirecting page pattern.

```svelte
<script lang="ts">
	import { StatusLine, Button, Text, Stack, Label } from '$lib';
	import { goto } from '$app/navigation';

	let seconds = $state(5);
	let canceled = $state(false);

	const interval = setInterval(() => {
		if (canceled) return;
		seconds -= 1;
		if (seconds <= 0) {
			clearInterval(interval);
			goto('/');
		}
	}, 1000);

	function cancel() {
		canceled = true;
		clearInterval(interval);
	}
</script>

<Stack
	gap="var(--space-xl)"
	style="padding: var(--space-scene); min-height: 100dvh; justify-content: center;"
>
	<Label color="accent">mission complete</Label>

	<Text as="h1" variant="heading" expression="title-card">returning to base</Text>

	<Text variant="body" color="soft">
		{canceled
			? 'redirect canceled. you remain at this position.'
			: `redirecting in ${seconds} second${seconds !== 1 ? 's' : ''}.`}
	</Text>

	{#if !canceled}
		<Button variant="ghost" size="sm" onclick={cancel}>stay here</Button>
	{/if}

	<StatusLine
		status={canceled ? 'warn' : 'pend'}
		message={canceled ? 'standing by' : `departure in ${seconds}s`}
		cursor={!canceled}
	/>
</Stack>
```

---

## 10. Typewriter Sequence as Entry Gate

the canonical entry gate pattern — `TerminalBoot` runs, fires `oncomplete`, a `$state` flag flips, content reveals with `use:surface`.

```svelte
<script lang="ts">
	import {
		TerminalBoot,
		StageScene,
		Text,
		Button,
		GridOverlay,
		Vignette,
		CornerBrackets,
		surface
	} from '$lib';

	let booted = $state(false);

	const sequence = [
		{ status: 'ok', message: 'initializing field station' },
		{ status: 'ok', message: 'loading mission parameters' },
		{ status: 'ok', message: 'verifying coordinates' },
		{ status: 'ok', message: 'calibration complete' },
		{ status: 'ok', message: 'signal acquired' }
	] as const;
</script>

{#if !booted}
	<div
		style="
      min-height: 100dvh;
      display: flex;
      align-items: center;
      padding: var(--space-scene);
      background: var(--bg);
    "
	>
		<TerminalBoot
			lines={sequence}
			delay={600}
			interval={700}
			showCursor
			oncomplete={() => (booted = true)}
		/>
	</div>
{:else}
	<StageScene use:surface>
		{#snippet ambient()}
			<GridOverlay />
			<Vignette />
			<CornerBrackets size={48} />
		{/snippet}

		{#snippet label()}
			<span class="expr-command">system ready</span>
		{/snippet}

		{#snippet heading()}
			<Text as="h1" variant="heading" expression="title-card">all clear</Text>
		{/snippet}

		{#snippet subheading()}
			<Text variant="body" color="soft">the channel is open.</Text>
		{/snippet}

		{#snippet actions()}
			<Button variant="primary" href="/dashboard">proceed</Button>
		{/snippet}
	</StageScene>
{/if}
```

---

→ next: [docs/copy-voice.md](copy-voice.md) — copy writing guide
