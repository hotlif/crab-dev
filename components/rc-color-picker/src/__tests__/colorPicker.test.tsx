import { act } from 'react';
import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, jest } from '@jest/globals';

import type { OKLCHValue } from '../types.js';

/**
 * Mock @crab-dev/rc-dropdown-container to avoid transitive floating-ui deps in jsdom.
 * Provides a minimal implementation that renders children + overlay when open.
 * refs 形状与真实 DropdownContainer 提供的 context 保持一致:仅暴露 setReference。
 */
jest.mock('@crab-dev/rc-dropdown-container', () => {
    // eslint-disable-next-line @typescript-eslint/no-require-imports, no-undef
    const mockReact = require('react');

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const DropdownContext = mockReact.createContext(null as any);

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    function MockDropdownContainer({ children, overlay }: { children: any; overlay: any }) {
        const [open, setOpen] = mockReact.useState(false);
        const ctx = {
            state: { open },
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            dispatch: (action: any) => {
                if (action.type === 'setOpen') setOpen(action.payload);
            },
            refs: { setReference: () => {} },
        };
        return mockReact.createElement(
            'div',
            null,
            mockReact.createElement(DropdownContext, { value: ctx }, children, open ? overlay : null),
        );
    }

    function useDropdownContext() {
        const ctx = mockReact.use(DropdownContext);
        if (!ctx) throw new Error('useDropdownContext must be used within a DropdownContainer');
        return ctx;
    }

    return {
        __esModule: true,
        default: MockDropdownContainer,
        useDropdownContext,
    };
});

// import after mock declaration (jest.mock is hoisted)
import ColorPicker from '../colorPicker/colorPicker.js';
import type { ColorPickerProps } from '../colorPicker/colorPicker.js';

(
    globalThis as typeof globalThis & { IS_REACT_ACT_ENVIRONMENT?: boolean }
).IS_REACT_ACT_ENVIRONMENT = true;

// jsdom 未内置 ResizeObserver;面板内的 RcSelect(颜色格式选择器)依赖它测量触发器宽度。
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

const defaultValue: OKLCHValue = { lightness: 0.5, chroma: 0.15, hue: 180 };

const renderColorPicker = (props: Partial<ColorPickerProps> = {}) => {
    const onValueChange = jest.fn<(v: OKLCHValue) => void>();
    const renderResult = render(
        <ColorPicker value={defaultValue} onValueChange={onValueChange} {...props} />,
    );
    const trigger = screen.getByRole('button', { name: '选择颜色' });
    return { ...renderResult, trigger, onValueChange };
};

describe('ColorPicker', () => {
    it('renders without runtime error', () => {
        const { container } = renderColorPicker();
        expect(container.firstElementChild).toBeTruthy();
    });

    it('shows a swatch tinted with the current color', () => {
        const value: OKLCHValue = { lightness: 0.7, chroma: 0.2, hue: 120 };
        const { container } = renderColorPicker({ value });
        const swatch = container.querySelector('[style*="oklch"]') as HTMLElement;
        // jsdom 会把 `oklch(... / 1)` 归一化为不带 alpha 的形式
        expect(swatch.style.backgroundColor).toBe('oklch(0.7 0.2 120)');
    });

    it('exposes the trigger as an accessible button', () => {
        const { trigger } = renderColorPicker();
        expect(trigger.getAttribute('aria-haspopup')).toBe('dialog');
        expect(trigger.getAttribute('aria-expanded')).toBe('false');
    });

    it('opens the overlay on click', () => {
        const { trigger } = renderColorPicker();
        expect(screen.queryByText('确定')).toBeNull();
        act(() => {
            fireEvent.click(trigger);
        });
        expect(screen.getByText('确定')).toBeTruthy();
        expect(screen.getByText('取消')).toBeTruthy();
    });

    it('opens the overlay via keyboard (Enter)', () => {
        const { trigger } = renderColorPicker();
        act(() => {
            fireEvent.keyDown(trigger, { key: 'Enter' });
        });
        expect(screen.getByText('确定')).toBeTruthy();
    });

    it('does NOT open on focus (focus must not auto-open)', () => {
        const { trigger } = renderColorPicker();
        act(() => {
            fireEvent.focus(trigger);
        });
        expect(screen.queryByText('确定')).toBeNull();
    });

    it('shows four sliders (incl. alpha) in the overlay by default', () => {
        const { trigger } = renderColorPicker();
        act(() => {
            fireEvent.click(trigger);
        });
        expect(screen.getAllByRole('slider')).toHaveLength(4);
    });

    it('shows three sliders when showAlpha is false', () => {
        const { trigger } = renderColorPicker({ showAlpha: false });
        act(() => {
            fireEvent.click(trigger);
        });
        expect(screen.getAllByRole('slider')).toHaveLength(3);
    });

    it('commits the value and closes on confirm', () => {
        const { trigger, onValueChange } = renderColorPicker();
        act(() => {
            fireEvent.click(trigger);
        });
        act(() => {
            fireEvent.click(screen.getByText('确定'));
        });
        expect(onValueChange).toHaveBeenCalledWith(defaultValue);
        expect(screen.queryByText('确定')).toBeNull();
    });

    it('does not call onValueChange on cancel', () => {
        const { trigger, onValueChange } = renderColorPicker();
        act(() => {
            fireEvent.click(trigger);
        });
        act(() => {
            fireEvent.click(screen.getByText('取消'));
        });
        expect(onValueChange).not.toHaveBeenCalled();
        expect(screen.queryByText('取消')).toBeNull();
    });

    it('does not open when disabled', () => {
        const { trigger } = renderColorPicker({ disabled: true });
        expect(trigger.getAttribute('aria-disabled')).toBe('true');
        act(() => {
            fireEvent.click(trigger);
        });
        expect(screen.queryByText('确定')).toBeNull();
    });

    it('shows the reset button only when allowClear is set', () => {
        const { trigger } = renderColorPicker({ allowClear: true });
        act(() => {
            fireEvent.click(trigger);
        });
        expect(screen.getByText('重置')).toBeTruthy();
    });

    it('renders with a custom locale', () => {
        const { trigger } = renderColorPicker({
            locale: {
                overlay: { confirmText: 'OK', cancelText: 'Cancel' },
                panel: { labelLightness: 'L', labelChroma: 'C', labelHue: 'H', labelAlpha: 'A' },
            },
        });
        act(() => {
            fireEvent.click(trigger);
        });
        expect(screen.getByText('OK')).toBeTruthy();
        expect(screen.getByText('Cancel')).toBeTruthy();
        expect(screen.getByText('L')).toBeTruthy();
    });

    it('works uncontrolled via defaultValue', () => {
        render(<ColorPicker defaultValue={defaultValue} />);
        const trigger = screen.getByRole('button', { name: '选择颜色' });
        act(() => {
            fireEvent.click(trigger);
        });
        expect(screen.getByText('确定')).toBeTruthy();
    });

    it('closes on pointerdown outside the trigger and overlay', () => {
        const { trigger } = renderColorPicker();
        act(() => {
            fireEvent.click(trigger);
        });
        expect(screen.getByText('确定')).toBeTruthy();
        act(() => {
            document.body.dispatchEvent(new MouseEvent('pointerdown', { bubbles: true }));
        });
        expect(screen.queryByText('确定')).toBeNull();
    });

    it('stays open on pointerdown inside the overlay', () => {
        const { trigger } = renderColorPicker();
        act(() => {
            fireEvent.click(trigger);
        });
        const dialog = screen.getByRole('dialog');
        act(() => {
            dialog.dispatchEvent(new MouseEvent('pointerdown', { bubbles: true }));
        });
        expect(screen.getByText('确定')).toBeTruthy();
    });

    it('falls back to default texts when a partial locale is given', () => {
        const { trigger } = renderColorPicker({
            locale: { panel: { labelLightness: 'L', labelChroma: 'C', labelHue: 'H' } },
        });
        act(() => {
            fireEvent.click(trigger);
        });
        // overlay 文案与可选的 labelAlpha 均回退默认
        expect(screen.getByText('确定')).toBeTruthy();
        expect(screen.getByText('取消')).toBeTruthy();
        expect(screen.getByText('L')).toBeTruthy();
        expect(screen.getByText('透明度')).toBeTruthy();
    });

    it('merges a user className instead of replacing the trigger style', () => {
        const { trigger } = renderColorPicker({ className: 'my-custom' });
        expect(trigger.classList.contains('my-custom')).toBe(true);
        act(() => {
            fireEvent.click(trigger);
        });
        expect(screen.getByText('确定')).toBeTruthy();
    });
});
