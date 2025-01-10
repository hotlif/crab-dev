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

	const getGridColumnsRangeIndex = (): [number, number] => {
		let start = 0;
		let end = 0;
		let currentWidth = 0;

		gridTemplateColumns.some((width, index) => {
			if (
				currentScrollPositionLeft >= currentWidth &&
				currentScrollPositionLeft <= currentWidth + width
			) {
				currentWidth += width;
				start = index;
				return false;
			} else if (
				(
					currentWidth >= currentScrollPositionLeft &&
					currentWidth + width >= currentScrollPositionLeft + viewportWidth
				) || 
				index === gridTemplateColumns.length - 1
			) {
				currentWidth += width;
				end = index;
				return true;
			} else {
				currentWidth += width;
				return false;
			}
		});
		return [start, end];
	};


	const getGridRowsRangeIndex = (): [number, number] => {
		let start = 0;
		let end = 0;
		let currentHeight = 0;
		const exist = gridTemplateRows.some((height, index) => {
			if (
				currentScrollPositionTop >= currentHeight &&
				currentScrollPositionTop <= currentHeight + height
			) {
				currentHeight = currentHeight + height;
				start = index;
				return false;
			} else if (
				(
					currentHeight >= currentScrollPositionTop &&
					currentHeight + height >= currentScrollPositionTop + viewportHeight
				) || 
				index === gridTemplateRows.length - 1
			) {
				currentHeight = currentHeight + height;
				end = index;
				return true;
			} else {
				currentHeight = currentHeight + height;
				return false;
			}
		});

		if (!exist) {
			end = gridTemplateRows.length - 1;
		}
		return [start, end];
	};

	return {
		rowRange: getGridRowsRangeIndex(),
		columnRange: getGridColumnsRangeIndex()
	};
};

export default useVirtualItemRange;
