export const meta = {
    title: '三套风格的操作层级',
    description: '比较主操作、普通操作、低强调操作和禁用状态；圆角、表面与阴影由当前风格决定。',
};

import { css } from '@crab-dev/css';
import ConfigProvider from '@crab-dev/rc-config-provider';
import token, { designSystemRegistry } from '@crab-dev/rc-token-semantic';
import Button from '../../src/index.js';

const grid = css`display: grid; grid-template-columns: repeat(auto-fit, minmax(min(100%, 18rem), 1fr)); gap: ${token.space['stack-gap']};`;
const panel = css`display: grid; gap: ${token.space['stack-gap']}; padding: ${token.space['card-padding']}; border: 1px solid ${token.color.border.subtle}; border-radius: ${token.shape.card}; color: ${token.color.text.primary}; background: ${token.color.background.surface}; min-width: 0;`;
const actions = css`display: flex; flex-wrap: wrap; align-items: center; gap: ${token.space['component-gap']};`;

export default function DesignsDemo() {
    return (
        <div className={grid}>
            {(['md3', 'apple', 'shadcn'] as const).flatMap(design => (['light', 'dark'] as const).map(mode => (
                <ConfigProvider key={`${design}-${mode}`} designSystem={design} colorMode={mode} className={panel} role="region" aria-label={`${designSystemRegistry[design].fullName} ${mode === 'light' ? '浅色' : '深色'}`}>
                    <strong>{designSystemRegistry[design].fullName} · {mode === 'light' ? '浅色' : '深色'}</strong>
                    <div className={actions}>
                        <Button appearance="primary">保存</Button>
                        <Button>取消</Button>
                        <Button appearance="text">帮助</Button>
                        <Button disabled>不可用</Button>
                    </div>
                </ConfigProvider>
            )))}
        </div>
    );
}
