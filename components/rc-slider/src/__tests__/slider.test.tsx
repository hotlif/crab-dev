import { afterEach, beforeEach, describe, expect, it, mock, render, screen, act } from "@crab-dev/wake/test/react";
import Slider from '../slider.js';
import type { SliderProps } from '../slider.js';
(globalThis as typeof globalThis & {
    IS_REACT_ACT_ENVIRONMENT?: boolean;
}).IS_REACT_ACT_ENVIRONMENT = true;
const originalGetBoundingClientRect = Element.prototype.getBoundingClientRect;
// jsdom does not implement pointer capture APIs or layout
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
const pointerCancel = async (el: HTMLElement) => {
    await act(() => {
        el.dispatchEvent(new PointerEvent('pointercancel', { bubbles: true, cancelable: true }));
    });
};
const renderSlider = async (props: Partial<SliderProps> = {}) => {
    const defaultProps: SliderProps = { value: 50 };
    const renderResult = await render(<Slider {...defaultProps} {...props}/>);
    const slider = screen.getByRole('slider') as HTMLDivElement;
    return {
        ...renderResult,
        slider,
    };
};
describe('Slider', () => {
    it('renders without runtime error', async () => {
        const { slider, unmount } = await renderSlider();
        expect(slider).toBeTruthy();
        await unmount();
    });
    it('renders correct aria attributes with default min/max', async () => {
        const { slider, unmount } = await renderSlider({ value: 30 });
        expect(slider.getAttribute('aria-valuemin')).toBe('0');
        expect(slider.getAttribute('aria-valuemax')).toBe('100');
        expect(slider.getAttribute('aria-valuenow')).toBe('30');
        await unmount();
    });
    it('renders correct aria attributes with custom min/max', async () => {
        const { slider, unmount } = await renderSlider({ value: 5, min: 0, max: 10 });
        expect(slider.getAttribute('aria-valuemin')).toBe('0');
        expect(slider.getAttribute('aria-valuemax')).toBe('10');
        expect(slider.getAttribute('aria-valuenow')).toBe('5');
        await unmount();
    });
    it('renders all data-slot elements', async () => {
        const { slider, unmount } = await renderSlider();
        expect(slider.getAttribute('data-slot')).toBe('slider-root');
        expect(slider.querySelector('[data-slot="slider-rail"]')).toBeTruthy();
        expect(slider.querySelector('[data-slot="slider-track"]')).toBeTruthy();
        expect(slider.querySelector('[data-slot="slider-handle-container"]')).toBeTruthy();
        expect(slider.querySelector('[data-slot="slider-handle"]')).toBeTruthy();
        expect(slider.querySelector('[data-slot="slider-halo"]')).toBeTruthy();
        await unmount();
    });
    it('forwards className and data-* attributes', async () => {
        const { slider, unmount } = await renderSlider({
            className: 'custom-slider',
            'data-test-id': 'my-slider',
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } as any);
        expect(slider.className).toContain('custom-slider');
        expect(slider.getAttribute('data-test-id')).toBe('my-slider');
        await unmount();
    });
    it('computes track width based on value percent', async () => {
        const { slider, unmount } = await renderSlider({ value: 25, min: 0, max: 100 });
        const track = slider.querySelector('[data-slot="slider-track"]') as HTMLDivElement;
        expect(parseFloat(track.style.width)).toBeCloseTo(25, 2);
        await unmount();
    });
    it('clamps track width to 0% when value is below min', async () => {
        const { slider, unmount } = await renderSlider({ value: -10, min: 0, max: 100 });
        const track = slider.querySelector('[data-slot="slider-track"]') as HTMLDivElement;
        expect(parseFloat(track.style.width)).toBeCloseTo(0, 2);
        await unmount();
    });
    it('clamps track width to 100% when value exceeds max', async () => {
        const { slider, unmount } = await renderSlider({ value: 200, min: 0, max: 100 });
        const track = slider.querySelector('[data-slot="slider-track"]') as HTMLDivElement;
        expect(parseFloat(track.style.width)).toBeCloseTo(100, 2);
        await unmount();
    });
    it('positions handle at correct percent', async () => {
        const { slider, unmount } = await renderSlider({ value: 75, min: 0, max: 100 });
        const handleContainer = slider.querySelector('[data-slot="slider-handle-container"]') as HTMLDivElement;
        expect(parseFloat(handleContainer.style.left)).toBeCloseTo(75, 2);
        await unmount();
    });
    it('calls onValueChange on pointerdown', async () => {
        const onValueChange = mock.fn();
        const { slider, unmount } = await renderSlider({ value: 50, onValueChange });
        await pointerDown(slider, 150);
        expect(onValueChange).toHaveBeenCalledWith(75);
        await unmount();
    });
    it('calls onValueChange during pointer drag', async () => {
        const onValueChange = mock.fn();
        const { slider, unmount } = await renderSlider({ value: 0, onValueChange });
        await pointerDown(slider, 50);
        await pointerMove(slider, 100);
        expect(onValueChange).toHaveBeenCalledWith(50);
        await unmount();
    });
    it('stops dragging on pointerup', async () => {
        const onValueChange = mock.fn();
        const { slider, unmount } = await renderSlider({ value: 0, onValueChange });
        await pointerDown(slider, 50);
        await pointerUp(slider, 50);
        onValueChange.clear();
        await pointerMove(slider, 150);
        expect(onValueChange).not.toHaveBeenCalled();
        await unmount();
    });
    it('snaps value to step', async () => {
        const onValueChange = mock.fn();
        const { slider, unmount } = await renderSlider({ value: 0, min: 0, max: 100, step: 10, onValueChange });
        // clientX=47 on 200px => 23.5% => raw value 23.5, snapped to step 10 => 20
        await pointerDown(slider, 47);
        expect(onValueChange).toHaveBeenCalledWith(20);
        await unmount();
    });
    it('handles decimal step precision correctly', async () => {
        const onValueChange = mock.fn();
        const { slider, unmount } = await renderSlider({ value: 0, min: 0, max: 1, step: 0.1, onValueChange });
        // clientX=60 on 200px => 30% => raw 0.3, step 0.1 => snapped 0.3
        await pointerDown(slider, 60);
        expect(onValueChange).toHaveBeenCalledWith(0.3);
        await unmount();
    });
    it('clamps value to min on pointer at left edge', async () => {
        const onValueChange = mock.fn();
        Element.prototype.getBoundingClientRect = (() => ({
            left: 100, width: 200, top: 0, height: 20, right: 300, bottom: 20, x: 100, y: 0, toJSON() { },
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
        })) as any;
        const { slider, unmount } = await renderSlider({ value: 50, min: 0, max: 100, onValueChange });
        await pointerDown(slider, 0);
        expect(onValueChange).toHaveBeenCalledWith(0);
        await unmount();
    });
    it('clamps value to max on pointer past right edge', async () => {
        const onValueChange = mock.fn();
        const { slider, unmount } = await renderSlider({ value: 50, min: 0, max: 100, onValueChange });
        await pointerDown(slider, 500);
        expect(onValueChange).toHaveBeenCalledWith(100);
        await unmount();
    });
    it('does not call onValueChange when value does not change', async () => {
        const onValueChange = mock.fn();
        const { slider, unmount } = await renderSlider({ value: 50, min: 0, max: 100, onValueChange });
        // clientX=100 on 200px => 50%, same as current value
        await pointerDown(slider, 100);
        expect(onValueChange).not.toHaveBeenCalled();
        await unmount();
    });
    it('sets data-is-dragging on handle during drag', async () => {
        const { slider, unmount } = await renderSlider({ value: 50 });
        const handle = slider.querySelector('[data-slot="slider-handle"]') as HTMLDivElement;
        expect(handle.getAttribute('data-is-dragging')).toBe('false');
        await pointerDown(slider, 100);
        expect(handle.getAttribute('data-is-dragging')).toBe('true');
        await pointerUp(slider, 100);
        expect(handle.getAttribute('data-is-dragging')).toBe('false');
        await unmount();
    });
    it('stops dragging on pointercancel', async () => {
        const { slider, unmount } = await renderSlider({ value: 50 });
        const handle = slider.querySelector('[data-slot="slider-handle"]') as HTMLDivElement;
        await pointerDown(slider, 100);
        expect(handle.getAttribute('data-is-dragging')).toBe('true');
        await pointerCancel(slider);
        expect(handle.getAttribute('data-is-dragging')).toBe('false');
        await unmount();
    });
    it('handles wheel event to increment value', async () => {
        const onValueChange = mock.fn();
        const { slider, unmount } = await renderSlider({ value: 50, min: 0, max: 100, step: 1, onValueChange });
        await act(() => {
            slider.dispatchEvent(new WheelEvent('wheel', { deltaY: -1, bubbles: true }));
        });
        expect(onValueChange).toHaveBeenCalledWith(51);
        await unmount();
    });
    it('handles wheel event to decrement value', async () => {
        const onValueChange = mock.fn();
        const { slider, unmount } = await renderSlider({ value: 50, min: 0, max: 100, step: 1, onValueChange });
        await act(() => {
            slider.dispatchEvent(new WheelEvent('wheel', { deltaY: 1, bubbles: true }));
        });
        expect(onValueChange).toHaveBeenCalledWith(49);
        await unmount();
    });
    it('clamps wheel increment at max boundary', async () => {
        const onValueChange = mock.fn();
        const { slider, unmount } = await renderSlider({ value: 100, min: 0, max: 100, step: 1, onValueChange });
        await act(() => {
            slider.dispatchEvent(new WheelEvent('wheel', { deltaY: -1, bubbles: true }));
        });
        expect(onValueChange).not.toHaveBeenCalled();
        await unmount();
    });
    it('clamps wheel decrement at min boundary', async () => {
        const onValueChange = mock.fn();
        const { slider, unmount } = await renderSlider({ value: 0, min: 0, max: 100, step: 1, onValueChange });
        await act(() => {
            slider.dispatchEvent(new WheelEvent('wheel', { deltaY: 1, bubbles: true }));
        });
        expect(onValueChange).not.toHaveBeenCalled();
        await unmount();
    });
    it('handles wheel with decimal step', async () => {
        const onValueChange = mock.fn();
        const { slider, unmount } = await renderSlider({ value: 0.5, min: 0, max: 1, step: 0.1, onValueChange });
        await act(() => {
            slider.dispatchEvent(new WheelEvent('wheel', { deltaY: -1, bubbles: true }));
        });
        expect(onValueChange).toHaveBeenCalledWith(0.6);
        await unmount();
    });
    it('works with negative min', async () => {
        const onValueChange = mock.fn();
        const { slider, unmount } = await renderSlider({ value: 0, min: -50, max: 50, onValueChange });
        // clientX=0 => 0% => -50
        await pointerDown(slider, 0);
        expect(onValueChange).toHaveBeenCalledWith(-50);
        await unmount();
    });
});
