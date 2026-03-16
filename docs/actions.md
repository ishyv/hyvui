## Svelte Actions

Svelte actions are functions that run when an element is mounted to the DOM. hyvnt-ui provides four actions that add animation, visual feedback, and interaction behavior to any element.

all four actions are exported from `$lib` and respect `prefers-reduced-motion`.

---

## use:surface

**Import:** `import { surface } from '$lib'`

**Purpose:** plays the standard hyvnt-ui entrance animation on mount. the element slides up and fades in.

**Animation:** `translateY(6px) → translateY(0)`, `opacity 0 → 1`. duration: `0.5s`. easing: `ease-out`.

### Parameters

| param   | type     | default | description                                      |
| ------- | -------- | ------- | ------------------------------------------------ |
| `delay` | `number` | `0`     | milliseconds to wait before the animation starts |

### Events Dispatched

none

### Reduced Motion

when `prefers-reduced-motion: reduce` is set, the element is immediately visible with no animation. the action adds no styles and fires no transitions.

### Usage

```svelte
<!-- basic mount animation -->
<div use:surface>content appears on mount</div>

<!-- with delay -->
<div use:surface={{ delay: 200 }}>delayed entrance</div>

<!-- staggered children — compute delay from index -->
{#each items as item, i}
	<Card use:surface={{ delay: i * 120 }}>
		{item.title}
	</Card>
{/each}
```

### Do Not Use On

elements that are conditionally rendered with `{#if}` inside a frequently-toggling parent without a stable outer container. the action fires on mount, so toggling `{#if}` destroys and recreates the node, replaying the animation on every toggle. if you want the animation only on first appearance, hoist the `{#if}` above the element with `use:surface`.

```svelte
<!-- this replays the animation every time shown becomes true -->
{#if shown}
	<div use:surface>content</div>
	<!-- fires on every mount -->
{/if}

<!-- better: outer container persists; control visibility inside -->
<div use:surface>
	{#if shown}
		<div>content</div>
	{/if}
</div>
```

---

## use:echo

**Import:** `import { echo } from '$lib'`

**Purpose:** adds a gold radial gradient overlay that flashes on click. signals that the click was received — a tactile confirmation effect.

### Parameters

none — `use:echo` takes no options.

### Events Dispatched

none

### How It Works

on click, a `<span>` is absolutely positioned inside the element with a radial gradient centered at the click coordinates (`rgba(199, 156, 87, 0.22)` → transparent). it fades to full opacity in 0.15s, then fades out over 0.2s, then is removed from the DOM.

the action sets `position: relative` on the element if it is `position: static`, and sets `overflow: hidden` to contain the overlay.

### Reduced Motion

the overlay is not added when `prefers-reduced-motion: reduce` is set.

### Usage

```svelte
<!-- on a button (Button component has echo={true} prop) -->
<Button variant="primary" echo>deploy</Button>

<!-- on a custom interactive element -->
<div use:echo role="button" tabindex="0" onclick={handleClick}>click me</div>

<!-- on a card to give it a tactile click response -->
<Card use:echo onclick={selectCard}>
	{entry.title}
</Card>
```

### Do Not Use On

elements with `overflow: visible` that need to show content outside their bounds — `use:echo` sets `overflow: hidden`. also avoid on very small elements where the gradient would dominate the entire surface.

---

## use:reveal

**Import:** `import { reveal } from '$lib'`

**Purpose:** reveals a child element when the parent is hovered. the target child starts invisible and transitions in on hover, transitions out on mouse leave.

### Parameters

| param    | type     | default | description                                                |
| -------- | -------- | ------- | ---------------------------------------------------------- |
| `target` | `string` | —       | **required.** CSS selector for the child element to reveal |

### Events Dispatched

none

### How It Works

on mount, the action sets `opacity: 0` and `translateY(4px)` on the target element. on `mouseenter` and `focusin`, it sets `opacity: 1` and `translateY(0)` with a `0.25s ease-out` transition. on `mouseleave` and `focusout`, it reverses.

### Reduced Motion

when `prefers-reduced-motion: reduce`, the transform is omitted — opacity still transitions, but without the vertical slide.

### Usage

```svelte
<!-- reveal an overlay action row on hover -->
<div use:reveal={{ target: '.card-actions' }}>
	<Text as="h3" variant="heading">{entry.title}</Text>
	<Text variant="body">{entry.excerpt}</Text>

	<div class="card-actions">
		<Button variant="ghost" size="sm">view</Button>
		<Button variant="ghost" size="sm">archive</Button>
	</div>
</div>

<!-- reveal a metadata footer on hover -->
<Card use:reveal={{ target: '.meta' }}>
	<Text as="h3" variant="heading">{item.title}</Text>
	<div class="meta">
		<Text variant="caption" color="muted">{item.date}</Text>
	</div>
</Card>
```

### Do Not Use When

- the content that should be hidden also needs to be keyboard-accessible without triggering hover — `focusin` does trigger reveal, but if the hidden content contains focusable elements, users will never discover them. for accessibility-critical content, use always-visible elements.

---

## use:resolve

**Import:** `import { resolve } from '$lib'`

**Purpose:** animates a status change on an element. a brief colored overlay flashes across the element to signal a transition outcome — success, warning, failure, or pending.

### Parameters

`use:resolve` has an unusual signature compared to the other actions. instead of an options object, it takes a **callback function** that receives an action object. you call the action's `trigger` method programmatically when a status change occurs.

```ts
use: resolve = { fn };
// where fn is: (action: { trigger: (status: 'ok' | 'warn' | 'fail' | 'pend') => void }) => void
```

### Events Dispatched

| event           | detail          | when                          |
| --------------- | --------------- | ----------------------------- |
| `resolve:start` | `ResolveStatus` | the flash animation begins    |
| `resolve:end`   | `ResolveStatus` | the flash animation completes |

these are custom DOM events dispatched on the node. you can listen with `addEventListener` if needed.

### How It Works

when `trigger(status)` is called:

1. a `<span>` is absolutely positioned inside the element with a background color matching the status (`--status-ok`, `--status-warn`, etc.)
2. the span fades to `opacity: 0.12` over 0.12s
3. after 200ms, it fades back to 0 over 0.4s
4. after 450ms more, it is removed from the DOM and `resolve:end` fires

the action sets `position: relative` on the element if it is `position: static`.

### Reduced Motion

the overlay is skipped entirely. `resolve:start` and `resolve:end` both fire synchronously.

### Usage

```svelte
<!-- basic resolve — a form that flashes green on success -->
<script lang="ts">
	import { resolve } from '$lib';
	import type { ResolveAction } from '$lib';

	let resolveAction: ResolveAction;
	let isSubmitting = $state(false);

	async function handleSubmit() {
		isSubmitting = true;
		try {
			await saveRecord();
			resolveAction.trigger('ok');
		} catch {
			resolveAction.trigger('fail');
		} finally {
			isSubmitting = false;
		}
	}
</script>

<form
	use:resolve={(action) => {
		resolveAction = action;
	}}
	onsubmit|preventDefault={handleSubmit}
>
	<Input bind:value={name} label="callsign" />
	<Textarea bind:value={notes} label="field notes" />
	<Button type="submit" variant="primary" loading={isSubmitting} disabled={isSubmitting}>
		{isSubmitting ? 'archiving' : 'archive entry'}
	</Button>
</form>
```

### Complete Example with Toast Integration

```svelte
<script lang="ts">
	import { resolve, toastStore } from '$lib';
	import type { ResolveAction } from '$lib';

	let resolveAction: ResolveAction;
	let submitting = $state(false);

	async function handleSubmit() {
		submitting = true;
		resolveAction.trigger('pend'); // signal start

		try {
			await sendTransmission(formData);
			resolveAction.trigger('ok');
			toastStore.push('transmission sent', 'ok');
		} catch (err) {
			resolveAction.trigger('fail');
			toastStore.push('the channel interrupted — try again', 'fail');
		} finally {
			submitting = false;
		}
	}
</script>

<Panel use:resolve={(a) => (resolveAction = a)}>
	{#snippet header()}
		<Text as="h2" variant="heading">send transmission</Text>
	{/snippet}

	<Stack gap="var(--space-md)">
		<Input bind:value={subject} label="subject" />
		<Textarea bind:value={body} label="message" autoresize />
		<Button variant="primary" loading={submitting} disabled={submitting} onclick={handleSubmit}>
			{submitting ? 'transmitting' : 'send'}
		</Button>
	</Stack>
</Panel>
```

### Do Not Use When

- you just need a toast notification — `use:resolve` is for the element itself, not for global notifications
- the element does not have a stable DOM position — the overlay is absolute-positioned; if the element moves during the animation, the overlay drifts

---

→ next: [docs/depth.md](depth.md) — depth system reference
