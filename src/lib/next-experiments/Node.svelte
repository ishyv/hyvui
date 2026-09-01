<script lang="ts">
  import { cn } from "../utils/cn.js";
  import type { Snippet } from "svelte";
  import { useCompositionContext } from "./context.js";

  interface Props {
    id: string;
    role?: string;
    as?: string;
    ariaHidden?: boolean;
    class?: string;
    style?: string;
    children?: Snippet;
  }

  let {
    id,
    role,
    as = "div",
    ariaHidden = false,
    class: className = "",
    style = "",
    children,
  }: Props = $props();

  const context = useCompositionContext();
  const node = $derived(context?.getNode(id));
  const biomePlan = $derived(context?.getBiomePlan?.());
  const artDirector = $derived(context?.getArtDirector?.());
  const decision = $derived(context?.getNodeDecision(id));
  const relationKinds = $derived(node?.relationKinds.join(" ") ?? "");
  const variation = $derived(node?.variation ?? 0);
  const resolvedRole = $derived(role ?? node?.role ?? "material");
  const artPlane = $derived(artDirector?.nodePlanes[id] ?? "midground");
  const artPose = $derived(artDirector?.nodePoses[id]);
  const biomeVisualIndex = $derived(
    biomePlan ? biomePlan.visualOrder.indexOf(id) : -1,
  );
  const isBiomeFocal = $derived(biomePlan?.focalNodeIds.includes(id) ?? false);
  const resolvedStyle = $derived(
    [
      `--hyv-node-variation: ${variation}`,
      node?.authoredPlacement?.x
        ? `--hyv-node-x: ${node.authoredPlacement.x}`
        : "",
      node?.authoredPlacement?.y
        ? `--hyv-node-y: ${node.authoredPlacement.y}`
        : "",
      node?.authoredPlacement?.scale
        ? `--hyv-node-scale: ${node.authoredPlacement.scale}`
        : "",
      node?.authoredPlacement?.rotate
        ? `--hyv-node-rotate: ${node.authoredPlacement.rotate}`
        : "",
      node?.authoredPlacement?.z !== undefined
        ? `--hyv-node-z: ${node.authoredPlacement.z}`
        : "",
      artPose?.x ? `--hyv-art-x: ${artPose.x}` : "",
      artPose?.y ? `--hyv-art-y: ${artPose.y}` : "",
      artPose ? `--hyv-art-scale: ${artPose.scale}` : "",
      artPose ? `--hyv-art-rotate: ${artPose.rotate}` : "",
      artPose ? `--hyv-art-z: ${artPose.z}` : "",
      style,
    ]
      .filter(Boolean)
      .join("; "),
  );
</script>

<svelte:element
  this={as}
  class={cn("hyvui-next-node", className)}
  data-composition-node={id}
  data-role={resolvedRole}
  data-relations={relationKinds || undefined}
  data-relation-status={decision?.status}
  data-art-plane={artPlane}
  data-art-pose={artPose ? "resolved" : undefined}
  data-biome-host={biomePlan?.hostBiome}
  data-biome-focal={isBiomeFocal ? "true" : undefined}
  data-biome-visual-index={biomeVisualIndex >= 0 ? biomeVisualIndex : undefined}
  aria-hidden={ariaHidden || undefined}
  style={resolvedStyle}
>
  {#if children}{@render children()}{/if}
</svelte:element>

<style>
  :global(.hyvui-next-node) {
    --hyv-hover-color: var(--accent);
    --hyv-hover-lift: 0px;
    --hyv-hover-shift-x: 0px;
    --hyv-hover-origin: center;
    transform-origin: var(--hyv-hover-origin);
    transition:
      transform var(--transition-smooth),
      filter var(--transition-fast),
      opacity var(--transition-fast);
  }

  :global(.hyvui-next-node[data-role="focal-point"]) {
    --hyv-hover-color: var(--accent);
  }

  :global(.hyvui-next-node[data-role="counterweight"]),
  :global(.hyvui-next-node[data-role="connector"]) {
    --hyv-hover-color: var(--signal);
  }

  :global(.hyvui-next-node[data-role="interruption"]) {
    --hyv-hover-color: var(--accent-strong);
  }

  :global(
    [data-next-composition][data-art-authority="strong"][data-adaptation="apply"]
      .hyvui-next-node[data-art-plane="background"]
  ) {
    z-index: 1;
  }

  :global(
    [data-next-composition][data-art-authority="strong"][data-adaptation="apply"]
      .hyvui-next-node[data-art-plane="atmosphere"]
  ) {
    z-index: 2;
  }

  :global(
    [data-next-composition][data-art-authority="strong"][data-adaptation="apply"]
      .hyvui-next-node[data-art-plane="midground"]
  ) {
    z-index: 3;
  }

  :global(
    [data-next-composition][data-art-authority="strong"][data-adaptation="apply"]
      .hyvui-next-node[data-art-plane="focal"]
  ) {
    z-index: 5;
  }

  :global(
    [data-next-composition][data-art-authority="strong"][data-adaptation="apply"]
      .hyvui-next-node[data-art-plane="foreground"]
  ) {
    z-index: 6;
  }

  :global(
    [data-next-composition][data-art-authority="strong"][data-adaptation="apply"]
      .hyvui-next-node[data-art-plane="focal"]
      .hyvui-text-heading
  ) {
    text-shadow: 0 0 2.4rem color-mix(in srgb, var(--accent) 18%, transparent);
  }

  :global(
    [data-next-composition][data-art-authority="strong"][data-adaptation="apply"][data-art-interaction="gravitational-hover"]
      .hyvui-next-node:not([aria-hidden="true"]):hover
  ) {
    --hyv-hover-lift: -6px;
    --hyv-hover-shift-x: 3px;
  }

  :global(
    [data-next-composition][data-art-authority="strong"][data-adaptation="apply"][data-art-interaction="gravitational-hover"]
      .hyvui-next-node[data-art-plane="focal"]:hover
  ) {
    filter: drop-shadow(
      0 0 1.8rem color-mix(in srgb, var(--hyv-hover-color) 42%, transparent)
    );
  }

  :global(.hyvui-next-node[data-composition-region="upper-left"]) {
    --hyv-hover-origin: 100% 100%;
  }

  :global(.hyvui-next-node[data-composition-region="upper-right"]) {
    --hyv-hover-origin: 0% 100%;
  }

  :global(.hyvui-next-node[data-composition-region="lower-left"]) {
    --hyv-hover-origin: 100% 0%;
  }

  :global(.hyvui-next-node[data-composition-region="lower-right"]) {
    --hyv-hover-origin: 0% 0%;
  }

  :global(.hyvui-next-node[data-composition-region="center"]) {
    --hyv-hover-origin: center;
  }

  @media (hover: hover) {
    :global(.hyvui-next-node:not([aria-hidden="true"]):hover),
    :global(.hyvui-next-node:not([aria-hidden="true"]):focus-within) {
      --hyv-hover-lift: -2px;
      filter: drop-shadow(
        0 0 0.8rem color-mix(in srgb, var(--hyv-hover-color) 28%, transparent)
      );
    }

    :global(.hyvui-next-node[data-role="connector"]:hover),
    :global(.hyvui-next-node[data-role="connector"]:focus-within) {
      --hyv-hover-shift-x: 6px;
    }
  }

  :global(.hyvui-next-node[aria-hidden="true"]) {
    pointer-events: none;
  }

  @media (prefers-reduced-motion: reduce) {
    :global(.hyvui-next-node) {
      transition: none;
    }

    :global(.hyvui-next-node:hover),
    :global(.hyvui-next-node:focus-within) {
      --hyv-hover-lift: 0px;
      --hyv-hover-shift-x: 0px;
    }
  }
</style>
