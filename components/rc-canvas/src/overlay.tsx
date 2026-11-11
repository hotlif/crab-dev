import { use, useEffect, useState, useSyncExternalStore, type ReactNode } from 'react';
import { createPortal } from 'react-dom';
import { ConfigBoundary } from '@crab-dev/rc-config-provider';
import { CanvasContext } from './context/canvas-context.js';
import { applyMat3, multiplyMat3 } from './math/matrix.js';

export interface CanvasOverlayState {
    /** Effective screen scale including the nearest Group transform. */
    scale: number;
}
export interface CanvasOverlayProps {
    /** Anchor in the nearest Group's coordinates. Contents remain in CSS pixels. */
    x: number;
    y: number;
    children: ReactNode | ((state: CanvasOverlayState) => ReactNode);
    zIndex?: number;
}
const noSubscribe = () => () => {};

/** Opt-in DOM layer above WebGL; controls must opt back into pointer events.
 * The overlay follows pan/zoom without raster scaling and is not included in exportPNG. */
export default function CanvasOverlay({ x, y, children, zIndex = 1 }: CanvasOverlayProps) {
    const ctx = use(CanvasContext);
    const [container, setContainer] = useState<HTMLDivElement | null>(null);
    // The ancestor Canvas ref is attached after descendant layout effects.
    useEffect(() => { setContainer(ctx.containerRef.current); }, [ctx.containerRef]);
    const snapshot = useSyncExternalStore(ctx.subscribeView ?? noSubscribe,
        () => [...ctx.viewMatrixRef.current, ctx.canvasSizeRef.current.width, ctx.canvasSizeRef.current.height].join(','),
        () => '1,0,0,0,1,0,0,0,1,0,0');
    const values = snapshot.split(',').map(Number);
    const matrix = multiplyMat3(new Float32Array(values.slice(0, 9)), ctx.parentMatrix);
    const [left, top] = applyMat3(matrix, x, y);
    const scale = Math.min(Math.hypot(matrix[0], matrix[1]), Math.hypot(matrix[3], matrix[4]));
    const visible = Number.isFinite(left) && Number.isFinite(top) && scale > 0
        && left >= 0 && top >= 0 && left <= values[9] && top <= values[10];
    return container ? createPortal(<ConfigBoundary hidden={!visible} style={{
        position: 'absolute', left, top, zIndex, pointerEvents: 'none',
    }}>{visible ? (typeof children === 'function' ? children({ scale }) : children) : null}</ConfigBoundary>, container) : null;
}
