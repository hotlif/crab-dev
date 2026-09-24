export const meta = {
    title: '时间选择与字段尺寸',
    description: '从字段下方展开时间面板，可切换键盘输入；字段支持三档密度。',
};
import { css } from '@crab-dev/css';
import semantic from '@crab-dev/rc-token-semantic';
import { useState } from 'react';
import TimePicker from '../../src/timePicker/timePicker.js';
import type { TimePickerValue } from '../../src/panels/timePickerPanel.js';

function SizedTime({ size }: { size: 'small' | 'middle' | 'large' }) {
    const [value, setValue] = useState<TimePickerValue | null>({ hour: 9, minute: 30, second: 0 });
    return <TimePicker label={`开始时间 · ${size}`} appearance="outlined" size={size} value={value} onValueChange={setValue} />;
}
export default function TimeInputDemo() {
    return <div className={css`display: flex; flex-direction: column; gap: ${semantic.space['section-gap']};`}>
        <SizedTime size="small" />
        <SizedTime size="middle" />
        <SizedTime size="large" />
    </div>;
}
