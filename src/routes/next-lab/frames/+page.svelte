<script lang="ts">
  import { Text } from "$lib/index.js";
  import Frame from "$lib/next-experiments/Frame.svelte";
  import FrameSequence from "$lib/next-experiments/FrameSequence.svelte";
  import ShowcaseShell from "$lib/showcase/ShowcaseShell.svelte";
  import { getShowcaseManifest } from "$lib/showcase/showcaseManifest.js";
  import type { PageData } from "./$types.js";

  let { data }: { data: PageData } = $props();
  const showcaseManifest = getShowcaseManifest("next-frames");
</script>

<svelte:head>
  <title>next lab / native frame sequence</title>
  <meta
    name="description"
    content="A native frame sequence with an authored departure and return."
  />
</svelte:head>

<ShowcaseShell manifest={showcaseManifest!}>
<main class="frame-proof-page">
  <a class="back-link" href="/next-lab/biomes">next lab / biomes</a>
  <FrameSequence
    entries={data.entries}
    transitionIntent="inherit"
    ariaLabel="frame proof"
  >
    <Frame
      id="arrival"
      label="arrival"
      order={0}
      transitionIntent="approach"
      continuityKey="field-note"
      class="arrival-frame"
    >
      <div class="frame-proof-content">
        <span class="eyebrow">frame / 01 / approach</span>
        <Text as="h1" variant="heading"
          >the first frame stays in place until you choose departure.</Text
        >
        <p>choose departure. the next frame carries the same actor elsewhere.</p>
        <a href="#departure" data-frame-action="approach"
          >continue toward departure ↘</a
        >
      </div>
    </Frame>
    <Frame
      id="departure"
      label="departure"
      order={1}
      transitionIntent="release"
      continuityKey="field-note"
      class="departure-frame"
    >
      <div class="frame-proof-content">
        <span class="eyebrow">frame / 02 / release</span>
        <Text as="h1" variant="heading"
          >the trace remains after the object leaves.</Text
        >
        <p>
          the actor keeps its identity across frames. the content is not copied.
        </p>
        <a href="#arrival" data-frame-action="return">return to arrival ↖</a>
      </div>
    </Frame>
  </FrameSequence>
</main>
</ShowcaseShell>

<style>
  .frame-proof-page {
    min-height: 100dvh;
    background: var(--bg);
    color: var(--text);
  }

  .back-link {
    position: fixed;
    top: var(--space-sm);
    left: var(--space-md);
    z-index: calc(var(--z-raised) + 1);
    color: var(--muted);
    font-family: var(--font-mono);
    font-size: var(--text-2xs);
    letter-spacing: var(--tracking-wide);
    text-decoration: none;
    text-transform: uppercase;
  }

  .back-link:focus-visible,
  .frame-proof-content a:focus-visible {
    outline: 1px solid var(--accent);
    outline-offset: var(--space-xs);
  }

  :global(.frame-proof-page .hyvui-frame) {
    display: grid;
    align-items: center;
    padding: var(--space-scene) var(--shell-pad);
  }

  :global(.arrival-frame) {
    background:
      radial-gradient(
        circle at 72% 38%,
        color-mix(in srgb, var(--signal) 15%, transparent),
        transparent 28%
      ),
      var(--bg);
  }

  :global(.departure-frame) {
    background:
      linear-gradient(
        118deg,
        color-mix(in srgb, var(--accent) 6%, transparent),
        transparent 44%
      ),
      var(--bg-elev-soft);
  }

  .frame-proof-content {
    width: min(50rem, 72vw);
    margin-left: 12%;
  }

  :global(.departure-frame .frame-proof-content) {
    margin-left: auto;
    margin-right: 10%;
  }

  .eyebrow {
    color: var(--accent);
    font-family: var(--font-mono);
    font-size: var(--text-2xs);
    letter-spacing: var(--tracking-meta);
    text-transform: uppercase;
  }

  :global(.frame-proof-content h1) {
    max-width: 11ch;
    margin: var(--space-lg) 0 0;
    font-family: var(--font-body);
    font-size: clamp(3rem, 7vw, 8rem);
    font-weight: 400;
    letter-spacing: -0.06em;
    line-height: 0.86;
  }

  .frame-proof-content p {
    max-width: 32rem;
    margin: var(--space-xl) 0 0;
    color: var(--text-soft);
    font-family: var(--font-body);
    font-size: var(--text-md);
    line-height: var(--leading-body);
  }

  .frame-proof-content a {
    display: inline-block;
    margin-top: var(--space-xl);
    color: var(--signal);
    font-family: var(--font-mono);
    font-size: var(--text-2xs);
    letter-spacing: var(--tracking-wide);
    text-decoration: none;
    text-transform: uppercase;
  }

  @media (max-width: 680px) {
    :global(.frame-proof-page .hyvui-frame) {
      align-items: end;
      padding: var(--space-3xl) var(--space-md) var(--space-2xl);
    }

    .frame-proof-content,
    :global(.departure-frame .frame-proof-content) {
      width: 100%;
      margin: 0;
    }

    :global(.frame-proof-content h1) {
      max-width: 9ch;
      font-size: clamp(2.8rem, 14vw, 5rem);
    }
  }
</style>
