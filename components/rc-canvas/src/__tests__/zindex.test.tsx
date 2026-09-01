import { describe, it, expect, mock, render } from "@crab-dev/wake/test/react";
import type { MockFunction } from "@crab-dev/wake/test";
import React, { type ReactNode } from 'react';
import Group from '../shapes/group.js';
import Rect from '../shapes/rect.js';
import { CanvasContext, type CanvasContextValue } from '../context/canvas-context.js';
import { identityMat3 } from '../math/matrix.js';
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
describe('zIndexPath - Stacking Context 语义', () => {
    it('根级别叶子的 zIndexPath = [zIndex]', async () => {
        const ctx = makeCtxMock();
        await render(<TestWrapper ctx={ctx}>
            <Rect x={0} y={0} width={10} height={10} zIndex={5}/>
        </TestWrapper>);
        const cmd = (ctx.register as MockFunction).calls.calls[0]?.[0] as {
            zIndexPath: number[];
        };
        expect(cmd.zIndexPath).toEqual([5]);
    });
    it('Group 内叶子的 zIndexPath = [groupZIndex, leafZIndex]', async () => {
        const ctx = makeCtxMock();
        await render(<TestWrapper ctx={ctx}>
            <Group zIndex={0}>
                <Rect x={0} y={0} width={10} height={10} zIndex={100}/>
            </Group>
        </TestWrapper>);
        const cmd = (ctx.register as MockFunction).calls.calls[0]?.[0] as {
            zIndexPath: number[];
        };
        expect(cmd.zIndexPath).toEqual([0, 100]);
    });
    it('Group(zIndex=1) 内的元素路径 > Group(zIndex=0) 内的高 zIndex 元素', async () => {
        const ctx = makeCtxMock();
        await render(<TestWrapper ctx={ctx}>
            <Group zIndex={0}>
                <Rect x={0} y={0} width={10} height={10} zIndex={100}/>
            </Group>
            <Group zIndex={1}>
                <Rect x={0} y={0} width={10} height={10} zIndex={0}/>
            </Group>
        </TestWrapper>);
        const calls = (ctx.register as MockFunction).calls.calls as Array<[
            {
                zIndexPath: number[];
            }
        ]>;
        const path0 = calls[0]![0].zIndexPath; // Group(0) 内 Rect(100) → [0, 100]
        const path1 = calls[1]![0].zIndexPath; // Group(1) 内 Rect(0) → [1, 0]
        expect(path0).toEqual([0, 100]);
        expect(path1).toEqual([1, 0]);
        // 字典序：[1, 0] > [0, 100]，即 Group(zIndex=1) 内的元素在更上层
        const cmp = (a: number[], b: number[]) => {
            const len = Math.max(a.length, b.length);
            for (let i = 0; i < len; i++) {
                const av = i < a.length ? a[i]! : -Infinity;
                const bv = i < b.length ? b[i]! : -Infinity;
                if (av !== bv)
                    return av - bv;
            }
            return 0;
        };
        expect(cmp(path1, path0)).toBeGreaterThan(0);
    });
    it('三层嵌套 Group：zIndexPath 正确追加', async () => {
        const ctx = makeCtxMock();
        await render(<TestWrapper ctx={ctx}>
            <Group zIndex={1}>
                <Group zIndex={2}>
                    <Rect x={0} y={0} width={10} height={10} zIndex={3}/>
                </Group>
            </Group>
        </TestWrapper>);
        const cmd = (ctx.register as MockFunction).calls.calls[0]?.[0] as {
            zIndexPath: number[];
        };
        expect(cmd.zIndexPath).toEqual([1, 2, 3]);
    });
    it('parentZIndexPath 非空时正确拼接', async () => {
        const ctx = { ...makeCtxMock(), parentZIndexPath: [5] };
        await render(<TestWrapper ctx={ctx}>
            <Group zIndex={2}>
                <Rect x={0} y={0} width={10} height={10} zIndex={1}/>
            </Group>
        </TestWrapper>);
        const cmd = (ctx.register as MockFunction).calls.calls[0]?.[0] as {
            zIndexPath: number[];
        };
        expect(cmd.zIndexPath).toEqual([5, 2, 1]);
    });
});
