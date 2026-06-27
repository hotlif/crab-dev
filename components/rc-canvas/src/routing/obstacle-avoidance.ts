/**
 * 正交边的节点避让路由（纯函数）。
 *
 * 在 Hanan 网格（由障碍矩形边界 + 端口引出坐标构成的稀疏网格）上用带拐弯代价的
 * A* 搜索一条不穿越任何障碍内部的正交路径：
 * - 首步强制沿 exitSide 外法线（垂直引出）、到达必须沿 entrySide 内法线（垂直入射）；
 * - 每个 90° 拐弯计 turnPenalty（远大于格距 → 优先少拐弯，路径更直）；
 * - 严格内部碰撞（允许贴膨胀边）。
 *
 * 经离线对抗测试验证（障碍居中 / 竖直收窄 / 端口贴障碍 / 源被围死 / 同侧端口等）。
 */

import {
    type EdgeAnchor, type Pt, type Rect, type Side,
    ROUTE_EPS, inflateRect,
    segmentHitsAny, polylineClearOf, simplifyOrthogonal, uniqueSorted,
} from './geometry.js';
import { routeOrthogonal } from './orthogonal.js';

/** 避让参数。 */
export interface AvoidOptions {
    /** 障碍四周留白（world px），默认 12。 */
    margin?: number;
    /** 留白档无解时的兜底留白，默认 4（仍保证不穿节点本体）。 */
    safeMargin?: number;
    /** 每个 90° 拐弯的代价，默认 60（远大于典型格距）。 */
    turnPenalty?: number;
    /** A* 迭代上限（防御性），默认 200000。 */
    maxIterations?: number;
}

const DEFAULTS: Required<AvoidOptions> = { margin: 12, safeMargin: 4, turnPenalty: 60, maxIterations: 200_000 };

// 方向：0:+x 1:-x 2:+y 3:-y；4 = 起点无入向
const DX = [1, -1, 0, 0];
const DY = [0, 0, 1, -1];
const sideOutDir = (s: Side): number => (s === 'right' ? 0 : s === 'left' ? 1 : s === 'bottom' ? 2 : 3);
const sideInDir = (s: Side): number => (s === 'right' ? 1 : s === 'left' ? 0 : s === 'bottom' ? 3 : 2);

/**
 * 单次避让：在给定 margin 下绕开 obstacles 路由 anchor，无解返回 null。
 * obstacles 为"未膨胀"的原始障碍矩形（不含本边自身两端节点）。
 */
export function routeAvoidingObstacles(
    anchor: EdgeAnchor,
    obstacles: Rect[],
    options?: AvoidOptions,
): Pt[] | null {
    const { margin, turnPenalty, maxIterations } = { ...DEFAULTS, ...options };
    const { exit, exitSide, entry, entrySide } = anchor;
    const inflated = obstacles.map(r => inflateRect(r, margin));

    // 端口外一格的引出坐标，保证总有一条垂直引出格线（即便端口与障碍边共线）
    const lead = margin + 2;
    const exitLeadX = exitSide === 'right' ? exit.x + lead : exitSide === 'left' ? exit.x - lead : exit.x;
    const exitLeadY = exitSide === 'bottom' ? exit.y + lead : exitSide === 'top' ? exit.y - lead : exit.y;
    const entryLeadX = entrySide === 'right' ? entry.x + lead : entrySide === 'left' ? entry.x - lead : entry.x;
    const entryLeadY = entrySide === 'bottom' ? entry.y + lead : entrySide === 'top' ? entry.y - lead : entry.y;

    const xs = uniqueSorted([exit.x, entry.x, exitLeadX, entryLeadX, ...inflated.flatMap(r => [r.x, r.x + r.width])]);
    const ys = uniqueSorted([exit.y, entry.y, exitLeadY, entryLeadY, ...inflated.flatMap(r => [r.y, r.y + r.height])]);
    const indexOf = (vals: number[], v: number) => vals.findIndex(x => Math.abs(x - v) < ROUTE_EPS);

    const sx = indexOf(xs, exit.x), sy = indexOf(ys, exit.y);
    const gx = indexOf(xs, entry.x), gy = indexOf(ys, entry.y);
    if (sx < 0 || sy < 0 || gx < 0 || gy < 0) return null;

    const W = xs.length, H = ys.length;
    const nodeAt = (cx: number, cy: number): Pt => ({ x: xs[cx], y: ys[cy] });
    const key = (cx: number, cy: number, d: number) => (cy * W + cx) * 5 + d;

    const startDir = sideOutDir(exitSide);
    const endDir = sideInDir(entrySide);
    const heur = (cx: number, cy: number) => Math.abs(xs[cx] - entry.x) + Math.abs(ys[cy] - entry.y);

    interface QItem { cx: number; cy: number; d: number; g: number; f: number }
    const open: QItem[] = [{ cx: sx, cy: sy, d: 4, g: 0, f: heur(sx, sy) }];
    const gScore = new Map<number, number>();
    const cameFrom = new Map<number, number>();
    gScore.set(key(sx, sy, 4), 0);

    const popMin = (): QItem | undefined => {
        if (open.length === 0) return undefined;
        let best = 0;
        for (let i = 1; i < open.length; i++) if (open[i].f < open[best].f) best = i;
        return open.splice(best, 1)[0];
    };

    let goalKey = -1;
    let iters = 0;
    for (;;) {
        const cur = popMin();
        if (!cur || ++iters > maxIterations) break;
        const ck = key(cur.cx, cur.cy, cur.d);
        if (cur.g > (gScore.get(ck) ?? Infinity)) continue;
        if (cur.cx === gx && cur.cy === gy) {
            if (cur.d === endDir || cur.d === 4) { goalKey = ck; break; }
            continue;
        }
        for (let d = 0; d < 4; d++) {
            if (cur.d === 4 && d !== startDir) continue;        // 强制首段垂直引出
            const nx = cur.cx + DX[d], ny = cur.cy + DY[d];
            if (nx < 0 || ny < 0 || nx >= W || ny >= H) continue;
            const p = nodeAt(cur.cx, cur.cy), q = nodeAt(nx, ny);
            if (segmentHitsAny(p, q, inflated)) continue;       // 正交可见性
            const stepLen = Math.abs(q.x - p.x) + Math.abs(q.y - p.y);
            const turn = cur.d !== 4 && cur.d !== d ? turnPenalty : 0;
            const ng = cur.g + stepLen + turn;
            const nk = key(nx, ny, d);
            if (ng < (gScore.get(nk) ?? Infinity)) {
                gScore.set(nk, ng);
                cameFrom.set(nk, ck);
                open.push({ cx: nx, cy: ny, d, g: ng, f: ng + heur(nx, ny) });
            }
        }
    }
    if (goalKey < 0) return null;

    const path: Pt[] = [];
    let k: number | undefined = goalKey;
    while (k !== undefined) {
        const cell = Math.floor(k / 5);
        path.push(nodeAt(cell % W, Math.floor(cell / W)));
        k = cameFrom.get(k);
    }
    path.reverse();
    const simplified = simplifyOrthogonal(path);
    return simplified.length >= 2 ? simplified : null;
}

/**
 * 顶层路由：简单正交（与障碍无碰撞时直接用）→ A* 绕行（两级 margin：先美观留白、
 * 再兜底留白）→ 简单正交兜底（被围死也保证边不消失）。
 * obstacles 不应包含本边自身两端节点（端口合法贴附其上）。
 */
export function routeEdge(anchor: EdgeAnchor, obstacles: Rect[], options?: AvoidOptions): Pt[] {
    const opts = { ...DEFAULTS, ...options };
    const simple = routeOrthogonal(anchor);
    const inflated = obstacles.map(r => inflateRect(r, opts.margin));
    if (polylineClearOf(simple, inflated)) return simple;

    const avoided =
        routeAvoidingObstacles(anchor, obstacles, { ...opts, margin: opts.margin })
        ?? routeAvoidingObstacles(anchor, obstacles, { ...opts, margin: opts.safeMargin });
    return avoided ?? simple;
}
