export const meta = {
    title: '三套风格与完整状态',
    description: '比较浅色和深色下的分段轮廓、选中反馈、禁用项与键盘焦点。',
};

import { css } from '@crab-dev/css';
import token from '@crab-dev/rc-token-semantic';
import Segmented from '../../src/index.js';

const grid = css`display: grid; grid-template-columns: repeat(auto-fit, minmax(min(100%, 16rem), 1fr)); gap: ${token.space['stack-gap']};`;
const panel = css`display: grid; gap: ${token.space['stack-gap']}; padding: ${token.space['card-padding']}; border: 1px solid ${token.color.border.subtle}; border-radius: ${token.shape.card}; color: ${token.color.text.primary}; background: ${token.color.background.surface}; min-width: 0;`;

export default function DesignsDemo() {
    return (
        <div className={grid}>
            {(['macos', 'material', 'shadcn'] as const).flatMap(design => (['light', 'dark'] as const).map(mode => (
                <section key={`${design}-${mode}`} className={panel} data-crab-design={design} data-theme={mode} aria-label={`${design} ${mode}`}>
                    <strong>{design} · {mode}</strong>
                    <Segmented aria-label={`${design} ${mode} 时间范围`} block options={[
                        { value: 'day', label: '日' },
                        { value: 'week', label: '周' },
                        { value: 'month', label: '月' },
                        { value: 'year', label: '年', disabled: true },
                    ]} />
                    <Segmented aria-label={`${design} ${mode} 禁用时间范围`} block disabled options={['日', '周', '月']} />
                </section>
            )))}
        </div>
    );
}
