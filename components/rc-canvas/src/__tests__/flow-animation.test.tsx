import { describe, it, expect, beforeEach, afterEach, mock, render } from "@crab-dev/wake/test/react";
import type { MockFunction } from "@crab-dev/wake/test";
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
    return (glMock.clear as MockFunction).calls.calls.length;
}
beforeEach(() => {
    glMock = createWebGL2Mock();
    mock.spyOn(HTMLCanvasElement.prototype, 'getContext').implement(((type: string) => (type === 'webgl2' ? glMock : null)) as typeof HTMLCanvasElement.prototype.getContext);
    rafCb = null;
    mock.spyOn(globalThis, 'requestAnimationFrame').implement(cb => {
        rafCb = cb;
        return 1;
    });
    mock.spyOn(globalThis, 'cancelAnimationFrame').implement(() => { });
});
afterEach(() => {
    mock.restoreAll();
});
describe('流动虚线渲染循环', () => {
    it('纯静态命令：首帧渲染后循环停驻（按需渲染）', async () => {
        await render(<Canvas width={400} height={300}>
            <Line x1={0} y1={0} x2={100} y2={0} dashLength={6} gapLength={4}/>
        </Canvas>);
        stepFrame();
        expect(renderCount()).toBe(1);
        stepFrame();
        stepFrame();
        expect(renderCount()).toBe(1);
    });
    it('存在 flowSpeed 命令：渲染循环逐帧持续重绘', async () => {
        await render(<Canvas width={400} height={300}>
            <Line x1={0} y1={0} x2={100} y2={0} dashLength={6} gapLength={4} flowSpeed={24}/>
        </Canvas>);
        stepFrame();
        stepFrame();
        stepFrame();
        expect(renderCount()).toBe(3);
    });
    it('动画命令注销后循环回到按需渲染', async () => {
        const { rerender } = await render(<Canvas width={400} height={300}>
            <Line x1={0} y1={0} x2={100} y2={0} dashLength={6} gapLength={4} flowSpeed={24}/>
        </Canvas>);
        stepFrame();
        expect(renderCount()).toBe(1);
        await rerender(<Canvas width={400} height={300}/>);
        stepFrame(); // 注销触发脏标记，重绘一帧
        const afterUnmountFrames = renderCount();
        stepFrame();
        stepFrame();
        expect(renderCount()).toBe(afterUnmountFrames); // 不再持续重绘
    });
    it('prefers-reduced-motion: reduce 时不持续重绘（降级为静态）', async () => {
        const originalMatchMedia = window.matchMedia;
        window.matchMedia = mock.fn(() => ({
            matches: true,
            media: '(prefers-reduced-motion: reduce)',
            onchange: null,
            addEventListener: mock.fn(),
            removeEventListener: mock.fn(),
            addListener: mock.fn(),
            removeListener: mock.fn(),
            dispatchEvent: mock.fn(() => false),
        })) as unknown as typeof window.matchMedia;
        try {
            await render(<Canvas width={400} height={300}>
                <Line x1={0} y1={0} x2={100} y2={0} dashLength={6} gapLength={4} flowSpeed={24}/>
            </Canvas>);
            stepFrame();
            expect(renderCount()).toBe(1);
            stepFrame();
            stepFrame();
            expect(renderCount()).toBe(1);
        }
        finally {
            window.matchMedia = originalMatchMedia;
        }
    });
});
