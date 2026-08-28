import { describe, it, expect } from "@crab-dev/wake/test";
import { type Pt, type Rect, type Side, type EdgeAnchor, anchorPoint, nearestSideAnchor, dominantSide, isHorizontalSide, segmentIntersectsRect, simplifyOrthogonal, routeOrthogonal, connectThroughWaypoints, withTerminalStubs, routeEdge, routeAvoidingObstacles, assignPorts, } from '../routing/index.js';
const EPS = 1e-6;
const rect = (x: number, y: number, width = 140, height = 48): Rect => ({ x, y, width, height });
const port = (r: Rect, side: Side, t = 0.5): Pt => anchorPoint(r, side, t);
function isOrthogonal(pts: Pt[]): boolean {
    for (let i = 0; i < pts.length - 1; i++) {
        const dx = Math.abs(pts[i].x - pts[i + 1].x);
        const dy = Math.abs(pts[i].y - pts[i + 1].y);
        if (dx > EPS && dy > EPS)
            return false;
    }
    return true;
}
const legHorizontal = (a: Pt, b: Pt) => Math.abs(a.y - b.y) < EPS;
const leavesAlong = (pts: Pt[], side: Side) => legHorizontal(pts[0], pts[1]) === isHorizontalSide(side);
const entersAlong = (pts: Pt[], side: Side) => legHorizontal(pts[pts.length - 2], pts[pts.length - 1]) === isHorizontalSide(side);
function occludes(pts: Pt[], rects: Rect[]): boolean {
    for (let i = 0; i < pts.length - 1; i++) {
        for (const r of rects)
            if (segmentIntersectsRect(pts[i], pts[i + 1], r))
                return true;
    }
    return false;
}
describe('geometry', () => {
    it('anchorPoint 落在对应边上', () => {
        const r = rect(0, 100);
        expect(anchorPoint(r, 'right', 0.5)).toEqual({ x: 140, y: 124 });
        expect(anchorPoint(r, 'left', 0)).toEqual({ x: 0, y: 100 });
        expect(anchorPoint(r, 'bottom', 0.5)).toEqual({ x: 70, y: 148 });
        expect(anchorPoint(r, 'top', 1)).toEqual({ x: 140, y: 100 });
    });
    it('dominantSide 按主导轴判定', () => {
        expect(dominantSide({ x: 0, y: 0 }, { x: 100, y: 10 })).toBe('right');
        expect(dominantSide({ x: 0, y: 0 }, { x: -100, y: 10 })).toBe('left');
        expect(dominantSide({ x: 0, y: 0 }, { x: 10, y: 100 })).toBe('bottom');
        expect(dominantSide({ x: 0, y: 0 }, { x: 10, y: -100 })).toBe('top');
    });
    it('nearestSideAnchor 投影到最近边', () => {
        const r = rect(500, 200);
        expect(nearestSideAnchor(r, { x: 505, y: 224 }).side).toBe('left');
        expect(nearestSideAnchor(r, { x: 635, y: 224 }).side).toBe('right');
        const b = nearestSideAnchor(r, { x: 570, y: 250 });
        expect(b.side).toBe('bottom');
        expect(anchorPoint(r, b.side, b.t).y).toBeCloseTo(248);
    });
    it('segmentIntersectsRect 仅判严格内部（贴边不算）', () => {
        const r = rect(100, 100); // x[100,240] y[100,148]
        expect(segmentIntersectsRect({ x: 0, y: 124 }, { x: 300, y: 124 }, r)).toBe(true); // 穿内部
        expect(segmentIntersectsRect({ x: 0, y: 100 }, { x: 300, y: 100 }, r)).toBe(false); // 贴上边
        expect(segmentIntersectsRect({ x: 0, y: 60 }, { x: 300, y: 60 }, r)).toBe(false); // 完全在外
    });
    it('simplifyOrthogonal 合并共线 + 去重', () => {
        const r = simplifyOrthogonal([
            { x: 0, y: 0 }, { x: 0, y: 0 }, { x: 50, y: 0 }, { x: 100, y: 0 }, { x: 100, y: 50 },
        ]);
        expect(r).toEqual([{ x: 0, y: 0 }, { x: 100, y: 0 }, { x: 100, y: 50 }]);
    });
});
describe('routeOrthogonal', () => {
    it('两端水平边 → H-V-H，正交且沿边进出', () => {
        const a: EdgeAnchor = { exit: port(rect(0, 100), 'right'), exitSide: 'right', entry: port(rect(400, 200), 'left'), entrySide: 'left' };
        const pts = routeOrthogonal(a);
        expect(isOrthogonal(pts)).toBe(true);
        expect(leavesAlong(pts, 'right')).toBe(true);
        expect(entersAlong(pts, 'left')).toBe(true);
    });
    it('两端竖直边 → V-H-V', () => {
        const a: EdgeAnchor = { exit: port(rect(100, 0), 'bottom'), exitSide: 'bottom', entry: port(rect(300, 300), 'top'), entrySide: 'top' };
        const pts = routeOrthogonal(a);
        expect(isOrthogonal(pts)).toBe(true);
        expect(leavesAlong(pts, 'bottom')).toBe(true);
        expect(entersAlong(pts, 'top')).toBe(true);
    });
});
describe('connectThroughWaypoints', () => {
    const anchor: EdgeAnchor = {
        exit: port(rect(0, 100), 'right'), exitSide: 'right',
        entry: port(rect(600, 300), 'left'), entrySide: 'left',
    };
    it('穿过 waypoints 且保持正交 / 沿边进出', () => {
        const pts = connectThroughWaypoints(anchor, [{ x: 300, y: 124 }, { x: 300, y: 324 }]);
        expect(isOrthogonal(pts)).toBe(true);
        expect(pts.some(p => Math.abs(p.x - 300) < EPS && Math.abs(p.y - 124) < EPS)).toBe(true);
        expect(pts.some(p => Math.abs(p.x - 300) < EPS && Math.abs(p.y - 324) < EPS)).toBe(true);
        expect(leavesAlong(pts, 'right')).toBe(true);
        expect(entersAlong(pts, 'left')).toBe(true);
    });
    it('无 waypoints 时退化为简单正交', () => {
        expect(connectThroughWaypoints(anchor, [])).toEqual(routeOrthogonal(anchor));
    });
});
describe('withTerminalStubs 终端引出段预留', () => {
    // 末段（竖直）只有 4px：进入端口前贴得太近
    const short: Pt[] = [{ x: 522, y: 74 }, { x: 522, y: 296 }, { x: 742, y: 296 }, { x: 742, y: 300 }];
    it('把过短的末段夹到至少 stub，且保持正交', () => {
        const out = withTerminalStubs(short, 26);
        const a = out[out.length - 2], b = out[out.length - 1];
        expect(Math.abs(b.y - a.y)).toBeGreaterThanOrEqual(26); // 末段 ≥ stub
        expect(Math.abs(a.x - b.x)).toBeLessThan(EPS); // 仍竖直
        expect(isOrthogonal(out)).toBe(true);
        expect(out[out.length - 1]).toEqual({ x: 742, y: 300 }); // 端口不动
    });
    it('幂等：已满足 stub 再次处理不变', () => {
        const once = withTerminalStubs(short, 26);
        const twice = withTerminalStubs(once, 26);
        expect(twice).toEqual(once);
    });
    it('末段已足够长则原样返回', () => {
        const ok: Pt[] = [{ x: 0, y: 0 }, { x: 0, y: 100 }, { x: 200, y: 100 }, { x: 200, y: 300 }];
        expect(withTerminalStubs(ok, 26)).toEqual(ok);
    });
});
describe('routeEdge 节点避让', () => {
    it('障碍居中：绕行且不遮挡、保持正交', () => {
        const a: EdgeAnchor = { exit: port(rect(0, 100), 'right'), exitSide: 'right', entry: port(rect(600, 100), 'left'), entrySide: 'left' };
        const obstacles = [rect(280, 96)];
        const pts = routeEdge(a, obstacles);
        expect(isOrthogonal(pts)).toBe(true);
        expect(occludes(pts, obstacles)).toBe(false);
    });
    it('竖直收窄通道：从间隙绕行无遮挡', () => {
        const a: EdgeAnchor = { exit: port(rect(0, 300), 'right'), exitSide: 'right', entry: port(rect(400, 300), 'left'), entrySide: 'left' };
        const obstacles = [rect(200, 200), rect(200, 360)];
        const pts = routeEdge(a, obstacles);
        expect(isOrthogonal(pts)).toBe(true);
        expect(occludes(pts, obstacles)).toBe(false);
    });
    it('无障碍：直接走简单正交（无绕行）', () => {
        const a: EdgeAnchor = { exit: port(rect(0, 100), 'right'), exitSide: 'right', entry: port(rect(600, 100), 'left'), entrySide: 'left' };
        expect(routeEdge(a, [])).toEqual(routeOrthogonal(a));
    });
    it('端口被障碍覆盖（退化）：兜底回简单路由，边不消失', () => {
        const a: EdgeAnchor = { exit: port(rect(0, 100), 'right'), exitSide: 'right', entry: port(rect(500, 100), 'left'), entrySide: 'left' };
        const obstacles = [rect(60, 110)]; // 紧贴 exit，端口落在膨胀区内
        const pts = routeEdge(a, obstacles);
        expect(pts.length).toBeGreaterThanOrEqual(2);
        expect(isOrthogonal(pts)).toBe(true);
    });
    it('routeAvoidingObstacles 在通路存在时返回非空正交路径', () => {
        const a: EdgeAnchor = { exit: port(rect(0, 100), 'right'), exitSide: 'right', entry: port(rect(600, 100), 'left'), entrySide: 'left' };
        const pts = routeAvoidingObstacles(a, [rect(280, 96)]);
        expect(pts).not.toBeNull();
        expect(isOrthogonal(pts!)).toBe(true);
    });
});
describe('assignPorts 端口分配', () => {
    it('同节点同侧的多条边分布到不同端口（不重叠）', () => {
        const nodes: Record<string, Rect> = {
            g: rect(0, 200),
            a: rect(400, 100), b: rect(400, 200), c: rect(400, 300),
        };
        const anchors = assignPorts(nodes, [
            { id: 'e1', source: 'g', target: 'a' },
            { id: 'e2', source: 'g', target: 'b' },
            { id: 'e3', source: 'g', target: 'c' },
        ]);
        const ys = ['e1', 'e2', 'e3'].map(id => anchors[id].exit.y);
        const unique = new Set(ys.map(y => Math.round(y)));
        expect(unique.size).toBe(3); // 三个出口 y 互不相同
        expect(anchors.e1.exitSide).toBe('right');
    });
    it('缺失节点的边被跳过', () => {
        const anchors = assignPorts({ a: rect(0, 0) }, [{ id: 'x', source: 'a', target: 'missing' }]);
        expect(anchors.x).toBeUndefined();
    });
});
