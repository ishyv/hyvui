<script lang="ts">
	import {
		Shell,
		Stack,
		Cluster,
		Surface,
		Badge,
		Text,
		Divider,
		Cornerstone,
		Bracket,
		Seal,
		MedalCut,
		Glyph,
		PageHeader,
		applyWeight,
		applyTheme,
		clearWeight,
		clearTheme,
		weightRegisters,
		themeRegisters,
		type WeightRegister,
		type ThemeRegister
	} from '$lib/index.js';

	let activeWeight = $state<WeightRegister | null>(null);
	let activeTheme = $state<ThemeRegister | null>(null);

	function setWeight(w: WeightRegister | null) {
		activeWeight = w;
		if (w) applyWeight(w);
		else clearWeight();
	}
	function setTheme(t: ThemeRegister | null) {
		activeTheme = t;
		if (t) applyTheme(t);
		else clearTheme();
	}
</script>

<svelte:head>
	<title>ornament patterns — hyvui</title>
</svelte:head>

<Shell as="main" padY="var(--space-2xl)">
	<Stack gap="var(--space-2xl)">
		<PageHeader
			title="ornament patterns"
			subtitle="lego-piece composition. drop the same five frame pieces into any register × theme grid to see how character shifts. switch the register and theme above and watch each pattern re-tune."
		/>

		<Cluster gap="var(--space-md)" align="center">
			<Text variant="caption" color="muted">register</Text>
			<Cluster gap="var(--space-2xs)">
				<button
					class="tk"
					class:tk-on={activeWeight === null}
					onclick={() => setWeight(null)}>none</button
				>
				{#each weightRegisters as w}
					<button
						class="tk"
						class:tk-on={activeWeight === w}
						onclick={() => setWeight(w)}>{w}</button
					>
				{/each}
			</Cluster>
			<Text variant="caption" color="muted">theme</Text>
			<Cluster gap="var(--space-2xs)">
				<button
					class="tk"
					class:tk-on={activeTheme === null}
					onclick={() => setTheme(null)}>none</button
				>
				{#each themeRegisters as t}
					<button class="tk" class:tk-on={activeTheme === t} onclick={() => setTheme(t)}
						>{t}</button
					>
				{/each}
			</Cluster>
		</Cluster>

		<!-- 1. Framed surface — Surface + 4 Cornerstones -->
		<section>
			<Text variant="caption" color="accent">01 / framed surface</Text>
			<Text color="muted">Surface + four Cornerstones, one per corner. The cheapest possible lego frame.</Text>
			<Cluster gap="var(--space-lg)" align="start">
				{#each ['pip', 'nub', 'shard', 'serif'] as const as shape}
					<Surface variant="card" class="pat-card">
						<Cornerstone corner="tl" {shape} size="10px" />
						<Cornerstone corner="tr" {shape} size="10px" />
						<Cornerstone corner="bl" {shape} size="10px" />
						<Cornerstone corner="br" {shape} size="10px" />
						<Text variant="caption" color="muted">shape: {shape}</Text>
						<Text>framed content</Text>
					</Surface>
				{/each}
			</Cluster>
		</section>

		<Divider />

		<!-- 2. Bracketed glyph — Bracket wrapping a Glyph for inline emphasis -->
		<section>
			<Text variant="caption" color="accent">02 / bracketed glyph</Text>
			<Text color="muted">
				Inline emphasis. Wrap any small element to mark it. Pairs naturally with Glyph.
			</Text>
			<Cluster gap="var(--space-lg)">
				<Bracket style="angle"><Glyph name="asterisk" /></Bracket>
				<Bracket style="full" tone="signal"><Glyph name="dagger" /></Bracket>
				<Bracket style="curly" tone="accent">key</Bracket>
				<Bracket style="square" weight="bold"><Glyph name="dot" /></Bracket>
			</Cluster>
		</section>

		<Divider />

		<!-- 3. Stamped header — Seal centered with Glyph + heading + divider -->
		<section>
			<Text variant="caption" color="accent">03 / stamped header</Text>
			<Text color="muted">Seal + Glyph + heading + divider. A document opener.</Text>
			<Cluster gap="var(--space-lg)" align="center">
				<Seal rings={3} spokes={8} radius="56px">
					<Glyph name="compass-rose" />
				</Seal>
				<Stack gap="var(--space-2xs)">
					<Text variant="heading" as="h3">field report</Text>
					<Divider />
					<Text color="muted">intake / 0421 / log</Text>
				</Stack>
			</Cluster>
		</section>

		<Divider />

		<!-- 4. Medal-cut badge — MedalCut wrapping a Badge for distinctive status -->
		<section>
			<Text variant="caption" color="accent">04 / medal-cut badge</Text>
			<Text color="muted">MedalCut wraps a Badge to give status its own polygon identity.</Text>
			<Cluster gap="var(--space-md)">
				{#each ['shield', 'hex', 'parallelogram', 'banner', 'tab'] as const as cut}
					<MedalCut {cut}>
						<Badge variant="accent">{cut}</Badge>
					</MedalCut>
				{/each}
			</Cluster>
		</section>

		<Divider />

		<!-- 5. Glyph dialects — same name, different register/theme libraries -->
		<section>
			<Text variant="caption" color="accent">05 / glyph dialects</Text>
			<Text color="muted">
				Same `name` prop renders different SVG per active register or theme — the iconographic
				vocabulary changes with the dialect.
			</Text>
			<Cluster gap="var(--space-md)" align="center">
				{#each ['asterisk', 'star', 'dagger', 'dot'] as const as name}
					<Stack gap="var(--space-2xs)" align="center">
						<Glyph {name} size="32px" />
						<Text variant="caption" color="muted">{name}</Text>
					</Stack>
				{/each}
			</Cluster>
		</section>
	</Stack>
</Shell>

<style>
	:global(.pat-card) {
		position: relative;
		padding: var(--space-md);
		min-width: 12rem;
	}

	.tk {
		font-family: var(--font-mono);
		font-size: var(--text-2xs);
		text-transform: lowercase;
		letter-spacing: 0.1em;
		background: transparent;
		border: 1px solid var(--line);
		color: var(--muted);
		padding: var(--space-2xs) var(--space-xs);
		cursor: pointer;
		transition: all var(--transition-fast);
	}
	.tk:hover {
		color: var(--text);
		border-color: var(--line-strong);
	}
	.tk-on {
		color: var(--text);
		border-color: var(--accent);
	}

	section {
		display: flex;
		flex-direction: column;
		gap: var(--space-sm);
	}
</style>
