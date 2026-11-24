import { useEffect, useRef, useState, type ReactNode } from "react";
import { uniqueId, useCountdown, useEventCallback } from "@crab-dev/rc-hooks";
import { useLocale } from "@crab-dev/rc-config-provider";
import { css } from "@crab-dev/css";
import Button from "@crab-dev/rc-button";
import Notification from "../notification.js";
import Container from "../container.js";
import token from "../token.js";
import type { Direction, NotificationOpenParam, NotificationInstance, NotificationHandle, NotificationUpdate, UseNotificationOptions } from "../types.js";

interface Item extends NotificationOpenParam { id: string; open: boolean; direction: Direction; revision: number }
const directions: Direction[] = ["top", "topLeft", "topRight", "bottom", "bottomLeft", "bottomRight"];

const taskFrame = css`
    display: grid;
    min-inline-size: 0;
    inline-size: min(22rem, calc(100vw - ${token.stack.translate} * 2));
    gap: ${token.stack.gap};
`;
const taskList = css`
    display: grid;
    grid-auto-rows: 2.5rem;
    max-block-size: 7.5rem;
    overflow: auto;
    margin: 0;
    padding-inline: 0.25rem;
    list-style: none;
    border: 1px solid ${token.root["border-color"]};
    border-radius: ${token.root["border-radius"]};
    background: ${token.root["background-color"]};
    color: ${token.text.color};
    pointer-events: auto;
    li { display: grid; align-items: center; min-inline-size: 0; padding-inline: 0.25rem; }
`;
const taskTitle = css`min-inline-size: 0; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;`;
const cards = css`display: grid; min-inline-size: 0; > * { max-inline-size: 100%; }`;

interface NotificationControl {
    callback?: () => void;
    taskKey?: string;
    opener?: HTMLElement;
}

function frontTask(live: Item[], selected: string | undefined) {
    return live.find(item => item.id === selected) ?? live[0];
}

function NotificationItem({ item, stack, active, tasks, close, remove }: {
    item: Item; stack: number; active: boolean;
    tasks: boolean;
    close: (id: string, restoreFocus?: boolean) => void; remove: (id: string) => void;
}) {
    const [hovered, setHovered] = useState(false);
    const [focused, setFocused] = useState(false);
    const paused = !active || !item.open || hovered || focused;
    const duration = item.duration ?? (tasks ? 0 : 3000);
    const remaining = useCountdown(duration, paused, () => close(item.id), item.revision);
    useEffect(() => {
        if (!active) { setHovered(false); setFocused(false); }
    }, [active]);
    if (stack > 3) return null;
    return <Notification title={item.title} open={item.open} direction={item.direction}
        duration={duration} showProgress={item.showProgress} paused={paused} remaining={remaining} stack={Math.max(1, stack)} progressKey={item.revision}
        onExitComplete={() => remove(item.id)} onOpenChange={value => { if (!value) close(item.id, tasks); }}
        onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)}
        onFocusCapture={() => setFocused(true)}
        onBlurCapture={event => {
            if (!event.currentTarget.contains(event.relatedTarget)) setFocused(false);
        }}
    >{item.description}</Notification>;
}

const useNotification = (options?: UseNotificationOptions): [NotificationInstance, ReactNode] => {
    const [items, setItems] = useState<Item[]>([]);
    const [selected, setSelected] = useState<Partial<Record<Direction, string>>>({});
    const { locale } = useLocale();
    const tasks = options?.mode === 'tasks';
    // 可变实例状态：关闭回调只调用一次，过期句柄不能重新激活通知。
    const active = useRef(new Map<string, NotificationControl>());
    const byTask = useRef(new Map<string, string>());
    useEffect(() => {
        const registered = active.current;
        const keys = byTask.current;
        return () => { registered.clear(); keys.clear(); };
    }, []);
    const close = useEventCallback((id: string, restoreFocus = false) => {
        const control = active.current.get(id);
        if (!control) return;
        active.current.delete(id);
        if (control.taskKey !== undefined) byTask.current.delete(control.taskKey);
        setItems(previous => {
            const closing = previous.find(item => item.id === id);
            if (!closing) return previous;
            if (tasks) {
                const live = previous.filter(item => item.direction === closing.direction && item.open);
                if (frontTask(live, selected[closing.direction])?.id !== id) return previous.filter(item => item.id !== id);
            }
            return previous.map(item => item.id === id ? { ...item, open: false } : item);
        });
        if (restoreFocus && control.opener?.isConnected) control.opener.focus({ preventScroll: true });
        control.callback?.();
    });
    const update = useEventCallback((id: string, patch: NotificationUpdate) => {
        const control = active.current.get(id);
        if (!control) return;
        if ('onClose' in patch) control.callback = patch.onClose;
        setItems(previous => previous.map(item => item.id === id && item.open
            ? { ...item, ...patch, direction: patch.direction ?? item.direction, revision: item.revision + 1 } : item));
    });
    const remove = (id: string) => setItems(previous => previous.filter(item => item.id !== id));
    const open = useEventCallback((param: NotificationOpenParam): NotificationHandle => {
        const { taskKey, direction, ...content } = param;
        const existing = taskKey === undefined ? undefined : byTask.current.get(taskKey);
        const id = existing ?? uniqueId('notification-');
        if (existing) {
            update(id, content);
        } else {
            const opener = typeof document === 'undefined' ? undefined : document.activeElement;
            active.current.set(id, { callback: param.onClose, taskKey, opener: opener instanceof HTMLElement ? opener : undefined });
            if (taskKey !== undefined) byTask.current.set(taskKey, id);
            setItems(previous => [...previous, { ...param, id, direction: direction ?? 'topRight', open: true, revision: 0 }]);
        }
        return { id, close: () => close(id), update: patch => update(id, patch) };
    });
    return [{ open, close, update }, directions.map(direction => {
        const group = items.filter(item => item.direction === direction);
        if (!group.length) return null;
        const live = group.filter(item => item.open);
        const front = tasks ? frontTask(live, selected[direction]) : live.at(-1);
        const notifications = group.map(item => {
            const active = front?.id === item.id;
            const stack = !item.open ? 1 : tasks ? (active ? 1 : 4) : live.length - live.indexOf(item);
            return <NotificationItem key={item.id} item={item} stack={stack} active={active} tasks={tasks} close={close} remove={remove} />;
        });
        return <Container key={direction} direction={direction}>
            {tasks ? <div className={taskFrame}>
                {live.length > 0 && <ul className={taskList} aria-label={locale === 'en-US' ? 'Background tasks' : '后台任务'}>
                    {live.map(item => {
                        const label = item.taskLabel ?? (typeof item.title === 'string' ? item.title : item.taskKey ?? (locale === 'en-US' ? 'Task' : '任务'));
                        return <li key={item.id}>
                            <Button size="s" appearance="tonal" isSelected={front?.id === item.id}
                                onClick={() => setSelected(previous => ({ ...previous, [direction]: item.id }))}>
                                <span className={taskTitle}>{label}</span>
                            </Button>
                        </li>;
                    })}
                </ul>}
                <div className={cards}>{notifications}</div>
            </div> : notifications}
        </Container>;
    })];
};

export default useNotification;
