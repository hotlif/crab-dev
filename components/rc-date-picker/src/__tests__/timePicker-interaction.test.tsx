import { beforeAll, describe, expect, it, mock } from '@crab-dev/wake/test';
import { act, fireEvent, render, screen } from '@crab-dev/wake/test/react';
import { useState } from 'react';
import type { TimePickerValue } from '../panels/timePickerPanel.js';
import { enterTime, setupTimePickerDOM } from './timePicker-test-helpers.js';

mock.module('@floating-ui/react', async () => {
    const actual = await mock.actual<typeof import('@floating-ui/react')>('@floating-ui/react');
    // Geometry is verified in the browser; keep the real portal, context and outside dismissal.
    return { ...actual, autoUpdate: () => () => {} };
});
let TimePicker: (typeof import('../timePicker/timePicker.js'))['default'];
beforeAll(async () => {
    setupTimePickerDOM();
    TimePicker = (await mock.import<typeof import('../timePicker/timePicker.js')>('../timePicker/timePicker.js')).default;
});
describe('TimePicker dropdown interaction', () => {
    it('opens the dial by default and starts a fresh dial session after reopening', async () => {
        await render(<TimePicker aria-label="时间" value={{ hour: 9, minute: 30, second: 0 }} />);
        const field = screen.getByRole('textbox', { name: '时间' });
        await fireEvent.click(field);
        expect(screen.getByRole('group', { name: '小时表盘' })).toBeTruthy();
        await fireEvent.click(screen.getByRole('button', { name: '切换到键盘输入' }));
        expect(document.activeElement).toBe(screen.getByRole('textbox', { name: '小时' }));
        await fireEvent.click(screen.getByRole('button', { name: '取消' }));
        await fireEvent.click(field);
        expect(screen.getByRole('group', { name: '小时表盘' })).toBeTruthy();
        expect(document.activeElement).toBe(screen.getByRole('button', { name: '选择小时，当前 09' }));
    });
    it('does not confirm while the input method is composing', async () => {
        const onValueChange = mock.fn();
        await render(<TimePicker aria-label="时间" panelProps={{ defaultMode: 'input' }} value={{ hour: 9, minute: 30, second: 0 }} onValueChange={onValueChange} />);
        await fireEvent.click(screen.getByRole('textbox', { name: '时间' }));
        const hour = screen.getByRole('textbox', { name: '小时' });
        await act(() => hour.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', isComposing: true, bubbles: true })));
        await act(() => hour.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', keyCode: 229, bubbles: true })));
        expect(onValueChange).not.toHaveBeenCalled();
        expect(screen.getByRole('dialog', { name: '选择时间' }).getAttribute('aria-modal')).toBe('false');
        await fireEvent.keyDown(hour, { key: 'Enter' });
        expect(onValueChange).toHaveBeenCalledWith({ hour: 9, minute: 30, second: 0 });
    });
    it('allows focus to leave the dropdown without trapping Tab or committing the draft', async () => {
        const onValueChange = mock.fn();
        await render(<><TimePicker panelProps={{ defaultMode: 'input' }} aria-label="时间" value={{ hour: 9, minute: 30, second: 0 }} onValueChange={onValueChange} /><button type="button">后续操作</button></>);
        await fireEvent.click(screen.getByRole('textbox', { name: '时间' }));
        const hour = screen.getByRole('textbox', { name: '小时' });
        await enterTime(hour, '10');
        const confirm = screen.getByRole('button', { name: '确定' });
        await act(() => confirm.focus());
        const tab = new KeyboardEvent('keydown', { key: 'Tab', bubbles: true, cancelable: true });
        await act(() => confirm.dispatchEvent(tab));
        expect(tab.defaultPrevented).toBe(false);
        const outside = screen.getByRole('button', { name: '后续操作' });
        await act(() => outside.focus());
        expect(screen.queryByRole('dialog', { name: '选择时间' })).toBeNull();
        expect(document.activeElement).toBe(outside);
        expect(onValueChange).not.toHaveBeenCalled();
    });
    it('dismisses on outside pointerdown without blocking the surrounding page', async () => {
        const onValueChange = mock.fn();
        await render(<><TimePicker panelProps={{ defaultMode: 'input' }} aria-label="时间" onValueChange={onValueChange} /><button type="button">其他操作</button></>);
        await fireEvent.click(screen.getByRole('textbox', { name: '时间' }));
        const popup = screen.getByRole('dialog', { name: '选择时间' });
        expect(popup.tagName).toBe('DIV');
        expect(popup.getAttribute('aria-modal')).toBe('false');
        expect(document.querySelector('dialog')).toBeNull();
        expect(screen.getByRole('textbox', { name: '时间' }).getAttribute('aria-controls')).toBe(popup.id);
        const outside = screen.getByRole('button', { name: '其他操作' });
        expect(outside.closest('[inert]')).toBeNull();
        await fireEvent(outside, new PointerEvent('pointerdown', { bubbles: true }));
        expect(screen.queryByRole('dialog', { name: '选择时间' })).toBeNull();
        expect(onValueChange).not.toHaveBeenCalled();
    });
    it('closes when focus leaves the document without a related target', async () => {
        const onValueChange = mock.fn();
        await render(<TimePicker panelProps={{ defaultMode: 'input' }} aria-label="时间" onValueChange={onValueChange} />);
        await fireEvent.click(screen.getByRole('textbox', { name: '时间' }));
        const hour = screen.getByRole('textbox', { name: '小时' });
        await enterTime(hour, '10');
        await act(() => hour.blur());
        expect(screen.queryByRole('dialog', { name: '选择时间' })).toBeNull();
        expect(document.activeElement).toBe(document.body);
        expect(onValueChange).not.toHaveBeenCalled();
    });
    it('opens by activation, not focus, and confirms the displayed initial time', async () => {
        const onValueChange = mock.fn();
        await render(<TimePicker panelProps={{ defaultMode: 'input' }} aria-label="时间" value={null} onValueChange={onValueChange} />);
        const field = screen.getByRole('textbox', { name: '时间' });
        await act(() => field.focus());
        expect(screen.queryByRole('dialog', { name: '选择时间' })).toBeNull();
        await fireEvent.keyDown(field, { key: 'Enter' });
        expect(screen.getByRole('dialog', { name: '选择时间' })).toBeTruthy();
        const displayed = {
            hour: Number((screen.getByRole('textbox', { name: '小时' }) as HTMLInputElement).value),
            minute: Number((screen.getByRole('textbox', { name: '分钟' }) as HTMLInputElement).value),
            second: 0,
        };
        expect(screen.queryByRole('textbox', { name: '秒' })).toBeNull();
        await fireEvent.click(screen.getByRole('button', { name: '确定' }));
        expect(onValueChange).toHaveBeenCalledWith(displayed);
        expect(screen.queryByRole('dialog', { name: '选择时间' })).toBeNull();
        expect(document.activeElement).toBe(field);
    });

    it('commits the last keystroke without blur, reopens the accepted value, and clears', async () => {
        function Example() {
            const [value, setValue] = useState<TimePickerValue | null>({ hour: 9, minute: 30, second: 5 });
            return <TimePicker panelProps={{ defaultMode: 'input' }} aria-label="时间" value={value} onValueChange={setValue} />;
        }
        await render(<Example />);
        const input = screen.getByRole('textbox', { name: '时间' }) as HTMLInputElement;
        await fireEvent.click(input);
        const hour = screen.getByRole('textbox', { name: '小时' });
        await act(() => hour.focus());
        await enterTime(hour, '10');
        await fireEvent.click(screen.getByRole('button', { name: '确定' }));
        expect(input.value).toBe('10:30');
        await fireEvent.click(input);
        expect((screen.getByRole('textbox', { name: '小时' }) as HTMLInputElement).value).toBe('10');
        await fireEvent.click(screen.getByRole('button', { name: '取消' }));
        await act(() => input.dispatchEvent(new MouseEvent('pointerover', { bubbles: true })));
        await fireEvent.click(screen.getByRole('button', { name: '清除时间' }));
        expect(input.value).toBe('');
        expect(screen.queryByRole('dialog', { name: '选择时间' })).toBeNull();
        expect(document.activeElement).toBe(input);
    });

    it('discards cancel and Escape drafts and uses fresh controlled values', async () => {
        const onValueChange = mock.fn();
        const view = await render(<TimePicker panelProps={{ defaultMode: 'input' }} aria-label="时间" value={{ hour: 9, minute: 30, second: 0 }} onValueChange={onValueChange} />);
        const field = screen.getByRole('textbox', { name: '时间' });
        await fireEvent.click(field);
        await enterTime(screen.getByRole('textbox', { name: '小时' }), '10');
        await fireEvent.click(screen.getByRole('button', { name: '取消' }));
        expect(onValueChange).not.toHaveBeenCalled();
        await view.rerender(<TimePicker panelProps={{ defaultMode: 'input' }} aria-label="时间" value={{ hour: 12, minute: 0, second: 0 }} onValueChange={onValueChange} />);
        await fireEvent.click(field);
        expect((screen.getByRole('textbox', { name: '小时' }) as HTMLInputElement).value).toBe('12');
        await enterTime(screen.getByRole('textbox', { name: '分钟' }), '25');
        await fireEvent.keyDown(screen.getByRole('textbox', { name: '分钟' }), { key: 'Escape' });
        expect(onValueChange).not.toHaveBeenCalled();
        expect(screen.queryByRole('dialog', { name: '选择时间' })).toBeNull();
        expect(document.activeElement).toBe(field);
    });

    it('blocks invalid/empty inputs, recovers, and confirms valid input with Enter', async () => {
        const onValueChange = mock.fn();
        await render(<TimePicker panelProps={{ defaultMode: 'input' }} aria-label="时间" value={{ hour: 9, minute: 30, second: 8 }} onValueChange={onValueChange} />);
        await fireEvent.click(screen.getByRole('textbox', { name: '时间' }));
        const hour = screen.getByRole('textbox', { name: '小时' });
        const minute = screen.getByRole('textbox', { name: '分钟' });
        await enterTime(hour, '24');
        await enterTime(minute, '');
        expect(hour.getAttribute('aria-invalid')).toBe('true');
        await fireEvent.keyDown(hour, { key: 'Enter' });
        await fireEvent.click(screen.getByRole('button', { name: '确定' }));
        expect(onValueChange).not.toHaveBeenCalled();
        await enterTime(hour, '23');
        await fireEvent.keyDown(hour, { key: 'Enter' });
        expect(onValueChange).not.toHaveBeenCalled();
        await enterTime(minute, '59');
        await fireEvent.keyDown(minute, { key: 'Enter' });
        expect(onValueChange).toHaveBeenCalledWith({ hour: 23, minute: 59, second: 8 });
    });

    it('preserves explicit second precision and does not open a disabled field', async () => {
        const view = await render(<TimePicker aria-label="时间" value={{ hour: 9, minute: 30, second: 5 }} panelProps={{ showSeconds: true }} />);
        expect((screen.getByRole('textbox', { name: '时间' }) as HTMLInputElement).value).toBe('09:30:05');
        await fireEvent.click(screen.getByRole('textbox', { name: '时间' }));
        expect(screen.getByRole('textbox', { name: '秒' })).toBeTruthy();
        expect(screen.queryByRole('button', { name: '切换到表盘选择' })).toBeNull();
        await fireEvent.click(screen.getByRole('button', { name: '取消' }));
        await view.rerender(<TimePicker panelProps={{ defaultMode: 'input' }} aria-label="时间" disabled />);
        await fireEvent.click(screen.getByRole('textbox', { name: '时间' }));
        expect(screen.queryByRole('dialog', { name: '选择时间' })).toBeNull();
    });
});
