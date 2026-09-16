import { afterEach, beforeAll, describe, expect, it, mock, render } from '@crab-dev/wake/test/react';
import { type ReactNode } from 'react';
import { FlowDiagramPaletteContext } from '../palette-context.js';
import type { FlowDiagramPalette } from '../palette.js';

(globalThis as Record<string, unknown>).IS_REACT_ACT_ENVIRONMENT = true;

interface CapturedRectProps {
    fill?: string;
    stroke?: string;
}

interface CapturedTextProps {
    fill?: string;
}

interface CapturedLineProps {
    color?: string;
}

interface CapturedGridProps {
    color?: string;
}

const capturedRects: CapturedRectProps[] = [];
const capturedTexts: CapturedTextProps[] = [];
const capturedLines: CapturedLineProps[] = [];
const capturedGrids: CapturedGridProps[] = [];

mock.module('@crab-dev/rc-canvas', () => ({
    Canvas: ({ children }: { children?: ReactNode }) => <>{children}</>,
    Viewport: ({ children }: { children?: ReactNode }) => <>{children}</>,
    InfiniteGrid: (props: CapturedGridProps) => {
        capturedGrids.push(props);
        return null;
    },
    useCanvasControls: () => ({
        fitView: () => { },
        exportPNG: () => '',
        zoomIn: () => { },
        zoomOut: () => { },
    }),
    Group: ({ children }: { children?: ReactNode }) => <>{children}</>,
    Rect: (props: CapturedRectProps) => {
        capturedRects.push(props);
        return null;
    },
    Text: (props: CapturedTextProps & { children?: ReactNode }) => {
        capturedTexts.push(props);
        return null;
    },
    Line: (props: CapturedLineProps) => {
        capturedLines.push(props);
        return null;
    },
    Marker: () => null,
    assignPorts: () => ({}),
}));

mock.module('elkjs/lib/elk.bundled.js', () => ({
    __esModule: true,
    default: class {
        async layout() {
            return { children: [], edges: [] };
        }
    },
}));

mock.module('../hooks/useElkLayout.js', () => ({
    useElkLayout: () => ({
        layout: { nodes: {}, edges: {} },
        loading: false,
        error: null,
    }),
}));

mock.module('../hooks/useEdgeRouting.js', () => ({
    useEdgeRouting: () => ({}),
}));

mock.module('../hooks/useEdgeCrossings.js', () => ({
    useEdgeCrossings: () => ({}),
}));

let FlowNode: (typeof import('../flow-node.js'))['default'];
let FlowEdge: (typeof import('../flow-edge.js'))['default'];
let FlowDiagram: (typeof import('../flow-diagram.js'))['default'];

beforeAll(async () => {
    FlowNode = (await mock.import<typeof import('../flow-node.js')>('../flow-node.js')).default;
    FlowEdge = (await mock.import<typeof import('../flow-edge.js')>('../flow-edge.js')).default;
    FlowDiagram = (await mock.import<typeof import('../flow-diagram.js')>('../flow-diagram.js')).default;
});

afterEach(() => {
    capturedRects.length = 0;
    capturedTexts.length = 0;
    capturedLines.length = 0;
    capturedGrids.length = 0;
});

const palette: FlowDiagramPalette = {
    grid: 'grid',
    nodeFill: 'palette-fill',
    nodeStroke: 'palette-stroke',
    nodeLabel: 'palette-label',
    edge: 'edge',
};

describe('FlowNode palette', () => {
    it('palette 提供缺省色，显式旧 props 保持最高优先级', async () => {
        const { rerender } = await render(
            <FlowDiagramPaletteContext value={palette}>
                <FlowNode x={0} y={0} width={100} height={40} label="节点" />
            </FlowDiagramPaletteContext>,
        );
        expect(capturedRects.at(-1)?.fill).toBe('palette-fill');
        expect(capturedRects.at(-1)?.stroke).toBe('palette-stroke');
        expect(capturedTexts.at(-1)?.fill).toBe('palette-label');

        await rerender(
            <FlowDiagramPaletteContext value={palette}>
                <FlowNode
                    x={0}
                    y={0}
                    width={100}
                    height={40}
                    label="节点"
                    fill="legacy-fill"
                    stroke="legacy-stroke"
                    labelColor="legacy-label"
                />
            </FlowDiagramPaletteContext>,
        );
        expect(capturedRects.at(-1)?.fill).toBe('legacy-fill');
        expect(capturedRects.at(-1)?.stroke).toBe('legacy-stroke');
        expect(capturedTexts.at(-1)?.fill).toBe('legacy-label');
    });
});

describe('FlowDiagram palette', () => {
    it('gridColor 优先于 palette.grid，合并后的 context 被节点与边实际消费', async () => {
        const receivedPalettes: FlowDiagramPalette[] = [];
        const diagramPalette: Partial<FlowDiagramPalette> = {
            grid: 'palette-grid',
            nodeFill: 'diagram-node-fill',
            nodeStroke: 'diagram-node-stroke',
            nodeLabel: 'diagram-node-label',
            edge: 'diagram-edge',
        };
        const children = (ctx: { palette: FlowDiagramPalette }) => {
            receivedPalettes.push(ctx.palette);
            return (
                <>
                    <FlowNode x={0} y={0} width={100} height={40} label="节点" />
                    <FlowEdge
                        points={[{ x: 0, y: 0 }, { x: 10, y: 0 }]}
                        arrowEnd={false}
                    />
                </>
            );
        };

        const { rerender } = await render(
            <FlowDiagram
                nodes={[]}
                edges={[]}
                palette={diagramPalette}
                gridColor="explicit-grid"
            >
                {children}
            </FlowDiagram>,
        );

        expect(capturedGrids.at(-1)?.color).toBe('explicit-grid');
        expect(receivedPalettes.at(-1)?.grid).toBe('palette-grid');
        expect(capturedRects.at(-1)?.fill).toBe('diagram-node-fill');
        expect(capturedRects.at(-1)?.stroke).toBe('diagram-node-stroke');
        expect(capturedTexts.at(-1)?.fill).toBe('diagram-node-label');
        expect(capturedLines.at(-1)?.color).toBe('diagram-edge');

        await rerender(
            <FlowDiagram nodes={[]} edges={[]} palette={diagramPalette}>
                {children}
            </FlowDiagram>,
        );
        expect(capturedGrids.at(-1)?.color).toBe('palette-grid');
    });
});
