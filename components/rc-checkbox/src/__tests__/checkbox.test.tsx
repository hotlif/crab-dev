import { act } from 'react';
import { cleanup, fireEvent, render } from '@testing-library/react';
import { afterEach, describe, expect, it, jest } from '@jest/globals';

import Checkbox from '../checkbox.js';
import CheckboxGroup from '../checkbox-group.js';
import type { CheckboxProps } from '../types.js';

(
    globalThis as typeof globalThis & { IS_REACT_ACT_ENVIRONMENT?: boolean }
).IS_REACT_ACT_ENVIRONMENT = true;

const renderCheckbox = (props: Partial<CheckboxProps> = {}) => {
    const renderResult = render(<Checkbox {...props}>Checkbox Text</Checkbox>);
    const input = renderResult.container.querySelector('input[type="checkbox"]') as HTMLInputElement;

    return {
        ...renderResult,
        input,
    };
};

const clickCheckbox = (input: HTMLInputElement) => {
    act(() => {
        fireEvent.click(input);
    });
};

describe('Checkbox', () => {
    afterEach(() => {
        cleanup();
    });

    it('renders correctly', () => {
        const { container } = render(<Checkbox>Test</Checkbox>);
        expect(container.querySelector('label')).toBeTruthy();
        expect(container.querySelector('input[type="checkbox"]')).toBeTruthy();
        expect(container.textContent).toContain('Test');
    });

    it('renders with only aria-label and no children', () => {
        const { container } = render(<Checkbox aria-label="checkbox only" />);
        const input = container.querySelector('input[type="checkbox"]');
        expect(input).toBeTruthy();
    });

    it('handles controlled checked state', () => {
        const { input, rerender } = renderCheckbox({ checked: false });
        expect(input.checked).toBe(false);

        rerender(<Checkbox checked={true}>Checkbox Text</Checkbox>);
        expect(input.checked).toBe(true);
    });

    it('handles uncontrolled defaultChecked', () => {
        const { input } = renderCheckbox({ defaultChecked: true });
        expect(input.checked).toBe(true);
    });

    it('calls onChange when clicked', () => {
        const onChange = jest.fn();
        const { input } = renderCheckbox({ onChange });

        clickCheckbox(input);

        expect(onChange).toHaveBeenCalledTimes(1);
        expect(onChange).toHaveBeenCalledWith(true, expect.anything());
    });

    it('sets disabled attribute on the input', () => {
        const { input } = renderCheckbox({ disabled: true });
        expect(input.disabled).toBe(true);
    });

    it('sets data-disabled on the label when disabled', () => {
        const { container } = render(<Checkbox disabled>Disabled</Checkbox>);
        const label = container.querySelector('label');
        expect(label?.hasAttribute('data-disabled')).toBe(true);
    });

    it('forwards className to the wrapper label', () => {
        const { container } = render(<Checkbox className="extra-class">Test</Checkbox>);
        const label = container.querySelector('label');
        expect(label?.className).toContain('extra-class');
    });

    it('sets indeterminate state on the input element', () => {
        const { input } = renderCheckbox({ indeterminate: true });
        expect(input.indeterminate).toBe(true);
    });

    it('renders check icon when checked', () => {
        const { container } = render(<Checkbox checked={true}>Checked</Checkbox>);
        expect(container.querySelector('svg')).toBeTruthy();
    });

    it('renders indeterminate icon when indeterminate', () => {
        const { container } = render(
            <Checkbox checked={true} indeterminate={true}>
                Indeterminate
            </Checkbox>,
        );
        expect(container.querySelector('svg')).toBeFalsy();
    });

    it('does not render icon when unchecked', () => {
        const { container } = render(<Checkbox checked={false}>Unchecked</Checkbox>);
        expect(container.querySelector('svg')).toBeFalsy();
    });
});

describe('CheckboxGroup', () => {
    afterEach(() => {
        cleanup();
    });

    it('renders children', () => {
        const { container } = render(
            <CheckboxGroup>
                <Checkbox value="a">A</Checkbox>
                <Checkbox value="b">B</Checkbox>
            </CheckboxGroup>,
        );
        expect(container.querySelectorAll('input[type="checkbox"]').length).toBe(2);
    });

    it('controls checked state via value prop', () => {
        const { container } = render(
            <CheckboxGroup value={['a']}>
                <Checkbox value="a">A</Checkbox>
                <Checkbox value="b">B</Checkbox>
            </CheckboxGroup>,
        );
        const inputs = container.querySelectorAll<HTMLInputElement>('input[type="checkbox"]');
        expect(inputs[0].checked).toBe(true);
        expect(inputs[1].checked).toBe(false);
    });

    it('calls onChange when a checkbox is toggled', () => {
        const onChange = jest.fn();
        const { container } = render(
            <CheckboxGroup value={['a']} onChange={onChange}>
                <Checkbox value="a">A</Checkbox>
                <Checkbox value="b">B</Checkbox>
            </CheckboxGroup>,
        );
        const inputs = container.querySelectorAll<HTMLInputElement>('input[type="checkbox"]');

        act(() => {
            fireEvent.click(inputs[1]);
        });

        expect(onChange).toHaveBeenCalledWith(['a', 'b']);
    });

    it('removes value from selection when unchecking', () => {
        const onChange = jest.fn();
        const { container } = render(
            <CheckboxGroup value={['a', 'b']} onChange={onChange}>
                <Checkbox value="a">A</Checkbox>
                <Checkbox value="b">B</Checkbox>
            </CheckboxGroup>,
        );
        const inputs = container.querySelectorAll<HTMLInputElement>('input[type="checkbox"]');

        act(() => {
            fireEvent.click(inputs[0]);
        });

        expect(onChange).toHaveBeenCalledWith(['b']);
    });

    it('disables all checkboxes when group is disabled', () => {
        const { container } = render(
            <CheckboxGroup disabled>
                <Checkbox value="a">A</Checkbox>
                <Checkbox value="b">B</Checkbox>
            </CheckboxGroup>,
        );
        const inputs = container.querySelectorAll<HTMLInputElement>('input[type="checkbox"]');
        expect(inputs[0].disabled).toBe(true);
        expect(inputs[1].disabled).toBe(true);
    });

    it('supports defaultValue for uncontrolled mode', () => {
        const { container } = render(
            <CheckboxGroup defaultValue={['b']}>
                <Checkbox value="a">A</Checkbox>
                <Checkbox value="b">B</Checkbox>
            </CheckboxGroup>,
        );
        const inputs = container.querySelectorAll<HTMLInputElement>('input[type="checkbox"]');
        expect(inputs[0].checked).toBe(false);
        expect(inputs[1].checked).toBe(true);
    });

    it('forwards className to the group wrapper', () => {
        const { container } = render(
            <CheckboxGroup className="group-class">
                <Checkbox value="a">A</Checkbox>
            </CheckboxGroup>,
        );
        const div = container.querySelector('[role="group"]');
        expect(div?.className).toContain('group-class');
    });

    it('has role="group" on the container', () => {
        const { container } = render(
            <CheckboxGroup>
                <Checkbox value="a">A</Checkbox>
            </CheckboxGroup>,
        );
        expect(container.querySelector('[role="group"]')).toBeTruthy();
    });
});
