import { useCallback, useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { useMotionValueEvent, useTime, type ValueKeyframesDefinition } from "motion/react";
import { uniqueId } from "@crab-dev/rc-hooks";

import Notification from "../notification.js";
import Container from "../container.js";
import type { Direction } from "../types.js";

const defaultDuration = 3000;
const defaultDirection = "topRight";

interface NotificationOpenParam {
    title: ReactNode
    description: ReactNode
    duration?: number
    direction?: Direction
    showProgress?: boolean
}

interface NotificationInstance {
    open: (param: NotificationOpenParam) => void
    close: (id: string) => void
}

interface NotificationItem {
    id: string
    title: ReactNode
    description: ReactNode
    open: boolean
    direction: Direction
    duration: number
    showProgress: boolean
    remaining: number
    paused: boolean
}

interface TimerMeta {
    remaining: number
    startedAt: number
    paused: boolean
}

type ReturnDirectionValue = ValueKeyframesDefinition | undefined;

type DirectionXY = { x: ReturnDirectionValue; y: ReturnDirectionValue };

// 查找表替代 if-else 链
const directionPositionMap: Record<Direction, DirectionXY> = {
    top:         { x: undefined, y: "-100%" },
    topLeft:     { x: "-120%",   y: undefined },
    topRight:    { x: "120%",    y: undefined },
    bottom:      { x: undefined, y: "100%" },
    bottomLeft:  { x: undefined, y: undefined },
    bottomRight: { x: undefined, y: undefined },
};

const getDirectionPosition = (direction: Direction): DirectionXY =>
    directionPositionMap[direction] ?? { x: undefined, y: undefined };

// y 方向符号：top 系向下（正），bottom 系向上（负）
const ySignMap: Record<Direction, number> = {
    top: 1, topLeft: 1, topRight: 1,
    bottom: -1, bottomLeft: -1, bottomRight: -1,
};

const xOffsetMap: Record<Direction, ReturnDirectionValue> = {
    top: undefined, topLeft: "1rem", topRight: "-1rem",
    bottom: undefined, bottomLeft: "1rem", bottomRight: "-1rem",
};

const getAnimateDirectionPosition = (direction: Direction, offset: number): DirectionXY => ({
    x: xOffsetMap[direction],
    y: (ySignMap[direction] ?? 0) * offset * 20,
});

const useNotification = (): [NotificationInstance, ReactNode] => {
    const [items, setItems] = useState<NotificationItem[]>([]);
    const time = useTime();

    const timers = useRef<Map<string, true>>(new Map());
    const timerMetas = useRef<Map<string, TimerMeta>>(new Map());

    const exploredDirections = useRef<Direction[]>([]);

    // 使用 ref 版 close 避免依赖循环，同时保证 timer 回调拿到最新引用
    const closeRef = useRef<(id: string) => void>(undefined);

    const close = useCallback((id: string) => {
        setItems(prev => {
            const next = prev.filter(item => item.id !== id);
            return next;
        });
        if (timers.current.has(id)) {
            timers.current.delete(id);
        }
        timerMetas.current.delete(id);
    }, []);

    closeRef.current = close;

    useEffect(() => {
        return () => {
            timers.current.clear();
            timerMetas.current.clear();
        };
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

    useMotionValueEvent(time, "change", (latest) => {
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

    // 每个方向仅最后一个通知自动消失；其余通知不计时
    useEffect(() => {
        const grouped = new Map<Direction, NotificationItem[]>();
        items.forEach(item => {
            let group = grouped.get(item.direction);
            if (!group) {
                group = [];
                grouped.set(item.direction, group);
            }
            group.push(item);
        });

        const lastIds = new Set<string>();
        grouped.forEach(group => {
            const lastItem = group[group.length - 1];
            if (lastItem) {
                lastIds.add(lastItem.id);
            }
        });

        timers.current.forEach((_, id) => {
            if (!lastIds.has(id)) {
                timers.current.delete(id);
            }
        });

        items.forEach(item => {
            if (!lastIds.has(item.id) || item.duration <= 0) {
                return;
            }

            const meta = timerMetas.current.get(item.id);
            if (!meta || meta.paused) {
                return;
            }

            if (!timers.current.has(item.id)) {
                scheduleCloseTimer(item.id);
            }
        });
    }, [items, scheduleCloseTimer]);

    const open = useCallback((param: NotificationOpenParam) => {
        const key = uniqueId('notification-');
        const duration = param.duration ?? defaultDuration;
        const direction = param.direction ?? defaultDirection;
        const newItem: NotificationItem = {
            id: key,
            title: param.title,
            description: param.description,
            open: true,
            direction,
            duration,
            showProgress: param.showProgress ?? true,
            remaining: duration,
            paused: false,
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

    const instance = useMemo<NotificationInstance>(() => ({
        open,
        close,
    }), [open, close]);

    // 同时计算分组和活跃方向，避免维护单独的 openedContainers 状态
    const { groupedItems, activeDirections } = useMemo(() => {
        const grouped = new Map<Direction, NotificationItem[]>();
        items.forEach(item => {
            let group = grouped.get(item.direction);
            if (!group) {
                group = [];
                grouped.set(item.direction, group);
                if(!exploredDirections.current.includes(item.direction)) {
                    exploredDirections.current.push(item.direction);
                }
            }
            group.push(item);
        });
        return { groupedItems: grouped, activeDirections: exploredDirections.current };
    }, [items]);

    const renderedDom = useMemo(() => {
        return activeDirections.map(direction => {
            const groupItems = groupedItems.get(direction) ?? [];
            const len = groupItems.length;
            const visibleItems = len > 3 ? groupItems.slice(-3) : groupItems;
            const visibleStart = len > 3 ? len - 3 : 0;
            const children = visibleItems.map((item, i) => {
                const isLastInDirection = groupItems[groupItems.length - 1]?.id === item.id;
                const offsetFromTop = len - (visibleStart + i);
                const initialPosition = getDirectionPosition(item.direction);
                const animatePosition = getAnimateDirectionPosition(item.direction, offsetFromTop);
                return (
                    <Notification
                        key={item.id}
                        title={item.title}
                        open={item.open}
                        direction={item.direction}
                        duration={item.duration}
                        showProgress={item.showProgress}
                        remaining={isLastInDirection ? item.remaining : item.duration}
                        paused={isLastInDirection ? item.paused : true}
                        initial={{
                            x: initialPosition.x,
                            y: initialPosition.y,
                        }}
                        animate={{
                            x: animatePosition.x,
                            y: animatePosition.y,
                            boxShadow: `0 ${2 + (offsetFromTop - 1)}px ${6 + (offsetFromTop - 1) * 2}px rgba(0, 0, 0, ${Math.max(0.08, 0.12 - (offsetFromTop - 1) * 0.02)})`,
                        }}
                        exit={{
                            x: initialPosition.x,
                            y: initialPosition.y,
                        }}
                        onOpenChange={(value) => {
                            if (value !== true) {
                                close(item.id);
                            }
                        }}
                        onMouseEnter={() => {
                            if (isLastInDirection && item.duration > 0) {
                                pauseCloseTimer(item.id);
                            }
                        }}
                        onMouseLeave={() => {
                            if (isLastInDirection && item.duration > 0) {
                                resumeCloseTimer(item.id);
                            }
                        }}
                    >
                        {item.description}
                    </Notification>
                );
            });

            return (
                <Container key={direction} direction={direction}>
                    {children}
                </Container>
            );
        });
    }, [groupedItems, activeDirections, close, pauseCloseTimer, resumeCloseTimer]);

    return [instance, renderedDom];
}

export default useNotification;