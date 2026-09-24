import { cx } from '@crab-dev/css';
import Button from '@crab-dev/rc-button';
import LineEdit from '@crab-dev/rc-line-edit';
import { useEffect, useEffectEvent, useId, useLayoutEffect, useRef, useState, type HTMLAttributes, type ReactNode } from 'react';
import TimePickerDial from './timePickerDial.js';
import {
    timePanelStyle, timeTitleStyle, timeFieldsStyle, timePairStyle, timeFieldStyle,
    timeSupportStyle, timeErrorStyle, timeSeparatorStyle, timePeriodStyle,
    timeActionsStyle, timeModeButtonStyle,
} from './timePicker.style.js';

export interface TimePickerValue {
    hour: number;
    minute: number;
    second: number;
}
export type TimePickerMode = 'input' | 'dial';
export interface TimePickerPanelProps extends Omit<HTMLAttributes<HTMLDivElement>, 'defaultValue'> {
    value?: TimePickerValue | null;
    onValueChange?: (value: TimePickerValue | null) => void;
    /** 小时制；值始终使用 0–23 小时，默认 24。 */
    hourCycle?: 12 | 24;
    /** 初始选择模式，默认表盘；空间不足或启用秒输入时使用输入模式。 */
    defaultMode?: TimePickerMode;
    /** 显示秒输入；秒为扩展能力，仅使用输入模式。默认 false，隐藏时保留已有秒值。 */
    showSeconds?: boolean;
    /** 输入有效性变化，组合面板可据此阻止确认。 */
    onValidityChange?: (valid: boolean) => void;
    /** 操作区内容，与模式切换按钮放在同一行。 */
    actions?: ReactNode;
}
const pad = (value: number) => String(value).padStart(2, '0');

function TimeField({ value, min, max, label, onChange, onValidityChange }: {
    value: number; min: number; max: number; label: string;
    onChange: (next: number) => void; onValidityChange: (valid: boolean) => void;
}) {
    const id = useId();
    const [editing, setEditing] = useState<{ text: string; value: number } | null>(null);
    const text = editing?.value === value ? editing.text : pad(value);
    const valid = /^\d{1,2}$/.test(text) && Number(text) >= min && Number(text) <= max;
    const notifyValidity = useEffectEvent((next: boolean) => onValidityChange(next));
    useEffect(() => { notifyValidity(valid); }, [valid]);
    const update = (text: string) => {
        const valid = /^\d{1,2}$/.test(text) && Number(text) >= min && Number(text) <= max;
        setEditing({ text, value: valid ? Number(text) : value });
        onValidityChange(valid);
        if (valid) onChange(Number(text));
    };
    return <div>
        <LineEdit
            id={id}
            data-time-field
            bordered={false}
            className={timeFieldStyle}
            value={text}
            inputMode="numeric"
            autoComplete="off"
            maxLength={2}
            aria-invalid={!valid || undefined}
            aria-describedby={!valid ? `${id}-error` : undefined}
            onFocus={event => event.currentTarget.select()}
            onChange={event => update(event.currentTarget.value)}
            onBlur={() => { if (valid) setEditing(null); }}
            onKeyDown={event => {
                if (event.key !== 'ArrowUp' && event.key !== 'ArrowDown') return;
                event.preventDefault();
                update(String(Math.min(max, Math.max(min, value + (event.key === 'ArrowUp' ? 1 : -1)))));
            }}
        />
        <label htmlFor={id} className={timeSupportStyle}>{label}</label>
        {!valid && <span id={`${id}-error`} className={timeErrorStyle} role="status">{min}–{max}</span>}
    </div>;
}

export default function TimePickerPanel({
    className, value, onValueChange, hourCycle = 24, defaultMode = 'dial', showSeconds = false,
    onValidityChange, actions, ...restProps
}: TimePickerPanelProps) {
    const [initialValue] = useState(() => {
        const now = Temporal.Now.zonedDateTimeISO();
        return { hour: now.hour, minute: now.minute, second: 0 };
    });
    const resolved = value ?? initialValue;
    const [mode, setMode] = useState(defaultMode);
    const [activePart, setActivePart] = useState<'hour' | 'minute'>('hour');
    const [invalidParts, setInvalidParts] = useState<Partial<Record<keyof TimePickerValue, { value: number; hourCycle: 12 | 24 }>>>({});
    // 跨事件保存字段节点：表盘选择小时后把焦点移到分钟，避免焦点随表盘重绘丢失。
    const minuteRef = useRef<HTMLButtonElement>(null);
    // 模式切换会替换节点；只在用户正在操作面板时保存并恢复焦点，不抢占外部焦点。
    const panelRef = useRef<HTMLDivElement>(null);
    const pendingFocus = useRef<'hour' | 'minute' | null>(null);
    const [compact, setCompact] = useState(false);
    useEffect(() => {
        const media = window.matchMedia?.('(max-width: 359px), (max-height: 559px)');
        if (!media) return;
        const update = () => {
            if (media.matches) {
                const focused = document.activeElement;
                if (focused instanceof HTMLElement && panelRef.current?.contains(focused) && (focused.closest('[data-mode="dial"], svg') || focused.hasAttribute('data-mode-toggle'))) {
                    pendingFocus.current = focused.closest('[data-time-part]')?.getAttribute('data-time-part') === 'minute' ? 'minute' : 'hour';
                }
                // 保留回退后的输入模式，扩大窗口时不能卸载尚未完成的输入。
                setMode('input');
            }
            setCompact(media.matches);
        };
        update();
        media.addEventListener('change', update);
        return () => media.removeEventListener('change', update);
    }, []);
    const actualMode = showSeconds || compact ? 'input' : mode;
    useLayoutEffect(() => {
        if (!pendingFocus.current) return;
        panelRef.current?.querySelector<HTMLElement>(`[data-time-part="${pendingFocus.current}"] input, [data-time-part="${pendingFocus.current}"] button`)?.focus();
        pendingFocus.current = null;
    }, [actualMode, compact]);
    const hour = hourCycle === 12 ? resolved.hour % 12 || 12 : resolved.hour;
    const valid = !(['hour', 'minute', ...(showSeconds ? ['second'] as const : [])] as const).some(part => {
        const invalid = invalidParts[part];
        return invalid && invalid.value === resolved[part] && (part !== 'hour' || invalid.hourCycle === hourCycle);
    });
    const notifyValidity = useEffectEvent((next: boolean) => onValidityChange?.(next));
    useEffect(() => { notifyValidity(valid); }, [valid]);
    const update = (part: keyof TimePickerValue, next: number) => {
        onValueChange?.({ ...resolved, [part]: part === 'hour' && hourCycle === 12 ? next % 12 + (resolved.hour >= 12 ? 12 : 0) : next });
    };
    const updateValidity = (part: keyof TimePickerValue, valid: boolean) => {
        setInvalidParts(previous => ({ ...previous, [part]: valid ? undefined : { value: resolved[part], hourCycle } }));
    };
    const changeMode = () => {
        pendingFocus.current = activePart;
        setMode(actualMode === 'input' ? 'dial' : 'input');
    };
    const period = (pm: boolean) => onValueChange?.({ ...resolved, hour: resolved.hour % 12 + (pm ? 12 : 0) });
    return <div ref={panelRef} role="group" aria-label="选择时间" className={cx(timePanelStyle, className)} {...restProps}>
        <h2 className={timeTitleStyle}>{actualMode === 'input' ? '输入时间' : '选择时间'}</h2>
        <div className={timeFieldsStyle} data-mode={actualMode} data-hour-cycle={hourCycle}>
            <div className={timePairStyle}>
                <div data-time-part="hour" onFocus={() => { if (actualMode === 'input') setActivePart('hour'); }}>{actualMode === 'input' ? <TimeField key={hourCycle} value={hour} min={hourCycle === 12 ? 1 : 0} max={hourCycle === 12 ? 12 : 23} label="小时" onChange={next => update('hour', next)} onValidityChange={valid => updateValidity('hour', valid)} />
                    : <Button type="button" appearance="text" data-time-field className={timeFieldStyle} aria-label={`选择小时，当前 ${pad(hour)}`} aria-pressed={activePart === 'hour'} onClick={() => setActivePart('hour')}>{pad(hour)}</Button>}
                </div>
                <span aria-hidden="true" className={timeSeparatorStyle}>:</span>
                <div data-time-part="minute" onFocus={() => { if (actualMode === 'input') setActivePart('minute'); }}>{actualMode === 'input' ? <TimeField value={resolved.minute} min={0} max={59} label="分钟" onChange={next => update('minute', next)} onValidityChange={valid => updateValidity('minute', valid)} />
                    : <Button ref={minuteRef} type="button" appearance="text" data-time-field className={timeFieldStyle} aria-label={`选择分钟，当前 ${pad(resolved.minute)}`} aria-pressed={activePart === 'minute'} onClick={() => setActivePart('minute')}>{pad(resolved.minute)}</Button>}
                </div>
            </div>
            {showSeconds && <div className={timePairStyle}>
                <span aria-hidden="true" className={timeSeparatorStyle}>:</span>
                <TimeField value={resolved.second} min={0} max={59} label="秒" onChange={next => update('second', next)} onValidityChange={valid => updateValidity('second', valid)} />
            </div>}
            {hourCycle === 12 && <div role="radiogroup" aria-label="上午或下午" data-period className={timePeriodStyle}>
                {[false, true].map(pm => <Button key={String(pm)} type="button" appearance="text" role="radio" aria-label={pm ? '下午' : '上午'} aria-checked={(resolved.hour >= 12) === pm} tabIndex={(resolved.hour >= 12) === pm ? 0 : -1}
                    onClick={() => period(pm)} onKeyDown={event => {
                        if (!['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(event.key)) return;
                        event.preventDefault();
                        period(!pm);
                        const sibling = pm ? event.currentTarget.previousElementSibling : event.currentTarget.nextElementSibling;
                        if (sibling instanceof HTMLElement) sibling.focus();
                    }}>{pm ? 'PM' : 'AM'}</Button>)}
            </div>}
        </div>
        {actualMode === 'dial' && <TimePickerDial key={activePart} part={activePart} hourCycle={hourCycle} value={resolved[activePart]} onChange={next => onValueChange?.({ ...resolved, [activePart]: next })} onComplete={() => {
            if (activePart === 'hour') { setActivePart('minute'); minuteRef.current?.focus(); }
        }} />}
        {((!showSeconds && !compact) || actions) && <div className={timeActionsStyle}>
            {!showSeconds && !compact && <Button type="button" appearance="text" shape="circle" data-mode-toggle className={timeModeButtonStyle} disabled={!valid} aria-label={actualMode === 'input' ? '切换到表盘选择' : '切换到键盘输入'} onClick={changeMode}
                icon={<svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="2">
                    {actualMode === 'input' ? <><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" /></> : <><rect x="2" y="5" width="20" height="14" rx="2" /><path d="M5 9h2m2 0h2m2 0h2m2 0h2M5 12h2m2 0h2m2 0h2m2 0h2M7 15h10" /></>}
                </svg>} />}
            {actions}
        </div>}
    </div>;
}
