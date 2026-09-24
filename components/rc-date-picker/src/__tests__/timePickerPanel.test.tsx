import { beforeAll, describe, expect, it, mock } from '@crab-dev/wake/test';
import { act, fireEvent, render, screen } from '@crab-dev/wake/test/react';
import { useState } from 'react';
import TimePickerPanel, { type TimePickerPanelProps, type TimePickerValue } from '../panels/timePickerPanel.js';
import { enterTime, setupTimePickerDOM } from './timePicker-test-helpers.js';

beforeAll(setupTimePickerDOM);
function Example(props: Omit<TimePickerPanelProps, 'value'>) {
    const [value, setValue] = useState<TimePickerValue | null>({ hour: 0, minute: 30, second: 5 });
    return <TimePickerPanel {...props} value={value} onValueChange={next => { setValue(next); props.onValueChange?.(next); }} />;
}
describe('M3 TimePickerPanel', () => {
    it('uses labeled hours/minutes, and exposes seconds only when requested', async () => {
        const view = await render(<TimePickerPanel defaultMode="input" value={{ hour: 9, minute: 30, second: 5 }} />);
        expect((screen.getByRole('textbox', { name: '小时' }) as HTMLInputElement).value).toBe('09');
        expect(screen.getByRole('textbox', { name: '分钟' }).getAttribute('inputmode')).toBe('numeric');
        expect(screen.queryByRole('textbox', { name: '秒' })).toBeNull();
        await view.rerender(<TimePickerPanel value={{ hour: 9, minute: 30, second: 5 }} showSeconds />);
        expect((screen.getByRole('textbox', { name: '秒' }) as HTMLInputElement).value).toBe('05');
    });
    it('keeps both typed digits and preserves seconds when changing minutes', async () => {
        const onValueChange = mock.fn();
        await render(<Example defaultMode="input" onValueChange={onValueChange} />);
        const minute = screen.getByRole('textbox', { name: '分钟' }) as HTMLInputElement;
        await enterTime(minute, '4');
        expect(minute.value).toBe('4');
        await enterTime(minute, '45');
        expect(minute.value).toBe('45');
        await fireEvent.keyDown(minute, { key: 'ArrowUp' });
        expect(onValueChange).toHaveBeenCalledWith({ hour: 0, minute: 46, second: 5 });
    });
    it('maps 12 AM/PM and 1 PM to canonical 24-hour values', async () => {
        const onValueChange = mock.fn();
        await render(<Example defaultMode="input" hourCycle={12} onValueChange={onValueChange} />);
        expect((screen.getByRole('textbox', { name: '小时' }) as HTMLInputElement).value).toBe('12');
        expect(screen.getByRole('radio', { name: '上午' }).getAttribute('aria-checked')).toBe('true');
        await fireEvent.click(screen.getByRole('radio', { name: '下午' }));
        expect(onValueChange).toHaveBeenCalledWith({ hour: 12, minute: 30, second: 5 });
        await enterTime(screen.getByRole('textbox', { name: '小时' }), '1');
        expect(onValueChange).toHaveBeenCalledWith({ hour: 13, minute: 30, second: 5 });
        await fireEvent.keyDown(screen.getByRole('radio', { name: '下午' }), { key: 'ArrowLeft' });
        expect(onValueChange).toHaveBeenCalledWith({ hour: 1, minute: 30, second: 5 });
        expect(document.activeElement).toBe(screen.getByRole('radio', { name: '上午' }));
    });
    it('selects both dial rings, advances to minutes and retains the draft across modes', async () => {
        const onValueChange = mock.fn();
        await render(<Example onValueChange={onValueChange} />);
        expect(screen.getByRole('button', { name: '0 时，共 24 小时' }).getAttribute('aria-pressed')).toBe('true');
        expect(screen.getByRole('button', { name: '12 时，共 24 小时' })).toBeTruthy();
        await fireEvent.click(screen.getByRole('button', { name: '23 时，共 24 小时' }));
        expect(onValueChange).toHaveBeenCalledWith({ hour: 23, minute: 30, second: 5 });
        expect(screen.getByRole('group', { name: '分钟表盘' })).toBeTruthy();
        expect(document.activeElement?.getAttribute('aria-label')).toBe('选择分钟，当前 30');
        await fireEvent.click(screen.getByRole('button', { name: '55 分，共 60 分钟' }));
        await fireEvent.click(screen.getByRole('button', { name: '切换到键盘输入' }));
        expect(document.activeElement).toBe(screen.getByRole('textbox', { name: '分钟' }));
        expect((screen.getByRole('textbox', { name: '小时' }) as HTMLInputElement).value).toBe('23');
        expect((screen.getByRole('textbox', { name: '分钟' }) as HTMLInputElement).value).toBe('55');
    });
    it('supports dial arrow keys including 59 to 00 wraparound', async () => {
        const onValueChange = mock.fn();
        await render(<TimePickerPanel defaultMode="dial" value={{ hour: 12, minute: 59, second: 0 }} onValueChange={onValueChange} />);
        await fireEvent.click(screen.getByRole('button', { name: '选择分钟，当前 59' }));
        await fireEvent.keyDown(screen.getByRole('button', { name: '55 分，共 60 分钟' }), { key: 'ArrowRight' });
        expect(onValueChange).toHaveBeenCalledWith({ hour: 12, minute: 0, second: 0 });
        expect(document.activeElement).toBe(screen.getByRole('button', { name: '0 分，共 60 分钟' }));
    });
    it('keeps keyboard focus on the selected dial number so activation cannot undo arrow changes', async () => {
        const onValueChange = mock.fn();
        await render(<Example onValueChange={onValueChange} />);
        const zero = screen.getByRole('button', { name: '0 时，共 24 小时' });
        await act(() => zero.focus());
        await fireEvent.keyDown(zero, { key: 'ArrowLeft' });
        const selected = screen.getByRole('button', { name: '23 时，共 24 小时' });
        expect(document.activeElement).toBe(selected);
        await fireEvent.click(selected);
        expect(screen.getByRole('button', { name: '选择小时，当前 23' })).toBeTruthy();
        expect(screen.getByRole('group', { name: '分钟表盘' })).toBeTruthy();
    });
    it('clears stale errors when the owner replaces the value or removes the seconds field', async () => {
        const validity: boolean[] = [];
        const onValidityChange = mock.fn((valid: boolean) => { validity.push(valid); });
        const view = await render(<TimePickerPanel defaultMode="input" value={{ hour: 9, minute: 30, second: 5 }} onValidityChange={onValidityChange} showSeconds />);
        await enterTime(screen.getByRole('textbox', { name: '小时' }), '24');
        await view.rerender(<TimePickerPanel defaultMode="input" value={{ hour: 10, minute: 30, second: 5 }} onValidityChange={onValidityChange} showSeconds />);
        expect(validity.at(-1)).toBe(true);
        await enterTime(screen.getByRole('textbox', { name: '秒' }), '99');
        expect(validity.at(-1)).toBe(false);
        await view.rerender(<TimePickerPanel defaultMode="input" value={{ hour: 10, minute: 30, second: 5 }} onValidityChange={onValidityChange} />);
        expect(validity.at(-1)).toBe(true);
        expect(screen.getByRole('button', { name: '切换到表盘选择' }).hasAttribute('disabled')).toBe(false);
        await view.rerender(<TimePickerPanel defaultMode="input" value={{ hour: 10, minute: 30, second: 5 }} onValidityChange={onValidityChange} showSeconds />);
        expect(validity.at(-1)).toBe(true);
        expect(screen.getByRole('textbox', { name: '秒' }).getAttribute('aria-invalid')).toBeNull();
    });
    it('restores focus on viewport fallback and retains unfinished input when the viewport grows', async () => {
        const original = Object.getOwnPropertyDescriptor(window, 'matchMedia');
        let listener: (() => void) | undefined;
        const media = { matches: false, addEventListener(_name: string, callback: () => void) { listener = callback; }, removeEventListener() {} };
        Object.defineProperty(window, 'matchMedia', { configurable: true, value: () => media });
        try {
            await render(<Example />);
            await act(() => screen.getByRole('button', { name: '选择小时，当前 00' }).focus());
            await act(() => { media.matches = true; listener?.(); });
            const hour = screen.getByRole('textbox', { name: '小时' });
            expect(document.activeElement).toBe(hour);
            await enterTime(hour, '');
            await act(() => { media.matches = false; listener?.(); });
            expect(screen.getByRole('textbox', { name: '小时' })).toBe(hour);
            expect(hour.getAttribute('aria-invalid')).toBe('true');
            await enterTime(hour, '10');
            await fireEvent.click(screen.getByRole('button', { name: '切换到表盘选择' }));
            expect(document.activeElement).toBe(screen.getByRole('button', { name: '选择小时，当前 10' }));
        } finally {
            if (original) Object.defineProperty(window, 'matchMedia', original);
            else Reflect.deleteProperty(window, 'matchMedia');
        }
    });
    it('rejects invalid text without silently confirming the previous number', async () => {
        const onValueChange = mock.fn();
        const validity: boolean[] = [];
        const onValidityChange = mock.fn((valid: boolean) => { validity.push(valid); });
        await render(<Example defaultMode="input" onValueChange={onValueChange} onValidityChange={onValidityChange} />);
        await enterTime(screen.getByRole('textbox', { name: '小时' }), '-1');
        expect(onValueChange).not.toHaveBeenCalled();
        expect(onValidityChange).toHaveBeenCalledWith(false);
        expect(screen.getByRole('textbox', { name: '小时' }).getAttribute('aria-invalid')).toBe('true');
        await enterTime(screen.getByRole('textbox', { name: '小时' }), '23');
        expect(onValidityChange).toHaveBeenCalledWith(true);
    });
    it('falls back to input in a short viewport without shrinking the dial', async () => {
        const original = Object.getOwnPropertyDescriptor(window, 'matchMedia');
        Object.defineProperty(window, 'matchMedia', { configurable: true, value: () => ({ matches: true, addEventListener() {}, removeEventListener() {} }) });
        try {
            await render(<Example defaultMode="dial" />);
            expect(screen.queryByRole('group', { name: '小时表盘' })).toBeNull();
            expect(screen.getByRole('textbox', { name: '小时' })).toBeTruthy();
            expect(screen.queryByRole('button', { name: '切换到表盘选择' })).toBeNull();
        } finally {
            if (original) Object.defineProperty(window, 'matchMedia', original);
            else Reflect.deleteProperty(window, 'matchMedia');
        }
    });
    it('maps pointer positions to the inner 24-hour ring', async () => {
        const onValueChange = mock.fn();
        await render(<Example defaultMode="dial" onValueChange={onValueChange} />);
        const dial = screen.getByRole('group', { name: '小时表盘' });
        Object.defineProperty(dial, 'getBoundingClientRect', { value: () => ({ left: 0, top: 0, width: 256, height: 256 }) });
        Object.defineProperty(dial, 'setPointerCapture', { value: () => {} });
        Object.defineProperty(dial, 'releasePointerCapture', { value: () => {} });
        // A interrupted drag must not leave the clock locked to the old pointer.
        const interrupted = new MouseEvent('pointerdown', { bubbles: true, clientX: 128, clientY: 24, button: 0 });
        Object.defineProperty(interrupted, 'pointerId', { value: 2 });
        await act(() => dial.dispatchEvent(interrupted));
        await act(() => dial.dispatchEvent(new Event('lostpointercapture', { bubbles: true })));
        for (const type of ['pointerdown', 'pointerup']) {
            const event = new MouseEvent(type, { bubbles: true, clientX: 196, clientY: 128, button: 0 });
            Object.defineProperty(event, 'pointerId', { value: 1 });
            await act(() => dial.dispatchEvent(event));
        }
        expect(onValueChange).toHaveBeenCalledWith({ hour: 15, minute: 30, second: 5 });
        expect(screen.getByRole('group', { name: '分钟表盘' })).toBeTruthy();
    });
});
