export const meta = { title: '五种按钮外观', description: 'Elevated、Filled、Tonal、Outlined 与 Text。' };
import { useState } from 'react';
import { css } from '@crab-dev/css';
import token from '@crab-dev/rc-token-semantic';
import Button from '../../src/index.js';

const containerStyle = css`display: grid; gap: ${token.space['section-gap']}; min-width: 0;`;
const noteStyle = css`margin: 0; color: ${token.color.text.secondary}; font-size: ${token.typography.body.medium['font-size']}; line-height: ${token.typography.body.medium['line-height']};`;
const actionsStyle = css`display: flex; flex-wrap: wrap; align-items: center; gap: ${token.space['section-gap']};`;

export default function Example() {
    const [message, setMessage] = useState('选择一种外观，查看它的使用场景。');
    return (
        <section className={containerStyle} aria-label="五种 Material 按钮">
            <div className={actionsStyle}>
                <Button appearance="elevated" onClick={() => setMessage('Elevated：用浅色表面与阴影，让操作从背景中浮起。')}>Elevated</Button>
                <Button appearance="primary" onClick={() => setMessage('Filled：用于保存、提交等主要操作；API 保留 primary 名称。')}>Filled</Button>
                <Button appearance="tonal" onClick={() => setMessage('Tonal：浅色填充，用于需要适度强调的次级操作。')}>Tonal</Button>
                <Button appearance="outlined" onClick={() => setMessage('Outlined：默认普通按钮，适合取消、返回等操作。')}>Outlined</Button>
                <Button appearance="text" onClick={() => setMessage('Text：用于说明、展开等低强调操作。')}>Text</Button>
            </div>
            <output className={noteStyle} aria-live="polite">{message}</output>
        </section>
    );
}
