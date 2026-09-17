import { css } from '@crab-dev/css';
import { useEffect, useRef, useState, type ReactNode } from 'react';
import { uniqueId, useCountdown, useEventCallback } from '@crab-dev/rc-hooks';
import Message from '../message.js';
import type { MessageInstance, MessageOpenParam } from '../types.js';

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

interface Item extends MessageOpenParam { id: string; open: boolean }

function MessageItem({ item, stack, active, close, remove }: {
    item: Item; stack: number; active: boolean;
    close: (id: string) => void; remove: (id: string) => void;
}) {
    const [hovered, setHovered] = useState(false);
    const [focused, setFocused] = useState(false);
    const paused = !active || !item.open || hovered || focused;
    const remaining = useCountdown(item.duration ?? 3000, paused, () => close(item.id));
    useEffect(() => {
        if (!active) { setHovered(false); setFocused(false); }
    }, [active]);
    // Keep the deadline state for older items without rendering hidden alerts.
    if (stack > 3) return null;
    return <Message
        type={item.type} content={item.content} icon={item.icon} duration={item.duration}
        open={item.open} stack={Math.max(1, stack)} paused={paused} remaining={remaining}
        onExitComplete={() => remove(item.id)}
        onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)}
        onFocusCapture={() => setFocused(true)}
        onBlurCapture={event => {
            if (!event.currentTarget.contains(event.relatedTarget)) setFocused(false);
        }}
    />;
}

const useMessage = (): [MessageInstance, ReactNode] => {
    const [items, setItems] = useState<Item[]>([]);
    const containerRef = useRef<HTMLDivElement>(null);
    // Mutable instance state: callbacks are consumed once even if close is repeated.
    const callbacks = useRef(new Map<string, () => void>());
    useEffect(() => {
        containerRef.current?.showPopover();
        const registered = callbacks.current;
        return () => registered.clear();
    }, []);
    const close = useEventCallback((id: string) => {
        setItems(previous => previous.map(item => item.id === id ? { ...item, open: false } : item));
        const callback = callbacks.current.get(id);
        callbacks.current.delete(id);
        callback?.();
    });
    const remove = (id: string) => setItems(previous => previous.filter(item => item.id !== id));
    const open = useEventCallback((param: MessageOpenParam) => {
        const id = uniqueId('message-');
        if (param.onClose) callbacks.current.set(id, param.onClose);
        setItems(previous => [...previous, { ...param, id, open: true }]);
    });
    const instance: MessageInstance = {
        open,
        success: (content, duration) => open({ type: 'success', content, duration }),
        error: (content, duration) => open({ type: 'error', content, duration }),
        warning: (content, duration) => open({ type: 'warning', content, duration }),
        info: (content, duration) => open({ type: 'info', content, duration }),
        loading: (content, duration) => open({ type: 'loading', content, duration }),
    };
    const live = items.filter(item => item.open);
    return [instance, <div key="messages" ref={containerRef} className={containerStyle} popover="manual">
        {items.map(item => <MessageItem key={item.id} item={item}
            stack={item.open ? live.length - live.indexOf(item) : 1}
            active={live.at(-1)?.id === item.id}
            close={close} remove={remove}
        />)}
    </div>];
};

export default useMessage;
