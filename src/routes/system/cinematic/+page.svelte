<script lang="ts">
	import { onMount } from 'svelte';
	import {
		Shell,
		Stack,
		Cluster,
		Surface,
		Card,
		Text,
		Divider,
		Sequence,
		KineticText,
		PageHeader,
		applyWeight,
		applyTheme,
		applyGrade,
		clearWeight,
		clearTheme,
		clearGrade,
		weightRegisters,
		themeRegisters,
		gradeRegisters,
		type WeightRegister,
		type ThemeRegister,
		type GradeRegister
	} from '$lib/index.js';
	import ShowcaseShell from '$lib/showcase/ShowcaseShell.svelte';
	import { getShowcaseManifest } from '$lib/showcase/showcaseManifest.js';

	const showcaseManifest = getShowcaseManifest('system-cinematic');
	let activeWeight = $state<WeightRegister | null>(showcaseManifest?.weight ?? null);
	let activeTheme = $state<ThemeRegister | null>(showcaseManifest?.theme ?? null);
	let activeGrade = $state<GradeRegister | null>(showcaseManifest?.grade ?? null);
	let lightAngle = $state(135);
	let sequenceKey = $state(0);

	onMount(() => {
		const previousLightAngle = document.documentElement.style.getPropertyValue('--key-light-angle');
		document.documentElement.style.setProperty('--key-light-angle', `${lightAngle}deg`);
		return () => {
			if (previousLightAngle) {
				document.documentElement.style.setProperty('--key-light-angle', previousLightAngle);
			} else {
				document.documentElement.style.removeProperty('--key-light-angle');
			}
		};
	});

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
	function setGrade(g: GradeRegister | null) {
		activeGrade = g;
		if (g) applyGrade(g);
		else clearGrade();
	}
	function setLightAngle(deg: number) {
		lightAngle = deg;
		document.documentElement.style.setProperty('--key-light-angle', `${deg}deg`);
	}
	function replaySequence() {
		sequenceKey++;
	}
</script>

<svelte:head>
	<title>cinematic · hyvui</title>
</svelte:head>

<ShowcaseShell manifest={showcaseManifest!}>
	<main class="system-demo" data-system-demo>
		<Shell as="div" padY="var(--space-2xl)">
	<Stack gap="var(--space-2xl)">
		<PageHeader
			title="cinematic"
			subtitle="weight sets density. theme sets material. grade sets color. light and sequence act on both. change one control, then compare the same scene."
		/>

		<!-- controls -->
		<Surface variant="panel">
			<div class="controls">
				<div class="row">
					<Text variant="caption" color="muted">weight</Text>
					<Cluster gap="var(--space-2xs)">
						<button class="tk" class:tk-on={activeWeight === null} onclick={() => setWeight(null)}>none</button>
						{#each weightRegisters as w}
							<button class="tk" class:tk-on={activeWeight === w} onclick={() => setWeight(w)}>{w}</button>
						{/each}
					</Cluster>
				</div>
				<div class="row">
					<Text variant="caption" color="muted">theme</Text>
					<Cluster gap="var(--space-2xs)">
						<button class="tk" class:tk-on={activeTheme === null} onclick={() => setTheme(null)}>none</button>
						{#each themeRegisters as t}
							<button class="tk" class:tk-on={activeTheme === t} onclick={() => setTheme(t)}>{t}</button>
						{/each}
					</Cluster>
				</div>
				<div class="row">
					<Text variant="caption" color="muted">grade</Text>
					<Cluster gap="var(--space-2xs)">
						<button class="tk" class:tk-on={activeGrade === null} onclick={() => setGrade(null)}>none</button>
						{#each gradeRegisters as g}
							<button class="tk" class:tk-on={activeGrade === g} onclick={() => setGrade(g)}>{g}</button>
						{/each}
					</Cluster>
				</div>
				<div class="row">
					<Text variant="caption" color="muted">key light angle: {lightAngle}°</Text>
					<input
						type="range"
						min="0"
						max="360"
						bind:value={lightAngle}
						oninput={() => setLightAngle(lightAngle)}
					/>
				</div>
			</div>
		</Surface>

		<Divider pattern="scribed" />

		<!-- 01 — Lighting demo -->
		<section>
			<Text variant="caption" color="accent">01 / lighting</Text>
			<Text color="muted">
				Shadows follow --key-light-angle. drag the slider. every surface uses the new direction.
			</Text>
			<Cluster gap="var(--space-lg)" align="start">
				<Surface variant="card" class="lit-card"><Text>card</Text></Surface>
				<Surface variant="panel" class="lit-card"><Text>panel</Text></Surface>
				<Surface variant="base" class="lit-card"><Text>base</Text></Surface>
			</Cluster>
		</section>

		<Divider />

		<!-- 02 — Choreography demo -->
		<section>
			<Text variant="caption" color="accent">02 / choreography</Text>
			<Text color="muted">
				Sequence reveals direct children in order. the active register changes the delay. press replay.
			</Text>
			<button class="tk" onclick={replaySequence}>replay sequence</button>
			{#key sequenceKey}
				<Sequence from="first">
					{#each Array(6) as _, i}
						<Card class="seq-card">
							<Text>item {i + 1}</Text>
						</Card>
					{/each}
				</Sequence>
			{/key}
		</section>

		<Divider />

		<!-- 03 — KineticText demo -->
		<section>
			<Text variant="caption" color="accent">03 / kinetic type</Text>
			<Text color="muted">KineticText reveals letters, words, masks, or telegraph marks. the active theme adds its own sweep.</Text>
			{#key sequenceKey}
				<Stack gap="var(--space-md)">
					<KineticText text="signal acquired" mode="letter" as="h2" class="kt-heading" />
					<KineticText text="initiating cooling protocol" mode="word" class="kt-body" />
					<KineticText text="archive: 0421" mode="mask" class="kt-heading" />
					<KineticText text="ACK ACK NAK ACK" mode="telegraph" class="kt-mono" />
				</Stack>
			{/key}
		</section>

		<Divider pattern="chevron" />

		<!-- 04 — Composition: everything at once -->
		<section>
			<Text variant="caption" color="accent">04 / composition</Text>
			<Text color="muted">
				These controls stack. change one at a time, then compare the same scene.
			</Text>
			<div class="composition">
				<Surface variant="card">
					<Stack gap="var(--space-sm)">
						<KineticText text="field report 0421" mode="letter" as="h3" class="kt-heading" />
						<Text color="muted">intake / log / observation</Text>
						<Divider pattern="dotted" />
						<Text>signal stabilized at 0421. archive it.</Text>
					</Stack>
				</Surface>
			</div>
		</section>
	</Stack>
</Shell>
	</main>
</ShowcaseShell>

<style>
	.controls {
		display: flex;
		flex-direction: column;
		gap: var(--space-md);
		padding: var(--space-md);
	}
	.row {
		display: flex;
		align-items: center;
		gap: var(--space-md);
		flex-wrap: wrap;
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
	.tk:hover { color: var(--text); border-color: var(--line-strong); }
	.tk-on { color: var(--text); border-color: var(--accent); }

	input[type='range'] {
		flex: 1;
		max-width: 24rem;
		accent-color: var(--accent);
	}

	section { display: flex; flex-direction: column; gap: var(--space-sm); }

	:global(.lit-card) { padding: var(--space-lg); min-width: 10rem; }
	:global(.seq-card) { padding: var(--space-md); margin-bottom: var(--space-xs); }
	:global(.kt-heading) {
		font-family: var(--font-body);
		font-size: var(--text-xl);
		line-height: 1;
	}
	:global(.kt-body) {
		font-family: var(--font-body);
		font-size: var(--text-md);
	}
	:global(.kt-mono) {
		font-family: var(--font-mono);
		font-size: var(--text-sm);
		letter-spacing: 0.2em;
	}
	.composition { max-width: 38rem; }
</style>
