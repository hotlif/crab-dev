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

}

const clampToNonNegativeFinite = (value: number) => {
	if (!Number.isFinite(value)) {
		return 0;
	}
	return Math.max(0, value);
};

const normalizeTemplateSizes = (sizes: number[]) => {
	return sizes.map(size => {
		if (!Number.isFinite(size) || size < 0) {
			return 0;
		}
		return size;
	});
};

const buildCumulativeEnds = (sizes: number[]) => {
	const cumulativeEnds: number[] = [];
	let accumulator = 0;

	sizes.forEach(size => {
		accumulator += size;
		cumulativeEnds.push(accumulator);
	});

	return cumulativeEnds;
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
	sizes: number[],
	viewportSize: number,
	scrollPosition: number
): [number, number] => {
	if (sizes.length === 0) {
		return [0, 0];
	}

	const normalizedViewportSize = clampToNonNegativeFinite(viewportSize);
	const normalizedScrollPosition = clampToNonNegativeFinite(scrollPosition);
	const cumulativeEnds = buildCumulativeEnds(sizes);
	const maxIndex = sizes.length - 1;

	let start = upperBound(cumulativeEnds, normalizedScrollPosition);
	if (start > maxIndex) {
		start = maxIndex;
	}

	let end = lowerBound(cumulativeEnds, normalizedScrollPosition + normalizedViewportSize);
	if (end > maxIndex) {
		end = maxIndex;
	}

	if (end < start) {
		end = start;
	}

	return [start, end];
};

/**
 * 获取当前虚拟滚动的可见数据的范围
 * 
 *  - optimize 目前时间复杂度为 O(n) 需要优化为 O(log2n)
 */
const useVirtualItemRange = ({
	viewportHeight,
	viewportWidth,
	currentScrollPositionTop,
	currentScrollPositionLeft,
	gridTemplateColumns,
	gridTemplateRows,
}: VirtualItemParamType) => {
	const normalizedGridTemplateColumns = normalizeTemplateSizes(gridTemplateColumns);
	const normalizedGridTemplateRows = normalizeTemplateSizes(gridTemplateRows);

	const getGridColumnsRangeIndex = (): [number, number] => {
		return getVisibleRangeByBinarySearch(
			normalizedGridTemplateColumns,
			viewportWidth,
			currentScrollPositionLeft
		);
	};

	const getGridRowsRangeIndex = (): [number, number] => {
		return getVisibleRangeByBinarySearch(
			normalizedGridTemplateRows,
			viewportHeight,
			currentScrollPositionTop
		);
	};

	return {
		rowRange: getGridRowsRangeIndex(),
		columnRange: getGridColumnsRangeIndex()
	};
};

export default useVirtualItemRange;
