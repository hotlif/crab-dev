export const meta = {
    title: '当前主题的交互状态',
    description: '观察当前主题下的选中、禁用和焦点反馈；示例继承文档配置，可直接操作。',
};

import { css } from '@crab-dev/css';
import ConfigProvider, { useConfig } from '@crab-dev/rc-config-provider';
import token, { designSystemRegistry } from '@crab-dev/rc-token-semantic';
import Segmented from '@crab-dev/rc-segmented';

const grid = css`display: grid; grid-template-columns: repeat(auto-fit, minmax(min(100%, 18rem), 1fr)); gap: ${token.space['stack-gap']};`;
const panel = css`display: grid; gap: ${token.space['stack-gap']}; padding: ${token.space['card-padding']}; border: 1px solid ${token.color.border.subtle}; border-radius: ${token.shape.card}; color: ${token.color.text.primary}; background: ${token.color.background.surface}; min-width: 0;`;

export default function DesignsDemo() {
    const { designSystem: design } = useConfig();
    return (
        <div className={grid}>
            {(['light', 'dark'] as const).map(mode => (
                <ConfigProvider key={mode} designSystem={design} colorMode={mode} className={panel} role="region" aria-label={`${designSystemRegistry[design].fullName} ${mode === 'light' ? '浅色' : '深色'}`}>
                    <strong>{designSystemRegistry[design].fullName} · {mode === 'light' ? '浅色' : '深色'}</strong>
                    <Segmented aria-label={`${designSystemRegistry[design].fullName} ${mode === 'light' ? '浅色' : '深色'} 时间范围`} block options={[
                        { value: 'day', label: '日' },
                        { value: 'week', label: '周' },
                        { value: 'month', label: '月' },
                        { value: 'year', label: '年', disabled: true },
                    ]} />
                    <Segmented aria-label={`${designSystemRegistry[design].fullName} ${mode === 'light' ? '浅色' : '深色'} 禁用时间范围`} block disabled options={['日', '周', '月']} />
                </ConfigProvider>
            ))}
        </div>
    );
}
