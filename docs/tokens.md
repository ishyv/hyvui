## Token Dictionary

Every CSS custom property in the hyvnt-ui token layer. All tokens are defined in `:root` via `src/lib/tokens/tokens.css` and are available globally once that file is imported.

---

## Backgrounds

| token            | value     | use                                      | do not use for                               |
| ---------------- | --------- | ---------------------------------------- | -------------------------------------------- |
| `--bg`           | `#08090b` | main canvas background                   | surfaces inside components — use `--bg-elev` |
| `--bg-elev`      | `#12151a` | elevated surfaces: cards, inputs, panels | the page body itself                         |
| `--bg-elev-soft` | `#0d1014` | subtle mid-level surfaces                | most cases — prefer `--bg-elev`              |

---

## Text

| token            | value     | use                                    | do not use for                             |
| ---------------- | --------- | -------------------------------------- | ------------------------------------------ |
| `--text`         | `#f0e8da` | primary readable text, headings        | decorative or secondary copy               |
| `--text-soft`    | `#d8cdb9` | body copy, secondary headings          | metadata, labels, captions                 |
| `--muted`        | `#a79d8b` | captions, metadata, placeholder text   | anything that needs to be clearly readable |
| `--muted-strong` | `#7e7568` | very low-priority labels, divider text | any text a user needs to read              |

---

## Accent

| token             | value     | use                                               | do not use for                                |
| ----------------- | --------- | ------------------------------------------------- | --------------------------------------------- |
| `--accent`        | `#c79c57` | primary brand color, focus rings, primary actions | status indicators (use `--status-*`)          |
| `--accent-strong` | `#e2ba74` | hover states over accent, highlighted accent text | default accent — too bright for resting state |
| `--signal`        | `#79a6a3` | secondary accent, teal highlights, links          | primary actions — use `--accent`              |

---

## Lines

| token           | value                       | use                                                | do not use for                            |
| --------------- | --------------------------- | -------------------------------------------------- | ----------------------------------------- |
| `--line`        | `rgba(186, 157, 108, 0.16)` | default borders, dividers, subtle separators       | anything that needs to be clearly visible |
| `--line-strong` | `rgba(198, 166, 112, 0.28)` | emphasized borders, button outlines, active states | general-use borders — too prominent       |

---

## Status

| token           | value     | use                                  | do not use for                   |
| --------------- | --------- | ------------------------------------ | -------------------------------- |
| `--status-ok`   | `#79a6a3` | success, healthy, confirmed states   | decorative teal — use `--signal` |
| `--status-pend` | `#8b8476` | pending, processing, waiting states  | muted text — use `--muted`       |
| `--status-warn` | `#c79c57` | warning, caution, attention required | general accent — use `--accent`  |
| `--status-fail` | `#b66a48` | error, failure, destructive states   | decorative orange                |

---

## Shadow

| token           | value                                                                    | use                                           |
| --------------- | ------------------------------------------------------------------------ | --------------------------------------------- |
| `--shadow-veil` | `0 40px 120px rgba(0, 0, 0, 0.45)`                                       | modals, drawers — deep overlay shadows        |
| `--shadow-card` | `0 28px 72px rgba(0, 0, 0, 0.34)`                                        | cards, panels — medium floating shadows       |
| `--focus-ring`  | `0 0 0 1px rgba(226, 186, 116, 0.3), 0 0 0 4px rgba(199, 156, 87, 0.08)` | `:focus-visible` ring on interactive elements |

---

## Motion

| token                 | value                                  | use                                                    |
| --------------------- | -------------------------------------- | ------------------------------------------------------ |
| `--transition-smooth` | `0.35s cubic-bezier(0.22, 1, 0.36, 1)` | layout transitions, reveal animations, content changes |
| `--transition-fast`   | `0.16s cubic-bezier(0.4, 0, 0.2, 1)`   | hover states, focus, small interactive feedback        |

---

## Fonts

| token         | value                                                      | use                                      |
| ------------- | ---------------------------------------------------------- | ---------------------------------------- |
| `--font-body` | `'ET Book', 'Iowan Old Style', 'Palatino Linotype', serif` | all body copy, headings, running text    |
| `--font-mono` | `'IBM Plex Mono', 'Menlo', 'Consolas', monospace`          | labels, code, system text, data readouts |

---

## Spacing

Spacing tokens use fluid clamp() values for scene-level spacing. fixed rem values for component-level spacing.

| token            | value                        | use                                           |
| ---------------- | ---------------------------- | --------------------------------------------- |
| `--space-2xs`    | `0.25rem`                    | tight inline gaps (4px)                       |
| `--space-xs`     | `0.5rem`                     | small gaps between sibling elements (8px)     |
| `--space-sm`     | `0.75rem`                    | compact padding, list gaps (12px)             |
| `--space-md`     | `1rem`                       | default component padding (16px)              |
| `--space-lg`     | `1.5rem`                     | section-internal gaps (24px)                  |
| `--space-xl`     | `2rem`                       | major component spacing (32px)                |
| `--space-2xl`    | `3rem`                       | section-level separation (48px)               |
| `--space-3xl`    | `clamp(3rem, 6vw, 5rem)`     | large section gaps (48–80px fluid)            |
| `--space-scene`  | `clamp(2.25rem, 7vw, 6rem)`  | scene-level padding (36–96px fluid)           |
| `--space-card`   | `clamp(1.1rem, 2vw, 1.6rem)` | card internal padding (18–26px fluid)         |
| `--space-inline` | `1rem`                       | inline text spacing (16px)                    |
| `--shell-max`    | `72rem`                      | maximum content container width               |
| `--shell-pad`    | `clamp(1.1rem, 3vw, 2rem)`   | page-edge padding (18–32px fluid)             |
| `--section-gap`  | `clamp(1.5rem, 3vw, 2.5rem)` | vertical gap between sections (24–40px fluid) |

---

## Radius

| token         | value | use                            |
| ------------- | ----- | ------------------------------ |
| `--radius-sm` | `2px` | inputs, badges, small controls |
| `--radius-md` | `4px` | buttons, cards, panels         |
| `--radius-lg` | `6px` | modals, large surfaces         |

---

## Controls

Used internally by input components. exposed for consistent custom control sizing.

| token                 | value     | use                                        |
| --------------------- | --------- | ------------------------------------------ |
| `--control-height-sm` | `2.25rem` | small button/input height (36px)           |
| `--control-height-md` | `2.75rem` | default button/input height (44px)         |
| `--control-pad-x`     | `0.9rem`  | horizontal padding inside controls         |
| `--control-pad-y`     | `0.7rem`  | vertical padding inside controls           |
| `--control-gap`       | `0.5rem`  | gap between icon and label inside controls |

---

## Surface Gradients

Used internally by Surface, Card, and Panel components. expose the visual layering system.

| token              | value                                                                                                                                                                       |
| ------------------ | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `--surface-card`   | `linear-gradient(135deg, rgba(199, 156, 87, 0.08), transparent 44%), rgba(10, 12, 14, 0.8)`                                                                                 |
| `--surface-panel`  | `linear-gradient(180deg, rgba(121, 166, 163, 0.08), transparent 18%), linear-gradient(135deg, rgba(199, 156, 87, 0.08), rgba(10, 12, 14, 0.82) 42%), rgba(9, 11, 13, 0.74)` |
| `--surface-soft`   | `linear-gradient(180deg, rgba(240, 232, 218, 0.015), transparent 38%), linear-gradient(135deg, rgba(199, 156, 87, 0.05), transparent 48%), rgba(11, 13, 16, 0.9)`           |
| `--surface-stroke` | `inset 0 1px 0 rgba(240, 232, 218, 0.03)`                                                                                                                                   |

---

## Z-Index

| token         | value | use                                 |
| ------------- | ----- | ----------------------------------- |
| `--z-base`    | `0`   | standard document flow              |
| `--z-raised`  | `10`  | dropdowns, popovers                 |
| `--z-overlay` | `100` | drawers, sidebars                   |
| `--z-modal`   | `200` | modals, dialogs                     |
| `--z-toast`   | `300` | toast notifications — always on top |

---

## TypeScript Token Object

for use in JavaScript/TypeScript contexts where CSS variables are not available (e.g. canvas drawing, chart configurations):

```ts
import { tokens } from '$lib';

tokens.color.bg; // '#08090b'
tokens.color.bgElev; // '#12151a'
tokens.color.text; // '#f0e8da'
tokens.color.textSoft; // '#d8cdb9'
tokens.color.muted; // '#a79d8b'
tokens.color.mutedStrong; // '#7e7568'
tokens.color.accent; // '#c79c57'
tokens.color.accentStrong; // '#e2ba74'
tokens.color.signal; // '#79a6a3'
tokens.color.statusOk; // '#79a6a3'
tokens.color.statusPend; // '#8b8476'
tokens.color.statusWarn; // '#c79c57'
tokens.color.statusFail; // '#b66a48'

tokens.font.body; // "'ET Book', 'Iowan Old Style', 'Palatino Linotype', serif"
tokens.font.mono; // "'IBM Plex Mono', 'Menlo', 'Consolas', monospace"

tokens.transition.smooth; // '0.35s cubic-bezier(0.22, 1, 0.36, 1)'
tokens.transition.fast; // '0.16s cubic-bezier(0.4, 0, 0.2, 1)'
```

full object shape:

```ts
interface Tokens {
	color: {
		bg: string;
		bgElev: string;
		text: string;
		textSoft: string;
		muted: string;
		mutedStrong: string;
		accent: string;
		accentStrong: string;
		signal: string;
		statusOk: string;
		statusPend: string;
		statusWarn: string;
		statusFail: string;
	};
	font: {
		body: string;
		mono: string;
	};
	transition: {
		smooth: string;
		fast: string;
	};
}
```

---

## Tailwind Class Mapping

all token colors are mapped to Tailwind utility classes via `tailwind.config.js`.

| CSS var           | Tailwind classes                                           | example                                   |
| ----------------- | ---------------------------------------------------------- | ----------------------------------------- |
| `--bg`            | `bg-bg`, `text-bg`, `border-bg`                            | `<div class="bg-bg">`                     |
| `--bg-elev`       | `bg-bg-elev`, `border-bg-elev`                             | `<div class="bg-bg-elev">`                |
| `--text`          | `text-text`, `bg-text`                                     | `<p class="text-text">`                   |
| `--text-soft`     | `text-text-soft`                                           | `<p class="text-text-soft">`              |
| `--muted`         | `text-muted`, `border-muted`                               | `<span class="text-muted">`               |
| `--muted-strong`  | `text-muted-strong`                                        | `<span class="text-muted-strong">`        |
| `--accent`        | `text-accent`, `bg-accent`, `border-accent`                | `<span class="text-accent">`              |
| `--accent-strong` | `text-accent-strong`, `bg-accent-strong`                   | `<span class="text-accent-strong">`       |
| `--signal`        | `text-signal`, `bg-signal`, `border-signal`                | `<span class="text-signal">`              |
| `--status-ok`     | `text-status-ok`, `bg-status-ok`, `border-status-ok`       | `<span class="text-status-ok">`           |
| `--status-pend`   | `text-status-pend`, `bg-status-pend`                       | `<span class="text-status-pend">`         |
| `--status-warn`   | `text-status-warn`, `bg-status-warn`                       | `<span class="text-status-warn">`         |
| `--status-fail`   | `text-status-fail`, `bg-status-fail`, `border-status-fail` | `<span class="text-status-fail">`         |
| `--line`          | `border-line`                                              | `<div class="border border-line">`        |
| `--line-strong`   | `border-line-strong`                                       | `<div class="border border-line-strong">` |
| `--font-body`     | `font-body`                                                | `<p class="font-body">`                   |
| `--font-mono`     | `font-mono`                                                | `<code class="font-mono">`                |
| `--shadow-veil`   | `shadow-veil`                                              | `<div class="shadow-veil">`               |
| `--radius-sm`     | `rounded-sm`                                               | `<div class="rounded-sm">`                |
| `--radius-md`     | `rounded-md`                                               | `<div class="rounded-md">`                |

transition easing functions are also available:

| CSS value                        | Tailwind class |
| -------------------------------- | -------------- |
| `cubic-bezier(0.22, 1, 0.36, 1)` | `ease-smooth`  |
| `cubic-bezier(0.4, 0, 0.2, 1)`   | `ease-fast`    |

---

→ next: [docs/api/primitives.md](api/primitives.md) — primitive component API reference
