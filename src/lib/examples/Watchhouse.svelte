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
		Seal,
		Glyph,
		TapeMark,
		Badge,
		Junction,
		ArcaneVein,
		Sequence,
		KineticText
	} from '$lib/index.js';
	import { mountSceneAppearance } from './appearance.js';

	onMount(() => mountSceneAppearance('field-notebook', 'arcane', 'twilight'));

	const sightings = [
		{
			t: 'tue · 23:14',
			place: 'cistern below the third bridge',
			klass: 'iii',
			note: 'sustained luminance. magenta tone. witness / the night-fisher gellan. credible.',
			recurring: true
		},
		{
			t: 'wed · 04:02',
			place: 'roof of the dry stair, lowmarsh',
			klass: 'i',
			note: 'transient. likely lantern glare. closed.'
		},
		{
			t: 'wed · 19:48',
			place: 'inner court, hessen exchange',
			klass: 'ii',
			note: 'hum reported. no visual. recommend re-survey at dusk.'
		},
		{
			t: 'thu · 02:30',
			place: 'cistern below the third bridge',
			klass: 'iii',
			note: 'second occurrence. same hour as tuesday. brun present. recorded.'
		},
		{
			t: 'fri · 00:55',
			place: 'aqueduct, north of the granary',
			klass: 'ii',
			note: 'reported odd quiet. no anomaly observed. left dawn-watch a note.'
		}
	];

	const classes = [
		{ k: 'i', label: 'transient', count: 11 },
		{ k: 'ii', label: 'persistent', count: 4 },
		{ k: 'iii', label: 'sustained', count: 2 },
		{ k: 'iv', label: 'manifest', count: 0 }
	];

	const equipment = [
		{ name: 'aether-lamp · field 4', status: 'ready', age: '2y' },
		{ name: 'recording bell', status: 'ready', age: '7y' },
		{ name: 'salt circle, dry', status: 'low', age: '—' },
		{ name: 'second pair of boots', status: 'ready', age: '6mo' }
	];

	function statusTone(s: string): 'ok' | 'warn' | 'default' {
		if (s === 'ready') return 'ok';
		if (s === 'low') return 'warn';
		return 'default';
	}
</script>

<div class="watch">
	<div class="atmosphere">
		<ArcaneVein x1="8%" y1="0%" x2="22%" y2="100%" speed={6} />
		<ArcaneVein x1="92%" y1="0%" x2="78%" y2="100%" speed={7.5} />
	</div>

	<Shell as="main" padY="var(--space-2xl)">
		<Sequence stagger={0.08}>
			<!-- masthead -->
			<header class="masthead">
				<Cluster gap="var(--space-lg)" align="center">
					<Seal rings={3} spokes={6} radius="84px" tone="accent">
						<Glyph name="void-sigil" />
					</Seal>
					<Stack gap="var(--space-xs)">
						<Text variant="caption" color="muted">vaud-halan · the watchhouse · lowmarsh district</Text>
						<KineticText
							text="logbook · brun"
							mode="letter"
							as="h1"
							class="watch-title"
						/>
						<Text color="muted">friday evening, eighteenth of march. the rain stopped at six.</Text>
					</Stack>
				</Cluster>
			</header>

			<Divider pattern="scribed" />

			<!-- grid: sightings · classifications · equipment -->
			<div class="grid">
				<!-- recent sightings -->
				<section class="sightings">
					<Cluster gap="var(--space-sm)" justify="between" align="baseline">
						<Bracket style="curly"><Text variant="caption" color="accent">recent sightings</Text></Bracket>
						<Text variant="caption" color="muted">this week · five</Text>
					</Cluster>
					<Divider pattern="dotted" />
					<Stack gap="var(--space-md)">
						{#each sightings as s}
							<article class="sighting" class:sighting-recur={s.recurring}>
								<div class="sighting-mark">
									<Glyph name={s.recurring ? 'crackle' : 'asterisk'} size="14px" />
								</div>
								<Stack gap="var(--space-2xs)">
									<Cluster gap="var(--space-xs)" align="baseline">
										<Text variant="caption" color="muted">{s.t}</Text>
										<Badge variant="accent">class {s.klass}</Badge>
										{#if s.recurring}
											<Badge variant="warn">recurring</Badge>
										{/if}
									</Cluster>
									<Text class="sighting-place">{s.place}</Text>
									<Text class="sighting-note">{s.note}</Text>
								</Stack>
							</article>
						{/each}
					</Stack>
				</section>

				<!-- right column: classifications + equipment + the entry -->
				<div class="right">
					<!-- classifications -->
					<section class="classes">
						<Cluster gap="var(--space-sm)" justify="between" align="baseline">
							<Bracket style="curly"><Text variant="caption" color="accent">classifications</Text></Bracket>
							<Text variant="caption" color="muted">since 01 march</Text>
						</Cluster>
						<Divider pattern="dotted" />
						<div class="class-grid">
							{#each classes as c}
								<div class="class-cell">
									<Text class="class-key">{c.k}</Text>
									<Text variant="caption" color="muted">{c.label}</Text>
									<Text class="class-count">{c.count}</Text>
								</div>
							{/each}
						</div>
					</section>

					<!-- the entry from last tuesday -->
					<Surface variant="panel" class="entry">
						<TapeMark label="open · re-read" position="tr" angle={-3} />
						<Cornerstone corner="tl" shape="shard" size="10px" />
						<Cornerstone corner="bl" shape="shard" size="10px" />
						<Stack gap="var(--space-sm)">
							<Cluster gap="var(--space-xs)" align="baseline">
								<Junction type="cross" size="10px" />
								<Text variant="caption" color="accent">tuesday's entry · 23:14</Text>
							</Cluster>
							<Text class="entry-prose">
								gellan came up the towpath holding his lamp wrong, which is how i knew he had
								seen something. he said the water below the third bridge held a magenta light for
								the length of three slow breaths. he counted because he could not look away. no
								sound. no movement.
							</Text>
							<Text class="entry-prose">
								it was the same hour as last tuesday. i'm writing this down now because i
								already know i'll be at the cistern at the same hour next week, and i would
								prefer to have a record of why.
							</Text>
							<Cluster gap="var(--space-xs)" align="baseline" justify="between">
								<Text variant="caption" color="muted">b.</Text>
								<Text variant="caption" color="muted">23:48 · third return to this page</Text>
							</Cluster>
						</Stack>
					</Surface>

					<!-- equipment -->
					<section class="equipment">
						<Cluster gap="var(--space-sm)" justify="between" align="baseline">
							<Bracket style="curly"><Text variant="caption" color="accent">equipment</Text></Bracket>
							<Text variant="caption" color="muted">checked at dusk</Text>
						</Cluster>
						<Divider pattern="dotted" />
						<Stack gap="var(--space-2xs)">
							{#each equipment as eq}
								<div class="eq-row">
									<Glyph name="dot" size="10px" tone={eq.status === 'ready' ? 'signal' : 'accent'} />
									<span class="eq-name">{eq.name}</span>
									<span class="eq-age">{eq.age}</span>
									<Badge variant={statusTone(eq.status)}>{eq.status}</Badge>
								</div>
							{/each}
						</Stack>
					</section>
				</div>
			</div>
		</Sequence>
	</Shell>
</div>

<style>
	.watch {
		min-height: 100dvh;
		position: relative;
		overflow: hidden;
	}
	.atmosphere {
		position: absolute;
		inset: 0;
		pointer-events: none;
		z-index: 0;
		opacity: 0.55;
	}

	.masthead { padding-block: var(--space-md) var(--space-lg); position: relative; z-index: 1; }
	:global(.watch-title) {
		font-family: var(--font-body);
		font-size: var(--text-display);
		font-weight: 400;
		letter-spacing: -0.04em;
		line-height: 0.95;
		font-style: italic;
		color: var(--text);
	}

	.grid {
		display: grid;
		grid-template-columns: 1.3fr 1fr;
		gap: var(--space-lg);
		margin-block: var(--space-lg);
		position: relative;
		z-index: 1;
	}
	@media (max-width: 64rem) {
		.grid { grid-template-columns: 1fr; }
	}
	.right { display: flex; flex-direction: column; gap: var(--space-lg); }

	.sightings, .classes, .equipment {
		display: flex;
		flex-direction: column;
		gap: var(--space-sm);
	}

	.sighting {
		display: grid;
		grid-template-columns: auto 1fr;
		gap: var(--space-sm);
		padding-block: var(--space-xs);
		border-bottom: 1px dashed var(--line);
	}
	.sighting:last-child { border-bottom: none; }
	.sighting-mark { padding-top: 0.3rem; color: var(--accent); }
	:global(.sighting-place) {
		font-family: var(--font-body);
		font-size: var(--text-md);
		font-style: italic;
		color: var(--text);
		line-height: 1.2;
	}
	:global(.sighting-note) {
		font-family: var(--font-body);
		font-size: var(--text-sm);
		color: var(--text-soft);
		line-height: 1.55;
	}
	:global(.sighting-recur .sighting-place) { color: var(--accent-strong); }

	.class-grid {
		display: grid;
		grid-template-columns: repeat(2, 1fr);
		gap: var(--space-xs);
	}
	.class-cell {
		padding: var(--space-sm);
		border: 1px solid var(--line);
		display: flex;
		flex-direction: column;
		gap: var(--space-3xs);
		align-items: center;
		text-align: center;
	}
	:global(.class-key) {
		font-family: var(--font-mono);
		font-size: var(--text-lg);
		color: var(--accent);
		letter-spacing: 0.1em;
		text-transform: uppercase;
	}
	:global(.class-count) {
		font-family: var(--font-mono);
		font-size: var(--text-2xl);
		color: var(--text);
		line-height: 1;
	}

	:global(.watch .entry) {
		position: relative;
		padding: var(--space-md);
	}
	:global(.entry-prose) {
		font-family: var(--font-body);
		font-size: var(--text-sm);
		line-height: 1.6;
		color: var(--text-soft);
		font-style: italic;
	}

	.eq-row {
		display: grid;
		grid-template-columns: auto 1fr auto auto;
		gap: var(--space-xs);
		align-items: center;
		font-family: var(--font-mono);
		font-size: var(--text-xs);
		padding-block: 2px;
	}
	.eq-name { color: var(--text-soft); }
	.eq-age { color: var(--muted-strong); letter-spacing: 0.06em; }
</style>
