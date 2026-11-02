/** The editor can live in an iframe or its standalone ShadowRoot. */
const clearReturnedFocus = new WeakMap<HTMLElement, () => void>();

export function focusedPanel(root: HTMLElement, panelIds: readonly string[]): string | undefined {
    const tree = root.getRootNode() as Document | ShadowRoot;
    const active = tree.activeElement;
    if (!active || !root.contains(active)) return undefined;
    return [...root.querySelectorAll<HTMLElement>('[id]')].find(node => panelIds.includes(node.id) && node.contains(active))?.id;
}

export function returnPanelFocus(root: HTMLElement, panelId: string | undefined, canvasId: string): void {
    // Match actual nodes inside this editor instead of querying the ambient
    // document, which cannot find IDs inside a standalone ShadowRoot.
    const nodes = [...root.querySelectorAll<HTMLElement>('[id]')];
    const available = (node: HTMLElement) => node.getClientRects().length > 0 && !node.matches(':disabled, [aria-disabled="true"]') && !node.closest('[hidden], [inert]');
    const target = nodes.find(node => panelId !== undefined && node.id === `${panelId}-toggle` && available(node))
        ?? nodes.find(node => node.id === canvasId && available(node));
    if (!target) return;
    clearReturnedFocus.get(target)?.();
    const clear = () => {
        target.removeAttribute('data-pdf-focus-return');
        target.removeEventListener('blur', clear);
        target.removeEventListener('pointerdown', clear);
        clearReturnedFocus.delete(target);
    };
    // Firefox can drop :focus-visible when a resize hides the focused field.
    // Keep this programmatic return visible until blur or the next pointer use.
    target.setAttribute('data-pdf-focus-return', '');
    clearReturnedFocus.set(target, clear);
    target.addEventListener('blur', clear, { once: true });
    target.addEventListener('pointerdown', clear, { once: true });
    target.focus({ preventScroll: true });
    if (!target.matches(':focus')) clear();
}
