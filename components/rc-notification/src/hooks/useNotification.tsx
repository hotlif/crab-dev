import { useCallback, useEffect, useMemo, useRef, useState, type ReactNode } from "react"
import type { ValueKeyframesDefinition } from "motion/react";

import Notification from "../notification";
import Container from "../container";
import type { Direction } from "../types";

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

    const timers = useRef<Map<string, ReturnType<typeof setTimeout>>>(new Map());

    const exploredDirections = useRef<Direction[]>([]);

    // 使用 ref 版 close 避免依赖循环，同时保证 timer 回调拿到最新引用
    const closeRef = useRef<(id: string) => void>(undefined);

    const close = useCallback((id: string) => {
        setItems(prev => {
            const next = prev.filter(item => item.id !== id);
            return next;
        });
        const timer = timers.current.get(id);
        if (timer) {
            clearTimeout(timer);
            timers.current.delete(id);
        }
    }, []);

    closeRef.current = close;

    // 组件卸载时清除所有定时器
    useEffect(() => {
        return () => {
            timers.current.forEach(timer => clearTimeout(timer));
            timers.current.clear();
        };
    }, []);

    const open = useCallback((param: NotificationOpenParam) => {
        const key = crypto.randomUUID();
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
        }
        setItems(prev => [...prev, newItem]);

        if (duration > 0) {
            const timer = setTimeout(() => closeRef.current?.(key), duration);
            timers.current.set(key, timer);
        }
    }, []);

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
    }, [groupedItems, activeDirections, close]);

    return [instance, renderedDom];
}

export default useNotification;