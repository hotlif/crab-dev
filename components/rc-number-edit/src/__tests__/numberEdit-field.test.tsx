import { beforeAll, describe, expect, it } from '@crab-dev/wake/test';
import { act, fireEvent, render, screen } from '@crab-dev/wake/test/react';
import ConfigProvider from '@crab-dev/rc-config-provider';
import { createRef, useState } from 'react';
import NumberEdit from '../numberEdit.js';

beforeAll(() => {
    globalThis.ResizeObserver = class {
        observe() { }
        unobserve() { }
        disconnect() { }
    };
});

describe('NumberEdit text field integration', () => {
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
                onChange={next => { changes.push(next); setValue(next); }}
            />;
        }
        const { rerender } = await render(<ConfigProvider design="material"><Editor /></ConfigProvider>);
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

        await rerender(<ConfigProvider design="shadcn"><Editor /></ConfigProvider>);
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
