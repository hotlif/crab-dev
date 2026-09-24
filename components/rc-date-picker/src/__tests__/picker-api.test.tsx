import { beforeAll, beforeEach, describe, expect, it, mock } from '@crab-dev/wake/test';
import { act, fireEvent, render, screen } from '@crab-dev/wake/test/react';
import { createRef, type ReactNode } from 'react';
import { Temporal as TemporalPolyfill } from '@js-temporal/polyfill';

const dispatch = mock.fn();
// 无布局环境下仅替代弹层定位，保留真实输入框和面板的属性路由。
mock.module('@crab-dev/rc-dropdown-container', () => ({
    __esModule: true,
    default: ({ children, overlay }: { children: ReactNode; overlay: ReactNode }) => <>{children}{overlay}</>,
    useDropdownContext: () => ({ state: { open: false }, dispatch, refs: { setReference: () => {} } }),
}));
beforeEach(() => { dispatch.clear(); });
let DatePicker: typeof import('../datePicker/datePicker.js')['default'];
beforeAll(async () => {
    Object.defineProperty(globalThis, 'Temporal', { value: TemporalPolyfill, configurable: true });
    DatePicker = (await mock.import<typeof import('../datePicker/datePicker.js')>('../datePicker/datePicker.js')).default;
});
describe('Picker field and panel boundaries', () => {
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
