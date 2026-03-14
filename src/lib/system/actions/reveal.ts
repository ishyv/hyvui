import type { ActionReturn } from 'svelte/action';

interface RevealOptions {
  /** CSS selector for the child element to reveal on hover. */
  target: string;
}

/**
 * Reveals a child element when the node is hovered.
 * The target child starts invisible and transitions in on hover.
 * Respects prefers-reduced-motion (instant show/hide, no transition).
 *
 * @example
 * <div use:reveal={{ target: '.meta' }}>
 *   <span>main content</span>
 *   <span class="meta">revealed on hover</span>
 * </div>
 */
export function reveal(node: HTMLElement, options: RevealOptions): ActionReturn<RevealOptions> {
  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function getTarget(): HTMLElement | null {
    return node.querySelector(options.target);
  }

  function init() {
    const target = getTarget();
    if (!target) return;
    target.style.opacity = '0';
    target.style.transform = prefersReduced ? 'none' : 'translateY(4px)';
    if (!prefersReduced) {
      target.style.transition = 'opacity 0.25s ease-out, transform 0.25s ease-out';
    }
  }

  function show() {
    const target = getTarget();
    if (!target) return;
    target.style.opacity = '1';
    target.style.transform = 'translateY(0)';
  }

  function hide() {
    const target = getTarget();
    if (!target) return;
    target.style.opacity = '0';
    target.style.transform = prefersReduced ? 'none' : 'translateY(4px)';
  }

  init();
  node.addEventListener('mouseenter', show);
  node.addEventListener('mouseleave', hide);
  node.addEventListener('focusin', show);
  node.addEventListener('focusout', hide);

  return {
    destroy() {
      node.removeEventListener('mouseenter', show);
      node.removeEventListener('mouseleave', hide);
      node.removeEventListener('focusin', show);
      node.removeEventListener('focusout', hide);
    },
  };
}
