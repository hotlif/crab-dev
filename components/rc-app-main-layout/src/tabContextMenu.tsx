import type { FC, ReactNode } from "react";
import { Fragment, useEffect, useLayoutEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { cx } from "@crab-dev/css";
import { usePresence, useEventCallback } from "@crab-dev/rc-hooks";
import { registerOverlayLayer, resolveOverlayRoot } from '@crab-dev/rc-hooks/internal';
import { ConfigBoundary } from "@crab-dev/rc-config-provider";
import Button from '@crab-dev/rc-button';
import { menuStyle, itemBaseStyle, itemDisabledStyle, separatorStyle, itemIconStyle, itemIconDisabledStyle } from "./tabContextMenu.styles.js";
export interface TabContextMenuItem {
    /** 稳定标识，用于 React key 与点击分发 */
    id: string
    /** 前置图标；统一占用 16px 方格，不传则保留空位以对齐其他有图标的项 */
    icon?: ReactNode
    /** 显示文本 */
    label: ReactNode
    /** 点击回调；菜单会在调用前关闭 */
    onSelect: () => void
    /** 是否禁用 */
    disabled?: boolean
    /** 是否在该项之后绘制分隔线 */
    separatorAfter?: boolean
}

export interface TabContextMenuProps {
    /** 触发元素，用于保持同一 Document、主题边界与模态层。 */
    anchor?: HTMLElement
    open?: boolean
    onExitComplete?: () => void
    /** 触发位置（视口坐标） */
    x: number
    /** 触发位置（视口坐标） */
    y: number
    /** 菜单项列表 */
    items: TabContextMenuItem[]
    /** 关闭回调（点击外部、Escape、滚动、resize、blur 触发） */
    onClose: () => void
}

/**
 * 视口边缘吸附：当菜单初次渲染后若超出视口，则向左 / 向上翻转贴边，
 * 始终保留 8px 安全边距。
 */
interface ViewportPosition {
    left: number
    top: number
}

function clampToViewport(x: number, y: number, w: number, h: number, view: Window | null): ViewportPosition {
    const margin = 8;
    const vw = view?.innerWidth ?? 0;
    const vh = view?.innerHeight ?? 0;
    let left = x;
    let top = y;
    if (left + w + margin > vw) left = Math.max(margin, vw - w - margin);
    if (top + h + margin > vh) top = Math.max(margin, vh - h - margin);
    return { left, top };
}

const TabContextMenu: FC<TabContextMenuProps> = ({ x, y, items, onClose, anchor, open = true, onExitComplete }) => {
    const ref = useRef<HTMLUListElement>(null);
    const presence = usePresence<HTMLUListElement>(open, onExitComplete);
    const [pos, setPos] = useState<{ left: number, top: number }>({ left: x, top: y });
    const close = useEventCallback(onClose);
    const ownerDocument = anchor?.ownerDocument ?? (typeof document === 'undefined' ? null : document);
    const ownerWindow = ownerDocument?.defaultView ?? null;

    useLayoutEffect(() => {
        const el = ref.current;
        if (!el) return;
        const rect = el.getBoundingClientRect();
        setPos(clampToViewport(x, y, rect.width, rect.height, ownerWindow));
    }, [x, y, ownerWindow]);

    useLayoutEffect(() => {
        const element = ref.current;
        if (!open || !element) return;
        const layer = registerOverlayLayer(element, close, anchor ?? ownerDocument?.activeElement ?? null);
        element.querySelector<HTMLButtonElement>('button:not(:disabled):not([aria-disabled="true"])')?.focus();
        return () => layer.release();
    }, [anchor, close, open, ownerDocument]);

    useEffect(() => {
        if (!open || !ownerWindow) return;
        const handlePointerDown = (e: PointerEvent) => {
            if (!ref.current) return;
            if (e.composedPath().includes(ref.current)) return;
            close();
        };
        const handleDismiss = () => close();
        // 捕获阶段确保先于其他点击关闭
        ownerWindow.addEventListener("pointerdown", handlePointerDown, true);
        ownerWindow.addEventListener("resize", handleDismiss);
        ownerWindow.addEventListener("blur", handleDismiss);
        // 滚动祖先变化即关闭，避免菜单脱离锚点
        ownerWindow.addEventListener("scroll", handleDismiss, true);
        return () => {
            ownerWindow.removeEventListener("pointerdown", handlePointerDown, true);
            ownerWindow.removeEventListener("resize", handleDismiss);
            ownerWindow.removeEventListener("blur", handleDismiss);
            ownerWindow.removeEventListener("scroll", handleDismiss, true);
        };
    }, [close, open, ownerWindow]);

    if (!ownerDocument || !presence.present) return null;

    const hasAnyIcon = items.some((item) => item.icon !== undefined);

    const node = (
        <ul
            ref={element => {
                ref.current = element;
                presence.ref(element);
            }}
            data-state={presence.state}
            inert={!open}
            aria-hidden={!open || undefined}
            className={menuStyle}
            style={{ left: pos.left, top: pos.top }}
            role="menu"
            onKeyDown={event => {
                const buttons = [...event.currentTarget.querySelectorAll<HTMLButtonElement>('button:not(:disabled):not([aria-disabled="true"])')];
                if (buttons.length === 0) return;
                const root = event.currentTarget.getRootNode();
                const active = 'activeElement' in root ? root.activeElement : ownerDocument.activeElement;
                const index = buttons.findIndex(button => button === active);
                const next = event.key === 'ArrowDown' ? (index + 1) % buttons.length
                    : event.key === 'ArrowUp' ? (index - 1 + buttons.length) % buttons.length
                    : event.key === 'Home' ? 0 : event.key === 'End' ? buttons.length - 1 : undefined;
                if (next !== undefined) { event.preventDefault(); buttons[next]?.focus(); }
            }}
            onContextMenu={(e) => e.preventDefault()}
        >
            {items.map((item) => (
                <Fragment key={item.id}>
                    <li role="none">
                        <Button
                            type="button"
                            appearance="text"
                            size="xs"
                            role="menuitem"
                            disabled={item.disabled}
                            aria-disabled={item.disabled || undefined}
                            className={cx.call(undefined, itemBaseStyle, item.disabled && itemDisabledStyle)}
                            icon={hasAnyIcon ? (
                                <span
                                    aria-hidden
                                    className={cx.call(undefined, itemIconStyle, item.disabled && itemIconDisabledStyle)}
                                >
                                    {item.icon}
                                </span>
                            ) : undefined}
                            onClick={() => {
                                if (item.disabled) return;
                                onClose();
                                item.onSelect();
                            }}
                        >
                            {item.label}
                        </Button>
                    </li>
                    {item.separatorAfter ? (
                        <li className={separatorStyle} role="separator" aria-hidden />
                    ) : null}
                </Fragment>
            ))}
        </ul>
    );

    return createPortal(<ConfigBoundary>{node}</ConfigBoundary>, anchor ? resolveOverlayRoot(anchor) : ownerDocument.body);
};

export default TabContextMenu;
