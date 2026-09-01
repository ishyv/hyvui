<script lang="ts">
	import { onMount } from 'svelte';
	import ShowcaseShell from '$lib/showcase/ShowcaseShell.svelte';
	import { getShowcaseManifest } from '$lib/showcase/showcaseManifest.js';
	import {
		Text,
		Glyph,
		Cluster,
		Stack,
		Bracket,
		BrassFiligree,
		Sequence,
		KineticText
	} from '$lib/index.js';
	import { mountSceneAppearance } from '$lib/examples/appearance.js';

	onMount(() => mountSceneAppearance('mission-control', 'hextech', 'interrogation'));

	const manifest = getShowcaseManifest('hextech');

	const readings = [
		{ label: 'core resonance', value: '847.2', unit: 'hz', state: 'nominal' },
		{ label: 'chamber pressure', value: '4.18', unit: 'atm', state: 'nominal' },
		{ label: 'coolant flow', value: '2.4', unit: 'gpm', state: 'nominal' },
		{ label: 'crystal integrity', value: '99.4', unit: '%', state: 'nominal' },
		{ label: 'feedback loop', value: '0.012', unit: 'σ', state: 'caution' },
		{ label: 'output draw', value: '12.7', unit: 'kw', state: 'nominal' }
	];

	const log = [
		{ t: '03:14:08', msg: 'ignition cycle 04. crystal locked.' },
		{ t: '03:14:11', msg: 'coolant primary online. pressure stable.' },
		{ t: '03:14:14', msg: 'feedback nominal. holding for ten seconds.' },
		{ t: '03:14:24', msg: 'hold released. ramping to 60%.' },
		{ t: '03:14:31', msg: 'output 12.7kw. steady.' }
	];
</script>

<svelte:head>
	<title>rig iv · hextech workshops</title>
</svelte:head>

<ShowcaseShell manifest={manifest!}>
	<main class="forge">
	<!-- riveted brass plate background — entire page reads as machined metal -->
	<div class="plate" aria-hidden="true">
		<svg viewBox="0 0 100 100" preserveAspectRatio="xMidYMid slice" class="rivets">
			<defs>
				<pattern id="rivet-grid" x="0" y="0" width="6" height="6" patternUnits="userSpaceOnUse">
					<circle cx="0.4" cy="0.4" r="0.18" fill="currentColor" opacity="0.4" />
				</pattern>
			</defs>
			<rect width="100" height="100" fill="url(#rivet-grid)" />
		</svg>
	</div>

	<Sequence stagger={0.08}>
		<!-- masthead — brass nameplate -->
		<header class="nameplate">
			<div class="nameplate-rule" aria-hidden="true"></div>
			<Cluster gap="var(--space-lg)" align="center" justify="between">
				<Cluster gap="var(--space-xs)" align="baseline">
					<Glyph name="hex-rune-a" size="14px" />
					<Text variant="caption" color="muted">vaud-halan workshops · rig iv · floor c</Text>
				</Cluster>
				<KineticText text="ignition · 03:14" mode="letter" as="h1" class="nameplate-title" />
				<Cluster gap="var(--space-xs)" align="baseline">
					<Text variant="caption" color="muted">operator · m. veld · 12y cert</Text>
					<Glyph name="gem-cut" size="14px" />
				</Cluster>
			</Cluster>
			<div class="nameplate-rule" aria-hidden="true"></div>
		</header>

		<!-- main three-column: blueprint · mechanism · readings -->
		<div class="bay">
			<!-- left: blueprint plate -->
			<aside class="blueprint">
				<div class="brass-corner brass-tl"><BrassFiligree size={56} /></div>
				<div class="brass-corner brass-bl"><BrassFiligree size={56} /></div>

				<Stack gap="var(--space-md)">
					<Cluster gap="var(--space-xs)" justify="between" align="baseline">
						<Bracket style="square"><Text variant="caption" color="accent">schematic</Text></Bracket>
						<Text variant="caption" color="muted">drwg. iv-c · rev 7</Text>
					</Cluster>

					<svg viewBox="0 0 200 260" class="schematic-svg" aria-hidden="true">
						<rect x="6" y="6" width="188" height="248" fill="none" stroke="currentColor" stroke-width="0.4" opacity="0.5" />
						<rect x="14" y="14" width="172" height="232" fill="none" stroke="currentColor" stroke-width="0.25" opacity="0.4" />

						<!-- pipe top + valve -->
						<rect x="92" y="14" width="16" height="42" fill="none" stroke="currentColor" stroke-width="0.6" />
						<rect x="88" y="50" width="24" height="6" fill="currentColor" opacity="0.3" />
						<circle cx="100" cy="32" r="6" fill="none" stroke="currentColor" stroke-width="0.6" />
						<line x1="93" y1="32" x2="107" y2="32" stroke="currentColor" stroke-width="0.6" />
						<line x1="100" y1="25" x2="100" y2="39" stroke="currentColor" stroke-width="0.6" />

						<!-- crystal chamber hex -->
						<polygon points="100,68 144,92 144,140 100,164 56,140 56,92" fill="none" stroke="currentColor" stroke-width="1" />
						<polygon points="100,80 132,98 132,134 100,152 68,134 68,98" fill="none" stroke="currentColor" stroke-width="0.4" opacity="0.5" />
						<polygon class="schematic-pulse" points="100,94 122,106 122,128 100,140 78,128 78,106" fill="currentColor" opacity="0.4" />

						<!-- gears -->
						<circle cx="36" cy="116" r="14" fill="none" stroke="currentColor" stroke-width="0.6" />
						<circle cx="36" cy="116" r="9" fill="none" stroke="currentColor" stroke-width="0.4" />
						{#each Array(8) as _, i}
							<rect x="35" y="100" width="2" height="3" transform="rotate({i * 45} 36 116)" fill="currentColor" opacity="0.7" />
						{/each}
						<circle cx="164" cy="116" r="14" fill="none" stroke="currentColor" stroke-width="0.6" />
						<circle cx="164" cy="116" r="9" fill="none" stroke="currentColor" stroke-width="0.4" />
						{#each Array(8) as _, i}
							<rect x="163" y="100" width="2" height="3" transform="rotate({i * 45} 164 116)" fill="currentColor" opacity="0.7" />
						{/each}

						<!-- pipe bottom -->
						<rect x="92" y="176" width="16" height="62" fill="none" stroke="currentColor" stroke-width="0.6" />
						<rect x="88" y="176" width="24" height="6" fill="currentColor" opacity="0.3" />
						<circle cx="100" cy="210" r="6" fill="none" stroke="currentColor" stroke-width="0.6" />
						<line x1="93" y1="210" x2="107" y2="210" stroke="currentColor" stroke-width="0.6" />

						<!-- annotations -->
						<text x="156" y="32" font-size="4" fill="currentColor" font-family="var(--font-mono)" opacity="0.7">A</text>
						<text x="156" y="118" font-size="4" fill="currentColor" font-family="var(--font-mono)" opacity="0.7">B</text>
						<text x="156" y="210" font-size="4" fill="currentColor" font-family="var(--font-mono)" opacity="0.7">C</text>

						<!-- corner crosshairs -->
						{#each [[14, 14], [186, 14], [14, 246], [186, 246]] as [x, y]}
							<line x1={x - 3} y1={y} x2={x + 3} y2={y} stroke="currentColor" stroke-width="0.4" />
							<line x1={x} y1={y - 3} x2={x} y2={y + 3} stroke="currentColor" stroke-width="0.4" />
						{/each}
					</svg>

					<Stack gap="var(--space-2xs)">
						<Text variant="caption" color="muted">A · aux ether feed · 6mm brass</Text>
						<Text variant="caption" color="muted">B · drive train · 14:1, oiled weekly</Text>
						<Text variant="caption" color="muted">C · return line · loops to reservoir</Text>
					</Stack>
				</Stack>
			</aside>

			<!-- center: the working mechanism -->
			<section class="mechanism">
				<div class="brass-corner brass-tl"><BrassFiligree size={72} /></div>
				<div class="brass-corner brass-tr"><BrassFiligree size={72} /></div>
				<div class="brass-corner brass-bl"><BrassFiligree size={72} /></div>
				<div class="brass-corner brass-br"><BrassFiligree size={72} /></div>

				<svg viewBox="0 0 300 380" class="rig-svg" aria-hidden="true">
					<defs>
						<linearGradient id="brass-fill" x1="0" y1="0" x2="0" y2="1">
							<stop offset="0%" stop-color="#3a2a14" />
							<stop offset="50%" stop-color="#1a120a" />
							<stop offset="100%" stop-color="#0a0805" />
						</linearGradient>
						<radialGradient id="crystal-fill" cx="50%" cy="50%" r="50%">
							<stop offset="0%" stop-color="#a5e8f0" stop-opacity="0.95" />
							<stop offset="50%" stop-color="#5dd9f0" stop-opacity="0.8" />
							<stop offset="100%" stop-color="#1a8aa8" stop-opacity="0.4" />
						</radialGradient>
						<filter id="crystal-glow">
							<feGaussianBlur stdDeviation="4" />
						</filter>
					</defs>

					<!-- back plate -->
					<rect x="12" y="20" width="276" height="340" fill="url(#brass-fill)" stroke="currentColor" stroke-width="1.5" />
					{#each [[22, 30], [278, 30], [22, 350], [278, 350], [22, 110], [278, 110], [22, 190], [278, 190], [22, 270], [278, 270]] as [x, y]}
						<circle cx={x} cy={y} r="2.2" fill="#5a4520" stroke="currentColor" stroke-width="0.4" />
					{/each}

					<!-- upper crossbar with valve -->
					<rect x="50" y="46" width="200" height="8" fill="#3a2a14" stroke="currentColor" stroke-width="0.6" />
					<circle cx="150" cy="50" r="9" fill="#1a120a" stroke="currentColor" stroke-width="0.8" />
					<line x1="138" y1="50" x2="162" y2="50" stroke="currentColor" stroke-width="1" />
					<line x1="150" y1="38" x2="150" y2="62" stroke="currentColor" stroke-width="1" />
					<rect x="142" y="50" width="16" height="34" fill="#3a2a14" stroke="currentColor" stroke-width="0.6" />
					<rect x="138" y="80" width="24" height="6" fill="#5a4520" stroke="currentColor" stroke-width="0.4" />

					<!-- the hex chamber -->
					<g transform="translate(150 200)">
						<polygon points="0,-66 57,-33 57,33 0,66 -57,33 -57,-33"
							fill="#2a1d0e" stroke="currentColor" stroke-width="1.4" />
						<polygon points="0,-54 47,-27 47,27 0,54 -47,27 -47,-27"
							fill="#1a120a" stroke="currentColor" stroke-width="0.6" />
						<g class="crystal-core" filter="url(#crystal-glow)">
							<polygon points="0,-42 36,-21 36,21 0,42 -36,21 -36,-21" fill="url(#crystal-fill)" />
						</g>
						<polygon points="0,-32 28,-16 28,16 0,32 -28,16 -28,-16"
							fill="none" stroke="#a5e8f0" stroke-width="0.6" opacity="0.7" />
						<polygon points="0,-22 19,-11 19,11 0,22 -19,11 -19,-11"
							fill="#5dd9f0" opacity="0.85" class="crystal-inner" />
						{#each [[0, -66], [57, -33], [57, 33], [0, 66], [-57, 33], [-57, -33]] as [x, y]}
							<circle cx={x} cy={y} r="3" fill="#5a4520" stroke="currentColor" stroke-width="0.6" />
							<circle cx={x} cy={y} r="1" fill="currentColor" opacity="0.6" />
						{/each}
					</g>

					<!-- gears -->
					<g class="gear-cw">
						<circle cx="60" cy="200" r="26" fill="#2a1d0e" stroke="currentColor" stroke-width="0.8" />
						<circle cx="60" cy="200" r="18" fill="#1a120a" stroke="currentColor" stroke-width="0.5" />
						<circle cx="60" cy="200" r="4" fill="#5a4520" stroke="currentColor" stroke-width="0.6" />
						{#each Array(12) as _, i}
							<rect x="58.5" y="170" width="3" height="6" transform="rotate({i * 30} 60 200)" fill="#3a2a14" stroke="currentColor" stroke-width="0.4" />
						{/each}
					</g>
					<g class="gear-ccw">
						<circle cx="240" cy="200" r="26" fill="#2a1d0e" stroke="currentColor" stroke-width="0.8" />
						<circle cx="240" cy="200" r="18" fill="#1a120a" stroke="currentColor" stroke-width="0.5" />
						<circle cx="240" cy="200" r="4" fill="#5a4520" stroke="currentColor" stroke-width="0.6" />
						{#each Array(12) as _, i}
							<rect x="238.5" y="170" width="3" height="6" transform="rotate({i * 30} 240 200)" fill="#3a2a14" stroke="currentColor" stroke-width="0.4" />
						{/each}
					</g>

					<!-- coolant pipes -->
					<line x1="86" y1="200" x2="93" y2="200" stroke="currentColor" stroke-width="2" />
					<line x1="207" y1="200" x2="214" y2="200" stroke="currentColor" stroke-width="2" />

					<!-- lower return -->
					<rect x="142" y="316" width="16" height="32" fill="#3a2a14" stroke="currentColor" stroke-width="0.6" />
					<rect x="138" y="314" width="24" height="6" fill="#5a4520" stroke="currentColor" stroke-width="0.4" />
					<circle cx="150" cy="332" r="9" fill="#1a120a" stroke="currentColor" stroke-width="0.8" />
					<line x1="138" y1="332" x2="162" y2="332" stroke="currentColor" stroke-width="1" />
					<line x1="150" y1="320" x2="150" y2="344" stroke="currentColor" stroke-width="1" />

					<!-- diagnostic LEDs -->
					{#each Array(8) as _, i}
						<circle cx={66 + i * 24} cy="364" r="3" fill={i < 6 ? '#5dd9f0' : '#3a2a14'} class={i < 6 ? 'led-on' : ''} stroke="currentColor" stroke-width="0.4" />
					{/each}

					<!-- steam puffs -->
					<g class="steam steam-1">
						<circle cx="150" cy="44" r="6" fill="#5dd9f0" opacity="0.18" />
					</g>
					<g class="steam steam-2">
						<circle cx="150" cy="44" r="9" fill="#5dd9f0" opacity="0.12" />
					</g>
				</svg>

				<div class="ignition-label">
					<Text variant="caption" color="signal">cycle 04 · holding 60%</Text>
				</div>
			</section>

			<!-- right: readings + log -->
			<aside class="readings">
				<Stack gap="var(--space-md)">
					<section class="vitals">
						<Cluster gap="var(--space-xs)" justify="between" align="baseline">
							<Bracket style="square"><Text variant="caption" color="accent">vitals</Text></Bracket>
							<Text variant="caption" color="muted">live · 1hz poll</Text>
						</Cluster>
						<div class="vitals-grid">
							{#each readings as r}
								<div class="vital" class:vital-caution={r.state === 'caution'}>
									<Text variant="caption" color="muted">{r.label}</Text>
									<div class="vital-row">
										<span class="vital-val">{r.value}</span>
										<span class="vital-unit">{r.unit}</span>
									</div>
									<div class="vital-bar"><div class="vital-fill" style:width={r.state === 'caution' ? '28%' : '74%'}></div></div>
								</div>
							{/each}
						</div>
					</section>

					<section class="gauge-wrap">
						<Cluster gap="var(--space-xs)" align="baseline">
							<Bracket style="square"><Text variant="caption" color="accent">pressure</Text></Bracket>
							<Text variant="caption" color="muted">atm · 0 to 10</Text>
						</Cluster>
						<svg viewBox="0 0 200 120" class="gauge-svg" aria-hidden="true">
							<path d="M 20 100 A 80 80 0 0 1 180 100" fill="none" stroke="currentColor" stroke-width="1" opacity="0.6" />
							{#each Array(11) as _, i}
								{@const angle = -180 + (i * 18)}
								{@const rad = (angle * Math.PI) / 180}
								{@const x1 = 100 + Math.cos(rad) * 72}
								{@const y1 = 100 + Math.sin(rad) * 72}
								{@const x2 = 100 + Math.cos(rad) * (i % 5 === 0 ? 60 : 66)}
								{@const y2 = 100 + Math.sin(rad) * (i % 5 === 0 ? 60 : 66)}
								<line {x1} {y1} {x2} {y2} stroke="currentColor" stroke-width={i % 5 === 0 ? 1 : 0.5} opacity="0.7" />
							{/each}
							<path d="M 20 100 A 80 80 0 0 1 50 32" fill="none" stroke="var(--status-warn)" stroke-width="3" opacity="0.6" />
							<path d="M 150 32 A 80 80 0 0 1 180 100" fill="none" stroke="var(--status-warn)" stroke-width="3" opacity="0.6" />
							<line x1="100" y1="100" x2={100 + Math.cos((-105 * Math.PI) / 180) * 64} y2={100 + Math.sin((-105 * Math.PI) / 180) * 64}
								stroke="var(--accent-strong)" stroke-width="2" stroke-linecap="round" />
							<circle cx="100" cy="100" r="4" fill="currentColor" stroke="var(--accent-strong)" stroke-width="0.6" />
							<text x="20" y="116" font-size="6" font-family="var(--font-mono)" fill="currentColor" opacity="0.7" text-anchor="middle">0</text>
							<text x="100" y="22" font-size="6" font-family="var(--font-mono)" fill="currentColor" opacity="0.7" text-anchor="middle">5</text>
							<text x="180" y="116" font-size="6" font-family="var(--font-mono)" fill="currentColor" opacity="0.7" text-anchor="middle">10</text>
						</svg>
					</section>

					<section class="log">
						<Cluster gap="var(--space-xs)" justify="between" align="baseline">
							<Bracket style="square"><Text variant="caption" color="accent">cycle log</Text></Bracket>
							<Text variant="caption" color="muted">{log.length} entries</Text>
						</Cluster>
						<Stack gap="0">
							{#each log as entry}
								<div class="log-row">
									<span class="log-t">{entry.t}</span>
									<span class="log-m">{entry.msg}</span>
								</div>
							{/each}
						</Stack>
					</section>
				</Stack>
			</aside>
		</div>

		<!-- foot — stamped certification -->
		<footer class="stamp">
			<Cluster gap="var(--space-xl)" align="center" justify="between">
				<Cluster gap="var(--space-xs)" align="baseline">
					<Glyph name="reticle" size="14px" />
					<Text variant="caption" color="muted">certified for operation · w.h. ord. 2.114.iv</Text>
				</Cluster>
				<Text class="stamp-numerals">RIG IV · MMCDXII</Text>
				<Cluster gap="var(--space-xs)" align="baseline">
					<Text variant="caption" color="muted">last service · 11 days · m. veld</Text>
					<Glyph name="gem-cut" size="14px" />
				</Cluster>
			</Cluster>
		</footer>
	</Sequence>
</main>
</ShowcaseShell>

<style>
	.forge {
		/* All material tokens (--surface-brass-bg, --clip-octagon, --brass-lift,
		   --htx-brass-shine, --htx-bevel-light/dark, --htx-cyan-glow) come from
		   the theme cascade — see src/lib/tokens/hextech.css. */
		min-height: 100dvh;
		position: relative;
		display: flex;
		flex-direction: column;
		gap: var(--space-lg);
		padding: var(--space-xl) var(--shell-pad);
		overflow: hidden;
		color: var(--htx-brass-bright, var(--accent-strong));
		background:
			radial-gradient(circle at top, rgba(93, 217, 240, 0.07), transparent 26%),
			radial-gradient(circle at 20% 20%, rgba(184, 115, 51, 0.06), transparent 24%),
			linear-gradient(180deg, #080f1c 0%, #0a1428 35%, #050810 100%);
	}

	.plate {
		position: absolute;
		inset: 0;
		pointer-events: none;
		z-index: 0;
		opacity: 0.35;
		color: var(--htx-brass, var(--accent));
	}
	.rivets { width: 100%; height: 100%; }

	.nameplate {
		position: relative;
		z-index: 2;
		padding-block: var(--space-md);
	}
	.nameplate-rule {
		height: 1px;
		background: linear-gradient(
			to right,
			transparent,
			color-mix(in srgb, var(--htx-brass-bright, var(--accent-strong)) 70%, transparent) 15%,
			color-mix(in srgb, var(--htx-cyan-glow, var(--signal)) 50%, transparent) 50%,
			color-mix(in srgb, var(--htx-brass-bright, var(--accent-strong)) 70%, transparent) 85%,
			transparent
		);
		margin-block: var(--space-xs);
		filter: drop-shadow(0 0 4px rgba(93, 217, 240, 0.25));
	}
	/* nameplate title: cyan-etched gradient text */
	:global(.nameplate-title) {
		font-family: var(--font-mono);
		font-size: var(--text-3xl);
		letter-spacing: 0.22em;
		text-transform: uppercase;
		font-weight: 400;
		line-height: 1;
		background: linear-gradient(180deg, var(--text) 0%, var(--text-soft) 70%, var(--htx-cyan-glow, var(--signal)) 100%);
		-webkit-background-clip: text;
		background-clip: text;
		-webkit-text-fill-color: transparent;
		filter: drop-shadow(0 1px 0 rgba(0, 0, 0, 0.6));
	}

	.bay {
		position: relative;
		z-index: 2;
		display: grid;
		grid-template-columns: minmax(0, 0.9fr) minmax(380px, 1.2fr) minmax(0, 1fr);
		gap: var(--space-lg);
		align-items: stretch;
	}
	@media (max-width: 80rem) {
		.bay { grid-template-columns: 1fr; }
	}

	/* panels: octagonal brass-recipe surface with drop-shadow stack.
	   Tokens come from hextech.css cascade. */
	.blueprint, .mechanism, .readings {
		position: relative;
		padding: var(--space-lg);
		background: var(--surface-brass-bg);
		clip-path: var(--clip-octagon);
		filter: var(--brass-lift);
		transition: filter 0.5s var(--ease-smooth);
	}
	/* hover: lift + intensify cyan radiance */
	.blueprint:hover, .mechanism:hover, .readings:hover {
		filter:
			drop-shadow(0 16px 40px rgba(0, 0, 0, 0.6))
			drop-shadow(0 0 28px rgba(93, 217, 240, 0.25))
			drop-shadow(0 0 70px rgba(184, 115, 51, 0.1));
	}
	/* inner chamfered frame: an inset border via pseudo, matching the clip */
	.blueprint::before, .mechanism::before, .readings::before {
		content: '';
		position: absolute;
		inset: 10px;
		border: 1px solid rgba(212, 165, 116, 0.4);
		pointer-events: none;
		clip-path: polygon(
			10px 0, calc(100% - 10px) 0,
			100% 10px, 100% calc(100% - 10px),
			calc(100% - 10px) 100%, 10px 100%,
			0 calc(100% - 10px), 0 10px
		);
	}
	/* animated cyan scan-line that sweeps top→bottom inside the frame */
	.blueprint::after, .mechanism::after, .readings::after {
		content: '';
		position: absolute;
		inset: 10px;
		pointer-events: none;
		background: linear-gradient(180deg,
			transparent 0%,
			transparent 48%,
			rgba(93, 217, 240, 0.12) 49%,
			rgba(128, 236, 255, 0.22) 50%,
			rgba(93, 217, 240, 0.12) 51%,
			transparent 52%,
			transparent 100%);
		background-size: 100% 250%;
		background-repeat: no-repeat;
		background-position: 0% -100%;
		mix-blend-mode: screen;
		animation: htx-scan 6s linear infinite;
		clip-path: polygon(
			10px 0, calc(100% - 10px) 0,
			100% 10px, 100% calc(100% - 10px),
			calc(100% - 10px) 100%, 10px 100%,
			0 calc(100% - 10px), 0 10px
		);
	}
	.mechanism::after { animation-delay: 1.5s; }
	.readings::after  { animation-delay: 3s; }

	@keyframes htx-scan {
		0%   { background-position: 0% -100%; }
		100% { background-position: 0% 250%; }
	}

	/* corner brass filigree — placed INSIDE the chamfered border for detail */
	.brass-corner {
		position: absolute;
		width: 56px;
		height: 56px;
		color: var(--htx-brass-shine, var(--accent-strong));
		opacity: 0.7;
		pointer-events: none;
		z-index: 1;
	}
	.brass-tl { top: 12px; left: 12px; }
	.brass-tr { top: 12px; right: 12px; transform: scaleX(-1); }
	.brass-bl { bottom: 12px; left: 12px; transform: scaleY(-1); }
	.brass-br { bottom: 12px; right: 12px; transform: scale(-1, -1); }

	.schematic-svg {
		width: 100%;
		display: block;
		color: var(--htx-cyan-glow, var(--signal));
	}
	.schematic-pulse {
		animation: schem-pulse 3s var(--ease-smooth) infinite;
	}
	@keyframes schem-pulse {
		0%, 100% { opacity: 0.3; }
		50%      { opacity: 0.7; }
	}

	.mechanism {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		gap: var(--space-sm);
	}
	.rig-svg {
		width: 100%;
		max-width: 28rem;
		color: var(--htx-brass-bright, var(--accent-strong));
		filter: drop-shadow(0 8px 16px rgba(0, 0, 0, 0.5));
	}
	.crystal-core {
		transform-origin: 150px 200px;
		transform-box: view-box;
		animation: crystal-breathe 2.8s var(--ease-smooth) infinite;
	}
	.crystal-inner {
		transform-origin: 150px 200px;
		transform-box: view-box;
		animation: crystal-inner-pulse 1.4s var(--ease-smooth) infinite;
	}
	@keyframes crystal-breathe {
		0%, 100% { opacity: 0.7; transform: scale(0.96); }
		50%      { opacity: 1; transform: scale(1.04); }
	}
	@keyframes crystal-inner-pulse {
		0%, 100% { opacity: 0.6; }
		50%      { opacity: 1; }
	}
	.gear-cw {
		transform-origin: 60px 200px;
		transform-box: view-box;
		animation: rotate-cw 18s linear infinite;
	}
	.gear-ccw {
		transform-origin: 240px 200px;
		transform-box: view-box;
		animation: rotate-ccw 22s linear infinite;
	}
	@keyframes rotate-cw  { to { transform: rotate(360deg); } }
	@keyframes rotate-ccw { to { transform: rotate(-360deg); } }
	.steam {
		transform-origin: 150px 44px;
		transform-box: view-box;
		animation: steam-rise 3s ease-out infinite;
	}
	.steam-2 { animation-delay: 1.5s; }
	@keyframes steam-rise {
		0%   { transform: translateY(0) scale(0.6); opacity: 0; }
		25%  { opacity: 0.6; }
		100% { transform: translateY(-30px) scale(1.6); opacity: 0; }
	}
	.led-on {
		animation: led-flicker 1.6s var(--ease-smooth) infinite;
	}
	@keyframes led-flicker {
		0%, 100% { opacity: 1; }
		50%      { opacity: 0.7; }
	}
	.ignition-label { letter-spacing: 0.12em; text-transform: uppercase; }

	.vitals-grid {
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: var(--space-sm);
		margin-top: var(--space-xs);
	}
	.vital {
		padding: var(--space-sm);
		border: 1px solid color-mix(in srgb, var(--htx-brass, var(--accent)) 30%, transparent);
		background: color-mix(in srgb, #1a120a 50%, transparent);
		display: flex;
		flex-direction: column;
		gap: var(--space-3xs);
	}
	.vital-row { display: flex; align-items: baseline; gap: 4px; }
	.vital-val {
		font-family: var(--font-mono);
		font-size: var(--text-lg);
		color: var(--text);
		letter-spacing: 0.04em;
	}
	.vital-unit {
		font-family: var(--font-mono);
		font-size: var(--text-2xs);
		color: var(--muted);
		letter-spacing: 0.1em;
	}
	.vital-bar {
		height: 2px;
		background: color-mix(in srgb, var(--htx-brass, var(--accent)) 20%, transparent);
	}
	.vital-fill {
		height: 100%;
		background: var(--htx-cyan-glow, var(--signal));
		box-shadow: 0 0 6px var(--htx-cyan-glow, var(--signal));
	}
	.vital-caution .vital-fill { background: var(--status-warn); box-shadow: 0 0 6px var(--status-warn); }

	.gauge-wrap {
		display: flex;
		flex-direction: column;
		gap: var(--space-xs);
	}
	.gauge-svg {
		width: 100%;
		max-width: 14rem;
		color: var(--htx-brass-bright, var(--accent-strong));
		margin-inline: auto;
		display: block;
	}

	.log {
		display: flex;
		flex-direction: column;
		gap: var(--space-xs);
	}
	.log-row {
		display: grid;
		grid-template-columns: 5.4rem 1fr;
		font-family: var(--font-mono);
		font-size: var(--text-2xs);
		gap: var(--space-xs);
		padding-block: 2px;
	}
	.log-t { color: var(--htx-cyan-glow, var(--signal)); letter-spacing: 0.06em; }
	.log-m { color: var(--text-soft); }

	.stamp {
		position: relative;
		z-index: 2;
		padding: var(--space-md) var(--space-xl);
		background:
			linear-gradient(180deg, rgba(255, 240, 200, 0.06) 0%, transparent 12%),
			linear-gradient(0deg, rgba(0, 0, 0, 0.4) 0%, transparent 12%),
			linear-gradient(90deg, rgba(184, 115, 51, 0.12), rgba(15, 31, 59, 0.4) 50%, rgba(184, 115, 51, 0.12)),
			#0a1426;
		border-top: 1px solid rgba(212, 165, 116, 0.45);
		border-bottom: 1px solid rgba(212, 165, 116, 0.45);
		box-shadow:
			inset 0 1px 0 var(--htx-bevel-light, rgba(255, 240, 200, 0.18)),
			inset 0 -1px 0 var(--htx-bevel-dark, rgba(0, 0, 0, 0.45));
	}
	:global(.stamp-numerals) {
		font-family: var(--font-mono);
		font-size: var(--text-md);
		letter-spacing: 0.4em;
		color: var(--htx-brass-shine, var(--accent-strong));
		text-shadow:
			0 1px 0 rgba(0, 0, 0, 0.6),
			0 0 12px rgba(212, 165, 116, 0.3);
	}

	@media (prefers-reduced-motion: reduce) {
		.schematic-pulse, .crystal-core, .crystal-inner,
		.gear-cw, .gear-ccw, .steam, .led-on { animation: none; }
		.blueprint::after, .mechanism::after, .readings::after { animation: none; opacity: 0; }
	}
</style>
