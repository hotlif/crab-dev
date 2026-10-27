import { beforeAll, describe, expect, it, mock } from '@crab-dev/wake/test';
import { fireEvent, render, screen } from '@crab-dev/wake/test/react';
import { setupTimePickerDOM } from './timePicker-test-helpers.js';

mock.module('@floating-ui/react', async () => {
    const actual = await mock.actual<typeof import('@floating-ui/react')>('@floating-ui/react');
    // 保留真实弹层、Portal 与上下文，仅停止测试宿主中的持续尺寸监听。
    return { ...actual, autoUpdate: () => () => {} };
});

let DatePicker: typeof import('../datePicker/datePicker.js')['default'];
let DateTimePicker: typeof import('../dateTimePicker/dateTimePicker.js')['default'];
beforeAll(async () => {
    setupTimePickerDOM();
    DatePicker = (await mock.import<typeof import('../datePicker/datePicker.js')>('../datePicker/datePicker.js')).default;
    DateTimePicker = (await mock.import<typeof import('../dateTimePicker/dateTimePicker.js')>('../dateTimePicker/dateTimePicker.js')).default;
});

describe('Picker popup association', () => {
    for (const kind of ['date', 'datetime'] as const) {
        it(`associates the ${kind} field with its named dialog through reopening and rerendering`, async () => {
            const Picker = kind === 'date' ? DatePicker : DateTimePicker;
            const dialogName = kind === 'date' ? 'Choose date' : 'Choose date and time';
            const view = await render(<Picker value={null} locale="en-US" aria-label="Picker field" />);
            const field = screen.getByRole('textbox', { name: 'Picker field' });
            const popupId = field.getAttribute('aria-controls');
            expect(Boolean(popupId)).toBe(true);
            expect(field.getAttribute('aria-haspopup')).toBe('dialog');
            expect(field.getAttribute('aria-expanded')).toBe('false');
            await fireEvent.click(field);
            const popup = screen.getByRole('dialog', { name: dialogName });
            expect(field.getAttribute('aria-expanded')).toBe('true');
            expect(popup.id).toBe(popupId);
            expect(document.getElementById(popupId!)).toBe(popup);
            expect(popup.getAttribute('aria-modal')).toBe('false');
            await fireEvent.click(screen.getByRole('button', { name: 'Cancel' }));
            expect(field.getAttribute('aria-expanded')).toBe('false');
            await view.rerender(<Picker value={null} locale="en-US" aria-label="Picker field" disabled={false} />);
            expect(field.getAttribute('aria-controls')).toBe(popupId);
            await fireEvent.click(field);
            expect(screen.getByRole('dialog', { name: dialogName }).id).toBe(popupId);
        });
    }

    it('keeps simultaneous date and date-time popup identifiers distinct', async () => {
        await render(<><DatePicker value={null} aria-label="Date field" /><DateTimePicker value={null} aria-label="Date-time field" /></>);
        const datePopupId = screen.getByRole('textbox', { name: 'Date field' }).getAttribute('aria-controls');
        const dateTimePopupId = screen.getByRole('textbox', { name: 'Date-time field' }).getAttribute('aria-controls');
        expect(Boolean(datePopupId)).toBe(true);
        expect(Boolean(dateTimePopupId)).toBe(true);
        expect(datePopupId === dateTimePopupId).toBe(false);
    });
});
