import { type RefObject, useEffect, useRef, type MouseEvent } from "react";
import { css, cx } from "@linaria/core";

import {
    containerStyle,
    thumbStyle,
    xContainerStyle,
    xThumbStyle,
    yContainerStyle,
    yThumbStyle
} from "./style/scrollbar.style";

interface ScrollbarInstantiate {
	
	/**
	 * 是否超出边界
	 */
	isOutOfBounds: (left: number, top: number) => [boolean, boolean],

	/**
	 * 获取末端坐标
	 */
	getEndCoordinate: () => number
}

export const useScrollbar = () => {
    const scrollbar = useRef<ScrollbarInstantiate| null>(null);
    return [scrollbar];
};

interface ScrollBarProps {

	scrollbar?: RefObject<ScrollbarInstantiate | null>

	/**
	 * 窗口宽度
	 */
	viewportWidth: number

	/**
	 * 窗口高度
	 */
	viewportHeight: number

	/**
	 * 当前滚动估计左边的位置
	 */
	currentScrollPositionLeft: number

	/**
	 * 当前滚动距离顶部的位置
	 */
	currentScrollPositionTop: number

	/**
	 * 总宽度
	 */
	totalWidth: number

	/**
	 * 总高度
	 */
	totalHeight: number

	/**
	 * 滚动条的方向
	 */
	direction: "x" | "y"

	/**
	 * 滚动触发的事件
	 */
	onScroll?: (coordinate: number) => void 
}

const ScrollBar = ({
    currentScrollPositionLeft,
    currentScrollPositionTop,
    viewportWidth,
    viewportHeight,
    totalWidth,
    totalHeight,
    direction,
    scrollbar,
    onScroll
}: ScrollBarProps) => {

    const min = 20;

    const isDragStart = useRef<boolean>(false);
    const divRef = useRef<HTMLDivElement>(null);

    const thumbWidthTemp = ((viewportWidth / totalWidth) * viewportWidth);
    const thumbWidth = thumbWidthTemp < min ? min : thumbWidthTemp;
    const xScrollableDistance = totalWidth - viewportWidth;
    const xTrackDistance = viewportWidth - thumbWidth;
    const thumbLeft = xScrollableDistance <= 0 || xTrackDistance <= 0
        ? 0
        : (currentScrollPositionLeft / xScrollableDistance) * xTrackDistance;
    const getEndCoordinateX = (x: number) => {
        if (xScrollableDistance <= 0 || xTrackDistance <= 0) {
            return 0;
        }
        return (x * xScrollableDistance) / xTrackDistance;
    };

    const thumbHeightTemp = (viewportHeight / totalHeight) * viewportHeight;
    const thumbHeight = thumbHeightTemp < min ? min : thumbHeightTemp;
    const yScrollableDistance = totalHeight - viewportHeight;
    const yTrackDistance = viewportHeight - thumbHeight;
    const thumbTop = yScrollableDistance <= 0 || yTrackDistance <= 0
        ? 0
        : (currentScrollPositionTop / yScrollableDistance) * yTrackDistance;
    const getEndCoordinateY = (y: number) => {
        if (yScrollableDistance <= 0 || yTrackDistance <= 0) {
            return 0;
        }
        return (y * yScrollableDistance) / yTrackDistance;
    };

    const thumbMousePointer = useRef<number>(0);
	
    useEffect(() => {
        const onMouseUp = (_e: globalThis.MouseEvent) => {
            isDragStart.current = false;
        };
        document.addEventListener("mouseup" , onMouseUp);

        const onMouseMove = (e: globalThis.MouseEvent) => {
            if (!isDragStart.current) {
                return;
            }
            const {
                left,
                top
            }  = divRef.current!.getBoundingClientRect();
            if (direction === "x") {
                const leftDistance = e.clientX - left;
                const endCoordinateX = getEndCoordinateX(leftDistance - thumbMousePointer.current);
                if (leftDistance - thumbMousePointer.current <= 0) {
                    onScroll?.(0);
                } else if (leftDistance + thumbWidth - thumbMousePointer.current >= viewportWidth) {
                    onScroll?.(getEndCoordinateX(viewportWidth - thumbWidth));
                } else {
                    onScroll?.(endCoordinateX);
                }
            } else {
                const topDistance = e.clientY - top;
                const endCoordinateY = getEndCoordinateY(topDistance - thumbMousePointer.current);
                if (topDistance - thumbMousePointer.current <= 0) {
                    onScroll?.(0);
                } else if (topDistance + thumbHeight - thumbMousePointer.current >= viewportHeight) {
                    onScroll?.(getEndCoordinateY(viewportHeight - thumbHeight));
                } else {
                    onScroll?.(endCoordinateY);
                }
            }
        };
        document.addEventListener("mousemove", onMouseMove);
        return () => {
            document.removeEventListener("mouseup", onMouseUp);
            document.removeEventListener("mousemove", onMouseMove);
        };
    }, [
        direction,
        onScroll,
        thumbHeight,
        thumbWidth,
        viewportHeight,
        totalHeight,
        viewportWidth,
        totalWidth,
    ]);

    useEffect(() => {
        return () => {
            if (scrollbar) {
                scrollbar.current = null;
            }
        };
    }, [scrollbar]);

    const onMouseDown = (e: MouseEvent<HTMLDivElement, globalThis.MouseEvent>) => {
        if (e.button === 0) {
            isDragStart.current = true;
            const {
                left,
                top
            } = e.currentTarget.getBoundingClientRect();
			
            if (direction === "x") {
                thumbMousePointer.current = e.clientX - left;
            } else {
                thumbMousePointer.current = e.clientY - top;
            }
        }
    };

    if (direction === "x") {
        if (scrollbar) {
            scrollbar.current = {
                isOutOfBounds: (left, _top) => {
                    const thumbLeft = (left / (totalWidth - viewportWidth)) * (viewportWidth - thumbWidth);
                    return [thumbLeft <= 0, thumbLeft + thumbWidth >= viewportWidth];
                },
                getEndCoordinate: () => getEndCoordinateX(viewportWidth - thumbWidth)
            };
        }

        return (
            <div
                className={cx(containerStyle, xContainerStyle)}
                ref={divRef}
            >
                <div
                    style={{
                        width: thumbWidth,
                        left: thumbLeft,
                    }}
                    onMouseDown={onMouseDown}
                    className={cx(thumbStyle, xThumbStyle)}
                />
            </div>
        );
    } else {
        if (scrollbar) {
            scrollbar.current = {
                isOutOfBounds: (_left, top) => {
                    const thumbTop = (top / (totalHeight - viewportHeight)) * (viewportHeight - thumbHeight);
                    return [thumbTop <= 0, thumbTop + thumbHeight >= viewportHeight];
                },
                getEndCoordinate: () => getEndCoordinateY(viewportHeight - thumbHeight)
            };
        }

        return (
            <div
                className={cx(containerStyle, yContainerStyle)}
                ref={divRef}
            >
                <div
                    className={cx(thumbStyle, yThumbStyle)}
                    style={{
                        height: thumbHeight,
                        top: thumbTop
                    }}
                    onMouseDown={onMouseDown}
                />
            </div>
        );
    }
};

export default ScrollBar;
