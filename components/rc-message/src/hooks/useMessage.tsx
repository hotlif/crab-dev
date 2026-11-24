import { css } from '@crab-dev/css';
import { useEffect, useRef, useState, type ReactNode } from 'react';
import { uniqueId, useCountdown, useEventCallback } from '@crab-dev/rc-hooks';
import { ConfigBoundary, useLocale } from '@crab-dev/rc-config-provider';
import Message from '../message.js';
import type { MessageInstance, MessageOpenParam, MessageHandle, MessageUpdate, UseMessageOptions } from '../types.js';

const containerStyle = css`
    display: grid;
    grid-template-columns: 1fr;
    align-items: start;
    justify-items: center;
    inset: 0 auto auto 50%;
    transform: translate(-50%, 0);
    border: unset;
    padding: unset;
    margin: unset;
    overflow: visible;
    background: transparent;
    pointer-events: none;
`;

const dismissStyle = css`
    margin-inline-start: 0.5em;
    padding: 0 0.35em;
    border: 0;
    border-radius: 0.25em;
    background: transparent;
    color: inherit;
    font: inherit;
    cursor: pointer;
    &:focus-visible { outline: 2px solid currentColor; outline-offset: 1px; }
    @media (forced-colors: active) { &:focus-visible { outline-color: Highlight; } }
`;

interface Item extends MessageOpenParam { id: string; open: boolean; revision: number; occurrences: number }
interface MessageControl {
    onClose?: () => void;
    mergeKey?: string;
    opener?: HTMLElement;
}

function MessageItem({ item, stack, active, closable, close, remove }: {
    item: Item; stack: number; active: boolean;
    closable: boolean;
    close: (id: string, restoreFocus?: boolean) => void; remove: (id: string) => void;
}) {
    const { locale } = useLocale();
    const [hovered, setHovered] = useState(false);
    const [focused, setFocused] = useState(false);
    const paused = !active || !item.open || hovered || focused;
    const remaining = useCountdown(item.duration ?? 3000, paused, () => close(item.id), item.revision);
    useEffect(() => {
        if (!active) { setHovered(false); setFocused(false); }
    }, [active]);
    // Keep the deadline state for older items without rendering hidden alerts.
    if (stack > 3) return null;
    return <Message
        type={item.type} icon={item.icon} duration={item.duration}
        content={<>{item.content}
            {item.occurrences > 1 && <span aria-hidden="true"> ×{item.occurrences}</span>}
            {closable && active && <button type="button" className={dismissStyle}
                aria-label={locale === 'en-US' ? 'Dismiss message' : '关闭消息'} onClick={() => close(item.id, true)}>×</button>}
        </>}
        open={item.open} stack={Math.max(1, stack)} paused={paused} remaining={remaining} progressKey={item.revision}
        onExitComplete={() => remove(item.id)}
        onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)}
        onFocusCapture={() => setFocused(true)}
        onBlurCapture={event => {
            if (!event.currentTarget.contains(event.relatedTarget)) setFocused(false);
        }}
    />;
}

const useMessage = (options?: UseMessageOptions): [MessageInstance, ReactNode] => {
    const mode = options?.mode ?? 'stack';
    const [items, setItems] = useState<Item[]>([]);
    const containerRef = useRef<HTMLDivElement>(null);
    // Mutable instance state: callbacks are consumed once even if close is repeated.
    const controls = useRef(new Map<string, MessageControl>());
    const merged = useRef(new Map<string, string>());
    useEffect(() => {
        containerRef.current?.showPopover();
        const registered = controls.current;
        const keys = merged.current;
        return () => { registered.clear(); keys.clear(); };
    }, []);
    const close = useEventCallback((id: string, restoreFocus = false) => {
        const control = controls.current.get(id);
        if (!control) return;
        controls.current.delete(id);
        if (control.mergeKey !== undefined) merged.current.delete(control.mergeKey);
        setItems(previous => {
            if (mode === 'queue' && previous.find(item => item.open)?.id !== id) {
                return previous.filter(item => item.id !== id);
            }
            return previous.map(item => item.id === id ? { ...item, open: false } : item);
        });
        if (restoreFocus && control.opener?.isConnected) control.opener.focus({ preventScroll: true });
        control.onClose?.();
    });
    const update = useEventCallback((id: string, patch: MessageUpdate) => {
        const control = controls.current.get(id);
        if (!control) return;
        if ('onClose' in patch) control.onClose = patch.onClose;
        setItems(previous => previous.map(item => item.id === id && item.open
            ? { ...item, ...patch, revision: item.revision + 1 } : item));
    });
    const remove = (id: string) => setItems(previous => previous.filter(item => item.id !== id));
    const open = useEventCallback((param: MessageOpenParam): MessageHandle => {
        const existing = param.mergeKey === undefined ? undefined : merged.current.get(param.mergeKey);
        const id = existing ?? uniqueId('message-');
        if (existing) {
            setItems(previous => previous.map(item => item.id === id ? { ...item, occurrences: item.occurrences + 1 } : item));
        } else {
            const active = containerRef.current?.ownerDocument.activeElement;
            controls.current.set(id, {
                onClose: param.onClose, mergeKey: param.mergeKey,
                opener: active instanceof HTMLElement ? active : undefined,
            });
            if (param.mergeKey !== undefined) merged.current.set(param.mergeKey, id);
            setItems(previous => [...previous, { ...param, id, open: true, revision: 0, occurrences: 1 }]);
        }
        return { id, close: () => close(id), update: patch => update(id, patch) };
    });
    const instance: MessageInstance = {
        open,
        close,
        update,
        success: (content, duration) => open({ type: 'success', content, duration }),
        error: (content, duration) => open({ type: 'error', content, duration }),
        warning: (content, duration) => open({ type: 'warning', content, duration }),
        info: (content, duration) => open({ type: 'info', content, duration }),
        loading: (content, duration) => open({ type: 'loading', content, duration }),
    };
    const live = items.filter(item => item.open);
    const active = mode === 'queue' ? live[0] : live.at(-1);
    const visible = mode === 'queue' ? items.filter(item => !item.open || item === active) : items;
    return [instance, <ConfigBoundary key="messages" ref={containerRef} className={containerStyle} popover="manual">
        {visible.map(item => <MessageItem key={item.id} item={item}
            stack={mode === 'stack' && item.open ? live.length - live.indexOf(item) : 1}
            active={active?.id === item.id}
            closable={item.closable ?? mode === 'queue'}
            close={close} remove={remove}
        />)}
    </ConfigBoundary>];
};

export default useMessage;
