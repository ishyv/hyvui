# font preset

`@hyvnt/hyvui/fonts.css` is an optional, self-hosted preset. It makes the intended typographic voice available without a network request:

| family        | files                                                                                 | supported styles and weights |
| ------------- | ------------------------------------------------------------------------------------- | ---------------------------- |
| ET Book       | `et-book-roman.woff`, `et-book-italic.woff`                                           | roman 400, italic 400        |
| IBM Plex Mono | `IBMPlexMono-Regular.woff2`, `IBMPlexMono-Medium.woff2`, `IBMPlexMono-SemiBold.woff2` | 400, 500, 600                |

The preset uses `font-display: swap` and is never imported by `AppShell`. Applications opt in explicitly:

```ts
import "@hyvnt/hyvui/styles.css";
import "@hyvnt/hyvui/fonts.css";
```

Without the preset, the browser falls back to the families in `--font-body` and `--font-mono`: system editorial serif faces for prose, and the local monospace stack for interface text. The page remains usable offline and no external font request is attempted.

The preset includes the ET Book MIT notice and the IBM Plex Mono SIL Open Font License notice. The font files are published with the package under `dist/fonts/`.

The library uses `font-display: swap` because content and source order must remain available while fonts arrive. A composition must not depend on the final font metrics for structural correctness. Give long headings a measured maximum width, use `text-wrap: balance` where appropriate, and let normal flow absorb the swap. The stylesheet applies `font-size-adjust: from-font` when supported to reduce fallback metric drift.

The supported roles are:

- `--reg-font-primary` for body copy, headings, and expressive text;
- `--reg-font-ui` for labels, metadata, navigation, controls, and readouts.

Weight/register context selects these roles. Do not bypass the active context with `--font-body` or `--font-mono` inside a component.
