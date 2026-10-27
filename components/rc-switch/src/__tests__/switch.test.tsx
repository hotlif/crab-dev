import { describe, expect, it, mock, fireEvent, render, act } from "@crab-dev/wake/test/react";
import Switch from '../switch.js';
import type { SwitchProps } from '../types.js';
(globalThis as typeof globalThis & {
    IS_REACT_ACT_ENVIRONMENT?: boolean;
}).IS_REACT_ACT_ENVIRONMENT = true;
const renderSwitch = async (props: Partial<SwitchProps> = {}) => {
    const { checked, defaultChecked, onCheckedChange = () => {}, ...restProps } = props;
    const stateProps = checked === undefined ? { defaultChecked, onCheckedChange } : { checked, onCheckedChange };
    const renderResult = await render(<Switch aria-label="toggle" {...restProps} {...stateProps}>{props.children ?? null}</Switch>);
    const button = renderResult.container.querySelector('button[role="switch"]') as HTMLButtonElement;
    return {
        ...renderResult,
        button,
    };
};
const clickSwitch = async (button: HTMLButtonElement) => {
    await act(async () => {
        await fireEvent.click(button);
    });
};
describe('Switch', () => {
    it('renders correctly', async () => {
        const { container } = await render(<Switch aria-label="toggle"/>);
        expect(container.querySelector('button[role="switch"]')).toBeTruthy();
    });
    it('renders with children label', async () => {
        const { container } = await render(<Switch>Enable</Switch>);
        expect(container.textContent).toContain('Enable');
    });
    it('has aria-checked false by default', async () => {
        const { button } = await renderSwitch();
        expect(button.getAttribute('aria-checked')).toBe('false');
    });
    it('handles controlled checked state', async () => {
        const { button, rerender } = await renderSwitch({ checked: false });
        expect(button.getAttribute('aria-checked')).toBe('false');
        await rerender(<Switch aria-label="toggle" checked={true}/>);
        expect(button.getAttribute('aria-checked')).toBe('true');
    });
    it('handles uncontrolled defaultChecked', async () => {
        const { button } = await renderSwitch({ defaultChecked: true });
        expect(button.getAttribute('aria-checked')).toBe('true');
    });
    it('calls onCheckedChange when clicked', async () => {
        const onCheckedChange = mock.fn();
        const { button } = await renderSwitch({ onCheckedChange });
        await clickSwitch(button);
        expect(onCheckedChange).toHaveBeenCalledTimes(1);
        expect(onCheckedChange).toHaveBeenCalledWith(true, expect.objectContaining({ reason: 'toggle' }));
    });
    it('calls onCheckedChange with false when toggling off', async () => {
        const onCheckedChange = mock.fn();
        const { button } = await renderSwitch({ checked: true, onCheckedChange });
        await clickSwitch(button);
        expect(onCheckedChange).toHaveBeenCalledWith(false, expect.objectContaining({ reason: 'toggle' }));
    });
    it('sets disabled attribute on the button', async () => {
        const { button } = await renderSwitch({ disabled: true });
        expect(button.disabled).toBe(true);
    });
    it('sets data-disabled on the wrapper when disabled', async () => {
        const { container } = await render(<Switch disabled aria-label="toggle"/>);
        const label = container.querySelector('label');
        expect(label?.hasAttribute('data-disabled')).toBe(true);
    });
    it('does not set data-disabled when not disabled', async () => {
        const { container } = await render(<Switch aria-label="toggle"/>);
        const label = container.querySelector('label');
        expect(label?.hasAttribute('data-disabled')).toBe(false);
    });
    it('forwards className to the wrapper label', async () => {
        const { container } = await render(<Switch className="extra-class" aria-label="toggle"/>);
        const label = container.querySelector('label');
        expect(label?.className).toContain('extra-class');
    });
    it('has role="switch" on the button element', async () => {
        const { button } = await renderSwitch();
        expect(button.getAttribute('role')).toBe('switch');
    });
    it('has type="button" to prevent form submission', async () => {
        const { button } = await renderSwitch();
        expect(button.getAttribute('type')).toBe('button');
    });
    it('renders with large size', async () => {
        const { container } = await render(<Switch size="large" aria-label="toggle"/>);
        expect(container.querySelector('button[role="switch"]')).toBeTruthy();
    });
    it('renders with middle size', async () => {
        const { container } = await render(<Switch size="medium" aria-label="toggle"/>);
        expect(container.querySelector('button[role="switch"]')).toBeTruthy();
    });
    it('renders with small size', async () => {
        const { container } = await render(<Switch size="small" aria-label="toggle"/>);
        expect(container.querySelector('button[role="switch"]')).toBeTruthy();
    });
    it('toggles in uncontrolled mode on click', async () => {
        const onCheckedChange = mock.fn();
        const { button } = await renderSwitch({ onCheckedChange });
        await clickSwitch(button);
        expect(onCheckedChange).toHaveBeenLastCalledWith(true, expect.objectContaining({ reason: 'toggle' }));
        await clickSwitch(button);
        expect(onCheckedChange).toHaveBeenLastCalledWith(false, expect.objectContaining({ reason: 'toggle' }));
    });
});
