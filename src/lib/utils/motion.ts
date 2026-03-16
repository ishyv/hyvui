/** Standard stagger-in animation parameters. */
export const staggerIn = {
	from: { opacity: 0, transform: 'translateY(6px)' },
	to: { opacity: 1, transform: 'translateY(0)' },
	duration: 500,
	easing: 'cubic-bezier(0.22, 1, 0.36, 1)'
} as const;

/** Standard hover-lift transform. */
export const hoverLift = 'translateY(-2px)';

/** Standard selection shift transform. */
export const selectionShift = 'translateX(6px)';
