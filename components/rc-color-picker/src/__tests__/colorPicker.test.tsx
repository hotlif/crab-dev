import React, { act } from 'react';
import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, jest } from '@jest/globals';

import type { OKLCHValue } from '../panels/colorPickerPanel.js';

/**
 * Mock @crab-dev/rc-dropdown-container to avoid transitive motion/floating-ui deps.
 * Provides a minimal implementation that renders children + overlay when open.
 */
jest.mock('@crab-dev/rc-dropdown-container', () => {
    // eslint-disable-next-line @typescript-eslint/no-require-imports, no-undef
    const mockReact = require('react');

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const DropdownContext = mockReact.createContext(null as any);

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    function MockDropdownContainer({ children, overlay }: { children: any; overlay: any }) {
        const [open, setOpen] = mockReact.useState(false);
        const ctx = mockReact.useMemo(
            () => ({
                state: { open },
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                dispatch: (action: any) => {
                    if (action.type === 'setOpen') setOpen(action.payload);
                },
                refs: { setReference: () => {} },
            }),
            [open],
        );
        return mockReact.createElement(
            'div',
            null,
            mockReact.createElement(DropdownContext.Provider, { value: ctx }, children, open ? overlay : null),
        );
    }

    function useDropdownContext() {
        const ctx = mockReact.useContext(DropdownContext);
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

const renderColorPicker = (props: Partial<ColorPickerProps> = {}) => {
    const onValueChange = jest.fn<(v: OKLCHValue) => void>();
    const renderResult = render(
        <ColorPicker
            value={defaultValue}
            onValueChange={onValueChange}
            {...props}
        />,
    );
    const colorInput = renderResult.container.querySelector('[tabindex="0"]') as HTMLElement;

    return {
        ...renderResult,
        colorInput,
        onValueChange,
    };
};

describe('ColorPicker', () => {
    afterEach(() => {
        cleanup();
    });

    it('renders without runtime error', () => {
        const { container } = renderColorPicker();
        expect(container.firstElementChild).toBeTruthy();
    });

    it('shows color swatch with correct background color', () => {
        const value: OKLCHValue = { lightness: 0.7, chroma: 0.2, hue: 120 };
        const { container } = renderColorPicker({ value });
        const swatch = container.querySelector('[style]') as HTMLElement;
        expect(swatch.style.backgroundColor).toBe('oklch(0.7 0.2 120)');
    });

    it('opens overlay when input is clicked', () => {
        const { colorInput } = renderColorPicker();

        expect(screen.queryByText('确定')).toBeNull();

        act(() => {
            fireEvent.click(colorInput);
        });

        expect(screen.getByText('确定')).toBeTruthy();
        expect(screen.getByText('取消')).toBeTruthy();
    });

    it('opens overlay when input is focused', () => {
        const { colorInput } = renderColorPicker();

        act(() => {
            fireEvent.focus(colorInput);
        });

        expect(screen.getByText('确定')).toBeTruthy();
    });

    it('shows three sliders in the overlay when opened', () => {
        const { colorInput } = renderColorPicker();

        act(() => {
            fireEvent.click(colorInput);
        });

        const sliders = screen.getAllByRole('slider');
        expect(sliders).toHaveLength(3);
    });

    it('closes overlay when cancel button is clicked', () => {
        const { colorInput } = renderColorPicker();

        act(() => {
            fireEvent.click(colorInput);
        });

        expect(screen.getByText('取消')).toBeTruthy();

        act(() => {
            fireEvent.click(screen.getByText('取消'));
        });

        expect(screen.queryByText('取消')).toBeNull();
    });

    it('calls onValueChange and closes overlay when confirm is clicked', () => {
        const { colorInput, onValueChange } = renderColorPicker();

        act(() => {
            fireEvent.click(colorInput);
        });

        act(() => {
            fireEvent.click(screen.getByText('确定'));
        });

        expect(onValueChange).toHaveBeenCalledWith(defaultValue);
        expect(screen.queryByText('确定')).toBeNull();
    });

    it('renders with custom locale', () => {
        const { colorInput } = renderColorPicker({
            locale: {
                overlay: { confirmText: 'OK', cancelText: 'Cancel' },
                panel: { labelLightness: 'L', labelChroma: 'C', labelHue: 'H' },
            },
        });

        act(() => {
            fireEvent.click(colorInput);
        });

        expect(screen.getByText('OK')).toBeTruthy();
        expect(screen.getByText('Cancel')).toBeTruthy();
        expect(screen.getByText('L')).toBeTruthy();
        expect(screen.getByText('C')).toBeTruthy();
        expect(screen.getByText('H')).toBeTruthy();
    });

    it('does not call onValueChange when cancel is clicked', () => {
        const { colorInput, onValueChange } = renderColorPicker();

        act(() => {
            fireEvent.click(colorInput);
        });

        act(() => {
            fireEvent.click(screen.getByText('取消'));
        });

        expect(onValueChange).not.toHaveBeenCalled();
    });
});
