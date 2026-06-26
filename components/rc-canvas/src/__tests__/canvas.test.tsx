import { describe, it, expect, jest, beforeEach, afterEach } from '@jest/globals';
import { render, cleanup } from '@testing-library/react';
import React from 'react';
import { createWebGL2Mock } from './__mocks__/webgl-mock.js';
import Canvas from '../canvas.js';

(globalThis as Record<string, unknown>).IS_REACT_ACT_ENVIRONMENT = true;

let glMock: WebGL2RenderingContext;

beforeEach(() => {
    glMock = createWebGL2Mock();
    jest.spyOn(HTMLCanvasElement.prototype, 'getContext').mockImplementation(
        (type: string) => (type === 'webgl2' ? (glMock as unknown as CanvasRenderingContext2D) : null),
    );
    // rAF stub：不立即调用 cb，避免渲染循环的无限递归
    jest.spyOn(globalThis, 'requestAnimationFrame').mockImplementation(() => 1);
    jest.spyOn(globalThis, 'cancelAnimationFrame').mockImplementation(() => {});
});

afterEach(() => {
    cleanup();
    jest.restoreAllMocks();
});

describe('Canvas', () => {
    it('渲染 <canvas> 元素', () => {
        const { container } = render(<Canvas width={400} height={300} />);
        const canvas = container.querySelector('canvas');
        expect(canvas).not.toBeNull();
    });

    it('按 width/height/dpr 设置 canvas 尺寸', () => {
        const { container } = render(<Canvas width={200} height={100} dpr={2} />);
        const canvas = container.querySelector('canvas')!;
        expect(canvas.width).toBe(400);   // 200 * 2
        expect(canvas.height).toBe(200);  // 100 * 2
    });

    it('调用 getContext("webgl2") 初始化 WebGL', () => {
        render(<Canvas width={100} height={100} />);
        expect(HTMLCanvasElement.prototype.getContext).toHaveBeenCalledWith('webgl2');
    });

    it('unmount 时调用 dispose（deleteProgram 被调用）', () => {
        const { unmount } = render(<Canvas width={100} height={100} />);
        unmount();
        expect(glMock.deleteProgram).toHaveBeenCalled();
    });

    it('children 被渲染（React 树中可以包含子组件）', () => {
        const Child = () => React.createElement('div', { 'data-testid': 'child' });
        const { getByTestId } = render(
            <Canvas width={100} height={100}>
                <Child />
            </Canvas>,
        );
        expect(getByTestId('child')).not.toBeNull();
    });
});
