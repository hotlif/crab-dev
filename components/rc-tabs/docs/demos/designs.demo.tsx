export const meta = {
    title: '当前主题的交互状态',
    description: '观察当前主题下的选中、禁用和焦点反馈；示例继承文档配置，可直接操作。',
};

import { css } from '@crab-dev/css';
import ConfigProvider, { useConfig } from '@crab-dev/rc-config-provider';
import token, { designSystemRegistry } from '@crab-dev/rc-token-semantic';
import Tabs from '@crab-dev/rc-tabs';

const grid = css`display: grid; grid-template-columns: repeat(auto-fit, minmax(min(100%, 18rem), 1fr)); gap: ${token.space['stack-gap']};`;
const panel = css`display: grid; gap: ${token.space['stack-gap']}; padding: ${token.space['card-padding']}; border: 1px solid ${token.color.border.subtle}; border-radius: ${token.shape.card}; color: ${token.color.text.primary}; background: ${token.color.background.surface}; min-width: 0;`;

export default function DesignsDemo() {
    const { designSystem: design } = useConfig();
    return (
        <div className={grid}>
            {(['light', 'dark'] as const).map(mode => (
                <ConfigProvider key={mode} designSystem={design} colorMode={mode} className={panel} role="region" aria-label={`${designSystemRegistry[design].fullName} ${mode === 'light' ? '浅色' : '深色'}`}>
                    <strong>{designSystemRegistry[design].fullName} · {mode === 'light' ? '浅色' : '深色'}</strong>
                    <Tabs items={[
                        { key: 'overview', label: '概览', children: <p>当前项目的概览与最近活动。</p> },
                        { key: 'activity', label: '活动', children: <p>使用左右方向键可切换内容面板。</p> },
                        { key: 'archive', label: '归档', disabled: true },
                    ]} />
                </ConfigProvider>
            ))}
        </div>
    );
}
