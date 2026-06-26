import { use, useEffect, useRef } from 'react';
import { CanvasContext } from '../context/canvas-context.js';
import { parseColor } from '../math/color.js';
import type { ColorRGBA } from '../math/color.js';
import { invertMat3, applyMat3 } from '../math/matrix.js';
import type { CanvasInteractiveProps } from '../types.js';

/** 细线 hit-test 额外容差（px），避免细线几乎无法点击 */
const HIT_TOLERANCE = 8;

/** 点到线段 (x1,y1)→(x2,y2) 的距离 */
function pointToSegmentDist(
    px: number, py: number,
    x1: number, y1: number,
    x2: number, y2: number,
): number {
    const dx = x2 - x1;
    const dy = y2 - y1;
    const lenSq = dx * dx + dy * dy;
    if (lenSq === 0) {
        const ex = px - x1;
        const ey = py - y1;
        return Math.sqrt(ex * ex + ey * ey);
    }
    const t = Math.max(0, Math.min(1, ((px - x1) * dx + (py - y1) * dy) / lenSq));
    const nearX = x1 + t * dx;
    const nearY = y1 + t * dy;
    const ex = px - nearX;
    const ey = py - nearY;
    return Math.sqrt(ex * ex + ey * ey);
}

export interface LineProps extends CanvasInteractiveProps {
    x1: number;
    y1: number;
    x2: number;
    y2: number;
    color?: string;
    lineWidth?: number;
    /** 虚线实线段长度（world px）；不设置或 0 为实线 */
    dashLength?: number;
    /** 虚线空隙长度（world px）；dashLength > 0 时生效 */
    gapLength?: number;
}

function Line({
    x1,
    y1,
    x2,
    y2,
    color = '#000000',
    lineWidth = 1,
    opacity = 1,
    dashLength,
    gapLength,
    zIndex = 0,
    draggable = false,
    cursor,
    onMouseEnter,
    onMouseLeave,
    onClick,
    onDragStart,
    onDrag,
    onDragEnd,
}: LineProps) {
    const ctx = use(CanvasContext);
    // 可变实例状态 ref：持有注册 id，跨渲染不触发 rerender
    const cmdIdRef = useRef<number | null>(null);
    // 可变实例状态 ref：实时持有 worldMatrix，供 containsPoint 闭包读取
    const worldMatrixRef = useRef<Float32Array>(ctx.parentMatrix);
    worldMatrixRef.current = ctx.parentMatrix;

    const buildCmd = () => {
        const parsedColor = parseColor(color);
        const appliedColor: ColorRGBA =
            opacity !== 1
                ? [parsedColor[0], parsedColor[1], parsedColor[2], parsedColor[3] * opacity]
                : parsedColor;
        return {
            kind: 'line' as const,
            x1, y1, x2, y2,
            color: appliedColor,
            lineWidth,
            dashLength,
            gapLength,
            worldMatrix: ctx.parentMatrix,
            zIndexPath: [...ctx.parentZIndexPath, zIndex],
        };
    };

    const buildHitEntry = () => ({
        zIndexPath: [...ctx.parentZIndexPath, zIndex],
        parentMatrix: ctx.parentMatrix,
        containsPoint: (canvasX: number, canvasY: number): boolean => {
            const inv = invertMat3(worldMatrixRef.current);
            if (!inv) return false;
            const [lx, ly] = applyMat3(inv, canvasX, canvasY);
            const dist = pointToSegmentDist(lx, ly, x1, y1, x2, y2);
            return dist <= lineWidth / 2 + HIT_TOLERANCE;
        },
        cursor,
        onClick,
        onMouseEnter,
        onMouseLeave,
        onDragStart,
        onDrag,
        onDragEnd,
    });

    const needsHit = draggable || !!onMouseEnter || !!onMouseLeave || !!onClick || !!cursor;

    useEffect(() => {
        const id = ctx.register(buildCmd());
        cmdIdRef.current = id;
        if (needsHit) ctx.registerHit(id, buildHitEntry());
        return () => {
            ctx.unregister(id);
            if (needsHit) ctx.unregisterHit(id);
            cmdIdRef.current = null;
        };
    }, []);

    useEffect(() => {
        if (cmdIdRef.current === null) return;
        ctx.update(cmdIdRef.current, buildCmd());
        if (needsHit) ctx.updateHit(cmdIdRef.current, buildHitEntry());
    });

    return null;
}

export default Line;
