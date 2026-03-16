let lockCount = 0;
let prevOverflow: string | null = null;

/**
 * Locks document scrolling (ref-counted).
 *
 * Returns an unlock function. Safe to call in SSR (no-op).
 */
export function lockScroll(): () => void {
	if (typeof document === 'undefined') return () => {};

	lockCount += 1;

	if (lockCount === 1) {
		prevOverflow = document.documentElement.style.overflow;
		document.documentElement.style.overflow = 'hidden';
	}

	return () => {
		lockCount = Math.max(0, lockCount - 1);
		if (lockCount !== 0) return;

		document.documentElement.style.overflow = prevOverflow ?? '';
		prevOverflow = null;
	};
}
