<script lang="ts">
	import { cn } from '../../utils/cn.js';

	interface Props {
		/** Image source URL. */
		src?: string;
		/** Name for initials fallback. */
		name?: string;
		/** Avatar diameter in pixels. */
		size?: number;
		/** Additional CSS classes. */
		class?: string;
	}

	let { src = '', name = '', size = 32, class: className = '' }: Props = $props();

	const initials = $derived(
		name
			.split(' ')
			.map((w) => w[0])
			.join('')
			.slice(0, 2)
			.toUpperCase()
	);
</script>

<span
	class={cn('hyvui-avatar', className)}
	style:width="{size}px"
	style:height="{size}px"
	style:font-size="{size * 0.38}px"
>
	{#if src}
		<img {src} alt={name} class="hyvui-avatar-img" />
	{:else}
		<span class="hyvui-avatar-initials">{initials}</span>
	{/if}
</span>

<style>
	.hyvui-avatar {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		border-radius: 50%;
		background-color: var(--bg-elev);
		border: 1px solid var(--line);
		overflow: hidden;
		flex-shrink: 0;
	}

	.hyvui-avatar-img {
		width: 100%;
		height: 100%;
		object-fit: cover;
	}

	.hyvui-avatar-initials {
		font-family: var(--font-mono);
		font-weight: 400;
		color: var(--muted);
		letter-spacing: 0.04em;
	}
</style>
