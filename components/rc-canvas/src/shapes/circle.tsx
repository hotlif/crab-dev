import { use, useEffect, useRef } from 'react';
import { CanvasContext } from '../context/canvas-context.js';
import { CanvasPaletteContext } from '../context/palette-context.js';
import { parseColor } from '../math/color.js';
import type { ColorRGBA } from '../math/color.js';
import { invertMat3, applyMat3, computeCircleAABB } from '../math/matrix.js';
import type { CanvasInteractiveProps } from '../types.js';

const FULL_TURN = Math.PI * 2;

export interface CircleProps extends CanvasInteractiveProps {
    /** 圆心 x（px） */
    cx: number;
    /** 圆心 y（px） */
    cy: number;
    /** 半径（px） */
    r: number;
    /** 内半径（px），默认 0。大于 0 时保留透明圆孔。 */
    innerRadius?: number;
    /** 起始角（弧度），0 向右，沿画布顺时针递增。默认 0。 */
    startAngle?: number;
    /** 结束角（弧度），默认从起始角画一整圈。小于或等于起始角时为空。 */
    endAngle?: number;
    fill?: string;
    stroke?: string;
    strokeWidth?: number;
}

function Circle({
    cx,
    cy,
    r,
    innerRadius = 0,
    startAngle = 0,
    endAngle,
    fill = 'transparent',
    stroke = 'transparent',
    strokeWidth = 0,
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
}: CircleProps) {
    const ctx = use(CanvasContext);
    const { revision: paletteRevision } = use(CanvasPaletteContext);
    // 可变实例状态 ref：持有注册 id，跨渲染不触发 rerender
    const cmdIdRef = useRef<number | null>(null);
    const hole = Math.max(0, innerRadius);
    const sweep = endAngle === undefined ? FULL_TURN : Math.min(FULL_TURN, endAngle - startAngle);
    const start = startAngle % FULL_TURN;

    const buildCmd = () => {
        // 读取 revision 让 CSS 变量 / 系统色在主题变化时重新解析。
        void paletteRevision;
        const fillColor = parseColor(ctx.resolveColor(fill, 'transparent', 'shapeFill'));
        const strokeColor = parseColor(ctx.resolveColor(stroke, 'transparent', 'shapeStroke'));
        const appliedFill: ColorRGBA =
            opacity !== 1
                ? [fillColor[0], fillColor[1], fillColor[2], fillColor[3] * opacity]
                : fillColor;
        const appliedStroke: ColorRGBA =
            opacity !== 1
                ? [strokeColor[0], strokeColor[1], strokeColor[2], strokeColor[3] * opacity]
                : strokeColor;
        return {
            kind: 'sdf-circle' as const,
            cx, cy, r,
            innerRadius: hole, startAngle: start, sweep,
            fill: appliedFill,
            stroke: appliedStroke,
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
            const inv = invertMat3(ctx.parentMatrix);
            if (!inv) return false;
            const [lx, ly] = applyMat3(inv, canvasX, canvasY);
            const dx = lx - cx;
            const dy = ly - cy;
            const distance = Math.hypot(dx, dy);
            if (!(hole < r && distance >= hole && distance <= r && sweep > 0)) return false;
            if (sweep >= FULL_TURN) return true;
            const offset = (Math.atan2(dy, dx) - start) % FULL_TURN;
            return (offset < 0 ? offset + FULL_TURN : offset) < sweep;
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

    // 注册 id 在 props 更新时保持稳定，命中区域和处理函数随图元同步更新。
    useEffect(() => {
        const id = ctx.register(buildCmd());
        cmdIdRef.current = id;
        return () => {
            ctx.unregister(id);
            ctx.unregisterHit(id);
            cmdIdRef.current = null;
        };
    }, []);

    // props 变化时更新
    useEffect(() => {
        if (cmdIdRef.current === null) return;
        ctx.update(cmdIdRef.current, buildCmd());
        if (needsHit) ctx.updateHit(cmdIdRef.current, buildHitEntry());
        else ctx.unregisterHit(cmdIdRef.current);
    });

    return null;
}

export default Circle;
