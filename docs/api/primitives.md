## Primitives

Foundational building blocks. used inside other components and directly in layouts. no complex behavior — they render text, wrap surfaces, and display icons.

---

## Text

> renders semantic HTML text elements with the library's type scale and optional compositional expressions.

### Import

```svelte
<script lang="ts">
  import { Text } from '$lib';
</script>
```

### Props

| prop | type | default | required | description |
|---|---|---|---|---|
| `as` | `string` | `'p'` | no | the HTML element to render (`h1`, `h2`, `h3`, `p`, `span`, `div`, etc.) |
| `variant` | `'heading' \| 'body' \| 'caption' \| 'italic'` | `'body'` | no | base typographic role |
| `color` | `'primary' \| 'soft' \| 'muted' \| 'muted-strong' \| 'accent' \| 'signal'` | `'primary'` | no | text color from the token palette |
| `expression` | `string` | `undefined` | no | compositional expression class (see `docs/expressions.md`) |
| `class` | `string` | `''` | no | additional CSS classes |

### Variants

**heading**
ET Book serif, larger size, `--text` color. line-height tightened. use for section headings, card titles, and named sections of content.

**body**
ET Book serif, reading size (~1.1rem), `--text-soft` color. comfortable line-height for multi-line reading. use for all paragraph content.

**caption**
IBM Plex Mono, small size (~0.75rem), `--muted` color, slightly tracked. use for metadata, timestamps, auxiliary labels below figures.

**italic**
ET Book italic, reading size, `--text-soft` color. use for inline emphasis, quotes embedded in body text, or stylistic italics.

### Accessibility

Renders as the element specified in `as`. always use a semantically correct element — `as="h1"` through `as="h6"` for headings. screen readers use the element type, not the `variant` prop.

### Do Not Use When

- you need a monospace label for UI chrome — use `Label` instead
- you need an icon — use `Icon`
- you're labeling a form field — use the `label` prop on `Input`, `Select`, etc.

### Examples

```svelte
<!-- basic heading -->
<Text as="h2" variant="heading">signal acquired</Text>

<!-- body copy with muted color -->
<Text variant="body" color="muted">
  the connection resolved after three attempts. coordinates locked.
</Text>

<!-- caption beneath a figure -->
<Text as="span" variant="caption" color="muted">fig. 3 — signal decay over time</Text>

<!-- with expression for large editorial heading -->
<Text as="h1" variant="heading" expression="title-card">
  field notes
</Text>
```

---

## Label

> monospace uppercase UI chrome. used for category labels, status tags, system identifiers, and section markers.

### Import

```svelte
<script lang="ts">
  import { Label } from '$lib';
</script>
```

### Props

| prop | type | default | required | description |
|---|---|---|---|---|
| `as` | `string` | `'span'` | no | the HTML element to render |
| `color` | `'muted' \| 'accent' \| 'signal'` | `'muted'` | no | label color |
| `class` | `string` | `''` | no | additional CSS classes |

### Color Variants

**muted**
`--muted` color. IBM Plex Mono, small, uppercase, tracked. the default — use for neutral system labels, category markers, field identifiers.

**accent**
`--accent` gold color. use for highlighted labels, selected categories, active section markers.

**signal**
`--signal` teal color. use for system labels related to status, connectivity, or live state.

### Accessibility

Renders as the element in `as`. for screen readers, labels are read as plain text — the uppercase rendering is CSS only and does not affect the accessible name.

### Do Not Use When

- you need running body text — use `Text`
- you need a status indicator with a visual dot — use `StatusDot` or `StatusLine`
- you need a clickable tag — add a button role or use `Badge`

### Examples

```svelte
<!-- category label -->
<Label>archive</Label>

<!-- accent label for active/selected state -->
<Label color="accent">selected</Label>

<!-- signal label for live state -->
<Label color="signal">connected</Label>

<!-- rendered as a div for block layout -->
<Label as="div" color="muted">field notes — vol. 3</Label>
```

---

## Icon

> sizing and color wrapper for inline SVGs. normalizes SVG dimensions and applies token colors.

### Import

```svelte
<script lang="ts">
  import { Icon } from '$lib';
</script>
```

### Props

| prop | type | default | required | description |
|---|---|---|---|---|
| `size` | `number` | `16` | no | icon width and height in pixels |
| `color` | `string` | `'currentColor'` | no | any CSS color value or custom property |
| `class` | `string` | `''` | no | additional CSS classes |

### Slots

| slot | description |
|---|---|
| `default` | the SVG element content |

### Accessibility

Icon is a presentational wrapper. for meaningful icons, add `aria-label` directly to the SVG or wrap the Icon in a button with a visible or `aria-label`. for decorative icons, `aria-hidden="true"` is applied automatically.

### Do Not Use When

- you have an SVG that needs its own sizing logic — render the SVG directly
- you need a status symbol — use `StatusDot` or `GlyphMark`

### Examples

```svelte
<!-- basic icon at default size -->
<Icon>
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
    <path d="M12 3v18M3 12h18" />
  </svg>
</Icon>

<!-- larger icon with accent color -->
<Icon size={24} color="var(--accent)">
  <svg viewBox="0 0 24 24" fill="currentColor">
    <circle cx="12" cy="12" r="4" />
  </svg>
</Icon>
```

---

## Divider

> horizontal separator line using the token line color palette.

### Import

```svelte
<script lang="ts">
  import { Divider } from '$lib';
</script>
```

### Props

| prop | type | default | required | description |
|---|---|---|---|---|
| `strength` | `'default' \| 'strong'` | `'default'` | no | border opacity — `--line` or `--line-strong` |
| `class` | `string` | `''` | no | additional CSS classes |

### Variants

**default**
`--line` — `rgba(186, 157, 108, 0.16)`. the standard separator. use between sections, below headings, or between list items in dense layouts.

**strong**
`--line-strong` — `rgba(198, 166, 112, 0.28)`. more visible separator. use sparingly — between major sections, or when the surrounding content is very low-contrast.

### Accessibility

Renders as `<hr>` with `role="separator"`. screen readers announce it as a thematic break.

### Do Not Use When

- you need vertical separation — use `Stack` with a gap, or CSS border on a sibling
- you need a decorative line with animation — use `ThreadLine` from the ambient group

### Examples

```svelte
<!-- standard divider between sections -->
<Text as="h2" variant="heading">signal log</Text>
<Divider />
<Text variant="body">entries from the last 30 days.</Text>

<!-- strong divider below a major header -->
<Divider strength="strong" />
```

---

## Surface

> the foundational container. provides background gradients, backdrop blur, and the optional inset border. the building block for Card and Panel.

### Import

```svelte
<script lang="ts">
  import { Surface } from '$lib';
</script>
```

### Props

| prop | type | default | required | description |
|---|---|---|---|---|
| `variant` | `'base' \| 'card' \| 'panel'` | `'base'` | no | background gradient style |
| `as` | `string` | `'div'` | no | the HTML element to render |
| `withInset` | `boolean` | `false` | no | adds an inset teal accent line along the top edge |
| `class` | `string` | `''` | no | additional CSS classes |

### Variants

**base**
`--surface-soft` — a very subtle warm gradient over a near-black background. use for the outermost container of a section or layout region. barely visible on the main canvas.

**card**
`--surface-card` — a gold-tinted gradient over a dark semi-transparent background. use for discrete content units: info cards, feature entries, list items with elevated appearance.

**panel**
`--surface-panel` — a teal-top + gold-corner multi-layer gradient with semi-transparency. the richest surface. use for major layout panels, sidebars, dialog content areas.

### The `withInset` Border

`withInset` adds a 1px teal (`--signal`) line along the top edge using a `::before` pseudoelement positioned absolutely.

**critical requirement:** the parent element must have a stable, non-`auto` height, or `position: relative` must be set on the Surface itself. if the element has `height: auto` with no explicit height context, the pseudoelement may not render correctly. this is the most common misuse of this prop.

use `withInset` for:
- panels that need a distinctive top accent
- cards that are the primary focus of a section
- active or selected states where the teal accent communicates selection

do not use `withInset` for:
- every card in a grid — reserve it for emphasis
- surfaces inside other surfaces — the accent stacks poorly

### Accessibility

Surface renders as the element in `as` with no implicit ARIA role. add `role`, `aria-label`, or landmark elements as needed for your layout structure.

### Do Not Use When

- you need a complete card with header/body/footer slots — use `Card`
- you need a major section container with title — use `Panel`
- you just need a flat dark background — use a div with `bg-bg-elev` class

### Examples

```svelte
<!-- base surface wrapping a content region -->
<Surface variant="base" as="section">
  <Text as="h2" variant="heading">field notes</Text>
  <Text variant="body">collected observations from the last dispatch.</Text>
</Surface>

<!-- card surface for a discrete content unit -->
<Surface variant="card">
  <Label color="accent">entry 003</Label>
  <Text as="h3" variant="heading">signal decay model</Text>
  <Text variant="body" color="soft">the readings aligned after recalibration.</Text>
</Surface>

<!-- panel with teal inset accent -->
<Surface variant="panel" withInset>
  <Label>mission control</Label>
  <Text as="h2" variant="heading">system status</Text>
</Surface>
```

---

→ next: [docs/api/inputs.md](inputs.md) — input component API reference
