## Navigation

Wayfinding components. they orient the user and enable movement through the application.

---

## Topbar

> horizontal application header with three layout zones: left, center, right.

### Import

```svelte
<script lang="ts">
  import { Topbar } from '$lib';
</script>
```

### Props

| prop | type | default | required | description |
|---|---|---|---|---|
| `class` | `string` | `''` | no | additional CSS classes |

### Slots

| slot | description |
|---|---|
| `left` | left-aligned content — logo, wordmark, back button |
| `center` | centered content — title, breadcrumb, search bar |
| `right` | right-aligned content — actions, avatar, status indicators |

### Examples

```svelte
<Topbar>
  {#snippet left()}
    <Label color="accent">hyvnt</Label>
  {/snippet}

  {#snippet center()}
    <Breadcrumb items={[
      { label: 'mission control', href: '/' },
      { label: 'field log' }
    ]} />
  {/snippet}

  {#snippet right()}
    <Stack direction="horizontal" align="center" gap="var(--space-sm)">
      <StatusDot status="ok" />
      <Button variant="ghost" size="sm">settings</Button>
    </Stack>
  {/snippet}
</Topbar>
```

---

## SidebarNav

> vertical navigation list. renders a list of links with active state support.

### Import

```svelte
<script lang="ts">
  import { SidebarNav } from '$lib';
</script>
```

### Props

| prop | type | default | required | description |
|---|---|---|---|---|
| `items` | `{ label: string; href: string; active?: boolean }[]` | `[]` | yes | navigation items |
| `class` | `string` | `''` | no | additional CSS classes |

### Events

| event | payload | when |
|---|---|---|
| `onnavigate` | `{ label: string; href: string }` | user clicks a nav item |

### Examples

```svelte
<script lang="ts">
  import { page } from '$app/stores';

  const items = [
    { label: 'overview', href: '/' },
    { label: 'field log', href: '/log' },
    { label: 'archive', href: '/archive' },
    { label: 'settings', href: '/settings' },
  ];

  let navItems = $derived(
    items.map(i => ({ ...i, active: $page.url.pathname === i.href }))
  );
</script>

<SidebarNav items={navItems} />
```

---

## Tabs

> tabbed navigation for switching between views within the same page context.

### Import

```svelte
<script lang="ts">
  import { Tabs } from '$lib';
</script>
```

### Props

| prop | type | default | required | description |
|---|---|---|---|---|
| `tabs` | `{ id: string; label: string }[]` | `[]` | yes | tab definitions |
| `active` | `string` | — | yes | the `id` of the currently active tab |
| `class` | `string` | `''` | no | additional CSS classes |

### Events

| event | payload | when |
|---|---|---|
| `onchange` | `string` | user clicks a tab; payload is the new tab's `id` |

### Accessibility

Each tab is a `<button>` with `role="tab"`. the tab list has `role="tablist"`. active tab has `aria-selected="true"`. keyboard navigation: left/right arrows cycle through tabs.

### Examples

```svelte
<script lang="ts">
  const tabs = [
    { id: 'log', label: 'mission log' },
    { id: 'map', label: 'coordinates' },
    { id: 'comm', label: 'transmissions' },
  ];
  let activeTab = $state('log');
</script>

<Tabs {tabs} active={activeTab} onchange={(id) => (activeTab = id)} />

{#if activeTab === 'log'}
  <MissionLog />
{:else if activeTab === 'map'}
  <CoordinateMap />
{:else if activeTab === 'comm'}
  <Transmissions />
{/if}
```

---

## Breadcrumb

> horizontal path showing the user's location within the application hierarchy.

### Import

```svelte
<script lang="ts">
  import { Breadcrumb } from '$lib';
</script>
```

### Props

| prop | type | default | required | description |
|---|---|---|---|---|
| `items` | `{ label: string; href?: string }[]` | `[]` | yes | breadcrumb segments; last item is rendered as plain text (no link) |
| `class` | `string` | `''` | no | additional CSS classes |

### Accessibility

Rendered as a `<nav>` with `aria-label="breadcrumb"`. the last item has `aria-current="page"`.

### Examples

```svelte
<!-- basic breadcrumb -->
<Breadcrumb items={[
  { label: 'mission control', href: '/' },
  { label: 'archive', href: '/archive' },
  { label: 'entry 003' }
]} />

<!-- inside a Topbar center slot -->
<Topbar>
  {#snippet center()}
    <Breadcrumb items={crumbs} />
  {/snippet}
</Topbar>
```

---

## DropdownMenu

> an anchored list of selectable options. triggered by external open state. used for context menus, action menus, and option pickers.

### Import

```svelte
<script lang="ts">
  import { DropdownMenu } from '$lib';
</script>
```

### Props

| prop | type | default | required | description |
|---|---|---|---|---|
| `open` | `boolean` | `false` | yes | controls dropdown visibility |
| `items` | `{ label: string; value: string; disabled?: boolean; destructive?: boolean }[]` | `[]` | yes | menu items |
| `class` | `string` | `''` | no | additional CSS classes |

### Events

| event | payload | when |
|---|---|---|
| `onselect` | `string` | user clicks an item; payload is the item's `value` |

### The `destructive` Flag

items with `destructive: true` render in `--status-fail` color. use for actions that cannot be undone.

### Accessibility

Renders as a `role="menu"` with `role="menuitem"` children. keyboard navigation: up/down arrows, Enter to select, Escape to close.

### Do Not Use When

- you need a form select input — use `Select`
- you need a full navigation menu — use `SidebarNav` or `Tabs`

### Examples

```svelte
<script lang="ts">
  let menuOpen = $state(false);

  function handleSelect(value: string) {
    menuOpen = false;
    if (value === 'delete') confirmDelete();
    else if (value === 'export') exportRecord();
  }
</script>

<div style="position: relative; display: inline-block;">
  <Button variant="ghost" size="sm" onclick={() => (menuOpen = !menuOpen)}>
    actions
  </Button>

  <DropdownMenu
    open={menuOpen}
    items={[
      { label: 'export record', value: 'export' },
      { label: 'duplicate', value: 'duplicate' },
      { label: 'archive', value: 'archive' },
      { label: 'delete', value: 'delete', destructive: true },
    ]}
    onselect={handleSelect}
  />
</div>
```

---

→ next: [docs/api/display.md](display.md) — display component API reference
