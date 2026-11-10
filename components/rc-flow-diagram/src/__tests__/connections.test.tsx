import { describe, expect, it, mock } from '@crab-dev/wake/test';
import { act, renderHook } from '@crab-dev/wake/test/react';
import type { FlowPort } from '../types.js';
import { useFlowConnections } from '../hooks/useFlowConnections.js';

const ports: FlowPort[] = [
    { nodeId: 'a', portId: 'approved', direction: 'output', side: 'bottom', position: { x: 20, y: 20 } },
    { nodeId: 'b', portId: 'id', direction: 'input', side: 'top', position: { x: 200, y: 100 } },
    { nodeId: 'c', portId: 'id', direction: 'input', side: 'top', position: { x: 320, y: 100 } },
];
const edges = [{ id: 'edge', source: ports[0], target: ports[1] }];
const routes = { edge: { points: [{ x: 20, y: 20 }, { x: 20, y: 60 }, { x: 200, y: 60 }, { x: 200, y: 100 }] } };

function surface(zoom = 1) {
    const element = document.createElement('div'), canvas = document.createElement('canvas');
    element.appendChild(canvas);
    // DOM 测试没有布局；仅补充真实浏览器容器位置和 pointer capture 契约。
    canvas.getBoundingClientRect = () => ({ left: 30, top: 40, right: 1030, bottom: 640, width: 1000, height: 600, x: 30, y: 40, toJSON: () => ({}) });
    let captured = false;
    element.setPointerCapture = () => { captured = true; };
    element.hasPointerCapture = () => captured;
    element.releasePointerCapture = () => { captured = false; };
    const viewport = { zoom, panX: 10, panY: 15 };
    const event = (x: number, y: number, pointerId = 1) => ({ pointerId, button: 0, clientX: 30 + 10 + x * zoom, clientY: 40 + 15 + y * zoom,
        target: canvas, preventDefault() {}, stopPropagation() {},
    });
    return { element, event, viewport, containerRef: { current: element }, captured: () => captured };
}

describe('flow connection gestures', () => {
    it('commits stable port IDs once, independently of zoom, after the final pointer position', async () => {
        for (const zoom of [0.5, 2]) {
            const ui = surface(zoom), connect = mock.fn();
            const view = await renderHook(() => useFlowConnections({ ports, edges, routes, ...ui, revision: 1, onConnect: connect }));
            await act(async () => { view.result.current.handlers.onPointerDownCapture(ui.event(20 + 4 / zoom, 20)); });
            expect(ui.captured()).toBe(true);
            await act(async () => { view.result.current.handlers.onPointerMoveCapture(ui.event(200, 100)); });
            expect(connect.calls.calls.length).toBe(0);
            await act(async () => {
                view.result.current.handlers.onPointerUpCapture(ui.event(320, 100));
                view.result.current.handlers.onPointerUpCapture(ui.event(320, 100));
            });
            expect(connect.calls.calls).toEqual([[{ source: { nodeId: 'a', portId: 'approved' }, target: { nodeId: 'c', portId: 'id' } }]]);
            expect(ui.captured()).toBe(false);
            await view.unmount();
        }
    });
    it('reconnects an endpoint while retaining the edge ID and fixed endpoint', async () => {
        const ui = surface(), connect = mock.fn();
        const view = await renderHook(() => useFlowConnections({ ports, edges, routes, ...ui, revision: 1, selectedEdgeId: 'edge', onConnect: connect }));
        await act(async () => { view.result.current.handlers.onPointerDownCapture(ui.event(200, 100)); view.result.current.handlers.onPointerUpCapture(ui.event(320, 100)); });
        expect(connect.calls.calls).toEqual([[{ edgeId: 'edge', source: { nodeId: 'a', portId: 'approved' }, target: { nodeId: 'c', portId: 'id' } }]]);
    });
    it('rejects invalid targets and cancels on document changes, pointer cancellation and release outside the canvas', async () => {
        const ui = surface(), connect = mock.fn();
        const view = await renderHook(({ revision }) => useFlowConnections({ ports, edges, routes, ...ui, revision, onConnect: connect,
            validateConnection: change => change.target.nodeId === 'c' ? 'incompatible fields' : null }), { initialProps: { revision: 1 } });
        await act(async () => { view.result.current.handlers.onPointerDownCapture(ui.event(20, 20)); view.result.current.handlers.onPointerUpCapture(ui.event(320, 100)); });
        expect(view.result.current.problem).toBe('incompatible fields');
        await act(async () => { view.result.current.handlers.onPointerDownCapture(ui.event(20, 20)); });
        await view.rerender({ revision: 2 });
        await act(async () => { view.result.current.handlers.onPointerUpCapture(ui.event(200, 100)); });
        await act(async () => { view.result.current.handlers.onPointerDownCapture(ui.event(20, 20)); view.result.current.handlers.onPointerCancel(ui.event(200, 100)); });
        await act(async () => { view.result.current.handlers.onPointerDownCapture(ui.event(20, 20)); view.result.current.handlers.onPointerUpCapture(ui.event(1200, 100)); });
        expect(connect.calls.calls.length).toBe(0);
        expect(ui.captured()).toBe(false);
    });
    it('previews a segment, commits once, and emits an explicit reset intent', async () => {
        const ui = surface(), change = mock.fn();
        const view = await renderHook(() => useFlowConnections({ ports, edges, routes, ...ui, revision: 1, selectedEdgeId: 'edge', onRouteChange: change }));
        await act(async () => { view.result.current.handlers.onPointerDownCapture(ui.event(100, 60)); view.result.current.handlers.onPointerMoveCapture(ui.event(100, 90)); });
        expect(view.result.current.routes.edge.points[1].y).toBe(90);
        expect(routes.edge.points[1].y).toBe(60);
        expect(change.calls.calls.length).toBe(0);
        await act(async () => { view.result.current.handlers.onPointerUpCapture(ui.event(100, 95)); });
        expect(change.calls.calls.length).toBe(1);
        expect(change.calls.calls[0][0]).toEqual({ edgeId: 'edge', points: [{ x: 20, y: 20 }, { x: 20, y: 95 }, { x: 200, y: 95 }, { x: 200, y: 100 }] });
        await act(async () => { view.result.current.resetRoute('edge'); });
        expect(change.calls.calls[1]).toEqual([{ edgeId: 'edge', points: null }]);
    });
});
