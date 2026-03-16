<script lang="ts">
	import { cn } from '../../utils/cn.js';
	import Input from '../inputs/Input.svelte';
	import StatusDot from '../feedback/StatusDot.svelte';

	/**
	 * @remarks Use in PageHeader actions slot or ArchiveScene filter slot.
	 * @example
	 * <SearchBar bind:value={query} onsearch={handleSearch} loading={isSearching} />
	 */
	interface Props {
		/** Current search value (bindable). */
		value?: string;
		/** Placeholder text. */
		placeholder?: string;
		/** Shows a loading indicator. */
		loading?: boolean;
		/** Additional CSS classes. */
		class?: string;
		/** Fires on input with the current value. */
		onsearch?: (value: string) => void;
	}

	let {
		value = $bindable(''),
		placeholder = 'search',
		loading = false,
		class: className = '',
		onsearch
	}: Props = $props();

	function handleInput() {
		onsearch?.(value);
	}
</script>

<div class={cn('hyvui-search-bar', className)}>
	<Input type="search" bind:value {placeholder} oninput={handleInput} />
	{#if loading}
		<div class="hyvui-search-loading">
			<StatusDot status="pend" size={6} />
		</div>
	{/if}
</div>

<style>
	.hyvui-search-bar {
		position: relative;
		width: 100%;
	}

	.hyvui-search-loading {
		position: absolute;
		right: 0.9rem;
		top: 50%;
		transform: translateY(-50%);
		pointer-events: none;
	}
</style>
