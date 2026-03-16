<script lang="ts">
	import { cn } from '../../utils/cn.js';

	interface Props {
		/** Line visibility strength. */
		strength?: 'default' | 'strong';
		/** Additional CSS classes. */
		class?: string;
	}

	let { strength = 'default', class: className = '' }: Props = $props();
</script>

<hr
	class={cn('hyvui-divider', className)}
	style:border-color={strength === 'strong' ? 'var(--line-strong)' : 'var(--line)'}
/>

<style>
	.hyvui-divider {
		border: none;
		border-top: 1px solid;
		margin: 0;
		width: 100%;
	}
</style>
