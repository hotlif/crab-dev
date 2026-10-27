import { beforeAll, describe, expect, it, mock } from '@crab-dev/wake/test';
import { act, render } from '@crab-dev/wake/test/react';
import { createRef, type ReactNode } from 'react';
import { Temporal as TemporalPolyfill } from '@js-temporal/polyfill';
import ConfigProvider from '@crab-dev/rc-config-provider';

const dispatch = mock.fn();
// 组合组件只验证属性边界；日历与时间面板交互由各自的测试覆盖。
mock.module('../panels/dateTimePickerPanel.js', () => ({
    __esModule: true,
    default: ({ id }: { id?: string }) => <div id={id} />,
}));
mock.module('@crab-dev/rc-dropdown-container/internal', () => ({
    useDropdownPositionReference: () => () => {},
}));
mock.module('@crab-dev/rc-dropdown-container', () => ({
    __esModule: true,
    default: ({ children, overlay }: { children: ReactNode; overlay: ReactNode }) => <>{children}{overlay}</>,
    useDropdownContext: () => ({ state: { open: false }, dispatch, refs: { setReference: () => {} } }),
}));
let DateTimePicker: typeof import('../dateTimePicker/dateTimePicker.js')['default'];
beforeAll(async () => {
    Object.defineProperty(globalThis, 'Temporal', { value: TemporalPolyfill, configurable: true });
    DateTimePicker = (await mock.import<typeof import('../dateTimePicker/dateTimePicker.js')>('../dateTimePicker/dateTimePicker.js')).default;
});

describe('DateTimePicker API', () => {
    it('updates the date and time prompt with locale while preserving caller placeholders', async () => {
        const view = await render(<ConfigProvider locale="zh-CN"><DateTimePicker aria-label="appointment" /></ConfigProvider>);
        const input = view.container.querySelector<HTMLInputElement>('input');
        expect(input?.placeholder).toBe('选择日期和时间');
        await view.rerender(<ConfigProvider locale="en-US"><DateTimePicker aria-label="appointment" /></ConfigProvider>);
        expect(view.container.querySelector('input')).toBe(input);
        expect(input?.placeholder).toBe('Choose date and time');
        await view.rerender(<ConfigProvider locale="zh-CN"><DateTimePicker aria-label="appointment" locale="en-US" /></ConfigProvider>);
        expect(view.container.querySelector('input')).toBe(input);
        expect(input?.placeholder).toBe('Choose date and time');
        await view.rerender(<ConfigProvider locale="zh-CN"><DateTimePicker aria-label="appointment" placeholder="Choose an appointment" /></ConfigProvider>);
        expect(view.container.querySelector('input')).toBe(input);
        expect(input?.placeholder).toBe('Choose an appointment');
    });
    it('routes panel attributes separately and composes the field ref and focus callback', async () => {
        const ref = createRef<HTMLInputElement>();
        const onFocus = mock.fn();
        const value = Temporal.ZonedDateTime.from('2026-09-12T09:30+08:00[Asia/Shanghai]');
        const view = await render(<DateTimePicker value={value} id='datetime' ref={ref} onFocus={onFocus} panelProps={{ id: 'datetime-panel' }} />);
        expect(ref.current?.id).toBe('datetime');
        expect(document.getElementById('datetime-panel')?.tagName).toBe('DIV');
        await act(() => { ref.current!.focus(); });
        expect(onFocus).toHaveBeenCalled();
        expect(dispatch).toHaveBeenCalledWith({ type: 'setOpen', payload: true });
        await view.unmount();
        expect(ref.current).toBeNull();
    });
});
