import { css } from '@crab-dev/css';
import { useState } from 'react';
import DatePicker from '../../src/index.js';
import { temporal } from '../../src/temporal.js';

export const meta = {
    title: '手输日期与可选范围',
    description: '手输交接日期，试用闰日、范围错误和 Escape，然后用日历切换日期。',
};

const scene = css`display: grid; gap: 0.5rem; inline-size: min(100%, 23rem);`;
const zone = 'Asia/Shanghai';
const start = temporal.ZonedDateTime.from('2024-02-01T00:00+08:00[Asia/Shanghai]');
const end = temporal.ZonedDateTime.from('2024-03-31T00:00+08:00[Asia/Shanghai]');

export default function EditableDate() {
    const [value, setValue] = useState<Temporal.ZonedDateTime | null>(start);
    return <section className={scene} aria-label="巡检交接">
        <DatePicker editable label="交接日期" supportingText="可选 2024-02-01 至 2024-03-31"
            timeZone={zone} range={{ start, end }} value={value} onValueChange={setValue}
            renderDisplayString={date => date?.toLocaleString('zh-CN', { year: 'numeric', month: 'long', day: 'numeric' }) ?? ''}/>
        <output aria-label="已确认日期">{value ? `${value.toPlainDate()} · ${value.timeZoneId}` : '未选择日期'}</output>
    </section>;
}
