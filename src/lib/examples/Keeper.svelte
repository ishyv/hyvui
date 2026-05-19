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
		Sequence,
		KineticText
	} from '$lib/index.js';
	import { mountSceneAppearance } from './appearance.js';

	onMount(() => mountSceneAppearance('archive', null, 'cold-archive'));

	const items = [
		{
			ref: 'mbr-i-04',
			title: 'letter book iv',
			subtitle: 'marbry to henridge · 1843–1851',
			pulled: 'today 09:12',
			condition: 'damaged'
		},
		{
			ref: 'mbr-i-05',
			title: 'letter book v',
			subtitle: 'marbry to henridge · 1852–1856',
			pulled: '14 march',
			condition: 'fragile'
		},
		{
			ref: 'mbr-ii-12',
			title: 'estate ledger xii',
			subtitle: 'household accounts · 1849',
			pulled: '02 march',
			condition: 'stable'
		},
		{
			ref: 'mbr-iii-02',
			title: 'pressed botanicals',
			subtitle: 'compiled by E. marbry · undated',
			pulled: '—',
			condition: 'stable'
		},
		{
			ref: 'mbr-iv-08',
			title: 'photographs · interior',
			subtitle: 'morsten house, 1881 (3 prints)',
			pulled: '28 february',
			condition: 'foxed'
		},
		{
			ref: 'mbr-iv-09',
			title: 'photographs · garden',
			subtitle: 'morsten house, 1881–1884',
			pulled: '28 february',
			condition: 'stable'
		},
		{
			ref: 'mbr-v-01',
			title: 'commonplace book',
			subtitle: 'unsigned · attributed to E. marbry',
			pulled: 'today 10:40',
			condition: 'stable'
		}
	];

	const pulls = [
		{ ref: 'mbr-i-04', at: '09:12', note: 'photographed pages 14–16 before transit' },
		{ ref: 'mbr-v-01', at: '10:40', note: 'index review for catalog entry' },
		{ ref: 'mbr-ii-12', at: 'yesterday', note: 'returned to vault. closed.' }
	];

	function conditionTone(c: string): 'default' | 'accent' | 'signal' | 'warn' | 'fail' | 'ok' {
		if (c === 'damaged') return 'warn';
		if (c === 'fragile') return 'signal';
		return 'default';
	}
</script>

<div class="keeper">
	<Shell as="main" padY="var(--space-2xl)">
		<Sequence stagger={0.14}>
			<!-- masthead — establishing -->
			<header class="masthead">
				<Cluster gap="var(--space-xl)" align="start">
					<Seal rings={3} spokes={12} radius="96px">
						<Glyph name="compass-rose" />
					</Seal>
					<Stack gap="var(--space-xs)">
						<Text variant="caption" color="muted">private collection · keeper c. mara</Text>
						<KineticText
							text="the marbry estate"
							mode="mask"
							as="h1"
							class="keeper-title"
						/>
						<Text color="muted">
							catalogue entries · provenance · conservation. quiet work, kept slowly.
						</Text>
						<Cluster gap="var(--space-md)">
							<Text variant="caption" color="muted">today · 18 march</Text>
							<Text variant="caption" color="muted">items · 142</Text>
							<Text variant="caption" color="muted">pulled · 2</Text>
						</Cluster>
					</Stack>
				</Cluster>
			</header>

			<Divider pattern="scribed" />

			<!-- main split -->
			<div class="split">
				<!-- index -->
				<section class="index">
					<Cluster gap="var(--space-sm)" justify="between" align="baseline">
						<Bracket style="full"><Text variant="caption" color="accent">index</Text></Bracket>
						<Text variant="caption" color="muted">a–z by reference</Text>
					</Cluster>
					<Divider pattern="dotted" />
					<Stack gap="0">
						{#each items as item}
							<article class="entry">
								<div class="entry-mark">
									<Glyph name="section" size="14px" />
								</div>
								<div class="entry-body">
									<Cluster gap="var(--space-xs)" align="baseline">
										<Text variant="caption" color="muted">{item.ref}</Text>
										<Text class="entry-title">{item.title}</Text>
									</Cluster>
									<Text variant="caption" color="muted">{item.subtitle}</Text>
								</div>
								<div class="entry-meta">
									<Text variant="caption" color="muted">{item.pulled}</Text>
									<Badge variant={conditionTone(item.condition)}>{item.condition}</Badge>
								</div>
							</article>
						{/each}
					</Stack>
				</section>

				<!-- detail — the damaged book -->
				<aside class="detail">
					<Surface variant="panel" class="detail-card">
						<TapeMark label="conservation · pending" position="tr" angle={-3} />
						<Cornerstone corner="tl" shape="serif" size="12px" />
						<Cornerstone corner="bl" shape="serif" size="12px" />
						<Stack gap="var(--space-md)">
							<Stack gap="var(--space-2xs)">
								<Text variant="caption" color="muted">mbr-i-04 · letter book iv</Text>
								<Text variant="heading" as="h2" class="detail-title">marbry to henridge</Text>
								<Text variant="caption" color="muted">1843–1851 · 248pp · half-calf binding</Text>
							</Stack>

							<Divider pattern="solid" />

							<Stack gap="var(--space-xs)">
								<Text variant="caption" color="accent">provenance</Text>
								<Text color="soft">
									acquired direct from the marbry estate, march 1981. inventory entry no. 41.
									previously held by the henridge family of stowford from receipt until 1979.
								</Text>
							</Stack>

							<Stack gap="var(--space-xs)">
								<Text variant="caption" color="accent">condition</Text>
								<Text color="soft">
									water damage to page 14 and facing leaf. ink legible. paper tide-line visible.
									recommend immediate stabilisation before further handling. binding sound.
								</Text>
							</Stack>

							<Stack gap="var(--space-xs)">
								<Text variant="caption" color="accent">keeper's note</Text>
								<Text color="soft" class="keeper-note">
									the letter on page 14 is the long one to henridge after his daughter's
									funeral. i would like to be careful with it. the rest can wait.
								</Text>
							</Stack>
						</Stack>
					</Surface>
				</aside>
			</div>

			<Divider pattern="scribed" />

			<!-- today's pulls -->
			<section class="pulls">
				<Cluster gap="var(--space-sm)" justify="between" align="baseline">
					<Bracket style="full"><Text variant="caption" color="accent">today's pulls</Text></Bracket>
					<Text variant="caption" color="muted">vault log · 18 march</Text>
				</Cluster>
				<Divider pattern="dotted" />
				<Stack gap="var(--space-2xs)">
					{#each pulls as p}
						<div class="pull">
							<span class="pull-time">{p.at}</span>
							<span class="pull-ref">{p.ref}</span>
							<span class="pull-note">{p.note}</span>
						</div>
					{/each}
				</Stack>
			</section>
		</Sequence>
	</Shell>
</div>

<style>
	.keeper {
		min-height: 100dvh;
	}
	.masthead { padding-block: var(--space-lg) var(--space-md); }
	:global(.keeper-title) {
		font-family: var(--font-body);
		font-size: var(--text-display);
		font-weight: 400;
		letter-spacing: -0.04em;
		line-height: 0.92;
		color: var(--text);
	}
	:global(.detail-title) {
		font-family: var(--font-body);
		font-size: var(--text-2xl);
		font-weight: 400;
		line-height: 1;
		letter-spacing: -0.03em;
		color: var(--text);
	}

	.split {
		display: grid;
		grid-template-columns: 1.4fr 1fr;
		gap: var(--space-xl);
		margin-block: var(--space-lg);
	}
	@media (max-width: 64rem) {
		.split { grid-template-columns: 1fr; }
	}

	.index, .pulls {
		display: flex;
		flex-direction: column;
		gap: var(--space-sm);
	}

	.entry {
		display: grid;
		grid-template-columns: auto 1fr auto;
		gap: var(--space-md);
		align-items: start;
		padding-block: var(--space-sm);
		border-bottom: 1px solid var(--line);
	}
	.entry:last-child { border-bottom: none; }
	.entry-mark { padding-top: 0.2rem; color: var(--muted-strong); }
	.entry-body { display: flex; flex-direction: column; gap: var(--space-3xs); min-width: 0; }
	:global(.entry-title) {
		font-family: var(--font-body);
		font-size: var(--text-md);
		font-style: italic;
		color: var(--text);
		line-height: 1.2;
	}
	.entry-meta {
		display: flex;
		flex-direction: column;
		align-items: flex-end;
		gap: var(--space-3xs);
	}

	:global(.detail-card) {
		position: relative;
		padding: var(--space-lg);
	}
	:global(.keeper-note) {
		font-style: italic;
		font-family: var(--font-body);
	}

	.pull {
		display: grid;
		grid-template-columns: 7rem 6rem 1fr;
		gap: var(--space-md);
		align-items: baseline;
		font-family: var(--font-mono);
		font-size: var(--text-xs);
		padding-block: 2px;
	}
	.pull-time { color: var(--muted-strong); letter-spacing: 0.08em; }
	.pull-ref { color: var(--accent); }
	.pull-note { color: var(--text-soft); font-family: var(--font-body); font-size: var(--text-sm); }
</style>
