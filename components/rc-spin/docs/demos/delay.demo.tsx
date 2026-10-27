export const meta = {
    title: '延迟显示',
    description: '打开开关模拟请求：150ms 的请求在 delay=300ms 内结束，1500ms 的请求才会显示加载指示器。',
};

import { css } from '@crab-dev/css';
import { useState } from 'react';
import Switch from '@crab-dev/rc-switch';
import { useTimeout } from '@crab-dev/rc-hooks';
import token from '@crab-dev/rc-token-semantic';
import Spin from '../../src/index.js';

const stackStyle = css`
    display: flex;
    flex-direction: column;
    gap: ${token.space['section-gap']};
    max-width: 420px;
`;
const panelStyle = css`
    display: flex;
    align-items: center;
    justify-content: center;
    min-height: 96px;
    background-color: ${token.color.background.surface};
    border-radius: ${token.radius.md};
    color: ${token.color.text.secondary};
    font-size: ${token.typography.body['font-size']};
`;

export default function DelayDemo() {
    const [fast, setFast] = useState(false);
    const [slow, setSlow] = useState(false);
    useTimeout(() => setFast(false), fast ? 150 : null);
    useTimeout(() => setSlow(false), slow ? 1500 : null);

    return <div className={stackStyle}>
        <Switch checked={fast} onCheckedChange={setFast}>秒回请求（150ms）</Switch>
        <Spin spinning={fast} delay={300}><div className={panelStyle}>请求在延迟窗口内完成，不显示指示器。</div></Spin>
        <Switch checked={slow} onCheckedChange={setSlow}>慢请求（1500ms）</Switch>
        <Spin spinning={slow} delay={300}><div className={panelStyle}>等待超过300ms时显示指示器。</div></Spin>
    </div>;
}
