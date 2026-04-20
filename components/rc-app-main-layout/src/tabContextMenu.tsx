import type { FC, ReactNode } from "react";
import { Fragment, useEffect, useLayoutEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { css, cx } from "@linaria/core";
import token from "./token.js";

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
    /** 触发位置（视口坐标） */
    x: number
    /** 触发位置（视口坐标） */
    y: number
    /** 菜单项列表 */
    items: TabContextMenuItem[]
    /** 关闭回调（点击外部、Escape、滚动、resize、blur 触发） */
    onClose: () => void
}

const menuStyle = css`
    position: fixed;
    min-width: ${token.tab['context-menu']['min-width']};
    padding: ${token.tab['context-menu'].padding};
    background-color: ${token.tab['context-menu'].background.color};
    border: 1px solid ${token.tab['context-menu'].border.color};
    border-radius: ${token.tab['context-menu'].border.radius};
    box-shadow: ${token.tab['context-menu'].shadow};
    z-index: ${token.tab['context-menu']['z-index']};
    list-style: none;
    margin: 0;
    user-select: none;
    box-sizing: border-box;
    /* 入场过渡：轻微放大 + 透明度，遵循 prefers-reduced-motion */
    animation: tab-context-menu-in 120ms cubic-bezier(0.2, 0, 0, 1);
    transform-origin: top left;

    @keyframes tab-context-menu-in {
        from { opacity: 0; transform: scale(0.96); }
        to   { opacity: 1; transform: scale(1); }
    }

    @media (prefers-reduced-motion: reduce) {
        animation: none;
    }
`;

const itemBaseStyle = css`
    display: flex;
    align-items: center;
    gap: ${token.tab['context-menu'].item.gap};
    height: ${token.tab['context-menu'].item.height};
    padding: ${token.tab['context-menu'].item.padding};
    font-size: ${token.tab['context-menu'].item.font.size};
    color: ${token.tab['context-menu'].item.color};
    border-radius: ${token.tab['context-menu'].item.border.radius};
    cursor: pointer;
    white-space: nowrap;
    background: transparent;
    border: none;
    width: 100%;
    text-align: left;
    box-sizing: border-box;
    transition: background-color 100ms ease;

    &:hover {
        background-color: ${token.tab['context-menu'].item.background['color-hover']};
    }

    &:focus-visible {
        outline: 2px solid currentColor;
        outline-offset: -2px;
    }
`;

const itemDisabledStyle = css`
    color: ${token.tab['context-menu'].item['color-disabled']};
    cursor: not-allowed;

    &:hover {
        background-color: transparent;
    }
`;

const separatorStyle = css`
    height: 1px;
    margin: ${token.tab['context-menu'].separator.margin};
    background-color: ${token.tab['context-menu'].separator.color};
    list-style: none;
`;

const itemIconStyle = css`
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: ${token.tab['context-menu'].item.icon.size};
    height: ${token.tab['context-menu'].item.icon.size};
    flex-shrink: 0;
    color: ${token.tab['context-menu'].item.icon.color};

    & > svg, & > img {
        width: 100%;
        height: 100%;
    }
`;

const itemIconDisabledStyle = css`
    color: ${token.tab['context-menu'].item['color-disabled']};
`;

/**
 * 视口边缘吸附：当菜单初次渲染后若超出视口，则向左 / 向上翻转贴边，
 * 始终保留 8px 安全边距。
 */
function clampToViewport(x: number, y: number, w: number, h: number): { left: number, top: number } {
    const margin = 8;
    const vw = typeof window === "undefined" ? 0 : window.innerWidth;
    const vh = typeof window === "undefined" ? 0 : window.innerHeight;
    let left = x;
    let top = y;
    if (left + w + margin > vw) left = Math.max(margin, vw - w - margin);
    if (top + h + margin > vh) top = Math.max(margin, vh - h - margin);
    return { left, top };
}

const TabContextMenu: FC<TabContextMenuProps> = ({ x, y, items, onClose }) => {
    const ref = useRef<HTMLUListElement>(null);
    const [pos, setPos] = useState<{ left: number, top: number }>({ left: x, top: y });

    useLayoutEffect(() => {
        const el = ref.current;
        if (!el) return;
        const rect = el.getBoundingClientRect();
        setPos(clampToViewport(x, y, rect.width, rect.height));
    }, [x, y]);

    useEffect(() => {
        const handlePointerDown = (e: PointerEvent) => {
            if (!ref.current) return;
            if (e.target instanceof Node && ref.current.contains(e.target)) return;
            onClose();
        };
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === "Escape") {
                e.stopPropagation();
                onClose();
            }
        };
        const handleDismiss = () => onClose();
        // 捕获阶段确保先于其他点击关闭
        window.addEventListener("pointerdown", handlePointerDown, true);
        window.addEventListener("keydown", handleKeyDown, true);
        window.addEventListener("resize", handleDismiss);
        window.addEventListener("blur", handleDismiss);
        // 滚动祖先变化即关闭，避免菜单脱离锚点
        window.addEventListener("scroll", handleDismiss, true);
        return () => {
            window.removeEventListener("pointerdown", handlePointerDown, true);
            window.removeEventListener("keydown", handleKeyDown, true);
            window.removeEventListener("resize", handleDismiss);
            window.removeEventListener("blur", handleDismiss);
            window.removeEventListener("scroll", handleDismiss, true);
        };
    }, [onClose]);

    if (typeof document === "undefined") return null;

    const hasAnyIcon = items.some((item) => item.icon !== undefined);

    const node = (
        <ul
            ref={ref}
            className={menuStyle}
            style={{ left: pos.left, top: pos.top }}
            role="menu"
            onContextMenu={(e) => e.preventDefault()}
        >
            {items.map((item) => (
                <Fragment key={item.id}>
                    <li role="none">
                        <button
                            type="button"
                            role="menuitem"
                            disabled={item.disabled}
                            aria-disabled={item.disabled || undefined}
                            className={cx(itemBaseStyle, item.disabled && itemDisabledStyle)}
                            onClick={() => {
                                if (item.disabled) return;
                                onClose();
                                item.onSelect();
                            }}
                        >
                            {hasAnyIcon ? (
                                <span
                                    aria-hidden
                                    className={cx(itemIconStyle, item.disabled && itemIconDisabledStyle)}
                                >
                                    {item.icon}
                                </span>
                            ) : null}
                            {item.label}
                        </button>
                    </li>
                    {item.separatorAfter ? (
                        <li className={separatorStyle} role="separator" aria-hidden />
                    ) : null}
                </Fragment>
            ))}
        </ul>
    );

    return createPortal(node, document.body);
};

export default TabContextMenu;
