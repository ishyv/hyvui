<script lang="ts">
  import {
    Badge,
    Button,
    CornerBrackets,
    DataStream,
    Grid,
    HorizonGrid,
    Label,
    MetricCard,
    SidebarNav,
    StatusDot,
    Surface,
    Table,
    Text,
    surface,
  } from "../index.js";
  import { onMount } from "svelte";
  import { mountSceneAppearance } from "./appearance.js";

  const navItems = [
    { label: "desk", href: "#desk", active: true },
    { label: "briefs", href: "#briefs" },
    { label: "cuts", href: "#cuts" },
    { label: "release", href: "#release" },
  ];

  const queueColumns = [
    { key: "slot", label: "slot" },
    { key: "piece", label: "piece" },
    { key: "state", label: "state", align: "right" as const },
  ];

  const queue = [
    { slot: "08:10", piece: "gallery opener", state: "locked" },
    { slot: "09:40", piece: "interview select", state: "grading" },
    { slot: "11:15", piece: "motion pass", state: "review" },
    { slot: "13:00", piece: "launch card", state: "ready" },
  ];

  const boards = [
    { name: "editorial", count: "14", status: "ok" as const },
    { name: "motion", count: "08", status: "pend" as const },
    { name: "gallery", count: "32", status: "ok" as const },
  ];

  onMount(() => mountSceneAppearance("mission-control"));
</script>

<svelte:head>
  <title>studio console // hyvui</title>
</svelte:head>

<main class="studio" id="desk">
  <div class="studio-bg" aria-hidden="true">
    <HorizonGrid rows={18} cols={12} vanishY={0.38} animated />
    <DataStream active speed="slow" />
  </div>

  <aside class="studio-side" use:surface>
    <div>
      <Label color="signal">hyvui scenes</Label>
      <h1>studio console</h1>
    </div>
    <SidebarNav items={navItems} />
    <div class="studio-side-note">
      <StatusDot status="ok" size={7} pulse />
      <Label color="muted">showcase rig online</Label>
    </div>
  </aside>

  <section class="studio-main">
    <header class="studio-hero" use:surface={{ delay: 80 }}>
      <div class="studio-kicker">
        <StatusDot status="ok" size={7} />
        <Label color="signal">production desk</Label>
      </div>
      <Text variant="heading" as="p" expression="title-card">
        a control room for creative work.
      </Text>
      <p class="studio-copy">
        dense enough for real decisions. cinematic enough to prove the system
        has taste.
      </p>
      <div class="studio-actions">
        <Button variant="secondary" href="/examples/field-report"
          >open next scene</Button
        >
        <Button variant="ghost" href="/">scene index</Button>
      </div>
    </header>

    <div class="studio-metrics" use:surface={{ delay: 140 }}>
      <MetricCard label="active briefs" value="18" trend="up" trendValue="+4" />
      <MetricCard label="review load" value="72%" trend="neutral" />
      <MetricCard
        label="assets moved"
        value="1.4k"
        trend="up"
        trendValue="+18%"
      />
    </div>

    <div class="studio-grid">
      <Surface
        variant="panel"
        withInset
        class="studio-panel studio-panel--queue"
      >
        <div class="studio-panel-head">
          <Label color="accent">release queue</Label>
          <Badge variant="default">today</Badge>
        </div>
        <Table columns={queueColumns} rows={queue} />
      </Surface>

      <Surface variant="card" class="studio-panel studio-panel--stage">
        <CornerBrackets size={24} color="var(--signal)" />
        <div class="studio-stage-map">
          {#each boards as board}
            <div class="studio-board">
              <StatusDot status={board.status} size={7} />
              <span>{board.name}</span>
              <strong>{board.count}</strong>
            </div>
          {/each}
        </div>
      </Surface>

      <Grid cols={2} gap="var(--space-sm)" class="studio-lanes">
        <Surface variant="card" class="studio-lane">
          <Label color="muted">cut review</Label>
          <Text expression="readout">six cards need eyes before 16:00</Text>
        </Surface>
        <Surface variant="card" class="studio-lane">
          <Label color="muted">gallery pass</Label>
          <Text expression="readout">archive sequence has enough contrast</Text>
        </Surface>
      </Grid>
    </div>
  </section>
</main>

<style>
  .studio {
    position: relative;
    min-height: 100dvh;
    display: grid;
    grid-template-columns: minmax(15rem, 18rem) minmax(0, 1fr);
    background: var(--bg);
    overflow: hidden;
  }

  .studio-bg {
    position: absolute;
    inset: 0;
    opacity: 0.28;
    pointer-events: none;
  }

  .studio-side {
    position: relative;
    z-index: 1;
    display: flex;
    flex-direction: column;
    gap: var(--space-lg);
    padding: var(--space-lg);
    border-right: 1px solid var(--line);
    background: color-mix(in srgb, var(--bg) 84%, transparent);
  }

  .studio-side h1 {
    margin: var(--space-xs) 0 0;
    font-family: var(--font-mono);
    font-size: var(--text-lg);
    font-weight: 400;
    line-height: 1;
    color: var(--text);
  }

  .studio-side-note,
  .studio-kicker,
  .studio-actions,
  .studio-panel-head {
    display: flex;
    align-items: center;
    gap: var(--space-sm);
    flex-wrap: wrap;
  }

  .studio-side-note {
    margin-top: auto;
  }

  .studio-main {
    position: relative;
    z-index: 1;
    display: flex;
    flex-direction: column;
    gap: var(--space-lg);
    padding: clamp(var(--space-lg), 4vw, var(--space-3xl));
  }

  .studio-hero {
    max-width: 56rem;
    display: flex;
    flex-direction: column;
    gap: var(--space-md);
  }

  .studio-copy {
    max-width: 42rem;
    margin: 0;
    color: var(--text-soft);
    font-size: var(--text-md);
    line-height: 1.5;
  }

  .studio-metrics {
    display: grid;
    grid-template-columns: repeat(3, minmax(0, 1fr));
    gap: var(--space-sm);
  }

  .studio-grid {
    display: grid;
    grid-template-columns: minmax(0, 1.1fr) minmax(18rem, 0.9fr);
    gap: var(--space-md);
    align-items: stretch;
  }

  :global(.studio-panel) {
    padding: var(--space-lg);
  }

  :global(.studio-panel--queue) {
    display: flex;
    flex-direction: column;
    gap: var(--space-md);
  }

  :global(.studio-panel--stage) {
    min-height: 20rem;
    display: grid;
    place-items: center;
  }

  .studio-stage-map {
    width: min(100%, 24rem);
    display: grid;
    gap: var(--space-sm);
  }

  .studio-board {
    display: grid;
    grid-template-columns: auto 1fr auto;
    align-items: center;
    gap: var(--space-sm);
    padding: var(--space-sm) var(--space-md);
    border: 1px solid var(--line);
    background: color-mix(in srgb, var(--surface-panel) 72%, transparent);
    font-family: var(--font-mono);
    color: var(--text-soft);
  }

  .studio-board strong {
    font-weight: 400;
    color: var(--signal);
  }

  :global(.studio-lanes) {
    grid-column: 1 / -1;
  }

  :global(.studio-lane) {
    padding: var(--space-md);
    display: flex;
    flex-direction: column;
    gap: var(--space-xs);
  }

  @media (max-width: 820px) {
    .studio {
      grid-template-columns: 1fr;
    }

    .studio-side {
      border-right: none;
      border-bottom: 1px solid var(--line);
    }

    .studio-metrics,
    .studio-grid,
    :global(.studio-lanes) {
      grid-template-columns: 1fr;
    }
  }
</style>
