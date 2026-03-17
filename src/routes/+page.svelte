<script lang="ts">
	import {
		Button,
		ChapterMark,
		CornerBrackets,
		DepthLayer,
		DepthPortal,
		DepthScene,
		DepthStage,
		FloatCard,
		GlyphMark,
		GridOverlay,
		HorizonGrid,
		Label,
		Manifesto,
		MetricCard,
		PullQuote,
		ScanBand,
		ShowcaseFrame,
		SignalRing,
		StatusDot,
		Text,
		Vignette,
		surface
	} from '$lib/index.js';

	const examples = [
		{
			href: '/examples/observation-deck',
			id: '01',
			name: 'observation deck',
			register: 'mission-control',
			description: 'a dense monitoring dashboard. layered readouts, depth grid, live operator posture.',
			status: 'ok' as const,
			tag: 'dashboard'
		},
		{
			href: '/examples/field-report',
			id: '02',
			name: 'field report',
			register: 'field-notebook',
			description: 'editorial work in the field-notebook register. warm, serif-forward, reads like a found document.',
			status: 'ok' as const,
			tag: 'editorial'
		},
		{
			href: '/examples/signal-lost',
			id: '03',
			name: 'signal lost',
			register: 'field-notebook',
			description: 'a failure page that tells a story. terminal boot sequence, ambient noise, calm about being broken.',
			status: 'warn' as const,
			tag: 'error state'
		}
	];

	const expressions = [
		{ name: 'title-card', sample: 'deep signal', desc: 'scene-opening header. very large, line-height below 1.' },
		{ name: 'manifesto', sample: 'quiet confidence. technical depth. no ornamental sludge.', desc: 'philosophical statement. italic, full measure.' },
		{ name: 'readout', sample: 'SYSTEM.STATUS / OPERATIONAL', desc: 'data label. monospace, muted, small tracking.' },
		{ name: 'command', sample: 'INITIALIZE', desc: 'active instruction. mono caps, gold, sparse.' },
		{ name: 'whisper', sample: 'and here, the unsaid things', desc: 'parenthetical. serif italic, muted, secondary.' },
		{ name: 'chapter', sample: '04', desc: 'section marker. mono caps with decorative rule.' }
	];

	const registers = [
		{
			id: 'field-notebook',
			label: 'field-notebook',
			character: 'warm. editorial. serif-forward.',
			body: 'at ease with long lines of copy. reads like a found document. portfolios, narrative pages.',
			accent: 'var(--accent)'
		},
		{
			id: 'mission-control',
			label: 'mission-control',
			character: 'dense. mono. precise.',
			body: 'every character earns its space. dashboards, tools, operator interfaces.',
			accent: 'var(--signal)'
		},
		{
			id: 'archive',
			label: 'archive',
			character: 'cool. ordered. muted.',
			body: 'space as structure. ornament near absent. galleries, indexes, reference collections.',
			accent: 'var(--muted)'
		}
	];
</script>

<svelte:head>
	<title>hyvui</title>
</svelte:head>

<!-- ── 1. HERO ─────────────────────────────────────────────────────────── -->
<div class="hero-wrap">
	<DepthScene perspective="far">
		{#snippet ambient()}
			<GridOverlay class="hero-grid" />
			<Vignette class="hero-vignette" />
		{/snippet}

		{#snippet ground()}
			<HorizonGrid animated rows={22} cols={16} vanishY={0.44} />
		{/snippet}

		{#snippet stage()}
			<div class="hero-content" use:surface={{ delay: 0 }}>
				<div class="hero-kicker">
					<GlyphMark variant="reticle" size={13} color="var(--signal)" />
					<Label color="signal">component library / phase 4</Label>
				</div>

				<h1 class="hero-title">hyv<span style="color:var(--accent)">u</span><span style="color:var(--signal)">i</span></h1>

				<Manifesto
					statement="dark aesthetic. intentional layout. no startup gloss. every detail should look placed, not merely present."
					accent="signal"
					class="hero-manifesto"
				/>

				<div class="hero-actions" use:surface={{ delay: 180 }}>
					<Button variant="secondary" href="/docs">[ explore docs ]</Button>
					<Button variant="ghost" href="/examples/observation-deck">[ examples ]</Button>
				</div>
			</div>
		{/snippet}

		{#snippet foreground()}
			<div class="hero-floor">
				<div class="hero-status">
					<StatusDot status="ok" size={6} />
					<Label color="muted">svelte 5</Label>
					<span class="hero-sep" aria-hidden="true">·</span>
					<Label color="muted">68 components</Label>
					<span class="hero-sep" aria-hidden="true">·</span>
					<Label color="muted">three layers</Label>
				</div>
				<div class="hero-scroll-cue" aria-hidden="true">
					<span class="hero-scroll-line"></span>
				</div>
			</div>
		{/snippet}
	</DepthScene>
</div>

<!-- ── 2. REGISTER SYSTEM ──────────────────────────────────────────────── -->
<section class="section" use:surface={{ delay: 0 }}>
	<div class="shell">
		<ChapterMark index="01" title="registers" descriptor="three design characters. same palette, same type. different weight distribution." />

		<div class="reg-grid">
			{#each registers as reg, i}
				<div class="reg-col" data-register={reg.id} use:surface={{ delay: i * 60 }}>
					<div class="reg-col-top">
						<span class="reg-col-label">{reg.label}</span>
						<span class="reg-col-dot" style:background={reg.accent}></span>
					</div>
					<p class="reg-col-character">{reg.character}</p>
					<p class="reg-col-body">{reg.body}</p>
					<div class="reg-col-foot">
						<span class="reg-col-meta">a tool for deliberate work</span>
					</div>
				</div>
			{/each}
		</div>

		<p class="reg-note">
			<span class="reg-note-label">apply:</span>
			<code class="reg-note-code">{'<body data-register="mission-control">'}</code>
		</p>
	</div>
</section>

<!-- ── 3. DEPTH SYSTEM ────────────────────────────────────────────────── -->
<section class="section" use:surface={{ delay: 0 }}>
	<div class="shell">
		<ChapterMark index="02" title="spatial depth" descriptor="css 3d perspective. pointer-tracked tilt. ground grid recedes to vanishing point." />
	</div>

	<div class="depth-demo">
		<ShowcaseFrame animated perspective="mid" minHeight="32rem" class="depth-frame">
			{#snippet label()}
				pointer / tilt active — move your cursor
			{/snippet}
			<FloatCard tiltMax={10} class="depth-card">
				<div class="depth-card-inner">
					<div class="depth-card-top">
						<StatusDot status="ok" size={6} />
						<Label color="signal">sensor array</Label>
					</div>
					<div class="depth-metrics">
						<div class="depth-metric">
							<span class="depth-metric-value">94.2</span>
							<span class="depth-metric-unit">ms</span>
							<Label color="muted">response</Label>
						</div>
						<div class="depth-metric">
							<span class="depth-metric-value">1.2k</span>
							<span class="depth-metric-unit">/s</span>
							<Label color="muted">throughput</Label>
						</div>
						<div class="depth-metric">
							<span class="depth-metric-value">99.9</span>
							<span class="depth-metric-unit">%</span>
							<Label color="muted">uptime</Label>
						</div>
					</div>
					<div class="depth-card-foot">
						<SignalRing size={28} color="var(--signal)" />
						<Label color="muted">hyv<span style="color:var(--accent)">u</span><span style="color:var(--signal)">i</span> / depth system</Label>
					</div>
				</div>
			</FloatCard>
		</ShowcaseFrame>

		<div class="shell depth-caption">
			<div class="depth-caption-inner" use:surface={{ delay: 100 }}>
				<Label color="accent">showCaseFrame + floatCard + horizonGrid</Label>
				<p class="depth-caption-body">three components, one composed unit. the ground grid, the perspective stage, and the tilt card are separate layers — assembled here into a single pattern.</p>
				<div class="depth-caption-also">
					<Label color="muted">also available standalone:</Label>
					<code class="depth-code">DepthPortal</code>
					<code class="depth-code">DepthScene</code>
					<code class="depth-code">Plinth</code>
				</div>
			</div>
		</div>
	</div>
</section>

<!-- ── 4. EXPRESSION SYSTEM ───────────────────────────────────────────── -->
<section class="section" use:surface={{ delay: 0 }}>
	<div class="shell">
		<ChapterMark index="03" title="typographic expressions" descriptor="six semantic intents. orthogonal to structure — they describe what the text is doing." />

		<div class="expr-list">
			{#each expressions as expr, i}
				<div class="expr-row" use:surface={{ delay: i * 50 }}>
					<div class="expr-row-meta">
						<span class="expr-row-name">{expr.name}</span>
						<span class="expr-row-desc">{expr.desc}</span>
					</div>
					<div class="expr-row-sample">
						{#if expr.name === 'title-card'}
							<span class="expr-title-card">{expr.sample}</span>
						{:else if expr.name === 'manifesto'}
							<span class="expr-manifesto">{expr.sample}</span>
						{:else if expr.name === 'readout'}
							<span class="expr-readout">{expr.sample}</span>
						{:else if expr.name === 'command'}
							<span class="expr-command">{expr.sample}</span>
						{:else if expr.name === 'whisper'}
							<span class="expr-whisper">{expr.sample}</span>
						{:else if expr.name === 'chapter'}
							<span class="expr-chapter">{expr.sample}</span>
						{/if}
					</div>
				</div>
			{/each}
		</div>
	</div>
</section>

<!-- ── 5. EXAMPLES INDEX ───────────────────────────────────────────────── -->
<section class="section" use:surface={{ delay: 0 }}>
	<div class="shell">
		<ChapterMark index="04" title="built with this" descriptor="three scenes. each one uses the system differently." />

		<div class="examples-list">
			{#each examples as ex, i}
				<a href={ex.href} class="example-entry" use:surface={{ delay: i * 60 }}>
					<div class="example-entry-left">
						<span class="example-id">{ex.id}</span>
						<StatusDot status={ex.status} size={6} />
					</div>

					<div class="example-entry-center">
						<span class="example-name">{ex.name}</span>
						<span class="example-desc">{ex.description}</span>
					</div>

					<div class="example-entry-right">
						<Label color="muted">{ex.register}</Label>
						<Label color="muted">{ex.tag}</Label>
						<span class="example-arrow" aria-hidden="true">→</span>
					</div>
				</a>
			{/each}
		</div>
	</div>
</section>

<!-- ── 6. CLOSER ───────────────────────────────────────────────────────── -->
<section class="section section--closer" use:surface={{ delay: 0 }}>
	<div class="shell">
		<PullQuote
			quote="spacing is compositional, not decorative. surfaces stay quiet until interaction earns emphasis. gold and teal appear sparingly and on purpose."
			attribution="design posture"
			source="hyvui"
			class="closer-quote"
		/>

		<div class="closer-actions" use:surface={{ delay: 120 }}>
			<Button variant="secondary" href="/docs">[ full documentation ]</Button>
			<Button variant="ghost" href="/system">[ system pages ]</Button>
		</div>
	</div>
</section>

<style>
	/* ── shell ─────────────────────────────────────────── */
	.shell {
		max-width: var(--shell-max);
		margin: 0 auto;
		padding-inline: var(--shell-pad);
	}

	/* ── hero ──────────────────────────────────────────── */
	.hero-wrap {
		position: relative;
	}

	:global(.hero-grid) {
		opacity: 0.32;
	}

	:global(.hero-vignette) {
		background:
			radial-gradient(ellipse at 50% 0%, rgba(121, 166, 163, 0.1), transparent 50%),
			radial-gradient(ellipse at 50% 100%, transparent 40%, rgba(8, 9, 11, 0.7));
	}

	.hero-content {
		display: flex;
		flex-direction: column;
		align-items: flex-start;
		gap: calc(1.5rem * var(--reg-spacing-scale, 1));
		max-width: 42rem;
	}

	.hero-kicker {
		display: flex;
		align-items: center;
		gap: var(--space-sm);
	}

	.hero-title {
		margin: 0;
		font-family: var(--font-body);
		font-weight: 400;
		font-size: clamp(4rem, 14vw, 10rem);
		line-height: 0.88;
		letter-spacing: -0.06em;
		color: var(--text);
	}

	:global(.hero-manifesto) {
		max-width: 34rem;
	}

	.hero-actions {
		display: flex;
		gap: var(--space-sm);
		flex-wrap: wrap;
	}

	.hero-floor {
		display: flex;
		flex-direction: column;
		gap: var(--space-md);
	}

	.hero-status {
		display: flex;
		align-items: center;
		gap: var(--space-sm);
		flex-wrap: wrap;
	}

	.hero-sep {
		color: var(--muted);
		opacity: 0.5;
		font-family: var(--font-mono);
		font-size: 0.7rem;
	}

	.hero-scroll-line {
		display: block;
		width: 1px;
		height: 2.5rem;
		background: linear-gradient(to bottom, var(--line), transparent);
		margin-left: 0.1rem;
	}

	/* ── sections ──────────────────────────────────────── */
	.section {
		padding-block: clamp(4rem, 8vw, 7rem);
		border-top: 1px solid var(--line);
	}

	.section--closer {
		padding-block: clamp(5rem, 10vw, 9rem);
	}

	/* ── register grid ─────────────────────────────────── */
	.reg-grid {
		display: grid;
		grid-template-columns: repeat(3, 1fr);
		gap: 1px;
		margin-top: calc(2.5rem * var(--reg-spacing-scale, 1));
		background: var(--line);
	}

	.reg-col {
		background: var(--bg);
		padding: clamp(1.5rem, 3vw, 2.5rem);
		display: flex;
		flex-direction: column;
		gap: calc(0.9rem * var(--reg-spacing-scale, 1));
		transition: background var(--transition-fast);
	}

	.reg-col:hover {
		background: var(--bg-elev-soft);
	}

	.reg-col-top {
		display: flex;
		align-items: center;
		justify-content: space-between;
	}

	.reg-col-label {
		font-family: var(--font-mono);
		font-size: var(--reg-label-size, 0.68rem);
		letter-spacing: var(--reg-label-tracking, 0.14em);
		text-transform: uppercase;
		color: var(--muted-strong);
	}

	.reg-col-dot {
		display: block;
		width: 6px;
		height: 6px;
		border-radius: 50%;
		opacity: 0.8;
	}

	.reg-col-character {
		margin: 0;
		font-family: var(--reg-font-primary, var(--font-body));
		font-size: clamp(1.2rem, 2.5vw, 1.75rem);
		letter-spacing: var(--reg-heading-tracking, -0.04em);
		line-height: var(--reg-heading-lh, 0.94);
		color: var(--text);
	}

	.reg-col-body {
		margin: 0;
		font-family: var(--reg-font-primary, var(--font-body));
		font-size: var(--reg-body-size, 1rem);
		line-height: 1.55;
		color: var(--text-soft);
		flex: 1;
	}

	.reg-col-foot {
		border-top: 1px solid var(--line);
		padding-top: 0.75rem;
		margin-top: auto;
	}

	.reg-col-meta {
		font-family: var(--reg-font-primary, var(--font-body));
		font-size: var(--reg-body-size, 1rem);
		color: var(--muted);
		font-style: italic;
	}

	[data-register='mission-control'] .reg-col-meta {
		font-style: normal;
	}

	.reg-note {
		margin: 0;
		margin-top: 1.5rem;
		display: flex;
		align-items: baseline;
		gap: 0.75rem;
		flex-wrap: wrap;
	}

	.reg-note-label {
		font-family: var(--font-mono);
		font-size: 0.75rem;
		letter-spacing: 0.1em;
		color: var(--muted);
	}

	.reg-note-code {
		font-family: var(--font-mono);
		font-size: 0.78rem;
		color: var(--signal);
		letter-spacing: 0.03em;
	}

	/* ── depth demo ────────────────────────────────────── */
	.depth-demo {
		display: flex;
		flex-direction: column;
		gap: 0;
	}

	:global(.depth-frame) {
		width: 100%;
	}

	:global(.depth-card) {
		max-width: 22rem;
		width: 100%;
	}

	.depth-card-inner {
		display: flex;
		flex-direction: column;
		gap: 1.25rem;
		padding: 0.25rem;
	}

	.depth-card-top {
		display: flex;
		align-items: center;
		gap: 0.5rem;
	}

	.depth-metrics {
		display: grid;
		grid-template-columns: repeat(3, 1fr);
		gap: 0.5rem;
	}

	.depth-metric {
		display: flex;
		flex-direction: column;
		gap: 0.25rem;
	}

	.depth-metric-value {
		font-family: var(--font-mono);
		font-size: 1.4rem;
		color: var(--text);
		line-height: 1;
		letter-spacing: -0.02em;
	}

	.depth-metric-unit {
		font-family: var(--font-mono);
		font-size: 0.72rem;
		color: var(--accent);
		letter-spacing: 0.08em;
		margin-left: 0.1rem;
	}

	.depth-card-foot {
		display: flex;
		align-items: center;
		gap: 0.75rem;
		border-top: 1px solid var(--line);
		padding-top: 0.9rem;
	}

	.depth-caption {
		padding-block: 2rem;
		border-top: 1px solid var(--line);
	}

	.depth-caption-inner {
		display: flex;
		flex-direction: column;
		gap: 0.75rem;
		max-width: 42rem;
	}

	.depth-caption-body {
		margin: 0;
		font-family: var(--font-body);
		font-size: 1rem;
		color: var(--text-soft);
		line-height: 1.6;
	}

	.depth-caption-also {
		display: flex;
		align-items: center;
		gap: 0.75rem;
		flex-wrap: wrap;
	}

	.depth-code {
		font-family: var(--font-mono);
		font-size: 0.75rem;
		color: var(--muted);
		letter-spacing: 0.04em;
		padding: 0.2em 0.5em;
		border: 1px solid var(--line);
	}

	/* ── expression list ───────────────────────────────── */
	.expr-list {
		display: flex;
		flex-direction: column;
		margin-top: calc(2.5rem * var(--reg-spacing-scale, 1));
	}

	.expr-row {
		display: grid;
		grid-template-columns: 14rem 1fr;
		gap: var(--space-xl);
		align-items: center;
		padding-block: 1.5rem;
		border-top: 1px solid var(--line);
	}

	.expr-row:last-child {
		border-bottom: 1px solid var(--line);
	}

	.expr-row-meta {
		display: flex;
		flex-direction: column;
		gap: 0.3rem;
	}

	.expr-row-name {
		font-family: var(--font-mono);
		font-size: 0.78rem;
		letter-spacing: 0.1em;
		text-transform: uppercase;
		color: var(--accent);
	}

	.expr-row-desc {
		font-family: var(--font-mono);
		font-size: 0.72rem;
		color: var(--muted);
		line-height: 1.5;
		letter-spacing: 0.02em;
	}

	.expr-row-sample {
		overflow: hidden;
	}

	/* expression styles mirrored from expressions.css */
	.expr-title-card {
		font-family: var(--font-body);
		font-size: clamp(2.4rem, 6vw, 5rem);
		font-weight: 400;
		line-height: 0.91;
		letter-spacing: -0.05em;
		color: var(--text);
		display: block;
	}

	.expr-manifesto {
		font-family: var(--font-body);
		font-style: italic;
		font-size: clamp(1.05rem, 2vw, 1.45rem);
		line-height: 1.45;
		color: var(--text-soft);
		display: block;
	}

	.expr-readout {
		font-family: var(--font-mono);
		font-size: 0.82rem;
		letter-spacing: 0.06em;
		color: var(--muted);
		line-height: 1.6;
		display: block;
	}

	.expr-command {
		font-family: var(--font-mono);
		font-size: 0.82rem;
		letter-spacing: 0.18em;
		text-transform: uppercase;
		color: var(--accent);
		font-weight: 500;
		display: block;
	}

	.expr-whisper {
		font-family: var(--font-body);
		font-size: 0.95rem;
		color: var(--muted-strong);
		line-height: 1.5;
		font-style: italic;
		display: block;
	}

	.expr-chapter {
		font-family: var(--font-mono);
		font-size: 0.62rem;
		letter-spacing: 0.22em;
		text-transform: uppercase;
		color: var(--muted-strong);
		display: flex;
		align-items: center;
		gap: 0.75rem;
	}

	.expr-chapter::after {
		content: '';
		display: block;
		width: 4rem;
		height: 1px;
		background: var(--line);
	}

	/* ── examples list ─────────────────────────────────── */
	.examples-list {
		display: flex;
		flex-direction: column;
		margin-top: calc(2.5rem * var(--reg-spacing-scale, 1));
	}

	.example-entry {
		display: grid;
		grid-template-columns: 4rem 1fr auto;
		gap: var(--space-lg);
		align-items: center;
		padding-block: 1.75rem;
		border-top: 1px solid var(--line);
		text-decoration: none;
		color: inherit;
		transition:
			background var(--transition-fast),
			transform var(--transition-smooth);
	}

	.example-entry:last-child {
		border-bottom: 1px solid var(--line);
	}

	.example-entry:hover {
		background: linear-gradient(90deg, rgba(199, 156, 87, 0.04), transparent 60%);
		transform: translateX(0.75rem);
	}

	.example-entry:hover .example-arrow {
		color: var(--accent);
		transform: translateX(4px);
	}

	.example-entry-left {
		display: flex;
		flex-direction: column;
		align-items: flex-start;
		gap: 0.4rem;
	}

	.example-id {
		font-family: var(--font-mono);
		font-size: 0.72rem;
		letter-spacing: 0.18em;
		text-transform: uppercase;
		color: var(--muted-strong);
	}

	.example-entry-center {
		display: flex;
		flex-direction: column;
		gap: 0.35rem;
	}

	.example-name {
		font-family: var(--font-body);
		font-size: clamp(1.2rem, 2.5vw, 1.7rem);
		letter-spacing: -0.03em;
		color: var(--text);
		line-height: 1.1;
	}

	.example-desc {
		font-family: var(--font-mono);
		font-size: 0.78rem;
		color: var(--muted);
		line-height: 1.6;
		letter-spacing: 0.02em;
		max-width: 40rem;
	}

	.example-entry-right {
		display: flex;
		flex-direction: column;
		align-items: flex-end;
		gap: 0.35rem;
	}

	.example-arrow {
		font-family: var(--font-mono);
		font-size: 1rem;
		color: var(--muted-strong);
		transition:
			color var(--transition-fast),
			transform var(--transition-smooth);
	}

	/* ── closer ────────────────────────────────────────── */
	:global(.closer-quote) {
		max-width: 48rem;
	}

	.closer-actions {
		display: flex;
		gap: var(--space-sm);
		flex-wrap: wrap;
		margin-top: calc(2.5rem * var(--reg-spacing-scale, 1));
	}

	/* ── responsive ────────────────────────────────────── */
	@media (max-width: 860px) {
		.reg-grid {
			grid-template-columns: 1fr;
		}

		.expr-row {
			grid-template-columns: 1fr;
			gap: 0.75rem;
		}

		.example-entry {
			grid-template-columns: 3rem 1fr;
		}

		.example-entry-right {
			display: none;
		}
	}

	@media (max-width: 600px) {
		.hero-title {
			font-size: clamp(3.5rem, 18vw, 8rem);
		}

		.example-entry {
			grid-template-columns: 2.5rem 1fr;
		}
	}
</style>
