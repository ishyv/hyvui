export type DepthLevel = 'ground' | 'raised' | 'foreground';
export type PerspectivePreset = 'near' | 'mid' | 'far';

/**
 * Returns the CSS translateZ value for a given depth level.
 */
export function depthZ(level: DepthLevel): string {
	const map: Record<DepthLevel, string> = {
		ground: 'var(--depth-ground)',
		raised: 'var(--depth-raised)',
		foreground: 'var(--depth-foreground)'
	};
	return map[level];
}

/**
 * Calculates a 3D tilt transform from a pointer position within an element.
 * Returns a CSS transform string.
 *
 * @param x - pointer x (0-1, normalized within element)
 * @param y - pointer y (0-1, normalized within element)
 * @param maxDeg - maximum tilt angle in degrees (default: 8)
 */
export function tiltTransform(x: number, y: number, maxDeg = 8): string {
	const rx = (y - 0.5) * -maxDeg * 2;
	const ry = (x - 0.5) * maxDeg * 2;
	return `rotateX(${rx}deg) rotateY(${ry}deg)`;
}
