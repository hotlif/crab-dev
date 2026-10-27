export const meta = {
    title: "受控与常用预设",
    description: "受控模式配合快捷预设:外部一键切换常用调度周期,面板与输入框同步跟随",
};

import { useState } from 'react';
import { css } from '@crab-dev/css';
import Button from '@crab-dev/rc-button';
import token from '@crab-dev/rc-token-semantic';
import CronPicker from '../../src/index.js';

const rootStyle = css`
    display: flex;
    flex-direction: column;
    gap: ${token.space['stack-gap']};
    min-inline-size: 0;
`;

const presetsStyle = css`
    display: flex;
    flex-wrap: wrap;
    gap: ${token.space['inline-gap']};
`;

const PRESETS: Array<{ label: string; value: string }> = [
    { label: '每小时', value: '0 * * * *' },
    { label: '每天零点', value: '0 0 * * *' },
    { label: '工作日 9 点', value: '0 9 * * 1-5' },
    { label: '每月 1 日', value: '0 0 1 * *' },
];

const ControlledDemo = () => {
    const [value, setValue] = useState('0 0 * * *');

    return (
        <div className={rootStyle}>
            <div className={presetsStyle}>
                {PRESETS.map((preset) => (
                    <Button
                        key={preset.value}
                        type="button"
                        onClick={() => setValue(preset.value)}
                    >
                        {preset.label}
                    </Button>
                ))}
            </div>
            <CronPicker value={value} onValueChange={setValue} />
        </div>
    );
};

export default ControlledDemo;
