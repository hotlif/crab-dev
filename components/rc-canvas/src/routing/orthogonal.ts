/**
 * 正交折线构造（纯函数）。
 * - routeOrthogonal：端口到端口的简单正交路由（H-V-H / V-H-V / L）。
 * - connectThroughWaypoints：端口 → 用户折点 → 端口的正交连接（手动走线）。
 */

import { ROUTE_EPS, isHorizontalSide, simplifyOrthogonal } from './geometry.js';
import type { EdgeAnchor, Pt, Side } from './geometry.js';

/**
 * 简单正交路由：根据两端所在边自动生成折线（中线居中）。
 * - 两端均水平边 → H-V-H；均竖直边 → V-H-V；混合 → L 形。
 */
export function routeOrthogonal(anchor: EdgeAnchor): Pt[] {
    const { exit, exitSide, entry, entrySide } = anchor;

    if (isHorizontalSide(exitSide) && isHorizontalSide(entrySide)) {
        const midX = (exit.x + entry.x) / 2;
        return [exit, { x: midX, y: exit.y }, { x: midX, y: entry.y }, entry];
    }
    if (!isHorizontalSide(exitSide) && !isHorizontalSide(entrySide)) {
        const midY = (exit.y + entry.y) / 2;
        return [exit, { x: exit.x, y: midY }, { x: entry.x, y: midY }, entry];
    }
    const corner: Pt = isHorizontalSide(exitSide)
        ? { x: entry.x, y: exit.y }
        : { x: exit.x, y: entry.y };
    return [exit, corner, entry];
}

/**
 * 正交连接 [exit, ...waypoints, entry]：首段沿 exitSide 外法线离开、
 * 末段沿 entrySide 外法线进入；非共轴的相邻点之间插入一个拐角。
 * 用户拖出的 waypoints 本就正交，内部不会产生多余拐角。
 */
export function connectThroughWaypoints(anchor: EdgeAnchor, waypoints: Pt[]): Pt[] {
    const { exit, exitSide, entry, entrySide } = anchor;
    if (waypoints.length === 0) return routeOrthogonal(anchor);

    const seq = [exit, ...waypoints, entry];
    const out: Pt[] = [{ ...seq[0] }];
    for (let k = 1; k < seq.length; k++) {
        const prev = out[out.length - 1];
        const cur = seq[k];
        if (Math.abs(prev.x - cur.x) < ROUTE_EPS || Math.abs(prev.y - cur.y) < ROUTE_EPS) {
            out.push({ ...cur });
            continue;
        }
        const firstLegHorizontal = legOrientation(k, seq.length, exitSide, entrySide);
        out.push(
            firstLegHorizontal ? { x: cur.x, y: prev.y } : { x: prev.x, y: cur.y },
            { ...cur },
        );
    }
    return simplifyOrthogonal(out);
}

/** 选择拐角朝向：首对沿 exitSide、末对沿 entrySide、内部对默认先水平。 */
function legOrientation(k: number, len: number, exitSide: Side, entrySide: Side): boolean {
    if (k === 1) return isHorizontalSide(exitSide);
    if (k === len - 1) return !isHorizontalSide(entrySide);
    return true;
}

/**
 * 为折线两端预留最小"引出段"长度（jetty）：当进入 / 离开端口的那一段短于 stub 时，
 * 把贴近端口的接近段沿其法线推到距端口至少 stub —— 给箭头留出空间、避免箭头压住
 * 转角和前一段（拖拽把折点拖到贴近节点时常见）。终端段已 ≥ stub 时原样返回（幂等）。
 */
export function withTerminalStubs(points: Pt[], stub: number): Pt[] {
    if (stub <= 0 || points.length < 3) return points;
    const pts = points.map(p => ({ ...p }));
    reserveTerminal(pts, stub);
    pts.reverse();
    reserveTerminal(pts, stub);
    pts.reverse();
    return simplifyOrthogonal(pts);
}

/** 把末段（pts[n-2] → pts[n-1]）夹到至少 stub 长，连带抬起与之共线的接近段。 */
function reserveTerminal(pts: Pt[], stub: number): void {
    const n = pts.length;
    const end = pts[n - 1];
    const a = pts[n - 2];
    if (Math.abs(a.x - end.x) < ROUTE_EPS) {            // 末段竖直（进出 top / bottom）
        if (Math.abs(end.y - a.y) >= stub) return;
        const target = a.y >= end.y ? end.y + stub : end.y - stub;
        pts[n - 2] = { ...a, y: target };
        if (n >= 3 && Math.abs(pts[n - 3].y - a.y) < ROUTE_EPS) pts[n - 3] = { ...pts[n - 3], y: target };
    } else if (Math.abs(a.y - end.y) < ROUTE_EPS) {     // 末段水平（进出 left / right）
        if (Math.abs(end.x - a.x) >= stub) return;
        const target = a.x >= end.x ? end.x + stub : end.x - stub;
        pts[n - 2] = { ...a, x: target };
        if (n >= 3 && Math.abs(pts[n - 3].x - a.x) < ROUTE_EPS) pts[n - 3] = { ...pts[n - 3], x: target };
    }
}
