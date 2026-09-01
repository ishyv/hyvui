<script lang="ts">
  import BiomeFrame from "$lib/next-experiments/BiomeFrame.svelte";
  import ShowcaseShell from "$lib/showcase/ShowcaseShell.svelte";
  import { getShowcaseManifest } from "$lib/showcase/showcaseManifest.js";
  import type { PageData } from "./$types.js";

  let { data }: { data: PageData } = $props();
  const selectedId = $derived(data.focusedId);
  const showcaseManifest = getShowcaseManifest("next-biomes");
</script>

<svelte:head>
  <title>next lab / biome proof gallery</title>
  <meta
    name="description"
    content="Six full-viewport HyvUI art biomes using one shared content corpus."
  />
</svelte:head>

<ShowcaseShell manifest={showcaseManifest!}>
<main
  class="biome-gallery"
  data-biome-gallery
  data-gallery-mode={selectedId ? "focus" : "all"}
>
  <header class="gallery-header">
    <a class="gallery-back" href="/next-lab/experiment"
      >next lab / experiments</a
    >
    <div class="gallery-heading">
      <span>hyvui / biome proof gallery</span>
      <h1>one corpus. six hosts.</h1>
      <a class="witness-proof-link" href="/next-lab/witness"
        >open witness / compare focus and context</a
      >
    </div>
    <p>same words. six spatial rules.</p>
  </header>

  <nav class="gallery-nav" data-biome-gallery-nav aria-label="art biomes">
    {#each data.index as proof, index}
      <a
        href={`/next-lab/biomes?biome=${proof.id}#${proof.id}`}
        aria-current={selectedId === proof.id ? "page" : undefined}
        class:active={selectedId === proof.id}
      >
        <span>{String(index + 1).padStart(2, "0")}</span>
        {proof.host}
      </a>
    {/each}
  </nav>

  <div class="gallery-frames">
    {#each data.proofs as proof, index}
      {@const proofIndex = data.index.findIndex((item) => item.id === proof.id)}
      {@const nextProof = data.index[(proofIndex + 1) % data.index.length]}
      <BiomeFrame
        {proof}
        content={proof.content}
        index={proofIndex}
        focused={selectedId === proof.id}
        nextHref={`/next-lab/biomes?biome=${nextProof.id}#${nextProof.id}`}
      />
    {/each}
  </div>

  <section class="hybrid-register" data-biome-hybrid-register>
    <header>
      <span>host / graft register</span>
      <h2>a graft needs a reason.</h2>
    </header>
    <ul>
      {#each data.hybrids as hybrid}
        <li
          data-hybrid-id={hybrid.id}
          data-hybrid-status={hybrid.valid ? "accepted" : "rejected"}
        >
          <div>
            <span>{hybrid.label}</span>
            <strong>{hybrid.valid ? "accepted" : "rejected"}</strong>
          </div>
          <p>
            {hybrid.valid
              ? hybrid.decisions[0]?.reason
              : hybrid.issues[0]?.reason}
          </p>
        </li>
      {/each}
    </ul>
  </section>

  <footer class="gallery-footer">
    <span>same content / different rules</span>
    <span>{selectedId ? "focused frame" : "scroll-snap gallery"}</span>
  </footer>
</main>
</ShowcaseShell>

<style>
  .biome-gallery {
    --gallery-line: color-mix(in srgb, var(--text) 17%, transparent);
    min-height: 100vh;
    background: var(--bg);
    color: var(--text);
  }

  .gallery-header {
    display: grid;
    grid-template-columns: 1fr minmax(20rem, 34rem) 1fr;
    gap: var(--space-xl);
    align-items: end;
    padding: var(--space-lg) var(--shell-pad) var(--space-md);
    border-bottom: 1px solid var(--gallery-line);
  }

  .gallery-back,
  .gallery-header span,
  .gallery-header p,
  .gallery-nav,
  .gallery-footer {
    font-family: var(--font-mono);
    font-size: var(--text-2xs);
    letter-spacing: var(--tracking-wide);
    text-transform: uppercase;
  }

  .gallery-back {
    color: var(--muted);
    text-decoration: none;
  }

  .gallery-back:focus-visible,
  .gallery-nav a:focus-visible {
    outline: 1px solid var(--accent);
    outline-offset: var(--space-xs);
  }

  .gallery-heading span {
    color: var(--accent);
  }

  .gallery-heading h1 {
    max-width: 12ch;
    margin: var(--space-sm) 0 0;
    font-family: var(--font-body);
    font-size: clamp(2rem, 4vw, 4.5rem);
    font-weight: 400;
    letter-spacing: -0.055em;
    line-height: 0.9;
  }

  .witness-proof-link {
    display: inline-flex;
    margin-top: var(--space-md);
    color: var(--signal);
    font-family: var(--font-mono);
    font-size: var(--text-2xs);
    letter-spacing: var(--tracking-wide);
    text-decoration: none;
    text-transform: uppercase;
  }

  .witness-proof-link:hover,
  .witness-proof-link:focus-visible {
    color: var(--accent);
    outline: 1px solid var(--accent);
    outline-offset: var(--space-xs);
  }

  .gallery-header p {
    max-width: 21ch;
    margin: 0;
    justify-self: end;
    color: var(--muted);
    line-height: 1.5;
    text-align: right;
  }

  .gallery-nav {
    position: sticky;
    top: 0;
    z-index: 20;
    display: flex;
    flex-wrap: wrap;
    gap: var(--space-xs) var(--space-md);
    padding: var(--space-sm) var(--shell-pad);
    border-bottom: 1px solid var(--gallery-line);
    background: color-mix(in srgb, var(--bg) 92%, transparent);
    backdrop-filter: blur(12px);
  }

  .gallery-nav a {
    display: inline-flex;
    align-items: baseline;
    gap: var(--space-xs);
    color: var(--muted);
    text-decoration: none;
    transition: color var(--transition-fast);
  }

  .gallery-nav a span {
    color: var(--muted-strong);
  }

  .gallery-nav a:hover,
  .gallery-nav a.active {
    color: var(--text);
  }

  .gallery-nav a.active span {
    color: var(--accent);
  }

  .gallery-frames {
    scroll-snap-type: y proximity;
  }

  .gallery-footer {
    display: flex;
    justify-content: space-between;
    gap: var(--space-md);
    padding: var(--space-md) var(--shell-pad);
    border-top: 1px solid var(--gallery-line);
    color: var(--muted);
  }

  .hybrid-register {
    display: grid;
    grid-template-columns: minmax(14rem, 0.8fr) minmax(22rem, 1.2fr);
    gap: var(--space-2xl);
    padding: clamp(var(--space-xl), 6vw, var(--space-3xl)) var(--shell-pad);
    border-top: 1px solid var(--gallery-line);
    background: color-mix(in srgb, var(--bg) 92%, var(--signal));
  }

  .hybrid-register header > span {
    color: var(--signal);
    font-family: var(--font-mono);
    font-size: var(--text-2xs);
    letter-spacing: var(--tracking-wide);
    text-transform: uppercase;
  }

  .hybrid-register h2 {
    max-width: 12ch;
    margin: var(--space-sm) 0 0;
    font-family: var(--font-body);
    font-size: clamp(2rem, 4vw, 4rem);
    font-weight: 400;
    letter-spacing: -0.055em;
    line-height: 0.9;
  }

  .hybrid-register ul {
    padding: 0;
    margin: 0;
    list-style: none;
  }

  .hybrid-register li {
    padding: var(--space-md) 0;
    border-top: 1px solid var(--gallery-line);
  }

  .hybrid-register li:last-child {
    border-bottom: 1px solid var(--gallery-line);
  }

  .hybrid-register li > div {
    display: flex;
    justify-content: space-between;
    gap: var(--space-md);
  }

  .hybrid-register li > div > span,
  .hybrid-register strong,
  .hybrid-register p {
    font-family: var(--font-mono);
    font-size: var(--text-2xs);
    letter-spacing: var(--tracking-wide);
    text-transform: uppercase;
  }

  .hybrid-register strong {
    color: var(--signal);
    font-weight: 400;
  }

  .hybrid-register li[data-hybrid-status="rejected"] strong {
    color: var(--accent);
  }

  .hybrid-register p {
    max-width: 60ch;
    margin: var(--space-sm) 0 0;
    color: var(--muted);
    line-height: 1.5;
    text-transform: none;
  }

  @media (max-width: 760px) {
    .gallery-header {
      grid-template-columns: 1fr;
      gap: var(--space-lg);
      padding: var(--space-md);
    }

    .gallery-header p {
      justify-self: start;
      text-align: left;
    }

    .gallery-nav {
      padding: var(--space-sm) var(--space-md);
    }

    .gallery-footer {
      flex-direction: column;
      padding-inline: var(--space-md);
    }

    .hybrid-register {
      grid-template-columns: 1fr;
      gap: var(--space-xl);
      padding-inline: var(--space-md);
    }
  }

  @media (prefers-reduced-motion: reduce) {
    .gallery-nav a {
      transition-duration: 0s;
    }
  }
</style>
