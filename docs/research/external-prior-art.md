# External prior-art research

**Status:** research synthesis. Sources are evidence for design principles, not designs to copy.

## CSS as a relationship substrate

### CSS anchor positioning and anchored queries

- Source: [MDN CSS anchor positioning](https://developer.mozilla.org/docs/Web/CSS/CSS_Anchor_Positioning)
- Source: [MDN using CSS anchor positioning](https://developer.mozilla.org/en-US/docs/Web/CSS/Guides/Anchor_positioning/Using)
- Source: [MDN `@container`](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/At-rules/@container)

**Principle:** CSS can tether one element to another element’s size and position, provide fallback positions, and conditionally style descendants when a fallback is active.

**Useful abstraction for HyvUI:** a relation can compile to a browser-native anchor/position rule when the relationship is genuinely positional. This is more inspectable and less invasive than measuring the whole DOM in JavaScript.

**Caution:** anchor positioning is a positioning mechanism, not a composition theory. It does not decide which elements should relate, whether the relationship is aesthetically meaningful, or how to solve arbitrary overlapping content. Browser support and fallback behavior must be tested; unsupported features need a normal-flow fallback.

### Container queries

**Principle:** `@container` evaluates rules against a named containment context rather than the viewport. The existing HyvUI `Grid` already applies a narrow version of this idea through `ResizeObserver`.

**Useful abstraction:** local context should be preferred over global page knowledge. A material can adapt to the field that contains it without knowing the entire document.

**Caution:** descendant-only effects and containment boundaries matter. Container queries should not become a disguised global art director or a source of circular layout dependencies.

## Constraint systems and scene graphs

### Cassowary

- Source: [UW Cassowary archive](http://constraints.cs.washington.edu/cassowary/)
- Source: [Cassowary technical report](https://constraints.cs.washington.edu/cassowary/cassowary-tr.pdf)
- Source: [Original Cassowary repository](https://github.com/gjbadros/cassowary)

**Principle:** Cassowary solves incremental linear equalities and inequalities and distinguishes required constraints from preferences. The original project explicitly targets user-interface applications.

**Useful abstraction:** HyvUI can distinguish hard author constraints from soft compositional preferences. A relation system should make precedence explicit rather than silently “fixing” a layout.

**Caution:** linear solvability does not equal artistic quality. The original project is archival, and the GitHub implementation is LGPL-2.1. A solver would add dependency/licensing/complexity cost and should not enter the core without a prototype proving it creates value that CSS and bounded heuristics cannot.

### JavaFX retained-mode scene graph

- Source: [Oracle JavaFX Scene Graph tutorial](https://docs.oracle.com/javafx/2/scenegraph/jfxpub-scenegraph.htm)

**Principle:** a retained-mode scene graph maintains an internal model of nodes, parent/child structure, visibility, transforms, paint order, and CSS styling. The graph gives the system a persistent representation of the scene rather than a one-shot list of drawing calls.

**Useful abstraction:** a composition inspector can operate on a stable node model containing identity, parentage, material, transform, and relation metadata. This supports debugging and agent discovery.

**Caution:** a DOM/Svelte page is not a closed graphics scene graph. Accessibility semantics, native flow, forms, streaming content, and ordinary HTML must remain first-class. HyvUI should use a lightweight parallel composition model, not replace the web document with a proprietary renderer.

## Deterministic procedural variation

### Deterministic generative art

- Source: [256ART, Designing Deterministic Generative Art](https://256.art/learn/deterministic-generative-art)
- Secondary reference: [generativeart.io](https://generativeart.io)

**Principle:** a seed is only useful when the algorithm, inputs, call order, dependencies, and environment-sensitive decisions are controlled. Structural decisions should be generated before rendering; independent random streams and parameter snapshots reduce drift.

**Useful abstraction:** art direction can expose a seed and bounded ranges for selected dimensions. The composition should derive a stable parameter object first, then render it. Resize should project the same decisions into new dimensions rather than consume a new random stream.

**Caution:** deterministic variation is not a substitute for intent. Do not randomize color, hierarchy, or placement by default. Define what is guaranteed: exact pixels, geometry/topology, or repeatable behavior.

## Motion and choreography

### Material Design choreography

- Source: [Material Design 1, Choreography](https://m1.material.io/motion/choreography.html)

**Principle:** motion can preserve continuity by sharing focal elements across transitions, associating new surfaces with their origin, staggering related entrances, and reserving attention for a clear focal path. The guide also warns against layout shifts when content loads.

**Useful abstraction:** relationships can carry temporal behavior: a reveal can originate from an anchor, an echo can preserve a focal identity, and an interruption can be staged without making every element move.

**Caution:** the source is a conventional interaction system, not an artistic composition framework. HyvUI should borrow continuity and focal discipline without importing its whole product-UI grammar.

## Agent-facing capability surfaces

### MCP structured discovery

- Source: [MCP specification](https://modelcontextprotocol.io/specification/2026-07-28)
- Source: [MCP tools](https://modelcontextprotocol.io/docs/concepts/tools)

**Principle:** MCP separates resources, prompts, and tools. Tools carry descriptions and JSON Schemas; structured results can carry an output schema; extensions are opt-in and user control/consent are explicit.

**Useful abstraction:** a future HyvUI agent integration could expose read-only resources such as capability manifests and composition inspection, plus tools that validate or explain a composition. A schema-backed local manifest is useful even without MCP.

**Caution:** MCP is a transport/discovery protocol, not a design language. Adding an MCP server before the local manifest and inspector prove useful would multiply deployment and security surface without improving the underlying composition model.

## Additional references from the parallel scan

The second research pass expanded the source set beyond the initial shortlist:

- [W3C CSS Grid Layout](https://www.w3.org/TR/css-grid-1/) supports explicit two-dimensional placement, spanning, and overlap without requiring a matching DOM hierarchy.
- [Processing `randomSeed()`](https://processing.org/reference/randomSeed_.html) and [p5.js `randomSeed()`](https://p5js.org/reference/p5/randomSeed/) show a small, understandable author-facing contract for reproducible procedural variation.
- [D3 linear scales](https://d3js.org/d3-scale/linear) provide pure domain-to-range mappings with explicit clamping and unknown-value behavior. This is useful prior art for turning semantic values into bounded visual parameters.
- [DisCo, Scene Graph Disentanglement and Composition](https://proceedings.neurips.cc/paper_files/paper/2024/hash/b288470688e72f58c02031304ad6339f-Abstract.html) is close conceptual prior art for separating scene nodes/relationships from implicit semantics, although it targets image generation rather than DOM layout.
- [SVG 2](https://svgwg.org/svg2-draft/single-page.html), [Three.js scene graphs](https://threejs.org/manual/en/scenegraph.html), and [Konva](https://konvajs.org/docs/overview.html) reinforce identity, local coordinate frames, transform inheritance, paint order, and the separation of visual and interaction graphs.
- [The ACM Cassowary paper](https://dl.acm.org/doi/10.1145/504704.504705), [UNICON](https://doi.org/10.1109/pacificvis53943.2022.00015), [Apple Auto Layout](https://developer.apple.com/library/archive/documentation/UserExperience/Conceptual/AutolayoutPG/AnatomyofaConstraint.html), and [Figma Auto Layout](https://help.figma.com/hc/en-us/articles/360040451373-Guide-to-auto-layout) cover hard/soft constraints, content-derived dimensions, and local sizing modes. Their shared lesson is graded preference with inspectable conflict, not a magical solver.
- [CSS Containment Level 3](https://www.w3.org/TR/css-contain-3/), [MDN container queries](https://developer.mozilla.org/en-US/docs/Web/CSS/Guides/Containment/Container_queries), and [Chrome anchor positioning](https://developer.chrome.com/blog/tether-elements-to-each-other-with-css-anchor-positioning) support local context and declarative tethering, with evolving support and fallback requirements.
- [Web Animations](https://www.w3.org/TR/web-animations-1/), [Material 3 transition patterns](https://m3.material.io/styles/motion/transitions/transition-patterns), [GSAP timelines](https://gsap.com/docs/v3/GSAP/Timeline/), [Motion layout animations](https://motion.dev/docs/react-layout-animations), and the [Lottie specification](https://lottie.github.io/lottie-spec/latest/) cover timing graphs, identity-preserving transitions, named synchronization, and serializable animation layers.
- [Design Tokens Community Group format](https://designtokens.org/tr/2025.10/format), [Storybook CSF](https://storybook.js.org/docs/api/csf), [Figma file nodes](https://developers.figma.com/docs/rest-api/files/), [Figma MCP](https://developers.figma.com/docs/figma-mcp-server/), [Open UI analysis](https://open-ui.org/design-system-analysis-guide/), [OpenUI Lang](https://www.openui.com/docs/openui-lang/defining-components), and the [shadcn registry schema](https://ui.shadcn.com/docs/registry/registry-json) all support structured, queryable metadata around visual systems. None of them alone supplies an artistic relationship grammar.

## Cross-source synthesis

1. Prefer local, named relationships over global magic. CSS container/anchor primitives and retained scene models both support explicit identity and locality.
2. Represent hard requirements and soft preferences separately. A layout system that cannot explain precedence will fight the author.
3. Generate stable decisions before applying browser effects. Determinism and inspectability matter more than raw procedural variety.
4. Treat motion as a relationship and focal-path problem, not an animation-prop problem.
5. Make machine-readable metadata compact, schema-backed, and queryable. Human docs and executable inspection should reinforce each other.
6. Preserve the document. HyvUI Next should augment HTML/Svelte, not build a closed canvas universe.

## Gaps

- Prior art does not provide a ready-made agent-native artistic composition grammar for Svelte.
- No source proves that a runtime automatically creates better art. That requires the repository’s comparative agent experiment.
- CSS anchor positioning support and production fallback behavior must be tested in the project’s target browsers before becoming a core implementation dependency.
- Human ratings of awe/originality remain subjective; they must be paired with structural and deterministic measurements.
