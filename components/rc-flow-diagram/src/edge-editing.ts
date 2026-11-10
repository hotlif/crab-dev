import type { Pt, Side } from '@crab-dev/rc-canvas';

export interface RouteEndpoint {
    position: Pt;
    side: Side;
}

/** 两点或三点路由增加内部线段，以便拖动时保持端口不变。 */
export function makeEditableRoute(points: readonly Pt[]): Pt[] {
    const copy = points.map(point => ({ ...point }));
    if (copy.length < 2 || copy.length >= 4) return copy;
    const first = copy[0], last = copy[copy.length - 1];
    if (copy.length === 2) return [first, { x: first.x + (last.x - first.x) / 3, y: first.y + (last.y - first.y) / 3 }, { x: first.x + (last.x - first.x) * 2 / 3, y: first.y + (last.y - first.y) * 2 / 3 }, last];
    const middle = copy[1];
    return [first, { x: (first.x + middle.x) / 2, y: (first.y + middle.y) / 2 }, middle, { x: (middle.x + last.x) / 2, y: (middle.y + last.y) / 2 }, last];
}

/** 只移动内部线段；必要时增加端口附近折点，不移动两端端口。 */
export function moveEdgeSegment(points: readonly Pt[], index: number, delta: Pt): Pt[] {
    const result = points.map(point => ({ ...point }));
    if (index < 1 || index >= result.length - 2 || !Number.isFinite(delta.x) || !Number.isFinite(delta.y)) return result;
    const a = result[index], b = result[index + 1];
    if (a.y === b.y) { a.y += delta.y; b.y += delta.y; }
    else if (a.x === b.x) { a.x += delta.x; b.x += delta.x; }
    else return result;
    const start = result[0], next = result[1], end = result[result.length - 1], previous = result[result.length - 2];
    if (start.x !== next.x && start.y !== next.y) result.splice(1, 0, points[0].x === points[1].x ? { x: start.x, y: next.y } : { x: next.x, y: start.y });
    if (end.x !== previous.x && end.y !== previous.y) result.splice(result.length - 1, 0, points[points.length - 1].x === points[points.length - 2].x ? { x: end.x, y: previous.y } : { x: previous.x, y: end.y });
    return result;
}

/** 恢复手动路线并重新接上移动后的端口；非法存档返回 null，调用方退回自动路由。 */
export function reanchorEdgeRoute(points: readonly Pt[], source: RouteEndpoint, target: RouteEndpoint, stub?: number): Pt[] | null {
    const stubLength = stub ?? 18;
    if (!Array.isArray(points) || points.length < 4 || points.length > 512 || !points.every(p => p && Number.isFinite(p.x) && Number.isFinite(p.y))
        || points.some((p, i) => i > 0 && p.x !== points[i - 1].x && p.y !== points[i - 1].y)) return null;
    const a = source.position, b = target.position;
    if (points[0].x === a.x && points[0].y === a.y && points[points.length - 1].x === b.x && points[points.length - 1].y === b.y) return points.map(p => ({ ...p }));
    const inner = points.slice(1, -1);
    const connector = ({ position, side }: RouteEndpoint, to: Pt) => {
        const tip = { x: position.x + (side === 'right' ? stubLength : side === 'left' ? -stubLength : 0), y: position.y + (side === 'bottom' ? stubLength : side === 'top' ? -stubLength : 0) };
        return [position, tip, side === 'left' || side === 'right' ? { x: tip.x, y: to.y } : { x: to.x, y: tip.y }];
    };
    return [...connector(source, inner[0]), ...inner, ...connector(target, inner[inner.length - 1]).reverse()]
        .filter((point, index, all) => index === 0 || point.x !== all[index - 1].x || point.y !== all[index - 1].y).map(point => ({ ...point }));
}

export function distanceToEdge(point: Pt, points: readonly Pt[]): number {
    let distance = Infinity;
    for (let i = 1; i < points.length; i++) {
        const a = points[i - 1], b = points[i], dx = b.x - a.x, dy = b.y - a.y;
        const t = Math.max(0, Math.min(1, ((point.x - a.x) * dx + (point.y - a.y) * dy) / (dx * dx + dy * dy || 1)));
        distance = Math.min(distance, Math.hypot(point.x - a.x - t * dx, point.y - a.y - t * dy));
    }
    return distance;
}

/** tolerance 为屏幕 CSS 像素，返回距离最近的边。 */
export function hitTestEdges(point: Pt, routes: Record<string, { points: readonly Pt[] }>, options?: { zoom?: number; tolerance?: number; filter?: (edgeId: string) => boolean }): string | null {
    let nearest: string | null = null, distance = (options?.tolerance ?? 8) / (options?.zoom ?? 1);
    for (const [id, route] of Object.entries(routes)) {
        if (options?.filter && !options.filter(id)) continue;
        const next = distanceToEdge(point, route.points);
        if (next <= distance) { nearest = id; distance = next; }
    }
    return nearest;
}
