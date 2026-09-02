<script lang="ts" module>
  const APP_SHELL_DEPTH = Symbol("hyvui-app-shell-depth");
</script>

<script lang="ts">
  import { getContext, onMount, setContext } from "svelte";
  import type { Snippet } from "svelte";
  import type {
    GradeRegister,
    ThemeRegister,
    WeightRegister,
  } from "../../system/register.js";
  import {
    claimBodyAppearance,
    releaseBodyAppearance,
  } from "../../system/app-shell-ownership.js";
  import Vignette from "../ambient/Vignette.svelte";

  const parentDepth = getContext<number>(APP_SHELL_DEPTH);
  const depth = (parentDepth ?? -1) + 1;
  setContext(APP_SHELL_DEPTH, depth);

  /**
   * Document-level convenience wrapper. It owns only the appearance channels
   * supplied by this instance and restores the previous body state on unmount.
   *
   * Import `@hyvnt/hyvui/styles.css` separately in your app entry point.
   *
   * @example
   * <AppShell weight="mission-control">
   *   <Topbar />
   *   <StageScene>...</StageScene>
   * </AppShell>
   *
   * @example
   * <!-- opt out of the global vignette -->
   * <AppShell vignette={false}>
   *   <slot />
   * </AppShell>
   */
  interface Props {
    /** Weight register applied to `<body>`. Omit to leave the current owner intact. */
    weight?: WeightRegister | null;
    /** Theme applied to `<body>`. Omit to leave the current owner intact. */
    theme?: ThemeRegister | null;
    /** Grade applied to `<body>`. Omit to leave the current owner intact. */
    grade?: GradeRegister | null;
    /** Render the global Vignette overlay. Default: true. */
    vignette?: boolean;
    children?: Snippet;
  }

  let { weight, theme, grade, vignette = true, children }: Props = $props();

  const owner = Symbol("hyvui-app-shell");

  onMount(() => {
    claimBodyAppearance(owner, depth, weight, theme, grade);
    return () => releaseBodyAppearance(owner);
  });

  $effect(() => {
    claimBodyAppearance(owner, depth, weight, theme, grade);
  });
</script>

{#if vignette}
  <Vignette />
{/if}

{@render children?.()}
