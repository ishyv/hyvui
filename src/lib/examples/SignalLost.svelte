<script lang="ts">
  import {
    Button,
    CornerBrackets,
    DepthLayer,
    DepthStage,
    FloatCard,
    HorizonGrid,
    Label,
    SignalRing,
    StatusDot,
    TerminalBoot,
    Text,
    surface,
  } from "../index.js";
  import { onMount } from "svelte";
  import { mountSceneAppearance } from "./appearance.js";

  const bootLines = [
    { status: "ok" as const, message: "local archive intact" },
    { status: "ok" as const, message: "last known frame recovered" },
    { status: "pend" as const, message: "searching alternate index" },
    { status: "warn" as const, message: "no object at requested coordinate" },
    { status: "fail" as const, message: "signal lost" },
  ];

  onMount(() => mountSceneAppearance("field-notebook"));
</script>

<svelte:head>
  <title>signal lost // hyvui</title>
</svelte:head>

<main class="lost">
  <div class="lost-grid" aria-hidden="true">
    <HorizonGrid rows={22} cols={16} vanishY={0.34} animated />
  </div>

  <div class="lost-ring" aria-hidden="true">
    <SignalRing active size={420} />
  </div>

  <DepthStage perspective="mid" class="lost-stage">
    <DepthLayer level="ground" class="lost-terminal">
      <div class="lost-terminal-inner" use:surface={{ delay: 200 }}>
        <TerminalBoot lines={bootLines} delay={200} interval={420} />
      </div>
    </DepthLayer>

    <DepthLayer level="raised" class="lost-center">
      <FloatCard tiltMax={6} class="lost-card">
        <div class="lost-content">
          <CornerBrackets size={30} color="var(--accent)" />
          <div class="lost-status">
            <StatusDot status="fail" size={8} pulse />
            <Label color="muted">cinematic system state</Label>
          </div>
          <h1>signal lost</h1>
          <Text expression="manifesto">
            the route is gone, but the interface still has a job. hold the
            moment. give the user a way back.
          </Text>
          <div class="lost-actions">
            <Button variant="secondary" href="/">return to scene index</Button>
            <Button variant="ghost" href="/docs">open docs</Button>
          </div>
        </div>
      </FloatCard>
    </DepthLayer>
  </DepthStage>
</main>

<style>
  .lost {
    position: relative;
    min-height: 100dvh;
    display: grid;
    place-items: center;
    background: var(--bg);
    overflow: hidden;
  }

  .lost-grid,
  .lost-ring {
    position: absolute;
    inset: 0;
    pointer-events: none;
  }

  .lost-grid {
    opacity: 0.42;
  }

  .lost-ring {
    display: grid;
    place-items: center;
    opacity: 0.28;
  }

  :global(.lost-stage) {
    position: relative;
    z-index: 1;
    width: min(100%, 58rem);
    padding: var(--space-scene);
    display: grid;
    gap: var(--space-xl);
  }

  :global(.lost-terminal) {
    width: min(100%, 34rem);
    justify-self: center;
  }

  .lost-terminal-inner {
    padding-left: var(--space-md);
    border-left: 1px solid color-mix(in srgb, var(--signal) 28%, transparent);
  }

  :global(.lost-center) {
    display: flex;
    justify-content: center;
  }

  :global(.lost-card) {
    width: min(100%, 38rem);
  }

  .lost-content {
    position: relative;
    display: flex;
    flex-direction: column;
    gap: var(--space-lg);
    padding: var(--space-md);
  }

  .lost-status,
  .lost-actions {
    display: flex;
    align-items: center;
    gap: var(--space-sm);
    flex-wrap: wrap;
  }

  .lost h1 {
    margin: 0;
    font-family: var(--font-body);
    font-size: var(--text-display);
    font-weight: 400;
    line-height: var(--reg-heading-lh);
    letter-spacing: var(--reg-heading-tracking);
    color: var(--text);
  }
</style>
