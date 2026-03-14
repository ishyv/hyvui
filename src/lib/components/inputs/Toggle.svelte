<script lang="ts">
  import { cn } from '../../utils/cn.js';

  interface Props {
    /** Whether the toggle is on (bindable). */
    checked?: boolean;
    /** Label text. */
    label?: string;
    /** Disables the toggle. */
    disabled?: boolean;
    /** Additional CSS classes. */
    class?: string;
    /** Change handler. */
    onchange?: (e: Event) => void;
  }

  let {
    checked = $bindable(false),
    label = '',
    disabled = false,
    class: className = '',
    onchange,
  }: Props = $props();

  function toggle() {
    if (disabled) return;
    checked = !checked;
    onchange?.(new Event('change'));
  }
</script>

<label class={cn('hyvui-toggle', disabled && 'hyvui-toggle-disabled', className)}>
  <button
    type="button"
    role="switch"
    aria-checked={checked}
    {disabled}
    aria-label={label || 'toggle'}
    class="hyvui-toggle-track"
    class:hyvui-toggle-on={checked}
    onclick={toggle}
  >
    <span class="hyvui-toggle-thumb" class:hyvui-toggle-thumb-on={checked}></span>
  </button>
  {#if label}
    <span class="hyvui-toggle-label">{label}</span>
  {/if}
</label>

<style>
  .hyvui-toggle {
    display: inline-flex;
    align-items: center;
    gap: var(--space-sm);
    cursor: pointer;
    min-width: 0;
  }

  .hyvui-toggle-disabled {
    opacity: 0.4;
    cursor: not-allowed;
  }

  .hyvui-toggle-track {
    width: 42px;
    height: 24px;
    border-radius: 999px;
    background:
      linear-gradient(180deg, rgba(240, 232, 218, 0.02), transparent 48%),
      var(--bg-elev);
    border: 1px solid var(--line-strong);
    position: relative;
    cursor: pointer;
    padding: 0;
    transition:
      background-color var(--transition-fast),
      border-color var(--transition-fast),
      box-shadow var(--transition-fast);
    box-shadow: inset 0 1px 0 rgba(240, 232, 218, 0.03);
  }

  .hyvui-toggle-track:disabled {
    cursor: not-allowed;
  }

  .hyvui-toggle-on {
    background-color: var(--accent);
    border-color: var(--accent);
  }

  .hyvui-toggle-thumb {
    position: absolute;
    top: 2px;
    left: 2px;
    width: 18px;
    height: 18px;
    border-radius: 50%;
    background-color: var(--muted);
    transition: transform var(--transition-fast), background-color var(--transition-fast);
  }

  .hyvui-toggle-thumb-on {
    transform: translateX(18px);
    background-color: var(--bg);
  }

  .hyvui-toggle-label {
    font-family: var(--font-body);
    font-size: 0.98rem;
    color: var(--text-soft);
    line-height: 1.5;
  }

  @media (prefers-reduced-motion: reduce) {
    .hyvui-toggle-track,
    .hyvui-toggle-thumb {
      transition: none;
    }
  }
</style>
