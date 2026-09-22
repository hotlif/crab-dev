import { describe, it, expect, beforeEach, afterEach, mock } from '@crab-dev/wake/test';
import { act, fireEvent, render, screen } from '@crab-dev/wake/test/react';
import React, { use, useEffect } from 'react';
import { createWebGL2Mock } from './__mocks__/webgl-mock.js';
import Canvas from '../canvas.js';
import { CanvasPaletteContext } from '../context/palette-context.js';
import { parseColor } from '../math/color.js';
import InfiniteGrid from '../shapes/infinite-grid.js';
import CanvasImage from '../shapes/image.js';
import { CanvasContext } from '../context/canvas-context.js';
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
    it('尺寸与 DPR 更新在重绘前保留旧缓冲区，连续测量只提交最终尺寸', async () => {
        const onRender = mock.fn();
        const view = await render(<Canvas width={200} height={100} dpr={1} onRender={onRender} />);
        const canvas = view.container.querySelector('canvas')!;
        await act(async () => { animationFrameCallbacks.shift()?.(0); });
        expect(onRender).toHaveBeenCalledTimes(1);
        await view.rerender(<Canvas width={201} height={110} dpr={1} onRender={onRender} />);
        await view.rerender(<Canvas width={210} height={120} dpr={2} onRender={onRender} />);
        expect(canvas.width).toBe(200);
        expect(canvas.height).toBe(100);
        expect(onRender).toHaveBeenCalledTimes(1);
        await act(async () => { animationFrameCallbacks.shift()?.(1); });
        expect(canvas.width).toBe(420);
        expect(canvas.height).toBe(240);
        expect(glMock.viewport).toHaveBeenLastCalledWith(0, 0, 420, 240);
        expect(onRender).toHaveBeenCalledTimes(2);
        await view.unmount();
    });
    it('真实卸载释放 WebGL 配额，StrictMode 挂载检查不释放仍在使用的上下文', async () => {
        const loseContext = mock.fn();
        mock.spyOn(glMock, 'getExtension').implement(((name: string) => name === 'WEBGL_lose_context' ? { loseContext, restoreContext: mock.fn() } : null) as typeof glMock.getExtension);
        const view = await render(<React.StrictMode><Canvas width={100} height={100} /></React.StrictMode>);
        expect(loseContext).not.toHaveBeenCalled();
        await view.unmount();
        expect(loseContext).toHaveBeenCalledTimes(1);
    });
    it('上下文丢失时不通知已绘制，恢复后重建仍被消费的图片和字形', async () => {
        const onRender = mock.fn();
        let lost = false;
        mock.spyOn(glMock, 'isContextLost').implement(() => lost);
        const first: ImageBitmap = { width: 1, height: 1, close: mock.fn() };
        const second: ImageBitmap = { width: 2, height: 2, close: mock.fn() };
        function Glyph() {
            const context = use(CanvasContext);
            useEffect(() => {
                context.uploadGlyph('context-recovery', new Uint8Array([255]), 1, 1);
                return () => context.releaseTexture('context-recovery');
            }, []);
            return null;
        }
        const view = await render(<Canvas width={100} height={100} onRender={onRender}>
            <CanvasImage src={first} x={0} y={0} width={10} height={10} /><Glyph />
        </Canvas>);
        const canvas = view.container.querySelector('canvas')!;
        await act(async () => { animationFrameCallbacks.shift()?.(0); });
        expect(onRender).toHaveBeenCalledTimes(1);
        lost = true;
        const event = new Event('webglcontextlost', { cancelable: true });
        await fireEvent(canvas, event);
        expect(event.defaultPrevented).toBe(true);
        await view.rerender(<Canvas width={100} height={100} onRender={onRender}>
            <CanvasImage src={second} x={0} y={0} width={20} height={20} /><Glyph />
        </Canvas>);
        await act(async () => { animationFrameCallbacks.shift()?.(1); });
        expect(onRender).toHaveBeenCalledTimes(1);
        const upload = mock.spyOn(glMock, 'texImage2D');
        lost = false;
        await fireEvent(canvas, new Event('webglcontextrestored'));
        await act(async () => { animationFrameCallbacks.shift()?.(2); });
        expect(upload).toHaveBeenCalledTimes(2);
        expect(upload).toHaveBeenCalledWith(glMock.TEXTURE_2D, 0, glMock.RGBA, glMock.RGBA, glMock.UNSIGNED_BYTE, second);
        expect(onRender).toHaveBeenCalledTimes(2);
        expect(first.close).not.toHaveBeenCalled(); expect(second.close).not.toHaveBeenCalled();
        await view.unmount();
    });
    it('onRender 仅在真实绘制完成后通知，上传失败时保留旧图片命令', async () => {
        const onRender = mock.fn(), onError = mock.fn();
        let textureKey: string | undefined;
        function Probe() {
            const context = use(CanvasContext);
            useEffect(() => {
                const command = [...context.commandMapRef.current.values()].find(value => value.kind === 'texture-image');
                textureKey = command?.kind === 'texture-image' ? command.textureKey : undefined;
            });
            return null;
        }
        const valid: ImageBitmap = { width: 1, height: 1, close: mock.fn() };
        const closed: ImageBitmap = { width: 0, height: 0, close: mock.fn() };
        const view = await render(<Canvas width={100} height={100} onRender={onRender}>
            <CanvasImage src={valid} x={0} y={0} width={10} height={10} onError={onError} /><Probe />
        </Canvas>);
        expect(onRender).not.toHaveBeenCalled();
        await act(async () => { animationFrameCallbacks.shift()?.(0); });
        expect(glMock.clear).toHaveBeenCalled(); expect(onRender).toHaveBeenCalledTimes(1);
        const original = textureKey;
        expect(original).toBeTruthy();
        await view.rerender(<Canvas width={100} height={100} onRender={onRender}>
            <CanvasImage src={closed} x={0} y={0} width={10} height={10} onError={onError} /><Probe />
        </Canvas>);
        expect(onError).toHaveBeenCalledTimes(1); expect(textureKey).toBe(original);
        expect(glMock.deleteTexture).not.toHaveBeenCalled();
        await view.unmount();
    });
    it('共享字形纹理在最后一个消费者卸载后释放，重新挂载可再次上传', async () => {
        function Consumer() {
            const context = use(CanvasContext);
            useEffect(() => {
                context.uploadGlyph('shared-test', new Uint8Array([255]), 1, 1);
                return () => context.releaseTexture('shared-test');
            }, []);
            return null;
        }
        const { rerender } = await render(<Canvas width={100} height={100}><Consumer key="a" /><Consumer key="b" /></Canvas>);
        mock.clearAll();
        await rerender(<Canvas width={100} height={100}>{[<Consumer key="b" />]}</Canvas>);
        expect(glMock.deleteTexture).not.toHaveBeenCalled();
        await rerender(<Canvas width={100} height={100} />);
        expect(glMock.deleteTexture).toHaveBeenCalledTimes(1);
        mock.clearAll();
        await rerender(<Canvas width={100} height={100}>{[<Consumer key="c" />]}</Canvas>);
        expect(glMock.texImage2D).toHaveBeenCalledTimes(1);
    });
    it('ImageBitmap 更换和卸载释放纹理，位图仍由调用者拥有', async () => {
        const first: ImageBitmap = { width: 1, height: 1, close: mock.fn() };
        const second: ImageBitmap = { width: 2, height: 2, close: mock.fn() };
        const { rerender } = await render(<Canvas width={100} height={100}><CanvasImage src={first} x={0} y={0} width={10} height={10} /></Canvas>);
        mock.clearAll();
        await rerender(<Canvas width={100} height={100}><CanvasImage src={second} x={0} y={0} width={20} height={20} /></Canvas>);
        expect(glMock.deleteTexture).toHaveBeenCalledTimes(1);
        expect(glMock.texImage2D).toHaveBeenCalled();
        await rerender(<Canvas width={100} height={100} />);
        expect(glMock.deleteTexture).toHaveBeenCalledTimes(2);
        expect(first.close).not.toHaveBeenCalled();
        expect(second.close).not.toHaveBeenCalled();
    });
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
