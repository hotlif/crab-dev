import type { DropdownOpenChangeDetails } from '@crab-dev/rc-dropdown-container';
import { useControllableValue, useControllableOpen } from '@crab-dev/rc-hooks';
import { usePickerLocale } from '../locale.js';
import { css } from '@crab-dev/css';
import DropdownContainer from '@crab-dev/rc-dropdown-container';
import { useId, useRef, useState } from 'react';
import TimePickerOverlay from './timePickerOverlay.js';
import { type TimePickerPanelProps } from '../panels/timePickerPanel.js';
import TimePickerInput from './timePickerInput.js';
import type { PickerFieldProps, PickerValueProps, PickerOpenProps, PickerValueChangeDetails } from '../types.js';
import token from '../token.js';
import { popupFrameStyle } from '../panels/popup.style.js';

interface TimePickerBaseProps extends PickerFieldProps {
    locale?: string;
    /** 只传给时间面板。 */
    panelProps?: Omit<TimePickerPanelProps, 'value' | 'onValueChange' | 'actions' | 'onValidityChange' | 'locale'>;
    /** 自定义字段展示，不改变值或清除状态；空值提示使用 placeholder。默认 HH:mm，showSeconds 开启时为 HH:mm:ss。 */
    renderDisplayString?: (value: TimePickerPanelProps['value']) => string;
}
export type TimePickerProps = TimePickerBaseProps & PickerValueProps<NonNullable<TimePickerPanelProps['value']>> & PickerOpenProps;

const popupContentStyle = css`
    padding: ${token.time.padding};
    background-color: ${token.panel['background-color']};
    border-radius: inherit;
`;
export default function TimePicker({ value: valueProp, defaultValue, onValueChange, open, defaultOpen, onOpenChange, locale: localeProp, panelProps, renderDisplayString, ref, ...restProps }: TimePickerProps) {
    const { locale, messages } = usePickerLocale(localeProp);
    const [value, setValue] = useControllableValue<NonNullable<TimePickerPanelProps['value']> | null, [PickerValueChangeDetails]>({ value: valueProp, defaultValue: defaultValue ?? null, onValueChange });
    const [isOpen, setOpen] = useControllableOpen<DropdownOpenChangeDetails>({ open, defaultOpen, onOpenChange });
    const changeValue = (next: NonNullable<TimePickerPanelProps['value']> | null, event?: PickerValueChangeDetails['event']) => setValue(next, { reason: next === null ? 'clear' : 'confirm', ...(event ? { event } : {}) });
    const [session, setSession] = useState(0);
    const popupId = useId();
    // Keep the field node across events to restore focus after an explicit close.
    const inputRef = useRef<HTMLInputElement>(null);
    const display = renderDisplayString ? renderDisplayString(value) : value
        ? `${String(panelProps?.hourCycle === 12 ? value.hour % 12 || 12 : value.hour).padStart(2, '0')}:${String(value.minute).padStart(2, '0')}${panelProps?.showSeconds ? `:${String(value.second).padStart(2, '0')}` : ''}${panelProps?.hourCycle === 12 ? value.hour >= 12 ? ' ' + messages.pm : ' ' + messages.am : ''}`
        : '';
    return <DropdownContainer closeOnFocusOut open={isOpen} onOpenChange={setOpen}
        floatingContainerProps={{ id: popupId, role: 'dialog', 'aria-label': messages.chooseTime, 'aria-modal': false, className: popupFrameStyle }}
        overlayClassName={popupContentStyle}
        overlay={<TimePickerOverlay locale={locale} key={session} {...panelProps} value={value} onValueChange={changeValue} onClose={() => inputRef.current?.focus()} />}
    >
        <TimePickerInput locale={locale} {...restProps} value={display} hasValue={value != null} onValueChange={changeValue} onOpen={() => setSession(previous => previous + 1)} popupId={popupId}
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
