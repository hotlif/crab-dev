import { act, describe, expect, it, mock, fireEvent, render } from "@crab-dev/wake/test/react";
import { createRef } from 'react';
import Segmented from '../segmented.js';
import type { SegmentedProps } from '../types.js';
(globalThis as typeof globalThis & {
    IS_REACT_ACT_ENVIRONMENT?: boolean;
}).IS_REACT_ACT_ENVIRONMENT = true;
const OPTIONS = [
    { label: '日', value: 'day' },
    { label: '周', value: 'week' },
    { label: '月', value: 'month' },
];
const renderSegmented = async (props: Partial<SegmentedProps> = {}) => {
    const renderResult = await render(<Segmented options={OPTIONS} {...props}/>);
    const inputs = Array.from(renderResult.container.querySelectorAll<HTMLInputElement>('input[type="radio"]'));
    return { ...renderResult, inputs };
};
describe('Segmented', () => {
    it('renders one radio per option', async () => {
        const { inputs } = await renderSegmented();
        expect(inputs).toHaveLength(3);
    });
    it('exposes a radiogroup role', async () => {
        const { container } = await renderSegmented();
        expect(container.querySelector('[role="radiogroup"]')).toBeTruthy();
    });
    it('supports primitive option shorthand', async () => {
        const { container } = await render(<Segmented options={['a', 'b', 1]}/>);
        const inputs = Array.from(container.querySelectorAll<HTMLInputElement>('input[type="radio"]'));
        expect(inputs.map((input) => input.value)).toEqual(['a', 'b', '1']);
        expect(container.textContent).toContain('a');
        expect(inputs[0].checked).toBe(true);
    });
    it('selects the first enabled option by default', async () => {
        const { inputs } = await renderSegmented();
        expect(inputs[0].checked).toBe(true);
        expect(inputs[1].checked).toBe(false);
    });
    it('skips leading disabled options when picking the default', async () => {
        const { inputs } = await renderSegmented({
            options: [
                { label: '日', value: 'day', disabled: true },
                { label: '周', value: 'week' },
            ],
        });
        expect(inputs[0].checked).toBe(false);
        expect(inputs[1].checked).toBe(true);
    });
    it('honours defaultValue (uncontrolled)', async () => {
        const { inputs } = await renderSegmented({ defaultValue: 'month' });
        expect(inputs[2].checked).toBe(true);
    });
    it('reflects a controlled value', async () => {
        const { inputs } = await renderSegmented({ value: 'week', onChange: () => { } });
        expect(inputs[1].checked).toBe(true);
    });
    it('calls onChange with the option value on selection', async () => {
        const onChange = mock.fn();
        const { inputs } = await renderSegmented({ onChange });
        await act(async () => {
            await fireEvent.click(inputs[2]);
        });
        expect(onChange).toHaveBeenCalledWith('month');
    });
    it('updates selection in uncontrolled mode', async () => {
        const { inputs } = await renderSegmented();
        await act(async () => {
            await fireEvent.click(inputs[1]);
        });
        expect(inputs[1].checked).toBe(true);
        expect(inputs[0].checked).toBe(false);
    });
    it('does not switch a controlled value without a matching prop update', async () => {
        const onChange = mock.fn();
        const { inputs } = await renderSegmented({ value: 'day', onChange });
        await act(async () => {
            await fireEvent.click(inputs[2]);
        });
        expect(onChange).toHaveBeenCalledWith('month');
        expect(inputs[0].checked).toBe(true);
        expect(inputs[2].checked).toBe(false);
    });
    it('disables every radio when the control is disabled', async () => {
        const { inputs } = await renderSegmented({ disabled: true });
        inputs.forEach((input) => expect(input.disabled).toBe(true));
    });
    it('marks the root with data-disabled and aria-disabled when disabled', async () => {
        const { container } = await renderSegmented({ disabled: true });
        const root = container.querySelector('[role="radiogroup"]');
        expect(root?.hasAttribute('data-disabled')).toBe(true);
        expect(root?.getAttribute('aria-disabled')).toBe('true');
    });
    it('disables only the option flagged as disabled', async () => {
        const { inputs } = await renderSegmented({
            options: [
                { label: '日', value: 'day' },
                { label: '周', value: 'week', disabled: true },
            ],
        });
        expect(inputs[0].disabled).toBe(false);
        expect(inputs[1].disabled).toBe(true);
    });
    it('does not fire onChange when a disabled option is clicked', async () => {
        const onChange = mock.fn();
        const { inputs } = await renderSegmented({
            onChange,
            options: [
                { label: '日', value: 'day' },
                { label: '周', value: 'week', disabled: true },
            ],
        });
        await act(async () => {
            await fireEvent.click(inputs[1]);
        });
        expect(onChange).not.toHaveBeenCalled();
    });
    it('groups all radios under the same name', async () => {
        const { inputs } = await renderSegmented();
        const names = new Set(inputs.map((input) => input.name));
        expect(names.size).toBe(1);
        expect([...names][0].length).toBeGreaterThan(0);
    });
    it('honours a custom name prop', async () => {
        const { inputs } = await renderSegmented({ name: 'view' });
        inputs.forEach((input) => expect(input.name).toBe('view'));
    });
    it('renders every size variant', async () => {
        const sizes: NonNullable<SegmentedProps['size']>[] = ['large', 'middle', 'small'];
        for (const size of sizes) {
            const { container, unmount } = await renderSegmented({ size });
            expect(container.querySelector('[role="radiogroup"]')?.className.length)
                .toBeGreaterThan(0);
            await unmount();
        }
    });
    it('renders an option icon', async () => {
        const { container } = await renderSegmented({
            options: [
                { label: '列表', value: 'list', icon: <svg data-testid="icon"/> },
            ],
        });
        expect(container.querySelector('[data-testid="icon"]')).toBeTruthy();
    });
    it('applies the aria-label of an icon-only option', async () => {
        const { container } = await renderSegmented({
            options: [{ label: '', value: 'grid', 'aria-label': '网格视图' }],
        });
        expect(container.querySelector('input[aria-label="网格视图"]')).toBeTruthy();
    });
    it('forwards className to the root', async () => {
        const { container } = await renderSegmented({ className: 'custom-seg' });
        const root = container.querySelector('[role="radiogroup"]');
        expect(root?.className).toContain('custom-seg');
    });
    it('forwards a ref to the root element', async () => {
        const ref = createRef<HTMLDivElement>();
        await render(<Segmented options={OPTIONS} ref={ref}/>);
        expect(ref.current).toBeInstanceOf(HTMLElement);
        expect(ref.current?.getAttribute('role')).toBe('radiogroup');
    });
});
