import { getComposedParentElement, isShadowRoot } from './composed-tree.js';

export interface OverlayLayer {
    isTop(): boolean;
    release(options?: { restoreFocus?: boolean }): void;
}

interface LayerRecord {
    element: HTMLElement;
    onEscape?: (event: KeyboardEvent) => void;
    returnFocus: Element | null;
}
interface DocumentLayers {
    layers: LayerRecord[];
    listener: (event: KeyboardEvent) => void;
}

// Mutable instance registries are scoped by ownerDocument, including iframe documents.
const overlayDocuments = new WeakMap<Document, DocumentLayers>();
const scrollDocuments = new WeakMap<Document, { count: number; previousOverflow: string }>();

function activeElement(document: Document): Element | null {
    let active = document.activeElement;
    while (active?.shadowRoot?.activeElement) active = active.shadowRoot.activeElement;
    return active;
}

function containsComposed(container: Node, child: Node): boolean {
    let current: Node | null = child;
    while (current) {
        if (current === container) return true;
        current = current.parentNode ?? (isShadowRoot(current) ? current.host : null);
    }
    return false;
}

function shadowRootChain(element: Element): ShadowRoot[] {
    const roots: ShadowRoot[] = [];
    let root = element.getRootNode();
    while (isShadowRoot(root)) {
        roots.push(root);
        root = root.host.getRootNode();
    }
    return roots;
}

function emptyShadowFocusFallback(active: Element, roots: ShadowRoot[]): boolean {
    // Removing a focused panel can leave document.activeElement at its shadow
    // host. A deliberately focusable host is an external focus target, though.
    if (active.hasAttribute('tabindex') || active.matches('[contenteditable]:not([contenteditable="false"])')
        || 'isContentEditable' in active && active.isContentEditable === true
        || 'tabIndex' in active && typeof active.tabIndex === 'number' && active.tabIndex >= 0) return false;
    return roots.some(root => root.host === active && root.activeElement === null);
}

function unavailableFocusTarget(target: Element): boolean {
    let current: Element | null = target;
    while (current) {
        if (current.matches('[inert], dialog:not([open])')) return true;
        current = getComposedParentElement(current);
    }
    return false;
}

/** Preserve the trigger's realm and local styles, including open shadow trees. */
export function resolveOverlayRoot(element: Element): HTMLElement | ShadowRoot {
    const dialog = element.closest<HTMLElement>('dialog');
    const boundary = element.closest<HTMLElement>('[data-theme], [data-crab-design]');
    if (boundary && (!dialog || dialog.contains(boundary))) return boundary;
    const root = element.getRootNode();
    return dialog ?? (isShadowRoot(root) ? root : element.ownerDocument.body);
}

/** Shared reference-counted background lock; releases may arrive out of order. */
export function acquireScrollLock(target: Document | Element): () => void {
    const document = 'body' in target ? target : target.ownerDocument;
    let record = scrollDocuments.get(document);
    if (!record) {
        record = { count: 0, previousOverflow: document.body.style.overflow };
        scrollDocuments.set(document, record);
    }
    record.count += 1;
    document.body.style.overflow = 'hidden';
    let released = false;
    return () => {
        if (released) return;
        released = true;
        record.count -= 1;
        if (record.count === 0) {
            document.body.style.overflow = record.previousOverflow;
            scrollDocuments.delete(document);
        }
    };
}

/** A single capture listener dispatches Escape to exactly one active layer. */
export function registerOverlayLayer(element: HTMLElement, onEscape?: (event: KeyboardEvent) => void, returnFocus?: Element | null): OverlayLayer {
    const document = element.ownerDocument;
    // Capture the root chain before a framework removes the element from the DOM.
    const focusRoots = shadowRootChain(element);
    let state = overlayDocuments.get(document);
    if (!state) {
        const layers: LayerRecord[] = [];
        const listener = (event: KeyboardEvent) => {
            if (event.key !== 'Escape' || event.defaultPrevented || event.isComposing) return;
            const top = layers.at(-1);
            if (!top?.onEscape) return;
            event.preventDefault();
            event.stopPropagation();
            top.onEscape(event);
        };
        state = { layers, listener };
        overlayDocuments.set(document, state);
        document.addEventListener('keydown', listener, true);
    }
    const layer: LayerRecord = { element, onEscape, returnFocus: returnFocus === undefined ? activeElement(document) : returnFocus };
    const descendantIndex = state.layers.findIndex(entry => containsComposed(element, entry.element));
    if (descendantIndex === -1) state.layers.push(layer);
    else state.layers.splice(descendantIndex, 0, layer);
    let released = false;
    return {
        isTop: () => !released && state.layers.at(-1) === layer,
        release: ({ restoreFocus = true } = {}) => {
            if (released) return;
            released = true;
            const wasTop = state.layers.at(-1) === layer;
            const index = state.layers.indexOf(layer);
            if (index !== -1) state.layers.splice(index, 1);
            if (state.layers.length === 0) {
                document.removeEventListener('keydown', state.listener, true);
                overlayDocuments.delete(document);
            }
            if (!wasTop || !restoreFocus) return;
            const active = activeElement(document);
            if (active && active !== document.body && !containsComposed(element, active) && !emptyShadowFocusFallback(active, focusRoots)) return;
            const candidate = layer.returnFocus;
            if (candidate && candidate.isConnected && !unavailableFocusTarget(candidate) && 'focus' in candidate && typeof candidate.focus === 'function') candidate.focus();
        },
    };
}
