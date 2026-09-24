import { beforeAll, describe, expect, it, mock } from '@crab-dev/wake/test';
import { act, fireEvent, render } from '@crab-dev/wake/test/react';
import { createRef } from 'react';
import TimePicker from '../timePicker/timePicker.js';
import { setupTimePickerDOM } from './timePicker-test-helpers.js';

beforeAll(setupTimePickerDOM);
describe('TimePicker API', () => {
    it('routes panel attributes separately and composes the field ref and focus callback', async () => {
        const ref = createRef<HTMLInputElement>();
        const onFocus = mock.fn();
        const view = await render(<TimePicker value={{ hour: 9, minute: 30, second: 0 }} id="time" ref={ref} onFocus={onFocus} panelProps={{ id: 'time-panel' }} />);
        expect(ref.current?.id).toBe('time');
        await act(() => { ref.current!.focus(); });
        expect(onFocus).toHaveBeenCalled();
        expect(document.getElementById('time-panel')).toBeNull();
        await fireEvent.click(ref.current!);
        expect(document.getElementById('time-panel')?.tagName).toBe('DIV');
        await view.unmount();
        expect(ref.current).toBeNull();
    });
});
