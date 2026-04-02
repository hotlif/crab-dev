import { act } from 'react';
import { cleanup, fireEvent, render } from '@testing-library/react';
import { afterEach, describe, expect, it, jest } from '@jest/globals';

import Radio from '../radio.js';
import RadioGroup from '../radio-group.js';
import type { RadioProps } from '../types.js';

(
    globalThis as typeof globalThis & { IS_REACT_ACT_ENVIRONMENT?: boolean }
).IS_REACT_ACT_ENVIRONMENT = true;

const renderRadio = (props: Partial<RadioProps> = {}) => {
    const renderResult = render(<Radio {...props}>Radio Text</Radio>);
    const input = renderResult.container.querySelector('input[type="radio"]') as HTMLInputElement;

    return {
        ...renderResult,
        input,
    };
};

describe('Radio', () => {
    afterEach(() => {
        cleanup();
    });

    it('renders correctly with children', () => {
        const { container } = renderRadio();
        expect(container.querySelector('label')).toBeTruthy();
        expect(container.textContent).toContain('Radio Text');
    });

    it('renders with only aria-label and no children', () => {
        const { container } = render(<Radio aria-label="aria only" />);
        const input = container.querySelector('input[type="radio"]');
        expect(input).toBeTruthy();
    });

    it('renders unchecked by default', () => {
        const { input } = renderRadio();
        expect(input.checked).toBe(false);
    });

    it('supports defaultChecked', () => {
        const { input } = renderRadio({ defaultChecked: true });
        expect(input.checked).toBe(true);
    });

    it('supports controlled checked prop', () => {
        const { input } = renderRadio({ checked: true, onChange: () => {} });
        expect(input.checked).toBe(true);
    });

    it('calls onChange when clicked', () => {
        const onChange = jest.fn();
        const { input } = renderRadio({ onChange });

        act(() => {
            fireEvent.click(input);
        });

        expect(onChange).toHaveBeenCalledTimes(1);
        expect(onChange).toHaveBeenCalledWith(true, expect.anything());
    });

    it('marks input as disabled when disabled prop is set', () => {
        const { input } = renderRadio({ disabled: true });
        expect(input.disabled).toBe(true);
    });

    it('sets data-disabled on wrapper when disabled', () => {
        const { container } = renderRadio({ disabled: true });
        const label = container.querySelector('label');
        expect(label?.hasAttribute('data-disabled')).toBe(true);
    });

    it('renders all size variants', () => {
        const sizes: NonNullable<RadioProps['size']>[] = ['large', 'middle', 'small'];

        sizes.forEach((size) => {
            const { container, unmount } = renderRadio({ size });
            expect(container.querySelector('label')?.className.length).toBeGreaterThan(0);
            unmount();
        });
    });

    it('forwards className to wrapper', () => {
        const { container } = renderRadio({ className: 'custom-radio' });
        const label = container.querySelector('label');
        expect(label?.className).toContain('custom-radio');
    });

    it('renders dot indicator when checked', () => {
        const { container } = renderRadio({ checked: true, onChange: () => {} });
        const box = container.querySelector('label > input + span');
        const dot = box?.querySelector('span');
        expect(dot).toBeTruthy();
    });

    it('does not render dot when unchecked', () => {
        const { container } = renderRadio({ checked: false, onChange: () => {} });
        const box = container.querySelector('label > input + span');
        const dot = box?.querySelector('span');
        expect(dot).toBeNull();
    });
});

describe('RadioGroup', () => {
    afterEach(() => {
        cleanup();
    });

    it('renders with role="radiogroup"', () => {
        const { container } = render(
            <RadioGroup>
                <Radio value="a">A</Radio>
                <Radio value="b">B</Radio>
            </RadioGroup>,
        );
        expect(container.querySelector('[role="radiogroup"]')).toBeTruthy();
    });

    it('selects radio matching controlled value', () => {
        const { container } = render(
            <RadioGroup value="b">
                <Radio value="a">A</Radio>
                <Radio value="b">B</Radio>
            </RadioGroup>,
        );
        const inputs = Array.from(container.querySelectorAll<HTMLInputElement>('input[type="radio"]'));
        expect(inputs[0].checked).toBe(false);
        expect(inputs[1].checked).toBe(true);
    });

    it('calls onChange when a radio is clicked', () => {
        const onChange = jest.fn();
        const { container } = render(
            <RadioGroup value="a" onChange={onChange}>
                <Radio value="a">A</Radio>
                <Radio value="b">B</Radio>
            </RadioGroup>,
        );
        const inputs = Array.from(container.querySelectorAll<HTMLInputElement>('input[type="radio"]'));

        act(() => {
            fireEvent.click(inputs[1]);
        });

        expect(onChange).toHaveBeenCalledWith('b');
    });

    it('supports defaultValue (uncontrolled)', () => {
        const { container } = render(
            <RadioGroup defaultValue="b">
                <Radio value="a">A</Radio>
                <Radio value="b">B</Radio>
            </RadioGroup>,
        );
        const inputs = Array.from(container.querySelectorAll<HTMLInputElement>('input[type="radio"]'));
        expect(inputs[0].checked).toBe(false);
        expect(inputs[1].checked).toBe(true);
    });

    it('disables all radios when group is disabled', () => {
        const { container } = render(
            <RadioGroup disabled>
                <Radio value="a">A</Radio>
                <Radio value="b">B</Radio>
            </RadioGroup>,
        );
        const inputs = Array.from(container.querySelectorAll<HTMLInputElement>('input[type="radio"]'));
        expect(inputs[0].disabled).toBe(true);
        expect(inputs[1].disabled).toBe(true);
    });

    it('passes name to all radios', () => {
        const { container } = render(
            <RadioGroup name="test-group">
                <Radio value="a">A</Radio>
                <Radio value="b">B</Radio>
            </RadioGroup>,
        );
        const inputs = Array.from(container.querySelectorAll<HTMLInputElement>('input[type="radio"]'));
        expect(inputs[0].name).toBe('test-group');
        expect(inputs[1].name).toBe('test-group');
    });

    it('passes size to all radios', () => {
        const { container } = render(
            <RadioGroup size="large">
                <Radio value="a">A</Radio>
                <Radio value="b">B</Radio>
            </RadioGroup>,
        );
        const labels = container.querySelectorAll('label');
        labels.forEach((label) => {
            expect(label.className.length).toBeGreaterThan(0);
        });
    });

    it('forwards className to group wrapper', () => {
        const { container } = render(
            <RadioGroup className="custom-group">
                <Radio value="a">A</Radio>
            </RadioGroup>,
        );
        const group = container.querySelector('[role="radiogroup"]');
        expect(group?.className).toContain('custom-group');
    });
});
