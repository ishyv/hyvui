<script lang="ts">
  import { cn } from '../../utils/cn.js';

  interface Props {
    /** Start x position (CSS value). */
    x1?: string;
    /** Start y position (CSS value). */
    y1?: string;
    /** End x position (CSS value). */
    x2?: string;
    /** End y position (CSS value). */
    y2?: string;
    /** Enable the traveling dot animation. */
    animated?: boolean;
    /** Additional CSS classes. */
    class?: string;
  }

  let {
    x1 = '0%',
    y1 = '0%',
    x2 = '100%',
    y2 = '100%',
    animated = true,
    class: className = '',
  }: Props = $props();
</script>

<svg
  class={cn('hyvui-thread-line', className)}
  aria-hidden="true"
>
  <line
    {x1} {y1} {x2} {y2}
    stroke="var(--line)"
    stroke-width="1"
  />
  {#if animated}
    <circle r="2" fill="var(--accent)">
      <animateMotion
        dur="3s"
        repeatCount="indefinite"
        path="M 0,0 L 1,0"
        keyPoints="0;1"
        keyTimes="0;1"
        calcMode="linear"
      >
        <mpath>
          <line {x1} {y1} {x2} {y2} />
        </mpath>
      </animateMotion>
      <animate
        attributeName="opacity"
        values="0;0.8;0.8;0"
        keyTimes="0;0.1;0.85;1"
        dur="3s"
        repeatCount="indefinite"
      />
    </circle>
  {/if}
</svg>

<style>
  .hyvui-thread-line {
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
    pointer-events: none;
    overflow: visible;
  }

  @media (prefers-reduced-motion: reduce) {
    .hyvui-thread-line circle {
      display: none;
    }
  }
</style>
