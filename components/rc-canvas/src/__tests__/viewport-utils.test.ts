import { describe, expect, it } from '@crab-dev/wake/test';
import { screenToWorld, worldToScreen, zoomViewport, getViewportForBounds } from '../viewport-utils.js';

describe('viewport geometry', () => {
    it('round trips negative world positions with fractional zoom and pan', () => {
        const viewport = { zoom: 0.65, panX: 31.25, panY: -73.5 }, point = { x: -240, y: 190 };
        expect(screenToWorld(worldToScreen(point, viewport), viewport)).toEqual(point);
        const pivot = { x: 402, y: 205 };
        expect(screenToWorld(pivot, zoomViewport(viewport, 2, pivot))).toEqual(screenToWorld(pivot, viewport));
    });
    it('fits screen padding and respects maximum zoom without auto magnification', () => {
        const bounds = { x: -100, y: 40, width: 200, height: 100 };
        expect(getViewportForBounds(bounds, { width: 800, height: 600 }, { maxZoom: 1, padding: { left: 20, right: 60, top: 10, bottom: 90 } }))
            .toEqual({ zoom: 1, panX: 380, panY: 170 });
        expect(getViewportForBounds(bounds, { width: 0, height: 600 })).toBeNull();
        expect(getViewportForBounds({ ...bounds, width: NaN }, { width: 800, height: 600 })).toBeNull();
    });
});
