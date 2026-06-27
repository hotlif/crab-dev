/**
 * 图边正交路由的几何原语（纯函数，无 React）。
 *
 * 坐标系：world px，x 向右、y 向下。所有矩形以左上角 + 宽高表示，
 * 与 `ElkLayoutResult.nodes` 的 `{ x, y, width, height }` 对齐，可直接互用。
 */

/** 二维点（world px）。 */
export interface Pt {
    x: number;
    y: number;
}

/** 轴对齐矩形（左上角 + 宽高，world px）。 */
export interface Rect {
    x: number;
    y: number;
    width: number;
    height: number;
}

/** 矩形的四条边之一（端口所在侧）。 */
export type Side = 'top' | 'right' | 'bottom' | 'left';

/**
 * 一条边两端的锚点描述：端点坐标 + 所在矩形边。
 * exitSide / entrySide 决定连线在端点处的进出方向（沿该边的外法线）。
 */
export interface EdgeAnchor {
    exit: Pt;
    exitSide: Side;
    entry: Pt;
    entrySide: Side;
}

/** 浮点比较容差。 */
export const ROUTE_EPS = 1e-6;

/** 该侧是否为水平边（左 / 右）。水平边的外法线沿 x 轴。 */
export const isHorizontalSide = (side: Side): boolean => side === 'left' || side === 'right';

const clamp01 = (v: number): number => Math.min(1, Math.max(0, v));

/**
 * 由 `from` 指向 `to` 的主导边：水平差更大走左右，否则走上下。
 * 常用于自动判断一条边从源 / 目标矩形的哪一侧进出。
 */
export function dominantSide(from: Pt, to: Pt): Side {
    const dx = to.x - from.x;
    const dy = to.y - from.y;
    if (Math.abs(dx) >= Math.abs(dy)) return dx >= 0 ? 'right' : 'left';
    return dy >= 0 ? 'bottom' : 'top';
}

/** 矩形中心。 */
export const rectCenter = (r: Rect): Pt => ({ x: r.x + r.width / 2, y: r.y + r.height / 2 });

/**
 * 矩形某条边上参数 `t`∈[0,1] 处的世界坐标（端口点）。
 * 左 / 右边 t 沿 y 方向，上 / 下边 t 沿 x 方向。
 */
export function anchorPoint(rect: Rect, side: Side, t: number): Pt {
    const c = clamp01(t);
    switch (side) {
        case 'right':  return { x: rect.x + rect.width,     y: rect.y + rect.height * c };
        case 'left':   return { x: rect.x,                  y: rect.y + rect.height * c };
        case 'bottom': return { x: rect.x + rect.width * c, y: rect.y + rect.height };
        default:       return { x: rect.x + rect.width * c, y: rect.y };
    }
}

/**
 * 把世界点投影到矩形最近的一条边，返回 `{ side, t }`。
 * 用于端点重连（把拖到节点上的端点吸附到最近的边）。
 */
export function nearestSideAnchor(rect: Rect, p: Pt): { side: Side; t: number } {
    const right = rect.x + rect.width;
    const bottom = rect.y + rect.height;
    const tY = clamp01((p.y - rect.y) / rect.height);
    const tX = clamp01((p.x - rect.x) / rect.width);
    const cands: Array<{ side: Side; d: number; t: number }> = [
        { side: 'left',   d: Math.abs(p.x - rect.x), t: tY },
        { side: 'right',  d: Math.abs(p.x - right),  t: tY },
        { side: 'top',    d: Math.abs(p.y - rect.y), t: tX },
        { side: 'bottom', d: Math.abs(p.y - bottom), t: tX },
    ];
    cands.sort((a, b) => a.d - b.d);
    return { side: cands[0].side, t: cands[0].t };
}

/** 四周均匀膨胀 `m`（避让留白用）。 */
export const inflateRect = (r: Rect, m: number): Rect =>
    ({ x: r.x - m, y: r.y - m, width: r.width + 2 * m, height: r.height + 2 * m });

/**
 * 轴对齐（水平 / 竖直）线段是否与矩形的**严格内部**相交。
 * 用 EPS 判严格内部 → 线段沿矩形边界"擦过"不算命中，
 * 故连线可以合法地贴着膨胀边走而不被误判为穿越。
 * 注意：仅适用于正交线段（segment 的 dx 或 dy 近似为 0）。
 */
export function segmentIntersectsRect(p: Pt, q: Pt, r: Rect): boolean {
    const left = r.x, right = r.x + r.width, top = r.y, bottom = r.y + r.height;
    if (Math.abs(p.y - q.y) < ROUTE_EPS) {
        const y = p.y;
        if (y <= top + ROUTE_EPS || y >= bottom - ROUTE_EPS) return false;
        const minX = Math.min(p.x, q.x), maxX = Math.max(p.x, q.x);
        return Math.min(maxX, right) - Math.max(minX, left) > ROUTE_EPS;
    }
    const x = p.x;
    if (x <= left + ROUTE_EPS || x >= right - ROUTE_EPS) return false;
    const minY = Math.min(p.y, q.y), maxY = Math.max(p.y, q.y);
    return Math.min(maxY, bottom) - Math.max(minY, top) > ROUTE_EPS;
}

/** 线段是否与障碍列表中任一矩形相交。 */
export function segmentHitsAny(p: Pt, q: Pt, rects: Rect[]): boolean {
    for (const r of rects) if (segmentIntersectsRect(p, q, r)) return true;
    return false;
}

/** 整条折线的每一段是否都不与任何障碍相交。 */
export function polylineClearOf(points: Pt[], rects: Rect[]): boolean {
    for (let i = 0; i < points.length - 1; i++) {
        if (segmentHitsAny(points[i], points[i + 1], rects)) return false;
    }
    return true;
}

/** 去重相邻重合点 + 合并共线冗余点（拐角清晰、无 0 长段）。 */
export function simplifyOrthogonal(points: Pt[]): Pt[] {
    const out: Pt[] = [];
    for (const p of points) {
        const last = out[out.length - 1];
        if (last && Math.abs(last.x - p.x) < ROUTE_EPS && Math.abs(last.y - p.y) < ROUTE_EPS) continue;
        out.push({ ...p });
    }
    let i = 1;
    while (i < out.length - 1) {
        const a = out[i - 1], b = out[i], c = out[i + 1];
        const collinearX = Math.abs(a.x - b.x) < ROUTE_EPS && Math.abs(b.x - c.x) < ROUTE_EPS;
        const collinearY = Math.abs(a.y - b.y) < ROUTE_EPS && Math.abs(b.y - c.y) < ROUTE_EPS;
        if (collinearX || collinearY) out.splice(i, 1);
        else i++;
    }
    return out;
}

/** 升序去重一组数值（容差 EPS）。 */
export function uniqueSorted(values: number[]): number[] {
    const sorted = [...values].sort((a, b) => a - b);
    const out: number[] = [];
    for (const v of sorted) if (out.length === 0 || v - out[out.length - 1] > ROUTE_EPS) out.push(v);
    return out;
}
