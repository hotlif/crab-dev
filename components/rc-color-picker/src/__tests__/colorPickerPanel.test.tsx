import { act } from 'react';
import { cleanup, render, screen } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, jest } from '@jest/globals';

import ColorPickerPanel from '../panels/colorPickerPanel.js';
import type { OKLCHValue } from '../panels/colorPickerPanel.js';
import type { ColorPickerPanelLocale } from '../types.js';

(
    globalThis as typeof globalThis & { IS_REACT_ACT_ENVIRONMENT?: boolean }
).IS_REACT_ACT_ENVIRONMENT = true;

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
});

const defaultValue: OKLCHValue = { lightness: 0.5, chroma: 0.15, hue: 180 };

const defaultLocale: ColorPickerPanelLocale = {
    labelLightness: '亮度',
    labelChroma: '色度',
    labelHue: '色相',
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
    const sliders = screen.getAllByRole('slider');

    return {
        ...renderResult,
        sliders,
        onValueChange,
    };
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
    afterEach(() => {
        cleanup();
    });

    it('renders without runtime error', () => {
        const { container } = renderPanel();
        expect(container.firstElementChild).toBeTruthy();
    });

    it('renders three sliders for lightness, chroma and hue', () => {
        const { sliders } = renderPanel();
        expect(sliders).toHaveLength(3);
    });

    it('renders locale labels', () => {
        renderPanel();
        expect(screen.getByText('亮度')).toBeTruthy();
        expect(screen.getByText('色度')).toBeTruthy();
        expect(screen.getByText('色相')).toBeTruthy();
    });

    it('renders custom locale labels', () => {
        renderPanel({
            locale: {
                labelLightness: 'Lightness',
                labelChroma: 'Chroma',
                labelHue: 'Hue',
            },
        });
        expect(screen.getByText('Lightness')).toBeTruthy();
        expect(screen.getByText('Chroma')).toBeTruthy();
        expect(screen.getByText('Hue')).toBeTruthy();
    });

    it('renders color preview with correct background', () => {
        const value: OKLCHValue = { lightness: 0.7, chroma: 0.2, hue: 120 };
        const { container } = renderPanel({ value });
        const preview = container.querySelector('[style]') as HTMLElement;
        expect(preview.style.backgroundColor).toBe('oklch(0.7 0.2 120)');
    });

    it('lightness slider has correct aria attributes', () => {
        const { sliders } = renderPanel({
            value: { lightness: 0.3, chroma: 0.1, hue: 90 },
        });
        const lightnessSlider = sliders[0];
        expect(lightnessSlider.getAttribute('aria-valuemin')).toBe('0');
        expect(lightnessSlider.getAttribute('aria-valuemax')).toBe('1');
        expect(lightnessSlider.getAttribute('aria-valuenow')).toBe('0.3');
    });

    it('chroma slider has correct aria attributes', () => {
        const { sliders } = renderPanel({
            value: { lightness: 0.5, chroma: 0.2, hue: 90 },
        });
        const chromaSlider = sliders[1];
        expect(chromaSlider.getAttribute('aria-valuemin')).toBe('0');
        expect(chromaSlider.getAttribute('aria-valuemax')).toBe('0.4');
        expect(chromaSlider.getAttribute('aria-valuenow')).toBe('0.2');
    });

    it('hue slider has correct aria attributes', () => {
        const { sliders } = renderPanel({
            value: { lightness: 0.5, chroma: 0.1, hue: 270 },
        });
        const hueSlider = sliders[2];
        expect(hueSlider.getAttribute('aria-valuemin')).toBe('0');
        expect(hueSlider.getAttribute('aria-valuemax')).toBe('360');
        expect(hueSlider.getAttribute('aria-valuenow')).toBe('270');
    });

    it('calls onValueChange with updated lightness when lightness slider is dragged', () => {
        const { sliders, onValueChange } = renderPanel({
            value: { lightness: 0.5, chroma: 0.15, hue: 180 },
        });
        const lightnessSlider = sliders[0];

        pointerDown(lightnessSlider, 0);
        pointerMove(lightnessSlider, 100);
        pointerUp(lightnessSlider, 100);

        expect(onValueChange).toHaveBeenCalled();
        const call = onValueChange.mock.calls[onValueChange.mock.calls.length - 1][0];
        expect(call.chroma).toBe(0.15);
        expect(call.hue).toBe(180);
        expect(typeof call.lightness).toBe('number');
    });

    it('calls onValueChange with updated chroma when chroma slider is dragged', () => {
        const { sliders, onValueChange } = renderPanel({
            value: { lightness: 0.5, chroma: 0.1, hue: 180 },
        });
        const chromaSlider = sliders[1];

        pointerDown(chromaSlider, 0);
        pointerMove(chromaSlider, 100);
        pointerUp(chromaSlider, 100);

        expect(onValueChange).toHaveBeenCalled();
        const call = onValueChange.mock.calls[onValueChange.mock.calls.length - 1][0];
        expect(call.lightness).toBe(0.5);
        expect(call.hue).toBe(180);
        expect(typeof call.chroma).toBe('number');
    });

    it('calls onValueChange with updated hue when hue slider is dragged', () => {
        const { sliders, onValueChange } = renderPanel({
            value: { lightness: 0.5, chroma: 0.15, hue: 90 },
        });
        const hueSlider = sliders[2];

        pointerDown(hueSlider, 0);
        pointerMove(hueSlider, 150);
        pointerUp(hueSlider, 150);

        expect(onValueChange).toHaveBeenCalled();
        const call = onValueChange.mock.calls[onValueChange.mock.calls.length - 1][0];
        expect(call.lightness).toBe(0.5);
        expect(call.chroma).toBe(0.15);
        expect(typeof call.hue).toBe('number');
    });

    it('passes through additional HTML attributes', () => {
        const { container } = renderPanel({ 'data-testid': 'custom-panel' } as Record<string, unknown>);
        expect(container.querySelector('[data-testid="custom-panel"]')).toBeTruthy();
    });

    it('updates preview color when value changes via rerender', () => {
        const onValueChange = jest.fn();
        const { container, rerender } = render(
            <ColorPickerPanel
                locale={defaultLocale}
                value={{ lightness: 0.5, chroma: 0.1, hue: 100 }}
                onValueChange={onValueChange}
            />,
        );

        rerender(
            <ColorPickerPanel
                locale={defaultLocale}
                value={{ lightness: 0.9, chroma: 0.3, hue: 200 }}
                onValueChange={onValueChange}
            />,
        );

        const preview = container.querySelector('[style]') as HTMLElement;
        expect(preview.style.backgroundColor).toBe('oklch(0.9 0.3 200)');
    });
});
