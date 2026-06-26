import Line from './line.js';
import Marker from './marker.js';
import type { CanvasInteractiveProps } from './types.js';

export interface EdgeProps extends CanvasInteractiveProps {
    x1: number;
    y1: number;
    x2: number;
    y2: number;
    color?: string;
    lineWidth?: number;
    /** 虚线实段长度（world px）；不设置或 0 为实线 */
    dashLength?: number;
    /** 虚线空隙长度（world px）；dashLength > 0 时生效 */
    gapLength?: number;
    /** 起点箭头，默认 false */
    arrowStart?: boolean;
    /** 终点箭头，默认 true */
    arrowEnd?: boolean;
    /** 箭头大小（px），默认 10 */
    arrowSize?: number;
}

function Edge({
    x1,
    y1,
    x2,
    y2,
    color = '#000000',
    lineWidth = 1.5,
    opacity = 1,
    dashLength,
    gapLength,
    arrowStart = false,
    arrowEnd = true,
    arrowSize = 10,
    zIndex = 0,
    draggable = false,
    cursor,
    onClick,
    onMouseEnter,
    onMouseLeave,
    onDragStart,
    onDrag,
    onDragEnd,
}: EdgeProps) {
    const dx = x2 - x1;
    const dy = y2 - y1;
    const len = Math.sqrt(dx * dx + dy * dy);
    const angle = len > 0 ? Math.atan2(dy, dx) : 0;

    // 线段端点向内缩进，避免线段末端穿过箭头三角形
    // 缩进量取 arrowSize * 0.9，留少量重叠消除接缝
    const shrink = arrowSize * 0.9;
    const cos = len > 0 ? dx / len : 0;
    const sin = len > 0 ? dy / len : 0;

    const lineX1 = arrowStart && len > shrink * 2 ? x1 + shrink * cos : x1;
    const lineY1 = arrowStart && len > shrink * 2 ? y1 + shrink * sin : y1;
    const lineX2 = arrowEnd && len > shrink * 2 ? x2 - shrink * cos : x2;
    const lineY2 = arrowEnd && len > shrink * 2 ? y2 - shrink * sin : y2;

    return (
        <>
            <Line
                x1={lineX1}
                y1={lineY1}
                x2={lineX2}
                y2={lineY2}
                color={color}
                lineWidth={lineWidth}
                opacity={opacity}
                dashLength={dashLength}
                gapLength={gapLength}
                zIndex={zIndex}
                draggable={draggable}
                cursor={cursor}
                onClick={onClick}
                onMouseEnter={onMouseEnter}
                onMouseLeave={onMouseLeave}
                onDragStart={onDragStart}
                onDrag={onDrag}
                onDragEnd={onDragEnd}
            />
            {arrowEnd && len > 0 && (
                <Marker
                    x={x2}
                    y={y2}
                    angle={angle}
                    size={arrowSize}
                    fill={color}
                    opacity={opacity}
                    zIndex={zIndex}
                />
            )}
            {arrowStart && len > 0 && (
                <Marker
                    x={x1}
                    y={y1}
                    angle={angle + Math.PI}
                    size={arrowSize}
                    fill={color}
                    opacity={opacity}
                    zIndex={zIndex}
                />
            )}
        </>
    );
}

export default Edge;
