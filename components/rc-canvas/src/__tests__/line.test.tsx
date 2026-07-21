import { describe, it, expect, jest, afterEach } from '@jest/globals';
import { render, cleanup } from '@testing-library/react';
import React, { type ReactNode } from 'react';
import Line from '../shapes/line.js';
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

describe('Line', () => {
    it('mount 时注册 line 命令并携带端点与线宽', () => {
        const ctx = makeCtxMock();
        render(
            <TestWrapper ctx={ctx}>
                <Line x1={0} y1={0} x2={100} y2={50} lineWidth={2} />
            </TestWrapper>,
        );
        const cmd = (ctx.register as jest.Mock).mock.calls[0]?.[0] as {
            kind: string; x1: number; y1: number; x2: number; y2: number; lineWidth: number;
        };
        expect(cmd.kind).toBe('line');
        expect(cmd.x1).toBe(0);
        expect(cmd.x2).toBe(100);
        expect(cmd.y2).toBe(50);
        expect(cmd.lineWidth).toBe(2);
    });

    it('flowSpeed / dashPhase 透传到 DrawCommand', () => {
        const ctx = makeCtxMock();
        render(
            <TestWrapper ctx={ctx}>
                <Line x1={0} y1={0} x2={100} y2={0} dashLength={6} gapLength={4} flowSpeed={24} dashPhase={42} />
            </TestWrapper>,
        );
        const cmd = (ctx.register as jest.Mock).mock.calls[0]?.[0] as {
            dashLength: number; gapLength: number; flowSpeed: number; dashPhase: number;
        };
        expect(cmd.dashLength).toBe(6);
        expect(cmd.gapLength).toBe(4);
        expect(cmd.flowSpeed).toBe(24);
        expect(cmd.dashPhase).toBe(42);
    });

    it('未设置 flowSpeed 时命令中为 undefined（静态虚线）', () => {
        const ctx = makeCtxMock();
        render(
            <TestWrapper ctx={ctx}>
                <Line x1={0} y1={0} x2={100} y2={0} dashLength={6} gapLength={4} />
            </TestWrapper>,
        );
        const cmd = (ctx.register as jest.Mock).mock.calls[0]?.[0] as { flowSpeed?: number; dashPhase?: number };
        expect(cmd.flowSpeed).toBeUndefined();
        expect(cmd.dashPhase).toBeUndefined();
    });

    it('unmount 时注销命令', () => {
        const ctx = makeCtxMock();
        const { unmount } = render(
            <TestWrapper ctx={ctx}>
                <Line x1={0} y1={0} x2={100} y2={0} flowSpeed={24} dashLength={6} />
            </TestWrapper>,
        );
        unmount();
        expect(ctx.unregister).toHaveBeenCalledWith(0);
    });
});
