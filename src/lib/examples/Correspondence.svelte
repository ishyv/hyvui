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
		Glyph,
		TapeMark,
		PullQuote,
		Sequence,
		KineticText
	} from '$lib/index.js';
	import { mountSceneAppearance } from './appearance.js';

	onMount(() => mountSceneAppearance('field-notebook', null, 'twilight'));

	const drafts = [
		{ label: 'first', date: '10 march', preview: 'i should have written sooner. there is no good reason i didn\'t.' },
		{ label: 'second', date: '12 march', preview: 'lior — the days are getting longer. i can see the sycamore from the desk now.' },
		{ label: 'third', date: '14 march', preview: 'i kept reading your last letter at the bakery, and the woman behind the counter asked—' }
	];

	const marginalia = [
		'check the date of the saturday lunch',
		'do not send if it sounds like a lecture',
		'mention the postcard? he sent it before christmas',
		'keep it short. one page. resist the second page.'
	];
</script>

<div class="corr">
	<Shell as="main" padY="var(--space-xl)" max="68rem">
		<Sequence stagger={0.1}>
			<header class="masthead">
				<Cluster gap="var(--space-md)" align="baseline" justify="between">
					<Stack gap="var(--space-2xs)">
						<Cluster gap="var(--space-xs)" align="baseline">
							<Glyph name="ink-star" size="14px" />
							<Text variant="caption" color="muted">field correspondence · draft iv</Text>
						</Cluster>
						<KineticText
							text="for lior, in the spring"
							mode="word"
							as="h1"
							class="corr-title"
						/>
					</Stack>
					<Stack gap="0" align="end">
						<Text variant="caption" color="muted">friday · 18 march</Text>
						<Text variant="caption" color="muted">rue des marais · 19:42</Text>
					</Stack>
				</Cluster>
			</header>

			<!-- recipient's last reply, quoted -->
			<section class="quote">
				<PullQuote
					quote="i thought i'd hear from you before march. it's all right. i'm not writing to scold. i'm writing because the magnolia on the back wall opened last week and i wanted you to know. it was four days early this year."
					attribution="lior, 02 march"
				/>
			</section>

			<!-- letter + side rail -->
			<div class="layout">
				<!-- left rail: drafts -->
				<aside class="rail">
					<Cluster gap="var(--space-xs)" align="baseline" justify="between">
						<Text variant="caption" color="accent">previous drafts</Text>
						<Text variant="caption" color="muted">three</Text>
					</Cluster>
					<Divider pattern="dotted" />
					<Stack gap="var(--space-sm)">
						{#each drafts as d}
							<article class="draft">
								<Cluster gap="var(--space-2xs)" align="baseline">
									<Text variant="caption" color="muted">{d.date}</Text>
									<Text variant="caption" color="accent">{d.label}</Text>
								</Cluster>
								<Text color="soft" class="draft-text">{d.preview}</Text>
							</article>
						{/each}
					</Stack>
				</aside>

				<!-- letter -->
				<section class="letter-wrap">
					<Surface variant="card" class="letter">
						<TapeMark label="draft iv · in progress" position="tr" angle={-3} />
						<Cornerstone corner="tl" shape="serif" size="14px" />
						<Cornerstone corner="bl" shape="serif" size="14px" />
						<Stack gap="var(--space-md)">
							<Stack gap="0">
								<Text variant="caption" color="muted">paris · friday evening</Text>
								<Text variant="caption" color="muted">18 march</Text>
							</Stack>

							<Text class="salutation">dear lior,</Text>

							<Text class="prose">
								the bakery downstairs closed at six and the building has been quiet since.
								i found your last letter under a stack of bills and read it again while the
								water boiled. four days early. that's worth writing about, and i mean to.
							</Text>

							<Text class="prose">
								i didn't write back in march because i was afraid the letter would arrive
								before the magnolia did. i'm not sure that makes sense outside of my head.
								it doesn't matter. the magnolia is out now and i'm writing back.
							</Text>

							<Text class="prose">
								the room above the bakery is the same. the floor still slopes toward the
								window. the sycamore is leafing — i can see it from the desk if i sit a
								certain way. i thought of you the other afternoon, on the long walk past
								the canal, when the light went the color it does in your kitchen at four.
								i remembered standing there once.
							</Text>

							<Text class="prose">
								i'll come up before the magnolia drops. probably the second week of april.
								i'll write again with a date.
							</Text>

							<Stack gap="var(--space-2xs)">
								<Text class="signoff">love,</Text>
								<Text class="signature">s.</Text>
							</Stack>
						</Stack>
					</Surface>
				</section>

				<!-- right rail: marginalia -->
				<aside class="margin">
					<Cluster gap="var(--space-xs)" align="baseline">
						<Glyph name="scribed-tick" size="12px" />
						<Text variant="caption" color="accent">marginalia</Text>
					</Cluster>
					<Divider pattern="dotted" />
					<Stack gap="var(--space-sm)">
						{#each marginalia as note, i}
							<div class="margin-note">
								<Text variant="caption" color="muted">{String(i + 1).padStart(2, '0')}</Text>
								<Text class="margin-text">{note}</Text>
							</div>
						{/each}
					</Stack>
				</aside>
			</div>
		</Sequence>
	</Shell>
</div>

<style>
	.corr {
		min-height: 100dvh;
		background:
			radial-gradient(ellipse at 50% 0%, color-mix(in srgb, var(--accent) 5%, transparent), transparent 60%);
	}
	.masthead { padding-block: var(--space-md) var(--space-lg); }
	:global(.corr-title) {
		font-family: var(--font-body);
		font-size: var(--text-3xl);
		font-style: italic;
		font-weight: 400;
		letter-spacing: -0.02em;
		line-height: 1;
		color: var(--text);
	}

	.quote {
		max-width: 44rem;
		margin-inline: auto;
		margin-block: var(--space-lg);
	}

	.layout {
		display: grid;
		grid-template-columns: 14rem 1fr 14rem;
		gap: var(--space-lg);
		align-items: start;
		margin-block: var(--space-lg);
	}
	@media (max-width: 64rem) {
		.layout { grid-template-columns: 1fr; }
		.rail, .margin { order: 2; }
		.letter-wrap { order: 1; }
	}

	.rail, .margin {
		display: flex;
		flex-direction: column;
		gap: var(--space-sm);
	}

	.draft {
		display: flex;
		flex-direction: column;
		gap: var(--space-3xs);
		padding-bottom: var(--space-sm);
		border-bottom: 1px dashed var(--line);
	}
	.draft:last-child { border-bottom: none; }
	:global(.draft-text) {
		font-family: var(--font-body);
		font-style: italic;
		font-size: var(--text-xs);
		line-height: 1.5;
	}

	:global(.letter) {
		position: relative;
		padding: var(--space-xl);
		background:
			linear-gradient(180deg, color-mix(in srgb, var(--accent-strong) 4%, transparent), transparent 30%),
			var(--surface-card);
	}
	:global(.salutation) {
		font-family: var(--font-body);
		font-style: italic;
		font-size: var(--text-lg);
		color: var(--text);
	}
	:global(.prose) {
		font-family: var(--font-body);
		font-size: var(--text-md);
		line-height: 1.7;
		color: var(--text-soft);
		text-wrap: pretty;
	}
	:global(.signoff) {
		font-family: var(--font-body);
		font-style: italic;
		font-size: var(--text-md);
		color: var(--text);
	}
	:global(.signature) {
		font-family: var(--font-body);
		font-style: italic;
		font-size: var(--text-xl);
		color: var(--text);
		letter-spacing: 0.04em;
	}

	.margin-note {
		display: grid;
		grid-template-columns: 1.5rem 1fr;
		gap: var(--space-xs);
		align-items: baseline;
	}
	:global(.margin-text) {
		font-family: var(--font-body);
		font-style: italic;
		font-size: var(--text-xs);
		line-height: 1.5;
		color: var(--muted);
	}
</style>
