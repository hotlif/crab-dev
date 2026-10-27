import { describe, it, expect, afterEach, beforeAll, mock } from '@crab-dev/wake/test';
import { render } from '@crab-dev/wake/test/react';
import token from '@crab-dev/rc-token-semantic';
import { FlowDiagramPaletteContext } from '../palette-context.js';
import type { FlowDiagramPalette } from '../palette.js';
(globalThis as Record<string, unknown>).IS_REACT_ACT_ENVIRONMENT = true;
interface CapturedLineProps {
    x1: number;
    y1: number;
    x2: number;
    y2: number;
    dashLength?: number;
    gapLength?: number;
    flowSpeed?: number;
    dashPhase?: number;
    color?: string;
}
interface CapturedMarkerProps {
    x: number;
    y: number;
    angle: number;
    fill?: string;
}
// DOM 环境不绘制 Canvas；保留真实 FlowEdge 的拆段与箭头逻辑，只捕获绘制原语的输入。
const mockCapturedLines: CapturedLineProps[] = [];
const mockCapturedMarkers: CapturedMarkerProps[] = [];
mock.module('@crab-dev/rc-canvas', () => ({
    Line: (props: CapturedLineProps) => {
        mockCapturedLines.push(props);
        return null;
    },
    Marker: (props: CapturedMarkerProps) => {
        mockCapturedMarkers.push(props);
        return null;
    },
}));
let FlowEdge: (typeof import("../flow-edge.js"))["default"];
beforeAll(async () => {
    const flowEdgeModule = await mock.import<typeof import("../flow-edge.js")>("../flow-edge.js");
    FlowEdge = flowEdgeModule.default;
});
afterEach(() => {
    mockCapturedLines.length = 0;
    mockCapturedMarkers.length = 0;
});
describe('FlowEdge 流动相位（dashPhase 累计弧长）', () => {
    it('L 形折线：各段 dashPhase 为前序段绘制长度之和', async () => {
        await render(<FlowEdge points={[{ x: 0, y: 0 }, { x: 100, y: 0 }, { x: 100, y: 50 }]} dashLength={6} gapLength={4} flowSpeed={24} arrowEnd={false}/>);
        expect(mockCapturedLines).toHaveLength(2);
        expect(mockCapturedLines[0].dashPhase).toBeCloseTo(0);
        expect(mockCapturedLines[1].dashPhase).toBeCloseTo(100);
    });
    it('flowSpeed 透传到每一段 Line', async () => {
        await render(<FlowEdge points={[{ x: 0, y: 0 }, { x: 100, y: 0 }, { x: 100, y: 50 }, { x: 200, y: 50 }]} dashLength={6} gapLength={4} flowSpeed={-30} arrowEnd={false}/>);
        expect(mockCapturedLines).toHaveLength(3);
        for (const line of mockCapturedLines) {
            expect(line.flowSpeed).toBe(-30);
        }
        expect(mockCapturedLines[2].dashPhase).toBeCloseTo(150);
    });
    it('终点箭头缩进不影响前序段的相位起点', async () => {
        await render(<FlowEdge points={[{ x: 0, y: 0 }, { x: 100, y: 0 }, { x: 100, y: 50 }]} dashLength={6} gapLength={4} flowSpeed={24} arrowEnd arrowSize={10}/>);
        expect(mockCapturedLines).toHaveLength(2);
        expect(mockCapturedLines[1].dashPhase).toBeCloseTo(100);
        // 末段因箭头缩进变短（50 - 10 * 0.62），但相位起点不变
        expect(mockCapturedLines[1].y2).toBeCloseTo(50 - 6.2);
    });
    it('交叉缺口子段：dashPhase 计入缺口前跳过的弧长，图案穿过缺口连续', async () => {
        await render(<FlowEdge points={[{ x: 0, y: 0 }, { x: 100, y: 0 }]} dashLength={6} gapLength={4} flowSpeed={24} arrowEnd={false} crossings={[{ x: 50, y: 0 }]} hopGap={10}/>);
        expect(mockCapturedLines).toHaveLength(2);
        // 缺口 [45, 55]：子段 1 为 0→45，子段 2 为 55→100
        expect(mockCapturedLines[0].dashPhase).toBeCloseTo(0);
        expect(mockCapturedLines[1].x1).toBeCloseTo(55);
        expect(mockCapturedLines[1].dashPhase).toBeCloseTo(55);
    });
    it('未设置 flowSpeed 时各段不带流动（静态虚线），dashPhase 仍连续', async () => {
        await render(<FlowEdge points={[{ x: 0, y: 0 }, { x: 60, y: 0 }, { x: 60, y: 80 }]} dashLength={6} gapLength={4} arrowEnd={false}/>);
        expect(mockCapturedLines).toHaveLength(2);
        expect(mockCapturedLines[0].flowSpeed).toBeUndefined();
        expect(mockCapturedLines[1].dashPhase).toBeCloseTo(60);
    });
    it('语义 CSS 变量更新同步到缺口两侧、转角和首尾箭头，保留流动速度与相位', async () => {
        const edge = (color: string) => (
            <FlowEdge
                points={[{ x: 0, y: 0 }, { x: 100, y: 0 }, { x: 100, y: 80 }]}
                crossings={[{ x: 50, y: 0 }]}
                hopGap={10}
                color={color}
                dashLength={6}
                gapLength={4}
                flowSpeed={-24}
                arrowStart
                arrowEnd
                arrowSize={10}
            />
        );
        const expectDrawingInputs = (color: string) => {
            expect(mockCapturedLines).toHaveLength(3);
            // 起点箭头缩进 6.2；缺口为 [45, 55]，转角在 (100, 0)。
            expect(mockCapturedLines[0].x1).toBeCloseTo(6.2);
            expect(mockCapturedLines[0].x2).toBeCloseTo(45);
            expect(mockCapturedLines[1].x1).toBeCloseTo(55);
            expect(mockCapturedLines[1].x2).toBeCloseTo(100);
            expect(mockCapturedLines[2].y2).toBeCloseTo(73.8);
            const phases = [0, 48.8, 93.8];
            for (const [index, line] of mockCapturedLines.entries()) {
                expect(line.color).toBe(color);
                expect(line.dashLength).toBe(6);
                expect(line.gapLength).toBe(4);
                expect(line.flowSpeed).toBe(-24);
                expect(line.dashPhase).toBeCloseTo(phases[index]);
            }
            expect(mockCapturedMarkers).toHaveLength(2);
            const start = mockCapturedMarkers.find(marker => marker.x === 0 && marker.y === 0);
            const end = mockCapturedMarkers.find(marker => marker.x === 100 && marker.y === 80);
            expect(start?.fill).toBe(color);
            expect(end?.fill).toBe(color);
            expect(start?.angle).toBeCloseTo(Math.PI);
            expect(end?.angle).toBeCloseTo(Math.PI / 2);
        };

        const { rerender } = await render(edge(token.color.brand.primary));
        expectDrawingInputs(token.color.brand.primary);

        mockCapturedLines.length = 0;
        mockCapturedMarkers.length = 0;
        await rerender(edge(token.color.feedback.success.icon));
        expectDrawingInputs(token.color.feedback.success.icon);
    });
    it('显式旧 color 优先于 context palette，否则使用 palette.edge', async () => {
        const palette: FlowDiagramPalette = {
            grid: 'grid',
            nodeFill: 'node-fill',
            nodeStroke: 'node-stroke',
            nodeLabel: 'node-label',
            edge: 'palette-edge',
        };
        const { rerender } = await render(
            <FlowDiagramPaletteContext value={palette}>
                <FlowEdge points={[{ x: 0, y: 0 }, { x: 10, y: 0 }]} arrowEnd={false}/>
            </FlowDiagramPaletteContext>,
        );
        expect(mockCapturedLines[0].color).toBe('palette-edge');

        mockCapturedLines.length = 0;
        await rerender(
            <FlowDiagramPaletteContext value={palette}>
                <FlowEdge points={[{ x: 0, y: 0 }, { x: 10, y: 0 }]} color="legacy-edge" arrowEnd={false}/>
            </FlowDiagramPaletteContext>,
        );
        expect(mockCapturedLines[0].color).toBe('legacy-edge');
    });
});
