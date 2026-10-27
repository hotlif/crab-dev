import { useEffect, useRef, type Key, type RefObject } from 'react';
import { useEventCallback } from '@crab-dev/rc-hooks';
import type { MenuProps, MenuOpenKeysChangeDetails } from './menu.js';
import type { Item } from './type.js';

interface PendingDismiss { keys: Set<Key>; all: boolean; item: Item; depth: number; settled: boolean }
function branchKeys(item: Item): Key[] { return [item.key, ...(item.children ?? []).flatMap(branchKeys)]; }

/** Merge one native dismissal before notifying, so sibling/ancestor callbacks cannot restore stale keys. */
export function useMenuDisclosure(openKeys: Key[], onChange: MenuProps['onOpenKeysChange'], root: RefObject<HTMLElement | null>) {
    const pending = useRef(new WeakMap<Event, PendingDismiss>());
    const timers = useRef(new Set<ReturnType<typeof setTimeout>>());
    const mounted = useRef(true);
    useEffect(() => {
        mounted.current = true;
        return () => {
            mounted.current = false;
            for (const timer of timers.current) clearTimeout(timer);
            timers.current.clear();
            pending.current = new WeakMap();
        };
    }, []);
    // Queued native events need the latest committed collection, outside an Effect.
    const flush = useEventCallback((event: Event, request: PendingDismiss) => {
        if (!mounted.current) return;
        const next = request.all ? [] : openKeys.filter(key => !request.keys.has(key));
        if (next.length !== openKeys.length) onChange?.(next, { reason: 'collapse', item: request.item, event });
    });
    const requestOpen = (item: Item, depth: number, next: boolean, event?: MenuOpenKeysChangeDetails['event'], dismissal?: 'hover' | 'outside-press') => {
        if (next === openKeys.includes(item.key)) return;
        const keys = branchKeys(item);
        if (!next && dismissal && event) {
            const nativeEvent = 'nativeEvent' in event ? event.nativeEvent : event;
            const outside = dismissal === 'outside-press' && (!root.current || !nativeEvent.composedPath().includes(root.current));
            const previous = pending.current.get(nativeEvent);
            if (previous) {
                if (previous.settled) return;
                keys.forEach(key => previous.keys.add(key));
                previous.all ||= outside;
                if (depth > previous.depth) { previous.item = item; previous.depth = depth; }
                return;
            }
            const request = { keys: new Set(keys), all: outside, item, depth, settled: false };
            pending.current.set(nativeEvent, request);
            // Floating handlers can forward one native event across microtasks.
            // Merge through the event task, then retain its weak identity so a
            // refused controlled request is not repeated by a later forwarding.
            const timer = setTimeout(() => {
                timers.current.delete(timer);
                request.settled = true;
                flush(nativeEvent, request);
            }, 0);
            timers.current.add(timer);
            return;
        }
        onChange?.(next ? [...openKeys, item.key] : openKeys.filter(key => !keys.includes(key)), { reason: next ? 'expand' : 'collapse', item, event });
    };
    const closeAll = (item: Item, event?: MenuOpenKeysChangeDetails['event']) => {
        if (openKeys.length) onChange?.([], { reason: 'collapse', item, event });
    };
    return { requestOpen, closeAll };
}

function activeElementFor(node: HTMLElement): Element | null {
    let active = node.ownerDocument.activeElement;
    const roots: ShadowRoot[] = [];
    let tree = node.getRootNode();
    while (isShadowRoot(tree)) { roots.unshift(tree); tree = tree.host.getRootNode(); }
    for (const root of roots) { if (active !== root.host) return active; active = root.activeElement; }
    while (active?.shadowRoot?.activeElement) active = active.shadowRoot.activeElement;
    return active;
}

function isShadowRoot(node: Node): node is ShadowRoot { return node.nodeType === 11 && 'host' in node; }

/** Restore only after accepted leaf dismissal, never over an external focus decision. */
export function useMenuSelectionFocus(openKeys: Key[], root: RefObject<HTMLElement | null>) {
    const returnFocus = useRef<HTMLElement | null>(null);
    useEffect(() => {
        const target = returnFocus.current;
        if (!target || openKeys.length) return;
        returnFocus.current = null;
        const active = activeElementFor(target);
        if (target.isConnected && (!active || active === target.ownerDocument.body)) target.focus();
    }, [openKeys]);
    return (node: HTMLElement) => {
        if (!node.contains(activeElementFor(node))) return;
        let owner = node.closest('li');
        while (owner?.parentElement && owner.parentElement !== root.current) owner = owner.parentElement.closest('li');
        returnFocus.current = owner?.querySelector<HTMLElement>('[data-menu-item]') ?? null;
    };
}
