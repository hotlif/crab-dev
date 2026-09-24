import { css } from '@crab-dev/css';
import DropdownContainer from '@crab-dev/rc-dropdown-container';
import { useId, useRef, useState } from 'react';
import TimePickerOverlay from './timePickerOverlay.js';
import { type TimePickerPanelProps } from '../panels/timePickerPanel.js';
import TimePickerInput from './timePickerInput.js';
import type { PickerFieldProps } from '../types.js';
import token from '../token.js';
import { popupFrameStyle } from '../panels/popup.style.js';

export interface TimePickerProps extends PickerFieldProps {
    value?: TimePickerPanelProps['value'];
    onValueChange?: TimePickerPanelProps['onValueChange'];
    /** 只传给时间面板。 */
    panelProps?: Omit<TimePickerPanelProps, 'value' | 'onValueChange' | 'actions' | 'onValidityChange'>;
    /** 自定义字段展示。默认 HH:mm，showSeconds 开启时为 HH:mm:ss。 */
    renderDisplayString?: (value: TimePickerPanelProps['value']) => string;
}
const popupContentStyle = css`
    padding: ${token.time.padding};
    background-color: ${token.panel['background-color']};
    border-radius: inherit;
`;
export default function TimePicker({ value, onValueChange, panelProps, renderDisplayString, ref, ...restProps }: TimePickerProps) {
    const [session, setSession] = useState(0);
    const popupId = useId();
    // Keep the field node across events to restore focus after an explicit close.
    const inputRef = useRef<HTMLInputElement>(null);
    const display = renderDisplayString ? renderDisplayString(value) : value
        ? `${String(panelProps?.hourCycle === 12 ? value.hour % 12 || 12 : value.hour).padStart(2, '0')}:${String(value.minute).padStart(2, '0')}${panelProps?.showSeconds ? `:${String(value.second).padStart(2, '0')}` : ''}${panelProps?.hourCycle === 12 ? value.hour >= 12 ? ' PM' : ' AM' : ''}`
        : '';
    return <DropdownContainer
        floatingContainerProps={{ id: popupId, role: 'dialog', 'aria-label': '选择时间', 'aria-modal': false, className: popupFrameStyle }}
        overlayClassName={popupContentStyle}
        overlay={<TimePickerOverlay key={session} {...panelProps} value={value} onValueChange={onValueChange} onClose={() => inputRef.current?.focus()} />}
    >
        <TimePickerInput {...restProps} value={display} onValueChange={onValueChange} onOpen={() => setSession(previous => previous + 1)} popupId={popupId}
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
            }} />
    </DropdownContainer>;
}
