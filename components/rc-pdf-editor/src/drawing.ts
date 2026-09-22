import type { Bounds, Drawing, Point, ShapeKind, ShapeStyle } from './protocol.js';

export type EditorTool = 'select' | 'pan' | ShapeKind;
export const SHAPE_LABELS: Record<ShapeKind, string> = { rectangle: '矩形边框', ellipse: '圆形/椭圆', line: '直线', arrow: '箭头', freehand: '自由手绘' };
export const DEFAULT_SHAPE_STYLE: ShapeStyle = { stroke: [0, 0, 0, 255], strokeWidth: 2, fill: null, dashed: false };
export function isShapeTool(tool: EditorTool): tool is ShapeKind { return tool !== 'select' && tool !== 'pan'; }
export function isShapeKind(value: string): value is ShapeKind { return Object.hasOwn(SHAPE_LABELS, value); }
export function canFill(shape: ShapeKind): boolean { return shape === 'rectangle' || shape === 'ellipse'; }
export function drawingBounds(points: Point[]): Bounds {
    const x = Math.min(...points.map(point => point.x)), y = Math.min(...points.map(point => point.y));
    return { x, y, width: Math.max(...points.map(point => point.x)) - x, height: Math.max(...points.map(point => point.y)) - y };
}

/** Shift 约束正方形/正圆和 45° 倍数的直线；边界裁切保持拖拽方向。 */
export function constrainedPoint(shape: ShapeKind, start: Point, end: Point, shift: boolean, page: { width: number; height: number }): Point {
    let dx = end.x - start.x, dy = end.y - start.y;
    if (shift && shape !== 'freehand') {
        if (canFill(shape)) {
            const side = Math.max(Math.abs(dx), Math.abs(dy));
            dx = (dx < 0 ? -1 : 1) * side; dy = (dy < 0 ? -1 : 1) * side;
        } else {
            const angle = Math.round(Math.atan2(dy, dx) / (Math.PI / 4)) * Math.PI / 4;
            const distance = Math.hypot(dx, dy);
            dx = Math.cos(angle) * distance; dy = Math.sin(angle) * distance;
        }
    }
    const factor = Math.min(1, dx > 0 ? (page.width - start.x) / dx : dx < 0 ? -start.x / dx : 1,
        dy > 0 ? (page.height - start.y) / dy : dy < 0 ? -start.y / dy : 1);
    return { x: start.x + dx * factor, y: start.y + dy * factor };
}

export function drawable(drawing: Drawing): boolean {
    if (drawing.points.length < 2) return false;
    const bounds = drawingBounds(drawing.points);
    return canFill(drawing.shape) ? bounds.width >= 0.5 && bounds.height >= 0.5 : Math.hypot(bounds.width, bounds.height) >= 0.5;
}

export function arrowWings(start: Point, end: Point, width: number): [Point, Point] {
    const angle = Math.atan2(end.y - start.y, end.x - start.x);
    const length = Math.min(Math.hypot(end.x - start.x, end.y - start.y) / 2, Math.max(8, width * 4));
    return [angle - Math.PI / 6, angle + Math.PI / 6].map(a => ({ x: end.x - Math.cos(a) * length, y: end.y - Math.sin(a) * length })) as [Point, Point];
}
