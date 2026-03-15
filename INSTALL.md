## Prerequisites

- SvelteKit 2.x project
- Svelte 5
- Tailwind CSS v4
- Node 18+

---

## Install

the library is not yet on npm. copy `src/lib/` into your project's `src/lib/`.

alternatively, reference it as a local package in `package.json`:

```json
{
  "dependencies": {
    "hyvnt-ui": "file:../path/to/hyvnt-ui"
  }
}
```

then in `svelte.config.js`, add a path alias so imports resolve:

```js
import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';

export default defineConfig({
  plugins: [sveltekit()],
  resolve: {
    alias: {
      '$lib': 'src/lib'
    }
  }
});
```

components are then imported from `'$lib'`:

```svelte
import { Button, StatusDot } from '$lib';
```

---

## Configure Tailwind

add or replace `tailwind.config.js` at the project root:

```js
export default {
  content: ['./src/**/*.{html,js,svelte,ts}'],
  theme: {
    extend: {
      colors: {
        bg: 'var(--bg)',
        'bg-elev': 'var(--bg-elev)',
        text: 'var(--text)',
        'text-soft': 'var(--text-soft)',
        muted: 'var(--muted)',
        'muted-strong': 'var(--muted-strong)',
        accent: 'var(--accent)',
        'accent-strong': 'var(--accent-strong)',
        signal: 'var(--signal)',
        'status-ok': 'var(--status-ok)',
        'status-pend': 'var(--status-pend)',
        'status-warn': 'var(--status-warn)',
        'status-fail': 'var(--status-fail)',
      },
      fontFamily: {
        body: 'var(--font-body)',
        mono: 'var(--font-mono)',
      },
      transitionTimingFunction: {
        smooth: 'cubic-bezier(0.22, 1, 0.36, 1)',
        fast: 'cubic-bezier(0.4, 0, 0.2, 1)',
      },
      boxShadow: {
        veil: 'var(--shadow-veil)',
      },
      borderRadius: {
        sm: 'var(--radius-sm)',
        md: 'var(--radius-md)',
      },
    },
  },
  plugins: [],
};
```

---

## Set Up app.css

your `src/app.css` must import the token layer and register the Tailwind theme. order matters:

```css
@import 'tailwindcss';
@plugin '@tailwindcss/forms';
@plugin '@tailwindcss/typography';
@config '../tailwind.config.js';

@import './lib/tokens/tokens.css';
@import './lib/system/register.css';
@import './lib/system/expressions.css';
@import './lib/system/depth/depth.css';

@theme {
  --color-bg: var(--bg);
  --color-bg-elev: var(--bg-elev);
  --color-text: var(--text);
  --color-text-soft: var(--text-soft);
  --color-muted: var(--muted);
  --color-muted-strong: var(--muted-strong);
  --color-accent: var(--accent);
  --color-accent-strong: var(--accent-strong);
  --color-signal: var(--signal);
  --color-status-ok: var(--status-ok);
  --color-status-pend: var(--status-pend);
  --color-status-warn: var(--status-warn);
  --color-status-fail: var(--status-fail);
  --color-line: var(--line);
  --color-line-strong: var(--line-strong);

  --font-body: var(--font-body);
  --font-mono: var(--font-mono);

  --shadow-veil: var(--shadow-veil);

  --radius-sm: var(--radius-sm);
  --radius-md: var(--radius-md);
}

*,
*::before,
*::after {
  box-sizing: border-box;
}

html {
  background:
    radial-gradient(circle at top, rgba(198, 166, 112, 0.08), transparent 26%),
    radial-gradient(circle at 20% 20%, rgba(121, 166, 163, 0.06), transparent 24%),
    linear-gradient(180deg, #090b0d 0%, #08090b 35%, #050607 100%);
  background-attachment: fixed;
  color: var(--text);
  font-family: var(--font-body);
  font-size: 16px;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  scrollbar-gutter: stable;
}

body {
  margin: 0;
  min-height: 100vh;
  background: transparent;
  color: var(--text);
  overflow-x: hidden;
}

body > div {
  min-height: 100vh;
}

a {
  color: inherit;
}

button,
input,
select,
textarea {
  font: inherit;
}

img,
svg,
canvas {
  display: block;
  max-width: 100%;
}

:focus-visible {
  outline: none;
  box-shadow: var(--focus-ring);
}

::selection {
  background-color: rgba(199, 156, 87, 0.28);
  color: var(--text);
}
```

---

## Load Fonts

### ET Book (serif body font)

ET Book is a self-hosted font. add `@font-face` declarations to `app.css`. the font files must be in your project (e.g. `static/fonts/`):

```css
@font-face {
  font-family: 'ET Book';
  src: url('/fonts/et-book-roman-line-figures.woff2') format('woff2');
  font-weight: 400;
  font-style: normal;
  font-display: swap;
}

@font-face {
  font-family: 'ET Book';
  src: url('/fonts/et-book-bold-line-figures.woff2') format('woff2');
  font-weight: 700;
  font-style: normal;
  font-display: swap;
}

@font-face {
  font-family: 'ET Book';
  src: url('/fonts/et-book-roman-old-style-figures.woff2') format('woff2');
  font-weight: 400;
  font-style: italic;
  font-display: swap;
}
```

ET Book is available from [edwardtufte/et-book](https://github.com/edwardtufte/et-book) under the MIT license.

### IBM Plex Mono (monospace system font)

**option A — Google Fonts (recommended for development):**

add to `src/app.html` inside `<head>`, before `%sveltekit.head%`:

```html
<link rel="preconnect" href="https://fonts.googleapis.com" />
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin="anonymous" />
<link
  href="https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@400;500;600&display=swap"
  rel="stylesheet"
/>
```

**option B — self-hosted:**

download the font from [IBM/plex](https://github.com/IBM/plex) and add `@font-face` declarations to `app.css`:

```css
@font-face {
  font-family: 'IBM Plex Mono';
  src: url('/fonts/IBMPlexMono-Regular.woff2') format('woff2');
  font-weight: 400;
  font-style: normal;
  font-display: swap;
}

@font-face {
  font-family: 'IBM Plex Mono';
  src: url('/fonts/IBMPlexMono-Medium.woff2') format('woff2');
  font-weight: 500;
  font-style: normal;
  font-display: swap;
}

@font-face {
  font-family: 'IBM Plex Mono';
  src: url('/fonts/IBMPlexMono-SemiBold.woff2') format('woff2');
  font-weight: 600;
  font-style: normal;
  font-display: swap;
}
```

---

## Verify Setup

create a minimal `+page.svelte` and confirm it renders without errors:

```svelte
<script lang="ts">
  import { Button, StatusDot, Label } from '$lib';
</script>

<div style="padding: 2rem; background: var(--bg); min-height: 100dvh;">
  <Label color="accent">system check</Label>
  <StatusDot status="ok" />
  <Button variant="primary">signal acquired</Button>
</div>
```

if this renders three visible elements (gold label, teal dot, gold button), setup is complete.

---

## Optional: Apply a Register

registers shift the overall design weight of the page — from warm and editorial (`field-notebook`) to dense and precise (`mission-control`) to cool and spacious (`archive`). they do not change colors or component behavior.

apply a register to the entire page:

```svelte
<svelte:body data-register="field-notebook" />
```

or apply programmatically:

```ts
import { applyRegister } from '$lib';
applyRegister('mission-control');
```

see [docs/registers.md](docs/registers.md) for the full reference.

---

## Project Override Layer

if you need to adjust tokens for your specific project without modifying the library source, create a `src/theme.css` file and import it after the token imports in `app.css`:

```css
/* in app.css, after all library imports */
@import './theme.css';
```

```css
/* src/theme.css — your project's token overrides */
:root {
  --accent: #d4a853;          /* shift gold slightly warmer */
  --font-body: 'Freight Text', serif;  /* swap the body font */
}
```

values in `theme.css` take precedence over token defaults. register shifts still apply on top of override values.

---

→ next: [docs/tokens.md](docs/tokens.md) — complete token dictionary
