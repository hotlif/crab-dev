export const meta = {
    title: '禁用状态',
    description: '对照五种按钮外观的禁用状态。',
};

import { css } from '@crab-dev/css';
import token from '@crab-dev/rc-token-semantic';
import Button from '../../src/index.js';

const rowStyle = css`display: flex; flex-wrap: wrap; align-items: center; gap: ${token.space['section-gap']};`;

export default function Example() {
    return (
        <div className={rowStyle}>
            <Button disabled appearance="elevated">Elevated</Button>
            <Button disabled appearance="primary">Filled</Button>
            <Button disabled appearance="tonal">Tonal</Button>
            <Button disabled appearance="outlined">Outlined</Button>
            <Button disabled appearance="text">Text</Button>
        </div>
    );
}
