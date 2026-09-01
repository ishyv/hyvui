<script lang="ts">
  import {
    Badge,
    Card,
    DataStream,
    DepthLayer,
    DepthStage,
    Divider,
    FloatCard,
    Frame,
    Grid,
    GridOverlay,
    HorizonGrid,
    Label,
    ScanBand,
    SignalRing,
    Stack,
    StatusDot,
    Surface,
    Text,
    Vignette
  } from '$lib/index.js';
  import ShowcaseShell from '$lib/showcase/ShowcaseShell.svelte';
  import { getShowcaseManifest } from '$lib/showcase/showcaseManifest.js';
  import {
    baselineCases,
    getBaselineCase,
    type BaselineCaseId
  } from '$lib/next-lab/baselineCases.js';
  import type { PageData } from './$types.js';

  let { data }: { data: PageData } = $props();
  const current = $derived(getBaselineCase(data.caseId as BaselineCaseId));
  const showcaseManifest = getShowcaseManifest('next-baseline');
</script>

<svelte:head>
  <title>next lab / current library baseline</title>
  <meta
    name="description"
    content="A control group made with the current public HyvUI API."
  />
</svelte:head>

<ShowcaseShell manifest={showcaseManifest!}>
<main
  class="baseline"
  data-composition-case={current.id}
  data-layout-signature={current.signature}
  data-weight={current.weight}
>
  <header class="baseline-header">
    <div>
      <Label color="accent">next lab / control group</Label>
      <Text as="h1" variant="heading">current library. five controls.</Text>
    </div>
    <Text variant="body" color="muted">
      public api only. use this control to measure what the next system changes
      in an agent-made page.
    </Text>
  </header>

  <nav class="case-nav" data-case-nav aria-label="baseline cases">
    {#each baselineCases as item, index}
      <a
        href={`/next-lab/baseline?case=${item.id}`}
        class:active={item.id === current.id}
        aria-current={item.id === current.id ? 'page' : undefined}
      >
        <span>{String(index + 1).padStart(2, '0')}</span>
        {item.kicker.replace(/^\d+ \/ /, '')}
      </a>
    {/each}
  </nav>

  <section class="case-stage" aria-labelledby="case-title">
    <div class="case-copy" id="case-title">
      <Label color="signal">{current.kicker}</Label>
      <Text as="h2" variant="heading">{current.title}</Text>
      <Text variant="body" color="soft">{current.description}</Text>
      <div class="case-meta">
        <Badge variant="default">{current.id}</Badge>
        <Label color="muted">control / public api</Label>
      </div>
    </div>

    {#if current.id === 'sparse'}
      <div class="composition sparse-composition">
        <GridOverlay />
        <div class="sparse-orbit" aria-hidden="true">
          <SignalRing active size={260} color="var(--signal)" />
        </div>
        <Surface variant="panel" class="sparse-note">
          <Label color="accent">contact / 01</Label>
          <Text expression="readout">–42 dbm</Text>
          <Divider />
          <Text variant="caption" color="muted">bearing held</Text>
        </Surface>
      </div>
    {:else if current.id === 'dense'}
      <div class="composition dense-composition">
        <div class="dense-status">
          <Stack direction="horizontal" gap="var(--space-xs)" align="center">
            <StatusDot status="ok" size={7} />
            <Label color="signal">12 active channels</Label>
          </Stack>
          <Label color="muted">last sweep / 02:14</Label>
        </div>
        <Grid cols={3} gap="var(--space-xs)">
          {#each ['north', 'east', 'south', 'west', 'upper', 'lower'] as sector, index}
            <Card>
              <Stack gap="var(--space-xs)">
                <Label color="muted">{sector}</Label>
                <Text expression="readout">{String(18 + index * 7).padStart(2, '0')}</Text>
                <Badge variant={index % 3 === 0 ? 'accent' : 'signal'}>
                  {index % 3 === 0 ? 'drift' : 'clear'}
                </Badge>
              </Stack>
            </Card>
          {/each}
        </Grid>
        <div class="dense-stream">
          <DataStream active speed="slow" />
          <Text variant="caption" color="muted">all channels remain in view</Text>
        </div>
      </div>
    {:else if current.id === 'image-dominant'}
      <div class="composition image-composition">
        <Surface variant="card" class="image-frame-wrap">
          <Frame ratio="4/5" class="image-frame">
            <img src="/favicon.png" alt="abstract HyvUI mark" />
          </Frame>
        </Surface>
        <div class="image-caption">
          <Label color="accent">plate / 1843–1851</Label>
          <Text variant="body" color="soft">the mark survived transfer. the edge was cropped.</Text>
          <Divider />
          <Label color="muted">archive / image held at full scale</Label>
        </div>
      </div>
    {:else if current.id === 'type-dominant'}
      <div class="composition type-composition">
        <Vignette />
        <div class="type-index" aria-hidden="true">04</div>
        <Text as="p" variant="caption" color="accent">a note on proportion</Text>
        <Text as="h3" variant="heading" expression="title-card">
          the sentence sets the measure
        </Text>
        <Text variant="italic" color="soft">
          leave room around the line. compare its measure.
        </Text>
        <div class="type-line" aria-hidden="true"></div>
      </div>
    {:else}
      <div class="composition atmospheric-composition">
        <DepthStage perspective="far" class="atmospheric-stage">
          <div class="atmospheric-ground" aria-hidden="true">
            <DepthLayer level="ground">
              <HorizonGrid rows={12} cols={10} vanishY={0.42} animated />
            </DepthLayer>
          </div>
          <div class="atmospheric-field" aria-hidden="true">
            <GridOverlay />
            <ScanBand active axis="y" />
            <SignalRing active size={220} color="var(--accent)" />
          </div>
          <DepthLayer level="raised">
            <FloatCard tiltMax={5} class="atmospheric-card">
              <Stack gap="var(--space-md)">
                <Stack direction="horizontal" justify="between" align="center">
                  <Label color="signal">presence / near</Label>
                  <StatusDot status="pend" />
                </Stack>
                <Text as="h3" variant="heading">weather in the channel</Text>
                <Text variant="body" color="soft">air moves. signal follows.</Text>
              </Stack>
            </FloatCard>
          </DepthLayer>
        </DepthStage>
      </div>
    {/if}
  </section>
</main>
</ShowcaseShell>

<style>
  .baseline {
    min-height: 100dvh;
    padding: var(--space-scene);
    background: var(--bg);
    color: var(--text);
  }

  .baseline-header {
    display: grid;
    grid-template-columns: minmax(0, 1fr) minmax(16rem, 30rem);
    gap: var(--space-xl);
    align-items: end;
    max-width: var(--shell-max);
    margin: 0 auto var(--space-xl);
  }

  .baseline-header > div {
    display: flex;
    flex-direction: column;
    gap: var(--space-sm);
  }

  :global(.baseline-header h1),
  :global(.case-copy h2) {
    max-width: 12ch;
  }

  .case-nav {
    display: flex;
    flex-wrap: wrap;
    gap: var(--space-xs);
    max-width: var(--shell-max);
    margin: 0 auto var(--space-xl);
    padding-block: var(--space-sm);
    border-block: 1px solid var(--line);
  }

  .case-nav a {
    display: inline-flex;
    gap: var(--space-xs);
    padding: var(--space-xs) var(--space-sm);
    color: var(--muted);
    font-family: var(--font-mono);
    font-size: var(--text-2xs);
    letter-spacing: 0.08em;
    text-decoration: none;
    text-transform: uppercase;
  }

  .case-nav a span {
    color: var(--accent);
  }

  .case-nav a:hover,
  .case-nav a.active {
    color: var(--text);
    background: color-mix(in srgb, var(--accent) 10%, transparent);
  }

  .case-stage {
    display: grid;
    grid-template-columns: minmax(12rem, 0.52fr) minmax(0, 1.48fr);
    gap: clamp(var(--space-xl), 8vw, var(--space-3xl));
    align-items: center;
    width: min(100%, var(--shell-max));
    min-height: min(70dvh, 54rem);
    margin: 0 auto;
  }

  .case-copy {
    display: flex;
    flex-direction: column;
    gap: var(--space-md);
    align-self: start;
    padding-top: var(--space-xl);
  }

  .case-meta {
    display: flex;
    flex-wrap: wrap;
    gap: var(--space-sm);
    align-items: center;
    margin-top: var(--space-sm);
  }

  .composition {
    position: relative;
    min-width: 0;
    min-height: min(58dvh, 42rem);
    overflow: hidden;
    border: 1px solid var(--line);
    background: color-mix(in srgb, var(--text) 2%, transparent);
  }

  .sparse-composition {
    min-height: min(62dvh, 46rem);
    overflow: visible;
    border-color: transparent;
    background: transparent;
  }

  .sparse-composition :global(.hyvui-grid-overlay) {
    opacity: 0.34;
  }

  .sparse-orbit {
    position: absolute;
    top: 9%;
    right: 4%;
  }

  :global(.sparse-note) {
    position: absolute;
    bottom: 8%;
    left: 10%;
    width: min(15rem, 52%);
    padding: var(--space-md);
  }

  :global(.sparse-note .hyvui-text-readout) {
    display: block;
    margin-block: var(--space-sm);
    font-size: var(--text-xl);
  }

  .dense-composition {
    display: flex;
    flex-direction: column;
    gap: var(--space-md);
    padding: var(--space-md);
  }

  .dense-status {
    display: flex;
    justify-content: space-between;
    gap: var(--space-sm);
    align-items: center;
    flex-wrap: wrap;
    padding-bottom: var(--space-sm);
    border-bottom: 1px solid var(--line);
  }

  .dense-composition :global(.hyvui-card-inner) {
    min-height: 8rem;
    padding: var(--space-sm);
    gap: var(--space-sm);
  }

  .dense-composition :global(.hyvui-text-readout) {
    display: block;
    font-size: var(--text-lg);
  }

  .dense-stream {
    display: flex;
    align-items: end;
    gap: var(--space-sm);
    min-height: 7rem;
    margin-left: auto;
    color: var(--muted);
  }

  .image-composition {
    display: grid;
    grid-template-columns: minmax(0, 1fr) minmax(10rem, 0.38fr);
    gap: var(--space-md);
    align-items: end;
    padding: var(--space-md);
    background: linear-gradient(145deg, color-mix(in srgb, var(--signal) 12%, transparent), transparent 46%);
  }

  :global(.image-frame-wrap) {
    padding: var(--space-xs);
  }

  :global(.image-frame img) {
    display: block;
    width: 100%;
    height: 100%;
    object-fit: cover;
    image-rendering: auto;
    filter: saturate(0.7) contrast(1.1);
  }

  .image-caption {
    display: flex;
    flex-direction: column;
    gap: var(--space-sm);
    padding-bottom: var(--space-sm);
  }

  .type-composition {
    display: flex;
    flex-direction: column;
    justify-content: center;
    gap: var(--space-lg);
    padding: clamp(var(--space-lg), 7vw, var(--space-3xl));
    background: linear-gradient(135deg, color-mix(in srgb, var(--accent) 8%, transparent), transparent 48%);
  }

  .type-composition :global(.hyvui-vignette) {
    opacity: 0.28;
  }

  :global(.type-composition h3) {
    position: relative;
    z-index: 1;
    max-width: 7ch;
    font-size: clamp(3rem, 8vw, 7rem);
  }

  .type-composition :global(.hyvui-text-italic) {
    max-width: 22rem;
  }

  .type-index {
    position: absolute;
    top: var(--space-md);
    right: var(--space-md);
    color: var(--line-strong);
    font-family: var(--font-mono);
    font-size: var(--text-3xl);
  }

  .type-line {
    width: 58%;
    height: 1px;
    background: linear-gradient(90deg, var(--accent), transparent);
  }

  .atmospheric-composition {
    overflow: hidden;
    border-color: color-mix(in srgb, var(--signal) 18%, transparent);
  }

  :global(.atmospheric-stage) {
    min-height: min(58dvh, 42rem);
  }

  .atmospheric-ground,
  .atmospheric-field {
    position: absolute;
    inset: 0;
    pointer-events: none;
  }

  .atmospheric-field {
    display: grid;
    place-items: center;
    opacity: 0.48;
  }

  :global(.atmospheric-card) {
    width: min(24rem, 72%);
  }

  @media (max-width: 760px) {
    .baseline {
      padding: var(--space-lg);
    }

    .baseline-header,
    .case-stage {
      grid-template-columns: 1fr;
    }

    .baseline-header {
      gap: var(--space-md);
    }

    .case-stage {
      gap: var(--space-lg);
      min-height: 0;
    }

    .case-copy {
      padding-top: 0;
    }

    .composition,
    .sparse-composition,
    :global(.atmospheric-stage) {
      min-height: 32rem;
    }
  }

  @media (prefers-reduced-motion: reduce) {
    .case-nav a {
      transition: none;
    }
  }
</style>
