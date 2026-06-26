import { use, useEffect, useRef } from 'react';
import { CanvasContext } from './context/canvas-context.js';
import { parseColor } from './math/color.js';
import type { ColorRGBA } from './math/color.js';
import { invertMat3, applyMat3, computeCircleAABB } from './math/matrix.js';
import type { DragStartEvent, DragMoveEvent, DragEndEvent } from './drag-types.js';

export interface CircleProps {
    /** 圆心 x（px） */
    cx: number;
    /** 圆心 y（px） */
    cy: number;
    /** 半径（px） */
    r: number;
    fill?: string;
    stroke?: string;
    strokeWidth?: number;
    opacity?: number;
    zIndex?: number;
    draggable?: boolean;
    /** hover 时的 CSS cursor */
    cursor?: string;
    /** 点击时触发（移动 < 4px），提供即注册 hit-test */
    onClick?: () => void;
    onDragStart?: (e: DragStartEvent) => void;
    onDrag?: (e: DragMoveEvent) => void;
    onDragEnd?: (e: DragEndEvent) => void;
}

function Circle({
    cx,
    cy,
    r,
    fill = 'transparent',
    stroke = 'transparent',
    strokeWidth = 0,
    opacity = 1,
    zIndex = 0,
    draggable = false,
    cursor,
    onClick,
    onDragStart,
    onDrag,
    onDragEnd,
}: CircleProps) {
    const ctx = use(CanvasContext);
    // 可变实例状态 ref：持有注册 id，跨渲染不触发 rerender
    const cmdIdRef = useRef<number | null>(null);
    // 可变实例状态 ref：实时持有 worldMatrix，供 containsPoint 闭包读取
    const worldMatrixRef = useRef<Float32Array>(ctx.parentMatrix);
    worldMatrixRef.current = ctx.parentMatrix;

    const buildCmd = () => {
        const fillColor = parseColor(fill);
        const strokeColor = parseColor(stroke);
        const appliedFill: ColorRGBA =
            opacity !== 1
                ? [fillColor[0], fillColor[1], fillColor[2], fillColor[3] * opacity]
                : fillColor;
        return {
            kind: 'sdf-circle' as const,
            cx, cy, r,
            fill: appliedFill,
            stroke: strokeColor,
            strokeWidth,
            worldMatrix: ctx.parentMatrix,
            zIndexPath: [...ctx.parentZIndexPath, zIndex],
            aabb: computeCircleAABB(cx, cy, r, ctx.parentMatrix),
        };
    };

    const buildHitEntry = () => ({
        zIndexPath: [...ctx.parentZIndexPath, zIndex],
        parentMatrix: ctx.parentMatrix,
        containsPoint: (canvasX: number, canvasY: number): boolean => {
            const inv = invertMat3(worldMatrixRef.current);
            if (!inv) return false;
            const [lx, ly] = applyMat3(inv, canvasX, canvasY);
            const dx = lx - cx;
            const dy = ly - cy;
            return dx * dx + dy * dy <= r * r;
        },
        cursor,
        onClick,
        onDragStart,
        onDrag,
        onDragEnd,
    });

    // mount 时注册，unmount 时注销（draggable/onClick 视为静态配置）
    useEffect(() => {
        const id = ctx.register(buildCmd());
        cmdIdRef.current = id;
        if (draggable || onClick) ctx.registerHit(id, buildHitEntry());
        return () => {
            ctx.unregister(id);
            if (draggable || onClick) ctx.unregisterHit(id);
            cmdIdRef.current = null;
        };
    }, []);

    // props 变化时更新
    useEffect(() => {
        if (cmdIdRef.current === null) return;
        ctx.update(cmdIdRef.current, buildCmd());
        if (draggable || onClick) ctx.updateHit(cmdIdRef.current, buildHitEntry());
    });

    return null;
}

export default Circle;
