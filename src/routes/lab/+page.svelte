<script lang="ts">
	import {
		Alert,
		Badge,
		Breadcrumb,
		Button,
		Card,
		Checkbox,
		CodeBlock,
		CornerBrackets,
		DataStream,
		Divider,
		DropdownMenu,
		EmptyState,
		ErrorState,
		Grid,
		GridOverlay,
		GlyphMark,
		Input,
		Label,
		PageHeader,
		Panel,
		ParallaxLayer,
		ScanBand,
		Select,
		SignalRing,
		Skeleton,
		Stack,
		StatusDot,
		StatusLine,
		Tabs,
		Text,
		Textarea,
		ThreadLine,
		Toast,
		Vignette
	} from '$lib/index.js';

	const widths = [280, 320, 375, 480, 640, 768, 1024, 1440];

	const tabs = [
		{ id: 'alpha', label: 'alpha systems' },
		{ id: 'beta', label: 'beta systems' },
		{ id: 'gamma', label: 'gamma systems' }
	];

	const tableColumns = [
		{ key: 'time', label: 'time' },
		{ key: 'event', label: 'event' },
		{ key: 'meta', label: 'meta' }
	];

	const tableRows = [
		{
			time: '03:42:18',
			event: 'frequency sweep completed',
			meta: 'bearing 047.2 | range unknown | last contact 7h ago'
		},
		{
			time: '03:31:55',
			event: 'thermal anomaly logged',
			meta: 'https://example.com/some/really/really/really/long/path/that/should/not/blow/up/layout'
		}
	];

	const menuItems = [
		{ label: 'export', value: 'export' },
		{ label: 'duplicate', value: 'duplicate' },
		{ label: 'archive', value: 'archive', destructive: true }
	];

	const code = `const signal = await listen({
  frequency: 47.2,
  threshold: 0.003,
  timeout: Infinity,
});

log(signal.origin);`;
</script>

<svelte:head>
	<title>hyvui lab</title>
</svelte:head>

<div class="lab">
	<div class="lab-ambient" aria-hidden="true">
		<GridOverlay class="lab-grid" />
		<Vignette class="lab-vignette" />
		<ScanBand axis="x" size="14%" duration="7s" />
	</div>

	<div class="lab-shell">
		<PageHeader
			title="stress lab"
			subtitle="containers at fixed widths. worst-case strings. if it breaks here, it breaks in prod."
		>
			{#snippet actions()}
				<Badge variant="accent">container queries</Badge>
				<Badge variant="signal">perf pass</Badge>
			{/snippet}
		</PageHeader>

		<div class="lab-frames">
			{#each widths as w}
				<section class="lab-frame" data-width={w} style:width={`${w}px`}>
					<div class="lab-frame-head">
						<Label color="accent">{w}px</Label>
						<div class="lab-frame-head-meta">
							<StatusDot status="ok" size={6} pulse={false} />
							<Label color="muted">layout integrity</Label>
						</div>
					</div>

					<Card>
						{#snippet header()}
							<Stack direction="horizontal" gap="0.75rem" align="center" wrap={true}>
								<GlyphMark variant="coord" size={14} color="var(--muted-strong)" />
								<Text variant="heading" as="h2"
									>a title that is intentionally too long to fit cleanly</Text
								>
							</Stack>
						{/snippet}

						<Stack gap="var(--space-md)">
							<Text variant="body">
								this sentence contains a deliberately-unbroken-token:
								<span class="lab-long-token">SUPERCALIFRAGILISTICEXPIALIDOCIOUS_0123456789</span>
							</Text>

							<Stack direction="horizontal" gap="var(--space-sm)" wrap={true} align="center">
								<Button variant="primary">a very long primary action label</Button>
								<Button variant="secondary">secondary</Button>
								<Button variant="ghost">ghost action</Button>
							</Stack>

							<Grid cols={3} gap="var(--space-sm)">
								<Skeleton height="1.2rem" />
								<Skeleton height="1.2rem" />
								<Skeleton height="1.2rem" />
							</Grid>

							<Divider />

							<Grid cols={2} gap="var(--space-md)">
								<Input
									label="callsign"
									placeholder="enter identifier"
									hint="this hint should wrap if needed"
								/>
								<Select
									label="region"
									options={[
										{ label: 'united states', value: 'us' },
										{ label: 'a region with an absurdly long label for testing', value: 'long' }
									]}
								/>
								<Textarea
									label="notes"
									rows={3}
									placeholder="multi-line input should not explode the frame"
								/>
								<Stack gap="0.5rem">
									<Checkbox label="enable telemetry collection" checked={true} />
									<Checkbox label="allow orbital correction maneuvers" checked={false} />
								</Stack>
							</Grid>

							<Tabs {tabs} active="alpha" />
							<Breadcrumb items={[{ label: 'lab', href: '/lab' }, { label: `${w}px` }]} />

							<Panel>
								{#snippet header()}
									<Label color="muted">state</Label>
								{/snippet}
								<Grid cols={2} gap="var(--space-sm)">
									<EmptyState title="no entries" description="awaiting first signal." />
									<ErrorState
										title="signal deferred"
										description="retry from stable ground."
										retry={true}
									/>
								</Grid>
							</Panel>

							<Alert variant="warn" title="degraded channel">
								<Text expression="readout">latency above baseline. recovery expected.</Text>
							</Alert>

							<StatusLine
								status="pend"
								message="awaiting sector 4 response"
								visible
								tone="split"
								cursor
							/>

							<CodeBlock {code} language="ts" />

							<div class="lab-menu-row">
								<DropdownMenu items={menuItems} onselect={() => {}}>
									{#snippet trigger()}
										<Button variant="secondary">[ menu ]</Button>
									{/snippet}
								</DropdownMenu>
								<Badge variant="default">badge</Badge>
							</div>
						</Stack>
					</Card>

					<div class="lab-ornaments" aria-hidden="true">
						<div style="--px: 0.08; --py: -0.05;">
							<ParallaxLayer>
								<SignalRing size={120} color="var(--signal)" />
							</ParallaxLayer>
						</div>
						<DataStream width="1.1rem" speed="medium" />
						<CornerBrackets size={14} color="rgba(199, 156, 87, 0.22)" />
						<ThreadLine x1="0" y1="0" x2="180" y2="32" animated />
					</div>
				</section>
			{/each}
		</div>

		<Toast />
	</div>
</div>

<style>
	.lab {
		position: relative;
		min-height: 100dvh;
		overflow-x: auto;
	}

	.lab-ambient {
		position: fixed;
		inset: 0;
		pointer-events: none;
		opacity: 0.75;
	}

	:global(.lab-grid) {
		opacity: 0.35;
	}

	:global(.lab-vignette) {
		background:
			radial-gradient(ellipse at top, rgba(121, 166, 163, 0.08), transparent 36%),
			radial-gradient(ellipse at 50% 100%, transparent 56%, rgba(0, 0, 0, 0.56));
	}

	.lab-shell {
		position: relative;
		z-index: 1;
		max-width: var(--shell-max);
		margin: 0 auto;
		padding: var(--space-3xl) var(--shell-pad);
		display: flex;
		flex-direction: column;
		gap: var(--space-2xl);
	}

	.lab-frames {
		display: grid;
		gap: var(--space-2xl);
	}

	.lab-frame {
		position: relative;
		max-width: 100%;
		border: 1px solid var(--line);
		background: rgba(0, 0, 0, 0.1);
		padding: var(--space-lg);
	}

	.lab-frame-head {
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		justify-content: space-between;
		gap: var(--space-sm);
		margin-bottom: var(--space-lg);
	}

	.lab-frame-head-meta {
		display: inline-flex;
		align-items: center;
		gap: var(--space-xs);
	}

	.lab-long-token {
		overflow-wrap: anywhere;
		word-break: break-word;
	}

	.lab-menu-row {
		display: flex;
		flex-wrap: wrap;
		gap: var(--space-sm);
		align-items: center;
	}

	.lab-ornaments {
		position: absolute;
		inset: var(--space-lg);
		pointer-events: none;
		opacity: 0.26;
	}
</style>
