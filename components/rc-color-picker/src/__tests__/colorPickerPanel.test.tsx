import { act } from 'react';
import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, jest } from '@jest/globals';

import ColorPickerPanel from '../panels/colorPickerPanel.js';
import type { ColorPickerPanelLocale, OKLCHValue } from '../types.js';

(
    globalThis as typeof globalThis & { IS_REACT_ACT_ENVIRONMENT?: boolean }
).IS_REACT_ACT_ENVIRONMENT = true;

// jsdom 未内置 ResizeObserver;rc-masonry(预设色板布局)依赖它。
(globalThis as typeof globalThis & { ResizeObserver?: unknown }).ResizeObserver ??= class {
    observe() {}
    unobserve() {}
    disconnect() {}
};

const originalGetBoundingClientRect = Element.prototype.getBoundingClientRect;

beforeEach(() => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    Element.prototype.setPointerCapture = jest.fn() as any;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    Element.prototype.releasePointerCapture = jest.fn() as any;
    Element.prototype.getBoundingClientRect = (() => ({
        left: 0, width: 200, top: 0, height: 20, right: 200, bottom: 20, x: 0, y: 0, toJSON() {},
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    })) as any;
});

afterEach(() => {
    Element.prototype.getBoundingClientRect = originalGetBoundingClientRect;
    cleanup();
});

const defaultValue: OKLCHValue = { lightness: 0.5, chroma: 0.15, hue: 180, alpha: 1 };

const defaultLocale: ColorPickerPanelLocale = {
    labelLightness: '亮度',
    labelChroma: '色度',
    labelHue: '色相',
    labelAlpha: '透明度',
};

const renderPanel = (props: Partial<Parameters<typeof ColorPickerPanel>[0]> = {}) => {
    const onValueChange = jest.fn<(v: OKLCHValue) => void>();
    const renderResult = render(
        <ColorPickerPanel
            locale={defaultLocale}
            value={defaultValue}
            onValueChange={onValueChange}
            {...props}
        />,
    );
    return { ...renderResult, onValueChange };
};

const pointerDown = (el: HTMLElement, clientX: number) => {
    act(() => {
        el.dispatchEvent(new MouseEvent('pointerdown', { clientX, bubbles: true, cancelable: true }));
    });
};
const pointerMove = (el: HTMLElement, clientX: number) => {
    act(() => {
        el.dispatchEvent(new MouseEvent('pointermove', { clientX, bubbles: true, cancelable: true }));
    });
};
const pointerUp = (el: HTMLElement, clientX: number) => {
    act(() => {
        el.dispatchEvent(new MouseEvent('pointerup', { clientX, bubbles: true, cancelable: true }));
    });
};

describe('ColorPickerPanel', () => {
    it('renders lightness / chroma / hue / alpha sliders by default', () => {
        renderPanel();
        expect(screen.getAllByRole('slider')).toHaveLength(4);
    });

    it('hides the alpha slider when showAlpha is false', () => {
        renderPanel({ showAlpha: false });
        expect(screen.getAllByRole('slider')).toHaveLength(3);
    });

    it('renders locale labels', () => {
        renderPanel();
        expect(screen.getByText('亮度')).toBeTruthy();
        expect(screen.getByText('色度')).toBeTruthy();
        expect(screen.getByText('色相')).toBeTruthy();
        expect(screen.getByText('透明度')).toBeTruthy();
    });

    it('renders the color preview with the current color (incl. alpha)', () => {
        const value: OKLCHValue = { lightness: 0.7, chroma: 0.2, hue: 120, alpha: 1 };
        const { container } = renderPanel({ value });
        const preview = container.querySelector('[style*="oklch"]') as HTMLElement;
        // jsdom 会把 `oklch(... / 1)` 归一化为不带 alpha 的形式
        expect(preview.style.backgroundColor).toBe('oklch(0.7 0.2 120)');
    });

    it('lightness slider exposes correct aria attributes', () => {
        renderPanel({ value: { lightness: 0.3, chroma: 0.1, hue: 90 } });
        const lightness = screen.getAllByRole('slider')[0];
        expect(lightness.getAttribute('aria-valuemin')).toBe('0');
        expect(lightness.getAttribute('aria-valuemax')).toBe('1');
        expect(lightness.getAttribute('aria-valuenow')).toBe('0.3');
    });

    it('calls onValueChange when the lightness slider is dragged', () => {
        const { onValueChange } = renderPanel({ value: { lightness: 0.5, chroma: 0.15, hue: 180 } });
        const lightness = screen.getAllByRole('slider')[0];
        pointerDown(lightness, 0);
        pointerMove(lightness, 100);
        pointerUp(lightness, 100);
        expect(onValueChange).toHaveBeenCalled();
        const call = onValueChange.mock.calls[onValueChange.mock.calls.length - 1][0];
        expect(call.chroma).toBe(0.15);
        expect(call.hue).toBe(180);
    });

    it('calls onValueChange when the alpha slider is dragged', () => {
        const { onValueChange } = renderPanel();
        const alpha = screen.getAllByRole('slider')[3];
        pointerDown(alpha, 0);
        pointerMove(alpha, 100);
        pointerUp(alpha, 100);
        expect(onValueChange).toHaveBeenCalled();
        const call = onValueChange.mock.calls[onValueChange.mock.calls.length - 1][0];
        expect(typeof call.alpha).toBe('number');
    });

    it('renders the color text input and format switcher', () => {
        renderPanel();
        expect(screen.getByLabelText('颜色值')).toBeTruthy();
        expect(screen.getByLabelText('颜色格式')).toBeTruthy();
    });

    it('commits a typed hex value on Enter', () => {
        const { onValueChange } = renderPanel();
        const input = screen.getByLabelText('颜色值');
        fireEvent.change(input, { target: { value: '#ff0000' } });
        fireEvent.keyDown(input, { key: 'Enter' });
        expect(onValueChange).toHaveBeenCalledTimes(1);
        const arg = onValueChange.mock.calls[0][0];
        // #ff0000 的 OKLCH 色相约 29°
        expect(arg.hue).toBeGreaterThan(20);
        expect(arg.hue).toBeLessThan(40);
    });

    it('keeps the current alpha when typing a 6-digit hex', () => {
        const { onValueChange } = renderPanel({
            value: { lightness: 0.5, chroma: 0.15, hue: 180, alpha: 0.5 },
        });
        const input = screen.getByLabelText('颜色值');
        fireEvent.change(input, { target: { value: '#ff0000' } });
        fireEvent.keyDown(input, { key: 'Enter' });
        expect(onValueChange).toHaveBeenCalledTimes(1);
        // 6 位 hex 未指定 alpha,应保留当前透明度而不是重置为 1
        expect(onValueChange.mock.calls[0][0].alpha).toBe(0.5);
    });

    it('renders preset swatches when presets are provided', () => {
        const presets: OKLCHValue[] = [
            { lightness: 0.5, chroma: 0.2, hue: 0 },
            { lightness: 0.7, chroma: 0.15, hue: 200 },
        ];
        const { container } = renderPanel({ presets });
        const swatches = container.querySelectorAll("button[aria-label^='#']");
        expect(swatches.length).toBe(2);
    });

    it('passes through additional HTML attributes', () => {
        const { container } = renderPanel({ 'data-testid': 'custom-panel' } as Record<string, unknown>);
        expect(container.querySelector('[data-testid="custom-panel"]')).toBeTruthy();
    });
});
