<script lang="ts">
  import {
    Button,
    Card,
    CornerBrackets,
    GlyphMark,
    GridOverlay,
    Label,
    PageHeader,
    ScanBand,
    StatusDot,
    Text,
    Vignette,
    surface,
  } from '$lib/index.js';

  const systemPages = [
    {
      href: '/drifting',
      code: '429',
      name: 'drifting',
      description: 'the signal needs rest. rate-limited, waiting to clear.',
      status: 'fail' as const,
      httpLabel: 'too many requests',
    },
    {
      href: '/cooling',
      code: '503',
      name: 'cooling',
      description: 'the system is cooling down. temporary overload.',
      status: 'warn' as const,
      httpLabel: 'service unavailable',
    },
    {
      href: '/forbidden',
      code: '403',
      name: 'forbidden',
      description: 'access denied. this route is off-limits.',
      status: 'fail' as const,
      httpLabel: 'forbidden',
    },
    {
      href: '/gateway',
      code: '502',
      name: 'gateway',
      description: 'upstream didn\'t respond. bad gateway.',
      status: 'fail' as const,
      httpLabel: 'bad gateway',
    },
    {
      href: '/interrupted',
      code: '500',
      name: 'interrupted',
      description: 'something broke mid-thought. internal error.',
      status: 'fail' as const,
      httpLabel: 'internal server error',
    },
    {
      href: '/lost',
      code: '404',
      name: 'lost',
      description: 'route not found. nothing here to see.',
      status: 'warn' as const,
      httpLabel: 'not found',
    },
    {
      href: '/maintenance',
      code: '503',
      name: 'maintenance',
      description: 'scheduled downtime. the system is being tended to.',
      status: 'pend' as const,
      httpLabel: 'maintenance',
    },
    {
      href: '/offline',
      code: '—',
      name: 'offline',
      description: 'no connection. the link to the outside is gone.',
      status: 'fail' as const,
      httpLabel: 'offline',
    },
    {
      href: '/pending',
      code: '202',
      name: 'pending',
      description: 'accepted but not finished. still working.',
      status: 'pend' as const,
      httpLabel: 'accepted',
    },
    {
      href: '/redirecting',
      code: '301',
      name: 'redirecting',
      description: 'moved. following the new path.',
      status: 'ok' as const,
      httpLabel: 'moved permanently',
    },
    {
      href: '/unauthorized',
      code: '401',
      name: 'unauthorized',
      description: 'identity not confirmed. prove you belong.',
      status: 'warn' as const,
      httpLabel: 'unauthorized',
    },
  ];
</script>

<svelte:head>
  <title>system pages · hyvui</title>
</svelte:head>

<div class="sp-nexus">
  <div class="sp-ambient" aria-hidden="true">
    <ScanBand axis="x" size="18%" duration="8s" />
    <GridOverlay class="sp-grid" />
    <Vignette class="sp-vignette" />
  </div>

  <div class="sp-shell">
    <section class="sp-hero" use:surface={{ delay: 0 }}>
      <CornerBrackets size={22} color="color-mix(in srgb, var(--signal) 22%, transparent)" />

      <div class="sp-mark">
        <GlyphMark variant="reticle" size={18} color="var(--signal)" />
        <Label color="signal">system register</Label>
      </div>

      <PageHeader
        title="system pages"
        subtitle="every error, status, and edge condition — rendered with intent."
      >
        {#snippet breadcrumb()}
          <div class="sp-kicker">
            <Label color="accent">system / index</Label>
          </div>
        {/snippet}

        {#snippet actions()}
          <Button variant="secondary" href="/docs">[ docs ]</Button>
          <Button variant="ghost" href="/">[ home ]</Button>
        {/snippet}
      </PageHeader>

      <div class="sp-intro">
        <Text variant="italic" color="muted">
          these aren't placeholders. each page carries the same canvas environment, terminal sequence, and design posture as any first-class view.
        </Text>
      </div>
    </section>

    <div class="sp-entries" aria-label="system pages">
      {#each systemPages as page, i}
        <a href={page.href} class="sp-entry" use:surface={{ delay: 120 + i * 60 }}>
          <Card class="sp-card">
            {#snippet header()}
              <div class="sp-entry-top">
                <div class="sp-entry-meta">
                  <span class="sp-entry-code">{page.code}</span>
                  <StatusDot status={page.status} size={6} />
                  <Label color="muted">{page.httpLabel}</Label>
                </div>
              </div>
            {/snippet}

            <Text variant="heading" as="h2" class="sp-entry-title">{page.name}</Text>
            <Text variant="body" color="soft" class="sp-entry-desc">{page.description}</Text>

            {#snippet footer()}
              <div class="sp-entry-cue">
                <GlyphMark variant="coord" size={12} color="var(--muted-strong)" />
                <Label color="accent">preview</Label>
              </div>
            {/snippet}
          </Card>
        </a>
      {/each}
    </div>
  </div>
</div>

<style>
  .sp-nexus {
    position: relative;
    min-height: 100dvh;
    overflow: hidden;
  }

  .sp-ambient {
    position: absolute;
    inset: 0;
    pointer-events: none;
  }

  :global(.sp-grid) {
    opacity: 0.32;
  }

  :global(.sp-vignette) {
    background:
      radial-gradient(ellipse at top, rgba(121, 166, 163, 0.08), transparent 36%),
      radial-gradient(ellipse at 50% 100%, transparent 56%, rgba(0, 0, 0, 0.52));
  }

  .sp-shell {
    position: relative;
    z-index: 1;
    max-width: var(--shell-max);
    margin: 0 auto;
    padding: var(--space-3xl) var(--shell-pad) var(--space-3xl);
    display: flex;
    flex-direction: column;
    gap: var(--space-2xl);
  }

  .sp-hero {
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

  .sp-mark {
    display: inline-flex;
    align-items: center;
    gap: var(--space-sm);
    margin-bottom: var(--space-lg);
  }

  .sp-kicker {
    display: flex;
    align-items: center;
    gap: var(--space-xs);
  }

  .sp-intro {
    margin-top: var(--space-lg);
    max-width: 42rem;
  }

  .sp-entries {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(min(100%, 300px), 1fr));
    gap: var(--space-md);
  }

  .sp-entry {
    text-decoration: none;
    color: inherit;
  }

  :global(.sp-card) {
    height: 100%;
    transition:
      transform var(--transition-smooth),
      border-color var(--transition-smooth),
      box-shadow var(--transition-smooth);
  }

  .sp-entry:hover :global(.sp-card) {
    transform: translateY(-2px);
  }

  .sp-entry-top {
    display: flex;
    flex-wrap: wrap;
    gap: var(--space-sm);
    align-items: center;
    justify-content: space-between;
  }

  .sp-entry-meta {
    display: flex;
    flex-wrap: wrap;
    gap: var(--space-sm);
    align-items: center;
  }

  .sp-entry-code {
    font-family: var(--font-mono);
    font-size: 0.72rem;
    letter-spacing: 0.16em;
    text-transform: uppercase;
    color: var(--muted-strong);
  }

  :global(.sp-entry-title) {
    font-size: clamp(1.35rem, 3vw, 1.8rem);
  }

  :global(.sp-entry-desc) {
    max-width: 100%;
  }

  .sp-entry-cue {
    display: inline-flex;
    align-items: center;
    gap: var(--space-xs);
  }

  @media (max-width: 600px) {
    .sp-shell {
      padding-block: var(--space-2xl);
    }
  }
</style>
