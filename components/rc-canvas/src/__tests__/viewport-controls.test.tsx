import { use, useEffect, type ReactNode } from 'react';
import { act, describe, expect, it, mock, render } from '@crab-dev/wake/test/react';
import { CanvasContext, type CanvasContextValue } from '../context/canvas-context.js';
import { identityMat3 } from '../math/matrix.js';
import Viewport from '../viewport.js';
import { useCanvasControls, type CanvasControls } from '../hooks/useCanvasControls.js';

function Context({ value, children }: { value: Partial<CanvasContextValue>; children: ReactNode }) {
    const defaults = use(CanvasContext);
    return <CanvasContext value={{ ...defaults, ...value }}>{children}</CanvasContext>;
}

describe('viewport commands', () => {
    it('honors viewport limits, keeps zoom pivots fixed and reads the latest callback', async () => {
        const matrix = { current: identityMat3() };
        const context: Partial<CanvasContextValue> = { viewMatrixRef: matrix, canvasSizeRef: { current: { width: 400, height: 300 } }, setViewMatrix: value => { matrix.current = value; },
            viewportControlsRef: { current: null }, seekPanRef: { current: null }, applyZoomRef: { current: null }, fitViewRef: { current: null } };
        let controls: CanvasControls | undefined;
        function Probe() {
            const value = useCanvasControls();
            useEffect(() => { controls = value; });
            return null;
        }
        const first = mock.fn(), latest = mock.fn();
        const fixture = (callback: typeof first) => <Context value={context}><Viewport pannable={false} zoomable={false} minZoom={0.5} maxZoom={2} onViewportChange={callback}><Probe /></Viewport></Context>;
        const view = await render(fixture(first));
        expect(first.calls.calls.length).toBe(0);
        await act(async () => { controls!.setViewport({ zoom: 1, panX: 20, panY: 30 }); controls!.zoomTo(10, { x: 100, y: 100 }); });
        expect(controls!.getViewport()).toEqual({ zoom: 2, panX: -60, panY: -40 });
        await view.rerender(fixture(latest));
        await act(async () => { controls!.fitBounds({ x: 100, y: 50, width: 10, height: 10 }, { maxZoom: 20, padding: 0 }); });
        expect(controls!.getViewport()).toEqual({ zoom: 2, panX: -10, panY: 40 });
        expect(latest.calls.calls.length).toBe(1);
        await act(async () => { controls!.centerOn({ x: -20, y: 10 }); });
        expect(controls!.getViewport()).toEqual({ zoom: 2, panX: 240, panY: 130 });
        await act(async () => { controls!.setViewport({ zoom: NaN, panX: 0, panY: 0 }); });
        expect(latest.calls.calls.length).toBe(2);
        await act(async () => { controls!.zoomTo(0.9); });
        expect(controls!.getViewport().zoom).toBe(0.9);
    });
});
