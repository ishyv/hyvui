<script lang="ts">
	import { cn } from '../../utils/cn.js';

	/**
	 * @example
	 * <FileUpload accept="image/*" onfiles={handleImages} />
	 * <FileUpload multiple accept=".csv,.json" onfiles={handleData} label="drop data files here" />
	 */
	interface Props {
		/** Accepted file types (e.g. "image/*"). */
		accept?: string;
		/** Allow multiple file selection. */
		multiple?: boolean;
		/** Disables the upload zone. */
		disabled?: boolean;
		/** Label text displayed in the zone. */
		label?: string;
		/** Description text displayed below the zone. */
		description?: string;
		/** Error message. */
		error?: string;
		/** Additional CSS classes. */
		class?: string;
		/** Fires with the selected files. */
		onfiles?: (files: File[]) => void;
	}

	let {
		accept = '',
		multiple = false,
		disabled = false,
		label = 'drop files here or click to browse',
		description = '',
		error = '',
		class: className = '',
		onfiles
	}: Props = $props();

	let dragging = $state(false);
	let fileNames = $state<string[]>([]);
	let inputEl: HTMLInputElement | undefined = $state();
	const uploadId = `hyvui-file-${Math.random().toString(36).slice(2, 8)}`;
	const message = $derived(error || description);

	function handleFiles(fileList: FileList | null) {
		if (!fileList) return;
		const files = Array.from(fileList);
		fileNames = files.map((f) => f.name);
		onfiles?.(files);
	}

	function onDrop(e: DragEvent) {
		e.preventDefault();
		dragging = false;
		if (disabled) return;
		handleFiles(e.dataTransfer?.files ?? null);
	}

	function onDragOver(e: DragEvent) {
		e.preventDefault();
		if (!disabled) dragging = true;
	}

	function onDragLeave() {
		dragging = false;
	}

	function onClick() {
		if (!disabled) inputEl?.click();
	}

	function onInputChange(e: Event) {
		const target = e.target as HTMLInputElement;
		handleFiles(target.files);
	}
</script>

<div class={cn('hyvui-file-upload', className)}>
	<button
		type="button"
		class={cn(
			'hyvui-file-zone',
			dragging && 'hyvui-file-zone-active',
			error && 'hyvui-file-zone-error',
			disabled && 'hyvui-file-zone-disabled'
		)}
		aria-describedby={message ? `${uploadId}-desc` : undefined}
		ondrop={onDrop}
		ondragover={onDragOver}
		ondragleave={onDragLeave}
		onclick={onClick}
		{disabled}
	>
		<span class="hyvui-file-label">{label}</span>
	</button>
	<input
		bind:this={inputEl}
		type="file"
		{accept}
		{multiple}
		class="hyvui-file-input"
		onchange={onInputChange}
		tabindex="-1"
	/>
	{#if message}
		<span id="{uploadId}-desc" class={cn('hyvui-file-message', error && 'hyvui-file-message-error')}>
			{message}
		</span>
	{/if}
	{#if fileNames.length > 0}
		<div class="hyvui-file-names">
			{#each fileNames as name}
				<span class="hyvui-file-name">{name}</span>
			{/each}
		</div>
	{/if}
</div>

<style>
	.hyvui-file-upload {
		display: flex;
		flex-direction: column;
		gap: var(--space-xs);
	}

	.hyvui-file-zone {
		border: 1px dashed var(--line);
		background: transparent;
		padding: var(--space-xl);
		display: flex;
		align-items: center;
		justify-content: center;
		cursor: pointer;
		transition:
			border-color var(--transition-fast),
			background-color var(--transition-fast);
		width: 100%;
	}

	.hyvui-file-zone:hover:not(:disabled),
	.hyvui-file-zone-active {
		border-color: var(--line-strong);
		background-color: color-mix(in srgb, var(--accent) 4%, transparent);
	}

	.hyvui-file-zone-disabled {
		opacity: 0.4;
		cursor: not-allowed;
	}

	.hyvui-file-zone-error {
		border-color: var(--status-fail);
	}

	.hyvui-file-label {
		font-family: var(--font-mono);
		font-size: var(--text-2xs);
		color: var(--muted);
		letter-spacing: 0.08em;
	}

	.hyvui-file-input {
		position: absolute;
		width: 0;
		height: 0;
		opacity: 0;
		pointer-events: none;
	}

	.hyvui-file-names {
		display: flex;
		flex-wrap: wrap;
		gap: var(--space-2xs);
	}

	.hyvui-file-name {
		font-family: var(--font-mono);
		font-size: var(--text-2xs);
		letter-spacing: 0.14em;
		text-transform: uppercase;
		color: var(--muted-strong);
	}

	.hyvui-file-message {
		font-family: var(--font-mono);
		font-size: var(--text-2xs);
		letter-spacing: 0.14em;
		text-transform: uppercase;
		color: var(--muted-strong);
		line-height: 1.3;
	}

	.hyvui-file-message-error {
		color: var(--status-fail);
	}

	@media (prefers-reduced-motion: reduce) {
		.hyvui-file-zone {
			transition: none;
		}
	}
</style>
