import { Group, Rect, Text } from '@crab-dev/rc-canvas';
import type { DragMoveEvent } from '@crab-dev/rc-canvas';

export interface FlowNodeProps {
    x: number;
    y: number;
    width: number;
    height: number;
    /** 节点标签文字 */
    label?: string;
    /** 节点背景色，默认 oklch(0.60 0.14 256) */
    fill?: string;
    /** 节点描边色 */
    stroke?: string;
    /** 描边宽度，默认 1 */
    strokeWidth?: number;
    /** 圆角半径，默认 8 */
    radius?: number;
    /** 标签文字颜色，默认 #ffffff */
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
    fill = 'oklch(0.60 0.14 256)',
    stroke,
    strokeWidth = 1,
    radius = 8,
    labelColor = '#ffffff',
    fontSize = 13,
    zIndex = 2,
    draggable = false,
    cursor,
    onClick,
    onDrag,
    onDragStart,
    onDragEnd,
}: FlowNodeProps) {
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
                strokeWidth={stroke ? strokeWidth : undefined}
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
