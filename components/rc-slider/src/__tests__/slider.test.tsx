import { act } from 'react';
import { cleanup, render, screen } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, jest } from '@jest/globals';

import Slider from '../slider.js';
import type { SliderProps } from '../slider.js';

(
    globalThis as typeof globalThis & { IS_REACT_ACT_ENVIRONMENT?: boolean }
).IS_REACT_ACT_ENVIRONMENT = true;

const originalGetBoundingClientRect = Element.prototype.getBoundingClientRect;

// jsdom does not implement pointer capture APIs or layout
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

const pointerCancel = (el: HTMLElement) => {
    act(() => {
        el.dispatchEvent(new MouseEvent('pointercancel', { bubbles: true, cancelable: true }));
    });
};

const renderSlider = (props: Partial<SliderProps> = {}) => {
    const defaultProps: SliderProps = { value: 50 };
    const renderResult = render(<Slider {...defaultProps} {...props} />);
    const slider = screen.getByRole('slider') as HTMLDivElement;

    return {
        ...renderResult,
        slider,
    };
};

describe('Slider', () => {
    afterEach(() => {
        cleanup();
    });

    it('renders without runtime error', () => {
        const { slider, unmount } = renderSlider();
        expect(slider).toBeTruthy();
        unmount();
    });

    it('renders correct aria attributes with default min/max', () => {
        const { slider, unmount } = renderSlider({ value: 30 });
        expect(slider.getAttribute('aria-valuemin')).toBe('0');
        expect(slider.getAttribute('aria-valuemax')).toBe('100');
        expect(slider.getAttribute('aria-valuenow')).toBe('30');
        unmount();
    });

    it('renders correct aria attributes with custom min/max', () => {
        const { slider, unmount } = renderSlider({ value: 5, min: 0, max: 10 });
        expect(slider.getAttribute('aria-valuemin')).toBe('0');
        expect(slider.getAttribute('aria-valuemax')).toBe('10');
        expect(slider.getAttribute('aria-valuenow')).toBe('5');
        unmount();
    });

    it('renders all data-slot elements', () => {
        const { slider, unmount } = renderSlider();
        expect(slider.getAttribute('data-slot')).toBe('slider-root');
        expect(slider.querySelector('[data-slot="slider-rail"]')).toBeTruthy();
        expect(slider.querySelector('[data-slot="slider-track"]')).toBeTruthy();
        expect(slider.querySelector('[data-slot="slider-handle-container"]')).toBeTruthy();
        expect(slider.querySelector('[data-slot="slider-handle"]')).toBeTruthy();
        expect(slider.querySelector('[data-slot="slider-halo"]')).toBeTruthy();
        unmount();
    });

    it('forwards className and data-* attributes', () => {
        const { slider, unmount } = renderSlider({
            className: 'custom-slider',
            'data-test-id': 'my-slider',
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } as any);
        expect(slider.className).toContain('custom-slider');
        expect(slider.getAttribute('data-test-id')).toBe('my-slider');
        unmount();
    });

    it('computes track width based on value percent', () => {
        const { slider, unmount } = renderSlider({ value: 25, min: 0, max: 100 });
        const track = slider.querySelector('[data-slot="slider-track"]') as HTMLDivElement;
        expect(parseFloat(track.style.width)).toBeCloseTo(25, 2);
        unmount();
    });

    it('clamps track width to 0% when value is below min', () => {
        const { slider, unmount } = renderSlider({ value: -10, min: 0, max: 100 });
        const track = slider.querySelector('[data-slot="slider-track"]') as HTMLDivElement;
        expect(parseFloat(track.style.width)).toBeCloseTo(0, 2);
        unmount();
    });

    it('clamps track width to 100% when value exceeds max', () => {
        const { slider, unmount } = renderSlider({ value: 200, min: 0, max: 100 });
        const track = slider.querySelector('[data-slot="slider-track"]') as HTMLDivElement;
        expect(parseFloat(track.style.width)).toBeCloseTo(100, 2);
        unmount();
    });

    it('positions handle at correct percent', () => {
        const { slider, unmount } = renderSlider({ value: 75, min: 0, max: 100 });
        const handleContainer = slider.querySelector('[data-slot="slider-handle-container"]') as HTMLDivElement;
        expect(parseFloat(handleContainer.style.left)).toBeCloseTo(75, 2);
        unmount();
    });

    it('calls onValueChange on pointerdown', () => {
        const onValueChange = jest.fn();
        const { slider, unmount } = renderSlider({ value: 50, onValueChange });

        pointerDown(slider, 150);

        expect(onValueChange).toHaveBeenCalledWith(75);
        unmount();
    });

    it('calls onValueChange during pointer drag', () => {
        const onValueChange = jest.fn();
        const { slider, unmount } = renderSlider({ value: 0, onValueChange });

        pointerDown(slider, 50);
        pointerMove(slider, 100);

        expect(onValueChange).toHaveBeenCalledWith(50);
        unmount();
    });

    it('stops dragging on pointerup', () => {
        const onValueChange = jest.fn();
        const { slider, unmount } = renderSlider({ value: 0, onValueChange });

        pointerDown(slider, 50);
        pointerUp(slider, 50);

        onValueChange.mockClear();

        pointerMove(slider, 150);

        expect(onValueChange).not.toHaveBeenCalled();
        unmount();
    });

    it('snaps value to step', () => {
        const onValueChange = jest.fn();
        const { slider, unmount } = renderSlider({ value: 0, min: 0, max: 100, step: 10, onValueChange });

        // clientX=47 on 200px => 23.5% => raw value 23.5, snapped to step 10 => 20
        pointerDown(slider, 47);

        expect(onValueChange).toHaveBeenCalledWith(20);
        unmount();
    });

    it('handles decimal step precision correctly', () => {
        const onValueChange = jest.fn();
        const { slider, unmount } = renderSlider({ value: 0, min: 0, max: 1, step: 0.1, onValueChange });

        // clientX=60 on 200px => 30% => raw 0.3, step 0.1 => snapped 0.3
        pointerDown(slider, 60);

        expect(onValueChange).toHaveBeenCalledWith(0.3);
        unmount();
    });

    it('clamps value to min on pointer at left edge', () => {
        const onValueChange = jest.fn();
        Element.prototype.getBoundingClientRect = (() => ({
            left: 100, width: 200, top: 0, height: 20, right: 300, bottom: 20, x: 100, y: 0, toJSON() {},
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        })) as any;
        const { slider, unmount } = renderSlider({ value: 50, min: 0, max: 100, onValueChange });

        pointerDown(slider, 0);

        expect(onValueChange).toHaveBeenCalledWith(0);
        unmount();
    });

    it('clamps value to max on pointer past right edge', () => {
        const onValueChange = jest.fn();
        const { slider, unmount } = renderSlider({ value: 50, min: 0, max: 100, onValueChange });

        pointerDown(slider, 500);

        expect(onValueChange).toHaveBeenCalledWith(100);
        unmount();
    });

    it('does not call onValueChange when value does not change', () => {
        const onValueChange = jest.fn();
        const { slider, unmount } = renderSlider({ value: 50, min: 0, max: 100, onValueChange });

        // clientX=100 on 200px => 50%, same as current value
        pointerDown(slider, 100);

        expect(onValueChange).not.toHaveBeenCalled();
        unmount();
    });

    it('sets data-is-dragging on handle during drag', () => {
        const { slider, unmount } = renderSlider({ value: 50 });

        const handle = slider.querySelector('[data-slot="slider-handle"]') as HTMLDivElement;
        expect(handle.getAttribute('data-is-dragging')).toBe('false');

        pointerDown(slider, 100);

        expect(handle.getAttribute('data-is-dragging')).toBe('true');

        pointerUp(slider, 100);

        expect(handle.getAttribute('data-is-dragging')).toBe('false');
        unmount();
    });

    it('stops dragging on pointercancel', () => {
        const { slider, unmount } = renderSlider({ value: 50 });

        const handle = slider.querySelector('[data-slot="slider-handle"]') as HTMLDivElement;

        pointerDown(slider, 100);

        expect(handle.getAttribute('data-is-dragging')).toBe('true');

        pointerCancel(slider);

        expect(handle.getAttribute('data-is-dragging')).toBe('false');
        unmount();
    });

    it('handles wheel event to increment value', () => {
        const onValueChange = jest.fn();
        const { slider, unmount } = renderSlider({ value: 50, min: 0, max: 100, step: 1, onValueChange });

        act(() => {
            slider.dispatchEvent(new WheelEvent('wheel', { deltaY: -1, bubbles: true }));
        });

        expect(onValueChange).toHaveBeenCalledWith(51);
        unmount();
    });

    it('handles wheel event to decrement value', () => {
        const onValueChange = jest.fn();
        const { slider, unmount } = renderSlider({ value: 50, min: 0, max: 100, step: 1, onValueChange });

        act(() => {
            slider.dispatchEvent(new WheelEvent('wheel', { deltaY: 1, bubbles: true }));
        });

        expect(onValueChange).toHaveBeenCalledWith(49);
        unmount();
    });

    it('clamps wheel increment at max boundary', () => {
        const onValueChange = jest.fn();
        const { slider, unmount } = renderSlider({ value: 100, min: 0, max: 100, step: 1, onValueChange });

        act(() => {
            slider.dispatchEvent(new WheelEvent('wheel', { deltaY: -1, bubbles: true }));
        });

        expect(onValueChange).not.toHaveBeenCalled();
        unmount();
    });

    it('clamps wheel decrement at min boundary', () => {
        const onValueChange = jest.fn();
        const { slider, unmount } = renderSlider({ value: 0, min: 0, max: 100, step: 1, onValueChange });

        act(() => {
            slider.dispatchEvent(new WheelEvent('wheel', { deltaY: 1, bubbles: true }));
        });

        expect(onValueChange).not.toHaveBeenCalled();
        unmount();
    });

    it('handles wheel with decimal step', () => {
        const onValueChange = jest.fn();
        const { slider, unmount } = renderSlider({ value: 0.5, min: 0, max: 1, step: 0.1, onValueChange });

        act(() => {
            slider.dispatchEvent(new WheelEvent('wheel', { deltaY: -1, bubbles: true }));
        });

        expect(onValueChange).toHaveBeenCalledWith(0.6);
        unmount();
    });

    it('works with negative min', () => {
        const onValueChange = jest.fn();
        const { slider, unmount } = renderSlider({ value: 0, min: -50, max: 50, onValueChange });

        // clientX=0 => 0% => -50
        pointerDown(slider, 0);

        expect(onValueChange).toHaveBeenCalledWith(-50);
        unmount();
    });
});
