import { describe, expect, it, mock, fireEvent, render, act } from "@crab-dev/wake/test/react";
import Checkbox from '../checkbox.js';
import CheckboxGroup from '../checkbox-group.js';
import type { CheckboxProps } from '../types.js';
(globalThis as typeof globalThis & {
    IS_REACT_ACT_ENVIRONMENT?: boolean;
}).IS_REACT_ACT_ENVIRONMENT = true;
const renderCheckbox = async (props: Partial<CheckboxProps> = {}) => {
    const renderResult = await render(<Checkbox {...props}>Checkbox Text</Checkbox>);
    const input = renderResult.container.querySelector('input[type="checkbox"]') as HTMLInputElement;
    return {
        ...renderResult,
        input,
    };
};
const clickCheckbox = async (input: HTMLInputElement) => {
    await act(async () => {
        await fireEvent.click(input);
    });
};
describe('Checkbox', () => {
    it('renders correctly', async () => {
        const { container } = await render(<Checkbox>Test</Checkbox>);
        expect(container.querySelector('label')).toBeTruthy();
        expect(container.querySelector('input[type="checkbox"]')).toBeTruthy();
        expect(container.textContent).toContain('Test');
    });
    it('renders with only aria-label and no children', async () => {
        const { container } = await render(<Checkbox aria-label="checkbox only"/>);
        const input = container.querySelector('input[type="checkbox"]');
        expect(input).toBeTruthy();
    });
    it('handles controlled checked state', async () => {
        const { input, rerender } = await renderCheckbox({ checked: false });
        expect(input.checked).toBe(false);
        await rerender(<Checkbox checked={true}>Checkbox Text</Checkbox>);
        expect(input.checked).toBe(true);
    });
    it('handles uncontrolled defaultChecked', async () => {
        const { input } = await renderCheckbox({ defaultChecked: true });
        expect(input.checked).toBe(true);
    });
    it('calls onChange when clicked', async () => {
        const onChange = mock.fn();
        const { input } = await renderCheckbox({ onChange });
        await clickCheckbox(input);
        expect(onChange).toHaveBeenCalledTimes(1);
        expect(onChange).toHaveBeenCalledWith(true, expect.anything());
    });
    it('sets disabled attribute on the input', async () => {
        const { input } = await renderCheckbox({ disabled: true });
        expect(input.disabled).toBe(true);
    });
    it('sets data-disabled on the label when disabled', async () => {
        const { container } = await render(<Checkbox disabled>Disabled</Checkbox>);
        const label = container.querySelector('label');
        expect(label?.hasAttribute('data-disabled')).toBe(true);
    });
    it('forwards className to the wrapper label', async () => {
        const { container } = await render(<Checkbox className="extra-class">Test</Checkbox>);
        const label = container.querySelector('label');
        expect(label?.className).toContain('extra-class');
    });
    it('sets indeterminate state on the input element', async () => {
        const { input } = await renderCheckbox({ indeterminate: true });
        expect(input.indeterminate).toBe(true);
    });
    it('renders check icon when checked', async () => {
        const { container } = await render(<Checkbox checked={true}>Checked</Checkbox>);
        expect(container.querySelector('svg')).toBeTruthy();
    });
    it('renders indeterminate icon when indeterminate', async () => {
        const { container } = await render(<Checkbox checked={true} indeterminate={true}>
                Indeterminate
        </Checkbox>);
        expect(container.querySelector('svg')).toBeFalsy();
    });
    it('does not render icon when unchecked', async () => {
        const { container } = await render(<Checkbox checked={false}>Unchecked</Checkbox>);
        expect(container.querySelector('svg')).toBeFalsy();
    });
});
describe('CheckboxGroup', () => {
    it('renders children', async () => {
        const { container } = await render(<CheckboxGroup>
            <Checkbox value="a">A</Checkbox>
            <Checkbox value="b">B</Checkbox>
        </CheckboxGroup>);
        expect(container.querySelectorAll('input[type="checkbox"]').length).toBe(2);
    });
    it('controls checked state via value prop', async () => {
        const { container } = await render(<CheckboxGroup value={['a']}>
            <Checkbox value="a">A</Checkbox>
            <Checkbox value="b">B</Checkbox>
        </CheckboxGroup>);
        const inputs = container.querySelectorAll<HTMLInputElement>('input[type="checkbox"]');
        expect(inputs[0].checked).toBe(true);
        expect(inputs[1].checked).toBe(false);
    });
    it('calls onChange when a checkbox is toggled', async () => {
        const onChange = mock.fn();
        const { container } = await render(<CheckboxGroup value={['a']} onChange={onChange}>
            <Checkbox value="a">A</Checkbox>
            <Checkbox value="b">B</Checkbox>
        </CheckboxGroup>);
        const inputs = container.querySelectorAll<HTMLInputElement>('input[type="checkbox"]');
        await act(async () => {
            await fireEvent.click(inputs[1]);
        });
        expect(onChange).toHaveBeenCalledWith(['a', 'b']);
    });
    it('removes value from selection when unchecking', async () => {
        const onChange = mock.fn();
        const { container } = await render(<CheckboxGroup value={['a', 'b']} onChange={onChange}>
            <Checkbox value="a">A</Checkbox>
            <Checkbox value="b">B</Checkbox>
        </CheckboxGroup>);
        const inputs = container.querySelectorAll<HTMLInputElement>('input[type="checkbox"]');
        await act(async () => {
            await fireEvent.click(inputs[0]);
        });
        expect(onChange).toHaveBeenCalledWith(['b']);
    });
    it('disables all checkboxes when group is disabled', async () => {
        const { container } = await render(<CheckboxGroup disabled>
            <Checkbox value="a">A</Checkbox>
            <Checkbox value="b">B</Checkbox>
        </CheckboxGroup>);
        const inputs = container.querySelectorAll<HTMLInputElement>('input[type="checkbox"]');
        expect(inputs[0].disabled).toBe(true);
        expect(inputs[1].disabled).toBe(true);
    });
    it('supports defaultValue for uncontrolled mode', async () => {
        const { container } = await render(<CheckboxGroup defaultValue={['b']}>
            <Checkbox value="a">A</Checkbox>
            <Checkbox value="b">B</Checkbox>
        </CheckboxGroup>);
        const inputs = container.querySelectorAll<HTMLInputElement>('input[type="checkbox"]');
        expect(inputs[0].checked).toBe(false);
        expect(inputs[1].checked).toBe(true);
    });
    it('forwards className to the group wrapper', async () => {
        const { container } = await render(<CheckboxGroup className="group-class">
            <Checkbox value="a">A</Checkbox>
        </CheckboxGroup>);
        const div = container.querySelector('[role="group"]');
        expect(div?.className).toContain('group-class');
    });
    it('has role="group" on the container', async () => {
        const { container } = await render(<CheckboxGroup>
            <Checkbox value="a">A</Checkbox>
        </CheckboxGroup>);
        expect(container.querySelector('[role="group"]')).toBeTruthy();
    });
});
