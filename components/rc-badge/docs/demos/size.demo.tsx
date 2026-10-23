export const meta = {
    title: "尺寸与偏移",
    description: "`size` 提供 default / small 两档尺寸；`offset` 可微调角标的定位。",
};

import { css } from "@crab-dev/css";
import { useState } from 'react';
import Button from '@crab-dev/rc-button';
import token from '@crab-dev/rc-token-semantic';
import Badge from "../../src/index.js";

const stackStyle = css`display: grid; gap: ${token.space['section-gap']};`;
const rowStyle = css`
    display: flex;
    align-items: center;
    gap: ${token.space['section-gap']};
    flex-wrap: wrap;
    padding: ${token.space['component-gap']};
`;
const statusStyle = css`margin: 0; color: ${token.color.text.secondary};`;

const SizeDemo = () => {
    const [message, setMessage] = useState('点击按钮查看对应提醒。');
    return (
        <div className={stackStyle}>
            <div className={rowStyle}>
                <Badge count={8} size="default">
                    <Button aria-label="默认尺寸，8 条提醒" onClick={() => setMessage('默认尺寸：8 条提醒。')}>默认</Button>
                </Badge>
                <Badge count={8} size="small">
                    <Button aria-label="小号尺寸，8 条提醒" onClick={() => setMessage('小号尺寸：8 条提醒。')}>小号</Button>
                </Badge>
                <Badge count={8} offset={[-6, 6]}>
                    <Button aria-label="自定义偏移，8 条提醒" onClick={() => setMessage('自定义偏移：8 条提醒。')}>偏移</Button>
                </Badge>
            </div>
            <p className={statusStyle} role="status">{message}</p>
        </div>
    );
};

export default SizeDemo;
