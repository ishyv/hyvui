<script lang="ts">
  import { onMount } from "svelte";
  import { clearTheme } from "$lib/index.js";
  import DecisionSpecimen from "$lib/next-experiments/DecisionSpecimen.svelte";
  import ShowcaseShell from "$lib/showcase/ShowcaseShell.svelte";
  import { getShowcaseManifest } from "$lib/showcase/showcaseManifest.js";
  import type { PageData } from "./$types.js";

  let { data }: { data: PageData } = $props();
  const showcaseManifest = getShowcaseManifest("next-measured-sublime");
  const inspectionJson = $derived(JSON.stringify(data.specimen, null, 2));
  let activeId = $state("");

  onMount(() => {
    clearTheme();
  });
</script>

<svelte:head>
  <title>next lab / measured sublime</title>
  <meta
    name="description"
    content="A premise-first composition rendered from resolver decisions."
  />
</svelte:head>

<ShowcaseShell manifest={showcaseManifest!}>
<main class="measured-page">
  <a class="back-link" href="/next-lab/experiment">next lab / experiments</a>

  <section
    class="measured-field"
    data-measured-sublime
    data-premise-first="true"
    data-quiet-ratio={data.specimen.quietRatio}
  >
    <header class="premise" data-role="field">
      <span class="premise-label">hyvui / study 01</span>
      <h1>
        <span>a relation may place</span>
        <span>the signal near the edge</span>
        <span>while text stays put</span>
        <span>the reason stays visible</span>
      </h1>
    </header>

    <aside class="instrument" data-role="instrument">
      <p class="instrument-label">relation decisions</p>
      <ol>
        {#each data.composition.decisions as decision, index}
          <li>
            <button
              type="button"
              data-decision-id={decision.relationId}
              aria-pressed={activeId === decision.relationId}
              onclick={() => {
                activeId =
                  activeId === decision.relationId ? "" : decision.relationId;
              }}
            >
              <span>{String(index + 1).padStart(2, "0")}</span>
              <div>
                <strong>{decision.relationId.replaceAll("-", " ")}</strong>
                <p>{decision.reason}</p>
              </div>
            </button>
          </li>
        {/each}
      </ol>
    </aside>

    <div class="phenomenon" data-role="phenomenon">
      <DecisionSpecimen specimen={data.specimen} {activeId} />
    </div>

    <footer class="trace" data-role="trace">
      {#if data.specimen.rupture}
        <span data-trace-relation={data.specimen.rupture.relationId}>
          applied / relation → placement
        </span>
      {/if}
    </footer>

    <pre hidden data-measured-sublime-inspector>{inspectionJson}</pre>
  </section>
</main>
</ShowcaseShell>

<style>
  .measured-page {
    --ms-field: color-mix(in srgb, var(--text) 94%, var(--bg));
    --ms-ink: color-mix(in srgb, var(--bg) 94%, var(--text));
    --ms-specimen: color-mix(in srgb, var(--bg) 96%, var(--text));
    --ms-specimen-edge: color-mix(in srgb, var(--bg) 78%, var(--text));
    --ms-rupture: var(--accent);
    min-height: 100dvh;
    padding: var(--space-lg);
    background: var(--bg);
  }

  .back-link {
    display: inline-block;
    margin-bottom: var(--space-md);
    color: var(--muted);
    font-family: var(--font-mono);
    font-size: var(--text-2xs);
    letter-spacing: 0.08em;
    text-decoration: none;
  }

  .measured-field {
    position: relative;
    display: grid;
    grid-template-columns: repeat(12, minmax(0, 1fr));
    grid-template-rows: repeat(12, minmax(0, 1fr));
    column-gap: var(--space-md);
    isolation: isolate;
    min-height: min(82rem, calc(100dvh - 5rem));
    overflow: hidden;
    background: var(--ms-field);
    color: var(--ms-ink);
  }

  .premise {
    z-index: 3;
    grid-column: 1 / 5;
    grid-row: 1 / 6;
    align-self: start;
    margin: clamp(var(--space-xl), 6vw, 6rem) 0 0
      clamp(var(--space-lg), 4vw, 4rem);
  }

  .premise-label,
  .instrument-label,
  .trace {
    font-family: var(--font-mono);
    font-size: var(--text-2xs);
    letter-spacing: 0.1em;
    text-transform: uppercase;
  }

  .premise h1 {
    max-width: 20ch;
    margin: var(--space-md) 0 0;
    font-family: var(--font-serif);
    font-size: clamp(1.5rem, 2.5vw, 3rem);
    font-weight: 400;
    line-height: 1.02;
  }

  .premise h1 span {
    display: block;
  }

  .instrument {
    z-index: 3;
    grid-column: 1 / 4;
    grid-row: 7 / 12;
    align-self: end;
    margin: 0 0 var(--space-xl) clamp(var(--space-lg), 4vw, 4rem);
  }

  .instrument ol {
    padding: 0;
    margin: var(--space-md) 0 0;
    list-style: none;
  }

  .instrument li {
    padding-block: var(--space-sm);
    border-top: 1px solid color-mix(in srgb, var(--ms-ink) 16%, transparent);
  }

  .instrument button {
    display: grid;
    width: 100%;
    grid-template-columns: 2rem 1fr;
    gap: var(--space-sm);
    padding: 0;
    border: 0;
    background: transparent;
    color: inherit;
    text-align: left;
    cursor: pointer;
  }

  .instrument button:focus-visible {
    outline: 1px solid var(--ms-rupture);
    outline-offset: var(--space-xs);
  }

  .instrument button[aria-pressed="true"] strong {
    color: var(--ms-rupture);
  }

  .instrument button[aria-pressed="true"] {
    box-shadow: inset 3px 0 0 var(--ms-rupture);
    padding-inline-start: var(--space-sm);
  }

  .instrument button > span,
  .instrument strong {
    font-family: var(--font-mono);
    font-size: 0.72rem;
    font-weight: 400;
    letter-spacing: 0.04em;
  }

  .instrument p {
    margin: var(--space-xs) 0 0;
    font-family: var(--font-serif);
    font-size: var(--text-xs);
    line-height: 1.3;
  }

  .phenomenon {
    z-index: 2;
    grid-column: 5 / 13;
    grid-row: 1 / 12;
    align-self: center;
    width: 100%;
  }

  .trace {
    z-index: 3;
    display: flex;
    grid-column: 9 / 13;
    grid-row: 12 / 13;
    flex-direction: column;
    gap: var(--space-xs);
    align-self: center;
    margin-bottom: var(--space-lg);
    color: color-mix(in srgb, var(--ms-ink) 64%, transparent);
  }

  @media (max-width: 680px) {
    .measured-page {
      padding: var(--space-sm);
    }

    .back-link {
      margin-inline: var(--space-xs);
    }

    .measured-field {
      display: flex;
      min-height: auto;
      flex-direction: column;
      gap: var(--space-2xl);
      padding: var(--space-xl) var(--space-md) var(--space-lg);
      overflow: clip;
    }

    .premise,
    .instrument,
    .phenomenon,
    .trace {
      position: relative;
      inset: auto;
      width: 100%;
    }

    .premise {
      order: 1;
      margin: 0;
    }

    .premise h1 {
      max-width: 16ch;
      font-size: clamp(2rem, 9vw, 3.25rem);
    }

    .instrument {
      order: 3;
      margin: 0;
    }

    .phenomenon {
      order: 2;
      width: 112%;
      align-self: flex-end;
      margin-right: -10%;
    }

    .trace {
      order: 4;
      flex-direction: column;
      gap: var(--space-xs);
    }
  }
</style>
