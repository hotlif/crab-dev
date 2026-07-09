import { act, createRef } from 'react';
import { cleanup, fireEvent, render } from '@testing-library/react';
import { afterEach, describe, expect, it, jest } from '@jest/globals';

import Segmented from '../segmented.js';
import type { SegmentedProps } from '../types.js';

(
    globalThis as typeof globalThis & { IS_REACT_ACT_ENVIRONMENT?: boolean }
).IS_REACT_ACT_ENVIRONMENT = true;

const OPTIONS = [
    { label: '日', value: 'day' },
    { label: '周', value: 'week' },
    { label: '月', value: 'month' },
];

const renderSegmented = (props: Partial<SegmentedProps> = {}) => {
    const renderResult = render(<Segmented options={OPTIONS} {...props} />);
    const inputs = Array.from(
        renderResult.container.querySelectorAll<HTMLInputElement>('input[type="radio"]'),
    );

    return { ...renderResult, inputs };
};

describe('Segmented', () => {
    afterEach(() => {
        cleanup();
    });

    it('renders one radio per option', () => {
        const { inputs } = renderSegmented();
        expect(inputs).toHaveLength(3);
    });

    it('exposes a radiogroup role', () => {
        const { container } = renderSegmented();
        expect(container.querySelector('[role="radiogroup"]')).toBeTruthy();
    });

    it('supports primitive option shorthand', () => {
        const { container } = render(<Segmented options={['a', 'b', 1]} />);
        const inputs = Array.from(
            container.querySelectorAll<HTMLInputElement>('input[type="radio"]'),
        );
        expect(inputs.map((input) => input.value)).toEqual(['a', 'b', '1']);
        expect(container.textContent).toContain('a');
        expect(inputs[0].checked).toBe(true);
    });

    it('selects the first enabled option by default', () => {
        const { inputs } = renderSegmented();
        expect(inputs[0].checked).toBe(true);
        expect(inputs[1].checked).toBe(false);
    });

    it('skips leading disabled options when picking the default', () => {
        const { inputs } = renderSegmented({
            options: [
                { label: '日', value: 'day', disabled: true },
                { label: '周', value: 'week' },
            ],
        });
        expect(inputs[0].checked).toBe(false);
        expect(inputs[1].checked).toBe(true);
    });

    it('honours defaultValue (uncontrolled)', () => {
        const { inputs } = renderSegmented({ defaultValue: 'month' });
        expect(inputs[2].checked).toBe(true);
    });

    it('reflects a controlled value', () => {
        const { inputs } = renderSegmented({ value: 'week', onChange: () => {} });
        expect(inputs[1].checked).toBe(true);
    });

    it('calls onChange with the option value on selection', () => {
        const onChange = jest.fn();
        const { inputs } = renderSegmented({ onChange });

        act(() => {
            fireEvent.click(inputs[2]);
        });

        expect(onChange).toHaveBeenCalledWith('month');
    });

    it('updates selection in uncontrolled mode', () => {
        const { inputs } = renderSegmented();

        act(() => {
            fireEvent.click(inputs[1]);
        });

        expect(inputs[1].checked).toBe(true);
        expect(inputs[0].checked).toBe(false);
    });

    it('does not switch a controlled value without a matching prop update', () => {
        const onChange = jest.fn();
        const { inputs } = renderSegmented({ value: 'day', onChange });

        act(() => {
            fireEvent.click(inputs[2]);
        });

        expect(onChange).toHaveBeenCalledWith('month');
        expect(inputs[0].checked).toBe(true);
        expect(inputs[2].checked).toBe(false);
    });

    it('disables every radio when the control is disabled', () => {
        const { inputs } = renderSegmented({ disabled: true });
        inputs.forEach((input) => expect(input.disabled).toBe(true));
    });

    it('marks the root with data-disabled and aria-disabled when disabled', () => {
        const { container } = renderSegmented({ disabled: true });
        const root = container.querySelector('[role="radiogroup"]');
        expect(root?.hasAttribute('data-disabled')).toBe(true);
        expect(root?.getAttribute('aria-disabled')).toBe('true');
    });

    it('disables only the option flagged as disabled', () => {
        const { inputs } = renderSegmented({
            options: [
                { label: '日', value: 'day' },
                { label: '周', value: 'week', disabled: true },
            ],
        });
        expect(inputs[0].disabled).toBe(false);
        expect(inputs[1].disabled).toBe(true);
    });

    it('does not fire onChange when a disabled option is clicked', () => {
        const onChange = jest.fn();
        const { inputs } = renderSegmented({
            onChange,
            options: [
                { label: '日', value: 'day' },
                { label: '周', value: 'week', disabled: true },
            ],
        });

        act(() => {
            fireEvent.click(inputs[1]);
        });

        expect(onChange).not.toHaveBeenCalled();
    });

    it('groups all radios under the same name', () => {
        const { inputs } = renderSegmented();
        const names = new Set(inputs.map((input) => input.name));
        expect(names.size).toBe(1);
        expect([...names][0].length).toBeGreaterThan(0);
    });

    it('honours a custom name prop', () => {
        const { inputs } = renderSegmented({ name: 'view' });
        inputs.forEach((input) => expect(input.name).toBe('view'));
    });

    it('renders every size variant', () => {
        const sizes: NonNullable<SegmentedProps['size']>[] = ['large', 'middle', 'small'];

        sizes.forEach((size) => {
            const { container, unmount } = renderSegmented({ size });
            expect(container.querySelector('[role="radiogroup"]')?.className.length)
                .toBeGreaterThan(0);
            unmount();
        });
    });

    it('renders an option icon', () => {
        const { container } = renderSegmented({
            options: [
                { label: '列表', value: 'list', icon: <svg data-testid="icon" /> },
            ],
        });
        expect(container.querySelector('[data-testid="icon"]')).toBeTruthy();
    });

    it('applies the aria-label of an icon-only option', () => {
        const { container } = renderSegmented({
            options: [{ label: '', value: 'grid', 'aria-label': '网格视图' }],
        });
        expect(container.querySelector('input[aria-label="网格视图"]')).toBeTruthy();
    });

    it('forwards className to the root', () => {
        const { container } = renderSegmented({ className: 'custom-seg' });
        const root = container.querySelector('[role="radiogroup"]');
        expect(root?.className).toContain('custom-seg');
    });

    it('forwards a ref to the root element', () => {
        const ref = createRef<HTMLDivElement>();
        render(<Segmented options={OPTIONS} ref={ref} />);
        expect(ref.current).toBeInstanceOf(HTMLElement);
        expect(ref.current?.getAttribute('role')).toBe('radiogroup');
    });
});
