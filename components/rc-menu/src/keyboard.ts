import type { KeyboardEvent } from 'react';

/** Disclosure navigation keeps normal Tab order and adds layout-matched arrow keys. */
export function navigateMenu(event: KeyboardEvent<HTMLElement>, horizontal = false): void {
    if (event.defaultPrevented || !(event.target instanceof HTMLElement)) return;
    const target = event.target.closest<HTMLElement>('[data-menu-item]');
    if (!target) return;
    if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        target.click();
        return;
    }
    const container = horizontal ? target.closest('ul') : event.currentTarget;
    const horizontalLevel = horizontal && container === event.currentTarget;
    const items = [...(container?.querySelectorAll<HTMLElement>('[data-menu-item]') ?? [])]
        .filter(item => !item.closest('[inert]') && item.getAttribute('aria-disabled') !== 'true'
            && (!horizontal || item.closest('ul') === container));
    const index = items.indexOf(target);
    if (index < 0) return;
    let next: number;
    if (event.key === 'Home') next = 0;
    else if (event.key === 'End') next = items.length - 1;
    else if (event.key === (horizontalLevel ? 'ArrowRight' : 'ArrowDown')) next = (index + 1) % items.length;
    else if (event.key === (horizontalLevel ? 'ArrowLeft' : 'ArrowUp')) next = (index + items.length - 1) % items.length;
    else return;
    event.preventDefault();
    items[next]?.focus();
}
