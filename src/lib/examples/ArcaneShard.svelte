<!--
  EXAMPLE: Arcane Shard
  REGISTER: arcane
  CONCEPT: a zaun research log — unstable readings, shimmer contamination, barely contained data
  DEMONSTRATES: CrystalShard, ArcaneVein, ShimmerCloud, SignalRing, NarrativeScene, Panel, Text expressions, applyRegister
  INSPIRED BY: a contaminated field report from beneath the undercity
-->
<script lang="ts">
	import {
		Text,
		Label,
		Badge,
		Divider,
		Stack,
		Panel,
		Card,
		StatusDot,
		StatusLine,
		SignalRing,
		NarrativeScene,
		CrystalShard,
		ArcaneVein,
		ShimmerCloud,
		surface,
		applyRegister
	} from '../index.js';
	import { onMount } from 'svelte';

	const readings = [
		{ ts: '04:12:08', signal: '0.003', status: 'baseline' },
		{ ts: '04:14:33', signal: '0.047', status: 'elevated' },
		{ ts: '04:18:51', signal: '0.214', status: 'elevated' },
		{ ts: '04:22:19', signal: '1.880', status: 'breach' },
		{ ts: '04:23:44', signal: '—', status: 'sensor lost' },
		{ ts: '04:31:02', signal: '0.009', status: 'resuming' }
	];

	let glitchPhase = $state(false);
	let intervalId: ReturnType<typeof setInterval> | undefined;

	onMount(() => {
		applyRegister('arcane');

		intervalId = setInterval(() => {
			glitchPhase = !glitchPhase;
		}, 3800);

		return () => {
			clearInterval(intervalId);
			applyRegister('field-notebook');
		};
	});
</script>

<svelte:head>
	<title>arcane shard // hyvui</title>
</svelte:head>

<div class="shard-wrap">
	<div class="shard-shimmer-host" aria-hidden="true">
		<ShimmerCloud count={40} />
	</div>

	<div class="shard-shell">
		<!-- Masthead -->
		<header class="shard-header" use:surface>
			<div class="shard-header-top">
				<Text expression="readout">RESEARCH LOG // UNDERCITY SECTOR 7 // CLASSIFIED</Text>
				<a href="/" class="shard-back">← library</a>
			</div>
			<div class="shard-header-status">
				<StatusDot status="warn" size={7} />
				<Label color="muted">shimmer contamination detected</Label>
				<span class="shard-sep" aria-hidden="true">//</span>
				<Label color="muted">data integrity uncertain</Label>
			</div>
		</header>

		<ArcaneVein x1="0%" y1="0%" x2="100%" y2="0%" class="shard-divider-vein" />

		<!-- Main body -->
		<div class="shard-body">
			<!-- Left: narrative -->
			<div class="shard-narrative" use:surface={{ delay: 0 }}>
				<div class="shard-lede">
					<Text expression="title-card" class={glitchPhase ? 'shard-glitch' : ''}>
						something leaked through
					</Text>
				</div>
				<Text expression="manifesto">
					the shimmer doesn't ask. it rewrites what it touches. six instruments failed before
					we understood what we were measuring. the seventh survived — barely.
				</Text>

				<Divider />

				<Stack gap="var(--space-md)">
					<div use:surface={{ delay: 80 }}>
						<Label color="accent">anomaly log / 2025.11.22 / 04:12–04:31</Label>
						<div class="shard-log">
							{#each readings as r}
								<div class="shard-log-row" class:shard-log-row--breach={r.status === 'breach'} class:shard-log-row--lost={r.status === 'sensor lost'}>
									<span class="shard-log-ts">{r.ts}</span>
									<span class="shard-log-signal">{r.signal}</span>
									<span class="shard-log-status">{r.status}</span>
								</div>
							{/each}
						</div>
					</div>

					<div use:surface={{ delay: 160 }}>
						<Text expression="whisper">
							instruments 1 through 5 showed the same thing. instrument 6 showed nothing.
							instrument 7 showed too much.
						</Text>
					</div>
				</Stack>
			</div>

			<!-- Right: visual artifacts -->
			<div class="shard-artifacts">
				<div class="shard-shard-cluster" use:surface={{ delay: 40 }}>
					<div class="shard-cluster-inner">
						<SignalRing size={160} color="var(--arc-magenta, #b845c9)" class="shard-ring" />
						<div class="shard-shards">
							<CrystalShard size={90} class="shard-crystal shard-crystal--main" />
							<CrystalShard size={42} class="shard-crystal shard-crystal--sm1" />
							<CrystalShard size={28} class="shard-crystal shard-crystal--sm2" />
						</div>
					</div>
					<Label color="muted">shimmer crystal fragment // specimen 7-C</Label>
				</div>

				<div class="shard-conduit" use:surface={{ delay: 120 }}>
					<Label color="muted">vein trace // wall segment B</Label>
					<div class="shard-conduit-canvas">
						<ArcaneVein x1="10%" y1="90%" x2="90%" y2="10%" />
						<ArcaneVein x1="5%" y1="60%" x2="65%" y2="20%" />
					</div>
				</div>

				<div class="shard-status-panel" use:surface={{ delay: 200 }}>
					<StatusLine status="warn" message="contamination level / elevated" visible={true} />
					<StatusLine status="ok" message="instrument 7 / operational" visible={true} />
					<StatusLine status="fail" message="containment / breached" visible={true} />
					<StatusLine status="pend" message="recovery status / in progress" visible={true} />
				</div>
			</div>
		</div>

		<ArcaneVein x1="0%" y1="100%" x2="100%" y2="100%" class="shard-divider-vein" />

		<footer class="shard-footer">
			<Text expression="readout">END OF LOG // further entries pending instrument recovery</Text>
		</footer>
	</div>
</div>

<style>
	.shard-wrap {
		position: relative;
		min-height: 100dvh;
		background: var(--bg);
		overflow: hidden;
	}

	.shard-shimmer-host {
		position: fixed;
		inset: 0;
		z-index: 0;
		pointer-events: none;
	}

	.shard-shell {
		position: relative;
		z-index: 1;
		max-width: 72rem;
		margin: 0 auto;
		padding: var(--space-xl) var(--space-lg);
		display: flex;
		flex-direction: column;
		gap: var(--space-lg);
	}

	.shard-header {
		padding: var(--space-md) var(--space-lg);
		border: 1px solid var(--line);
		background: var(--surface-panel);
		display: flex;
		flex-direction: column;
		gap: var(--space-xs);
	}

	.shard-header-top {
		display: flex;
		align-items: center;
		justify-content: space-between;
	}

	.shard-header-status {
		display: flex;
		align-items: center;
		gap: var(--space-sm);
	}

	.shard-sep {
		font-family: var(--font-mono);
		color: var(--muted);
		font-size: 0.72rem;
	}

	.shard-back {
		font-family: var(--font-mono);
		font-size: 0.72rem;
		letter-spacing: 0.1em;
		color: var(--muted);
		text-decoration: none;
		transition: color var(--transition-fast);
	}

	.shard-back:hover {
		color: var(--text);
	}

	:global(.shard-divider-vein) {
		height: 2px;
		position: relative;
	}

	.shard-body {
		display: grid;
		grid-template-columns: 1.2fr 1fr;
		gap: var(--space-xl);
		align-items: start;
	}

	.shard-narrative {
		display: flex;
		flex-direction: column;
		gap: var(--space-lg);
	}

	.shard-lede {
		position: relative;
	}

	:global(.shard-glitch) {
		animation: shard-glitch 0.18s steps(2) both;
	}

	@keyframes shard-glitch {
		0% { transform: translate(0); filter: none; }
		25% { transform: translate(-2px, 1px); filter: hue-rotate(40deg); }
		50% { transform: translate(2px, -1px); filter: hue-rotate(-40deg); }
		75% { transform: translate(-1px, 0); filter: none; }
		100% { transform: translate(0); }
	}

	.shard-log {
		display: flex;
		flex-direction: column;
		margin-top: var(--space-sm);
		font-family: var(--font-mono);
		font-size: 0.78rem;
	}

	.shard-log-row {
		display: grid;
		grid-template-columns: 6ch 6ch 1fr;
		gap: var(--space-sm);
		padding: 0.35em 0;
		border-bottom: 1px solid var(--line);
		color: var(--muted);
	}

	.shard-log-row--breach {
		color: var(--arc-shimmer, #e94cbc);
	}

	.shard-log-row--lost {
		opacity: 0.45;
		font-style: italic;
	}

	.shard-log-ts { color: var(--muted-strong); }
	.shard-log-signal { color: var(--text); }

	.shard-artifacts {
		display: flex;
		flex-direction: column;
		gap: var(--space-lg);
	}

	.shard-shard-cluster {
		display: flex;
		flex-direction: column;
		gap: var(--space-sm);
		padding: var(--space-lg);
		border: 1px solid var(--line);
		background: var(--surface-panel);
	}

	.shard-cluster-inner {
		position: relative;
		height: 200px;
		display: flex;
		align-items: center;
		justify-content: center;
	}

	:global(.shard-ring) {
		position: absolute;
		top: 50%;
		left: 50%;
		transform: translate(-50%, -50%);
		opacity: 0.4;
	}

	.shard-shards {
		position: relative;
		display: flex;
		align-items: flex-end;
		gap: var(--space-xs);
	}

	.shard-conduit {
		display: flex;
		flex-direction: column;
		gap: var(--space-sm);
		padding: var(--space-md);
		border: 1px solid var(--line);
		background: var(--surface-panel);
	}

	.shard-conduit-canvas {
		position: relative;
		height: 100px;
	}

	.shard-status-panel {
		display: flex;
		flex-direction: column;
		gap: var(--space-xs);
		padding: var(--space-md);
		border: 1px solid var(--line);
		background: var(--surface-panel);
	}

	.shard-footer {
		text-align: center;
		padding: var(--space-md) 0;
		opacity: 0.55;
	}

	@media (max-width: 768px) {
		.shard-body {
			grid-template-columns: 1fr;
		}

		.shard-shell {
			padding: var(--space-lg) var(--space-md);
		}
	}
</style>
