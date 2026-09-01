<script lang="ts">
  import { onMount } from "svelte";
  import type { Snippet } from "svelte";
  import {
    resolveTransition,
    type TransitionIntent,
  } from "./transitionResolution.js";

  type Props = {
    id: string;
    label: string;
    order?: number;
    transitionIntent?: TransitionIntent;
    continuityKey?: string;
    class?: string;
    children?: Snippet;
  };

  let {
    id,
    label,
    order = 0,
    transitionIntent = "cut",
    continuityKey,
    class: className = "",
    children,
  }: Props = $props();

  const transition = $derived(resolveTransition(transitionIntent));
  const labelId = $derived(`${id}-label`);
  let frameElement: HTMLElement;
  let active = $state(true);

  onMount(() => {
    if (!("IntersectionObserver" in window)) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        active = entry?.isIntersecting ?? active;
      },
      { threshold: [0.5] },
    );
    observer.observe(frameElement);
    return () => observer.disconnect();
  });
</script>

<section
  {id}
  class={`hyvui-frame ${className}`}
  data-frame={id}
  data-frame-id={id}
  data-frame-order={order}
  data-frame-label={label}
  data-frame-transition={transition.intent}
  data-frame-transition-mode={transition.mode}
  data-frame-continuity={transition.continuity}
  data-frame-continuity-key={continuityKey}
  data-frame-active={active}
  style:--frame-transition-duration={`${transition.durationMs}ms`}
  bind:this={frameElement}
  aria-labelledby={labelId}
  tabindex="-1"
>
  <h2 id={labelId} class="frame-visually-hidden">{label}</h2>
  {#if children}{@render children()}{/if}
</section>

<style>
  :global(.hyvui-frame) {
    position: relative;
    min-height: 100svh;
    scroll-margin-top: var(--frame-index-height, 0px);
    scroll-snap-align: start;
    scroll-snap-stop: normal;
    transition:
      opacity var(--frame-transition-duration, 0ms) var(--ease-smooth),
      filter var(--frame-transition-duration, 0ms) var(--ease-smooth);
  }

  :global(.hyvui-frame[data-frame-transition="cut"]) {
    transition: none;
  }

  :global(.hyvui-frame[data-frame-active="false"]) {
    opacity: 0.62;
    filter: saturate(0.72);
  }

  :global(.hyvui-frame[data-frame-active="true"]) {
    opacity: 1;
    filter: none;
  }

  :global(.hyvui-frame:focus-visible) {
    outline: 1px solid var(--accent);
    outline-offset: calc(var(--space-xs) * -1);
  }

  :global(.frame-visually-hidden) {
    position: absolute;
    width: 1px;
    height: 1px;
    padding: 0;
    margin: -1px;
    overflow: hidden;
    clip: rect(0, 0, 0, 0);
    white-space: nowrap;
    border: 0;
  }

  @media (prefers-reduced-motion: reduce) {
    :global(.hyvui-frame) {
      transition-duration: 0s;
    }
  }
</style>
