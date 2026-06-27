/** 统一的对外 Props 类型导出 */
import type { PointerHitEvent, DragStartEvent, DragMoveEvent, DragEndEvent } from './drag-types.js';

/** All canvas node primitives share these base props. */
export interface CanvasNodeProps {
    opacity?: number;
    zIndex?: number;
}

/** Interactive canvas nodes additionally expose pointer/drag events. */
export interface CanvasInteractiveProps extends CanvasNodeProps {
    draggable?: boolean;
    cursor?: string;
    onClick?: (e: PointerHitEvent) => void;
    onMouseEnter?: (e: PointerHitEvent) => void;
    onMouseLeave?: (e: PointerHitEvent) => void;
    onDragStart?: (e: DragStartEvent) => void;
    onDrag?: (e: DragMoveEvent) => void;
    onDragEnd?: (e: DragEndEvent) => void;
}

export type { CanvasProps } from './canvas.js';
export type { RectProps } from './shapes/rect.js';
export type { CircleProps } from './shapes/circle.js';
export type { LineProps } from './shapes/line.js';
export type { ImageProps } from './shapes/image.js';
export type { TextProps } from './shapes/text.js';
export type { GroupProps } from './shapes/group.js';
export type { CanvasPointerEvent, PointerHitEvent, DragStartEvent, DragMoveEvent, DragEndEvent } from './drag-types.js';
export type { TransformerProps, TransformState } from './shapes/transformer.js';
export type { EdgeProps } from './shapes/edge.js';
export type { MinimapProps } from './shapes/minimap.js';
