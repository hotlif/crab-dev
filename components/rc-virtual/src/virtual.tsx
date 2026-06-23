import {
    type CSSProperties,
    type HTMLAttributes,
    type FC,
    type ReactNode,
    type RefObject,
    useEffect,
    useRef,
    useState,
    useLayoutEffect,
    useImperativeHandle,
} from "react";
import { cx } from "@linaria/core";

import {
    containerStyle,
    gridStyle
} from "./style/grid.style";

import useVirtualItemRange from "./hooks/useVirtualItemRange.js";
import ScrollBar, { useScrollbar } from "./scrollbar.js";


export interface VirtualHandle {
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
	/** 每列的宽度数组，单位为 px */
	gridTemplateColumns: number[]
	/** 每行的高度数组，单位为 px */
	gridTemplateRows: number[]
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
	/** 渲染回调，根据当前可见的行列范围返回对应的 ReactNode */
	renderRows: (rowRange: [number, number], columnRange: [number, number]) => ReactNode,
	/** 组件实例引用，可通过 scrollToCell 和 getScrollCellPosition 编程式控制滚动 */
	gridRef?: RefObject<VirtualHandle | null>
}

const Virtual: FC<VirtualProps> = ({
    className,
    style,
    gridTemplateColumns,
    gridTemplateRows,
    renderRows,
    viewportWidth,
    viewportHeight,
    reservedTopHeight = 0,
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
    // 计入顶部常驻内容（如固定表头）高度：它在滚动容器内占位但不属于行，
    // 否则当行总高略小于可视高度、却被表头挤出可视区时，末尾内容无法滚动到底。
    const totalHeight = gridTemplateRows.reduce((accumulator, currentValue) => accumulator + currentValue, 0) + reservedTopHeight;

    useLayoutEffect(() => {
        /* istanbul ignore else -- ref is always populated after mount */
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
                const topOffset = position.topOffset ?? 0;
                // toTop：目标行在数据行坐标系中的偏移（不含 sticky header）
                // 实际内容坐标 = topOffset + toTop
                let toTop = 0;
                for (let i = 0; i < position.rowIndex; i++) toTop += gridTemplateRows[i] ?? 0;
                const rowH = gridTemplateRows[position.rowIndex] ?? 0;

                // 仅当行完全不在可视区时才滚动（部分可见则不滚动）：
                //   内容坐标 = topOffset + toTop（行顶）~ topOffset + toTop + rowH（行底）
                //   可视数据区：[scrollTop + topOffset, scrollTop + viewportHeight]
                if (toTop + rowH <= currentScrollPositionTop) {
                    // 行完全在可视区上方：向上滚，使行顶贴着 header 底部
                    scrollToTop(Math.max(0, toTop));
                } else if (toTop >= currentScrollPositionTop + viewportHeight - topOffset) {
                    // 行完全在可视区下方：向下滚最小距离，使行底刚好贴视口底部
                    scrollToTop(Math.max(0, Math.min(topOffset + toTop + rowH - viewportHeight, totalHeight - viewportHeight)));
                }
                // 否则行（部分或完全）在可视区内，不滚动
            }
            if (position.columnIndex != null) {
                const leftOffset = position.leftOffset ?? 0;
                // 计算目标列的像素起止位置
                let toLeft = 0;
                for (let i = 0; i < position.columnIndex; i++) toLeft += gridTemplateColumns[i] ?? 0;
                const colW = gridTemplateColumns[position.columnIndex] ?? 0;

                // 当前可视内容区（扣除固定左列）
                const visibleLeft = currentScrollPositionLeft + leftOffset;
                const visibleRight = currentScrollPositionLeft + viewportWidth;

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
        /* istanbul ignore else -- ref is always populated after mount */
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


    const calculateTopPaddingHeight = () => {
        return gridTemplateRows.slice(0, rowRange[0]).reduce((accumulator, currentValue) => accumulator + currentValue, 0);
    }

    const calculateBottomPaddingHeight = () => {
        return gridTemplateRows.slice(rowRange[1] + 1, gridTemplateRows.length).reduce((accumulator, currentValue) => accumulator + currentValue, 0);
    }

    const calculateLeftPaddingWidth = () => {
        return gridTemplateColumns.slice(0, columnRange[0]).reduce((accumulator, currentValue) => accumulator + currentValue, 0);
    }

    const calculateRightPaddingWidth = () => {
        return gridTemplateColumns.slice(columnRange[1] + 1, gridTemplateColumns.length).reduce((accumulator, currentValue) => accumulator + currentValue, 0);
    }

    return (
        <div
            className={cx(
                className,
                containerStyle
            )}
            style={{
                ...style,
                ...{
                    width: viewportWidth,
                    height: viewportHeight,
                    "--crab-rc-virtual-top-padding-height": `${calculateTopPaddingHeight()}px`,
                    "--crab-rc-virtual-bottom-padding-height": `${calculateBottomPaddingHeight()}px`,
                    "--crab-rc-virtual-left-padding-width": `${calculateLeftPaddingWidth()}px`,
                    "--crab-rc-virtual-right-padding-width": `${calculateRightPaddingWidth()}px`,
                }
            } as CSSProperties}
        >
            <div
                className={cx(gridStyle)}
                style={{
                    width: viewportWidth,
                    height: viewportHeight,
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
