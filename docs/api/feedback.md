## Feedback

Components that communicate state, progress, and outcomes to the user. choose based on persistence and context — see the decision guide at the bottom of this file.

---

## StatusDot

> a small pulsing circle that communicates system health at a glance. used inline with text, in headers, or beside component labels.

### Import

```svelte
<script lang="ts">
	import { StatusDot } from '$lib';
</script>
```

### Props

| prop     | type                                 | default | required | description                           |
| -------- | ------------------------------------ | ------- | -------- | ------------------------------------- |
| `status` | `'ok' \| 'pend' \| 'warn' \| 'fail'` | —       | yes      | the system state to represent         |
| `pulse`  | `boolean`                            | `true`  | no       | enables the pulsing opacity animation |
| `size`   | `number`                             | `6`     | no       | dot diameter in pixels                |
| `class`  | `string`                             | `''`    | no       | additional CSS classes                |

### Variants

**ok**
6px circle in `--status-ok` (teal `#79a6a3`). when `pulse` is true: opacity pulses between 0.4 and 1.0 on a 2s ease-in-out loop. use for: connected, healthy, verified, active.

**pend**
6px circle in `--status-pend` (warm gray `#8b8476`). same pulse animation. use for: loading, processing, awaiting response, queued.

**warn**
6px circle in `--status-warn` (gold `#c79c57`). same pulse animation. use for: degraded, partial, attention required, non-blocking issue.

**fail**
6px circle in `--status-fail` (burnt orange `#b66a48`). same pulse animation. use for: error, unreachable, disconnected, critical failure.

### Anti-Confusion: StatusDot vs StatusLine

- `StatusDot` — icon only. put it beside a label when space is tight.
- `StatusLine` — bracketed glyph + message text. use when the status needs an explanation.

### Accessibility

`aria-hidden="true"` is applied — the dot is purely decorative. pair it with a visible label or `aria-label` on the surrounding element to communicate status to screen readers.

### Do Not Use When

- the status needs an explanatory message — use `StatusLine`
- you need a persistent warning banner — use `Alert`
- you need a transient notification — use `Toast`

### Examples

```svelte
<!-- inline with a label -->
<div style="display: flex; align-items: center; gap: 0.5rem;">
	<StatusDot status="ok" />
	<Label>system nominal</Label>
</div>

<!-- larger dot, no pulse -->
<StatusDot status="warn" size={10} pulse={false} />

<!-- all four states in a status panel -->
<StatusDot status="ok" />
<StatusDot status="pend" />
<StatusDot status="warn" />
<StatusDot status="fail" />
```

---

## StatusLine

> a terminal-style status row with a bracketed glyph and message text. used in boot sequences, log readouts, and system panels.

### Import

```svelte
<script lang="ts">
	import { StatusLine } from '$lib';
</script>
```

### Props

| prop      | type                                 | default   | required | description                                    |
| --------- | ------------------------------------ | --------- | -------- | ---------------------------------------------- |
| `status`  | `'ok' \| 'pend' \| 'warn' \| 'fail'` | —         | yes      | determines the glyph and color                 |
| `message` | `string`                             | `''`      | yes      | the status message text                        |
| `visible` | `boolean`                            | `true`    | no       | controls visibility — use for staggered reveal |
| `tone`    | `'split' \| 'line'`                  | `'split'` | no       | layout style for the glyph                     |
| `cursor`  | `boolean`                            | `false`   | no       | shows a blinking cursor after the message      |
| `class`   | `string`                             | `''`      | no       | additional CSS classes                         |

### Tone Variants

**split**
Glyph and message on separate sides with space between. used in multi-column readout layouts.

**line**
Glyph and message on the same line, flowing left to right. used in terminal-style sequential lists.

### Status Glyphs

Each status maps to a bracketed ASCII glyph displayed in the status color:

- `ok` → `[ ✓ ]` in `--status-ok`
- `pend` → `[ ~ ]` in `--status-pend`
- `warn` → `[ ! ]` in `--status-warn`
- `fail` → `[ ✕ ]` in `--status-fail`

### Examples

```svelte
<!-- single status line -->
<StatusLine status="ok" message="signal acquired" />

<!-- with blinking cursor (active/loading state) -->
<StatusLine status="pend" message="resolving coordinates" cursor />

<!-- staggered boot sequence (use with TerminalBoot for full animation) -->
<StatusLine status="ok" message="token layer initialized" visible={step >= 1} />
<StatusLine status="ok" message="register system mounted" visible={step >= 2} />
<StatusLine status="pend" message="awaiting confirmation" visible={step >= 3} cursor />
```

---

## Alert

> a persistent inline message with a colored left-border accent. used for contextual warnings, info notes, and success confirmations that stay visible on the page.

### Import

```svelte
<script lang="ts">
	import { Alert } from '$lib';
</script>
```

### Props

| prop      | type                                  | default     | required | description                            |
| --------- | ------------------------------------- | ----------- | -------- | -------------------------------------- |
| `variant` | `'info' \| 'warn' \| 'error' \| 'ok'` | `'info'`    | no       | semantic variant and border color      |
| `title`   | `string`                              | `undefined` | no       | bold title line above the body content |
| `class`   | `string`                              | `''`        | no       | additional CSS classes                 |

### Slots

| slot      | description        |
| --------- | ------------------ |
| `default` | alert body content |

### Variants

**info**
`--signal` teal left border. use for neutral informational messages, tips, or context notes.

**warn**
`--status-warn` gold left border. use for non-blocking issues, deprecation notices, conditions the user should be aware of.

**error**
`--status-fail` orange left border. use for validation errors, failed operations, blocking conditions that require user action.

**ok**
`--status-ok` teal left border. use for success confirmations, completed operations, verified states. visually similar to `info` but semantically distinct.

### Anti-Confusion: Alert vs Toast

- `Alert` — persistent. stays visible until the condition changes. use for form validation errors, page-level warnings, status that the user needs to see and act on.
- `Toast` — transient. auto-dismisses after a timeout. use for operation outcomes (saved, copied, submitted).

### Accessibility

Renders with `role="alert"` so screen readers announce the message immediately on render.

### Do Not Use When

- the message should auto-dismiss — use `Toast`
- you only need a status symbol — use `StatusDot` or `StatusLine`
- you need a blocking confirmation — use `ConfirmDialog` or `Modal`

### Examples

```svelte
<!-- info alert -->
<Alert variant="info" title="mission parameters">
	coordinates are estimated based on last known position.
</Alert>

<!-- error alert below a form -->
<Alert variant="error" title="submission failed">
	the signal was interrupted. verify your connection and try again.
</Alert>

<!-- success confirmation -->
<Alert variant="ok" title="record sealed">the field report has been archived successfully.</Alert>
```

---

## Toast

> transient notification that auto-dismisses. managed via a module-level store. mount the Toast container once in your root layout.

### Import

```svelte
<script lang="ts">
	import { Toast, toastStore } from '$lib';
</script>
```

### Mounting the Container

mount `Toast` once in `src/routes/+layout.svelte`. do not mount it on individual pages:

```svelte
<!-- src/routes/+layout.svelte -->
<script lang="ts">
	import { Toast } from '$lib';
	let { children } = $props();
</script>

{@render children()}

<Toast position="bottom-right" />
```

### Triggering Toasts

from anywhere in your application, import and call `toastStore.push()`:

```ts
import { toastStore } from '$lib';

// signature:
toastStore.push(message: string, status: 'ok' | 'pend' | 'warn' | 'fail', duration?: number)

// duration defaults to 4000ms (4 seconds)
```

### Props (on the Toast container)

| prop       | type                                | default          | required | description                             |
| ---------- | ----------------------------------- | ---------------- | -------- | --------------------------------------- |
| `position` | `'bottom-right' \| 'bottom-center'` | `'bottom-right'` | no       | where toasts stack on screen            |
| `class`    | `string`                            | `''`             | no       | additional CSS classes on the container |

### Status Variants

**ok** — teal `--status-ok` accent. use after successful operations: saved, uploaded, sent.

**pend** — muted `--status-pend` accent. use for background operations in progress where the result isn't known yet.

**warn** — gold `--status-warn` accent. use for non-blocking issues the user should know about.

**fail** — orange `--status-fail` accent. use when an operation failed and the user needs to take action.

### Accessibility

Each toast is announced to screen readers via an `aria-live` region. toasts do not trap focus.

### Do Not Use When

- the message is persistent and requires action — use `Alert`
- the information is critical and must not be missed — use `Modal` or `Alert`
- the toast would fire more than once per second — debounce before calling push()

### Examples

```svelte
<!-- triggering from a form submission handler -->
<script lang="ts">
  import { toastStore } from '$lib';

  async function handleSubmit() {
    try {
      await saveRecord();
      toastStore.push('record archived', 'ok');
    } catch {
      toastStore.push('the signal interrupted — try again', 'fail');
    }
  }
</script>

<!-- triggering with custom duration (8 seconds) -->
<script lang="ts">
  toastStore.push('deployment initiated — standing by', 'pend', 8000);
</script>

<!-- in +layout.svelte: mounting the container -->
<script lang="ts">
  import { Toast } from '$lib';
  let { children } = $props();
</script>

{@render children()}
<Toast position="bottom-right" />
```

---

## Skeleton

> animated content placeholder for loading states. matches the shape of the content it will replace.

### Import

```svelte
<script lang="ts">
	import { Skeleton } from '$lib';
</script>
```

### Props

| prop      | type                                       | default     | required | description                                      |
| --------- | ------------------------------------------ | ----------- | -------- | ------------------------------------------------ |
| `variant` | `'text' \| 'card' \| 'circle' \| 'custom'` | `'text'`    | no       | shape preset                                     |
| `width`   | `string`                                   | `undefined` | no       | CSS width value — required for `custom` variant  |
| `height`  | `string`                                   | `undefined` | no       | CSS height value — required for `custom` variant |
| `class`   | `string`                                   | `''`        | no       | additional CSS classes                           |

### Variants

**text**
Full-width, short-height bar (~1rem). use to represent a single line of text.

**card**
Full-width, taller block (~8rem). use to represent a card or content block.

**circle**
48px × 48px circle. use to represent an avatar or icon.

**custom**
Set `width` and `height` explicitly. use for anything that doesn't fit the presets.

### Examples

```svelte
<!-- text placeholder for a loading paragraph -->
{#if loading}
	<Skeleton variant="text" />
	<Skeleton variant="text" class="w-3/4" />
	<Skeleton variant="text" class="w-1/2" />
{:else}
	<Text variant="body">{content}</Text>
{/if}

<!-- card placeholder -->
<Skeleton variant="card" />

<!-- avatar placeholder -->
<Skeleton variant="circle" />
```

---

## EmptyState

> zero-state message for empty lists, tables, and search results.

### Import

```svelte
<script lang="ts">
	import { EmptyState } from '$lib';
</script>
```

### Props

| prop          | type     | default     | required | description                     |
| ------------- | -------- | ----------- | -------- | ------------------------------- |
| `title`       | `string` | —           | yes      | the primary empty state message |
| `description` | `string` | `undefined` | no       | supporting explanation text     |
| `class`       | `string` | `''`        | no       | additional CSS classes          |

### Slots

| slot      | description                                           |
| --------- | ----------------------------------------------------- |
| `default` | optional CTA (e.g. a Button to create the first item) |

### Examples

```svelte
<!-- basic empty state -->
<EmptyState
	title="no records in this sector"
	description="begin a new entry to populate this archive."
/>

<!-- with a CTA -->
<EmptyState title="no signals detected">
	<Button variant="secondary">open scanner</Button>
</EmptyState>
```

---

## ErrorState

> error state for failed data loads, broken routes, or unrecoverable conditions. includes an optional retry trigger.

### Import

```svelte
<script lang="ts">
	import { ErrorState } from '$lib';
</script>
```

### Props

| prop          | type      | default                   | required | description                |
| ------------- | --------- | ------------------------- | -------- | -------------------------- |
| `title`       | `string`  | `'the signal needs rest'` | no       | primary error message      |
| `description` | `string`  | `undefined`               | no       | detail or suggested action |
| `retry`       | `boolean` | `false`                   | no       | shows a retry button       |
| `class`       | `string`  | `''`                      | no       | additional CSS classes     |

### Events

| event     | payload | when                                                           |
| --------- | ------- | -------------------------------------------------------------- |
| `onretry` | `void`  | user clicks the retry button (only fires when `retry` is true) |

### Accessibility

Rendered with `role="alert"` so screen readers announce it immediately. the retry button receives standard focus.

### Examples

```svelte
<!-- with retry -->
<script lang="ts">
	let error = $state<Error | null>(null);

	async function load() {
		error = null;
		try {
			data = await fetchData();
		} catch (e) {
			error = e as Error;
		}
	}
</script>

<!-- basic error state -->
<ErrorState
	title="the channel interrupted"
	description="coordinates could not be resolved. check your connection."
/>

{#if error}
	<ErrorState
		title="the signal needs rest"
		description="the fetch didn't complete."
		retry
		onretry={load}
	/>
{/if}
```

---

## Feedback Decision Guide

| condition                                        | use          |
| ------------------------------------------------ | ------------ |
| persistent status that users must see and act on | `Alert`      |
| transient outcome after user action              | `Toast`      |
| system health at a glance (icon only)            | `StatusDot`  |
| system health with message text                  | `StatusLine` |
| loading state — placeholder for content          | `Skeleton`   |
| list or table is empty                           | `EmptyState` |
| data load failed                                 | `ErrorState` |

---

→ next: [docs/api/layout.md](layout.md) — layout component API reference
