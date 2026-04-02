import { act } from 'react';
import { cleanup, fireEvent, render } from '@testing-library/react';
import { afterEach, describe, expect, it, jest } from '@jest/globals';

import Switch from '../switch.js';
import type { SwitchProps } from '../types.js';

(
    globalThis as typeof globalThis & { IS_REACT_ACT_ENVIRONMENT?: boolean }
).IS_REACT_ACT_ENVIRONMENT = true;

const renderSwitch = (props: Partial<SwitchProps> = {}) => {
    const renderResult = render(<Switch aria-label="toggle" {...props} />);
    const button = renderResult.container.querySelector('button[role="switch"]') as HTMLButtonElement;

    return {
        ...renderResult,
        button,
    };
};

const clickSwitch = (button: HTMLButtonElement) => {
    act(() => {
        fireEvent.click(button);
    });
};

describe('Switch', () => {
    afterEach(() => {
        cleanup();
    });

    it('renders correctly', () => {
        const { container } = render(<Switch aria-label="toggle" />);
        expect(container.querySelector('button[role="switch"]')).toBeTruthy();
    });

    it('renders with children label', () => {
        const { container } = render(<Switch>Enable</Switch>);
        expect(container.textContent).toContain('Enable');
    });

    it('has aria-checked false by default', () => {
        const { button } = renderSwitch();
        expect(button.getAttribute('aria-checked')).toBe('false');
    });

    it('handles controlled checked state', () => {
        const { button, rerender } = renderSwitch({ checked: false });
        expect(button.getAttribute('aria-checked')).toBe('false');

        rerender(<Switch aria-label="toggle" checked={true} />);
        expect(button.getAttribute('aria-checked')).toBe('true');
    });

    it('handles uncontrolled defaultChecked', () => {
        const { button } = renderSwitch({ defaultChecked: true });
        expect(button.getAttribute('aria-checked')).toBe('true');
    });

    it('calls onChange when clicked', () => {
        const onChange = jest.fn();
        const { button } = renderSwitch({ onChange });

        clickSwitch(button);

        expect(onChange).toHaveBeenCalledTimes(1);
        expect(onChange).toHaveBeenCalledWith(true, expect.anything());
    });

    it('calls onChange with false when toggling off', () => {
        const onChange = jest.fn();
        const { button } = renderSwitch({ checked: true, onChange });

        clickSwitch(button);

        expect(onChange).toHaveBeenCalledWith(false, expect.anything());
    });

    it('sets disabled attribute on the button', () => {
        const { button } = renderSwitch({ disabled: true });
        expect(button.disabled).toBe(true);
    });

    it('sets data-disabled on the wrapper when disabled', () => {
        const { container } = render(<Switch disabled aria-label="toggle" />);
        const label = container.querySelector('label');
        expect(label?.hasAttribute('data-disabled')).toBe(true);
    });

    it('does not set data-disabled when not disabled', () => {
        const { container } = render(<Switch aria-label="toggle" />);
        const label = container.querySelector('label');
        expect(label?.hasAttribute('data-disabled')).toBe(false);
    });

    it('forwards className to the wrapper label', () => {
        const { container } = render(<Switch className="extra-class" aria-label="toggle" />);
        const label = container.querySelector('label');
        expect(label?.className).toContain('extra-class');
    });

    it('has role="switch" on the button element', () => {
        const { button } = renderSwitch();
        expect(button.getAttribute('role')).toBe('switch');
    });

    it('has type="button" to prevent form submission', () => {
        const { button } = renderSwitch();
        expect(button.getAttribute('type')).toBe('button');
    });

    it('renders with large size', () => {
        const { container } = render(<Switch size="large" aria-label="toggle" />);
        expect(container.querySelector('button[role="switch"]')).toBeTruthy();
    });

    it('renders with middle size', () => {
        const { container } = render(<Switch size="middle" aria-label="toggle" />);
        expect(container.querySelector('button[role="switch"]')).toBeTruthy();
    });

    it('renders with small size', () => {
        const { container } = render(<Switch size="small" aria-label="toggle" />);
        expect(container.querySelector('button[role="switch"]')).toBeTruthy();
    });

    it('toggles in uncontrolled mode on click', () => {
        const onChange = jest.fn();
        const { button } = renderSwitch({ onChange });

        clickSwitch(button);
        expect(onChange).toHaveBeenLastCalledWith(true, expect.anything());

        clickSwitch(button);
        expect(onChange).toHaveBeenLastCalledWith(false, expect.anything());
    });
});
