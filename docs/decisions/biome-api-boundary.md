# biome library API boundary

**Status:** provisional. review after the controlled agent bakeoff.

## decision

Keep the new biome definitions, compatibility resolver, genome resolver, composition-plan compiler, transition resolver, `Frame`, `FrameSequence`, and `Passage` modules under `src/lib/next-experiments/`. Do not add them to the public barrel yet.

Extend the existing public `getAgentManifest()` result additively with `biomes`. This is a discovery surface, not a rendering API. Existing consumers retain the same exports and behavior.

## reason

The implementation now has:

- twelve declarative host biomes;
- bounded host-and-graft compatibility with destructive rejection;
- deterministic genome and composition-plan resolution;
- native frame and selective passage proofs;
- material, typography, and atmosphere projections;
- a read-only inspector and schema-backed example;
- full pure, browser, typecheck, build, and package verification.

It does not yet have paired rendered artifacts from the three agent conditions, blind visual review, or a completed accessibility review across the proposed public surface. Promoting the modules now would turn a validated experimental seam into a promise before the required evidence exists.

## promotion gate

Revisit this decision only after all of the following are stored and reviewed:

1. the four-condition, eight-prompt bakeoff report;
2. rendered desktop and narrow artifacts or an explicit limitation record;
3. deterministic rerender and responsive checks;
4. keyboard, focus, touch, reduced-motion, history, and semantic-order review;
5. user approval of the smallest public export set.

## permanent exclusions

Regardless of promotion, do not expose:

- proof-only biome frame markup;
- arbitrary strong runtime authority;
- a page-wide observer;
- opaque visual mutation;
- a biome-specific page template;
- automatic content removal or semantic reordering.
