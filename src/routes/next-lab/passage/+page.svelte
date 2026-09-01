<script lang="ts">
  import Passage from "$lib/next-experiments/Passage.svelte";
  import ShowcaseShell from "$lib/showcase/ShowcaseShell.svelte";
  import { getShowcaseManifest } from "$lib/showcase/showcaseManifest.js";
  import type { PageData } from "./$types.js";

  let { data }: { data: PageData } = $props();
  const showcaseManifest = getShowcaseManifest("next-passage");
</script>

<svelte:head>
  <title>next lab / ecological passage</title>
  <meta
    name="description"
    content="A scroll-native passage with a plain static fallback."
  />
</svelte:head>

<ShowcaseShell manifest={showcaseManifest!}>
<main class="passage-proof-page">
  <a class="back-link" href="/next-lab/biomes">next lab / biomes</a>
  <Passage
    id="ecological-absorption"
    label="ecological elegy / selected passage"
    plan={data.plan}
    steps={data.steps}
    class="ecological-passage"
  >
    <p class="passage-supplement" data-passage-supplement>
      field note / static fallback retained.
    </p>
  </Passage>
  <footer>
    <a href="/next-lab/passage?mode=static">open static reading fallback</a>
  </footer>
</main>
</ShowcaseShell>

<style>
  .passage-proof-page {
    min-height: 100dvh;
    background: var(--bg);
    color: var(--text);
  }

  .back-link,
  .passage-proof-page footer a {
    position: fixed;
    z-index: calc(var(--z-raised) + 1);
    color: var(--muted);
    font-family: var(--font-mono);
    font-size: var(--text-2xs);
    letter-spacing: var(--tracking-wide);
    text-decoration: none;
    text-transform: uppercase;
  }

  .back-link {
    top: var(--space-sm);
    left: var(--space-md);
  }

  .passage-proof-page footer a {
    right: var(--space-md);
    bottom: var(--space-sm);
    color: var(--signal);
  }

  .back-link:focus-visible,
  .passage-proof-page footer a:focus-visible {
    outline: 1px solid var(--accent);
    outline-offset: var(--space-xs);
  }

  :global(.ecological-passage) {
    --line: color-mix(in srgb, var(--signal) 20%, transparent);
    background:
      radial-gradient(
        ellipse at 70% 48%,
        color-mix(in srgb, var(--signal) 8%, transparent),
        transparent 34%
      ),
      var(--bg);
  }

  :global(.passage-supplement) {
    max-width: 28rem;
    margin: var(--space-lg) 0 0;
    color: var(--muted);
    font-family: var(--font-mono);
    font-size: var(--text-2xs);
    letter-spacing: var(--tracking-wide);
    text-transform: uppercase;
  }
</style>
