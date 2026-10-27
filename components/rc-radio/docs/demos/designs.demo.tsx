import { useId } from 'react';
import { css } from '@crab-dev/css';
import ConfigProvider from '@crab-dev/rc-config-provider';
import token from '@crab-dev/rc-token-semantic';
import Radio from '../../src/radio.js';
import RadioGroup from '../../src/radio-group.js';

export const meta = { title: '三套设计与状态', description: 'Apple 使用填充圆盘和对比圆点，MD3 与 shadcn 分别使用不同尺寸的圆环、圆点与焦点反馈。' };
const panel = css`
    display: grid;
    gap: ${token.space['component-gap']};
    padding: ${token.space['section-gap']};
    color: ${token.color.text.primary};
    background: ${token.color.surface.content};
    border: 1px solid ${token.color.border.subtle};
    border-radius: ${token.radius.md};
`;
const stack = css`display: grid; gap: ${token.space['stack-gap']};`;
const options = css`flex-direction: column; align-items: flex-start;`;
export default function DesignsDemo() {
    const errorId = useId();
    return <div className={stack}>
        {(['apple', 'md3', 'shadcn'] as const).map(design => <ConfigProvider key={design} designSystem={design}>
            <section className={panel} aria-label={`${design} 单选框`}>
                <strong>{design === 'md3' ? 'MD3' : design === 'apple' ? 'Apple' : 'shadcn'}</strong>
                <RadioGroup defaultValue="daily" aria-label="通知频率" className={options}>
                    <Radio value="daily">每天</Radio>
                    <Radio value="weekly">每周</Radio>
                    <Radio value="unavailable" disabled>暂不可用</Radio>
                </RadioGroup>
                <Radio checked disabled>已选中且不可用</Radio>
                <Radio aria-invalid="true" aria-describedby={`${errorId}-${design}`}>选择同步方式</Radio>
                <small id={`${errorId}-${design}`}>请选择一种同步方式。</small>
            </section>
        </ConfigProvider>)}
    </div>;
}
