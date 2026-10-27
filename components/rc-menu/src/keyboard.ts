import type { KeyboardEvent } from 'react';

// Synchronous activation metadata is scoped to the actual DOM trigger and cleared
// in finally; it never stores component state or changes during rendering.
const activations = new WeakMap<HTMLElement, KeyboardEvent<HTMLElement>>();
export function menuActivationEvent(target: HTMLElement): KeyboardEvent<HTMLElement> | undefined { return activations.get(target); }
function activate(target: HTMLElement, event: KeyboardEvent<HTMLElement>) {
    activations.set(target, event);
    try { target.click(); } finally { activations.delete(target); }
}

/** Disclosure navigation keeps normal Tab order and adds layout-matched arrow keys. */
export function navigateMenu(event: KeyboardEvent<HTMLElement>, horizontal = false): void {
    const view = event.currentTarget.ownerDocument.defaultView;
    if (event.defaultPrevented || !view || !(event.target instanceof view.HTMLElement)) return;
    const target = event.target.closest<HTMLElement>('[data-menu-item]');
    if (!target) return;
    if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        activate(target, event);
        return;
    }
    const container = horizontal ? target.closest('ul') : event.currentTarget;
    const horizontalLevel = horizontal && container === event.currentTarget;
    const items = [...(container?.querySelectorAll<HTMLElement>('[data-menu-item]') ?? [])]
        .filter(item => !item.closest('[inert]') && item.getAttribute('aria-disabled') !== 'true'
            && (!horizontal || item.closest('ul') === container));
    const index = items.indexOf(target);
    if (index < 0) return;
    const declaredDirection = target.closest('[dir]')?.getAttribute('dir');
    const rtl = declaredDirection === 'rtl' || (declaredDirection !== 'ltr' && view.getComputedStyle(target).direction === 'rtl');
    const forwardKey = horizontalLevel ? (rtl ? 'ArrowLeft' : 'ArrowRight') : 'ArrowDown';
    const backwardKey = horizontalLevel ? (rtl ? 'ArrowRight' : 'ArrowLeft') : 'ArrowUp';
    let next: number;
    if (event.key === 'Home') next = 0;
    else if (event.key === 'End') next = items.length - 1;
    else if (event.key === forwardKey) next = (index + 1) % items.length;
    else if (event.key === backwardKey) next = (index + items.length - 1) % items.length;
    else return;
    event.preventDefault();
    items[next]?.focus();
}
