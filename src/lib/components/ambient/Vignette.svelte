<script lang="ts">
  import { cn } from '../../utils/cn.js';

  interface Props {
    /** Additional CSS classes. */
    class?: string;
  }

  let {
    class: className = '',
  }: Props = $props();
</script>

<div class={cn('hyvui-vignette', className)} aria-hidden="true"></div>

<style>
  .hyvui-vignette {
    position: fixed;
    inset: 0;
    pointer-events: none;
    z-index: var(--z-overlay);
    background:
      radial-gradient(ellipse at 50% 0%, transparent 60%, rgba(0, 0, 0, 0.4)),
      radial-gradient(ellipse at 50% 100%, transparent 60%, rgba(0, 0, 0, 0.5));
  }
</style>
