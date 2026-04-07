import {
    type CSSProperties,
    type HTMLAttributes,
    type FC,
    type ReactNode,
    type RefObject,
    useEffect,
    useRef,
    useState,
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
		columnIndex?: number
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
    gridRef,
    ...restProps
}) => {
    const [currentScrollPositionTop, setCurrentScrollPositionTop] = useState<number>(0);
    const [currentScrollPositionLeft, setCurrentScrollPositionLeft] = useState<number>(0);
    const [leftScrollbar] = useScrollbar();
    const [topScrollbar] = useScrollbar();

    const divGridRef = useRef<HTMLDivElement>(null);
    const scrollPositionRef = useRef({ top: 0, left: 0 });

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

    const isShowScrollBarsY = totalHeight > viewportHeight;
    const isShowScrollBarsX = totalWidth > viewportWidth;

    if (!isShowScrollBarsY) {
        rowRange = [0, gridTemplateRows.length - 1];
    }

    if (!isShowScrollBarsX) {
        columnRange = [0, gridTemplateColumns.length - 1];
    }

    const scrollToLeft = (left: number) => {
        scrollPositionRef.current.left = left;
        setCurrentScrollPositionLeft(left);
    };

    const scrollToTop = (top: number) => {
        scrollPositionRef.current.top = top;
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
                let newScrollLeft = scrollPositionRef.current.left;
                let newScrollTop = scrollPositionRef.current.top;
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
