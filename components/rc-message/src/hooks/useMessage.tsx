import { css } from '@crab-dev/css';
import { useCallback, useEffect, useMemo, useRef, useState, type ReactNode } from 'react';
import { AnimatePresence, useMotionValueEvent, useTime } from 'motion/react';
import { uniqueId } from '@crab-dev/rc-hooks';

import Message from '../message.js';
import type { MessageInstance, MessageItemData, MessageOpenParam, MessageType } from '../types.js';

const defaultDuration = 3000;
const maxVisible = 3;

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
    pointer-events: none;
`;

interface TimerMeta {
    remaining: number;
    startedAt: number;
    paused: boolean;
}

const useMessage = (): [MessageInstance, ReactNode] => {
    const [items, setItems] = useState<MessageItemData[]>([]);
    const time = useTime();

    const timers = useRef<Map<string, true>>(new Map());
    const timerMetas = useRef<Map<string, TimerMeta>>(new Map());
    const onCloseCallbacks = useRef<Map<string, () => void>>(new Map());
    const containerRef = useRef<HTMLDivElement>(null);

    // 使用 ref 版 close 避免依赖循环，同时保证 timer 回调拿到最新引用
    const closeRef = useRef<(id: string) => void>(undefined);

    const close = useCallback((id: string) => {
        setItems(prev => prev.filter(item => item.id !== id));
        if (timers.current.has(id)) {
            timers.current.delete(id);
        }
        timerMetas.current.delete(id);
        const cb = onCloseCallbacks.current.get(id);
        onCloseCallbacks.current.delete(id);
        cb?.();
    }, []);

    closeRef.current = close;

    useEffect(() => {
        return () => {
            timers.current.clear();
            timerMetas.current.clear();
            onCloseCallbacks.current.clear();
        };
    }, []);

    useEffect(() => {
        containerRef.current?.showPopover();
    }, []);

    const scheduleCloseTimer = useCallback((id: string) => {
        const meta = timerMetas.current.get(id);
        if (!meta) return;

        if (meta.remaining <= 0) {
            closeRef.current?.(id);
            return;
        }

        const existingTimer = timers.current.get(id);
        if (existingTimer) {
            timers.current.delete(id);
        }

        meta.startedAt = time.get();
        meta.paused = false;

        setItems(prev => prev.map(item => (
            item.id === id
                ? { ...item, paused: false, remaining: meta.remaining }
                : item
        )));

        timers.current.set(id, true);
    }, [time]);

    const pauseCloseTimer = useCallback((id: string) => {
        const meta = timerMetas.current.get(id);
        if (!meta || meta.paused) return;

        if (timers.current.has(id)) {
            timers.current.delete(id);
        }

        const elapsed = time.get() - meta.startedAt;
        meta.remaining = Math.max(0, meta.remaining - elapsed);
        meta.paused = true;

        setItems(prev => prev.map(item => (
            item.id === id
                ? { ...item, paused: true, remaining: meta.remaining }
                : item
        )));
    }, [time]);

    const resumeCloseTimer = useCallback((id: string) => {
        const meta = timerMetas.current.get(id);
        if (!meta || !meta.paused) return;

        setItems(prev => prev.map(item => (
            item.id === id
                ? { ...item, paused: false, remaining: meta.remaining }
                : item
        )));

        scheduleCloseTimer(id);
    }, [scheduleCloseTimer]);

    useMotionValueEvent(time, 'change', (latest) => {
        if (timers.current.size === 0) {
            return;
        }

        const expiredIds: string[] = [];

        timers.current.forEach((_, id) => {
            const meta = timerMetas.current.get(id);
            if (!meta || meta.paused) {
                return;
            }

            if (latest - meta.startedAt >= meta.remaining) {
                expiredIds.push(id);
            }
        });

        expiredIds.forEach(id => {
            timers.current.delete(id);
            closeRef.current?.(id);
        });
    });

    // 仅最后一条消息自动消失；其余消息不计时
    useEffect(() => {
        const lastItem = items[items.length - 1];
        const lastId = lastItem?.id;

        timers.current.forEach((_, id) => {
            if (id !== lastId) {
                timers.current.delete(id);
            }
        });

        if (!lastItem || lastItem.duration <= 0) {
            return;
        }

        const meta = timerMetas.current.get(lastItem.id);
        if (!meta || meta.paused) {
            return;
        }

        if (!timers.current.has(lastItem.id)) {
            scheduleCloseTimer(lastItem.id);
        }
    }, [items, scheduleCloseTimer]);

    const open = useCallback((param: MessageOpenParam) => {
        const key = uniqueId('message-');
        const duration = param.duration ?? defaultDuration;

        const newItem: MessageItemData = {
            id: key,
            type: param.type ?? 'info',
            content: param.content,
            icon: param.icon,
            duration,
            remaining: duration,
            paused: false,
        };

        if (param.onClose) {
            onCloseCallbacks.current.set(key, param.onClose);
        }

        setItems(prev => [...prev, newItem]);

        if (duration > 0) {
            timerMetas.current.set(key, {
                remaining: duration,
                startedAt: time.get(),
                paused: false,
            });
        }
    }, [time]);

    const createShorthand = useCallback(
        (type: MessageType) =>
            (content: ReactNode, duration?: number) =>
                open({ type, content, duration }),
        [open],
    );

    const instance = useMemo<MessageInstance>(() => ({
        open,
        success: createShorthand('success'),
        error: createShorthand('error'),
        warning: createShorthand('warning'),
        info: createShorthand('info'),
        loading: createShorthand('loading'),
    }), [open, createShorthand]);

    const renderedDom = useMemo(() => {
        const len = items.length;
        const visibleItems = len > maxVisible ? items.slice(-maxVisible) : items;
        const visibleStart = len > maxVisible ? len - maxVisible : 0;

        const children = visibleItems.map((item, i) => {
            const isLast = items[items.length - 1]?.id === item.id;
            const offsetFromTop = len - (visibleStart + i);

            return (
                <Message
                    key={item.id}
                    type={item.type}
                    content={item.content}
                    icon={item.icon}
                    duration={item.duration}
                    showProgress={true}
                    remaining={isLast ? item.remaining : item.duration}
                    paused={isLast ? item.paused : true}
                    initial={{
                        y: "-100%",
                    }}
                    animate={{
                        y: offsetFromTop * 20,
                        boxShadow: `0 ${2 + (offsetFromTop - 1)}px ${6 + (offsetFromTop - 1) * 2}px rgba(0, 0, 0, ${Math.max(0.08, 0.12 - (offsetFromTop - 1) * 0.02)})`,
                    }}
                    exit={{
                        y: "-100%",
                    }}
                    onMouseEnter={() => {
                        if (isLast && item.duration > 0) {
                            pauseCloseTimer(item.id);
                        }
                    }}
                    onMouseLeave={() => {
                        if (isLast && item.duration > 0) {
                            resumeCloseTimer(item.id);
                        }
                    }}
                />
            );
        });

        return (
            <div
                ref={containerRef}
                className={containerStyle}
                popover="manual"
            >
                <AnimatePresence>
                    {children}
                </AnimatePresence>
            </div>
        );
    }, [items, pauseCloseTimer, resumeCloseTimer]);

    return [instance, renderedDom];
};

export default useMessage;
