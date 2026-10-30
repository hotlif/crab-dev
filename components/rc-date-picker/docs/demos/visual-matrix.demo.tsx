import { css } from '@crab-dev/css';
import DatePicker, { DateTimePicker, TimePicker, toPickerDateTime } from '@crab-dev/rc-date-picker';
import { useConfig } from '@crab-dev/rc-config-provider';
import token from '@crab-dev/rc-token-semantic';
import { useId, useState } from 'react';

export const meta = { title: '日期与时间状态矩阵', description: '固定业务日期对照日期、日期时间、表盘与时间输入，保留真实选择草稿和确认行为。' };
const frame = css`display: grid; gap: ${token.space['group-gap']}; padding: ${token.space['group-gap']}; background: ${token.color.background.surface}; color: ${token.color.text.primary}; max-width: calc(${token.size[40]} * 13); min-width: 0;`;
export default function VisualMatrixDemo() {
    const { locale } = useConfig();
    const [state, setState] = useState('default');
    const [date, setDate] = useState<ReturnType<typeof toPickerDateTime> | null>(() => toPickerDateTime('2026-06-15T09:30:00+08:00[Asia/Shanghai]'));
    const [dateTime, setDateTime] = useState(date);
    const [time, setTime] = useState<{ hour: number; minute: number; second: number } | null>({ hour: 9, minute: 30, second: 15 });
    const [timePreset, setTimePreset] = useState('24-dial');
    const id = useId();
    const timeId = useId();
    const english = locale === 'en-US';
    const common = { disabled: state === 'disabled', status: state === 'error' ? 'error' as const : state === 'warning' ? 'warning' as const : undefined, errorText: state === 'error' ? (english ? 'Choose an available date or time.' : '请选择可用日期或时间。') : undefined, supportingText: english ? 'Confirm to save the selection.' : '确认后保存选择，取消保留原值。' };
    return <section className={frame} aria-label="DatePicker visual matrix" data-visual-scene data-state={state}>
        <div><label htmlFor={id}>验收状态</label>{' '}<select id={id} value={state} onChange={event => setState(event.currentTarget.value)}>{['default', 'disabled', 'error', 'warning'].map(value => <option key={value}>{value}</option>)}</select></div>
        <DatePicker {...common} label={english ? 'Schedule date' : '计划日期'} aria-label="计划日期" timeZone="Asia/Shanghai" value={date} onValueChange={setDate} range={{ start: toPickerDateTime('2026-06-05T00:00:00+08:00[Asia/Shanghai]'), end: toPickerDateTime('2026-07-25T23:59:00+08:00[Asia/Shanghai]') }} />
        <DateTimePicker {...common} label={english ? 'Schedule date and time' : '计划日期时间'} aria-label="计划日期时间" timeZone="Asia/Shanghai" value={dateTime} onValueChange={setDateTime} panelProps={{ timePanelProps: { hourCycle: timePreset.startsWith('12') ? 12 : 24, showSeconds: !timePreset.endsWith('input') } }} />
        <TimePicker {...common} label={english ? 'Time dial' : '表盘时间'} aria-label="表盘时间" value={time} onValueChange={setTime} panelProps={{ hourCycle: timePreset.startsWith('12') ? 12 : 24, defaultMode: timePreset.endsWith('dial') ? 'dial' : 'input', showSeconds: timePreset.endsWith('seconds') }} />
        <TimePicker {...common} label={english ? 'Time with seconds' : '秒精度时间'} aria-label="秒精度时间" value={time} onValueChange={setTime} panelProps={{ defaultMode: 'input', showSeconds: true, hourCycle: 12 }} />
        <div><label htmlFor={timeId}>时间配置</label>{' '}<select id={timeId} value={timePreset} onChange={event => setTimePreset(event.currentTarget.value)}>{['24-dial', '12-dial', '24-input', '12-input', '24-seconds', '12-seconds'].map(value => <option key={value}>{value}</option>)}</select></div>
        <output aria-live="polite">{date?.toPlainDate().toString() ?? '未选择日期'} · {time ? `${time.hour}:${time.minute}:${time.second}` : '未选择时间'}</output>
    </section>;
}
