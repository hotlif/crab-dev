import { useLayoutEffect, useRef, useState } from 'react';
import Button from '@crab-dev/rc-button';
import { useDropdownContext } from '@crab-dev/rc-dropdown-container';
import TimePickerPanel, { type TimePickerPanelProps, type TimePickerValue } from '../panels/timePickerPanel.js';

interface TimePickerOverlayProps extends Omit<TimePickerPanelProps, 'actions' | 'onValidityChange'> {
    onClose: () => void;
}
export default function TimePickerOverlay({ value, onValueChange, onClose, ...restProps }: TimePickerOverlayProps) {
    const { dispatch } = useDropdownContext();
    // Keep the mounted panel node for initial focus; focus may leave this non-modal layer.
    const containerRef = useRef<HTMLDivElement>(null);
    const [draft, setDraft] = useState<TimePickerValue>(() => {
        if (value) return { ...value };
        const now = Temporal.Now.zonedDateTimeISO();
        return { hour: now.hour, minute: now.minute, second: 0 };
    });
    const [valid, setValid] = useState(true);
    useLayoutEffect(() => {
        containerRef.current?.querySelector<HTMLElement>('input, button')?.focus({ preventScroll: true });
    }, []);
    const close = () => {
        dispatch({ type: 'setOpen', payload: false });
        onClose();
    };
    const confirm = () => {
        if (!valid) return;
        onValueChange?.(draft);
        close();
    };
    return <div ref={containerRef} onBlur={event => {
        // Let Tab and outside clicks continue to their destination without stealing focus.
        if (event.relatedTarget instanceof Node && !event.currentTarget.contains(event.relatedTarget)) {
            dispatch({ type: 'setOpen', payload: false });
        } else if (!event.relatedTarget) {
            // Leaving an iframe has no relatedTarget; mode switches may restore focus in layout effects.
            queueMicrotask(() => {
                const container = containerRef.current;
                if (container && !container.contains(container.ownerDocument.activeElement)) {
                    dispatch({ type: 'setOpen', payload: false });
                }
            });
        }
    }}><TimePickerPanel {...restProps} value={draft} onValueChange={next => { if (next) setDraft(next); }} onValidityChange={setValid}
        onKeyDown={event => {
            restProps.onKeyDown?.(event);
            if (event.defaultPrevented || event.nativeEvent.isComposing || event.nativeEvent.keyCode === 229) return;
            if (event.key === 'Escape') {
                event.preventDefault();
                event.stopPropagation();
                close();
            } else if (event.key === 'Enter' && event.target instanceof HTMLInputElement) {
                event.preventDefault();
                confirm();
            }
        }}
        actions={<>
            <Button type="button" appearance="text" onClick={close}>取消</Button>
            <Button type="button" appearance="text" disabled={!valid} onClick={confirm}>确定</Button>
        </>} /></div>;
}
