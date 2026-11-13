import { useId } from 'react';
import { css } from '@crab-dev/css';
import ConfigProvider, { useConfig } from '@crab-dev/rc-config-provider';
import token, { designSystemRegistry } from '@crab-dev/rc-token-semantic';
import Radio from '@crab-dev/rc-radio';
import RadioGroup from '@crab-dev/rc-radio';

export const meta = { title: '当前主题的交互状态', description: '观察当前主题下的选中、禁用和焦点反馈；示例继承文档配置，可直接操作。' };
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
    const { designSystem: design } = useConfig();
    const errorId = useId();
    return <div className={stack}>
        <ConfigProvider designSystem={design}>
            <section className={panel} aria-label={`${design} 单选框`}>
                <strong>{designSystemRegistry[design].label}</strong>
                <RadioGroup defaultValue="daily" aria-label="通知频率" className={options}>
                    <Radio value="daily">每天</Radio>
                    <Radio value="weekly">每周</Radio>
                    <Radio value="unavailable" disabled>暂不可用</Radio>
                </RadioGroup>
                <Radio checked disabled>已选中且不可用</Radio>
                <Radio aria-invalid="true" aria-describedby={`${errorId}-${design}`}>选择同步方式</Radio>
                <small id={`${errorId}-${design}`}>请选择一种同步方式。</small>
            </section>
        </ConfigProvider>
    </div>;
}
