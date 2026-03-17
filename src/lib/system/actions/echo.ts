import type { ActionReturn } from 'svelte/action';

/**
 * Adds a gold radial pulse on click. Signals action receipt.
 * Does not interfere with the element's existing styles.
 * Respects prefers-reduced-motion.
 *
 * @example
 * <button use:echo>confirm</button>
 */
export function echo(node: HTMLElement): ActionReturn {
	const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

	let frame = 0;
	let t1 = 0;
	let t2 = 0;

	function handleClick(e: MouseEvent) {
		if (prefersReduced) return;

		const rect = node.getBoundingClientRect();
		const x = ((e.clientX - rect.left) / rect.width) * 100;
		const y = ((e.clientY - rect.top) / rect.height) * 100;

		const overlay = document.createElement('span');
		overlay.style.cssText = `
      position: absolute;
      inset: 0;
      border-radius: inherit;
      pointer-events: none;
      background: radial-gradient(circle at ${x}% ${y}%, rgba(199, 156, 87, 0.22), transparent 70%);
      opacity: 0;
      transition: opacity 0.15s cubic-bezier(0.4, 0, 0.2, 1);
    `;

		const position = getComputedStyle(node).position;
		if (position === 'static') node.style.position = 'relative';

		node.style.overflow = 'hidden';
		node.appendChild(overlay);

		cancelAnimationFrame(frame);
		clearTimeout(t1);
		clearTimeout(t2);

		frame = requestAnimationFrame(() => {
			overlay.style.opacity = '1';
			t1 = setTimeout(() => {
				overlay.style.opacity = '0';
				t2 = setTimeout(() => overlay.remove(), 200);
			}, 200);
		});
	}

	node.addEventListener('click', handleClick);
	return {
		destroy() {
			node.removeEventListener('click', handleClick);
			cancelAnimationFrame(frame);
			clearTimeout(t1);
			clearTimeout(t2);
		}
	};
}
