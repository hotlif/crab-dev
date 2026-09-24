import { beforeAll, beforeEach, describe, expect, it, mock } from '@crab-dev/wake/test';
import { act, fireEvent, render, screen, userEvent } from '@crab-dev/wake/test/react';
import { useState } from 'react';

const dispatch = mock.fn();
// 只替代无布局环境下的弹层定位，保留真实字段、按钮和开关状态。
mock.module('@crab-dev/rc-dropdown-container', async () => {
    const React = await mock.actual<typeof import('react')>('react');
    return {
        useDropdownContext: () => {
            const [open, setOpen] = React.useState(false);
            return {
                state: { open },
                refs: { setReference: () => {} },
                dispatch: (action: { type: 'setOpen'; payload: boolean }) => {
                    dispatch(action);
                    setOpen(action.payload);
                },
            };
        },
    };
});

let DatePickerInput: typeof import('../datePicker/datePickerInput.js')['default'];
let DateTimePickerInput: typeof import('../dateTimePicker/dateTimePickerInput.js')['default'];
let TimePickerInput: typeof import('../timePicker/timePickerInput.js')['default'];
beforeAll(async () => {
    TimePickerInput = (await mock.import<typeof import('../timePicker/timePickerInput.js')>('../timePicker/timePickerInput.js')).default;
    DatePickerInput = (await mock.import<typeof import('../datePicker/datePickerInput.js')>('../datePicker/datePickerInput.js')).default;
    DateTimePickerInput = (await mock.import<typeof import('../dateTimePicker/dateTimePickerInput.js')>('../dateTimePicker/dateTimePickerInput.js')).default;
});
beforeEach(() => { dispatch.clear(); });

for (const kind of ['date', 'datetime', 'time'] as const) {
    describe(`${kind} picker input actions`, () => {
        const getInput = () => kind === 'time' ? TimePickerInput : kind === 'date' ? DatePickerInput : DateTimePickerInput;
        const clearLabel = kind === 'time' ? '清除时间' : '清除日期';
        const openLabel = kind === 'time' ? '选择时间' : '打开日历';
        const value = kind === 'time' ? '09:30:00' : '2026-09-24';

        it('switches one action slot on field hover and keeps clear while moving onto its icon', async () => {
            const Input = getInput();
            const onValueChange = mock.fn();
            const onPointerEnter = mock.fn();
            const onPointerLeave = mock.fn();
            await render(<Input value={value} onValueChange={onValueChange} onPointerEnter={onPointerEnter} onPointerLeave={onPointerLeave} />);
            const input = screen.getByRole('textbox');
            const action = screen.getByRole('button', { name: openLabel });
            expect(screen.queryByRole('button', { name: clearLabel })).toBeNull();
            await act(() => input.dispatchEvent(new MouseEvent('pointerover', { bubbles: true })));
            const clear = screen.getByRole('button', { name: clearLabel });
            expect(clear).toBe(action);
            expect(screen.queryByRole('button', { name: openLabel })).toBeNull();
            await act(() => input.dispatchEvent(new MouseEvent('pointerout', { bubbles: true, relatedTarget: clear })));
            await act(() => clear.dispatchEvent(new MouseEvent('pointerover', { bubbles: true, relatedTarget: input })));
            expect(onPointerEnter).toHaveBeenCalledTimes(1);
            expect(onPointerLeave).toHaveBeenCalledTimes(1);
            expect(screen.getByRole('button', { name: clearLabel })).toBe(clear);
            const icon = clear.querySelector('svg')!;
            await act(() => clear.dispatchEvent(new MouseEvent('pointerout', { bubbles: true, relatedTarget: icon })));
            expect(screen.getByRole('button', { name: clearLabel })).toBe(action);
            await act(() => icon.dispatchEvent(new MouseEvent('pointerout', { bubbles: true, relatedTarget: document.body })));
            expect(screen.getByRole('button', { name: openLabel })).toBe(action);
            expect(screen.queryByRole('button', { name: clearLabel })).toBeNull();
            await act(() => input.parentElement!.dispatchEvent(new MouseEvent('pointerover', { bubbles: true })));
            expect(screen.getByRole('button', { name: clearLabel })).toBe(action);
            await fireEvent.click(clear);
            expect(onValueChange).toHaveBeenCalledTimes(1);
            expect(onValueChange).toHaveBeenCalledWith(null);
            expect(dispatch).not.toHaveBeenCalledWith({ type: 'setOpen', payload: true });
        });

        for (const method of ['click', 'Enter', 'Space'] as const) {
            it(`clears with ${method}, restores input focus and leaves the panel closed`, async () => {
                const Input = getInput();
                const onValueChange = mock.fn();
                const onSubmit = mock.fn();
                function Example() {
                    const [value, setValue] = useState(kind === 'time' ? '09:30:00' : '2026-09-24');
                    return <form onSubmit={(event) => { event.preventDefault(); onSubmit(); }}>
                        <Input value={value} onValueChange={(next) => {
                            onValueChange(next);
                            setValue('');
                        }} />
                    </form>;
                }
                await render(<Example />);
                const user = userEvent.setup();
                const input = screen.getByRole('textbox');
                await act(async () => { await user.click(input); });
                const action = screen.getByRole('button');
                expect(dispatch).toHaveBeenCalledWith({ type: 'setOpen', payload: true });
                if (method === 'click') {
                    await act(() => input.dispatchEvent(new MouseEvent('pointerover', { bubbles: true })));
                    dispatch.clear();
                    await act(async () => { await user.click(screen.getByRole('button', { name: clearLabel })); });
                } else {
                    await act(async () => { await user.tab(); });
                    expect(document.activeElement).toBe(screen.getByRole('button', { name: clearLabel }));
                    dispatch.clear();
                    const clear = screen.getByRole('button', { name: clearLabel });
                    const activation = new KeyboardEvent('keydown', {
                        key: method === 'Enter' ? 'Enter' : ' ', bubbles: true, cancelable: true,
                    });
                    await act(() => clear.dispatchEvent(activation));
                    expect(activation.defaultPrevented).toBe(false);
                    // Wake DOM 不合成原生按钮的键盘 click；Enter / Space 另在浏览器验证。
                    await fireEvent.click(clear);
                }
                expect(onValueChange).toHaveBeenCalledTimes(1);
                expect(onValueChange).toHaveBeenCalledWith(null);
                expect(screen.queryByRole('button', { name: clearLabel })).toBeNull();
                expect(document.activeElement).toBe(input);
                expect(screen.getByRole('button', { name: openLabel })).toBe(action);
                expect(action.getAttribute('aria-expanded')).toBe('false');
                expect(dispatch).not.toHaveBeenCalledWith({ type: 'setOpen', payload: true });
                expect(onSubmit).not.toHaveBeenCalled();
            });
        }

        it('keeps the picker action when hovering an empty field', async () => {
            const Input = getInput();
            const onValueChange = mock.fn();
            await render(<Input value="" onValueChange={onValueChange} />);
            await act(() => screen.getByRole('textbox').dispatchEvent(new MouseEvent('pointerover', { bubbles: true })));
            expect(screen.queryByRole('button', { name: clearLabel })).toBeNull();
            await act(async () => { await userEvent.setup().click(screen.getByRole('button', { name: openLabel })); });
            expect(dispatch).toHaveBeenCalledWith({ type: 'setOpen', payload: true });
            expect(document.activeElement).toBe(screen.getByRole('textbox'));
            expect(onValueChange).not.toHaveBeenCalled();
        });

        it('forwards blur without dismissing before a panel control receives focus', async () => {
            const Input = getInput();
            const onBlur = mock.fn();
            await render(<><Input value={value} onBlur={onBlur} /><input aria-label="面板输入" /></>);
            await act(() => screen.getAllByRole('textbox')[0]!.focus());
            dispatch.clear();
            await act(() => screen.getByRole('textbox', { name: '面板输入' }).focus());
            expect(onBlur).toHaveBeenCalledTimes(1);
            expect(dispatch).not.toHaveBeenCalledWith({ type: 'setOpen', payload: false });
        });

        it('exposes clear without hover on touch devices', async () => {
            const original = Object.getOwnPropertyDescriptor(window, 'matchMedia');
            const removeEventListener = mock.fn();
            Object.defineProperty(window, 'matchMedia', { configurable: true, value: () => ({
                matches: true, addEventListener: () => {}, removeEventListener,
            }) });
            try {
                const Input = getInput();
                const onValueChange = mock.fn();
                const view = await render(<Input value={value} onValueChange={onValueChange} />);
                await fireEvent.click(screen.getByRole('button', { name: clearLabel }));
                expect(onValueChange).toHaveBeenCalledWith(null);
                expect(dispatch).not.toHaveBeenCalledWith({ type: 'setOpen', payload: true });
                await view.unmount();
                expect(removeEventListener).toHaveBeenCalled();
            } finally {
                if (original) Object.defineProperty(window, 'matchMedia', original);
                else Reflect.deleteProperty(window, 'matchMedia');
            }
        });

        it('does not expose clear or activate the picker when disabled', async () => {
            const Input = getInput();
            const onValueChange = mock.fn();
            await render(<Input value={value} disabled onValueChange={onValueChange} />);
            await act(() => screen.getByRole('textbox').dispatchEvent(new MouseEvent('pointerover', { bubbles: true })));
            expect(screen.queryByRole('button', { name: clearLabel })).toBeNull();
            const calendar = screen.getByRole('button', { name: openLabel });
            expect(calendar.hasAttribute('disabled')).toBe(true);
            await act(async () => { await userEvent.setup().click(calendar); });
            expect(onValueChange).not.toHaveBeenCalled();
            expect(dispatch).not.toHaveBeenCalled();
        });
    });
}
