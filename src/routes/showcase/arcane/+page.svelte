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
		ShimmerCloud,
		Sequence,
		KineticText
	} from '$lib/index.js';
	import { mountSceneAppearance } from '$lib/examples/appearance.js';

	onMount(() => mountSceneAppearance('field-notebook', 'arcane', 'twilight'));

	const manifest = getShowcaseManifest('arcane');

	/* the witness's account — fragments, reverent, present tense */
	const witness = [
		"i was alone in the chamber. the seventh morning. the brass was cold.",
		"it was not a sound. it was not a light. it was a presence.",
		"the air gathered. the air gathered. i watched it gather.",
		"it knew i was there. i felt it know.",
		"i have not slept since."
	];

	/* the canonical inscription — formal, third person, latin cadence */
	const inscription = [
		{ k: 'manifestation', v: 'recorded · day vii · vigil iv · lattice chamber' },
		{ k: 'duration', v: 'thirty-one breaths' },
		{ k: 'witness', v: 't. iren · sole · uncorroborated' },
		{ k: 'state', v: 'returned to absence · light retained' },
		{ k: 'classification', v: 'manifest · class iv · sealed' }
	];

	/* floating runic script — orbits the relic */
	const orbitGlyphs = ['void-sigil', 'crackle', 'shimmer-rune', 'zigzag', 'asterisk', 'dot'] as const;
</script>

<svelte:head>
	<title>ex tenebris lux · the manifest</title>
</svelte:head>

<ShowcaseShell manifest={manifest!}>
	<main class="chamber">
	<!-- cathedral light streaming from above + ambient shimmer -->
	<div class="atmosphere" aria-hidden="true">
		<div class="god-rays"></div>
		<ShimmerCloud count={48} />
	</div>

	<Sequence stagger={0.18}>
		<!-- benediction header (in latin cadence) -->
		<header class="benediction-top">
			<div class="rule rule-iridescent" aria-hidden="true"></div>
			<Cluster gap="var(--space-md)" align="baseline" justify="center">
				<Glyph name="void-sigil" size="12px" />
				<span class="kicker">ex tenebris lux · the lattice has manifested · vigil iv</span>
				<Glyph name="shimmer-rune" size="12px" />
			</Cluster>
			<div class="rule rule-iridescent" aria-hidden="true"></div>
		</header>

		<!-- the manifest — the central relic -->
		<section class="reliquary">
			<KineticText
				text="the manifest"
				mode="mask"
				as="h1"
				class="relic-title"
			/>

			<div class="relic">
				<!-- orbiting runic script -->
				<div class="orbit-ring" aria-hidden="true">
					{#each orbitGlyphs as g, i}
						<span class="orbit-glyph" style:--i={i} style:--n={orbitGlyphs.length}>
							<Glyph name={g} size="20px" />
						</span>
					{/each}
				</div>

				<!-- the crystalline manifestation: wing-shards + heart + light rays -->
				<svg viewBox="0 0 600 600" class="relic-svg" aria-hidden="true">
					<defs>
						<radialGradient id="m-heart" cx="50%" cy="50%" r="50%">
							<stop offset="0%" stop-color="#fff0fd" stop-opacity="1" />
							<stop offset="22%" stop-color="#ffb8ec" stop-opacity="0.95" />
							<stop offset="48%" stop-color="#e94cbc" stop-opacity="0.85" />
							<stop offset="75%" stop-color="#b845c9" stop-opacity="0.55" />
							<stop offset="100%" stop-color="#3a0e60" stop-opacity="0.1" />
						</radialGradient>
						<radialGradient id="m-halo" cx="50%" cy="50%" r="50%">
							<stop offset="0%" stop-color="rgba(255, 240, 253, 0.32)" />
							<stop offset="50%" stop-color="rgba(184, 69, 201, 0.16)" />
							<stop offset="100%" stop-color="rgba(184, 69, 201, 0)" />
						</radialGradient>
						<linearGradient id="m-wing" x1="0%" y1="0%" x2="100%" y2="100%">
							<stop offset="0%" stop-color="rgba(255, 240, 253, 0.85)" />
							<stop offset="40%" stop-color="rgba(233, 76, 188, 0.55)" />
							<stop offset="100%" stop-color="rgba(184, 69, 201, 0.15)" />
						</linearGradient>
						<filter id="m-glow">
							<feGaussianBlur stdDeviation="3" />
						</filter>
						<filter id="m-bloom">
							<feGaussianBlur stdDeviation="14" />
						</filter>
					</defs>

					<!-- the outer halo -->
					<circle cx="300" cy="320" r="220" fill="url(#m-halo)" filter="url(#m-bloom)" class="halo halo-outer" />
					<circle cx="300" cy="320" r="160" fill="url(#m-halo)" filter="url(#m-bloom)" class="halo halo-inner" />

					<!-- the wings — crystalline shards radiating outward, asymmetric like Arcane's geometry -->
					<g class="wings" stroke="url(#m-wing)" stroke-linejoin="miter" fill="none">
						<!-- left wing -->
						<g class="wing wing-l" stroke-width="1.4">
							<path d="M300,310 L160,210 L110,160" opacity="0.85" />
							<path d="M300,310 L130,250 L70,220" opacity="0.7" />
							<path d="M300,310 L150,290 L80,300" opacity="0.6" />
							<path d="M300,310 L180,180 L150,90" opacity="0.5" />
						</g>
						<!-- right wing -->
						<g class="wing wing-r" stroke-width="1.4">
							<path d="M300,310 L440,210 L490,160" opacity="0.85" />
							<path d="M300,310 L470,250 L530,220" opacity="0.7" />
							<path d="M300,310 L450,290 L520,300" opacity="0.6" />
							<path d="M300,310 L420,180 L450,90" opacity="0.5" />
						</g>
					</g>

					<!-- lower tendrils — reaching down -->
					<g class="tendrils" stroke="rgba(233, 76, 188, 0.7)" fill="none" stroke-width="1.4" stroke-linecap="round">
						<path d="M300,320 Q280,400 240,470 T180,560" opacity="0.65" />
						<path d="M300,320 Q320,400 360,470 T420,560" opacity="0.65" />
						<path d="M300,320 Q290,440 280,520" opacity="0.55" />
						<path d="M300,320 Q310,440 320,520" opacity="0.55" />
					</g>

					<!-- the heart — concentric layers, breathing -->
					<g class="heart">
						<!-- outermost diffuse bloom -->
						<circle cx="300" cy="320" r="120" fill="url(#m-heart)" filter="url(#m-glow)" opacity="0.55" class="heart-bloom" />
						<!-- middle: faceted crystal body (irregular polygon) -->
						<polygon class="heart-shell"
							points="300,200 380,255 412,330 388,410 300,440 212,410 188,330 220,255"
							fill="url(#m-heart)"
							opacity="0.85" />
						<!-- inner: white-hot core -->
						<circle cx="300" cy="320" r="48" fill="#fff0fd" opacity="0.95" class="heart-core" />
						<!-- innermost spark -->
						<circle cx="300" cy="320" r="14" fill="#ffffff" class="heart-spark" />
					</g>

					<!-- light rays streaming downward — god-rays -->
					<g class="rays" stroke="rgba(255, 240, 253, 0.18)" stroke-width="0.8">
						{#each Array(7) as _, i}
							<line
								x1={300 + (i - 3) * 18}
								y1="0"
								x2={300 + (i - 3) * 36}
								y2="320"
								class="ray ray-{i}"
							/>
						{/each}
					</g>

					<!-- floating embers near the heart -->
					<g class="embers" fill="rgba(255, 240, 253, 0.85)">
						{#each Array(8) as _, i}
							<circle r="1.8" class="ember ember-{i}" />
						{/each}
					</g>
				</svg>
			</div>

			<!-- the title revealing whisper -->
			<p class="whisper">it gathered, for thirty-one breaths, and then was gone.</p>
		</section>

		<!-- two-column witness/inscription split -->
		<div class="testaments">
			<!-- inscription: formal canonical record -->
			<aside class="inscription">
				<Cluster gap="var(--space-sm)" justify="between" align="baseline">
					<Bracket style="curly" tone="accent"><span class="label">inscription</span></Bracket>
					<span class="label-mute">lattice register</span>
				</Cluster>
				<div class="rule rule-soft" aria-hidden="true"></div>
				<Stack gap="var(--space-sm)">
					{#each inscription as line}
						<div class="ins-row">
							<span class="ins-k">{line.k}</span>
							<span class="ins-v">{line.v}</span>
						</div>
					{/each}
				</Stack>
				<div class="rule rule-soft" aria-hidden="true"></div>
				<p class="canon">
					in the chamber known as the lattice, on the seventh morning, light
					gathered without source. it gathered for thirty-one breaths. it did
					not return.
				</p>
			</aside>

			<!-- witness: personal account, italics, awed -->
			<aside class="witness">
				<Cluster gap="var(--space-sm)" justify="between" align="baseline">
					<Bracket style="curly" tone="accent"><span class="label">the witness</span></Bracket>
					<span class="label-mute">t. iren · sole present</span>
				</Cluster>
				<div class="rule rule-soft" aria-hidden="true"></div>
				<Stack gap="var(--space-md)">
					{#each witness as line, i}
						<p class="witness-line" class:witness-final={i === witness.length - 1}>
							{line}
						</p>
					{/each}
				</Stack>
			</aside>
		</div>

		<!-- benediction footer -->
		<footer class="benediction-bottom">
			<div class="rule rule-iridescent" aria-hidden="true"></div>
			<p class="benediction-text">
				<span class="lat">luce manifesta</span>
				<span class="dot">·</span>
				<span class="lat">ego testor</span>
			</p>
			<p class="benediction-trans">manifest light · i bear witness</p>
			<div class="rule rule-iridescent" aria-hidden="true"></div>
		</footer>
	</Sequence>
</main>
</ShowcaseShell>

<style>
	.chamber {
		min-height: 100dvh;
		position: relative;
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: var(--space-2xl);
		padding: var(--space-2xl) var(--shell-pad);
		overflow: hidden;
	}

	/* atmosphere: cathedral light + shimmer */
	.atmosphere {
		position: absolute;
		inset: 0;
		pointer-events: none;
		z-index: 0;
	}
	.god-rays {
		position: absolute;
		inset: 0;
		background:
			radial-gradient(ellipse at 50% -10%, rgba(255, 240, 253, 0.16), transparent 35%),
			conic-gradient(from 250deg at 50% -20%,
				transparent 0deg,
				rgba(255, 240, 253, 0.08) 10deg,
				transparent 18deg,
				rgba(255, 240, 253, 0.06) 26deg,
				transparent 32deg,
				rgba(255, 240, 253, 0.1) 40deg,
				transparent 48deg);
		mix-blend-mode: screen;
		animation: rays-drift 22s ease-in-out infinite;
	}
	@keyframes rays-drift {
		0%, 100% { transform: translateX(-2%) rotate(-1deg); opacity: 0.9; }
		50% { transform: translateX(2%) rotate(1deg); opacity: 1; }
	}

	/* benediction headers */
	.benediction-top, .benediction-bottom {
		position: relative;
		z-index: 2;
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: var(--space-sm);
		width: min(100%, 56rem);
	}
	.rule {
		width: 100%;
		height: 1px;
		background: linear-gradient(
			to right,
			transparent,
			rgba(184, 69, 201, 0.5) 30%,
			rgba(255, 240, 253, 0.75) 50%,
			rgba(184, 69, 201, 0.5) 70%,
			transparent
		);
		filter: drop-shadow(0 0 6px rgba(184, 69, 201, 0.35));
	}
	.rule-iridescent {
		background: var(--arc-iridescent);
		opacity: 0.7;
		height: 1px;
	}
	.rule-soft {
		background: linear-gradient(to right, transparent, var(--line-strong), transparent);
		opacity: 0.6;
	}
	.kicker {
		font-family: var(--font-mono);
		font-size: var(--text-2xs);
		letter-spacing: 0.36em;
		text-transform: lowercase;
		color: var(--muted);
		text-shadow: 0 0 8px rgba(184, 69, 201, 0.25);
	}

	/* the reliquary stage */
	.reliquary {
		position: relative;
		z-index: 2;
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: var(--space-xl);
		width: 100%;
		max-width: 56rem;
	}
	:global(.relic-title) {
		font-family: var(--font-body);
		font-size: var(--text-display);
		font-style: italic;
		font-weight: 400;
		letter-spacing: -0.045em;
		line-height: 0.9;
		text-align: center;
		background:
			linear-gradient(
				135deg,
				var(--text) 0%,
				var(--text) 30%,
				rgba(255, 240, 253, 0.98) 50%,
				rgba(233, 76, 188, 0.95) 72%,
				rgba(184, 69, 201, 0.92) 100%
			);
		background-size: 200% 200%;
		-webkit-background-clip: text;
		background-clip: text;
		-webkit-text-fill-color: transparent;
		filter: drop-shadow(0 0 24px rgba(184, 69, 201, 0.25));
		animation: arc-iridescent-shift 11s ease-in-out infinite;
	}

	.relic {
		position: relative;
		width: min(100%, 38rem);
		aspect-ratio: 1;
	}
	.relic-svg {
		position: absolute;
		inset: 0;
		width: 100%;
		height: 100%;
		display: block;
		filter:
			drop-shadow(0 0 32px rgba(184, 69, 201, 0.32))
			drop-shadow(0 0 80px rgba(233, 76, 188, 0.18))
			drop-shadow(0 0 140px rgba(255, 240, 253, 0.08));
		animation: arc-frame-breathe 6.5s ease-in-out infinite;
	}

	/* orbiting runic glyphs */
	.orbit-ring {
		position: absolute;
		inset: 0;
		animation: orbit-rotate 80s linear infinite;
	}
	.orbit-glyph {
		position: absolute;
		left: 50%;
		top: 50%;
		color: rgba(255, 240, 253, 0.7);
		transform:
			translate(-50%, -50%)
			rotate(calc((var(--i) / var(--n)) * 360deg))
			translateY(-220px)
			rotate(calc((var(--i) / var(--n)) * -360deg));
		filter: drop-shadow(0 0 6px rgba(184, 69, 201, 0.5));
	}
	@keyframes orbit-rotate {
		to { transform: rotate(360deg); }
	}

	/* the heart breathing */
	.heart-bloom {
		transform-origin: 300px 320px;
		transform-box: view-box;
		animation: heart-pulse 3.4s ease-in-out infinite;
	}
	.heart-core {
		transform-origin: 300px 320px;
		transform-box: view-box;
		animation: heart-pulse 1.7s ease-in-out infinite;
	}
	.heart-spark {
		transform-origin: 300px 320px;
		transform-box: view-box;
		animation: heart-pulse 0.85s ease-in-out infinite;
	}
	.heart-shell {
		transform-origin: 300px 320px;
		transform-box: view-box;
		animation: heart-shell-shift 9s ease-in-out infinite;
	}
	@keyframes heart-pulse {
		0%, 100% { transform: scale(0.96); opacity: 0.85; }
		50%      { transform: scale(1.05); opacity: 1; }
	}
	@keyframes heart-shell-shift {
		0%, 100% { transform: rotate(0deg) scale(1); }
		50%      { transform: rotate(2deg) scale(1.02); }
	}

	/* halos */
	.halo-outer {
		transform-origin: 300px 320px;
		transform-box: view-box;
		animation: halo-breathe 7s ease-in-out infinite;
	}
	.halo-inner {
		transform-origin: 300px 320px;
		transform-box: view-box;
		animation: halo-breathe 4.5s ease-in-out infinite reverse;
	}
	@keyframes halo-breathe {
		0%, 100% { transform: scale(0.95); opacity: 0.7; }
		50%      { transform: scale(1.08); opacity: 1; }
	}

	/* wings shimmer */
	.wing path {
		animation: wing-shimmer 4s ease-in-out infinite;
	}
	.wing path:nth-child(2) { animation-delay: 0.5s; }
	.wing path:nth-child(3) { animation-delay: 1s; }
	.wing path:nth-child(4) { animation-delay: 1.5s; }
	@keyframes wing-shimmer {
		0%, 100% { opacity: 0.5; }
		50%      { opacity: 1; }
	}

	/* tendrils slow drift */
	.tendrils path {
		animation: tendril-pulse 6s ease-in-out infinite;
	}
	.tendrils path:nth-child(2) { animation-delay: 1.5s; }
	.tendrils path:nth-child(3) { animation-delay: 3s; }
	.tendrils path:nth-child(4) { animation-delay: 4.5s; }
	@keyframes tendril-pulse {
		0%, 100% { opacity: 0.4; stroke-width: 1.2; }
		50%      { opacity: 0.9; stroke-width: 1.8; }
	}

	/* god-rays inside the relic */
	.ray {
		animation: ray-fade 5s ease-in-out infinite;
	}
	.ray-0 { animation-delay: 0s; }
	.ray-1 { animation-delay: 0.4s; }
	.ray-2 { animation-delay: 0.8s; }
	.ray-3 { animation-delay: 1.2s; }
	.ray-4 { animation-delay: 1.6s; }
	.ray-5 { animation-delay: 2s; }
	.ray-6 { animation-delay: 2.4s; }
	@keyframes ray-fade {
		0%, 100% { opacity: 0.15; }
		50%      { opacity: 0.5; }
	}

	/* floating embers */
	.ember {
		opacity: 0;
		animation: ember-drift 8s linear infinite;
	}
	.ember-0 { animation-delay: 0s;   --sx: 240; --sy: 380; --ex: 260; --ey: 200; }
	.ember-1 { animation-delay: 1s;   --sx: 340; --sy: 360; --ex: 320; --ey: 180; }
	.ember-2 { animation-delay: 2s;   --sx: 280; --sy: 400; --ex: 290; --ey: 210; }
	.ember-3 { animation-delay: 3s;   --sx: 360; --sy: 420; --ex: 340; --ey: 220; }
	.ember-4 { animation-delay: 4s;   --sx: 260; --sy: 360; --ex: 240; --ey: 200; }
	.ember-5 { animation-delay: 5s;   --sx: 320; --sy: 400; --ex: 300; --ey: 200; }
	.ember-6 { animation-delay: 6s;   --sx: 280; --sy: 380; --ex: 270; --ey: 180; }
	.ember-7 { animation-delay: 7s;   --sx: 340; --sy: 360; --ex: 310; --ey: 190; }
	@keyframes ember-drift {
		0%   { cx: var(--sx); cy: var(--sy); opacity: 0; }
		20%  { opacity: 1; }
		80%  { opacity: 1; }
		100% { cx: var(--ex); cy: var(--ey); opacity: 0; }
	}

	/* whisper */
	.whisper {
		margin: 0;
		font-family: var(--font-body);
		font-style: italic;
		font-size: var(--text-md);
		color: var(--muted);
		text-align: center;
		max-width: 32rem;
		line-height: 1.6;
		opacity: 0.85;
		letter-spacing: 0.01em;
	}

	/* testaments split */
	.testaments {
		position: relative;
		z-index: 2;
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: var(--space-xl);
		width: 100%;
		max-width: 64rem;
		align-items: start;
	}
	@media (max-width: 56rem) {
		.testaments { grid-template-columns: 1fr; }
	}

	.inscription, .witness {
		position: relative;
		padding: var(--space-lg);
		background:
			radial-gradient(circle at 80% 0%, rgba(255, 240, 253, 0.06), transparent 40%),
			linear-gradient(135deg, rgba(184, 69, 201, 0.06), rgba(10, 6, 20, 0.92) 60%);
		border: 1px solid transparent;
		border-image: conic-gradient(
			from 0deg,
			rgba(184, 69, 201, 0.4),
			rgba(255, 240, 253, 0.36),
			rgba(93, 197, 232, 0.32),
			rgba(233, 76, 188, 0.4),
			rgba(184, 69, 201, 0.4)
		) 1;
		box-shadow:
			inset 0 1px 0 rgba(255, 240, 253, 0.06),
			inset 0 -1px 0 rgba(93, 197, 232, 0.06),
			0 8px 28px rgba(0, 0, 0, 0.55),
			0 0 22px rgba(184, 69, 201, 0.08);
		display: flex;
		flex-direction: column;
		gap: var(--space-sm);
		transition: box-shadow 0.5s var(--ease-smooth), transform 0.5s var(--ease-smooth);
	}
	.inscription:hover, .witness:hover {
		box-shadow:
			inset 0 1px 0 rgba(255, 240, 253, 0.1),
			inset 0 -1px 0 rgba(93, 197, 232, 0.1),
			0 12px 32px rgba(0, 0, 0, 0.6),
			0 0 36px rgba(233, 76, 188, 0.18),
			0 0 80px rgba(184, 69, 201, 0.06);
		transform: translateY(-2px);
	}

	.label {
		font-family: var(--font-mono);
		font-size: var(--text-2xs);
		letter-spacing: 0.18em;
		text-transform: lowercase;
		color: var(--arc-shimmer, var(--accent-strong));
	}
	.label-mute {
		font-family: var(--font-mono);
		font-size: var(--text-2xs);
		letter-spacing: 0.14em;
		color: var(--muted);
	}

	.ins-row {
		display: grid;
		grid-template-columns: 9rem 1fr;
		gap: var(--space-sm);
		align-items: baseline;
		padding-block: 2px;
	}
	.ins-k {
		font-family: var(--font-mono);
		font-size: var(--text-2xs);
		letter-spacing: 0.16em;
		text-transform: uppercase;
		color: var(--muted-strong);
	}
	.ins-v {
		font-family: var(--font-mono);
		font-size: var(--text-xs);
		color: var(--text-soft);
		letter-spacing: 0.04em;
	}
	.canon {
		margin: 0;
		font-family: var(--font-body);
		font-size: var(--text-sm);
		font-style: italic;
		line-height: 1.7;
		color: var(--text-soft);
		text-wrap: pretty;
	}

	.witness-line {
		margin: 0;
		font-family: var(--font-body);
		font-style: italic;
		font-size: var(--text-md);
		line-height: 1.55;
		color: var(--text-soft);
		text-wrap: pretty;
		position: relative;
	}
	.witness-final {
		color: var(--text);
		font-size: var(--text-lg);
		padding-top: var(--space-sm);
		border-top: 1px dashed rgba(184, 69, 201, 0.3);
	}

	/* benediction footer */
	.benediction-text {
		margin: 0;
		font-family: var(--font-body);
		font-style: italic;
		font-size: var(--text-xl);
		letter-spacing: 0.04em;
		color: var(--text);
		text-align: center;
	}
	.benediction-text .lat {
		background: linear-gradient(
			135deg,
			rgba(255, 240, 253, 0.95),
			rgba(233, 76, 188, 0.95),
			rgba(184, 69, 201, 0.92)
		);
		-webkit-background-clip: text;
		background-clip: text;
		-webkit-text-fill-color: transparent;
		filter: drop-shadow(0 0 12px rgba(184, 69, 201, 0.25));
	}
	.benediction-text .dot {
		color: rgba(255, 240, 253, 0.6);
		margin-inline: var(--space-xs);
	}
	.benediction-trans {
		margin: 0;
		font-family: var(--font-mono);
		font-size: var(--text-2xs);
		letter-spacing: 0.24em;
		color: var(--muted);
		text-align: center;
	}

	@media (prefers-reduced-motion: reduce) {
		.god-rays,
		.orbit-ring, .orbit-glyph,
		.relic-svg, .heart-bloom, .heart-core, .heart-spark, .heart-shell,
		.halo-outer, .halo-inner,
		.wing path, .tendrils path, .ray, .ember,
		:global(.relic-title) {
			animation: none;
		}
	}
</style>
