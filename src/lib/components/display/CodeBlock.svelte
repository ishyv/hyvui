<script lang="ts">
	import { cn } from '../../utils/cn.js';
	import Button from '../inputs/Button.svelte';

	/**
	 * @example
	 * <CodeBlock code="npm install @hyvnt/hyvui" language="bash" />
	 * <CodeBlock code={snippetString} language="typescript" copyable={false} />
	 */
	interface Props {
		/** Code string to display. */
		code?: string;
		/** Language label (informational only, no syntax highlighting built-in). */
		language?: string;
		/** Show copy-to-clipboard button. */
		copyable?: boolean;
		/** Additional CSS classes. */
		class?: string;
	}

	let { code = '', language = '', copyable = true, class: className = '' }: Props = $props();

	let copied = $state(false);

	async function copyCode() {
		try {
			await navigator.clipboard.writeText(code);
			copied = true;
			setTimeout(() => {
				copied = false;
			}, 2000);
		} catch {
			// clipboard access denied
		}
	}
</script>

<div class={cn('hyvui-codeblock', className)}>
	{#if copyable}
		<div class="hyvui-codeblock-actions">
			<Button variant="ghost" size="sm" onclick={copyCode}>
				{copied ? 'copied' : 'copy'}
			</Button>
		</div>
	{/if}
	<pre class="hyvui-codeblock-pre"><code class="hyvui-codeblock-code">{code}</code></pre>
</div>

<style>
	.hyvui-codeblock {
		position: relative;
		background-color: var(--bg-elev);
		border: 1px solid var(--line);
		overflow: hidden;
	}

	.hyvui-codeblock-actions {
		position: absolute;
		top: 0.375rem;
		right: 0.375rem;
		z-index: 1;
	}

	.hyvui-codeblock-pre {
		margin: 0;
		padding: 1rem;
		overflow-x: auto;
	}

	.hyvui-codeblock-code {
		font-family: var(--font-mono);
		font-size: 0.82rem;
		color: var(--text-soft);
		line-height: 1.6;
	}
</style>
