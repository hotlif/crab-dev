import { useCallback, useEffect, useRef } from "react";

let activeTableOwner: symbol | null = null;

/**
 * 让页面中的多个 Table 共享唯一的快捷键所有者。
 * 单元格拖选会主动 blur 当前焦点，因此不能只依赖 document.activeElement。
 */
export interface TableInteractionScope {
    rootRef: import("react").RefObject<HTMLDivElement | null>;
    activateInteraction: () => void;
    isInteractionActive: () => boolean;
}

export function useTableInteractionScope(): TableInteractionScope {
    // 例外白名单：稳定实例身份与根 DOM 均属于跨事件可变状态，不参与渲染。
    const ownerRef = useRef(Symbol("rc-table-interaction-owner"));
    const rootRef = useRef<HTMLDivElement>(null);

    const activateInteraction = useCallback(() => {
        activeTableOwner = ownerRef.current;
    }, []);

    const isInteractionActive = useCallback(() => activeTableOwner === ownerRef.current, []);

    useEffect(() => {
        const clearWhenOutside = (target: EventTarget | null) => {
            if (activeTableOwner !== ownerRef.current) return;
            if (target instanceof Node && rootRef.current?.contains(target)) return;
            activeTableOwner = null;
        };
        const handleMouseDown = (event: MouseEvent) => clearWhenOutside(event.target);
        const handlePointerDown = (event: PointerEvent) => clearWhenOutside(event.target);
        const handleFocusIn = (event: FocusEvent) => clearWhenOutside(event.target);

        document.addEventListener("mousedown", handleMouseDown, true);
        document.addEventListener("pointerdown", handlePointerDown, true);
        document.addEventListener("focusin", handleFocusIn, true);
        return () => {
            document.removeEventListener("mousedown", handleMouseDown, true);
            document.removeEventListener("pointerdown", handlePointerDown, true);
            document.removeEventListener("focusin", handleFocusIn, true);
            if (activeTableOwner === ownerRef.current) activeTableOwner = null;
        };
    }, []);

    return { rootRef, activateInteraction, isInteractionActive };
}
