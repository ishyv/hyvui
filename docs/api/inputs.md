## Inputs

Form controls and interactive elements. all input components support a `disabled` prop. all text inputs are bindable via Svelte's `bind:value`.

---

## Button

> the primary interactive trigger. four variants cover the full range of action weight from primary CTA to destructive confirmation.

### Import

```svelte
<script lang="ts">
  import { Button } from '$lib';
</script>
```

### Props

| prop | type | default | required | description |
|---|---|---|---|---|
| `variant` | `'primary' \| 'secondary' \| 'ghost' \| 'destructive'` | `'secondary'` | no | visual weight and semantic role |
| `size` | `'sm' \| 'md'` | `'md'` | no | button height and padding |
| `disabled` | `boolean` | `false` | no | disables the button; prevents clicks and applies reduced opacity |
| `loading` | `boolean` | `false` | no | shows a pulsing dot animation; does not automatically disable the button |
| `echo` | `boolean` | `false` | no | adds a gold radial ripple on click via `use:echo` |
| `type` | `'button' \| 'submit' \| 'reset'` | `'button'` | no | HTML button type |
| `href` | `string` | `undefined` | no | if set, renders as an `<a>` element instead of `<button>` |
| `target` | `string` | `undefined` | no | anchor target (`_blank`, etc.) — only used when `href` is set |
| `rel` | `string` | `undefined` | no | anchor rel attribute — only used when `href` is set |
| `class` | `string` | `''` | no | additional CSS classes |

### Slots

| slot | description |
|---|---|
| `default` | button label content |

### Events

| event | payload | when |
|---|---|---|
| `onclick` | `MouseEvent` | user clicks the button (not fired when disabled) |

### Variants

**primary**
Gold gradient background (`--accent` → `--accent-strong`), dark text (`--bg`), IBM Plex Mono, uppercase, tracked. uses `--shadow-card` for elevation. hover: gradient brightens, slight translateY lift.

use for: the single most important action on a surface — submit, deploy, confirm the primary intent.

do not use more than one primary button per visible area. do not use for navigation — use `ghost` or an anchor.

**secondary**
Transparent background, `--line-strong` border. hover: left-edge gold gradient overlay + `translateX(2px)`. IBM Plex Mono, uppercase.

use for: secondary actions that support the primary — cancel, back, view details.

do not use when the action is destructive — use `destructive`. do not confuse with `ghost` — secondary has a visible border at rest; ghost does not.

**ghost**
No border, no background at rest. text in `--muted`, hover: `--text`. IBM Plex Mono, uppercase.

use for: tertiary actions, navigation-adjacent triggers, actions inside already-styled containers (cards, headers, sidebars) where another border would add visual noise.

do not use as the primary action on a page. do not confuse with `secondary` — ghost is invisible at rest; secondary has a border.

**destructive**
Transparent background, `--status-fail` border at low opacity (~15%). hover: subtle fail-color tint overlay. IBM Plex Mono, uppercase.

use for: irreversible actions — delete, revoke, remove, unlink. always pair with a `ConfirmDialog` for actions that cannot be undone.

do not use for actions that are simply negative in tone — only for truly destructive operations.

### Sizes

**md** (default)
`--control-height-md` (44px). standard button height matching other form controls. use in most contexts.

**sm**
`--control-height-sm` (36px). compact button. use inside table rows, tight toolbars, or inline with text.

### The `loading` / `disabled` Interaction

during form submission, **both `loading` and `disabled` should be true simultaneously**:

```svelte
<Button variant="primary" loading={isSubmitting} disabled={isSubmitting}>
  {isSubmitting ? 'deploying' : 'deploy'}
</Button>
```

- `loading` shows the pulsing dot animation
- `disabled` prevents double-submission and reduces opacity to signal inactivity

setting only `loading` without `disabled` leaves the button clickable during submission — a common bug. setting only `disabled` hides the loading indicator and gives no progress feedback.

### Accessibility

Buttons rendered as `<button>` receive focus, respond to Enter and Space, and announce their label to screen readers. buttons rendered via `href` are `<a>` elements — they receive focus and respond to Enter only.

`disabled` buttons are not focusable. `loading` buttons should have an `aria-label` or updated label text to announce the in-progress state.

### Do Not Use When

- you need a link that looks like text — use an `<a>` with appropriate styling
- you need a toggle — use `Toggle` or `Checkbox`
- the button opens a dropdown menu — use `DropdownMenu`

### Examples

```svelte
<!-- primary CTA -->
<Button variant="primary">deploy</Button>

<!-- async submission with loading + disabled state -->
<script lang="ts">
  let isSubmitting = $state(false);

  async function handleSubmit() {
    isSubmitting = true;
    try {
      await submitForm();
    } finally {
      isSubmitting = false;
    }
  }
</script>

<Button
  variant="primary"
  loading={isSubmitting}
  disabled={isSubmitting}
  onclick={handleSubmit}
>
  {isSubmitting ? 'deploying' : 'deploy'}
</Button>

<!-- destructive action paired with confirm dialog -->
<Button variant="destructive" onclick={() => (confirmOpen = true)}>
  delete record
</Button>

<!-- ghost button as a navigation action inside a card -->
<Button variant="ghost" href="/archive">view archive</Button>

<!-- small secondary in a toolbar -->
<Button variant="secondary" size="sm">export</Button>
```

---

## Input

> single-line text input with optional label, hint, and error message.

### Import

```svelte
<script lang="ts">
  import { Input } from '$lib';
</script>
```

### Props

| prop | type | default | required | description |
|---|---|---|---|---|
| `type` | `'text' \| 'number' \| 'password' \| 'email' \| 'search'` | `'text'` | no | HTML input type |
| `value` | `string` | `''` | no | bindable input value |
| `placeholder` | `string` | `''` | no | placeholder text |
| `label` | `string` | `undefined` | no | visible label above the input |
| `error` | `string` | `undefined` | no | error message displayed below; applies error styling to the border |
| `hint` | `string` | `undefined` | no | helper text displayed below the input (hidden when `error` is set) |
| `disabled` | `boolean` | `false` | no | disables the input |
| `class` | `string` | `''` | no | additional CSS classes |

### Events

| event | payload | when |
|---|---|---|
| `oninput` | `Event` | user types (every keystroke) |
| `onchange` | `Event` | value committed (blur or Enter) |

### Accessibility

Input is associated with its label via a generated `id`/`for` pair. error messages use `aria-describedby`. disabled inputs have `aria-disabled="true"`.

### Do Not Use When

- you need multi-line input — use `Textarea`
- you need a select list — use `Select`
- you need a file picker — use `FileUpload`

### Examples

```svelte
<!-- basic bound input -->
<script lang="ts">
  let callsign = $state('');
</script>

<Input bind:value={callsign} label="callsign" placeholder="enter designation" />

<!-- with error state -->
<Input
  value={email}
  type="email"
  label="contact address"
  error={emailError}
  hint="used for mission updates only"
/>
```

---

## Textarea

> multi-line text input with optional auto-resize.

### Import

```svelte
<script lang="ts">
  import { Textarea } from '$lib';
</script>
```

### Props

| prop | type | default | required | description |
|---|---|---|---|---|
| `value` | `string` | `''` | no | bindable textarea value |
| `rows` | `number` | `4` | no | initial number of visible rows |
| `placeholder` | `string` | `''` | no | placeholder text |
| `label` | `string` | `undefined` | no | visible label above the textarea |
| `error` | `string` | `undefined` | no | error message; applies error border styling |
| `hint` | `string` | `undefined` | no | helper text below the textarea |
| `autoresize` | `boolean` | `false` | no | automatically expands to fit content as the user types |
| `disabled` | `boolean` | `false` | no | disables the textarea |
| `class` | `string` | `''` | no | additional CSS classes |

### Events

| event | payload | when |
|---|---|---|
| `oninput` | `Event` | user types |

### Accessibility

Same pattern as `Input` — label association via `id`/`for`, error via `aria-describedby`.

### Examples

```svelte
<!-- auto-resizing notes field -->
<script lang="ts">
  let notes = $state('');
</script>

<Textarea
  bind:value={notes}
  label="field notes"
  placeholder="record observations..."
  autoresize
/>

<!-- fixed-height with error -->
<Textarea
  bind:value={report}
  rows={8}
  label="mission report"
  error={reportError}
/>
```

---

## Select

> dropdown selector for a fixed list of options.

### Import

```svelte
<script lang="ts">
  import { Select } from '$lib';
</script>
```

### Props

| prop | type | default | required | description |
|---|---|---|---|---|
| `options` | `{ value: string; label: string }[]` | `[]` | yes | array of selectable options |
| `value` | `string` | `''` | no | bindable selected value |
| `label` | `string` | `undefined` | no | visible label above the select |
| `error` | `string` | `undefined` | no | error message; applies error border styling |
| `disabled` | `boolean` | `false` | no | disables the select |
| `class` | `string` | `''` | no | additional CSS classes |

### Events

| event | payload | when |
|---|---|---|
| `onchange` | `Event` | user selects an option |

### Examples

```svelte
<script lang="ts">
  const regions = [
    { value: 'north', label: 'northern sector' },
    { value: 'south', label: 'southern sector' },
    { value: 'transit', label: 'transit corridor' },
  ];
  let region = $state('north');
</script>

<Select options={regions} bind:value={region} label="deployment region" />
```

---

## Checkbox

> binary on/off selection with an optional label.

### Import

```svelte
<script lang="ts">
  import { Checkbox } from '$lib';
</script>
```

### Props

| prop | type | default | required | description |
|---|---|---|---|---|
| `checked` | `boolean` | `false` | no | bindable checked state |
| `label` | `string` | `undefined` | no | visible label beside the checkbox |
| `disabled` | `boolean` | `false` | no | disables the checkbox |
| `class` | `string` | `''` | no | additional CSS classes |

### Events

| event | payload | when |
|---|---|---|
| `onchange` | `Event` | checked state changes |

### Accessibility

Associates label via `id`/`for`. responds to Space to toggle. `aria-checked` reflects current state.

### Examples

```svelte
<script lang="ts">
  let acknowledged = $state(false);
</script>

<Checkbox bind:checked={acknowledged} label="acknowledge risk" />

<!-- disabled pre-checked -->
<Checkbox checked={true} disabled label="system verified" />
```

---

## Toggle

> pill-shaped on/off switch. semantically equivalent to `Checkbox` but with a distinct sliding visual.

### Import

```svelte
<script lang="ts">
  import { Toggle } from '$lib';
</script>
```

### Props

| prop | type | default | required | description |
|---|---|---|---|---|
| `checked` | `boolean` | `false` | no | bindable checked state |
| `label` | `string` | `undefined` | no | visible label beside the toggle |
| `disabled` | `boolean` | `false` | no | disables the toggle |
| `class` | `string` | `''` | no | additional CSS classes |

### Events

| event | payload | when |
|---|---|---|
| `onchange` | `Event` | toggle state changes |

### Do Not Use When

- the choice is part of a form submission — use `Checkbox` (toggles are better for immediate-effect settings)
- you need a group of related options — use multiple `Checkbox` components

### Examples

```svelte
<script lang="ts">
  let alertsEnabled = $state(true);
</script>

<Toggle bind:checked={alertsEnabled} label="enable alerts" />
```

---

## FileUpload

> file picker with drag-and-drop support. fires an event with the selected `File[]` array.

### Import

```svelte
<script lang="ts">
  import { FileUpload } from '$lib';
</script>
```

### Props

| prop | type | default | required | description |
|---|---|---|---|---|
| `accept` | `string` | `undefined` | no | MIME types or file extensions to accept (e.g. `'image/*'`, `'.pdf,.doc'`) |
| `multiple` | `boolean` | `false` | no | allow selecting multiple files |
| `label` | `string` | `undefined` | no | visible label above the drop zone |
| `disabled` | `boolean` | `false` | no | disables the file picker |
| `class` | `string` | `''` | no | additional CSS classes |

### Events

| event | payload | when |
|---|---|---|
| `onfiles` | `File[]` | user selects or drops files |

### Accessibility

The drop zone is keyboard accessible — Tab to focus, Enter or Space to open the file dialog.

### Examples

```svelte
<script lang="ts">
  let attachments: File[] = $state([]);

  function handleFiles(files: File[]) {
    attachments = files;
  }
</script>

<FileUpload
  accept="image/*,.pdf"
  multiple
  label="attach documents"
  onfiles={handleFiles}
/>

{#if attachments.length}
  <Text variant="caption" color="muted">
    {attachments.length} file(s) selected
  </Text>
{/if}
```

---

→ next: [docs/api/feedback.md](feedback.md) — feedback component API reference
