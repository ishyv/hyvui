<script lang="ts">
  import type { Snippet } from "svelte";
  import Label from "../components/primitives/Label.svelte";
  import {
    applyGrade,
    applyTheme,
    applyWeight,
    clearGrade,
    clearTheme,
    clearWeight,
  } from "../system/register.js";
  import {
    getAdjacentShowcaseRoutes,
    listShowcaseFamily,
  } from "./showcaseNavigation.js";
  import { getShowcaseManifest } from "./showcaseManifest.js";
  import type { ShowcaseManifest } from "./showcaseManifest.js";

  interface Props {
    manifest: ShowcaseManifest;
    children?: Snippet;
    contextPlacement?: "before" | "after";
    showContext?: boolean;
    compactShell?: boolean;
  }

  let {
    manifest,
    children,
    contextPlacement = "before",
    showContext = true,
    compactShell: compactShellProp,
  }: Props = $props();

  const familyRoutes = $derived(listShowcaseFamily(manifest.family));
  const adjacent = $derived(getAdjacentShowcaseRoutes(manifest.id));
  const previousRoute = $derived(
    adjacent.previous ? getShowcaseManifest(adjacent.previous) : undefined,
  );
  const nextRoute = $derived(
    adjacent.next ? getShowcaseManifest(adjacent.next) : undefined,
  );
  const familyLabel = $derived(manifest.family.replaceAll("-", " "));
  const compactShell = $derived(
    compactShellProp ??
      (contextPlacement === "before" &&
        (manifest.family === "research-archive" ||
          manifest.family === "material-study")),
  );
  const statusLabel = $derived(
    manifest.status === "published"
      ? "public"
      : manifest.status === "utility"
        ? "utility"
        : "research",
  );

  $effect(() => {
    if (manifest.weight) applyWeight(manifest.weight);
    else clearWeight();

    if (manifest.theme) applyTheme(manifest.theme);
    else clearTheme();

    if (manifest.grade) applyGrade(manifest.grade);
    else clearGrade();

    return () => {
      clearWeight();
      clearTheme();
      clearGrade();
    };
  });
</script>

<svelte:head>
  <title>{manifest.id === "home" ? "hyvui" : `hyvui / ${manifest.title}`}</title>
</svelte:head>

{#snippet routeContext()}
  <details
    class="showcase-context"
    open={!compactShell}
    aria-label="route notes"
  >
    <summary class="showcase-context-summary" data-showcase-context-toggle>
      <span>
        <Label color="signal">route note</Label>
        <span>open note / {manifest.title}</span>
      </span>
      <span>{manifest.premise}</span>
    </summary>

    <div class="showcase-context-body">
      <div class="showcase-premise">
        <Label color="signal">what it shows</Label>
        <p data-showcase-premise>{manifest.premise}</p>
      </div>

      <dl class="showcase-facts">
        <div>
          <dt>focal</dt>
          <dd>{manifest.focal}</dd>
        </div>
        <div>
          <dt>viewer</dt>
          <dd>{manifest.viewerRole}</dd>
        </div>
        <div>
          <dt>relation</dt>
          <dd>{manifest.primaryRelation}</dd>
        </div>
        <div>
          <dt>time</dt>
          <dd>{manifest.temporalLaw}</dd>
        </div>
        {#if manifest.hostBiome}
          <div>
            <dt>host</dt>
            <dd>{manifest.hostBiome}</dd>
          </div>
        {/if}
        <div>
          <dt>mobile</dt>
          <dd>{manifest.mobileMode}</dd>
        </div>
      </dl>
    </div>
  </details>
{/snippet}

<div
  class="showcase-shell"
  class:compact={compactShell}
  data-showcase-shell
  data-showcase-id={manifest.id}
  data-showcase-family={manifest.family}
  data-showcase-density={compactShell ? "compact" : "full"}
  data-showcase-layout={compactShell ? "overlay" : "flow"}
  data-showcase-status={manifest.status}
  data-showcase-host={manifest.hostBiome}
  data-showcase-viewer={manifest.viewerRole}
  data-showcase-relation={manifest.primaryRelation}
  data-showcase-context-placement={contextPlacement}
>
  <a class="showcase-skip" href="#showcase-content">skip to content</a>

  <header class="showcase-header">
    <div class="showcase-identity">
      <a class="showcase-brand" href="/">hyvui</a>
      <span>anthology / {familyLabel}</span>
    </div>

    <nav class="showcase-nav" data-showcase-nav aria-label="showcase routes">
      {#each familyRoutes as route}
        <a
          href={route.href}
          aria-current={route.id === manifest.id ? "page" : undefined}
          class:current={route.id === manifest.id}
        >
          {route.title}
        </a>
      {/each}
    </nav>

    <span class="showcase-status" data-showcase-status-label>{statusLabel}</span
    >
  </header>

  {#if showContext && contextPlacement === "before"}
    {@render routeContext()}
  {/if}

  <div
    id="showcase-content"
    class="showcase-content"
    data-showcase-content
    tabindex="-1"
  >
    {@render children?.()}
  </div>

  {#if showContext && contextPlacement === "after"}
    {@render routeContext()}
  {/if}

  <footer class="showcase-footer">
    <div>
      <span>route / {manifest.id}</span>
      <span>status / {statusLabel}</span>
    </div>
    <nav aria-label="adjacent showcase routes">
      {#if previousRoute}
        <a href={previousRoute.href}>previous / {previousRoute.title}</a>
      {/if}
      {#if nextRoute}
        <a href={nextRoute.href}>next / {nextRoute.title}</a>
      {/if}
    </nav>
  </footer>
</div>

<style>
  .showcase-shell {
    --showcase-line: color-mix(in srgb, var(--text) 16%, transparent);
    min-height: 100%;
    background: var(--bg);
    color: var(--text);
  }

  .showcase-skip {
    position: fixed;
    z-index: 100;
    top: var(--space-xs);
    left: var(--space-xs);
    padding: var(--space-xs) var(--space-sm);
    transform: translateY(-180%);
    background: var(--text);
    color: var(--bg);
    font-family: var(--font-mono);
    font-size: var(--text-2xs);
    letter-spacing: var(--tracking-wide);
    text-decoration: none;
    text-transform: uppercase;
    transition: transform var(--transition-fast);
  }

  .showcase-skip:focus-visible {
    transform: translateY(0);
  }

  .showcase-header {
    display: grid;
    grid-template-columns: minmax(12rem, 0.8fr) minmax(16rem, 1.6fr) auto;
    gap: var(--space-lg);
    align-items: center;
    padding: var(--space-md) var(--shell-pad);
    border-bottom: 1px solid var(--showcase-line);
  }

  .showcase-identity,
  .showcase-nav,
  .showcase-status,
  .showcase-footer {
    font-family: var(--font-mono);
    font-size: var(--text-2xs);
    letter-spacing: var(--tracking-wide);
    text-transform: uppercase;
  }

  .showcase-identity {
    display: flex;
    flex-wrap: wrap;
    gap: var(--space-xs) var(--space-sm);
    align-items: baseline;
    color: var(--muted);
  }

  .showcase-brand {
    color: var(--text);
    font-family: var(--font-body);
    font-size: var(--text-lg);
    letter-spacing: -0.04em;
    line-height: 0.9;
    text-decoration: none;
    text-transform: lowercase;
  }

  .showcase-nav {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    gap: var(--space-xs) var(--space-md);
  }

  .showcase-nav a,
  .showcase-footer a {
    color: var(--muted);
    text-decoration: none;
    transition: color var(--transition-fast);
  }

  .showcase-nav a:hover,
  .showcase-nav a:focus-visible,
  .showcase-nav a.current,
  .showcase-footer a:hover,
  .showcase-footer a:focus-visible {
    color: var(--text);
  }

  .showcase-nav a.current {
    text-decoration: underline;
    text-decoration-color: var(--accent);
    text-underline-offset: 0.35rem;
  }

  .showcase-status {
    color: var(--accent);
    white-space: nowrap;
  }

  .showcase-context {
    max-width: var(--shell-max);
    margin-inline: auto;
    padding: var(--space-lg) var(--shell-pad);
    border-bottom: 1px solid var(--showcase-line);
  }

  .showcase-context-body {
    display: grid;
    grid-template-columns: minmax(16rem, 0.8fr) minmax(24rem, 1.2fr);
    gap: var(--space-xl);
  }

  .showcase-context-summary {
    display: none;
    list-style: none;
  }

  .showcase-context-summary::-webkit-details-marker {
    display: none;
  }

  .showcase-context-summary > span {
    display: flex;
    min-width: 0;
    flex-wrap: wrap;
    gap: var(--space-xs) var(--space-sm);
    align-items: baseline;
  }

  .showcase-context-summary > span:last-child {
    color: var(--text);
    font-family: var(--font-body);
    font-size: var(--text-sm);
    line-height: 1.25;
  }

  .showcase-premise {
    display: flex;
    flex-direction: column;
    gap: var(--space-sm);
  }

  .showcase-premise p {
    max-width: 28rem;
    margin: 0;
    color: var(--text);
    font-family: var(--font-body);
    font-size: var(--text-lg);
    line-height: 1.25;
  }

  .showcase-facts {
    display: grid;
    grid-template-columns: repeat(3, minmax(0, 1fr));
    gap: var(--space-md) var(--space-lg);
    margin: 0;
  }

  .showcase-facts div {
    display: flex;
    min-width: 0;
    flex-direction: column;
    gap: var(--space-2xs);
  }

  .showcase-facts dt,
  .showcase-facts dd {
    margin: 0;
  }

  .showcase-facts dt {
    color: var(--muted-strong);
    font-family: var(--font-mono);
    font-size: var(--text-2xs);
    letter-spacing: var(--tracking-wide);
    text-transform: uppercase;
  }

  .showcase-facts dd {
    color: var(--text-soft);
    font-family: var(--font-body);
    font-size: var(--text-sm);
    line-height: 1.25;
    overflow-wrap: anywhere;
  }

  .showcase-shell.compact .showcase-header {
    gap: var(--space-md);
    padding-block: var(--space-sm);
  }

  .showcase-shell.compact .showcase-context {
    gap: var(--space-md);
    padding-block: var(--space-sm);
  }

  .showcase-shell.compact .showcase-context-summary {
    display: grid;
    grid-template-columns: auto minmax(0, 1fr);
    gap: var(--space-md);
    align-items: baseline;
    cursor: pointer;
  }

  .showcase-shell.compact .showcase-context-summary > span:first-child {
    color: var(--muted);
    font-family: var(--font-mono);
    font-size: var(--text-2xs);
    letter-spacing: var(--tracking-wide);
    text-transform: uppercase;
  }

  .showcase-shell.compact .showcase-premise {
    gap: var(--space-xs);
  }

  .showcase-shell.compact .showcase-premise p {
    font-size: var(--text-sm);
    line-height: 1.3;
  }

  .showcase-shell.compact .showcase-facts {
    gap: var(--space-sm) var(--space-md);
  }

  .showcase-shell.compact .showcase-facts dd {
    font-size: var(--text-xs);
    line-height: 1.2;
  }

  @media (min-width: 1200px) {
    .showcase-shell.compact .showcase-facts {
      grid-template-columns: repeat(6, minmax(0, 1fr));
    }
  }

  @media (min-width: 901px) {
    .showcase-shell.compact .showcase-header,
    .showcase-shell.compact .showcase-context {
      position: absolute;
      top: 0;
      right: 0;
      left: 0;
      pointer-events: none;
      background: color-mix(in srgb, var(--bg) 90%, transparent);
    }

    .showcase-shell.compact .showcase-header {
      z-index: 20;
    }

    .showcase-shell.compact .showcase-header :global(a),
    .showcase-shell.compact .showcase-header :global(button),
    .showcase-shell.compact .showcase-context :global(a),
    .showcase-shell.compact .showcase-context :global(button),
    .showcase-shell.compact .showcase-context summary {
      pointer-events: auto;
    }

    .showcase-shell.compact .showcase-context {
      z-index: 19;
      top: 5.2rem;
      background: color-mix(in srgb, var(--bg) 90%, transparent);
    }

    .showcase-shell.compact .showcase-content {
      position: relative;
      z-index: 1;
    }
  }

  .showcase-content {
    min-width: 0;
    outline: none;
  }

  .showcase-content:focus-visible {
    outline: 1px solid var(--accent);
    outline-offset: -1px;
  }

  .showcase-footer {
    display: flex;
    justify-content: space-between;
    gap: var(--space-lg);
    padding: var(--space-md) var(--shell-pad);
    border-top: 1px solid var(--showcase-line);
    color: var(--muted);
  }

  .showcase-footer > div,
  .showcase-footer nav {
    display: flex;
    flex-wrap: wrap;
    gap: var(--space-sm) var(--space-lg);
  }

  @media (max-width: 900px) {
    .showcase-header {
      grid-template-columns: 1fr auto;
    }

    .showcase-nav {
      grid-column: 1 / -1;
      grid-row: 2;
      justify-content: flex-start;
      flex-wrap: nowrap;
      overflow-x: auto;
      scrollbar-width: none;
      scroll-snap-type: x proximity;
      touch-action: pan-x;
      white-space: nowrap;
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

    .showcase-nav::-webkit-scrollbar {
      display: none;
    }

    .showcase-nav a {
      flex: 0 0 auto;
    }

    .showcase-context-body {
      grid-template-columns: 1fr;
      gap: var(--space-lg);
    }
  }

  @media (max-width: 560px) {
    .showcase-header {
      gap: var(--space-md);
    }

    .showcase-status {
      align-self: start;
    }

    .showcase-context {
      padding-inline: var(--space-md);
    }

    .showcase-shell.compact .showcase-context-summary {
      grid-template-columns: minmax(0, 1fr);
      gap: var(--space-xs);
    }

    .showcase-facts {
      grid-template-columns: repeat(2, minmax(0, 1fr));
      gap: var(--space-md);
    }

    .showcase-footer {
      flex-direction: column;
      padding-inline: var(--space-md);
    }
  }

  @media (prefers-reduced-motion: reduce) {
    .showcase-skip,
    .showcase-nav a,
    .showcase-footer a {
      transition: none;
    }
  }
</style>
