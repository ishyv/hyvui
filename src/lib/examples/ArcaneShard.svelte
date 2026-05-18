<script lang="ts">
  import {
    ArcaneVein,
    Badge,
    Button,
    CrystalShard,
    Label,
    ShimmerCloud,
    SignalRing,
    StatusLine,
    Surface,
    Text,
    surface,
  } from "../index.js";
  import { onMount } from "svelte";
  import { mountSceneAppearance } from "./appearance.js";

  const readings = [
    { time: "04:12", value: "0.003", state: "baseline" },
    { time: "04:18", value: "0.214", state: "rising" },
    { time: "04:22", value: "1.880", state: "breach" },
    { time: "04:31", value: "0.009", state: "recovering" },
  ];

  onMount(() => mountSceneAppearance("archive", "arcane"));
</script>

<svelte:head>
  <title>arcane shard // hyvui</title>
</svelte:head>

<main class="shard">
  <div class="shard-cloud" aria-hidden="true">
    <ShimmerCloud count={46} />
  </div>

  <section class="shard-shell">
    <header class="shard-hero" use:surface>
      <div class="shard-kicker">
        <StatusLine
          status="warn"
          message="containment uncertain"
          visible={true}
        />
      </div>
      <h1>arcane shard</h1>
      <Text expression="manifesto">
        a theme can become unstable without making the product incoherent. this
        one bends the palette while archive weight keeps the page legible.
      </Text>
      <div class="shard-actions">
        <Button variant="secondary" href="/examples/studio-console"
          >return to studio</Button
        >
        <Button variant="ghost" href="/">scene index</Button>
      </div>
    </header>

    <div class="shard-grid">
      <Surface variant="panel" withInset class="shard-specimen">
        <div class="shard-specimen-stage">
          <SignalRing active size={260} color="var(--accent)" />
          <div class="shard-crystal">
            <CrystalShard size={118} animated />
          </div>
        </div>
        <div class="shard-specimen-copy">
          <Label color="muted">specimen 7-c</Label>
          <Badge variant="default">held</Badge>
        </div>
      </Surface>

      <Surface variant="card" class="shard-log">
        <Label color="accent">reading log</Label>
        <div class="shard-lines">
          {#each readings as reading}
            <div
              class="shard-row"
              class:shard-row--breach={reading.state === "breach"}
            >
              <span>{reading.time}</span>
              <strong>{reading.value}</strong>
              <em>{reading.state}</em>
            </div>
          {/each}
        </div>
        <div class="shard-veins" aria-hidden="true">
          <ArcaneVein x1="8%" y1="88%" x2="92%" y2="18%" />
          <ArcaneVein x1="2%" y1="52%" x2="78%" y2="34%" />
        </div>
      </Surface>
    </div>
  </section>
</main>

<style>
  .shard {
    position: relative;
    min-height: 100dvh;
    background: var(--bg);
    overflow: hidden;
  }

  .shard-cloud {
    position: fixed;
    inset: 0;
    pointer-events: none;
  }

  .shard-shell {
    position: relative;
    z-index: 1;
    width: min(100%, 74rem);
    margin: 0 auto;
    padding: var(--space-scene) var(--shell-pad);
    display: flex;
    flex-direction: column;
    gap: var(--space-xl);
  }

  .shard-hero {
    max-width: 56rem;
    display: flex;
    flex-direction: column;
    gap: var(--space-md);
  }

  .shard h1 {
    margin: 0;
    font-family: var(--font-body);
    font-size: var(--text-display);
    font-weight: 400;
    line-height: var(--reg-heading-lh);
    letter-spacing: var(--reg-heading-tracking);
    color: var(--text);
  }

  .shard-actions,
  .shard-specimen-copy {
    display: flex;
    align-items: center;
    gap: var(--space-sm);
    flex-wrap: wrap;
  }

  .shard-grid {
    display: grid;
    grid-template-columns: minmax(18rem, 0.9fr) minmax(0, 1fr);
    gap: var(--space-md);
  }

  :global(.shard-specimen),
  :global(.shard-log) {
    padding: var(--space-lg);
  }

  :global(.shard-specimen) {
    display: flex;
    flex-direction: column;
    gap: var(--space-md);
  }

  .shard-specimen-stage {
    position: relative;
    min-height: 24rem;
    display: grid;
    place-items: center;
  }

  .shard-crystal {
    position: relative;
    z-index: 1;
  }

  :global(.shard-log) {
    position: relative;
    display: flex;
    flex-direction: column;
    gap: var(--space-md);
    overflow: hidden;
  }

  .shard-lines {
    display: flex;
    flex-direction: column;
    gap: var(--space-xs);
  }

  .shard-row {
    display: grid;
    grid-template-columns: 5ch 1fr auto;
    gap: var(--space-md);
    align-items: baseline;
    padding-block: var(--space-xs);
    border-bottom: 1px solid var(--line);
    font-family: var(--font-mono);
    color: var(--muted);
  }

  .shard-row strong,
  .shard-row em {
    font-weight: 400;
    font-style: normal;
  }

  .shard-row strong {
    color: var(--text);
  }

  .shard-row--breach {
    color: var(--accent);
  }

  .shard-veins {
    position: absolute;
    inset: 0;
    opacity: 0.5;
    pointer-events: none;
  }

  @media (max-width: 820px) {
    .shard-grid {
      grid-template-columns: 1fr;
    }
  }
</style>
