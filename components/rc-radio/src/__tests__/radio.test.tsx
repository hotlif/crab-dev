import { describe, expect, it, mock, fireEvent, render, act } from "@crab-dev/wake/test/react";
import Radio from '../radio.js';
import RadioGroup from '../radio-group.js';
import type { RadioProps } from '../types.js';
(globalThis as typeof globalThis & {
    IS_REACT_ACT_ENVIRONMENT?: boolean;
}).IS_REACT_ACT_ENVIRONMENT = true;
const renderRadio = async (props: Partial<RadioProps> = {}) => {
    const renderResult = await render(<Radio {...props}>Radio Text</Radio>);
    const input = renderResult.container.querySelector('input[type="radio"]') as HTMLInputElement;
    return {
        ...renderResult,
        input,
    };
};
describe('Radio', () => {
    it('renders correctly with children', async () => {
        const { container } = await renderRadio();
        expect(container.querySelector('label')).toBeTruthy();
        expect(container.textContent).toContain('Radio Text');
    });
    it('renders with only aria-label and no children', async () => {
        const { container } = await render(<Radio aria-label="aria only"/>);
        const input = container.querySelector('input[type="radio"]');
        expect(input).toBeTruthy();
    });
    it('renders unchecked by default', async () => {
        const { input } = await renderRadio();
        expect(input.checked).toBe(false);
    });
    it('supports defaultChecked', async () => {
        const { input } = await renderRadio({ defaultChecked: true });
        expect(input.checked).toBe(true);
    });
    it('supports controlled checked prop', async () => {
        const { input } = await renderRadio({ checked: true, onChange: () => { } });
        expect(input.checked).toBe(true);
    });
    it('calls onChange when clicked', async () => {
        const onChange = mock.fn();
        const { input } = await renderRadio({ onChange });
        await act(async () => {
            await fireEvent.click(input);
        });
        expect(onChange).toHaveBeenCalledTimes(1);
        expect(onChange).toHaveBeenCalledWith(true, expect.anything());
    });
    it('marks input as disabled when disabled prop is set', async () => {
        const { input } = await renderRadio({ disabled: true });
        expect(input.disabled).toBe(true);
    });
    it('sets data-disabled on wrapper when disabled', async () => {
        const { container } = await renderRadio({ disabled: true });
        const label = container.querySelector('label');
        expect(label?.hasAttribute('data-disabled')).toBe(true);
    });
    it('renders all size variants', async () => {
        const sizes: NonNullable<RadioProps['size']>[] = ['large', 'middle', 'small'];
        for (const size of sizes) {
            const { container, unmount } = await renderRadio({ size });
            expect(container.querySelector('label')?.className.length).toBeGreaterThan(0);
            await unmount();
        }
    });
    it('forwards className to wrapper', async () => {
        const { container } = await renderRadio({ className: 'custom-radio' });
        const label = container.querySelector('label');
        expect(label?.className).toContain('custom-radio');
    });
    it('renders dot indicator when checked', async () => {
        const { container } = await renderRadio({ checked: true, onChange: () => { } });
        const box = container.querySelector('label > input + span');
        const dot = box?.querySelector('span');
        expect(dot).toBeTruthy();
    });
    it('does not render dot when unchecked', async () => {
        const { container } = await renderRadio({ checked: false, onChange: () => { } });
        const box = container.querySelector('label > input + span');
        const dot = box?.querySelector('span');
        expect(dot).toBeNull();
    });
});
describe('RadioGroup', () => {
    it('renders with role="radiogroup"', async () => {
        const { container } = await render(<RadioGroup>
            <Radio value="a">A</Radio>
            <Radio value="b">B</Radio>
        </RadioGroup>);
        expect(container.querySelector('[role="radiogroup"]')).toBeTruthy();
    });
    it('selects radio matching controlled value', async () => {
        const { container } = await render(<RadioGroup value="b">
            <Radio value="a">A</Radio>
            <Radio value="b">B</Radio>
        </RadioGroup>);
        const inputs = Array.from(container.querySelectorAll<HTMLInputElement>('input[type="radio"]'));
        expect(inputs[0].checked).toBe(false);
        expect(inputs[1].checked).toBe(true);
    });
    it('calls onChange when a radio is clicked', async () => {
        const onChange = mock.fn();
        const { container } = await render(<RadioGroup value="a" onChange={onChange}>
            <Radio value="a">A</Radio>
            <Radio value="b">B</Radio>
        </RadioGroup>);
        const inputs = Array.from(container.querySelectorAll<HTMLInputElement>('input[type="radio"]'));
        await act(async () => {
            await fireEvent.click(inputs[1]);
        });
        expect(onChange).toHaveBeenCalledWith('b');
    });
    it('supports defaultValue (uncontrolled)', async () => {
        const { container } = await render(<RadioGroup defaultValue="b">
            <Radio value="a">A</Radio>
            <Radio value="b">B</Radio>
        </RadioGroup>);
        const inputs = Array.from(container.querySelectorAll<HTMLInputElement>('input[type="radio"]'));
        expect(inputs[0].checked).toBe(false);
        expect(inputs[1].checked).toBe(true);
    });
    it('disables all radios when group is disabled', async () => {
        const { container } = await render(<RadioGroup disabled>
            <Radio value="a">A</Radio>
            <Radio value="b">B</Radio>
        </RadioGroup>);
        const inputs = Array.from(container.querySelectorAll<HTMLInputElement>('input[type="radio"]'));
        expect(inputs[0].disabled).toBe(true);
        expect(inputs[1].disabled).toBe(true);
    });
    it('passes name to all radios', async () => {
        const { container } = await render(<RadioGroup name="test-group">
            <Radio value="a">A</Radio>
            <Radio value="b">B</Radio>
        </RadioGroup>);
        const inputs = Array.from(container.querySelectorAll<HTMLInputElement>('input[type="radio"]'));
        expect(inputs[0].name).toBe('test-group');
        expect(inputs[1].name).toBe('test-group');
    });
    it('passes size to all radios', async () => {
        const { container } = await render(<RadioGroup size="large">
            <Radio value="a">A</Radio>
            <Radio value="b">B</Radio>
        </RadioGroup>);
        const labels = container.querySelectorAll('label');
        labels.forEach((label) => {
            expect(label.className.length).toBeGreaterThan(0);
        });
    });
    it('forwards className to group wrapper', async () => {
        const { container } = await render(<RadioGroup className="custom-group">
            <Radio value="a">A</Radio>
        </RadioGroup>);
        const group = container.querySelector('[role="radiogroup"]');
        expect(group?.className).toContain('custom-group');
    });
});
