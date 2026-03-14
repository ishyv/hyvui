<script lang="ts">
  import { cn } from '../../utils/cn.js';
  import { tiltTransform } from '../../system/depth/depth.js';
  import Surface from '../primitives/Surface.svelte';
  import type { Snippet } from 'svelte';

  interface Props {
    /** Maximum tilt angle in degrees. */
    tiltMax?: number;
    /** Z-elevation on hover. */
    elevation?: 'raised' | 'foreground';
    /** Additional CSS classes. */
    class?: string;
    /** Card content. */
    children?: Snippet;
  }

  let {
    tiltMax = 8,
    elevation = 'raised',
    class: className = '',
    children,
  }: Props = $props();

  let innerTransform = $state('rotateX(0deg) rotateY(0deg) translateZ(0px)');
  let isHovering = $state(false);

  const prefersReduced =
    typeof window !== 'undefined'
      ? window.matchMedia('(prefers-reduced-motion: reduce)').matches
      : false;

  const elevationMap: Record<string, string> = {
    raised: 'var(--depth-raised)',
    foreground: 'var(--depth-foreground)',
  };

  function handlePointerMove(e: PointerEvent) {
    if (prefersReduced) return;
    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width;
    const y = (e.clientY - rect.top) / rect.height;
    const tilt = tiltTransform(x, y, tiltMax);
    innerTransform = `${tilt} translateZ(${elevationMap[elevation]})`;
    isHovering = true;
  }

  function handlePointerLeave() {
    isHovering = false;
    innerTransform = 'rotateX(0deg) rotateY(0deg) translateZ(0px)';
  }
</script>

<div
  class={cn('hyvui-float-card', className)}
  role="presentation"
  onpointermove={handlePointerMove}
  onpointerleave={handlePointerLeave}
>
  <div
    class="hyvui-float-card-inner"
    class:hyvui-float-card-leaving={!isHovering}
    style:transform={innerTransform}
  >
    <Surface variant="card" class="hyvui-float-card-surface">
      {#if children}{@render children()}{/if}
    </Surface>
  </div>
</div>

<style>
  .hyvui-float-card {
    perspective: var(--perspective-mid);
    perspective-origin: 50% 50%;
  }

  .hyvui-float-card-inner {
    transform-style: preserve-3d;
    will-change: transform;
  }

  .hyvui-float-card-leaving {
    transition: transform var(--depth-transition);
  }

  :global(.hyvui-float-card-surface) {
    padding: var(--space-card);
  }

  @media (prefers-reduced-motion: reduce) {
    .hyvui-float-card {
      perspective: none;
    }

    .hyvui-float-card-inner {
      transform: none !important;
      transform-style: flat;
    }

    .hyvui-float-card-leaving {
      transition: none;
    }
  }
</style>
