/** Structural checks work with nodes created by another same-origin realm. */
export function isShadowRoot(node: Node): node is ShadowRoot {
    return node.nodeType === 11 && 'host' in node;
}

/** Follow the rendered ancestry, including slots and foreign-document shadow hosts. */
export function getComposedParentElement(element: Element): Element | null {
    if (element.assignedSlot) return element.assignedSlot;
    if (element.parentElement) return element.parentElement;
    const root = element.getRootNode();
    return isShadowRoot(root) ? root.host : null;
}
