<!--
  EXAMPLE: Field Report
  REGISTER: field-notebook
  CONCEPT: a case study page that reads like a recovered classified document
  DEMONSTRATES: NarrativeScene, FloatCard, Plinth, MetricCard, Table, Blockquote, CodeBlock, Badge, Text expressions, DepthStage, DepthLayer, GlyphMark, surface action
  INSPIRED BY: a handwritten field notebook digitized and presented across a table
-->
<script lang="ts">
  import {
    Text,
    Label,
    Badge,
    Divider,
    Stack,
    Grid,
    MetricCard,
    Table,
    Blockquote,
    CodeBlock,
    NarrativeScene,
    FloatCard,
    Plinth,
    DepthStage,
    DepthLayer,
    GlyphMark,
    CornerBrackets,
    surface,
    applyRegister,
  } from '../index.js';
  import { onMount } from 'svelte';

  const metrics = [
    { label: 'first paint', value: '0.8s', trend: 'down' as const, trendValue: '-34%' },
    { label: 'bundle weight', value: '12kb', trend: 'down' as const, trendValue: '-61%' },
    { label: 'field duration', value: '9 weeks', trend: 'neutral' as const, trendValue: '' },
  ];

  const phases = [
    { phase: '01', designation: 'survey', date: '2025.09.12', status: 'complete' },
    { phase: '02', designation: 'excavation', date: '2025.09.28', status: 'complete' },
    { phase: '03', designation: 'assembly', date: '2025.10.14', status: 'complete' },
    { phase: '04', designation: 'calibration', date: '2025.10.30', status: 'complete' },
    { phase: '05', designation: 'field test', date: '2025.11.08', status: 'complete' },
    { phase: '06', designation: 'deployment', date: '2025.11.15', status: 'active' },
  ];

  const phaseColumns = [
    { key: 'phase', label: 'phase' },
    { key: 'designation', label: 'designation' },
    { key: 'date', label: 'date' },
    { key: 'status', label: 'status' },
  ];

  const codeSnippet = `const signal = await listen({
  frequency: 47.2,
  threshold: 0.003,
  timeout: Infinity,
});

if (signal.strength > baseline) {
  log('contact', signal.origin);
}`;

  const technologies = ['svelte', 'typescript', 'css custom properties', 'canvas 2d', 'webgl'];

  onMount(() => {
    applyRegister('field-notebook');
    return () => {
      document.body.removeAttribute('data-register');
    };
  });
</script>

<NarrativeScene chapter="field report 03 — signal architecture">
  {#snippet heading()}
    <DepthStage perspective="far">
      <DepthLayer level="foreground">
        <Text variant="heading" expression="title-card" as="h1" color="primary">
          building the listening station
        </Text>
      </DepthLayer>
    </DepthStage>
  {/snippet}

  {#snippet copy()}
    <div class="field-report-copy">
      <div use:surface={{ delay: 200 }}>
        <Text variant="body">
          the project started as a question. not the kind you find in a brief.
          the kind that stays after the meeting ends. what does it feel like
          when a system is paying attention.
        </Text>
      </div>

      <div use:surface={{ delay: 350 }}>
        <Text variant="body">
          we built the component library first. not because it was the most
          important part, but because naming things forces clarity. every
          token, every variant, every slot had to earn its name.
        </Text>
      </div>

      <div use:surface={{ delay: 500 }}>
        <Blockquote>
          the real constraint was not technical. it was tonal. how do you
          build an interface that feels serious without feeling cold. that
          feels precise without feeling sterile.
        </Blockquote>
      </div>

      <div class="field-report-metrics" use:surface={{ delay: 650 }}>
        <DepthStage perspective="far">
          <DepthLayer level="raised">
            <Grid cols={3} gap="0.75rem">
              {#each metrics as m}
                <FloatCard tiltMax={5}>
                  <div class="field-report-metric-inner">
                    <Label color="muted">{m.label}</Label>
                    <Text variant="heading" as="span" color="primary">{m.value}</Text>
                    {#if m.trendValue}
                      <Text variant="caption" as="span" color={m.trend === 'down' ? 'signal' : 'muted'}>
                        {m.trend === 'down' ? '\u2193' : '\u2014'} {m.trendValue}
                      </Text>
                    {/if}
                  </div>
                </FloatCard>
              {/each}
            </Grid>
          </DepthLayer>
        </DepthStage>
        <Plinth width="90%" depth="24px" />
      </div>

      <div use:surface={{ delay: 800 }}>
        <Text expression="chapter" as="span">mission log</Text>
      </div>

      <div use:surface={{ delay: 900 }}>
        <Table columns={phaseColumns} rows={phases} />
      </div>

      <div use:surface={{ delay: 1000 }}>
        <Text expression="chapter" as="span">from the field notebook</Text>
      </div>

      <div use:surface={{ delay: 1100 }}>
        <CodeBlock code={codeSnippet} />
      </div>

      <div class="field-report-tags" use:surface={{ delay: 1200 }}>
        {#each technologies as tech}
          <Badge variant="default">{tech}</Badge>
        {/each}
      </div>
    </div>
  {/snippet}

  {#snippet canvas()}
    <div class="field-report-canvas" use:surface={{ delay: 400 }}>
      <div class="field-report-canvas-inner" style:position="relative">
        <CornerBrackets size={40} color="rgba(199, 156, 87, 0.12)" />
        <div class="field-report-canvas-marks">
          <GlyphMark variant="reticle" size={48} color="var(--muted-strong)" />
          <div class="field-report-canvas-label">
            <Label color="muted">artifact scan</Label>
            <Label color="accent">47.2 mhz</Label>
          </div>
        </div>
      </div>
    </div>
  {/snippet}
</NarrativeScene>

<style>
  .field-report-copy {
    display: flex;
    flex-direction: column;
    gap: 1.75rem;
  }

  .field-report-metrics {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }

  .field-report-metric-inner {
    display: flex;
    flex-direction: column;
    gap: 0.25rem;
  }

  .field-report-tags {
    display: flex;
    flex-wrap: wrap;
    gap: 0.375rem;
  }

  .field-report-canvas {
    display: flex;
    align-items: center;
    justify-content: center;
    min-height: 50vh;
  }

  .field-report-canvas-inner {
    padding: 3rem;
  }

  .field-report-canvas-marks {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 1.5rem;
  }

  .field-report-canvas-label {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.25rem;
  }
</style>
