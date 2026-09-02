# Browser foundation and library architecture reconnaissance

**Date:** 2026-09-01  
**Status:** research complete, v1 foundation implemented and validated  
**Scope:** browser rendering, layout, styling boundaries, typography, color, device variation, runtime effects, consumer setup, and documentation friction in the current HyvUI library.

## Executive decision

HyvUI should keep the existing direction, but make the browser itself the first constraint system.

The recommended foundation is a deliberately limited hybrid:

1. semantic HTML and normal CSS layout are the default;
2. Svelte provides compile-time component structure and typed intent;
3. CSS custom properties provide the visual grammar and context inheritance;
4. static, inspectable composition metadata expresses relationships that should survive rendering;
5. JavaScript is opt-in and local, reserved for interactions, anchoring, overflow fallback, and geometry that CSS genuinely cannot express.

This preserves the artistic ambition without turning the library into a page-wide layout solver. The browser already contains a highly optimized constraint engine. HyvUI should teach authors how to use it, then add only the missing artistic vocabulary around it.

The central finding is not that the current library lacks expressive power. It is that several important contracts are implicit or distributed. The next work should make those contracts explicit before adding more adaptive behavior.

## The design principle carried forward from the art study

The reference folder did not cohere because every image used the same color, texture, or subject. It cohered because each image had a disciplined system under pressure:

- a real grid, margin, scale, or institutional frame;
- one dominant visual event rather than many competing decorations;
- negative space used as an active material;
- contrast used to express a relationship, not merely to decorate;
- surface damage, grain, annotation, or light behaving like evidence of a world;
- typography taking unequal roles, from architectural mass to tiny witness;
- a route for the eye, such as a fall, scan, procession, intrusion, or reveal;
- a controlled rupture that becomes meaningful because the underlying system is trustworthy.

The software translation is:

> **A stable browser system should carry the composition. Art direction should apply pressure to that system intentionally, locally, and inspectably.**

This gives us a useful test for every future feature. If a feature makes the result more expressive but less predictable, less accessible, harder to inspect, or more dependent on a particular browser rasterizer, it has not earned a place in the foundation. If it makes relationships clearer while leaving semantic flow and graceful degradation intact, it is promising.

This is consistent with the existing art research in `docs/research/art-taste-reference-analysis.md`, the biome work in `docs/research/art-biomes/biome-architecture.md`, and the static composition decision in `docs/decisions/0001-hyvui-next-composition-architecture.md`.

## Research method and evidence boundary

This pass combined four kinds of evidence:

- direct inspection of the current source, public barrel, token files, package metadata, routes, examples, tests, and documentation;
- a package dry run to inspect what would actually ship;
- the existing art and composition research, so browser decisions serve the intended visual language rather than flattening it;
- primary browser and platform references, including the browser rendering pipeline, CSS visual formatting, containment, cascade layers, CSS Color, WCAG, CSS Fonts, device pixels, and Svelte effects.

This document began as a pre-v1 reconnaissance. Its baseline findings remain useful as evidence for the decisions below, but the implementation now records the resulting v1 contracts and verification state rather than treating those findings as unresolved.

### Current verification snapshot

The v1 foundation is internally buildable and has a cross-engine acceptance fixture:

- `npm run tokens:check`: passed, with generated output in parity with the canonical JSON source;
- `npm run check`: passed, 0 errors and 0 warnings;
- `npm run build`: passed, including `svelte-package` and `publint`;
- `npm run lint`: passed;
- `npm run test:next`: passed, 95 tests;
- `npm run test:e2e`: passed, 159 tests across the configured Chromium, Firefox, WebKit, and DPR projects;
- `npm pack --dry-run`: passed, 331 package files, with private Next, showcase, and example internals excluded.

The remaining cross-browser contract is intentionally about invariant geometry, semantics, contrast, focus, source order, and graceful degradation rather than identical rasterized pixels. The foundation fixture covers the current width, DPR, reduced-motion, font, overlay, context, and canvas gates; future additions should extend that fixture rather than bypass it.

## What the browser actually does with HyvUI

Svelte compilation is not the rendering system. It produces JavaScript, DOM instructions, and component CSS. The browser still owns the final interpretation.

The useful simplified pipeline is:

```text
HTML + Svelte output + CSS + assets
        ↓
DOM + CSSOM
        ↓
cascade and computed style
        ↓
layout and intrinsic sizing
        ↓
pre-paint, clipping, stacking, scrolling
        ↓
paint and rasterization
        ↓
layerization and compositing
        ↓
display pixels
```

MDN describes the DOM, CSSOM, render tree, style, layout, paint, and compositing sequence in [How browsers work](https://developer.mozilla.org/en-US/docs/Web/Performance/Guides/How_browsers_work). Chromium's more detailed RenderingNG model names animation, style, layout, pre-paint, scroll, paint, commit, layerize, raster, image decode, and worklets as separate stages in [RenderingNG architecture](https://developer.chrome.com/docs/chromium/renderingng-architecture).

This matters for HyvUI because each layer has a different failure mode:

| Layer        | What HyvUI can control                             | Failure if the contract is vague                                        |
| ------------ | -------------------------------------------------- | ----------------------------------------------------------------------- |
| semantic DOM | element choice, source order, labels, roles        | a beautiful composition that cannot be read or operated                 |
| cascade      | token ownership, specificity, layer order, context | themes and consumer overrides fighting unpredictably                    |
| layout       | flow, grid, flex, intrinsic sizes, containment     | wrapping, overflow, or geometry that changes by accident                |
| paint        | gradients, borders, shadows, textures, clipping    | the same layout becoming illegible or expensive to rasterize            |
| compositing  | transforms, opacity, fixed layers, 3D depth        | smooth-looking effects that consume memory or isolate the wrong content |
| runtime      | observers, animation, portals, canvas              | feedback loops, layout shifts, leaks, hydration drift, or stale context |

The correct goal is not identical pixels on every screen. Fonts, antialiasing, color profiles, GPU paths, zoom, and operating-system controls make that impossible. The goal is invariant behavior: semantic order, readable contrast, intentional relationships, bounded motion, predictable overflow, and graceful degradation.

### Layout and the margin model

CSS layout is not a canvas where every coordinate is independent. Most of the page should remain in normal flow, so content can respond to its containing block, text metrics, localization, zoom, and user settings.

The current library globally applies `box-sizing: border-box` in `src/lib/styles.css`. That is a good base, but it needs to become a documented rule rather than a fact consumers discover indirectly:

- declared width and height include border and padding;
- margin remains outside the box;
- normal block margins can collapse in the same block formatting context;
- margins do not behave like `gap` in grid and flex compositions;
- absolutely positioned and fixed elements leave normal flow and depend on a containing block;
- transforms change the visual position without changing normal-flow geometry;
- clipping, filters, opacity, transforms, and positioned layers can change stacking and paint behavior.

The [CSS visual formatting model](https://www.w3.org/TR/CSS22/visuren.html) is the foundation here. HyvUI should prefer `gap` and spacing tokens for relationships between siblings, reserve margins for authored prose rhythm, and treat absolute positioning as an explicit stage or ornament layer, never as a repair for a weak flow layout.

### Layout selection rule

The default order should be:

1. normal flow for reading order and content that must grow;
2. flex for one-dimensional alignment;
3. grid for two-dimensional relationships and repeated tracks;
4. container queries for component-local adaptation;
5. anchor or floating positioning for explicit attachment and collision handling;
6. local measurement only when the preceding mechanisms cannot express the relationship.

[Container queries](https://developer.mozilla.org/en-US/docs/Web/CSS/Guides/Containment/Container_queries) are especially important for a component library because a component's correct posture depends more on its assigned container than on the viewport. The library already uses `@container` in a few places, which is the right direction.

The current `Grid mode="auto"` is the clearest architectural question. It creates a hidden probe, measures `minColWidth`, reads computed gap, observes the element, and writes a new `grid-template-columns` value. That behavior is bounded and understandable, but it duplicates a relationship the CSS grid engine can usually express with `repeat(auto-fit, minmax(...))` or `auto-fill`.

The rule for the next version should be: **do not measure a relationship that CSS can already resolve from intrinsic sizing.** If a maximum-column policy, authored template, or unusual artistic constraint truly requires a measurement, that reason must be documented and tested as a separate mode.

Containment can reduce the amount of the document that needs to be reconsidered, and `content-visibility: auto` can skip work for off-screen content. It must be used with care because size containment can produce incorrect geometry or scroll jumps without an intrinsic size. The relevant references are MDN's [Using CSS containment](https://developer.mozilla.org/en-US/docs/Web/CSS/Guides/Containment/Using) and [`contain-intrinsic-size`](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Properties/contain-intrinsic-size).

### Read and write discipline

The expensive pattern is not a single `getBoundingClientRect` or `ResizeObserver`. The risk is a loop that reads geometry, writes a style, causes layout, reads again, and repeats across a large subtree.

The foundation should enforce this rhythm for any runtime geometry:

```text
observe or schedule
    → read all required geometry
    → derive a bounded result
    → write CSS variables or classes once
    → wait for the next frame or observer delivery
```

Svelte's [`$effect`](https://svelte.dev/docs/svelte/$effect) runs in the browser after DOM updates and is appropriate for DOM, canvas, and third-party integration. It is not a reason to turn normal layout state into a JavaScript synchronization problem. Effects need cleanup, cancellation, visibility handling, and a clear owner.

## The current HyvUI structure

### Public surface

The current public barrel in `src/lib/index.ts` exposes:

- 96 Svelte component files under `src/lib/components`;
- 97 default component exports when `TravelingParticle` is included;
- CSS tokens and a TypeScript `tokens` object;
- weight, theme, and grade helpers;
- actions, motion presets, depth helpers, glyph resolution, and typed variants;
- `getAgentManifest` as a read-only discovery entry point for the private Next composition research surface.

The component groups are coherent: primitives, inputs, feedback, layout, navigation, display, ambient, patterns, ornaments, orchestration, depth, and scenes. The problem is not the existence of these groups. The problem is that they currently mix several kinds of contract:

- semantic controls;
- material and token primitives;
- layout primitives;
- finished page postures;
- decorative ambient effects;
- runtime choreography;
- experimental relationship composition.

Those should remain available, but they need different guarantees. A button, a canvas ornament, and a full-page scene should not be judged by the same API or performance rules.

### Styling and token path

The main stylesheet in `src/lib/styles.css` imports, in order:

1. base CSS tokens;
2. both theme token files;
3. weight/register styles;
4. textures;
5. grades;
6. expression styles;
7. depth styles;
8. global reset and ambient rules.

The demo application then imports Tailwind and `src/lib/styles.css` from `src/app.css`, followed by a Tailwind v4 `@theme` mapping. This creates a practical system, but the cascade ownership is not explicit. There is no project-wide `@layer` contract, while the library also mixes Svelte-scoped CSS, `:global` theme selectors, global body selectors, Tailwind utilities, and inline style directives.

CSS cascade layers are a natural next guardrail. [MDN's `@layer` reference](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/At-rules/@layer) explains how layers provide explicit precedence and reduce specificity contests. A future contract should state which layer owns reset, tokens, base components, context, themes, composition, enhancements, and consumer overrides.

The token system currently has two sources of truth:

- `src/lib/tokens/tokens.css` contains the live CSS values;
- `src/lib/tokens/tokens.ts` contains values for JavaScript and canvas consumers.

They have already drifted. The CSS type scale has been increased, while the TypeScript type scale still contains older values. This is a foundation defect, not a cosmetic discrepancy. A canvas or measurement helper that reads the TypeScript token object can make a different decision from a DOM element using the CSS token.

The future rule should be one authored token source, generated CSS and TypeScript outputs, and a parity test that fails when the two representations differ. Raw CSS values required for critical bootstrap HTML should also be generated from that source or explicitly documented as a bootstrap exception.

### Context channels

The three augmentation channels are a strong idea:

- weight controls density and typographic register;
- theme controls material identity, palette, and motif;
- grade controls a film-like color treatment.

They are conceptually orthogonal and match the art direction better than one giant `style` prop. The implementation currently has three boundary problems:

- `docs/registers.md` promises that weight and theme can be scoped to any element, but `src/lib/system/motion/registerObserver.ts` reads only `document.body.dataset.weight` and `document.body.dataset.theme`;
- `AppShell.svelte` mutates global body state and clears it during cleanup, so multiple shells, nested shells, or route transitions can compete;
- `AppShell.svelte` accepts weight and theme but not grade, even though grade is part of the public context model.

CSS inheritance and JavaScript observation therefore do not agree about what “active context” means. The fix is not necessarily a global context engine. The smaller fix is to define scope explicitly and make runtime consumers resolve the nearest owning context, or declare that runtime effects are body-scoped and remove the stronger scoped promise.

### Consumer path today

The intended consumer path is:

```text
install package
    → import @hyvnt/hyvui/styles.css once
    → provide ET Book and IBM Plex Mono, or accept fallbacks
    → apply weight/theme with AppShell or helpers
    → compose primitives, patterns, depth, and optional scenes
    → use Next discovery only as an additive research surface
```

The actual documentation makes this more complicated than it needs to be:

- `INSTALL.md` lists SvelteKit 2, Svelte 5, Tailwind v4, and Node 18+ as prerequisites, while `package.json` declares only Svelte as a peer dependency and keeps Tailwind in development dependencies;
- `README.md` says the main stylesheet includes the system and separately demonstrates importing both theme CSS files, even though `src/lib/styles.css` already imports both theme files;
- `llms.txt` says fonts must be supplied by the consumer, then says `AppShell` handles fonts automatically;
- `AppShell` injects IBM Plex Mono regular from Google Fonts, but does not load ET Book and does not load the other IBM weights used by the app shell document;
- the repository contains no font files and no `@font-face` declarations under `src/lib`;
- historical documentation still contains `data-register` and `applyRegister` wording even though `data-weight` and `applyWeight` are canonical.

This is not merely documentation polish. A consumer's font, CSS entry point, and context setup directly affect layout, paint, contrast, and hydration behavior.

### Escape hatches and semantic control

The source audit found that all 96 component SFCs use explicit `$props()` declarations, 95 declare a `class` prop, and none uses a markup attribute rest spread. That makes the API typed and visually controlled, but it also means arbitrary consumer attributes are not generally forwarded.

The missing contract includes:

- `id` for labels, anchors, and test hooks;
- `aria-*` and `role` overrides where a component is intentionally generic;
- `data-*` hooks for composition inspection and analytics;
- `style` and CSS custom property overrides for local art direction;
- native attributes such as `name`, `autocomplete`, `form`, `accept`, and `enterkeyhint`;
- a documented event and focus model.

The answer should not be a completely untyped `any` escape hatch on every component. It should be a deliberate split:

- semantic controls forward the appropriate native element attributes and expose safe overrides;
- decorative components default to `aria-hidden` and expose only visual configuration;
- layout/material wrappers accept a typed style-variable or attribute escape hatch;
- full scenes use snippets and explicit regions rather than growing prop lists.

This is exactly the kind of constraint a UI library should provide: it should make the accessible path the easy path and make accidental semantic loss difficult.

## Rendering and display risks found in the implementation

### Typography is geometry

Typography is currently described as two typefaces: ET Book for body and headings, IBM Plex Mono for labels and UI strings. That is a strong artistic constraint. It is not yet a stable technical contract.

CSS Fonts defines font fallback and `font-display` behavior because a late font can change metrics and cause text to reflow. See [CSS Fonts Module Level 4](https://www.w3.org/TR/css-fonts-4/), MDN's [`font-display`](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/At-rules/%40font-face/font-display), [`font-size-adjust`](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Properties/font-size-adjust), and [`font-optical-sizing`](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Properties/font-optical-sizing).

The policy decision required before more visual tuning is:

- are the fonts part of HyvUI's distributable experience;
- are they an optional asset package;
- or are they always the consumer's responsibility?

Any answer can work. The current mixed answer cannot be the long-term one. The library should define a loading policy, fallback metric strategy, allowed weights and styles, and whether critical compositions are permitted to depend on a font that has not loaded.

ET Book's official project page is [Edward Tufte's ET Book](https://edwardtufte.github.io/et-book/). IBM's official type guidance is in [IBM Design Language typography](https://www.ibm.com/design/language/typography/typeface/), with the source distribution at [IBM Plex on GitHub](https://github.com/IBM/plex). These are suitable provenance anchors for a future font decision.

### Color is a pipeline, not a hex list

The base palette is currently expressed primarily in sRGB-style hex and rgba values. That is a reasonable compatibility baseline. It is not the whole color contract.

CSS Color 4 covers sRGB, Display P3, Rec.2020, Oklab, OklCh, interpolation, and gamut mapping in [the W3C specification](https://www.w3.org/TR/css-color-4/). MDN documents [`oklch()`](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Values/color_value/oklch), [`color-mix()`](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Values/color_value/color-mix), and the [`color-gamut` media feature](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/At-rules/%40media/color-gamut).

The recommended color strategy is:

1. define semantic sRGB tokens as the guaranteed baseline;
2. use perceptual color spaces for authoring or deriving ramps where they improve consistency;
3. add Display P3 or wider-gamut enhancement only behind capability detection;
4. test contrast on the final composited surface, including transparency, texture, grade, and overlays;
5. keep semantic status differences available through more than hue alone;
6. preserve a usable forced-colors/high-contrast result.

WCAG 2.2 sets a minimum 4.5:1 contrast ratio for normal text and 3:1 for large text under its normal-text criterion. It also has a separate non-text contrast requirement. See [WCAG 2.2](https://www.w3.org/TR/WCAG22/). The exact target for HyvUI should be stricter for muted mono text and text placed over animated or translucent material because those surfaces vary perceptually.

The current `grades.css` applies a filter to the whole body. The current texture system adds fixed and animated pseudo-element layers. These are artistically useful, but their effect on legibility must be evaluated after compositing, not from the ungraded token values. MDN's [`filter`](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Properties/filter) and [`backdrop-filter`](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Properties/backdrop-filter) references should be part of the performance and contrast review.

Forced colors can replace author colors, shadows, text shadows, and background images. The correct approach is a small targeted adjustment, not a separate aesthetic universe that loses semantic affordances. See MDN's [`forced-colors`](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/At-rules/%40media/forced-colors).

### Device pixels and canvas

CSS pixels are not physical pixels. `window.devicePixelRatio` changes with display density and browser zoom, and a display can change while the page remains open. MDN documents this in [`devicePixelRatio`](https://developer.mozilla.org/en-US/docs/Web/API/Window/devicePixelRatio) and the CSS [`resolution` type](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Values/resolution).

`HorizonGrid.svelte` already uses a high-resolution canvas backing store and scales it for DPR. `ShimmerCloud.svelte` currently sizes its canvas to CSS pixels, so it can look soft on HiDPI displays. Both canvas components also hardcode color calculations rather than consuming a theme-resolved rendering token. `ShimmerCloud` continues scheduling frame work even when its intersection state is not active, and several effects capture reduced-motion state only once.

The future canvas contract should require:

- CSS-pixel layout dimensions plus a DPR-scaled backing store;
- clamped maximum backing resolution so a large 3x display cannot create an accidental memory spike;
- theme colors passed as resolved inputs or CSS-derived values, never duplicated base RGB constants;
- pause behavior for reduced motion, hidden documents, and off-screen regions;
- cancellation and cleanup on destroy;
- a semantic fallback or explicit decorative `aria-hidden` policy;
- a test at DPR 1 and DPR 2 at minimum.

### Modern CSS and graceful degradation

The library uses modern features including CSS trig functions, `color-mix`, `clip-path`, `overflow: clip`, `dvh`, `text-wrap`, container queries, filters, and 3D transforms. This is compatible with the intended audience, but there is currently no `@supports` usage in the library stylesheet/component scan.

The rule should not be “avoid modern CSS.” The rule should be:

> **Every feature that can remove layout, clipping, color, or readability needs a fallback or an explicit baseline declaration.**

CSS feature queries are the intended mechanism, documented at MDN's [`@supports`](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/At-rules/@supports). For example, a material enhancement can layer on top of a readable solid background, and a trig-derived shadow can fall back to a fixed directional shadow. The artistic effect may disappear on an older engine, but the composition must remain legible and structurally sound.

### Runtime and effect budget

The source contains a meaningful amount of runtime behavior:

- 15 component files use `onMount`;
- 5 files use `ResizeObserver`;
- 6 files use `IntersectionObserver`;
- 6 files contain geometry reads through `getBoundingClientRect` or related measurement;
- 2 files render canvas surfaces, with canvas also appearing in a global rule and a scene slot;
- 42 files contain filter-related declarations;
- 67 files contain `color-mix` usage;
- 65 files contain transform-related signals.

These counts are a snapshot from the current working tree, not a performance verdict. They identify where a shared policy is needed.

The effect budget should distinguish:

- cheap state changes, such as a class or custom property;
- compositor-friendly motion, usually opacity and transform, verified rather than assumed;
- paint-heavy effects, such as large blur, filters, backdrop filters, animated gradients, and complex clipping;
- scene-wide effects, such as body filters, fixed textures, and multiple 3D layers;
- continuously running work, such as canvas loops, intervals, and scroll listeners.

Chrome documents why some animations are not composited in [Non-composited animations](https://developer.chrome.com/docs/lighthouse/performance/non-composited-animations). HyvUI should treat `filter`, `backdrop-filter`, large shadows, and full-viewport textures as budgeted material features, not as free decoration.

## Accessibility and overlay contract

`Modal.svelte` starts from the right platform primitive by using `<dialog>`, `showModal()`, Escape/cancel behavior, previous-focus restoration, and scroll locking. That should become the reference contract.

`Drawer.svelte` currently uses a custom fixed panel and backdrop. It handles scroll lock and Escape, but it does not yet provide the same dialog semantics and focus management. `Popover.svelte` uses Floating UI and portals its node to `document.body`, but the component itself does not establish a complete role, focus, or dismissal contract.

This is a structural issue because overlays alter the browser's containing blocks, stacking contexts, focus order, scroll behavior, and accessibility tree. The future API should specify for each overlay:

- semantic role and labelled-by behavior;
- focus entry, focus return, and focus containment;
- Escape and outside-click rules;
- scroll lock and scrollbar compensation;
- inertness or interaction suppression of background content;
- portal ownership and cleanup;
- reduced-motion behavior;
- server-rendered and hydration-safe initial state.

MDN's [`<dialog>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/dialog) and [`overflow`](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Properties/overflow) references are useful platform anchors.

## Findings ranked by architectural urgency

The priority labels below describe risk to future evolution. P0 means the issue blocks a trustworthy foundation, not that the current application is unusable.

### P0, resolve before expanding adaptive composition

1. **Two token sources can disagree.** `tokens.css` and `tokens.ts` already contain different type-scale values. This can create DOM/canvas divergence and makes visual tuning non-reproducible.

2. **Global and scoped context semantics disagree.** CSS allows scoped weight/theme inheritance, while motion observation reads only the body. `AppShell` also performs global cleanup without an ownership model.

3. **Font and stylesheet ownership is ambiguous.** Documentation, `AppShell`, `app.html`, and package metadata describe different loading paths. ET Book is named as foundational but is not shipped or loaded by the library.

### P1, resolve before calling the system cross-device stable

1. **`Grid` duplicates CSS intrinsic layout with JavaScript measurement.** Prove the need or provide a CSS-native path.

2. **Consumer attributes are not a general escape hatch.** The absence of rest forwarding makes accessibility, testing, composition inspection, and local art direction depend on one-off props.

3. **Canvas ambient effects have inconsistent DPR, theme, and lifecycle behavior.** HorizonGrid is more mature; ShimmerCloud exposes the difference.

4. **Global filters and layered material effects have no documented scene budget.** The body grade, fixed textures, backdrop filters, shadows, and 3D layers need measurement and contrast review.

5. **Overlay semantics are inconsistent.** Modal is the baseline; Drawer and Popover need an explicit shared contract.

6. **Cascade precedence is implicit.** Svelte scoping, `:global`, Tailwind utilities, inline directives, and global styles need explicit layers and override rules.

7. **Feature fallback is under-specified.** Modern CSS is used broadly, but there is no feature-query convention for the cases where an enhancement disappears.

8. **The browser matrix is too narrow.** The current e2e pass is valuable, but a single Chromium configuration cannot establish Firefox, WebKit, DPR, font-fallback, forced-colors, or color-gamut behavior.

### P2, resolve before the next public release

1. **Documentation is not generated from the public contract.** The current docs contain stale names and conflicting setup guidance. Export-to-documentation coverage should be measured automatically.

2. **Tailwind's role is unclear.** The library's component CSS is mostly token/class based, but the installation path presents Tailwind v4 as a prerequisite. Decide whether Tailwind is required, recommended for utilities, or demo-site-only.

3. **The private Next boundary is physically porous.** The barrel exposes only `getAgentManifest`, but the package dry run includes `dist/next-experiments`. The exports map limits normal imports, yet the release process should make private/public status unambiguous.

4. **Legacy vocabulary remains in agent-facing documents.** `data-register` and `applyRegister` should either be removed or explicitly marked as historical aliases.

## Browser constitution for future HyvUI work

These are proposed rules for code review, documentation, and test fixtures.

1. **Semantic structure comes first.** Source order, native elements, labels, and focus behavior must remain correct with all artistic layers removed.

2. **CSS owns ordinary adaptation.** Use normal flow, flex, grid, intrinsic sizing, container queries, and feature queries before JavaScript measurement.

3. **Every runtime relationship is bounded.** It has a named owner, a clear input, a maximum scope, cleanup, cancellation, and a fallback.

4. **One token source owns visual constants.** CSS and TypeScript outputs are generated or parity-tested. Canvas and DOM do not invent separate palettes.

5. **Context has a scope.** Body-wide context, nearest-container context, and component-local context are distinct concepts. A runtime observer may not silently pretend they are interchangeable.

6. **Cascade order is intentional.** Reset, tokens, base components, context, theme, composition, enhancements, and consumer overrides each have a documented precedence.

7. **Use spacing relationships, not coordinate repairs.** Sibling rhythm uses `gap` and tokens. Margins are for prose rhythm or an explicitly authored external relationship. Absolute positioning is a stage layer, not a default layout tool.

8. **Animate the cheapest property that conveys the idea.** Prefer opacity and transform where appropriate. Treat filters, backdrop filters, large shadows, canvas, and full-viewport layers as measured costs.

9. **Artistic failure must be graceful.** If a color space, trig function, clip, font, or filter is unavailable, the semantic layout and readable contrast remain.

10. **Contrast is evaluated after composition.** Texture, grade, alpha blending, and material layers are part of the surface. Token-level contrast alone is insufficient.

11. **Font metrics are a layout dependency.** Define font provenance, loading behavior, fallback metrics, allowed styles, and whether geometry is allowed to wait for a font.

12. **Decorative effects never carry meaning alone.** Ambient SVG, canvas, texture, motion, and color are supplementary. Status, hierarchy, and action remain available through text, structure, labels, and shape.

13. **Components expose controlled escape hatches.** A consumer can attach identity, semantics, test hooks, and local CSS variables without reaching into private class names.

14. **Cross-browser quality means invariants, not pixel worship.** Validate reading order, wrap behavior, overflow, focus, contrast, animation policy, and composition relationships. Allow for legitimate raster differences.

15. **The browser should be boring beneath the soul.** If a feature requires global inference, silent reordering, hydration-dependent geometry, or unexplained magic numbers, it belongs in an experiment until it proves its value.

## Ordered task list

### Phase 0, freeze the browser foundation contract

- Create a small browser-foundation fixture route containing text, controls, a surface, a grid, a portal, a canvas ornament, a grade, and a theme.
- Record the intended invariants: no accidental horizontal overflow, stable source order, readable focus, bounded layout shift, useful reduced-motion behavior, and semantic fallbacks.
- Add a support ledger for every nontrivial CSS feature currently used, with baseline declaration, enhancement declaration, and test condition.
- Keep a decision log for any feature that intentionally chooses visual fidelity over older-browser enhancement.

### Phase 1, repair ownership and public contracts

- Choose one authored token source and generate or parity-test CSS and TypeScript values.
- Define cascade layers and the sanctioned consumer override surface.
- Define the scope of weight, theme, and grade. Make the JS observer match the CSS promise, or narrow the promise.
- Decide whether AppShell owns global appearance, provides a scoped wrapper, or becomes a convenience-only component with no destructive cleanup.
- Define native attribute forwarding and typed escape-hatch rules by component family.
- Make the public/private boundary for Next composition explicit in both exports and package contents.

### Phase 2, make layout browser-native by default

- Prototype a CSS-native replacement or companion mode for `Grid mode="auto"` using intrinsic tracks and container queries.
- Keep a measured mode only if a concrete artistic or behavioral requirement survives comparison.
- Document `box-sizing`, margin collapse, gap, containing blocks, stacking contexts, overflow, and `min-width: 0` as part of the component authoring guide.
- Audit scene and pattern components for absolute positioning that is compensating for missing flow relationships.
- Use containment selectively, with intrinsic-size or fallback measurements where needed.

### Phase 3, stabilize typography, color, and display media

- Decide font ownership and provenance. Implement one loading story, including `font-display`, fallback metrics, supported weights, and offline behavior.
- Test the fluid type scale at narrow, wide, zoomed, and font-fallback conditions. Check line wrapping, not only computed font size.
- Keep sRGB semantic tokens as the baseline. Evaluate OklCh-derived ramps and Display P3 enhancements separately behind support/capability checks.
- Add contrast fixtures for graded, textured, translucent, and animated surfaces.
- Add forced-colors and high-contrast checks.
- Standardize canvas sizing, DPR clamping, theme inputs, pause behavior, and semantic fallback.

### Phase 4, impose a runtime and material budget

- Create shared preference utilities for reduced motion, document visibility, and effective interaction capability instead of module-level snapshots.
- Make every observer, interval, RAF loop, and Motion animation cancellable and destroy-safe.
- Audit read/write ordering around every geometry read.
- Establish a small set of material cost tiers: surface, elevated surface, atmospheric layer, depth layer, and scene-wide effect.
- Measure representative pages with and without grade, textures, filters, canvas, and 3D depth.
- Bring Drawer and Popover up to the shared overlay contract.

### Phase 5, simplify the consumer journey

- Rewrite `README.md`, `INSTALL.md`, `llms.txt`, and `docs/registers.md` from one verified setup contract.
- Decide whether Tailwind is required or optional for consumers, and make package metadata agree.
- Remove duplicate theme-import guidance if themes remain bundled in the base stylesheet, or split the stylesheet intentionally if bundle control is the goal.
- Clarify what AppShell loads and what it never loads.
- Generate API coverage reports from the public barrel and declaration files.
- Add a short “when not to use this component” and “what relationship this component participates in” note for expressive primitives, patterns, and scenes.

### Phase 6, validate across browsers and displays

The minimum validation matrix should include:

- Chromium, Firefox, and WebKit;
- widths 320, 375, 768, 1024, 1440, and 1600 CSS pixels;
- DPR 1 and 2, with a 3x stress case for canvas and large surfaces;
- normal motion and `prefers-reduced-motion: reduce`;
- normal colors and forced colors;
- loaded fonts, delayed fonts, unavailable fonts, and offline assets;
- baseline color capability and wide-gamut capability where the test environment supports it;
- zoom or text-scaling scenarios, especially 200 percent;
- keyboard-only navigation and screen-reader-oriented semantic assertions.

Capture both screenshots and machine-readable evidence:

- computed token and font values;
- text wrap and bounding-box relationships;
- overflow and scroll dimensions;
- layout shift and long-task observations;
- focus order and accessible names;
- active animation and observer counts;
- canvas backing-store dimensions;
- fallback activation for unsupported enhancements.

## Acceptance criteria for the foundation

The browser foundation is ready for the next artistic implementation phase when:

- CSS and TypeScript token outputs cannot silently diverge;
- a consumer can install and style a minimal app from one accurate documented path;
- the font policy is explicit and visual tests cover fallback metrics;
- ordinary responsive behavior works without component-local geometry measurement;
- scoped context behavior is either fully supported or no longer advertised;
- public components provide semantic attributes and controlled local overrides;
- decorative runtime work pauses, cleans up, and respects reduced motion and visibility;
- canvas effects are sharp enough and bounded at HiDPI;
- overlays share a predictable focus and scroll contract;
- unsupported CSS enhancements leave a readable composition;
- the same fixture passes the browser/display matrix on semantic and performance invariants;
- the static composition layer remains inspectable, deterministic, and additive rather than becoming a hidden universal solver.

## What this reconnaissance deliberately does not do

This document does not approve a broad refactor, replace the token system, add a new runtime engine, expand the palette, or change the public API. It establishes the questions and order of operations required to make those changes safely.

The next implementation should begin with a small foundation fixture and the P0 contracts. It should not begin by adding more visual effects. HyvUI already has enough atmosphere. What it needs next is a browser contract strong enough that atmosphere can become art instead of becoming variance.

## Primary references

- [MDN, How browsers work](https://developer.mozilla.org/en-US/docs/Web/Performance/Guides/How_browsers_work)
- [Chrome, RenderingNG architecture](https://developer.chrome.com/docs/chromium/renderingng-architecture)
- [W3C, CSS visual formatting model](https://www.w3.org/TR/CSS22/visuren.html)
- [MDN, Container queries](https://developer.mozilla.org/en-US/docs/Web/CSS/Guides/Containment/Container_queries)
- [MDN, CSS containment](https://developer.mozilla.org/en-US/docs/Web/CSS/Guides/Containment/Using)
- [MDN, Cascade layers](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/At-rules/@layer)
- [W3C, CSS Color Module Level 4](https://www.w3.org/TR/css-color-4/)
- [W3C, WCAG 2.2](https://www.w3.org/TR/WCAG22/)
- [W3C, CSS Fonts Module Level 4](https://www.w3.org/TR/css-fonts-4/)
- [MDN, `devicePixelRatio`](https://developer.mozilla.org/en-US/docs/Web/API/Window/devicePixelRatio)
- [MDN, `<dialog>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/dialog)
- [Svelte, `$effect`](https://svelte.dev/docs/svelte/$effect)
