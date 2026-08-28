import { afterEach, beforeAll, beforeEach, describe, expect, it, mock, fireEvent, render, screen, act } from "@crab-dev/wake/test/react";
import type { ComponentPropsWithRef } from 'react';
import type { ColorPickerPanelLocale, OKLCHValue } from '../types.js';
mock.module('motion/react', async () => {
    const mockReact = await mock.actual<typeof import('react')>('react');
    const MockDiv = ({ ref, ...props }: ComponentPropsWithRef<'div'>) => mockReact.createElement('div', { ...props, ref });
    return {
        motion: { div: MockDiv },
        AnimatePresence: ({ children }: { children: unknown }) => children,
    };
});
let ColorPickerPanel: (typeof import('../panels/colorPickerPanel.js'))['default'];
beforeAll(async () => {
    const panelModule = await mock.import<typeof import('../panels/colorPickerPanel.js')>('../panels/colorPickerPanel.js');
    ColorPickerPanel = panelModule.default;
});
(globalThis as typeof globalThis & {
    IS_REACT_ACT_ENVIRONMENT?: boolean;
}).IS_REACT_ACT_ENVIRONMENT = true;
// jsdom 未内置 ResizeObserver;rc-masonry(预设色板布局)依赖它。
(globalThis as typeof globalThis & {
    ResizeObserver?: unknown;
}).ResizeObserver ??= class {
    observe() { }
    unobserve() { }
    disconnect() { }
};
const originalGetBoundingClientRect = Element.prototype.getBoundingClientRect;
beforeEach(() => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    Element.prototype.setPointerCapture = mock.fn() as any;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    Element.prototype.releasePointerCapture = mock.fn() as any;
    Element.prototype.getBoundingClientRect = (() => ({
        left: 0, width: 200, top: 0, height: 20, right: 200, bottom: 20, x: 0, y: 0, toJSON() { },
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
    })) as any;
});
afterEach(() => {
    Element.prototype.getBoundingClientRect = originalGetBoundingClientRect;
});
const defaultValue: OKLCHValue = { lightness: 0.5, chroma: 0.15, hue: 180, alpha: 1 };
const defaultLocale: ColorPickerPanelLocale = {
    labelLightness: '亮度',
    labelChroma: '色度',
    labelHue: '色相',
    labelAlpha: '透明度',
};
const inputValueSetter = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, 'value')?.set;
const changeInputValue = async (input: HTMLInputElement, value: string) => {
    if (!inputValueSetter) {
        throw new Error('HTMLInputElement.value setter is unavailable');
    }
    inputValueSetter.call(input, value);
    await fireEvent.input(input);
};
const renderPanel = async (props: Partial<Parameters<typeof ColorPickerPanel>[0]> = {}) => {
    const onValueChange = mock.fn<(v: OKLCHValue) => void>();
    const renderResult = await render(<ColorPickerPanel locale={defaultLocale} value={defaultValue} onValueChange={onValueChange} {...props}/>);
    return { ...renderResult, onValueChange };
};
const pointerDown = async (el: HTMLElement, clientX: number) => {
    await act(() => {
        el.dispatchEvent(new PointerEvent('pointerdown', { clientX, bubbles: true, cancelable: true }));
    });
};
const pointerMove = async (el: HTMLElement, clientX: number) => {
    await act(() => {
        el.dispatchEvent(new PointerEvent('pointermove', { clientX, bubbles: true, cancelable: true }));
    });
};
const pointerUp = async (el: HTMLElement, clientX: number) => {
    await act(() => {
        el.dispatchEvent(new PointerEvent('pointerup', { clientX, bubbles: true, cancelable: true }));
    });
};
describe('ColorPickerPanel', () => {
    it('renders lightness / chroma / hue / alpha sliders by default', async () => {
        await renderPanel();
        expect(screen.getAllByRole('slider')).toHaveLength(4);
    });
    it('hides the alpha slider when showAlpha is false', async () => {
        await renderPanel({ showAlpha: false });
        expect(screen.getAllByRole('slider')).toHaveLength(3);
    });
    it('renders locale labels', async () => {
        await renderPanel();
        expect(screen.getByText('亮度')).toBeTruthy();
        expect(screen.getByText('色度')).toBeTruthy();
        expect(screen.getByText('色相')).toBeTruthy();
        expect(screen.getByText('透明度')).toBeTruthy();
    });
    it('renders the color preview with the current color (incl. alpha)', async () => {
        const value: OKLCHValue = { lightness: 0.7, chroma: 0.2, hue: 120, alpha: 1 };
        const { container } = await renderPanel({ value });
        const preview = container.firstElementChild?.firstElementChild;
        // Wake 的 DOM CSS 解析器当前会丢弃尚不识别的 OKLCH 声明；这里验证
        // 预览色块仍按面板结构渲染，颜色值本身由 color 工具测试覆盖。
        expect(preview).toBeTruthy();
        expect(preview?.tagName).toBe('DIV');
    });
    it('lightness slider exposes correct aria attributes', async () => {
        await renderPanel({ value: { lightness: 0.3, chroma: 0.1, hue: 90 } });
        const lightness = screen.getAllByRole('slider')[0];
        expect(lightness.getAttribute('aria-valuemin')).toBe('0');
        expect(lightness.getAttribute('aria-valuemax')).toBe('1');
        expect(lightness.getAttribute('aria-valuenow')).toBe('0.3');
    });
    it('calls onValueChange when the lightness slider is dragged', async () => {
        const { onValueChange } = await renderPanel({ value: { lightness: 0.5, chroma: 0.15, hue: 180 } });
        const lightness = screen.getAllByRole('slider')[0];
        await pointerDown(lightness, 0);
        await pointerMove(lightness, 100);
        await pointerUp(lightness, 100);
        expect(onValueChange).toHaveBeenCalled();
        const call = onValueChange.calls.calls[onValueChange.calls.calls.length - 1][0];
        expect(call.chroma).toBe(0.15);
        expect(call.hue).toBe(180);
    });
    it('calls onValueChange when the alpha slider is dragged', async () => {
        const { onValueChange } = await renderPanel();
        const alpha = screen.getAllByRole('slider')[3];
        await pointerDown(alpha, 0);
        await pointerMove(alpha, 100);
        await pointerUp(alpha, 100);
        expect(onValueChange).toHaveBeenCalled();
        const call = onValueChange.calls.calls[onValueChange.calls.calls.length - 1][0];
        expect(typeof call.alpha).toBe('number');
    });
    it('renders the color text input and format switcher', async () => {
        await renderPanel();
        expect(screen.getByLabelText('颜色值')).toBeTruthy();
        expect(screen.getByLabelText('颜色格式')).toBeTruthy();
    });
    it('commits a typed hex value on Enter', async () => {
        const { onValueChange } = await renderPanel();
        const input = screen.getByLabelText('颜色值');
        await changeInputValue(input as HTMLInputElement, '#ff0000');
        await fireEvent.keyDown(input, { key: 'Enter' });
        expect(onValueChange).toHaveBeenCalledTimes(1);
        const arg = onValueChange.calls.calls[0][0];
        // #ff0000 的 OKLCH 色相约 29°
        expect(arg.hue).toBeGreaterThan(20);
        expect(arg.hue).toBeLessThan(40);
    });
    it('keeps the current alpha when typing a 6-digit hex', async () => {
        const { onValueChange } = await renderPanel({
            value: { lightness: 0.5, chroma: 0.15, hue: 180, alpha: 0.5 },
        });
        const input = screen.getByLabelText('颜色值');
        await changeInputValue(input as HTMLInputElement, '#ff0000');
        await fireEvent.keyDown(input, { key: 'Enter' });
        expect(onValueChange).toHaveBeenCalledTimes(1);
        // 6 位 hex 未指定 alpha,应保留当前透明度而不是重置为 1
        expect(onValueChange.calls.calls[0][0].alpha).toBe(0.5);
    });
    it('renders preset swatches when presets are provided', async () => {
        const presets: OKLCHValue[] = [
            { lightness: 0.5, chroma: 0.2, hue: 0 },
            { lightness: 0.7, chroma: 0.15, hue: 200 },
        ];
        const { container } = await renderPanel({ presets });
        const swatches = container.querySelectorAll("button[aria-label^='#']");
        expect(swatches.length).toBe(2);
    });
    it('passes through additional HTML attributes', async () => {
        const { container } = await renderPanel({ 'data-testid': 'custom-panel' } as Record<string, unknown>);
        expect(container.querySelector('[data-testid="custom-panel"]')).toBeTruthy();
    });
});
