## weight and theme system

---

## concept

a weight register is a named density and voice preset. weights adjust typographic scale, font selection, spacing, surface opacity, and accent weight. they do not change colors, component behavior, or layout.

a theme is a palette and motif layer. themes can remap semantic color tokens and add ornamental behavior, but they do not own structural density. this lets `mission-control` and `hextech` compose without one silently erasing the other.

---

## available weights

| name              | character                      | primary font      | use for                                                                   |
| ----------------- | ------------------------------ | ----------------- | ------------------------------------------------------------------------- |
| `field-notebook`  | warm, editorial, serif-forward | ET Book           | portfolios, articles, field journals, personal projects                   |
| `mission-control` | dense, precise, mono-forward   | IBM Plex Mono     | dashboards, admin panels, data-heavy applications, operational interfaces |
| `archive`         | cool, spacious, muted          | ET Book (lighter) | galleries, collections, reference documentation, archival interfaces      |

## available themes

| name      | character                              | token file                        |
| --------- | -------------------------------------- | --------------------------------- |
| `hextech` | brass, crystal, mechanical             | `@hyvnt/hyvui/tokens/hextech.css` |
| `arcane`  | shimmer, shards, unstable organic glow | `@hyvnt/hyvui/tokens/arcane.css`  |

---

## applying weight and theme

### method 1. svelte body attributes

```svelte
<svelte:body data-weight="field-notebook" data-theme="hextech" />
```

### method 2. appshell

```svelte
<AppShell weight="mission-control" theme="arcane">
  <!-- page content -->
</AppShell>
```

### method 3. javascript

```svelte
<script lang="ts">
  import { applyTheme, applyWeight, clearTheme, clearWeight } from "$lib";
  import type { ThemeRegister, WeightRegister } from "$lib";

  applyWeight("mission-control");
  applyTheme("hextech");

  function switchWeight(weight: WeightRegister) {
    applyWeight(weight);
  }

  function switchTheme(theme: ThemeRegister) {
    applyTheme(theme);
  }

  clearWeight();
  clearTheme();
</script>
```

### method 4. scoped sections

weights and themes can be applied to any element. their variables cascade to descendants:

```svelte
<svelte:body data-weight="field-notebook" />

<section data-weight="archive" data-theme="arcane">
  <ArchiveScene title="reference documents">
    <!-- content here renders with archive weight plus arcane theme -->
  </ArchiveScene>
</section>
```

---

## weight variable reference

all `--reg-*` variables are defined in `src/lib/system/register.css`. the `:root` values are the default weight fallback.

| variable                 | purpose                        |
| ------------------------ | ------------------------------ |
| `--reg-font-primary`     | main text family               |
| `--reg-font-ui`          | label and control family       |
| `--reg-heading-tracking` | heading letter spacing         |
| `--reg-heading-lh`       | heading line height            |
| `--reg-body-size`        | body copy size                 |
| `--reg-label-size`       | label size                     |
| `--reg-label-tracking`   | label letter spacing           |
| `--reg-surface-opacity`  | surface visual strength        |
| `--reg-ornament-opacity` | ambient ornament visual weight |
| `--reg-accent-weight`    | relative accent emphasis       |
| `--reg-signal-weight`    | relative signal emphasis       |
| `--reg-spacing-scale`    | register-level spacing scale   |

---

## combining with the override layer

the project override layer (`src/theme.css`) takes the highest precedence:

```
tokens.css -> register.css -> theme token file -> theme.css
```

if your `theme.css` sets `--reg-body-size: 1.2rem`, that value will apply regardless of which weight is active.

if you want weight-relative overrides, set the `--reg-*` variables directly inside a weight selector:

```css
[data-weight="mission-control"] {
  --reg-body-size: 0.875rem;
}
```

---

## comparison

**field-notebook**
warm, editorial, serif-forward. best for narrative pages and case studies.

**mission-control**
dense, precise, mono-forward. best for dashboards, tools, and operational readouts.

**archive**
cool, spacious, muted. best for galleries, indexes, and catalog pages.

**hextech**
brass and crystal theme. use when a section needs mechanical polish without changing its weight.

**arcane**
shimmer and shard theme. use when a section needs controlled instability without changing its weight.

---

-> next: [docs/expressions.md](expressions.md) - typographic expression reference
