export const meta = {
    title: "竖向分割线",
    description: "direction=vertical 用于行内切分: 按钮组、状态栏、面包屑。高度跟随当前字号。",
};

import { css } from '@crab-dev/css';
import Button from '@crab-dev/rc-button';
import token from '@crab-dev/rc-token-semantic';
import { useState } from 'react';
import Divider from '../../src/index.js';

const rowStyle = css`
    display: flex;
    align-items: center;
`;

const linkRowStyle = css`
    display: flex;
    align-items: center;
    flex-wrap: wrap;
    margin-top: ${token.space['stack-gap']};
    color: ${token.color.text.secondary};
    font-size: ${token.font.size.body};
`;

const statusStyle = css`
    margin: ${token.space['stack-gap']} 0 0;
    color: ${token.color.text.secondary};
    font-size: ${token.font.size.caption};
`;

const VerticalDemo = () => {
    const [status, setStatus] = useState('选择操作以查看反馈。');

    return (
        <div>
            <div className={rowStyle}>
                <Button appearance="text" onClick={() => setStatus('已选择「编辑」操作。')}>编辑</Button>
                <Divider direction="vertical" spacing="small" />
                <Button appearance="text" onClick={() => setStatus('已选择「复制」操作。')}>复制</Button>
                <Divider direction="vertical" spacing="small" />
                <Button appearance="text" danger onClick={() => setStatus('已选择「删除」操作。')}>删除</Button>
            </div>

            <div className={linkRowStyle}>
                <span>已完成 12 项</span>
                <Divider direction="vertical" spacing="small" />
                <span>进行中 3 项</span>
                <Divider direction="vertical" spacing="small" />
                <span>失败 1 项</span>
            </div>
            <p className={statusStyle} role="status" aria-live="polite">{status}</p>
        </div>
    );
};

export default VerticalDemo;
