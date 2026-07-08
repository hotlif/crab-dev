import { describe, it, expect, jest, beforeEach, afterEach } from '@jest/globals';
import { render, cleanup } from '@testing-library/react';
import React from 'react';
import { createWebGL2Mock } from './__mocks__/webgl-mock.js';
import Canvas from '../canvas.js';
import Line from '../shapes/line.js';

(globalThis as Record<string, unknown>).IS_REACT_ACT_ENVIRONMENT = true;

let glMock: WebGL2RenderingContext;
let rafCb: Parameters<typeof globalThis.requestAnimationFrame>[0] | null;

/** 手动驱动一帧渲染循环（tick 内部会重新注册下一帧回调） */
function stepFrame() {
    const cb = rafCb;
    rafCb = null;
    cb?.(performance.now());
}

/** renderer.render() 每次都会调用 gl.clear，以其调用次数计数实际重绘帧数 */
function renderCount(): number {
    return (glMock.clear as jest.Mock).mock.calls.length;
}

beforeEach(() => {
    glMock = createWebGL2Mock();
    jest.spyOn(HTMLCanvasElement.prototype, 'getContext').mockImplementation(
        (type: string) => (type === 'webgl2' ? (glMock as unknown as CanvasRenderingContext2D) : null),
    );
    rafCb = null;
    jest.spyOn(globalThis, 'requestAnimationFrame').mockImplementation(cb => {
        rafCb = cb;
        return 1;
    });
    jest.spyOn(globalThis, 'cancelAnimationFrame').mockImplementation(() => {});
});

afterEach(() => {
    cleanup();
    jest.restoreAllMocks();
});

describe('流动虚线渲染循环', () => {
    it('纯静态命令：首帧渲染后循环停驻（按需渲染）', () => {
        render(
            <Canvas width={400} height={300}>
                <Line x1={0} y1={0} x2={100} y2={0} dashLength={6} gapLength={4} />
            </Canvas>,
        );
        stepFrame();
        expect(renderCount()).toBe(1);
        stepFrame();
        stepFrame();
        expect(renderCount()).toBe(1);
    });

    it('存在 flowSpeed 命令：渲染循环逐帧持续重绘', () => {
        render(
            <Canvas width={400} height={300}>
                <Line x1={0} y1={0} x2={100} y2={0} dashLength={6} gapLength={4} flowSpeed={24} />
            </Canvas>,
        );
        stepFrame();
        stepFrame();
        stepFrame();
        expect(renderCount()).toBe(3);
    });

    it('动画命令注销后循环回到按需渲染', () => {
        const { rerender } = render(
            <Canvas width={400} height={300}>
                <Line x1={0} y1={0} x2={100} y2={0} dashLength={6} gapLength={4} flowSpeed={24} />
            </Canvas>,
        );
        stepFrame();
        expect(renderCount()).toBe(1);

        rerender(<Canvas width={400} height={300} />);
        stepFrame(); // 注销触发脏标记，重绘一帧
        const afterUnmountFrames = renderCount();
        stepFrame();
        stepFrame();
        expect(renderCount()).toBe(afterUnmountFrames); // 不再持续重绘
    });

    it('prefers-reduced-motion: reduce 时不持续重绘（降级为静态）', () => {
        const originalMatchMedia = window.matchMedia;
        window.matchMedia = jest.fn(() => ({
            matches: true,
            media: '(prefers-reduced-motion: reduce)',
            onchange: null,
            addEventListener: jest.fn(),
            removeEventListener: jest.fn(),
            addListener: jest.fn(),
            removeListener: jest.fn(),
            dispatchEvent: jest.fn(() => false),
        })) as unknown as typeof window.matchMedia;

        try {
            render(
                <Canvas width={400} height={300}>
                    <Line x1={0} y1={0} x2={100} y2={0} dashLength={6} gapLength={4} flowSpeed={24} />
                </Canvas>,
            );
            stepFrame();
            expect(renderCount()).toBe(1);
            stepFrame();
            stepFrame();
            expect(renderCount()).toBe(1);
        } finally {
            window.matchMedia = originalMatchMedia;
        }
    });
});
