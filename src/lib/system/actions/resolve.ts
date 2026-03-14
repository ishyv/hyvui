import type { ActionReturn } from 'svelte/action';

export type ResolveStatus = 'ok' | 'warn' | 'fail' | 'pend';

const statusColors: Record<ResolveStatus, string> = {
  ok: 'var(--status-ok)',
  warn: 'var(--status-warn)',
  fail: 'var(--status-fail)',
  pend: 'var(--status-pend)',
};

export interface ResolveAction {
  /** Trigger the status flash animation. */
  trigger: (status: ResolveStatus) => void;
}

/**
 * Animates a status change on an element. A brief overlay flash in the
 * status color signals the transition, then fades out.
 * Dispatches custom DOM events `resolve:start` and `resolve:end`.
 * Respects prefers-reduced-motion.
 *
 * @example
 * <script>
 *   let resolveAction;
 *   async function submit() {
 *     const ok = await doSubmit();
 *     resolveAction.trigger(ok ? 'ok' : 'fail');
 *   }
 * </script>
 * <form use:resolve={a => resolveAction = a}>...</form>
 */
export function resolve(
  node: HTMLElement,
  register: (action: ResolveAction) => void
): ActionReturn {
  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const position = getComputedStyle(node).position;
  if (position === 'static') node.style.position = 'relative';

  function trigger(status: ResolveStatus) {
    node.dispatchEvent(new CustomEvent('resolve:start', { detail: status }));

    if (prefersReduced) {
      node.dispatchEvent(new CustomEvent('resolve:end', { detail: status }));
      return;
    }

    const overlay = document.createElement('span');
    overlay.style.cssText = `
      position: absolute;
      inset: 0;
      pointer-events: none;
      background: ${statusColors[status]};
      opacity: 0;
      border-radius: inherit;
      transition: opacity 0.12s ease-out;
    `;
    node.appendChild(overlay);

    requestAnimationFrame(() => {
      overlay.style.opacity = '0.12';
      setTimeout(() => {
        overlay.style.transition = 'opacity 0.4s ease-out';
        overlay.style.opacity = '0';
        setTimeout(() => {
          overlay.remove();
          node.dispatchEvent(new CustomEvent('resolve:end', { detail: status }));
        }, 450);
      }, 200);
    });
  }

  register({ trigger });

  return {};
}
