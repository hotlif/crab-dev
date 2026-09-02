import { Group, Rect, Text } from '@crab-dev/rc-canvas';
import type { DragMoveEvent } from '@crab-dev/rc-canvas';
import { use } from 'react';
import { FlowDiagramPaletteContext } from './palette-context.js';

export interface FlowNodeProps {
    x: number;
    y: number;
    width: number;
    height: number;
    /** 节点标签文字 */
    label?: string;
    /** 节点背景色；缺省取 FlowDiagram palette.nodeFill */
    fill?: string;
    /** 节点描边色 */
    stroke?: string;
    /** 描边宽度，默认 1 */
    strokeWidth?: number;
    /** 圆角半径，默认 8 */
    radius?: number;
    /** 标签文字颜色；缺省取 FlowDiagram palette.nodeLabel */
    labelColor?: string;
    /** 标签字体大小，默认 13 */
    fontSize?: number;
    zIndex?: number;
    draggable?: boolean;
    cursor?: string;
    onClick?: () => void;
    /** 拖拽移动：(dx, dy) 为父坐标系帧增量，可直接加到 x/y 上 */
    onDrag?: (dx: number, dy: number) => void;
    onDragStart?: () => void;
    onDragEnd?: () => void;
}

function FlowNode({
    x, y, width, height,
    label,
    fill: fillProp,
    stroke: strokeProp,
    strokeWidth = 1,
    radius = 8,
    labelColor: labelColorProp,
    fontSize = 13,
    zIndex = 2,
    draggable = false,
    cursor,
    onClick,
    onDrag,
    onDragStart,
    onDragEnd,
}: FlowNodeProps) {
    const palette = use(FlowDiagramPaletteContext);
    const fill = fillProp ?? palette.nodeFill;
    const stroke = strokeProp ?? palette.nodeStroke;
    const labelColor = labelColorProp ?? palette.nodeLabel;

    return (
        <Group
            x={x}
            y={y}
            zIndex={zIndex}
            draggable={draggable}
            hitArea={{ x: 0, y: 0, width, height }}
            cursor={draggable ? (cursor ?? 'grab') : cursor}
            onDragStart={onDragStart}
            onDrag={({ localDx, localDy }: DragMoveEvent) => onDrag?.(localDx, localDy)}
            onDragEnd={onDragEnd}
        >
            <Rect
                x={0}
                y={0}
                width={width}
                height={height}
                fill={fill}
                stroke={stroke}
                strokeWidth={stroke !== 'transparent' ? strokeWidth : undefined}
                radius={radius}
                onClick={onClick}
            />
            {label && (
                <Text
                    x={width / 2}
                    y={height / 2}
                    fontSize={fontSize}
                    fill={labelColor}
                    textAlign="center"
                    textBaseline="middle"
                >
                    {label}
                </Text>
            )}
        </Group>
    );
}

export default FlowNode;
