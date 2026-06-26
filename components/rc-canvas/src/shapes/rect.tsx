import { use, useEffect, useRef } from 'react';
import { CanvasContext } from '../context/canvas-context.js';
import { parseColor } from '../math/color.js';
import type { ColorRGBA } from '../math/color.js';
import { invertMat3, applyMat3, computeRectAABB } from '../math/matrix.js';
import type { CanvasInteractiveProps } from '../types.js';

export interface RectProps extends CanvasInteractiveProps {
    x: number;
    y: number;
    width: number;
    height: number;
    fill?: string;
    stroke?: string;
    strokeWidth?: number;
    /** 圆角半径（px），> 0 时启用 SDF 着色器 */
    radius?: number;
    /** 虚线实段长度（world px）；不设置或 0 为实线 */
    dashLength?: number;
    /** 虚线空隙长度（world px）；dashLength > 0 时生效 */
    gapLength?: number;
}

function Rect({
    x,
    y,
    width,
    height,
    fill = 'transparent',
    stroke = 'transparent',
    strokeWidth = 0,
    radius = 0,
    dashLength,
    gapLength,
    opacity = 1,
    zIndex = 0,
    draggable = false,
    cursor,
    onClick,
    onMouseEnter,
    onMouseLeave,
    onDragStart,
    onDrag,
    onDragEnd,
}: RectProps) {
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
        const appliedStroke: ColorRGBA =
            opacity !== 1
                ? [strokeColor[0], strokeColor[1], strokeColor[2], strokeColor[3] * opacity]
                : strokeColor;
        const base = {
            worldMatrix: ctx.parentMatrix,
            zIndexPath: [...ctx.parentZIndexPath, zIndex],
            fill: appliedFill,
            stroke: appliedStroke,
            strokeWidth,
            x, y, width, height,
            aabb: computeRectAABB(x, y, width, height, ctx.parentMatrix),
        };
        return radius > 0
            ? { kind: 'sdf-rect' as const, radius, ...base }
            : { kind: 'flat-rect' as const, dashLength, gapLength, ...base };
    };

    const buildHitEntry = () => ({
        zIndexPath: [...ctx.parentZIndexPath, zIndex],
        parentMatrix: ctx.parentMatrix,
        containsPoint: (cx: number, cy: number): boolean => {
            const inv = invertMat3(worldMatrixRef.current);
            if (!inv) return false;
            const [lx, ly] = applyMat3(inv, cx, cy);
            return lx >= x && lx <= x + width && ly >= y && ly <= y + height;
        },
        cursor,
        onClick,
        onMouseEnter,
        onMouseLeave,
        onDragStart,
        onDrag,
        onDragEnd,
    });

    const needsHit = draggable || !!onClick || !!onMouseEnter || !!onMouseLeave || !!cursor;

    // mount 时注册，unmount 时注销（needsHit 视为静态配置）
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

    // props 变化时更新 DrawCommand 和 hit entry
    useEffect(() => {
        if (cmdIdRef.current === null) return;
        ctx.update(cmdIdRef.current, buildCmd());
        if (needsHit) ctx.updateHit(cmdIdRef.current, buildHitEntry());
    });

    return null;
}

export default Rect;
