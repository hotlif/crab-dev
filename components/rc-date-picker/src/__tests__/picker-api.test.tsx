import { beforeAll, beforeEach, describe, expect, it, mock } from '@crab-dev/wake/test';
import { act, fireEvent, render, screen } from '@crab-dev/wake/test/react';
import { createRef, type ReactNode } from 'react';
import type { PickerValueChangeDetails } from '../types.js';
import { setupTimePickerDOM } from './timePicker-test-helpers.js';

const dispatch = mock.fn();
// 无布局环境下仅替代弹层定位，保留真实输入框和面板的属性路由。
mock.module('@crab-dev/rc-dropdown-container/internal', () => ({
    useDropdownPositionReference: () => () => {},
}));
mock.module('@crab-dev/rc-dropdown-container', () => ({
    __esModule: true,
    default: ({ children, overlay }: { children: ReactNode; overlay: ReactNode }) => <>{children}{overlay}</>,
    useDropdownContext: () => ({ state: { open: false }, dispatch, refs: { setReference: () => {} } }),
}));
beforeEach(() => { dispatch.clear(); });
let DatePicker: typeof import('../datePicker/datePicker.js')['default'];
beforeAll(async () => {
    setupTimePickerDOM();
    DatePicker = (await mock.import<typeof import('../datePicker/datePicker.js')>('../datePicker/datePicker.js')).default;
});
describe('Picker field and panel boundaries', () => {
    it('owns the initial date and reports a confirmed draft with details', async () => {
        const initial = Temporal.ZonedDateTime.from('2026-10-01T12:00:00+08:00[Asia/Singapore]');
        let confirmedDay = 0;
        const changed = mock.fn<(next: Temporal.ZonedDateTime | null, details: PickerValueChangeDetails) => void>((next) => { confirmedDay = next?.day ?? 0; });
        const view = await render(<DatePicker defaultValue={initial} onValueChange={changed} />);
        await fireEvent.click(screen.getByRole('button', { name: '2026-10-02' }));
        expect(changed).not.toHaveBeenCalled();
        await fireEvent.click(screen.getByRole('button', { name: '确定' }));
        expect(confirmedDay).toBe(2);
        expect(changed.calls.calls[0][1]).toEqual({ reason: 'confirm' });
        expect((screen.getByRole('textbox') as HTMLInputElement).value).toBe('2026-10-02');
        await view.rerender(<DatePicker defaultValue={initial.add({ days: 5 })} onValueChange={changed} />);
        expect((screen.getByRole('textbox') as HTMLInputElement).value).toBe('2026-10-02');
    });

    it('keeps a controlled date until the owner accepts a change', async () => {
        const initial = Temporal.ZonedDateTime.from('2026-10-01T12:00:00+08:00[Asia/Singapore]');
        let confirmedDay = 0;
        const changed = mock.fn<(next: Temporal.ZonedDateTime | null, details: PickerValueChangeDetails) => void>((next) => { confirmedDay = next?.day ?? 0; });
        await render(<DatePicker value={initial} onValueChange={changed} />);
        await fireEvent.click(screen.getByRole('button', { name: '2026-10-03' }));
        await fireEvent.click(screen.getByRole('button', { name: '确定' }));
        expect(confirmedDay).toBe(3);
        expect(changed.calls.calls[0][1]).toEqual({ reason: 'confirm' });
        expect((screen.getByRole('textbox') as HTMLInputElement).value).toBe('2026-10-01');
    });

    it('applies a local locale to calendar formatting and accessible field actions', async () => {
        const value = Temporal.ZonedDateTime.from('2026-10-01T12:00:00+08:00[Asia/Singapore]');
        await render(<DatePicker value={value} timeZone="Asia/Singapore" locale="en-US" />);
        expect(screen.getByRole('textbox').getAttribute('placeholder')).toBe('Choose date');
        expect(screen.getByRole('button', { name: 'Next month' })).toBeTruthy();
        expect(screen.getByRole('button', { name: 'Confirm' })).toBeTruthy();
    });

    it('routes field props, panel props and refs to their own elements', async () => {
        const ref = createRef<HTMLInputElement>();
        const onFocus = mock.fn();
        const view = await render(<DatePicker value={null} id='field' name='date' ref={ref} onFocus={onFocus} panelProps={{ id: 'calendar', 'aria-label': 'Panel' }} />);
        expect(ref.current?.id).toBe('field');
        expect(ref.current?.name).toBe('date');
        expect(document.getElementById('calendar')?.tagName).toBe('DIV');
        await act(() => { ref.current!.focus(); });
        expect(onFocus).toHaveBeenCalled();
        expect(dispatch).toHaveBeenCalledWith({ type: 'setOpen', payload: true });
        expect(document.getElementById('calendar')?.tagName).toBe('DIV');
        expect(ref.current?.getAttribute('aria-label')).toBeNull();
        await view.unmount();
        expect(ref.current).toBeNull();
    });

    it('retains keyboard opening when the caller supplies its own handler', async () => {
        const onKeyDown = mock.fn();
        await render(<DatePicker value={null} aria-label='Date' onKeyDown={onKeyDown} panelProps={{ id: 'calendar' }} />);
        await fireEvent.keyDown(screen.getByRole('textbox'), { key: 'ArrowDown' });
        expect(onKeyDown).toHaveBeenCalledTimes(1);
        expect(dispatch).toHaveBeenCalledWith({ type: 'setOpen', payload: true });
        expect(document.getElementById('calendar')).toBeTruthy();
    });

});
