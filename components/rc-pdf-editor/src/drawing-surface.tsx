import { useEffect, useRef, useState, type PointerEvent, type ReactNode } from 'react';
import type { ViewportState } from '@crab-dev/rc-canvas';
import type { Drawing, PageInfo, Point, ShapeStyle } from './protocol.js';
import { constrainedPoint, drawable, isShapeTool, type EditorTool } from './drawing.js';
import { stageStyle } from './styles.js';

interface Gesture { pointer: number; target: HTMLDivElement; drawing: Drawing; viewport: ViewportState }
interface DrawingSurfaceProps {
    tool: EditorTool; style: ShapeStyle; disabled: boolean; page: PageInfo; revision: number;
    viewport: ViewportState; width: number; height: number;
    children: (drawing?: Drawing) => ReactNode; onDraw: (drawing: Drawing) => void;
}

export default function DrawingSurface({ tool, style, disabled, page, revision, viewport, width, height, children, onDraw }: DrawingSurfaceProps) {
    const [drawing, setDrawing] = useState<Drawing>();
    // 可变实例状态：一笔绘制的采样点、指针捕获和开始时的视口，仅由事件读取/更新。
    const gesture = useRef<Gesture | undefined>(undefined);
    function release() {
        const active = gesture.current; gesture.current = undefined;
        if (active?.target.hasPointerCapture(active.pointer)) active.target.releasePointerCapture(active.pointer);
    }
    useEffect(() => {
        setDrawing(undefined);
        return release;
    }, [tool, disabled, page.index, revision]);

    function point(event: PointerEvent<HTMLDivElement>, view = viewport): Point {
        const box = event.currentTarget.getBoundingClientRect();
        return { x: ((event.clientX - box.left) * width / Math.max(1, box.width) - view.panX) / view.zoom,
            y: ((event.clientY - box.top) * height / Math.max(1, box.height) - view.panY) / view.zoom };
    }
    function update(event: PointerEvent<HTMLDivElement>) {
        const active = gesture.current;
        if (!active || active.pointer !== event.pointerId) return;
        const value = active.drawing;
        const next = constrainedPoint(value.shape, value.points[0], point(event, active.viewport), event.shiftKey, page);
        if (value.shape === 'freehand') {
            const previous = value.points[value.points.length - 1];
            if (value.points.length < 4096 && Math.hypot(next.x - previous.x, next.y - previous.y) >= 0.25) value.points.push(next);
        } else value.points[1] = next;
        setDrawing({ ...value, points: [...value.points] });
    }
    return <div className={stageStyle} data-tool={disabled ? 'select' : tool} aria-label="绘图区域" tabIndex={-1}
        onPointerDownCapture={event => {
            if (disabled || !isShapeTool(tool) || event.button !== 0 || gesture.current) return;
            event.preventDefault(); event.stopPropagation();
            const start = point(event);
            if (start.x < 0 || start.y < 0 || start.x > page.width || start.y > page.height) return;
            const value: Drawing = { shape: tool, points: [start, start], style: { ...style, stroke: [...style.stroke], fill: style.fill ? [...style.fill] : null } };
            if (tool === 'freehand') value.points = [start];
            gesture.current = { pointer: event.pointerId, target: event.currentTarget, drawing: value, viewport: { ...viewport } };
            event.currentTarget.focus(); event.currentTarget.setPointerCapture(event.pointerId); setDrawing({ ...value, points: [...value.points] });
        }}
        onPointerMoveCapture={event => { if (gesture.current) { event.stopPropagation(); update(event); } }}
        onPointerUpCapture={event => {
            if (!gesture.current || gesture.current.pointer !== event.pointerId) return;
            event.stopPropagation(); update(event);
            const value = gesture.current.drawing;
            release(); setDrawing(undefined);
            if (!disabled && drawable(value)) onDraw({ ...value, points: [...value.points] });
        }}
        onPointerCancelCapture={event => { if (gesture.current?.pointer === event.pointerId) { release(); setDrawing(undefined); } }}
        onLostPointerCapture={() => { if (gesture.current) { release(); setDrawing(undefined); } }}
        onKeyDownCapture={event => { if (event.key === 'Escape') { release(); setDrawing(undefined); } }}
        onWheelCapture={event => { if (gesture.current) event.stopPropagation(); }}>
        {children(drawing)}
    </div>;
}
