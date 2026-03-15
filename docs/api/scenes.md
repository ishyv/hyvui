## Scenes

Full-page layout templates. scenes are opinionated compositions of layout zones — they define the structure, you fill in the content. one scene per page is the expected pattern.

---

## NarrativeScene

> asymmetric editorial layout for articles, case studies, and long-form content. heading-heavy left zone, body copy right zone, canvas for ambient decoration.

### Import

```svelte
<script lang="ts">
  import { NarrativeScene } from '$lib';
</script>
```

### Props

| prop | type | default | required | description |
|---|---|---|---|---|
| `chapter` | `string` | `undefined` | no | chapter or section identifier — rendered as a small monospace label above the heading |
| `class` | `string` | `''` | no | additional CSS classes |

### Slots

| slot | description |
|---|---|
| `heading` | the primary heading of the narrative |
| `copy` | the body content — paragraphs, pull quotes, etc. |
| `canvas` | ambient decorative layer — behind the text content |

### Examples

```svelte
<NarrativeScene chapter="entry 003">
  {#snippet canvas()}
    <GridOverlay />
    <Vignette />
  {/snippet}

  {#snippet heading()}
    <Text as="h1" variant="heading" expression="title-card">
      signal decay model
    </Text>
  {/snippet}

  {#snippet copy()}
    <Text variant="body">
      the pattern held through three rotations. coordinates shifted by a predictable
      margin each cycle — enough to map the deviation curve.
    </Text>
    <Blockquote>
      <Text variant="italic">
        nothing is lost. only relocated.
      </Text>
    </Blockquote>
    <Text variant="body">
      recalibration at 14:23 brought the signal back into range.
    </Text>
  {/snippet}
</NarrativeScene>
```

---

## ReadoutScene

> dense data-forward dashboard layout. fixed title area at the top, main content grid, and an optional sidebar column for secondary data.

### Import

```svelte
<script lang="ts">
  import { ReadoutScene } from '$lib';
</script>
```

### Props

| prop | type | default | required | description |
|---|---|---|---|---|
| `title` | `string` | `undefined` | no | dashboard title displayed in the header bar |
| `class` | `string` | `''` | no | additional CSS classes |

### Slots

| slot | description |
|---|---|
| `header` | content in the top header bar beside the title |
| `default` | main content area — typically a `Grid` of cards or metrics |
| `sidebar` | optional right-column sidebar for secondary data |

### Examples

```svelte
<ReadoutScene title="mission control">
  {#snippet header()}
    <Stack direction="horizontal" align="center" gap="var(--space-sm)">
      <StatusDot status="ok" />
      <Label>all systems nominal</Label>
    </Stack>
  {/snippet}

  <!-- main content -->
  <Grid cols={3} gap="var(--space-md)">
    <MetricCard label="active signals" value="142" trend="up" trendValue="+12" />
    <MetricCard label="coverage" value="94%" trend="neutral" />
    <MetricCard label="failed contacts" value="3" trend="down" trendValue="-1" />
  </Grid>

  <Table columns={logColumns} rows={logRows} />

  {#snippet sidebar()}
    <Panel>
      {#snippet header()}
        <Text as="h3" variant="heading">system log</Text>
      {/snippet}
      <StatusLine status="ok" message="token layer initialized" />
      <StatusLine status="ok" message="register mounted" />
      <StatusLine status="pend" message="awaiting heartbeat" cursor />
    </Panel>
  {/snippet}
</ReadoutScene>
```

---

## StageScene

> centered theatrical layout. used for hero sections, landing pages, and moments that command full attention. five content zones organize a dramatic composition.

### Import

```svelte
<script lang="ts">
  import { StageScene } from '$lib';
</script>
```

### Props

| prop | type | default | required | description |
|---|---|---|---|---|
| `class` | `string` | `''` | no | additional CSS classes |

### Slots

| slot | description |
|---|---|
| `label` | small monospace label above the heading — section identifier or eyebrow |
| `heading` | the primary heading — use expression for large editorial type |
| `subheading` | supporting text below the heading |
| `actions` | CTA buttons or links below the subheading |
| `ambient` | decorative layer behind all content |

### Examples

```svelte
<StageScene>
  {#snippet ambient()}
    <GridOverlay />
    <Vignette />
    <CornerBrackets size={48} />
  {/snippet}

  {#snippet label()}
    <Label color="accent">field station — vol. 3</Label>
  {/snippet}

  {#snippet heading()}
    <Text as="h1" variant="heading" expression="title-card">
      signal acquired
    </Text>
  {/snippet}

  {#snippet subheading()}
    <Text variant="body" color="soft">
      coordinates locked. the mission continues.
    </Text>
  {/snippet}

  {#snippet actions()}
    <Stack direction="horizontal" gap="var(--space-sm)">
      <Button variant="primary">enter</Button>
      <Button variant="ghost">archive</Button>
    </Stack>
  {/snippet}
</StageScene>
```

---

## ArchiveScene

> uniform grid gallery for displaying collections — images, records, case studies, project entries. optional filter zone above the grid.

### Import

```svelte
<script lang="ts">
  import { ArchiveScene } from '$lib';
</script>
```

### Props

| prop | type | default | required | description |
|---|---|---|---|---|
| `title` | `string` | `undefined` | no | archive section title |
| `cols` | `number` | `3` | no | number of grid columns |
| `class` | `string` | `''` | no | additional CSS classes |

### Slots

| slot | description |
|---|---|
| `filter` | filter controls above the grid — search bar, tabs, dropdowns |
| `default` | grid items — `Card`, `FloatCard`, custom tiles |

### Examples

```svelte
<script lang="ts">
  let activeFilter = $state('all');
</script>

<ArchiveScene title="signal archive" cols={3}>
  {#snippet filter()}
    <Stack direction="horizontal" gap="var(--space-xs)" align="center">
      <Tabs
        tabs={[
          { id: 'all', label: 'all' },
          { id: 'active', label: 'active' },
          { id: 'archived', label: 'archived' },
        ]}
        active={activeFilter}
        onchange={(id) => (activeFilter = id)}
      />
      <SearchBar placeholder="search entries" />
    </Stack>
  {/snippet}

  {#each filteredEntries as entry}
    <FloatCard>
      <Card>
        <Label color="muted">{entry.date}</Label>
        <Text as="h3" variant="heading">{entry.title}</Text>
        <Text variant="body" color="soft">{entry.excerpt}</Text>
      </Card>
    </FloatCard>
  {/each}
</ArchiveScene>
```

---

## LogScene

> full-width terminal layout for logs, changelogs, event streams, and sequential records. header and footer zones bracket a scrollable main area.

### Import

```svelte
<script lang="ts">
  import { LogScene } from '$lib';
</script>
```

### Props

| prop | type | default | required | description |
|---|---|---|---|---|
| `class` | `string` | `''` | no | additional CSS classes |

### Slots

| slot | description |
|---|---|
| `header` | top bar — title, status, controls |
| `default` | main scrollable log content — `StatusLine` entries, `Table`, text blocks |
| `footer` | bottom bar — pagination, summary, live status |

### Examples

```svelte
<LogScene>
  {#snippet header()}
    <Stack direction="horizontal" align="center" justify="space-between">
      <Stack direction="horizontal" align="center" gap="var(--space-sm)">
        <StatusDot status="ok" />
        <Text as="h2" variant="heading">transmission log</Text>
      </Stack>
      <Label color="muted">72 entries</Label>
    </Stack>
  {/snippet}

  <!-- log entries -->
  {#each entries as entry}
    <StatusLine status={entry.status} message={entry.message} tone="line" />
  {/each}

  {#snippet footer()}
    <Stack direction="horizontal" align="center" justify="space-between">
      <Label color="muted">last updated 2 minutes ago</Label>
      <Button variant="ghost" size="sm">load more</Button>
    </Stack>
  {/snippet}
</LogScene>
```

---

→ next: [docs/registers.md](../registers.md) — register system reference
