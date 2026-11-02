import { describe, expect, it } from '@crab-dev/wake/test';
import { act, fireEvent, render } from '@crab-dev/wake/test/react';
import { useNativeRadioFocus } from '../useNativeRadioFocus.js';

async function dispatch(element: Element, type: string) {
    await act(() => { element.dispatchEvent(new Event(type, { bubbles: true })); });
}

function NativeRadio({ label }: { label: string }) {
    const focus = useNativeRadioFocus();
    return <label onPointerDownCapture={focus.onPointerDownCapture}>
        {label}<input type="radio" name="native-focus" data-keyboard-focus={focus.keyboardFocus ? '' : undefined}
            onKeyDownCapture={focus.onKeyDownCapture} onFocus={focus.onFocus} onBlur={focus.onBlur} />
    </label>;
}

describe('native radio keyboard focus', () => {
    it('carries keyboard modality between separate radio instances and resets on a label pointer press', async () => {
        const { container } = await render(<><NativeRadio label="Day" /><NativeRadio label="Week" /></>);
        const [day, week] = container.querySelectorAll('input');
        await dispatch(day.parentElement!, 'pointerdown');
        await dispatch(day, 'focusin');
        expect(day.hasAttribute('data-keyboard-focus')).toBe(false);
        await fireEvent.keyDown(day, { key: 'ArrowRight' });
        await dispatch(day, 'focusout');
        await dispatch(week, 'focusin');
        expect(week.hasAttribute('data-keyboard-focus')).toBe(true);
        expect(day.hasAttribute('data-keyboard-focus')).toBe(false);
        await dispatch(week.parentElement!, 'pointerdown');
        expect(week.hasAttribute('data-keyboard-focus')).toBe(false);
    });
});
