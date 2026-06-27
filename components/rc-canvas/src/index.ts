import Canvas from './canvas.js';
import Rect from './shapes/rect.js';
import Circle from './shapes/circle.js';
import Line from './shapes/line.js';
import CanvasImage from './shapes/image.js';
import Text from './shapes/text.js';
import Group from './shapes/group.js';
import Viewport from './viewport.js';
import InfiniteGrid from './shapes/infinite-grid.js';
import Transformer from './shapes/transformer.js';
import Marker from './shapes/marker.js';
import Minimap from './shapes/minimap.js';
import { useCanvasControls } from './hooks/useCanvasControls.js';
import {
    routeOrthogonal, connectThroughWaypoints, withTerminalStubs, routeEdge, routeAvoidingObstacles, assignPorts,
    anchorPoint, nearestSideAnchor, dominantSide, rectCenter, inflateRect,
    segmentIntersectsRect, segmentHitsAny, polylineClearOf, simplifyOrthogonal, isHorizontalSide,
} from './routing/index.js';

export type { CanvasNodeProps, CanvasInteractiveProps, CanvasPointerEvent, PointerHitEvent } from './types.js';
export type { DragMoveEvent, DragStartEvent, DragEndEvent } from './drag-types.js';
export type { CanvasProps } from './canvas.js';
export type { RectProps } from './shapes/rect.js';
export type { CircleProps } from './shapes/circle.js';
export type { LineProps } from './shapes/line.js';
export type { ImageProps } from './shapes/image.js';
export type { TextProps } from './shapes/text.js';
export type { GroupProps } from './shapes/group.js';
export type { ViewportProps, ViewportState } from './viewport.js';
export type { InfiniteGridProps } from './shapes/infinite-grid.js';
export type { TransformerProps, TransformState } from './shapes/transformer.js';
export type { MarkerProps } from './shapes/marker.js';
export type { MinimapProps } from './shapes/minimap.js';
export type { CanvasControls } from './hooks/useCanvasControls.js';
export type { Pt, Rect as RoutingRect, Side, EdgeAnchor, AvoidOptions, RoutableEdge } from './routing/index.js';

export {
    Canvas, Rect, Circle, Line, CanvasImage, Text, Group, Viewport, InfiniteGrid, Transformer, Marker, Minimap,
    useCanvasControls,
    routeOrthogonal, connectThroughWaypoints, withTerminalStubs, routeEdge, routeAvoidingObstacles, assignPorts,
    anchorPoint, nearestSideAnchor, dominantSide, rectCenter, inflateRect,
    segmentIntersectsRect, segmentHitsAny, polylineClearOf, simplifyOrthogonal, isHorizontalSide,
};
export default Canvas;
