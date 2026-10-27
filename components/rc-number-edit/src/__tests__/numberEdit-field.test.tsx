import { beforeAll, clock, describe, expect, it, mock } from '@crab-dev/wake/test';
import { act, fireEvent, render, screen } from '@crab-dev/wake/test/react';
import ConfigProvider from '@crab-dev/rc-config-provider';
import { createRef, useState } from 'react';
import NumberEdit from '../numberEdit.js';
import type { NumberEditChangeDetails } from '../types.js';

beforeAll(() => {
    globalThis.ResizeObserver = class {
        observe() { }
        unobserve() { }
        disconnect() { }
    };
});

describe('NumberEdit text field integration', () => {
    it('retains each keyboard step event and notifies once', async () => {
        const changed = mock.fn<(next: number | null, details: NumberEditChangeDetails) => void>();
        await render(<NumberEdit defaultValue={3} onValueChange={changed} />);
        const input = screen.getByRole('spinbutton');
        const event = new KeyboardEvent('keydown', { key: 'ArrowUp', bubbles: true, cancelable: true });
        await fireEvent(input, event);
        expect(changed).toHaveBeenCalledTimes(1);
        const details = changed.calls.calls[0][1];
        expect(details.reason).toBe('step');
        expect(details.event && 'nativeEvent' in details.event ? details.event.nativeEvent : details.event).toBe(event);
    });

    it('retains the native wheel event and notifies once while focused', async () => {
        const changed = mock.fn<(next: number | null, details: NumberEditChangeDetails) => void>();
        await render(<NumberEdit defaultValue={3} onValueChange={changed} />);
        const input = screen.getByRole('spinbutton');
        await act(() => input.focus());
        const event = new WheelEvent('wheel', { deltaY: -1, bubbles: true, cancelable: true });
        await fireEvent(input, event);
        expect(event.defaultPrevented).toBe(true);
        expect(changed).toHaveBeenCalledTimes(1);
        expect(changed.calls.calls[0][1].event).toBe(event);
    });

    it('keeps the original pointer event for long-press repeats without a duplicate click step', async () => {
        await clock.fake();
        try {
            const changed = mock.fn<(next: number | null, details: NumberEditChangeDetails) => void>();
            const view = await render(<NumberEdit defaultValue={3} onValueChange={changed} />);
            const increase = screen.getByRole('button', { name: '增加' });
            const event = new PointerEvent('pointerdown', { pointerId: 1, pointerType: 'mouse', button: 0, bubbles: true });
            await fireEvent(increase, event);
            expect(changed).toHaveBeenCalledTimes(1);
            const initialEvent = changed.calls.calls[0][1].event;
            expect(initialEvent && 'nativeEvent' in initialEvent ? initialEvent.nativeEvent : initialEvent).toBe(event);
            await act(async () => { await clock.advanceBy(400); });
            expect(changed).toHaveBeenCalledTimes(2);
            expect(changed.calls.calls[1][1].event).toBe(initialEvent);
            await fireEvent(increase, new PointerEvent('pointerup', { pointerId: 1, pointerType: 'mouse', button: 0, bubbles: true }));
            await fireEvent.click(increase, { detail: 1 });
            await act(async () => { await clock.advanceBy(500); });
            expect(changed).toHaveBeenCalledTimes(2);
            await view.unmount();
        } finally {
            await clock.restore();
        }
    });

    it('keeps a keyboard or assistive-technology button activation event and steps once', async () => {
        const changed = mock.fn<(next: number | null, details: NumberEditChangeDetails) => void>();
        await render(<NumberEdit defaultValue={3} onValueChange={changed} />);
        const event = new MouseEvent('click', { detail: 0, bubbles: true });
        await fireEvent(screen.getByRole('button', { name: '增加' }), event);
        expect(changed).toHaveBeenCalledTimes(1);
        const details = changed.calls.calls[0][1];
        expect(details.event && 'nativeEvent' in details.event ? details.event.nativeEvent : details.event).toBe(event);
    });

    it('keeps the clear button event while notifying semantic value and onClear once each', async () => {
        const changed = mock.fn<(next: number | null, details: NumberEditChangeDetails) => void>();
        const cleared = mock.fn();
        await render(<NumberEdit defaultValue={3} allowClear onValueChange={changed} onClear={cleared} />);
        const event = new MouseEvent('click', { detail: 1, bubbles: true });
        await fireEvent(screen.getByRole('button', { name: '清除' }), event);
        expect(changed).toHaveBeenCalledTimes(1);
        expect(cleared).toHaveBeenCalledTimes(1);
        expect(changed.calls.calls[0][0]).toBeNull();
        const details = changed.calls.calls[0][1];
        expect(details.reason).toBe('clear');
        expect(details.event && 'nativeEvent' in details.event ? details.event.nativeEvent : details.event).toBe(event);
    });

    it('localizes scientific value announcements without remounting or committing a value', async () => {
        const onValueChange = mock.fn();
        const field = (locale: 'zh-CN' | 'en-US') => <ConfigProvider locale={locale}>
            <NumberEdit label="金额" defaultValue={1.23e21} onValueChange={onValueChange} />
        </ConfigProvider>;
        const view = await render(field('zh-CN'));
        const input = screen.getByRole('spinbutton') as HTMLInputElement;
        expect(input.getAttribute('aria-valuetext')).toBe('1.23 乘以 10 的 21 次方');
        await view.rerender(field('en-US'));
        expect(screen.getByRole('spinbutton')).toBe(input);
        expect(input.getAttribute('aria-valuetext')).toBe('1.23 times 10 to the power of 21');
        expect(input.value).toBe('1.23e+21');
        expect(onValueChange).not.toHaveBeenCalled();
    });

    it('keeps scientific values accessible when disabled and restores native editing after enabling', async () => {
        const field = (disabled: boolean) => <NumberEdit
            label="金额"
            appearance="filled"
            defaultValue={1.23e21}
            disabled={disabled}
        />;
        const { container, rerender } = await render(field(true));
        const input = screen.getByRole('spinbutton') as HTMLInputElement;
        expect(input.disabled).toBe(true);
        expect(input.value).toBe('1.23e+21');
        expect(input.getAttribute('aria-valuenow')).toBe('1.23e+21');
        expect(input.getAttribute('aria-valuetext')).toContain('10 的 21 次方');
        expect(container.querySelector('sup')?.textContent).toBe('21');

        await rerender(field(false));
        await act(() => input.focus());
        expect(container.querySelector('sup')).toBeNull();
        expect(input.value).toBe('1.23e+21');
        await act(() => input.blur());
        expect(container.querySelector('sup')?.textContent).toBe('21');
        expect(input.getAttribute('aria-valuenow')).toBe('1.23e+21');
    });

    it('associates its visible label and inherited supporting or error text with the numeric input', async () => {
        const containerRef = createRef<HTMLDivElement>();
        const field = (errorText?: string) => <>
            <p id="quantity-hint">按件计数</p>
            <NumberEdit
                label="项目数量"
                appearance="filled"
                supportingText="范围 0–100"
                errorText={errorText}
                aria-describedby="quantity-hint"
                defaultValue={3}
                required
                min={0}
                max={100}
                containerRef={containerRef}
            />
        </>;
        const { rerender } = await render(field());
        // Wake's label-name query includes aria-hidden text; exact names are verified in the browser.
        const input = screen.getByRole('spinbutton') as HTMLInputElement;
        const label = document.querySelector<HTMLLabelElement>('label[for="' + input.id + '"]');
        expect(label?.htmlFor).toBe(input.id);
        expect(input.labels?.length).toBe(1);
        expect(input.labels?.[0]).toBe(label);
        expect(label?.querySelector('[data-field-label-text]')?.textContent).toBe('项目数量');
        expect(label?.querySelector('[data-required-marker]')?.getAttribute('aria-hidden')).toBe('true');
        expect(input.required).toBe(true);
        expect(input.getAttribute('aria-invalid')).toBeNull();
        expect(containerRef.current?.getAttribute('data-appearance')).toBe('filled');
        const descriptions = () => input.getAttribute('aria-describedby')?.split(' ')
            .map(id => document.getElementById(id)?.textContent);
        expect(descriptions()).toEqual(['按件计数', '范围 0–100']);

        await rerender(field('数量超过配额'));
        expect(screen.getByRole('spinbutton')).toBe(input);
        expect(input.getAttribute('aria-invalid')).toBe('true');
        expect(descriptions()).toEqual(['按件计数', '数量超过配额']);
        expect(screen.getByRole('alert').textContent).toBe('数量超过配额');
        expect(screen.queryByText('范围 0–100')).toBeNull();
    });

    it('preserves a controlled stepped value across design changes and returns focus after clearing', async () => {
        const changes: (number | null)[] = [];
        function Editor() {
            const [value, setValue] = useState<number | null>(3);
            return <NumberEdit
                label="项目数量"
                value={value}
                allowClear
                onValueChange={next => { changes.push(next); setValue(next); }}
            />;
        }
        const { rerender } = await render(<ConfigProvider designSystem="md3"><Editor /></ConfigProvider>);
        const input = screen.getByRole('spinbutton', { name: '项目数量' }) as HTMLInputElement;
        await act(() => input.focus());
        const setInputValue = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, 'value')?.set;
        if (!setInputValue) throw new Error('HTMLInputElement.value setter is unavailable');
        setInputValue.call(input, '20.5');
        await fireEvent.input(input);
        await fireEvent.keyDown(input, { key: 'ArrowUp' });
        expect(input.value).toBe('21.5');
        expect(input.getAttribute('aria-valuenow')).toBe('21.5');
        expect(changes).toEqual([21.5]);

        await rerender(<ConfigProvider designSystem="shadcn"><Editor /></ConfigProvider>);
        expect(screen.getByRole('spinbutton', { name: '项目数量' })).toBe(input);
        expect(input.value).toBe('21.5');
        const clear = screen.getByRole('button', { name: '清除' });
        await act(() => clear.focus());
        await fireEvent.click(clear, { detail: 1 });
        expect(changes).toEqual([21.5, null]);
        expect(input.value).toBe('');
        expect(input.hasAttribute('aria-valuenow')).toBe(false);
        expect(document.activeElement).toBe(input);
        expect(screen.queryByRole('button', { name: '清除' })).toBeNull();
    });
});
