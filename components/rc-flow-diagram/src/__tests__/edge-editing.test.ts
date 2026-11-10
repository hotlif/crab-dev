import { describe, expect, it } from '@crab-dev/wake/test';
import { makeEditableRoute, moveEdgeSegment, reanchorEdgeRoute, hitTestEdges } from '../edge-editing.js';

describe('editable routes', () => {
    it('moves internal segments of horizontal and vertical straight edges without moving ports', () => {
        for (const points of [[{ x: 0, y: 0 }, { x: 120, y: 0 }], [{ x: 0, y: 0 }, { x: 0, y: 120 }]]) {
            const route = makeEditableRoute(points), moved = moveEdgeSegment(route, 1, { x: 25, y: 30 });
            expect(moved[0]).toEqual(points[0]);
            expect(moved[moved.length - 1]).toEqual(points[1]);
            expect(moved.every((p, i) => !i || p.x === moved[i - 1].x || p.y === moved[i - 1].y)).toBe(true);
            expect(route).toEqual(makeEditableRoute(points));
        }
    });
    it('reanchors all port orientations while retaining manual interior points', () => {
        const route = [{ x: 0, y: 0 }, { x: 0, y: 80 }, { x: 100, y: 80 }, { x: 100, y: 100 }];
        for (const side of ['top', 'bottom', 'left', 'right'] as const) {
            const points = reanchorEdgeRoute(route, { position: { x: 20, y: 10 }, side }, { position: { x: 200, y: 200 }, side })!;
            expect(points).toContainEqual(route[1]);
            expect(points).toContainEqual(route[2]);
            expect(points.every((p, i) => !i || p.x === points[i - 1].x || p.y === points[i - 1].y)).toBe(true);
        }
        expect(reanchorEdgeRoute([{ x: 0, y: 0 }], { position: route[0], side: 'bottom' }, { position: route[3], side: 'top' })).toBeNull();
    });
    it('uses screen tolerance for edge hits and excludes ineligible insertion targets', () => {
        const routes = { a: { points: [{ x: 0, y: 0 }, { x: 100, y: 0 }] }, b: { points: [{ x: 0, y: 5 }, { x: 100, y: 5 }] } };
        expect(hitTestEdges({ x: 50, y: 12 }, routes, { zoom: 2, tolerance: 8 })).toBeNull();
        expect(hitTestEdges({ x: 50, y: 12 }, routes, { zoom: 0.5, tolerance: 8, filter: id => id !== 'b' })).toBe('a');
    });
});
