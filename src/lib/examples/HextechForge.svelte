<script lang="ts">
  import {
    ArcaneVein,
    Badge,
    BrassFiligree,
    Button,
    EnergyArc,
    HexGrid,
    Label,
    MetricCard,
    StatusDot,
    Surface,
    Table,
    Text,
    surface,
  } from "../index.js";
  import { onMount } from "svelte";
  import { mountSceneAppearance } from "./appearance.js";

  const cellColumns = [
    { key: "cell", label: "cell" },
    { key: "charge", label: "charge" },
    { key: "heat", label: "heat" },
    { key: "state", label: "state", align: "right" as const },
  ];

  const cells = [
    { cell: "a1", charge: "94%", heat: "312 k", state: "steady" },
    { cell: "a2", charge: "88%", heat: "318 k", state: "steady" },
    { cell: "b1", charge: "72%", heat: "334 k", state: "watch" },
    { cell: "c2", charge: "41%", heat: "347 k", state: "cooling" },
  ];

  onMount(() => mountSceneAppearance("field-notebook", "hextech"));
</script>

<svelte:head>
  <title>hextech forge // hyvui</title>
</svelte:head>

<main class="forge">
  <div class="forge-ambient" aria-hidden="true">
    <HexGrid animated />
  </div>

  <section class="forge-shell">
    <header class="forge-hero" use:surface>
      <BrassFiligree />
      <div class="forge-kicker">
        <StatusDot status="ok" size={7} pulse />
        <Label color="signal">themed production floor</Label>
      </div>
      <h1>hextech forge</h1>
      <Text expression="manifesto">
        the theme is brass, crystal, and pressure. the weight is still
        editorial. separate controls. one composed scene.
      </Text>
      <div class="forge-actions">
        <Button variant="secondary" href="/examples/arcane-shard"
          >open arcane shard</Button
        >
        <Button variant="ghost" href="/">scene index</Button>
      </div>
    </header>

    <div class="forge-metrics">
      <MetricCard label="output" value="35kw" trend="up" trendValue="+4%" />
      <MetricCard label="cells" value="04" trend="neutral" />
      <MetricCard label="variance" value="0.08" trend="down" trendValue="-2" />
      <MetricCard label="cycle" value="19" trend="up" trendValue="live" />
    </div>

    <div class="forge-grid">
      <Surface variant="panel" withInset class="forge-panel">
        <div class="forge-panel-head">
          <Label color="accent">crystal cell array</Label>
          <Badge variant="default">sector 4</Badge>
        </div>
        <Table columns={cellColumns} rows={cells} />
      </Surface>

      <Surface variant="card" class="forge-schematic">
        <div class="forge-schematic-lines" aria-hidden="true">
          <ArcaneVein x1="8%" y1="18%" x2="92%" y2="18%" />
          <ArcaneVein x1="8%" y1="50%" x2="92%" y2="50%" />
          <ArcaneVein x1="8%" y1="82%" x2="92%" y2="82%" />
          <EnergyArc x1="18%" y1="18%" x2="78%" y2="82%" />
        </div>
        <div class="forge-schematic-copy">
          <Label color="muted">conduit sketch</Label>
          <Text expression="readout">blue energy in a brass cage</Text>
        </div>
      </Surface>
    </div>
  </section>
</main>

<style>
  .forge {
    position: relative;
    min-height: 100dvh;
    background: var(--bg);
    overflow: hidden;
  }

  .forge-ambient {
    position: fixed;
    inset: 0;
    opacity: 0.38;
    pointer-events: none;
  }

  .forge-shell {
    position: relative;
    z-index: 1;
    width: min(100%, 78rem);
    margin: 0 auto;
    padding: var(--space-scene) var(--shell-pad);
    display: flex;
    flex-direction: column;
    gap: var(--space-lg);
  }

  .forge-hero {
    position: relative;
    display: flex;
    flex-direction: column;
    gap: var(--space-md);
    max-width: 58rem;
    padding: var(--space-xl);
    border: 1px solid var(--line);
    background: var(--surface-card);
    overflow: hidden;
  }

  .forge-kicker,
  .forge-actions,
  .forge-panel-head {
    display: flex;
    align-items: center;
    gap: var(--space-sm);
    flex-wrap: wrap;
  }

  .forge h1 {
    margin: 0;
    font-family: var(--font-body);
    font-size: var(--text-display);
    font-weight: 400;
    line-height: var(--reg-heading-lh);
    letter-spacing: var(--reg-heading-tracking);
    color: var(--text);
  }

  .forge-metrics {
    width: 100%;
    display: grid;
    grid-template-columns: repeat(4, minmax(0, 1fr));
    gap: var(--space-sm);
  }

  .forge-grid {
    display: grid;
    grid-template-columns: minmax(0, 1fr) minmax(18rem, 0.86fr);
    gap: var(--space-md);
  }

  :global(.forge-panel) {
    padding: var(--space-lg);
    display: flex;
    flex-direction: column;
    gap: var(--space-md);
  }

  :global(.forge-schematic) {
    position: relative;
    min-height: 26rem;
    padding: var(--space-lg);
    overflow: hidden;
  }

  .forge-schematic-lines {
    position: absolute;
    inset: var(--space-lg);
  }

  .forge-schematic-copy {
    position: relative;
    z-index: 1;
    display: flex;
    flex-direction: column;
    gap: var(--space-xs);
  }

  @media (max-width: 860px) {
    .forge-metrics {
      grid-template-columns: repeat(2, minmax(0, 1fr));
    }

    .forge-grid {
      grid-template-columns: 1fr;
    }
  }

  @media (max-width: 560px) {
    .forge-metrics {
      grid-template-columns: 1fr;
    }
  }
</style>
