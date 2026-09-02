<script lang="ts">
  import BiomeFrame from "$lib/next-experiments/BiomeFrame.svelte";
  import ShowcaseShell from "$lib/showcase/ShowcaseShell.svelte";
  import { getShowcaseManifest } from "$lib/showcase/showcaseManifest.js";
  import type { PageData } from "./$types.js";

  let { data }: { data: PageData } = $props();
  const selectedId = $derived(data.focusedId);
  const showcaseManifest = getShowcaseManifest("next-biomes");

  function galleryDrag(node: HTMLElement) {
    let startX = 0;
    let startScrollLeft = 0;
    let isDragging = false;
    let suppressClick = false;

    function onPointerDown(event: PointerEvent) {
      if (event.button !== 0) return;
      startX = event.clientX;
      startScrollLeft = node.scrollLeft;
      isDragging = false;
      node.setPointerCapture(event.pointerId);
    }

    function onPointerMove(event: PointerEvent) {
      if (!node.hasPointerCapture(event.pointerId)) return;

      const distance = event.clientX - startX;
      if (Math.abs(distance) > 6) isDragging = true;
      if (!isDragging) return;

      event.preventDefault();
      node.dataset.dragging = "true";
      node.scrollLeft = startScrollLeft - distance;
    }

    function onPointerUp(event: PointerEvent) {
      if (node.hasPointerCapture(event.pointerId)) {
        node.releasePointerCapture(event.pointerId);
      }
      if (isDragging) suppressClick = true;
      isDragging = false;
      delete node.dataset.dragging;
    }

    function onClick(event: MouseEvent) {
      if (!suppressClick) return;
      event.preventDefault();
      event.stopPropagation();
      suppressClick = false;
    }

    node.addEventListener("pointerdown", onPointerDown);
    node.addEventListener("pointermove", onPointerMove);
    node.addEventListener("pointerup", onPointerUp);
    node.addEventListener("pointercancel", onPointerUp);
    node.addEventListener("click", onClick);

    return {
      destroy() {
        node.removeEventListener("pointerdown", onPointerDown);
        node.removeEventListener("pointermove", onPointerMove);
        node.removeEventListener("pointerup", onPointerUp);
        node.removeEventListener("pointercancel", onPointerUp);
        node.removeEventListener("click", onClick);
      },
    };
  }
</script>

<svelte:head>
  <title>next lab / visual charter</title>
  <meta
    name="description"
    content="a hyvui visual charter. one content corpus passes through six authored host biomes."
  />
</svelte:head>

<ShowcaseShell manifest={showcaseManifest!} contextPlacement="after">
  <main
    class="biome-gallery"
    data-biome-gallery
    data-gallery-mode={selectedId ? "focus" : "all"}
  >
    <header class="gallery-header">
      <div class="gallery-heading">
        <span>hyvui / visual charter</span>
        <h1>one corpus. six hosts.</h1>
      </div>
      <div class="gallery-header-note">
        <p>same words. six spatial rules.</p>
        <a class="gallery-back" href="/next-lab/experiment"
          >back / next lab / experiments</a
        >
      </div>
    </header>

    <div class="gallery-nav-frame">
      <div class="gallery-nav-caption" id="biome-gallery-nav-help">
        <span>six hosts / horizontal rail</span>
        <span>drag / scroll / tab</span>
      </div>
      <nav
        class="gallery-nav"
        data-biome-gallery-nav
        aria-label="art biomes"
        aria-describedby="biome-gallery-nav-help"
        use:galleryDrag
      >
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
    </div>

    <section
      class="gallery-charter"
      data-biome-charter
      aria-labelledby="biome-charter-title"
    >
      <div class="charter-copy">
        <span class="charter-kicker">visual charter / research surface</span>
        <h2 id="biome-charter-title">
          components are vocabulary. relations give them work.
        </h2>
        <p>
          one content corpus passes through six host biomes. each host changes
          the spatial law, material, typography, attention, and time model.
          these are rendered studies, not page templates.
        </p>
        <p class="charter-limit">
          the stable library remains the ground. the next layer makes
          composition decisions explicit, bounded, and inspectable.
        </p>
        <nav class="charter-links" aria-label="visual charter routes">
          <a href="#biome-gallery-frames">start with the six hosts</a>
          <a href="/next-lab/biome-plan">inspect the resolved plan</a>
          <a href="/next-lab/witness"
            >open witness / compare focus and context</a
          >
          <a href="/next-lab/experiment?case=atmospheric-motion&mode=apply">
            open art direction / reliquary in weather
          </a>
        </nav>
      </div>

      <dl class="charter-laws" aria-label="visual charter laws">
        <div data-biome-charter-law>
          <dt>composition</dt>
          <dd>name the focal point, field, counterweight, and interruption.</dd>
        </div>
        <div data-biome-charter-law>
          <dt>biome</dt>
          <dd>choose one host law. a palette alone is not a page.</dd>
        </div>
        <div data-biome-charter-law>
          <dt>adaptation</dt>
          <dd>
            fit the field without hiding content or overruling the author.
          </dd>
        </div>
        <div data-biome-charter-law>
          <dt>passage</dt>
          <dd>
            change attention with native links, frames, and a readable fallback.
          </dd>
        </div>
      </dl>
    </section>

    <div id="biome-gallery-frames" class="gallery-frames">
      {#each data.proofs as proof, index}
        {@const proofIndex = data.index.findIndex(
          (item) => item.id === proof.id,
        )}
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

    <section
      id="biome-hybrid-register"
      class="hybrid-register"
      data-biome-hybrid-register
    >
      <header>
        <span>host / graft register</span>
        <h2>a graft needs a reason.</h2>
        <p class="hybrid-intro" data-biome-hybrid-intro>
          a host may borrow from another biome only through a named channel.
          shared laws make a graft symbiotic. declared disagreement makes it
          tensional. if a graft erases the host’s attention economy, it stays
          rejected and shows its fallback.
        </p>
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
    grid-template-columns: minmax(0, 1fr) minmax(14rem, 21rem);
    gap: var(--space-xl);
    align-items: end;
    padding: var(--space-lg) var(--shell-pad) var(--space-md);
    border-bottom: 1px solid var(--gallery-line);
  }

  .gallery-back,
  .gallery-header span,
  .gallery-header-note p,
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

  .gallery-header-note {
    display: grid;
    justify-items: end;
    gap: var(--space-md);
  }

  .gallery-header-note p {
    max-width: 21ch;
    margin: 0;
    color: var(--muted);
    line-height: 1.5;
    text-align: right;
  }

  .gallery-charter {
    display: grid;
    grid-template-columns: minmax(0, 1.05fr) minmax(18rem, 0.95fr);
    gap: clamp(var(--space-xl), 7vw, var(--space-3xl));
    width: min(100%, var(--shell-max));
    margin-inline: auto;
    padding: clamp(var(--space-xl), 7vw, var(--space-3xl)) var(--shell-pad);
    border-bottom: 1px solid var(--gallery-line);
  }

  .charter-copy {
    max-width: 42rem;
  }

  .charter-kicker,
  .charter-laws,
  .charter-links {
    font-family: var(--font-mono);
    font-size: var(--text-2xs);
    letter-spacing: var(--tracking-wide);
    text-transform: uppercase;
  }

  .charter-kicker {
    color: var(--accent);
  }

  .charter-copy h2 {
    max-width: 15ch;
    margin: var(--space-md) 0 0;
    font-family: var(--font-body);
    font-size: clamp(2.5rem, 5vw, 5.5rem);
    font-weight: 400;
    letter-spacing: -0.065em;
    line-height: 0.9;
  }

  .charter-copy > p {
    max-width: 39rem;
    margin: var(--space-xl) 0 0;
    color: var(--text-soft);
    font-family: var(--font-body);
    font-size: var(--text-md);
    line-height: 1.5;
  }

  .charter-copy > p.charter-limit {
    margin-top: var(--space-md);
    color: var(--muted);
    font-size: var(--text-sm);
  }

  .charter-links {
    display: flex;
    flex-wrap: wrap;
    gap: var(--space-sm) var(--space-lg);
    margin-top: var(--space-xl);
  }

  .charter-links a {
    color: var(--signal);
    text-decoration-color: color-mix(in srgb, var(--signal) 50%, transparent);
    text-underline-offset: 0.2em;
  }

  .charter-links a:hover,
  .charter-links a:focus-visible {
    color: var(--accent);
    outline: none;
  }

  .charter-laws {
    display: grid;
    align-content: end;
    gap: 0;
    margin: 0;
  }

  .charter-laws div {
    display: grid;
    grid-template-columns: minmax(6rem, 0.45fr) minmax(0, 1fr);
    gap: var(--space-md);
    padding: var(--space-md) 0;
    border-top: 1px solid var(--gallery-line);
  }

  .charter-laws div:last-child {
    border-bottom: 1px solid var(--gallery-line);
  }

  .charter-laws dt {
    color: var(--accent);
  }

  .charter-laws dd {
    margin: 0;
    color: var(--muted);
    line-height: 1.5;
    text-transform: none;
  }

  .gallery-nav-frame {
    position: sticky;
    top: 0;
    z-index: 20;
    border-bottom: 1px solid var(--gallery-line);
    background: color-mix(in srgb, var(--bg) 92%, transparent);
    backdrop-filter: blur(12px);
  }

  .gallery-nav-caption {
    display: flex;
    justify-content: space-between;
    gap: var(--space-md);
    padding: var(--space-xs) var(--shell-pad) 0;
    color: var(--muted-strong);
    font-family: var(--font-mono);
    font-size: var(--text-3xs);
    letter-spacing: var(--tracking-wide);
    text-transform: uppercase;
  }

  .gallery-nav {
    display: flex;
    flex-wrap: nowrap;
    gap: var(--space-xs) var(--space-lg);
    padding: var(--space-xs) var(--shell-pad) var(--space-sm);
    overflow-x: auto;
    overscroll-behavior-x: contain;
    scroll-behavior: smooth;
    scroll-snap-type: x mandatory;
    scrollbar-width: none;
    cursor: grab;
    touch-action: pan-x;
    user-select: none;
    mask-image: linear-gradient(
      to right,
      currentColor 0,
      currentColor calc(100% - 2rem),
      transparent 100%
    );
    -webkit-mask-image: linear-gradient(
      to right,
      currentColor 0,
      currentColor calc(100% - 2rem),
      transparent 100%
    );
  }

  .gallery-nav::-webkit-scrollbar {
    display: none;
  }

  :global(.gallery-nav[data-dragging="true"]) {
    cursor: grabbing;
    scroll-behavior: auto;
  }

  .gallery-nav a {
    flex: 0 0 auto;
    display: inline-flex;
    align-items: baseline;
    gap: var(--space-xs);
    scroll-snap-align: start;
    scroll-snap-stop: always;
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
    transform: translateY(-1px);
  }

  .gallery-nav a.active span {
    color: var(--accent);
  }

  .gallery-nav a.active {
    border-bottom: 1px solid var(--accent);
  }

  .gallery-frames {
    scroll-snap-type: y proximity;
  }

  .gallery-frames :global([data-biome-frame]) {
    scroll-margin-top: 6rem;
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
    scroll-margin-top: 6rem;
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

  .hybrid-intro {
    max-width: 26rem;
    margin: var(--space-lg) 0 0;
    color: var(--text-soft);
    font-family: var(--font-body);
    font-size: var(--text-sm);
    line-height: 1.5;
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

    .gallery-charter {
      grid-template-columns: 1fr;
      gap: var(--space-xl);
      padding-inline: var(--space-md);
    }

    .gallery-frames :global([data-biome-frame]) {
      scroll-margin-top: 10rem;
    }

    .gallery-header-note {
      justify-items: start;
    }

    .gallery-header-note p {
      text-align: left;
    }

    .gallery-nav {
      padding: var(--space-sm) var(--space-md);
    }

    .gallery-nav-caption {
      padding-inline: var(--space-md);
    }

    .gallery-footer {
      flex-direction: column;
      padding-inline: var(--space-md);
    }

    .hybrid-register {
      grid-template-columns: 1fr;
      gap: var(--space-xl);
      scroll-margin-top: 10rem;
      padding-inline: var(--space-md);
    }
  }

  @media (prefers-reduced-motion: reduce) {
    .gallery-nav {
      scroll-behavior: auto;
    }

    .gallery-nav a {
      transition-duration: 0s;
    }
  }
</style>
