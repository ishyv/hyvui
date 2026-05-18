<script lang="ts">
  import type { Snippet } from "svelte";
  import {
    applyTheme,
    applyWeight,
    clearTheme,
    clearWeight,
  } from "../../system/register.js";
  import type { ThemeRegister, WeightRegister } from "../../system/register.js";
  import Vignette from "../ambient/Vignette.svelte";

  /**
   * Zero-config app wrapper. Handles IBM Plex Mono font injection, weight/theme application
   * to `<body>`, and the global Vignette overlay.
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
   * <!-- opt out of automatic font + vignette -->
   * <AppShell loadFonts={false} vignette={false}>
   *   <slot />
   * </AppShell>
   */
  interface Props {
    /** Weight register applied to `<body>`. Controls font weighting and surface density. Omit for base styles. */
    weight?: WeightRegister | null;
    /** Theme applied to `<body>`. Controls palette and motif. Omit for base theme. */
    theme?: ThemeRegister | null;
    /** Inject IBM Plex Mono (400) from Google Fonts via `<head>`. Default: true. */
    loadFonts?: boolean;
    /** Render the global Vignette overlay. Default: true. */
    vignette?: boolean;
    children?: Snippet;
  }

  let {
    weight = null,
    theme = null,
    loadFonts = true,
    vignette = true,
    children,
  }: Props = $props();

  $effect(() => {
    if (weight) {
      applyWeight(weight);
    } else {
      clearWeight();
    }

    if (theme) {
      applyTheme(theme);
    } else {
      clearTheme();
    }

    return () => {
      clearWeight();
      clearTheme();
    };
  });
</script>

<svelte:head>
  {#if loadFonts}
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link
      rel="preconnect"
      href="https://fonts.gstatic.com"
      crossorigin="anonymous"
    />
    <link
      href="https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@400&display=swap"
      rel="stylesheet"
    />
  {/if}
</svelte:head>

{#if vignette}
  <Vignette />
{/if}

{@render children?.()}
