<script lang="ts">
  import type { Snippet } from "svelte";
  import { provideCompositionContext } from "./context.js";
  import { resolveComposition } from "./core.js";
  import { resolveArtDirector } from "./artDirection.js";
  import type { BiomeCompositionPlan } from "./biomeComposition.js";
  import { resolveBiomeAtmosphere } from "./biomeAtmosphere.js";
  import { resolveBiomeMaterial } from "./biomeMaterials.js";
  import { resolveBiomeTypography } from "./biomeTypography.js";
  import {
    getOverlapRatio,
    getRegion,
    overlapBudget,
    resolveOverflowScale,
    resolveOverlapNudge,
    type LayoutRect,
  } from "./visual.js";
  import type {
    ArtDirection,
    CompositionNodeSpec,
    CompositionRelation,
  } from "./types.js";

  interface Props {
    id?: string;
    as?: string;
    artDirection: ArtDirection;
    nodes: CompositionNodeSpec[];
    relations: CompositionRelation[];
    biomePlan?: BiomeCompositionPlan;
    inspect?: boolean;
    class?: string;
    children?: Snippet;
  }

  let {
    id = "composition",
    as = "section",
    artDirection,
    nodes,
    relations,
    biomePlan,
    inspect = false,
    class: className = "",
    children,
  }: Props = $props();

  let rootElement: HTMLElement;
  const result = $derived(
    resolveComposition({ artDirection, nodes, relations }),
  );
  const artDirector = $derived(resolveArtDirector(artDirection, nodes));
  const inspectionJson = $derived(JSON.stringify(result, null, 2));
  const artDirectorJson = $derived(JSON.stringify(artDirector, null, 2));
  const biomePlanJson = $derived(
    biomePlan ? JSON.stringify(biomePlan, null, 2) : "",
  );
  const biomeGrafts = $derived(
    biomePlan?.acceptedGrafts
      .map((graft) => `${graft.biome}:${graft.channel}`)
      .join(" "),
  );
  const biomeMaterial = $derived(
    biomePlan
      ? resolveBiomeMaterial(biomePlan.hostBiome, biomePlan.acceptedGrafts)
      : undefined,
  );
  const biomeTypography = $derived(
    biomePlan
      ? resolveBiomeTypography(biomePlan.hostBiome, biomePlan.acceptedGrafts)
      : undefined,
  );
  const biomeAtmosphere = $derived(
    biomePlan
      ? resolveBiomeAtmosphere(
          biomePlan.hostBiome,
          false,
          biomePlan.acceptedGrafts,
        )
      : undefined,
  );
  const contextLight = $derived(
    artDirection.material === "arcane"
      ? "var(--arc-magenta, var(--accent))"
      : artDirection.material === "hextech"
        ? "var(--signal)"
        : "var(--accent)",
  );
  const focalNode = $derived(nodes.find((node) => node.role === "focal-point"));
  const focusX = $derived(focalNode?.placement?.x ?? "58%");
  const focusY = $derived(focalNode?.placement?.y ?? "38%");

  provideCompositionContext({
    getNode: (nodeId) => result.nodes.find((node) => node.id === nodeId),
    getNodeDecision: (nodeId) => {
      const relation = relations.find((item) => item.source === nodeId);
      return relation
        ? result.decisions.find(
            (decision) => decision.relationId === relation.id,
          )
        : undefined;
    },
    getInspection: () => result,
    getArtDirector: () => artDirector,
    getBiomePlan: () => biomePlan,
  });

  $effect(() => {
    if (!rootElement) return;

    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    );
    const pointerEnabled =
      artDirection.motion === "active" && !prefersReducedMotion.matches;
    rootElement.dataset.pointerMotion = pointerEnabled ? "active" : "disabled";

    const projectLayout = () => {
      if (!rootElement) return;

      const rootRect = rootElement.getBoundingClientRect();
      const elements = new Map(
        [
          ...rootElement.querySelectorAll<HTMLElement>(
            "[data-composition-node]",
          ),
        ].map((element) => [element.dataset.compositionNode ?? "", element]),
      );
      const nudges = new Map<string, { x: number; y: number }>();

      if (artDirection.adaptation === "apply") {
        for (const relation of relations) {
          const budget = overlapBudget(relation.overlap);
          const sourceSpec = nodes.find((node) => node.id === relation.source);
          const targetSpec = nodes.find((node) => node.id === relation.target);
          const sourceElement = elements.get(relation.source);
          const targetElement = elements.get(relation.target);

          if (
            budget === 0 ||
            budget >= 1 ||
            !sourceSpec ||
            !targetSpec ||
            !sourceElement ||
            !targetElement ||
            sourceSpec.constraints?.manualPlacement ||
            targetSpec.constraints?.manualPlacement ||
            ["background", "atmosphere", "field"].includes(sourceSpec.role) ||
            ["background", "atmosphere", "field"].includes(targetSpec.role)
          ) {
            continue;
          }

          const sourceRect = sourceElement.getBoundingClientRect();
          const targetRect = targetElement.getBoundingClientRect();
          const source: LayoutRect = {
            x: sourceRect.x,
            y: sourceRect.y,
            width: sourceRect.width,
            height: sourceRect.height,
          };
          const target: LayoutRect = {
            x: targetRect.x,
            y: targetRect.y,
            width: targetRect.width,
            height: targetRect.height,
          };

          if (getOverlapRatio(source, target) > budget) {
            const nudge = resolveOverlapNudge(source, target, budget);
            const existing = nudges.get(relation.source) ?? { x: 0, y: 0 };
            nudges.set(relation.source, {
              x: existing.x + nudge.x,
              y: existing.y + nudge.y,
            });
          }
        }
      }

      for (const node of nodes) {
        const element = elements.get(node.id);
        if (!element) continue;

        const rect = element.getBoundingClientRect();
        const layoutRect: LayoutRect = {
          x: rect.x,
          y: rect.y,
          width: rect.width,
          height: rect.height,
        };
        const scale = node.constraints?.manualPlacement
          ? 1
          : resolveOverflowScale(layoutRect, rootRect);
        const nudge = nudges.get(node.id) ?? { x: 0, y: 0 };

        element.dataset.compositionRegion = getRegion(layoutRect, rootRect);
        element.dataset.compositionOverflow = scale < 1 ? "collision" : "clear";
        element.style.setProperty("--hyv-auto-scale", String(scale));
        element.style.setProperty("--hyv-auto-nudge-x", `${nudge.x}px`);
        element.style.setProperty("--hyv-auto-nudge-y", `${nudge.y}px`);
      }

      rootElement.dataset.autoAdaptation =
        artDirection.adaptation === "apply"
          ? "applied"
          : artDirection.adaptation;
    };

    const handlePointerMove = (event: PointerEvent) => {
      if (!pointerEnabled) return;
      const rect = rootElement.getBoundingClientRect();
      const x = (event.clientX - rect.left) / rect.width;
      const y = (event.clientY - rect.top) / rect.height;
      rootElement.style.setProperty(
        "--hyv-pointer-x",
        `${Math.round((x - 0.5) * 18)}px`,
      );
      rootElement.style.setProperty(
        "--hyv-pointer-y",
        `${Math.round((y - 0.5) * 14)}px`,
      );
    };

    const resizeObserver =
      "ResizeObserver" in window
        ? new ResizeObserver(projectLayout)
        : undefined;
    resizeObserver?.observe(rootElement);
    rootElement
      .querySelectorAll<HTMLElement>("[data-composition-node]")
      .forEach((element) => {
        resizeObserver?.observe(element);
      });
    rootElement.addEventListener("pointermove", handlePointerMove, {
      passive: true,
    });
    projectLayout();

    return () => {
      resizeObserver?.disconnect();
      rootElement.removeEventListener("pointermove", handlePointerMove);
    };
  });
</script>

<svelte:element
  this={as}
  bind:this={rootElement}
  class={className}
  data-next-composition
  data-composition-id={id}
  data-adaptation={artDirection.adaptation}
  data-composition-valid={result.valid}
  data-composition-material={artDirection.material}
  data-art-authority={artDirector.authority}
  data-art-gesture={artDirector.gesture}
  data-art-thesis={artDirector.thesis}
  data-art-motif={artDirector.motif}
  data-art-palette={artDirector.palette}
  data-art-typography={artDirector.typography}
  data-art-depth={artDirector.depth}
  data-art-interaction={artDirector.interaction}
  data-art-semantic-order={artDirector.semanticOrder.join(" ")}
  data-biome-host={biomePlan?.hostBiome}
  data-biome-grafts={biomeGrafts}
  data-biome-time={biomePlan?.temporal.model}
  data-biome-focal-policy={biomePlan?.focalPolicy}
  data-biome-material={biomeMaterial?.substrate}
  data-biome-typography={biomeTypography?.displayRole}
  data-biome-atmosphere={biomeAtmosphere?.intent}
  data-biome-atmosphere-mode={biomeAtmosphere?.mode}
  style:--hyv-composition-seed={artDirection.seed}
  style:--hyv-context-light={contextLight}
  style:--hyv-focus-x={focusX}
  style:--hyv-focus-y={focusY}
  style:--hyv-pointer-x="0px"
  style:--hyv-pointer-y="0px"
>
  {#if artDirector.canAddAtmosphere}
    <div
      class="hyvui-art-atmosphere"
      data-art-layer="atmosphere"
      aria-hidden="true"
    >
      <span
        class="hyvui-art-atmosphere-orbit"
        data-art-motif={artDirector.motif}
      ></span>
      <span class="hyvui-art-atmosphere-veil"></span>
      <span class="hyvui-art-atmosphere-grain"></span>
    </div>
  {/if}
  {#if children}{@render children()}{/if}
  {#if inspect}
    <pre hidden data-composition-inspector>{inspectionJson}</pre>
    <pre hidden data-art-director-inspector>{artDirectorJson}</pre>
    {#if biomePlan}<pre
        hidden
        data-biome-composition-inspector>{biomePlanJson}</pre>{/if}
  {/if}
</svelte:element>

<style>
  :global([data-next-composition]) {
    position: relative;
    isolation: isolate;
    background:
      radial-gradient(
        circle at var(--hyv-focus-x, 58%) var(--hyv-focus-y, 38%),
        color-mix(
          in srgb,
          var(--hyv-context-light, var(--accent)) 10%,
          transparent
        ),
        transparent 46%
      ),
      color-mix(
        in srgb,
        var(--hyv-context-light, var(--accent)) 2%,
        transparent
      );
  }

  :global([data-next-composition]::before) {
    content: "";
    position: absolute;
    inset: 0;
    z-index: -1;
    pointer-events: none;
    background: linear-gradient(
      112deg,
      transparent 18%,
      color-mix(
          in srgb,
          var(--hyv-context-light, var(--accent)) 7%,
          transparent
        )
        48%,
      transparent 76%
    );
    transform: translate3d(var(--hyv-pointer-x), var(--hyv-pointer-y), 0);
    transition: transform var(--transition-smooth);
  }

  :global([data-next-composition][data-pointer-motion="active"]::before) {
    animation: hyvui-next-light-sweep 14s ease-in-out infinite;
    background-size: 180% 100%;
  }

  :global([data-next-composition][data-art-authority="strong"]) {
    --hyv-art-void: color-mix(in srgb, var(--bg) 82%, var(--signal));
    --hyv-art-glow: color-mix(
      in srgb,
      var(--hyv-context-light, var(--accent)) 24%,
      transparent
    );
  }

  :global(.hyvui-art-atmosphere) {
    position: absolute;
    inset: 0;
    z-index: 0;
    overflow: hidden;
    pointer-events: none;
    opacity: 0.9;
  }

  :global(.hyvui-art-atmosphere-orbit),
  :global(.hyvui-art-atmosphere-veil),
  :global(.hyvui-art-atmosphere-grain) {
    position: absolute;
    display: block;
    pointer-events: none;
  }

  :global(.hyvui-art-atmosphere-orbit) {
    top: 8%;
    left: 33%;
    width: min(62%, 44rem);
    aspect-ratio: 1;
    border: 1px solid
      color-mix(in srgb, var(--hyv-context-light) 34%, transparent);
    border-radius: 50%;
    box-shadow:
      0 0 3rem color-mix(in srgb, var(--hyv-context-light) 12%, transparent),
      inset 0 0 2rem color-mix(in srgb, var(--signal) 8%, transparent);
    transform: translate3d(var(--hyv-pointer-x), var(--hyv-pointer-y), 0)
      rotate(-17deg) scale(1.08);
  }

  :global(.hyvui-art-atmosphere-veil) {
    inset: -12%;
    background:
      radial-gradient(
        ellipse at 58% 38%,
        color-mix(in srgb, var(--hyv-context-light) 18%, transparent),
        transparent 31%
      ),
      linear-gradient(
        137deg,
        transparent 28%,
        color-mix(in srgb, var(--signal) 7%, transparent) 50%,
        transparent 68%
      );
    clip-path: polygon(0 18%, 78% 0, 100% 42%, 69% 100%, 12% 83%);
    mix-blend-mode: screen;
  }

  :global(.hyvui-art-atmosphere-grain) {
    inset: 0;
    opacity: 0.16;
    background-image: repeating-linear-gradient(
      117deg,
      transparent 0,
      transparent 11px,
      color-mix(in srgb, var(--text) 9%, transparent) 12px,
      transparent 13px
    );
    transform: translate3d(
      calc(var(--hyv-pointer-x) * -0.35),
      calc(var(--hyv-pointer-y) * -0.35),
      0
    );
  }

  :global([data-next-composition][data-art-gesture="reliquary"]::after) {
    content: "";
    position: absolute;
    inset: 7% 9% 12% 18%;
    z-index: 0;
    border-inline-start: 1px solid
      color-mix(in srgb, var(--hyv-context-light) 30%, transparent);
    border-block-end: 1px solid
      color-mix(in srgb, var(--signal) 18%, transparent);
    pointer-events: none;
    opacity: 0.5;
    transform: skewY(-7deg) translate3d(var(--hyv-pointer-x), 0, 0);
  }

  :global(
    [data-next-composition][data-art-gesture="reliquary"][data-pointer-motion="active"]
      .hyvui-art-atmosphere-orbit
  ) {
    animation: hyvui-art-reliquary-orbit 24s ease-in-out infinite;
  }

  @keyframes hyvui-art-reliquary-orbit {
    0%,
    100% {
      transform: translate3d(var(--hyv-pointer-x), var(--hyv-pointer-y), 0)
        rotate(-17deg) scale(1.08);
    }

    50% {
      transform: translate3d(
          calc(var(--hyv-pointer-x) * -0.55),
          calc(var(--hyv-pointer-y) * -0.55),
          0
        )
        rotate(11deg) scale(1.14);
    }
  }

  @keyframes hyvui-next-light-sweep {
    0%,
    100% {
      background-position: -18% 0;
    }

    50% {
      background-position: 118% 0;
    }
  }

  @media (prefers-reduced-motion: reduce) {
    :global(.hyvui-art-atmosphere-orbit),
    :global(.hyvui-art-atmosphere-grain) {
      animation: none;
      transform: none;
    }

    :global([data-next-composition]::before) {
      transform: none;
      animation: none;
      transition: none;
    }
  }
</style>
