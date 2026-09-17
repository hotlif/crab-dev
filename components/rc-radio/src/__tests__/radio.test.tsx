import { describe, expect, it, mock } from "@crab-dev/wake/test";
import { fireEvent, render, act, userEvent } from "@crab-dev/wake/test/react";
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
        const dot = container.querySelector('[data-radio-part="dot"]');
        expect(dot).toBeTruthy();
    });
    it.each<NonNullable<RadioProps['size']>>(['small', 'middle', 'large'])(
        'keeps the same indicator across selection changes at size %s', async (size) => {
            const view = await render(<Radio size={size} checked={false} onChange={() => {}}>Choice</Radio>);
            const label = view.container.querySelector('label')!;
            const control = view.container.querySelector('[data-radio-part="control"]')!;
            const box = view.container.querySelector('[data-radio-part="box"]')!;
            const dot = view.container.querySelector('[data-radio-part="dot"]')!;
            expect(dot).toBeTruthy();
            expect(control.getAttribute('aria-hidden')).toBe('true');
            expect(label.getAttribute('data-state')).toBe('unchecked');
            for (const checked of [true, false, true]) {
                await view.rerender(<Radio size={size} checked={checked} onChange={() => {}}>Choice</Radio>);
                expect(view.container.querySelector('[data-radio-part="control"]')).toBe(control);
                expect(view.container.querySelector('[data-radio-part="box"]')).toBe(box);
                expect(view.container.querySelector('[data-radio-part="dot"]')).toBe(dot);
                expect(label.getAttribute('data-state')).toBe(checked ? 'checked' : 'unchecked');
                expect(view.container.querySelector('input')!.checked).toBe(checked);
            }
        },
    );
    it('selects from the label and keeps disabled choices unchanged', async () => {
        const user = userEvent.setup();
        const onChange = mock.fn();
        const view = await render(
            <RadioGroup defaultValue="a" onChange={onChange}>
                <Radio value="a">First</Radio>
                <Radio value="b">Second</Radio>
                <Radio value="c" disabled>Unavailable</Radio>
            </RadioGroup>,
        );
        const labels = view.container.querySelectorAll('label');
        const inputs = view.container.querySelectorAll('input');
        await user.click(labels[1]);
        expect(inputs[0].checked).toBe(false);
        expect(inputs[1].checked).toBe(true);
        expect(onChange).toHaveBeenCalledTimes(1);
        await user.click(labels[2]);
        expect(inputs[1].checked).toBe(true);
        expect(inputs[2].checked).toBe(false);
        expect(onChange).toHaveBeenCalledTimes(1);
    });
});
describe('RadioGroup', () => {
    it('forwards the group name and description for assistive technology', async () => {
        const { container } = await render(
            <RadioGroup aria-label="Frequency" aria-describedby="frequency-help">
                <Radio value="weekly">Weekly</Radio>
            </RadioGroup>,
        );
        const group = container.querySelector('[role="radiogroup"]');
        expect(group?.getAttribute('aria-label')).toBe('Frequency');
        expect(group?.getAttribute('aria-describedby')).toBe('frequency-help');
    });
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
