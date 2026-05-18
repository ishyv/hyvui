<script lang="ts">
  import { onMount } from "svelte";
  import { cn } from "../../utils/cn.js";
  import {
    applyTheme,
    applyWeight,
    clearTheme,
    themeRegisters,
    weightRegisters,
  } from "../../system/register.js";
  import type { ThemeRegister, WeightRegister } from "../../system/register.js";

  /**
   * Compact controls for switching weight and theme independently.
   * Persists choices to localStorage. Mounts quietly until hovered.
   *
   * @example
   * <RegisterSwitcher />
   * <RegisterSwitcher defaultWeight="mission-control" defaultTheme="hextech" />
   */
  interface Props {
    /** Which weight to apply on first load if no localStorage entry exists. */
    defaultWeight?: WeightRegister;
    /** Which theme to apply on first load if no localStorage entry exists. */
    defaultTheme?: ThemeRegister | null;
    /** Subset of weights to expose. */
    weights?: WeightRegister[];
    /** Subset of themes to expose. */
    themes?: ThemeRegister[];
    /** Additional CSS classes. */
    class?: string;
  }

  let {
    defaultWeight = "field-notebook",
    defaultTheme = null,
    weights = weightRegisters,
    themes = themeRegisters,
    class: className = "",
  }: Props = $props();

  const WEIGHT_KEY = "hyvui-weight";
  const THEME_KEY = "hyvui-theme";

  const weightLabels: Record<WeightRegister, string> = {
    "field-notebook": "fn",
    "mission-control": "mc",
    archive: "ar",
  };

  const themeLabels: Record<ThemeRegister, string> = {
    hextech: "hx",
    arcane: "ac",
  };

  let currentWeight: WeightRegister = $state("field-notebook");
  let currentTheme: ThemeRegister | null = $state(null);

  function init() {
    currentWeight = defaultWeight;
    currentTheme = defaultTheme;

    if (typeof localStorage !== "undefined") {
      const savedWeight = localStorage.getItem(
        WEIGHT_KEY,
      ) as WeightRegister | null;
      const savedTheme = localStorage.getItem(
        THEME_KEY,
      ) as ThemeRegister | null;

      if (savedWeight && (weightRegisters as string[]).includes(savedWeight)) {
        currentWeight = savedWeight;
      }
      if (savedTheme && (themeRegisters as string[]).includes(savedTheme)) {
        currentTheme = savedTheme;
      }
    }

    applyWeight(currentWeight);
    if (currentTheme) {
      applyTheme(currentTheme);
    } else {
      clearTheme();
    }
  }

  function selectWeight(weight: WeightRegister) {
    currentWeight = weight;
    applyWeight(weight);
    if (typeof localStorage !== "undefined") {
      localStorage.setItem(WEIGHT_KEY, weight);
    }
  }

  function selectTheme(theme: ThemeRegister | null) {
    currentTheme = theme;
    if (theme) {
      applyTheme(theme);
    } else {
      clearTheme();
    }
    if (typeof localStorage !== "undefined") {
      if (theme) localStorage.setItem(THEME_KEY, theme);
      else localStorage.removeItem(THEME_KEY);
    }
  }

  onMount(init);
</script>

<div
  class={cn("hyvui-reg-switcher", className)}
  aria-label="weight and theme controls"
>
  <div class="hyvui-reg-group" role="group" aria-label="weight register">
    {#each weights as weight}
      <button
        class={cn(
          "hyvui-reg-btn",
          currentWeight === weight && "hyvui-reg-btn--active",
        )}
        onclick={() => selectWeight(weight)}
        title={weight}
        aria-pressed={currentWeight === weight}
      >
        {weightLabels[weight]}
      </button>
    {/each}
  </div>

  <div class="hyvui-reg-group" role="group" aria-label="theme">
    <button
      class={cn(
        "hyvui-reg-btn",
        currentTheme === null && "hyvui-reg-btn--active",
      )}
      onclick={() => selectTheme(null)}
      title="base"
      aria-pressed={currentTheme === null}
    >
      base
    </button>
    {#each themes as theme}
      <button
        class={cn(
          "hyvui-reg-btn",
          currentTheme === theme && "hyvui-reg-btn--active",
        )}
        onclick={() => selectTheme(theme)}
        title={theme}
        aria-pressed={currentTheme === theme}
      >
        {themeLabels[theme]}
      </button>
    {/each}
  </div>
</div>

<style>
  .hyvui-reg-switcher {
    display: inline-flex;
    gap: var(--space-2xs);
    background: color-mix(in srgb, var(--text) 4%, transparent);
    border: 1px solid var(--line);
    padding: var(--space-3xs);
    opacity: 0.4;
    transition: opacity var(--transition-smooth);
  }

  .hyvui-reg-switcher:hover,
  .hyvui-reg-switcher:focus-within {
    opacity: 1;
  }

  .hyvui-reg-group {
    display: inline-flex;
    gap: 1px;
  }

  .hyvui-reg-btn {
    font-family: var(--font-mono);
    font-size: var(--text-2xs);
    letter-spacing: 0.1em;
    text-transform: uppercase;
    color: var(--muted);
    background: transparent;
    border: none;
    padding: var(--space-2xs) var(--space-xs);
    cursor: pointer;
    transition:
      color var(--transition-fast),
      background var(--transition-fast);
    line-height: 1;
  }

  .hyvui-reg-btn:hover {
    color: var(--text-soft);
    background: color-mix(in srgb, var(--text) 6%, transparent);
  }

  .hyvui-reg-btn--active {
    color: var(--accent);
    background: color-mix(in srgb, var(--text) 5%, transparent);
  }

  .hyvui-reg-btn:focus-visible {
    outline: none;
    box-shadow: var(--focus-ring);
  }
</style>
