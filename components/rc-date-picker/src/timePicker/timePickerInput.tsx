import type { PickerFieldProps } from '../types.js';
import LineEdit from '@crab-dev/rc-line-edit';
import { useDropdownContext } from '@crab-dev/rc-dropdown-container';
import { useRef } from 'react';
import PickerInputActions, { usePickerFieldHover } from '../pickerInputActions.js';
import type { TimePickerPanelProps } from '../panels/timePickerPanel.js';

export interface TimePickerInputProps extends PickerFieldProps {
    onValueChange?: TimePickerPanelProps['onValueChange'];
    value: string;
    onOpen?: () => void;
    popupId?: string;
}
export default function TimePickerInput({ value, onValueChange, onOpen, popupId,
    ref, disabled, onClick, onKeyDown, ...restProps }: TimePickerInputProps) {
    const { state, dispatch, refs } = useDropdownContext<HTMLDivElement>();
    // The field node is needed by open/clear events without scheduling a render.
    const inputRef = useRef<HTMLInputElement>(null);
    const { hovered, containerRef } = usePickerFieldHover(refs.setReference);
    const openPanel = () => {
        if (disabled || state.open) return;
        onOpen?.();
        dispatch({ type: 'setOpen', payload: true });
    };
    return <LineEdit {...restProps} disabled={disabled} containerRef={containerRef}
        ref={node => {
            inputRef.current = node;
            const cleanup = typeof ref === 'function' ? ref(node) : undefined;
            if (ref && typeof ref !== 'function') ref.current = node;
            return () => {
                inputRef.current = null;
                if (cleanup) cleanup();
                else if (typeof ref === 'function') ref(null);
                else if (ref) ref.current = null;
            };
        }}
        onClick={event => {
            onClick?.(event);
            if (!event.defaultPrevented) openPanel();
        }}
        onKeyDown={event => {
            onKeyDown?.(event);
            if (event.defaultPrevented || disabled) return;
            if (event.key === 'Escape' && state.open) {
                event.preventDefault();
                event.stopPropagation();
                dispatch({ type: 'setOpen', payload: false });
                return;
            }
            if (['Enter', ' ', 'ArrowDown'].includes(event.key)) {
                event.preventDefault();
                openPanel();
            }
        }}
        value={value} readOnly aria-haspopup="dialog" aria-expanded={state.open} aria-controls={popupId}
        suffix={<PickerInputActions kind="time" hasValue={Boolean(value)} hovered={hovered} disabled={disabled} open={state.open}
            onOpen={() => {
                if (disabled) return;
                inputRef.current?.focus();
                openPanel();
            }}
            onClear={() => {
                inputRef.current?.focus();
                dispatch({ type: 'setOpen', payload: false });
                onValueChange?.(null);
            }} />}
    />;
}
