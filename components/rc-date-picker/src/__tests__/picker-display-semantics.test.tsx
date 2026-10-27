import { beforeAll, describe, expect, it, mock } from '@crab-dev/wake/test';
import { act, render, screen } from '@crab-dev/wake/test/react';
import DatePicker from '../datePicker/datePicker.js';
import DateTimePicker from '../dateTimePicker/dateTimePicker.js';
import TimePicker from '../timePicker/timePicker.js';
import type { PickerFieldProps, PickerValueChangeDetails } from '../types.js';
import { setupTimePickerDOM } from './timePicker-test-helpers.js';

beforeAll(setupTimePickerDOM);

type Kind = 'date' | 'datetime' | 'time';
interface ExampleProps extends Pick<PickerFieldProps, 'onInput' | 'onFocus'> {
    empty: boolean;
    controlled: boolean;
    display: string;
    onValueChange: (next: unknown, details: PickerValueChangeDetails) => void;
}

// Exercise the public pickers with their real inputs, action buttons and state hooks.
// No popup is opened: this regression concerns semantic values and native field events.
function example(kind: Kind, { empty, controlled, display, ...events }: ExampleProps) {
    const field = { ...events, 'aria-label': 'Picker', placeholder: '请选择', renderDisplayString: () => display };
    if (kind === 'time') {
        const value = empty ? null : { hour: 9, minute: 30, second: 0 };
        return <TimePicker {...field} {...(controlled ? { value } : { defaultValue: value })} />;
    }
    const value = empty ? null : Temporal.ZonedDateTime.from('2026-10-01T09:30:00+08:00[Asia/Singapore]');
    return kind === 'date'
        ? <DatePicker {...field} {...(controlled ? { value } : { defaultValue: value })} />
        : <DateTimePicker {...field} {...(controlled ? { value } : { defaultValue: value })} />;
}

for (const kind of ['date', 'datetime', 'time'] as const) {
    describe(`${kind} semantic value and display text`, () => {
        const clearLabel = kind === 'time' ? '清除时间' : '清除日期';
        const openLabel = kind === 'time' ? '选择时间' : '打开日历';

        it('keeps null non-clearable when a custom formatter returns nonempty text', async () => {
            const changed = mock.fn<(next: unknown, details: PickerValueChangeDetails) => void>();
            const view = await render(example(kind, { empty: true, controlled: true, display: '请选择日期', onValueChange: changed }));
            const input = screen.getByRole('textbox', { name: 'Picker' }) as HTMLInputElement;
            const action = screen.getByRole('button', { name: openLabel });
            expect(input.value).toBe('请选择日期');
            expect(input.placeholder).toBe('请选择');
            await act(() => input.dispatchEvent(new PointerEvent('pointerover', { bubbles: true, pointerType: 'mouse' })));
            await act(() => action.focus());
            expect(screen.queryByRole('button', { name: clearLabel })).toBeNull();
            expect(screen.getByRole('button', { name: openLabel })).toBe(action);
            expect(input.getAttribute('aria-expanded')).toBe('false');
            expect(view.container.querySelector('[hasvalue]')).toBeNull();
            await view.rerender(example(kind, { empty: true, controlled: true, display: '', onValueChange: changed }));
            expect(input.value).toBe('');
            expect(changed).not.toHaveBeenCalled();
        });

        it('clears a value formatted as an empty string once with the actual button event', async () => {
            const changed = mock.fn<(next: unknown, details: PickerValueChangeDetails) => void>();
            const onInput = mock.fn();
            const onNativeChange = mock.fn();
            let focusedInput: EventTarget | null = null;
            let focusEvent: Event | undefined;
            const view = await render(example(kind, {
                empty: false, controlled: false, display: '', onValueChange: changed, onInput,
                onFocus: event => { focusedInput = event.currentTarget; focusEvent = event.nativeEvent; },
            }));
            const input = screen.getByRole('textbox', { name: 'Picker' }) as HTMLInputElement;
            input.addEventListener('change', onNativeChange);
            expect(input.value).toBe('');
            const action = screen.getByRole('button');
            await act(() => action.focus());
            expect(screen.getByRole('button', { name: clearLabel })).toBe(action);
            const nativeEvent = new MouseEvent('click', { bubbles: true, cancelable: true });
            await act(() => action.dispatchEvent(nativeEvent));
            expect(changed).toHaveBeenCalledTimes(1);
            expect(changed.calls.calls[0][0]).toBeNull();
            const details = changed.calls.calls[0][1];
            expect(details.reason).toBe('clear');
            expect(details.event).toEqual(expect.objectContaining({ nativeEvent }));
            expect(details.event && 'nativeEvent' in details.event ? details.event.nativeEvent : details.event).toBe(nativeEvent);
            expect(onInput).not.toHaveBeenCalled();
            expect(onNativeChange).not.toHaveBeenCalled();
            expect(focusedInput).toBe(input);
            expect(focusEvent).toBeInstanceOf(FocusEvent);
            expect(document.activeElement).toBe(input);
            expect(input.getAttribute('aria-expanded')).toBe('false');
            expect(screen.queryByRole('button', { name: clearLabel })).toBeNull();
            expect(screen.getByRole('button', { name: openLabel })).toBe(action);
            expect(view.container.querySelector('[hasvalue]')).toBeNull();
        });

        it('keeps controlled clear requests separate from owner value and formatter updates', async () => {
            const changed = mock.fn<(next: unknown, details: PickerValueChangeDetails) => void>();
            const view = await render(example(kind, { empty: false, controlled: true, display: '', onValueChange: changed }));
            const input = screen.getByRole('textbox', { name: 'Picker' }) as HTMLInputElement;
            const action = screen.getByRole('button');
            await act(() => input.dispatchEvent(new PointerEvent('pointerover', { bubbles: true, pointerType: 'mouse' })));
            expect(screen.getByRole('button', { name: clearLabel })).toBe(action);
            await act(() => action.click());
            expect(changed).toHaveBeenCalledTimes(1);
            expect(screen.getByRole('button', { name: clearLabel })).toBe(action);
            await view.rerender(example(kind, { empty: false, controlled: true, display: '已选择', onValueChange: changed }));
            expect(input.value).toBe('已选择');
            expect(screen.getByRole('button', { name: clearLabel })).toBe(action);
            await view.rerender(example(kind, { empty: true, controlled: true, display: '请选择日期', onValueChange: changed }));
            expect(input.value).toBe('请选择日期');
            expect(screen.queryByRole('button', { name: clearLabel })).toBeNull();
            expect(screen.getByRole('button', { name: openLabel })).toBe(action);
            expect(changed).toHaveBeenCalledTimes(1);
        });
    });
}
