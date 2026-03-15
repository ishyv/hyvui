## Display

Components that present data. they display information — they don't control it.

---

## Badge

> a small inline tag for categorization, status labeling, and classification.

### Import

```svelte
<script lang="ts">
  import { Badge } from '$lib';
</script>
```

### Props

| prop | type | default | required | description |
|---|---|---|---|---|
| `variant` | `'default' \| 'accent' \| 'signal' \| 'ok' \| 'warn' \| 'fail'` | `'default'` | no | color and semantic meaning |
| `class` | `string` | `''` | no | additional CSS classes |

### Slots

| slot | description |
|---|---|
| `default` | badge label text |

### Variants

**default**
Muted background, `--muted` text. use for neutral categories, tags, and identifiers with no particular urgency.

**accent**
Subtle gold background, `--accent` text. use for selected, featured, or highlighted categories.

**signal**
Subtle teal background, `--signal` text. use for active, connected, or live categories.

**ok**
`--status-ok` tinted background. use for confirmed, verified, or healthy status tags.

**warn**
`--status-warn` tinted background. use for pending, partial, or attention-required status tags.

**fail**
`--status-fail` tinted background. use for failed, rejected, or critical status tags.

### Do Not Use When

- you need a pulsing status indicator — use `StatusDot`
- you need a full status message — use `StatusLine` or `Alert`
- the "badge" is a large interactive filter — use `Button` or `Tabs`

### Examples

```svelte
<!-- neutral tag -->
<Badge>field-notebook</Badge>

<!-- status tags -->
<Badge variant="ok">verified</Badge>
<Badge variant="warn">pending</Badge>
<Badge variant="fail">rejected</Badge>

<!-- inline with text -->
<Stack direction="horizontal" align="center" gap="var(--space-xs)">
  <Text as="h3" variant="heading">mission report</Text>
  <Badge variant="accent">priority</Badge>
</Stack>
```

---

## Avatar

> displays a user or entity image. falls back to initials when no image is provided.

### Import

```svelte
<script lang="ts">
  import { Avatar } from '$lib';
</script>
```

### Props

| prop | type | default | required | description |
|---|---|---|---|---|
| `src` | `string` | `undefined` | no | image URL; if omitted or fails to load, initials are shown |
| `name` | `string` | `''` | no | used to generate initials when `src` is absent (first letter of each word, max 2) |
| `size` | `number` | `32` | no | avatar diameter in pixels |
| `class` | `string` | `''` | no | additional CSS classes |

### Accessibility

`alt` text is set to `name` when `src` is provided. initials-only avatars have `aria-label` set to `name`.

### Examples

```svelte
<!-- image avatar -->
<Avatar src="/avatars/agent-7.jpg" name="Agent Seven" size={40} />

<!-- initials fallback -->
<Avatar name="Field Operative" size={36} />

<!-- small avatar in a list item -->
<Stack direction="horizontal" align="center" gap="var(--space-sm)">
  <Avatar name={entry.author} size={24} />
  <Text variant="caption" color="muted">{entry.author}</Text>
</Stack>
```

---

## Table

> a data table with typed columns, row data, and an empty state slot. auto-renders `EmptyState` when rows are empty.

### Import

```svelte
<script lang="ts">
  import { Table } from '$lib';
</script>
```

### Props

| prop | type | default | required | description |
|---|---|---|---|---|
| `columns` | `{ key: string; label: string; align?: 'left' \| 'center' \| 'right' }[]` | `[]` | yes | column definitions |
| `rows` | `Record<string, any>[]` | `[]` | yes | row data; each object's keys must match column `key` values |
| `class` | `string` | `''` | no | additional CSS classes |

### Slots

| slot | description |
|---|---|
| `empty` | overrides the automatic `EmptyState` shown when `rows` is empty |

### Column Definition

```ts
interface Column {
  key: string;       // matches the property name in each row object
  label: string;     // header text
  align?: 'left' | 'center' | 'right';  // defaults to 'left'
}
```

### Row Data Typing

each row must be a plain object with keys matching the `key` values defined in `columns`. extra keys are ignored. missing keys render an empty cell.

```ts
const columns = [
  { key: 'callsign', label: 'callsign' },
  { key: 'sector', label: 'sector', align: 'center' as const },
  { key: 'status', label: 'status', align: 'right' as const },
];

const rows = [
  { callsign: 'echo-7', sector: 'north', status: 'active' },
  { callsign: 'foxtrot-2', sector: 'transit', status: 'standby' },
];
```

### Empty and Error States

when `rows` is empty, `Table` auto-renders `EmptyState` with a default message. override with the `empty` slot:

```svelte
<Table {columns} rows={[]}>
  {#snippet empty()}
    <EmptyState title="no transmissions logged" description="the channel is clear." />
  {/snippet}
</Table>
```

for error states (failed fetch), render `ErrorState` in place of the Table entirely:

```svelte
{#if error}
  <ErrorState title="the signal interrupted" retry onretry={reload} />
{:else}
  <Table {columns} {rows} />
{/if}
```

### Accessibility

Renders as a `<table>` with `<thead>` and `<tbody>`. column headers use `<th scope="col">`. keyboard navigation follows native table behavior.

### Do Not Use When

- you need a simple list — use `Stack` with `Card` or `Text` children
- you need sortable/filterable columns — extend Table with custom header slots or use a dedicated data grid library

### Examples

```svelte
<script lang="ts">
  const columns = [
    { key: 'callsign', label: 'callsign' },
    { key: 'sector', label: 'sector', align: 'center' as const },
    { key: 'last_seen', label: 'last contact', align: 'right' as const },
  ];

  let rows = $state([
    { callsign: 'echo-7', sector: 'north', last_seen: '14:23 UTC' },
    { callsign: 'foxtrot-2', sector: 'transit', last_seen: '09:11 UTC' },
  ]);
</script>

<Table {columns} {rows} />

<!-- with custom empty state -->
<Table {columns} rows={[]}>
  {#snippet empty()}
    <EmptyState title="no agents in this sector">
      <Button variant="secondary" size="sm">deploy first agent</Button>
    </EmptyState>
  {/snippet}
</Table>
```

---

## CodeBlock

> syntax-highlighted code display with optional copy-to-clipboard button.

### Import

```svelte
<script lang="ts">
  import { CodeBlock } from '$lib';
</script>
```

### Props

| prop | type | default | required | description |
|---|---|---|---|---|
| `code` | `string` | — | yes | the code string to display |
| `language` | `string` | `'text'` | no | language identifier for syntax highlighting |
| `copyable` | `boolean` | `true` | no | shows a copy button in the top-right corner |
| `class` | `string` | `''` | no | additional CSS classes |

### Examples

```svelte
<!-- TypeScript example -->
<CodeBlock
  language="ts"
  code={`import { Button } from '$lib';\n\nconsole.log('signal acquired');`}
/>

<!-- no copy button -->
<CodeBlock language="css" code="--accent: #c79c57;" copyable={false} />
```

---

## MetricCard

> a single-value display with label, trend indicator, and optional trend delta.

### Import

```svelte
<script lang="ts">
  import { MetricCard } from '$lib';
</script>
```

### Props

| prop | type | default | required | description |
|---|---|---|---|---|
| `label` | `string` | — | yes | metric name |
| `value` | `string` | — | yes | primary value to display |
| `trend` | `'up' \| 'down' \| 'neutral'` | `'neutral'` | no | trend direction |
| `trendValue` | `string` | `undefined` | no | trend delta label (e.g. `'+12%'`, `'-3'`) |
| `class` | `string` | `''` | no | additional CSS classes |

### Trend Variants

**up**
Up arrow glyph in `--status-ok`. use when the metric is increasing in a positive direction.

**down**
Down arrow glyph in `--status-fail`. use when the metric is decreasing in a negative direction.

**neutral**
Dash glyph in `--muted`. use when there is no significant trend or the direction is ambiguous.

### Note on Trend Semantics

trend direction is visual only — up is not always good, down is not always bad. for metrics where lower is better (e.g. error rate, latency), reverse your usage: use `'down'` with `--status-ok` styling manually if needed. the built-in trend colors assume higher = better.

### Examples

```svelte
<Grid cols={3} gap="var(--space-md)">
  <MetricCard label="active signals" value="142" trend="up" trendValue="+12" />
  <MetricCard label="failed contacts" value="3" trend="down" trendValue="-1" />
  <MetricCard label="coverage" value="94%" trend="neutral" />
</Grid>
```

---

## Blockquote

> a styled quotation block for testimonials, pull quotes, and highlighted excerpts.

### Import

```svelte
<script lang="ts">
  import { Blockquote } from '$lib';
</script>
```

### Props

| prop | type | default | required | description |
|---|---|---|---|---|
| `class` | `string` | `''` | no | additional CSS classes |

### Slots

| slot | description |
|---|---|
| `default` | the quoted content |

### Examples

```svelte
<!-- pull quote -->
<Blockquote>
  <Text variant="italic">
    the signal persists. coordinates shift, but the pattern holds.
  </Text>
</Blockquote>

<!-- with attribution -->
<Blockquote>
  <Text variant="italic">nothing is lost. only relocated.</Text>
  <Text variant="caption" color="muted">— field log, entry 7</Text>
</Blockquote>
```

---

→ next: [docs/api/ambient.md](ambient.md) — ambient and decorative component API reference
