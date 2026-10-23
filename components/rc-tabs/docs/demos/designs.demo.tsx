export const meta = {
    title: '三套风格与面板切换',
    description: 'Material 使用主标签页指示条，macOS 和 shadcn 使用容器内的选中块；键盘操作一致。',
};

import { css } from '@crab-dev/css';
import token from '@crab-dev/rc-token-semantic';
import Tabs from '../../src/index.js';

const grid = css`display: grid; grid-template-columns: repeat(auto-fit, minmax(min(100%, 18rem), 1fr)); gap: ${token.space['stack-gap']};`;
const panel = css`display: grid; gap: ${token.space['stack-gap']}; padding: ${token.space['card-padding']}; border: 1px solid ${token.color.border.subtle}; border-radius: ${token.shape.card}; color: ${token.color.text.primary}; background: ${token.color.background.surface}; min-width: 0;`;

export default function DesignsDemo() {
    return (
        <div className={grid}>
            {(['macos', 'material', 'shadcn'] as const).flatMap(design => (['light', 'dark'] as const).map(mode => (
                <section key={`${design}-${mode}`} className={panel} data-crab-design={design} data-theme={mode} aria-label={`${design} ${mode}`}>
                    <strong>{design} · {mode}</strong>
                    <Tabs items={[
                        { key: 'overview', label: '概览', children: <p>当前项目的概览与最近活动。</p> },
                        { key: 'activity', label: '活动', children: <p>使用左右方向键可切换内容面板。</p> },
                        { key: 'archive', label: '归档', disabled: true },
                    ]} />
                </section>
            )))}
        </div>
    );
}
