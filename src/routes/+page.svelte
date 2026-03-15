<script lang="ts">
  import {
    Button,
    Card,
    CornerBrackets,
    GlyphMark,
    Grid,
    GridOverlay,
    Label,
    PageHeader,
    ScanBand,
    StatusDot,
    Text,
    Vignette,
    surface,
  } from '$lib/index.js';

  const examples = [
    {
      href: '/examples/observation-deck',
      id: '01',
      name: 'observation deck',
      register: 'mission-control',
      description: 'a dense monitoring dashboard. layered readouts, depth grid, live operator posture.',
      status: 'ok' as const,
      tag: 'dashboard',
    },
    {
      href: '/examples/field-report',
      id: '02',
      name: 'field report',
      register: 'field-notebook',
      description: 'editorial work in the field-notebook register. warm, serif-forward, reads like a found document.',
      status: 'ok' as const,
      tag: 'editorial',
    },
    {
      href: '/examples/signal-lost',
      id: '03',
      name: 'signal lost',
      register: 'field-notebook',
      description: 'a failure page that tells a story. terminal boot sequence, ambient noise, calm about being broken.',
      status: 'warn' as const,
      tag: 'error state',
    },
  ];

  const principles = [
    'spacing is compositional, not decorative',
    'surfaces stay quiet until interaction earns emphasis',
    'gold and teal appear sparingly and on purpose',
  ];
</script>

<svelte:head>
  <title>hyvui</title>
</svelte:head>

<div class="nexus">
  <div class="nexus-ambient" aria-hidden="true">
    <ScanBand axis="x" size="18%" duration="7s" />
    <GridOverlay class="nexus-grid" />
    <Vignette class="nexus-vignette" />
  </div>

  <div class="nexus-shell">
    <section class="nexus-hero" use:surface={{ delay: 0 }}>
      <CornerBrackets size={22} color="color-mix(in srgb, var(--accent) 22%, transparent)" />

      <div class="nexus-mark">
        <GlyphMark variant="reticle" size={18} color="var(--signal)" />
        <Label color="signal">system register</Label>
      </div>

      <PageHeader
        title="hyvui"
        subtitle="a svelte 5 component library. dark aesthetic, intentional layout, no startup gloss."
      >
        {#snippet breadcrumb()}
          <div class="nexus-kicker">
            <Label color="accent">field index / phase 4</Label>
          </div>
        {/snippet}

        {#snippet actions()}
          <Button variant="secondary" href="/docs">[ docs ]</Button>
          <Button variant="secondary" href="/system">[ system pages ]</Button>
          <Button variant="ghost" href="https://github.com/edwardtufte/et-book">[ font source ]</Button>
        {/snippet}
      </PageHeader>

      <div class="nexus-intro">
        <Text variant="italic" color="muted">
          quiet confidence. technical depth. no ornamental sludge. every detail should look placed, not merely present.
        </Text>
      </div>

      <div class="nexus-status-row">
        <div class="nexus-status">
          <StatusDot status="ok" size={7} />
          <Label>library surface stabilized</Label>
        </div>
        <div class="nexus-status">
          <StatusDot status="pend" size={7} />
          <Label>examples calibrated</Label>
        </div>
      </div>
    </section>

    <Grid cols="minmax(0, 1.7fr) minmax(17rem, 0.9fr)" gap="var(--space-xl)" class="nexus-main">
      <section class="nexus-list-block" use:surface={{ delay: 120 }}>
        <div class="nexus-section-head">
          <Label color="muted">example index</Label>
          <Text variant="body" color="muted">three scenes. each one uses the system differently.</Text>
        </div>

        <div class="nexus-list" aria-label="examples">
          {#each examples as ex, i}
            <a href={ex.href} class="nexus-entry" use:surface={{ delay: 220 + i * 100 }}>
              <Card class="nexus-card">
                {#snippet header()}
                  <div class="nexus-entry-top">
                    <div class="nexus-entry-meta">
                      <span class="nexus-entry-id">{ex.id}</span>
                      <StatusDot status={ex.status} size={6} />
                      <Label color="muted">{ex.tag}</Label>
                    </div>
                    <Label color="muted">{ex.register}</Label>
                  </div>
                {/snippet}

                <Text variant="heading" as="h2" class="nexus-entry-title">{ex.name}</Text>
                <Text variant="body" color="soft" class="nexus-entry-desc">{ex.description}</Text>

                {#snippet footer()}
                  <div class="nexus-entry-cue">
                    <GlyphMark variant="coord" size={12} color="var(--muted-strong)" />
                    <Label color="accent">enter</Label>
                  </div>
                {/snippet}
              </Card>
            </a>
          {/each}
        </div>
      </section>

      <section class="nexus-rail" use:surface={{ delay: 200 }}>
        <Card class="nexus-rail-card">
          {#snippet header()}
            <Label color="accent">design posture</Label>
          {/snippet}

          <div class="nexus-principles">
            {#each principles as principle}
              <div class="nexus-principle">
                <StatusDot status="ok" size={5} pulse={false} />
                <Text variant="body" color="soft">{principle}</Text>
              </div>
            {/each}
          </div>

          {#snippet footer()}
            <div class="nexus-footer">
              <Label color="muted">{examples.length} examples</Label>
              <span class="nexus-footer-sep" aria-hidden="true">·</span>
              <Label color="muted">svelte 5 · operator-adjacent</Label>
            </div>
          {/snippet}
        </Card>
      </section>
    </Grid>
  </div>
</div>

<style>
  .nexus {
    position: relative;
    min-height: 100dvh;
    overflow: hidden;
  }

  .nexus-ambient {
    position: absolute;
    inset: 0;
    pointer-events: none;
  }

  :global(.nexus-grid) {
    opacity: 0.42;
  }

  :global(.nexus-vignette) {
    background:
      radial-gradient(ellipse at top, rgba(121, 166, 163, 0.08), transparent 36%),
      radial-gradient(ellipse at 50% 100%, transparent 56%, rgba(0, 0, 0, 0.52));
  }

  .nexus-shell {
    position: relative;
    z-index: 1;
    max-width: var(--shell-max);
    margin: 0 auto;
    padding: var(--space-3xl) var(--shell-pad);
    display: flex;
    flex-direction: column;
    gap: var(--space-2xl);
  }

  .nexus-hero {
    position: relative;
    padding: clamp(1.25rem, 2.8vw, 2rem);
    background:
      linear-gradient(180deg, rgba(121, 166, 163, 0.08), transparent 22%),
      linear-gradient(135deg, rgba(199, 156, 87, 0.08), rgba(10, 12, 14, 0.82) 42%),
      rgba(9, 11, 13, 0.74);
    border: 1px solid var(--line);
    box-shadow: var(--shadow-veil);
    backdrop-filter: blur(10px);
  }

  .nexus-mark {
    display: inline-flex;
    align-items: center;
    gap: var(--space-sm);
    margin-bottom: var(--space-lg);
  }

  .nexus-kicker {
    display: flex;
    align-items: center;
    gap: var(--space-xs);
  }

  .nexus-intro {
    margin-top: var(--space-lg);
    max-width: 42rem;
  }

  .nexus-status-row {
    display: flex;
    flex-wrap: wrap;
    gap: var(--space-md);
    margin-top: var(--space-xl);
  }

  .nexus-status {
    display: inline-flex;
    align-items: center;
    gap: var(--space-xs);
    padding: 0.55rem 0.8rem;
    border: 1px solid var(--line);
    background: linear-gradient(90deg, rgba(199, 156, 87, 0.08), transparent 78%);
  }

  :global(.nexus-main) {
    align-items: start;
  }

  .nexus-list-block,
  .nexus-rail {
    min-width: 0;
  }

  .nexus-section-head {
    display: grid;
    gap: var(--space-sm);
    margin-bottom: var(--space-lg);
    max-width: 34rem;
  }

  .nexus-list {
    display: grid;
    gap: var(--space-md);
  }

  .nexus-entry {
    text-decoration: none;
    color: inherit;
  }

  :global(.nexus-card) {
    transition:
      transform var(--transition-smooth),
      border-color var(--transition-smooth),
      box-shadow var(--transition-smooth);
  }

  .nexus-entry:hover :global(.nexus-card) {
    transform: translateY(-2px);
  }

  .nexus-entry-top {
    display: flex;
    flex-wrap: wrap;
    gap: var(--space-sm);
    align-items: center;
    justify-content: space-between;
  }

  .nexus-entry-meta {
    display: flex;
    flex-wrap: wrap;
    gap: var(--space-sm);
    align-items: center;
  }

  .nexus-entry-id {
    font-family: var(--font-mono);
    font-size: 0.72rem;
    letter-spacing: 0.16em;
    text-transform: uppercase;
    color: var(--muted-strong);
  }

  :global(.nexus-entry-title) {
    font-size: clamp(1.45rem, 3vw, 2rem);
  }

  :global(.nexus-entry-desc) {
    max-width: 100%;
  }

  .nexus-entry-cue {
    display: inline-flex;
    align-items: center;
    gap: var(--space-xs);
  }

  :global(.nexus-rail-card) {
    position: sticky;
    top: var(--space-xl);
  }

  .nexus-principles {
    display: grid;
    gap: var(--space-md);
  }

  .nexus-principle {
    display: grid;
    grid-template-columns: auto 1fr;
    gap: var(--space-sm);
    align-items: start;
  }

  .nexus-footer {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: var(--space-xs);
  }

  .nexus-footer-sep {
    color: var(--muted);
    opacity: 0.75;
  }

  @media (max-width: 900px) {
    :global(.nexus-main) {
      grid-template-columns: 1fr !important;
    }

    :global(.nexus-rail-card) {
      position: static;
    }
  }

  @media (max-width: 600px) {
    .nexus-shell {
      padding-block: var(--space-2xl);
    }

    .nexus-status-row {
      flex-direction: column;
      align-items: stretch;
    }
  }
</style>
