<script lang="ts">
  import { onMount } from "svelte";
  import type { Snippet } from "svelte";
  import type { PassagePlan } from "./passageResolution.js";

  export type PassageStep = {
    id: string;
    label: string;
    heading: string;
    body: string;
  };

  type Props = {
    id: string;
    label: string;
    plan: PassagePlan;
    steps: PassageStep[];
    class?: string;
    children?: Snippet;
  };

  let {
    id,
    label,
    plan,
    steps,
    class: className = "",
    children,
  }: Props = $props();

  let activeIndex = $state(0);
  const labelId = $derived(`${id}-label`);
  const activeStep = $derived(steps[activeIndex] ?? steps[0]);

  onMount(() => {
    if (plan.mode !== "scroll") return;
    const elements = [
      ...document.querySelectorAll<HTMLElement>(
        `[data-passage="${id}"] [data-passage-step]`,
      ),
    ];
    if (elements.length === 0 || !("IntersectionObserver" in window)) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort(
            (left, right) => right.intersectionRatio - left.intersectionRatio,
          );
        const candidate = visible[0]?.target as HTMLElement | undefined;
        const nextIndex = candidate ? elements.indexOf(candidate) : activeIndex;
        if (nextIndex >= 0) activeIndex = nextIndex;
      },
      { threshold: [0.35, 0.55, 0.75] },
    );

    elements.forEach((element) => observer.observe(element));
    return () => observer.disconnect();
  });
</script>

<section
  {id}
  class={`hyvui-passage ${className}`}
  data-passage={id}
  data-passage-mode={plan.mode}
  data-passage-host={plan.hostBiome}
  data-passage-progress-mode={plan.progress}
  data-passage-motion={plan.motion}
  aria-labelledby={labelId}
>
  <header class="passage-header">
    <div>
      <span class="passage-kicker">{label}</span>
      <p id={labelId}>{plan.reason}</p>
    </div>
    <p
      class="passage-progress"
      data-passage-progress
      role="status"
      aria-live="polite"
    >
      {activeStep ? `step ${activeIndex + 1} / ${steps.length}` : "no steps"}
    </p>
  </header>

  {#if plan.mode === "scroll"}
    <div class="passage-scroll" data-passage-scroll>
      {#each steps as step, index}
        <article
          id={step.id}
          class="passage-step"
          data-passage-step={step.id}
          data-passage-step-index={index}
          data-passage-active={activeIndex === index}
          tabindex="-1"
        >
          <span>{step.label}</span>
          <h2>{step.heading}</h2>
          <p>{step.body}</p>
          {#if children}{@render children()}{/if}
        </article>
      {/each}
    </div>
  {:else}
    <ol class="passage-static" data-passage-static>
      {#each steps as step, index}
        <li
          id={step.id}
          data-passage-step={step.id}
          data-passage-step-index={index}
        >
          <span>{step.label}</span>
          <h2>{step.heading}</h2>
          <p>{step.body}</p>
          {#if children}{@render children()}{/if}
        </li>
      {/each}
    </ol>
  {/if}
</section>

<style>
  :global(.hyvui-passage) {
    position: relative;
    background: var(--bg);
    color: var(--text);
  }

  .passage-header {
    position: sticky;
    top: 0;
    z-index: var(--z-raised);
    display: flex;
    justify-content: space-between;
    gap: var(--space-lg);
    align-items: start;
    padding: var(--space-md) var(--shell-pad);
    border-bottom: 1px solid var(--line);
    background: color-mix(in srgb, var(--bg) 94%, transparent);
    backdrop-filter: blur(10px);
  }

  .passage-kicker,
  .passage-progress,
  .passage-header p,
  .passage-step > span,
  .passage-static li > span {
    font-family: var(--font-mono);
    font-size: var(--text-2xs);
    letter-spacing: var(--tracking-wide);
    text-transform: uppercase;
  }

  .passage-kicker {
    color: var(--accent);
  }

  .passage-header p {
    max-width: 40rem;
    margin: var(--space-xs) 0 0;
    color: var(--muted);
    line-height: 1.45;
    text-transform: none;
  }

  .passage-progress {
    flex: 0 0 auto;
    margin: 0;
    color: var(--signal);
  }

  .passage-scroll {
    padding: 0 var(--shell-pad);
  }

  .passage-step,
  .passage-static li {
    display: grid;
    align-content: center;
    min-height: min(88svh, 60rem);
    padding: var(--space-3xl) 12%;
    border-bottom: 1px solid var(--line);
  }

  .passage-step > span,
  .passage-static li > span {
    color: var(--muted);
  }

  .passage-step h2,
  .passage-static h2 {
    max-width: 10ch;
    margin: var(--space-lg) 0 0;
    font-family: var(--font-body);
    font-size: clamp(3rem, 8vw, 9rem);
    font-weight: 400;
    letter-spacing: -0.065em;
    line-height: 0.84;
  }

  .passage-step p,
  .passage-static p {
    max-width: 34rem;
    margin: var(--space-xl) 0 0;
    color: var(--text-soft);
    font-family: var(--font-body);
    font-size: var(--text-md);
    line-height: var(--leading-body);
  }

  .passage-step[data-passage-active="false"] {
    opacity: 0.58;
  }

  .passage-step[data-passage-active="true"] {
    opacity: 1;
  }

  .passage-static {
    padding: 0 var(--shell-pad);
    margin: 0;
    list-style: none;
  }

  @media (prefers-reduced-motion: no-preference) {
    .passage-step {
      transition: opacity var(--transition-smooth);
    }
  }

  @media (max-width: 680px) {
    .passage-header {
      display: block;
      padding-inline: var(--space-md);
    }

    .passage-progress {
      margin-top: var(--space-sm);
    }

    .passage-scroll,
    .passage-static {
      padding-inline: var(--space-md);
    }

    .passage-step,
    .passage-static li {
      min-height: 78svh;
      padding: var(--space-3xl) var(--space-md);
    }

    .passage-step h2,
    .passage-static h2 {
      max-width: 8ch;
      font-size: clamp(2.8rem, 15vw, 5.5rem);
    }
  }

  @media (prefers-reduced-motion: reduce) {
    .passage-step {
      opacity: 1;
      transition-duration: 0s;
    }
  }
</style>
