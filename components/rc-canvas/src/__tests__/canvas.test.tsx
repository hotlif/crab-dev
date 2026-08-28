import { describe, it, expect, beforeEach, afterEach, mock, render, screen } from "@crab-dev/wake/test/react";
import React from 'react';
import { createWebGL2Mock } from './__mocks__/webgl-mock.js';
import Canvas from '../canvas.js';
(globalThis as Record<string, unknown>).IS_REACT_ACT_ENVIRONMENT = true;
let glMock: WebGL2RenderingContext;
beforeEach(() => {
    glMock = createWebGL2Mock();
    mock.spyOn(HTMLCanvasElement.prototype, 'getContext').implement(((type: string) => (type === 'webgl2' ? glMock : null)) as typeof HTMLCanvasElement.prototype.getContext);
    // rAF stub：不立即调用 cb，避免渲染循环的无限递归
    mock.spyOn(globalThis, 'requestAnimationFrame').implement(() => 1);
    mock.spyOn(globalThis, 'cancelAnimationFrame').implement(() => { });
});
afterEach(() => {
    mock.restoreAll();
});
describe('Canvas', () => {
    it('渲染 <canvas> 元素', async () => {
        const { container } = await render(<Canvas width={400} height={300}/>);
        const canvas = container.querySelector('canvas');
        expect(canvas).not.toBeNull();
    });
    it('按 width/height/dpr 设置 canvas 尺寸', async () => {
        const { container } = await render(<Canvas width={200} height={100} dpr={2}/>);
        const canvas = container.querySelector('canvas')!;
        expect(canvas.width).toBe(400); // 200 * 2
        expect(canvas.height).toBe(200); // 100 * 2
    });
    it('调用 getContext("webgl2") 初始化 WebGL', async () => {
        await render(<Canvas width={100} height={100}/>);
        expect(HTMLCanvasElement.prototype.getContext).toHaveBeenCalledWith('webgl2', { preserveDrawingBuffer: true });
    });
    it('unmount 时调用 dispose（deleteProgram 被调用）', async () => {
        const { unmount } = await render(<Canvas width={100} height={100}/>);
        await unmount();
        expect(glMock.deleteProgram).toHaveBeenCalled();
    });
    it('children 被渲染（React 树中可以包含子组件）', async () => {
        const Child = () => React.createElement('div', { 'data-testid': 'child' });
        await render(<Canvas width={100} height={100}>
            <Child />
        </Canvas>);
        expect(screen.getByTestId('child')).not.toBeNull();
    });
});
