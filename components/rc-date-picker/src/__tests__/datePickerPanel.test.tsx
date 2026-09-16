import { beforeAll, describe, expect, it, mock } from '@crab-dev/wake/test';
import { act, fireEvent, render, screen } from '@crab-dev/wake/test/react';
import { createRef } from 'react';
import { Temporal as TemporalPolyfill } from '@js-temporal/polyfill';
import DatePickerPanel, { type DatePickerPanelInstance } from '../panels/datePickerPanel.js';

beforeAll(() => {
    Object.defineProperty(globalThis, 'Temporal', { value: TemporalPolyfill, configurable: true });
});

describe('DatePickerPanel', () => {
    it('renders named navigation and selectable calendar days', async () => {
        const value = Temporal.ZonedDateTime.from('2026-09-12T00:00+08:00[Asia/Shanghai]');
        let selectedDate = '';
        const select = mock.fn((dates: Temporal.ZonedDateTime[]) => { selectedDate = dates[0].toPlainDate().toString(); });
        await render(<DatePickerPanel value={value} timeZone="Asia/Shanghai" selectValues={[value]} onSelect={select} />);
        expect(screen.getByRole('button', { name: '2026-09-12' }).getAttribute('aria-pressed')).toBe('true');
        await fireEvent.click(screen.getByRole('button', { name: '下一月' }));
        expect(screen.getByRole('button', { name: '2026-10-15' })).toBeTruthy();
        await fireEvent.click(screen.getByRole('button', { name: '2026-10-15' }));
        expect(selectedDate).toBe('2026-10-15');
    });

    it('disables dates outside the range and ignores keyboard moves beyond it', async () => {
        const value = Temporal.ZonedDateTime.from('2026-09-12T00:00+08:00[Asia/Shanghai]');
        let selectedDay = 0;
        const select = mock.fn((dates: Temporal.ZonedDateTime[]) => { selectedDay = dates[0].day; });
        const instance = createRef<DatePickerPanelInstance>();
        await render(<DatePickerPanel value={value} timeZone="Asia/Shanghai" selectValues={[value]}
            range={{ start: value, end: value.add({ days: 2 }) }} onSelect={select} instance={instance} />);
        expect(screen.getByRole('button', { name: '2026-09-11' }).hasAttribute('disabled')).toBe(true);
        expect(screen.getByRole('button', { name: '上一月' }).hasAttribute('disabled')).toBe(true);
        await act(async () => { instance.current?.keyboardNavigate('left'); });
        expect(select).not.toHaveBeenCalled();
        await act(async () => { instance.current?.keyboardNavigate('right'); });
        expect(selectedDay).toBe(13);
    });
});
