<script lang="ts">
  import { cn } from '../../utils/cn.js';
  import StatusDot from './StatusDot.svelte';
  import Button from '../inputs/Button.svelte';

  interface Props {
    /** Error condition title. Describes the condition, not the cause. */
    title?: string;
    /** Additional description text. */
    description?: string;
    /** Shows a retry button. */
    retry?: boolean;
    /** Additional CSS classes. */
    class?: string;
    /** Fires when the retry button is clicked. */
    onretry?: () => void;
  }

  let {
    title = 'the signal needs rest',
    description = '',
    retry = false,
    class: className = '',
    onretry,
  }: Props = $props();
</script>

<div class={cn('hyvui-error', className)}>
  <StatusDot status="fail" size={8} />
  <p class="hyvui-error-title">{title}</p>
  {#if description}
    <p class="hyvui-error-desc">{description}</p>
  {/if}
  {#if retry}
    <div class="hyvui-error-action">
      <Button variant="ghost" onclick={() => onretry?.()}>retry</Button>
    </div>
  {/if}
</div>

<style>
  .hyvui-error {
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
    padding: 2rem;
    gap: 0.75rem;
  }

  .hyvui-error-title {
    font-family: var(--font-body);
    font-size: 1.2rem;
    font-weight: 400;
    line-height: 0.93;
    letter-spacing: -0.04em;
    color: var(--text);
    margin: 0;
  }

  .hyvui-error-desc {
    font-family: var(--font-body);
    font-size: 0.9rem;
    color: var(--muted);
    line-height: 1.5;
    max-width: 24rem;
    margin: 0;
  }

  .hyvui-error-action {
    margin-top: 0.5rem;
  }
</style>
