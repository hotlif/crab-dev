import { beforeAll, describe, expect, it, mock } from '@crab-dev/wake/test';
import { act, render, screen, userEvent } from '@crab-dev/wake/test/react';
import type { DropdownOpenChangeDetails } from '@crab-dev/rc-dropdown-container';
import { setupTimePickerDOM } from './timePicker-test-helpers.js';

// This package runs in Chromium. Keep actual portals, focus and Floating UI;
// the native Tab traversal is also exercised by the component-state CDP runner.
let DatePicker: typeof import('../datePicker/datePicker.js')['default'];
let DateTimePicker: typeof import('../dateTimePicker/dateTimePicker.js')['default'];
let TimePicker: typeof import('../timePicker/timePicker.js')['default'];
beforeAll(async () => {
    setupTimePickerDOM();
    DatePicker = (await mock.import<typeof import('../datePicker/datePicker.js')>('../datePicker/datePicker.js')).default;
    DateTimePicker = (await mock.import<typeof import('../dateTimePicker/dateTimePicker.js')>('../dateTimePicker/dateTimePicker.js')).default;
    TimePicker = (await mock.import<typeof import('../timePicker/timePicker.js')>('../timePicker/timePicker.js')).default;
});

describe('Picker focus branches in a browser', () => {
    it('keeps focus opening and removes earlier calendars while tabbing through adjacent date, time and date-time fields', async () => {
        const changed = mock.fn();
        await render(<>
            <DatePicker aria-label="First date" onValueChange={changed} />
            <DatePicker aria-label="Second date" onValueChange={changed} />
            <TimePicker aria-label="Time" onValueChange={changed} />
            <DateTimePicker aria-label="Date and time" onValueChange={changed} />
            <button type="button">Next operation</button>
        </>);
        const user = userEvent.setup();
        const fields = ['First date', 'Second date', 'Time', 'Date and time'].map(name => screen.getByRole('textbox', { name }));
        for (const field of fields) {
            let steps = 0;
            while (document.activeElement !== field && steps < 100) {
                await act(async () => { await user.tab(); });
                steps += 1;
            }
            expect(document.activeElement).toBe(field);
            const activePopups = document.querySelectorAll('[role="dialog"]:not([inert])');
            expect(activePopups.length).toBe(field === fields[2] ? 0 : 1);
            for (const previous of fields.slice(0, fields.indexOf(field))) {
                expect(previous.getAttribute('aria-expanded')).toBe('false');
            }
        }
        expect(changed).not.toHaveBeenCalled();
        const outside = screen.getByRole('button', { name: 'Next operation' });
        await act(() => outside.focus());
        expect(document.querySelectorAll('[role="dialog"]:not([inert])').length).toBe(0);
        expect(document.activeElement).toBe(outside);
    });

    for (const kind of ['date', 'datetime'] as const) {
        it(`keeps the ${kind} popup when moving between its field, suffix action and panel controls`, async () => {
            const Picker = kind === 'date' ? DatePicker : DateTimePicker;
            const changed = mock.fn();
            await render(<><Picker aria-label="Picker" onOpenChange={changed} /><button type="button">Outside</button></>);
            const field = screen.getByRole('textbox', { name: 'Picker' });
            await act(() => field.focus());
            expect(changed).toHaveBeenCalledTimes(1);
            const popup = screen.getByRole('dialog');
            const cancel = screen.getByRole('button', { name: '取消' });
            await act(() => cancel.focus());
            await act(() => field.focus());
            await act(() => screen.getByRole('button', { name: '打开日历' }).focus());
            expect(screen.getByRole('dialog')).toBe(popup);
            expect(changed).toHaveBeenCalledTimes(1);
            const outside = screen.getByRole('button', { name: 'Outside' });
            await act(() => outside.focus());
            expect(screen.queryByRole('dialog')).toBeNull();
            expect(changed).toHaveBeenCalledTimes(2);
            expect(changed).toHaveBeenLastCalledWith(false, expect.objectContaining({ reason: 'focus-out', event: expect.any(FocusEvent) }));
            expect(document.activeElement).toBe(outside);
        });
    }

    it('keeps a TimePicker draft when returning from the panel to its field, then discards it on branch exit', async () => {
        const changed = mock.fn();
        const opened = mock.fn();
        await render(<><TimePicker aria-label="Time" defaultValue={{ hour: 9, minute: 30, second: 0 }} panelProps={{ defaultMode: 'input' }} onValueChange={changed} onOpenChange={opened} /><button type="button">Outside</button></>);
        const field = screen.getByRole('textbox', { name: 'Time' });
        await act(async () => { await userEvent.setup().click(field); });
        const hour = screen.getByRole('textbox', { name: '小时' });
        await act(() => hour.focus());
        await act(() => field.focus());
        expect(screen.getByRole('dialog')).toBeTruthy();
        expect(opened).toHaveBeenCalledTimes(1);
        const outside = screen.getByRole('button', { name: 'Outside' });
        await act(() => outside.focus());
        expect(screen.queryByRole('dialog')).toBeNull();
        expect(changed).not.toHaveBeenCalled();
        expect(opened).toHaveBeenCalledTimes(2);
        expect(opened).toHaveBeenLastCalledWith(false, expect.objectContaining({ reason: 'focus-out' }));
        expect(document.activeElement).toBe(outside);
    });

    it('only requests a controlled close and leaves external open updates silent', async () => {
        const changed = mock.fn();
        const view = await render(<><DatePicker aria-label="Controlled" open onOpenChange={changed} /><button type="button">Outside</button></>);
        const outside = screen.getByRole('button', { name: 'Outside' });
        await act(() => outside.focus());
        expect(changed).toHaveBeenCalledTimes(1);
        expect(changed).toHaveBeenCalledWith(false, expect.objectContaining({ reason: 'focus-out' }));
        expect(screen.getByRole('dialog')).toBeTruthy();
        expect(document.activeElement).toBe(outside);
        await view.rerender(<DatePicker aria-label="Controlled" open={false} onOpenChange={changed} />);
        expect(changed).toHaveBeenCalledTimes(1);
        expect(screen.queryByRole('dialog')).toBeNull();
    });

    it('uses the iframe focus realm and keeps its popup and dismissal local', async () => {
        const frame = document.createElement('iframe');
        document.body.append(frame);
        const owner = frame.contentDocument!;
        const container = owner.createElement('div');
        owner.body.append(container);
        const requests: DropdownOpenChangeDetails[] = [];
        try {
            const view = await render(<><DatePicker aria-label="Frame date" onOpenChange={(_open, details) => { requests.push(details); }} /><button type="button">Frame outside</button></>, { container });
            const field = container.querySelector('input')!;
            await act(() => field.focus());
            const popup = owner.querySelector('[role="dialog"]');
            expect(popup?.ownerDocument).toBe(owner);
            const outside = Array.from(container.querySelectorAll('button')).find(button => button.textContent === 'Frame outside')!;
            await act(() => outside.focus());
            expect(owner.querySelector('[role="dialog"]')).toBeNull();
            expect(owner.activeElement).toBe(outside);
            expect(requests.length).toBe(2);
            expect(requests[1].reason).toBe('focus-out');
            expect(requests[1].event instanceof owner.defaultView!.FocusEvent).toBe(true);
            await view.unmount();
        } finally {
            frame.remove();
        }
    });
});
