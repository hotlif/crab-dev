import { describe, it, expect, beforeEach, afterEach, act, mock, render, screen } from "@crab-dev/wake/test/react";
import React, { use } from 'react';
import { createWebGL2Mock } from './__mocks__/webgl-mock.js';
import Canvas from '../canvas.js';
import { CanvasPaletteContext } from '../context/palette-context.js';
import { parseColor } from '../math/color.js';
import InfiniteGrid from '../shapes/infinite-grid.js';
(globalThis as Record<string, unknown>).IS_REACT_ACT_ENVIRONMENT = true;
let glMock: WebGL2RenderingContext;
let animationFrameCallbacks: Array<(time: number) => void>;
beforeEach(() => {
    glMock = createWebGL2Mock();
    animationFrameCallbacks = [];
    mock.spyOn(HTMLCanvasElement.prototype, 'getContext').implement(((type: string) => (type === 'webgl2' ? glMock : null)) as typeof HTMLCanvasElement.prototype.getContext);
    // rAF stub：不立即调用 cb，避免渲染循环的无限递归
    mock.spyOn(globalThis, 'requestAnimationFrame').implement(callback => {
        animationFrameCallbacks.push(callback);
        return animationFrameCallbacks.length;
    });
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
    it('祖先主题属性变化时递增 palette revision，驱动绘制节点重绘', async () => {
        const Revision = () => {
            const { revision } = use(CanvasPaletteContext);
            return <output data-testid="palette-revision">{revision}</output>;
        };
        const { container } = await render(
            <section>
                <Canvas width={100} height={100} palette={{ foreground: '#000000' }}>
                    <Revision />
                </Canvas>
            </section>,
        );
        const before = Number(screen.getByTestId('palette-revision').textContent);

        await act(async () => {
            container.querySelector('section')?.setAttribute('data-theme', 'dark');
            await Promise.resolve();
        });

        expect(Number(screen.getByTestId('palette-revision').textContent)).toBeGreaterThan(before);
    });
    it('祖先主题切换后下一帧向 WebGL 上传重新解析的网格色', async () => {
        Object.assign(glMock, {
            TRIANGLE_STRIP: 0x0005,
            drawArrays: mock.fn(),
        });
        mock.spyOn(globalThis, 'getComputedStyle').implement(((element: Element) => {
            const probe = element as HTMLElement;
            const isDark = probe.closest('[data-theme="dark"]') !== null;
            return {
                color: probe.style.color,
                boxShadow: probe.style.boxShadow,
                getPropertyValue: (name: string) => name === '--canvas-grid-test'
                    ? (isDark ? 'rgb(240, 10, 20)' : 'rgb(10, 20, 30)')
                    : '',
            };
        }) as unknown as typeof getComputedStyle);

        const { container } = await render(
            <section data-theme="light">
                <Canvas
                    width={100}
                    height={100}
                    palette={{ grid: 'var(--canvas-grid-test)' }}
                >
                    <InfiniteGrid />
                </Canvas>
            </section>,
        );

        await act(async () => {
            animationFrameCallbacks.shift()?.(0);
            await Promise.resolve();
        });
        expect(glMock.uniform4fv).toHaveBeenCalledWith(
            expect.anything(),
            [10 / 255, 20 / 255, 30 / 255, 1],
        );

        await act(async () => {
            container.querySelector('section')?.setAttribute('data-theme', 'dark');
            await Promise.resolve();
        });
        await act(async () => {
            animationFrameCallbacks.shift()?.(16);
            await Promise.resolve();
        });

        expect(glMock.uniform4fv).toHaveBeenCalledWith(
            expect.anything(),
            [240 / 255, 10 / 255, 20 / 255, 1],
        );
    });
    it('forced-colors 变化时清理颜色缓存并刷新 palette', async () => {
        const originalMatchMedia = window.matchMedia;
        const listeners: { forcedColorsChange?: (event: MediaQueryListEvent) => void } = {};
        window.matchMedia = mock.fn((query: string) => ({
            matches: false,
            media: query,
            onchange: null,
            addEventListener: mock.fn((type: string, listener: (event: MediaQueryListEvent) => void) => {
                if (query === '(forced-colors: active)' && type === 'change') {
                    listeners.forcedColorsChange = listener;
                }
            }),
            removeEventListener: mock.fn(),
            addListener: mock.fn(),
            removeListener: mock.fn(),
            dispatchEvent: mock.fn(() => false),
        })) as unknown as typeof window.matchMedia;

        try {
            await render(<Canvas width={100} height={100} />);
            const cached = parseColor('#123456');
            expect(parseColor('#123456')).toBe(cached);

            await act(async () => {
                listeners.forcedColorsChange?.(new Event('change') as MediaQueryListEvent);
                await Promise.resolve();
            });

            expect(parseColor('#123456')).not.toBe(cached);
        } finally {
            window.matchMedia = originalMatchMedia;
        }
    });
});
