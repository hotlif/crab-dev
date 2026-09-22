import { useEffect, useRef, useState, type PointerEvent } from 'react';
import type { DocumentLayout } from './document-layout.js';
import type { PdfPageRegion } from './types.js';
import { regionsInRectangle } from './regions.js';
import { pageDragStatusStyle, regionOverlayStyle, regionOutlineStyle } from './styles.js';

interface Point { x: number; y: number }
interface Selection { start: Point; end: Point }
export interface RegionSelectorProps {
    layout: DocumentLayout;
    scroll: { left: number; top: number };
    width: number;
    height: number;
    onComplete: (regions: readonly PdfPageRegion[]) => void;
    onCancel: () => void;
    onReveal: (point: Point) => void;
}

export default function RegionSelector({ layout, scroll, width, height, onComplete, onCancel, onReveal }: RegionSelectorProps) {
    const [selection, setSelection] = useState<Selection>();
    // 可变实例状态：焦点与指针捕获只在事件/effect 中读写。
    const root = useRef<HTMLDivElement>(null);
    const gesture = useRef<{ pointer: number; target: HTMLDivElement; start: Point } | undefined>(undefined);
    const release = () => {
        const active = gesture.current; gesture.current = undefined;
        if (active?.target.hasPointerCapture(active.pointer)) active.target.releasePointerCapture(active.pointer);
    };
    useEffect(() => { root.current?.focus(); return release; }, []);
    // 视口缩放/布局变化后重画选区，滚动保持同一文档坐标系。
    useEffect(() => { release(); setSelection(undefined); }, [layout.zoom, layout.width, layout.height]);
    const clamp = (point: Point): Point => ({ x: Math.max(0, Math.min(layout.width, point.x)), y: Math.max(0, Math.min(layout.height, point.y)) });
    const point = (event: PointerEvent<HTMLDivElement>): Point => {
        const box = event.currentTarget.getBoundingClientRect();
        return clamp({ x: (event.clientX - box.left) * width / Math.max(1, box.width) + scroll.left,
            y: (event.clientY - box.top) * height / Math.max(1, box.height) + scroll.top });
    };
    const parts = selection ? regionsInRectangle(layout, selection.start, selection.end) : [];
    const complete = (value: Selection) => {
        const regions = regionsInRectangle(layout, value.start, value.end);
        if (regions.length && regions.every(region => region.width >= 1 && region.height >= 1)) onComplete(regions);
    };
    return <div ref={root} className={regionOverlayStyle} role="region" aria-label="PDF 区域选择" data-region-selector tabIndex={0}
        aria-description="拖动框选，可跨页；滚轮翻页。方向键移动起点，Shift 加方向键扩展选区，Enter 完成，Escape 取消。"
        onPointerDown={event => {
            if (event.button !== 0 || gesture.current) return;
            event.preventDefault(); event.stopPropagation();
            const start = point(event); gesture.current = { pointer: event.pointerId, target: event.currentTarget, start };
            event.currentTarget.focus(); event.currentTarget.setPointerCapture(event.pointerId); setSelection({ start, end: start });
        }}
        onPointerMove={event => {
            if (gesture.current?.pointer !== event.pointerId) return;
            event.preventDefault(); event.stopPropagation(); setSelection({ start: gesture.current.start, end: point(event) });
        }}
        onPointerUp={event => {
            if (gesture.current?.pointer !== event.pointerId) return;
            event.preventDefault(); event.stopPropagation();
            const next = { start: gesture.current.start, end: point(event) };
            release(); setSelection(next); complete(next);
        }}
        onPointerCancel={() => { release(); setSelection(undefined); }}
        onLostPointerCapture={() => { if (gesture.current) { release(); setSelection(undefined); } }}
        onKeyDown={event => {
            if (event.nativeEvent.isComposing) return;
            if (event.key === 'Escape') { event.preventDefault(); event.stopPropagation(); onCancel(); return; }
            if (event.key === 'Enter') { event.preventDefault(); event.stopPropagation(); if (selection) complete(selection); return; }
            const moves: Record<string, Point> = { ArrowLeft: { x: -1, y: 0 }, ArrowRight: { x: 1, y: 0 }, ArrowUp: { x: 0, y: -1 }, ArrowDown: { x: 0, y: 1 } };
            const move = moves[event.key];
            if (!move) return;
            event.preventDefault(); event.stopPropagation();
            const step = (event.ctrlKey || event.metaKey ? 1 : 10) * layout.zoom;
            const initial = selection ?? { start: { x: scroll.left + width / 2, y: scroll.top + height / 2 }, end: { x: scroll.left + width / 2, y: scroll.top + height / 2 } };
            const origin = event.shiftKey ? initial.end : initial.start;
            const next = clamp({ x: origin.x + move.x * step, y: origin.y + move.y * step });
            setSelection({ start: event.shiftKey ? initial.start : next, end: next }); onReveal(next);
        }}>
        <svg width="100%" height="100%" viewBox={`0 0 ${Math.max(1, width)} ${Math.max(1, height)}`} aria-hidden="true" focusable="false">
            {parts.map(region => {
                const page = layout.pages[region.pageIndex];
                return <rect key={region.pageIndex} className={regionOutlineStyle}
                    x={page.x + region.x * layout.zoom - scroll.left} y={page.y + region.y * layout.zoom - scroll.top}
                    width={region.width * layout.zoom} height={region.height * layout.zoom} />;
            })}
        </svg>
        <span className={pageDragStatusStyle} role="status">{parts.length ? `选区覆盖 ${parts.length} 页` : '拖动或使用键盘选择区域'}</span>
    </div>;
}
