import { describe, it, expect, jest, afterEach } from '@jest/globals';
import { render, cleanup, act } from '@testing-library/react';
import React, { type ReactNode } from 'react';
import Rect from '../shapes/rect.js';
import { CanvasContext, type CanvasContextValue } from '../context/canvas-context.js';
import { identityMat3 } from '../math/matrix.js';

(globalThis as Record<string, unknown>).IS_REACT_ACT_ENVIRONMENT = true;

afterEach(() => cleanup());

const IDENTITY = identityMat3();

function makeCtxMock() {
    let idCounter = 0;
    return {
        register: jest.fn(() => idCounter++),
        update: jest.fn(),
        unregister: jest.fn(),
        uploadTexture: jest.fn(),
        uploadGlyph: jest.fn(),
        registerHit: jest.fn(),
        unregisterHit: jest.fn(),
        updateHit: jest.fn(),
        nextId: jest.fn(() => idCounter++),
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
        exportPNG: jest.fn(() => ''),
        setViewMatrix: jest.fn(),
        subscribeCanvasEvent: jest.fn(() => () => {}),
    } satisfies CanvasContextValue;
}

function TestWrapper({ children, ctx }: { children: ReactNode; ctx: CanvasContextValue }) {
    return <CanvasContext value={ctx}>{children}</CanvasContext>;
}

describe('Rect', () => {
    it('mount 时向 Context 注册一条 DrawCommand', () => {
        const ctx = makeCtxMock();
        render(
            <TestWrapper ctx={ctx}>
                <Rect x={0} y={0} width={100} height={50} />
            </TestWrapper>,
        );
        expect(ctx.register).toHaveBeenCalledTimes(1);
    });

    it('无圆角时注册 flat-rect 命令', () => {
        const ctx = makeCtxMock();
        render(
            <TestWrapper ctx={ctx}>
                <Rect x={10} y={20} width={100} height={50} fill="#ff0000" />
            </TestWrapper>,
        );
        const cmd = (ctx.register as jest.Mock).mock.calls[0]?.[0] as { kind: string };
        expect(cmd.kind).toBe('flat-rect');
    });

    it('有圆角时注册 sdf-rect 命令', () => {
        const ctx = makeCtxMock();
        render(
            <TestWrapper ctx={ctx}>
                <Rect x={0} y={0} width={100} height={50} radius={8} />
            </TestWrapper>,
        );
        const cmd = (ctx.register as jest.Mock).mock.calls[0]?.[0] as { kind: string; radius: number };
        expect(cmd.kind).toBe('sdf-rect');
        expect(cmd.radius).toBe(8);
    });

    it('unmount 时调用 unregister 清理 DrawCommand', () => {
        const ctx = makeCtxMock();
        const { unmount } = render(
            <TestWrapper ctx={ctx}>
                <Rect x={0} y={0} width={100} height={50} />
            </TestWrapper>,
        );
        unmount();
        expect(ctx.unregister).toHaveBeenCalledWith(0);
    });

    it('props 变化时调用 update 更新 DrawCommand', async () => {
        const ctx = makeCtxMock();
        const { rerender } = render(
            <TestWrapper ctx={ctx}>
                <Rect x={0} y={0} width={100} height={50} fill="#ff0000" />
            </TestWrapper>,
        );
        await act(async () => {
            rerender(
                <TestWrapper ctx={ctx}>
                    <Rect x={10} y={10} width={200} height={100} fill="#0000ff" />
                </TestWrapper>,
            );
        });
        expect(ctx.update).toHaveBeenCalled();
        const lastCall = (ctx.update as jest.Mock).mock.calls.at(-1) as [number, { x: number }];
        expect(lastCall[1].x).toBe(10);
    });

    it('fill 颜色被正确解析为归一化 rgba', () => {
        const ctx = makeCtxMock();
        render(
            <TestWrapper ctx={ctx}>
                <Rect x={0} y={0} width={100} height={50} fill="#ff0000" />
            </TestWrapper>,
        );
        const cmd = (ctx.register as jest.Mock).mock.calls[0]?.[0] as { fill: number[] };
        expect(cmd.fill[0]).toBeCloseTo(1);
        expect(cmd.fill[1]).toBeCloseTo(0);
        expect(cmd.fill[2]).toBeCloseTo(0);
        expect(cmd.fill[3]).toBeCloseTo(1);
    });

    it('opacity 影响 fill 的 alpha 通道', () => {
        const ctx = makeCtxMock();
        render(
            <TestWrapper ctx={ctx}>
                <Rect x={0} y={0} width={100} height={50} fill="#ffffff" opacity={0.5} />
            </TestWrapper>,
        );
        const cmd = (ctx.register as jest.Mock).mock.calls[0]?.[0] as { fill: number[] };
        expect(cmd.fill[3]).toBeCloseTo(0.5);
    });

    it('zIndexPath 追加到 parentZIndexPath', () => {
        const ctx = { ...makeCtxMock(), parentZIndexPath: [10] };
        render(
            <TestWrapper ctx={ctx}>
                <Rect x={0} y={0} width={100} height={50} zIndex={5} />
            </TestWrapper>,
        );
        const cmd = (ctx.register as jest.Mock).mock.calls[0]?.[0] as { zIndexPath: number[] };
        expect(cmd.zIndexPath).toEqual([10, 5]);
    });

    it('return null：不渲染任何 DOM 节点', () => {
        const ctx = makeCtxMock();
        const { container } = render(
            <TestWrapper ctx={ctx}>
                <Rect x={0} y={0} width={100} height={50} />
            </TestWrapper>,
        );
        expect(container.childElementCount).toBe(0);
    });
});
