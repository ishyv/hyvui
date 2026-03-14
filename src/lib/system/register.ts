export type Register = 'field-notebook' | 'mission-control' | 'archive';

/**
 * Applies a register to an element by setting data-register.
 * Call with a DOM element reference or 'body' to set globally.
 */
export function applyRegister(register: Register, target: HTMLElement | 'body' = 'body') {
  const el = target === 'body' ? document.body : target;
  el.dataset.register = register;
}

/**
 * Removes the register from an element, restoring default behavior.
 */
export function clearRegister(target: HTMLElement | 'body' = 'body') {
  const el = target === 'body' ? document.body : target;
  delete el.dataset.register;
}

export const registers: Register[] = ['field-notebook', 'mission-control', 'archive'];
