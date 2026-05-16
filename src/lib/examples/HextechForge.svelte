<!--
  EXAMPLE: Hextech Forge
  REGISTER: hextech
  CONCEPT: a piltover forge station monitoring console — brass instruments, crystal energy cells, hex-grid schematics
  DEMONSTRATES: HexGrid, BrassFiligree, ArcaneVein, EnergyArc, CornerBrackets, MetricCard, Table, StatusDot, Tabs, Label, Text, applyRegister
  INSPIRED BY: the first hour of a shift on a Piltover engineering floor
-->
<script lang="ts">
	import {
		Text,
		Label,
		Badge,
		Divider,
		Stack,
		Grid,
		Card,
		Panel,
		MetricCard,
		Table,
		StatusDot,
		Tabs,
		CornerBrackets,
		HexGrid,
		BrassFiligree,
		ArcaneVein,
		EnergyArc,
		surface,
		applyRegister
	} from '../index.js';
	import { onMount } from 'svelte';

	const cells = [
		{ id: 'CELL-A1', charge: '94.2%', temp: '312 K', status: 'ok' as const, output: '8.4 kW' },
		{ id: 'CELL-A2', charge: '88.1%', temp: '318 K', status: 'ok' as const, output: '7.9 kW' },
		{ id: 'CELL-B1', charge: '71.4%', temp: '334 K', status: 'warn' as const, output: '6.1 kW' },
		{ id: 'CELL-B2', charge: '99.8%', temp: '308 K', status: 'ok' as const, output: '8.8 kW' },
		{ id: 'CELL-C1', charge: '45.3%', temp: '347 K', status: 'warn' as const, output: '3.8 kW' },
		{ id: 'CELL-C2', charge: '0.0%', temp: '— K', status: 'fail' as const, output: '0.0 kW' }
	];

	const cellColumns = [
		{ key: 'id', label: 'cell' },
		{ key: 'charge', label: 'charge' },
		{ key: 'temp', label: 'temp' },
		{ key: 'output', label: 'output' },
		{ key: 'status', label: 'status' }
	];

	const tabs = ['overview', 'schematics', 'maintenance'];
	let activeTab = $state('overview');

	onMount(() => {
		applyRegister('hextech');
		return () => applyRegister('field-notebook');
	});
</script>

<svelte:head>
	<title>hextech forge // hyvui</title>
</svelte:head>

<div class="forge-wrap">
	<div class="forge-hexgrid-host" aria-hidden="true">
		<HexGrid animated />
	</div>

	<div class="forge-shell">
		<!-- Top bar -->
		<header class="forge-header" use:surface>
			<BrassFiligree />
			<div class="forge-header-inner">
				<div class="forge-header-left">
					<StatusDot status="ok" size={7} />
					<Text expression="readout">FORGE STATION PILTOVER // SECTOR 4-DELTA</Text>
				</div>
				<div class="forge-header-right">
					<Label color="muted">shift 2 / day cycle</Label>
					<Label color="signal">ONLINE</Label>
					<a href="/" class="forge-back">← library</a>
				</div>
			</div>
		</header>

		<!-- Metrics row -->
		<div class="forge-metrics">
			<MetricCard label="total output" value="35.0 kW" trend="up" trendValue="+4.2%" />
			<MetricCard label="cells active" value="5 / 6" trend="neutral" trendValue="" />
			<MetricCard label="avg temp" value="323 K" trend="up" trendValue="+2 K" />
			<MetricCard label="uptime" value="99.3%" trend="up" trendValue="+0.1%" />
		</div>

		<Divider />

		<!-- Tab nav -->
		<Tabs tabs={tabs.map((t) => ({ id: t, label: t }))} active={activeTab} onchange={(id) => (activeTab = id)} />

		{#if activeTab === 'overview'}
			<div class="forge-content" use:surface={{ delay: 0 }}>
				<div class="forge-left">
					<div class="forge-panel-head">
						<Label color="accent">energy cell array</Label>
						<StatusDot status="warn" size={6} />
					</div>
					<Table columns={cellColumns} rows={cells} />
				</div>

				<div class="forge-right">
					<div class="forge-schematic" use:surface>
						<CornerBrackets size={16} color="rgba(93, 217, 240, 0.3)" />
						<div class="forge-schematic-inner">
							<Label color="muted">power conduit / sector 4</Label>
							<div class="forge-vein-wrap">
								<ArcaneVein x1="10%" y1="20%" x2="90%" y2="20%" />
								<ArcaneVein x1="10%" y1="50%" x2="90%" y2="50%" />
								<ArcaneVein x1="10%" y1="80%" x2="90%" y2="80%" />
								<EnergyArc x1="10%" y1="20%" x2="50%" y2="80%" />
							</div>
						</div>
					</div>

					<Stack gap="var(--space-sm)">
						<div class="forge-alert-row" use:surface={{ delay: 80 }}>
							<StatusDot status="warn" size={6} />
							<Label color="muted">CELL-B1 thermal variance above threshold</Label>
						</div>
						<div class="forge-alert-row" use:surface={{ delay: 140 }}>
							<StatusDot status="fail" size={6} />
							<Label color="muted">CELL-C2 offline — awaiting replacement crystal</Label>
						</div>
					</Stack>
				</div>
			</div>
		{:else if activeTab === 'schematics'}
			<div class="forge-content forge-content--center" use:surface={{ delay: 0 }}>
				<div class="forge-schematic forge-schematic--large" use:surface>
					<CornerBrackets size={20} color="rgba(93, 217, 240, 0.3)" />
					<div class="forge-schematic-inner">
						<Label color="muted">full-sector conduit map // v2.4</Label>
						<div class="forge-vein-large">
							<ArcaneVein x1="5%" y1="15%" x2="95%" y2="15%" />
							<ArcaneVein x1="5%" y1="40%" x2="95%" y2="40%" />
							<ArcaneVein x1="5%" y1="65%" x2="95%" y2="65%" />
							<ArcaneVein x1="5%" y1="88%" x2="95%" y2="88%" />
							<EnergyArc x1="20%" y1="15%" x2="80%" y2="88%" />
							<EnergyArc x1="50%" y1="15%" x2="20%" y2="65%" />
						</div>
					</div>
				</div>
			</div>
		{:else}
			<div class="forge-content" use:surface={{ delay: 0 }}>
				<Stack gap="var(--space-md)">
					<Text expression="readout">NEXT SCHEDULED MAINTENANCE // 2025.12.04 / 06:00</Text>
					<div class="forge-checklist">
						{#each ['inspect cell housings', 'calibrate output regulators', 'flush thermal vents', 'replace CELL-C2 crystal core', 'log to council registry'] as item}
							<div class="forge-checklist-item">
								<StatusDot status={item.includes('CELL-C2') ? 'pend' : 'ok'} size={6} />
								<Label color="muted">{item}</Label>
							</div>
						{/each}
					</div>
				</Stack>
			</div>
		{/if}
	</div>
</div>

<style>
	.forge-wrap {
		position: relative;
		min-height: 100dvh;
		background: var(--bg);
		overflow: hidden;
	}

	.forge-hexgrid-host {
		position: fixed;
		inset: 0;
		z-index: 0;
		pointer-events: none;
		opacity: 0.35;
	}

	.forge-shell {
		position: relative;
		z-index: 1;
		max-width: 80rem;
		margin: 0 auto;
		padding: var(--space-xl) var(--space-lg);
		display: flex;
		flex-direction: column;
		gap: var(--space-lg);
	}

	.forge-header {
		position: relative;
		padding: var(--space-md) var(--space-lg);
		border: 1px solid var(--line);
		background: var(--surface-card);
		overflow: hidden;
	}

	.forge-header-inner {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: var(--space-md);
	}

	.forge-header-left,
	.forge-header-right {
		display: flex;
		align-items: center;
		gap: var(--space-sm);
	}

	.forge-back {
		font-family: var(--font-mono);
		font-size: 0.72rem;
		letter-spacing: 0.1em;
		color: var(--muted);
		text-decoration: none;
		transition: color var(--transition-fast);
	}

	.forge-back:hover {
		color: var(--text);
	}

	.forge-metrics {
		display: grid;
		grid-template-columns: repeat(4, 1fr);
		gap: var(--space-sm);
	}

	.forge-content {
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: var(--space-lg);
		align-items: start;
	}

	.forge-content--center {
		grid-template-columns: 1fr;
	}

	.forge-left,
	.forge-right {
		display: flex;
		flex-direction: column;
		gap: var(--space-md);
	}

	.forge-panel-head {
		display: flex;
		align-items: center;
		gap: var(--space-sm);
	}

	.forge-schematic {
		position: relative;
		padding: var(--space-lg);
		border: 1px solid var(--line);
		background: var(--surface-panel);
		overflow: hidden;
	}

	.forge-schematic--large {
		min-height: 280px;
	}

	.forge-schematic-inner {
		display: flex;
		flex-direction: column;
		gap: var(--space-sm);
	}

	.forge-vein-wrap {
		position: relative;
		height: 120px;
	}

	.forge-vein-large {
		position: relative;
		height: 220px;
	}

	.forge-alert-row {
		display: flex;
		align-items: center;
		gap: var(--space-sm);
		padding: var(--space-sm);
		border: 1px solid var(--line);
		background: var(--surface-panel);
	}

	.forge-checklist {
		display: flex;
		flex-direction: column;
		gap: var(--space-xs);
	}

	.forge-checklist-item {
		display: flex;
		align-items: center;
		gap: var(--space-sm);
		padding: var(--space-xs) var(--space-sm);
		border-bottom: 1px solid var(--line);
	}

	@media (max-width: 768px) {
		.forge-metrics {
			grid-template-columns: repeat(2, 1fr);
		}

		.forge-content {
			grid-template-columns: 1fr;
		}

		.forge-shell {
			padding: var(--space-lg) var(--space-md);
		}
	}
</style>
