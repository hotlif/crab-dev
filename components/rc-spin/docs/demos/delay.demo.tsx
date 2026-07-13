/**
 * title = "延迟显示"
 * description = "秒回的请求不该闪一下转圈。delay 内完成的操作全程无指示器; 超出才说明它确实耗时, 此时才给反馈。"
 */

import { css } from '@linaria/core';
import { useState } from 'react';
import Button from '@crab-dev/rc-button';
import Spin from '../../src/index.js';

const stackStyle = css`
    display: flex;
    flex-direction: column;
    gap: 16px;
    max-width: 420px;
`;

const rowStyle = css`
    display: flex;
    gap: 12px;
`;

const panelStyle = css`
    display: flex;
    align-items: center;
    justify-content: center;
    min-height: 96px;
    border: 1px dashed oklch(0.9 0.004 286);
    border-radius: 8px;
    color: oklch(0.44 0.01 286);
    font-size: 14px;
`;

const DelayDemo = () => {
    const [spinning, setSpinning] = useState(false);

    // 模拟一次请求：duration 决定它是「秒回」还是「真的慢」
    const request = (duration: number) => {
        setSpinning(true);
        setTimeout(() => setSpinning(false), duration);
    };

    return (
        <div className={stackStyle}>
            <div className={rowStyle}>
                <Button onClick={() => request(150)}>秒回请求（150ms）</Button>
                <Button onClick={() => request(1500)}>慢请求（1500ms）</Button>
            </div>

            {/* delay=300：150ms 的请求全程不闪 spinner, 1500ms 的请求在 300ms 后才给出反馈 */}
            <Spin spinning={spinning} delay={300}>
                <div className={panelStyle}>
                    秒回请求不会闪出转圈; 慢请求才会。
                </div>
            </Spin>
        </div>
    );
};

export default DelayDemo;
