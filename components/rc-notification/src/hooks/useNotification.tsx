import { useEffect, useRef, useState, type ReactNode } from "react";
import { uniqueId, useCountdown, useEventCallback } from "@crab-dev/rc-hooks";
import Notification from "../notification.js";
import Container from "../container.js";
import type { Direction, NotificationOpenParam, NotificationInstance, NotificationHandle } from "../types.js";

interface Item extends NotificationOpenParam { id: string; open: boolean; direction: Direction; revision: number }
const directions: Direction[] = ["top", "topLeft", "topRight", "bottom", "bottomLeft", "bottomRight"];

function NotificationItem({ item, stack, active, close, remove }: {
    item: Item; stack: number; active: boolean;
    close: (id: string) => void; remove: (id: string) => void;
}) {
    const [hovered, setHovered] = useState(false);
    const [focused, setFocused] = useState(false);
    const paused = !active || !item.open || hovered || focused;
    const remaining = useCountdown(item.duration ?? 3000, paused, () => close(item.id), item.revision);
    useEffect(() => {
        if (!active) { setHovered(false); setFocused(false); }
    }, [active]);
    if (stack > 3) return null;
    return <Notification title={item.title} open={item.open} direction={item.direction}
        duration={item.duration} showProgress={item.showProgress} paused={paused} remaining={remaining} stack={Math.max(1, stack)} progressKey={item.revision}
        onExitComplete={() => remove(item.id)} onOpenChange={value => { if (!value) close(item.id); }}
        onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)}
        onFocusCapture={() => setFocused(true)}
        onBlurCapture={event => {
            if (!event.currentTarget.contains(event.relatedTarget)) setFocused(false);
        }}
    >{item.description}</Notification>;
}

const useNotification = (): [NotificationInstance, ReactNode] => {
    const [items, setItems] = useState<Item[]>([]);
    // 可变实例状态：关闭回调只调用一次，过期句柄不能重新激活通知。
    const active = useRef(new Map<string, (() => void) | undefined>());
    useEffect(() => {
        const registered = active.current;
        return () => registered.clear();
    }, []);
    const close = useEventCallback((id: string) => {
        if (!active.current.has(id)) return;
        const callback = active.current.get(id);
        active.current.delete(id);
        setItems(previous => previous.map(item => item.id === id ? { ...item, open: false } : item));
        callback?.();
    });
    const update = useEventCallback((id: string, patch: Partial<NotificationOpenParam>) => {
        if (!active.current.has(id)) return;
        if ('onClose' in patch) active.current.set(id, patch.onClose);
        setItems(previous => previous.map(item => item.id === id && item.open
            ? { ...item, ...patch, direction: patch.direction ?? item.direction, revision: item.revision + 1 } : item));
    });
    const remove = (id: string) => setItems(previous => previous.filter(item => item.id !== id));
    const open = useEventCallback((param: NotificationOpenParam): NotificationHandle => {
        const item: Item = { ...param, id: uniqueId('notification-'), direction: param.direction ?? 'topRight', open: true, revision: 0 };
        active.current.set(item.id, param.onClose);
        setItems(previous => [...previous, item]);
        return { id: item.id, close: () => close(item.id), update: patch => update(item.id, patch) };
    });
    return [{ open, close, update }, directions.map(direction => {
        const group = items.filter(item => item.direction === direction);
        if (!group.length) return null;
        const live = group.filter(item => item.open);
        return <Container key={direction} direction={direction}>
            {group.map(item => <NotificationItem key={item.id} item={item}
                stack={item.open ? live.length - live.indexOf(item) : 1}
                active={live.at(-1)?.id === item.id} close={close} remove={remove}
            />)}
        </Container>;
    })];
};

export default useNotification;
