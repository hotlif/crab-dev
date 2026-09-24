export const meta = {
    title: '表盘与 12 小时制',
    description: '先选小时，再选分钟；可切换 AM / PM，或用键盘图标切换到输入模式。',
};
import { useState } from 'react';
import TimePicker from '../../src/timePicker/timePicker.js';
import type { TimePickerValue } from '../../src/panels/timePickerPanel.js';

export default function TimeDialDemo() {
    const [value, setValue] = useState<TimePickerValue | null>({ hour: 13, minute: 45, second: 0 });
    return <TimePicker label="提醒时间" appearance="filled" value={value} onValueChange={setValue} panelProps={{ hourCycle: 12 }} />;
}
