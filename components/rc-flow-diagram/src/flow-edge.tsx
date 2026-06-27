import { Line, Marker } from '@crab-dev/rc-canvas';

export interface FlowEdgePoint {
    x: number;
    y: number;
}

export interface FlowEdgeProps {
    /** 折线顶点序列（含两端，由 useEdgeRouting 的 routes[id].points 直接传入） */
    points: FlowEdgePoint[];
    color?: string;
    lineWidth?: number;
    /** 虚线实段长度（world px）；不设或 0 为实线 */
    dashLength?: number;
    /** 虚线空隙长度（world px）；dashLength > 0 时生效 */
    gapLength?: number;
    /** 终点箭头，默认 true */
    arrowEnd?: boolean;
    /** 起点箭头，默认 false */
    arrowStart?: boolean;
    /** 箭头大小（world px），默认 10 */
    arrowSize?: number;
    zIndex?: number;
    /**
     * 此边需要"让路"的交叉点列表（通常由 useEdgeCrossings 计算后传入）。
     * 有交叉点时，此边在交叉点处留出 hopGap 宽的缺口，另一条边从上方通过。
     */
    crossings?: FlowEdgePoint[];
    /** 跨越缺口宽度（world px），默认 10 */
    hopGap?: number;
    onClick?: () => void;
    onMouseEnter?: () => void;
    onMouseLeave?: () => void;
}

// ── 线段跨越分割 ──────────────────────────────────────────────────────────────

interface Seg { from: FlowEdgePoint; to: FlowEdgePoint }

/**
 * 将线段 p→q 按交叉点列表切成若干子段，在每个交叉点处留出 hopGap 的真空缺口。
 * 缺口是真正不渲染的空白（非遮罩矩形），对任意背景均有效。
 */
function splitSeg(
    p: FlowEdgePoint,
    q: FlowEdgePoint,
    crossings: FlowEdgePoint[],
    hopGap: number,
): Seg[] {
    const dx = q.x - p.x, dy = q.y - p.y;
    const len = Math.sqrt(dx * dx + dy * dy);
    if (len < 1e-6) return [];

    // 收集真正落在此线段内部的交叉点 t 值（端点附近排除）
    const ts: number[] = [];
    for (const c of crossings) {
        const t = ((c.x - p.x) * dx + (c.y - p.y) * dy) / (len * len);
        if (t > 1e-4 && t < 1 - 1e-4) {
            // 验证点与线段的正交距离 ≤ 2px（容错浮点误差）
            const projX = p.x + t * dx, projY = p.y + t * dy;
            if (Math.hypot(c.x - projX, c.y - projY) < 2) {
                ts.push(t);
            }
        }
    }

    if (ts.length === 0) return [{ from: p, to: q }];
    ts.sort((a, b) => a - b);

    const half = hopGap / 2 / len;
    const segs: Seg[] = [];
    let prev = 0;

    for (const t of ts) {
        const t0 = Math.max(prev, t - half);
        const t1 = Math.min(1, t + half);
        if (t0 > prev + 1e-6) {
            segs.push({
                from: { x: p.x + prev * dx, y: p.y + prev * dy },
                to:   { x: p.x + t0   * dx, y: p.y + t0   * dy },
            });
        }
        prev = t1;
    }
    if (prev < 1 - 1e-6) {
        segs.push({
            from: { x: p.x + prev * dx, y: p.y + prev * dy },
            to: q,
        });
    }
    return segs;
}

// ── FlowEdge ──────────────────────────────────────────────────────────────────

function FlowEdge({
    points,
    color = '#6b7280',
    lineWidth = 1.5,
    dashLength,
    gapLength,
    arrowEnd = true,
    arrowStart = false,
    arrowSize = 10,
    zIndex = 1,
    crossings,
    hopGap = 10,
    onClick,
    onMouseEnter,
    onMouseLeave,
}: FlowEdgeProps) {
    if (points.length < 2) return null;

    const shrink = arrowSize * 0.62;
    const last = points.length - 1;
    const hasCrossings = crossings && crossings.length > 0;

    return (
        <>
            {points.slice(0, -1).map((p, i) => {
                const q = points[i + 1];
                const isLast = i === last - 1;
                const isFirst = i === 0;

                const dx = q.x - p.x;
                const dy = q.y - p.y;
                const len = Math.sqrt(dx * dx + dy * dy);
                const cos = len > 0 ? dx / len : 0;
                const sin = len > 0 ? dy / len : 0;

                const x2 = isLast && arrowEnd && len > shrink ? q.x - shrink * cos : q.x;
                const y2 = isLast && arrowEnd && len > shrink ? q.y - shrink * sin : q.y;
                const x1 = isFirst && arrowStart && len > shrink ? p.x + shrink * cos : p.x;
                const y1 = isFirst && arrowStart && len > shrink ? p.y + shrink * sin : p.y;

                const from: FlowEdgePoint = { x: x1, y: y1 };
                const to: FlowEdgePoint   = { x: x2, y: y2 };

                const segs = hasCrossings
                    ? splitSeg(from, to, crossings, hopGap)
                    : [{ from, to }];

                return segs.map((seg, si) => (
                    <Line
                        key={`${i}-${si}`}
                        x1={seg.from.x} y1={seg.from.y}
                        x2={seg.to.x}   y2={seg.to.y}
                        color={color}
                        lineWidth={lineWidth}
                        dashLength={dashLength}
                        gapLength={gapLength}
                        zIndex={zIndex}
                        onClick={onClick}
                        onMouseEnter={onMouseEnter}
                        onMouseLeave={onMouseLeave}
                    />
                ));
            })}

            {arrowEnd && (() => {
                const p = points[last - 1];
                const q = points[last];
                const angle = Math.atan2(q.y - p.y, q.x - p.x);
                return (
                    <Marker
                        x={q.x} y={q.y}
                        angle={angle}
                        size={arrowSize}
                        fill={color}
                        zIndex={zIndex}
                    />
                );
            })()}

            {arrowStart && (() => {
                const p = points[0];
                const q = points[1];
                const angle = Math.atan2(p.y - q.y, p.x - q.x);
                return (
                    <Marker
                        x={p.x} y={p.y}
                        angle={angle}
                        size={arrowSize}
                        fill={color}
                        zIndex={zIndex}
                    />
                );
            })()}
        </>
    );
}

export default FlowEdge;
