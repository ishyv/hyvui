# Prototype selection

## Selected comparison

### Candidate A: static relationship manifest

- syntax-neutral nodes and relations;
- compact capability registry;
- stable CSS custom-property/data-attribute projection;
- `disabled`, `suggest`, and `apply` policies, with `suggest` as the default experiment mode;
- read-only inspector output;
- no global observer and no constraint solver.

### Candidate B: opt-in local runtime adapter

- uses the same manifest and render cases as Candidate A;
- measures only registered node bounds;
- identifies a small set of geometry-dependent opportunities;
- batches updates and exposes every applied/rejected suggestion;
- uses native CSS anchor/container features where available, with fallback behavior;
- never reorders content or silently changes authored constraints.

### Control

The current-library control route in `src/routes/next-lab/baseline/` uses existing public components and the same five visual briefs.

## Shared test cases

- sparse composition with a small focal object and large negative space;
- dense composition with many readings and one clear focal path;
- image-dominant composition with a bleed/anchor relationship;
- typography-dominant composition with extreme scale and interruption;
- atmospheric/depth composition with a slow field and one raised object.

## Shared success signals

- distinct top-level silhouettes across cases;
- meaningful overlap/echo/connector use rather than random offsets;
- deterministic structure for the same seed and viewport;
- stable SSR/hydration and responsive behavior;
- visible inspection trail for suggestions and overrides;
- lower agent steering cost than the control;
- no need to use an existing scene template as the root of every case.

## Falsification

Reject Candidate B if it does not outperform Candidate A in paired review or if it introduces layout instability, hydration differences, observer feedback loops, or opaque mutations. Reject the relationship layer if Candidate A is no more discoverable or diverse than the control. If both candidates produce the same generic structure, the abstraction is not doing enough and must be redesigned before implementation.

## Deliberately excluded

- full Cassowary/linear constraint solver;
- automatic invention of palette hues;
- unseeded or viewport-dependent randomness;
- global DOM mutation;
- private component-class selectors;
- a required MCP server;
- a new page-template catalog.
