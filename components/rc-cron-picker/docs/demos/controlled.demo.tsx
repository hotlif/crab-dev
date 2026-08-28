export const meta = {
    title: "受控与常用预设",
    description: "受控模式配合快捷预设:外部一键切换常用调度周期,面板与输入框同步跟随",
};

import { useState } from 'react';
import CronPicker from '../../src/index.js';

const PRESETS: Array<{ label: string; value: string }> = [
    { label: '每小时', value: '0 * * * *' },
    { label: '每天零点', value: '0 0 * * *' },
    { label: '工作日 9 点', value: '0 9 * * 1-5' },
    { label: '每月 1 日', value: '0 0 1 * *' },
];

const ControlledDemo = () => {
    const [value, setValue] = useState('0 0 * * *');

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12, maxWidth: 360 }}>
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                {PRESETS.map((preset) => (
                    <button
                        key={preset.value}
                        type="button"
                        style={{ padding: '2px 10px', cursor: 'pointer' }}
                        onClick={() => setValue(preset.value)}
                    >
                        {preset.label}
                    </button>
                ))}
            </div>
            <CronPicker value={value} onChange={setValue} />
        </div>
    );
};

export default ControlledDemo;
