<!--
  EXAMPLE: Signal Lost
  REGISTER: field-notebook
  CONCEPT: a 404 page that feels like arriving at coordinates where something used to be
  DEMONSTRATES: FloatCard, HorizonGrid, TerminalBoot, StatusDot, CornerBrackets, SignalRing, Text expressions, surface action, depth system
  INSPIRED BY: the last transmission log of a deep-space relay station
-->
<script lang="ts">
  import {
    Text,
    Label,
    Button,
    StatusDot,
    CornerBrackets,
    TerminalBoot,
    FloatCard,
    HorizonGrid,
    DepthStage,
    DepthLayer,
    SignalRing,
    GlyphMark,
    surface,
    applyRegister,
  } from '../index.js';
  import { onMount } from 'svelte';

  let bootComplete = $state(false);

  const bootLines: { status: 'ok' | 'pend' | 'warn' | 'fail'; message: string }[] = [
    { status: 'ok', message: 'local systems nominal' },
    { status: 'ok', message: 'navigation subsystem online' },
    { status: 'ok', message: 'scanning frequency range' },
    { status: 'pend', message: 'attempting signal acquisition' },
    { status: 'warn', message: 'no response on primary band' },
    { status: 'warn', message: 'sweeping secondary frequencies' },
    { status: 'fail', message: 'target signal not found at these coordinates' },
  ];

  onMount(() => {
    applyRegister('field-notebook');
    return () => {
      document.body.removeAttribute('data-register');
    };
  });
</script>

<div class="signal-lost">
  <div class="signal-lost-bg">
    <HorizonGrid animated rows={20} cols={14} vanishY={0.32} />
  </div>

  <div class="signal-lost-ring" aria-hidden="true">
    <SignalRing active size={400} />
  </div>

  <DepthStage perspective="mid" class="signal-lost-stage">
    <DepthLayer level="ground" class="signal-lost-terminal">
      <div class="signal-lost-terminal-inner" use:surface={{ delay: 800 }}>
        <TerminalBoot
          lines={bootLines}
          delay={1200}
          interval={900}
          oncomplete={() => (bootComplete = true)}
        />
      </div>
    </DepthLayer>

    <DepthLayer level="raised" class="signal-lost-center">
      <FloatCard tiltMax={6} class="signal-lost-card">
        <div class="signal-lost-content" style:position="relative">
          <CornerBrackets size={28} color="rgba(199, 156, 87, 0.2)" />

          <div class="signal-lost-status" use:surface={{ delay: 200 }}>
            <StatusDot status="fail" size={8} pulse />
            <Label color="muted">transmission ended</Label>
          </div>

          <div use:surface={{ delay: 400 }}>
            <Text variant="heading" expression="title-card" as="h1" color="primary">
              the coordinates are empty now
            </Text>
          </div>

          <div use:surface={{ delay: 600 }}>
            <Text expression="manifesto">
              something was broadcasting from here. the frequency is right,
              the heading is right. but the source has gone quiet.
            </Text>
          </div>

          <div class="signal-lost-meta" use:surface={{ delay: 700 }}>
            <GlyphMark variant="coord" size={16} color="var(--muted-strong)" />
            <Label color="muted">bearing 047.2 | range unknown | last contact 7h ago</Label>
          </div>

          <div class="signal-lost-action" use:surface={{ delay: 900 }}>
            <Button variant="ghost" onclick={() => window.history.back()}>
              return to last known position
            </Button>
          </div>
        </div>
      </FloatCard>
    </DepthLayer>
  </DepthStage>
</div>

<style>
  .signal-lost {
    position: relative;
    min-height: 100dvh;
    background-color: var(--bg);
    display: flex;
    align-items: center;
    justify-content: center;
    overflow: hidden;
  }

  .signal-lost-bg {
    position: absolute;
    inset: 0;
    opacity: 0.5;
    pointer-events: none;
  }

  .signal-lost-ring {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    opacity: 0.3;
    pointer-events: none;
  }

  :global(.signal-lost-stage) {
    position: relative;
    z-index: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 2rem;
    padding: var(--space-scene);
    width: 100%;
    max-width: 52rem;
  }

  :global(.signal-lost-center) {
    width: 100%;
    display: flex;
    justify-content: center;
  }

  :global(.signal-lost-card) {
    max-width: 36rem;
    width: 100%;
  }

  .signal-lost-content {
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
    padding: 1rem;
  }

  .signal-lost-status {
    display: flex;
    align-items: center;
    gap: 0.625rem;
  }

  .signal-lost-meta {
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }

  .signal-lost-action {
    margin-top: 0.5rem;
  }

  :global(.signal-lost-terminal) {
    width: 100%;
    max-width: 36rem;
    align-self: center;
  }

  .signal-lost-terminal-inner {
    padding: 1rem 0;
    border-left: 2px solid rgba(121, 166, 163, 0.14);
    padding-left: 1.25rem;
  }
</style>
