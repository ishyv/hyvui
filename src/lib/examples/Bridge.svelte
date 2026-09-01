<script lang="ts">
	import { onMount } from 'svelte';
	import {
		Shell,
		Stack,
		Cluster,
		Surface,
		Text,
		Divider,
		Cornerstone,
		Bracket,
		Glyph,
		Junction,
		Wire,
		Ticker,
		Badge,
		StatusDot,
		Sequence,
		KineticText
	} from '$lib/index.js';
	import { mountSceneAppearance } from './appearance.js';

	onMount(() => mountSceneAppearance('mission-control', 'hextech', 'interrogation'));

	/* time stamps & state — kept hardcoded so the scene has a fixed identity */
	const stamp = '02:18';

	const contacts = [
		{ id: 'PAULSEN-9', bearing: 240, range: 11.4, status: 'hold', kind: 'static' },
		{ id: 'KIRA-3', bearing: 187, range: 8.2, status: 'inbound', kind: 'moving' },
		{ id: 'OBS-RUN-7', bearing: 64, range: 22.1, status: 'drift', kind: 'moving' },
		{ id: 'KEEP-4', bearing: 312, range: 3.8, status: 'station', kind: 'static' },
		{ id: 'UNK-11', bearing: 121, range: 17.6, status: 'lost', kind: 'lost' }
	];

	const log = [
		{ t: '02:18', who: 'gren', msg: 'PAULSEN-9 still bearing 240. six hours unchanged.' },
		{ t: '02:14', who: 'fwd', msg: 'updraft cell SSW. holding altitude 4200.' },
		{ t: '02:09', who: 'gren', msg: 'KIRA-3 acknowledged. inbound nominal.' },
		{ t: '02:04', who: 'eng', msg: 'forward gyro back within tolerance. stop logging it.' },
		{ t: '01:51', who: 'gren', msg: 'OBS-RUN-7 drifting. signal weak. no comm.' }
	];

	const ticker = [
		`watch ${stamp} · officer gren · third deck`,
		'alt 4200ft · hdg 285 · wind 11kt SSW',
		'PAULSEN-9 bearing 240 · 11.4nmi · 06:02:17',
		'aux power nominal · forward gyro green · comms 4 of 4',
		'next briefing 04:00 · capt VEER on deck at 05:30'
	];

	function statusTone(s: string) {
		if (s === 'hold') return 'warn' as const;
		if (s === 'inbound') return 'ok' as const;
		if (s === 'drift') return 'pend' as const;
		if (s === 'lost') return 'fail' as const;
		return 'ok' as const;
	}
</script>

<div class="bridge">
	<Shell as="main" padY="var(--space-lg)">
		<Sequence stagger={0.05}>
			<!-- masthead -->
			<header class="masthead">
				<Cluster gap="var(--space-md)" align="baseline" justify="between">
					<Stack gap="var(--space-2xs)">
						<Cluster gap="var(--space-xs)" align="baseline">
							<Glyph name="reticle" size="14px" />
							<Text variant="caption" color="muted">hms anvil · bridge watch</Text>
						</Cluster>
						<KineticText text="night watch" mode="letter" as="h1" class="bridge-title" />
					</Stack>
					<Cluster gap="var(--space-lg)" align="baseline">
						<Stack gap="0" align="end">
							<Text variant="caption" color="muted">local</Text>
							<Text class="readout-big">{stamp}</Text>
						</Stack>
						<Wire direction="v" length="2rem" />
						<Stack gap="0" align="end">
							<Text variant="caption" color="muted">alt · hdg</Text>
							<Text class="readout-big">4200 · 285</Text>
						</Stack>
						<Wire direction="v" length="2rem" />
						<Stack gap="0" align="end">
							<Text variant="caption" color="muted">wind</Text>
							<Text class="readout-big">11kt SSW</Text>
						</Stack>
					</Cluster>
				</Cluster>
			</header>

			<!-- main grid -->
			<div class="grid">
				<!-- contacts -->
				<Surface variant="panel" class="panel contacts">
					<Cornerstone corner="tl" shape="nub" />
					<Cornerstone corner="tr" shape="nub" />
					<Cornerstone corner="bl" shape="nub" />
					<Cornerstone corner="br" shape="nub" />
					<Stack gap="var(--space-sm)">
						<Cluster gap="var(--space-xs)" justify="between">
							<Bracket style="square"><Text variant="caption" color="accent">contacts · 5</Text></Bracket>
							<Text variant="caption" color="muted">{stamp}</Text>
						</Cluster>
						<Divider pattern="dotted" />
						<Stack gap="var(--space-xs)">
							{#each contacts as c}
								<div class="contact">
									<StatusDot status={statusTone(c.status)} pulse={c.kind === 'moving'} size={7} />
									<span class="contact-id">{c.id}</span>
									<span class="contact-meta">{c.bearing.toString().padStart(3, '0')}° · {c.range}nmi</span>
									<span class="contact-status">{c.status}</span>
								</div>
							{/each}
						</Stack>
						<Divider pattern="solid" strength="default" />
						<Text variant="caption" color="muted">
							PAULSEN-9 holds bearing 240. no change in 06:02:17.
						</Text>
					</Stack>
				</Surface>

				<!-- horizon / radar / persistent contact -->
				<Surface variant="panel" class="panel radar">
					<Cornerstone corner="tl" shape="nub" />
					<Cornerstone corner="tr" shape="nub" />
					<Cornerstone corner="bl" shape="nub" />
					<Cornerstone corner="br" shape="nub" />
					<div class="radar-inner">
						<svg viewBox="0 0 200 200" class="radar-svg" aria-hidden="true">
							<!-- range rings -->
							<circle cx="100" cy="100" r="30" fill="none" stroke="currentColor" stroke-width="0.4" opacity="0.5" />
							<circle cx="100" cy="100" r="60" fill="none" stroke="currentColor" stroke-width="0.4" opacity="0.4" />
							<circle cx="100" cy="100" r="90" fill="none" stroke="currentColor" stroke-width="0.4" opacity="0.3" />
							<!-- bearing axis -->
							<line x1="100" y1="10" x2="100" y2="190" stroke="currentColor" stroke-width="0.3" opacity="0.3" />
							<line x1="10" y1="100" x2="190" y2="100" stroke="currentColor" stroke-width="0.3" opacity="0.3" />
							<!-- sweep -->
							<line x1="100" y1="100" x2="100" y2="10" stroke="currentColor" stroke-width="1.2" opacity="0.7" class="sweep" />
							<!-- contact pips -->
							<line x1="100" y1="100" x2="26" y2="148" stroke="var(--accent)" stroke-width="1" opacity="0.9" class="primary-bearing" />
							<circle data-bridge-contact="PAULSEN-9" data-bearing="240" cx="26" cy="148" r="3" fill="var(--accent)" opacity="0.9" />
							<text x="34" y="160" font-size="6" fill="var(--accent)" font-family="var(--font-mono)" text-anchor="start">PAULSEN-9</text>
							<circle cx="62" cy="118" r="2" fill="currentColor" opacity="0.7" class="moving-pip" />
							<circle cx="138" cy="142" r="2" fill="currentColor" opacity="0.6" class="moving-pip" />
							<circle cx="74" cy="56" r="1.5" fill="currentColor" opacity="0.4" />
							<!-- compass marks -->
							<text x="100" y="6" font-size="5" text-anchor="middle" fill="currentColor" opacity="0.6">N</text>
							<text x="194" y="103" font-size="5" text-anchor="middle" fill="currentColor" opacity="0.6">E</text>
							<text x="100" y="198" font-size="5" text-anchor="middle" fill="currentColor" opacity="0.6">S</text>
							<text x="6" y="103" font-size="5" text-anchor="middle" fill="currentColor" opacity="0.6">W</text>
						</svg>
						<div class="radar-overlay">
							<Text variant="caption" color="muted">sweep · 4.0nmi/div</Text>
							<Cluster gap="var(--space-xs)" align="baseline">
								<Junction type="cross" size="12px" />
								<Text variant="caption" color="accent">PAULSEN-9 · 240° · 11.4nmi · static</Text>
							</Cluster>
						</div>
					</div>
				</Surface>

				<!-- comm log -->
				<Surface variant="panel" class="panel log">
					<Cornerstone corner="tl" shape="nub" />
					<Cornerstone corner="tr" shape="nub" />
					<Cornerstone corner="bl" shape="nub" />
					<Cornerstone corner="br" shape="nub" />
					<Stack gap="var(--space-sm)">
						<Cluster gap="var(--space-xs)" justify="between">
							<Bracket style="square"><Text variant="caption" color="accent">comm log</Text></Bracket>
							<Badge variant="signal">live</Badge>
						</Cluster>
						<Divider pattern="dotted" />
						<Stack gap="var(--space-2xs)">
							{#each log as entry}
								<div class="log-entry">
									<span class="log-time">{entry.t}</span>
									<span class="log-who">{entry.who}</span>
									<span class="log-msg">{entry.msg}</span>
								</div>
							{/each}
						</Stack>
					</Stack>
				</Surface>
			</div>

			<!-- footer ticker -->
			<div class="footer">
				<Ticker items={ticker} speed="slow" />
			</div>
		</Sequence>
	</Shell>
</div>

<style>
	.bridge {
		min-height: 100dvh;
		background:
			radial-gradient(ellipse at 70% 0%, color-mix(in srgb, var(--signal) 6%, transparent), transparent 60%),
			radial-gradient(ellipse at 30% 100%, color-mix(in srgb, var(--accent) 4%, transparent), transparent 60%);
	}
	.masthead {
		padding-block: var(--space-md) var(--space-lg);
	}
	:global(.bridge-title) {
		font-family: var(--font-mono);
		font-size: var(--text-3xl);
		letter-spacing: 0.18em;
		text-transform: uppercase;
		font-weight: 400;
		line-height: 0.95;
		color: var(--text);
	}
	:global(.readout-big) {
		font-family: var(--font-mono);
		font-size: var(--text-xl);
		letter-spacing: 0.08em;
		color: var(--text);
	}

	.grid {
		display: grid;
		grid-template-columns: minmax(260px, 1fr) minmax(360px, 2fr) minmax(280px, 1.2fr);
		gap: var(--space-md);
		margin-block: var(--space-md) var(--space-lg);
	}
	@media (max-width: 64rem) {
		.grid {
			grid-template-columns: 1fr;
		}
	}

	:global(.panel) {
		position: relative;
		padding: var(--space-md);
		min-height: 18rem;
	}

	.contact {
		display: grid;
		grid-template-columns: auto 6rem 1fr auto;
		align-items: center;
		gap: var(--space-xs);
		font-family: var(--font-mono);
		font-size: var(--text-xs);
		padding-block: 2px;
	}
	.contact-id { color: var(--text); letter-spacing: 0.06em; }
	.contact-meta { color: var(--muted); }
	.contact-status {
		color: var(--muted-strong);
		text-transform: uppercase;
		letter-spacing: 0.14em;
		font-size: var(--text-2xs);
	}

	.radar-inner {
		position: relative;
		display: flex;
		flex-direction: column;
		gap: var(--space-sm);
	}
	.radar-svg {
		width: 100%;
		aspect-ratio: 1;
		color: var(--signal);
	}
	.sweep {
		transform-origin: 100px 100px;
		animation: bridge-sweep 6s linear infinite;
	}
	.moving-pip {
		animation: bridge-pip 2.4s var(--ease-smooth) infinite;
	}
	.radar-overlay {
		display: flex;
		flex-direction: column;
		gap: var(--space-2xs);
		padding-top: var(--space-xs);
		border-top: 1px solid var(--line);
	}
	@keyframes bridge-sweep {
		from { transform: rotate(0deg); }
		to   { transform: rotate(360deg); }
	}
	@keyframes bridge-pip {
		0%, 100% { opacity: 0.4; }
		50%      { opacity: 0.95; }
	}

	.log-entry {
		display: grid;
		grid-template-columns: 3.2rem 2.6rem 1fr;
		align-items: baseline;
		gap: var(--space-xs);
		font-family: var(--font-mono);
		font-size: var(--text-xs);
		line-height: 1.45;
		padding-block: 1px;
	}
	.log-time { color: var(--muted-strong); letter-spacing: 0.08em; }
	.log-who {
		color: var(--accent);
		text-transform: uppercase;
		letter-spacing: 0.14em;
		font-size: var(--text-2xs);
	}
	.log-msg { color: var(--text-soft); }

	.footer { margin-top: var(--space-md); }

	@media (prefers-reduced-motion: reduce) {
		.sweep, .moving-pip { animation: none; }
	}
</style>
