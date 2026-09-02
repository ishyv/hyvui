# token dictionary

`src/lib/tokens/source/tokens.json` is the only authored token source. The repository generates CSS, TypeScript, register declarations, theme semantic values, and grade recipes from it:

```sh
npm run tokens:generate
npm run tokens:check
```

`tokens:check` exits unsuccessfully when a generated file differs from the source. Do not edit generated files by hand.

## semantic color roles

| variable                                                         | role                           |
| ---------------------------------------------------------------- | ------------------------------ |
| `--bg`                                                           | page canvas                    |
| `--bg-elev`                                                      | elevated controls and surfaces |
| `--bg-elev-soft`                                                 | quiet elevated surface         |
| `--text`                                                         | primary readable copy          |
| `--text-soft`                                                    | body and secondary copy        |
| `--muted`                                                        | supporting metadata            |
| `--muted-strong`                                                 | low-priority interface labels  |
| `--accent`                                                       | human, warm, action signal     |
| `--accent-strong`                                                | emphasized warm signal         |
| `--signal`                                                       | machine, cool, data signal     |
| `--line`                                                         | quiet separator                |
| `--line-strong`                                                  | active or structural separator |
| `--status-ok`, `--status-pend`, `--status-warn`, `--status-fail` | state communication            |

These are semantic roles, not a license to add arbitrary hues. Themes may remap the roles and add material variables. Grades may remap them inside their nearest scope. The guaranteed baseline is sRGB. Optional Oklch and Display P3 variables are layered after that baseline and always have a fallback.

## typography roles

Base family tokens describe the available families:

- `--font-body` is the editorial serif fallback stack;
- `--font-mono` is the interface and data fallback stack.

Components consume the active register roles instead:

- `--reg-font-primary` for prose, headings, and expressive text;
- `--reg-font-ui` for labels, metadata, navigation, controls, and readouts.

Register also supplies heading tracking, heading leading, body size, label size, ornament opacity, and spacing scale. See [the font contract](fonts.md) and [registers](registers.md).

## rhythm and dimensions

The source defines fluid `--text-*` and `--space-*` scales, shell width and padding, control heights and padding, radii, container thresholds, safe-area insets, transitions, key-light geometry, shadows, texture defaults, and z-index roles.

Use `gap` for sibling rhythm. Reserve margins for prose rhythm or an explicit external relationship. Prefer the token scale over one-off values when a relationship is part of the library vocabulary.

## contexts

`data-weight`, `data-theme`, and `data-grade` are independent nearest-ancestor context channels. The generated declarations preserve each channel when another changes. A grade is a semantic color recipe, not a document-wide bitmap filter.

```svelte
<section data-weight="archive" data-theme="arcane" data-grade="twilight">
	<!-- descendants read archive typography, arcane material, twilight grade -->
</section>
```

## TypeScript

```ts
import {
  gradeRegisters,
  themeRegisters,
  tokens,
  weightRegisters,
  type AppearanceContext,
  type GradeRegister,
  type ThemeRegister,
  type WeightRegister,
} from "@hyvnt/hyvui";

tokens.color.accent;
tokens.font.body;
weightRegisters;
themeRegisters;
gradeRegisters;
```

The public package does not export Tailwind class dictionaries. Consumer applications use CSS variables, component props, and documented attributes.
