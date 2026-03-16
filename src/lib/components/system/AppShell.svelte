<script lang="ts">
	import type { Snippet } from 'svelte';
	import { applyRegister, clearRegister } from '../../system/register.js';
	import type { Register } from '../../system/register.js';
	import Vignette from '../ambient/Vignette.svelte';

	/**
	 * Zero-config app wrapper. Handles IBM Plex Mono font injection, register application
	 * to `<body>`, and the global Vignette overlay.
	 *
	 * Import `@hyvnt/hyvui/styles.css` separately in your app entry point.
	 *
	 * @example
	 * <AppShell register="mission-control">
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
		/** Design register applied to `<body>`. Controls font weighting and surface density. Omit for base styles. */
		register?: Register | null;
		/** Inject IBM Plex Mono (400) from Google Fonts via `<head>`. Default: true. */
		loadFonts?: boolean;
		/** Render the global Vignette overlay. Default: true. */
		vignette?: boolean;
		children?: Snippet;
	}

	let { register = null, loadFonts = true, vignette = true, children }: Props = $props();

	$effect(() => {
		if (register) {
			applyRegister(register);
		} else {
			clearRegister();
		}
		return () => clearRegister();
	});
</script>

<svelte:head>
	{#if loadFonts}
		<link rel="preconnect" href="https://fonts.googleapis.com" />
		<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin="anonymous" />
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
