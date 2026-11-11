import { CanvasOverlay, Group, Rect, Text } from '@crab-dev/rc-canvas';
import type { DragMoveEvent, TextProps } from '@crab-dev/rc-canvas';
import { use, type ReactNode } from 'react';
import { css } from '@crab-dev/css';
import Button from '@crab-dev/rc-button';
import Tooltip from '@crab-dev/rc-tooltip';
import { FlowDiagramPaletteContext } from './palette-context.js';

const readableLabelStyle = css`
    position: absolute;
    transform: translate(-50%, -50%);
    overflow: hidden;
    text-overflow: ellipsis;
    text-align: center;
    pointer-events: none;
`;
const detailsStyle = css`white-space: pre-line; overflow-wrap: anywhere;`;

export interface FlowNodeReadability {
    /** Minimum CSS-pixel label size, default 10. */
    minFontSize?: number;
    /** Short label used below the minimum size (for example model name + field count). */
    compactLabel?: string;
    /** Model/name + count at overview scale; defaults to compactLabel. */
    overviewLabel?: string;
    /** Screen font size below which overviewLabel is used, default 7. */
    overviewBelow?: number;
    /** Full, non-interactive details shown on hover/focus. Defaults to label. */
    details?: ReactNode;
    /** Accessible name for the details button. Defaults to the complete label. */
    detailsLabel?: string;
}

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
    /** 字体，与 HTML 节点使用同一字体配置可减少外观差异。 */
    fontFamily?: string;
    fontWeight?: string | number;
    lineHeight?: number;
    /** 默认 auto：常规字号按当前缩放与 DPR 绘制清晰位图。 */
    textMode?: TextProps['mode'];
    /** Opt-in DOM label and focusable details, above WebGL; excluded from PNG export. */
    readability?: FlowNodeReadability;
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
    fontFamily,
    fontWeight,
    lineHeight,
    textMode = 'auto',
    readability,
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
                draggable={draggable}
                cursor={draggable ? (cursor ?? 'grab') : cursor}
                onClick={onClick}
                onDragStart={onDragStart}
                onDrag={({ localDx, localDy }: DragMoveEvent) => onDrag?.(localDx, localDy)}
                onDragEnd={onDragEnd}
            />
            {label && (readability ? (
                <CanvasOverlay x={width / 2} y={height / 2} zIndex={zIndex}>
                    {({ scale }) => {
                        const minimum = Number.isFinite(readability.minFontSize)
                            ? Math.max(1, readability.minFontSize ?? 10) : 10;
                        const screenSize = fontSize * scale;
                        const compact = screenSize < minimum;
                        const overviewThreshold = Number.isFinite(readability.overviewBelow)
                            ? Math.max(0, Math.min(minimum, readability.overviewBelow ?? 7)) : Math.min(minimum, 7);
                        const overview = screenSize < overviewThreshold;
                        const shortLabel = readability.compactLabel ?? label.split('\n')[0];
                        const visibleLabel = overview ? readability.overviewLabel ?? shortLabel : compact ? shortLabel : label;
                        return <>
                            <span aria-hidden="true" data-detail-level={overview ? 'overview' : compact ? 'compact' : 'full'} className={readableLabelStyle} style={{
                                width: Math.max(1, (width - strokeWidth * 2) * scale),
                                maxHeight: Math.max(minimum * 1.4, (height - strokeWidth * 2) * scale),
                                fontSize: Math.max(minimum, fontSize * scale), fontFamily: fontFamily ?? 'system-ui', fontWeight: fontWeight ?? 'normal',
                                lineHeight: lineHeight === undefined ? 1.4 : `${lineHeight * Math.max(minimum / fontSize, scale)}px`,
                                whiteSpace: compact ? 'nowrap' : 'pre-line', color: labelColor,
                            }}>{visibleLabel}</span>
                            <div style={{ position: 'absolute', left: width * scale / 2, top: -12, pointerEvents: 'auto' }}>
                                <Tooltip title={<div className={detailsStyle}>{readability.details ?? label}</div>} placement="right">
                                    <Button size="xs" shape="circle" appearance="outlined"
                                        aria-label={readability.detailsLabel ?? label} onClick={onClick}>ⓘ</Button>
                                </Tooltip>
                            </div>
                        </>;
                    }}
                </CanvasOverlay>
            ) : (
                <Text
                    x={width / 2}
                    y={height / 2}
                    fontSize={fontSize}
                    fontFamily={fontFamily}
                    fontWeight={fontWeight}
                    lineHeight={lineHeight}
                    mode={textMode}
                    maxWidth={Math.max(1, width - strokeWidth * 2)}
                    fill={labelColor}
                    textAlign="center"
                    textBaseline="middle"
                >
                    {label}
                </Text>
            ))}
        </Group>
    );
}

export default FlowNode;
