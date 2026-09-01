<script lang="ts">
  import { onMount } from "svelte";
  import type { Snippet } from "svelte";
  import {
    resolveTransition,
    type TransitionIntent,
  } from "./transitionResolution.js";

  export type FrameIndexEntry = {
    id: string;
    label: string;
  };

  type Props = {
    entries?: FrameIndexEntry[];
    transitionIntent?: TransitionIntent;
    ariaLabel?: string;
    class?: string;
    children?: Snippet;
  };

  let {
    entries = [],
    transitionIntent = "cut",
    ariaLabel = "frames",
    class: className = "",
    children,
  }: Props = $props();

  const transition = $derived(resolveTransition(transitionIntent));
  let sequenceElement: HTMLElement;
  let activeId = $state("");
  const firstEntryId = $derived(entries[0]?.id ?? "");

  $effect(() => {
    if (!entries.some((entry) => entry.id === activeId)) {
      activeId = firstEntryId;
    }
  });

  onMount(() => {
    if (!("IntersectionObserver" in window)) return;
    const frames = [
      ...sequenceElement.querySelectorAll<HTMLElement>("[data-frame]"),
    ];
    if (frames.length === 0) return;

    const observer = new IntersectionObserver(
      (observations) => {
        const visible = observations
          .filter((entry) => entry.isIntersecting)
          .sort(
            (left, right) => right.intersectionRatio - left.intersectionRatio,
          );
        const next = visible[0]?.target as HTMLElement | undefined;
        if (next?.id) activeId = next.id;
      },
      { threshold: [0.5] },
    );
    frames.forEach((frame) => observer.observe(frame));
    return () => observer.disconnect();
  });
</script>

<div
  class={`hyvui-frame-sequence ${className}`}
  bind:this={sequenceElement}
  data-frame-sequence
  data-frame-transition={transition.intent}
  data-frame-transition-mode={transition.mode}
  data-frame-continuity={transition.continuity}
  style:--frame-transition-duration={`${transition.durationMs}ms`}
>
  {#if entries.length > 0}
    <nav class="frame-index" data-frame-index aria-label={ariaLabel}>
      <ol>
        {#each entries as entry, index}
          <li>
            <a
              href={`#${entry.id}`}
              aria-current={activeId === entry.id ? "page" : undefined}
              onclick={() => (activeId = entry.id)}
            >
              <span>{String(index + 1).padStart(2, "0")}</span>
              {entry.label}
            </a>
          </li>
        {/each}
      </ol>
    </nav>
  {/if}

  {#if children}{@render children()}{/if}
</div>

<style>
  :global(.hyvui-frame-sequence) {
    position: relative;
    scroll-snap-type: y proximity;
  }

  :global(.frame-index) {
    position: sticky;
    top: 0;
    z-index: var(--z-raised);
    min-height: var(--frame-index-height, 2.75rem);
    border-bottom: 1px solid var(--line);
    background: color-mix(in srgb, var(--bg) 92%, transparent);
    backdrop-filter: blur(10px);
  }

  :global(.frame-index ol) {
    display: flex;
    flex-wrap: wrap;
    gap: var(--space-xs) var(--space-md);
    padding: var(--space-sm) var(--shell-pad);
    margin: 0;
    list-style: none;
  }

  :global(.frame-index a) {
    display: inline-flex;
    gap: var(--space-xs);
    align-items: baseline;
    color: var(--muted);
    font-family: var(--font-mono);
    font-size: var(--text-2xs);
    letter-spacing: var(--tracking-wide);
    text-decoration: none;
    text-transform: uppercase;
  }

  :global(.frame-index a span) {
    color: var(--accent);
  }

  :global(.frame-index a:hover),
  :global(.frame-index a:focus-visible) {
    color: var(--text);
  }

  :global(.frame-index a:focus-visible) {
    outline: 1px solid var(--accent);
    outline-offset: var(--space-xs);
  }

  @media (max-width: 680px) {
    :global(.frame-index ol) {
      padding-inline: var(--space-md);
    }
  }

  @media (prefers-reduced-motion: reduce) {
    :global(.frame-index a) {
      transition-duration: 0s;
    }
  }
</style>
