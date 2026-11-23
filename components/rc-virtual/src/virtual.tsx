import { Component, useEffect, useEffectEvent, useRef, useState, useLayoutEffect, useImperativeHandle, useMemo } from "react";
import type { HTMLAttributes, ReactNode, RefObject } from "react";
import { cx } from "@crab-dev/css";

import { containerStyle, gridStyle, scrollPositionHintStyle } from "./style/grid.style.js";

import useVirtualItemRange, { getVirtualItemEnd, getVirtualItemIndex, getVirtualItemSize, getVirtualItemStart } from "./hooks/useVirtualItemRange.js";
import ScrollBar from "./scrollbar.js";
import { getScrollWindow } from "./scrollWindow.js";
import type { VirtualAxis } from "./types.js";


export interface VirtualHandle {
    /** 按逻辑像素定位；未提供的轴保持原位置，自动限制在滚动范围内。 */
    scrollTo: (position: { left?: number; top?: number }) => void;
    scrollToCell: (position: {
        rowIndex?: number,
        columnIndex?: number,
        /** 从顶部留出的偏移量（px），用于避免行被固定表头遮挡 */
        topOffset?: number,
        /** 从左侧留出的偏移量（px），用于避免列被固定左列遮挡 */
        leftOffset?: number,
    }) => void;

    getScrollCellPosition: () => {
        rowIndex: number,
        columnIndex: number
    };
}

export interface VirtualProps extends Omit<HTMLAttributes<HTMLDivElement>, "children"> {
    /** 每列宽度数组，或等宽列的 { count, itemSize } 配置，单位为 px */
    gridTemplateColumns: VirtualAxis
    /** 每行高度数组，或等高行的 { count, itemSize } 配置，单位为 px */
    gridTemplateRows: VirtualAxis
    /** 可视区域宽度，单位为 px */
    viewportWidth: number,
    /** 可视区域高度，单位为 px */
    viewportHeight: number,
    /**
     * 可视区顶部被常驻（sticky）内容占据的高度，单位为 px。
     * 例如表格在滚动容器内渲染的固定表头 / 过滤栏：它们占用可视区却不在 gridTemplateRows 中，
     * 因此需要计入纵向滚动总高度，否则末尾内容会被裁切且无法滚动到底。
     */
    reservedTopHeight?: number,
    /**
     * 可视区底部被常驻（sticky）内容占据的高度，单位为 px。
     * 例如表格底部固定的汇总 / 合计行：它贴在可视区底部却不在 gridTemplateRows 中，
     * 因此需要计入纵向滚动总高度，否则末尾数据行会被汇总行遮挡且无法滚动出来。
     */
    reservedBottomHeight?: number,
    /** 可视范围上下额外渲染的行数，默认 0 */
    overscanRowCount?: number,
    /** 可视范围左右额外渲染的列数，默认 0 */
    overscanColumnCount?: number,
    /** 渲染回调，根据当前可见的行列范围返回对应的 ReactNode */
    renderRows: (rowRange: [number, number], columnRange: [number, number]) => ReactNode,
    /** 组件实例引用，可通过 scrollToCell 和 getScrollCellPosition 编程式控制滚动 */
    gridRef?: RefObject<VirtualHandle | null>
    /** 实际逻辑滚动位置变化，包含滚轮、滚动条、原生聚焦滚动、命令式定位及尺寸收缩。 */
    onScrollPositionChange?: (position: { left: number; top: number }) => void;
}

export interface VirtualPadding {
    top: number;
    bottom: number;
    left: number;
    right: number;
}

export interface VirtualWindowProps extends Omit<VirtualProps, "renderRows"> {
    /** Render the window and apply the supplied spacer sizes to its elements. */
    renderWindow: (rowRange: [number, number], columnRange: [number, number], padding: VirtualPadding) => ReactNode;
}

type VirtualRenderProps = (VirtualProps & { renderWindow?: never }) | (VirtualWindowProps & { renderRows?: never });

interface ScrollPosition {
    left: number;
    top: number;
}

interface ScrollLayout {
    leftOrigin: number;
    topOrigin: number;
    minLeft: number;
    maxLeft: number;
    minTop: number;
    maxTop: number;
    viewportWidth: number;
    viewportHeight: number;
    totalWidth: number;
    totalHeight: number;
    nativeWidth: number;
    retainColumns: boolean;
}

interface PreparedColumnScroll extends ScrollPosition {
    layout: ScrollLayout;
}

interface WindowContentProps {
    children: ReactNode;
    renderWindow?: VirtualWindowProps["renderWindow"];
    prepareScroll: () => PreparedColumnScroll | null;
    rememberScroll: (position: PreparedColumnScroll) => void;
}

// The snapshot phase is React's commit hook before host nodes are changed. It lets
// horizontal jumps use the existing scroll extent without forcing layout of new cells.
class WindowContent extends Component<WindowContentProps, Record<string, never>, PreparedColumnScroll | null> {
    getSnapshotBeforeUpdate(previous: WindowContentProps): PreparedColumnScroll | null {
        const { children, renderWindow, prepareScroll } = this.props;
        if (!renderWindow || renderWindow !== previous.renderWindow || children === previous.children) return null;
        return prepareScroll();
    }

    componentDidUpdate(_previous: WindowContentProps, _state: unknown, prepared: PreparedColumnScroll | null): void {
        if (prepared) this.props.rememberScroll(prepared);
    }

    render(): ReactNode {
        return this.props.children;
    }
}

const Virtual = ({
    className,
    style,
    gridTemplateColumns,
    gridTemplateRows,
    renderRows,
    renderWindow,
    viewportWidth,
    viewportHeight,
    reservedTopHeight = 0,
    reservedBottomHeight = 0,
    overscanRowCount = 0,
    overscanColumnCount = 0,
    gridRef,
    onScrollPositionChange,
    ...restProps
}: VirtualRenderProps) => {
    const [currentScrollPositionTop, setCurrentScrollPositionTop] = useState<number>(0);
    const [currentScrollPositionLeft, setCurrentScrollPositionLeft] = useState<number>(0);
    const [columnWindowAnchor, setColumnWindowAnchor] = useState(0);
    const retainColumns = renderWindow != null && Number.isFinite(overscanColumnCount) && overscanColumnCount >= 1;

    const divGridRef = useRef<HTMLDivElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    // 可变实例状态 ref（滚动事件帧合并）：在同一动画帧累积高频 wheel 增量，避免每个事件都触发 React 渲染。
    const pendingScrollPositionRef = useRef<ScrollPosition | null>(null);
    // 可变实例状态 ref（动画帧句柄）：用于保证最多只排队一个提交，并在卸载时取消。
    const scrollAnimationFrameRef = useRef<number | null>(null);
    // 可变实例状态（滚动目标）：在 React 提交前累积增量，避免从受浏览器限制的 DOM 坐标反推逻辑位置。
    const logicalScrollRef = useRef({
        left: 0, top: 0, maxLeft: 0, maxTop: 0, domLeft: 0, domTop: 0, prepared: false, horizontalInput: false,
    });
    // The last committed window is safe to move within until React mounts its replacement.
    const scrollLayoutRef = useRef<ScrollLayout | null>(null);

    let {
        columnRange,
        rowRange,
        columnMetrics,
        rowMetrics,
        effectiveScrollPositionTop,
        effectiveScrollPositionLeft
    } = useVirtualItemRange({
        viewportHeight,
        viewportWidth,
        currentScrollPositionTop,
        currentScrollPositionLeft,
        gridTemplateColumns,
        gridTemplateRows,
        reservedTopHeight,
        reservedBottomHeight,
        overscanRowCount,
        overscanColumnCount,
        columnWindowAnchor: retainColumns ? columnWindowAnchor : undefined,
    });

    const totalWidth = columnMetrics.totalSize;
    const notifyPosition = useEffectEvent(() => onScrollPositionChange?.({ left: effectiveScrollPositionLeft, top: effectiveScrollPositionTop }));
    useLayoutEffect(() => { notifyPosition(); }, [effectiveScrollPositionLeft, effectiveScrollPositionTop]);
    // 计入顶部 / 底部常驻内容（如固定表头、固定汇总行）高度：它们在滚动容器内占位但不属于行，
    // 否则当行总高略小于可视高度、却被表头挤出可视区时，末尾内容无法滚动到底；
    // 或底部固定汇总行遮挡最后一行数据时，该行无法滚动出来。
    const totalHeight = rowMetrics.totalSize + reservedTopHeight + reservedBottomHeight;

    const rowStartPosition = getVirtualItemStart(rowMetrics, rowRange[0]);
    const rowEndPosition = getVirtualItemEnd(rowMetrics, rowRange[1]);
    const columnStartPosition = getVirtualItemStart(columnMetrics, columnRange[0]);
    const columnEndPosition = getVirtualItemEnd(columnMetrics, columnRange[1]);
    const rowWindow = getScrollWindow(rowStartPosition, rowEndPosition, rowMetrics.totalSize, effectiveScrollPositionTop);
    const columnWindow = getScrollWindow(columnStartPosition, columnEndPosition, totalWidth, effectiveScrollPositionLeft);
    const nativeWidth = columnEndPosition - columnWindow.origin + columnWindow.paddingEnd;
    const maxMountedTop = rowEndPosition === rowMetrics.totalSize ? Math.max(0, totalHeight - viewportHeight) : rowEndPosition - viewportHeight;

    useLayoutEffect(() => {
        const container = containerRef.current;
        const grid = divGridRef.current;
        if (!container || !grid) return;
        // 运行时几何通过 DOM 写入；Crab CSS 仍只处理静态样式。
        container.style.width = `${viewportWidth}px`;
        container.style.height = `${viewportHeight}px`;
        grid.style.width = `${viewportWidth}px`;
        grid.style.height = `${viewportHeight}px`;
    }, [viewportWidth, viewportHeight, style]);

    useLayoutEffect(() => {
        const container = containerRef.current;
        if (!container || renderWindow) return;
        container.style.setProperty("--crab-rc-virtual-top-padding-height", `${rowWindow.paddingStart}px`);
        container.style.setProperty("--crab-rc-virtual-bottom-padding-height", `${rowWindow.paddingEnd}px`);
        container.style.setProperty("--crab-rc-virtual-left-padding-width", `${columnWindow.paddingStart}px`);
        container.style.setProperty("--crab-rc-virtual-right-padding-width", `${columnWindow.paddingEnd}px`);
    }, [rowWindow.paddingStart, rowWindow.paddingEnd, columnWindow.paddingStart, columnWindow.paddingEnd, renderWindow, style]);

    useLayoutEffect(() => {
        const logical = logicalScrollRef.current;
        const layout = scrollLayoutRef.current;
        const prepared = logical.prepared && layout != null
            && logical.left === effectiveScrollPositionLeft && logical.top === effectiveScrollPositionTop
            && layout.leftOrigin === columnWindow.origin && layout.topOrigin === rowWindow.origin
            && layout.viewportWidth === viewportWidth && layout.viewportHeight === viewportHeight
            && layout.totalWidth === totalWidth && layout.totalHeight === totalHeight;
        logical.left = effectiveScrollPositionLeft;
        logical.top = effectiveScrollPositionTop;
        logical.maxLeft = Math.max(0, totalWidth - viewportWidth);
        logical.maxTop = Math.max(0, totalHeight - viewportHeight);
        logical.prepared = false;
        logical.horizontalInput = false;
        scrollLayoutRef.current = {
            leftOrigin: columnWindow.origin, topOrigin: rowWindow.origin,
            minLeft: columnStartPosition, minTop: rowStartPosition,
            maxLeft: columnEndPosition === totalWidth ? logical.maxLeft : columnEndPosition - viewportWidth,
            maxTop: maxMountedTop,
            viewportWidth, viewportHeight, totalWidth, totalHeight, nativeWidth, retainColumns,
        };
        if (currentScrollPositionTop !== effectiveScrollPositionTop) {
            setCurrentScrollPositionTop(effectiveScrollPositionTop);
        }
        if (currentScrollPositionLeft !== effectiveScrollPositionLeft) {
            setCurrentScrollPositionLeft(effectiveScrollPositionLeft);
        }

        // Jumps outside the previous window, resize and recentering need the new layout.
        // Scrolling inside it already moved the DOM before React changed the spacers.
        const grid = divGridRef.current;
        if (!prepared && grid) {
            if (grid.scrollTop !== rowWindow.position) grid.scrollTop = rowWindow.position;
            if (grid.scrollLeft !== columnWindow.position) grid.scrollLeft = columnWindow.position;
            logical.domLeft = grid.scrollLeft;
            logical.domTop = grid.scrollTop;
        }
    }, [
        currentScrollPositionTop,
        currentScrollPositionLeft,
        effectiveScrollPositionTop,
        effectiveScrollPositionLeft,
        viewportHeight,
        viewportWidth,
        totalHeight,
        totalWidth,
        columnStartPosition,
        columnEndPosition,
        rowStartPosition,
        maxMountedTop,
        rowWindow.origin,
        columnWindow.origin,
        rowWindow.position,
        columnWindow.position,
        nativeWidth,
        retainColumns,
    ]);

    const isShowScrollBarsY = totalHeight > viewportHeight;
    const isShowScrollBarsX = totalWidth > viewportWidth;

    if (!isShowScrollBarsY) {
        rowRange = [0, rowMetrics.count - 1];
    }

    if (!isShowScrollBarsX) {
        columnRange = [0, columnMetrics.count - 1];
    }

    const [rowStart, rowEnd] = rowRange;
    const [columnStart, columnEnd] = columnRange;
    // 例外 3：调用方渲染回调可能很昂贵，且编译器无法推断纯度；按范围值缓存，保留尺寸和回调更新。
    const content = useMemo(
        () => renderWindow
            ? renderWindow([rowStart, rowEnd], [columnStart, columnEnd], {
                top: rowWindow.paddingStart, bottom: rowWindow.paddingEnd,
                left: columnWindow.paddingStart, right: columnWindow.paddingEnd,
            })
            : renderRows?.([rowStart, rowEnd], [columnStart, columnEnd]),
        [renderWindow, renderRows, rowStart, rowEnd, columnStart, columnEnd,
            rowWindow.paddingStart, rowWindow.paddingEnd, columnWindow.paddingStart, columnWindow.paddingEnd,
            rowMetrics, columnMetrics, viewportWidth, viewportHeight, reservedTopHeight, reservedBottomHeight],
    );

    const prepareColumnScroll = (): PreparedColumnScroll | null => {
        const grid = divGridRef.current;
        const layout = scrollLayoutRef.current;
        const logical = logicalScrollRef.current;
        if (!grid || !layout || logical.prepared || !logical.horizontalInput
            || logical.left !== effectiveScrollPositionLeft || logical.top !== effectiveScrollPositionTop
            || layout.leftOrigin !== columnWindow.origin || layout.topOrigin !== rowWindow.origin
            || layout.viewportWidth !== viewportWidth || layout.viewportHeight !== viewportHeight
            || layout.totalWidth !== totalWidth || layout.totalHeight !== totalHeight
            || layout.nativeWidth !== nativeWidth || layout.minTop !== rowStartPosition || layout.maxTop !== maxMountedTop
            || columnWindow.position < 0 || columnWindow.position > nativeWidth - viewportWidth
            || Math.abs(rowWindow.position - logical.domTop) >= 1
            || grid.contains(grid.ownerDocument.activeElement)) return null;

        const top = grid.scrollTop;
        if (Math.abs(top - rowWindow.position) >= 1) return null;
        let left = grid.scrollLeft;
        if (Math.abs(left - columnWindow.position) >= 1) {
            grid.scrollLeft = columnWindow.position;
            left = grid.scrollLeft;
        }
        return { left, top, layout };
    };

    const rememberColumnScroll = (position: PreparedColumnScroll) => {
        const grid = divGridRef.current;
        // Focus on a newly mounted descendant can move the viewport during the commit.
        if (!grid || scrollLayoutRef.current !== position.layout || grid.contains(grid.ownerDocument.activeElement)) return;
        const logical = logicalScrollRef.current;
        logical.domLeft = position.left;
        logical.domTop = position.top;
        logical.prepared = Math.abs(position.left - columnWindow.position) < 1;
    };

    const applyScrollTarget = (left: number, top: number, fromInput = false) => {
        const logical = logicalScrollRef.current;
        const layout = scrollLayoutRef.current;
        const grid = divGridRef.current;
        logical.prepared = false;
        logical.horizontalInput = fromInput && left !== logical.left && top === logical.top;
        // Reuse the mounted cells while horizontal input is still covered by the buffer.
        if (layout?.retainColumns && left !== logical.left
            && (!logical.horizontalInput || left < layout.minLeft || left > layout.maxLeft)) {
            setColumnWindowAnchor(left);
        }
        if (grid && layout && left >= layout.minLeft && left <= layout.maxLeft
            && top >= layout.minTop && top <= layout.maxTop) {
            const domLeft = left - layout.leftOrigin;
            const domTop = top - layout.topOrigin;
            if (logical.domLeft !== domLeft) {
                grid.scrollLeft = domLeft;
                logical.domLeft = grid.scrollLeft;
            }
            if (logical.domTop !== domTop) {
                grid.scrollTop = domTop;
                logical.domTop = grid.scrollTop;
            }
            // CSS pixels may be rounded at the current device scale.
            logical.prepared = Math.abs(logical.domLeft - domLeft) < 1 && Math.abs(logical.domTop - domTop) < 1;
        }
        logical.left = left;
        logical.top = top;
        setCurrentScrollPositionLeft(left);
        setCurrentScrollPositionTop(top);
    };

    const setScrollPosition = (position: Partial<ScrollPosition>) => {
        const logical = logicalScrollRef.current;
        const pending = pendingScrollPositionRef.current;
        const grid = divGridRef.current;
        const domLeft = grid?.scrollLeft ?? logical.domLeft;
        const domTop = grid?.scrollTop ?? logical.domTop;
        // 单轴定位保留另一轴尚未提交的 wheel / 原生滚动；未派发 scroll
        // 事件的 DOM 位移也需要先合并，不能被命令式更新拉回旧坐标。
        const left = position.left ?? (pending?.left ?? logical.left) + domLeft - logical.domLeft;
        const top = position.top ?? (pending?.top ?? logical.top) + domTop - logical.domTop;
        pendingScrollPositionRef.current = null;
        logical.domLeft = domLeft;
        logical.domTop = domTop;
        applyScrollTarget(Math.max(0, Math.min(left, logical.maxLeft)), Math.max(0, Math.min(top, logical.maxTop)));
    };

    const scrollToLeft = (left: number) => setScrollPosition({ left });
    const scrollToTop = (top: number) => setScrollPosition({ top });

    useImperativeHandle(gridRef, () => ({
        scrollTo: ({ left, top }) => {
            const nextLeft = Number.isFinite(left) ? left : undefined;
            const nextTop = Number.isFinite(top) ? top : undefined;
            if (nextLeft !== undefined || nextTop !== undefined) setScrollPosition({ left: nextLeft, top: nextTop });
        },
        scrollToCell: (position) => {
            if (position.rowIndex != null) {
                const topOffset = position.topOffset ?? 0;
                // toTop：目标行在数据行坐标系中的偏移（不含 sticky header）
                // 实际内容坐标 = topOffset + toTop
                const toTop = getVirtualItemStart(rowMetrics, position.rowIndex);
                const rowH = getVirtualItemSize(rowMetrics, position.rowIndex);

                // 仅当行完全不在可视区时才滚动（部分可见则不滚动）：
                //   内容坐标 = topOffset + toTop（行顶）~ topOffset + toTop + rowH（行底）
                //   可视数据区：[scrollTop + topOffset, scrollTop + viewportHeight]
                if (toTop + rowH <= effectiveScrollPositionTop) {
                    // 行完全在可视区上方：向上滚，使行顶贴着 header 底部
                    scrollToTop(Math.max(0, toTop));
                } else if (toTop >= effectiveScrollPositionTop + viewportHeight - topOffset - reservedBottomHeight) {
                    // 行完全在可视区下方：向下滚最小距离，使行底刚好贴视口底部
                    scrollToTop(Math.max(0, Math.min(topOffset + toTop + rowH + reservedBottomHeight - viewportHeight, totalHeight - viewportHeight)));
                }
                // 否则行（部分或完全）在可视区内，不滚动
            }
            if (position.columnIndex != null) {
                const leftOffset = position.leftOffset ?? 0;
                // 计算目标列的像素起止位置
                const toLeft = getVirtualItemStart(columnMetrics, position.columnIndex);
                const colW = getVirtualItemSize(columnMetrics, position.columnIndex);

                // 当前可视内容区（扣除固定左列）
                const visibleLeft = effectiveScrollPositionLeft + leftOffset;
                const visibleRight = effectiveScrollPositionLeft + viewportWidth;

                if (toLeft + colW <= visibleLeft) {
                    // 列完全在可视区左侧：向左滚，使列左边刚好贴着固定列右边
                    scrollToLeft(Math.max(0, toLeft - leftOffset));
                } else if (toLeft >= visibleRight) {
                    // 列完全在可视区右侧：向右滚最小距离，使列右边刚好出现在视口右边
                    scrollToLeft(Math.min(toLeft + colW - viewportWidth, totalWidth - viewportWidth));
                }
                // 否则列（部分或完全）在可视区内，不滚动
            }
        },
        getScrollCellPosition: () => {
            return {
                columnIndex: getVirtualItemIndex(columnMetrics, effectiveScrollPositionLeft),
                rowIndex: getVirtualItemIndex(rowMetrics, effectiveScrollPositionTop)
            };
        }
    }));

    useEffect(() => {
        const grid = divGridRef.current;
        /* istanbul ignore else -- ref is always populated after mount */
        if (grid) {
            const requestScrollFrame = (callback: (timestamp: number) => void) => {
                if (typeof globalThis.requestAnimationFrame === "function") {
                    return globalThis.requestAnimationFrame(callback);
                }
                return globalThis.setTimeout(() => callback(performance.now()), 16) as unknown as number;
            };
            const cancelScrollFrame = (frameId: number) => {
                if (typeof globalThis.cancelAnimationFrame === "function") {
                    globalThis.cancelAnimationFrame(frameId);
                    return;
                }
                globalThis.clearTimeout(frameId);
            };
            const readScrollPosition = () => {
                const logical = logicalScrollRef.current;
                const pending = pendingScrollPositionRef.current;
                const domLeft = grid.scrollLeft;
                const domTop = grid.scrollTop;
                const deltaLeft = domLeft - logical.domLeft;
                const deltaTop = domTop - logical.domTop;
                // 消费局部 DOM 的相对位移。聚焦、scrollIntoView 和待提交 wheel
                // 可以在同一帧发生；立即记住已读坐标，避免后续 scroll 重复计入。
                logical.domLeft = domLeft;
                logical.domTop = domTop;
                return {
                    left: Math.max(0, Math.min((pending?.left ?? logical.left) + deltaLeft, logical.maxLeft)),
                    top: Math.max(0, Math.min((pending?.top ?? logical.top) + deltaTop, logical.maxTop)),
                    moved: deltaLeft !== 0 || deltaTop !== 0,
                };
            };
            const commitPendingScrollPosition = () => {
                scrollAnimationFrameRef.current = null;
                if (!pendingScrollPositionRef.current || !divGridRef.current) {
                    return;
                }
                // 浏览器 scroll 事件可能晚于这一帧，再读取一次避免丢失其位移。
                const pendingPosition = readScrollPosition();
                pendingScrollPositionRef.current = null;
                applyScrollTarget(pendingPosition.left, pendingPosition.top, true);
            };
            const schedulePendingScrollPosition = () => {
                if (scrollAnimationFrameRef.current != null) {
                    return;
                }
                // 先写入哨兵，兼容测试或宿主提供的同步 requestAnimationFrame 实现。
                scrollAnimationFrameRef.current = -1;
                const frameId = requestScrollFrame(commitPendingScrollPosition);
                if (scrollAnimationFrameRef.current === -1) {
                    scrollAnimationFrameRef.current = frameId;
                }
            };
            const onNativeScroll = (event: Event) => {
                if (event.target !== grid) return;
                const position = readScrollPosition();
                // 布局同步产生的 scroll 已记录在 domLeft/domTop，不反馈进状态。
                if (!position.moved) return;
                pendingScrollPositionRef.current = { left: position.left, top: position.top };
                schedulePendingScrollPosition();
            };
            const normalizeWheelDelta = (delta: number, deltaMode: number, pageSize: number) => {
                if (!Number.isFinite(delta) || delta === 0) {
                    return 0;
                }
                if (deltaMode === globalThis.WheelEvent.DOM_DELTA_LINE) {
                    return delta * 16;
                }
                if (deltaMode === globalThis.WheelEvent.DOM_DELTA_PAGE) {
                    return delta * Math.max(1, pageSize);
                }
                return delta;
            };
            const onWheel = (e: globalThis.WheelEvent) => {
                // Canvas 等子节点可能取消浏览器默认动作，Virtual 仍需消费滚轮增量。
                const logicalPosition = logicalScrollRef.current;
                const nativePosition = readScrollPosition();
                const baseLeft = nativePosition.left;
                const baseTop = nativePosition.top;
                let newScrollLeft = baseLeft;
                let newScrollTop = baseTop;
                const pageDelta = e.deltaMode === globalThis.WheelEvent.DOM_DELTA_PAGE;
                const normalizedDeltaX = normalizeWheelDelta(e.deltaX, e.deltaMode, pageDelta ? grid.clientWidth : 0);
                const normalizedDeltaY = normalizeWheelDelta(e.deltaY, e.deltaMode, pageDelta ? grid.clientHeight : 0);
                const horizontalDelta = e.shiftKey && normalizedDeltaX === 0
                    ? normalizedDeltaY
                    : normalizedDeltaX;
                const verticalDelta = e.shiftKey ? 0 : normalizedDeltaY;

                newScrollLeft += horizontalDelta;
                newScrollTop += verticalDelta;

                newScrollLeft = Math.max(0, Math.min(newScrollLeft, logicalPosition.maxLeft));
                newScrollTop = Math.max(0, Math.min(newScrollTop, logicalPosition.maxTop));
                const handled = newScrollLeft !== baseLeft || newScrollTop !== baseTop;
                if (handled) e.preventDefault();
                if (!handled && !nativePosition.moved) return;

                pendingScrollPositionRef.current = {
                    left: newScrollLeft,
                    top: newScrollTop
                };
                schedulePendingScrollPosition();
            };
            grid.addEventListener("wheel", onWheel, {
                passive: false
            });
            grid.addEventListener("scroll", onNativeScroll);
            return () => {
                // StrictMode 清理 effect 前可能已清空 ref，必须从绑定时的节点移除监听。
                grid.removeEventListener("wheel", onWheel);
                grid.removeEventListener("scroll", onNativeScroll);
                if (scrollAnimationFrameRef.current != null && scrollAnimationFrameRef.current !== -1) {
                    cancelScrollFrame(scrollAnimationFrameRef.current);
                }
                scrollAnimationFrameRef.current = null;
                pendingScrollPositionRef.current = null;
            };
        }
    }, []);


    return (
        <div
            className={cx.call(undefined,
                className,
                containerStyle
            )}
            ref={containerRef}
            style={style}
        >
            <div
                className={cx.call(undefined, gridStyle, renderWindow && isShowScrollBarsX && scrollPositionHintStyle)}
                ref={divGridRef}
                {...restProps}
            >
                <WindowContent
                    renderWindow={isShowScrollBarsX ? renderWindow : undefined}
                    prepareScroll={prepareColumnScroll}
                    rememberScroll={rememberColumnScroll}
                >
                    {content}
                </WindowContent>
            </div>
            {
                isShowScrollBarsX ? (
                    <ScrollBar
                        currentScrollPositionLeft={effectiveScrollPositionLeft}
                        currentScrollPositionTop={effectiveScrollPositionTop}
                        totalWidth={totalWidth}
                        totalHeight={totalHeight}
                        viewportWidth={viewportWidth}
                        viewportHeight={viewportHeight}
                        direction="x"
                        onScroll={(move) => {
                            scrollToLeft(move);
                        }}
                    />
                ) : null
            }

            {
                isShowScrollBarsY ? (
                    <ScrollBar
                        currentScrollPositionLeft={effectiveScrollPositionLeft}
                        currentScrollPositionTop={effectiveScrollPositionTop}
                        totalWidth={totalWidth}
                        totalHeight={totalHeight}
                        viewportWidth={viewportWidth}
                        viewportHeight={viewportHeight}
                        direction="y"
                        onScroll={(move) => {
                            scrollToTop(move);
                        }}
                    />
                ) : null
            }
        </div>
    );
};

export default Virtual;
