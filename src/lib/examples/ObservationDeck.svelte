<!--
  EXAMPLE: Observation Deck
  REGISTER: mission-control
  CONCEPT: a deep-space monitoring dashboard operated by someone who has been watching for months
  DEMONSTRATES: ReadoutScene, DepthStage, HorizonGrid, FloatCard, Table, SidebarNav, Topbar, StatusDot, Alert, MetricCard, Label, Text expressions, TerminalBoot, DataStream, GlyphMark
  INSPIRED BY: the third hour of a night watch on a research vessel bridge
-->
<script lang="ts">
	import {
		Text,
		Label,
		StatusDot,
		Alert,
		MetricCard,
		Table,
		SidebarNav,
		Topbar,
		ReadoutScene,
		DepthStage,
		DepthLayer,
		FloatCard,
		HorizonGrid,
		DataStream,
		GlyphMark,
		Grid,
		Stack,
		Divider,
		applyRegister
	} from '../index.js';
	import { onMount } from 'svelte';

	let elapsed = $state(0);
	let statusCycle = $state<'ok' | 'pend' | 'warn' | 'fail'>('ok');
	let intervalId: ReturnType<typeof setInterval> | undefined;
	let cycleId: ReturnType<typeof setInterval> | undefined;

	const statuses: ('ok' | 'pend' | 'warn' | 'fail')[] = [
		'ok',
		'ok',
		'ok',
		'pend',
		'ok',
		'warn',
		'ok'
	];
	let cycleIndex = $state(0);

	const elapsedFormatted = $derived(() => {
		const h = Math.floor(elapsed / 3600);
		const m = Math.floor((elapsed % 3600) / 60);
		const s = elapsed % 60;
		return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
	});

	const navItems = [
		{ label: 'overview', href: '#', active: true },
		{ label: 'telemetry', href: '#' },
		{ label: 'signal log', href: '#' },
		{ label: 'thermal map', href: '#' },
		{ label: 'diagnostics', href: '#' }
	];

	const metricsData = [
		{ label: 'signal strength', value: '-42 dbm' },
		{ label: 'thermal variance', value: '0.003 K' },
		{ label: 'distance', value: '4.2 ly' },
		{ label: 'cycle count', value: '1,847' },
		{ label: 'uptime', value: '99.97%' },
		{ label: 'queue depth', value: '12' }
	];

	const eventLog = [
		{ time: '03:42:18', event: 'frequency sweep completed', status: 'ok' },
		{ time: '03:38:04', event: 'sector 7 beacon refresh', status: 'ok' },
		{ time: '03:31:55', event: 'thermal anomaly logged', status: 'warn' },
		{ time: '03:24:12', event: 'handshake with relay 9', status: 'ok' },
		{ time: '03:18:40', event: 'particle density spike', status: 'pend' },
		{ time: '03:12:07', event: 'calibration cycle 1847', status: 'ok' },
		{ time: '03:04:33', event: 'sector 4 unresponsive', status: 'fail' },
		{ time: '02:58:19', event: 'backup frequency locked', status: 'ok' }
	];

	const eventColumns = [
		{ key: 'time', label: 'time' },
		{ key: 'event', label: 'event' },
		{ key: 'status', label: 'status' }
	];

	const bootLines: { status: 'ok' | 'pend' | 'warn' | 'fail'; message: string }[] = [
		{ status: 'ok', message: 'observation array initialized' },
		{ status: 'ok', message: 'frequency lock acquired' },
		{ status: 'ok', message: 'telemetry streams active' },
		{ status: 'ok', message: 'thermal sensors calibrated' },
		{ status: 'pend', message: 'awaiting sector 4 response' }
	];

	onMount(() => {
		applyRegister('mission-control');

		intervalId = setInterval(() => {
			elapsed += 1;
		}, 1000);

		cycleId = setInterval(() => {
			cycleIndex = (cycleIndex + 1) % statuses.length;
			statusCycle = statuses[cycleIndex];
		}, 4000);

		elapsed = 3 * 3600 + 44 * 60 + 12;

		return () => {
			document.body.removeAttribute('data-register');
			if (intervalId) clearInterval(intervalId);
			if (cycleId) clearInterval(cycleId);
		};
	});
</script>

<div class="obs-deck">
	<Topbar class="obs-deck-topbar">
		{#snippet left()}
			<Stack direction="horizontal" gap="0.75rem" align="center">
				<StatusDot status={statusCycle} size={7} />
				<Text expression="readout" as="span">deep field observatory</Text>
			</Stack>
		{/snippet}
		{#snippet center()}
			<GlyphMark variant="reticle" size={16} color="var(--signal)" />
		{/snippet}
		{#snippet right()}
			<Stack direction="horizontal" gap="1rem" align="center">
				<Label color="muted">elapsed</Label>
				<Text expression="readout" as="span" color="signal">{elapsedFormatted()}</Text>
			</Stack>
		{/snippet}
	</Topbar>

	<div class="obs-deck-body">
		<aside class="obs-deck-sidebar">
			<SidebarNav items={navItems} />
			<Divider />
			<Stack direction="vertical" gap="0.5rem">
				<Alert variant="ok" title="particle density nominal">
					<Text expression="readout">within expected parameters for sector</Text>
				</Alert>
				<Alert variant="warn" title="sector 7 unresponsive">
					<Text expression="readout">last contact 26 minutes ago</Text>
				</Alert>
				<Alert variant="info" title="calibration window approaching">
					<Text expression="readout">next cycle in 14 minutes</Text>
				</Alert>
			</Stack>
			<div class="obs-deck-stream" aria-hidden="true">
				<DataStream active speed="slow" />
				<DataStream active speed="medium" />
			</div>
		</aside>

		<main class="obs-deck-main">
			<DepthStage perspective="mid" class="obs-deck-depth">
				<DepthLayer level="ground" class="obs-deck-horizon">
					<HorizonGrid rows={18} cols={10} vanishY={0.35} />
				</DepthLayer>

				<DepthLayer level="raised" class="obs-deck-content">
					<div class="obs-deck-metrics">
						<Grid cols={3} gap="0.75rem">
							{#each metricsData as m}
								<FloatCard tiltMax={4}>
									<div class="obs-deck-metric-inner">
										<Label color="muted">{m.label}</Label>
										<Text variant="heading" as="span" color="primary">{m.value}</Text>
									</div>
								</FloatCard>
							{/each}
						</Grid>
					</div>

					<DepthLayer level="ground" class="obs-deck-table-layer">
						<div class="obs-deck-table-section">
							<Text expression="chapter" as="span">recent events</Text>
							<Table columns={eventColumns} rows={eventLog} />
						</div>
					</DepthLayer>

					<div class="obs-deck-boot">
						<Text expression="chapter" as="span">initialization log</Text>
						<div class="obs-deck-boot-lines">
							{#each bootLines as line}
								<div class="obs-deck-boot-line">
									<span
										class="obs-deck-boot-glyph"
										style:color={line.status === 'ok'
											? 'var(--status-ok)'
											: line.status === 'pend'
												? 'var(--status-pend)'
												: line.status === 'warn'
													? 'var(--status-warn)'
													: 'var(--status-fail)'}
									>
										{line.status === 'ok'
											? '[ OK ]'
											: line.status === 'pend'
												? '[ .. ]'
												: line.status === 'warn'
													? '[WARN]'
													: '[FAIL]'}
									</span>
									<span class="obs-deck-boot-msg">{line.message}</span>
								</div>
							{/each}
						</div>
					</div>
				</DepthLayer>
			</DepthStage>
		</main>
	</div>
</div>

<style>
	.obs-deck {
		min-height: 100dvh;
		display: flex;
		flex-direction: column;
		background-color: var(--bg);
	}

	:global(.obs-deck-topbar) {
		flex-shrink: 0;
	}

	.obs-deck-body {
		display: grid;
		grid-template-columns: 220px 1fr;
		flex: 1;
		min-height: 0;
	}

	.obs-deck-sidebar {
		padding: 1.25rem 1rem;
		display: flex;
		flex-direction: column;
		gap: 1rem;
		border-right: 1px solid var(--line);
		overflow-y: auto;
	}

	.obs-deck-stream {
		display: flex;
		gap: 0.5rem;
		justify-content: center;
		margin-top: auto;
		padding-top: 1rem;
		opacity: 0.6;
	}

	.obs-deck-main {
		position: relative;
		overflow-y: auto;
		padding: 1.5rem;
	}

	:global(.obs-deck-depth) {
		min-height: 100%;
	}

	:global(.obs-deck-horizon) {
		position: absolute;
		inset: 0;
		opacity: 0.4;
		pointer-events: none;
	}

	:global(.obs-deck-content) {
		position: relative;
		display: flex;
		flex-direction: column;
		gap: 2rem;
	}

	.obs-deck-metric-inner {
		display: flex;
		flex-direction: column;
		gap: 0.25rem;
	}

	.obs-deck-table-section {
		display: flex;
		flex-direction: column;
		gap: 0.75rem;
	}

	.obs-deck-boot {
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
		border-left: 2px solid rgba(121, 166, 163, 0.14);
		padding-left: 1.25rem;
	}

	.obs-deck-boot-lines {
		display: flex;
		flex-direction: column;
		gap: 0.25rem;
	}

	.obs-deck-boot-line {
		display: flex;
		align-items: baseline;
		gap: 0.75rem;
		font-family: var(--font-mono);
		font-size: 0.82rem;
	}

	.obs-deck-boot-glyph {
		white-space: nowrap;
		flex-shrink: 0;
	}

	.obs-deck-boot-msg {
		color: var(--text-soft);
	}

	@media (max-width: 768px) {
		.obs-deck-body {
			grid-template-columns: 1fr;
		}

		.obs-deck-sidebar {
			display: none;
		}
	}
</style>
