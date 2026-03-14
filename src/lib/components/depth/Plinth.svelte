<script lang="ts">
  import { cn } from '../../utils/cn.js';

  interface Props {
    /** Width of the plinth surface. */
    width?: string;
    /** How far the plinth recedes (visual depth). */
    depth?: string;
    /** Surface tint color. */
    color?: string;
    /** Additional CSS classes. */
    class?: string;
  }

  let {
    width = '100%',
    depth = '40px',
    color = 'rgba(199, 156, 87, 0.03)',
    class: className = '',
  }: Props = $props();
</script>

<div class={cn('hyvui-plinth-wrap', className)}>
  <div
    class="hyvui-plinth"
    style:width={width}
    style:height={depth}
    style:background-color={color}
  ></div>
</div>

<style>
  .hyvui-plinth-wrap {
    perspective: var(--perspective-mid);
    perspective-origin: 50% 0%;
    display: flex;
    justify-content: center;
    pointer-events: none;
  }

  .hyvui-plinth {
    transform: rotateX(70deg) translateZ(-20px);
    border-top: 1px solid rgba(199, 156, 87, 0.08);
    opacity: 0.6;
  }

  @media (prefers-reduced-motion: reduce) {
    .hyvui-plinth-wrap {
      perspective: none;
    }

    .hyvui-plinth {
      transform: none;
      opacity: 0.3;
    }
  }
</style>
