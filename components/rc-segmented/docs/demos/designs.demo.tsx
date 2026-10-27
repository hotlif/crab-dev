export const meta = {
    title: '三套风格与完整状态',
    description: '比较浅色和深色下的分段轮廓、选中反馈、禁用项与键盘焦点。',
};

import { css } from '@crab-dev/css';
import ConfigProvider from '@crab-dev/rc-config-provider';
import token, { designSystemRegistry } from '@crab-dev/rc-token-semantic';
import Segmented from '../../src/index.js';

const grid = css`display: grid; grid-template-columns: repeat(auto-fit, minmax(min(100%, 18rem), 1fr)); gap: ${token.space['stack-gap']};`;
const panel = css`display: grid; gap: ${token.space['stack-gap']}; padding: ${token.space['card-padding']}; border: 1px solid ${token.color.border.subtle}; border-radius: ${token.shape.card}; color: ${token.color.text.primary}; background: ${token.color.background.surface}; min-width: 0;`;

export default function DesignsDemo() {
    return (
        <div className={grid}>
            {(['md3', 'apple', 'shadcn'] as const).flatMap(design => (['light', 'dark'] as const).map(mode => (
                <ConfigProvider key={`${design}-${mode}`} designSystem={design} colorMode={mode} className={panel} role="region" aria-label={`${designSystemRegistry[design].fullName} ${mode === 'light' ? '浅色' : '深色'}`}>
                    <strong>{designSystemRegistry[design].fullName} · {mode === 'light' ? '浅色' : '深色'}</strong>
                    <Segmented aria-label={`${designSystemRegistry[design].fullName} ${mode === 'light' ? '浅色' : '深色'} 时间范围`} block options={[
                        { value: 'day', label: '日' },
                        { value: 'week', label: '周' },
                        { value: 'month', label: '月' },
                        { value: 'year', label: '年', disabled: true },
                    ]} />
                    <Segmented aria-label={`${designSystemRegistry[design].fullName} ${mode === 'light' ? '浅色' : '深色'} 禁用时间范围`} block disabled options={['日', '周', '月']} />
                </ConfigProvider>
            )))}
        </div>
    );
}
