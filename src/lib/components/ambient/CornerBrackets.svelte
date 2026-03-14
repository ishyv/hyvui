<script lang="ts">
  import { cn } from '../../utils/cn.js';

  interface Props {
    /** Bracket arm length in pixels. */
    size?: number;
    /** Bracket color. */
    color?: string;
    /** Additional CSS classes. */
    class?: string;
  }

  let {
    size = 32,
    color = 'rgba(199, 156, 87, 0.24)',
    class: className = '',
  }: Props = $props();
</script>

<div class={cn('hyvui-corners', className)} aria-hidden="true">
  <span
    class="hyvui-corner hyvui-corner-tl"
    style:width="{size}px"
    style:height="{size}px"
    style:border-color={color}
  ></span>
  <span
    class="hyvui-corner hyvui-corner-tr"
    style:width="{size}px"
    style:height="{size}px"
    style:border-color={color}
  ></span>
  <span
    class="hyvui-corner hyvui-corner-bl"
    style:width="{size}px"
    style:height="{size}px"
    style:border-color={color}
  ></span>
  <span
    class="hyvui-corner hyvui-corner-br"
    style:width="{size}px"
    style:height="{size}px"
    style:border-color={color}
  ></span>
</div>

<style>
  .hyvui-corners {
    position: absolute;
    inset: 0;
    pointer-events: none;
  }

  .hyvui-corner {
    position: absolute;
    border-style: solid;
    border-width: 0;
  }

  .hyvui-corner-tl {
    top: 0;
    left: 0;
    border-top-width: 1px;
    border-left-width: 1px;
  }

  .hyvui-corner-tr {
    top: 0;
    right: 0;
    border-top-width: 1px;
    border-right-width: 1px;
  }

  .hyvui-corner-bl {
    bottom: 0;
    left: 0;
    border-bottom-width: 1px;
    border-left-width: 1px;
  }

  .hyvui-corner-br {
    bottom: 0;
    right: 0;
    border-bottom-width: 1px;
    border-right-width: 1px;
  }
</style>
