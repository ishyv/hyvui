import type { ActionReturn } from 'svelte/action';

interface SurfaceOptions {
	/** Delay in ms before the entrance animation starts. */
	delay?: number;
}

/**
 * Plays the standard hyvui entrance: translateY(6px) -> 0, opacity 0 -> 1.
 * Respects prefers-reduced-motion.
 *
 * @example
 * <div use:surface={{ delay: 200 }}>content</div>
 */
export function surface(
	node: HTMLElement,
	options: SurfaceOptions = {}
): ActionReturn<SurfaceOptions> {
	const { delay = 0 } = options;

	const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

	if (prefersReduced) return {};

	node.style.opacity = '0';
	node.style.transform = 'translateY(6px)';
	node.style.transition = `opacity 0.38s cubic-bezier(0.22, 1, 0.36, 1) ${delay}ms, transform 0.38s cubic-bezier(0.22, 1, 0.36, 1) ${delay}ms`;

	function onEnd(e: TransitionEvent) {
		if (e.propertyName !== 'transform') return;
		node.removeEventListener('transitionend', onEnd);
		// Clear transforms to avoid creating containing blocks for fixed/floating UI.
		node.style.transform = 'none';
		node.style.transition = '';
	}

	node.addEventListener('transitionend', onEnd);

	const frame = requestAnimationFrame(() => {
		node.style.opacity = '1';
		node.style.transform = 'translateY(0)';
	});

	return {
		destroy() {
			node.removeEventListener('transitionend', onEnd);
			cancelAnimationFrame(frame);
		}
	};
}
