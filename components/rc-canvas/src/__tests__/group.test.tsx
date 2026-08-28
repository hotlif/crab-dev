import { describe, it, expect, mock, render } from "@crab-dev/wake/test/react";
import type { MockFunction } from "@crab-dev/wake/test";
import React, { type ReactNode } from 'react';
import Group from '../shapes/group.js';
import Rect from '../shapes/rect.js';
import { CanvasContext, type CanvasContextValue } from '../context/canvas-context.js';
import { identityMat3, applyMat3 } from '../math/matrix.js';
(globalThis as Record<string, unknown>).IS_REACT_ACT_ENVIRONMENT = true;
const IDENTITY = identityMat3();
function makeCtxMock() {
    let idCounter = 0;
    return {
        register: mock.fn(() => idCounter++),
        update: mock.fn(),
        unregister: mock.fn(),
        uploadTexture: mock.fn(),
        uploadGlyph: mock.fn(),
        registerHit: mock.fn(),
        unregisterHit: mock.fn(),
        updateHit: mock.fn(),
        nextId: mock.fn(() => idCounter++),
        parentMatrix: IDENTITY,
        parentZIndexPath: [],
        viewMatrixRef: { current: IDENTITY },
        commandMapRef: { current: new Map() },
        canvasSizeRef: { current: { width: 800, height: 600 } },
        dprRef: { current: 1 },
        seekPanRef: { current: null },
        applyZoomRef: { current: null },
        fitViewRef: { current: null },
        containerRef: { current: null },
        exportPNG: mock.fn(() => ''),
        setViewMatrix: mock.fn(),
        subscribeCanvasEvent: mock.fn(() => () => { }),
    } satisfies CanvasContextValue;
}
function TestWrapper({ children, ctx }: {
    children: ReactNode;
    ctx: CanvasContextValue;
}) {
    return <CanvasContext value={ctx}>{children}</CanvasContext>;
}
describe('Group', () => {
    it('平移：子组件 worldMatrix 将 (0,0) 映射到 (x, y)', async () => {
        const ctx = makeCtxMock();
        await render(<TestWrapper ctx={ctx}>
            <Group x={30} y={50}>
                <Rect x={0} y={0} width={10} height={10}/>
            </Group>
        </TestWrapper>);
        const cmd = (ctx.register as MockFunction).calls.calls[0]?.[0] as {
            worldMatrix: Float32Array;
        };
        const [ox, oy] = applyMat3(cmd.worldMatrix, 0, 0);
        expect(ox).toBeCloseTo(30);
        expect(oy).toBeCloseTo(50);
    });
    it('缩放：子组件 worldMatrix 将 (1,1) 映射到 (scaleX, scaleY)', async () => {
        const ctx = makeCtxMock();
        await render(<TestWrapper ctx={ctx}>
            <Group scaleX={3} scaleY={2}>
                <Rect x={0} y={0} width={10} height={10}/>
            </Group>
        </TestWrapper>);
        const cmd = (ctx.register as MockFunction).calls.calls[0]?.[0] as {
            worldMatrix: Float32Array;
        };
        const [ox, oy] = applyMat3(cmd.worldMatrix, 1, 1);
        expect(ox).toBeCloseTo(3);
        expect(oy).toBeCloseTo(2);
    });
    it('旋转 90°：(1,0) 映射到 (0,1)', async () => {
        const ctx = makeCtxMock();
        await render(<TestWrapper ctx={ctx}>
            <Group rotation={Math.PI / 2}>
                <Rect x={0} y={0} width={10} height={10}/>
            </Group>
        </TestWrapper>);
        const cmd = (ctx.register as MockFunction).calls.calls[0]?.[0] as {
            worldMatrix: Float32Array;
        };
        const [ox, oy] = applyMat3(cmd.worldMatrix, 1, 0);
        expect(ox).toBeCloseTo(0);
        expect(oy).toBeCloseTo(1);
    });
    it('嵌套 Group：矩阵叠加，平移 (10,0) 内再平移 (5,0)，合计 (15,0)', async () => {
        const ctx = makeCtxMock();
        await render(<TestWrapper ctx={ctx}>
            <Group x={10} y={0}>
                <Group x={5} y={0}>
                    <Rect x={0} y={0} width={10} height={10}/>
                </Group>
            </Group>
        </TestWrapper>);
        const cmd = (ctx.register as MockFunction).calls.calls[0]?.[0] as {
            worldMatrix: Float32Array;
        };
        const [ox, oy] = applyMat3(cmd.worldMatrix, 0, 0);
        expect(ox).toBeCloseTo(15);
        expect(oy).toBeCloseTo(0);
    });
    it('zIndexPath：Group 将自身 zIndex 追加到路径，子 Rect 再追加自身 zIndex', async () => {
        const ctx = makeCtxMock();
        await render(<TestWrapper ctx={ctx}>
            <Group zIndex={10}>
                <Rect x={0} y={0} width={10} height={10} zIndex={3}/>
            </Group>
        </TestWrapper>);
        const cmd = (ctx.register as MockFunction).calls.calls[0]?.[0] as {
            zIndexPath: number[];
        };
        expect(cmd.zIndexPath).toEqual([10, 3]);
    });
    it('无 children 时不报错', async () => {
        const ctx = makeCtxMock();
        await render(<TestWrapper ctx={ctx}><Group /></TestWrapper>);
    });
    it('不注册 DrawCommand，只传递 Context', async () => {
        const ctx = makeCtxMock();
        await render(<TestWrapper ctx={ctx}>
            <Group x={5} y={5}/>
        </TestWrapper>);
        expect(ctx.register).not.toHaveBeenCalled();
    });
});
