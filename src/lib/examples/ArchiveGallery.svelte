<script lang="ts">
  import {
    ArchiveScene,
    Badge,
    Button,
    CornerBrackets,
    GridOverlay,
    Label,
    SearchBar,
    Surface,
    Text,
    Vignette,
    surface,
  } from "../index.js";
  import { onMount } from "svelte";
  import { mountSceneAppearance } from "./appearance.js";

  const artifacts = [
    {
      id: "a-014",
      title: "silver contact frame",
      type: "image",
      state: "cataloged",
    },
    {
      id: "b-092",
      title: "annotated color pass",
      type: "spread",
      state: "open",
    },
    { id: "c-227", title: "gallery floor note", type: "note", state: "quiet" },
    { id: "d-031", title: "installation shadow", type: "still", state: "held" },
    { id: "e-510", title: "index card set", type: "archive", state: "bound" },
    {
      id: "f-118",
      title: "unused cover study",
      type: "cover",
      state: "review",
    },
  ];

  let query = $state("");

  const visibleArtifacts = $derived(
    artifacts.filter((artifact) => {
      const q = query.trim().toLowerCase();
      if (!q) return true;
      return `${artifact.id} ${artifact.title} ${artifact.type} ${artifact.state}`.includes(
        q,
      );
    }),
  );

  onMount(() => mountSceneAppearance("archive"));
</script>

<svelte:head>
  <title>archive gallery // hyvui</title>
</svelte:head>

<main class="archive">
  <div class="archive-ambient" aria-hidden="true">
    <GridOverlay />
    <Vignette />
  </div>

  <ArchiveScene title="artifact index">
    <div class="archive-toolbar" use:surface>
      <SearchBar bind:value={query} placeholder="search artifacts" />
      <Button variant="ghost" href="/">scene index</Button>
    </div>

    <section class="archive-feature" use:surface={{ delay: 120 }}>
      <Surface variant="panel" withInset class="archive-feature-panel">
        <div class="archive-feature-copy">
          <Label color="accent">artifact index</Label>
          <h1>archive gallery</h1>
          <Text expression="manifesto">
            a gallery does not need to shout. it needs a rhythm that makes
            browsing feel deliberate.
          </Text>
        </div>
        <div class="archive-feature-card">
          <CornerBrackets size={30} color="var(--signal)" />
          <span>047</span>
          <Label color="muted">current object</Label>
        </div>
      </Surface>
    </section>

    <section class="archive-grid" aria-label="artifacts">
      {#each visibleArtifacts as artifact, index}
        <div use:surface={{ delay: index * 60 }}>
          <Surface variant="card" class="archive-card">
            <div class="archive-thumb">
              <span>{artifact.id}</span>
            </div>
            <div class="archive-card-copy">
              <Label color="muted">{artifact.type}</Label>
              <h2>{artifact.title}</h2>
              <Badge variant="default">{artifact.state}</Badge>
            </div>
          </Surface>
        </div>
      {/each}
    </section>
  </ArchiveScene>
</main>

<style>
  .archive {
    position: relative;
    min-height: 100dvh;
    background: var(--bg);
    overflow: hidden;
  }

  .archive-ambient {
    position: fixed;
    inset: 0;
    opacity: 0.22;
    pointer-events: none;
  }

  .archive-toolbar {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: var(--space-sm);
    flex-wrap: wrap;
    margin-bottom: var(--space-lg);
  }

  .archive-feature {
    margin-bottom: var(--space-xl);
  }

  :global(.archive-feature-panel) {
    display: grid;
    grid-template-columns: minmax(0, 1fr) minmax(14rem, 22rem);
    gap: var(--space-lg);
    align-items: stretch;
    padding: var(--space-xl);
  }

  .archive-feature-copy {
    display: flex;
    flex-direction: column;
    gap: var(--space-md);
  }

  .archive-feature-copy h1 {
    margin: 0;
    font-family: var(--font-body);
    font-size: var(--text-display);
    font-weight: 400;
    line-height: var(--reg-heading-lh);
    letter-spacing: var(--reg-heading-tracking);
    color: var(--text);
  }

  .archive-feature-card {
    position: relative;
    min-height: 16rem;
    display: grid;
    place-items: center;
    border: 1px solid var(--line);
    background:
      linear-gradient(
        135deg,
        color-mix(in srgb, var(--signal) 9%, transparent),
        transparent 52%
      ),
      color-mix(in srgb, var(--text) 4%, transparent);
  }

  .archive-feature-card span {
    font-family: var(--font-mono);
    font-size: clamp(var(--text-2xl), 8vw, 6rem);
    color: color-mix(in srgb, var(--text) 78%, transparent);
  }

  .archive-feature-card :global(.hyvui-label) {
    position: absolute;
    bottom: var(--space-md);
    left: var(--space-md);
  }

  .archive-grid {
    display: grid;
    grid-template-columns: repeat(3, minmax(0, 1fr));
    gap: var(--space-md);
  }

  :global(.archive-card) {
    display: flex;
    flex-direction: column;
    gap: var(--space-md);
    padding: var(--space-md);
    min-height: 18rem;
  }

  .archive-thumb {
    display: grid;
    place-items: end start;
    min-height: 10rem;
    padding: var(--space-md);
    border: 1px solid var(--line);
    background:
      linear-gradient(
        180deg,
        transparent,
        color-mix(in srgb, var(--bg) 52%, transparent)
      ),
      color-mix(in srgb, var(--signal) 5%, transparent);
  }

  .archive-thumb span {
    font-family: var(--font-mono);
    color: var(--muted);
  }

  .archive-card-copy {
    display: flex;
    flex-direction: column;
    gap: var(--space-xs);
  }

  .archive-card-copy h2 {
    margin: 0;
    font-size: var(--text-md);
    font-weight: 400;
    line-height: 1.2;
    color: var(--text);
  }

  @media (max-width: 840px) {
    :global(.archive-feature-panel),
    .archive-grid {
      grid-template-columns: 1fr;
    }
  }
</style>
