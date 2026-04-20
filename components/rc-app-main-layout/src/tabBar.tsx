import type { FC, Key, PointerEvent as ReactPointerEvent } from "react";
import { useCallback, useRef, useState } from "react";
import { css, cx } from "@linaria/core";
import token from "./token.js";
import type { TabItem } from "./types.js";

export type { TabItem };

export interface TabBarProps {
    /** 标签列表 */
    items: TabItem[]
    /** 当前激活的标签 key */
    activeKey?: Key
    /** 切换标签时的回调 */
    onChange?: (key: Key) => void
    /** 关闭标签时的回调 */
    onClose?: (key: Key) => void
    /** 拖拽重排后的回调；传入则启用拖拽排序 */
    onReorder?: (keys: Key[]) => void
}

const barStyle = css`
    display: flex;
    align-items: flex-end;
    flex: 1;
    min-width: 0;
    overflow: hidden;
    padding: 0;
`;

/**
 * Chrome 风格标签项 —— 关键技巧：
 *  1. 标签之间紧贴，使用 ::before / ::after 伪元素绘制位于"标签外侧底部"的两个小方块；
 *  2. 这两个小方块用 radial-gradient 把朝向标签中心的圆形区域抠成透明，剩下的 L 形看起来就是
 *     "标签底角向外凹陷"的曲面，与 Chrome 经典的双弯标签视觉一致；
 *  3. 仅 active 状态显示这两个伪曲面，让选中标签像浮起并融入下方内容区。
 */
const tabItemStyle = css`
    display: inline-flex;
    align-items: center;
    height: ${token.tab.item.height};
    min-width: ${token.tab.item['min-width']};
    max-width: ${token.tab.item['max-width']};
    padding: ${token.tab.item.padding};
    gap: ${token.tab.item.gap};
    font-size: ${token.tab.font.size};
    color: ${token.tab.item.color};
    border-radius: ${token.tab.item.border.radius} ${token.tab.item.border.radius} 0 0;
    cursor: pointer;
    user-select: none;
    white-space: nowrap;
    flex-shrink: 1;
    flex-basis: ${token.tab.item['max-width']};
    transition: color 120ms ease, background-color 120ms ease;
    position: relative;
    box-sizing: border-box;
    margin: 0;

    &:hover {
        background-color: ${token.tab.item.background['color-hover']};
    }

    &:hover > .tab-close-btn {
        opacity: 1;
    }

    /* 标签之间的细竖分隔线（Chrome 经典样式） */
    &:not(:last-child)::after {
        content: '';
        position: absolute;
        right: -0.5px;
        top: 25%;
        height: 50%;
        width: 1px;
        background-color: ${token.tab.item.separator.color};
        pointer-events: none;
    }
`;

const tabItemActiveStyle = css`
    color: ${token.tab.item['color-active']};
    background-color: ${token.tab.item.background.color};
    font-weight: 500;
    z-index: 2;

    &:hover {
        background-color: ${token.tab.item.background.color};
    }

    & > .tab-close-btn {
        opacity: 1;
    }

    /* active 标签自身右侧不显示分隔线 */
    &::after {
        display: none;
    }

    /* 左下角向外凹陷的曲面 */
    &::before {
        content: '';
        position: absolute;
        bottom: 0;
        left: calc(-1 * ${token.tab.item.curve.size});
        width: ${token.tab.item.curve.size};
        height: ${token.tab.item.curve.size};
        background: radial-gradient(
            circle at 0 0,
            transparent ${token.tab.item.curve.size},
            ${token.tab.item.background.color} calc(${token.tab.item.curve.size} + 0.5px)
        );
        pointer-events: none;
    }
`;

/* 右下角向外凹陷曲面（独立类，附加到 active 标签上以避免与 ::after 分隔线冲突） */
const tabItemActiveRightCurveStyle = css`
    position: relative;

    & > .tab-active-right-curve {
        content: '';
        position: absolute;
        bottom: 0;
        right: calc(-1 * ${token.tab.item.curve.size});
        width: ${token.tab.item.curve.size};
        height: ${token.tab.item.curve.size};
        background: radial-gradient(
            circle at 100% 0,
            transparent ${token.tab.item.curve.size},
            ${token.tab.item.background.color} calc(${token.tab.item.curve.size} + 0.5px)
        );
        pointer-events: none;
    }
`;

const tabLabelStyle = css`
    flex: 1;
    min-width: 0;
    overflow: hidden;
    text-overflow: ellipsis;
    mask-image: linear-gradient(to right, #000 0, #000 calc(100% - 12px), transparent 100%);
`;

const tabItemDraggingStyle = css`
    z-index: 10;
    transition: none !important;
    cursor: grabbing;
    box-shadow: 0 6px 16px oklch(0 0 0 / 0.18);

    &::after {
        display: none !important;
    }
`;

/** 释放后被拖标签的平滑回位：从当前光标位置丝滑到已让出的槽位中心 */
const tabItemSnappingStyle = css`
    z-index: 10;
    transition: transform 220ms cubic-bezier(0.22, 0.61, 0.36, 1), box-shadow 220ms ease;
    box-shadow: 0 0 0 oklch(0 0 0 / 0);

    &::after {
        display: none !important;
    }
`;

/** 其他标签让位时的过渡：足够快以跟手，但保持平滑 */
const tabItemShiftableStyle = css`
    transition: transform 180ms cubic-bezier(0.2, 0, 0, 1);
    will-change: transform;
`;

const iconStyle = css`
    display: inline-flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
    width: ${token.tab.item.icon.size};
    height: ${token.tab.item.icon.size};

    & > svg, & > img {
        width: 100%;
        height: 100%;
    }
`;

const closeBtnStyle = css`
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: ${token.tab.item.close.size};
    height: ${token.tab.item.close.size};
    border-radius: 50%;
    color: ${token.tab.item.close.color};
    flex-shrink: 0;
    opacity: 0;
    margin-right: -4px;
    transition: opacity 120ms ease, color 120ms ease, background-color 120ms ease;

    &:hover {
        color: ${token.tab.item.close['color-hover']};
        background-color: ${token.tab.item.close.background['color-hover']};
    }

    & > svg {
        width: 10px;
        height: 10px;
    }
`;

const CloseIcon = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <line x1="18" y1="6" x2="6" y2="18" />
        <line x1="6" y1="6" x2="18" y2="18" />
    </svg>
);

const TabBar: FC<TabBarProps> = ({
    items,
    activeKey,
    onChange,
    onClose,
    onReorder,
}) => {
    const draggable = !!onReorder;
    const tabRefMap = useRef(new Map<Key, HTMLDivElement>());
    /** Drag 过程全部状态存在 ref 以避免重染染被 pointermove 频繁触发 */
    const dragRef = useRef<{
        key: Key
        originIndex: number
        startX: number
        widths: number[]
        movedDistance: number
        currentIndex: number
        pointerId: number
    } | null>(null);
    /** 被拖动的 tab key 与其平移量；snapping 为 true 表示处于释放后的回位动画阶段 */
    const [dragView, setDragView] = useState<{ key: Key, offsetX: number, originIndex: number, currentIndex: number, snapping: boolean } | null>(null);
    /** 拖动后需抑制后续 click（避免拖动结束时误触 onChange）*/
    const justDraggedRef = useRef(false);
    /** 提交 reorder 后的一帧内禁用所有过渡，避免数组重排导致的布局跳跳位动画 */
    const [suppressTransition, setSuppressTransition] = useState(false);
    /** 回位动画定时器句柄 */
    const snapTimerRef = useRef<number | null>(null);

    const setTabRef = useCallback((key: Key) => (el: HTMLDivElement | null) => {
        if (el) tabRefMap.current.set(key, el);
        else tabRefMap.current.delete(key);
    }, []);

    const handlePointerDown = useCallback((e: ReactPointerEvent<HTMLDivElement>, key: Key, index: number) => {
        if (!draggable) return;
        if (e.button !== 0) return;
        // 不拦截关闭按钮上的点击
        if ((e.target as HTMLElement).closest('.tab-close-btn')) return;

        const widths = items.map(it => tabRefMap.current.get(it.key)?.offsetWidth ?? 0);
        dragRef.current = {
            key,
            originIndex: index,
            startX: e.clientX,
            widths,
            movedDistance: 0,
            currentIndex: index,
            pointerId: e.pointerId,
        };
        try { e.currentTarget.setPointerCapture(e.pointerId); } catch { /* noop */ }
    }, [draggable, items]);

    const handlePointerMove = useCallback((e: ReactPointerEvent<HTMLDivElement>) => {
        const drag = dragRef.current;
        if (!drag) return;
        const delta = e.clientX - drag.startX;
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
        setDragView({ key: drag.key, offsetX: delta, originIndex, currentIndex: target, snapping: false });
    }, []);

    const finishDrag = useCallback(() => {
        const drag = dragRef.current;
        dragRef.current = null;
        if (!drag) {
            setDragView(null);
            return;
        }
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

        // 进入 snapping 阶段：被拖标签启用 transition 平滑走到 snapOffset，其他标签位置不变
        setDragView({ key, offsetX: snapOffset, originIndex, currentIndex, snapping: true });

        if (snapTimerRef.current !== null) window.clearTimeout(snapTimerRef.current);
        snapTimerRef.current = window.setTimeout(() => {
            snapTimerRef.current = null;
            justDraggedRef.current = false;
            // 动画结束后提交重排：DOM 布局会跳变，临时关闭过渡以避免闪烁
            setSuppressTransition(true);
            setDragView(null);
            if (currentIndex !== originIndex) {
                const next = items.slice();
                const [moved] = next.splice(originIndex, 1);
                next.splice(currentIndex, 0, moved);
                onReorder?.(next.map(it => it.key));
            }
            requestAnimationFrame(() => {
                requestAnimationFrame(() => setSuppressTransition(false));
            });
        }, 220);
    }, [items, onReorder]);

    const handlePointerUp = useCallback((e: ReactPointerEvent<HTMLDivElement>) => {
        try { e.currentTarget.releasePointerCapture(e.pointerId); } catch { /* noop */ }
        finishDrag();
    }, [finishDrag]);

    const handlePointerCancel = useCallback((e: ReactPointerEvent<HTMLDivElement>) => {
        try { e.currentTarget.releasePointerCapture(e.pointerId); } catch { /* noop */ }
        finishDrag();
    }, [finishDrag]);

    /** 计算任意 tab 在拖动中应该应用的水平偏移（让出位置）*/
    const getShiftX = (index: number): number => {
        if (!dragView) return 0;
        const { originIndex, currentIndex } = dragView;
        if (index === originIndex) return 0;
        // snapping 阶段不从 dragRef 读（已被清），改用实时宽度
        const draggedWidth = tabRefMap.current.get(dragView.key)?.offsetWidth ?? 0;
        if (currentIndex > originIndex && index > originIndex && index <= currentIndex) {
            return -draggedWidth;
        }
        if (currentIndex < originIndex && index < originIndex && index >= currentIndex) {
            return draggedWidth;
        }
        return 0;
    };

    return (
        <div className={barStyle} role="tablist">
            {items.map((item, index) => {
                const isActive = item.key === activeKey;
                const closable = item.closable !== false;
                const isDragging = dragView?.key === item.key;
                const isSnapping = isDragging && dragView!.snapping;
                const isLifted = isDragging && !dragView!.snapping;
                const shiftX = getShiftX(index);
                const transform = isDragging
                    ? `translateX(${dragView!.offsetX}px)`
                    : (shiftX !== 0 ? `translateX(${shiftX}px)` : undefined);
                return (
                    <div
                        key={item.key}
                        ref={setTabRef(item.key)}
                        role="tab"
                        aria-selected={isActive}
                        className={cx(
                            tabItemStyle,
                            isActive && tabItemActiveStyle,
                            isActive && tabItemActiveRightCurveStyle,
                            draggable && tabItemShiftableStyle,
                            isLifted && tabItemDraggingStyle,
                            isSnapping && tabItemSnappingStyle
                        )}
                        style={{
                            ...(transform ? { transform } : null),
                            ...(suppressTransition ? { transition: "none" } : null),
                        }}
                        onClick={() => {
                            if (justDraggedRef.current) return;
                            onChange?.(item.key);
                        }}
                        onPointerDown={(e) => handlePointerDown(e, item.key, index)}
                        onPointerMove={handlePointerMove}
                        onPointerUp={handlePointerUp}
                        onPointerCancel={handlePointerCancel}
                    >
                        {item.icon ? (
                            <span className={iconStyle}>{item.icon}</span>
                        ) : null}
                        <span className={tabLabelStyle}>{item.title}</span>
                        {closable ? (
                            <span
                                className={cx(closeBtnStyle, 'tab-close-btn')}
                                onClick={(e) => {
                                    e.stopPropagation();
                                    onClose?.(item.key);
                                }}
                                onPointerDown={(e) => e.stopPropagation()}
                                role="button"
                                aria-label="Close tab"
                            >
                                <CloseIcon />
                            </span>
                        ) : null}
                        {isActive ? <span className="tab-active-right-curve" aria-hidden /> : null}
                    </div>
                );
            })}
        </div>
    );
};

export default TabBar;