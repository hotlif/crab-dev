export const meta = {
    title: '三套风格与面板切换',
    description: '比较三套设计体系在浅色和深色下的标签页、选中反馈与内容面板；键盘操作一致。',
};

import { css } from '@crab-dev/css';
import ConfigProvider from '@crab-dev/rc-config-provider';
import token, { designSystemRegistry } from '@crab-dev/rc-token-semantic';
import Tabs from '../../src/index.js';

const grid = css`display: grid; grid-template-columns: repeat(auto-fit, minmax(min(100%, 18rem), 1fr)); gap: ${token.space['stack-gap']};`;
const panel = css`display: grid; gap: ${token.space['stack-gap']}; padding: ${token.space['card-padding']}; border: 1px solid ${token.color.border.subtle}; border-radius: ${token.shape.card}; color: ${token.color.text.primary}; background: ${token.color.background.surface}; min-width: 0;`;

export default function DesignsDemo() {
    return (
        <div className={grid}>
            {(['md3', 'apple', 'shadcn'] as const).flatMap(design => (['light', 'dark'] as const).map(mode => (
                <ConfigProvider key={`${design}-${mode}`} designSystem={design} colorMode={mode} className={panel} role="region" aria-label={`${designSystemRegistry[design].fullName} ${mode === 'light' ? '浅色' : '深色'}`}>
                    <strong>{designSystemRegistry[design].fullName} · {mode === 'light' ? '浅色' : '深色'}</strong>
                    <Tabs items={[
                        { key: 'overview', label: '概览', children: <p>当前项目的概览与最近活动。</p> },
                        { key: 'activity', label: '活动', children: <p>使用左右方向键可切换内容面板。</p> },
                        { key: 'archive', label: '归档', disabled: true },
                    ]} />
                </ConfigProvider>
            )))}
        </div>
    );
}
