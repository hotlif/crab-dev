import { useMemo } from "react";

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
	gridTemplateColumns: number[]

	/**
	 * 定义网格列的高度信息
	 */
	gridTemplateRows: number[]

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
    sizes: number[]
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

export const createVirtualAxisMetrics = (sizes: number[]): VirtualAxisMetrics => {
    const normalizedSizes = new Array<number>(sizes.length);
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
        normalizedSizes[index] = normalizedSize;
        accumulator += normalizedSize;
        cumulativeEnds[index] = accumulator;
    }

    return {
        sizes: normalizedSizes,
        cumulativeEnds,
        totalSize: accumulator,
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
    if (metrics.sizes.length === 0) {
        return [0, 0];
    }

    const normalizedViewportSize = clampToNonNegativeFinite(viewportSize);
    const normalizedScrollPosition = clampToNonNegativeFinite(scrollPosition);
    const normalizedOverscanCount = Math.floor(clampToNonNegativeFinite(overscanCount));
    const maxIndex = metrics.sizes.length - 1;

    let start: number;
    let end: number;
    if (metrics.uniformSize != null && metrics.uniformSize > 0) {
        start = Math.floor(normalizedScrollPosition / metrics.uniformSize);
        end = Math.max(
            start,
            Math.ceil((normalizedScrollPosition + normalizedViewportSize) / metrics.uniformSize) - 1
        );
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
    if (index <= 0 || metrics.cumulativeEnds.length === 0) {
        return 0;
    }
    return metrics.cumulativeEnds[Math.min(index, metrics.cumulativeEnds.length) - 1] ?? 0;
};

export const getVirtualItemEnd = (metrics: VirtualAxisMetrics, index: number) => {
    if (index < 0 || metrics.cumulativeEnds.length === 0) {
        return 0;
    }
    return metrics.cumulativeEnds[Math.min(index, metrics.cumulativeEnds.length - 1)] ?? metrics.totalSize;
};

export const getVirtualItemIndex = (metrics: VirtualAxisMetrics, scrollPosition: number) => {
    if (metrics.sizes.length === 0) {
        return 0;
    }

    const index = metrics.uniformSize != null && metrics.uniformSize > 0
        ? Math.floor(clampToNonNegativeFinite(scrollPosition) / metrics.uniformSize)
        : upperBound(metrics.cumulativeEnds, scrollPosition);
    // 保持既有 API 语义：若坐标超过末项，回退到第 0 项。
    return index < metrics.sizes.length ? index : 0;
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
    // 例外 3（编译器无法静态推断的稳定性）：前缀和是昂贵派生数据，且必须跨内部滚动渲染保持引用稳定。
    const columnMetrics = useMemo(
        () => createVirtualAxisMetrics(gridTemplateColumns),
        [gridTemplateColumns]
    );
    // 例外 3（编译器无法静态推断的稳定性）：同上，避免每次滚动重新遍历全部行。
    const rowMetrics = useMemo(
        () => createVirtualAxisMetrics(gridTemplateRows),
        [gridTemplateRows]
    );

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
