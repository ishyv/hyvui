<script lang="ts">
  import { Text } from "$lib/index.js";
  import Composition from "$lib/next-experiments/Composition.svelte";
  import CompositionNode from "$lib/next-experiments/Node.svelte";
  import ShowcaseShell from "$lib/showcase/ShowcaseShell.svelte";
  import { getShowcaseManifest } from "$lib/showcase/showcaseManifest.js";
  import type { PageData } from "./$types.js";

  let { data }: { data: PageData } = $props();
  const showcaseManifest = getShowcaseManifest("next-biome-plan");
</script>

<svelte:head>
  <title>next lab / biome plan</title>
  <meta
    name="description"
    content="The resolved plan shown as three semantic nodes."
  />
</svelte:head>

<ShowcaseShell manifest={showcaseManifest!}>
<main class="biome-plan-page" data-biome-plan-route>
  <a href="/next-lab/biomes">next lab / biome gallery</a>
  <header>
    <span>resolved biome plan</span>
    <h1>the plan pairs a local signal with its maintenance trace</h1>
  </header>

  <Composition
    id="biome-plan"
    artDirection={data.artDirection}
    nodes={data.nodes}
    relations={data.relations}
    biomePlan={data.plan}
    inspect
    class="biome-plan-composition"
  >
    <CompositionNode id="signal" class="plan-signal">
      <Text as="h2" variant="heading">local signal</Text>
    </CompositionNode>
    <CompositionNode id="route" class="plan-route">
      <span>maintenance trace →</span>
    </CompositionNode>
    <CompositionNode id="habitat" class="plan-habitat">
      <span>habitat / in use</span>
    </CompositionNode>
  </Composition>
</main>
</ShowcaseShell>

<style>
  .biome-plan-page {
    min-height: 100dvh;
    padding: var(--space-lg);
    background: var(--bg);
    color: var(--text);
  }

  .biome-plan-page > a,
  .biome-plan-page header > span,
  :global(.plan-route),
  :global(.plan-habitat) {
    font-family: var(--font-mono);
    font-size: var(--text-2xs);
    letter-spacing: var(--tracking-wide);
    text-transform: uppercase;
  }

  .biome-plan-page > a {
    color: var(--muted);
    text-decoration: none;
  }

  .biome-plan-page header {
    max-width: 48rem;
    margin: var(--space-3xl) auto var(--space-xl);
  }

  .biome-plan-page header > span {
    color: var(--signal);
  }

  .biome-plan-page h1 {
    max-width: 12ch;
    margin: var(--space-sm) 0 0;
    font-family: var(--font-body);
    font-size: clamp(2.5rem, 6vw, 6rem);
    font-weight: 400;
    letter-spacing: -0.06em;
    line-height: 0.88;
  }

  :global(.biome-plan-composition) {
    min-height: 28rem;
    max-width: 70rem;
    margin: 0 auto;
    padding: var(--space-xl);
    border: 1px solid color-mix(in srgb, var(--signal) 24%, transparent);
  }

  :global(.plan-signal),
  :global(.plan-route),
  :global(.plan-habitat) {
    position: relative;
  }

  :global(.plan-signal) {
    width: min(22rem, 50%);
    margin: 8rem 0 0 14%;
  }

  :global(.plan-signal h2) {
    margin: 0;
    font-family: var(--font-body);
    font-size: clamp(2.5rem, 6vw, 6rem);
    font-weight: 400;
    letter-spacing: -0.06em;
    line-height: 0.86;
  }

  :global(.plan-route) {
    width: 50%;
    margin: -2rem 0 0 33%;
    padding-top: var(--space-sm);
    border-top: 1px solid var(--signal);
    color: var(--signal);
  }

  :global(.plan-habitat) {
    position: absolute;
    right: var(--space-xl);
    bottom: var(--space-xl);
    color: var(--muted);
  }

  @media (max-width: 680px) {
    .biome-plan-page {
      padding: var(--space-md);
    }

    .biome-plan-page header {
      margin-top: var(--space-2xl);
    }

    :global(.biome-plan-composition) {
      min-height: 24rem;
      padding: var(--space-md);
    }

    :global(.plan-signal) {
      width: 85%;
      margin: 5rem 0 0;
    }

    :global(.plan-route) {
      width: 90%;
      margin: var(--space-xl) 0 0 8%;
    }

    :global(.plan-habitat) {
      right: var(--space-md);
      bottom: var(--space-md);
    }
  }
</style>
