import type { FC, Key, KeyboardEvent as ReactKeyboardEvent, MouseEvent as ReactMouseEvent, PointerEvent as ReactPointerEvent } from "react";
import { useEffectEvent, useId, useLayoutEffect, useRef, useState } from "react";
import { css, cx } from "@crab-dev/css";
import { useMediaQuery } from "@crab-dev/rc-hooks";
import Button, { TokenVars as buttonVars } from "@crab-dev/rc-button";
import token from "./token.js";
import {
    CloseAllIcon,
    CloseIcon,
    CloseOthersIcon,
    CloseRightIcon,
    ReloadIcon,
} from "./icons.js";
import type { TabItem } from "./types.js";
import TabContextMenu, { type TabContextMenuItem } from "./tabContextMenu.js";

export type { TabItem };

export interface TabBarProps {
    /** 与布局内容面板共享的 useId 前缀 */
    idPrefix?: string
    /** 最后一个标签关闭后的焦点目标 */
    onEmpty?: () => void
    /** 标签列表 */
    items: TabItem[]
    /** 当前激活的标签 key */
    activeKey?: Key
    /** 切换标签时的回调 */
    onChange?: (key: Key) => void
    /** 关闭标签时的回调 */
    onClose?: (key: Key) => void
    /** 关闭除指定 key 之外的全部可关闭标签 */
    onCloseOthers?: (key: Key) => void
    /** 关闭指定 key 右侧的全部可关闭标签 */
    onCloseRight?: (key: Key) => void
    /** 关闭全部可关闭标签 */
    onCloseAll?: () => void
    /** 重新加载指定标签页 */
    onReload?: (key: Key) => void
    /** 拖拽重排后的回调；传入则启用拖拽排序 */
    onReorder?: (keys: Key[]) => void
}

const barStyle = css`
    display: flex;
    align-items: flex-end;
    flex: 1;
    min-width: 0;
    overflow-x: auto;
    overflow-y: hidden;
    scrollbar-width: none;
    padding-inline: ${token.tab.item.curve.width};
    isolation: isolate;
    &::-webkit-scrollbar { display: none; }
`;

// Preserve the original browser-tab silhouette; the active surface joins the toolbar below.
const tabItemStyle = css`
    display: inline-flex;
    align-items: center;
    height: ${token.tab.item.height};
    min-width: ${token.tab.item['min-width']};
    max-width: ${token.tab.item['max-width']};
    flex: 0 1 ${token.tab.item['max-width']};
    padding: ${token.tab.item.padding};
    gap: ${token.tab.item.gap};
    position: relative;
    box-sizing: border-box;
    border-radius: ${token.tab.item['border-radius']} ${token.tab.item['border-radius']} 0 0;
    background: transparent;
    transition: background-color ${token.motion.interaction.transition};
    &:hover { background-color: ${token.tab.item['background-color-hover']}; }
    &::after {
        content: '';
        position: absolute;
        inset-inline-end: 0;
        top: 25%;
        height: 50%;
        width: ${token.tab.item.separator.width};
        background: ${token.tab.item.separator['background-color']};
        pointer-events: none;
    }
    &:last-child::after, &:hover::after, &:has(+ [data-active])::after { opacity: 0; }
    @media (prefers-reduced-motion: reduce) { transition: none; }
    @media (pointer: coarse) { height: ${token.tab.item.touch.height}; }
`;

const tabItemActiveStyle = css`
    &, &:hover { background-color: ${token.tab.item['background-color']}; }
    z-index: 2;
    &::after { opacity: 0; }
    &::before, & > .tab-active-right-curve {
        content: '';
        position: absolute;
        bottom: 0;
        width: ${token.tab.item.curve.width};
        height: ${token.tab.item.curve.width};
        pointer-events: none;
    }
    &::before {
        left: calc(-1 * ${token.tab.item.curve.width});
        background: radial-gradient(circle at 0 0,
            transparent ${token.tab.item.curve.width},
            ${token.tab.item['background-color']} calc(${token.tab.item.curve.width} + 0.5px));
    }
    & > .tab-active-right-curve {
        right: calc(-1 * ${token.tab.item.curve.width});
        background: radial-gradient(circle at 100% 0,
            transparent ${token.tab.item.curve.width},
            ${token.tab.item['background-color']} calc(${token.tab.item.curve.width} + 0.5px));
    }
    @media (forced-colors: active) { outline: ${token.tab.item['outline-width-focus']} solid Highlight; outline-offset: ${token.tab.item['outline-offset-focus']}; }
`;

const tabButtonStyle = css`
    && {
        ${buttonVars['root.border-radius-active']}: 0;
        ${buttonVars['text.background-color-hover']}: transparent;
        ${buttonVars['text.background-color-focus']}: transparent;
        ${buttonVars['text.background-color-active']}: transparent;
        flex: 1 1 auto;
        min-width: 0;
        height: 100%;
        padding: 0;
        gap: ${token.tab.item.gap};
        border: 0;
        border-radius: 0;
        background: transparent;
        color: ${token.tab.item.color};
        font-family: ${token.tab['font-family']};
        font-size: ${token.tab['font-size']};
        font-weight: ${token.tab['font-weight']};
        line-height: ${token.tab['line-height']};
        text-align: start;
        transition: color ${token.motion.interaction.transition};
        touch-action: pan-x pan-y;
        justify-content: flex-start;
        &[aria-selected='true'] {
            color: ${token.tab.item['color-active']};
            font-weight: ${token.tab['font-weight-active']};
        }
        &:focus-visible {
            outline: ${token.tab.item['outline-width-focus']} solid ${token.tab.item['outline-color-focus']};
            outline-offset: ${token.tab.item['outline-offset-focus']};
        }
        & > span:not([aria-hidden]) {
            display: flex;
            align-self: stretch;
            min-width: 0;
            width: 100%;
        }
        @media (prefers-reduced-motion: reduce) { transition: none; }
    }
`;

const tabLabelStyle = css`
    display: flex;
    align-items: center;
    gap: ${token.tab.item.gap};
    min-width: 0;
    width: 100%;
`;

const titleStyle = css`
    flex: 1;
    min-width: 0;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
`;

const tabItemDraggingStyle = css`
    z-index: 10;
    transition: none !important;
    cursor: grabbing;
    box-shadow: ${token.tab.item["box-shadow-dragging"]};
`;

/** 释放后被拖标签的平滑回位：从当前光标位置丝滑到已让出的槽位中心 */
const tabItemSnappingStyle = css`
    z-index: 10;
    transition: transform ${token.tab.item.motion.reorder.transition}, box-shadow ${token.motion.interaction.transition};
    @media (prefers-reduced-motion: reduce) { transition: none; }
    box-shadow: ${token.tab.item["box-shadow-snapping"]};
`;

/** 其他标签让位时的过渡：足够快以跟手，但保持平滑 */
const tabItemShiftableStyle = css`
    transition: transform ${token.tab.item.motion.reorder.transition}, background-color ${token.motion.interaction.transition};
    @media (prefers-reduced-motion: reduce) { transition: none; }
    will-change: transform;
`;

const iconStyle = css`
    display: inline-flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
    width: ${token.tab.item.icon.width};
    height: ${token.tab.item.icon.width};

    & > svg, & > img {
        width: 100%;
        height: 100%;
    }
`;

const closeBtnStyle = css`
    && {
        ${buttonVars['root.border-radius-active']}: ${token.tab.item.close['border-radius']};
        ${buttonVars['text.background-color-hover']}: ${token.tab.item.close['background-color-hover']};
        ${buttonVars['text.background-color-focus']}: ${token.tab.item.close['background-color-hover']};
        ${buttonVars['text.background-color-active']}: ${token.tab.item.close['background-color-hover']};
        flex: 0 0 auto;
        width: ${token.tab.item.close.width};
        height: ${token.tab.item.close.width};
        color: ${token.tab.item.close.color};
        border-radius: ${token.tab.item.close['border-radius']};
        padding: 0;
        &:hover { color: ${token.tab.item.close['color-hover']}; }
        &:focus-visible { outline-offset: ${token.tab.item['outline-offset-focus']}; }
        & > span:first-child {
            inset: auto;
            top: 50%;
            left: 50%;
            width: ${token.tab.item.close.touch.width};
            height: ${token.tab.item.close.touch.width};
            transform: translate(-50%, -50%);
        }
        @media (pointer: coarse) {
            width: ${token.tab.item.close.touch.width};
            height: ${token.tab.item.close.touch.width};
        }
        & svg {
            width: ${token.tab.item.close.icon.width};
            height: ${token.tab.item.close.icon.width};
        }
    }
`;

const TabBar: FC<TabBarProps> = ({
    idPrefix,
    onEmpty,
    items,
    activeKey,
    onChange,
    onClose,
    onCloseOthers,
    onCloseRight,
    onCloseAll,
    onReload,
    onReorder,
}) => {
    const fallbackId = useId();
    const prefix = idPrefix ?? fallbackId;
    const selectedKey = activeKey ?? items[0]?.key;
    const draggable = !!onReorder;
    const reducedMotion = useMediaQuery('(prefers-reduced-motion: reduce)');
    // Mutable DOM measurements, pointer sessions and animation handles never drive rendering directly.
    const tabRefMap = useRef(new Map<Key, HTMLDivElement>());
    const barRef = useRef<HTMLDivElement>(null);
    // A close request can complete in a later controlled render; retain its focus intent.
    const closing = useRef<{ key: Key; index: number } | null>(null);
    const revealSelected = useEffectEvent(() => {
        const bar = barRef.current;
        const element = selectedKey === undefined ? undefined : tabRefMap.current.get(selectedKey);
        if (!bar || !element || typeof bar.scrollBy !== 'function') return;
        const bounds = bar.getBoundingClientRect();
        const tab = element.getBoundingClientRect();
        const delta = tab.left < bounds.left ? tab.left - bounds.left : tab.right > bounds.right ? tab.right - bounds.right : 0;
        if (delta) bar.scrollBy({ left: delta, behavior: 'instant' });
    });
    useLayoutEffect(() => {
        revealSelected();
        const pending = closing.current;
        if (!pending || items.some(item => item.key === pending.key)) return;
        closing.current = null;
        const next = items.find(item => item.key === selectedKey) ?? items[Math.min(pending.index, items.length - 1)];
        if (next) tabRefMap.current.get(next.key)?.querySelector<HTMLButtonElement>('[role="tab"]')?.focus({ preventScroll: true });
        else onEmpty?.();
    }, [items, selectedKey, onEmpty]);
    useLayoutEffect(() => {
        if (!barRef.current || typeof ResizeObserver === 'undefined') return;
        const observer = new ResizeObserver(() => revealSelected());
        observer.observe(barRef.current);
        return () => observer.disconnect();
    }, []);
    const requestClose = (key: Key) => {
        const index = items.findIndex(item => item.key === key);
        if (!onClose || index < 0 || items[index].closable === false) return;
        closing.current = { key, index };
        onClose(key);
    };
    const handleKeyDown = (event: ReactKeyboardEvent<HTMLButtonElement>, index: number) => {
        const item = items[index];
        if (event.key === 'Delete') {
            event.preventDefault();
            requestClose(item.key);
            return;
        }
        if (event.key === 'ContextMenu' || (event.shiftKey && event.key === 'F10')) {
            if (!contextMenuEnabled) return;
            event.preventDefault();
            const rect = event.currentTarget.getBoundingClientRect();
            setMenuState({ key: item.key, x: rect.left, y: rect.bottom, open: true });
            return;
        }
        const direction = getComputedStyle(event.currentTarget).direction === 'rtl' ? -1 : 1;
        let nextIndex: number;
        switch (event.key) {
            case 'ArrowRight': nextIndex = index + direction; break;
            case 'ArrowLeft': nextIndex = index - direction; break;
            case 'Home': nextIndex = 0; break;
            case 'End': nextIndex = items.length - 1; break;
            default: return;
        }
        event.preventDefault();
        const next = items[Math.max(0, Math.min(items.length - 1, nextIndex))];
        onChange?.(next.key);
        tabRefMap.current.get(next.key)?.querySelector<HTMLButtonElement>('[role="tab"]')?.focus({ preventScroll: true });
    };
    /** Pointer session measurements persist between events without render-time ref reads. */
    const dragRef = useRef<{
        key: Key
        originIndex: number
        startX: number
        widths: number[]
        movedDistance: number
        currentIndex: number
        pointerId: number
        direction: number
    } | null>(null);
    /** 被拖动的 tab key 与其平移量；snapping 为 true 表示处于释放后的回位动画阶段 */
    const [dragView, setDragView] = useState<{ key: Key, offsetX: number, originIndex: number, currentIndex: number, width: number, direction: number, snapping: boolean } | null>(null);
    /** 拖动后需抑制后续 click（避免拖动结束时误触 onChange）*/
    const justDraggedRef = useRef(false);
    const motions = useRef(new Map<Key, { offset: number; duration: number; animation: Animation }>());

    const completeReorder = useEffectEvent(() => {
        if (!dragView?.snapping) return;
        const { key, originIndex, currentIndex } = dragView;
        setDragView(null);
        if (currentIndex !== originIndex && items[originIndex]?.key === key && currentIndex < items.length) {
            const next = items.slice();
            const [moved] = next.splice(originIndex, 1);
            next.splice(currentIndex, 0, moved);
            onReorder?.(next.map(item => item.key));
        }
    });

    useLayoutEffect(() => {
        if (!dragView) {
            motions.current.forEach(motion => motion.animation.cancel());
            motions.current.clear();
            return;
        }
        if (items[dragView.originIndex]?.key !== dragView.key) {
            dragRef.current = null;
            setDragView(null);
            return;
        }
        for (const [key, motion] of motions.current) {
            if (!tabRefMap.current.has(key)) {
                motion.animation.cancel();
                motions.current.delete(key);
            }
        }
        let cancelled = false;
        for (const [key, element] of tabRefMap.current) {
            const offset = Number(element.dataset.dragOffset ?? 0);
            const previous = motions.current.get(key);
            if (previous?.offset === offset && (!reducedMotion || previous.duration === 0)) continue;
            if (!previous && offset === 0) continue;
            if (typeof element.animate !== 'function') continue;
            const style = getComputedStyle(element);
            const from = style.transform || 'none';
            const time = style.transitionDuration.split(',')[0].trim();
            const resolvedDuration = Number.parseFloat(time) * (time.endsWith('ms') ? 1 : 1000);
            // The dragged tab follows the pointer directly; only reflow and release use spatial motion.
            const duration = reducedMotion || (key === dragView.key && !dragView.snapping)
                ? 0 : (Number.isFinite(resolvedDuration) ? resolvedDuration : 0);
            const easing = style.transitionTimingFunction.match(/^[^(,]+(?:\([^)]*\))?/)?.[0] ?? 'linear';
            previous?.animation.cancel();
            const animation = element.animate([{ transform: from }, { transform: `translateX(${offset}px)` }], {
                duration, easing, fill: 'both',
            });
            motions.current.set(key, { offset, duration, animation });
        }
        if (dragView.snapping) {
            const pending = [...motions.current.values()].filter(motion => motion.duration > 0 && motion.animation.playState !== 'finished');
            if (pending.length === 0) completeReorder();
            else void Promise.allSettled(pending.map(motion => motion.animation.finished)).then(() => {
                if (!cancelled) completeReorder();
            });
        }
        return () => { cancelled = true; };
    }, [dragView, items, reducedMotion]);

    useLayoutEffect(() => () => {
        motions.current.forEach(motion => motion.animation.cancel());
        motions.current.clear();
    }, []);

    const setTabRef = (key: Key) => (element: HTMLDivElement | null) => {
        if (!element) return;
        tabRefMap.current.set(key, element);
        return () => { tabRefMap.current.delete(key); };
    };

    const handlePointerDown = (e: ReactPointerEvent<HTMLDivElement>, key: Key, index: number) => {
        if (!draggable || dragView?.snapping) return;
        if (e.button !== 0 || e.pointerType === 'touch') return;
        // 不拦截关闭按钮上的点击
        if ((e.target as HTMLElement).closest('.tab-close-btn')) return;

        justDraggedRef.current = false;
        const widths = items.map(it => tabRefMap.current.get(it.key)?.offsetWidth ?? 0);
        dragRef.current = {
            key,
            originIndex: index,
            startX: e.clientX,
            widths,
            movedDistance: 0,
            currentIndex: index,
            pointerId: e.pointerId,
            direction: getComputedStyle(e.currentTarget).direction === 'rtl' ? -1 : 1,
        };
        try { e.currentTarget.setPointerCapture(e.pointerId); } catch { /* noop */ }
    };

    const handlePointerMove = (e: ReactPointerEvent<HTMLDivElement>) => {
        const drag = dragRef.current;
        if (!drag) return;
        const physicalDelta = e.clientX - drag.startX;
        const delta = physicalDelta * drag.direction;
        drag.movedDistance = Math.max(drag.movedDistance, Math.abs(delta));

        // 低于阈值不进入拖动状态，保留点击语义
        if (drag.movedDistance < 4) return;

        // 计算当前应插入的位置：在 originIndex 基础上，根据平移量跨越邻居中心点计数
        const { originIndex, widths } = drag;
        let target = originIndex;
        if (delta > 0) {
            let acc = 0;
            for (let i = originIndex + 1; i < widths.length; i++) {
                const half = widths[i] / 2;
                if (delta > acc + half) {
                    target = i;
                    acc += widths[i];
                } else {
                    break;
                }
            }
        } else if (delta < 0) {
            let acc = 0;
            for (let i = originIndex - 1; i >= 0; i--) {
                const half = widths[i] / 2;
                if (-delta > acc + half) {
                    target = i;
                    acc += widths[i];
                } else {
                    break;
                }
            }
        }
        drag.currentIndex = target;
        setDragView({ key: drag.key, offsetX: physicalDelta, originIndex, currentIndex: target, width: widths[originIndex], direction: drag.direction, snapping: false });
    };

    const finishDrag = () => {
        const drag = dragRef.current;
        dragRef.current = null;
        if (!drag) return;
        if (drag.movedDistance < 4) {
            setDragView(null);
            return;
        }
        justDraggedRef.current = true;

        const { originIndex, currentIndex, widths, key } = drag;
        // 计算被拖标签释放后应归位的目标 offsetX：其他标签已滑动让出的槽位中心
        let snapOffset = 0;
        if (currentIndex > originIndex) {
            for (let i = originIndex + 1; i <= currentIndex; i++) snapOffset += widths[i];
        } else if (currentIndex < originIndex) {
            for (let i = currentIndex; i < originIndex; i++) snapOffset -= widths[i];
        }

        // Release into the final slot; the layout effect waits for the actual animations.
        setDragView({ key, offsetX: snapOffset * drag.direction, originIndex, currentIndex, width: widths[originIndex], direction: drag.direction, snapping: true });
    };

    const handlePointerUp = (e: ReactPointerEvent<HTMLDivElement>) => {
        if (dragRef.current?.pointerId !== e.pointerId) return;
        try { e.currentTarget.releasePointerCapture(e.pointerId); } catch { /* noop */ }
        finishDrag();
    };

    const handlePointerCancel = (e: ReactPointerEvent<HTMLDivElement>) => {
        if (dragRef.current?.pointerId !== e.pointerId) return;
        try { e.currentTarget.releasePointerCapture(e.pointerId); } catch { /* noop */ }
        dragRef.current = null;
        justDraggedRef.current = false;
        setDragView(null);
    };

    /** 计算任意 tab 在拖动中应该应用的水平偏移（让出位置）*/
    const getShiftX = (index: number): number => {
        if (!dragView) return 0;
        const { originIndex, currentIndex } = dragView;
        if (index === originIndex) return 0;
        const draggedWidth = dragView.width * dragView.direction;
        if (currentIndex > originIndex && index > originIndex && index <= currentIndex) {
            return -draggedWidth;
        }
        if (currentIndex < originIndex && index < originIndex && index >= currentIndex) {
            return draggedWidth;
        }
        return 0;
    };

    /** 右键菜单状态：仅当任一回调被传入时才启用 */
    const contextMenuEnabled = !!(onReload || onClose || onCloseOthers || onCloseRight || onCloseAll);
    const [menuState, setMenuState] = useState<{ x: number, y: number, key: Key, open: boolean } | null>(null);
    const closeMenu = () => setMenuState(current => current ? { ...current, open: false } : null);
    const finishMenuExit = () => setMenuState(current => current?.open ? current : null);

    const handleContextMenu = (e: ReactMouseEvent<HTMLDivElement>, key: Key) => {
        if (!contextMenuEnabled) return;
        e.preventDefault();
        // 拖动结束的瞬间忽略右键菜单
        if (justDraggedRef.current) return;
        setMenuState({ x: e.clientX, y: e.clientY, key, open: true });
    };

    const buildMenuItems = (key: Key): TabContextMenuItem[] => {
        const target = items.find((it) => it.key === key);
        const targetClosable = !!target && target.closable !== false;
        const targetIndex = items.findIndex((it) => it.key === key);
        const otherClosableCount = items.reduce(
            (acc, it) => acc + (it.key !== key && it.closable !== false ? 1 : 0),
            0,
        );
        const rightClosableCount = targetIndex < 0
            ? 0
            : items.slice(targetIndex + 1).reduce(
                (acc, it) => acc + (it.closable !== false ? 1 : 0),
                0,
            );
        const anyClosable = items.some((it) => it.closable !== false);
        const result: TabContextMenuItem[] = [];
        if (onReload) {
            result.push({
                id: "reload",
                label: "重新加载页面",
                icon: <ReloadIcon />,
                onSelect: () => onReload(key),
            });
        }
        if (onClose) {
            result.push({
                id: "close",
                label: "关闭",
                icon: <CloseIcon />,
                disabled: !targetClosable,
                onSelect: () => requestClose(key),
            });
        }
        if (onCloseOthers) {
            result.push({
                id: "close-others",
                label: "关闭其他",
                icon: <CloseOthersIcon />,
                disabled: otherClosableCount === 0,
                onSelect: () => onCloseOthers(key),
            });
        }
        if (onCloseRight) {
            result.push({
                id: "close-right",
                label: "关闭右侧",
                icon: <CloseRightIcon />,
                disabled: rightClosableCount === 0,
                onSelect: () => onCloseRight(key),
            });
        }
        if (onCloseAll) {
            result.push({
                id: "close-all",
                label: "关闭所有",
                icon: <CloseAllIcon />,
                disabled: !anyClosable,
                onSelect: () => {
                    closing.current = { key, index: targetIndex };
                    onCloseAll();
                },
            });
        }
        return result;
    };

    return (
        <div ref={barRef} className={barStyle} role="tablist" aria-label="已打开的页面" aria-orientation="horizontal">
            {items.map((item, index) => {
                const isActive = item.key === selectedKey;
                const closable = item.closable !== false && !!onClose;
                const isDragging = dragView?.key === item.key;
                const isSnapping = isDragging && dragView!.snapping;
                const isLifted = isDragging && !dragView!.snapping;
                const shiftX = getShiftX(index);
                const offset = isDragging ? dragView!.offsetX : shiftX;
                return (
                    <div
                        key={item.key}
                        ref={setTabRef(item.key)}
                        role="presentation"
                        data-active={isActive ? '' : undefined}
                        className={cx.call(undefined, tabItemStyle,
                            isActive && tabItemActiveStyle,
                            draggable && !isLifted && !isSnapping && tabItemShiftableStyle,
                            isLifted && tabItemDraggingStyle,
                            isSnapping && tabItemSnappingStyle
                        )}
                        data-drag-offset={offset}
                        onClick={() => {
                            if (justDraggedRef.current) { justDraggedRef.current = false; return; }
                            onChange?.(item.key);
                        }}
                        onPointerDown={(e) => handlePointerDown(e, item.key, index)}
                        onPointerMove={handlePointerMove}
                        onPointerUp={handlePointerUp}
                        onPointerCancel={handlePointerCancel}
                        onContextMenu={(e) => handleContextMenu(e, item.key)}
                    >
                        <Button
                            type="button"
                            appearance="text"
                            className={tabButtonStyle}
                            id={`${prefix}-tab-${index}`}
                            role="tab"
                            aria-selected={isActive}
                            aria-controls={idPrefix ? `${prefix}-panel-${index}` : undefined}
                            tabIndex={isActive ? 0 : -1}
                            onKeyDown={(event) => handleKeyDown(event, index)}
                        >
                            <span className={tabLabelStyle}>
                                {item.icon ? <span className={iconStyle} aria-hidden="true">{item.icon}</span> : null}
                                <span id={`${prefix}-label-${index}`} className={titleStyle}>{item.title}</span>
                            </span>
                        </Button>
                        {closable ? (
                            <Button
                                type="button"
                                appearance="text"
                                shape="circle"
                                icon={<CloseIcon />}
                                className={cx.call(undefined, closeBtnStyle, 'tab-close-btn')}
                                tabIndex={isActive ? 0 : -1}
                                onClick={(e) => {
                                    e.stopPropagation();
                                    requestClose(item.key);
                                }}
                                onPointerDown={(e) => e.stopPropagation()}
                                aria-label="关闭标签页"
                                aria-describedby={`${prefix}-label-${index}`}
                            />
                        ) : null}
                        {isActive ? <span className="tab-active-right-curve" aria-hidden="true" /> : null}
                    </div>
                );
            })}
            {menuState ? (
                <TabContextMenu
                    open={menuState.open}
                    onExitComplete={finishMenuExit}
                    x={menuState.x}
                    y={menuState.y}
                    items={buildMenuItems(menuState.key)}
                    onClose={closeMenu}
                />
            ) : null}
        </div>
    );
};

export default TabBar;
