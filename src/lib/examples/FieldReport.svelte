<script lang="ts">
  import {
    Badge,
    Blockquote,
    Button,
    CodeBlock,
    CornerBrackets,
    Grid,
    Label,
    MetricCard,
    NarrativeScene,
    PullQuote,
    Surface,
    Text,
    surface,
  } from "../index.js";
  import { onMount } from "svelte";
  import { mountSceneAppearance } from "./appearance.js";

  const measures = [
    {
      label: "image sets",
      value: "48",
      trend: "up" as const,
      trendValue: "+12",
    },
    { label: "draft passes", value: "06", trend: "neutral" as const },
    {
      label: "final spread",
      value: "14p",
      trend: "up" as const,
      trendValue: "ready",
    },
  ];

  const tags = [
    "editorial",
    "case study",
    "typography",
    "motion stills",
    "archive source",
  ];

  const excerpt = `const sequence = compose({
  voice: 'quiet',
  density: 'cinematic',
  evidence: artifacts.filter(Boolean)
});`;

  onMount(() => mountSceneAppearance("field-notebook"));
</script>

<svelte:head>
  <title>field report // hyvui</title>
</svelte:head>

<main class="field">
  <NarrativeScene chapter="field report 02 / recovered spread">
    {#snippet heading()}
      <div class="field-title" use:surface>
        <Label color="accent">editorial case study</Label>
        <h1>field report</h1>
        <Text expression="manifesto">
          a showcase page should feel authored. not assembled. this scene treats
          components like editorial material.
        </Text>
      </div>
    {/snippet}

    {#snippet copy()}
      <div class="field-copy">
        <p>
          the work began as a stack of fragments. contact sheets, failed
          captions, notes from a table nobody cleared. hyvui turns that mess
          into a controlled reading surface.
        </p>

        <Blockquote>
          the system does not need decoration. it needs pressure, rhythm, and
          enough restraint to let the artifact speak first.
        </Blockquote>

        <Grid cols={3} gap="var(--space-sm)" class="field-metrics">
          {#each measures as measure}
            <MetricCard {...measure} />
          {/each}
        </Grid>

        <Surface variant="panel" withInset class="field-evidence">
          <Label color="muted">production notation</Label>
          <CodeBlock code={excerpt} />
        </Surface>

        <div class="field-tags">
          {#each tags as tag}
            <Badge variant="default">{tag}</Badge>
          {/each}
        </div>

        <PullQuote
          quote="the library should be able to carry a finished page without asking the product to hide behind it."
          attribution="showcase rule"
          source="hyvui"
        />

        <div class="field-actions">
          <Button variant="secondary" href="/examples/archive-gallery"
            >open archive gallery</Button
          >
          <Button variant="ghost" href="/">scene index</Button>
        </div>
      </div>
    {/snippet}

    {#snippet canvas()}
      <div class="field-canvas" use:surface={{ delay: 140 }}>
        <Surface variant="card" class="field-artifact">
          <CornerBrackets size={36} color="var(--accent)" />
          <div class="field-artifact-grid">
            <span></span>
            <span></span>
            <span></span>
            <span></span>
          </div>
          <div class="field-artifact-caption">
            <Label color="muted">contact sheet</Label>
            <Text expression="readout">roll 047 / scan clean</Text>
          </div>
        </Surface>
      </div>
    {/snippet}
  </NarrativeScene>
</main>

<style>
  .field {
    min-height: 100dvh;
    background: var(--bg);
  }

  .field-title {
    display: flex;
    flex-direction: column;
    gap: var(--space-md);
  }

  .field-title h1 {
    margin: 0;
    font-family: var(--font-body);
    font-size: var(--text-display);
    font-weight: 400;
    line-height: var(--reg-heading-lh);
    letter-spacing: var(--reg-heading-tracking);
    color: var(--text);
  }

  .field-copy {
    display: flex;
    flex-direction: column;
    gap: var(--space-lg);
  }

  .field-copy p {
    margin: 0;
    color: var(--text-soft);
    font-size: var(--text-md);
    line-height: 1.6;
  }

  :global(.field-metrics) {
    margin-block: var(--space-sm);
  }

  :global(.field-evidence) {
    padding: var(--space-lg);
    display: flex;
    flex-direction: column;
    gap: var(--space-sm);
  }

  .field-tags,
  .field-actions {
    display: flex;
    flex-wrap: wrap;
    gap: var(--space-sm);
  }

  .field-canvas {
    min-height: 56vh;
    display: grid;
    place-items: center;
  }

  :global(.field-artifact) {
    width: min(100%, 30rem);
    padding: var(--space-lg);
    display: flex;
    flex-direction: column;
    gap: var(--space-lg);
  }

  .field-artifact-grid {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: var(--space-sm);
  }

  .field-artifact-grid span {
    aspect-ratio: 4 / 3;
    border: 1px solid var(--line);
    background:
      linear-gradient(
        135deg,
        color-mix(in srgb, var(--accent) 16%, transparent),
        transparent 48%
      ),
      color-mix(in srgb, var(--text) 5%, transparent);
  }

  .field-artifact-caption {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: var(--space-md);
    flex-wrap: wrap;
  }

  @media (max-width: 760px) {
    :global(.field-metrics) {
      grid-template-columns: 1fr;
    }
  }
</style>
