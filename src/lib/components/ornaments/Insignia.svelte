<script lang="ts">
	import { cn } from '../../utils/cn.js';
	import Seal from './Seal.svelte';
	import Glyph from './Glyph.svelte';
	import type { GlyphName } from './glyphs/index.js';

	/**
	 * Composite: Seal + Glyph. Sugar for the most common stamp pattern.
	 *
	 * @example
	 * <Insignia glyph="compass-rose" seal="compass" size="md" />
	 */
	interface Props {
		glyph: GlyphName;
		seal?: 'compass' | 'void' | 'wax' | 'simple';
		size?: 'sm' | 'md' | 'lg';
		class?: string;
	}

	let { glyph, seal = 'simple', size = 'md', class: className = '' }: Props = $props();

	const sealConfig = {
		compass: { rings: 3, spokes: 8 },
		void: { rings: 2, spokes: 0 },
		wax: { rings: 1, spokes: 0 },
		simple: { rings: 2, spokes: 0 }
	} as const;

	const radii = {
		sm: '44px',
		md: '64px',
		lg: '96px'
	} as const;
</script>

<span class={cn('hyvui-insignia', `hyvui-insignia-${seal}`, className)}>
	<Seal
		rings={sealConfig[seal].rings}
		spokes={sealConfig[seal].spokes}
		radius={radii[size]}
	>
		<Glyph name={glyph} />
	</Seal>
</span>

<style>
	.hyvui-insignia {
		display: inline-flex;
		vertical-align: middle;
	}
</style>
