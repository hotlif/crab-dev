import { useEffect, useEffectEvent, useRef, useState, useLayoutEffect, useImperativeHandle, useMemo } from "react";
import type { HTMLAttributes, ReactNode, RefObject } from "react";
import { cx } from "@crab-dev/css";

import { containerStyle, gridStyle } from "./style/grid.style.js";

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
    /** 实际逻辑滚动位置变化，包含滚轮、滚动条、命令式定位及尺寸收缩。 */
    onScrollPositionChange?: (position: { left: number; top: number }) => void;
}

const Virtual = ({
    className,
    style,
    gridTemplateColumns,
    gridTemplateRows,
    renderRows,
    viewportWidth,
    viewportHeight,
    reservedTopHeight = 0,
    reservedBottomHeight = 0,
    overscanRowCount = 0,
    overscanColumnCount = 0,
    gridRef,
    onScrollPositionChange,
    ...restProps
}: VirtualProps) => {
    const [currentScrollPositionTop, setCurrentScrollPositionTop] = useState<number>(0);
    const [currentScrollPositionLeft, setCurrentScrollPositionLeft] = useState<number>(0);

    const divGridRef = useRef<HTMLDivElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    // 可变实例状态 ref（滚动事件帧合并）：在同一动画帧累积高频 wheel 增量，避免每个事件都触发 React 渲染。
    const pendingScrollPositionRef = useRef<{ left: number, top: number } | null>(null);
    // 可变实例状态 ref（动画帧句柄）：用于保证最多只排队一个提交，并在卸载时取消。
    const scrollAnimationFrameRef = useRef<number | null>(null);
    // 可变实例状态（滚动目标）：在 React 提交前累积增量，避免从受浏览器限制的 DOM 坐标反推逻辑位置。
    const logicalScrollRef = useRef({ left: 0, top: 0, maxLeft: 0, maxTop: 0, domLeft: 0, domTop: 0 });

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
    });

    const totalWidth = columnMetrics.totalSize;
    const notifyPosition = useEffectEvent(() => onScrollPositionChange?.({ left: effectiveScrollPositionLeft, top: effectiveScrollPositionTop }));
    useLayoutEffect(() => { notifyPosition(); }, [effectiveScrollPositionLeft, effectiveScrollPositionTop]);
    // 计入顶部 / 底部常驻内容（如固定表头、固定汇总行）高度：它们在滚动容器内占位但不属于行，
    // 否则当行总高略小于可视高度、却被表头挤出可视区时，末尾内容无法滚动到底；
    // 或底部固定汇总行遮挡最后一行数据时，该行无法滚动出来。
    const totalHeight = rowMetrics.totalSize + reservedTopHeight + reservedBottomHeight;

    const rowWindow = getScrollWindow(
        getVirtualItemStart(rowMetrics, rowRange[0]),
        getVirtualItemEnd(rowMetrics, rowRange[1]),
        rowMetrics.totalSize,
        effectiveScrollPositionTop,
    );
    const columnWindow = getScrollWindow(
        getVirtualItemStart(columnMetrics, columnRange[0]),
        getVirtualItemEnd(columnMetrics, columnRange[1]),
        columnMetrics.totalSize,
        effectiveScrollPositionLeft,
    );

    useLayoutEffect(() => {
        const container = containerRef.current;
        const grid = divGridRef.current;
        if (!container || !grid) return;
        // 运行时几何通过 DOM 写入；Crab CSS 仍只处理静态样式。
        container.style.width = `${viewportWidth}px`;
        container.style.height = `${viewportHeight}px`;
        grid.style.width = `${viewportWidth}px`;
        grid.style.height = `${viewportHeight}px`;
        container.style.setProperty("--crab-rc-virtual-top-padding-height", `${rowWindow.paddingStart}px`);
        container.style.setProperty("--crab-rc-virtual-bottom-padding-height", `${rowWindow.paddingEnd}px`);
        container.style.setProperty("--crab-rc-virtual-left-padding-width", `${columnWindow.paddingStart}px`);
        container.style.setProperty("--crab-rc-virtual-right-padding-width", `${columnWindow.paddingEnd}px`);
    }, [viewportWidth, viewportHeight, rowWindow.paddingStart, rowWindow.paddingEnd, columnWindow.paddingStart, columnWindow.paddingEnd, style]);

    useLayoutEffect(() => {
        logicalScrollRef.current = {
            left: effectiveScrollPositionLeft,
            top: effectiveScrollPositionTop,
            maxLeft: Math.max(0, totalWidth - viewportWidth),
            maxTop: Math.max(0, totalHeight - viewportHeight),
            domLeft: 0,
            domTop: 0,
        };
        if (currentScrollPositionTop !== effectiveScrollPositionTop) {
            setCurrentScrollPositionTop(effectiveScrollPositionTop);
        }
        if (currentScrollPositionLeft !== effectiveScrollPositionLeft) {
            setCurrentScrollPositionLeft(effectiveScrollPositionLeft);
        }

        /* istanbul ignore else -- ref is always populated after mount */
        if (divGridRef.current) {
            if (divGridRef.current.scrollTop !== rowWindow.position) {
                divGridRef.current.scrollTop = rowWindow.position;
            }
            if (divGridRef.current.scrollLeft !== columnWindow.position) {
                divGridRef.current.scrollLeft = columnWindow.position;
            }
            logicalScrollRef.current.domLeft = divGridRef.current.scrollLeft;
            logicalScrollRef.current.domTop = divGridRef.current.scrollTop;
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
        rowWindow.position,
        columnWindow.position,
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
        () => renderRows([rowStart, rowEnd], [columnStart, columnEnd]),
        [renderRows, rowStart, rowEnd, columnStart, columnEnd, rowMetrics, columnMetrics, viewportWidth, viewportHeight, reservedTopHeight, reservedBottomHeight],
    );

    const scrollToLeft = (left: number) => {
        pendingScrollPositionRef.current = null;
        logicalScrollRef.current.left = Math.max(0, Math.min(left, logicalScrollRef.current.maxLeft));
        setCurrentScrollPositionLeft(left);
    };

    const scrollToTop = (top: number) => {
        pendingScrollPositionRef.current = null;
        logicalScrollRef.current.top = Math.max(0, Math.min(top, logicalScrollRef.current.maxTop));
        setCurrentScrollPositionTop(top);
    };

    useImperativeHandle(gridRef, () => ({
        scrollTo: ({ left, top }) => {
            if (left !== undefined && Number.isFinite(left)) scrollToLeft(left);
            if (top !== undefined && Number.isFinite(top)) scrollToTop(top);
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
            const commitPendingScrollPosition = () => {
                scrollAnimationFrameRef.current = null;
                const pendingPosition = pendingScrollPositionRef.current;
                pendingScrollPositionRef.current = null;
                const grid = divGridRef.current;
                if (!pendingPosition || !grid) {
                    return;
                }

                logicalScrollRef.current.left = pendingPosition.left;
                logicalScrollRef.current.top = pendingPosition.top;
                logicalScrollRef.current.domLeft = grid.scrollLeft;
                logicalScrollRef.current.domTop = grid.scrollTop;
                setCurrentScrollPositionLeft(pendingPosition.left);
                setCurrentScrollPositionTop(pendingPosition.top);
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
                e.preventDefault();
                const currentTarget = e.currentTarget as HTMLDivElement;
                const pendingPosition = pendingScrollPositionRef.current;
                const logicalPosition = logicalScrollRef.current;
                // 聚焦等原生行为可能移动局部滚动容器；只合并相对位移，不将 DOM 坐标当作全量逻辑位置。
                const baseLeft = pendingPosition?.left ?? logicalPosition.left + currentTarget.scrollLeft - logicalPosition.domLeft;
                const baseTop = pendingPosition?.top ?? logicalPosition.top + currentTarget.scrollTop - logicalPosition.domTop;
                let newScrollLeft = baseLeft;
                let newScrollTop = baseTop;
                const normalizedDeltaX = normalizeWheelDelta(e.deltaX, e.deltaMode, currentTarget.clientWidth);
                const normalizedDeltaY = normalizeWheelDelta(e.deltaY, e.deltaMode, currentTarget.clientHeight);
                const horizontalDelta = e.shiftKey && normalizedDeltaX === 0
                    ? normalizedDeltaY
                    : normalizedDeltaX;
                const verticalDelta = e.shiftKey ? 0 : normalizedDeltaY;

                newScrollLeft += horizontalDelta;
                newScrollTop += verticalDelta;

                newScrollLeft = Math.max(0, Math.min(newScrollLeft, logicalPosition.maxLeft));
                newScrollTop = Math.max(0, Math.min(newScrollTop, logicalPosition.maxTop));
                if (
                    newScrollLeft === baseLeft
                    && newScrollTop === baseTop
                ) {
                    return;
                }

                pendingScrollPositionRef.current = {
                    left: newScrollLeft,
                    top: newScrollTop
                };
                schedulePendingScrollPosition();
            };
            grid.addEventListener("wheel", onWheel, {
                passive: false
            });
            return () => {
                // StrictMode 清理 effect 前可能已清空 ref，必须从绑定时的节点移除监听。
                grid.removeEventListener("wheel", onWheel);
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
                className={cx.call(undefined, gridStyle)}
                ref={divGridRef}
                {...restProps}
            >
                {content}
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
