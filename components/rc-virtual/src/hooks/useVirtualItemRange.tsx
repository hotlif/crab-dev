import { useMemo } from "react";
import type { VirtualAxis } from "../types.js";

interface VirtualItemParamType {

    /**
     * 可视窗口高度
     */
    viewportHeight: number,

    /**
     * 可视窗口宽度
     */
    viewportWidth: number,

    /**
     * 当前滚动估计左边的位置
     */
    currentScrollPositionLeft: number

    /**
     * 当前滚动距离顶部的位置
     */
    currentScrollPositionTop: number

    /**'
     * 定义网格列的宽度信息
     */
    gridTemplateColumns: VirtualAxis

    /**
     * 定义网格列的高度信息
     */
    gridTemplateRows: VirtualAxis

    /** 滚动容器内、不属于数据行的顶部常驻内容高度 */
    reservedTopHeight?: number

    /** 滚动容器内、不属于数据行的底部常驻内容高度 */
    reservedBottomHeight?: number

    /** 可视范围上下额外渲染的行数 */
    overscanRowCount?: number

    /** 可视范围左右额外渲染的列数 */
    overscanColumnCount?: number

}

export interface VirtualAxisMetrics {
    count: number
    cumulativeEnds: number[]
    totalSize: number
    uniformSize: number | null
}

const clampToNonNegativeFinite = (value: number) => {
    if (!Number.isFinite(value)) {
        return 0;
    }
    return Math.max(0, value);
};

const clampScrollPosition = (
    scrollPosition: number,
    totalSize: number,
    viewportSize: number
) => {
    const normalizedScrollPosition = clampToNonNegativeFinite(scrollPosition);
    const normalizedTotalSize = clampToNonNegativeFinite(totalSize);
    const normalizedViewportSize = clampToNonNegativeFinite(viewportSize);
    const maxScrollPosition = Math.max(0, normalizedTotalSize - normalizedViewportSize);

    return Math.min(normalizedScrollPosition, maxScrollPosition);
};

export const createVirtualAxisMetrics = (sizes: VirtualAxis): VirtualAxisMetrics => {
    if (!Array.isArray(sizes)) {
        const count = Math.min(Number.MAX_SAFE_INTEGER, Math.floor(clampToNonNegativeFinite(sizes.count)));
        const uniformSize = clampToNonNegativeFinite(sizes.itemSize);
        return { count, uniformSize, totalSize: count * uniformSize, cumulativeEnds: [] };
    }
    const cumulativeEnds = new Array<number>(sizes.length);
    let accumulator = 0;
    let uniformSize: number | null = null;
    let isUniform = sizes.length > 0;

    for (let index = 0; index < sizes.length; index += 1) {
        const size = sizes[index];
        const normalizedSize = Number.isFinite(size) && size >= 0 ? size : 0;
        if (index === 0) {
            uniformSize = normalizedSize;
        } else if (normalizedSize !== uniformSize) {
            isUniform = false;
        }
        accumulator += normalizedSize;
        cumulativeEnds[index] = accumulator;
    }

    return {
        count: sizes.length,
        cumulativeEnds: isUniform ? [] : cumulativeEnds,
        totalSize: isUniform ? sizes.length * (uniformSize ?? 0) : accumulator,
        uniformSize: isUniform ? uniformSize : null
    };
};

const lowerBound = (sortedArray: number[], target: number) => {
    let left = 0;
    let right = sortedArray.length;

    while (left < right) {
        const middle = (left + right) >>> 1;
        if (sortedArray[middle] >= target) {
            right = middle;
        } else {
            left = middle + 1;
        }
    }

    return left;
};

const upperBound = (sortedArray: number[], target: number) => {
    let left = 0;
    let right = sortedArray.length;

    while (left < right) {
        const middle = (left + right) >>> 1;
        if (sortedArray[middle] > target) {
            right = middle;
        } else {
            left = middle + 1;
        }
    }

    return left;
};

const getVisibleRangeByBinarySearch = (
    metrics: VirtualAxisMetrics,
    viewportSize: number,
    scrollPosition: number,
    overscanCount: number
): [number, number] => {
    if (metrics.count === 0) {
        return [0, 0];
    }

    const normalizedViewportSize = clampToNonNegativeFinite(viewportSize);
    const normalizedScrollPosition = clampToNonNegativeFinite(scrollPosition);
    const normalizedOverscanCount = Math.floor(clampToNonNegativeFinite(overscanCount));
    const maxIndex = metrics.count - 1;

    let start: number;
    let end: number;
    if (metrics.uniformSize != null && metrics.uniformSize > 0) {
        start = Math.floor(normalizedScrollPosition / metrics.uniformSize);
        end = Math.max(
            start,
            Math.ceil((normalizedScrollPosition + normalizedViewportSize) / metrics.uniformSize) - 1
        );
    } else if (metrics.uniformSize === 0) {
        start = maxIndex;
        end = maxIndex;
    } else {
        start = upperBound(metrics.cumulativeEnds, normalizedScrollPosition);
        end = lowerBound(metrics.cumulativeEnds, normalizedScrollPosition + normalizedViewportSize);
    }

    if (start > maxIndex) {
        start = maxIndex;
    }

    if (end > maxIndex) {
        end = maxIndex;
    }

    if (end < start) {
        end = start;
    }

    return [
        Math.max(0, start - normalizedOverscanCount),
        Math.min(maxIndex, end + normalizedOverscanCount)
    ];
};

export const getVirtualItemStart = (metrics: VirtualAxisMetrics, index: number) => {
    if (index <= 0 || metrics.count === 0) {
        return 0;
    }
    if (metrics.uniformSize != null) {
        return Math.min(index, metrics.count) * metrics.uniformSize;
    }
    return metrics.cumulativeEnds[Math.min(index, metrics.cumulativeEnds.length) - 1] ?? 0;
};

export const getVirtualItemEnd = (metrics: VirtualAxisMetrics, index: number) => {
    if (index < 0 || metrics.count === 0) {
        return 0;
    }
    if (metrics.uniformSize != null) {
        return Math.min(index + 1, metrics.count) * metrics.uniformSize;
    }
    return metrics.cumulativeEnds[Math.min(index, metrics.cumulativeEnds.length - 1)] ?? metrics.totalSize;
};

export const getVirtualItemIndex = (metrics: VirtualAxisMetrics, scrollPosition: number) => {
    if (metrics.count === 0) {
        return 0;
    }

    const index = metrics.uniformSize != null && metrics.uniformSize > 0
        ? Math.floor(clampToNonNegativeFinite(scrollPosition) / metrics.uniformSize)
        : upperBound(metrics.cumulativeEnds, scrollPosition);
    // 保持既有 API 语义：若坐标超过末项，回退到第 0 项。
    return index < metrics.count ? index : 0;
};

export const getVirtualItemSize = (metrics: VirtualAxisMetrics, index: number) => {
    if (!Number.isInteger(index) || index < 0 || index >= metrics.count) {
        return 0;
    }
    return metrics.uniformSize ?? getVirtualItemEnd(metrics, index) - getVirtualItemStart(metrics, index);
};

const useAxisMetrics = (template: VirtualAxis) => {
    "use no memo";
    const sizes = Array.isArray(template) ? template : null;
    const count = Array.isArray(template) ? 0 : template.count;
    const itemSize = Array.isArray(template) ? 0 : template.itemSize;
    // 例外 3：前缀和是昂贵派生数据；固定尺寸按数值缓存，避免内联配置对象导致重建。
    return useMemo(() => createVirtualAxisMetrics(sizes ?? { count, itemSize }), [sizes, count, itemSize]);
};

/**
 * 获取当前虚拟滚动的可见数据的范围
 *
 * 尺寸指标仅在模板数组引用变化时重建；滚动位置变化时仅执行二分查找。
 */
const useVirtualItemRange = ({
    viewportHeight,
    viewportWidth,
    currentScrollPositionTop,
    currentScrollPositionLeft,
    gridTemplateColumns,
    gridTemplateRows,
    reservedTopHeight = 0,
    reservedBottomHeight = 0,
    overscanRowCount = 0,
    overscanColumnCount = 0,
}: VirtualItemParamType) => {
    "use no memo";
    const columnMetrics = useAxisMetrics(gridTemplateColumns);
    const rowMetrics = useAxisMetrics(gridTemplateRows);

    const effectiveScrollPositionLeft = clampScrollPosition(
        currentScrollPositionLeft,
        columnMetrics.totalSize,
        viewportWidth
    );
    const effectiveScrollPositionTop = clampScrollPosition(
        currentScrollPositionTop,
        rowMetrics.totalSize
            + clampToNonNegativeFinite(reservedTopHeight)
            + clampToNonNegativeFinite(reservedBottomHeight),
        viewportHeight
    );

    const getGridColumnsRangeIndex = (): [number, number] => {
        return getVisibleRangeByBinarySearch(
            columnMetrics,
            viewportWidth,
            effectiveScrollPositionLeft,
            overscanColumnCount
        );
    };

    const getGridRowsRangeIndex = (): [number, number] => {
        return getVisibleRangeByBinarySearch(
            rowMetrics,
            viewportHeight,
            effectiveScrollPositionTop,
            overscanRowCount
        );
    };

    return {
        rowRange: getGridRowsRangeIndex(),
        columnRange: getGridColumnsRangeIndex(),
        rowMetrics,
        columnMetrics,
        effectiveScrollPositionTop,
        effectiveScrollPositionLeft
    };
};

export default useVirtualItemRange;
