import { type ReactNode } from 'react';
import { act, beforeAll, describe, expect, it, mock, render } from '@crab-dev/wake/test/react';
import type { ElkLayoutResult } from '../hooks/useElkLayout.js';
import type { FlowDiagramRenderContext } from '../flow-diagram.js';

let finish: ((result: ElkLayoutResult) => void) | undefined;
const compute = mock.fn(() => new Promise<ElkLayoutResult>(resolve => { finish = resolve; }));
mock.module('../layout.js', () => ({ computeFlowLayout: compute }));
mock.module('@crab-dev/rc-canvas', () => ({
    Canvas: ({ children }: { children: ReactNode }) => <>{children}</>,
    Viewport: ({ children }: { children: ReactNode }) => <>{children}</>,
    InfiniteGrid: () => null,
    useCanvasControls: () => ({ centerOn() {} }),
    assignPorts: () => ({}),
}));
let FlowDiagram: (typeof import('../flow-diagram.js'))['default'];
beforeAll(async () => { FlowDiagram = (await mock.import<typeof import('../flow-diagram.js')>('../flow-diagram.js')).default; });

describe('controlled diagram layout', () => {
    it('renders saved positions immediately and preserves the viewport when asynchronous layout completes', async () => {
        let captured: FlowDiagramRenderContext | undefined;
        const changed = mock.fn();
        await render(<FlowDiagram nodes={[{ id: 'saved', width: 100, height: 40 }, { id: 'new', width: 100, height: 40 }]} edges={[]}
            nodePositions={{ saved: { x: 25, y: 70 } }} viewport={{ zoom: 1, panX: 20, panY: 30 }} onViewportChange={changed}>
            {context => { captured = context; return null; }}
        </FlowDiagram>);
        expect(captured!.nodeRects.saved).toEqual({ x: 25, y: 70, width: 100, height: 40 });
        expect(captured!.nodeRects.new).toBeUndefined();
        await act(async () => { finish!({ nodes: { saved: { x: 0, y: 0, width: 100, height: 40 }, new: { x: 250, y: 0, width: 100, height: 40 } }, edges: {} }); });
        expect(captured!.nodeRects.saved.x).toBe(25);
        expect(captured!.nodeRects.new.x).toBe(250);
        expect(captured!.zoom).toBe(1);
        expect(changed.calls.calls.length).toBe(0);
    });
    it('does not start ELK in manual mode', async () => {
        const before = compute.calls.calls.length;
        let captured: FlowDiagramRenderContext | undefined;
        await render(<FlowDiagram layoutMode="manual" nodes={[{ id: 'a', width: 100, height: 40 }]} edges={[]} nodePositions={{ a: { x: 30, y: 50 } }}>
            {context => { captured = context; return null; }}
        </FlowDiagram>);
        expect(compute.calls.calls.length).toBe(before);
        expect(captured!.loading).toBe(false);
        expect(captured!.nodeRects.a).toEqual({ x: 30, y: 50, width: 100, height: 40 });
    });
});
