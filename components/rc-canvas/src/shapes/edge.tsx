import Line from './line.js';
import Marker from './marker.js';
import type { CanvasInteractiveProps } from '../types.js';

export interface EdgeProps extends CanvasInteractiveProps {
    x1: number;
    y1: number;
    x2: number;
    y2: number;
    color?: string;
    lineWidth?: number;
    /** 虚线实段长度（world px）；不设置或 0 为实线 */
    dashLength?: number;
    /** 虚线空隙长度（world px）；dashLength > 0 时生效 */
    gapLength?: number;
    /** 起点箭头，默认 false */
    arrowStart?: boolean;
    /** 终点箭头，默认 true */
    arrowEnd?: boolean;
    /** 箭头大小（px），默认 10 */
    arrowSize?: number;
    /**
     * 路由类型，默认 'straight'。
     * 'orthogonal'：三段正交折线（水平→垂直→水平，以 midX=(x1+x2)/2 为转折点）。
     */
    type?: 'straight' | 'orthogonal';
}

// ── Straight（直线） ──────────────────────────────────────────────────────────

function StraightEdge({
    x1, y1, x2, y2,
    color, lineWidth, opacity, dashLength, gapLength,
    arrowStart, arrowEnd, arrowSize, zIndex,
    draggable, cursor, onClick, onMouseEnter, onMouseLeave,
    onDragStart, onDrag, onDragEnd,
}: Omit<EdgeProps, 'type'>) {
    const dx = x2 - x1;
    const dy = y2 - y1;
    const len = Math.sqrt(dx * dx + dy * dy);
    const angle = len > 0 ? Math.atan2(dy, dx) : 0;
    const cos = len > 0 ? dx / len : 0;
    const sin = len > 0 ? dy / len : 0;

    // 箭头长度不得超过线段：短段（如折线终点贴近节点）时自动缩小箭头，
    // 避免箭头溢出线段、压住转角和前一段（拖拽折点贴近端口时常见）。
    const arrowCount = (arrowStart ? 1 : 0) + (arrowEnd ? 1 : 0);
    const effSize = arrowCount > 0 ? Math.min(arrowSize ?? 10, len / arrowCount) : (arrowSize ?? 10);
    const shrink = effSize * 0.62;

    const lx1 = arrowStart ? x1 + shrink * cos : x1;
    const ly1 = arrowStart ? y1 + shrink * sin : y1;
    const lx2 = arrowEnd ? x2 - shrink * cos : x2;
    const ly2 = arrowEnd ? y2 - shrink * sin : y2;

    return (
        <>
            <Line
                x1={lx1} y1={ly1} x2={lx2} y2={ly2}
                color={color} lineWidth={lineWidth} opacity={opacity}
                dashLength={dashLength} gapLength={gapLength} zIndex={zIndex}
                draggable={draggable} cursor={cursor}
                onClick={onClick} onMouseEnter={onMouseEnter} onMouseLeave={onMouseLeave}
                onDragStart={onDragStart} onDrag={onDrag} onDragEnd={onDragEnd}
            />
            {arrowEnd && len > 0 && (
                <Marker x={x2} y={y2} angle={angle} size={effSize} fill={color ?? '#000000'} opacity={opacity} zIndex={zIndex} />
            )}
            {arrowStart && len > 0 && (
                <Marker x={x1} y={y1} angle={angle + Math.PI} size={effSize} fill={color ?? '#000000'} opacity={opacity} zIndex={zIndex} />
            )}
        </>
    );
}

// ── Orthogonal（三段正交折线） ────────────────────────────────────────────────

function OrthogonalEdge({
    x1, y1, x2, y2,
    color, lineWidth, opacity, dashLength, gapLength,
    arrowStart, arrowEnd, arrowSize, zIndex,
    draggable, cursor, onClick, onMouseEnter, onMouseLeave,
    onDragStart, onDrag, onDragEnd,
}: Omit<EdgeProps, 'type'>) {
    const midX = (x1 + x2) / 2;
    const sz = arrowSize ?? 10;
    const shrink = sz * 0.62;

    // 最后一段方向决定终点箭头角度
    const endAngle = x2 !== midX
        ? (x2 > midX ? 0 : Math.PI)
        : (y2 > y1 ? Math.PI / 2 : -Math.PI / 2);

    // 第一段方向决定起点箭头角度（反向）
    const startAngle = x1 !== midX
        ? (midX > x1 ? 0 : Math.PI) + Math.PI
        : (y1 > y2 ? Math.PI / 2 : -Math.PI / 2) + Math.PI;

    // 终点箭头缩进（向终点方向退缩）
    const ex = arrowEnd && Math.abs(x2 - midX) > shrink ? x2 - Math.sign(x2 - midX) * shrink : x2;
    const sx = arrowStart && Math.abs(midX - x1) > shrink ? x1 + Math.sign(midX - x1) * shrink : x1;

    // 三段折线：水平1 → 垂直 → 水平2
    const sharedProps = { color, lineWidth, opacity, dashLength, gapLength, zIndex };
    const interactProps = { draggable, cursor, onClick, onMouseEnter, onMouseLeave, onDragStart, onDrag, onDragEnd };

    return (
        <>
            {/* 水平段 1：x1 → midX */}
            <Line x1={sx} y1={y1} x2={midX} y2={y1} {...sharedProps} {...interactProps} />
            {/* 垂直段：midX, y1 → midX, y2 */}
            <Line x1={midX} y1={y1} x2={midX} y2={y2} {...sharedProps} />
            {/* 水平段 2：midX → x2 */}
            <Line x1={midX} y1={y2} x2={ex} y2={y2} {...sharedProps} />
            {arrowEnd && (
                <Marker x={x2} y={y2} angle={endAngle} size={sz} fill={color ?? '#000000'} opacity={opacity} zIndex={zIndex} />
            )}
            {arrowStart && (
                <Marker x={x1} y={y1} angle={startAngle} size={sz} fill={color ?? '#000000'} opacity={opacity} zIndex={zIndex} />
            )}
        </>
    );
}

// ── Edge（公共入口） ──────────────────────────────────────────────────────────

function Edge({
    type = 'straight',
    x1,
    y1,
    x2,
    y2,
    color = '#000000',
    lineWidth = 1.5,
    opacity = 1,
    dashLength,
    gapLength,
    arrowStart = false,
    arrowEnd = true,
    arrowSize = 10,
    zIndex = 0,
    draggable = false,
    cursor,
    onClick,
    onMouseEnter,
    onMouseLeave,
    onDragStart,
    onDrag,
    onDragEnd,
}: EdgeProps) {
    const commonProps = {
        x1, y1, x2, y2, color, lineWidth, opacity, dashLength, gapLength,
        arrowStart, arrowEnd, arrowSize, zIndex, draggable, cursor,
        onClick, onMouseEnter, onMouseLeave, onDragStart, onDrag, onDragEnd,
    };

    return type === 'orthogonal'
        ? <OrthogonalEdge {...commonProps} />
        : <StraightEdge {...commonProps} />;
}

export default Edge;
