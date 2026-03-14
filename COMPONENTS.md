# hyvui component index

---

## Text
**File:** `src/lib/components/primitives/Text.svelte`

The foundational type component. Four variants — `heading`, `body`, `caption`, `italic` — across six color stops. Anything that's prose, a heading, or a pull-quote goes through here.

Don't use it for UI labels or metadata — that's Label's territory.

**Key props:** `as` (HTML tag, default `'p'`), `variant`, `color`, `class`

**Example:**
```svelte
<Text variant="heading" as="h1">signal acquired</Text>
```

---

## Label
**File:** `src/lib/components/primitives/Label.svelte`

Monospace, uppercase, small-caps. This is the system's own voice — for form labels, metadata strings, category markers, and UI chrome. Not for reading; for labeling.

**Key props:** `as` (default `'span'`), `color` (`'muted' | 'accent' | 'signal'`), `class`

**Example:**
```svelte
<Label color="accent">status</Label>
```

---

## Icon
**File:** `src/lib/components/primitives/Icon.svelte`

A sizing and color wrapper for inline SVGs. Doesn't bundle icons — bring your own. The point is consistency: every icon through this component means every icon stays on-grid.

**Key props:** `size` (px, default `16`), `color` (CSS color), `class`

**Slots:** default — SVG content

**Example:**
```svelte
<Icon size={20} color="var(--accent)">
  <svg>...</svg>
</Icon>
```

---

## Divider
**File:** `src/lib/components/primitives/Divider.svelte`

A horizontal rule that uses token line colors. Reach for it when spacing alone isn't enough to separate two sections — but think twice before adding one. Stack handles gaps. This handles breaks.

**Key props:** `strength` (`'default' | 'strong'`), `class`

**Example:**
```svelte
<Divider strength="strong" />
```

---

## Surface
**File:** `src/lib/components/primitives/Surface.svelte`

The base container — gradient backgrounds, optional inset border. Most of the time you want Card or Panel, which wrap this. Come here directly when you're building something custom that needs the library's surface treatment.

**Key props:** `variant` (`'base' | 'card' | 'panel'`), `as`, `withInset` (boolean), `class`

**Example:**
```svelte
<Surface variant="card">content here</Surface>
```

---

## Button
**File:** `src/lib/components/inputs/Button.svelte`

Four variants: `primary`, `secondary`, `ghost`, `destructive`. For navigation to another page, use an anchor tag. This is for actions — things that happen when you press it.

**Key props:** `variant`, `size` (`'sm' | 'md'`), `disabled`, `loading`, `echo` (adds gold pulse on click), `class`

**Events:** `onclick`

**Example:**
```svelte
<Button variant="primary">deploy</Button>
```

---

## Input
**File:** `src/lib/components/inputs/Input.svelte`

Single-line text collection with optional label, hint text, and error state. For multi-line input, use Textarea.

**Key props:** `type`, `value`, `placeholder`, `label`, `error`, `hint`, `disabled`, `class`

**Events:** `oninput`, `onchange`

**Example:**
```svelte
<Input label="callsign" placeholder="enter identifier" />
```

---

## Textarea
**File:** `src/lib/components/inputs/Textarea.svelte`

Multi-line text input. Set `autoresize` and it grows with the content. For a single line, use Input.

**Key props:** `value`, `rows`, `placeholder`, `label`, `error`, `autoresize`, `disabled`, `class`

**Events:** `oninput`

**Example:**
```svelte
<Textarea label="notes" rows={4} placeholder="additional context" />
```

---

## Select
**File:** `src/lib/components/inputs/Select.svelte`

A styled native select dropdown. Works when users choose from a fixed list. If you need searching or filtering, you'll need to build that yourself with Input and some filtering logic.

**Key props:** `options` (`{value, label}[]`), `value`, `label`, `error`, `disabled`, `class`

**Events:** `onchange`

**Example:**
```svelte
<Select label="region" options={[{value: 'us', label: 'united states'}]} />
```

---

## Checkbox
**File:** `src/lib/components/inputs/Checkbox.svelte`

Custom checkbox with a visible label. Good for form fields that stay in a submit flow. For instant on/off without a form, Toggle is cleaner.

**Key props:** `checked`, `label`, `disabled`, `class`

**Events:** `onchange`

**Example:**
```svelte
<Checkbox label="enable telemetry" checked={true} />
```

---

## Toggle
**File:** `src/lib/components/inputs/Toggle.svelte`

Pill-shaped on/off switch. Changes take effect immediately — no form submit needed. If you're inside a form that gets submitted, use Checkbox instead.

**Key props:** `checked`, `label`, `disabled`, `class`

**Events:** `onchange`

**Example:**
```svelte
<Toggle label="dark mode" checked={false} />
```

---

## FileUpload
**File:** `src/lib/components/inputs/FileUpload.svelte`

Drag-and-drop file upload zone. Styled, labeled, works with multiple files. If you just need a plain file picker without the drag zone, a native `input[type=file]` is simpler.

**Key props:** `accept`, `multiple`, `label`, `disabled`, `class`

**Events:** `onfiles` — fires with selected `File[]`

**Example:**
```svelte
<FileUpload accept="image/*" multiple />
```

---

## StatusDot
**File:** `src/lib/components/feedback/StatusDot.svelte`

A small pulsing dot. Four states: `ok`, `pend`, `warn`, `fail`. For showing that a system is alive, processing, degraded, or gone. Not a loading spinner — it's a heartbeat indicator.

**Key props:** `status`, `pulse` (default `true`), `size` (px, default `6`)

**Example:**
```svelte
<StatusDot status="ok" />
```

---

## StatusLine
**File:** `src/lib/components/feedback/StatusLine.svelte`

A single terminal-style line: a bracketed glyph + a message. Shows one status update. For a sequence of these that appear one after another, use TerminalBoot.

**Key props:** `status`, `message`, `visible` (default `false`), `class`

**Example:**
```svelte
<StatusLine status="ok" message="connection established" visible />
```

---

## Alert
**File:** `src/lib/components/feedback/Alert.svelte`

A persistent inline message with a left-border accent. Stays visible until the user or the system removes it. For temporary popups that dismiss on their own, use Toast.

**Key props:** `variant` (`'info' | 'warn' | 'error' | 'ok'`), `title` (optional), `class`

**Slots:** default — alert body

**Example:**
```svelte
<Alert variant="warn" title="pending sync">upstream has not responded</Alert>
```

---

## Toast
**File:** `src/lib/components/feedback/Toast.svelte`

Auto-dismissing notification toasts. Drop `<Toast />` once in the layout; trigger notifications anywhere with `toastStore.push(message, variant, duration)`. For persistent messages, use Alert.

**Key props:** `position` (`'bottom-right' | 'bottom-center'`)

**Example:**
```svelte
<Toast position="bottom-right" />
```

---

## Skeleton
**File:** `src/lib/components/feedback/Skeleton.svelte`

Shimmering content placeholder for loading states. Works best when you know the approximate shape of what's coming. If you don't know the shape yet, show EmptyState or a StatusDot instead.

**Key props:** `width`, `height`, `variant` (`'text' | 'card' | 'circle' | 'custom'`), `class`

**Example:**
```svelte
<Skeleton variant="text" width="200px" height="1rem" />
```

---

## EmptyState
**File:** `src/lib/components/feedback/EmptyState.svelte`

Centered empty-data message — a title, optional description, optional CTA. Use when there's simply nothing to show yet, not when something went wrong. For failed requests, see ErrorState.

**Key props:** `title`, `description` (optional), `class`

**Slots:** default — optional CTA

**Example:**
```svelte
<EmptyState title="the channel is quiet" description="no transmissions yet" />
```

---

## ErrorState
**File:** `src/lib/components/feedback/ErrorState.svelte`

Error condition display with optional retry button. Name the condition, not the HTTP code — "signal interrupted" not "server returned 500". Use when a request failed or data couldn't load. For zero-data (no failure), EmptyState is the right call.

**Key props:** `title` (default `'the signal needs rest'`), `description`, `retry` (shows retry button), `class`

**Events:** `onretry`

**Example:**
```svelte
<ErrorState retry title="connection interrupted" />
```

---

## Stack
**File:** `src/lib/components/layout/Stack.svelte`

Pure flexbox layout — no visual treatment, just spacing. Vertical or horizontal, consistent gaps. When you need columns, Grid handles that.

**Key props:** `direction` (`'vertical' | 'horizontal'`), `gap` (CSS size), `align`, `justify`, `wrap`, `as`, `class`

**Example:**
```svelte
<Stack direction="horizontal" gap="1rem">
  <Button>one</Button>
  <Button>two</Button>
</Stack>
```

---

## Grid
**File:** `src/lib/components/layout/Grid.svelte`

CSS grid wrapper. Pass a column definition via `cols` — number for equal columns, or a full `grid-template-columns` string for custom layouts. For simple vertical/horizontal stacking, Stack is enough.

**Key props:** `cols` (number | string), `gap`, `as`, `class`

**Example:**
```svelte
<Grid cols="minmax(0,0.82fr) minmax(0,1.18fr)" gap="2rem">
  <div>left column</div>
  <div>right column</div>
</Grid>
```

---

## Card
**File:** `src/lib/components/layout/Card.svelte`

Contained surface with gradient background, header and footer slots. Good for repeatable rows, grid items, or any modular content block. For full-section containers, use Panel.

**Key props:** `staggerOffset` (translateY for staggered grids), `class`

**Slots:** `header`, default, `footer`

**Example:**
```svelte
<Card>
  {#snippet header()}card title{/snippet}
  card content here
</Card>
```

---

## Panel
**File:** `src/lib/components/layout/Panel.svelte`

Large section container with panel-level surface gradient and optional teal inset border. Wraps a full content section. For smaller contained elements, Card is the better fit.

**Key props:** `withInset` (boolean), `class`

**Slots:** `header`, default

**Example:**
```svelte
<Panel withInset>section content</Panel>
```

---

## Modal
**File:** `src/lib/components/layout/Modal.svelte`

Overlay dialog with backdrop. For situations that require focused attention and block the rest of the interface. For simple confirm/cancel flows, ConfirmDialog has the plumbing already done.

**Key props:** `open`, `title` (optional), `class`

**Slots:** `header`, default, `footer`

**Events:** `onclose`

**Example:**
```svelte
<Modal open={showModal} title="transmission details" onclose={() => showModal = false}>
  modal content
</Modal>
```

---

## Drawer
**File:** `src/lib/components/layout/Drawer.svelte`

Side-sliding panel — left or right. Good for secondary navigation or detail views that slide in without fully blocking the page. For center-focused blocking dialogs, use Modal.

**Key props:** `open`, `side` (`'left' | 'right'`), `width` (default `'320px'`), `class`

**Events:** `onclose`

**Example:**
```svelte
<Drawer open={showDrawer} side="right" onclose={() => showDrawer = false}>
  drawer content
</Drawer>
```

---

## Popover
**File:** `src/lib/components/layout/Popover.svelte`

Small floating card anchored to a trigger element. Good for contextual menus or info that appears near where the user is already looking. For simple tooltip-style hints, a CSS `title` attribute is enough.

**Key props:** `open`, `placement` (`'top' | 'bottom' | 'left' | 'right'`), `class`

**Example:**
```svelte
<Popover open={showPop} placement="bottom">
  popover content
</Popover>
```

---

## Topbar
**File:** `src/lib/components/navigation/Topbar.svelte`

Top-level navigation bar with left, center, and right slot regions. For vertical navigation along the side, use SidebarNav.

**Key props:** `class`

**Slots:** `left`, `center`, `right`

**Example:**
```svelte
<Topbar>
  {#snippet left()}<Label>hyv</Label>{/snippet}
  {#snippet right()}<Button variant="ghost">settings</Button>{/snippet}
</Topbar>
```

---

## SidebarNav
**File:** `src/lib/components/navigation/SidebarNav.svelte`

Vertical navigation list with active-item highlighting. Takes an array of items; fires `onnavigate` when one is selected. For horizontal tab-style nav, use Tabs.

**Key props:** `items` (`{label, href, active?}[]`), `class`

**Events:** `onnavigate`

**Example:**
```svelte
<SidebarNav items={[{label: 'dashboard', href: '/', active: true}]} />
```

---

## Tabs
**File:** `src/lib/components/navigation/Tabs.svelte`

Horizontal tab selector with an underline active indicator. For switching between related views within a page. If you're navigating between actual pages, use links or SidebarNav.

**Key props:** `tabs` (`{id, label}[]`), `active` (active tab id), `class`

**Events:** `onchange` — fires with the new active tab id

**Example:**
```svelte
<Tabs tabs={[{id: 'all', label: 'all'}, {id: 'active', label: 'active'}]} active="all" />
```

---

## Breadcrumb
**File:** `src/lib/components/navigation/Breadcrumb.svelte`

Breadcrumb trail with slash separators. Shows where the user is in a hierarchy. No use for flat navigation structures.

**Key props:** `items` (`{label, href?}[]`), `class`

**Example:**
```svelte
<Breadcrumb items={[{label: 'home', href: '/'}, {label: 'signals'}]} />
```

---

## DropdownMenu
**File:** `src/lib/components/navigation/DropdownMenu.svelte`

Floating menu of selectable actions. Items can be marked `destructive` to shift their color. For form-based selection from a list, use Select instead.

**Key props:** `open`, `items` (`{label, value, disabled?, destructive?}[]`), `class`

**Events:** `onselect` — fires with the selected value

**Example:**
```svelte
<DropdownMenu open={showMenu} items={[{label: 'edit', value: 'edit'}]} />
```

---

## Badge
**File:** `src/lib/components/display/Badge.svelte`

Small inline status tag for labeling items with a state or category. For showing system-level health in real time, StatusDot is the better pick.

**Key props:** `variant` (`'default' | 'accent' | 'signal' | 'ok' | 'warn' | 'fail'`), `class`

**Slots:** default — badge text

**Example:**
```svelte
<Badge variant="accent">active</Badge>
```

---

## Avatar
**File:** `src/lib/components/display/Avatar.svelte`

User identity display — image if available, initials fallback if not. Not for status indicators; that's StatusDot.

**Key props:** `src` (optional image URL), `name` (for initials), `size` (default `32`), `class`

**Example:**
```svelte
<Avatar name="ada lovelace" size={40} />
```

---

## Table
**File:** `src/lib/components/display/Table.svelte`

Data table with header and row styling. Define columns as `{key, label, align?}` and pass rows as an object array. For a single highlighted number, MetricCard is simpler.

**Key props:** `columns`, `rows`, `class`

**Slots:** `empty` — custom empty state

**Example:**
```svelte
<Table columns={[{key: 'name', label: 'name'}]} rows={data} />
```

---

## CodeBlock
**File:** `src/lib/components/display/CodeBlock.svelte`

Code block with optional copy button. For displaying code snippets or terminal output. For inline code within a sentence, a plain `<code>` tag is fine.

**Key props:** `code`, `language` (optional), `copyable` (default `true`), `class`

**Example:**
```svelte
<CodeBlock code="const x = 42;" language="js" />
```

---

## MetricCard
**File:** `src/lib/components/display/MetricCard.svelte`

A card showing a single KPI — label, value, and optional trend arrow. For rows of structured data, Table is the better tool.

**Key props:** `label`, `value` (string | number), `trend` (`'up' | 'down' | 'neutral'`), `trendValue`, `class`

**Example:**
```svelte
<MetricCard label="latency" value="42ms" trend="down" trendValue="-12%" />
```

---

## Blockquote
**File:** `src/lib/components/display/Blockquote.svelte`

Styled pull-quote in italic voice. For manifesto-style statements or excerpts that deserve space. Not a replacement for regular body text — use Text for that.

**Key props:** `class`

**Slots:** default — quote content

**Example:**
```svelte
<Blockquote>the system remembers what you forget</Blockquote>
```

---

## GridOverlay
**File:** `src/lib/components/ambient/GridOverlay.svelte`

A decorative 72px crossing grid with edge fade. Adds atmospheric depth to sparse sections. Avoid it in dense content areas — it adds noise rather than texture there.

Parent must have `position: relative`.

**Key props:** `class`

**Example:**
```svelte
<div style="position: relative"><GridOverlay /></div>
```

---

## CornerBrackets
**File:** `src/lib/components/ambient/CornerBrackets.svelte`

Decorative bracket marks at each corner — an ornamental frame for important containers. Not a border; for an actual border, Surface handles that.

Parent must have `position: relative`.

**Key props:** `size` (default `32`), `color` (default gold at 0.24 opacity), `class`

**Example:**
```svelte
<div style="position: relative"><CornerBrackets /></div>
```

---

## ScanBand
**File:** `src/lib/components/ambient/ScanBand.svelte`

A horizontal sweep animation indicating active system state — the visual equivalent of a sonar ping. Only makes sense when something is actually processing. Don't use it on idle or errored sections.

**Key props:** `active` (default `true`), `class`

**Example:**
```svelte
<ScanBand active />
```

---

## Vignette
**File:** `src/lib/components/ambient/Vignette.svelte`

Fixed-position edge-darkening layer for the standard atmospheric page treatment. Render it once in the app shell. Avoid placing it inside scrollable containers — it's fixed-position and won't behave.

**Key props:** `class`

**Example:**
```svelte
<Vignette />
```

---

## ParallaxLayer
**File:** `src/lib/components/ambient/ParallaxLayer.svelte`

Wraps content in a pointer-following parallax transform driven by CSS custom properties `--px` / `--py`. Only works if an ancestor sets those properties from a `pointermove` handler.

**Key props:** `strength` (motion multiplier, default `18`), `class`

**Slots:** default

**Example:**
```svelte
<ParallaxLayer strength={12}>
  <GridOverlay />
</ParallaxLayer>
```

---

## PageHeader
**File:** `src/lib/components/patterns/PageHeader.svelte`

Standard page header: title, subtitle, breadcrumb slot, actions slot. Should be the first thing on any page. Not suited for modal or dialog headers.

**Key props:** `title`, `subtitle` (optional), `class`

**Slots:** `breadcrumb`, `actions`

**Example:**
```svelte
<PageHeader title="transmissions" subtitle="all active signals">
  {#snippet actions()}<Button>new signal</Button>{/snippet}
</PageHeader>
```

---

## ConfirmDialog
**File:** `src/lib/components/patterns/ConfirmDialog.svelte`

Confirmation modal with confirm/cancel actions. The title names the action — it doesn't ask "are you sure?" Mark as `destructive` for irreversible actions. For informational dialogs, use Modal directly.

**Key props:** `open`, `title`, `description`, `confirmLabel` (default `'confirm'`), `cancelLabel` (default `'cancel'`), `destructive`, `class`

**Events:** `onconfirm`, `oncancel`

**Example:**
```svelte
<ConfirmDialog open={showConfirm} title="remove this entry" destructive />
```

---

## SearchBar
**File:** `src/lib/components/patterns/SearchBar.svelte`

Search input with optional loading indicator. For pages that need filtering or search. If you just need a plain text field, Input is simpler.

**Key props:** `value`, `placeholder` (default `'search'`), `loading`, `class`

**Events:** `onsearch`

**Example:**
```svelte
<SearchBar placeholder="search signals" />
```

---

## ActionBar
**File:** `src/lib/components/patterns/ActionBar.svelte`

Bulk-action bar that appears when items are selected. Hides automatically when `count` is 0. Put your bulk action buttons in the `actions` slot.

**Key props:** `count` (selected item count), `class`

**Slots:** `actions`

**Events:** `onclear`

**Example:**
```svelte
<ActionBar count={3}>
  {#snippet actions()}<Button variant="destructive">delete</Button>{/snippet}
</ActionBar>
```

---

## TerminalBoot
**File:** `src/lib/components/patterns/TerminalBoot.svelte`

Orchestrates a staggered sequence of StatusLine components. Good for boot sequences, initialization flows, or any page that wants to reveal itself line by line. For a single status line, StatusLine directly is simpler.

**Key props:** `lines` (`{status, message}[]`), `delay` (initial delay ms, default `600`), `interval` (ms between lines, default `700`), `class`

**Events:** `oncomplete` — fires when the last line appears

**Example:**
```svelte
<TerminalBoot
  lines={[
    {status: 'ok', message: 'core initialized'},
    {status: 'ok', message: 'signal acquired'},
    {status: 'pend', message: 'awaiting handshake'}
  ]}
  oncomplete={() => showContent = true}
/>
```

---

## NarrativeScene
**File:** `src/lib/components/scenes/NarrativeScene.svelte`

Asymmetric editorial layout — narrow copy column on the left, open canvas on the right. Built for about pages, portfolio work, and story-first sections. For dense data and tooling, ReadoutScene is the right posture.

**Key props:** `chapter` (optional section label above heading), `class`

**Slots:** `heading`, `copy`, `canvas`

**Example:**
```svelte
<NarrativeScene chapter="01 — origin">
  {#snippet heading()}<Text expression="title-card">how it started</Text>{/snippet}
  {#snippet copy()}<Text>the first signal was an accident.</Text>{/snippet}
</NarrativeScene>
```

---

## ReadoutScene
**File:** `src/lib/components/scenes/ReadoutScene.svelte`

Dense, mono-forward layout for data and tooling interfaces. The default posture for dashboards, system views, and anything where information density is the point. For prose-heavy content, NarrativeScene breathes more.

**Key props:** `title` (optional), `class`

**Slots:** `header`, default, `sidebar`

**Example:**
```svelte
<ReadoutScene title="system status">
  <Table columns={cols} rows={data} />
</ReadoutScene>
```

---

## StageScene
**File:** `src/lib/components/scenes/StageScene.svelte`

Centered theatrical layout for hero moments and feature reveals. Best when a section has one primary thing to say. If you have multiple equal-weight items, you probably want a Grid of Cards instead.

**Key props:** `class`

**Slots:** `label`, `heading`, `subheading`, `actions`, `ambient`

**Example:**
```svelte
<StageScene>
  {#snippet heading()}<Text expression="title-card">signal acquired</Text>{/snippet}
  {#snippet actions()}<Button variant="primary">enter</Button>{/snippet}
</StageScene>
```

---

## ArchiveScene
**File:** `src/lib/components/scenes/ArchiveScene.svelte`

Uniform cold grid for galleries, catalogs, and indexes. Intentionally uses no stagger offsets — uniformity is the aesthetic. If your items have different visual weights, build from Grid manually instead.

**Key props:** `title` (optional), `cols` (default `3`), `class`

**Slots:** `filter`, default

**Example:**
```svelte
<ArchiveScene cols={3} title="all transmissions">
  {#each items as item}<Card>{item.title}</Card>{/each}
</ArchiveScene>
```

---

## LogScene
**File:** `src/lib/components/scenes/LogScene.svelte`

Full-width terminal layout for process output, boot sequences, and system status streams. Sequential, line-based content only. For prose or data grids, this isn't the right container.

**Key props:** `class`

**Slots:** `header`, default, `footer`

**Example:**
```svelte
<LogScene>
  {#snippet header()}<Label>initialization sequence</Label>{/snippet}
  <TerminalBoot lines={bootLines} oncomplete={() => done = true} />
</LogScene>
```

---

## DepthStage
**File:** `src/lib/components/depth/DepthStage.svelte`

Establishes a CSS 3D perspective context (`transform-style: preserve-3d`). Everything in the depth system needs to live inside one of these. Don't add depth components to flat layouts without wrapping them here first.

**Key props:** `perspective` (`'near' | 'mid' | 'far'`, default `'mid'`), `originX`, `originY`, `as`, `class`

**Example:**
```svelte
<DepthStage perspective="far">
  <DepthLayer level="ground"><HorizonGrid /></DepthLayer>
  <DepthLayer level="raised"><FloatCard>content</FloatCard></DepthLayer>
</DepthStage>
```

---

## DepthLayer
**File:** `src/lib/components/depth/DepthLayer.svelte`

Places children at a specific z-depth within a DepthStage — `ground`, `raised`, or `foreground`. No perspective context of its own; it needs DepthStage as an ancestor.

**Key props:** `level` (`'ground' | 'raised' | 'foreground'`, default `'ground'`), `as`, `class`

**Example:**
```svelte
<DepthLayer level="foreground">
  <Text variant="heading">closest to viewer</Text>
</DepthLayer>
```

---

## FloatCard
**File:** `src/lib/components/depth/FloatCard.svelte`

A card with self-contained perspective that tilts toward the pointer. Gives cards a sense of physicality. For flat cards with no tilt, Card is the right choice.

All 3D transforms are disabled under `prefers-reduced-motion`.

**Key props:** `tiltMax` (degrees, default `8`), `class`

**Example:**
```svelte
<FloatCard tiltMax={5}>
  <Label color="muted">signal strength</Label>
  <Text variant="heading" color="primary">-42 dbm</Text>
</FloatCard>
```

---

## HorizonGrid
**File:** `src/lib/components/depth/HorizonGrid.svelte`

Canvas-drawn receding perspective grid — gold near-lines fading to teal at the horizon. Spatial grounding for hero sections or 3D scene backgrounds. For a flat CSS grid overlay, GridOverlay is simpler and doesn't need canvas.

**Key props:** `rows` (default `12`), `cols` (default `8`), `vanishY` (vanishing point 0–1, default `0.35`), `animated`, `class`

**Example:**
```svelte
<HorizonGrid rows={18} cols={10} vanishY={0.35} animated />
```

---

## Plinth
**File:** `src/lib/components/depth/Plinth.svelte`

A nearly invisible receding 3D surface — a shadow shelf under floating elements. Anchors FloatCards and other raised content so they don't look like they're drifting in space.

**Key props:** `width` (default `'100%'`), `depth` (CSS height of the surface, default `'20px'`), `class`

**Example:**
```svelte
<FloatCard><Text>elevated</Text></FloatCard>
<Plinth width="80%" depth="24px" />
```

---

## SignalRing
**File:** `src/lib/components/ambient/SignalRing.svelte`

Circular sonar-ping rings pulsing outward from center. Works well for empty states, loading moods, or atmospheric decoration. Not a progress indicator — use Skeleton for that.

**Key props:** `active`, `size` (diameter px, default `200`), `color` (default `'var(--signal)'`), `class`

**Example:**
```svelte
<SignalRing active size={300} />
```

---

## GlyphMark
**File:** `src/lib/components/ambient/GlyphMark.svelte`

Small decorative SVG glyph — `cross`, `reticle`, `coord`, or `mark`. For waypoints, decorative markers, and coordinate indicators alongside labels. If you need a functional icon, use Icon instead.

**Key props:** `variant`, `size` (default `16`), `color` (default `'currentColor'`), `class`

**Example:**
```svelte
<GlyphMark variant="reticle" size={24} color="var(--signal)" />
```

---

## DataStream
**File:** `src/lib/components/ambient/DataStream.svelte`

A scrolling column of cycling monospace characters. Purely decorative — for ambient data texture at dashboard edges or sidebar decoration. Don't use it to display real data.

**Key props:** `active`, `speed` (`'slow' | 'medium' | 'fast'`, default `'medium'`), `length` (character count, default `12`), `class`

**Example:**
```svelte
<DataStream active speed="slow" />
```

---

## ThreadLine
**File:** `src/lib/components/ambient/ThreadLine.svelte`

SVG line with an animated traveling dot connecting two points. Good for timeline connectors or visually linking related elements. For a static horizontal separator, Divider is the right call.

**Key props:** `x1`, `y1`, `x2`, `y2` (start/end coordinates), `color` (default `'var(--line)'`), `dotColor` (default `'var(--signal)'`), `animated`, `class`

**Example:**
```svelte
<ThreadLine x1={0} y1={0} x2={200} y2={100} animated />
```
