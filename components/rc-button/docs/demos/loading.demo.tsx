export const meta = {
    title: '加载中',
    description: '对照五种按钮外观的加载状态。',
};

import { css } from '@crab-dev/css';
import token from '@crab-dev/rc-token-semantic';
import Button from '../../src/index.js';

const rowStyle = css`display: flex; flex-wrap: wrap; align-items: center; gap: ${token.space['section-gap']};`;

export default function Example() {
    return (
        <div className={rowStyle}>
            <Button loading appearance="elevated">Elevated</Button>
            <Button loading appearance="primary">Filled</Button>
            <Button loading appearance="tonal">Tonal</Button>
            <Button loading appearance="outlined">Outlined</Button>
            <Button loading appearance="text">Text</Button>
        </div>
    );
}
