import { useCallback, useMemo, useRef, useState, type ReactNode } from "react"
import type { ValueKeyframesDefinition } from "motion";

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
}

type ReturnDirectionValue = ValueKeyframesDefinition | undefined ;

const getDirectionPosition = (direction: Direction): {
    x: ReturnDirectionValue,
    y: ReturnDirectionValue
} => {
    if (direction === "top") {
       return { x: undefined, y: "-100%" };
    } else if (direction === "topLeft") {
        return { x: "-120%", y: undefined };
    } else if (direction === "topRight") {
        return { x: "120%", y: undefined };
    } else if (direction === "bottom") {
        return { x: undefined, y: "100%" };
    } else if (direction === "bottomLeft") {
        return { x: undefined, y: undefined };
    } else if (direction === "bottomRight") {
        return { x: undefined, y: undefined };
    } else {
        return { x: undefined, y: undefined };
    }
}


const getAnimateDirectionPosition = (direction: Direction, y: number): {
    x: ReturnDirectionValue,
    y: ReturnDirectionValue
} => {
    if (direction === "top") {
       return { x: undefined, y: y * 20 };
    } else if (direction === "topLeft") {
        return { x: "1rem", y: y * 20 };
    } else if (direction === "topRight") {
        return { x: "-1rem", y: y * 20 };
    } else if (direction === "bottom") {
        return { x: undefined, y: - ( y * 20) };
    } else if (direction === "bottomLeft") {
        return { x: "1rem", y: - (y * 20) };
    } else if (direction === "bottomRight") {
        return { x: "-1rem", y: - (y * 20) };
    } else {
        return { x: undefined, y: undefined };
    }
}


const useNotification = (): [NotificationInstance, ReactNode] => {
    const [items, setItems] = useState<NotificationItem[]>([]);

    const [openedContainers, setOpenedContainers] = useState<Direction[]>([]);


    const timers = useRef<Map<string, ReturnType<typeof setTimeout>>>(new Map());

    const close = useCallback((id: string) => {
        setItems(prev => prev.filter(item => item.id !== id));
        const timer = timers.current.get(id);
        if (timer) {
            clearTimeout(timer);
            timers.current.delete(id);
        }
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
        };
        setItems(prev => [...prev, newItem]);

        if (!openedContainers.includes(direction)) {
            setOpenedContainers(prev => [...prev, direction]);
        }

        if (duration > 0) {
            const timer = setTimeout(() => {
                close(key);
            }, duration);
            timers.current.set(key, timer);
        }
    }, [close, openedContainers]);

    const instance = useMemo<NotificationInstance>(() => ({
        open,
        close,
    }), [open, close]);

    const groupByDirectionItems = useMemo(() => {
        const grouped = new Map<Direction, NotificationItem[]>();
        items.forEach(item => {
            if (!grouped.has(item.direction)) {
                grouped.set(item.direction, []);
            }
            grouped.get(item.direction)?.push(item);
        });
        return grouped;
    }, [items]);

    const renderDom = () => {
        const domElement = new Map<Direction, ReactNode[]>();
        
        groupByDirectionItems.keys().forEach(element => {
            const groupItems = groupByDirectionItems.get(element);
            if (groupItems) {
                const groupItemsOffset = Array.from({ length: groupItems.length ?? 0 }, (_, i) => (groupItems.length ?? 0) - i);
                domElement.set(
                    element,
                    groupItems.map((item, index) => {
                        let blur = (groupItemsOffset[index] - 1) * 1.5;
                        blur = blur > 3 ? 3 : blur;
                        const initialPosition = getDirectionPosition(item.direction);
                        const animatePosition = getAnimateDirectionPosition(item.direction, groupItemsOffset[index]);

                        return (
                            <Notification
                                key={item.id}
                                title={item.title}
                                open={item.open}
                                direction={item.direction}
                                initial={{
                                    opacity: 0,
                                    x: initialPosition.x,
                                    y: initialPosition.y,
                                }}
                                animate={{
                                    opacity: 1,
                                    x: animatePosition.x,
                                    y: animatePosition.y,
                                    boxShadow: `0 ${2 + (groupItemsOffset[index] - 1) * 1}px ${6 + (groupItemsOffset[index] - 1) * 2}px rgba(0, 0, 0, ${Math.max(0.08, 0.12 - (groupItemsOffset[index] - 1) * 0.02)})`,
                                }}
                                exit={{ 
                                    opacity: 0,
                                    x: initialPosition.x,
                                    y: initialPosition.y,
                                }}
                                onOpenChange={(value) => {
                                    if (value != true) {
                                        close(item.id)
                                    }
                                }}
                            >
                                {item.description}
                            </Notification>
                        )
                    })
                )
            }
        })
        
        return openedContainers.map(element => (
            <Container
                key={element}
                direction={element}
            >
                {domElement.get(element)?.slice(-3)}
            </Container>
        ));
    }

    return [instance, renderDom()];
}

export default useNotification;