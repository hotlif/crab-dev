import {
	type HTMLAttributes,
	type FC,
	useEffect,
	useRef,
	useState,
	ReactNode,
	useLayoutEffect,
	RefObject,
	useImperativeHandle,
} from "react";
import { css, cx } from "@linaria/core";

import {
	containerStyle,
	gridStyle
} from "./style/grid.style";


import useVirtualItemRange from "./hooks/useVirtualItemRange";
import ScrollBar, { useScrollbar } from "./scrollbar";
import { getTemplateStyle } from "./util";


export interface VirtualHandle {
	scrollToCell: (position: {
		rowIndex?: number,
		columnIndex?: number
	}) => void;

	getScrollCellPosition: () => {
		rowIndex: number,
		columnIndex: number
	};
}

export interface VirtualProps extends Omit<HTMLAttributes<HTMLDivElement>, "children"> {
	gridTemplateColumns: number[]
	gridTemplateRows: number[]
	viewportWidth: number,
	viewportHeight: number,
	renderRows: (rowRange: [number, number], columnRange: [number, number]) => ReactNode,
	gridRef?: RefObject<VirtualHandle | null>
}

/**
 * 根据 CSS 的 Grid 规范, 限制行和列的值区间在 [-10000, 10000] 
 * see https://drafts.csswg.org/css-grid/#overlarge-grids
 */
const Virtual: FC<VirtualProps> = ({
	className,
	style,
	gridTemplateColumns,
	gridTemplateRows,
	renderRows,
	viewportWidth,
	viewportHeight,
	gridRef,
	...restProps
}) => {
	const [currentScrollPositionTop, setCurrentScrollPositionTop] = useState<number>(0);
	const [currentScrollPositionLeft, setCurrentScrollPositionLeft] = useState<number>(0);
	const [leftScrollbar] = useScrollbar();
	const [topScrollbar] = useScrollbar();

	const divGridRef = useRef<HTMLDivElement>(null);

	let {
		columnRange,
		rowRange
	} = useVirtualItemRange({
		viewportHeight,
		viewportWidth,
		currentScrollPositionTop,
		currentScrollPositionLeft,
		gridTemplateColumns,
		gridTemplateRows,
	});

	const totalWidth = gridTemplateColumns.reduce((accumulator, currentValue) => accumulator + currentValue, 0);
	const totalHeight = gridTemplateRows.reduce((accumulator, currentValue) => accumulator + currentValue, 0);

	useLayoutEffect(() => {
		if (divGridRef.current) {
			divGridRef.current.scrollTop = currentScrollPositionTop;
			divGridRef.current.scrollLeft = currentScrollPositionLeft;
		}
	}, [currentScrollPositionTop, currentScrollPositionLeft]);

	const isShowScrollBarsY = totalHeight > viewportHeight;
	const isShowScrollBarsX = totalWidth > viewportWidth;

	if (!isShowScrollBarsY) {
		rowRange = [0, gridTemplateRows.length - 1];
	}

	if (!isShowScrollBarsX) {
		columnRange = [0, gridTemplateColumns.length - 1];
	}

	const scrollToLeft = (left: number) => {
		setCurrentScrollPositionLeft(left);
	};

	const scrollToTop = (top: number) => {
		setCurrentScrollPositionTop(top);
	};

	useImperativeHandle(gridRef, () => ({
		scrollToCell: (position) => {
			if (position.rowIndex != null) {
				let toTop = 0;
				if (position.rowIndex <= 0) {
					scrollToTop(0);
				} else {
					gridTemplateRows.some((width, index) => {
						if (index === position.rowIndex) {
							return true;
						}
						toTop += width;
						return false;
					});
					if (toTop + viewportHeight < totalHeight) {
						scrollToTop(toTop);
					} else {
						scrollToTop(totalHeight - viewportHeight);
					}
				}
			}
			if (position.columnIndex != null) {
				let toLeft = 0;
				if (position.columnIndex <= 0) {
					scrollToLeft(0);
				} else {
					gridTemplateColumns.some((height, index) => {
						if (index === position.columnIndex) {
							return true;
						}
						toLeft += height;
						return false;
					});
					
					if (toLeft + viewportWidth < totalWidth) {
						scrollToLeft(toLeft);
					} else {
						scrollToLeft(totalWidth - viewportWidth);
					}
				}
			}
		},
		getScrollCellPosition: () => {
			let leftCount = 0;
			let leftIndex = 0;
			gridTemplateColumns.some((element, index) => {
				leftCount += element;
				if (leftCount > currentScrollPositionLeft) {
					leftIndex = index;
					return true;
				}
				return false;
			});

			let topCount = 0;
			let topIndex = 0;
			gridTemplateRows.some((element, index) => {
				topCount += element;
				if (topCount > currentScrollPositionTop) {
					topIndex = index;
					return true;
				}
				return false;
			});
			return {
				columnIndex: leftIndex,
				rowIndex: topIndex
			};
		}
	}));

	useEffect(() => {
		if (divGridRef.current) {
			const onWheel = (e: globalThis.WheelEvent) => {
				e.preventDefault();
				const currentTarget = e.currentTarget as HTMLDivElement;
				const {
					scrollLeft,
					scrollTop
				} = currentTarget;

				let newScrollLeft = scrollLeft;
				let newScrollTop = scrollTop;
				const distance = 30;

				if (e.shiftKey) {
					// 左右滚动
					if (e.deltaY > 0) {
						newScrollLeft += distance;
					} else if (e.deltaY < 0) {
						newScrollLeft -= distance;
					}
				} else {
					// 上下滚动
					if (e.deltaY > 0) {
						newScrollTop += distance;
					} else if (e.deltaY < 0) {
						newScrollTop -= distance;
					}
				}

				const topOutOfBounds = topScrollbar.current?.isOutOfBounds(newScrollLeft, newScrollTop);
				const top = topOutOfBounds?.[0];
				const bottom = topOutOfBounds?.[1];

				const leftOutOfBounds = leftScrollbar.current?.isOutOfBounds(newScrollLeft, newScrollTop);
				const left = leftOutOfBounds?.[0];
				const right = leftOutOfBounds?.[1];

				if (e.shiftKey && left) {
					newScrollLeft = 0;
				}
				if (!e.shiftKey && top) {
					newScrollTop = 0;
				}
				if (bottom) {
					newScrollTop = topScrollbar.current!.getEndCoordinate();
				}
				if (right) {
					newScrollLeft = leftScrollbar.current!.getEndCoordinate();
				}
				scrollToLeft(newScrollLeft);
				scrollToTop(newScrollTop);
			};
			divGridRef.current.addEventListener("wheel", onWheel, {
				passive: false
			});
			return () => {
				divGridRef.current?.removeEventListener("wheel", onWheel);
			};
		}
	}, []);

	return (
		<div
			className={cx(
				className,
				css`
					${containerStyle}	
				`
			)}
			style={{
				...style,
				...{
					width: viewportWidth,
					height: viewportHeight
				}
			}}
		>
			<div
				className={css`
					${gridStyle}	
				`}
				style={{
					width: viewportWidth,
					height: viewportHeight,
					gridTemplateColumns: getTemplateStyle(gridTemplateColumns),
					gridTemplateRows: getTemplateStyle(gridTemplateRows)
				}}
				ref={divGridRef}
				{...restProps}
			>
				{renderRows(rowRange, columnRange)}
			</div>
			{
				isShowScrollBarsX ? (
					<ScrollBar
						currentScrollPositionLeft={currentScrollPositionLeft}
						currentScrollPositionTop={currentScrollPositionTop}
						totalWidth={totalWidth}
						totalHeight={totalHeight}
						viewportWidth={viewportWidth}
						viewportHeight={viewportHeight}
						direction="x"
						scrollbar={leftScrollbar}
						onScroll={(move) => {
							scrollToLeft(move);
						}}
					/>
				) : null
			}

			{
				isShowScrollBarsY ? (
					<ScrollBar
						currentScrollPositionLeft={currentScrollPositionLeft}
						currentScrollPositionTop={currentScrollPositionTop}
						totalWidth={totalWidth}
						totalHeight={totalHeight}
						viewportWidth={viewportWidth}
						viewportHeight={viewportHeight}
						direction="y"
						scrollbar={topScrollbar}
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
