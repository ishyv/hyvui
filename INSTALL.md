# install hyvui v1

HyvUI v1 is a Svelte 5 component library with a deliberately opinionated visual language and a browser-native foundation. The consumer contract is CSS, Svelte props, semantic variables, and ordinary DOM attributes. Tailwind is demo tooling only.

## prerequisites

- Svelte 5
- Node 18 or newer
- a modern Chromium, Firefox, or WebKit browser

## install

```sh
npm install @hyvnt/hyvui
```

Import the base stylesheet once from the application entry point:

```ts
import "@hyvnt/hyvui/styles.css";
```

Import optional material themes and the self-hosted font preset explicitly:

```ts
import "@hyvnt/hyvui/themes.css";
import "@hyvnt/hyvui/fonts.css";
```

The base stylesheet does not load fonts or make network requests. If `fonts.css` is omitted, the browser uses the fallback stacks in `--font-body` and `--font-mono`. See [the font contract](docs/fonts.md).

## first composition

```svelte
<script lang="ts">
	import {
		AppShell,
		Button,
		Grid,
		Text
	} from '@hyvnt/hyvui';
</script>

<AppShell weight="mission-control" theme="hextech" grade="dailies">
	<section data-theme="arcane" data-grade="twilight">
		<Text as="h1" variant="heading">a page with a pulse</Text>
		<Grid minColWidth="18rem">
			<Button variant="primary">continue</Button>
			<Button variant="secondary">inspect</Button>
		</Grid>
	</section>
</AppShell>
```

`AppShell` is a document-level convenience. Nested composition should use ordinary `data-weight`, `data-theme`, and `data-grade` attributes so each channel inherits from its nearest context root.

## layout rules

`Grid` automatic mode uses intrinsic CSS tracks. It does not measure itself in JavaScript:

```svelte
<Grid minColWidth="16rem" gap="var(--space-lg)">
	{#each records as record}
		<Card>{record.title}</Card>
	{/each}
</Grid>
```

For an authored cap or asymmetry, use a template:

```svelte
<Grid mode="template" cols="repeat(3, minmax(0, 1fr))">
	<!-- intentionally three tracks -->
</Grid>
```

Use normal flow for the document, flex for one-dimensional relationships, grid for track relationships, container queries for component-local adaptation, and `gap` for sibling spacing. Absolute positioning is for stage layers and ornaments. Transforms are not a layout system.

## tokens and customization

The canonical token source is generated into the published CSS and TypeScript outputs. Use semantic variables:

```css
.local-panel {
  background: var(--surface-card);
  color: var(--text);
  border-color: var(--line);
}
```

Do not target private `.hyvui-*` classes for normal customization. Put an authored override after the library stylesheet, set a semantic variable on the nearest context root, or use a component prop. Component typography uses `--reg-font-primary` and `--reg-font-ui` so local appearance contexts remain coherent.

## forms and overlays

Controls forward family-appropriate native attributes. Provide a stable `id` when an external label or description needs it. Without one, field components use a nested label and avoid inventing an id.

`Modal` and `Drawer` are native modal dialogs. `Popover` is nonmodal and anchored. `Toast` is live-announced and never steals focus. Read [the overlay contract](docs/overlay-contract.md) before composing a custom overlay.

## v1 migration

v1 has no v0.6 compatibility aliases. Replace `data-register` with `data-weight`, `applyRegister` with `applyWeight`, remove `AppShell loadFonts`, replace automatic `Grid maxCols` with an explicit template, and remove `themeClasses` imports. The complete checklist is in [migration-v1.md](docs/migration-v1.md).

## local verification

From the repository checkout:

```sh
npm run tokens:check
npm run check
npm run build
npm run lint
npm run test:next
npm run test:e2e
npm pack --dry-run
```
