# migrating to hyvui v1

v1 is a deliberate breaking release. It keeps the visual language of the v0.6 line, but replaces ambiguous global behavior with browser-native layout, scoped appearance, generated tokens, and explicit package entries.

## install the foundation

Import the base stylesheet once from the application entry point:

```ts
import "@hyvnt/hyvui/styles.css";
```

Themes and the optional self-hosted font preset are separate choices:

```ts
import "@hyvnt/hyvui/themes.css";
import "@hyvnt/hyvui/fonts.css";
```

Tailwind is no longer part of the consumer installation contract. It may remain in the HyvUI demo application, but components must be styled through their props, semantic CSS variables, ordinary CSS, and documented data attributes.

## appearance vocabulary

Replace the old names everywhere:

| v0.6                 | v1                         |
| -------------------- | -------------------------- |
| `data-register`      | `data-weight`              |
| `applyRegister()`    | `applyWeight()`            |
| `AppShell loadFonts` | remove the prop            |
| global grade filter  | scoped `data-grade` recipe |

`data-weight`, `data-theme`, and `data-grade` are independent channels. Each resolves from the nearest ancestor that defines that channel. Use a section when only part of a page should change:

```svelte
<section data-weight="archive" data-theme="arcane" data-grade="twilight">
  <ArchiveScene title="quiet evidence" />
</section>
```

`AppShell` remains a document-level convenience. It accepts `weight`, `theme`, and `grade`, owns the body attributes while mounted, and restores the previous body state when nested shells leave. Use scoped attributes for composition inside an application.

For imperative consumers, use `readAppearanceContext(node)` and `onAppearanceChange(node, listener)`. A portalled surface must snapshot the context of its anchor.

## layout changes

Automatic `Grid` no longer accepts `maxCols`. It is CSS-native:

```svelte
<Grid minColWidth="18rem" gap="var(--space-lg)">
  <!-- repeated content -->
</Grid>
```

Use template mode for authored asymmetry or a hard cap:

```svelte
<Grid mode="template" cols="repeat(3, minmax(0, 1fr))">
  <!-- deliberately three tracks -->
</Grid>
```

Normal flow remains the semantic default. Use flex for one-dimensional relationships, grid for tracks, container queries for component-local adaptation, `gap` for siblings, and absolute positioning only for stage layers or ornaments.

## component and styling changes

- `themeClasses` is removed from the public barrel. Use component APIs or semantic variables such as `--accent`, `--signal`, and `--surface-card`.
- Do not target private `.hyvui-*` classes for application customization. Put a documented override after `styles.css`, or set a token on the nearest context root.
- Components use register-level typography roles. Applications should set `--reg-font-primary` or `--reg-font-ui` only when deliberately creating a new local voice.
- Form controls forward family-appropriate native attributes. Supply a stable `id` whenever an external label or description needs an association. When no external association is needed, field components use a nested label and do not invent an id.
- Grades remap semantic variables inside their scope. They do not apply a full-scene `filter` to text, bitmaps, or portals.
- `Modal` and `Drawer` are native modal dialogs. `Popover` is nonmodal and anchored. See [the overlay contract](overlay-contract.md).

## suggested migration order

1. Import `styles.css` and remove the consumer Tailwind setup.
2. Replace the appearance vocabulary and remove `loadFonts`.
3. Replace automatic `Grid maxCols` usage with template mode where a cap is intentional.
4. Add stable field ids only where external labelling or description requires them.
5. Import `themes.css` and `fonts.css` explicitly when those presets are needed.
6. Move private-class overrides to variables, component props, or data attributes.
7. Run `npm run tokens:check`, `npm run check`, `npm run build`, and the browser matrix before publishing.

There are no v0.6 compatibility aliases in v1. Keep the old line available while migrating an application, then remove the old imports and vocabulary in one reviewable change.
